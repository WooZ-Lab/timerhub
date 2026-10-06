import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { webcrypto } from 'node:crypto';
import test from 'node:test';
import vm from 'node:vm';

const source = await readFile(new URL('../app.js', import.meta.url), 'utf8');
const clockodoClientSource = await readFile(new URL('../clockodo-client.js', import.meta.url), 'utf8');
const exchangeSource = await readFile(new URL('../exchange.js', import.meta.url), 'utf8');

function createTestApp(initialData = {}) {
    const storageData = {
        activities: initialData.activities || [],
        timeEntries: initialData.timeEntries || [],
        syncBatches: initialData.syncBatches || [],
        groups: initialData.groups || [],
        layout: initialData.layout || [],
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
        async getGroups() { return structuredClone(storageData.groups); },
        async saveGroup(group) {
            const idx = storageData.groups.findIndex(item => item.id === group.id);
            if (idx >= 0) storageData.groups[idx] = structuredClone(group);
            else storageData.groups.push(structuredClone(group));
            return group;
        },
        async getLayout() { return structuredClone(storageData.layout); },
        async saveLayout(layout) {
            const idx = storageData.layout.findIndex(item => item.activityId === layout.activityId);
            if (idx >= 0) storageData.layout[idx] = structuredClone(layout);
            else storageData.layout.push(structuredClone(layout));
            return layout;
        },
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
        'activitiesGrid', 'timerRunningStatus',
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
        'backupRestoreMergeBtn', 'backupRestoreReplaceBtn', 'backupRestoreCancelBtn', 'backupRestoreCloseBtn',
        'reviewExportDayBtn', 'reviewImportDayBtn', 'dayExportModal', 'dayExportModalTitle', 'exchangeCodeDisplay',
        'exchangeCopyCodeBtn', 'exchangeShowQrBtn', 'dayExportCloseBtn', 'dayExportDoneBtn',
        'dayImportModal', 'dayImportModalTitle', 'exchangeFileInput', 'exchangeChooseFileBtn', 'exchangeFileName',
        'exchangeCodeInput', 'exchangeScanQrBtn', 'exchangeImportError', 'exchangePreview', 'exchangePreviewSummary',
        'exchangePreviewWarnings', 'exchangePreviewList', 'exchangeDecryptBtn', 'exchangeImportBtn',
        'dayImportCloseBtn', 'dayImportCancelBtn', 'exchangeQrModal', 'exchangeQrCanvas',
        'exchangeQrCloseBtn', 'exchangeQrDoneBtn', 'exchangeScanModal', 'exchangeScanVideo', 'exchangeScanStatus',
        'exchangeScanCloseBtn', 'exchangeScanDoneBtn'
    ]) {
        elements.set(id, {
            id,
            value: id === 'clockodoBillableSelect' ? 'true' : '',
            type: id === 'clockodoApiKeyInput' ? 'password' : 'text',
            disabled: false,
            textContent: '',
            dataset: {},
            style: { setProperty(name, value) { this[name] = value; } },
            children: [],
            classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
            setAttribute() {},
            removeAttribute() {},
            focus() {},
            appendChild(child) { this.children.push(child); },
            replaceChildren() { this.children.length = 0; },
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
                value: '', textContent: '', style: { setProperty(name, value) { this[name] = value; } }, dataset: {}, className: '', id: '', hidden: false,
                children: [],
                classList: {
                    add: (...names) => { element.className = `${element.className} ${names.join(' ')}`.trim(); },
                    remove: (...names) => {
                        for (const name of names) element.className = element.className.split(/\s+/).filter(part => part && part !== name).join(' ');
                    },
                    toggle() {},
                    contains: name => element.className.split(/\s+/).includes(name)
                },
                setAttribute(name, value) { this[name] = String(value); },
                removeAttribute(name) { delete this[name]; },
                addEventListener() {},
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
        File,
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
        crypto: {
            randomUUID: () => 'test-uuid-1234',
            getRandomValues: bytes => { bytes.fill(7); return bytes; },
            subtle: webcrypto.subtle
        },
        btoa,
        atob,
        TextEncoder,
        TextDecoder,
        Uint8Array,
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

    vm.runInContext(clockodoClientSource, context, { filename: 'clockodo-client.js' });
    vm.runInContext(exchangeSource, context, { filename: 'exchange.js' });
    vm.runInContext(source, context, { filename: 'app.js' });
    const app = vm.runInContext('new TimerHubApp()', context);
    app.storage = mockStorage;
    app.clockodoClient = initialData.clockodoClient || null;
    const toasts = [];
    app.showToast = message => toasts.push(message);
    return { app, storageData, document: testDocument, localStorageData, toasts, backupCapture, context };
}

function createIndexedDbHarness() {
    const keyPaths = { activities: 'id', timeEntries: 'id', settings: 'key', syncBatches: 'id', layout: 'activityId', snapshots: 'id', groups: 'id' };
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

function createGroupCanvasHarness() {
    const { app, context, storageData } = createTestApp();
    context.CSS = { escape: value => value };
    context.setTimeout = (callback, delay) => setTimeout(callback, delay);
    const viewportBounds = { left: 0, top: 0, width: 800, height: 600 };

    const makeElement = (className = '') => {
        const handlers = new Map();
        const classes = new Set(className.split(/\s+/).filter(Boolean));
        const element = {
            className,
            dataset: {},
            style: { setProperty() {} },
            children: [],
            hidden: false,
            textContent: '',
            parent: null,
            classList: {
                add(value) { classes.add(value); },
                remove(value) { classes.delete(value); },
                contains(value) { return classes.has(value) || element.className.split(/\s+/).includes(value); },
                toggle(value, enabled) {
                    if (enabled === undefined) enabled = !classes.has(value);
                    enabled ? classes.add(value) : classes.delete(value);
                }
            },
            setAttribute(name, value) { this[name] = String(value); },
            append(...items) { for (const item of items) { item.parent = element; element.children.push(item); } },
            appendChild(item) { item.parent = element; element.children.push(item); return item; },
            replaceChildren(...items) { element.children = items; },
            addEventListener(type, handler) { handlers.set(type, handler); },
            setPointerCapture() {},
            closest(selector) {
                const match = /^\.([\w-]+)/.exec(selector);
                let node = element;
                while (node) {
                    if (match && node.classList?.contains(match[1])) return node;
                    node = node.parent;
                }
                return null;
            },
            getBoundingClientRect() {
                const left = Number.parseFloat(element.style.left) || 0;
                const top = Number.parseFloat(element.style.top) || 0;
                const width = Number.parseFloat(element.style.width) || 0;
                const height = Number.parseFloat(element.style.height) || 0;
                const zoom = app.canvasZoom || 1;
                const panX = app.canvasPan?.x || 0;
                const panY = app.canvasPan?.y || 0;
                const boxLeft = viewportBounds.left + panX + left * zoom;
                const boxTop = viewportBounds.top + panY + top * zoom;
                return {
                    left: boxLeft,
                    top: boxTop,
                    width: width * zoom,
                    height: height * zoom,
                    right: boxLeft + width * zoom,
                    bottom: boxTop + height * zoom
                };
            },
            get handlers() { return handlers; }
        };
        return element;
    };

    const viewport = makeElement();
    viewport.dataset = {};
    viewport.getBoundingClientRect = () => viewportBounds;
    const buttons = [];
    const handles = [];
    const containers = [];
    const stage = makeElement();
    stage.querySelector = selector => {
        const id = /data-activity-id="([^"]+)"/.exec(selector)?.[1]
            ?? /data-group-id="([^"]+)"/.exec(selector)?.[1];
        if (selector.startsWith('.group-container')) {
            return containers.find(node => node.dataset.groupId === id) || null;
        }
        if (selector.startsWith('.activity-resize-handle')) {
            return handles.find(node => node.dataset.activityId === id) || null;
        }
        return buttons.find(node => node.dataset.activityId === id) || null;
    };
    stage.appendChild = item => {
        if (item.classList.contains('group-container')) containers.push(item);
        else if (item.classList.contains('activity-resize-handle')) handles.push(item);
        else buttons.push(item);
        return item;
    };
    stage.replaceChildren = () => { buttons.length = 0; handles.length = 0; containers.length = 0; };

    const status = makeElement();
    const filter = makeElement();
    filter.value = '';
    const addActivityBtn = makeElement();
    addActivityBtn.textContent = '+';
    const createGroupBtn = makeElement();
    createGroupBtn.hidden = true;
    const groupToggleAllBtn = makeElement();
    groupToggleAllBtn.hidden = true;
    const originalGetById = context.document.getElementById;
    context.document.getElementById = id => ({
        activityCanvasViewport: viewport,
        activitiesGrid: stage,
        timerRunningStatus: status,
        logActivityFilter: filter,
        addActivityBtn,
        createGroupBtn,
        groupToggleAllBtn
    })[id] || originalGetById(id);
    context.document.querySelector = selector => stage.querySelector(selector);
    context.document.querySelectorAll = selector => selector === '.activity-btn' ? buttons : [];
    context.document.createElement = () => makeElement();
    app.toggleActivity = async () => {};
    app.setupActivityCanvasInteractions();

    const pointer = (type, target, x, y) => viewport.handlers.get(type)?.({
        isPrimary: true, pointerType: 'mouse', button: 0, pointerId: 1,
        clientX: x, clientY: y, target, type, preventDefault() {}
    });

    return {
        app, context, storageData, viewport, stage,
        buttons, handles, containers, status, addActivityBtn, createGroupBtn, groupToggleAllBtn,
        pointer, makeElement
    };
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

test('Day Review and the Clockodo payload share the same nearest-five-minute rounding', () => {
    const { app, context, document } = createTestApp();
    vm.runInContext(clockodoClientSource, context);
    app.clockodoClient = vm.runInContext('new ClockodoClient()', context);
    app.clockodoConfigured = true;
    app.timeFormat = '24h';

    const start = new Date('2026-10-05T12:37:29').getTime();
    const end = new Date('2026-10-05T12:42:30').getTime();
    const clientStart = app.clockodoClient.roundToNearestFiveMinutes(start);
    const clientEnd = app.clockodoClient.roundToNearestFiveMinutes(end);
    assert.equal(app.clockodoSendTimestamp(start), clientStart, 'the Day Review wrapper uses the shared client rounding');
    assert.equal(app.clockodoSendTimestamp(end), clientEnd);
    assert.equal(app.formatTime(clientStart), '12:35');
    assert.equal(app.formatTime(clientEnd), '12:40');

    app.reviewDate = '2026-10-05';
    app.activities = [{ id: 'round-act', name: 'Paint', position: 0 }];
    app.timeEntries = [{
        id: 'round-entry', activityId: 'round-act', activityNameSnapshot: 'Paint',
        startTimestamp: start, endTimestamp: end, syncStatus: 'unsynced'
    }];
    app.renderReview();
    const html = document.getElementById('reviewEntriesList').innerHTML;
    assert.match(html, /12:35/, 'Day Review displays the rounded start');
    assert.match(html, /12:40/, 'Day Review displays the rounded end');
    assert.equal(app.timeEntries[0].startTimestamp, start, 'the raw start timestamp is untouched');
    assert.equal(app.timeEntries[0].endTimestamp, end, 'the raw end timestamp is untouched');

    const payload = app.clockodoClient.buildEntryPayload({
        startTimestamp: start, endTimestamp: end, customerId: '11', serviceId: '21'
    }, { billable: true });
    const iso = timestamp => new Date(timestamp).toISOString().replace(/\.\d{3}Z$/, 'Z');
    assert.equal(payload.time_since, iso(app.clockodoSendTimestamp(start)), 'the payload matches the Day Review rounding');
    assert.equal(payload.time_until, iso(app.clockodoSendTimestamp(end)));
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

test('Task 4: Editing rejects equal, reversed, and excessive intervals, and saves overlaps with a warning', async () => {
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
    assert.equal(app.lastToast, app.t('overlappingEntry'));
    assert.equal(storageData.timeEntries.find(entry => entry.id === 'existing').startTimestamp, new Date(`${date}T09:30:00`).getTime());
    assert.equal(storageData.timeEntries.find(entry => entry.id === 'existing').endTimestamp, new Date(`${date}T10:30:00`).getTime());
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

test('canvas snapping rounds activity positions to the grid, including negative coordinates', () => {
    const { app } = createTestApp();
    assert.equal(app.snapToCanvasGrid(0), 0);
    assert.equal(app.snapToCanvasGrid(7), 0);
    assert.equal(app.snapToCanvasGrid(15), 16);
    assert.equal(app.snapToCanvasGrid(16), 16);
    assert.equal(app.snapToCanvasGrid(24), 32);
    assert.equal(app.snapToCanvasGrid(131), 128);
    assert.equal(app.snapToCanvasGrid(174), 176);
    assert.equal(app.snapToCanvasGrid(-16), -16);
    assert.equal(app.snapToCanvasGrid(-23), -16);
    assert.equal(app.snapToCanvasGrid(-39), -32);
    assert.equal(app.snapToCanvasGrid(Number.NaN), 0);
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

    const initialButton = children.find(child => child.classList.contains('activity-btn'));
    assert.equal(initialButton.style.left, '140px', 'existing off-grid positions render unchanged');
    assert.equal(initialButton.style.top, '90px', 'existing off-grid positions render unchanged');

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
    assert.deepEqual(savedLayouts[0], { activityId: activity.id, x: 176, y: 128, width: 260, height: 150 });
    assert.equal(savedLayouts[0].x % 16, 0, 'moved positions snap to the 16px grid');
    assert.equal(savedLayouts[0].y % 16, 0, 'moved positions snap to the 16px grid');
    await button.handlers.get('click')();
    assert.equal(timerStarts, 1, 'a drag cannot accidentally start the timer');

    app.renderMain();
    const resize = children.find(child => child.classList.contains('activity-resize-handle'));
    pointer('pointerdown', resize, 0, 0);
    pointer('pointermove', resize, 50, 30);
    pointer('pointerup', resize, 50, 30);
    assert.equal(savedLayouts.length, 2);
    assert.deepEqual(savedLayouts[1], { activityId: activity.id, x: 176, y: 128, width: 310, height: 180 });
    assert.equal(timerStarts, 1, 'resizing cannot start the timer');

    stage.handlers.get('keydown')?.({
        key: 'ArrowRight', shiftKey: true, target: button, preventDefault() {}
    });
    assert.equal(savedLayouts.length, 3, 'keyboard moves persist a snapped position');
    assert.deepEqual(savedLayouts[2], { activityId: activity.id, x: 192, y: 128, width: 310, height: 180 });

    pointer('pointerdown', viewport, 0, 0);
    pointer('pointermove', viewport, 35, 25);
    pointer('pointerup', viewport, 35, 25);
    assert.equal(savedLayouts.length, 3, 'panning does not create activity layout mutations');
    assert.ok(localStorageData.has('timerhubActivityCanvasView'), 'the viewport returns to its panned position after reload');
    assert.deepEqual([app.readCanvasPan().x, app.readCanvasPan().y], [35, 25]);
});

test('canvas selection helpers normalize rectangles and detect bounding-box intersection', () => {
    const { app } = createTestApp();
    assert.deepEqual(
        { ...app.selectionRectFromPoints({ x: 100, y: 40 }, { x: 30, y: 90 }) },
        { left: 30, top: 40, right: 100, bottom: 90 }
    );
    const bounds = app.selectionRectFromPoints({ x: 0, y: 0 }, { x: 50, y: 50 });
    assert.equal(app.rectanglesIntersect(bounds, { left: 40, top: 40, right: 90, bottom: 90 }), true);
    assert.equal(app.rectanglesIntersect(bounds, { left: 50, top: 50, right: 90, bottom: 90 }), true, 'touching edges intersect');
    assert.equal(app.rectanglesIntersect(bounds, { left: 51, top: 0, right: 90, bottom: 90 }), false);
    assert.equal(app.rectanglesIntersect(bounds, { left: 0, top: 51, right: 90, bottom: 90 }), false);
});

test('long-press rectangle selection respects tolerance, bounds, pan, and zoom', async () => {
    const { app, context, localStorageData } = createTestApp();
    context.CSS = { escape: value => value };
    context.setTimeout = (callback, delay) => setTimeout(callback, delay);

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
                toggle(value, enabled) {
                    if (enabled === undefined) enabled = !classes.has(value);
                    enabled ? classes.add(value) : classes.delete(value);
                }
            },
            setAttribute() {},
            appendChild(item) { this.children.push(item); return item; },
            replaceChildren(...items) { this.children = items; },
            addEventListener(type, handler) { handlers.set(type, handler); },
            setPointerCapture() {},
            closest(selector) {
                return (selector === '.activity-btn' && element.classList.contains('activity-btn')) ||
                    (selector === '.activity-resize-handle' && element.classList.contains('activity-resize-handle'))
                    ? element : null;
            },
            get handlers() { return handlers; }
        };
        return element;
    };

    const viewportBounds = { left: 0, top: 0, width: 800, height: 600 };
    const viewport = makeElement();
    viewport.dataset = {};
    viewport.getBoundingClientRect = () => viewportBounds;
    const buttons = [];
    const handles = [];
    const stage = makeElement();
    stage.querySelector = selector => {
        const isHandle = selector.startsWith('.activity-resize-handle');
        const id = /data-activity-id="([^"]+)"/.exec(selector)?.[1];
        return (isHandle ? handles : buttons).find(item => item.dataset.activityId === id) || null;
    };
    stage.appendChild = item => {
        (item.classList.contains('activity-resize-handle') ? handles : buttons).push(item);
        return item;
    };
    stage.replaceChildren = () => { buttons.length = 0; handles.length = 0; };
    const status = makeElement();
    const filter = makeElement();
    filter.value = '';
    const originalGetById = context.document.getElementById;
    context.document.getElementById = id => ({
        activityCanvasViewport: viewport, activitiesGrid: stage, timerRunningStatus: status, logActivityFilter: filter
    })[id] || originalGetById(id);
    context.document.querySelector = selector => stage.querySelector(selector);
    context.document.querySelectorAll = selector => selector === '.activity-btn' ? buttons : [];
    context.document.createElement = () => makeElement();

    const inside = { id: 'inside', name: 'Inside', position: 0, size: 'medium', color: '#ffffff', shape: 'circle' };
    const outside = { id: 'outside', name: 'Outside', position: 1, size: 'medium', color: '#ffffff', shape: 'star' };
    const layouts = {
        inside: { activityId: 'inside', x: 100, y: 100, width: 100, height: 80 },
        outside: { activityId: 'outside', x: 600, y: 500, width: 100, height: 80 }
    };
    app.activities = [inside, outside];
    app.activityLayouts = new Map(Object.entries(layouts));
    const savedLayouts = [];
    app.storage = { async saveLayout(layout) { savedLayouts.push(structuredClone(layout)); } };
    app.toggleActivity = async () => {};
    app.getActiveDuration = () => 0;
    app.formatDuration = () => '00:00';
    app.canvasPan = { x: 40, y: -20 };
    app.canvasZoom = 1.5;

    app.setupActivityCanvasInteractions();
    app.renderMain();
    assert.equal(buttons.length, 2);
    for (const button of buttons) {
        button.getBoundingClientRect = () => {
            const layout = layouts[button.dataset.activityId];
            const left = viewportBounds.left + app.canvasPan.x + layout.x * app.canvasZoom;
            const top = viewportBounds.top + app.canvasPan.y + layout.y * app.canvasZoom;
            return {
                left,
                top,
                right: left + layout.width * app.canvasZoom,
                bottom: top + layout.height * app.canvasZoom
            };
        };
    }

    const pointer = (type, target, x, y) => viewport.handlers.get(type)?.({
        isPrimary: true, pointerType: 'mouse', button: 0, pointerId: 1,
        clientX: x, clientY: y, target, type, preventDefault() {}
    });

    pointer('pointerdown', viewport, 50, 50);
    pointer('pointermove', viewport, 56, 58);
    assert.equal(app.canvasGesture.mode, 'pan', 'a short press stays a pan candidate');
    assert.deepEqual(app.canvasPan, { x: 40, y: -20 }, 'small finger movement must not pan');
    await new Promise(resolve => setTimeout(resolve, 1050));
    assert.equal(app.canvasGesture.mode, 'select', 'long press activates rectangle selection');
    assert.equal(app.canvasSelectionElement.style.display, 'block');

    pointer('pointermove', viewport, 360, 270);
    assert.equal(app.canvasSelectionElement.style.left, '50px');
    assert.equal(app.canvasSelectionElement.style.top, '50px');
    assert.equal(app.canvasSelectionElement.style.width, '310px');
    assert.equal(app.canvasSelectionElement.style.height, '220px');

    pointer('pointerup', viewport, 360, 270);
    assert.deepEqual([...app.selectedActivityIds], ['inside'], 'only intersecting DOM boxes are selected');
    assert.equal(buttons.find(button => button.dataset.activityId === 'inside').classList.contains('selected'), true);
    assert.equal(buttons.find(button => button.dataset.activityId === 'outside').classList.contains('selected'), false);
    assert.equal(app.canvasSelectionElement.style.display, 'none');
    assert.equal(savedLayouts.length, 0, 'selection never repositions activities');

    pointer('pointerdown', viewport, 400, 400);
    pointer('pointermove', viewport, 440, 430);
    assert.deepEqual({ ...app.canvasPan }, { x: 80, y: 10 }, 'short press with movement still pans');
    pointer('pointerup', viewport, 440, 430);
    assert.equal(app.canvasSelectionElement.style.display, 'none', 'panning never opens the selection rectangle');

    pointer('pointerdown', viewport, 100, 100);
    pointer('pointermove', viewport, 120, 100);
    await new Promise(resolve => setTimeout(resolve, 1050));
    assert.equal(app.canvasGesture.mode, 'pan', 'movement past the tolerance cancels the long press');
    pointer('pointerup', viewport, 120, 100);
    assert.ok(localStorageData.has('timerhubActivityCanvasView'), 'pan persists the canvas view');
});

test('creating a group from a selection stores a snapped position and relative member layouts', async () => {
    const { app, storageData } = createTestApp();
    const first = { id: 'group-layout-a', name: 'First', position: 0, size: 'medium' };
    const second = { id: 'group-layout-b', name: 'Second', position: 1, size: 'medium' };
    app.activities = [first, second];
    app.activityLayouts = new Map([
        ['group-layout-a', { activityId: 'group-layout-a', x: 140, y: 90, width: 260, height: 150 }],
        ['group-layout-b', { activityId: 'group-layout-b', x: 420, y: 250, width: 220, height: 120 }]
    ]);
    app.selectedActivityIds = new Set(['group-layout-a', 'group-layout-b']);
    app.renderMain = () => {};

    const group = await app.createGroupFromSelection('Crew');

    assert.equal(app.groups.length, 1);
    assert.equal(group.name, 'Crew');
    assert.equal(group.collapsed, false);
    assert.equal(group.x, 144, 'group position snaps to the 16px grid');
    assert.equal(group.y, 96, 'group position snaps to the 16px grid');
    assert.equal(storageData.groups[0].id, group.id, 'the group is persisted');
    assert.deepEqual(new Set([first.groupId, second.groupId]), new Set([group.id]), 'membership is persisted on every member');

    const storedFirst = app.activityLayouts.get('group-layout-a');
    const storedSecond = app.activityLayouts.get('group-layout-b');
    assert.equal(storedFirst.x, -4);
    assert.equal(storedFirst.y, -6);
    assert.equal(storedSecond.x, 276);
    assert.equal(storedSecond.y, 154);
    assert.equal(storedSecond.x - storedFirst.x, 280, 'relative positions are preserved');
    assert.equal(storedSecond.y - storedFirst.y, 160, 'relative positions are preserved');

    assert.deepEqual({ ...app.getActivityCanvasLayout(first, 0) }, { x: 140, y: 90, width: 260, height: 150 });
    assert.deepEqual({ ...app.getActivityCanvasLayout(second, 1) }, { x: 420, y: 250, width: 220, height: 120 });
    assert.equal(app.selectedActivityIds.size, 0, 'selection clears after successful group creation');
});

test('group creation requires a non-empty selection', async () => {
    const { app, toasts } = createTestApp();
    app.selectedActivityIds = new Set();
    const group = await app.createGroupFromSelection('Crew');
    assert.equal(group, null);
    assert.equal(app.groups.length, 0);
    assert.equal(toasts.at(-1), 'Select at least one activity first');
});

test('activities without groups keep their absolute canvas layout', () => {
    const { app } = createTestApp();
    const activity = { id: 'ungrouped', name: 'Solo', position: 0, size: 'medium' };
    app.activities = [activity];
    app.activityLayouts = new Map([['ungrouped', { activityId: 'ungrouped', x: 140, y: 90, width: 260, height: 150 }]]);
    assert.equal(app.activityGroup(activity), null);
    assert.deepEqual({ ...app.getActivityCanvasLayout(activity, 0) }, { x: 140, y: 90, width: 260, height: 150 });
});

test('group containers render around member activity bounding boxes', () => {
    const { app, document } = createTestApp();
    const grid = document.createElement('div');
    app.activities = [
        { id: 'render-a', name: 'A', position: 0, groupId: 'render-group' },
        { id: 'render-b', name: 'B', position: 1, groupId: 'render-group' }
    ];
    app.activityLayouts = new Map([
        ['render-a', { activityId: 'render-a', x: 100, y: 100, width: 200, height: 120 }],
        ['render-b', { activityId: 'render-b', x: 400, y: 300, width: 200, height: 140 }]
    ]);
    app.groups = [{ id: 'render-group', name: 'Crew', x: 0, y: 0, collapsed: false }];

    app.renderGroups(grid);

    const container = grid.children.find(node => node.className === 'group-container');
    assert.ok(container, 'a container is rendered for the group');
    assert.equal(container.dataset.groupId, 'render-group');
    assert.equal(container.style.left, '80px');
    assert.equal(container.style.top, '64px');
    assert.equal(container.style.width, '540px');
    assert.equal(container.style.height, '396px');
    assert.equal(container.style.zIndex, '0');
    assert.equal(container.children[0].className, 'group-title');
    assert.equal(container.children[0].children[0].className, 'group-collapse-btn');
    assert.equal(container.children[0].children[1].className, 'group-title-text');
    assert.equal(container.children[0].children[1].textContent, 'Crew');
    assert.equal(container.children[0].children[2].className, 'group-duplicate-btn');
});

test('groups and memberships persist, export, and stay compatible with legacy backups', async () => {
    const { context } = createTestApp();
    const harness = createIndexedDbHarness();
    const repository = vm.runInContext('new StorageRepository()', context);
    repository.db = harness.db;

    const group = { id: 'persisted-group', name: 'Crew', x: 144, y: 96, collapsed: false };
    await repository.saveGroup(group);
    await repository.saveActivity({ id: 'member', name: 'Member', groupId: 'persisted-group' });
    await repository.saveActivity({ id: 'solo', name: 'Solo' });
    await repository.saveLayout({ activityId: 'member', x: -4, y: -6, width: 260, height: 150 });

    const reloaded = vm.runInContext('new StorageRepository()', context);
    reloaded.db = harness.db;
    const groups = await reloaded.getGroups();
    assert.equal(groups.length, 1);
    assert.deepEqual({ ...groups[0] }, group);
    const activities = await reloaded.getActivities();
    assert.equal(activities.find(item => item.id === 'member').groupId, 'persisted-group');
    assert.equal(activities.find(item => item.id === 'solo').groupId, undefined, 'activities without groups are unchanged');
    const savedLayout = (await reloaded.getLayout()).find(item => item.activityId === 'member');
    assert.deepEqual({ ...savedLayout }, { activityId: 'member', x: -4, y: -6, width: 260, height: 150 });

    const exported = await reloaded.exportAll();
    assert.equal(exported.groups.length, 1);
    assert.equal(exported.groups[0].name, 'Crew');

    const legacy = {
        format: 'timerhub-backup',
        version: 1,
        activities: [{ id: 'legacy', name: 'Legacy' }],
        timeEntries: []
    };
    assert.doesNotThrow(() => reloaded.validateBackupData(legacy));
    const migrated = vm.runInContext('new StorageRepository()', context);
    const migratedHarness = createIndexedDbHarness();
    migrated.db = migratedHarness.db;
    await migrated.importAll(legacy, false);
    assert.equal((await migrated.getGroups()).length, 0, 'legacy backups migrate with no groups');
    assert.equal((await migrated.getActivities())[0].name, 'Legacy');
});

test('dragging a group moves every member through snapped group coordinates and persists', async () => {
    const harness = createGroupCanvasHarness();
    const { app, containers, buttons, pointer, storageData } = harness;
    const group = { id: 'drag-group', name: 'Crew', x: 144, y: 96, collapsed: false };
    app.activities = [
        { id: 'drag-a', name: 'A', position: 0, groupId: 'drag-group', size: 'medium' },
        { id: 'drag-b', name: 'B', position: 1, groupId: 'drag-group', size: 'medium' }
    ];
    app.activityLayouts = new Map([
        ['drag-a', { activityId: 'drag-a', x: 16, y: 8, width: 200, height: 120 }],
        ['drag-b', { activityId: 'drag-b', x: 280, y: 160, width: 220, height: 140 }]
    ]);
    app.groups = [group];
    app.canvasZoom = 2;
    app.savedGroups = [];
    app.storage.saveGroup = async saved => { app.savedGroups.push(structuredClone(saved)); };
    app.renderMain();

    const title = containers[0].children[0];
    pointer('pointerdown', title, 100, 100);
    assert.equal(app.canvasGesture.mode, 'group-move', 'the title starts a group drag');
    pointer('pointermove', title, 164, 132);
    assert.equal(group.x, 176, 'group x uses the shared grid helper');
    assert.equal(group.y, 112, 'group y uses the shared grid helper');
    assert.equal(buttons.find(button => button.dataset.activityId === 'drag-a').style.left, '192px');
    assert.equal(buttons.find(button => button.dataset.activityId === 'drag-a').style.top, '120px');
    assert.equal(buttons.find(button => button.dataset.activityId === 'drag-b').style.left, '456px');
    assert.equal(app.canvasPan.x, 0, 'group dragging never pans the canvas');
    pointer('pointerup', title, 164, 132);
    assert.equal(app.activityLayouts.get('drag-a').x, 16, 'relative member layouts stay unchanged');
    assert.equal(app.activityLayouts.get('drag-b').y, 160, 'relative member layouts stay unchanged');
    assert.equal(app.savedGroups.at(-1).x, 176, 'the group position is persisted');
    assert.equal(app.savedGroups.at(-1).y, 112, 'the group position is persisted');

    pointer('pointerdown', title, 500, 500);
    pointer('pointermove', title, 0, 500);
    pointer('pointerup', title, 0, 500);
    assert.ok(group.x < 0, 'negative group coordinates are supported');
    assert.ok(group.x % 16 === 0, 'negative values stay on the grid');
    assert.ok(storageData.groups.length <= 1, 'no extra groups were created');
});

test('collapsing a group hides members, keeps running timers, and expands back in place', async () => {
    const harness = createGroupCanvasHarness();
    const { app, containers, buttons, storageData } = harness;
    const group = { id: 'collapse-group', name: 'Crew', x: 144, y: 96, collapsed: false };
    app.activities = [
        { id: 'collapse-a', name: 'A', position: 0, groupId: 'collapse-group', size: 'medium' },
        { id: 'collapse-b', name: 'B', position: 1, groupId: 'collapse-group', size: 'medium' }
    ];
    app.activityLayouts = new Map([
        ['collapse-a', { activityId: 'collapse-a', x: 16, y: 8, width: 200, height: 120 }],
        ['collapse-b', { activityId: 'collapse-b', x: 280, y: 160, width: 220, height: 140 }]
    ]);
    app.groups = [group];
    const runningEntry = { id: 'running-entry', activityId: 'collapse-a', startTimestamp: 1, endTimestamp: null, syncStatus: 'unsynced' };
    app.timeEntries = [runningEntry];
    app.activeActivityId = 'collapse-a';
    app.renderMain();
    const leftBefore = buttons.find(button => button.dataset.activityId === 'collapse-a').style.left;
    const storedBefore = { ...app.activityLayouts.get('collapse-a') };

    await app.toggleGroupCollapsed('collapse-group');
    assert.equal(group.collapsed, true, 'collapse state flips');
    assert.equal(storageData.groups[0].collapsed, true, 'collapse state is persisted');
    assert.equal(containers[0].classList.contains('is-collapsed'), true);
    assert.equal(buttons.length, 0, 'collapsed members are not rendered');
    assert.equal(app.activeActivityId, 'collapse-a', 'the running timer is untouched');
    assert.equal(app.timeEntries[0], runningEntry, 'activity history is untouched');
    assert.equal(app.activeTimerEntry()?.id, 'running-entry', 'the running entry is still active');

    await app.toggleGroupCollapsed('collapse-group');
    assert.equal(group.collapsed, false);
    assert.equal(storageData.groups[0].collapsed, false);
    assert.equal(buttons.length, 2, 'expanding restores member rendering');
    assert.equal(buttons.find(button => button.dataset.activityId === 'collapse-a').style.left, leftBefore, 'member positions restore exactly');
    assert.deepEqual({ ...app.activityLayouts.get('collapse-a') }, storedBefore, 'relative layouts are preserved');
    assert.equal(group.x, 144, 'group position is unchanged');
});

test('collapse all and expand all update every group without touching members or timers', async () => {
    const harness = createGroupCanvasHarness();
    const { app, buttons, groupToggleAllBtn, storageData } = harness;
    app.activities = [
        { id: 'all-a', name: 'A', position: 0, groupId: 'all-one', size: 'medium' },
        { id: 'all-b', name: 'B', position: 1, groupId: 'all-one', size: 'medium' },
        { id: 'all-c', name: 'C', position: 2, groupId: 'all-two', size: 'medium' }
    ];
    app.activityLayouts = new Map([
        ['all-a', { activityId: 'all-a', x: 16, y: 8, width: 200, height: 120 }],
        ['all-b', { activityId: 'all-b', x: 280, y: 160, width: 220, height: 140 }],
        ['all-c', { activityId: 'all-c', x: 16, y: 8, width: 200, height: 120 }]
    ]);
    app.groups = [
        { id: 'all-one', name: 'One', x: 144, y: 96, collapsed: false },
        { id: 'all-two', name: 'Two', x: 800, y: 96, collapsed: false }
    ];
    app.activeActivityId = 'all-b';
    app.timeEntries = [{ id: 'all-running', activityId: 'all-b', startTimestamp: 1, endTimestamp: null, syncStatus: 'unsynced' }];
    app.renderMain();
    const layoutSnapshot = JSON.stringify([...app.activityLayouts.entries()]);
    const membershipSnapshot = JSON.stringify(app.activities.map(activity => activity.groupId));

    await app.collapseAllGroups();
    assert.equal(app.groups.every(group => group.collapsed), true);
    assert.equal(storageData.groups.every(group => group.collapsed), true, 'collapse all persists');
    assert.equal(buttons.length, 0, 'all members are hidden');
    assert.equal(groupToggleAllBtn.hidden, false);
    assert.equal(groupToggleAllBtn.dataset.action, 'expand');
    assert.equal(app.activeActivityId, 'all-b', 'running timers survive collapse all');

    await app.expandAllGroups();
    assert.equal(app.groups.every(group => !group.collapsed), true);
    assert.equal(storageData.groups.every(group => !group.collapsed), true, 'expand all persists');
    assert.equal(buttons.length, 3, 'all members are visible again');
    assert.equal(groupToggleAllBtn.dataset.action, 'collapse');
    assert.equal(JSON.stringify([...app.activityLayouts.entries()]), layoutSnapshot, 'positions are untouched');
    assert.equal(JSON.stringify(app.activities.map(activity => activity.groupId)), membershipSnapshot, 'membership is untouched');

    app.groups = [];
    assert.equal(await app.collapseAllGroups(), false, 'collapse all is safe with zero groups');
    assert.equal(await app.expandAllGroups(), false, 'expand all is safe with zero groups');
});

test('duplicating a group copies members with fresh ids, snapped offset, and no runtime state', async () => {
    const harness = createGroupCanvasHarness();
    const { app, storageData } = harness;
    const original = { id: 'dup-group', name: 'Crew', x: 150, y: 100, collapsed: false };
    const memberA = {
        id: 'dup-a', name: 'A', color: '#E74C3C', shape: 'circle', size: 'medium', position: 0,
        groupId: 'dup-group', customerId: 7, serviceId: 9, customerName: 'ACME', serviceName: 'Paint'
    };
    const memberB = {
        id: 'dup-b', name: 'B', color: '#3498DB', shape: 'square', size: 'large', position: 1,
        groupId: 'dup-group', customerId: null, serviceId: null, customerName: '', serviceName: ''
    };
    app.activities = [memberA, memberB];
    app.groups = [original];
    app.activityLayouts = new Map([
        ['dup-a', { activityId: 'dup-a', x: 16, y: 8, width: 200, height: 120 }],
        ['dup-b', { activityId: 'dup-b', x: 280, y: 160, width: 220, height: 140 }]
    ]);
    const runningEntry = { id: 'dup-running', activityId: 'dup-a', startTimestamp: 1, endTimestamp: null, syncStatus: 'unsynced' };
    app.timeEntries = [runningEntry];
    app.activeActivityId = 'dup-a';
    app.renderMain();

    const duplicate = await app.duplicateGroup('dup-group');
    assert.notEqual(duplicate.id, original.id, 'the duplicate gets a unique group id');
    assert.equal(duplicate.name, 'Crew (copy)');
    assert.equal(duplicate.x, 192, 'the duplicate offset snaps to the existing grid');
    assert.equal(duplicate.y, 144, 'the duplicate offset snaps to the existing grid');
    assert.equal(duplicate.collapsed, false);
    assert.equal(app.groups.length, 2);
    assert.equal(original.x, 150, 'the original group position is unchanged');
    assert.equal(original.name, 'Crew');
    assert.equal(memberA.groupId, 'dup-group', 'original membership is unchanged');

    const copies = app.activities.filter(activity => activity.groupId === duplicate.id);
    assert.equal(copies.length, 2, 'both members are duplicated');
    assert.equal(new Set(copies.map(activity => activity.id)).size, 2, 'copied activities get fresh ids');
    const copyA = copies.find(activity => activity.name === 'A');
    assert.equal(copyA.color, '#E74C3C', 'canvas properties are preserved');
    assert.equal(copyA.shape, 'circle');
    assert.equal(copyA.size, 'medium');
    assert.equal(copyA.customerId, 7, 'customer assignment is preserved');
    assert.equal(copyA.serviceId, 9, 'service assignment is preserved');
    assert.equal(app.activityLayouts.get(copyA.id).x, 16, 'group-relative positions are preserved');
    assert.equal(app.activityLayouts.get(copyA.id).y, 8);
    assert.equal(app.activeActivityId, 'dup-a', 'runtime state is not copied');
    assert.equal(app.timeEntries.length, 1, 'time entries are not copied');
    assert.equal(app.timeEntries[0], runningEntry);
    assert.ok(storageData.groups.some(group => group.id === duplicate.id), 'the duplicate group is persisted');
    assert.ok(storageData.activities.some(activity => activity.id === copyA.id), 'copied activities are persisted');
    assert.ok(storageData.layout.some(layout => layout.activityId === copyA.id), 'copied layouts are persisted');
});

test('group dragging coexists with activity dragging and canvas panning', async () => {
    const harness = createGroupCanvasHarness();
    const { app, containers, buttons, viewport, pointer } = harness;
    const group = { id: 'mix-group', name: 'Crew', x: 144, y: 96, collapsed: false };
    app.activities = [
        { id: 'mix-a', name: 'A', position: 0, groupId: 'mix-group', size: 'medium' },
        { id: 'mix-free', name: 'Free', position: 1, size: 'medium' }
    ];
    app.activityLayouts = new Map([
        ['mix-a', { activityId: 'mix-a', x: 16, y: 8, width: 200, height: 120 }],
        ['mix-free', { activityId: 'mix-free', x: 900, y: 700, width: 200, height: 120 }]
    ]);
    app.groups = [group];
    app.renderMain();

    const title = containers[0].children[0];
    pointer('pointerdown', title, 10, 10);
    pointer('pointermove', title, 42, 26);
    pointer('pointerup', title, 42, 26);
    assert.equal(app.canvasPan.x, 0, 'group dragging does not pan');
    assert.equal(app.canvasPan.y, 0);
    const groupPosition = { x: group.x, y: group.y };

    const memberButton = buttons.find(button => button.dataset.activityId === 'mix-a');
    pointer('pointerdown', memberButton, 0, 0);
    assert.equal(app.canvasGesture.mode, 'move', 'activity dragging still wins on activity buttons');
    pointer('pointermove', memberButton, 30, 40);
    pointer('pointerup', memberButton, 30, 40);
    assert.equal(group.x, groupPosition.x, 'activity dragging never moves the group');
    assert.equal(group.y, groupPosition.y);
    assert.notEqual(app.activityLayouts.get('mix-a').x, 16, 'the member keeps its new relative position');

    pointer('pointerdown', viewport, 500, 500);
    pointer('pointermove', viewport, 540, 530);
    assert.deepEqual({ ...app.canvasPan }, { x: 40, y: 30 }, 'canvas panning still works');
    pointer('pointerup', viewport, 540, 530);
    assert.equal(group.x, groupPosition.x, 'panning never moves groups');
});

test('activity magnetism aligns edges, centers, and corners within one grid cell', () => {
    const { app } = createTestApp();
    const moving = { x: 100, y: 100, width: 100, height: 80 };

    assert.deepEqual(
        { ...app.magneticActivityAdjustment(moving, [{ x: 108, y: 500, width: 50, height: 50 }]) },
        { x: 8, y: 0 },
        'left-to-left attraction'
    );
    assert.deepEqual(
        { ...app.magneticActivityAdjustment(moving, [{ x: 210, y: 500, width: 50, height: 50 }]) },
        { x: 10, y: 0 },
        'right-edge to left-edge attraction'
    );
    assert.deepEqual(
        { ...app.magneticActivityAdjustment(moving, [{ x: 500, y: 92, width: 50, height: 120 }]) },
        { x: 0, y: -8 },
        'top-to-top vertical attraction'
    );
    assert.deepEqual(
        { ...app.magneticActivityAdjustment(moving, [{ x: 500, y: 190, width: 50, height: 120 }]) },
        { x: 0, y: 10 },
        'bottom-edge to top-edge attraction'
    );
    assert.deepEqual(
        { ...app.magneticActivityAdjustment(moving, [{ x: 108, y: 92, width: 50, height: 120 }]) },
        { x: 8, y: -8 },
        'corner alignment snaps both axes'
    );
    assert.deepEqual(
        { ...app.magneticActivityAdjustment(moving, [{ x: 147, y: 500, width: 10, height: 50 }]) },
        { x: 2, y: 0 },
        'center alignment is a valid candidate'
    );
    assert.deepEqual(
        { ...app.magneticActivityAdjustment(moving, [{ x: 116, y: 500, width: 10, height: 50 }]) },
        { x: 16, y: 0 },
        'a full grid cell is still within the threshold'
    );
    assert.deepEqual(
        { ...app.magneticActivityAdjustment(moving, [{ x: 118, y: 500, width: 10, height: 50 }]) },
        { x: 0, y: 0 },
        'no attraction outside the threshold'
    );
    assert.deepEqual(
        {
            ...app.magneticActivityAdjustment(moving, [
                { x: 112, y: 500, width: 50, height: 50 },
                { x: 103, y: 700, width: 50, height: 50 }
            ])
        },
        { x: 3, y: 0 },
        'the nearest candidate wins over competing alignments'
    );
    assert.deepEqual(
        { ...app.magneticActivityAdjustment({ x: -100, y: -100, width: 100, height: 80 }, [{ x: -108, y: -500, width: 50, height: 50 }]) },
        { x: -8, y: 0 },
        'negative canvas coordinates are supported'
    );
});

test('activity magnetism applies while moving, cooperates with grid snapping, and respects zoom', async () => {
    const harness = createGroupCanvasHarness();
    const { app, buttons, pointer } = harness;
    app.activities = [
        { id: 'magnet-target', name: 'Target', position: 0, size: 'medium' },
        { id: 'magnet-mover', name: 'Mover', position: 1, size: 'medium' },
        { id: 'magnet-far', name: 'Far', position: 2, size: 'medium' }
    ];
    app.activityLayouts = new Map([
        ['magnet-target', { activityId: 'magnet-target', x: 200, y: 100, width: 200, height: 120 }],
        ['magnet-mover', { activityId: 'magnet-mover', x: 0, y: 0, width: 200, height: 120 }],
        ['magnet-far', { activityId: 'magnet-far', x: 2000, y: 1200, width: 200, height: 120 }]
    ]);
    app.renderMain();

    let mover = buttons.find(button => button.dataset.activityId === 'magnet-mover');
    pointer('pointerdown', mover, 0, 0);
    pointer('pointermove', mover, 204, 0);
    assert.equal(mover.style.left, '200px', 'magnetism aligns the edge instead of the raw grid cell');
    pointer('pointerup', mover, 204, 0);
    assert.equal(app.activityLayouts.get('magnet-mover').x, 200, 'the magnetic position is persisted');
    assert.deepEqual(
        { ...app.activityLayouts.get('magnet-target') },
        { activityId: 'magnet-target', x: 200, y: 100, width: 200, height: 120 },
        'the target activity never moves'
    );

    app.activityLayouts.set('magnet-mover', { activityId: 'magnet-mover', x: 0, y: 0, width: 200, height: 120 });
    app.canvasZoom = 2;
    app.canvasPan = { x: 40, y: 25 };
    app.renderMain();
    mover = buttons.find(button => button.dataset.activityId === 'magnet-mover');
    pointer('pointerdown', mover, 10, 10);
    pointer('pointermove', mover, 418, 10);
    assert.equal(mover.style.left, '200px', 'zoom and pan keep the same magnetic world position');
    pointer('pointerup', mover, 418, 10);

    app.canvasZoom = 1;
    app.canvasPan = { x: 0, y: 0 };
    app.activityLayouts.set('magnet-mover', { activityId: 'magnet-mover', x: 0, y: 0, width: 200, height: 120 });
    app.renderMain();
    mover = buttons.find(button => button.dataset.activityId === 'magnet-mover');
    pointer('pointerdown', mover, 0, 0);
    pointer('pointermove', mover, 50, 0);
    pointer('pointerup', mover, 50, 0);
    assert.equal(app.activityLayouts.get('magnet-mover').x % 16, 0, 'grid snapping still applies without a magnetic candidate');
    assert.equal(app.activityLayouts.get('magnet-mover').x, 48);

    app.activityLayouts.set('magnet-mover', { activityId: 'magnet-mover', x: 0, y: 0, width: 200, height: 120 });
    app.renderMain();
    mover = buttons.find(button => button.dataset.activityId === 'magnet-mover');
    pointer('pointerdown', mover, 0, 0);
    pointer('pointermove', mover, -300, 0);
    pointer('pointerup', mover, -300, 0);
    assert.ok(app.activityLayouts.get('magnet-mover').x < 0, 'negative coordinates are supported while moving');
    assert.ok(app.activityLayouts.get('magnet-mover').x % 16 === 0, 'negative positions stay on the grid');
});

test('expanding overlapping groups applies temporary offsets without persisting them', async () => {
    const harness = createGroupCanvasHarness();
    const { app, containers, storageData } = harness;
    app.activities = [
        { id: 'col-a1', name: 'A1', position: 0, groupId: 'col-a', size: 'medium' },
        { id: 'col-b1', name: 'B1', position: 1, groupId: 'col-b', size: 'medium' },
        { id: 'col-c1', name: 'C1', position: 2, groupId: 'col-c', size: 'medium' }
    ];
    app.activityLayouts = new Map([
        ['col-a1', { activityId: 'col-a1', x: 0, y: 0, width: 200, height: 120 }],
        ['col-b1', { activityId: 'col-b1', x: 0, y: 0, width: 200, height: 120 }],
        ['col-c1', { activityId: 'col-c1', x: 0, y: 0, width: 200, height: 120 }]
    ]);
    app.groups = [
        { id: 'col-a', name: 'A', x: 100, y: 100, collapsed: false },
        { id: 'col-b', name: 'B', x: 180, y: 100, collapsed: false },
        { id: 'col-c', name: 'C', x: 260, y: 100, collapsed: false }
    ];
    app.renderMain();

    assert.deepEqual({ ...app.groupDisplayOffset('col-a') }, { x: 0, y: 0 });
    assert.deepEqual({ ...app.groupDisplayOffset('col-b') }, { x: 180, y: 0 });
    assert.deepEqual({ ...app.groupDisplayOffset('col-c') }, { x: 100, y: 196 });
    assert.deepEqual(app.groups.map(group => group.x), [100, 180, 260], 'saved positions are untouched');

    const rects = containers.map(container => ({
        left: Number.parseFloat(container.style.left),
        top: Number.parseFloat(container.style.top),
        width: Number.parseFloat(container.style.width),
        height: Number.parseFloat(container.style.height)
    }));
    for (let i = 0; i < rects.length; i += 1) {
        for (let j = i + 1; j < rects.length; j += 1) {
            const a = rects[i];
            const b = rects[j];
            const overlaps = a.left < b.left + b.width && b.left < a.left + a.width &&
                a.top < b.top + b.height && b.top < a.top + a.height;
            assert.equal(overlaps, false, `expanded groups ${i} and ${j} must not overlap`);
        }
    }
    assert.equal(rects[0].left, 80);
    assert.equal(rects[1].left, 340);
    assert.equal(rects[2].left, 340);
    assert.equal(rects[2].top, 260);

    await app.collapseAllGroups();
    assert.deepEqual(app.groups.map(group => group.x), [100, 180, 260], 'collapse keeps saved positions');
    assert.deepEqual({ ...app.groupDisplayOffset('col-b') }, { x: 0, y: 0 });
    const collapsedB = containers.find(container => container.dataset.groupId === 'col-b');
    assert.equal(collapsedB.style.left, '160px', 'collapsed groups render at their saved position');

    await app.expandAllGroups();
    assert.deepEqual({ ...app.groupDisplayOffset('col-b') }, { x: 180, y: 0 }, 'every new expansion recalculates');
    assert.deepEqual(app.groups.map(group => group.x), [100, 180, 260]);

    const offsetBefore = { ...app.groupDisplayOffset('col-b') };
    app.activityLayouts.set('col-a1', { activityId: 'col-a1', x: 0, y: 0, width: 400, height: 120 });
    app.renderMain();
    const offsetAfter = app.groupDisplayOffset('col-b');
    assert.ok(
        offsetAfter.x !== offsetBefore.x || offsetAfter.y !== offsetBefore.y,
        'changed member sizes affect the next calculation'
    );
    assert.deepEqual(app.groups.map(group => group.x), [100, 180, 260], 'saved positions stay untouched after recalculation');
    assert.ok(
        storageData.groups.every(group => group.x === { 'col-a': 100, 'col-b': 180, 'col-c': 260 }[group.id]),
        'only saved coordinates are persisted'
    );
});

test('manually expanding a group resolves collisions with collapsed groups without moving saved positions', async () => {
    const harness = createGroupCanvasHarness();
    const { app, containers } = harness;
    app.activities = [
        { id: 'manual-a1', name: 'A1', position: 0, groupId: 'manual-a', size: 'medium' },
        { id: 'manual-b1', name: 'B1', position: 1, groupId: 'manual-b', size: 'medium' }
    ];
    app.activityLayouts = new Map([
        ['manual-a1', { activityId: 'manual-a1', x: 0, y: 0, width: 200, height: 120 }],
        ['manual-b1', { activityId: 'manual-b1', x: 0, y: 0, width: 200, height: 120 }]
    ]);
    app.groups = [
        { id: 'manual-a', name: 'A', x: 100, y: 100, collapsed: true },
        { id: 'manual-b', name: 'B', x: 100, y: 100, collapsed: true }
    ];
    const overlaps = (first, second) =>
        first.left < second.left + second.width && second.left < first.left + first.width &&
        first.top < second.top + second.height && second.top < first.top + first.height;
    const boundsOf = groupId => {
        const container = containers.find(item => item.dataset.groupId === groupId);
        return {
            left: Number.parseFloat(container.style.left),
            top: Number.parseFloat(container.style.top),
            width: Number.parseFloat(container.style.width),
            height: Number.parseFloat(container.style.height)
        };
    };

    app.renderMain();
    assert.deepEqual({ ...app.groupDisplayOffset('manual-a') }, { x: 0, y: 0 }, 'collapsed groups stay at saved positions');

    await app.toggleGroupCollapsed('manual-a');
    assert.deepEqual({ ...app.groupDisplayOffset('manual-a') }, { x: 0, y: 66 }, 'manual expansion resolves against the collapsed group');
    assert.equal(app.groups[0].x, 100, 'saved x is unchanged');
    assert.equal(app.groups[0].y, 100, 'saved y is unchanged');
    assert.deepEqual({ ...app.groupDisplayOffset('manual-b') }, { x: 0, y: 0 });
    assert.equal(overlaps(boundsOf('manual-a'), boundsOf('manual-b')), false, 'expanded group is visually separated from the collapsed group');
    assert.equal(containers.find(item => item.dataset.groupId === 'manual-b').style.left, '80px', 'collapsed group renders at its saved position');

    await app.toggleGroupCollapsed('manual-a');
    assert.deepEqual({ ...app.groupDisplayOffset('manual-a') }, { x: 0, y: 0 }, 'collapsing restores the saved position');
    assert.equal(boundsOf('manual-a').top, 64);

    app.groups[1].x = 600;
    app.renderMain();
    await app.toggleGroupCollapsed('manual-a');
    assert.deepEqual({ ...app.groupDisplayOffset('manual-a') }, { x: 0, y: 0 }, 're-expansion recalculates from the current saved positions');
    assert.equal(app.groups[0].x, 100, 'saved positions are still untouched');

    app.activityLayouts.set('manual-a1', { activityId: 'manual-a1', x: 0, y: 0, width: 400, height: 160 });
    app.renderMain();
    assert.equal(boundsOf('manual-a').width, 440, 're-rendering uses the current member dimensions');
    assert.deepEqual({ ...app.groupDisplayOffset('manual-a') }, { x: 0, y: 0 });
});

test('dragging an activity into a group reassigns membership without moving it', async () => {
    const harness = createGroupCanvasHarness();
    const { app, buttons, containers, pointer, storageData } = harness;
    app.activities = [
        { id: 'drop-free', name: 'Free', position: 0, size: 'medium' },
        { id: 'drop-member', name: 'Member', position: 1, groupId: 'drop-a', size: 'medium' },
        { id: 'drop-anchor', name: 'Anchor', position: 2, groupId: 'drop-a', size: 'medium' }
    ];
    app.activityLayouts = new Map([
        ['drop-free', { activityId: 'drop-free', x: 800, y: 600, width: 200, height: 120 }],
        ['drop-member', { activityId: 'drop-member', x: 0, y: 0, width: 200, height: 120 }],
        ['drop-anchor', { activityId: 'drop-anchor', x: 400, y: 0, width: 200, height: 120 }]
    ]);
    app.groups = [{ id: 'drop-a', name: 'A', x: 100, y: 100, collapsed: false }];
    app.renderMain();
    const container = containers.find(item => item.dataset.groupId === 'drop-a');

    const free = buttons.find(button => button.dataset.activityId === 'drop-free');
    pointer('pointerdown', free, 0, 0);
    pointer('pointermove', free, -500, -500);
    assert.equal(free.style.left, '300px', 'magnetism aligns the activity between the group members');
    assert.equal(free.style.top, '100px');
    assert.equal(container.classList.contains('group-drop-target'), true, 'the hovered group is highlighted');
    const beforeDrop = { left: free.style.left, top: free.style.top };
    pointer('pointerup', free, -500, -500);

    const activity = app.activities.find(item => item.id === 'drop-free');
    assert.equal(activity.groupId, 'drop-a', 'the dropped activity joins the group');
    assert.deepEqual(
        { ...app.activityLayouts.get('drop-free') },
        { activityId: 'drop-free', x: 200, y: 0, width: 200, height: 120 },
        'the visual position converts into the group frame'
    );
    assert.equal(app.groups[0].x, 100, 'group x is unchanged');
    assert.equal(app.groups[0].y, 100, 'group y is unchanged');
    assert.equal(container.classList.contains('group-drop-target'), false, 'the highlight clears after the drop');

    const dropped = buttons.find(button => button.dataset.activityId === 'drop-free');
    assert.equal(dropped.style.left, beforeDrop.left, 'the activity does not jump after the membership change');
    assert.equal(dropped.style.top, beforeDrop.top);
    assert.ok(storageData.activities.some(item => item.id === 'drop-free' && item.groupId === 'drop-a'), 'membership is persisted');
    assert.ok(storageData.layout.some(item => item.activityId === 'drop-free' && item.x === 200 && item.y === 0), 'the converted layout is persisted');

    const exported = await app.storage.exportAll();
    assert.equal(exported.activities.find(item => item.id === 'drop-free').groupId, 'drop-a', 'export keeps the membership');

    app.activities = [];
    await app.loadActivities();
    assert.equal(app.activities.find(item => item.id === 'drop-free').groupId, 'drop-a', 'reload keeps the membership');
});

test('dragging an activity between groups and out of groups converts coordinates correctly', async () => {
    const harness = createGroupCanvasHarness();
    const { app, buttons, containers, pointer } = harness;
    app.activities = [
        { id: 'swap-mover', name: 'Mover', position: 0, groupId: 'swap-a', size: 'medium' },
        { id: 'swap-anchor', name: 'Anchor', position: 1, groupId: 'swap-a', size: 'medium' },
        { id: 'swap-b1', name: 'B1', position: 2, groupId: 'swap-b', size: 'medium' },
        { id: 'swap-b2', name: 'B2', position: 3, groupId: 'swap-b', size: 'medium' }
    ];
    app.activityLayouts = new Map([
        ['swap-mover', { activityId: 'swap-mover', x: 300, y: 0, width: 200, height: 120 }],
        ['swap-anchor', { activityId: 'swap-anchor', x: 0, y: 0, width: 200, height: 120 }],
        ['swap-b1', { activityId: 'swap-b1', x: 0, y: 0, width: 200, height: 120 }],
        ['swap-b2', { activityId: 'swap-b2', x: 400, y: 0, width: 200, height: 120 }]
    ]);
    app.groups = [
        { id: 'swap-a', name: 'A', x: 100, y: 100, collapsed: false },
        { id: 'swap-b', name: 'B', x: 800, y: 100, collapsed: false }
    ];
    app.renderMain();

    let mover = buttons.find(button => button.dataset.activityId === 'swap-mover');
    assert.equal(mover.style.left, '400px');
    pointer('pointerdown', mover, 0, 0);
    pointer('pointermove', mover, 600, 0);
    assert.equal(mover.style.left, '1000px', 'the activity aligns between the target group members');
    assert.equal(containers.find(item => item.dataset.groupId === 'swap-b').classList.contains('group-drop-target'), true);
    pointer('pointerup', mover, 600, 0);

    const activity = app.activities.find(item => item.id === 'swap-mover');
    assert.equal(activity.groupId, 'swap-b', 'membership changes to the target group');
    assert.deepEqual(
        { ...app.activityLayouts.get('swap-mover') },
        { activityId: 'swap-mover', x: 200, y: 0, width: 200, height: 120 },
        'coordinates convert from group A to group B'
    );
    mover = buttons.find(button => button.dataset.activityId === 'swap-mover');
    assert.equal(mover.style.left, '1000px', 'the activity does not jump between groups');
    assert.equal(mover.style.top, '100px');
    assert.equal(app.groups[0].x, 100, 'group A does not move');
    assert.equal(app.groups[1].x, 800, 'group B does not move');

    pointer('pointerdown', mover, 0, 0);
    pointer('pointermove', mover, 0, 400);
    pointer('pointerup', mover, 0, 400);
    assert.equal(activity.groupId, undefined, 'dropping outside every group removes membership');
    assert.ok(!('groupId' in activity), 'groupId is removed from the activity');
    assert.deepEqual(
        { ...app.activityLayouts.get('swap-mover') },
        { activityId: 'swap-mover', x: 1000, y: 496, width: 200, height: 120 },
        'the visual position is kept and stays on the grid'
    );
    mover = buttons.find(button => button.dataset.activityId === 'swap-mover');
    assert.equal(mover.style.left, '1000px', 'the activity does not jump when leaving a group');
    assert.equal(mover.style.top, '496px');
    assert.equal(app.groups[0].x, 100);
    assert.equal(app.groups[1].x, 800);
});

test('group drop detection uses the center, the full box, zoom, pan, and temporary offsets', () => {
    const harness = createGroupCanvasHarness();
    const { app, buttons, containers, pointer } = harness;
    app.activities = [
        { id: 'hit-member', name: 'Member', position: 0, groupId: 'hit-a', size: 'medium' },
        { id: 'hit-free', name: 'Free', position: 1, size: 'medium' }
    ];
    app.activityLayouts = new Map([
        ['hit-member', { activityId: 'hit-member', x: 0, y: 0, width: 200, height: 120 }],
        ['hit-free', { activityId: 'hit-free', x: 0, y: 0, width: 200, height: 120 }]
    ]);
    app.groups = [{ id: 'hit-a', name: 'A', x: -400, y: -300, collapsed: false }];
    app.canvasZoom = 2;
    app.canvasPan = { x: -100, y: 50 };
    app.renderMain();

    const clientOf = (x, y) => ({ x: app.canvasPan.x + x * app.canvasZoom, y: app.canvasPan.y + y * app.canvasZoom });
    const headerPoint = clientOf(-300, -320);
    assert.equal(app.groupDropTargetAt(headerPoint.x, headerPoint.y)?.id, 'hit-a', 'the header is part of the drop box');
    const outsidePoint = clientOf(-300, -100);
    assert.equal(app.groupDropTargetAt(outsidePoint.x, outsidePoint.y), null, 'points outside the box miss');
    assert.equal(app.groups[0].x, -400, 'negative saved coordinates are untouched');

    const free = buttons.find(button => button.dataset.activityId === 'hit-free');
    free.style.width = '200px';
    free.style.height = '120px';
    const gesture = { activityId: 'hit-free', activityButton: free, dropTargetGroupId: null };
    free.style.left = '-350px';
    free.style.top = '-210px';
    app.updateMoveDropTarget(gesture);
    assert.equal(gesture.dropTargetGroupId, null, 'an overlapping box with an outside center is not a drop');
    free.style.left = '-400px';
    free.style.top = '-310px';
    app.updateMoveDropTarget(gesture);
    assert.equal(gesture.dropTargetGroupId, 'hit-a', 'the center inside the full box becomes the drop target');
    assert.equal(containers.find(item => item.dataset.groupId === 'hit-a').classList.contains('group-drop-target'), true);
    app.setCanvasDropTarget(null);
    assert.equal(containers.find(item => item.dataset.groupId === 'hit-a').classList.contains('group-drop-target'), false);

    app.activities = [
        { id: 'offset-a1', name: 'A1', position: 0, groupId: 'offset-a', size: 'medium' },
        { id: 'offset-b1', name: 'B1', position: 1, groupId: 'offset-b', size: 'medium' },
        { id: 'offset-free', name: 'Free', position: 2, size: 'medium' }
    ];
    app.activityLayouts = new Map([
        ['offset-a1', { activityId: 'offset-a1', x: 0, y: 0, width: 200, height: 120 }],
        ['offset-b1', { activityId: 'offset-b1', x: 0, y: 0, width: 200, height: 120 }],
        ['offset-free', { activityId: 'offset-free', x: 900, y: 600, width: 200, height: 120 }]
    ]);
    app.groups = [
        { id: 'offset-a', name: 'A', x: 100, y: 100, collapsed: false },
        { id: 'offset-b', name: 'B', x: 180, y: 100, collapsed: false }
    ];
    app.canvasZoom = 1;
    app.canvasPan = { x: 0, y: 0 };
    app.renderMain();
    assert.deepEqual({ ...app.groupDisplayOffset('offset-b') }, { x: 180, y: 0 });
    assert.equal(app.groupDropTargetAt(450, 80)?.id, 'offset-b', 'temporary collision offsets are part of the drop box');
    assert.equal(app.groups[1].x, 180, 'temporary offsets are never persisted');
    assert.equal(app.groups[1].y, 100);

    let freeOffset = buttons.find(button => button.dataset.activityId === 'offset-free');
    pointer('pointerdown', freeOffset, 0, 0);
    pointer('pointermove', freeOffset, -540, -500);
    pointer('pointerup', freeOffset, -540, -500);
    const offsetActivity = app.activities.find(item => item.id === 'offset-free');
    assert.equal(offsetActivity.groupId, 'offset-b', 'an offset group can receive a dropped activity');
    assert.deepEqual(
        { ...app.activityLayouts.get('offset-free') },
        { activityId: 'offset-free', x: 0, y: 128, width: 200, height: 120 },
        'the conversion accounts for the temporary offset and resolves the overlap'
    );
    freeOffset = buttons.find(button => button.dataset.activityId === 'offset-free');
    assert.equal(freeOffset.style.left, '360px', 'the activity renders with the temporary offset');
    assert.equal(freeOffset.style.top, '228px');
    assert.equal(app.groups[1].x, 180, 'the temporary offset is still not persisted');
});

test('dropping an activity onto a group member expands the group and resolves the overlap', async () => {
    const harness = createGroupCanvasHarness();
    const { app, buttons, containers, pointer, storageData } = harness;
    app.activities = [
        { id: 'grow-member', name: 'Member', position: 0, groupId: 'grow-a', size: 'medium' },
        { id: 'grow-free', name: 'Free', position: 1, size: 'medium' }
    ];
    app.activityLayouts = new Map([
        ['grow-member', { activityId: 'grow-member', x: 0, y: 0, width: 200, height: 120 }],
        ['grow-free', { activityId: 'grow-free', x: 800, y: 600, width: 200, height: 120 }]
    ]);
    app.groups = [{ id: 'grow-a', name: 'A', x: 100, y: 100, collapsed: false }];
    app.renderMain();
    let container = containers.find(item => item.dataset.groupId === 'grow-a');
    assert.equal(container.style.left, '80px');
    assert.equal(container.style.top, '64px');
    assert.equal(container.style.width, '240px');
    assert.equal(container.style.height, '176px');

    const free = buttons.find(button => button.dataset.activityId === 'grow-free');
    pointer('pointerdown', free, 0, 0);
    pointer('pointermove', free, -700, -500);
    pointer('pointerup', free, -700, -500);

    const activity = app.activities.find(item => item.id === 'grow-free');
    assert.equal(activity.groupId, 'grow-a', 'the dropped activity joins the group');
    assert.deepEqual(
        { ...app.activityLayouts.get('grow-member') },
        { activityId: 'grow-member', x: 0, y: 0, width: 200, height: 120 },
        'the existing activity is not moved'
    );
    assert.deepEqual(
        { ...app.activityLayouts.get('grow-free') },
        { activityId: 'grow-free', x: 0, y: 128, width: 200, height: 120 },
        'the new activity moves to the nearest free grid slot'
    );
    assert.equal(app.groups[0].x, 100, 'group x stays at its saved value');
    assert.equal(app.groups[0].y, 100, 'group y stays at its saved value');

    container = containers.find(item => item.dataset.groupId === 'grow-a');
    assert.equal(container.style.left, '80px', 'padding stays part of the required bounds');
    assert.equal(container.style.top, '64px', 'the header stays part of the required bounds');
    assert.equal(container.style.width, '240px');
    assert.equal(container.style.height, '304px', 'the container grows to hold both activities');
    const containerBox = container.getBoundingClientRect();
    const memberButton = buttons.find(button => button.dataset.activityId === 'grow-member');
    const freeButton = buttons.find(button => button.dataset.activityId === 'grow-free');
    for (const button of [memberButton, freeButton]) {
        const box = button.getBoundingClientRect();
        assert.ok(
            box.left >= containerBox.left && box.top >= containerBox.top &&
            box.right <= containerBox.right && box.bottom <= containerBox.bottom,
            'every activity is fully inside the container'
        );
    }
    const memberBox = memberButton.getBoundingClientRect();
    const freeBox = freeButton.getBoundingClientRect();
    assert.ok(freeBox.top >= memberBox.bottom, 'the new activity does not overlap the existing one');

    assert.ok(
        storageData.layout.some(item => item.activityId === 'grow-free' && item.x === 0 && item.y === 128),
        'the resolved position is persisted'
    );
    const exported = await app.storage.exportAll();
    assert.equal(exported.activities.find(item => item.id === 'grow-free').groupId, 'grow-a', 'export keeps the membership');
    app.activities = [];
    await app.loadActivities();
    assert.equal(app.activityLayouts.get('grow-free').y, 128, 'reload keeps the resolved layout');
});

test('a group shrinks back when a member is dragged out', async () => {
    const harness = createGroupCanvasHarness();
    const { app, buttons, containers, pointer } = harness;
    app.activities = [
        { id: 'shrink-a1', name: 'A1', position: 0, groupId: 'shrink-a', size: 'medium' },
        { id: 'shrink-a2', name: 'A2', position: 1, groupId: 'shrink-a', size: 'medium' }
    ];
    app.activityLayouts = new Map([
        ['shrink-a1', { activityId: 'shrink-a1', x: 0, y: 0, width: 200, height: 120 }],
        ['shrink-a2', { activityId: 'shrink-a2', x: 0, y: 128, width: 200, height: 120 }]
    ]);
    app.groups = [{ id: 'shrink-a', name: 'A', x: 100, y: 100, collapsed: false }];
    app.renderMain();
    let container = containers.find(item => item.dataset.groupId === 'shrink-a');
    assert.equal(container.style.height, '304px');

    const second = buttons.find(button => button.dataset.activityId === 'shrink-a2');
    pointer('pointerdown', second, 0, 0);
    pointer('pointermove', second, 700, 272);
    pointer('pointerup', second, 700, 272);

    const activity = app.activities.find(item => item.id === 'shrink-a2');
    assert.equal(activity.groupId, undefined, 'the activity leaves the group');
    container = containers.find(item => item.dataset.groupId === 'shrink-a');
    assert.equal(container.style.height, '176px', 'the group shrinks back to its remaining content');
    assert.equal(container.style.width, '240px', 'the group is not left oversized');
    assert.equal(buttons.find(button => button.dataset.activityId === 'shrink-a2').style.top, '496px', 'the removed activity keeps its visual position');
});

test('group overlap resolution works with zoom, pan, negative coordinates, and temporary offsets', async () => {
    const harness = createGroupCanvasHarness();
    const { app, buttons, containers, pointer } = harness;
    app.activities = [
        { id: 'neg-member', name: 'Member', position: 0, groupId: 'neg-a', size: 'medium' },
        { id: 'neg-free', name: 'Free', position: 1, size: 'medium' }
    ];
    app.activityLayouts = new Map([
        ['neg-member', { activityId: 'neg-member', x: 0, y: 0, width: 200, height: 120 }],
        ['neg-free', { activityId: 'neg-free', x: 0, y: 0, width: 200, height: 120 }]
    ]);
    app.groups = [{ id: 'neg-a', name: 'A', x: -400, y: -300, collapsed: false }];
    app.canvasZoom = 2;
    app.canvasPan = { x: -100, y: 50 };
    app.renderMain();

    let free = buttons.find(button => button.dataset.activityId === 'neg-free');
    pointer('pointerdown', free, 0, 0);
    pointer('pointermove', free, -800, -600);
    pointer('pointerup', free, -800, -600);
    const activity = app.activities.find(item => item.id === 'neg-free');
    assert.equal(activity.groupId, 'neg-a', 'the negative-coordinate group receives the activity');
    assert.deepEqual(
        { ...app.activityLayouts.get('neg-free') },
        { activityId: 'neg-free', x: 0, y: 128, width: 200, height: 120 },
        'grid snapping and overlap resolution survive zoom and pan'
    );
    assert.equal(app.groups[0].x, -400, 'negative group x is untouched');
    assert.equal(app.groups[0].y, -300, 'negative group y is untouched');
    free = buttons.find(button => button.dataset.activityId === 'neg-free');
    assert.equal(free.style.left, '-400px');
    assert.equal(free.style.top, '-172px', 'the resolved position keeps the negative frame');
    assert.equal(containers.find(item => item.dataset.groupId === 'neg-a').style.height, '304px');

    app.activities = [
        { id: 'off-a1', name: 'A1', position: 0, groupId: 'off-a', size: 'medium' },
        { id: 'off-b1', name: 'B1', position: 1, groupId: 'off-b', size: 'medium' },
        { id: 'off-free', name: 'Free', position: 2, size: 'medium' }
    ];
    app.activityLayouts = new Map([
        ['off-a1', { activityId: 'off-a1', x: 0, y: 0, width: 200, height: 120 }],
        ['off-b1', { activityId: 'off-b1', x: 0, y: 0, width: 200, height: 120 }],
        ['off-free', { activityId: 'off-free', x: 900, y: 600, width: 200, height: 120 }]
    ]);
    app.groups = [
        { id: 'off-a', name: 'A', x: 100, y: 100, collapsed: false },
        { id: 'off-b', name: 'B', x: 180, y: 100, collapsed: false }
    ];
    app.canvasZoom = 1;
    app.canvasPan = { x: 0, y: 0 };
    app.renderMain();
    assert.deepEqual({ ...app.groupDisplayOffset('off-b') }, { x: 180, y: 0 });

    let freeOffset = buttons.find(button => button.dataset.activityId === 'off-free');
    pointer('pointerdown', freeOffset, 0, 0);
    pointer('pointermove', freeOffset, -540, -500);
    pointer('pointerup', freeOffset, -540, -500);
    const offsetActivity = app.activities.find(item => item.id === 'off-free');
    assert.equal(offsetActivity.groupId, 'off-b');
    assert.deepEqual(
        { ...app.activityLayouts.get('off-free') },
        { activityId: 'off-free', x: 0, y: 128, width: 200, height: 120 },
        'overlap resolution uses the offset-free relative frame'
    );
    assert.deepEqual({ ...app.groupDisplayOffset('off-b') }, { x: 180, y: 0 }, 'the temporary offset is unchanged');
    assert.equal(app.groups[1].x, 180, 'the temporary offset is never persisted');
    freeOffset = buttons.find(button => button.dataset.activityId === 'off-free');
    assert.equal(freeOffset.style.left, '360px', 'rendering applies the temporary offset');
    assert.equal(freeOffset.style.top, '228px');
    const offMember = buttons.find(button => button.dataset.activityId === 'off-b1');
    assert.ok(freeOffset.getBoundingClientRect().top >= offMember.getBoundingClientRect().bottom, 'the resolved activity does not overlap the member');
});

test('group dragging keeps using saved coordinates while temporary offsets are active', async () => {
    const harness = createGroupCanvasHarness();
    const { app, containers, buttons, pointer, storageData } = harness;
    app.activities = [
        { id: 'dragc-a1', name: 'A1', position: 0, groupId: 'dragc-a', size: 'medium' },
        { id: 'dragc-b1', name: 'B1', position: 1, groupId: 'dragc-b', size: 'medium' }
    ];
    app.activityLayouts = new Map([
        ['dragc-a1', { activityId: 'dragc-a1', x: 0, y: 0, width: 200, height: 120 }],
        ['dragc-b1', { activityId: 'dragc-b1', x: 0, y: 0, width: 200, height: 120 }]
    ]);
    app.groups = [
        { id: 'dragc-a', name: 'A', x: 100, y: 100, collapsed: false },
        { id: 'dragc-b', name: 'B', x: 180, y: 100, collapsed: false }
    ];
    app.renderMain();
    assert.equal(app.groupDisplayOffset('dragc-b').x, 180);

    const title = containers.find(container => container.dataset.groupId === 'dragc-b').children[0];
    pointer('pointerdown', title, 0, 0);
    pointer('pointermove', title, 32, 0);
    assert.equal(app.groups[1].x, 208, 'the saved group position follows the pointer without the temporary offset');
    assert.equal(app.groupDisplayOffset('dragc-b').x, 180, 'the temporary offset is unchanged during the drag');
    const member = buttons.find(button => button.dataset.activityId === 'dragc-b1');
    assert.equal(member.style.left, '388px', 'the rendered position combines saved coordinates and the temporary offset');
    pointer('pointerup', title, 32, 0);
    assert.equal(app.groups[1].x, 208);
    assert.ok(storageData.groups.some(group => group.id === 'dragc-b' && group.x === 208), 'the saved coordinate is persisted');
});

test('group selection action tracks a valid selection only', async () => {
    const harness = createGroupCanvasHarness();
    const { app, createGroupBtn, viewport, pointer } = harness;
    app.activities = [
        { id: 'sel-a', name: 'A', position: 0, groupId: 'sel-group', size: 'medium' },
        { id: 'sel-b', name: 'B', position: 1, size: 'medium' }
    ];
    app.activityLayouts = new Map([
        ['sel-a', { activityId: 'sel-a', x: 0, y: 0, width: 200, height: 120 }],
        ['sel-b', { activityId: 'sel-b', x: 400, y: 0, width: 200, height: 120 }]
    ]);
    app.groups = [{ id: 'sel-group', name: 'G', x: 0, y: 0, collapsed: false }];
    app.renderMain();

    app.setCanvasSelection(['sel-a']);
    assert.equal(createGroupBtn.hidden, false, 'a valid selection enables the action');
    app.setCanvasSelection([]);
    assert.equal(createGroupBtn.hidden, true, 'clearing the selection hides the action');

    app.setCanvasSelection(['sel-a']);
    pointer('pointerdown', viewport, 500, 500);
    assert.equal(app.selectedActivityIds.size, 0, 'a new canvas interaction clears the selection');
    assert.equal(createGroupBtn.hidden, true);
    pointer('pointerup', viewport, 500, 500);

    app.setCanvasSelection(['sel-a']);
    await app.toggleGroupCollapsed('sel-group');
    assert.equal(app.selectedActivityIds.size, 0, 'collapsing prunes now-hidden selected members');
    assert.equal(createGroupBtn.hidden, true);

    app.setCanvasSelection(['sel-b']);
    const group = await app.createGroupFromSelection('Extra');
    assert.ok(group);
    assert.equal(app.selectedActivityIds.size, 0, 'successful creation clears the selection');
    assert.equal(createGroupBtn.hidden, true, 'the action disappears after successful creation');

    app.setCanvasSelection(['sel-b']);
    app.switchScreen('review');
    assert.equal(app.selectedActivityIds.size, 0, 'leaving the canvas clears the selection');
});

test('add activity action stays available without selection or groups', () => {
    const harness = createGroupCanvasHarness();
    const { app, addActivityBtn, viewport, pointer } = harness;
    app.activities = [];
    app.groups = [];
    app.selectedActivityIds = new Set();
    app.renderMain();

    assert.equal(addActivityBtn.hidden, false, 'the add action is visible on an empty canvas');
    assert.equal(addActivityBtn.textContent, '+');

    app.setCanvasSelection(['missing-activity']);
    assert.equal(addActivityBtn.hidden, false, 'selection state never hides the add action');
    app.setCanvasSelection([]);
    assert.equal(addActivityBtn.hidden, false, 'clearing the selection never hides the add action');

    pointer('pointerdown', viewport, 0, 0);
    pointer('pointermove', viewport, 60, 40);
    pointer('pointerup', viewport, 60, 40);
    assert.deepEqual({ ...app.canvasPan }, { x: 60, y: 40 }, 'canvas panning still works');
    assert.equal(addActivityBtn.style.transform, undefined, 'canvas pan never moves the toolbar action');
    assert.equal(addActivityBtn.style.left, undefined, 'canvas pan never repositions the toolbar action');
    assert.equal(addActivityBtn.style.top, undefined, 'canvas pan never repositions the toolbar action');

    app.renderMain();
    app.zoomCanvasAt(2, 100, 100);
    assert.equal(app.canvasZoom, 2, 'canvas zooming still works');
    assert.equal(addActivityBtn.style.transform, undefined, 'canvas zoom never moves the toolbar action');
});

test('toolbar docking measures the real bottom navigation height', () => {
    const { app, document, context } = createTestApp();
    const nav = { getBoundingClientRect: () => ({ height: 103 }) };
    document.querySelector = selector => (selector === '.navbar-actions' ? nav : null);
    document.documentElement.style = {
        values: {},
        setProperty(name, value) { this.values[name] = value; },
        removeProperty(name) { delete this.values[name]; }
    };

    context.window.getComputedStyle = () => ({ position: 'fixed', bottom: '0px' });
    app.syncCanvasToolbarLayout();
    assert.equal(document.documentElement.style.values['--bottom-nav-height'], '103px', 'the toolbar docks above the measured navigation');

    context.window.getComputedStyle = () => ({ position: 'static', bottom: 'auto' });
    app.syncCanvasToolbarLayout();
    assert.equal(document.documentElement.style.values['--bottom-nav-height'], undefined, 'desktop navigation keeps the CSS fallback');

    document.querySelector = () => null;
    assert.doesNotThrow(() => app.syncCanvasToolbarLayout());
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
    assert.equal(customerInput.placeholder, app.t('clockodoCustomerSelectLabel'));
    assert.equal(serviceInput.placeholder, app.t('clockodoServiceSelectLabel'));

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

test('retry rebuilds cached payloads that still contain millisecond timestamps', async () => {
    const { app, context } = createTestApp();
    vm.runInContext(clockodoClientSource, context);
    app.clockodoConfigured = true;
    app.clockodoCustomerId = '11';
    app.clockodoServiceId = '21';
    app.showToast = () => {};
    app.renderReview = () => {};
    app.getPushClientId = () => 'client_1234567890abcdef';
    app.getClockodoAccessToken = () => 'a'.repeat(48);
    const start = Date.parse('2026-10-05T06:33:25.109Z');
    app.syncBatches = [{
        id: 'stale-batch', date: '2026-10-05', version: 1, state: 'failed',
        entries: [{
            id: 'stale-entry', activityId: 'act-1', activityNameSnapshot: 'Painting',
            startTimestamp: start, endTimestamp: start + 1000,
            customerId: '11', serviceId: '21', syncStatus: 'failed', syncBatchId: 'stale-batch',
            clockodoPayload: {
                time_since: '2026-10-05T06:33:25.109Z', time_until: '2026-10-05T06:33:26.109Z',
                customers_id: 11, services_id: 21, billable: 1, text: 'Painting'
            }
        }]
    }];
    const sent = [];
    app.clockodoClient = new context.ClockodoClient({
        fetchImpl: async (url, init) => {
            sent.push(JSON.parse(init.body));
            return { status: 200, ok: true, json: async () => ({ created: true, entryId: 903 }) };
        }
    });

    const result = await app.retrySyncBatch('stale-batch');
    assert.equal(result.state, 'synced');
    assert.equal(sent.length, 1);
    assert.equal(sent[0].time_since, '2026-10-05T06:35:00Z');
    assert.equal(sent[0].time_until, '2026-10-05T06:35:00Z');
    assert.equal(sent[0].customers_id, 11);
    assert.equal(sent[0].services_id, 21);
});

test('Cyrillic activity assignment survives to the Clockodo payload through an archived activity', async () => {
    const { app, context } = createTestApp();
    vm.runInContext(clockodoClientSource, context);
    const name = 'Снимал замеры для дерева и инт';
    const start = Date.parse('2026-10-05T08:03:02.000Z');
    await app.addEntry({
        id: 'cyr-entry', activityId: 'act-cyr', activityNameSnapshot: name,
        startTimestamp: start, endTimestamp: start + 120000
    });
    assert.equal(app.timeEntries[0].customerId, null);
    assert.equal(app.timeEntries[0].serviceId, null);
    app.activities = [];
    app.archivedActivities = [{
        id: 'act-cyr', name, customerId: '11', serviceId: '21',
        customerName: 'Bauunternehmen Müller', serviceName: 'Rohbau', archived: true
    }];
    app.reviewDate = '2026-10-05';
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
            sent.push({ body: JSON.parse(init.body), key: init.headers['Idempotency-Key'] });
            return { status: 200, ok: true, json: async () => ({ created: true, entryId: 904 }) };
        }
    });
    app.showSyncConfirmationModal();
    const batch = await app.confirmAndSyncClockodo();
    assert.equal(batch.state, 'synced');
    assert.equal(sent.length, 1);
    assert.equal(sent[0].body.customers_id, 11);
    assert.equal(sent[0].body.services_id, 21);
    assert.equal(sent[0].body.text, null);
    assert.equal(JSON.stringify(sent[0].body).includes(name), false);
    assert.equal(sent[0].key, 'timerhub-entry:cyr-entry');
});

test('Day Review preview and Clockodo payload share rounded timestamps while raw storage stays exact', async () => {
    const { app, context, storageData, document } = createTestApp();
    vm.runInContext(clockodoClientSource, context);
    const start = Date.parse('2026-10-05T12:38:02.000Z');
    const end = Date.parse('2026-10-05T17:23:01.000Z');
    await app.addEntry({
        id: 'round-me', activityId: 'act-1', activityNameSnapshot: 'Painting',
        startTimestamp: start, endTimestamp: end, customerId: '11', serviceId: '21'
    });
    app.reviewDate = '2026-10-05';
    app.clockodoConfigured = true;
    app.showToast = () => {};
    app.getPushClientId = () => 'client_1234567890abcdef';
    app.getClockodoAccessToken = () => 'a'.repeat(48);
    const sent = [];
    app.clockodoClient = new context.ClockodoClient({
        fetchImpl: async (url, init) => {
            sent.push({ body: JSON.parse(init.body), key: init.headers['Idempotency-Key'] });
            return { status: 200, ok: true, json: async () => ({ created: true, entryId: 905 }) };
        }
    });

    const roundedStart = Date.parse('2026-10-05T12:40:00Z');
    const roundedEnd = Date.parse('2026-10-05T17:25:00Z');
    app.renderReview();
    const reviewHtml = document.getElementById('reviewEntriesList').innerHTML;
    assert.equal(reviewHtml.includes(app.formatTime(roundedStart)), true);
    assert.equal(reviewHtml.includes(app.formatTime(roundedEnd)), true);

    app.showSyncConfirmationModal();
    const previewHtml = document.getElementById('syncConfirmEntriesList').innerHTML;
    assert.equal(previewHtml.includes(app.formatTime(roundedStart)), true);
    assert.equal(previewHtml.includes(app.formatTime(roundedEnd)), true);

    const batch = await app.confirmAndSyncClockodo();
    assert.equal(batch.state, 'synced');
    assert.equal(sent[0].body.time_since, '2026-10-05T12:40:00Z');
    assert.equal(sent[0].body.time_until, '2026-10-05T17:25:00Z');
    assert.equal(/\.\d{3}Z$/.test(sent[0].body.time_since) || /\.\d{3}Z$/.test(sent[0].body.time_until), false);
    assert.equal(sent[0].key, 'timerhub-entry:round-me');
    assert.equal(app.timeEntries.find(entry => entry.id === 'round-me').startTimestamp, start);
    assert.equal(app.timeEntries.find(entry => entry.id === 'round-me').endTimestamp, end);
    assert.equal(storageData.timeEntries.find(entry => entry.id === 'round-me').startTimestamp, start);
    assert.equal(storageData.timeEntries.find(entry => entry.id === 'round-me').endTimestamp, end);
});

async function createOverlapApp() {
    const { app, document, storageData } = createTestApp();
    const t = (h, m, s = 0) => new Date(2026, 8, 28, h, m, s).getTime();
    await app.addEntry({ id: 'entry-a', activityId: 'act-1', activityNameSnapshot: 'A', startTimestamp: t(12, 0), endTimestamp: t(12, 30) });
    await app.addEntry({ id: 'entry-b', activityId: 'act-2', activityNameSnapshot: 'B', startTimestamp: t(12, 30), endTimestamp: t(13, 0) });
    app.activities = [{ id: 'act-1', name: 'A' }, { id: 'act-2', name: 'B' }];
    app.reviewDate = '2026-09-28';
    app.renderLog = () => {};
    app.renderReview = () => {};
    const toasts = [];
    app.showToast = message => toasts.push(message);
    const setTimes = (start, end, date = '2026-09-28') => {
        document.getElementById('entryEditDate').value = date;
        document.getElementById('entryEditStart').value = start;
        document.getElementById('entryEditEndDate').value = date;
        document.getElementById('entryEditEnd').value = end;
    };
    return { app, document, storageData, t, setTimes, toasts };
}

test('editing an existing entry without changing its interval does not overlap with itself', async () => {
    const { app, document, storageData, t, setTimes, toasts } = await createOverlapApp();
    app.showEntryEditModal('entry-a');
    setTimes('12:00', '12:30');
    await app.saveTimeEntry();
    assert.equal(document.getElementById('entryConflictWarning').style.display, 'none');
    assert.deepEqual(toasts, []);
    assert.equal(storageData.timeEntries.find(entry => entry.id === 'entry-a').startTimestamp, t(12, 0));
    assert.equal(storageData.timeEntries.find(entry => entry.id === 'entry-a').endTimestamp, t(12, 30));
});

test('moving an existing entry into another entry warns but still saves the change', async () => {
    const { app, document, storageData, t, setTimes, toasts } = await createOverlapApp();
    app.showEntryEditModal('entry-a');
    setTimes('12:05', '12:35');
    await app.saveTimeEntry();
    assert.equal(document.getElementById('entryConflictWarning').style.display, 'block');
    assert.deepEqual(toasts, [app.t('overlappingEntry')]);
    assert.equal(storageData.timeEntries.find(entry => entry.id === 'entry-a').startTimestamp, t(12, 5));
    assert.equal(storageData.timeEntries.find(entry => entry.id === 'entry-a').endTimestamp, t(12, 35));
});

test('moving an existing entry to a non-overlapping interval is accepted', async () => {
    const { app, document, storageData, t, setTimes } = await createOverlapApp();
    app.showEntryEditModal('entry-a');
    setTimes('11:55', '12:25');
    await app.saveTimeEntry();
    assert.equal(document.getElementById('entryConflictWarning').style.display, 'none');
    assert.equal(storageData.timeEntries.find(entry => entry.id === 'entry-a').startTimestamp, t(11, 55));
    assert.equal(storageData.timeEntries.find(entry => entry.id === 'entry-a').endTimestamp, t(12, 25));
});

test('entries that only overlap within a five-minute rounding boundary are not conflicts', async () => {
    const { app, document, storageData } = createTestApp();
    const t = (h, m, s = 0) => new Date(2026, 8, 28, h, m, s).getTime();
    await app.addEntry({ id: 'entry-a', activityId: 'act-1', activityNameSnapshot: 'A', startTimestamp: t(12, 0), endTimestamp: t(12, 30) });
    await app.addEntry({ id: 'entry-b', activityId: 'act-2', activityNameSnapshot: 'B', startTimestamp: t(12, 29, 45), endTimestamp: t(13, 0) });
    app.activities = [{ id: 'act-1', name: 'A' }, { id: 'act-2', name: 'B' }];
    app.reviewDate = '2026-09-28';
    app.renderLog = () => {};
    app.renderReview = () => {};
    const toasts = [];
    app.showToast = message => toasts.push(message);
    app.showEntryEditModal('entry-a');
    document.getElementById('entryEditDate').value = '2026-09-28';
    document.getElementById('entryEditStart').value = '12:00';
    document.getElementById('entryEditEndDate').value = '2026-09-28';
    document.getElementById('entryEditEnd').value = '12:30';
    await app.saveTimeEntry();
    assert.deepEqual([...app.getOverlappingEntryIds()], []);
    assert.equal(document.getElementById('entryConflictWarning').style.display, 'none');
    assert.deepEqual(toasts, []);
    assert.equal(storageData.timeEntries.find(entry => entry.id === 'entry-a').endTimestamp, t(12, 30));
});

test('the edited entry is excluded by stable ID rather than object identity', async () => {
    const { app, document, storageData } = createTestApp();
    const t = (h, m, s = 0) => new Date(2026, 8, 28, h, m, s).getTime();
    await app.addEntry({ id: '1', activityId: 'act-1', activityNameSnapshot: 'A', startTimestamp: t(12, 0), endTimestamp: t(12, 30) });
    app.activities = [{ id: 'act-1', name: 'A' }];
    app.reviewDate = '2026-09-28';
    app.renderLog = () => {};
    app.renderReview = () => {};
    app.showToast = () => {};
    app.editingEntryId = 1;
    document.getElementById('entryEditDate').value = '2026-09-28';
    document.getElementById('entryEditStart').value = '12:00';
    document.getElementById('entryEditEndDate').value = '2026-09-28';
    document.getElementById('entryEditEnd').value = '12:30';
    await app.saveTimeEntry();
    assert.equal(document.getElementById('entryConflictWarning').style.display, 'none');
    assert.equal(app.timeEntries.length, 1);
    assert.equal(app.timeEntries[0].id, '1');
    assert.equal(storageData.timeEntries.length, 1);
    assert.equal(storageData.timeEntries[0].endTimestamp, t(12, 30));
});

test('newly created entries still detect real overlaps and are saved with a warning', async () => {
    const { app, document, toasts } = await createOverlapApp();
    app.showAddEntryModal();
    document.getElementById('entryEditDate').value = '2026-09-28';
    document.getElementById('entryEditStart').value = '12:45';
    document.getElementById('entryEditEndDate').value = '2026-09-28';
    document.getElementById('entryEditEnd').value = '13:15';
    await app.saveTimeEntry();
    assert.equal(document.getElementById('entryConflictWarning').style.display, 'block');
    assert.deepEqual(toasts, [app.t('overlappingEntry')]);
    assert.equal(app.timeEntries.length, 3);
});

test('editing an entry without changing its time preserves raw seconds and avoids a false overlap', async () => {
    const { app, document, storageData } = createTestApp();
    const t = (h, m, s = 0) => new Date(2026, 8, 28, h, m, s).getTime();
    await app.addEntry({ id: 'entry-a', activityId: 'act-1', activityNameSnapshot: 'A', startTimestamp: t(12, 0, 45), endTimestamp: t(12, 30, 0) });
    await app.addEntry({ id: 'entry-b', activityId: 'act-2', activityNameSnapshot: 'B', startTimestamp: t(11, 59, 0), endTimestamp: t(12, 0, 30) });
    app.activities = [{ id: 'act-1', name: 'A' }, { id: 'act-2', name: 'B' }];
    app.reviewDate = '2026-09-28';
    app.renderLog = () => {};
    app.renderReview = () => {};
    app.showToast = () => {};

    app.showEntryEditModal('entry-a');
    await app.saveTimeEntry();

    assert.equal(document.getElementById('entryConflictWarning').style.display, 'none');
    assert.equal(storageData.timeEntries.find(entry => entry.id === 'entry-a').startTimestamp, t(12, 0, 45));
    assert.equal(storageData.timeEntries.find(entry => entry.id === 'entry-a').endTimestamp, t(12, 30, 0));
});

test('editing only the end time keeps the original start seconds and does not report overlap', async () => {
    const { app, document, storageData } = createTestApp();
    const t = (h, m, s = 0) => new Date(2026, 8, 28, h, m, s).getTime();
    await app.addEntry({ id: 'entry-a', activityId: 'act-1', activityNameSnapshot: 'A', startTimestamp: t(12, 0, 45), endTimestamp: t(12, 30, 0) });
    await app.addEntry({ id: 'entry-b', activityId: 'act-2', activityNameSnapshot: 'B', startTimestamp: t(11, 59, 0), endTimestamp: t(12, 0, 30) });
    app.activities = [{ id: 'act-1', name: 'A' }, { id: 'act-2', name: 'B' }];
    app.reviewDate = '2026-09-28';
    app.renderLog = () => {};
    app.renderReview = () => {};
    app.showToast = () => {};

    app.showEntryEditModal('entry-a');
    document.getElementById('entryEditEnd').value = '12:45';
    await app.saveTimeEntry();

    assert.equal(document.getElementById('entryConflictWarning').style.display, 'none');
    assert.equal(storageData.timeEntries.find(entry => entry.id === 'entry-a').startTimestamp, t(12, 0, 45));
    assert.equal(storageData.timeEntries.find(entry => entry.id === 'entry-a').endTimestamp, t(12, 45, 0));
});

test('the 09:25-10:15 and 10:15-11:50 example does not conflict after five-minute rounding', async () => {
    const { app, document, storageData, toasts, t } = await createConflictApp(t => [
        { id: 'entry-a', activityId: 'act-1', activityNameSnapshot: 'A', startTimestamp: t(9, 25), endTimestamp: t(10, 15) },
        { id: 'entry-b', activityId: 'act-2', activityNameSnapshot: 'B', startTimestamp: t(10, 15), endTimestamp: t(11, 50) }
    ]);

    assert.deepEqual([...app.getOverlappingEntryIds()], [], 'boundary-touching rounded intervals are not overlaps');

    app.showEntryEditModal('entry-a');
    await app.saveTimeEntry();

    assert.equal(document.getElementById('entryConflictWarning').style.display, 'none');
    assert.deepEqual(toasts, []);
    assert.equal(document.getElementById('reviewEntriesList').innerHTML.includes('conflict-entry'), false);
    assert.equal(storageData.timeEntries.find(entry => entry.id === 'entry-a').startTimestamp, t(9, 25));
    assert.equal(storageData.timeEntries.find(entry => entry.id === 'entry-a').endTimestamp, t(10, 15));
});

async function createConflictApp(buildEntries) {
    const harness = createTestApp();
    const t = (h, m, s = 0, ms = 0) => new Date(2026, 8, 28, h, m, s, ms).getTime();
    harness.app.activities = [
        { id: 'act-1', name: 'A', color: '#27AE60' },
        { id: 'act-2', name: 'B', color: '#3498DB' },
        { id: 'act-3', name: 'C', color: '#9B59B6' }
    ];
    for (const entry of buildEntries(t)) await harness.app.addEntry(entry);
    harness.app.reviewDate = '2026-09-28';
    harness.app.renderLog = () => {};
    return { ...harness, t };
}

test('editing an entry with unchanged millisecond timestamps preserves them exactly and does not self-overlap', async () => {
    const { app, document, storageData, toasts, t } = await createConflictApp(t => [
        { id: 'entry-a', activityId: 'act-1', activityNameSnapshot: 'A', startTimestamp: t(12, 0, 45, 123), endTimestamp: t(12, 30, 0, 456) },
        { id: 'entry-b', activityId: 'act-2', activityNameSnapshot: 'B', startTimestamp: t(11, 59, 0), endTimestamp: t(12, 0, 30) }
    ]);
    app.renderReview = () => {};

    app.showEntryEditModal('entry-a');
    await app.saveTimeEntry();

    assert.equal(document.getElementById('entryConflictWarning').style.display, 'none');
    assert.deepEqual(toasts, []);
    assert.equal(storageData.timeEntries.find(entry => entry.id === 'entry-a').startTimestamp, t(12, 0, 45, 123));
    assert.equal(storageData.timeEntries.find(entry => entry.id === 'entry-a').endTimestamp, t(12, 30, 0, 456));
});

test('the edited entry stays excluded from conflict detection after the entry list is reloaded', async () => {
    const { app, document, storageData, toasts, t } = await createConflictApp(t => [
        { id: 'entry-a', activityId: 'act-1', activityNameSnapshot: 'A', startTimestamp: t(12, 0), endTimestamp: t(12, 30) }
    ]);
    app.renderReview = () => {};
    await app.loadTimeEntries();

    app.showEntryEditModal('entry-a');
    await app.saveTimeEntry();

    assert.equal(document.getElementById('entryConflictWarning').style.display, 'none');
    assert.deepEqual(toasts, []);
    assert.equal(storageData.timeEntries.find(entry => entry.id === 'entry-a').startTimestamp, t(12, 0));
    assert.equal(storageData.timeEntries.find(entry => entry.id === 'entry-a').endTimestamp, t(12, 30));
});

test('an unchanged saved entry is not marked as conflicting with itself', async () => {
    const { app, document, toasts, t } = await createConflictApp(t => [
        { id: 'entry-a', activityId: 'act-1', activityNameSnapshot: 'A', startTimestamp: t(12, 0), endTimestamp: t(12, 30) }
    ]);

    app.showEntryEditModal('entry-a');
    await app.saveTimeEntry();
    app.renderReview();

    const html = document.getElementById('reviewEntriesList').innerHTML;
    assert.deepEqual(toasts, []);
    assert.equal(html.includes('conflict-entry'), false);
});

test('real overlaps are detected, no longer block saving, and are marked as conflicts after the save', async () => {
    const { app, document, storageData, toasts, t } = await createConflictApp(t => [
        { id: 'entry-a', activityId: 'act-1', activityNameSnapshot: 'A', startTimestamp: t(12, 0), endTimestamp: t(12, 30) },
        { id: 'entry-b', activityId: 'act-2', activityNameSnapshot: 'B', startTimestamp: t(12, 15), endTimestamp: t(12, 45) },
        { id: 'entry-c', activityId: 'act-3', activityNameSnapshot: 'C', startTimestamp: t(13, 0), endTimestamp: t(13, 30) }
    ]);

    assert.deepEqual([...app.getOverlappingEntryIds()].sort(), ['entry-a', 'entry-b']);

    app.showEntryEditModal('entry-a');
    document.getElementById('entryEditStart').value = '12:20';
    document.getElementById('entryEditEnd').value = '12:50';
    await app.saveTimeEntry();

    assert.equal(document.getElementById('entryConflictWarning').style.display, 'block');
    assert.deepEqual(toasts, [app.t('overlappingEntry')]);
    const stored = storageData.timeEntries.find(entry => entry.id === 'entry-a');
    assert.equal(stored.startTimestamp, t(12, 20));
    assert.equal(stored.endTimestamp, t(12, 50));

    app.renderReview();
    const html = document.getElementById('reviewEntriesList').innerHTML;
    const cards = html.split('<article ');
    const cardA = cards.find(card => card.includes('data-entry-id="entry-a"'));
    const cardB = cards.find(card => card.includes('data-entry-id="entry-b"'));
    const cardC = cards.find(card => card.includes('data-entry-id="entry-c"'));
    assert.ok(cardA.includes('conflict-entry'), 'entry-a is marked as conflicting');
    assert.ok(cardB.includes('conflict-entry'), 'entry-b is marked as conflicting');
    assert.equal(cardC.includes('conflict-entry'), false, 'non-conflicting entry-c keeps its normal appearance');
    assert.ok(
        cardA.includes(app.t('overlappingEntry')) || cardA.includes(app.t('issueOverlapping')),
        'the localized overlap warning is visible on the entry'
    );
});

test('conflict state recalculates when an overlap is removed and after an entry is deleted', async () => {
    const { app, document, t } = await createConflictApp(t => [
        { id: 'entry-a', activityId: 'act-1', activityNameSnapshot: 'A', startTimestamp: t(12, 0), endTimestamp: t(12, 30) },
        { id: 'entry-b', activityId: 'act-2', activityNameSnapshot: 'B', startTimestamp: t(12, 15), endTimestamp: t(12, 45) }
    ]);
    const countConflicts = () => {
        app.renderReview();
        const html = document.getElementById('reviewEntriesList').innerHTML;
        return (html.match(/conflict-entry/g) || []).length;
    };

    assert.equal(countConflicts(), 2);

    await app.updateEntry('entry-b', { startTimestamp: t(12, 30), endTimestamp: t(13, 0) });
    assert.equal(countConflicts(), 0, 'the red state clears once the entries only touch');

    await app.updateEntry('entry-b', { startTimestamp: t(12, 15), endTimestamp: t(12, 45) });
    assert.equal(countConflicts(), 2, 'the red state returns when the overlap returns');

    await app.deleteEntry('entry-a');
    assert.equal(countConflicts(), 0, 'deleting a conflicting entry clears the red state from the other entry');
});

test('multiple overlapping entries are all flagged and still save with one warning', async () => {
    const { app, document, storageData, toasts, t } = await createConflictApp(t => [
        { id: 'entry-a', activityId: 'act-1', activityNameSnapshot: 'A', startTimestamp: t(12, 0), endTimestamp: t(12, 30) },
        { id: 'entry-b', activityId: 'act-2', activityNameSnapshot: 'B', startTimestamp: t(12, 10), endTimestamp: t(12, 40) },
        { id: 'entry-c', activityId: 'act-3', activityNameSnapshot: 'C', startTimestamp: t(12, 20), endTimestamp: t(12, 50) }
    ]);

    assert.deepEqual([...app.getOverlappingEntryIds()].sort(), ['entry-a', 'entry-b', 'entry-c']);
    app.renderReview();
    const html = document.getElementById('reviewEntriesList').innerHTML;
    assert.equal((html.match(/conflict-entry/g) || []).length, 3);

    app.showAddEntryModal();
    document.getElementById('entryEditDate').value = '2026-09-28';
    document.getElementById('entryEditStart').value = '12:45';
    document.getElementById('entryEditEndDate').value = '2026-09-28';
    document.getElementById('entryEditEnd').value = '13:15';
    await app.saveTimeEntry();

    assert.equal(document.getElementById('entryConflictWarning').style.display, 'block');
    assert.deepEqual(toasts, [app.t('overlappingEntry')]);
    assert.equal(storageData.timeEntries.length, 4);
});

test('touching boundaries such as 10:00-11:00 and 11:00-12:00 are not overlapping', async () => {
    const { app, document, toasts, t } = await createConflictApp(t => [
        { id: 'entry-a', activityId: 'act-1', activityNameSnapshot: 'A', startTimestamp: t(10, 0), endTimestamp: t(11, 0) },
        { id: 'entry-b', activityId: 'act-2', activityNameSnapshot: 'B', startTimestamp: t(11, 0), endTimestamp: t(12, 0) }
    ]);
    assert.deepEqual([...app.getOverlappingEntryIds()], []);

    app.showEntryEditModal('entry-a');
    await app.saveTimeEntry();
    app.renderReview();

    assert.equal(document.getElementById('entryConflictWarning').style.display, 'none');
    assert.deepEqual(toasts, []);
    assert.equal(document.getElementById('reviewEntriesList').innerHTML.includes('conflict-entry'), false);
});

test('conflict detection uses five-minute rounded boundaries instead of exact timestamps', async () => {
    const { app, document, storageData, toasts, t } = await createConflictApp(t => [
        { id: 'entry-a', activityId: 'act-1', activityNameSnapshot: 'A', startTimestamp: t(12, 36, 0), endTimestamp: t(12, 37, 0) },
        { id: 'entry-b', activityId: 'act-2', activityNameSnapshot: 'B', startTimestamp: t(12, 36, 30), endTimestamp: t(12, 38, 0) }
    ]);

    assert.equal(app.roundToFiveMinutes(t(12, 38, 0)), t(12, 40, 0), '12:38 rounds to 12:40');
    assert.equal(app.roundToFiveMinutes(t(12, 40, 0)), t(12, 40, 0), 'exact five-minute boundaries stay unchanged');
    assert.equal(app.roundToFiveMinutes(t(12, 37, 29)), t(12, 35, 0), 'below the midpoint rounds down');
    assert.equal(app.roundToFiveMinutes(t(12, 37, 30)), t(12, 35, 0), 'the exact midpoint rounds down');
    assert.equal(app.roundToFiveMinutes(t(12, 37, 31)), t(12, 40, 0), 'above the midpoint rounds up');
    assert.deepEqual([...app.getOverlappingEntryIds()], [], 'rounding turns the exact overlap into touching boundaries');

    app.showEntryEditModal('entry-b');
    await app.saveTimeEntry();

    assert.equal(document.getElementById('entryConflictWarning').style.display, 'none');
    assert.deepEqual(toasts, []);
    assert.equal(storageData.timeEntries.find(entry => entry.id === 'entry-b').startTimestamp, t(12, 36, 30));
    assert.equal(storageData.timeEntries.find(entry => entry.id === 'entry-b').endTimestamp, t(12, 38, 0));
});

test('malformed and invalid time ranges are still rejected before overlap handling', async () => {
    const { app, document, toasts } = await createConflictApp(() => []);
    app.showAddEntryModal();
    const value = (id, nextValue) => { document.getElementById(id).value = nextValue; };

    value('entryEditDate', 'not-a-date');
    value('entryEditStart', '25:99');
    value('entryEditEndDate', '2026-09-28');
    value('entryEditEnd', '10:00');
    await app.saveTimeEntry();
    assert.deepEqual(toasts, [app.t('pleaseFillAllFields')]);
    assert.equal(app.timeEntries.length, 0);

    value('entryEditDate', '2026-09-28');
    value('entryEditStart', '10:00');
    value('entryEditEnd', '09:00');
    await app.saveTimeEntry();
    assert.deepEqual(toasts, [app.t('pleaseFillAllFields'), app.t('startBeforeEnd')]);
    assert.equal(app.timeEntries.length, 0);

    value('entryEditStart', '10:00');
    value('entryEditEndDate', '2026-09-29');
    value('entryEditEnd', '11:30');
    await app.saveTimeEntry();
    assert.deepEqual(toasts, [app.t('pleaseFillAllFields'), app.t('startBeforeEnd'), app.t('entryTooLong')]);
    assert.equal(app.timeEntries.length, 0);
});

test('the overlap warning is localized in English, German, and Russian', async () => {
    const { app } = createTestApp();
    const expected = {
        en: 'This time overlaps with another entry',
        de: 'Diese Zeit überlappt mit einem anderen Eintrag',
        ru: 'Это время пересекается с другой записью'
    };
    for (const [language, text] of Object.entries(expected)) {
        app.currentLanguage = language;
        assert.equal(app.t('overlappingEntry'), text, `${language} overlap warning`);
    }
});

test('retry failures render a visible diagnostic with the real error details', async () => {
    const { app, document } = createTestApp();
    const start = new Date(2026, 8, 28, 8, 0).getTime();
    await app.addEntry({ id: 'diag-entry', activityId: 'act-1', activityNameSnapshot: 'Painting', startTimestamp: start, endTimestamp: start + 60000 });
    app.reviewDate = '2026-09-28';
    app.clockodoConfigured = true;
    app.clockodoCustomerId = '12';
    app.clockodoServiceId = '56';
    app.showToast = () => {};
    app.getPushClientId = () => 'client_1234567890abcdef';
    app.getClockodoAccessToken = () => 'a'.repeat(48);
    app.clockodoClient = {
        buildEntryPayload: () => ({ id: 'diag-entry' }),
        async createEntry() {
            const error = Object.assign(new Error('clockodo_rejected'), { code: 'clockodo_rejected', status: 422 });
            error.details = {
                status: 422, code: 'Validation', message: 'Service is not available for this customer.',
                path: '/services_id', fields: ['services_id'], apiKey: 'secret-token', authorization: 'Bearer secret-token'
            };
            throw error;
        }
    };

    app.showSyncConfirmationModal();
    const batch = await app.confirmAndSyncClockodo();
    assert.equal(batch.state, 'failed');

    await app.retryFailedEntry(batch.id, 'diag-entry');
    const html = document.getElementById('reviewEntriesList').innerHTML;
    assert.equal(html.includes(app.t('retryDiagnosticTitle')), true);
    assert.equal(html.includes('422'), true);
    assert.equal(html.includes('Service is not available for this customer.'), true);
    assert.equal(html.includes('/services_id'), true);
    assert.equal(html.includes('secret-token'), false);
    assert.equal(html.includes('Bearer'), false);
});

test('successful retry clears the diagnostic and keeps the existing behavior', async () => {
    const { app, document } = createTestApp();
    const start = new Date(2026, 8, 28, 8, 0).getTime();
    await app.addEntry({ id: 'diag-success', activityId: 'act-1', activityNameSnapshot: 'Painting', startTimestamp: start, endTimestamp: start + 60000 });
    app.reviewDate = '2026-09-28';
    app.clockodoConfigured = true;
    app.clockodoCustomerId = '12';
    app.clockodoServiceId = '56';
    app.showToast = () => {};
    app.getPushClientId = () => 'client_1234567890abcdef';
    app.getClockodoAccessToken = () => 'a'.repeat(48);
    let attempts = 0;
    app.clockodoClient = {
        buildEntryPayload: () => ({ id: 'diag-success' }),
        async createEntry() {
            attempts += 1;
            if (attempts === 1) {
                const error = Object.assign(new Error('clockodo_rejected'), { code: 'clockodo_rejected', status: 422 });
                error.details = { status: 422, message: 'Service is not available for this customer.' };
                throw error;
            }
            return { created: true, entryId: 777 };
        }
    };

    app.showSyncConfirmationModal();
    const batch = await app.confirmAndSyncClockodo();
    assert.equal(batch.state, 'failed');
    await app.retryFailedEntry(batch.id, 'diag-success');
    assert.equal(app.retryDiagnostic, null);
    assert.equal(document.getElementById('reviewEntriesList').innerHTML.includes(app.t('retryDiagnosticTitle')), false);
    assert.equal(app.timeEntries.find(entry => entry.id === 'diag-success').syncStatus, 'synced');
    assert.equal(app.timeEntries.find(entry => entry.id === 'diag-success').clockodoEntryId, 777);
});

test('retrying an unavailable batch shows a diagnostic instead of failing silently', async () => {
    const { app, document } = createTestApp();
    const start = new Date(2026, 8, 28, 8, 0).getTime();
    app.timeEntries = [{
        id: 'done-entry', activityId: 'act-1', activityNameSnapshot: 'Painting',
        startTimestamp: start, endTimestamp: start + 60000,
        syncStatus: 'synced', syncBatchId: 'synced-batch'
    }];
    app.activities = [{ id: 'act-1', name: 'Painting' }];
    app.syncBatches = [{
        id: 'synced-batch', date: '2026-09-28', version: 1, state: 'synced',
        entries: [{ id: 'done-entry', syncStatus: 'synced' }]
    }];
    app.reviewDate = '2026-09-28';
    app.clockodoConfigured = true;
    app.showToast = () => {};

    const result = await app.retryFailedEntry('synced-batch', 'done-entry');
    assert.equal(result, false);
    const html = document.getElementById('reviewEntriesList').innerHTML;
    assert.equal(html.includes(app.t('retryDiagnosticTitle')), true);
    assert.equal(html.includes(app.t('retryDiagnosticUnavailable')), true);
});

function makeCustomerServiceApp(app) {
    app.clockodoReferenceStatus = 'ready';
    app.clockodoCustomers = [
        { id: 1, name: 'Customer A', active: true, serviceAssignments: [11, 12] },
        { id: 2, name: 'Customer B', active: true, serviceAssignments: [12, 13] },
        { id: 3, name: 'Customer C', active: true }
    ];
    app.clockodoServices = [
        { id: 11, name: 'Service 1', active: true },
        { id: 12, name: 'Service 2', active: true },
        { id: 13, name: 'Service 3', active: true }
    ];
    app.activities = [{ id: 'act-1', name: 'Painting', customerId: '', serviceId: '', archived: false }];
    app.reviewDate = '2026-10-05';
    app.renderLog = () => {};
    app.renderReview = () => {};
    app.renderMain = () => {};
    app.showToast = () => {};
}

function clockodoComboLabels(app, document, context, fieldName) {
    const ids = app.clockodoComboboxIds(context, fieldName);
    return document.getElementById(ids.list).children.map(item => item.textContent);
}

test('service options are restricted to the selected customer', () => {
    const { app, document } = createTestApp();
    makeCustomerServiceApp(app);
    app.populateClockodoAssignmentSelects('entry', '1', null, 'Customer A', '');
    app.openClockodoCombobox('entry', 'service');
    assert.deepEqual(clockodoComboLabels(app, document, 'entry', 'service'), ['No Clockodo assignment', 'Service 1', 'Service 2']);
    app.closeClockodoCombobox();

    app.populateClockodoAssignmentSelects('entry', '2', null, 'Customer B', '');
    app.openClockodoCombobox('entry', 'service');
    assert.deepEqual(clockodoComboLabels(app, document, 'entry', 'service'), ['No Clockodo assignment', 'Service 2', 'Service 3']);
});

test('a service not allowed for the customer cannot be selected or searched', () => {
    const { app, document } = createTestApp();
    makeCustomerServiceApp(app);
    app.populateClockodoAssignmentSelects('entry', '1', null, 'Customer A', '');
    app.openClockodoCombobox('entry', 'service');
    assert.equal(app.clockodoCombobox.options.some(option => option.id === '13'), false);
    app.closeClockodoCombobox();

    const ids = app.clockodoComboboxIds('entry', 'service');
    document.getElementById(ids.input).value = 'Service 3';
    app.applyClockodoAssignmentInput('entry', 'service');
    assert.equal(document.getElementById(ids.hidden).value, '');
    assert.deepEqual(clockodoComboLabels(app, document, 'entry', 'service'), ['No Clockodo assignment']);
});

test('changing or clearing the customer recalculates the allowed services', () => {
    const { app, document } = createTestApp();
    makeCustomerServiceApp(app);

    app.populateClockodoAssignmentSelects('entry', '1', '11', 'Customer A', 'Service 1');
    app.selectClockodoComboboxOption('entry', 'customer', { id: '2', label: 'Customer B' });
    const ids = app.clockodoComboboxIds('entry', 'service');
    assert.equal(document.getElementById(ids.hidden).value, '');
    assert.equal(document.getElementById(ids.input).value, '');

    app.populateClockodoAssignmentSelects('entry', '1', '12', 'Customer A', 'Service 2');
    app.selectClockodoComboboxOption('entry', 'customer', { id: '2', label: 'Customer B' });
    assert.equal(document.getElementById(ids.hidden).value, '12');

    app.populateClockodoAssignmentSelects('entry', '1', '11', 'Customer A', 'Service 1');
    app.selectClockodoComboboxOption('entry', 'customer', { id: '', label: 'No Clockodo assignment', unassigned: true });
    assert.equal(document.getElementById(ids.hidden).value, '11');
    app.openClockodoCombobox('entry', 'service');
    assert.deepEqual(clockodoComboLabels(app, document, 'entry', 'service'), ['No Clockodo assignment', 'Service 1', 'Service 2', 'Service 3']);
});

test('existing valid assignments restore and invalid ones are flagged instead of substituted', () => {
    const { app, document } = createTestApp();
    makeCustomerServiceApp(app);
    const ids = app.clockodoAssignmentIds('entry');
    app.populateClockodoAssignmentSelects('entry', '1', '12', 'Customer A', 'Service 2');
    assert.equal(document.getElementById(ids.service).value, '12');
    assert.equal(document.getElementById(ids.serviceInput).value, 'Service 2');
    assert.equal(document.getElementById(ids.hint).textContent, app.t('clockodoAssignmentHelp'));

    app.populateClockodoAssignmentSelects('entry', '1', '13', 'Customer A', 'Service 3');
    assert.equal(document.getElementById(ids.service).value, '');
    assert.equal(document.getElementById(ids.serviceInput).value, '');
    assert.equal(document.getElementById(ids.hint).textContent, app.t('clockodoServiceNotAllowedForCustomer'));
});

test('customer service filtering keeps numeric IDs in the Clockodo payload', async () => {
    const { app, context, document } = createTestApp();
    makeCustomerServiceApp(app);
    app.clockodoConfigured = true;
    app.clockodoCustomerId = '';
    app.clockodoServiceId = '';
    app.getPushClientId = () => 'client_1234567890abcdef';
    app.getClockodoAccessToken = () => 'a'.repeat(48);

    app.showAddEntryModal();
    app.selectClockodoComboboxOption('entry', 'customer', { id: '1', label: 'Customer A' });
    app.openClockodoCombobox('entry', 'service');
    app.selectClockodoComboboxOption('entry', 'service', app.clockodoCombobox.options.find(option => option.id === '12'));
    document.getElementById('entryEditDate').value = '2026-10-05';
    document.getElementById('entryEditStart').value = '08:00';
    document.getElementById('entryEditEndDate').value = '2026-10-05';
    document.getElementById('entryEditEnd').value = '08:30';
    await app.saveTimeEntry();

    const entry = app.timeEntries[0];
    assert.equal(entry.customerId, '1');
    assert.equal(entry.serviceId, '12');

    vm.runInContext(clockodoClientSource, context);
    const sent = [];
    app.clockodoClient = new context.ClockodoClient({
        fetchImpl: async (url, init) => {
            sent.push(JSON.parse(init.body));
            return { status: 200, ok: true, json: async () => ({ created: true, entryId: 42 }) };
        }
    });
    app.showSyncConfirmationModal();
    const batch = await app.confirmAndSyncClockodo();
    assert.equal(batch.state, 'synced');
    assert.equal(sent[0].customers_id, 1);
    assert.equal(sent[0].services_id, 12);
});

function makeResendClient(sent) {
    return {
        buildEntryPayload(entry) {
            return {
                id: entry.id,
                customers_id: Number(entry.customerId),
                services_id: Number(entry.serviceId),
                text: entry.notes || null
            };
        },
        async createEntry(clientId, token, payload, idempotencyKey) {
            sent.push({ payload, idempotencyKey });
            return { created: true, entryId: 900 + sent.length };
        }
    };
}

async function createSyncedDayApp() {
    const { app, document } = createTestApp();
    const start = new Date(2026, 9, 5, 8, 0).getTime();
    await app.addEntry({
        id: 'resend-entry', activityId: 'act-1', activityNameSnapshot: 'Painting',
        startTimestamp: start, endTimestamp: start + 60000,
        customerId: '12', serviceId: '56', notes: 'Measured the tree'
    });
    app.reviewDate = '2026-10-05';
    app.clockodoConfigured = true;
    app.showToast = () => {};
    app.renderReview = () => {};
    app.getPushClientId = () => 'client_1234567890abcdef';
    app.getClockodoAccessToken = () => 'a'.repeat(48);
    const sent = [];
    app.clockodoClient = makeResendClient(sent);
    app.showSyncConfirmationModal();
    const firstBatch = await app.confirmAndSyncClockodo();
    assert.equal(firstBatch.state, 'synced');
    assert.equal(sent.length, 1);
    return { app, document, sent, firstBatch };
}

test('first Review & Sync does not ask for a resend', async () => {
    const { app, document } = await createSyncedDayApp();
    assert.equal(app.syncResendMode, false);
    assert.equal(document.getElementById('syncConfirmSubmitBtn').textContent, app.t('confirmSyncBtn'));
});

test('Review & Sync after a successful sync requires explicit confirmation to resend', async () => {
    const { app, document, sent, firstBatch } = await createSyncedDayApp();

    app.showSyncConfirmationModal();
    assert.equal(app.syncResendMode, true);
    assert.equal(document.getElementById('syncConfirmSubmitBtn').textContent, app.t('resendSyncBtn'));
    assert.equal(document.getElementById('syncConfirmAlreadySyncedNotice').textContent, app.t('resendSyncNotice'));

    app.closeSyncConfirmationModal();
    assert.equal(sent.length, 1);

    app.showSyncConfirmationModal();
    const second = await app.confirmAndSyncClockodo();
    assert.equal(second.state, 'synced');
    assert.equal(sent.length, 2);
    assert.deepEqual(sent[1].payload, sent[0].payload);
    assert.notEqual(sent[1].idempotencyKey, sent[0].idempotencyKey);
    assert.match(sent[1].idempotencyKey, /^timerhub-entry:resend-entry:resend:/);

    const original = app.syncBatches.find(item => item.id === firstBatch.id);
    assert.equal(original.entries[0].clockodoEntryId, 901);
    assert.equal(original.state, 'synced');
    assert.equal(app.timeEntries[0].clockodoEntryId, 902);
    assert.equal(app.timeEntries[0].syncStatus, 'synced');
});

test('a retry of the same explicit resend reuses its idempotency key', async () => {
    const { app, sent } = await createSyncedDayApp();
    let failResend = true;
    app.clockodoClient.createEntry = async (clientId, token, payload, idempotencyKey) => {
        sent.push({ payload, idempotencyKey });
        if (failResend) {
            failResend = false;
            throw Object.assign(new Error('rejected'), { code: 'clockodo_rejected' });
        }
        return { created: true, entryId: 999 };
    };

    app.showSyncConfirmationModal();
    const resendBatch = await app.confirmAndSyncClockodo();
    assert.equal(resendBatch.state, 'failed');
    const resendKey = sent[1].idempotencyKey;
    assert.match(resendKey, /:resend:/);

    await app.retrySyncBatch(resendBatch.id);
    assert.equal(sent.length, 3);
    assert.equal(sent[2].idempotencyKey, resendKey);
});

test('a partially synced day keeps the normal flow without a resend prompt', async () => {
    const { app: dayApp } = await createSyncedDayApp();
    const start = new Date(2026, 9, 5, 9, 0).getTime();
    await dayApp.addEntry({
        id: 'partial-unsynced', activityId: 'act-1', activityNameSnapshot: 'Painting',
        startTimestamp: start, endTimestamp: start + 60000,
        customerId: '12', serviceId: '56'
    });
    dayApp.showSyncConfirmationModal();
    assert.equal(dayApp.syncResendMode, false);
    assert.deepEqual(JSON.parse(JSON.stringify(dayApp.confirmedSyncEntries.map(entry => entry.id))), ["partial-unsynced"]);
});

async function createUnknownDayApp({ onResend = null } = {}) {
    const { app, document, storageData } = createTestApp();
    const start = new Date(2026, 9, 5, 8, 0).getTime();
    await app.addEntry({
        id: 'unknown-entry', activityId: 'act-1', activityNameSnapshot: 'Anfahrt',
        startTimestamp: start, endTimestamp: start + 46 * 60000 + 3000,
        customerId: '12', serviceId: '56', notes: 'Drive'
    });
    app.reviewDate = '2026-10-05';
    app.clockodoConfigured = true;
    app.showToast = () => {};
    app.getPushClientId = () => 'client_1234567890abcdef';
    app.getClockodoAccessToken = () => 'a'.repeat(48);
    const sent = [];
    app.clockodoClient = {
        buildEntryPayload(entry) {
            return { id: entry.id, customers_id: Number(entry.customerId), services_id: Number(entry.serviceId), text: entry.notes || null };
        },
        async createEntry(clientId, token, payload, idempotencyKey) {
            sent.push({ payload, idempotencyKey });
            if (sent.length === 1) {
                throw Object.assign(new Error('uncertain'), { code: 'network_outcome_unknown' });
            }
            return onResend ? onResend(sent) : { created: true, entryId: 4321 };
        }
    };
    app.showSyncConfirmationModal();
    const firstBatch = await app.confirmAndSyncClockodo();
    assert.equal(firstBatch.state, 'unknown');
    assert.equal(sent.length, 1);
    assert.equal(sent[0].idempotencyKey, 'timerhub-entry:unknown-entry');
    return { app, document, storageData, sent, firstBatch };
}

test('an UNKNOWN entry shows a Send again action in Day Review', async () => {
    const { app, document } = await createUnknownDayApp();
    app.renderReview();
    const html = document.getElementById('reviewEntriesList').innerHTML;
    assert.ok(html.includes('sync-badge unknown'), 'the purple UNKNOWN badge remains');
    assert.ok(html.includes('review-resend-unknown'), 'the UNKNOWN entry offers Send again');
    assert.ok(html.includes(app.t('resendSyncBtn')));
    assert.equal(html.includes('review-retry-entry'), false, 'UNKNOWN does not show the FAILED retry action');
});

test('manual resend of an UNKNOWN entry opens a confirmation with the duplicate warning', async () => {
    const { app, document, sent } = await createUnknownDayApp();
    const opened = app.showUnknownResendConfirmation('unknown-entry');
    assert.equal(opened, true);
    assert.equal(app.syncUnknownEntryId, 'unknown-entry');
    assert.equal(app.syncResendMode, false);
    assert.equal(document.getElementById('syncConfirmAlreadySyncedNotice').textContent, app.t('unknownResendNotice'));
    assert.equal(document.getElementById('syncConfirmSubmitBtn').textContent, app.t('resendSyncBtn'));
    assert.equal(document.getElementById('syncConfirmSubmitBtn').disabled, false);
    assert.equal(sent.length, 1, 'opening the confirmation must not send anything');
});

test('cancelling the UNKNOWN manual resend sends nothing and clears the pending entry', async () => {
    const { app, sent } = await createUnknownDayApp();
    app.showUnknownResendConfirmation('unknown-entry');
    app.closeSyncConfirmationModal();
    assert.equal(app.syncUnknownEntryId, null);
    assert.equal(sent.length, 1);
    assert.equal(await app.confirmAndSyncClockodo(), false);
    assert.equal(sent.length, 1);
});

test('confirming a manual resend uses a new idempotency key and marks the entry SYNCED', async () => {
    const { app, storageData, sent, firstBatch } = await createUnknownDayApp();
    app.showUnknownResendConfirmation('unknown-entry');
    const resendBatch = await app.confirmAndSyncClockodo();
    assert.equal(resendBatch.state, 'synced');
    assert.equal(sent.length, 2);
    assert.notEqual(sent[1].idempotencyKey, sent[0].idempotencyKey);
    assert.match(sent[1].idempotencyKey, /^timerhub-entry:unknown-entry:resend:/);
    assert.deepEqual(sent[1].payload, sent[0].payload);

    const entry = app.timeEntries.find(item => item.id === 'unknown-entry');
    assert.equal(entry.syncStatus, 'synced');
    assert.equal(entry.clockodoEntryId, 4321);
    assert.equal(entry.clockodoError, null);
    assert.equal(entry.syncBatchId, resendBatch.id);
    assert.equal(storageData.timeEntries.find(item => item.id === 'unknown-entry').syncStatus, 'synced');

    const original = app.syncBatches.find(item => item.id === firstBatch.id);
    assert.equal(original.state, 'unknown', 'the historical UNKNOWN batch is preserved');
    assert.equal(original.entries[0].syncStatus, 'unknown');
});

test('the original UNKNOWN operation stays protected after a manual resend', async () => {
    const { app, sent, firstBatch } = await createUnknownDayApp();
    assert.equal(await app.retrySyncBatch(firstBatch.id), false);
    assert.equal(sent.length, 1);

    app.showUnknownResendConfirmation('unknown-entry');
    await app.confirmAndSyncClockodo();
    assert.equal(sent.length, 2);

    assert.equal(await app.retrySyncBatch(firstBatch.id), false, 'the original unknown batch can never be retried');
    assert.equal(sent.length, 2);
});

test('a definitive failure during a manual resend marks the entry FAILED with diagnostics', async () => {
    const { app, sent } = await createUnknownDayApp({
        onResend: () => {
            throw Object.assign(new Error('rejected'), {
                code: 'clockodo_rejected',
                details: { status: 422, message: 'Service is not available for this customer.' }
            });
        }
    });
    app.showUnknownResendConfirmation('unknown-entry');
    const batch = await app.confirmAndSyncClockodo();
    assert.equal(batch.state, 'failed');
    assert.equal(sent.length, 2);
    const entry = app.timeEntries.find(item => item.id === 'unknown-entry');
    assert.equal(entry.syncStatus, 'failed');
    assert.equal(entry.clockodoError, 'clockodo_rejected');
    assert.equal(entry.clockodoErrorDetails.message, 'Service is not available for this customer.');
});

test('another uncertain result during a manual resend keeps the entry UNKNOWN without automatic retry', async () => {
    const { app, sent, firstBatch } = await createUnknownDayApp({
        onResend: () => { throw Object.assign(new Error('uncertain'), { code: 'timeout_outcome_unknown' }); }
    });
    app.showUnknownResendConfirmation('unknown-entry');
    const resendBatch = await app.confirmAndSyncClockodo();
    assert.equal(resendBatch.state, 'unknown');
    assert.equal(sent.length, 2);
    assert.notEqual(sent[1].idempotencyKey, sent[0].idempotencyKey);
    assert.equal(app.timeEntries.find(item => item.id === 'unknown-entry').syncStatus, 'unknown');
    assert.equal(await app.retrySyncBatch(firstBatch.id), false);
    assert.equal(await app.retrySyncBatch(resendBatch.id), false);
    assert.equal(sent.length, 2);
});

test('UNKNOWN entries remain excluded from the automatic Review & Sync eligibility lists', async () => {
    const { app, document } = await createUnknownDayApp();
    app.showSyncConfirmationModal();
    assert.equal(app.syncResendMode, false);
    assert.deepEqual(JSON.parse(JSON.stringify(app.confirmedSyncEntries)), []);
    assert.equal(document.getElementById('syncConfirmSubmitBtn').disabled, true);
    assert.ok(document.getElementById('syncConfirmEntriesList').innerHTML.includes(app.t('noEntriesToSync')));
});

test('the UNKNOWN Send again action and a successful manual resend survive a reload', async () => {
    const { app, storageData } = await createUnknownDayApp();
    const { app: reloaded, document: reloadedDocument } = createTestApp({ timeEntries: storageData.timeEntries, syncBatches: storageData.syncBatches });
    await reloaded.loadTimeEntries();
    reloaded.reviewDate = '2026-10-05';
    reloaded.renderReview();
    assert.ok(reloadedDocument.getElementById('reviewEntriesList').innerHTML.includes('review-resend-unknown'));
    assert.equal(reloaded.timeEntries.find(item => item.id === 'unknown-entry').syncStatus, 'unknown');

    app.showUnknownResendConfirmation('unknown-entry');
    await app.confirmAndSyncClockodo();

    const { app: afterResend } = createTestApp({ timeEntries: storageData.timeEntries, syncBatches: storageData.syncBatches });
    await afterResend.loadTimeEntries();
    const entry = afterResend.timeEntries.find(item => item.id === 'unknown-entry');
    assert.equal(entry.syncStatus, 'synced');
    assert.equal(entry.clockodoEntryId, 4321);
});

async function createExchangeSender() {
    const harness = createTestApp();
    const { app } = harness;
    const start = new Date(2026, 9, 5, 15, 35, 0).getTime();
    await app.addEntry({
        id: 'exchange-a', activityId: 'act-1', activityNameSnapshot: 'Anfahrt',
        startTimestamp: start, endTimestamp: start + 46 * 60000 + 3000,
        notes: 'Drove to the site', customerId: '11', serviceId: '21',
        customerName: 'Bau GmbH', serviceName: 'Anfahrt'
    });
    await app.addEntry({
        id: 'exchange-b', activityId: 'act-1', activityNameSnapshot: 'Concrete pour',
        startTimestamp: start + 60 * 60000, endTimestamp: start + 120 * 60000
    });
    app.activities = [{ id: 'act-1', name: 'Anfahrt', color: '#27AE60' }];
    app.reviewDate = '2026-10-05';
    app.renderLog = () => {};
    return { ...harness, start };
}

function createExchangeReceiver({ customers = null } = {}) {
    const harness = createTestApp();
    harness.app.activities = [{ id: 'act-1', name: 'Anfahrt', color: '#27AE60' }];
    harness.app.reviewDate = '2026-10-01';
    harness.app.renderLog = () => {};
    if (customers) harness.app.clockodoCustomers = customers;
    return harness;
}

async function loadExchangeIntoReceiver(receiver, envelopeText, secret) {
    const file = { name: 'timerhub-exchange.timerhub', size: envelopeText.length, text: async () => envelopeText };
    receiver.app.handleExchangeFileSelected(file);
    receiver.document.getElementById('exchangeCodeInput').value = receiver.app.getExchange().formatTransferCode(secret);
    receiver.app.refreshExchangeDecryptState();
    return receiver.app.decryptExchangeFile();
}

test('Day Review exports an encrypted .timerhub file without plaintext work data', async () => {
    const { app, document, backupCapture } = await createExchangeSender();
    const clicksBefore = backupCapture.clicks;
    assert.equal(await app.exportReviewDay(), true);
    assert.equal(backupCapture.clicks, clicksBefore, 'export prepares the file without downloading it');
    assert.match(app.lastExchange.fileName, /^timerhub-exchange_\d+\.timerhub$/);
    assert.equal(/Anfahrt|Concrete|Bau|2026-10-05/.test(app.lastExchange.fileName), false);
    assert.ok(app.lastExchange.file, 'the prepared export carries a shareable file');
    assert.equal(app.lastExchange.file.name, app.lastExchange.fileName);

    const secret = app.lastExchange.secret;
    assert.equal(typeof secret, 'string');
    assert.equal(secret.length, 43);
    const fileText = JSON.stringify(app.lastExchange.envelope);
    for (const value of ['Anfahrt', 'Concrete pour', 'Drove to the site', 'Bau GmbH', '2026-10-05', app.lastExchange.exportId, secret]) {
        assert.equal(fileText.includes(value), false, `exchange file must not contain ${value}`);
    }
    assert.equal(await app.lastExchange.file.text(), fileText);
    assert.equal(document.getElementById('exchangeCodeDisplay').textContent, app.getExchange().formatTransferCode(secret));
});

test('exporting a day without completed entries reports and downloads nothing', async () => {
    const { app, toasts, backupCapture } = await createExchangeSender();
    app.reviewDate = '2026-10-07';
    const clicksBefore = backupCapture.clicks;
    assert.equal(await app.exportReviewDay(), false);
    assert.equal(backupCapture.clicks, clicksBefore);
    assert.equal(toasts.at(-1), app.t('exchangeNoEntries'));
});

test('one export creates one snapshot and reopening the QR never creates a new export', async () => {
    const { app } = await createExchangeSender();
    assert.equal(await app.exportReviewDay(), true);
    const prepared = app.lastExchange;
    const qrPayload = app.getExchange().buildQrPayload(prepared.secret);

    assert.equal(app.showExchangeQr(), true);
    app.closeExchangeQr();
    assert.equal(app.showExchangeQr(), true);
    app.closeExchangeQr();

    assert.equal(app.lastExchange, prepared, 'reopening the QR must not replace the prepared export');
    assert.equal(app.lastExchange.exportId, prepared.exportId);
    assert.equal(app.lastExchange.secret, prepared.secret);
    assert.equal(app.getExchange().buildQrPayload(app.lastExchange.secret), qrPayload);
});

test('closing the QR view preserves the prepared export for import and share', async () => {
    const sender = await createExchangeSender();
    assert.equal(await sender.app.exportReviewDay(), true);
    const prepared = sender.app.lastExchange;

    sender.app.showExchangeQr();
    sender.app.closeExchangeQr();

    assert.equal(sender.app.lastExchange, prepared);
    assert.equal(sender.app.renderedExchangeQr, sender.app.getExchange().buildQrPayload(prepared.secret));

    const receiver = createExchangeReceiver();
    assert.equal(await loadExchangeIntoReceiver(receiver, JSON.stringify(prepared.envelope), prepared.secret), true);
    assert.equal(receiver.app.pendingExchange.payload.entries.length, 2);
});

test('Share sends the already-prepared file through Web Share and never creates a new export', async () => {
    const sender = await createExchangeSender();
    assert.equal(await sender.app.exportReviewDay(), true);
    const prepared = sender.app.lastExchange;
    const shares = [];
    sender.context.navigator.canShare = options => Array.isArray(options?.files) && options.files.length === 1;
    sender.context.navigator.share = async options => { shares.push(options); };

    assert.equal(await sender.app.shareExchangeFile(), true);
    assert.equal(shares.length, 1);
    assert.equal(shares[0].files.length, 1);
    assert.equal(shares[0].files[0].name, prepared.fileName);
    assert.equal(await shares[0].files[0].text(), JSON.stringify(prepared.envelope));
    assert.equal(sender.app.lastExchange, prepared);
    assert.equal(sender.backupCapture.clicks, 0, 'a supported share must not download the file');
});

test('unsupported file sharing falls back to a download without creating a new export', async () => {
    const sender = await createExchangeSender();
    assert.equal(await sender.app.exportReviewDay(), true);
    const prepared = sender.app.lastExchange;
    sender.context.navigator.share = undefined;
    sender.context.navigator.canShare = undefined;
    const clicksBefore = sender.backupCapture.clicks;

    assert.equal(await sender.app.shareExchangeFile(), true);
    assert.equal(sender.backupCapture.clicks, clicksBefore + 1, 'unsupported sharing falls back to a download');
    assert.equal(sender.backupCapture.filename, prepared.fileName);
    assert.equal(sender.toasts.at(-1), sender.app.t('exchangeShareUnsupported'));
    assert.equal(sender.app.lastExchange, prepared);
});

test('Share without a prepared export is handled safely', async () => {
    const receiver = createExchangeReceiver();
    const shares = [];
    receiver.context.navigator.canShare = () => true;
    receiver.context.navigator.share = async options => { shares.push(options); };

    assert.equal(await receiver.app.shareExchangeFile(), false);
    assert.equal(shares.length, 0);
    assert.equal(receiver.toasts.at(-1), receiver.app.t('exchangeNothingToShare'));
    assert.equal(receiver.backupCapture.clicks, 0);
});

test('the shortened transfer-code explanation is localized in EN, DE, and RU', () => {
    const { app } = createTestApp();
    const expected = {
        en: 'The transfer code unlocks the file.',
        de: 'Der Übertragungscode öffnet die Datei.',
        ru: 'Код переноса открывает файл.'
    };
    for (const [language, text] of Object.entries(expected)) {
        app.currentLanguage = language;
        assert.equal(app.t('exchangeSecurityNote'), text, `${language} transfer-code explanation`);
    }
});

test('a received exchange file decrypts into a preview and imports only after explicit confirmation', async () => {
    const sender = await createExchangeSender();
    await sender.app.exportReviewDay();
    const envelopeText = JSON.stringify(sender.app.lastExchange.envelope);
    const secret = sender.app.lastExchange.secret;

    const receiver = createExchangeReceiver();
    let clockodoCalls = 0;
    receiver.app.clockodoConfigured = true;
    receiver.app.clockodoClient = {
        buildEntryPayload: () => { clockodoCalls += 1; return {}; },
        async createEntry() { clockodoCalls += 1; return { created: true, entryId: 1 }; }
    };

    assert.equal(await loadExchangeIntoReceiver(receiver, envelopeText, secret), true);
    assert.equal(receiver.app.pendingExchange.payload.entries.length, 2);
    assert.equal(receiver.app.pendingExchange.repeat, false);
    assert.equal(receiver.app.timeEntries.length, 0, 'decryption alone must not import anything');

    const summary = receiver.document.getElementById('exchangePreviewSummary').innerHTML;
    assert.ok(summary.includes('2026-10-05'));
    const previewList = receiver.document.getElementById('exchangePreviewList').innerHTML;
    assert.ok(previewList.includes('Anfahrt'));
    assert.ok(previewList.includes('Concrete pour'));
    assert.ok(previewList.includes(receiver.app.t('customer')));
    assert.equal(receiver.document.getElementById('exchangeImportBtn').textContent, receiver.app.t('importBtn'));

    assert.equal(await receiver.app.confirmExchangeImport(), true);
    assert.equal(clockodoCalls, 0, 'import must never trigger a Clockodo request');
    assert.equal(receiver.app.reviewDate, '2026-10-05');
    const imported = receiver.app.getDayEntries('2026-10-05');
    assert.equal(imported.length, 2);
    const first = imported.find(entry => entry.activityNameSnapshot === 'Anfahrt');
    assert.equal(first.startTimestamp, sender.start);
    assert.equal(first.endTimestamp, sender.start + 46 * 60000 + 3000);
    assert.equal(first.notes, 'Drove to the site');
    assert.equal(first.customerId, '11');
    assert.equal(first.serviceId, '21');
    assert.equal(first.customerName, 'Bau GmbH');
    assert.equal(first.syncStatus, 'unsynced');
    assert.equal(first.source, 'manual');

    const reviewHtml = receiver.document.getElementById('reviewEntriesList').innerHTML;
    assert.ok(reviewHtml.includes('concrete pour') || reviewHtml.includes('Concrete pour'));
    assert.equal(reviewHtml.includes('sync-badge synced'), false);
    assert.equal(reviewHtml.includes('sync-badge unknown'), false);
});

test('importing with the wrong transfer code fails safely and writes nothing', async () => {
    const sender = await createExchangeSender();
    await sender.app.exportReviewDay();
    const envelopeText = JSON.stringify(sender.app.lastExchange.envelope);
    const correct = sender.app.lastExchange.secret;
    const wrong = (correct[0] === 'A' ? 'B' : 'A') + correct.slice(1);

    const receiver = createExchangeReceiver();
    assert.equal(await loadExchangeIntoReceiver(receiver, envelopeText, wrong), false);
    assert.equal(receiver.app.pendingExchange, null);
    assert.equal(receiver.app.timeEntries.length, 0);
    assert.equal(
        receiver.document.getElementById('exchangeImportError').textContent,
        receiver.app.t('exchangeDecryptFailed')
    );
});

test('a tampered or unsupported exchange file is rejected before import', async () => {
    const sender = await createExchangeSender();
    await sender.app.exportReviewDay();
    const secret = sender.app.lastExchange.secret;

    const tampered = JSON.parse(JSON.stringify(sender.app.lastExchange.envelope));
    tampered.createdAt += 1;
    const receiverA = createExchangeReceiver();
    assert.equal(await loadExchangeIntoReceiver(receiverA, JSON.stringify(tampered), secret), false);
    assert.equal(receiverA.app.timeEntries.length, 0);

    const unsupported = JSON.parse(JSON.stringify(sender.app.lastExchange.envelope));
    unsupported.version = 2;
    const receiverB = createExchangeReceiver();
    assert.equal(await loadExchangeIntoReceiver(receiverB, JSON.stringify(unsupported), secret), false);
    assert.equal(
        receiverB.document.getElementById('exchangeImportError').textContent,
        receiverB.app.t('exchangeUnsupportedFormat')
    );
});

test('an exchange file with the wrong extension is rejected', async () => {
    const receiver = createExchangeReceiver();
    assert.equal(receiver.app.handleExchangeFileSelected({ name: 'notes.json', size: 10, text: async () => '{}' }), false);
    assert.equal(receiver.document.getElementById('exchangeImportError').textContent, receiver.app.t('exchangeInvalidFile'));
});

test('repeated imports warn, can be cancelled, and require explicit confirmation', async () => {
    const sender = await createExchangeSender();
    await sender.app.exportReviewDay();
    const envelopeText = JSON.stringify(sender.app.lastExchange.envelope);
    const secret = sender.app.lastExchange.secret;

    const receiver = createExchangeReceiver();
    assert.equal(await loadExchangeIntoReceiver(receiver, envelopeText, secret), true);
    assert.equal(await receiver.app.confirmExchangeImport(), true);
    assert.equal(receiver.app.getDayEntries('2026-10-05').length, 2);

    assert.equal(await loadExchangeIntoReceiver(receiver, envelopeText, secret), true);
    assert.equal(receiver.app.pendingExchange.repeat, true);
    assert.equal(receiver.document.getElementById('exchangeImportBtn').textContent, receiver.app.t('importAgainBtn'));
    assert.ok(receiver.document.getElementById('exchangePreviewWarnings').innerHTML.includes(receiver.app.t('exchangeWarningRepeat')));

    receiver.app.closeDayImportModal();
    assert.equal(receiver.app.getDayEntries('2026-10-05').length, 2, 'cancelling the repeated import must not duplicate entries');

    assert.equal(await loadExchangeIntoReceiver(receiver, envelopeText, secret), true);
    assert.equal(await receiver.app.confirmExchangeImport(), true);
    assert.equal(receiver.app.getDayEntries('2026-10-05').length, 4, 'explicitly confirmed repeat import duplicates as requested');
});

test('the import preview warns about unknown Clockodo assignments', async () => {
    const sender = await createExchangeSender();
    await sender.app.exportReviewDay();
    const envelopeText = JSON.stringify(sender.app.lastExchange.envelope);
    const secret = sender.app.lastExchange.secret;

    const receiver = createExchangeReceiver({ customers: [{ id: 99, name: 'Someone else' }] });
    assert.equal(await loadExchangeIntoReceiver(receiver, envelopeText, secret), true);
    assert.ok(receiver.app.pendingExchange.analysis.warnings.includes('exchangeWarningUnknownCustomer'));
    assert.ok(receiver.document.getElementById('exchangePreviewWarnings').innerHTML.includes(receiver.app.t('exchangeWarningUnknownCustomer')));
    assert.equal(receiver.app.timeEntries.length, 0);
});

test('a scanned transfer QR fills the code input and carries no work data', async () => {
    const sender = await createExchangeSender();
    await sender.app.exportReviewDay();
    const secret = sender.app.lastExchange.secret;
    const qrText = sender.app.getExchange().buildQrPayload(secret);
    assert.equal(qrText.includes('Anfahrt'), false);
    assert.equal(qrText.includes('Bau'), false);

    const receiver = createExchangeReceiver();
    const envelopeText = JSON.stringify(sender.app.lastExchange.envelope);
    const file = { name: 'timerhub-exchange.timerhub', size: envelopeText.length, text: async () => envelopeText };
    receiver.app.handleExchangeFileSelected(file);
    assert.equal(receiver.app.handleExchangeQrValue('not-a-qr'), false);
    assert.equal(receiver.app.handleExchangeQrValue(qrText), true);
    assert.equal(
        receiver.document.getElementById('exchangeCodeInput').value,
        receiver.app.getExchange().formatTransferCode(secret)
    );
    assert.equal(await receiver.app.decryptExchangeFile(), true);
    assert.equal(receiver.app.pendingExchange.payload.entries.length, 2);
});

test('end-to-end: imported entries reach Clockodo only through the explicit confirm step', async () => {
    const sender = await createExchangeSender();
    await sender.app.exportReviewDay();
    const receiver = createExchangeReceiver();
    assert.equal(await loadExchangeIntoReceiver(receiver, JSON.stringify(sender.app.lastExchange.envelope), sender.app.lastExchange.secret), true);
    assert.equal(await receiver.app.confirmExchangeImport(), true);
    assert.equal(receiver.app.getDayEntries('2026-10-05').length, 2);

    const sent = [];
    receiver.app.clockodoConfigured = true;
    receiver.app.clockodoCustomerId = '11';
    receiver.app.clockodoServiceId = '21';
    receiver.app.getPushClientId = () => 'client_1234567890abcdef';
    receiver.app.getClockodoAccessToken = () => 'a'.repeat(48);
    receiver.app.clockodoClient = {
        buildEntryPayload(entry) {
            return {
                id: entry.id,
                customers_id: Number(entry.customerId || receiver.app.clockodoCustomerId),
                services_id: Number(entry.serviceId || receiver.app.clockodoServiceId)
            };
        },
        async createEntry(clientId, token, payload) {
            sent.push(payload);
            return { created: true, entryId: 5000 + sent.length };
        }
    };
    assert.equal(sent.length, 0, 'importing must never send to Clockodo');
    receiver.app.showSyncConfirmationModal();
    const batch = await receiver.app.confirmAndSyncClockodo();
    assert.equal(batch.state, 'synced');
    assert.equal(sent.length, 2);
    assert.equal(receiver.app.getDayEntries('2026-10-05').every(entry => entry.syncStatus === 'synced'), true);
});

test('an imported entry stays editable in the existing entry editor', async () => {
    const sender = await createExchangeSender();
    await sender.app.exportReviewDay();
    const receiver = createExchangeReceiver();
    assert.equal(await loadExchangeIntoReceiver(receiver, JSON.stringify(sender.app.lastExchange.envelope), sender.app.lastExchange.secret), true);
    assert.equal(await receiver.app.confirmExchangeImport(), true);
    const imported = receiver.app.getDayEntries('2026-10-05')[0];
    receiver.app.showEntryEditModal(imported.id);
    assert.equal(receiver.document.getElementById('entryEditDate').value, '2026-10-05');
    assert.equal(receiver.document.getElementById('entryEditStart').value, receiver.app.toTimeString(new Date(imported.startTimestamp)));
    assert.equal(receiver.document.getElementById('entryEditEnd').value, receiver.app.toTimeString(new Date(imported.endTimestamp)));
});

test('editing an activity scrolls both picker rows to center the selected items', () => {
    const { app, document } = createTestApp();
    const selectedColor = { offsetLeft: 400, offsetWidth: 48 };
    const selectedShape = { offsetLeft: 100, offsetWidth: 48 };
    const colorPicker = { clientWidth: 200, scrollLeft: 0, querySelector: () => selectedColor };
    const shapePicker = { clientWidth: 200, scrollLeft: 0, querySelector: () => selectedShape };
    const original = document.getElementById.bind(document);
    document.getElementById = id => id === 'colorPicker'
        ? colorPicker
        : id === 'shapePicker' ? shapePicker : original(id);
    app.revealActivityPickerSelections();
    document.getElementById = original;

    assert.equal(colorPicker.scrollLeft, 400 - (200 - 48) / 2);
    assert.equal(shapePicker.scrollLeft, 100 - (200 - 48) / 2);
});

test('opening the activity editor for an existing activity reveals its selections', () => {
    const { app, document } = createTestApp();
    app.activities = [{ id: 'act-edit', name: 'Existing', color: '#FFFFFF', shape: 'diamond', size: 'large' }];
    const colorPicker = { clientWidth: 200, scrollLeft: 0, querySelector: () => ({ offsetLeft: 300, offsetWidth: 48 }) };
    const shapePicker = { clientWidth: 200, scrollLeft: 0, querySelector: () => ({ offsetLeft: 150, offsetWidth: 48 }) };
    const original = document.getElementById.bind(document);
    document.getElementById = id => id === 'colorPicker'
        ? colorPicker
        : id === 'shapePicker' ? shapePicker : original(id);
    app.showActivityModal('act-edit');
    document.getElementById = original;

    assert.equal(colorPicker.scrollLeft, 300 - (200 - 48) / 2);
    assert.equal(shapePicker.scrollLeft, 150 - (200 - 48) / 2);
});

test('creating a new activity does not auto-scroll the picker rows', () => {
    const { app, document } = createTestApp();
    const colorPicker = { clientWidth: 200, scrollLeft: 0, querySelector: () => ({ offsetLeft: 300, offsetWidth: 48 }) };
    const shapePicker = { clientWidth: 200, scrollLeft: 0, querySelector: () => ({ offsetLeft: 150, offsetWidth: 48 }) };
    const original = document.getElementById.bind(document);
    document.getElementById = id => id === 'colorPicker'
        ? colorPicker
        : id === 'shapePicker' ? shapePicker : original(id);
    app.showActivityModal();
    document.getElementById = original;

    assert.equal(colorPicker.scrollLeft, 0);
    assert.equal(shapePicker.scrollLeft, 0);
});

test('Clockodo customer and service fields show descriptive placeholders when empty', () => {
    const { app, document } = createTestApp();
    makeCustomerServiceApp(app);
    const ids = app.clockodoAssignmentIds('entry');

    app.populateClockodoAssignmentSelects('entry');
    assert.equal(document.getElementById(ids.customerInput).placeholder, app.t('clockodoCustomerSelectLabel'));
    assert.equal(document.getElementById(ids.serviceInput).placeholder, app.t('clockodoServiceSelectLabel'));
    assert.equal(document.getElementById(ids.customerInput).value, '');
    assert.equal(document.getElementById(ids.serviceInput).value, '');

    app.populateClockodoAssignmentSelects('entry', '1', '12', 'Customer A', 'Service 2');
    assert.equal(document.getElementById(ids.customerInput).value, 'Customer A');
    assert.equal(document.getElementById(ids.serviceInput).value, 'Service 2');
    assert.equal(document.getElementById(ids.customerInput).placeholder, app.t('clockodoCustomerSelectLabel'));

    app.clockodoReferenceStatus = 'unconfigured';
    app.populateClockodoAssignmentSelects('entry');
    assert.match(document.getElementById(ids.customerInput).placeholder, /not configured/);
});

test('activity buttons derive their text color from the centralized contrast rule', () => {
    const { app, document } = createTestApp();
    app.activities = [
        { id: 'white-activity', name: 'White', color: '#ffffff', shape: 'circle', size: 'medium', archived: false },
        { id: 'black-activity', name: 'Black', color: '#000000', shape: 'square', size: 'medium', archived: false },
        { id: 'yellow-activity', name: 'Yellow', color: '#F1C40F', shape: 'circle', size: 'medium', archived: false },
        { id: 'navy-activity', name: 'Navy', color: '#2C3E50', shape: 'circle', size: 'medium', archived: false }
    ];
    app.applyCanvasTransform = () => {};
    app.populateActivityFilter = () => {};
    app.renderMain();

    const grid = document.getElementById('activitiesGrid');
    const buttons = grid.children.filter(element => typeof element.className === 'string' && element.className.includes('activity-btn'));
    assert.equal(buttons.length, 4);
    for (const button of buttons) {
        const activity = app.activities.find(item => item.id === button.dataset.activityId);
        assert.equal(button.style['--activity-accent'], activity.color);
        assert.equal(button.style['--activity-text-color'], app.contrastingTextColor(activity.color));
        assert.notEqual(button.style['--activity-text-color'], activity.color);
    }
    assert.equal(buttons.find(button => button.dataset.activityId === 'white-activity').style['--activity-text-color'], '#000000');
    assert.equal(buttons.find(button => button.dataset.activityId === 'black-activity').style['--activity-text-color'], '#ffffff');
    assert.equal(buttons.find(button => button.dataset.activityId === 'yellow-activity').style['--activity-text-color'], '#000000');
    assert.equal(buttons.find(button => button.dataset.activityId === 'navy-activity').style['--activity-text-color'], '#ffffff');
});

test('editing an activity loads a long name without truncation', () => {
    const { app, document } = createTestApp();
    const longName = 'A very long activity name that exceeds the old thirty character limit';
    app.activities = [{ id: 'long-name', name: longName, color: '#ffffff', shape: 'circle', size: 'medium', archived: false }];
    app.showActivityModal('long-name');
    assert.equal(document.getElementById('activityName').value, longName);
});
