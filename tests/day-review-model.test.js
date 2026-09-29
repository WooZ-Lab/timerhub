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
                settings: Object.fromEntries(Object.entries(storageData.settings).filter(([key]) => key !== 'clockodoApiKey')),
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
                const safeSettings = Object.fromEntries(Object.entries(data.settings).filter(([key]) => key !== 'clockodoApiKey'));
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
        'syncConfirmEntriesList', 'syncConfirmDesc', 'syncConfirmSummary',
        'syncConfirmAlreadySyncedNotice', 'syncConfirmSubmitBtn', 'syncConfirmModal',
        'clockodoEmailInput', 'clockodoApiKeyInput', 'clockodoCustomerIdInput', 'clockodoProjectIdInput', 'clockodoServiceIdInput', 'clockodoSaveBtn',
        'clockodoBillableSelect', 'clockodoTestBtn', 'clockodoRemoveBtn', 'clockodoStatusValue', 'clockodoToggleKeyBtn'
    ]) {
        elements.set(id, {
            id,
            value: id === 'clockodoBillableSelect' ? 'true' : '',
            type: id === 'clockodoApiKeyInput' ? 'password' : 'text',
            disabled: false,
            innerHTML: '',
            textContent: '',
            dataset: {},
            style: {},
            classList: { add() {}, remove() {} },
            setAttribute() {},
            appendChild() {},
            querySelectorAll: () => [],
            addEventListener() {}
        });
    }
    const testDocument = {
        title: '',
        documentElement: { lang: '' },
        getElementById: id => elements.get(id) || null,
        querySelectorAll: () => [],
        createElement: () => ({ value: '', textContent: '', appendChild() {} })
    };

    const context = vm.createContext({
        window: {
            location: { hostname: 'localhost' },
            addEventListener() {}
        },
        document: testDocument,
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
        setTimeout,
        clearTimeout,
        console,
        Intl
    });

    vm.runInContext(source, context, { filename: 'app.js' });
    const app = vm.runInContext('new TimerHubApp()', context);
    app.storage = mockStorage;
    app.clockodoClient = initialData.clockodoClient || null;
    const toasts = [];
    app.showToast = message => toasts.push(message);
    return { app, storageData, document: testDocument, localStorageData, toasts };
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
