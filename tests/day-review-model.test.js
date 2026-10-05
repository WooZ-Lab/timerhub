import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

const source = await readFile(new URL('../app.js', import.meta.url), 'utf8');
const clockodoClientSource = await readFile(new URL('../clockodo-client.js', import.meta.url), 'utf8');

function createTestApp(initialData = {}) {
    const storageData = {
        activities: initialData.activities || [],
        timeEntries: initialData.timeEntries || [],
        syncBatches: initialData.syncBatches || [],
        settings: initialData.settings || {}
    };
    const localStorageData = new Map(Object.entries(initialData.localStorage || {}));

    const mockStorage = {
        async init() {},
        async getActivities() { return structuredClone(storageData.activities); },
        async saveActivity(a) {
            const idx = storageData.activities.findIndex(item => item.id === a.id);
            if (idx >= 0) storageData.activities[idx] = structuredClone(a);
            else storageData.activities.push(structuredClone(a));
            return a;
        },
        async deleteActivity(id) {
            storageData.activities = storageData.activities.filter(a => a.id !== id);
        },
        async getTimeEntries() { return structuredClone(storageData.timeEntries); },
        async saveTimeEntry(e) {
            const idx = storageData.timeEntries.findIndex(item => item.id === e.id);
            if (idx >= 0) storageData.timeEntries[idx] = structuredClone(e);
            else storageData.timeEntries.push(structuredClone(e));
            return e;
        },
        async deleteTimeEntry(id) {
            storageData.timeEntries = storageData.timeEntries.filter(e => e.id !== id);
        },
        async getSyncBatches() { return structuredClone(storageData.syncBatches); },
        async saveConfirmedBatch(batch, entries) {
            storageData.syncBatches.push(structuredClone(batch));
            for (const entry of entries) {
                const index = storageData.timeEntries.findIndex(item => item.id === entry.id);
                if (index < 0) storageData.timeEntries.push(structuredClone(entry));
                else storageData.timeEntries[index] = structuredClone(entry);
            }
            return batch;
        },
        async saveSyncProgress(batch, entries) {
            const index = storageData.syncBatches.findIndex(item => item.id === batch.id);
            if (index < 0) storageData.syncBatches.push(structuredClone(batch));
            else storageData.syncBatches[index] = structuredClone(batch);
            for (const entry of entries) {
                const entryIndex = storageData.timeEntries.findIndex(item => item.id === entry.id);
                if (entryIndex < 0) storageData.timeEntries.push(structuredClone(entry));
                else storageData.timeEntries[entryIndex] = structuredClone(entry);
            }
            return batch;
        },
        async getSetting(k, def) {
            return storageData.settings[k] !== undefined ? storageData.settings[k] : def;
        },
        async setSetting(k, v) {
            storageData.settings[k] = v;
        },
        async exportAll() {
            return structuredClone({
                activities: storageData.activities,
                timeEntries: storageData.timeEntries,
                syncBatches: storageData.syncBatches,
                settings: Object.fromEntries(Object.entries(storageData.settings)
                    .filter(([key]) => !/(clockodo|api.?key|token|secret|password|credential|auth)/i.test(key))),
                format: 'timerhub-backup',
                version: 1,
                exportedAt: Date.now()
            });
        },
        async importAll(data, merge = false) {
            if (!merge) {
                storageData.activities = [];
                storageData.timeEntries = [];
                storageData.settings = {};
            }
            if (data.activities) storageData.activities.push(...structuredClone(data.activities));
            if (data.timeEntries) storageData.timeEntries.push(...structuredClone(data.timeEntries));
            if (data.syncBatches) storageData.syncBatches.push(...structuredClone(data.syncBatches));
            if (data.settings) {
                const safeSettings = Object.fromEntries(Object.entries(data.settings)
                    .filter(([key]) => !/(clockodo|api.?key|token|secret|password|credential|auth)/i.test(key)));
                Object.assign(storageData.settings, structuredClone(safeSettings));
            }
        }
    };

    const elements = new Map();
    for (const id of [
        'reviewDateInput', 'reviewSummaryBar', 'reviewEntriesList', 'reviewSuspiciousBanner',
        'entryEditDate', 'entryEditEndDate', 'entryEditStart', 'entryEditEnd', 'entryEditActivity',
        'entryEditProject', 'entryEditService', 'entryEditNotes', 'entryEditModalTitle',
        'entryEditDeleteBtn', 'entryEditSaveBtn', 'entryEditLockedNotice', 'entryConflictWarning', 'entryEditModal',
        'entryEditCustomerSelect', 'entryEditServiceSelect', 'entryEditClockodoHint', 'entryEditClockodoRetryBtn',
        'entryEditCustomerInput', 'entryEditCustomerList', 'entryEditServiceInput', 'entryEditServiceList',
        'activityModal', 'modalTitle', 'activityName', 'modalSaveBtn', 'modalCancelBtn', 'modalCloseBtn',
        'activityCustomerSelect', 'activityServiceSelect', 'activityClockodoHint', 'activityClockodoRetryBtn',
        'activityCustomerInput', 'activityCustomerList', 'activityServiceInput', 'activityServiceList',
        'syncConfirmEntriesList', 'syncConfirmDesc', 'syncConfirmSummary',
        'syncConfirmAlreadySyncedNotice', 'syncConfirmSubmitBtn', 'syncConfirmModal',
        'clockodoEmailInput', 'clockodoApiKeyInput', 'clockodoCustomerIdInput', 'clockodoProjectIdInput', 'clockodoServiceIdInput', 'clockodoSaveBtn',
        'clockodoBillableSelect', 'clockodoTestBtn', 'clockodoRemoveBtn', 'clockodoStatusValue', 'clockodoToggleKeyBtn',
        'automaticBackupStatus', 'automaticSnapshotSelect', 'restoreSnapshotBtn', 'backupRestoreModal',
        'backupRestoreMergeBtn', 'backupRestoreReplaceBtn', 'backupRestoreCancelBtn', 'backupRestoreCloseBtn'
    ]) {
        elements.set(id, {
            id,
            value: id === 'clockodoBillableSelect' ? 'true' : '',
            type: id === 'clockodoApiKeyInput' ? 'password' : 'text',
            disabled: false,
            textContent: '',
            dataset: {},
            style: {},
            children: [],
            classList: { add() {}, remove() {}, contains() { return false; } },
            setAttribute() {},
            removeAttribute() {},
            focus() {},
            appendChild(child) { this.children.push(child); },
            querySelectorAll: () => [],
            addEventListener() {}
        });
        Object.defineProperty(elements.get(id), 'innerHTML', {
            get() { return this._innerHTML || ''; },
            set(value) { this._innerHTML = String(value); this.children.length = 0; }
        });
    }
    const backupCapture = { clicks: 0, blob: null, filename: '', revoked: [] };
    const testDocument = {
        title: '',
        documentElement: { lang: '' },
        body: { appendChild(element) { backupCapture.element = element; }, removeChild() {} },
        getElementById: id => elements.get(id) || null,
        querySelector: () => null,
        querySelectorAll: () => [],
        createElement: () => {
            const element = {
                value: '', textContent: '', style: {}, dataset: {}, className: '', id: '', hidden: false,
                children: [],
                classList: {
                    add: (...names) => { element.className = `${element.className} ${names.join(' ')}`.trim(); },
                    remove: (...names) => {
                        for (const name of names) element.className = element.className.split(/\s+/).filter(part => part && part !== name).join(' ');
                    },
                    contains: name => element.className.split(/\s+/).includes(name)
                },
                setAttribute(name, value) { this[name] = String(value); },
                removeAttribute(name) { delete this[name]; },
                appendChild(child) { element.children.push(child); return child; },
                click() { backupCapture.clicks += 1; backupCapture.filename = this.download; }
            };
            return element;
        }
    };

    const context = vm.createContext({
        window: {
            location: { hostname: 'localhost' },
            addEventListener() {}
        },
        document: testDocument,
        Blob,
        URL: {
            createObjectURL(blob) { backupCapture.blob = blob; return 'blob:timerhub-test'; },
            revokeObjectURL(url) { backupCapture.revoked.push(url); }
        },
        navigator: {},
        localStorage: {
            getItem: key => localStorageData.get(key) || null,
            setItem: (key, value) => localStorageData.set(key, String(value)),
            removeItem: key => localStorageData.delete(key)
        },
        crypto: { randomUUID: () => 'test-uuid-1234', getRandomValues: bytes => { bytes.fill(7); return bytes; } },
        btoa,
        Array,
        Object,
        Date,
        Number,
        Math,
        setTimeout: () => 1,
        clearTimeout,
        console,
        Intl,
        AbortController
    });

    vm.runInContext(source, context, { filename: 'app.js' });
    const app = vm.runInContext('new TimerHubApp()', context);
    app.storage = mockStorage;
    app.clockodoClient = initialData.clockodoClient || null;
    const toasts = [];
    app.showToast = message => toasts.push(message);
    return { app, storageData, document: testDocument, localStorageData, toasts, backupCapture, context };
}

function createIndexedDbHarness() {
    const keyPaths = { activities: 'id', timeEntries: 'id', settings: 'key', syncBatches: 'id', layout: 'activityId', snapshots: 'id' };
    const data = Object.fromEntries(Object.keys(keyPaths).map(name => [name, new Map()]));
    const stats = { snapshotTransactions: 0, failMutation: false, failSnapshot: false };
    const db = {
        objectStoreNames: { contains: name => Object.hasOwn(data, name) },
        transaction(storeNames, mode) {
            if (mode === 'readwrite' && storeNames.includes('snapshots')) stats.snapshotTransactions += 1;
            const fail = mode === 'readwrite' && (storeNames.includes('snapshots') ? stats.failSnapshot : stats.failMutation);
            const tx = { error: null, oncomplete: null, onerror: null, onabort: null, pending: 0, failed: false, completionQueued: false };
            const finishIfReady = () => {
                if (tx.pending || tx.failed || tx.completionQueued) return;
                tx.completionQueued = true;
                queueMicrotask(() => {
                    tx.completionQueued = false;
                    if (!tx.pending && !tx.failed) tx.oncomplete?.();
                });
            };
            const makeRequest = operation => {
                const request = {};
                tx.pending += 1;
                queueMicrotask(() => {
                    try {
                        if (fail) throw new Error('indexeddb_write_failed');
                        request.result = operation();
                        request.onsuccess?.();
                    } catch (error) {
                        request.error = error;
                        tx.error = error;
                        tx.failed = true;
                        request.onerror?.();
                        tx.onerror?.();
                        tx.onabort?.();
                    } finally {
                        tx.pending -= 1;
                        finishIfReady();
                    }
                });
                return request;
            };
            tx.objectStore = name => {
                const records = data[name];
                const keyPath = keyPaths[name];
                return {
                    getAll: () => makeRequest(() => [...records.values()].map(value => structuredClone(value))),
                    get: key => makeRequest(() => structuredClone(records.get(key))),
                    put: value => makeRequest(() => { records.set(value[keyPath], structuredClone(value)); return value[keyPath]; }),
                    add: value => makeRequest(() => { records.set(value[keyPath], structuredClone(value)); return value[keyPath]; }),
                    delete: key => makeRequest(() => records.delete(key)),
                    clear: () => makeRequest(() => records.clear())
                };
            };
            return tx;
        }
    };
    return { db, data, stats };
}

function makeClockodoSettingsService() {
    const state = { configured: false, apiUser: '', connection: 'ok', saveFails: false };
    const client = {
        async getConfig() { return { configured: state.configured, apiUser: state.apiUser }; },
        async saveConfig(_clientId, _token, credentials) {
            if (state.saveFails) throw Object.assign(new Error('safe failure'), { code: 'network_error' });
            state.configured = true;
            state.apiUser = credentials.apiUser;
            return { configured: true };
        },
        async testConnection() {
            if (state.connection !== 'ok') throw Object.assign(new Error('safe failure'), { code: state.connection });
            return { connected: true };
        },
        async removeConfig() { state.configured = false; state.apiUser = ''; return { configured: false }; }
    };
    return { client, state };
}

function fillClockodoSettings(document, apiKey = 'test-only-placeholder') {
    document.getElementById('clockodoEmailInput').value = 'worker@example.test';
    document.getElementById('clockodoApiKeyInput').value = apiKey;
    document.getElementById('clockodoCustomerIdInput').value = '12';
    document.getElementById('clockodoProjectIdInput').value = '34';
    document.getElementById('clockodoServiceIdInput').value = '56';
}

test('Clockodo credentials save as configured without returning the key or claiming connection success', async () => {
    const service = makeClockodoSettingsService();
    const { app, document, toasts, localStorageData } = createTestApp({ clockodoClient: service.client });
    fillClockodoSettings(document);

    assert.equal(await app.saveClockodoSettings(), true);
    assert.equal(app.clockodoConfigured, true);
    assert.equal(app.clockodoStatus, 'configured');
    assert.match(document.getElementById('clockodoStatusValue').textContent, /credentials configured/i);
    assert.equal(document.getElementById('clockodoApiKeyInput').value, '');
    assert.deepEqual(toasts, ['Clockodo settings saved']);
    assert.deepEqual(service.state, { configured: true, apiUser: 'worker@example.test', connection: 'ok', saveFails: false });
    assert.equal(JSON.stringify([...localStorageData.entries()]).includes('test-only-placeholder'), false);
});

test('Clockodo configured state survives reload and removing settings clears it', async () => {
    const service = makeClockodoSettingsService();
    service.state.configured = true;
    service.state.apiUser = 'worker@example.test';
    const original = createTestApp({ clockodoClient: service.client });
    await original.app.refreshClockodoConfigurationStatus();
    assert.equal(original.app.clockodoConfigured, true);
    assert.equal(original.app.clockodoStatus, 'configured');

    original.app.clockodoConfigured = true;
    assert.equal(await original.app.removeClockodoSettings(), true);
    assert.equal(original.app.clockodoConfigured, false);
    assert.equal(original.app.clockodoStatus, 'unconfigured');
    assert.equal(original.document.getElementById('clockodoStatusValue').textContent, 'Credentials not configured');

    const reloaded = createTestApp({ clockodoClient: service.client });
    await reloaded.app.refreshClockodoConfigurationStatus();
    assert.equal(reloaded.app.clockodoConfigured, false);
    assert.equal(reloaded.app.clockodoStatus, 'unconfigured');
});

test('Clockodo connection checks distinguish checking, success, and failure', async () => {
    const service = makeClockodoSettingsService();
    service.state.configured = true;
    const { app, document } = createTestApp({ clockodoClient: service.client });
    app.clockodoConfigured = true;
    app.clockodoEmail = 'worker@example.test';
    assert.equal(await app.testClockodoConnection(), true);
    assert.equal(app.clockodoStatus, 'connected');
    assert.equal(document.getElementById('clockodoStatusValue').textContent, 'Connection successful');

    service.state.connection = 'invalid_credentials';
    assert.equal(await app.testClockodoConnection(), false);
    assert.equal(app.clockodoStatus, 'failed');
    assert.match(document.getElementById('clockodoStatusValue').textContent, /Connection check failed/);
});

test('Clockodo save failure clears the field but does not mark credentials configured', async () => {
    const service = makeClockodoSettingsService();
    service.state.saveFails = true;
    const { app, document, toasts } = createTestApp({ clockodoClient: service.client });
    fillClockodoSettings(document);

    assert.equal(await app.saveClockodoSettings(), false);
    assert.equal(app.clockodoConfigured, false);
    assert.equal(app.clockodoStatus, 'failed');
    assert.equal(document.getElementById('clockodoApiKeyInput').value, '');
    assert.deepEqual(toasts, []);
});

test('stale Clockodo configuration reads cannot overwrite a successful save', async () => {
    let resolveRead;
    const client = {
        getConfig: () => new Promise(resolve => { resolveRead = resolve; }),
        saveConfig: async () => ({ configured: true })
    };
    const { app, document } = createTestApp({ clockodoClient: client });
    fillClockodoSettings(document);
    const staleRefresh = app.refreshClockodoConfigurationStatus();
    await app.saveClockodoSettings();
    resolveRead({ configured: false, apiUser: '' });
    await staleRefresh;
    assert.equal(app.clockodoConfigured, true);
    assert.equal(app.clockodoStatus, 'configured');
    assert.match(document.getElementById('clockodoStatusValue').textContent, /credentials configured/i);
});

test('Task 2: Migration and backward compatibility for legacy time entries', async () => {
    const legacyEntry1 = {
        id: 'legacy-1',
        activityId: 'act-1',
        activityNameSnapshot: 'Painting',
        startTimestamp: 1770000000000,
        endTimestamp: 1770003600000,
        createdAt: 1770000000000,
        updatedAt: 1770003600000
    };

    const legacyEntry2WithClockodo = {
        id: 'legacy-2',
        activityId: 'act-2',
        activityNameSnapshot: 'Masking',
        startTimestamp: 1770005000000,
        endTimestamp: 1770008600000,
        createdAt: 1770005000000,
        updatedAt: 1770008600000,
        clockodoEntryId: 987654
    };

    const { app, storageData } = createTestApp({
        timeEntries: [legacyEntry1, legacyEntry2WithClockodo]
    });

    await app.loadTimeEntries();

    assert.equal(app.timeEntries.length, 2);

    const normalized1 = app.timeEntries[0];
    assert.equal(normalized1.id, 'legacy-1');
    assert.equal(normalized1.activityId, 'act-1');
    assert.equal(normalized1.activityNameSnapshot, 'Painting');
    assert.equal(normalized1.notes, '');
    assert.equal(normalized1.project, '');
    assert.equal(normalized1.service, '');
    assert.equal(normalized1.source, 'timer');
    assert.equal(normalized1.isEdited, false);
    assert.equal(normalized1.editedAt, null);
    assert.equal(normalized1.syncStatus, 'unsynced');
    assert.equal(normalized1.clockodoEntryId, null);
    assert.equal(normalized1.clockodoError, null);

    const normalized2 = app.timeEntries[1];
    assert.equal(normalized2.id, 'legacy-2');
    assert.equal(normalized2.clockodoEntryId, 987654);
    assert.equal(normalized2.syncStatus, 'synced');
});

test('Task 2: Adding and updating review entries locally with persistence', async () => {
    const { app, storageData } = createTestApp();
    await app.loadTimeEntries();

    const start = new Date('2026-09-28T08:00:00').getTime();
    const end = new Date('2026-09-28T09:30:00').getTime();

    const created = await app.addEntry({
        activityId: 'act-10',
        activityNameSnapshot: 'Electrical work',
        startTimestamp: start,
        endTimestamp: end,
        notes: 'Installed wiring in room 204',
        project: 'Project Alpha',
        service: 'Installation',
        source: 'manual'
    });

    assert.equal(created.activityId, 'act-10');
    assert.equal(created.activityNameSnapshot, 'Electrical work');
    assert.equal(created.notes, 'Installed wiring in room 204');
    assert.equal(created.project, 'Project Alpha');
    assert.equal(created.service, 'Installation');
    assert.equal(created.source, 'manual');
    assert.equal(created.isEdited, false);
    assert.equal(created.editedAt, null);
    assert.equal(created.syncStatus, 'unsynced');
    assert.equal(storageData.timeEntries.length, 1);

    // Update the entry
    const updated = await app.updateEntry(created.id, {
        notes: 'Installed wiring and tested breakers',
        endTimestamp: end + 15 * 60 * 1000
    });

    assert.equal(updated.notes, 'Installed wiring and tested breakers');
    assert.equal(updated.endTimestamp, end + 15 * 60 * 1000);
    assert.equal(storageData.timeEntries[0].notes, 'Installed wiring and tested breakers');
    assert.equal(updated.isEdited, true);
    assert.ok(updated.editedAt >= updated.updatedAt - 5);

    const { app: reloaded } = createTestApp({ timeEntries: storageData.timeEntries });
    await reloaded.loadTimeEntries();
    assert.equal(reloaded.timeEntries[0].isEdited, true);
    assert.equal(reloaded.timeEntries[0].editedAt, updated.editedAt);
});

test('Task 2: Deleting a review entry removes it from local storage and day totals', async () => {
    const { app, storageData } = createTestApp();
    const start = new Date('2026-09-28T08:00:00').getTime();
    const entry = await app.addEntry({
        activityId: 'act-delete',
        startTimestamp: start,
        endTimestamp: start + 30 * 60 * 1000,
        source: 'manual'
    });
    assert.equal(app.calculateDayTotal('2026-09-28'), 30 * 60 * 1000);
    assert.equal((await app.deleteEntry(entry.id)).id, entry.id);
    assert.equal(app.calculateDayTotal('2026-09-28'), 0);
    assert.deepEqual(storageData.timeEntries, []);
    assert.equal(await app.deleteEntry(entry.id), null);
});

test('Task 2: Day reconstruction, duration calculation, and day total', async () => {
    const { app, storageData } = createTestApp();
    const dateStr = '2026-09-28';
    const t = hour => new Date(`${dateStr}T${String(hour).padStart(2, '0')}:00:00`).getTime();

    await app.addEntry({
        activityId: 'act-1',
        activityNameSnapshot: 'Task A',
        startTimestamp: t(8),
        endTimestamp: t(9), // 1 hour
        source: 'timer'
    });

    await app.addEntry({
        activityId: 'act-2',
        activityNameSnapshot: 'Task B',
        startTimestamp: t(9),
        endTimestamp: t(11), // 2 hours
        source: 'manual'
    });

    await app.addEntry({
        activityId: 'act-3',
        activityNameSnapshot: 'Task Other Day',
        startTimestamp: new Date('2026-09-29T08:00:00').getTime(),
        endTimestamp: new Date('2026-09-29T09:00:00').getTime(),
        source: 'timer'
    });

    const dayEntries = app.getDayEntries(dateStr);
    assert.equal(dayEntries.length, 2);
    assert.equal(dayEntries[0].activityNameSnapshot, 'Task A');
    assert.equal(dayEntries[1].activityNameSnapshot, 'Task B');

    const totalMs = app.calculateDayTotal(dateStr);
    assert.equal(totalMs, 3 * 60 * 60 * 1000); // 3 hours
});

test('Task 3: Day overview sorts entries, shows gaps, and renders the correct total', async () => {
    const { app, document } = createTestApp();
    const date = '2026-09-28';
    const timestamp = (hour, minute = 0) => new Date(`${date}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`).getTime();
    await app.addEntry({ id: 'later', activityId: 'act-2', activityNameSnapshot: 'Later job', startTimestamp: timestamp(10), endTimestamp: timestamp(11), source: 'manual' });
    await app.addEntry({ id: 'earlier', activityId: 'act-1', activityNameSnapshot: 'Early job', startTimestamp: timestamp(8), endTimestamp: timestamp(9), source: 'timer' });

    app.reviewDate = date;
    app.renderReview();

    const html = document.getElementById('reviewEntriesList').innerHTML;
    assert.ok(html.indexOf('data-entry-id="earlier"') < html.indexOf('data-entry-id="later"'));
    assert.match(html, /Gap/);
    assert.equal(app.calculateDayTotal(date), 2 * 60 * 60 * 1000);
    assert.match(document.getElementById('reviewSummaryBar').innerHTML, /02:00:00/);
});

test('Task 4: Add workflow accepts an explicit overnight interval and persists its metadata', async () => {
    const { app, storageData, document } = createTestApp();
    app.activities = [{ id: 'act-1', name: 'Night work', color: '#27AE60' }];
    app.reviewDate = '2026-09-28';
    app.renderLog = () => {};
    app.renderReview = () => {};
    app.showToast = message => { app.lastToast = message; };
    app.showAddEntryModal();

    const value = (id, nextValue) => { document.getElementById(id).value = nextValue; };
    value('entryEditDate', '2026-09-28');
    value('entryEditEndDate', '2026-09-29');
    value('entryEditStart', '23:30');
    value('entryEditEnd', '00:30');
    value('entryEditActivity', 'act-1');
    value('entryEditProject', 'Bridge');
    value('entryEditService', 'Night shift');
    value('entryEditNotes', 'Concrete pour');
    await app.saveTimeEntry();

    assert.equal(app.timeEntries.length, 1);
    assert.equal(app.timeEntries[0].endTimestamp - app.timeEntries[0].startTimestamp, 60 * 60 * 1000);
    assert.equal(app.timeEntries[0].source, 'manual');
    assert.equal(app.timeEntries[0].project, 'Bridge');
    assert.equal(app.timeEntries[0].service, 'Night shift');
    assert.equal(app.timeEntries[0].notes, 'Concrete pour');
    assert.equal(storageData.timeEntries.length, 1);
});

test('Task 4: Editing rejects equal, reversed, excessive, and overlapping intervals without changing stored data', async () => {
    const { app, storageData, document } = createTestApp();
    const date = '2026-09-28';
    const start = new Date(`${date}T08:00:00`).getTime();
    const existing = await app.addEntry({ id: 'existing', activityId: 'act-1', startTimestamp: start, endTimestamp: start + 60 * 60 * 1000 });
    await app.addEntry({ id: 'other', activityId: 'act-2', startTimestamp: start + 2 * 60 * 60 * 1000, endTimestamp: start + 3 * 60 * 60 * 1000 });
    app.activities = [{ id: 'act-1', name: 'First' }, { id: 'act-2', name: 'Second' }];
    app.editingEntryId = existing.id;
    app.renderLog = () => {};
    app.renderReview = () => {};
    app.showToast = message => { app.lastToast = message; };
    const value = (id, nextValue) => { document.getElementById(id).value = nextValue; };
    value('entryEditDate', date);
    value('entryEditEndDate', date);
    value('entryEditActivity', 'act-1');
    value('entryEditProject', '');
    value('entryEditService', '');
    value('entryEditNotes', '');

    value('entryEditStart', '08:00'); value('entryEditEnd', '08:00');
    await app.saveTimeEntry();
    assert.equal(app.timeEntries[0].endTimestamp, start + 60 * 60 * 1000);

    value('entryEditStart', '08:30'); value('entryEditEnd', '08:00');
    await app.saveTimeEntry();
    assert.equal(app.timeEntries[0].startTimestamp, start);

    value('entryEditStart', '08:00'); value('entryEditEnd', '09:00');
    value('entryEditEndDate', '2026-09-29');
    await app.saveTimeEntry();
    assert.equal(app.timeEntries[0].endTimestamp, start + 60 * 60 * 1000);

    value('entryEditStart', '09:30'); value('entryEditEnd', '10:30');
    value('entryEditEndDate', date);
    await app.saveTimeEntry();
    assert.equal(document.getElementById('entryConflictWarning').style.display, 'block');
    assert.equal(storageData.timeEntries.find(entry => entry.id === 'existing').startTimestamp, start);
});

test('Task 5: Confirmation freezes the reviewed dataset, persists it, and prevents duplicate confirmation', async () => {
    const { app, storageData } = createTestApp();
    app.showToast = message => { app.lastToast = message; };
    const start = new Date('2026-09-28T08:00:00').getTime();
    const entry = await app.addEntry({
        id: 'confirm-me', activityId: 'act-1', activityNameSnapshot: 'Painting',
        startTimestamp: start, endTimestamp: start + 60 * 60 * 1000,
        notes: 'Before review', source: 'manual'
    });
    app.reviewDate = '2026-09-28';
    await app.updateEntry(entry.id, { notes: 'Reviewed detail' });

    app.showSyncConfirmationModal();
    app.closeSyncConfirmationModal();
    assert.equal(storageData.syncBatches.length, 0);
    assert.equal(app.timeEntries[0].syncStatus, 'unsynced');

    app.showSyncConfirmationModal();
    const batch = await app.confirmDayReview();
    assert.equal(batch.state, 'confirmed');
    assert.equal(batch.version, 1);
    assert.equal(batch.entries[0].notes, 'Reviewed detail');
    assert.equal(batch.entries[0].syncBatchId, batch.id);
    assert.equal(storageData.timeEntries[0].syncStatus, 'confirmed');
    assert.equal(storageData.syncBatches.length, 1);
    await assert.rejects(() => app.updateEntry(entry.id, { notes: 'Changed after confirmation' }), /frozen/);
    await assert.rejects(() => app.deleteEntry(entry.id), /frozen/);
    assert.equal(await app.confirmDayReview(), false);
    assert.equal(storageData.syncBatches.length, 1);

    const { app: reloaded } = createTestApp({ timeEntries: storageData.timeEntries, syncBatches: storageData.syncBatches });
    await reloaded.loadTimeEntries();
    assert.equal(reloaded.timeEntries[0].syncStatus, 'confirmed');
    assert.equal(reloaded.timeEntries[0].syncBatchId, batch.id);
    assert.equal(reloaded.syncBatches[0].entries[0].notes, 'Reviewed detail');
});

test('Task 5: Failed day batches can be reconfirmed as a new version without losing local data', async () => {
    const { app, storageData } = createTestApp();
    app.showToast = message => { app.lastToast = message; };
    const start = new Date('2026-09-28T08:00:00').getTime();
    const entry = await app.addEntry({ id: 'retry-entry', activityId: 'act-1', startTimestamp: start, endTimestamp: start + 30 * 60 * 1000 });
    app.reviewDate = '2026-09-28';
    app.showSyncConfirmationModal();
    const first = await app.confirmDayReview();

    const failedEntry = { ...app.timeEntries[0], syncStatus: 'failed', clockodoError: 'Mocked network failure' };
    app.timeEntries[0] = failedEntry;
    storageData.timeEntries[0] = structuredClone(failedEntry);
    storageData.syncBatches[0] = { ...first, state: 'failed' };
    app.syncBatches[0].state = 'failed';
    app.showSyncConfirmationModal();
    const retry = await app.confirmDayReview();

    assert.equal(retry.version, 2);
    assert.notEqual(retry.id, first.id);
    assert.equal(app.timeEntries[0].id, entry.id);
    assert.equal(storageData.syncBatches.length, 2);
    assert.equal(storageData.timeEntries[0].syncStatus, 'confirmed');
});

test('Task 7: Clockodo settings save, reload, replace, test, remove, and keep the API key out of browser storage', async () => {
    const { app, storageData, document, localStorageData } = createTestApp();
    const remote = { configured: false, apiUser: '', keys: [] };
    app.showToast = message => { app.lastToast = message; };
    app.clockodoClient = {
        async getConfig() { return { configured: remote.configured, apiUser: remote.apiUser }; },
        async saveConfig(clientId, token, config) {
            remote.configured = true;
            remote.apiUser = config.apiUser;
            remote.keys.push(config.apiKey);
            remote.accessToken = token;
            return { configured: true };
        },
        async testConnection() { return { connected: true }; },
        async removeConfig() { remote.configured = false; remote.apiUser = ''; }
    };
    const value = (id, nextValue) => { document.getElementById(id).value = nextValue; };
    value('clockodoEmailInput', 'worker@example.test');
    value('clockodoApiKeyInput', 'first-private-key');
    value('clockodoCustomerIdInput', '12');
    value('clockodoProjectIdInput', '34');
    value('clockodoServiceIdInput', '56');
    assert.equal(await app.saveClockodoSettings(), true);
    assert.equal(document.getElementById('clockodoApiKeyInput').value, '');
    assert.equal(storageData.settings.clockodoApiKey, undefined);
    assert.equal(localStorageData.has('timerhubClockodoAccessToken'), true);
    assert.notEqual(localStorageData.get('timerhubClockodoAccessToken'), 'first-private-key');
    const exported = await app.storage.exportAll();
    assert.equal(JSON.stringify(exported).includes('first-private-key'), false);

    const { app: reloaded, document: reloadedDocument } = createTestApp({ settings: storageData.settings });
    reloaded.clockodoClient = app.clockodoClient;
    await reloaded.refreshClockodoConfigurationStatus();
    assert.equal(reloaded.clockodoConfigured, true);
    assert.equal(reloadedDocument.getElementById('clockodoEmailInput').value, 'worker@example.test');
    assert.equal(reloadedDocument.getElementById('clockodoApiKeyInput').value, '');

    value('clockodoApiKeyInput', 'replacement-private-key');
    assert.equal(await app.saveClockodoSettings(), true);
    assert.deepEqual(remote.keys, ['first-private-key', 'replacement-private-key']);
    assert.equal(await app.testClockodoConnection(), true);
    assert.equal(await app.removeClockodoSettings(), true);
    assert.equal(remote.configured, false);
    assert.equal(localStorageData.has('timerhubClockodoAccessToken'), false);
    assert.equal(storageData.settings.clockodoApiKey, undefined);
});

test('Task 7: Clockodo settings require email and API key but do not require valid entry assignments', async () => {
    const { app, document } = createTestApp();
    let saved = false;
    app.clockodoClient = { async saveConfig() { saved = true; return { configured: true }; } };
    app.showToast = () => {};
    document.getElementById('clockodoEmailInput').value = 'bad-email';
    document.getElementById('clockodoApiKeyInput').value = 'private-key';
    document.getElementById('clockodoCustomerIdInput').value = 'x';
    document.getElementById('clockodoServiceIdInput').value = '9';
    assert.equal(await app.saveClockodoSettings(), false);
    assert.equal(saved, false);
    assert.match(document.getElementById('clockodoStatusValue').textContent, /valid Clockodo email/);

    document.getElementById('clockodoEmailInput').value = 'worker@example.test';
    document.getElementById('clockodoApiKeyInput').value = 'test-only-placeholder';
    document.getElementById('clockodoCustomerIdInput').value = '12';
    document.getElementById('clockodoProjectIdInput').value = '3.4';
    assert.equal(await app.saveClockodoSettings(), true);
    assert.equal(saved, true);
});

test('Clockodo connection test accepts email and saved API key without customer or service IDs', async () => {
    const service = makeClockodoSettingsService();
    const { app, document } = createTestApp({ clockodoClient: service.client });
    fillClockodoSettings(document, '');
    document.getElementById('clockodoCustomerIdInput').value = '';
    document.getElementById('clockodoServiceIdInput').value = '';
    document.getElementById('clockodoProjectIdInput').value = '';
    document.getElementById('clockodoApiKeyInput').value = 'test-only-placeholder';

    assert.equal(await app.saveClockodoSettings(), true);
    assert.equal(document.getElementById('clockodoApiKeyInput').value, '');
    assert.equal(await app.testClockodoConnection(), true);
    assert.equal(app.clockodoStatus, 'connected');
});

test('Clockodo connection test is blocked when email or saved credentials are missing', async () => {
    let checkCalls = 0;
    const client = { async testConnection() { checkCalls += 1; return { connected: true }; } };
    const { app, document } = createTestApp({ clockodoClient: client });
    app.clockodoConfigured = true;
    app.clockodoEmail = '';
    assert.equal(await app.testClockodoConnection(), false);
    assert.equal(checkCalls, 0);
    assert.equal(app.clockodoStatus, 'unconfigured');

    app.clockodoEmail = 'worker@example.test';
    app.clockodoConfigured = false;
    assert.equal(await app.testClockodoConnection(), false);
    assert.equal(checkCalls, 0);
    assert.equal(document.getElementById('clockodoStatusValue').textContent, 'Credentials not configured');
});

test('Clockodo entry payload still validates customer and service assignments at send time', async () => {
    const context = vm.createContext({ fetch: async () => Response.json({}), AbortController, setTimeout, clearTimeout, encodeURIComponent });
    vm.runInContext(clockodoClientSource, context);
    const Client = context.ClockodoClient;
    assert.throws(() => Client.buildEntryPayload({
        startTimestamp: Date.parse('2026-09-28T08:00:00Z'),
        endTimestamp: Date.parse('2026-09-28T09:00:00Z'),
        activityNameSnapshot: 'Work'
    }, {}), error => error.code === 'missing_clockodo_assignment');
});

test('Task 8: Confirmed batches send exact snapshots, persist successes, and prevent duplicate sends', async () => {
    const { app, storageData } = createTestApp();
    const start = new Date('2026-09-28T08:00:00').getTime();
    await app.addEntry({ id: 'sync-one', activityId: 'act-1', activityNameSnapshot: 'Painting', startTimestamp: start, endTimestamp: start + 60 * 60 * 1000, notes: 'First coat' });
    await app.addEntry({ id: 'sync-two', activityId: 'act-2', activityNameSnapshot: 'Masking', startTimestamp: start + 60 * 60 * 1000, endTimestamp: start + 2 * 60 * 60 * 1000 });
    app.reviewDate = '2026-09-28';
    app.clockodoConfigured = true;
    app.clockodoCustomerId = '12'; app.clockodoProjectId = '34'; app.clockodoServiceId = '56';
    app.showToast = message => { app.lastToast = message; };
    app.renderReview = () => {};
    app.clockodoClient = {
        buildEntryPayload(entry) { return { activity: entry.activityNameSnapshot, notes: entry.notes }; },
        async createEntry(clientId, token, payload, key) {
            assert.ok(storageData.syncBatches[0]);
            assert.equal(storageData.syncBatches[0].state, 'syncing');
            return { created: true, entryId: payload.activity === 'Painting' ? 201 : 202, key };
        },
        async updateEntry() { throw new Error('unexpected update'); }
    };

    app.showSyncConfirmationModal();
    assert.equal(storageData.syncBatches.length, 0); // Opening the dialog does not transmit or confirm.
    app.closeSyncConfirmationModal();
    assert.equal(await app.confirmAndSyncClockodo(), false); // Cancelled dialog leaves the dataset unconfirmed.
    assert.equal(storageData.syncBatches.length, 0);

    app.showSyncConfirmationModal();
    const result = await app.confirmAndSyncClockodo();
    assert.equal(result.state, 'synced');
    assert.deepEqual(JSON.parse(JSON.stringify(result.entries.map(entry => entry.syncStatus))), ['synced', 'synced']);
    assert.deepEqual(JSON.parse(JSON.stringify(app.timeEntries.map(entry => entry.clockodoEntryId))), [201, 202]);
    assert.deepEqual(storageData.timeEntries.map(entry => entry.syncStatus), ['synced', 'synced']);
    assert.equal(await app.syncConfirmedBatch(result.id), false);
});

test('Task 8: Partial results remain accurate and retry sends only failed entries', async () => {
    const { app, storageData } = createTestApp();
    const start = new Date('2026-09-28T08:00:00').getTime();
    for (let i = 0; i < 3; i += 1) {
        await app.addEntry({ id: `partial-${i}`, activityId: `act-${i}`, activityNameSnapshot: `Task ${i}`, startTimestamp: start + i * 60 * 60 * 1000, endTimestamp: start + (i + 1) * 60 * 60 * 1000 });
    }
    app.reviewDate = '2026-09-28'; app.clockodoConfigured = true;
    app.clockodoCustomerId = '12'; app.clockodoServiceId = '56';
    app.showToast = message => { app.lastToast = message; };
    app.renderReview = () => {};
    const attempted = [];
    let failSecond = true;
    app.clockodoClient = {
        buildEntryPayload(entry) { return { id: entry.id }; },
        async createEntry(clientId, token, payload) {
            attempted.push(payload.id);
            if (payload.id === 'partial-1' && failSecond) throw Object.assign(new Error('rejected'), { code: 'clockodo_rejected' });
            return { created: true, entryId: 300 + Number(payload.id.at(-1)) };
        }
    };
    app.showSyncConfirmationModal();
    const batch = await app.confirmAndSyncClockodo();
    assert.equal(batch.state, 'partial');
    assert.deepEqual(JSON.parse(JSON.stringify(batch.entries.map(entry => entry.syncStatus))), ['synced', 'failed', 'synced']);
    assert.deepEqual(attempted, ['partial-0', 'partial-1', 'partial-2']);

    failSecond = false;
    await app.retrySyncBatch(batch.id);
    assert.equal(batch.state, 'synced');
    assert.deepEqual(attempted, ['partial-0', 'partial-1', 'partial-2', 'partial-1']);
    assert.deepEqual(storageData.timeEntries.map(entry => entry.syncStatus), ['synced', 'synced', 'synced']);
});

test('Task 8: Uncertain network outcomes are marked unknown and blocked from blind retry', async () => {
    const { app } = createTestApp();
    const start = new Date('2026-09-28T08:00:00').getTime();
    await app.addEntry({ id: 'unknown-entry', activityId: 'act-1', startTimestamp: start, endTimestamp: start + 60 * 60 * 1000 });
    app.reviewDate = '2026-09-28'; app.clockodoConfigured = true;
    app.clockodoCustomerId = '12'; app.clockodoServiceId = '56';
    app.showToast = message => { app.lastToast = message; };
    app.renderReview = () => {};
    let requests = 0;
    app.clockodoClient = {
        buildEntryPayload: () => ({ customers_id: 12, services_id: 56 }),
        async createEntry() { requests += 1; throw Object.assign(new Error('uncertain'), { code: 'network_outcome_unknown' }); }
    };
    app.showSyncConfirmationModal();
    const batch = await app.confirmAndSyncClockodo();
    assert.equal(batch.state, 'unknown');
    assert.equal(batch.entries[0].syncStatus, 'unknown');
    assert.equal(await app.retrySyncBatch(batch.id), false);
    assert.equal(requests, 1);
});

test('Safety: editing an already-synced entry requires confirmation and never updates or recreates its Clockodo record', async () => {
    const { app } = createTestApp();
    const start = new Date('2026-09-28T08:00:00').getTime();
    const entry = await app.addEntry({
        id: 'edit-synced', activityId: 'act-1', activityNameSnapshot: 'Painting',
        startTimestamp: start, endTimestamp: start + 60 * 60 * 1000,
        syncStatus: 'synced', clockodoEntryId: 9901
    });
    await app.updateEntry(entry.id, { notes: 'Add second coat' });
    app.reviewDate = '2026-09-28'; app.clockodoConfigured = true;
    app.clockodoCustomerId = '12'; app.clockodoServiceId = '56';
    app.showToast = () => {}; app.renderReview = () => {};
    let created = false;
    app.clockodoClient = {
        buildEntryPayload: value => ({ notes: value.notes }),
        async updateEntry() { throw new Error('UPDATE must never be reached'); },
        async createEntry() { created = true; return { created: true, entryId: 12345 }; }
    };
    app.showSyncConfirmationModal();
    const batch = await app.confirmAndSyncClockodo();
    assert.equal(batch.state, 'local_only');
    assert.equal(batch.entries[0].syncStatus, 'local_only');
    assert.equal(batch.entries[0].clockodoEntryId, 9901);
    assert.equal(created, false);
});

test('Task 8: Interrupted syncing batches reload and recover through the Worker idempotency key', async () => {
    const { app, storageData } = createTestApp();
    const start = new Date('2026-09-28T08:00:00').getTime();
    await app.addEntry({ id: 'reload-sync', activityId: 'act-1', startTimestamp: start, endTimestamp: start + 60 * 60 * 1000 });
    app.reviewDate = '2026-09-28'; app.showToast = () => {};
    const batch = await app.confirmDayReview();
    batch.state = 'syncing';
    batch.entries[0].syncStatus = 'syncing';
    app.timeEntries[0].syncStatus = 'syncing';
    storageData.syncBatches[0] = structuredClone(batch);
    storageData.timeEntries[0] = structuredClone(app.timeEntries[0]);

    const { app: reloaded } = createTestApp({ timeEntries: storageData.timeEntries, syncBatches: storageData.syncBatches });
    await reloaded.loadTimeEntries();
    reloaded.clockodoConfigured = true;
    reloaded.clockodoCustomerId = '12'; reloaded.clockodoServiceId = '56';
    reloaded.showToast = () => {}; reloaded.renderReview = () => {};
    let sentKey;
    reloaded.clockodoClient = {
        buildEntryPayload: () => ({ customers_id: 12, services_id: 56 }),
        async createEntry(clientId, token, payload, key) { sentKey = key; return { created: true, entryId: 700 }; }
    };
    const recovered = await reloaded.syncConfirmedBatch(batch.id);
    assert.equal(recovered.state, 'synced');
    assert.equal(sentKey, 'timerhub-entry:reload-sync');
    assert.equal(storageData.timeEntries[0].clockodoEntryId, 700);
});

test('Task 2: Suspicious entries detection (incomplete, zero duration, overlapping, unusually long)', async () => {
    const { app, storageData } = createTestApp();
    const dateStr = '2026-09-28';
    const t = (h, m = 0) => new Date(`${dateStr}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`).getTime();

    // 1. Incomplete entry (running)
    await app.addEntry({
        activityId: 'act-1',
        activityNameSnapshot: 'Running Task',
        startTimestamp: t(8),
        endTimestamp: null,
        source: 'timer'
    });

    // 2. Zero duration entry
    storageData.timeEntries.push({
        activityId: 'act-2',
        activityNameSnapshot: 'Zero Task',
        startTimestamp: t(9),
        endTimestamp: t(9),
        source: 'manual'
    });

    // 3. Overlapping entries
    await app.addEntry({
        activityId: 'act-3',
        activityNameSnapshot: 'Slot 1',
        startTimestamp: t(10),
        endTimestamp: t(11),
        source: 'manual'
    });

    await app.addEntry({
        activityId: 'act-4',
        activityNameSnapshot: 'Slot 2 overlapping Slot 1',
        startTimestamp: t(10, 30),
        endTimestamp: t(11, 30),
        source: 'manual'
    });

    await app.loadTimeEntries();

    const suspicious = app.getSuspiciousEntries(dateStr);
    assert.equal(suspicious.length, 4);

    const issuesByActivity = Object.fromEntries(
        suspicious.map(s => [s.entry.activityNameSnapshot, s.issues])
    );

    assert.deepEqual([...issuesByActivity['Running Task']], ['running']);
    assert.ok(issuesByActivity['Zero Task'].includes('zeroDuration'));
    assert.ok(issuesByActivity['Slot 1'].includes('overlapping'));
    assert.ok(issuesByActivity['Slot 2 overlapping Slot 1'].includes('overlapping'));
});

test('Task 2: Post-sync material edit resets syncStatus to unsynced', async () => {
    const { app, storageData } = createTestApp();
    const start = new Date('2026-09-28T08:00:00').getTime();
    const end = new Date('2026-09-28T09:00:00').getTime();

    const entry = await app.addEntry({
        activityId: 'act-1',
        activityNameSnapshot: 'Original Task',
        startTimestamp: start,
        endTimestamp: end,
        syncStatus: 'synced',
        clockodoEntryId: 554433
    });

    assert.equal(entry.syncStatus, 'synced');
    assert.equal(entry.clockodoEntryId, 554433);

    // Edit notes
    const edited = await app.updateEntry(entry.id, {
        notes: 'Adding more detail'
    });

    assert.equal(edited.syncStatus, 'unsynced');
    // Note: Clockodo ID is preserved as reference/history, but syncStatus is unsynced!
    assert.equal(edited.clockodoEntryId, 554433);
});

test('Task 2: Invalid data handling rejected during entry validation', async () => {
    const { app } = createTestApp();

    const validCheck1 = app.validateTimeEntry(null);
    assert.equal(validCheck1.valid, false);

    const validCheck2 = app.validateTimeEntry({
        activityId: '',
        startTimestamp: Date.now()
    });
    assert.equal(validCheck2.valid, false);
    assert.equal(validCheck2.error, 'missingActivity');

    const validCheck3 = app.validateTimeEntry({
        activityId: 'act-1',
        startTimestamp: 1000,
        endTimestamp: 500 // end before start
    });
    assert.equal(validCheck3.valid, false);
    assert.equal(validCheck3.error, 'startBeforeEnd');

    const equalBounds = app.validateTimeEntry({
        activityId: 'act-1', startTimestamp: 2000, endTimestamp: 2000
    });
    assert.equal(equalBounds.valid, false);
    assert.equal(equalBounds.error, 'startBeforeEnd');

    const excessiveDuration = app.validateTimeEntry({
        activityId: 'act-1', startTimestamp: 1000, endTimestamp: 1000 + 25 * 60 * 60 * 1000
    });
    assert.equal(excessiveDuration.valid, false);
    assert.equal(excessiveDuration.error, 'durationTooLong');

    await assert.rejects(async () => {
        await app.addEntry({
            activityId: 'act-1',
            startTimestamp: 2000,
            endTimestamp: 1000
        });
    }, /Invalid entry: startBeforeEnd/);
});

test('Task 2: Full export/import preserves all extended review fields without data loss', async () => {
    const { app, storageData } = createTestApp();

    const entry = await app.addEntry({
        activityId: 'act-1',
        activityNameSnapshot: 'Painting',
        startTimestamp: 1770000000000,
        endTimestamp: 1770003600000,
        notes: 'Two coats applied',
        project: 'Hotel Renovation',
        service: 'Painting',
        source: 'manual',
        syncStatus: 'synced',
        clockodoEntryId: 998877,
        clockodoSyncedAt: 1770004000000
    });

    const exported = await app.storage.exportAll();
    assert.equal(exported.timeEntries.length, 1);
    assert.equal(exported.timeEntries[0].notes, 'Two coats applied');
    assert.equal(exported.timeEntries[0].project, 'Hotel Renovation');
    assert.equal(exported.timeEntries[0].service, 'Painting');
    assert.equal(exported.timeEntries[0].clockodoEntryId, 998877);
    assert.equal(exported.timeEntries[0].isEdited, false);

    // Now restore into a fresh instance
    const { app: freshApp } = createTestApp();
    await freshApp.storage.importAll(exported);
    await freshApp.loadTimeEntries();

    assert.equal(freshApp.timeEntries.length, 1);
    const restored = freshApp.timeEntries[0];
    assert.equal(restored.notes, 'Two coats applied');
    assert.equal(restored.project, 'Hotel Renovation');
    assert.equal(restored.service, 'Painting');
    assert.equal(restored.clockodoEntryId, 998877);
    assert.equal(restored.syncStatus, 'synced');
    assert.equal(restored.clockodoSyncedAt, 1770004000000);
    assert.equal(restored.isEdited, false);
});

test('manual backup downloads a valid, restorable file without credentials', async () => {
    const activity = { id: 'backup-activity', name: 'Planning', color: '#245A45', position: 0 };
    const { app, storageData, toasts, backupCapture, context } = createTestApp({
        activities: [activity],
        settings: {
            theme: 'dark', clockodoEmail: 'person@example.test', clockodoApiKey: 'must-not-export',
            timerhubClockodoAccessToken: 'private-token-value', customPassword: 'never-export-this'
        }
    });
    const entry = await app.addEntry({
        id: 'backup-entry', activityId: activity.id, activityNameSnapshot: activity.name,
        startTimestamp: 1770000000000, endTimestamp: 1770003600000, notes: 'Planning session'
    });
    storageData.timeEntries = [entry];

    const repository = vm.runInContext('new StorageRepository()', context);
    const rows = {
        activities: [activity], timeEntries: [entry], syncBatches: [], layout: [],
        settings: Object.entries(storageData.settings).map(([key, value]) => ({ key, value }))
    };
    repository.db = {
        transaction(storeNames) {
            const storeName = storeNames[0];
            return {
                objectStore() {
                    return {
                        getAll() {
                            const request = {};
                            queueMicrotask(() => {
                                request.result = structuredClone(rows[storeName]);
                                request.onsuccess?.();
                            });
                            return request;
                        }
                    };
                }
            };
        }
    };
    app.storage = repository;

    await app.backupData();

    assert.equal(backupCapture.clicks, 1, 'the backup button must trigger an actual download');
    assert.match(backupCapture.filename, /^timerhub_backup_\d{8}_\d{6}\.json$/);
    assert.deepEqual(toasts, [app.t('backupSuccess')]);
    const content = await backupCapture.blob.text();
    const generated = JSON.parse(content);
    assert.equal(generated.format, 'timerhub-backup');
    assert.equal(generated.version, 1);
    assert.equal(generated.activities[0].id, activity.id);
    assert.equal(generated.timeEntries[0].id, entry.id);
    assert.equal(content.includes('must-not-export'), false);
    assert.equal(content.includes('person@example.test'), false);
    assert.equal(content.includes('private-token-value'), false);
    assert.equal(content.includes('never-export-this'), false);

    const { context: restoreContext } = createTestApp();
    const restored = vm.runInContext('new StorageRepository()', restoreContext);
    const restoreHarness = createIndexedDbHarness();
    restored.db = restoreHarness.db;
    await restored.importAll(generated);
    assert.equal((await restored.getActivities())[0].id, activity.id);
    assert.equal((await restored.getTimeEntries())[0].id, entry.id);
    assert.equal(await restored.getSetting('theme', ''), 'dark');
    assert.equal(restoreHarness.data.settings.has('clockodoEmail'), false);
    assert.equal(restoreHarness.data.settings.has('clockodoApiKey'), false);
});

test('successful repository mutations snapshot locally, safely, and without recursion', async () => {
    const { context } = createTestApp();
    const repository = vm.runInContext('new StorageRepository()', context);
    const harness = createIndexedDbHarness();
    repository.db = harness.db;
    harness.data.settings.set('clockodoApiKey', 'must-not-be-snapshotted');
    harness.data.settings.set('theme', 'dark');

    await repository.saveActivity({ id: 'first', name: 'Work' });
    await repository.saveActivity({ id: 'second', name: 'Break' });

    const snapshots = await repository.getAutomaticSnapshots();
    assert.equal(snapshots.length, 2);
    assert.equal(snapshots[0].format, 'timerhub-snapshot');
    assert.equal(snapshots[0].version, 1);
    assert.equal(snapshots[0].data.activities.length, 2);
    assert.equal(JSON.stringify(snapshots).includes('must-not-be-snapshotted'), false);
    assert.equal(harness.stats.snapshotTransactions, 2, 'snapshot writes must not recursively snapshot themselves');
});

test('failed writes do not snapshot; reads and unsaved form typing do not snapshot', async () => {
    const { app, context, document } = createTestApp();
    const repository = vm.runInContext('new StorageRepository()', context);
    const harness = createIndexedDbHarness();
    repository.db = harness.db;
    app.storage = repository;

    document.getElementById('clockodoApiKeyInput').value = 'typing only';
    await repository.getActivities();
    assert.equal(harness.stats.snapshotTransactions, 0);
    assert.equal(harness.data.snapshots.size, 0);

    harness.stats.failMutation = true;
    await assert.rejects(() => repository.saveActivity({ id: 'failed', name: 'Not saved' }));
    assert.equal(harness.stats.snapshotTransactions, 0);
    assert.equal(harness.data.snapshots.size, 0);
});

test('automatic snapshots retain only the latest 20 and restore through the normal import path', async () => {
    const { context } = createTestApp();
    const repository = vm.runInContext('new StorageRepository()', context);
    const harness = createIndexedDbHarness();
    repository.db = harness.db;

    for (let i = 0; i < 22; i += 1) {
        await repository.saveActivity({ id: `activity-${i}`, name: `Activity ${i}` });
    }
    const snapshots = await repository.getAutomaticSnapshots();
    assert.equal(snapshots.length, 20);
    assert.equal(snapshots.at(-1).data.activities.length, 3, 'the two oldest snapshots should be rotated out');
    assert.equal(snapshots[0].data.activities.length, 22);

    const latestData = snapshots[0].data;
    const freshHarness = createIndexedDbHarness();
    const restored = vm.runInContext('new StorageRepository()', context);
    restored.db = freshHarness.db;
    await restored.importAll(latestData, false);
    assert.equal((await restored.getActivities()).length, 22);
    assert.equal((await restored.getAutomaticSnapshots()).length, 1);
});

test('activity canvas positions and dimensions persist independently and may overlap', async () => {
    const { context } = createTestApp();
    const harness = createIndexedDbHarness();
    const repository = vm.runInContext('new StorageRepository()', context);
    repository.db = harness.db;

    const first = { activityId: 'canvas-one', x: 140, y: 90, width: 310, height: 180 };
    const second = { activityId: 'canvas-two', x: 140, y: 90, width: 220, height: 130 };
    await repository.saveLayout(first);
    await repository.saveLayout(second);

    const reloadedRepository = vm.runInContext('new StorageRepository()', context);
    reloadedRepository.db = harness.db;
    const layouts = await reloadedRepository.getLayout();
    assert.deepEqual(layouts.find(item => item.activityId === first.activityId), first);
    assert.deepEqual(layouts.find(item => item.activityId === second.activityId), second);
    assert.equal(layouts[0].x, layouts[1].x);
    assert.equal(layouts[0].y, layouts[1].y);
});

test('canvas taps start the timer; movement and resize gestures only save their final layout', async () => {
    const { app, context, localStorageData } = createTestApp();
    context.CSS = { escape: value => value };
    const children = [];
    const makeElement = (className = '') => {
        const handlers = new Map();
        const classes = new Set(className.split(/\s+/).filter(Boolean));
        const element = {
            className,
            dataset: {},
            style: { setProperty() {} },
            children: [],
            hidden: false,
            classList: {
                add(value) { classes.add(value); },
                remove(value) { classes.delete(value); },
                contains(value) { return classes.has(value) || element.className.split(/\s+/).includes(value); },
                toggle(value, enabled) { enabled ? classes.add(value) : classes.delete(value); }
            },
            setAttribute() {},
            append(...items) { this.children.push(...items); },
            appendChild(item) { this.children.push(item); return item; },
            replaceChildren(...items) { this.children = items; },
            addEventListener(type, handler) { handlers.set(type, handler); },
            setPointerCapture() {},
            closest(selector) {
                return (selector === '.activity-btn' && this.className.split(/\s+/).includes('activity-btn')) ||
                    (selector === '.activity-resize-handle' && this.className.split(/\s+/).includes('activity-resize-handle')) ? this : null;
            },
            get handlers() { return handlers; }
        };
        return element;
    };
    const viewport = makeElement();
    viewport.dataset = {};
    const stage = makeElement();
    stage.querySelector = selector => {
        const isHandle = selector.startsWith('.activity-resize-handle');
        return children.find(child => child.classList.contains(isHandle ? 'activity-resize-handle' : 'activity-btn')) || null;
    };
    stage.appendChild = item => { children.push(item); return item; };
    stage.replaceChildren = () => { children.length = 0; };
    const status = makeElement();
    const filter = makeElement();
    filter.value = '';
    const originalGetById = context.document.getElementById;
    context.document.getElementById = id => ({
        activityCanvasViewport: viewport, activitiesGrid: stage, timerRunningStatus: status, logActivityFilter: filter
    })[id] || originalGetById(id);
    context.document.querySelector = selector => stage.querySelector(selector);
    context.document.createElement = tag => makeElement(tag === 'button' ? '' : tag);

    const activity = { id: 'canvas-tap', name: 'Focus', position: 0, size: 'medium', color: '#ffffff', shape: 'circle' };
    app.activities = [activity];
    app.activityLayouts = new Map([[activity.id, { activityId: activity.id, x: 140, y: 90, width: 260, height: 150 }]]);
    const savedLayouts = [];
    app.storage = { async saveLayout(layout) { savedLayouts.push(structuredClone(layout)); } };
    let timerStarts = 0;
    app.toggleActivity = async id => { timerStarts += 1; app.activeActivityId = id; };
    app.getActiveDuration = () => 0;
    app.formatDuration = () => '00:00';
    app.setupActivityCanvasInteractions();
    app.renderMain();
    assert.equal(status.hidden, true, 'the idle prompt stays hidden when an activity exists');

    const pointer = (type, target, x, y) => viewport.handlers.get(type)?.({
        isPrimary: true, pointerType: 'mouse', button: 0, pointerId: 1, clientX: x, clientY: y, target,
        preventDefault() {}
    });

    let button = children.find(child => child.classList.contains('activity-btn'));
    pointer('pointerdown', button, 10, 10);
    pointer('pointermove', button, 12, 12);
    pointer('pointerup', button, 12, 12);
    assert.equal(savedLayouts.length, 0, 'a tap or sub-threshold movement is not a layout edit');
    await button.handlers.get('click')();
    assert.equal(timerStarts, 1, 'a normal tap keeps the one-tap timer action');
    assert.equal(status.hidden, false, 'the active timer state is visible');

    app.activeActivityId = null;
    app.renderMain();
    button = children.find(child => child.classList.contains('activity-btn'));
    pointer('pointerdown', button, 10, 10);
    pointer('pointermove', button, 30, 36);
    pointer('pointermove', button, 44, 51);
    assert.equal(savedLayouts.length, 0, 'pointer movement does not write layout or snapshots');
    pointer('pointerup', button, 44, 51);
    assert.equal(savedLayouts.length, 1, 'the final node position is persisted once');
    assert.deepEqual(savedLayouts[0], { activityId: activity.id, x: 174, y: 131, width: 260, height: 150 });
    await button.handlers.get('click')();
    assert.equal(timerStarts, 1, 'a drag cannot accidentally start the timer');

    app.renderMain();
    const resize = children.find(child => child.classList.contains('activity-resize-handle'));
    pointer('pointerdown', resize, 0, 0);
    pointer('pointermove', resize, 50, 30);
    pointer('pointerup', resize, 50, 30);
    assert.equal(savedLayouts.length, 2);
    assert.deepEqual(savedLayouts[1], { activityId: activity.id, x: 174, y: 131, width: 310, height: 180 });
    assert.equal(timerStarts, 1, 'resizing cannot start the timer');

    pointer('pointerdown', viewport, 0, 0);
    pointer('pointermove', viewport, 35, 25);
    pointer('pointerup', viewport, 35, 25);
    assert.equal(savedLayouts.length, 2, 'panning does not create activity layout mutations');
    assert.ok(localStorageData.has('timerhubActivityCanvasView'), 'the viewport returns to its panned position after reload');
    assert.deepEqual([app.readCanvasPan().x, app.readCanvasPan().y], [35, 25]);
});

test('automatic snapshot failures are observable but do not fail saved user data', async () => {
    const { context } = createTestApp();
    const repository = vm.runInContext('new StorageRepository()', context);
    const harness = createIndexedDbHarness();
    repository.db = harness.db;
    harness.stats.failSnapshot = true;
    context.console.warn = () => {};

    const activity = { id: 'kept', name: 'Saved despite snapshot failure' };
    await repository.saveActivity(activity);

    assert.equal((await repository.getActivities())[0].id, activity.id);
    assert.equal(repository.snapshotStatus, 'failed');
    assert.equal(harness.data.snapshots.size, 0);
});

test('restore requires a clear merge or replace choice; cancelling performs no mutation', async () => {
    const { app, toasts } = createTestApp();
    const choices = [];
    app.storage.validateBackupData = data => data;
    app.storage.importAll = async (_data, merge) => choices.push(merge);
    app.loadActivities = async () => {};
    app.loadTimeEntries = async () => {};
    app.renderAll = () => {};
    app.refreshAutomaticBackupStatus = async () => {};
    const payload = { format: 'timerhub-backup', version: 1, activities: [], timeEntries: [], settings: {} };

    app.openRestoreConfirmation(payload);
    app.cancelPendingRestore();
    assert.deepEqual(choices, []);
    assert.equal(app.pendingRestoreData, null);

    app.openRestoreConfirmation(payload);
    assert.equal(await app.restorePendingData(true), true);
    app.openRestoreConfirmation(payload);
    assert.equal(await app.restorePendingData(false), true);
    assert.deepEqual(choices, [true, false]);
    assert.deepEqual(toasts, [app.t('restoreSuccess'), app.t('restoreSuccess')]);
});

test('Task 9: Clockodo secret visibility label follows the selected locale dynamically', () => {
    const { app, document } = createTestApp();
    const input = document.getElementById('clockodoApiKeyInput');
    const toggle = document.getElementById('clockodoToggleKeyBtn');

    for (const language of ['en', 'de', 'ru']) {
        app.currentLanguage = language;
        input.type = 'password';
        app.refreshTranslatedDynamicText();
        assert.equal(toggle.textContent, app.t('showSecret'));
        app.toggleClockodoKeyVisibility();
        assert.equal(toggle.textContent, app.t('hideSecret'));
        app.refreshTranslatedDynamicText();
        assert.equal(toggle.textContent, app.t('hideSecret'));
    }
});

test('Task 10: confirmation submit control invokes the guarded confirm-and-sync flow', () => {
    assert.match(source, /sel\('syncConfirmSubmitBtn'\)\?\.addEventListener\('click', \(\) => this\.confirmAndSyncClockodo\(\)\)/);
    assert.match(source, /async confirmAndSyncClockodo\(\)\s*\{\s*if \(!this\.syncConfirmationOpen\) return false;/);
});

function makeClockodoReferenceClient({ customers = [], services = [], failCode = null } = {}) {
    const state = { customerCalls: 0, serviceCalls: 0 };
    return {
        state,
        async getCustomers() {
            state.customerCalls += 1;
            if (failCode) throw Object.assign(new Error('safe failure'), { code: failCode });
            return { customers };
        },
        async getServices() {
            state.serviceCalls += 1;
            if (failCode) throw Object.assign(new Error('safe failure'), { code: failCode });
            return { services };
        }
    };
}

test('Clockodo reference data loads once, caches, and reports unconfigured state', async () => {
    const client = makeClockodoReferenceClient({
        customers: [{ id: 5, name: 'Beta', active: true }, { id: 3, name: 'Alpha', active: false }],
        services: [{ id: 9, name: 'Repair', active: true }]
    });
    const { app } = createTestApp({ clockodoClient: client });
    app.clockodoConfigured = true;

    assert.equal(await app.loadClockodoReferenceData(), true);
    assert.equal(app.clockodoReferenceStatus, 'ready');
    assert.deepEqual(app.clockodoCustomers.map(item => item.id), [5, 3]);
    assert.deepEqual(app.clockodoServices.map(item => item.name), ['Repair']);
    assert.equal(client.state.customerCalls, 1);

    assert.equal(await app.loadClockodoReferenceData(), true);
    assert.equal(client.state.customerCalls, 1, 'cached data must not be fetched twice');

    assert.equal(await app.loadClockodoReferenceData({ force: true }), true);
    assert.equal(client.state.customerCalls, 2);

    app.clockodoConfigured = false;
    assert.equal(await app.loadClockodoReferenceData(), false);
    assert.equal(app.clockodoReferenceStatus, 'unconfigured');
    assert.equal(app.clockodoCustomers.length, 0);
});

test('Clockodo reference data failures are surfaced without throwing', async () => {
    const client = makeClockodoReferenceClient({ failCode: 'invalid_credentials' });
    const { app } = createTestApp({ clockodoClient: client });
    app.clockodoConfigured = true;

    assert.equal(await app.loadClockodoReferenceData(), false);
    assert.equal(app.clockodoReferenceStatus, 'error');
    assert.equal(app.clockodoReferenceError, 'invalid_credentials');
    assert.match(app.clockodoAssignmentHint(), /Clockodo rejected these credentials/);
});

function clockodoComboboxLabels(app, document, context, fieldName) {
    const ids = app.clockodoComboboxIds(context, fieldName);
    return document.getElementById(ids.list).children.map(item => item.textContent);
}

test('Clockodo assignment fields render saved IDs, fallbacks, and unconfigured states', () => {
    const { app, document } = createTestApp();
    app.clockodoReferenceStatus = 'ready';
    app.clockodoCustomers = [{ id: 3, name: 'Alpha', active: false }, { id: 5, name: 'Beta', active: true }];
    app.clockodoServices = [{ id: 9, name: 'Repair', active: true }];

    app.populateClockodoAssignmentSelects('activity', '5', '9', 'Beta', 'Repair');
    const customerHidden = document.getElementById('activityCustomerSelect');
    const customerInput = document.getElementById('activityCustomerInput');
    const serviceHidden = document.getElementById('activityServiceSelect');
    const serviceInput = document.getElementById('activityServiceInput');
    assert.equal(customerHidden.value, '5');
    assert.equal(serviceHidden.value, '9');
    assert.equal(customerInput.value, 'Beta');
    assert.equal(serviceInput.value, 'Repair');
    assert.equal(customerInput.disabled, false);
    assert.equal(customerInput.placeholder, 'No Clockodo assignment');

    app.openClockodoCombobox('activity', 'customer');
    assert.deepEqual(
        clockodoComboboxLabels(app, document, 'activity', 'customer'),
        ['No Clockodo assignment', 'Beta', 'Alpha'],
        'the current selection is shown first'
    );
    app.closeClockodoCombobox();

    app.populateClockodoAssignmentSelects('entry');
    const entryCustomerHidden = document.getElementById('entryEditCustomerSelect');
    const entryCustomerInput = document.getElementById('entryEditCustomerInput');
    assert.equal(entryCustomerHidden.value, '');
    assert.equal(entryCustomerInput.value, '');
    assert.equal(entryCustomerInput.disabled, false);

    app.clockodoReferenceStatus = 'unconfigured';
    app.populateClockodoAssignmentSelects('entry', '7', '9', 'Removed customer', 'Repair');
    assert.equal(entryCustomerInput.disabled, true);
    assert.equal(entryCustomerInput.value, 'Removed customer');
    assert.equal(entryCustomerHidden.value, '7');
    assert.match(entryCustomerInput.placeholder, /not configured/);
    assert.equal(app.clockodoCombobox, null);
});

test('Clockodo combobox filters by partial name, is case-insensitive, and selects IDs', () => {
    const { app, document } = createTestApp();
    app.clockodoReferenceStatus = 'ready';
    app.clockodoCustomers = [
        { id: 11, name: 'Bauunternehmen Müller', active: true },
        { id: 12, name: 'Elektro Schmidt', active: true },
        { id: 13, name: 'Bauunternehmen Müller', active: false }
    ];
    app.clockodoServices = [
        { id: 21, name: 'Rohbauarbeiten', active: true },
        { id: 22, name: 'Elektroinstallation', active: true }
    ];
    app.populateClockodoAssignmentSelects('entry');

    const customerInput = document.getElementById('entryEditCustomerInput');
    const customerHidden = document.getElementById('entryEditCustomerSelect');
    const customerList = document.getElementById('entryEditCustomerList');

    app.openClockodoCombobox('entry', 'customer');
    assert.deepEqual(clockodoComboboxLabels(app, document, 'entry', 'customer'), [
        'No Clockodo assignment',
        'Bauunternehmen Müller (#11)',
        'Elektro Schmidt',
        'Bauunternehmen Müller (#13)'
    ]);

    customerInput.value = 'BAU';
    app.applyClockodoAssignmentInput('entry', 'customer');
    assert.deepEqual(clockodoComboboxLabels(app, document, 'entry', 'customer'), [
        'No Clockodo assignment',
        'Bauunternehmen Müller (#11)',
        'Bauunternehmen Müller (#13)'
    ]);
    assert.equal(customerHidden.value, '', 'partial text does not set the ID');

    customerInput.value = 'elektro';
    app.applyClockodoAssignmentInput('entry', 'customer');
    assert.deepEqual(clockodoComboboxLabels(app, document, 'entry', 'customer'), [
        'No Clockodo assignment',
        'Elektro Schmidt'
    ]);

    app.selectClockodoComboboxOption('entry', 'customer', app.clockodoCombobox.options[1]);
    assert.equal(customerHidden.value, '12');
    assert.equal(customerInput.value, 'Elektro Schmidt');
    assert.equal(app.clockodoCombobox, null);
    assert.equal(customerList.hidden, true);

    const serviceInput = document.getElementById('entryEditServiceInput');
    const serviceHidden = document.getElementById('entryEditServiceSelect');
    serviceInput.value = 'roh';
    app.applyClockodoAssignmentInput('entry', 'service');
    assert.deepEqual(clockodoComboboxLabels(app, document, 'entry', 'service'), [
        'No Clockodo assignment',
        'Rohbauarbeiten'
    ]);
    app.selectClockodoComboboxOption('entry', 'service', app.clockodoCombobox.options[1]);
    assert.equal(serviceHidden.value, '21');
    assert.equal(serviceInput.value, 'Rohbauarbeiten');

    app.openClockodoCombobox('entry', 'customer');
    const tappedOption = { dataset: { optionIndex: '2' } };
    app.onClockodoComboboxListClick('entry', 'customer', { target: { closest: () => tappedOption } });
    assert.equal(customerHidden.value, '11', 'tapping an option stores its ID');
    assert.equal(customerInput.value, 'Bauunternehmen Müller (#11)');

    customerInput.value = '';
    app.applyClockodoAssignmentInput('entry', 'customer');
    assert.equal(customerHidden.value, '', 'clearing the text clears the ID');
    assert.equal(clockodoComboboxLabels(app, document, 'entry', 'customer')[0], 'No Clockodo assignment');
    app.selectClockodoComboboxOption('entry', 'customer', app.clockodoCombobox.options[0]);
    assert.equal(customerHidden.value, '');
    assert.equal(customerInput.value, '');
});

test('Clockodo combobox supports keyboard navigation and escape', () => {
    const { app, document } = createTestApp();
    app.clockodoReferenceStatus = 'ready';
    app.clockodoCustomers = [{ id: 3, name: 'Alpha' }, { id: 5, name: 'Beta' }];
    app.clockodoServices = [];
    app.populateClockodoAssignmentSelects('entry');
    const input = document.getElementById('entryEditCustomerInput');
    const hidden = document.getElementById('entryEditCustomerSelect');
    const list = document.getElementById('entryEditCustomerList');
    const press = key => {
        const event = { key, preventDefault() { event.defaultPrevented = true; } };
        app.onClockodoComboboxKeydown('entry', 'customer', event);
        return event;
    };

    press('ArrowDown');
    assert.ok(app.clockodoCombobox, 'ArrowDown opens the dropdown');
    assert.equal(app.clockodoCombobox.activeIndex, 0);
    press('ArrowDown');
    assert.equal(app.clockodoCombobox.activeIndex, 1);
    const enter = press('Enter');
    assert.equal(enter.defaultPrevented, true);
    assert.equal(hidden.value, '3');
    assert.equal(input.value, 'Alpha');
    assert.equal(app.clockodoCombobox, null);

    press('ArrowDown');
    assert.equal(app.clockodoCombobox.activeIndex, 1, 'the selected option starts highlighted');
    const escape = press('Escape');
    assert.equal(escape.defaultPrevented, true);
    assert.equal(app.clockodoCombobox, null);
    assert.equal(list.hidden, true);
});

test('Clockodo combobox preserves prefixes while typing and normalizes on blur', () => {
    const { app, document } = createTestApp();
    app.clockodoReferenceStatus = 'ready';
    app.clockodoCustomers = [
        { id: 3, name: 'Alpha', active: true },
        { id: 4, name: 'Alpha 2', active: true }
    ];
    app.populateClockodoAssignmentSelects('entry');
    const input = document.getElementById('entryEditCustomerInput');
    const hidden = document.getElementById('entryEditCustomerSelect');

    input.value = 'Alpha';
    app.applyClockodoAssignmentInput('entry', 'customer');
    assert.equal(hidden.value, '3', 'an exact name resolves live');
    assert.equal(input.value, 'Alpha', 'a prefix of another name is not rewritten');
    app.normalizeClockodoComboboxText('entry', 'customer');
    assert.equal(input.value, 'Alpha');

    input.value = 'ALPHA 2';
    app.applyClockodoAssignmentInput('entry', 'customer');
    assert.equal(hidden.value, '4');
    app.normalizeClockodoComboboxText('entry', 'customer');
    assert.equal(input.value, 'Alpha 2');

    input.value = 'zzz';
    app.applyClockodoAssignmentInput('entry', 'customer');
    assert.equal(hidden.value, '');
    app.normalizeClockodoComboboxText('entry', 'customer');
    assert.equal(input.value, '', 'unmatched text is cleared on blur');
});

test('activity Clockodo assignments persist across create and edit', async () => {
    const { app, document } = createTestApp();
    app.clockodoReferenceStatus = 'ready';
    app.clockodoCustomers = [{ id: 5, name: 'Beta', active: true }];
    app.clockodoServices = [{ id: 9, name: 'Repair', active: true }];
    app.renderMain = () => {};
    app.generateId = () => 'activity-created';
    document.getElementById('activityName').value = 'Painting';
    document.getElementById('activityCustomerSelect').value = '5';
    document.getElementById('activityServiceSelect').value = '9';

    await app.saveActivity();
    const created = app.activities.find(item => item.id === 'activity-created');
    assert.equal(created.customerId, '5');
    assert.equal(created.serviceId, '9');
    assert.equal(created.customerName, 'Beta');
    assert.equal(created.serviceName, 'Repair');

    app.editingActivityId = 'activity-created';
    document.getElementById('activityCustomerSelect').value = '5';
    document.getElementById('activityServiceSelect').value = '9';
    await app.saveActivity();
    const edited = app.activities.find(item => item.id === 'activity-created');
    assert.equal(edited.customerId, '5');
    assert.equal(edited.serviceId, '9');
});

test('time entries inherit activity Clockodo assignments and editable logs keep their selection', async () => {
    const legacyEntry = {
        id: 'legacy-entry', activityId: 'act-1', activityNameSnapshot: 'Painting',
        startTimestamp: new Date(2026, 0, 5, 8, 0).getTime(),
        endTimestamp: new Date(2026, 0, 5, 9, 0).getTime()
    };
    const { app, document } = createTestApp({ timeEntries: [legacyEntry] });
    await app.loadTimeEntries();
    assert.equal(app.timeEntries[0].customerId, null);
    assert.equal(app.timeEntries[0].serviceId, null);

    app.activities = [{
        id: 'act-1', name: 'Painting', customerId: '5', serviceId: '9',
        customerName: 'Beta', serviceName: 'Repair'
    }];
    const timerEntry = await app.addEntry({
        activityId: 'act-1', activityNameSnapshot: 'Painting',
        startTimestamp: new Date(2026, 0, 6, 8, 0).getTime(),
        endTimestamp: new Date(2026, 0, 6, 9, 0).getTime()
    });
    assert.equal(timerEntry.customerId, '5');
    assert.equal(timerEntry.serviceId, '9');
    assert.equal(timerEntry.customerName, 'Beta');

    const overridden = await app.addEntry({
        activityId: 'act-1', activityNameSnapshot: 'Painting',
        startTimestamp: new Date(2026, 0, 6, 10, 0).getTime(),
        endTimestamp: new Date(2026, 0, 6, 11, 0).getTime(),
        customerId: '7'
    });
    assert.equal(overridden.customerId, '7');
    assert.equal(overridden.serviceId, '9');

    app.clockodoReferenceStatus = 'ready';
    app.clockodoCustomers = [{ id: 5, name: 'Beta', active: true }];
    app.clockodoServices = [{ id: 9, name: 'Repair', active: true }];
    app.renderLog = () => {};
    app.renderReview = () => {};
    document.getElementById('entryEditDate').value = '2026-01-05';
    document.getElementById('entryEditStart').value = '08:00';
    document.getElementById('entryEditEndDate').value = '2026-01-05';
    document.getElementById('entryEditEnd').value = '09:00';
    document.getElementById('entryEditActivity').value = 'act-1';
    document.getElementById('entryEditProject').value = '';
    document.getElementById('entryEditService').value = '';
    document.getElementById('entryEditNotes').value = 'Updated';
    document.getElementById('entryEditCustomerSelect').value = '5';
    document.getElementById('entryEditServiceSelect').value = '9';
    app.editingEntryId = 'legacy-entry';

    await app.saveTimeEntry();
    const edited = app.timeEntries.find(item => item.id === 'legacy-entry');
    assert.equal(edited.customerId, '5');
    assert.equal(edited.serviceId, '9');
    assert.equal(edited.customerName, 'Beta');
    assert.equal(edited.serviceName, 'Repair');
    assert.equal(edited.notes, 'Updated');
});

test('synchronization sends the per-entry Clockodo assignment instead of the configured default', async () => {
    const { app, context } = createTestApp();
    vm.runInContext(clockodoClientSource, context);
    const start = new Date(2026, 8, 28, 8, 0).getTime();
    await app.addEntry({
        id: 'assigned-entry', activityId: 'act-1', activityNameSnapshot: 'Painting',
        startTimestamp: start, endTimestamp: start + 60 * 60 * 1000,
        customerId: '77', serviceId: '88'
    });
    app.reviewDate = '2026-09-28';
    app.clockodoConfigured = true;
    app.clockodoCustomerId = '12';
    app.clockodoProjectId = '34';
    app.clockodoServiceId = '56';
    app.showToast = () => {};
    app.renderReview = () => {};
    app.getPushClientId = () => 'client_1234567890abcdef';
    app.getClockodoAccessToken = () => 'a'.repeat(48);
    const sent = [];
    app.clockodoClient = new context.ClockodoClient({
        fetchImpl: async (url, init) => {
            sent.push({ url, body: JSON.parse(init.body) });
            return { status: 200, ok: true, json: async () => ({ created: true, entryId: 901 }) };
        }
    });

    app.showSyncConfirmationModal();
    const batch = await app.confirmAndSyncClockodo();
    assert.equal(batch.state, 'synced');
    assert.equal(sent.length, 1);
    assert.equal(sent[0].body.customers_id, 77);
    assert.equal(sent[0].body.services_id, 88);
    assert.equal(sent[0].body.projects_id, 34);
});

test('Clockodo error messages surface safe rejection details with localized fallback', () => {
    const { app } = createTestApp();
    assert.equal(
        app.clockodoErrorMessage({ code: 'clockodo_rejected', details: { status: 422, message: 'Service is not available for this customer.' } }),
        'Clockodo rejected the entry (422): Service is not available for this customer.'
    );
    assert.equal(
        app.clockodoErrorMessage({ code: 'clockodo_rejected', details: { message: 'Missing required field' } }),
        'Clockodo rejected the entry: Missing required field'
    );
    assert.equal(
        app.clockodoErrorMessage({ code: 'clockodo_rejected', details: { status: 400 } }),
        'Clockodo rejected the entry (400).'
    );
    assert.equal(
        app.clockodoErrorMessage({ code: 'clockodo_rejected', details: { status: 400, fields: ['services_id', 'customers_id'] } }),
        'Clockodo rejected the entry (400): services_id, customers_id'
    );
    assert.equal(
        app.clockodoErrorMessage({ code: 'clockodo_rejected' }),
        app.t('clockodoRequestRejected')
    );
    assert.equal(
        app.clockodoErrorMessage({ code: 'invalid_credentials' }),
        app.t('clockodoInvalidCredentials')
    );
    assert.equal(
        app.clockodoErrorMessage({ code: 'clockodo_outcome_unknown', details: { status: 503, message: 'upstream down' } }),
        app.t('syncOutcomeUnknown'),
        'uncertain outcomes keep their warning instead of Clockodo details'
    );

    app.currentLanguage = 'de';
    assert.match(
        app.clockodoErrorMessage({ code: 'clockodo_rejected', details: { status: 422, message: 'Fehler' } }),
        /^Clockodo hat den Eintrag abgelehnt \(422\): Fehler$/
    );
    app.currentLanguage = 'ru';
    assert.match(
        app.clockodoErrorMessage({ code: 'clockodo_rejected', details: { status: 422, message: 'Ошибка' } }),
        /^Clockodo отклонил запись \(422\): Ошибка$/
    );
});

test('sync failures persist safe rejection details and show them in the toast', async () => {
    const { app, storageData } = createTestApp();
    const start = new Date(2026, 8, 28, 8, 0).getTime();
    await app.addEntry({
        id: 'rejected-entry', activityId: 'act-1', activityNameSnapshot: 'Painting',
        startTimestamp: start, endTimestamp: start + 1000
    });
    app.reviewDate = '2026-09-28';
    app.clockodoConfigured = true;
    app.clockodoCustomerId = '12';
    app.clockodoServiceId = '56';
    let toast = null;
    app.showToast = message => { toast = message; };
    app.renderReview = () => {};
    app.clockodoClient = {
        buildEntryPayload: () => ({ customers_id: 12, services_id: 56, time_since: 'a', time_until: 'b', billable: 1 }),
        async createEntry() {
            const error = Object.assign(new Error('rejected'), { code: 'clockodo_rejected' });
            error.details = { status: 422, message: 'Service is not available for this customer.' };
            throw error;
        }
    };

    app.showSyncConfirmationModal();
    const batch = await app.confirmAndSyncClockodo();
    assert.equal(batch.state, 'failed');
    const entry = batch.entries.find(item => item.id === 'rejected-entry');
    assert.equal(entry.clockodoError, 'clockodo_rejected');
    assert.deepEqual(JSON.parse(JSON.stringify(entry.clockodoErrorDetails)), {
        status: 422,
        message: 'Service is not available for this customer.'
    });
    assert.equal(
        toast,
        'Clockodo synchronization failed: Clockodo rejected the entry (422): Service is not available for this customer.'
    );
    const stored = storageData.timeEntries.find(item => item.id === 'rejected-entry');
    assert.deepEqual(JSON.parse(JSON.stringify(stored.clockodoErrorDetails)), {
        status: 422,
        message: 'Service is not available for this customer.'
    });
});

test('legacy entries without rejection details normalize cleanly and secrets never persist', async () => {
    const legacyEntry = {
        id: 'legacy-error-entry', activityId: 'act-1', activityNameSnapshot: 'Painting',
        startTimestamp: new Date(2026, 8, 28, 8, 0).getTime(),
        endTimestamp: new Date(2026, 8, 28, 9, 0).getTime(),
        syncStatus: 'failed', clockodoError: 'clockodo_rejected'
    };
    const { app, storageData } = createTestApp({ timeEntries: [legacyEntry] });
    await app.loadTimeEntries();
    assert.equal(app.timeEntries[0].clockodoErrorDetails, null);
    assert.equal(
        app.clockodoErrorMessage({ code: app.timeEntries[0].clockodoError, details: app.timeEntries[0].clockodoErrorDetails }),
        app.t('clockodoRequestRejected')
    );

    const withSecret = app.createTimeEntry({
        activityId: 'act-1', startTimestamp: 1, endTimestamp: 2,
        clockodoError: 'clockodo_rejected',
        clockodoErrorDetails: {
            status: 422,
            message: 'Validation failed',
            apiKey: 'never-store-this',
            authorization: 'Bearer never-store-this'
        }
    });
    const normalized = app.normalizeTimeEntry(withSecret);
    assert.equal(JSON.stringify(normalized).includes('never-store-this'), false);
    assert.equal(JSON.stringify(normalized).includes('authorization'), false);
    await app.storage.saveTimeEntry(normalized);
    const persisted = JSON.stringify(storageData.timeEntries);
    assert.equal(persisted.includes('never-store-this'), false);
});

function makeAssignmentClient(sent, failEntryId = null) {
    return {
        buildEntryPayload(entry, config) {
            const idFor = (value, fallback) => {
                const source = /^\d+$/.test(String(value ?? '')) ? value : fallback;
                if (source === null || source === undefined || String(source).trim() === '') return null;
                const parsed = Number(source);
                return Number.isSafeInteger(parsed) && parsed >= 0 ? parsed : null;
            };
            const customerId = idFor(entry.customerId, idFor(config.customerId, null));
            const serviceId = idFor(entry.serviceId, idFor(config.serviceId, null));
            if (!Number.isInteger(customerId) || !Number.isInteger(serviceId)) {
                throw Object.assign(new Error('missing assignment'), { code: 'missing_clockodo_assignment' });
            }
            return { id: entry.id, customers_id: customerId, services_id: serviceId };
        },
        async createEntry(clientId, token, payload, idempotencyKey) {
            sent.push({ payload, idempotencyKey });
            if (failEntryId && payload.id === failEntryId) {
                throw Object.assign(new Error('rejected'), { code: 'clockodo_rejected' });
            }
            return { created: true, entryId: 900 };
        }
    };
}

test('retrying a corrected failed entry uses the refreshed batch IDs', async () => {
    const { app, storageData } = createTestApp();
    const start = new Date(2026, 8, 28, 8, 0).getTime();
    await app.addEntry({
        id: 'retry-fixed', activityId: 'act-1', activityNameSnapshot: 'Painting',
        startTimestamp: start, endTimestamp: start + 60 * 60 * 1000
    });
    app.reviewDate = '2026-09-28';
    app.clockodoConfigured = true;
    app.clockodoCustomerId = '';
    app.clockodoServiceId = '';
    app.showToast = () => {};
    app.renderReview = () => {};
    const sent = [];
    app.clockodoClient = makeAssignmentClient(sent);

    app.showSyncConfirmationModal();
    const failed = await app.confirmAndSyncClockodo();
    assert.equal(failed.state, 'failed');
    assert.equal(sent.length, 0);
    assert.equal(failed.entries[0].customerId, null);
    assert.equal(failed.entries[0].serviceId, null);

    await app.updateEntry('retry-fixed', {
        customerId: '11', serviceId: '21',
        customerName: 'Bauunternehmen Müller', serviceName: 'Rohbau'
    });
    const snapshot = storageData.syncBatches.find(batch => batch.id === failed.id).entries.find(item => item.id === 'retry-fixed');
    assert.equal(snapshot.customerId, '11');
    assert.equal(snapshot.serviceId, '21');
    assert.equal(snapshot.syncStatus, 'failed');

    const retried = await app.retrySyncBatch(failed.id);
    assert.equal(retried.state, 'synced');
    assert.equal(sent.length, 1);
    assert.deepEqual(JSON.parse(JSON.stringify(sent[0].payload)), { id: 'retry-fixed', customers_id: 11, services_id: 21 });
    assert.equal(sent[0].idempotencyKey, 'timerhub-entry:retry-fixed');
    assert.equal(sent[0].idempotencyKey.startsWith('timerhub-entry:'), true);
    assert.equal(app.timeEntries.find(entry => entry.id === 'retry-fixed').syncStatus, 'synced');
});

test('Confirm & Send after correcting a failed entry uses the refreshed batch IDs', async () => {
    const { app } = createTestApp();
    const start = new Date(2026, 8, 28, 8, 0).getTime();
    await app.addEntry({
        id: 'confirm-fixed', activityId: 'act-1', activityNameSnapshot: 'Painting',
        startTimestamp: start, endTimestamp: start + 60 * 60 * 1000
    });
    app.reviewDate = '2026-09-28';
    app.clockodoConfigured = true;
    app.clockodoCustomerId = '';
    app.clockodoServiceId = '';
    app.showToast = () => {};
    app.renderReview = () => {};
    const sent = [];
    app.clockodoClient = makeAssignmentClient(sent);

    app.showSyncConfirmationModal();
    const failed = await app.confirmAndSyncClockodo();
    assert.equal(failed.state, 'failed');
    assert.equal(sent.length, 0);

    await app.updateEntry('confirm-fixed', { customerId: '11', serviceId: '21' });

    app.showSyncConfirmationModal();
    const synced = await app.confirmAndSyncClockodo();
    assert.equal(synced.state, 'synced');
    assert.equal(synced.id, failed.id, 'the existing failed batch is retried with refreshed data');
    assert.equal(sent.length, 1);
    assert.deepEqual(JSON.parse(JSON.stringify(sent[0].payload)), { id: 'confirm-fixed', customers_id: 11, services_id: 21 });
});

test('refreshing a failed entry leaves synced entries in a partial batch untouched', async () => {
    const { app } = createTestApp();
    const start = new Date(2026, 8, 28, 8, 0).getTime();
    await app.addEntry({ id: 'keep-synced', activityId: 'act-1', activityNameSnapshot: 'Keep', startTimestamp: start, endTimestamp: start + 60 * 60 * 1000 });
    await app.addEntry({ id: 'fix-failed', activityId: 'act-2', activityNameSnapshot: 'Fix', startTimestamp: start + 60 * 60 * 1000, endTimestamp: start + 2 * 60 * 60 * 1000 });
    app.reviewDate = '2026-09-28';
    app.clockodoConfigured = true;
    app.clockodoCustomerId = '12';
    app.clockodoServiceId = '56';
    app.showToast = () => {};
    app.renderReview = () => {};
    const sent = [];
    app.clockodoClient = makeAssignmentClient(sent, 'fix-failed');

    app.showSyncConfirmationModal();
    const partial = await app.confirmAndSyncClockodo();
    assert.equal(partial.state, 'partial');
    const syncedSnapshotBefore = JSON.stringify(app.syncBatches.find(batch => batch.id === partial.id).entries.find(item => item.id === 'keep-synced'));

    await app.updateEntry('fix-failed', { customerId: '11', serviceId: '21' });
    const batch = app.syncBatches.find(item => item.id === partial.id);
    assert.equal(JSON.stringify(batch.entries.find(item => item.id === 'keep-synced')), syncedSnapshotBefore);
    assert.equal(batch.entries.find(item => item.id === 'keep-synced').syncStatus, 'synced');
    const fixed = batch.entries.find(item => item.id === 'fix-failed');
    assert.equal(fixed.customerId, '11');
    assert.equal(fixed.serviceId, '21');
    assert.equal(fixed.syncStatus, 'failed');
});

test('sync falls back to the activity assignment when an entry has no per-entry IDs', async () => {
    const { app, context } = createTestApp();
    vm.runInContext(clockodoClientSource, context);
    app.activities = [{ id: 'act-1', name: 'Painting', customerId: '', serviceId: '', archived: false }];
    const start = new Date(2026, 8, 28, 8, 0).getTime();
    await app.addEntry({
        id: 'late-assignment', activityId: 'act-1', activityNameSnapshot: 'Painting',
        startTimestamp: start, endTimestamp: start + 60 * 1000
    });
    assert.equal(app.timeEntries[0].customerId, null);
    assert.equal(app.timeEntries[0].serviceId, null);

    app.activities[0].customerId = '11';
    app.activities[0].serviceId = '21';
    app.activities[0].customerName = 'Bauunternehmen Müller';
    app.activities[0].serviceName = 'Rohbau';

    app.reviewDate = '2026-09-28';
    app.clockodoConfigured = true;
    app.clockodoCustomerId = '';
    app.clockodoServiceId = '';
    app.showToast = () => {};
    app.renderReview = () => {};
    app.getPushClientId = () => 'client_1234567890abcdef';
    app.getClockodoAccessToken = () => 'a'.repeat(48);
    const sent = [];
    app.clockodoClient = new context.ClockodoClient({
        fetchImpl: async (url, init) => {
            sent.push(JSON.parse(init.body));
            return { status: 200, ok: true, json: async () => ({ created: true, entryId: 901 }) };
        }
    });

    app.showSyncConfirmationModal();
    const batch = await app.confirmAndSyncClockodo();
    assert.equal(batch.state, 'synced');
    assert.equal(sent.length, 1);
    assert.equal(sent[0].customers_id, 11);
    assert.equal(sent[0].services_id, 21);
});

test('retrying after assigning the activity uses the activity IDs', async () => {
    const { app, context } = createTestApp();
    vm.runInContext(clockodoClientSource, context);
    app.activities = [{ id: 'act-1', name: 'Painting', customerId: '', serviceId: '', archived: false }];
    const start = new Date(2026, 8, 28, 9, 0).getTime();
    await app.addEntry({
        id: 'late-retry', activityId: 'act-1', activityNameSnapshot: 'Painting',
        startTimestamp: start, endTimestamp: start + 60 * 1000
    });
    app.reviewDate = '2026-09-28';
    app.clockodoConfigured = true;
    app.clockodoCustomerId = '';
    app.clockodoServiceId = '';
    app.showToast = () => {};
    app.renderReview = () => {};
    app.getPushClientId = () => 'client_1234567890abcdef';
    app.getClockodoAccessToken = () => 'a'.repeat(48);
    const sent = [];
    app.clockodoClient = new context.ClockodoClient({
        fetchImpl: async (url, init) => {
            sent.push(JSON.parse(init.body));
            return { status: 200, ok: true, json: async () => ({ created: true, entryId: 902 }) };
        }
    });

    app.showSyncConfirmationModal();
    const failed = await app.confirmAndSyncClockodo();
    assert.equal(failed.state, 'failed');
    assert.equal(sent.length, 0);

    app.activities[0].customerId = '11';
    app.activities[0].serviceId = '21';

    const retried = await app.retrySyncBatch(failed.id);
    assert.equal(retried.state, 'synced');
    assert.equal(sent.length, 1);
    assert.equal(sent[0].customers_id, 11);
    assert.equal(sent[0].services_id, 21);
    assert.equal(app.timeEntries.find(entry => entry.id === 'late-retry').syncStatus, 'synced');
});
