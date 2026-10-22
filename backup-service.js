(function attachTimerHubBackup(root) {
    'use strict';

    const CONFIG_DB = 'TimerHubBackupConfig';
    const CONFIG_STORE = 'config';
    const MANIFEST_NAME = 'timerhub_backup_manifest.json';
    const AUTOMATIC_PREFIX = 'timerhub_auto_backup_';
    const MANUAL_PREFIX = 'timerhub_manual_backup_';
    const PROBE_PREFIX = 'timerhub_write_test_';
    const TEMP_SUFFIX = '.partial';
    const MANIFEST_FORMAT = 'timerhub-backup-manifest';
    const MANIFEST_VERSION = 1;
    const BACKUP_FORMAT = 'timerhub-backup';
    const BACKUP_VERSION = 1;
    const DEFAULT_RETENTION = 20;
    const LEGACY_MANUAL_PATTERN = /^timerhub_(?:backup|sicherung)_\d{8}_\d{6}\.json$/;
    const LEGACY_MANUAL_CYRILLIC_PATTERN = /^timerhub-копия_\d{8}_\d{6}\.json$/;
    const MANAGED_STAMP_PATTERN = /_(\d{8})_(\d{6})(?:_[a-z0-9]+)?\.json$/;

    function clampRetention(value) {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? Math.max(1, Math.min(100, Math.floor(parsed))) : DEFAULT_RETENTION;
    }

    function safeErrorCode(error) {
        if (!error) return 'unknown_error';
        if (typeof error === 'string') return error;
        if (typeof error.code === 'string' && error.code) return error.code;
        if (typeof error.name === 'string' && error.name && error.name !== 'Error') return error.name;
        return 'operation_failed';
    }

    class TimerHubBackupError extends Error {
        constructor(code, details = null) {
            super(code);
            this.name = 'TimerHubBackupError';
            this.code = code;
            this.details = details;
        }
    }

    class TimerHubBackupService {
        constructor({
            indexedDB: indexedDbRef = root.indexedDB,
            crypto: cryptoRef = root.crypto,
            picker = typeof root.showDirectoryPicker === 'function'
                ? root.showDirectoryPicker.bind(root)
                : null,
            getSnapshot,
            validateSnapshot,
            diagnostics = null,
            now = () => Date.now(),
            randomId = null,
            retention = DEFAULT_RETENTION,
            storageManager = root.navigator?.storage || null
        } = {}) {
            this.indexedDB = indexedDbRef;
            this.crypto = cryptoRef;
            this.picker = picker;
            this.getSnapshot = getSnapshot;
            this.validateSnapshot = validateSnapshot;
            this.diagnostics = diagnostics;
            this.now = now;
            this.randomId = randomId || (() => {
                try {
                    const bytes = new Uint8Array(8);
                    this.crypto?.getRandomValues?.(bytes);
                    return [...bytes].map(value => value.toString(16).padStart(2, '0')).join('');
                } catch {
                    return Math.random().toString(36).slice(2, 14);
                }
            });
            this.retention = clampRetention(retention);
            this.storageManager = storageManager;
            this.directoryHandle = null;
            this.directoryName = '';
            this.state = 'uninitialized';
            this.lastError = null;
            this.lastVerifiedAt = 0;
            this.lastVerifiedName = '';
            this.lastBackupRevision = null;
            this.metadataDb = null;
            this.metadataDbPromise = null;
            this.manifestCache = null;
            this.latestVerifiedCache = null;
            this.capabilities = {
                directoryPicker: typeof this.picker === 'function',
                fileSystemAccess: typeof this.picker === 'function',
                persistentStorage: Boolean(this.storageManager?.persist)
            };
        }

        report(level, operation, error, options = {}) {
            try {
                const method = level === 'warn' ? 'warn' : level === 'info' ? 'info' : 'error';
                this.diagnostics?.[method]?.('backup', operation, error, options);
            } catch {
                // Diagnostics must never break backups.
            }
        }

        getStatus() {
            return {
                state: this.state,
                directoryName: this.directoryName,
                lastVerifiedAt: this.lastVerifiedAt,
                lastVerifiedName: this.lastVerifiedName,
                lastError: this.lastError,
                retention: this.retention,
                capabilities: { ...this.capabilities }
            };
        }

        openMetadataDb() {
            if (this.metadataDb) return Promise.resolve(this.metadataDb);
            if (this.metadataDbPromise) return this.metadataDbPromise;
            if (!this.indexedDB?.open) {
                return Promise.reject(new TimerHubBackupError('metadata_storage_unavailable'));
            }
            this.metadataDbPromise = new Promise((resolve, reject) => {
                let request;
                try {
                    request = this.indexedDB.open(CONFIG_DB, 1);
                } catch (error) {
                    reject(error);
                    return;
                }
                request.onupgradeneeded = () => {
                    const db = request.result;
                    if (!db.objectStoreNames.contains(CONFIG_STORE)) {
                        db.createObjectStore(CONFIG_STORE, { keyPath: 'key' });
                    }
                };
                request.onsuccess = () => {
                    const db = request.result;
                    try {
                        db.onversionchange = () => db.close();
                    } catch {
                        // ignore
                    }
                    this.metadataDb = db;
                    resolve(db);
                };
                request.onerror = () => reject(request.error || new TimerHubBackupError('metadata_storage_failed'));
                request.onblocked = () => reject(new TimerHubBackupError('metadata_storage_blocked'));
            }).catch(error => {
                this.metadataDbPromise = null;
                throw error;
            });
            return this.metadataDbPromise;
        }

        async readConfig(key) {
            const db = await this.openMetadataDb();
            return new Promise((resolve, reject) => {
                const tx = db.transaction([CONFIG_STORE], 'readonly');
                const request = tx.objectStore(CONFIG_STORE).get(key);
                request.onsuccess = () => resolve(request.result?.value ?? null);
                request.onerror = () => reject(request.error || new TimerHubBackupError('metadata_read_failed'));
            });
        }

        async writeConfig(key, value) {
            const db = await this.openMetadataDb();
            return new Promise((resolve, reject) => {
                const tx = db.transaction([CONFIG_STORE], 'readwrite');
                tx.objectStore(CONFIG_STORE).put({ key, value });
                tx.oncomplete = () => resolve(true);
                tx.onerror = () => reject(tx.error || new TimerHubBackupError('metadata_write_failed'));
                tx.onabort = () => reject(tx.error || new TimerHubBackupError('metadata_write_aborted'));
            });
        }

        async init() {
            this.capabilities.directoryPicker = typeof this.picker === 'function';
            this.capabilities.fileSystemAccess = this.capabilities.directoryPicker;
            if (!this.capabilities.directoryPicker) {
                this.state = 'unsupported';
                this.lastError = 'directory_picker_unsupported';
                return this.getStatus();
            }
            try {
                const handle = await this.readConfig('directoryHandle');
                const lastVerified = await this.readConfig('lastVerified');
                if (lastVerified && Number.isFinite(Number(lastVerified.at))) {
                    this.lastVerifiedAt = Number(lastVerified.at);
                    this.lastVerifiedName = typeof lastVerified.name === 'string' ? lastVerified.name : '';
                }
                if (!handle || handle.kind !== 'directory') {
                    this.state = 'needs-selection';
                    return this.getStatus();
                }
                this.directoryHandle = handle;
                this.directoryName = typeof handle.name === 'string' ? handle.name : '';
                const permission = await this.queryPermission(handle);
                if (permission !== 'granted') {
                    this.state = 'permission-denied';
                    this.lastError = `permission_${permission || 'unknown'}`;
                    return this.getStatus();
                }
                this.state = 'ready';
                this.lastError = null;
                return this.getStatus();
            } catch (error) {
                this.state = 'error';
                this.lastError = safeErrorCode(error);
                this.report('error', 'init', error, { status: 'failed' });
                return this.getStatus();
            }
        }

        async queryPermission(handle = this.directoryHandle) {
            if (!handle) return 'denied';
            try {
                if (typeof handle.queryPermission !== 'function') return 'granted';
                return await handle.queryPermission({ mode: 'readwrite' });
            } catch (error) {
                this.report('warn', 'query-permission', error, { status: 'unknown' });
                return 'unknown';
            }
        }

        async requestPermission(handle = this.directoryHandle) {
            if (!handle) return 'denied';
            try {
                if (typeof handle.requestPermission !== 'function') return 'granted';
                return await handle.requestPermission({ mode: 'readwrite' });
            } catch (error) {
                this.report('warn', 'request-permission', error, { status: 'failed' });
                return 'denied';
            }
        }

        async ensureReady({ request = false } = {}) {
            if (!this.directoryHandle) throw new TimerHubBackupError('backup_directory_missing');
            let permission = await this.queryPermission();
            if (permission !== 'granted' && request) {
                permission = await this.requestPermission();
            }
            if (permission !== 'granted') {
                this.state = 'permission-denied';
                this.lastError = `permission_${permission || 'unknown'}`;
                throw new TimerHubBackupError('backup_permission_denied');
            }
            this.state = 'ready';
            return this.directoryHandle;
        }

        async selectDirectory() {
            if (typeof this.picker !== 'function') {
                throw new TimerHubBackupError('directory_picker_unsupported');
            }
            const previousHandle = this.directoryHandle;
            const previousName = this.directoryName;
            const previousState = this.state;
            try {
                const handle = await this.picker({ id: 'timerhub-backup', mode: 'readwrite' });
                if (!handle || handle.kind !== 'directory') throw new TimerHubBackupError('invalid_directory');
                await this.adoptDirectory(handle);
                return this.getStatus();
            } catch (error) {
                this.directoryHandle = previousHandle;
                this.directoryName = previousName;
                this.state = previousHandle ? previousState : 'needs-selection';
                if (error?.name === 'AbortError') {
                    this.lastError = 'directory_selection_cancelled';
                    throw new TimerHubBackupError('directory_selection_cancelled');
                }
                this.lastError = safeErrorCode(error);
                this.report('error', 'select-directory', error, { status: 'failed' });
                throw error instanceof TimerHubBackupError ? error : new TimerHubBackupError(safeErrorCode(error));
            }
        }

        async adoptDirectory(handle) {
            const permission = await this.requestPermission(handle);
            if (permission !== 'granted') {
                throw new TimerHubBackupError('backup_permission_denied');
            }
            this.directoryHandle = handle;
            this.directoryName = typeof handle.name === 'string' ? handle.name : '';
            this.state = 'ready';
            this.lastError = null;
            this.latestVerifiedCache = null;
            await this.verifyWritable();
            try {
                await this.writeConfig('directoryHandle', handle);
            } catch (error) {
                this.state = 'error';
                this.lastError = 'directory_handle_not_saved';
                this.report('error', 'save-directory-handle', error, { status: 'failed' });
                throw new TimerHubBackupError('directory_handle_not_saved');
            }
            this.report('info', 'select-directory', 'directory_ready', {
                status: 'succeeded',
                details: { directoryName: this.directoryName }
            });
            return true;
        }

        async reauthorize() {
            if (!this.directoryHandle) {
                try {
                    const handle = await this.readConfig('directoryHandle');
                    if (handle?.kind === 'directory') this.directoryHandle = handle;
                } catch {
                    // ignore
                }
            }
            if (!this.directoryHandle) throw new TimerHubBackupError('backup_directory_missing');
            const permission = await this.requestPermission();
            if (permission !== 'granted') {
                this.state = 'permission-denied';
                throw new TimerHubBackupError('backup_permission_denied');
            }
            this.state = 'ready';
            await this.verifyWritable();
            this.lastError = null;
            return this.getStatus();
        }

        async verifyWritable() {
            const directory = await this.ensureReady();
            const name = `${PROBE_PREFIX}${this.now().toString(36)}_${this.randomId()}${TEMP_SUFFIX}`;
            const text = JSON.stringify({
                format: 'timerhub-backup-probe',
                version: 1,
                createdAt: this.now(),
                nonce: this.randomId()
            });
            let created = false;
            try {
                await this.writeTextFile(directory, name, text);
                created = true;
                const readBack = await this.readTextFile(directory, name);
                if (readBack !== text) throw new TimerHubBackupError('write_verification_failed');
            } finally {
                if (created) {
                    try { await directory.removeEntry(name); } catch { /* harmless probe remains */ }
                }
            }
            return true;
        }

        async writeTextFile(directory, name, text) {
            const fileHandle = await directory.getFileHandle(name, { create: true });
            if (typeof fileHandle.createWritable !== 'function') {
                throw new TimerHubBackupError('writable_file_unsupported');
            }
            const writable = await fileHandle.createWritable();
            try {
                await writable.write(text);
                await writable.close();
            } catch (error) {
                try { await writable.abort?.(); } catch { /* ignore */ }
                throw error;
            }
            return fileHandle;
        }

        async readTextFile(directory, name) {
            const fileHandle = await directory.getFileHandle(name);
            const file = await fileHandle.getFile();
            return file.text();
        }

        backupName(kind) {
            const date = new Date(this.now());
            const stamp = [
                date.getUTCFullYear().toString().padStart(4, '0'),
                (date.getUTCMonth() + 1).toString().padStart(2, '0'),
                date.getUTCDate().toString().padStart(2, '0')
            ].join('') + '_' + [
                date.getUTCHours().toString().padStart(2, '0'),
                date.getUTCMinutes().toString().padStart(2, '0'),
                date.getUTCSeconds().toString().padStart(2, '0')
            ].join('');
            const prefix = kind === 'automatic' ? AUTOMATIC_PREFIX : MANUAL_PREFIX;
            return `${prefix}${stamp}_${this.randomId()}.json`;
        }

        classifyName(name) {
            if (typeof name !== 'string') return null;
            if (name === MANIFEST_NAME) return 'manifest';
            if (name.startsWith(PROBE_PREFIX)) return 'probe';
            if (name.endsWith(TEMP_SUFFIX)) return 'temporary';
            if (name.startsWith(AUTOMATIC_PREFIX) && name.endsWith('.json')) return 'automatic';
            if (name.startsWith(MANUAL_PREFIX) && name.endsWith('.json')) return 'manual';
            if (LEGACY_MANUAL_PATTERN.test(name) || LEGACY_MANUAL_CYRILLIC_PATTERN.test(name)) return 'manual';
            return null;
        }

        timestampFromName(name) {
            const match = MANAGED_STAMP_PATTERN.exec(name || '');
            if (!match) return 0;
            const [, datePart, timePart] = match;
            const year = Number(datePart.slice(0, 4));
            const month = Number(datePart.slice(4, 6));
            const day = Number(datePart.slice(6, 8));
            const hour = Number(timePart.slice(0, 2));
            const minute = Number(timePart.slice(2, 4));
            const second = Number(timePart.slice(4, 6));
            return Date.UTC(year, month - 1, day, hour, minute, second);
        }

        async listDirectoryNames(directory = null) {
            const dir = directory || await this.ensureReady();
            const names = [];
            try {
                if (typeof dir.entries === 'function') {
                    for await (const [name] of dir.entries()) names.push(name);
                } else if (typeof dir.values === 'function') {
                    for await (const handle of dir.values()) names.push(handle?.name);
                } else if (typeof dir.keys === 'function') {
                    for await (const name of dir.keys()) names.push(name);
                }
            } catch (error) {
                this.report('error', 'list-directory', error, { status: 'failed' });
                throw new TimerHubBackupError('directory_list_failed');
            }
            return names.filter(Boolean);
        }

        async loadManifest() {
            if (this.manifestCache) return this.manifestCache;
            try {
                const directory = await this.ensureReady();
                const text = await this.readTextFile(directory, MANIFEST_NAME);
                const parsed = JSON.parse(text);
                if (!parsed || parsed.format !== MANIFEST_FORMAT || parsed.version !== MANIFEST_VERSION ||
                    !Array.isArray(parsed.backups)) {
                    throw new TimerHubBackupError('manifest_invalid');
                }
                this.manifestCache = parsed;
                return parsed;
            } catch (error) {
                if (safeErrorCode(error) !== 'NotFoundError') {
                    this.report('warn', 'read-manifest', error, { status: 'failed' });
                }
                this.manifestCache = null;
                return null;
            }
        }

        async updateManifest(entry, { removeName = null } = {}) {
            try {
                const directory = await this.ensureReady();
                const existing = await this.loadManifest();
                const backups = Array.isArray(existing?.backups) ? existing.backups.slice() : [];
                const next = backups.filter(item => item?.name !== removeName && item?.name !== entry?.name);
                if (entry) {
                    next.push({
                        name: entry.name,
                        kind: entry.kind,
                        createdAt: entry.createdAt,
                        size: entry.size,
                        checksum: entry.checksum,
                        algorithm: entry.algorithm,
                        verifiedAt: entry.verifiedAt,
                        counts: entry.counts || null
                    });
                }
                next.sort((a, b) => (Number(b.createdAt) || 0) - (Number(a.createdAt) || 0));
                const manifest = {
                    format: MANIFEST_FORMAT,
                    version: MANIFEST_VERSION,
                    updatedAt: this.now(),
                    backups: next.slice(0, 200)
                };
                const text = JSON.stringify(manifest);
                const tempName = `${MANIFEST_NAME}.${this.randomId()}${TEMP_SUFFIX}`;
                await this.writeTextFile(directory, tempName, text);
                try {
                    await this.writeTextFile(directory, MANIFEST_NAME, text);
                } finally {
                    try { await directory.removeEntry(tempName); } catch { /* ignore */ }
                }
                this.manifestCache = manifest;
                return true;
            } catch (error) {
                this.report('warn', 'write-manifest', error, { status: 'failed' });
                this.manifestCache = null;
                return false;
            }
        }

        async checksumText(text) {
            if (this.crypto?.subtle && typeof TextEncoder !== 'undefined') {
                const digest = await this.crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
                return {
                    algorithm: 'SHA-256',
                    checksum: [...new Uint8Array(digest)].map(value => value.toString(16).padStart(2, '0')).join('')
                };
            }
            let hash = 0x811c9dc5;
            for (let index = 0; index < text.length; index += 1) {
                hash ^= text.charCodeAt(index);
                hash = Math.imul(hash, 0x01000193) >>> 0;
            }
            return { algorithm: 'fnv1a32', checksum: hash.toString(16).padStart(8, '0') };
        }

        async validateIntegrity(data, integrity) {
            if (!integrity || typeof integrity !== 'object') return { verified: false, reason: 'missing_integrity' };
            const algorithm = String(integrity.algorithm || '');
            const expected = String(integrity.checksum || '');
            if (!['SHA-256', 'fnv1a32'].includes(algorithm) || !/^[a-f0-9]{8,64}$/i.test(expected)) {
                return { verified: false, reason: 'invalid_integrity' };
            }
            const { integrity: ignored, ...rest } = data;
            const serialized = JSON.stringify(rest);
            const actual = await this.checksumText(serialized);
            if (actual.algorithm !== algorithm || actual.checksum.toLowerCase() !== expected.toLowerCase()) {
                return { verified: false, reason: 'checksum_mismatch' };
            }
            return { verified: true };
        }

        async parseBackupText(text, name = '') {
            let data;
            try {
                data = JSON.parse(text);
            } catch {
                throw new TimerHubBackupError('backup_invalid_json');
            }
            if (!data || typeof data !== 'object' || Array.isArray(data) ||
                data.format !== BACKUP_FORMAT || data.version !== BACKUP_VERSION) {
                throw new TimerHubBackupError('backup_invalid_format');
            }
            try {
                this.validateSnapshot?.(data);
            } catch {
                throw new TimerHubBackupError('backup_invalid_schema');
            }
            const integrity = data.integrity && typeof data.integrity === 'object'
                ? await this.validateIntegrity(data, data.integrity)
                : { verified: false, reason: 'missing_integrity' };
            const meta = data.backupMeta && typeof data.backupMeta === 'object' ? data.backupMeta : null;
            const kind = meta?.kind === 'automatic' ? 'automatic'
                : meta?.kind === 'manual' || meta?.kind === 'pre-restore' ? 'manual'
                : this.classifyName(name) === 'automatic' ? 'automatic'
                : 'manual';
            return {
                data,
                meta,
                name,
                kind,
                createdAt: Number(meta?.createdAt) || this.timestampFromName(name) || 0,
                integrity,
                verified: integrity.verified === true
            };
        }

        async createBackup({ kind = 'automatic', reason = '', force = false, revision = null, retention = null } = {}) {
            const backupKind = kind === 'automatic' ? 'automatic' : 'manual';
            if (!force && backupKind === 'automatic' && revision !== null && revision === this.lastBackupRevision) {
                return { skipped: true, reason: 'no_changes' };
            }
            let directory;
            let tempName = '';
            let finalName = '';
            let finalCreated = false;
            try {
                directory = await this.ensureReady();
                const snapshot = await this.getSnapshot();
                if (!snapshot || typeof snapshot !== 'object' || Array.isArray(snapshot)) {
                    throw new TimerHubBackupError('snapshot_unavailable');
                }
                this.validateSnapshot?.(snapshot);
                const createdAt = this.now();
                const backupId = `backup_${createdAt.toString(36)}_${this.randomId()}`;
                const payload = {
                    ...snapshot,
                    backupMeta: {
                        id: backupId,
                        kind: kind === 'automatic' ? 'automatic' : kind === 'pre-restore' ? 'pre-restore' : 'manual',
                        createdAt,
                        reason: typeof reason === 'string' ? reason.slice(0, 120) : '',
                        schemaVersion: BACKUP_VERSION,
                        dataRevision: revision,
                        counts: {
                            activities: Array.isArray(snapshot.activities) ? snapshot.activities.length : 0,
                            timeEntries: Array.isArray(snapshot.timeEntries) ? snapshot.timeEntries.length : 0,
                            groups: Array.isArray(snapshot.groups) ? snapshot.groups.length : 0
                        }
                    }
                };
                const checksum = await this.checksumText(JSON.stringify(payload));
                payload.integrity = checksum;
                const serialized = JSON.stringify(payload);

                // File System Access does not guarantee atomic renames on every
                // platform. A unique final name plus read-back checksum
                // verification means a crash can leave an ignorable partial file
                // but can never make an unvalidated file the newest backup.
                finalName = this.backupName(backupKind);
                tempName = `${finalName}${TEMP_SUFFIX}`;

                await this.writeTextFile(directory, tempName, serialized);
                const tempText = await this.readTextFile(directory, tempName);
                await this.parseBackupText(tempText, finalName);

                await this.writeTextFile(directory, finalName, serialized);
                finalCreated = true;
                const finalText = await this.readTextFile(directory, finalName);
                const parsed = await this.parseBackupText(finalText, finalName);
                if (!parsed.verified) throw new TimerHubBackupError('backup_verification_failed');

                try { await directory.removeEntry(tempName); } catch { /* ignored */ }
                tempName = '';

                const entry = {
                    name: finalName,
                    kind: backupKind,
                    createdAt,
                    size: finalText.length,
                    checksum: checksum.checksum,
                    algorithm: checksum.algorithm,
                    verifiedAt: this.now(),
                    counts: payload.backupMeta.counts
                };
                await this.updateManifest(entry);
                this.lastBackupRevision = revision;
                this.lastVerifiedAt = createdAt;
                this.lastVerifiedName = finalName;
                this.latestVerifiedCache = { ...entry, verified: true };
                this.state = 'ready';
                this.lastError = null;
                try {
                    await this.writeConfig('lastVerified', { at: createdAt, name: finalName });
                } catch {
                    // File discovery does not depend on metadata storage.
                }
                try {
                    await this.pruneAutomatic(retention ?? this.retention);
                } catch (error) {
                    this.report('warn', 'prune-retention', error, { status: 'failed' });
                }
                this.report('info', 'create-backup', 'backup_verified', {
                    status: 'succeeded',
                    details: { kind: backupKind, name: finalName, size: entry.size, algorithm: checksum.algorithm }
                });
                return { ...entry, skipped: false };
            } catch (error) {
                if (finalCreated && finalName) {
                    try { await directory?.removeEntry?.(finalName); } catch { /* keep previous backups */ }
                }
                if (tempName) {
                    try { await directory?.removeEntry?.(tempName); } catch { /* ignore */ }
                }
                this.state = this.directoryHandle ? 'error' : 'needs-selection';
                const messageCode = typeof error?.message === 'string' && /^[a-z0-9_]+$/i.test(error.message)
                    ? error.message
                    : '';
                this.lastError = messageCode || safeErrorCode(error);
                this.report('error', 'create-backup', error, { status: 'failed', details: { kind: backupKind, reason } });
                throw error instanceof TimerHubBackupError
                    ? error
                    : new TimerHubBackupError(this.lastError);
            }
        }

        async listBackups({ verify = false } = {}) {
            const directory = await this.ensureReady();
            const manifest = await this.loadManifest();
            const manifestByName = new Map((manifest?.backups || [])
                .filter(entry => entry && typeof entry.name === 'string')
                .map(entry => [entry.name, entry]));
            const names = await this.listDirectoryNames(directory);
            const candidates = names
                .map(name => ({ name, kind: this.classifyName(name) }))
                .filter(item => item.kind === 'automatic' || item.kind === 'manual');
            const entries = [];
            for (const candidate of candidates) {
                const known = manifestByName.get(candidate.name);
                let size = Number(known?.size) || 0;
                let createdAt = Number(known?.createdAt) || this.timestampFromName(candidate.name);
                if (!size) {
                    try {
                        const handle = await directory.getFileHandle(candidate.name);
                        const file = await handle.getFile();
                        size = file.size;
                        createdAt = createdAt || file.lastModified || 0;
                    } catch {
                        continue;
                    }
                }
                const entry = {
                    name: candidate.name,
                    kind: candidate.kind,
                    createdAt,
                    size,
                    verified: Boolean(known?.checksum),
                    checksum: known?.checksum || '',
                    algorithm: known?.algorithm || ''
                };
                if (verify) {
                    try {
                        const text = await this.readTextFile(directory, candidate.name);
                        const parsed = await this.parseBackupText(text, candidate.name);
                        entry.verified = parsed.verified;
                        entry.createdAt = parsed.createdAt || createdAt;
                        entry.meta = parsed.meta;
                    } catch {
                        entry.verified = false;
                        entry.invalid = true;
                    }
                }
                entries.push(entry);
            }
            entries.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0) || b.name.localeCompare(a.name));
            return entries;
        }

        async findLatestVerified({ kind = null, limit = 20 } = {}) {
            let directory;
            try {
                directory = await this.ensureReady();
            } catch (error) {
                if (error?.code === 'backup_permission_denied' &&
                    (this.latestVerifiedCache || this.lastVerifiedName)) {
                    return this.latestVerifiedCache || {
                        name: this.lastVerifiedName,
                        createdAt: this.lastVerifiedAt,
                        kind: kind || 'automatic',
                        verified: true,
                        cached: true
                    };
                }
                throw error;
            }
            const entries = await this.listBackups({ verify: false });
            const candidates = entries
                .filter(entry => !kind || entry.kind === kind)
                .slice(0, Math.max(1, Math.min(50, limit)));
            for (const candidate of candidates) {
                try {
                    const text = await this.readTextFile(directory, candidate.name);
                    const parsed = await this.parseBackupText(text, candidate.name);
                    if (!parsed.verified) continue;
                    const result = {
                        ...candidate,
                        createdAt: parsed.createdAt || candidate.createdAt,
                        verified: true,
                        meta: parsed.meta
                    };
                    if (!kind || result.kind === kind) {
                        this.latestVerifiedCache = result;
                        return result;
                    }
                } catch (error) {
                    this.report('warn', 'verify-latest', error, { status: 'failed', details: { name: candidate.name } });
                }
            }
            return null;
        }

        async readBackup(name) {
            if (!this.classifyName(name) || this.classifyName(name) === 'temporary' || this.classifyName(name) === 'probe') {
                throw new TimerHubBackupError('backup_invalid_name');
            }
            const directory = await this.ensureReady();
            const text = await this.readTextFile(directory, name);
            const parsed = await this.parseBackupText(text, name);
            if (parsed.data?.integrity && parsed.verified !== true) {
                throw new TimerHubBackupError(parsed.integrity?.reason || 'backup_checksum_mismatch');
            }
            return parsed;
        }

        async pruneAutomatic(retention = this.retention) {
            const keep = clampRetention(retention);
            const directory = await this.ensureReady();
            const entries = await this.listBackups({ verify: false });
            const automatic = entries.filter(entry => entry.kind === 'automatic');
            if (automatic.length <= keep) return { removed: 0, kept: automatic.length };

            // Find the newest positively verified automatic backup first. If a
            // newer corrupt or partial file exists, the latest verified file is
            // still retained no matter which count the retention policy uses.
            let latestVerified = null;
            for (const candidate of automatic) {
                try {
                    const text = await this.readTextFile(directory, candidate.name);
                    const parsed = await this.parseBackupText(text, candidate.name);
                    if (parsed.verified && parsed.kind === 'automatic' && parsed.meta?.kind === 'automatic') {
                        latestVerified = candidate;
                        break;
                    }
                } catch (error) {
                    this.report('warn', 'prune-skip-invalid', error, {
                        status: 'rolled_back',
                        details: { name: candidate.name }
                    });
                }
            }
            if (!latestVerified) {
                return { removed: 0, kept: automatic.length, reason: 'no_verified_backup' };
            }

            // Only verify files that are actually about to be deleted. Files
            // that remain in place are not read again during every backup.
            let removed = 0;
            for (const candidate of automatic.slice(keep)) {
                if (candidate.name === latestVerified.name) continue;
                try {
                    const text = await this.readTextFile(directory, candidate.name);
                    const parsed = await this.parseBackupText(text, candidate.name);
                    if (!parsed.verified || parsed.kind !== 'automatic' || parsed.meta?.kind !== 'automatic') {
                        this.report('warn', 'prune-skip-unverified', 'backup_not_owned', {
                            status: 'rolled_back',
                            details: { name: candidate.name }
                        });
                        continue;
                    }
                    await directory.removeEntry(candidate.name);
                    removed += 1;
                    await this.updateManifest(null, { removeName: candidate.name });
                } catch (error) {
                    this.report('warn', 'prune-remove', error, { status: 'failed', details: { name: candidate.name } });
                }
            }
            return { removed, kept: automatic.length - removed };
        }

        async cleanupOwnTemporaryFiles({ olderThanMs = 24 * 60 * 60 * 1000 } = {}) {
            try {
                const directory = await this.ensureReady();
                const names = await this.listDirectoryNames(directory);
                const cutoff = this.now() - Math.max(60 * 1000, Number(olderThanMs) || 0);
                let removed = 0;
                for (const name of names) {
                    if (!name.endsWith(TEMP_SUFFIX) || !name.startsWith(PROBE_PREFIX) && !name.startsWith(AUTOMATIC_PREFIX) && !name.startsWith(MANUAL_PREFIX) && name !== MANIFEST_NAME && !name.startsWith(`${MANIFEST_NAME}.`)) {
                        continue;
                    }
                    try {
                        const handle = await directory.getFileHandle(name);
                        const file = await handle.getFile();
                        if (Number(file.lastModified) >= cutoff) continue;
                        await directory.removeEntry(name);
                        removed += 1;
                    } catch {
                        // Never fail startup because a temporary file cannot be cleaned.
                    }
                }
                return removed;
            } catch {
                return 0;
            }
        }
    }

    TimerHubBackupService.DEFAULT_RETENTION = DEFAULT_RETENTION;
    TimerHubBackupService.MANIFEST_NAME = MANIFEST_NAME;
    TimerHubBackupService.AUTOMATIC_PREFIX = AUTOMATIC_PREFIX;
    TimerHubBackupService.MANUAL_PREFIX = MANUAL_PREFIX;
    TimerHubBackupService.TEMP_SUFFIX = TEMP_SUFFIX;
    TimerHubBackupService.TimerHubBackupError = TimerHubBackupError;
    root.TimerHubBackupService = TimerHubBackupService;
    root.TimerHubBackupError = TimerHubBackupError;
})(globalThis);
