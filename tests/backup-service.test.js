import assert from 'node:assert/strict';
import { webcrypto } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

const backupSource = await readFile(new URL('../backup-service.js', import.meta.url), 'utf8');
const diagnosticsSource = await readFile(new URL('../diagnostics.js', import.meta.url), 'utf8');

function makeMetadataIndexedDb(options = {}) {
    const values = new Map();
    const state = { failNextOpen: Boolean(options.failNextOpen), failNextGet: Boolean(options.failNextGet) };
    const db = {
        objectStoreNames: { contains: () => false },
        createObjectStore() {},
        close() {},
        transaction() {
            const tx = {};
            tx.objectStore = () => ({
                get(key) {
                    const request = {};
                    queueMicrotask(() => {
                        if (state.failNextGet) {
                            state.failNextGet = false;
                            request.error = new Error('transient_read_failure');
                            request.onerror?.();
                            return;
                        }
                        const record = values.get(key);
                        request.result = record;
                        request.onsuccess?.();
                    });
                    return request;
                },
                put(record) {
                    queueMicrotask(() => {
                        values.set(record.key, record);
                        tx.oncomplete?.();
                    });
                },
                delete(key) {
                    queueMicrotask(() => {
                        values.delete(key);
                        tx.oncomplete?.();
                    });
                }
            });
            return tx;
        }
    };
    return {
        _values: values,
        state,
        open() {
            const request = {};
            queueMicrotask(() => {
                if (state.failNextOpen) {
                    state.failNextOpen = false;
                    request.error = new Error('transient_open_failure');
                    request.onerror?.();
                    return;
                }
                try {
                    request.result = db;
                    request.onupgradeneeded?.({ target: { result: db } });
                    request.onsuccess?.();
                } catch (error) {
                    request.error = error;
                    request.onerror?.();
                }
            });
            return request;
        }
    };
}

function makeDirectory(name = 'TimerHub backups') {
    const files = new Map();
    const state = {
        permission: 'granted',
        requestPermission: 'granted',
        failWrite: false,
        failClose: false,
        failWriteOnce: false
    };
    const now = () => Date.now();
    const handle = {
        kind: 'directory',
        name,
        async queryPermission() { return state.permission; },
        async requestPermission() { state.permission = state.requestPermission; return state.permission; },
        async removeEntry(fileName) { files.delete(fileName); },
        async getFileHandle(fileName, { create = false } = {}) {
            if (!files.has(fileName)) {
                if (!create) {
                    const error = new Error('not found');
                    error.name = 'NotFoundError';
                    throw error;
                }
                files.set(fileName, { text: '', lastModified: now() });
            }
            const record = files.get(fileName);
            return {
                kind: 'file',
                name: fileName,
                async getFile() {
                    return {
                        name: fileName,
                        size: new TextEncoder().encode(record.text).length,
                        lastModified: record.lastModified,
                        async text() { return record.text; }
                    };
                },
                async createWritable() {
                    let buffer = '';
                    return {
                        async write(value) {
                            if (state.failWrite || state.failWriteOnce) {
                                state.failWriteOnce = false;
                                throw Object.assign(new Error('quota'), { name: 'QuotaExceededError' });
                            }
                            buffer += typeof value === 'string' ? value : '';
                        },
                        async close() {
                            if (state.failClose) throw new Error('close_failed');
                            record.text = buffer;
                            record.lastModified = now();
                        },
                        async abort() {}
                    };
                }
            };
        },
        async *entries() {
            for (const fileName of [...files.keys()].sort()) yield [fileName, {}];
        }
    };
    return { handle, files, state };
}

function makeService({ picker = null, directory = null, indexedDB = makeMetadataIndexedDb(), now = null, retention = 20, diagnostics = null } = {}) {
    const context = vm.createContext({
        crypto: webcrypto,
        TextEncoder,
        Uint8Array,
        JSON,
        Date,
        Math,
        Number,
        String,
        Array,
        Object,
        Error,
        console
    });
    vm.runInContext(backupSource, context, { filename: 'backup-service.js' });
    let clock = Date.UTC(2026, 0, 1, 0, 0, 0);
    const snapshot = {
        format: 'timerhub-backup',
        version: 1,
        activities: [{ id: 'activity-1', name: 'Painting' }],
        timeEntries: [],
        syncBatches: [],
        layout: [],
        groups: [],
        settings: { theme: 'dark' },
        exportedAt: clock
    };
    let idCounter = 0;
    const service = new context.TimerHubBackupService({
        indexedDB,
        crypto: webcrypto,
        picker: picker || (async () => directory.handle),
        getSnapshot: async () => structuredClone({ ...snapshot, exportedAt: clock }),
        validateSnapshot: data => {
            if (!data || data.format !== 'timerhub-backup' || !Array.isArray(data.activities) || !Array.isArray(data.timeEntries)) {
                throw new Error('invalid_snapshot');
            }
            return data;
        },
        diagnostics,
        now: now || (() => { clock += 1000; return clock; }),
        randomId: () => `id${String(++idCounter).padStart(6, '0')}`,
        retention
    });
    return { service, snapshot, context };
}

test('a selected directory receives a verified backup and no probe or temporary files remain', async () => {
    const directory = makeDirectory();
    const { service } = makeService({ directory });
    const status = await service.selectDirectory();
    assert.equal(status.state, 'ready');
    const backup = await service.createBackup({ kind: 'automatic', revision: 1 });
    assert.equal(backup.skipped, false);
    assert.match(backup.name, /^timerhub_auto_backup_\d{8}_\d{6}_/);
    assert.equal([...directory.files.keys()].every(name => name.endsWith('.json')), true);
    assert.equal([...directory.files.keys()].some(name => name.includes('write_test')), false);
    assert.equal([...directory.files.keys()].some(name => name.endsWith('.partial')), false);
    const parsed = await service.readBackup(backup.name);
    assert.equal(parsed.verified, true);
    assert.equal(parsed.data.activities[0].id, 'activity-1');
    assert.ok(directory.files.has('timerhub_backup_manifest.json'));
});

test('a failed write keeps every previous verified backup and leaves no invalid backup behind', async () => {
    const directory = makeDirectory();
    const { service } = makeService({ directory });
    await service.selectDirectory();
    const first = await service.createBackup({ kind: 'automatic', revision: 1 });
    const firstText = directory.files.get(first.name).text;
    const manifestText = directory.files.get('timerhub_backup_manifest.json').text;
    directory.state.failWriteOnce = true;
    await assert.rejects(() => service.createBackup({ kind: 'automatic', revision: 2 }), /QuotaExceededError|quota/);
    assert.equal(directory.files.get(first.name).text, firstText);
    assert.equal(directory.files.get('timerhub_backup_manifest.json').text, manifestText);
    const latest = await service.findLatestVerified();
    assert.equal(latest.name, first.name);
});

test('corrupted or checksum-modified backups are rejected and the previous backup remains latest', async () => {
    const directory = makeDirectory();
    const { service } = makeService({ directory });
    await service.selectDirectory();
    const first = await service.createBackup({ kind: 'automatic', revision: 1 });
    directory.state.failWrite = true;
    await assert.rejects(() => service.createBackup({ kind: 'automatic', revision: 2 }));
    directory.state.failWrite = false;
    const second = await service.createBackup({ kind: 'automatic', revision: 3 });
    const expectedLatest = second.name;
    const record = directory.files.get(second.name);
    const parsed = JSON.parse(record.text);
    parsed.activities[0].name = 'Tampered';
    record.text = JSON.stringify(parsed);
    await assert.rejects(() => service.readBackup(second.name), /checksum|verification/i);
    const latest = await service.findLatestVerified();
    assert.equal(latest.name, first.name);
    assert.notEqual(latest.name, expectedLatest);
});

test('retention removes only verified automatic backups and never the last or manual backups', async () => {
    const directory = makeDirectory();
    const { service } = makeService({ directory, retention: 2 });
    await service.selectDirectory();
    const automatic = [];
    for (let index = 0; index < 4; index += 1) {
        automatic.push((await service.createBackup({ kind: 'automatic', revision: index, force: true })).name);
    }
    const manual = (await service.createBackup({ kind: 'manual', revision: 99, force: true })).name;
    const autoLeft = [...directory.files.keys()].filter(name => name.startsWith('timerhub_auto_backup_'));
    assert.equal(autoLeft.length, 2);
    assert.ok(directory.files.has(manual), 'manual backups are never pruned');
    assert.ok(directory.files.has(automatic.at(-1)), 'the newest automatic backup is always kept');
});

test('missing manifest does not prevent discovery or retention', async () => {
    const directory = makeDirectory();
    const { service } = makeService({ directory, retention: 1 });
    await service.selectDirectory();
    await service.createBackup({ kind: 'automatic', revision: 1 });
    const second = await service.createBackup({ kind: 'automatic', revision: 2 });
    directory.files.delete('timerhub_backup_manifest.json');
    service.manifestCache = null;
    const latest = await service.findLatestVerified();
    assert.equal(latest.name, second.name);
    const third = await service.createBackup({ kind: 'automatic', revision: 3 });
    assert.ok(directory.files.has(third.name));
    const autoLeft = [...directory.files.keys()].filter(name => name.startsWith('timerhub_auto_backup_'));
    assert.equal(autoLeft.length, 1);
});

test('permission revocation blocks writes without deleting existing backups', async () => {
    const directory = makeDirectory();
    const { service } = makeService({ directory });
    await service.selectDirectory();
    const first = await service.createBackup({ kind: 'automatic', revision: 1 });
    directory.state.permission = 'prompt';
    directory.state.requestPermission = 'denied';
    await assert.rejects(() => service.createBackup({ kind: 'automatic', revision: 2 }), /permission/i);
    assert.ok(directory.files.has(first.name));
    assert.equal((await service.findLatestVerified()).name, first.name);
});

test('unsupported browsers stay explicitly unsupported and cannot fake a backup', async () => {
    const { service } = makeService({ picker: null });
    const originalPicker = service.picker;
    service.picker = null;
    const status = await service.init();
    assert.equal(status.state, 'unsupported');
    await assert.rejects(() => service.selectDirectory(), /unsupported/);
    service.picker = originalPicker;
});

test('snapshot validation failures never create a backup file', async () => {
    const directory = makeDirectory();
    const { service, snapshot } = makeService({ directory });
    await service.selectDirectory();
    snapshot.format = 'not-a-backup';
    await assert.rejects(() => service.createBackup({ kind: 'automatic', revision: 1 }), /invalid/);
    assert.equal([...directory.files.keys()].some(name => name.startsWith('timerhub_auto_backup_')), false);
});

test('diagnostics redact secrets, keep a bounded log, and survive storage failures', () => {
    const context = vm.createContext({ JSON, Date, Math, Number, String, Array, Object, console });
    vm.runInContext(diagnosticsSource, context, { filename: 'diagnostics.js' });
    const stored = [];
    const storage = {
        getItem: () => stored.length ? stored[stored.length - 1] : null,
        setItem: (_key, value) => stored.push(value),
        removeItem: () => stored.splice(0)
    };
    const diagnostics = new context.TimerHubDiagnostics({ storage, maxMemory: 20, maxPersisted: 10, consoleRef: null });
    diagnostics.error('backup', 'create-backup', {
        code: 'quota_exceeded',
        message: 'no space for person@example.test token=abcdefghijklmnopqrstuvwxyz0123456789ABCD',
        apiKey: 'secret-key',
        nested: { token: 'secret-token' }
    });
    const entries = diagnostics.list();
    assert.equal(entries.length, 1);
    assert.equal(entries[0].details.apiKey, '[redacted]');
    assert.equal(entries[0].details.nested.token, '[redacted]');
    assert.equal(entries[0].details.message.includes('person@example.test'), false);
    assert.equal(entries[0].details.message.includes('abcdefghijklmnopqrstuvwxyz0123456789ABCD'), false);
    for (let index = 0; index < 40; index += 1) diagnostics.warn('test', 'loop', `warning ${index}`);
    assert.equal(diagnostics.list({ limit: 100 }).length, 20);
    const broken = new context.TimerHubDiagnostics({ storage: { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('blocked'); }, removeItem() { throw new Error('blocked'); } }, consoleRef: null });
    assert.doesNotThrow(() => broken.error('runtime', 'broken-storage', new Error('failure')));
    assert.equal(broken.list().length, 1);
});

test('interrupted temporary files and unsupported schemas are never treated as restorable backups', async () => {
    const directory = makeDirectory();
    const { service } = makeService({ directory });
    await service.selectDirectory();
    const first = await service.createBackup({ kind: 'automatic', revision: 1 });
    directory.files.set('timerhub_auto_backup_20990101_000000_interrupted.json.partial', {
        text: JSON.stringify({ format: 'timerhub-backup', version: 1, activities: [], timeEntries: [] }),
        lastModified: Date.now()
    });
    directory.files.set('timerhub_manual_backup_20990101_000000_broken.json', {
        text: JSON.stringify({ format: 'timerhub-backup', version: 2, activities: [], timeEntries: [] }),
        lastModified: Date.now()
    });
    const listed = await service.listBackups({ verify: true });
    assert.equal(listed.some(entry => entry.name.endsWith('.partial')), false);
    assert.equal(listed.find(entry => entry.name.includes('broken')).invalid, true);
    const latest = await service.findLatestVerified();
    assert.equal(latest.name, first.name);
    await assert.rejects(() => service.readBackup('timerhub_manual_backup_20990101_000000_broken.json'), /invalid/);
});

test('a failed close or final read leaves the previous verified backup intact', async () => {
    const directory = makeDirectory();
    const { service } = makeService({ directory });
    await service.selectDirectory();
    const first = await service.createBackup({ kind: 'automatic', revision: 1 });
    const before = [...directory.files.keys()].filter(name => name.startsWith('timerhub_auto_backup_')).sort();
    directory.state.failClose = true;
    await assert.rejects(() => service.createBackup({ kind: 'automatic', revision: 2 }));
    directory.state.failClose = false;
    const after = [...directory.files.keys()].filter(name => name.startsWith('timerhub_auto_backup_')).sort();
    assert.deepEqual(after, before);
    assert.ok(directory.files.has(first.name));
    assert.equal((await service.findLatestVerified()).name, first.name);
});

test('a newer corrupt file can never cause retention to delete the newest verified backup', async () => {
    const directory = makeDirectory();
    const { service } = makeService({ directory, retention: 5 });
    await service.selectDirectory();
    const older = await service.createBackup({ kind: 'automatic', revision: 1, force: true });
    const newestVerified = await service.createBackup({ kind: 'automatic', revision: 2, force: true });
    directory.files.set('timerhub_auto_backup_20990101_000000_corrupt.json', {
        text: JSON.stringify({
            format: 'timerhub-backup',
            version: 1,
            activities: [{ id: 'tampered' }],
            timeEntries: []
        }),
        lastModified: Date.now()
    });
    service.manifestCache = null;
    const result = await service.pruneAutomatic(1);
    assert.ok(directory.files.has(newestVerified.name), 'the newest verified backup is retained');
    assert.equal(directory.files.has(older.name), false, 'older verified backups may be pruned');
    assert.ok(directory.files.has('timerhub_auto_backup_20990101_000000_corrupt.json'), 'unverified files are not deleted');
    assert.ok(result.removed >= 1);
});

test('a saved directory handle is restored after an app restart without opening the picker', async () => {
    const directory = makeDirectory('Saved backups');
    const indexedDB = makeMetadataIndexedDb();
    const first = makeService({ directory, indexedDB });
    await first.service.selectDirectory();
    let pickerCalls = 0;
    const second = makeService({
        directory,
        indexedDB,
        picker: async () => { pickerCalls += 1; return directory.handle; }
    });
    const status = await second.service.init();
    assert.equal(status.state, 'ready');
    assert.equal(status.savedHandleAvailable, true);
    assert.equal(status.permissionState, 'granted');
    assert.equal(status.directoryName, 'Saved backups');
    assert.equal(pickerCalls, 0, 'restoring a handle must not open the directory picker');
    const backup = await second.service.createBackup({ kind: 'automatic', revision: 10 });
    assert.equal(backup.skipped, false);
    assert.equal((await second.service.readBackup(backup.name)).verified, true);
});

test('a saved handle requiring permission renewal is reused instead of discarded', async () => {
    const directory = makeDirectory('Renewed backups');
    const indexedDB = makeMetadataIndexedDb();
    const first = makeService({ directory, indexedDB });
    await first.service.selectDirectory();
    directory.state.permission = 'prompt';
    directory.state.requestPermission = 'granted';
    let pickerCalls = 0;
    const second = makeService({
        directory,
        indexedDB,
        picker: async () => { pickerCalls += 1; return directory.handle; }
    });
    const status = await second.service.init();
    assert.equal(status.state, 'permission-required');
    assert.equal(status.savedHandleAvailable, true);
    assert.equal(status.directoryName, 'Renewed backups');
    const renewed = await second.service.requestAccess();
    assert.equal(renewed.state, 'ready');
    assert.equal(renewed.permissionState, 'granted');
    assert.equal(pickerCalls, 0, 'permission renewal must reuse the saved handle');
    assert.equal(second.service.directoryHandle.name, 'Renewed backups');
});

test('a missing handle requires a legitimate first-time setup flow', async () => {
    const directory = makeDirectory();
    const indexedDB = makeMetadataIndexedDb();
    const { service } = makeService({ directory, indexedDB });
    const status = await service.init();
    assert.equal(status.state, 'needs-selection');
    assert.equal(status.savedHandleAvailable, false);
    assert.equal(status.directoryName, '');
});

test('an invalid saved handle is not deleted and leads to a clear recovery flow', async () => {
    const directory = makeDirectory();
    const indexedDB = makeMetadataIndexedDb();
    indexedDB._values.set('directoryHandle', { key: 'directoryHandle', value: { kind: 'file', name: 'wrong' } });
    const { service } = makeService({ directory, indexedDB });
    const status = await service.init();
    assert.equal(status.state, 'handle-invalid');
    assert.equal(status.savedHandleAvailable, false);
    assert.equal(indexedDB._values.has('directoryHandle'), true, 'invalid stored handles are preserved for diagnostics/recovery');
});

test('a transient IndexedDB failure does not erase the saved handle and retry restores it', async () => {
    const directory = makeDirectory('Transient backups');
    const indexedDB = makeMetadataIndexedDb();
    const first = makeService({ directory, indexedDB });
    await first.service.selectDirectory();
    assert.equal(indexedDB._values.has('directoryHandle'), true);

    indexedDB.state.failNextOpen = true;
    const second = makeService({ directory, indexedDB });
    const failed = await second.service.init();
    assert.equal(failed.state, 'restore-error');
    assert.equal(indexedDB._values.has('directoryHandle'), true, 'a transient read failure must not delete the handle');

    const retried = await second.service.init();
    assert.equal(retried.state, 'ready');
    assert.equal(retried.directoryName, 'Transient backups');
});

test('a transient read failure after the database opens is retryable without losing the handle', async () => {
    const directory = makeDirectory('Retry read backups');
    const indexedDB = makeMetadataIndexedDb();
    const first = makeService({ directory, indexedDB });
    await first.service.selectDirectory();

    indexedDB.state.failNextGet = true;
    const second = makeService({ directory, indexedDB });
    const failed = await second.service.init();
    assert.equal(failed.state, 'restore-error');
    assert.equal(indexedDB._values.has('directoryHandle'), true);
    const retried = await second.service.init();
    assert.equal(retried.state, 'ready');
});

test('a saved handle is reused even when the current browsing context does not expose the directory picker', async () => {
    const directory = makeDirectory('PWA backups');
    const indexedDB = makeMetadataIndexedDb();
    const first = makeService({ directory, indexedDB });
    await first.service.selectDirectory();

    const { service } = makeService({ directory, indexedDB, picker: null });
    service.picker = null;
    const status = await service.init();
    assert.equal(status.state, 'ready');
    assert.equal(status.savedHandleAvailable, true);
    assert.equal(status.directoryName, 'PWA backups');
    await assert.rejects(() => service.selectDirectory(), /unsupported/);
    const backup = await service.createBackup({ kind: 'automatic', revision: 7 });
    assert.equal(backup.skipped, false);
});

test('a repeated init keeps an already active handle when the stored value reads back empty', async () => {
    const directory = makeDirectory('Memory backups');
    const indexedDB = makeMetadataIndexedDb();
    const { service } = makeService({ directory, indexedDB });
    await service.selectDirectory();
    indexedDB._values.delete('directoryHandle');
    const status = await service.init();
    assert.equal(status.state, 'ready');
    assert.equal(status.savedHandleAvailable, true);
    assert.equal(service.directoryHandle.name, 'Memory backups');
});

test('a failed choice of a new folder keeps the previously saved handle and its permission state', async () => {
    const directoryA = makeDirectory('Original backups');
    const directoryB = makeDirectory('Broken backups');
    const indexedDB = makeMetadataIndexedDb();
    let nextHandle = directoryA.handle;
    const { service } = makeService({
        directory: directoryA,
        indexedDB,
        picker: async () => nextHandle
    });
    await service.selectDirectory();
    assert.equal(indexedDB._values.get('directoryHandle').value.name, 'Original backups');

    nextHandle = directoryB.handle;
    directoryB.state.requestPermission = 'denied';
    directoryB.state.permission = 'denied';
    await assert.rejects(() => service.selectDirectory(), /permission/i);
    assert.equal(indexedDB._values.get('directoryHandle').value.name, 'Original backups');
    assert.equal(service.directoryHandle.name, 'Original backups');
    assert.equal(service.permissionState, 'granted');
    assert.equal(service.state, 'ready');
});
