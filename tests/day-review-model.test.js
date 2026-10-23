import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { webcrypto } from 'node:crypto';
import test from 'node:test';
import vm from 'node:vm';
import worker, { TimerHubDurableObject } from '../worker/index.js';

const source = await readFile(new URL('../app.js', import.meta.url), 'utf8');
const clockodoClientSource = await readFile(new URL('../clockodo-client.js', import.meta.url), 'utf8');
const exchangeSource = await readFile(new URL('../exchange.js', import.meta.url), 'utf8');
const assignmentSource = await readFile(new URL('../assignment.js', import.meta.url), 'utf8');
const shareLinkSource = await readFile(new URL('../share-link.js', import.meta.url), 'utf8');

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
        async deleteLayout(id) {
            storageData.layout = storageData.layout.filter(layout => layout.activityId !== id);
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
        async applyAssignmentImport({ putGroups = [], putActivities = [], putLayouts = [], deleteGroupIds = [], deleteActivityIds = [], deleteLayoutIds = [], settings = {} } = {}) {
            await Promise.resolve();
            const nextGroups = structuredClone(storageData.groups).filter(group => !deleteGroupIds.includes(group.id));
            const nextActivities = structuredClone(storageData.activities).filter(activity => !deleteActivityIds.includes(activity.id));
            const nextLayouts = structuredClone(storageData.layout).filter(layout => !deleteLayoutIds.includes(layout.activityId));
            const nextSettings = structuredClone(storageData.settings);
            putGroups.forEach(group => nextGroups.push(structuredClone(group)));
            putActivities.forEach(activity => nextActivities.push(structuredClone(activity)));
            putLayouts.forEach(layout => {
                const index = nextLayouts.findIndex(item => item.activityId === layout.activityId);
                if (index >= 0) nextLayouts[index] = structuredClone(layout);
                else nextLayouts.push(structuredClone(layout));
            });
            const nextSettingsData = {};
            for (const [key, value] of Object.entries(settings)) nextSettingsData[key] = structuredClone(value);
            storageData.groups = nextGroups;
            storageData.activities = nextActivities;
            storageData.layout = nextLayouts;
            storageData.settings = nextSettings;
            Object.assign(storageData.settings, nextSettingsData);
            return true;
        },
        async saveGroup(group) {
            const idx = storageData.groups.findIndex(item => item.id === group.id);
            if (idx >= 0) storageData.groups[idx] = structuredClone(group);
            else storageData.groups.push(structuredClone(group));
            return group;
        },
        async saveGroups(groups) {
            for (const group of groups) {
                const idx = storageData.groups.findIndex(item => item.id === group.id);
                if (idx >= 0) storageData.groups[idx] = structuredClone(group);
                else storageData.groups.push(structuredClone(group));
            }
            return groups;
        },
        async deleteGroup(id) {
            storageData.groups = storageData.groups.filter(group => group.id !== id);
        },
        async getLayout() { return structuredClone(storageData.layout); },
        async saveLayout(layout) {
            const idx = storageData.layout.findIndex(item => item.activityId === layout.activityId);
            if (idx >= 0) storageData.layout[idx] = structuredClone(layout);
            else storageData.layout.push(structuredClone(layout));
            return layout;
        },
        async saveLayouts(layouts) {
            for (const layout of layouts) {
                const idx = storageData.layout.findIndex(item => item.activityId === layout.activityId);
                if (idx >= 0) storageData.layout[idx] = structuredClone(layout);
                else storageData.layout.push(structuredClone(layout));
            }
            return layouts;
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
        async removeSettingWithoutSnapshot(k) {
            delete storageData.settings[k];
        },
        async exportAll() {
            return structuredClone({
                activities: storageData.activities,
                groups: storageData.groups,
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
        'activitiesGrid', 'timerRunningStatus', 'logActivityFilter', 'logDateFilter',
        'entryEditDate', 'entryEditEndDate', 'entryEditStart', 'entryEditEnd', 'entryEditActivity',
        'entryEditProject', 'entryEditService', 'entryEditNotes', 'entryEditModalTitle',
        'entryEditDeleteBtn', 'entryEditSaveBtn', 'entryEditLockedNotice', 'entryConflictWarning', 'entryEditModal',
        'entryEditCustomerSelect', 'entryEditServiceSelect', 'entryEditClockodoHint', 'entryEditClockodoRetryBtn',
        'entryEditCustomerInput', 'entryEditCustomerList', 'entryEditServiceInput', 'entryEditServiceList',
        'activityModal', 'modalTitle', 'activityName', 'activityNotes', 'modalSaveBtn', 'modalCancelBtn', 'modalCloseBtn',
        'activityMenuModal', 'activityMenuTitle',
        'activityCustomerSelect', 'activityServiceSelect', 'activityClockodoHint', 'activityClockodoRetryBtn',
        'activityProjectSelect', 'activityProjectInput', 'activityProjectList', 'entryEditProjectSelect', 'entryEditProjectList',
        'activityCustomerInput', 'activityCustomerList', 'activityServiceInput', 'activityServiceList',
        'syncConfirmEntriesList', 'syncConfirmDesc', 'syncConfirmSummary',
        'syncConfirmAlreadySyncedNotice', 'syncConfirmSubmitBtn', 'syncConfirmModal',
        'clockodoEmailInput', 'clockodoApiKeyInput', 'clockodoCustomerIdInput', 'clockodoProjectIdInput', 'clockodoServiceIdInput', 'clockodoSaveBtn',
        'clockodoBillableSelect', 'clockodoTestBtn', 'clockodoRemoveBtn', 'clockodoStatusValue', 'clockodoToggleKeyBtn',
        'automaticBackupStatus', 'automaticSnapshotSelect', 'restoreSnapshotBtn', 'backupRestoreModal',
        'backupRestoreMergeBtn', 'backupRestoreReplaceBtn', 'backupRestoreCancelBtn', 'backupRestoreCloseBtn',
        'lastBackupStatus', 'storagePersistenceStatus', 'backupDiagnostics', 'backupRestoreEmptyWarning',
        'backupRestoreEmptyConfirm', 'missingDataWarning', 'missingDataRestoreBtn', 'missingDataDismissBtn',
        'reviewShareLinkBtn', 'shareLinkModal', 'shareLinkExpirySelect', 'shareLinkSummary', 'shareLinkEntryList',
        'shareLinkStatus', 'shareLinkResult', 'shareLinkActions', 'shareLinkCreateBtn', 'shareLinkCopyBtn',
        'shareLinkSendBtn', 'shareLinkCloseBtn', 'shareLinkCancelBtn',
        'sharedDayModal', 'sharedDayPreviewSummary', 'sharedDayPreviewWarnings', 'sharedDayPreviewList',
        'sharedDayStatus', 'sharedDayImportBtn', 'sharedDayRetryBtn', 'sharedDayConfigureBtn', 'sharedDayCloseBtn',
        'reviewExportDayBtn', 'reviewImportDayBtn', 'reviewShareDayBtn', 'dayExportModal', 'dayExportModalTitle', 'exchangeCodeDisplay',
        'exchangeCopyCodeBtn', 'exchangeShowQrBtn', 'dayExportCloseBtn',
        'dayImportModal', 'dayImportModalTitle', 'exchangeFileInput', 'exchangeChooseFileBtn', 'exchangeFileName',
        'exchangeCodeInput', 'exchangeScanQrBtn', 'exchangeImportError', 'exchangePreview', 'exchangePreviewSummary',
        'exchangePreviewWarnings', 'exchangePreviewList', 'exchangeDecryptBtn', 'exchangeImportBtn',
        'dayImportCloseBtn', 'dayImportCancelBtn', 'exchangeQrModal', 'exchangeQrCanvas',
        'exchangeQrCloseBtn', 'exchangeQrDoneBtn', 'exchangeScanModal', 'exchangeScanVideo', 'exchangeScanStatus',
        'exchangeScanCloseBtn', 'exchangeScanDoneBtn',
        'importAssignmentBtn', 'assignmentImportModal', 'assignmentImportModalTitle', 'assignmentImportCloseBtn',
        'assignmentJsonInput', 'assignmentFileInput', 'assignmentChooseFileBtn', 'assignmentCopyPromptBtn',
        'assignmentValidateBtn', 'assignmentImportError', 'assignmentPreview', 'assignmentPreviewSummary',
        'assignmentPreviewWarnings', 'assignmentPreviewList', 'assignmentImportCancelBtn', 'assignmentImportConfirmBtn',
        'groupEditModal', 'groupEditModalTitle', 'groupEditModalCloseBtn', 'groupEditNameInput', 'groupEditNameError',
        'groupEditColorOptions', 'groupEditCancelBtn', 'groupEditSaveBtn',
        'groupEditCustomerInput', 'groupEditCustomerSelect', 'groupEditCustomerList',
        'groupEditClockodoHint', 'groupEditClockodoRetryBtn', 'groupEditCustomerClearBtn', 'menuDuplicateBtn',
        'createGroupFromGroupsBtn', 'deleteGroupsBtn', 'groupDeleteModal', 'groupDeleteModalTitle',
        'groupDeleteModalCloseBtn', 'groupDeleteSummary', 'groupDeleteOutcome', 'groupDeleteLockedWarning',
        'groupDeleteActivitiesKeep', 'groupDeleteActivitiesDelete', 'groupDeleteNestedKeep', 'groupDeleteNestedDelete',
        'groupDeleteCancelBtn', 'groupDeleteConfirmBtn', 'groupEditLockedInput', 'undoCanvasBtn', 'redoCanvasBtn', 'iconPicker',
        'activityAssignmentsToggleBtn',
        'backupSetupScreen', 'backupSetupTitle', 'backupSetupStatus', 'backupSetupDirectory',
        'backupSetupData', 'backupSetupError', 'backupSetupCompatibility',
        'backupSetupChooseBtn', 'backupSetupReauthorizeBtn', 'backupSetupRetryBtn',
        'backupSetupChangeDirBtn', 'backupSetupExportBtn',
        'backupAccessBanner', 'backupAccessBannerText', 'backupAccessRestoreBtn', 'backupAccessSettingsBtn'
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
        createElementNS: () => testDocument.createElement(),
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
            location: {
                hostname: 'localhost',
                origin: 'https://timerhub.example.test',
                pathname: '/',
                search: '',
                hash: ''
            },
            history: { replaceState() {} },
            addEventListener() {}
        },
        document: testDocument,
        fetch: initialData.fetch || null,
        Blob,
        File,
        URL: Object.assign(function TimerHubTestURL(...args) { return new globalThis.URL(...args); }, {
            createObjectURL(blob) { backupCapture.blob = blob; return 'blob:timerhub-test'; },
            revokeObjectURL(url) { backupCapture.revoked.push(url); }
        }),
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
    vm.runInContext(assignmentSource, context, { filename: 'assignment.js' });
    vm.runInContext(shareLinkSource, context, { filename: 'share-link.js' });
    vm.runInContext(source, context, { filename: 'app.js' });
    const app = vm.runInContext('new TimerHubApp()', context);
    app.storage = mockStorage;
    app.clockodoClient = initialData.clockodoClient || null;
    const toasts = [];
    app.showToast = message => toasts.push(message);
    return { app, storageData, document: testDocument, localStorageData, toasts, backupCapture, context, window: context.window };
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
            // Copy-on-write snapshot so a failed or aborted transaction restores
            // the exact previous state, matching IndexedDB atomicity.
            const backups = new Map(storeNames.map(name => [name, new Map([...data[name]].map(([key, value]) => [key, structuredClone(value)]))]));
            const tx = {
                error: null, oncomplete: null, onerror: null, onabort: null,
                pending: 0, failed: false, aborted: false, completionQueued: false
            };
            const rollback = () => {
                for (const [name, records] of backups) data[name] = records;
            };
            tx.abort = () => {
                if (tx.aborted || tx.failed) return;
                tx.aborted = true;
                tx.error = tx.error || new Error('indexeddb_transaction_aborted');
                rollback();
                tx.onabort?.();
            };
            const finishIfReady = () => {
                if (tx.pending || tx.failed || tx.aborted || tx.completionQueued) return;
                tx.completionQueued = true;
                queueMicrotask(() => {
                    tx.completionQueued = false;
                    if (!tx.pending && !tx.failed && !tx.aborted) tx.oncomplete?.();
                });
            };
            const makeRequest = operation => {
                const request = {};
                tx.pending += 1;
                queueMicrotask(() => {
                    try {
                        if (tx.aborted) return;
                        if (fail) throw new Error('indexeddb_write_failed');
                        request.result = operation();
                        request.onsuccess?.();
                    } catch (error) {
                        request.error = error;
                        tx.error = error;
                        tx.failed = true;
                        rollback();
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
    const overlays = [];
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
        if (selector.startsWith('.activity-assignment-overlay')) {
            return overlays.find(node => node.dataset.activityId === id) || null;
        }
        return buttons.find(node => node.dataset.activityId === id) || null;
    };
    stage.appendChild = item => {
        if (item.classList.contains('group-container')) containers.push(item);
        else if (item.classList.contains('activity-resize-handle')) handles.push(item);
        else if (item.classList.contains('activity-assignment-overlay')) overlays.push(item);
        else buttons.push(item);
        return item;
    };
    stage.replaceChildren = () => { buttons.length = 0; handles.length = 0; containers.length = 0; overlays.length = 0; };

    const status = makeElement();
    const filter = makeElement();
    filter.value = '';
    const addActivityBtn = makeElement();
    addActivityBtn.textContent = '+';
    const createGroupBtn = makeElement();
    createGroupBtn.hidden = true;
    const groupToggleAllBtn = makeElement();
    groupToggleAllBtn.hidden = true;
    const activityAssignmentsToggleBtn = makeElement();
    const originalGetById = context.document.getElementById;
    context.document.getElementById = id => ({
        activityCanvasViewport: viewport,
        activitiesGrid: stage,
        timerRunningStatus: status,
        logActivityFilter: filter,
        addActivityBtn,
        createGroupBtn,
        groupToggleAllBtn,
        activityAssignmentsToggleBtn
    })[id] || originalGetById(id);
    context.document.querySelector = selector => stage.querySelector(selector);
    context.document.querySelectorAll = selector => selector === '.activity-btn' ? buttons : [];
    context.document.createElement = () => makeElement();
    context.document.createElementNS = () => makeElement();
    app.toggleActivity = async () => {};
    app.setupActivityCanvasInteractions();

    const pointer = (type, target, x, y, modifiers = {}) => viewport.handlers.get(type)?.({
        isPrimary: true, pointerType: 'mouse', button: 0, pointerId: 1,
        clientX: x, clientY: y, target, type, preventDefault() {}, ...modifiers
    });

    return {
        app, context, storageData, viewport, stage,
        buttons, handles, containers, overlays, status, addActivityBtn, createGroupBtn, groupToggleAllBtn,
        activityAssignmentsToggleBtn, pointer, makeElement
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
            const names = Array.isArray(storeNames) ? storeNames : [storeNames];
            return {
                objectStore(name = names[0]) {
                    const storeName = names.includes(name) ? name : names[0];
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
    await repository.flushAutomaticSnapshot();

    const snapshots = await repository.getAutomaticSnapshots();
    assert.equal(snapshots.length, 1, 'rapid mutations are coalesced into one snapshot');
    assert.equal(snapshots[0].format, 'timerhub-snapshot');
    assert.equal(snapshots[0].version, 1);
    assert.equal(snapshots[0].data.activities.length, 2);
    assert.equal(JSON.stringify(snapshots).includes('must-not-be-snapshotted'), false);
    assert.equal(harness.stats.snapshotTransactions, 1, 'snapshot writes must not recursively snapshot themselves');
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
        await repository.flushAutomaticSnapshot();
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
    await restored.flushAutomaticSnapshot();
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

test('newly created activities receive normalized persisted geometry', async () => {
    const { app, document, storageData } = createTestApp();
    app.showActivityModal();
    document.getElementById('activityName').value = 'Fresh circle';
    await app.saveActivity();
    const activity = app.activities.find(item => item.name === 'Fresh circle');
    const layout = app.activityLayouts.get(activity.id);
    assert.ok(layout, 'a canvas layout is created with the activity');
    for (const field of ['x', 'y', 'width', 'height']) {
        assert.equal(layout[field] % 16, 0, `${field} is grid-aligned`);
        assert.ok(Number.isFinite(layout[field]));
    }
    assert.equal(layout.width, layout.height, 'new circle geometry is equilateral');
    assert.deepEqual(
        { ...storageData.layout.find(item => item.activityId === activity.id) },
        { activityId: activity.id, x: layout.x, y: layout.y, width: layout.width, height: layout.height }
    );
});

test('activity geometry keeps grid, shape, and content invariants', () => {
    const { app } = createTestApp();
    const rectangle = app.normalizeActivityGeometryDimensions(
        { name: 'Task', shape: 'rounded' }, 200, 150
    );
    assert.equal(rectangle.width % 16, 0);
    assert.equal(rectangle.height % 16, 0);
    assert.notEqual(rectangle.width, rectangle.height, 'rectangles keep independent dimensions');

    const circle = app.normalizeActivityGeometryDimensions({ name: 'Task', shape: 'circle' }, 200, 150);
    const square = app.normalizeActivityGeometryDimensions({ name: 'Task', shape: 'square' }, 260, 120);
    assert.equal(circle.width, circle.height, 'circles have equal outer dimensions');
    assert.equal(square.width, square.height, 'squares have equal outer dimensions');
    assert.equal(circle.width % 16, 0);
    assert.equal(square.height % 16, 0);

    const activity = { id: 'grid-circle', name: 'Task', shape: 'circle', size: 'medium', position: 0 };
    app.activities = [activity];
    app.activityLayouts = new Map([['grid-circle', {
        activityId: 'grid-circle', x: 140, y: 90, width: 260, height: 150
    }]]);
    const layout = app.getActivityCanvasLayout(activity, 0);
    assert.equal(layout.x % 16, 0, 'activity x snaps to the grid');
    assert.equal(layout.y % 16, 0, 'activity y snaps to the grid');
    assert.equal(layout.width, layout.height, 'circle layout is equilateral');

    const fresh = { id: 'fresh-activity', name: 'Fresh', shape: 'square', size: 'medium', position: 1 };
    app.activities.push(fresh);
    const freshLayout = app.getActivityCanvasLayout(fresh, 1);
    assert.equal(freshLayout.x % 16, 0);
    assert.equal(freshLayout.y % 16, 0);
    assert.equal(freshLayout.width % 16, 0);
    assert.equal(freshLayout.height % 16, 0);
    assert.equal(freshLayout.width, freshLayout.height, 'new square activities use equal outer dimensions');
});

test('resize normalization changes dimensions only in whole grid steps', () => {
    const { app } = createTestApp();
    const rectangle = activity => app.normalizeActivityGeometryDimensions(activity, 160, 112);
    const expected = [[160, 160], [161, 176], [175, 176], [176, 176], [191, 192], [192, 192]];
    for (const [requested, snapped] of expected) {
        const dimensions = app.normalizeActivityGeometryDimensions(
            { name: 'Ignored text', shape: 'rounded' }, requested, 112
        );
        assert.equal(dimensions.width, snapped, `rounds ${requested} up to the next grid step`);
        assert.equal(dimensions.width % 16, 0);
        assert.equal(dimensions.height, 112);
    }
    const circle = app.normalizeActivityGeometryDimensions({ name: 'Ignored text', shape: 'circle' }, 160, 112);
    const square = app.normalizeActivityGeometryDimensions({ name: 'Ignored text', shape: 'square' }, 161, 112);
    assert.deepEqual([circle.width, circle.height], [160, 160], 'circle reaches the minimum square grid size');
    assert.deepEqual([square.width, square.height], [176, 176], 'square resize keeps equal grid dimensions');
    assert.deepEqual({ ...rectangle({ name: 'x' }) }, { width: 160, height: 112 });
});

test('long text does not affect resize, creation, or shape constraints', async () => {
    const harness = createGroupCanvasHarness();
    const { app, buttons, pointer } = harness;
    const activity = {
        id: 'tiny-circle', name: 'A name that is deliberately far too long to fit in a minimum circle',
        shape: 'circle', position: 0
    };
    app.activities = [activity];
    app.activityLayouts = new Map([['tiny-circle', {
        activityId: 'tiny-circle', x: 144, y: 96, width: 400, height: 400
    }]]);
    app.renderMain();
    let button = buttons.find(item => item.dataset.activityId === 'tiny-circle');
    assert.equal(button.style.width, '400px', 'rendering does not shrink or grow based on text');
    const small = app.normalizeActivityGeometryDimensions(activity, 160, 160);
    assert.deepEqual([small.width, small.height], [160, 160], 'long text does not prevent the minimum size');
    app.activityLayouts.set('tiny-circle', {
        activityId: 'tiny-circle', x: 144, y: 96, width: 160, height: 160
    });
    app.renderMain();
    button = buttons.find(item => item.dataset.activityId === 'tiny-circle');
    assert.equal(button.style.width, '160px');
    assert.equal(button.style.height, '160px');
    assert.ok(button, 'the minimum-size activity still renders and can receive pointer interaction');
    assert.equal(harness.handles.some(handle => handle.dataset.activityId === 'tiny-circle'), true,
        'the resize handle remains available at minimum size');

    pointer('pointerdown', button, 0, 0);
    pointer('pointermove', button, 16, 0);
    pointer('pointerup', button, 16, 0);
    assert.equal(app.activityLayouts.get('tiny-circle').x, 160, 'a minimum-size activity can still be dragged on the grid');

    const handle = harness.handles.find(item => item.dataset.activityId === 'tiny-circle');
    pointer('pointerdown', handle, 0, 0);
    pointer('pointermove', handle, 16, 16);
    pointer('pointerup', handle, 16, 16);
    const resized = app.activityLayouts.get('tiny-circle');
    assert.equal(resized.width, 176);
    assert.equal(resized.height, 176);
    assert.equal(resized.width % 16, 0);
    assert.equal(resized.height % 16, 0);
});

test('text length never influences activity dimensions', () => {
    const { app } = createTestApp();
    const short = app.normalizeActivityGeometryDimensions({ name: 'A', shape: 'rounded' }, 160, 112);
    const longWord = 'Supercalifragilisticexpialidocious';
    const long = app.normalizeActivityGeometryDimensions({ name: longWord, shape: 'rounded' }, 160, 112);
    const sentence = 'Paint the complete staircase and all hallway walls before the final inspection';
    const wrapped = app.normalizeActivityGeometryDimensions({ name: sentence, shape: 'rounded' }, 160, 112);
    const diamond = app.normalizeActivityGeometryDimensions({ name: longWord, shape: 'diamond' }, 160, 112);
    const circle = app.normalizeActivityGeometryDimensions({ name: longWord, shape: 'circle' }, 160, 112);
    assert.deepEqual({ ...long }, { ...short }, 'a long word does not expand a rectangle');
    assert.deepEqual({ ...wrapped }, { ...short }, 'a long sentence does not expand a rectangle');
    assert.deepEqual({ ...diamond }, { ...short }, 'shape interiors do not impose a text minimum');
    assert.deepEqual({ ...circle }, { width: 160, height: 160 }, 'circles reach the minimum square grid size regardless of text');
    for (const dimensions of [short, long, wrapped, diamond, circle]) {
        assert.equal(dimensions.width % 16, 0);
        assert.equal(dimensions.height % 16, 0);
    }
});

test('activity geometry migration reaches the authoritative layout store', async () => {
    const { app, context } = createTestApp();
    const repository = vm.runInContext('new StorageRepository()', context);
    const database = createIndexedDbHarness();
    repository.db = database.db;
    database.data.activities.set('stored-activity', {
        id: 'stored-activity', name: 'Stored', position: 0, shape: 'circle'
    });
    database.data.layout.set('stored-activity', {
        activityId: 'stored-activity', x: 140, y: 90, width: 260, height: 150
    });
    app.storage = repository;
    await app.loadActivities();
    await app.loadGroups();
    const layout = (await repository.getLayout()).find(item => item.activityId === 'stored-activity');
    assert.equal(layout.x % 16, 0);
    assert.equal(layout.y % 16, 0);
    assert.equal(layout.width, layout.height, 'circle dimensions are equal in storage');
    assert.equal(layout.width % 16, 0);
    assert.equal(layout.height % 16, 0);
});

test('already normalized activity layouts are not rewritten', async () => {
    const harness = createGroupCanvasHarness();
    const { app, storageData } = harness;
    storageData.activities = [{ id: 'aligned-activity', name: 'A', position: 0, shape: 'rounded' }];
    storageData.layout = [{
        activityId: 'aligned-activity', x: 144, y: 96, width: 160, height: 112
    }];
    let writes = 0;
    app.storage.saveLayouts = async () => { writes += 1; };
    await app.loadActivities();
    await app.loadGroups();
    assert.equal(writes, 0, 'aligned activity geometry is not rewritten');
    assert.deepEqual(
        { ...app.activityLayouts.get('aligned-activity') },
        { activityId: 'aligned-activity', x: 144, y: 96, width: 160, height: 112 }
    );
});

test('invalid activity geometry follows the safe fallback and persists finite grid values', async () => {
    const harness = createGroupCanvasHarness();
    const { app, storageData } = harness;
    storageData.activities = [{ id: 'bad-activity', name: 'Bad', position: 0, shape: 'rounded' }];
    storageData.layout = [{
        activityId: 'bad-activity', x: 'left', y: null, width: 'wide', height: -10
    }];
    const writes = [];
    const originalSaveLayouts = app.storage.saveLayouts.bind(app.storage);
    app.storage.saveLayouts = async layouts => {
        writes.push(structuredClone(layouts));
        return originalSaveLayouts(layouts);
    };
    await app.loadActivities();
    await app.loadGroups();
    const layout = app.activityLayouts.get('bad-activity');
    for (const field of ['x', 'y', 'width', 'height']) {
        assert.ok(Number.isFinite(layout[field]), `${field} is finite`);
        assert.equal(layout[field] % 16, 0, `${field} is normalized`);
    }
    const stored = storageData.layout.find(item => item.activityId === 'bad-activity');
    assert.deepEqual([stored.x, stored.y, stored.width, stored.height],
        [layout.x, layout.y, layout.width, layout.height]);
    assert.equal(typeof stored.x, 'number', 'invalid coordinates are persisted as numbers');
    assert.equal(stored.x === 'left', false);
});

test('text edits never resize activities while shape constraints stay valid', async () => {
    const { app, storageData } = createTestApp();
    const activity = { id: 'text-geometry', name: 'A', shape: 'rounded', position: 0 };
    app.activities = [activity];
    const initialLayout = { activityId: 'text-geometry', x: 144, y: 96, width: 160, height: 112 };
    app.activityLayouts = new Map([['text-geometry', { ...initialLayout }]]);
    storageData.layout = [{ ...initialLayout }];
    activity.name = 'A much longer activity name that must wrap across several lines on the canvas';
    const afterTextEdit = await app.syncActivityLayoutGeometry(activity);
    assert.deepEqual([afterTextEdit.width, afterTextEdit.height], [160, 112], 'editing text does not enlarge the object');
    assert.deepEqual(
        [storageData.layout[0].width, storageData.layout[0].height],
        [160, 112],
        'text edits persist the unchanged dimensions'
    );

    activity.shape = 'circle';
    const circle = await app.syncActivityLayoutGeometry(activity);
    assert.equal(circle.width, circle.height, 'shape changes enforce equal circle dimensions');
    assert.deepEqual([circle.width, circle.height], [160, 160], 'shape equality uses the minimum supported grid size');
    assert.equal(circle.width % 16, 0);
});

test('activity geometry migration persists grid/shape dimensions once', async () => {
    const harness = createGroupCanvasHarness();
    const { app, storageData } = harness;
    storageData.groups = [
        { id: 'geom-group', name: 'Group', x: 100, y: 100, collapsed: false }
    ];
    storageData.activities = [
        { id: 'geom-free', name: 'Long activity name', position: 0, shape: 'circle' },
        { id: 'geom-member', name: 'Member', position: 1, shape: 'square', groupId: 'geom-group' }
    ];
    storageData.layout = [
        { activityId: 'geom-free', x: 140, y: 90, width: 260, height: 150, customField: 'keep' },
        { activityId: 'geom-member', x: 8, y: 8, width: 200, height: 120 }
    ];
    const layoutWrites = [];
    const originalSaveLayouts = app.storage.saveLayouts.bind(app.storage);
    app.storage.saveLayouts = async layouts => {
        layoutWrites.push(structuredClone(layouts));
        return originalSaveLayouts(layouts);
    };
    await app.loadActivities();
    await app.loadGroups();
    const free = app.activityLayouts.get('geom-free');
    const member = app.activityLayouts.get('geom-member');
    for (const layout of [free, member]) {
        assert.equal(layout.x % 16, 0);
        assert.equal(layout.y % 16, 0);
        assert.equal(layout.width % 16, 0);
        assert.equal(layout.height % 16, 0);
    }
    assert.equal(free.width, free.height, 'circle geometry is equilateral');
    assert.equal(member.width, member.height, 'square geometry is equilateral');
    assert.equal(free.customField, 'keep');
    assert.equal(app.activities.find(activity => activity.id === 'geom-free').groupId, undefined);
    assert.equal(app.activities.find(activity => activity.id === 'geom-member').groupId, 'geom-group');
    const persistedFree = storageData.layout.find(layout => layout.activityId === 'geom-free');
    const persistedMember = storageData.layout.find(layout => layout.activityId === 'geom-member');
    assert.deepEqual([persistedFree.x, persistedFree.y, persistedFree.width, persistedFree.height],
        [free.x, free.y, free.width, free.height]);
    assert.deepEqual([persistedMember.x, persistedMember.y, persistedMember.width, persistedMember.height],
        [member.x, member.y, member.width, member.height]);
    assert.ok(layoutWrites.length >= 1);
    const writesBeforeReload = layoutWrites.length;
    await app.loadGroups();
    assert.equal(layoutWrites.length, writesBeforeReload, 'a normalized reload performs no extra write');
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
    assert.equal(initialButton.style.left, '144px', 'existing off-grid positions normalize onto the grid');
    assert.equal(initialButton.style.top, '96px', 'existing off-grid positions normalize onto the grid');

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
    assert.deepEqual(savedLayouts[0], { activityId: activity.id, x: 176, y: 144, width: 272, height: 272 });
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
    assert.deepEqual(savedLayouts[1], { activityId: activity.id, x: 176, y: 144, width: 336, height: 336 });
    assert.equal(savedLayouts[1].width, savedLayouts[1].height, 'circle resize keeps equal outer dimensions');
    assert.equal(savedLayouts[1].width % 16, 0);
    assert.equal(savedLayouts[1].height % 16, 0);
    assert.equal(timerStarts, 1, 'resizing cannot start the timer');

    stage.handlers.get('keydown')?.({
        key: 'ArrowRight', shiftKey: true, target: button, preventDefault() {}
    });
    assert.equal(savedLayouts.length, 3, 'keyboard moves persist a snapped position');
    assert.deepEqual(savedLayouts[2], { activityId: activity.id, x: 192, y: 144, width: 336, height: 336 });

    pointer('pointerdown', viewport, 0, 0);
    pointer('pointermove', viewport, 35, 25);
    pointer('pointerup', viewport, 35, 25);
    assert.equal(savedLayouts.length, 3, 'panning does not create activity layout mutations');
    assert.ok(localStorageData.has('timerhubActivityCanvasView'), 'the viewport returns to its panned position after reload');
    assert.deepEqual([app.readCanvasPan().x, app.readCanvasPan().y], [35, 25]);
});

test('canvas grid dots follow the same pan and zoom as group coordinates', () => {
    const harness = createGroupCanvasHarness();
    const { app, stage, viewport } = harness;
    app.canvasPan = { x: 32, y: -16 };
    app.canvasZoom = 2;
    app.applyCanvasTransform(stage);
    assert.equal(stage.style.transform, 'translate(32px, -16px) scale(2)');
    assert.equal(viewport.style.backgroundSize, '32px 32px', 'the 16px grid scales with the canvas');
    assert.equal(viewport.style.backgroundPosition, '32px -16px', 'the grid origin follows canvas pan');

    app.canvasPan = { x: -8, y: 24 };
    app.canvasZoom = 0.5;
    app.applyCanvasTransform(stage);
    assert.equal(viewport.style.backgroundSize, '8px 8px');
    assert.equal(viewport.style.backgroundPosition, '-8px 24px');
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
    assert.equal(storedFirst.x, 0);
    assert.equal(storedFirst.y, 0);
    assert.equal(storedFirst.width, 272);
    assert.equal(storedFirst.height, 160);
    assert.equal(storedSecond.x, 272);
    assert.equal(storedSecond.y, 160);
    assert.equal(storedSecond.width, 224);
    assert.equal(storedSecond.height, 128);
    assert.equal(storedSecond.x - storedFirst.x, 272, 'relative positions are preserved on the grid');
    assert.equal(storedSecond.y - storedFirst.y, 160, 'relative positions are preserved on the grid');

    assert.deepEqual({ ...app.getActivityCanvasLayout(first, 0) }, { x: 144, y: 96, width: 272, height: 160 });
    assert.deepEqual({ ...app.getActivityCanvasLayout(second, 1) }, { x: 416, y: 256, width: 224, height: 128 });
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
    assert.deepEqual({ ...app.getActivityCanvasLayout(activity, 0) }, { x: 144, y: 96, width: 272, height: 160 });
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
    const layouts = app.activities.map(activity => app.getActivityCanvasLayout(activity, app.activities.indexOf(activity), false));
    const bounds = app.groupContainerBounds(layouts);
    assert.equal(container.style.left, `${bounds.left}px`);
    assert.equal(container.style.top, `${bounds.top}px`);
    assert.equal(container.style.width, `${bounds.width}px`);
    assert.equal(container.style.height, `${bounds.height}px`);
    assert.equal(bounds.width % 16, 0);
    assert.equal(bounds.height % 16, 0);
    assert.equal(container.style.zIndex, '0');
    assert.equal(container.children[0].className, 'group-title');
    assert.equal(container.children[0].children[0].className, 'group-collapse-btn');
    assert.equal(container.children[0].children[1].className, 'group-title-text');
    assert.equal(container.children[0].children[1].textContent, 'Crew');
    assert.equal(container.children[0].children[2].className, 'group-edit-btn');
    assert.equal(container.children[0].children[3].className, 'group-duplicate-btn');
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

test('legacy off-grid group anchors normalize to the 16px grid on load', async () => {
    const harness = createGroupCanvasHarness();
    const { app, storageData, buttons, containers } = harness;
    storageData.groups = [
        {
            id: 'legacy-parent', name: 'Legacy Parent', x: 101, y: 189, collapsed: false,
            collapsedWidth: 220, collapsedHeight: 46,
            color: '#123456', assignment: 'Legacy job', importedAt: 7, customField: 'keep-me'
        },
        { id: 'legacy-child', name: 'Legacy Child', x: 133, y: 221, collapsed: true, parentId: 'legacy-parent', collapsedWidth: 288, collapsedHeight: 64 }
    ];
    storageData.activities = [
        { id: 'legacy-parent-a', name: 'Parent activity', position: 0, groupId: 'legacy-parent', size: 'medium' },
        { id: 'legacy-child-a', name: 'Child activity', position: 1, groupId: 'legacy-child', size: 'medium' }
    ];
    storageData.layout = [
        { activityId: 'legacy-parent-a', x: 0, y: 0, width: 200, height: 120 },
        { activityId: 'legacy-child-a', x: 0, y: 0, width: 200, height: 120 }
    ];
    const saveCalls = [];
    const originalSaveGroups = app.storage.saveGroups.bind(app.storage);
    app.storage.saveGroups = async groups => {
        saveCalls.push(structuredClone(groups));
        return originalSaveGroups(groups);
    };
    await app.loadActivities();
    await app.loadGroups();
    app.renderMain();

    const parent = app.groups.find(group => group.id === 'legacy-parent');
    const child = app.groups.find(group => group.id === 'legacy-child');
    assert.equal(saveCalls.length, 1, 'the migration writes once');
    assert.equal(saveCalls[0].length, 2, 'both off-grid groups are migrated');
    const storedParent = storageData.groups.find(group => group.id === 'legacy-parent');
    const storedChild = storageData.groups.find(group => group.id === 'legacy-child');
    assert.deepEqual([storedParent.x, storedParent.y], [96, 192], 'the persisted parent anchor is normalized');
    assert.deepEqual([storedChild.x, storedChild.y], [128, 224], 'the persisted child anchor is normalized');
    assert.equal(storedParent.color, '#123456', 'unrelated persisted fields are preserved');
    assert.equal(storedParent.assignment, 'Legacy job');
    assert.equal(storedParent.importedAt, 7);
    assert.equal(storedParent.customField, 'keep-me');
    assert.equal(storedParent.collapsedWidth, 224, 'legacy collapsed width rounds up to the grid');
    assert.equal(storedParent.collapsedHeight, 48, 'legacy collapsed height rounds up to the grid');
    assert.equal(parent.collapsedWidth, 224);
    assert.equal(parent.collapsedHeight, 48);
    assert.equal(storedParent.collapsedWidth % 16, 0);
    assert.equal(storedParent.collapsedHeight % 16, 0);
    assert.deepEqual([storedChild.collapsedWidth, storedChild.collapsedHeight], [288, 64], 'already-grid dimensions survive unchanged');
    assert.deepEqual([parent.x, parent.y], [96, 192], 'legacy parent anchors snap to the nearest grid point');
    assert.deepEqual([child.x, child.y], [128, 224], 'legacy child anchors snap to the nearest grid point');
    assert.equal(parent.x % 16, 0);
    assert.equal(parent.y % 16, 0);
    assert.equal(child.x % 16, 0);
    assert.equal(child.y % 16, 0);
    assert.equal(child.parentId, 'legacy-parent', 'nesting is preserved');
    assert.deepEqual([child.x - parent.x, child.y - parent.y], [32, 32], 'a shared legacy offset preserves the relative nested layout');
    assert.deepEqual({ ...app.activityLayouts.get('legacy-parent-a') }, { activityId: 'legacy-parent-a', x: 0, y: 0, width: 208, height: 128 });
    assert.deepEqual({ ...app.activityLayouts.get('legacy-child-a') }, { activityId: 'legacy-child-a', x: 0, y: 0, width: 208, height: 128 });
    const memberButton = buttons.find(button => button.dataset.activityId === 'legacy-parent-a');
    assert.equal(memberButton.style.left, '96px', 'members inherit the normalized grid-aligned anchor');
    assert.equal(Number.parseFloat(memberButton.style.left) % 16, 0);

    const parentBefore = groupRect(containers, 'legacy-parent');
    const childBefore = groupRect(containers, 'legacy-child');
    await app.toggleGroupCollapsed('legacy-child');
    assert.equal(groupRect(containers, 'legacy-parent').top, parentBefore.top, 'expansion keeps the normalized parent anchor');
    await app.toggleGroupCollapsed('legacy-child');
    assert.deepEqual(groupRect(containers, 'legacy-child'), childBefore, 'collapsing restores the normalized child box');
    assert.deepEqual(groupRect(containers, 'legacy-parent'), parentBefore, 'collapsing restores the normalized parent box');

    await app.loadGroups();
    assert.deepEqual([parent.x, parent.y], [96, 192], 'normalization is idempotent');
    assert.deepEqual([child.x, child.y], [128, 224], 'normalization is idempotent for nested groups');
    assert.equal(saveCalls.length, 1, 'an already-normalized reload does not rewrite storage');
});
test('assignment imports persist snapped group anchors without bypassing the grid', async () => {
    const harness = createGroupCanvasHarness();
    const { app, storageData, containers } = harness;
    app.groups = [{ id: 'existing-import', name: 'Existing', x: 48, y: 64, collapsed: false }];
    app.activities = [{ id: 'existing-a', name: 'Existing A', position: 0, groupId: 'existing-import', size: 'medium' }];
    app.activityLayouts = new Map([['existing-a', { activityId: 'existing-a', x: 0, y: 0, width: 200, height: 120 }]]);
    storageData.groups = structuredClone(app.groups);
    storageData.activities = structuredClone(app.activities);
    storageData.layout = [...app.activityLayouts.values()].map(layout => structuredClone(layout));
    app.renderMain();
    harness.context.document.getElementById('assignmentJsonInput').value = JSON.stringify({
        format: 'timerhub-assignment', version: 1, name: 'Job',
        groups: [{ name: 'Imported', activities: [{ name: 'A' }] }]
    });
    assert.equal(await app.validateAssignmentJson(), true);
    assert.equal(await app.confirmAssignmentImport(), true);
    const imported = app.groups.find(group => group.name === 'Imported');
    const stored = storageData.groups.find(group => group.id === imported.id);
    assert.equal(imported.x, app.snapToCanvasGrid(imported.x));
    assert.equal(imported.y, app.snapToCanvasGrid(imported.y));
    assert.equal(imported.x % 16, 0);
    assert.equal(imported.y % 16, 0);
    assert.equal(stored.x, imported.x, 'the snapped anchor is persisted immediately');
    assert.equal(stored.y, imported.y);
    for (const member of app.activities.filter(activity => activity.groupId === imported.id)) {
        const layout = app.getActivityCanvasLayout(member, app.activities.indexOf(member), false);
        assert.equal(layout.x % 16, 0, 'imported member x stays on the grid');
        assert.equal(layout.y % 16, 0, 'imported member y stays on the grid');
        assert.equal(layout.width % 16, 0, 'imported width stays on the grid');
        assert.equal(layout.height % 16, 0, 'imported height stays on the grid');
        if (['circle', 'square'].includes(member.shape)) {
            assert.equal(layout.width, layout.height, `${member.shape} imports use equal outer dimensions`);
        }
    }
    const importedBounds = app.groupBaseBounds(imported);
    const importedContainer = containers.find(container => container.dataset.groupId === imported.id);
    assert.equal(Number.parseFloat(importedContainer.style.width) % 16, 0, 'imported width is grid-aligned');
    assert.equal(Number.parseFloat(importedContainer.style.height) % 16, 0, 'imported height is grid-aligned');
    assert.equal(Number.parseFloat(importedContainer.style.width), importedBounds.width);
    assert.equal(Number.parseFloat(importedContainer.style.height), importedBounds.height);
    await app.loadGroups();
    assert.deepEqual([app.groups.find(group => group.id === imported.id).x,
        app.groups.find(group => group.id === imported.id).y], [imported.x, imported.y], 'reload does not overwrite the imported anchor');
});
test('diagnostic legacy anchors normalize with the existing snapping rule', async () => {
    const harness = createGroupCanvasHarness();
    const { app, storageData } = harness;
    const pairs = [[479, 212], [11, 293], [470, 287], [11, 367], [470, 367]];
    storageData.groups = pairs.map(([x, y], index) => ({
        id: `diagnostic-${index}`, name: `Diagnostic ${index}`, x, y, collapsed: true
    }));
    await app.loadGroups();
    const expected = pairs.map(([x, y]) => [app.snapToCanvasGrid(x), app.snapToCanvasGrid(y)]);
    for (const [index, [x, y]] of expected.entries()) {
        const loaded = app.groups.find(group => group.id === `diagnostic-${index}`);
        const persisted = storageData.groups.find(group => group.id === `diagnostic-${index}`);
        assert.equal(loaded.x, x, `diagnostic ${index} x uses snapToCanvasGrid`);
        assert.equal(loaded.y, y, `diagnostic ${index} y uses snapToCanvasGrid`);
        assert.equal(loaded.x % 16, 0);
        assert.equal(loaded.y % 16, 0);
        assert.deepEqual([persisted.x, persisted.y], [x, y], `diagnostic ${index} is persisted normalized`);
    }
});

test('PROBE collapsed spacing geometry', () => {
    const harness = createGroupCanvasHarness();
    const { app, containers } = harness;
    const build = (ax, bx) => {
        app.groups = [
            { id: 'pa', name: 'A', x: ax, y: 100, collapsed: true },
            { id: 'pb', name: 'B', x: bx, y: 100, collapsed: true }
        ];
        app.activities = [
            { id: 'pa1', name: 'A', position: 0, groupId: 'pa', size: 'medium' },
            { id: 'pb1', name: 'B', position: 1, groupId: 'pb', size: 'medium' }
        ];
        app.activityLayouts = new Map([
            ['pa1', { activityId: 'pa1', x: 0, y: 0, width: 200, height: 120 }],
            ['pb1', { activityId: 'pb1', x: 0, y: 0, width: 200, height: 120 }]
        ]);
        app.renderMain();
        return [groupRect(containers, 'pa'), groupRect(containers, 'pb')];
    };
    const overlap = build(48, 256);
    const gap = build(48, 272);
    console.log('PROBE overlap', JSON.stringify(overlap), overlap[1].left - overlap[0].right);
    console.log('PROBE gap', JSON.stringify(gap), gap[1].left - gap[0].right);
    assert.ok(true);
});
test('legacy collapsed dimensions alone are migrated and persisted once', async () => {
    const harness = createGroupCanvasHarness();
    const { app, storageData } = harness;
    storageData.groups = [{
        id: 'legacy-size', name: 'Legacy size', x: 96, y: 192, collapsed: true,
        collapsedWidth: 220, collapsedHeight: 46, customField: 'keep'
    }];
    const saveCalls = [];
    const originalSaveGroups = app.storage.saveGroups.bind(app.storage);
    app.storage.saveGroups = async groups => {
        saveCalls.push(structuredClone(groups));
        return originalSaveGroups(groups);
    };
    await app.loadGroups();
    const group = app.groups.find(item => item.id === 'legacy-size');
    assert.deepEqual([group.x, group.y], [96, 192], 'aligned anchors stay unchanged');
    assert.deepEqual([group.collapsedWidth, group.collapsedHeight], [224, 48], 'dimensions round up independently');
    const stored = storageData.groups.find(item => item.id === 'legacy-size');
    assert.deepEqual([stored.collapsedWidth, stored.collapsedHeight], [224, 48], 'dimensions are persisted');
    assert.equal(stored.customField, 'keep');
    assert.equal(saveCalls.length, 1, 'dimension migration writes once');
    assert.equal(app.groupCollapsedWidth(group) % 16, 0);
    assert.equal(app.groupCollapsedHeight(group) % 16, 0);

    await app.loadGroups();
    assert.equal(saveCalls.length, 1, 'subsequent loads do not rewrite migrated dimensions');
});

test('already aligned groups are not rewritten on load', async () => {
    const harness = createGroupCanvasHarness();
    const { app, storageData } = harness;
    storageData.groups = [
        { id: 'aligned-group', name: 'Aligned', x: 96, y: 192, collapsed: false, collapsedWidth: 224, collapsedHeight: 48, customField: 'keep' }
    ];
    let saveCalls = 0;
    app.storage.saveGroups = async () => { saveCalls += 1; };
    await app.loadGroups();
    assert.deepEqual([app.groups[0].x, app.groups[0].y], [96, 192]);
    assert.equal(saveCalls, 0, 'aligned storage is not rewritten');
    assert.deepEqual([storageData.groups[0].x, storageData.groups[0].y], [96, 192]);
    assert.equal(storageData.groups[0].customField, 'keep');
});

test('invalid or missing legacy coordinates migrate to the existing fallback', async () => {
    const harness = createGroupCanvasHarness();
    const { app, storageData } = harness;
    storageData.groups = [
        { id: 'bad-coords', name: 'Bad', x: 'left', y: 'bottom' },
        { id: 'missing-coords', name: 'Missing' },
        { id: 'null-coords', name: 'Null', x: null, y: null },
        { id: 'aligned-coords', name: 'Aligned', x: 32, y: 48 }
    ];
    const saveCalls = [];
    const originalSaveGroups = app.storage.saveGroups.bind(app.storage);
    app.storage.saveGroups = async groups => {
        saveCalls.push(structuredClone(groups));
        return originalSaveGroups(groups);
    };
    await app.loadGroups();
    assert.equal(saveCalls.length, 1);
    assert.deepEqual(saveCalls[0].map(group => group.id).sort(), ['bad-coords', 'missing-coords', 'null-coords'], 'only invalid groups are migrated');
    for (const group of app.groups) {
        if (group.id === 'aligned-coords') {
            assert.deepEqual([group.x, group.y], [32, 48], 'aligned groups keep their coordinates');
            continue;
        }
        assert.deepEqual([group.x, group.y], [0, 0], `${group.id} uses the existing zero fallback`);
        assert.ok(Number.isFinite(group.x) && Number.isFinite(group.y));
    }
    for (const group of storageData.groups) {
        assert.ok(Number.isFinite(group.x) && Number.isFinite(group.y), `${group.id} has finite persisted coordinates`);
        assert.equal(group.x % 16, 0);
        assert.equal(group.y % 16, 0);
    }
    assert.deepEqual([storageData.groups.find(group => group.id === 'aligned-coords').x,
        storageData.groups.find(group => group.id === 'aligned-coords').y], [32, 48]);
});

test('group grid migration persists through the application StorageRepository', async () => {
    const { app, context } = createTestApp();
    const repository = vm.runInContext('new StorageRepository()', context);
    const database = createIndexedDbHarness();
    repository.db = database.db;
    database.data.groups.set('stored-legacy', {
        id: 'stored-legacy', name: 'Stored legacy', x: 101, y: 189,
        collapsed: false, customField: 'keep', assignment: 'Job'
    });
    app.storage = repository;
    await app.loadGroups();
    assert.deepEqual([app.groups[0].x, app.groups[0].y], [96, 192]);
    const persisted = (await repository.getGroups()).find(group => group.id === 'stored-legacy');
    assert.deepEqual([persisted.x, persisted.y], [96, 192], 'the same IndexedDB record is updated');
    assert.equal(persisted.customField, 'keep');
    assert.equal(persisted.assignment, 'Job');
});

test('dragging a collapsed group follows the 16px grid without a release jump', () => {
    const harness = createGroupCanvasHarness();
    const { app, containers, pointer } = harness;
    const group = { id: 'snap-collapsed', name: 'Crew', x: 144, y: 96, collapsed: true };
    app.activities = [{ id: 'snap-a', name: 'A', position: 0, groupId: group.id, size: 'medium' }];
    app.activityLayouts = new Map([['snap-a', { activityId: 'snap-a', x: 16, y: 8, width: 200, height: 120 }]]);
    app.groups = [group];
    const savedGroups = [];
    app.storage.saveGroup = async saved => { savedGroups.push(structuredClone(saved)); };
    app.renderMain();
    const before = groupRect(containers, group.id);
    const title = containers[0].children[0];

    pointer('pointerdown', title, 0, 0);
    pointer('pointermove', title, 31, 17);
    const during = groupRect(containers, group.id);
    assert.equal(group.x, 176, 'dragged group x snaps to the 16px grid');
    assert.equal(group.y, 112, 'dragged group y snaps to the 16px grid');
    assert.equal(during.left, before.left + 32, 'the collapsed group visually follows the snapped x');
    assert.equal(during.top, before.top + 16, 'the collapsed group visually follows the snapped y');

    pointer('pointermove', title, 33, 19);
    assert.deepEqual(groupRect(containers, group.id), during, 'movement inside the same grid cell causes no drift');
    pointer('pointerup', title, 33, 19);
    assert.deepEqual(groupRect(containers, group.id), during, 'release does not jump away from the snapped position');
    assert.equal(group.x % 16, 0);
    assert.equal(group.y % 16, 0);
    assert.deepEqual([savedGroups.at(-1).x, savedGroups.at(-1).y], [176, 112], 'the snapped position is persisted');
});
test('a child group expanding pushes a sibling activity inside the same parent', async () => {
    const harness = createGroupCanvasHarness();
    const { app, buttons, containers, storageData } = harness;
    app.groups = [
        { id: 'inside-parent', name: 'Parent', x: 96, y: 96, collapsed: false },
        { id: 'inside-child', name: 'Child', x: 208, y: 208, collapsed: true, parentId: 'inside-parent' }
    ];
    app.activities = [
        { id: 'inside-member', name: 'Child content', shape: 'rounded', position: 0, groupId: 'inside-child' },
        { id: 'inside-sibling', name: 'Parent activity', shape: 'rounded', position: 1, groupId: 'inside-parent' }
    ];
    app.activityLayouts = new Map([
        ['inside-member', { activityId: 'inside-member', x: 0, y: 0, width: 400, height: 300 }],
        ['inside-sibling', { activityId: 'inside-sibling', x: 320, y: 64, width: 160, height: 112 }]
    ]);
    storageData.groups = structuredClone(app.groups);
    storageData.activities = structuredClone(app.activities);
    storageData.layout = [...app.activityLayouts.values()].map(layout => structuredClone(layout));
    app.renderMain();
    const sibling = app.activities.find(activity => activity.id === 'inside-sibling');
    const base = app.getActivityCanvasLayout(sibling, 1, false);
    let siblingButton = buttons.find(button => button.dataset.activityId === 'inside-sibling');
    assert.equal(app.activityDisplayOffset('inside-sibling').x, 0, 'the sibling starts outside the collapsed child');
    const parentBefore = groupRect(containers, 'inside-parent');

    await app.toggleGroupCollapsed('inside-child');
    const offset = app.activityDisplayOffset('inside-sibling');
    siblingButton = buttons.find(button => button.dataset.activityId === 'inside-sibling');
    const displayed = app.getActivityCanvasLayout(sibling, 1);
    assert.ok(offset.x > 0 || offset.y > 0, 'the sibling activity is displaced by the nested child group');
    assert.deepEqual([siblingButton.style.left, siblingButton.style.top], [`${displayed.x}px`, `${displayed.y}px`]);
    assert.deepEqual([app.activityLayouts.get('inside-sibling').x, app.activityLayouts.get('inside-sibling').y],
        [320, 64], 'the sibling saved layout is unchanged');
    const childBounds = groupRect(containers, 'inside-child');
    assert.equal(groupOverlaps(childBounds, {
        left: displayed.x, top: displayed.y, width: displayed.width, height: displayed.height
    }), false, 'the sibling clears the expanded nested group');
    const parentAfter = groupRect(containers, 'inside-parent');
    assert.ok(parentAfter.right >= displayed.x + displayed.width,
        'the parent wraps the displaced sibling activity');
    assert.equal(parentAfter.left, parentBefore.left, 'the parent anchor is stable');
    assert.equal(parentAfter.top, parentBefore.top);

    await app.toggleGroupCollapsed('inside-child');
    siblingButton = buttons.find(button => button.dataset.activityId === 'inside-sibling');
    assert.equal(siblingButton.style.left, `${base.x}px`, 'collapsing restores the sibling activity');
    assert.equal(siblingButton.style.top, `${base.y}px`);
    assert.deepEqual({ ...app.activityDisplayOffset('inside-sibling') }, { x: 0, y: 0 });
});

test('expanding a group displaces conflicting free activities temporarily', async () => {
    const harness = createGroupCanvasHarness();
    const { app, buttons, containers, overlays, storageData } = harness;
    app.groups = [{ id: 'free-group', name: 'Group', x: 304, y: 304, collapsed: true }];
    app.activities = [
        { id: 'free-member', name: 'Member', shape: 'rounded', position: 0, groupId: 'free-group' },
        {
            id: 'free-activity', name: 'Outside', shape: 'rounded', position: 1,
            customerName: 'Customer', projectName: 'Project'
        }
    ];
    app.activityLayouts = new Map([
        ['free-member', { activityId: 'free-member', x: 0, y: 0, width: 400, height: 300 }],
        ['free-activity', { activityId: 'free-activity', x: 512, y: 320, width: 160, height: 112 }]
    ]);
    storageData.groups = structuredClone(app.groups);
    storageData.activities = structuredClone(app.activities);
    storageData.layout = [...app.activityLayouts.values()].map(layout => structuredClone(layout));
    await app.toggleActivityAssignments();
    app.renderMain();
    const free = app.activities.find(activity => activity.id === 'free-activity');
    const freeBase = app.getActivityCanvasLayout(free, 1, false);
    let freeButton = buttons.find(button => button.dataset.activityId === 'free-activity');
    assert.equal(app.groupDisplayOffset('free-group').x, 0);
    assert.equal(freeButton.style.left, `${freeBase.x}px`, 'a non-overlapping free activity starts at its saved position');
    const groupCollapsed = groupRect(containers, 'free-group');

    await app.toggleGroupCollapsed('free-group');
    const groupExpanded = groupRect(containers, 'free-group');
    assert.equal(groupExpanded.left, groupCollapsed.left, 'the expanded group keeps its anchor');
    freeButton = buttons.find(button => button.dataset.activityId === 'free-activity');
    const freeDisplayed = app.getActivityCanvasLayout(free, 1);
    const freeOffset = app.activityDisplayOffset('free-activity');
    assert.ok(freeOffset.x > 0 || freeOffset.y > 0, 'the conflicting free activity moves');
    assert.equal(freeDisplayed.x % 16, 0);
    assert.equal(freeDisplayed.y % 16, 0);
    assert.deepEqual([freeButton.style.left, freeButton.style.top], [`${freeDisplayed.x}px`, `${freeDisplayed.y}px`]);
    assert.equal(groupOverlaps(groupExpanded, {
        left: freeDisplayed.x, top: freeDisplayed.y, width: freeDisplayed.width, height: freeDisplayed.height
    }), false, 'the free activity clears the expanded group');
    const overlay = overlays.find(item => item.dataset.activityId === 'free-activity');
    assert.deepEqual([overlay.style.left, overlay.style.top], [freeButton.style.left, freeButton.style.top]);
    assert.deepEqual([app.activityLayouts.get('free-activity').x, app.activityLayouts.get('free-activity').y],
        [512, 320], 'temporary displacement does not rewrite the free activity layout');
    assert.deepEqual([storageData.layout.find(layout => layout.activityId === 'free-activity').x,
        storageData.layout.find(layout => layout.activityId === 'free-activity').y], [512, 320]);

    await app.toggleGroupCollapsed('free-group');
    freeButton = buttons.find(button => button.dataset.activityId === 'free-activity');
    assert.equal(freeButton.style.left, `${freeBase.x}px`, 'collapsing restores the free activity');
    assert.equal(freeButton.style.top, `${freeBase.y}px`);
    assert.deepEqual({ ...app.activityDisplayOffset('free-activity') }, { x: 0, y: 0 });

    await app.toggleGroupCollapsed('free-group');
    const afterReloadExpectation = app.getActivityCanvasLayout(free, 1);
    app.activities = [];
    app.groups = [];
    await app.loadActivities();
    await app.loadGroups();
    app.renderMain();
    const reloadedFree = app.getActivityCanvasLayout(
        app.activities.find(activity => activity.id === 'free-activity'), 0
    );
    assert.deepEqual(
        [reloadedFree.x, reloadedFree.y, reloadedFree.width, reloadedFree.height],
        [afterReloadExpectation.x, afterReloadExpectation.y, afterReloadExpectation.width, afterReloadExpectation.height],
        'reloading an expanded group recomputes the same free-activity displacement'
    );
});

test('child geometry changes run the shared positioning pass for nested groups', async () => {
    const harness = createGroupCanvasHarness();
    const { app, buttons, handles, containers, overlays, pointer, storageData } = harness;
    app.groups = [
        { id: 'contract-parent', name: 'Parent', x: 96, y: 96, collapsed: false },
        { id: 'contract-child', name: 'Child', x: 128, y: 128, collapsed: false, parentId: 'contract-parent' }
    ];
    app.activities = [
        {
            id: 'contract-member', name: 'Member', shape: 'circle', position: 0,
            groupId: 'contract-child', customerName: 'Customer', projectName: 'Project'
        },
        { id: 'contract-free', name: 'Free', shape: 'rounded', position: 1 }
    ];
    app.activityLayouts = new Map([
        ['contract-member', { activityId: 'contract-member', x: 16, y: 16, width: 160, height: 112 }],
        ['contract-free', { activityId: 'contract-free', x: 800, y: 640, width: 160, height: 112 }]
    ]);
    storageData.groups = structuredClone(app.groups);
    storageData.activities = structuredClone(app.activities);
    storageData.layout = [...app.activityLayouts.values()].map(layout => structuredClone(layout));
    await app.toggleActivityAssignments();
    app.groupDropTargetAt = () => app.groups.find(group => group.id === 'contract-child');
    app.renderMain();
    const freeBefore = buttons.find(button => button.dataset.activityId === 'contract-free').style.cssText;
    const childBefore = groupRect(containers, 'contract-child');
    const parentBefore = groupRect(containers, 'contract-parent');

    let member = buttons.find(button => button.dataset.activityId === 'contract-member');
    pointer('pointerdown', member, 0, 0);
    pointer('pointermove', member, 64, 48);
    pointer('pointerup', member, 64, 48);

    member = buttons.find(button => button.dataset.activityId === 'contract-member');
    const memberLayout = app.getActivityCanvasLayout(
        app.activities.find(activity => activity.id === 'contract-member'), 0
    );
    assert.deepEqual([member.style.left, member.style.top, member.style.width, member.style.height],
        [`${memberLayout.x}px`, `${memberLayout.y}px`, `${memberLayout.width}px`, `${memberLayout.height}px`],
        'the nested activity uses the shared post-layout position');
    const childAfter = groupRect(containers, 'contract-child');
    const childBase = app.groupBaseBounds(app.groups.find(group => group.id === 'contract-child'));
    const childOffset = app.groupDisplayOffset('contract-child');
    assert.notDeepEqual([childAfter.left, childAfter.top], [childBefore.left, childBefore.top],
        'the child container follows the moved activity immediately');
    assert.deepEqual([childAfter.left, childAfter.top, childAfter.width, childAfter.height],
        [childBase.left + childOffset.x, childBase.top + childOffset.y, childBase.width, childBase.height]);
    const parentAfter = groupRect(containers, 'contract-parent');
    const parentBase = app.groupBaseBounds(app.groups.find(group => group.id === 'contract-parent'));
    assert.deepEqual([parentAfter.left, parentAfter.top, parentAfter.width, parentAfter.height],
        [parentBase.left, parentBase.top, parentBase.width, parentBase.height],
        'the ancestor is repositioned through the same layout pass');
    assert.notDeepEqual([parentAfter.left, parentAfter.top], [parentBefore.left, parentBefore.top],
        'the ancestor participates in the same post-layout pass');
    assert.equal(buttons.find(button => button.dataset.activityId === 'contract-free').style.cssText, freeBefore,
        'unrelated free objects are not moved');

    const overlay = overlays.find(item => item.dataset.activityId === 'contract-member');
    assert.deepEqual([overlay.style.left, overlay.style.top, overlay.style.width, overlay.style.height],
        [member.style.left, member.style.top, member.style.width, member.style.height],
        'overlay children follow the shared object position');

    const handle = handles.find(item => item.dataset.activityId === 'contract-member');
    pointer('pointerdown', handle, 0, 0);
    pointer('pointermove', handle, 32, 16);
    pointer('pointerup', handle, 32, 16);
    member = buttons.find(button => button.dataset.activityId === 'contract-member');
    const resizedLayout = app.getActivityCanvasLayout(
        app.activities.find(activity => activity.id === 'contract-member'), 0
    );
    assert.deepEqual([member.style.left, member.style.top, member.style.width, member.style.height],
        [`${resizedLayout.x}px`, `${resizedLayout.y}px`, `${resizedLayout.width}px`, `${resizedLayout.height}px`]);
    const resizedChild = groupRect(containers, 'contract-child');
    const resizedBase = app.groupBaseBounds(app.groups.find(group => group.id === 'contract-child'));
    assert.deepEqual([resizedChild.width, resizedChild.height], [resizedBase.width, resizedBase.height],
        'resizing a child activity also refreshes ancestor/container geometry');
    assert.equal(resizedLayout.width % 16, 0);
    assert.equal(resizedLayout.height % 16, 0);
    const stored = storageData.layout.find(layout => layout.activityId === 'contract-member');
    assert.deepEqual([stored.x, stored.y, stored.width, stored.height],
        [resizedLayout.x - app.groups.find(group => group.id === 'contract-child').x,
            resizedLayout.y - app.groups.find(group => group.id === 'contract-child').y,
            resizedLayout.width, resizedLayout.height], 'the shared pass persists the normalized child layout');

    app.activities = [];
    app.groups = [];
    await app.loadActivities();
    await app.loadGroups();
    app.renderMain();
    const reloadedMember = app.activities.find(activity => activity.id === 'contract-member');
    const reloadedLayout = app.getActivityCanvasLayout(reloadedMember, 0);
    assert.deepEqual([reloadedLayout.x, reloadedLayout.y, reloadedLayout.width, reloadedLayout.height],
        [resizedLayout.x, resizedLayout.y, resizedLayout.width, resizedLayout.height],
        'reload preserves the child object position and dimensions');
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
    assert.equal(buttons.find(button => button.dataset.activityId === 'drag-a').style.top, '128px');
    assert.equal(buttons.find(button => button.dataset.activityId === 'drag-b').style.left, '464px');
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
    assert.equal(app.activityLayouts.get(copyA.id).y, 16);
    assert.equal(app.activityLayouts.get(copyA.id).width, app.activityLayouts.get(copyA.id).height, 'copied circles stay equilateral');
    assert.equal(app.activityLayouts.get(copyA.id).width % 16, 0);
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
    assert.equal(mover.style.left, '208px', 'magnetism cooperates with the logical grid');
    pointer('pointerup', mover, 204, 0);
    assert.equal(app.activityLayouts.get('magnet-mover').x, 208, 'the magnetic position is persisted');
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
    assert.equal(mover.style.left, '208px', 'zoom and pan keep the same magnetic world position');
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

test('expanding and collapsing overlapping groups makes room and restores positions', async () => {
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
        { id: 'col-a', name: 'A', x: 100, y: 100, collapsed: true },
        { id: 'col-b', name: 'B', x: 180, y: 100, collapsed: true },
        { id: 'col-c', name: 'C', x: 260, y: 100, collapsed: true }
    ];
    app.renderMain();
    const ids = ['col-a', 'col-b', 'col-c'];
    const rects = () => ids.map(id => groupGeometry(containers, id));
    const assertNoOverlaps = () => {
        const current = rects();
        for (let i = 0; i < current.length; i += 1) {
            for (let j = i + 1; j < current.length; j += 1) {
                assert.equal(groupOverlaps(current[i], current[j]), false, `groups ${ids[i]} and ${ids[j]} must not overlap`);
            }
        }
    };
    const anchorsBefore = JSON.parse(JSON.stringify(app.groups.map(group => [group.id, group.x, group.y])));
    const initial = rects();
    const layouts = [];

    for (const [index, target] of ids.entries()) {
        const before = groupGeometry(containers, target);
        layouts.push(rects());
        await app.toggleGroupCollapsed(target);
        const after = groupGeometry(containers, target);
        assert.equal(after.left, before.left, `${target} keeps its displayed left edge when it expands`);
        assert.equal(after.top, before.top, `${target} keeps its displayed top edge when it expands`);
        const offsets = app.groups.map(group => app.groupDisplayOffset(group.id));
        assert.ok(offsets.every(offset => offset.x >= 0 && offset.y >= 0), 'displacements only go right/down');
        if (index < ids.length - 1) {
            assert.ok(offsets.some(offset => offset.x > 0 || offset.y > 0), 'overlapping groups move out of the way');
        }
        assertNoOverlaps();
    }
    assert.deepEqual(JSON.parse(JSON.stringify(app.groups.map(group => [group.id, group.x, group.y]))), anchorsBefore, 'saved anchors are untouched');
    for (const [id, x, y] of anchorsBefore) {
        const stored = storageData.groups.find(item => item.id === id);
        if (stored) assert.deepEqual([stored.x, stored.y], [x, y], 'only display offsets move');
    }

    for (const target of [...ids].reverse()) {
        await app.toggleGroupCollapsed(target);
        assert.deepEqual(rects(), layouts.pop(), `collapsing ${target} restores the previous layout exactly`);
    }
    assert.deepEqual(rects(), initial, 'all groups return to their saved positions');
});

test('touching groups above an expanded group keep their vertical order', async () => {
    const harness = createGroupCanvasHarness();
    const { app, containers } = harness;
    app.groups = [
        { id: 'touch-top', name: 'Top', x: 100, y: 100, collapsed: true },
        { id: 'touch-middle', name: 'Middle', x: 100, y: 146, collapsed: true },
        { id: 'touch-bottom', name: 'Bottom', x: 100, y: 192, collapsed: true }
    ];
    app.activities = app.groups.map((group, index) => ({
        id: `${group.id}-1`, name: `${group.id}-1`, position: index, groupId: group.id, size: 'medium'
    }));
    app.activityLayouts = new Map(app.activities.map(activity => [
        activity.id, { activityId: activity.id, x: 0, y: 0, width: 200, height: 120 }
    ]));
    app.renderMain();
    const ids = ['touch-top', 'touch-middle', 'touch-bottom'];
    const rects = () => ids.map(id => groupRect(containers, id));
    const initial = rects();
    const targetBefore = initial[1];
    const orderBefore = app.groups.map(group => group.id);
    const domBefore = containers.map(container => container.dataset.groupId);

    await app.toggleGroupCollapsed('touch-middle');
    const after = rects();
    assert.equal(after[1].left, targetBefore.left, 'the expanded group keeps its left edge');
    assert.equal(after[1].top, targetBefore.top, 'the expanded group keeps its top edge');
    assert.equal(after[0].top, initial[0].top, 'the touching group above stays on the same row');
    assert.ok(after[0].top < after[1].top, 'the touching group above remains above');
    assert.equal(after[2].left, initial[2].left, 'the lower neighbour does not move sideways');
    assert.equal(after[2].top, after[1].bottom + 16, 'the lower neighbour clears the expanded bounds by one grid cell');
    assert.equal(groupOverlaps(after[0], after[1]), false, 'the touching group above does not overlap');
    assert.equal(groupOverlaps(after[1], after[2]), false, 'the touching group below no longer overlaps');
    assert.equal(groupOverlaps(after[0], after[2]), false, 'the neighbours do not collide');
    assert.deepEqual(app.groups.map(group => group.id), orderBefore, 'logical order is unchanged');
    assert.deepEqual(containers.map(container => container.dataset.groupId), domBefore, 'visual DOM order is unchanged');
    assert.deepEqual(JSON.parse(JSON.stringify(app.groups.map(group => [group.x, group.y]))),
        [[100, 100], [100, 146], [100, 192]], 'saved coordinates are unchanged');

    await app.toggleGroupCollapsed('touch-middle');
    assert.deepEqual(rects(), initial, 'collapsing restores the exact pre-expansion geometry');
    for (let cycle = 0; cycle < 3; cycle += 1) {
        await app.toggleGroupCollapsed('touch-middle');
        assert.deepEqual(rects(), after, `cycle ${cycle}: re-expansion is stable`);
        await app.toggleGroupCollapsed('touch-middle');
        assert.deepEqual(rects(), initial, `cycle ${cycle}: collapse stays exact`);
    }
});

test('a slight overlap above the expanded group does not push the group below it', async () => {
    const harness = createGroupCanvasHarness();
    const { app, containers } = harness;
    app.groups = [
        { id: 'overlap-top', name: 'Top', x: 100, y: 104, collapsed: true },
        { id: 'overlap-middle', name: 'Middle', x: 100, y: 146, collapsed: true },
        { id: 'overlap-bottom', name: 'Bottom', x: 100, y: 192, collapsed: true }
    ];
    app.activities = app.groups.map((group, index) => ({
        id: `${group.id}-1`, name: `${group.id}-1`, position: index, groupId: group.id, size: 'medium'
    }));
    app.activityLayouts = new Map(app.activities.map(activity => [
        activity.id, { activityId: activity.id, x: 0, y: 0, width: 200, height: 120 }
    ]));
    app.renderMain();
    const ids = ['overlap-top', 'overlap-middle', 'overlap-bottom'];
    const rects = () => ids.map(id => groupRect(containers, id));
    const initial = rects();
    const targetBefore = initial[1];

    await app.toggleGroupCollapsed('overlap-middle');
    const after = rects();
    assert.equal(after[1].left, targetBefore.left);
    assert.equal(after[1].top, targetBefore.top);
    assert.equal(after[0].top, initial[0].top, 'the overlapping group above keeps its vertical position');
    assert.ok(after[0].left >= after[1].left + after[1].width + 16, 'the overlapping group moves right, not below');
    assert.equal(after[2].top, after[1].bottom + 16, 'the group below clears the expanded bounds by one grid cell');
    assert.equal(groupOverlaps(after[0], after[1]), false);
    assert.equal(groupOverlaps(after[1], after[2]), false);
    assert.equal(groupOverlaps(after[0], after[2]), false);
    await app.toggleGroupCollapsed('overlap-middle');
    assert.deepEqual(rects(), initial);
});

test('a tightly packed grid only moves the neighbours that the expanded area reaches', async () => {
    const harness = createGroupCanvasHarness();
    const { app, containers } = harness;
    app.groups = [
        { id: 'grid-center', name: 'Center', x: 300, y: 300, collapsed: true },
        { id: 'grid-above', name: 'Above', x: 300, y: 254, collapsed: true },
        { id: 'grid-below', name: 'Below', x: 300, y: 346, collapsed: true },
        { id: 'grid-left', name: 'Left', x: 80, y: 300, collapsed: true },
        { id: 'grid-right', name: 'Right', x: 520, y: 300, collapsed: true }
    ];
    app.activities = app.groups.map((group, index) => ({
        id: `${group.id}-1`, name: `${group.id}-1`, position: index, groupId: group.id, size: 'medium'
    }));
    app.activityLayouts = new Map(app.activities.map(activity => [
        activity.id, { activityId: activity.id, x: 0, y: 0, width: 200, height: 120 }
    ]));
    app.renderMain();
    const ids = app.groups.map(group => group.id);
    const rects = () => ids.map(id => groupRect(containers, id));
    const initial = rects();
    const orderBefore = app.groups.map(group => group.id);
    const skeleton = JSON.parse(JSON.stringify(app.groups.map(group => [group.id, group.x, group.y])));

    await app.toggleGroupCollapsed('grid-center');
    const after = rects();
    const byId = Object.fromEntries(ids.map((id, index) => [id, after[index]]));
    assert.equal(byId['grid-center'].left, initial[0].left, 'the expanded center keeps its left edge');
    assert.equal(byId['grid-center'].top, initial[0].top, 'the expanded center keeps its top edge');
    assert.deepEqual(byId['grid-above'], initial[1], 'the touching top neighbour is outside the expanded area');
    assert.deepEqual(byId['grid-left'], initial[3], 'the touching left neighbour is outside the expanded area');
    assert.equal(byId['grid-right'].left, byId['grid-center'].left + byId['grid-center'].width + 16, 'the right neighbour clears the expanded width');
    assert.equal(byId['grid-right'].top, initial[4].top, 'the right neighbour does not move vertically');
    assert.equal(byId['grid-below'].top, byId['grid-center'].top + byId['grid-center'].height + 16, 'the below neighbour clears the expanded height');
    assert.equal(byId['grid-below'].left, initial[2].left, 'the below neighbour does not move sideways');
    for (const first of ids) {
        for (const second of ids) {
            if (first >= second) continue;
            assert.equal(groupOverlaps(byId[first], byId[second]), false, `${first} and ${second} do not overlap`);
        }
    }
    assert.deepEqual(app.groups.map(group => group.id), orderBefore, 'the logical order is unchanged');
    assert.deepEqual(JSON.parse(JSON.stringify(app.groups.map(group => [group.id, group.x, group.y]))), skeleton, 'saved coordinates are unchanged');

    await app.toggleGroupCollapsed('grid-center');
    assert.deepEqual(rects(), initial, 'collapsing restores the exact packed grid');
});

test('nested touching siblings keep the parent and the upper sibling fixed', async () => {
    const harness = createGroupCanvasHarness();
    const { app, containers } = harness;
    app.groups = [
        { id: 'nested-touch-parent', name: 'Parent', x: 100, y: 100, collapsed: false },
        { id: 'nested-touch-a', name: 'A', x: 140, y: 140, collapsed: true, parentId: 'nested-touch-parent' },
        { id: 'nested-touch-b', name: 'B', x: 140, y: 186, collapsed: true, parentId: 'nested-touch-parent' },
        { id: 'nested-touch-c', name: 'C', x: 140, y: 232, collapsed: true, parentId: 'nested-touch-parent' }
    ];
    app.activities = ['a', 'b', 'c'].map((suffix, index) => ({
        id: `nested-touch-${suffix}1`,
        name: `N${suffix.toUpperCase()}`,
        position: index,
        groupId: `nested-touch-${suffix}`,
        size: 'medium'
    }));
    app.activityLayouts = new Map(app.activities.map(activity => [
        activity.id, { activityId: activity.id, x: 0, y: 0, width: 200, height: 120 }
    ]));
    app.renderMain();
    const ids = ['nested-touch-a', 'nested-touch-b', 'nested-touch-c'];
    const rects = () => ids.map(id => groupRect(containers, id));
    const initial = rects();
    const parentBefore = groupRect(containers, 'nested-touch-parent');
    const targetBefore = initial[1];

    await app.toggleGroupCollapsed('nested-touch-b');
    const after = rects();
    const parentAfter = groupRect(containers, 'nested-touch-parent');
    assert.equal(after[1].left, targetBefore.left, 'the expanded nested group keeps its left edge');
    assert.equal(after[1].top, targetBefore.top, 'the expanded nested group keeps its top edge');
    assert.deepEqual(after[0], initial[0], 'the touching upper sibling stays exactly put');
    assert.equal(after[2].top, after[1].bottom + 16, 'the lower sibling clears the expanded bounds');
    assert.ok(after[0].bottom <= after[1].top, 'the upper sibling remains above the anchor');
    assert.equal(parentAfter.left, parentBefore.left, 'the parent keeps its left edge');
    assert.equal(parentAfter.top, parentBefore.top, 'the parent keeps its top edge');
    assert.deepEqual(JSON.parse(JSON.stringify(app.groups.map(group => [group.x, group.y]))),
        [[100, 100], [140, 140], [140, 186], [140, 232]], 'nested saved coordinates are unchanged');

    await app.toggleGroupCollapsed('nested-touch-b');
    assert.deepEqual(rects(), initial, 'collapsing restores the nested chain exactly');
    assert.deepEqual(groupRect(containers, 'nested-touch-parent'), parentBefore, 'collapsing restores the parent exactly');
});

test('outer group geometry uses the 16-unit lattice in every state', async () => {
    const harness = createGroupCanvasHarness();
    const { app, containers, buttons } = harness;
    app.groups = [
        { id: 'lattice-parent', name: 'Parent with a long title', x: 208, y: 160, collapsed: false },
        { id: 'lattice-child', name: 'Nested child', x: 240, y: 192, collapsed: true, parentId: 'lattice-parent', collapsedWidth: 220, collapsedHeight: 46 },
        { id: 'lattice-sibling', name: 'Sibling', x: 208, y: 432, collapsed: true }
    ];
    app.activities = [
        { id: 'lattice-pa', name: 'Parent activity', position: 0, groupId: 'lattice-parent', size: 'medium' },
        { id: 'lattice-ch', name: 'Child activity', position: 1, groupId: 'lattice-child', size: 'medium' },
        { id: 'lattice-sa', name: 'Sibling activity', position: 2, groupId: 'lattice-sibling', size: 'medium' }
    ];
    app.activityLayouts = new Map([
        ['lattice-pa', { activityId: 'lattice-pa', x: 0, y: 0, width: 210, height: 130 }],
        ['lattice-ch', { activityId: 'lattice-ch', x: 0, y: 0, width: 130, height: 110 }],
        ['lattice-sa', { activityId: 'lattice-sa', x: 0, y: 0, width: 210, height: 130 }]
    ]);
    app.renderMain();
    const ids = app.groups.map(group => group.id);
    const assertGrid = label => {
        for (const id of ids) {
            if (!app.isGroupVisible(app.groups.find(group => group.id === id))) continue;
            const rect = groupRect(containers, id);
            for (const edge of ['left', 'top', 'right', 'bottom', 'width', 'height']) {
                assert.equal(rect[edge] % 16, 0, `${label}: ${id} ${edge} is on the grid`);
            }
            const group = app.groups.find(item => item.id === id);
            assert.equal(group.x % 16, 0);
            assert.equal(group.y % 16, 0);
            const display = app.groupDisplayBounds.get(id);
            assert.deepEqual(
                { left: rect.left, top: rect.top, width: rect.width, height: rect.height },
                { left: display.left, top: display.top, width: display.width, height: display.height },
                `${label}: collision bounds match rendered bounds for ${id}`
            );
        }
    };
    assertGrid('initial');
    const parent = app.groups.find(group => group.id === 'lattice-parent');
    const parentRect = groupRect(containers, 'lattice-parent');
    const titleWidth = app.ceilToCanvasGrid(app.groupTitleMinWidth(parent));
    assert.ok(parentRect.width >= titleWidth, 'outer width reserves the full title');
    for (const activity of app.activities.filter(item => item.groupId === 'lattice-parent')) {
        const layout = app.getActivityCanvasLayout(activity, 0);
        assert.ok(layout.x >= parentRect.left && layout.y >= parentRect.top
            && layout.x + layout.width <= parentRect.right && layout.y + layout.height <= parentRect.bottom,
        'expanded group content stays inside the rounded outer box');
    }

    await app.toggleGroupCollapsed('lattice-parent');
    assertGrid('parent collapsed');
    await app.toggleGroupCollapsed('lattice-parent');
    assertGrid('parent expanded');
    await app.toggleGroupCollapsed('lattice-child');
    assertGrid('nested child expanded');
    await app.toggleGroupCollapsed('lattice-child');
    assertGrid('nested child collapsed');
});

test('collapsed siblings are separated by one grid cell without changing saved anchors', () => {
    const harness = createGroupCanvasHarness();
    const { app, containers, storageData } = harness;
    app.groups = [
        { id: 'collide-a', name: 'A', x: 48, y: 96, collapsed: true },
        { id: 'collide-b', name: 'B', x: 256, y: 96, collapsed: true }
    ];
    app.activities = [
        { id: 'collide-a1', name: 'A', position: 0, groupId: 'collide-a', size: 'medium' },
        { id: 'collide-b1', name: 'B', position: 1, groupId: 'collide-b', size: 'medium' }
    ];
    app.activityLayouts = new Map([
        ['collide-a1', { activityId: 'collide-a1', x: 0, y: 0, width: 200, height: 120 }],
        ['collide-b1', { activityId: 'collide-b1', x: 0, y: 0, width: 200, height: 120 }]
    ]);
    storageData.groups = structuredClone(app.groups);
    app.renderMain();
    const a = groupRect(containers, 'collide-a');
    const b = groupRect(containers, 'collide-b');
    assert.equal(groupOverlaps(a, b), false, 'collapsed siblings never overlap');
    assert.equal(b.left, a.right + 16, 'collision clearance is one 16-unit grid cell');
    assert.deepEqual({ ...app.groupDisplayOffset('collide-a') }, { x: 0, y: 0 });
    const offsetB = app.groupDisplayOffset('collide-b');
    assert.ok(offsetB.x > 0 || offsetB.y > 0, 'the second collapsed sibling is displaced');
    assert.deepEqual(JSON.parse(JSON.stringify(app.groups.map(group => [group.x, group.y]))),
        [[48, 96], [256, 96]], 'temporary placement never rewrites saved anchors');
});

test('outer group bounds close edge gaps onto the 16-unit grid', () => {
    const harness = createGroupCanvasHarness();
    const { app, containers } = harness;
    const setup = groups => {
        app.groups = groups;
        app.activities = groups.map((group, index) => ({
            id: `${group.id}-1`, name: group.name, position: index, groupId: group.id, size: 'medium'
        }));
        app.activityLayouts = new Map(app.activities.map(activity => [
            activity.id, { activityId: activity.id, x: 0, y: 0, width: 200, height: 120 }
        ]));
        app.renderMain();
        return groups.map(group => groupRect(containers, group.id));
    };

    const aligned = setup([
        { id: 'edge-a', name: 'A', x: 48, y: 96, collapsed: true, collapsedWidth: 224, collapsedHeight: 48 },
        { id: 'edge-b', name: 'B', x: 272, y: 96, collapsed: true, collapsedWidth: 224, collapsedHeight: 48 }
    ]);
    assert.equal(aligned[1].left - aligned[0].right, 0, 'grid-sized neighbours can touch exactly');
    assert.equal((aligned[1].left - aligned[0].right) % 16, 0);

    const nonGrid = setup([
        { id: 'edge-c', name: 'C', x: 48, y: 96, collapsed: true },
        { id: 'edge-d', name: 'D', x: 272, y: 96, collapsed: true }
    ]);
    assert.equal(nonGrid[1].left - nonGrid[0].right, 0, 'rounded outer bounds close the former 4px natural gap');
    assert.equal((nonGrid[1].left - nonGrid[0].right) % 16, 0);
    const spaced = setup([
        { id: 'edge-e', name: 'E', x: 48, y: 96, collapsed: true },
        { id: 'edge-f', name: 'F', x: 320, y: 96, collapsed: true }
    ]);
    assert.equal(spaced[1].left - spaced[0].right, 48, 'larger gaps are whole grid cells');
});

test('collision bounds and rendered group boxes agree at fractional zoom', async () => {
    const harness = createGroupCanvasHarness();
    const { app, containers } = harness;
    app.groups = [
        { id: 'render-a', name: 'A', x: 48, y: 96, collapsed: true },
        { id: 'render-b', name: 'B', x: 256, y: 96, collapsed: true }
    ];
    app.activities = [
        { id: 'render-a1', name: 'A', position: 0, groupId: 'render-a', size: 'medium' },
        { id: 'render-b1', name: 'B', position: 1, groupId: 'render-b', size: 'medium' }
    ];
    app.activityLayouts = new Map([
        ['render-a1', { activityId: 'render-a1', x: 0, y: 0, width: 200, height: 120 }],
        ['render-b1', { activityId: 'render-b1', x: 0, y: 0, width: 200, height: 120 }]
    ]);
    app.canvasZoom = 0.75;
    app.canvasPan = { x: 32, y: -16 };
    app.renderMain();
    for (const id of ['render-a', 'render-b']) {
        const display = app.groupDisplayBounds.get(id);
        const rendered = containers.find(container => container.dataset.groupId === id).getBoundingClientRect();
        assert.equal(rendered.left, 32 + display.left * 0.75);
        assert.equal(rendered.top, -16 + display.top * 0.75);
        assert.equal(rendered.width, display.width * 0.75);
        assert.equal(rendered.height, display.height * 0.75);
    }
    const a = groupRect(containers, 'render-a');
    const b = groupRect(containers, 'render-b');
    assert.equal(b.left - a.right, 16, 'logical collision keeps one grid cell');
    const aBox = containers.find(container => container.dataset.groupId === 'render-a').getBoundingClientRect();
    const bBox = containers.find(container => container.dataset.groupId === 'render-b').getBoundingClientRect();
    assert.equal(bBox.left - aBox.right, 16 * 0.75, 'fractional zoom preserves the logical gap proportionally');
});

test('temporary child displacement never moves a parent top-left', async () => {
    const harness = createGroupCanvasHarness();
    const { app, containers } = harness;
    app.groups = [
        { id: 'stable-parent', name: 'Parent', x: 100, y: 100, collapsed: false },
        { id: 'stable-child-a', name: 'C', x: 140, y: 140, collapsed: true, parentId: 'stable-parent' },
        { id: 'stable-child-b', name: 'D', x: 140, y: 180, collapsed: true, parentId: 'stable-parent' }
    ];
    app.activities = [
        { id: 'stable-a1', name: 'C1', position: 0, groupId: 'stable-child-a', size: 'medium' },
        { id: 'stable-b1', name: 'D1', position: 1, groupId: 'stable-child-b', size: 'medium' }
    ];
    app.activityLayouts = new Map([
        ['stable-a1', { activityId: 'stable-a1', x: 0, y: 0, width: 200, height: 120 }],
        ['stable-b1', { activityId: 'stable-b1', x: 0, y: 0, width: 200, height: 120 }]
    ]);
    app.renderMain();
    const parentBefore = groupRect(containers, 'stable-parent');
    const siblingBefore = groupRect(containers, 'stable-child-a');
    const targetBefore = groupRect(containers, 'stable-child-b');
    const saved = JSON.parse(JSON.stringify(app.groups.map(group => [group.id, group.x, group.y])));

    await app.toggleGroupCollapsed('stable-child-b');
    const parentAfter = groupRect(containers, 'stable-parent');
    const siblingAfter = groupRect(containers, 'stable-child-a');
    const targetAfter = groupRect(containers, 'stable-child-b');
    assert.equal(targetAfter.left, targetBefore.left, 'the expanded child keeps its left edge');
    assert.equal(targetAfter.top, targetBefore.top, 'the expanded child keeps its top edge');
    assert.equal(parentAfter.left, parentBefore.left, 'the parent left edge never follows child displacement');
    assert.equal(parentAfter.top, parentBefore.top, 'the parent top edge never follows child displacement');
    assert.ok(parentAfter.right >= parentBefore.right, 'the parent may grow rightward');
    assert.ok(parentAfter.bottom >= parentBefore.bottom, 'the parent may grow downward');
    assert.ok(siblingAfter.left >= siblingBefore.left, 'the displaced sibling only moves right/down');
    assert.ok(siblingAfter.top >= siblingBefore.top, 'the displaced sibling only moves right/down');
    assert.equal(groupOverlaps(siblingAfter, targetAfter), false, 'the sibling clears the expanded child');
    assert.deepEqual(JSON.parse(JSON.stringify(app.groups.map(group => [group.id, group.x, group.y]))), saved);

    await app.toggleGroupCollapsed('stable-child-b');
    assert.deepEqual(groupRect(containers, 'stable-parent'), parentBefore, 'collapsing restores the parent exactly');
    assert.deepEqual(groupRect(containers, 'stable-child-a'), siblingBefore, 'collapsing restores the sibling exactly');
    for (let cycle = 0; cycle < 3; cycle += 1) {
        await app.toggleGroupCollapsed('stable-child-b');
        assert.deepEqual(groupRect(containers, 'stable-parent'), parentAfter, `cycle ${cycle}: the parent does not drift`);
        assert.equal(groupRect(containers, 'stable-child-b').top, targetBefore.top);
        await app.toggleGroupCollapsed('stable-child-b');
        assert.deepEqual(groupRect(containers, 'stable-parent'), parentBefore, `cycle ${cycle}: collapse is exact`);
    }
});

test('expanding a parent whose child is displaced keeps the parent anchor fixed', async () => {
    const harness = createGroupCanvasHarness();
    const { app, containers } = harness;
    app.groups = [
        { id: 'parent-anchor', name: 'Parent', x: 100, y: 100, collapsed: true },
        { id: 'parent-anchor-a', name: 'C', x: 140, y: 140, collapsed: true, parentId: 'parent-anchor' },
        { id: 'parent-anchor-b', name: 'D', x: 140, y: 180, collapsed: false, parentId: 'parent-anchor' }
    ];
    app.activities = [
        { id: 'parent-anchor-a1', name: 'C1', position: 0, groupId: 'parent-anchor-a', size: 'medium' },
        { id: 'parent-anchor-b1', name: 'D1', position: 1, groupId: 'parent-anchor-b', size: 'medium' }
    ];
    app.activityLayouts = new Map([
        ['parent-anchor-a1', { activityId: 'parent-anchor-a1', x: 0, y: 0, width: 200, height: 120 }],
        ['parent-anchor-b1', { activityId: 'parent-anchor-b1', x: 0, y: 0, width: 200, height: 120 }]
    ]);
    app.renderMain();
    const parentBefore = groupRect(containers, 'parent-anchor');

    await app.toggleGroupCollapsed('parent-anchor');
    const parentAfter = groupRect(containers, 'parent-anchor');
    const expandedChildAfter = groupRect(containers, 'parent-anchor-b');
    assert.equal(parentAfter.left, parentBefore.left, 'expanding the parent keeps its left edge');
    assert.equal(parentAfter.top, parentBefore.top, 'expanding the parent keeps its top edge');
    assert.ok(parentAfter.right >= parentBefore.right, 'the parent grows rightward');
    assert.ok(parentAfter.bottom >= parentBefore.bottom, 'the parent grows downward');
    assert.equal(app.groups[0].collapsed, false);

    await app.toggleGroupCollapsed('parent-anchor');
    assert.deepEqual(groupRect(containers, 'parent-anchor'), parentBefore, 'collapsing restores the parent box exactly');
    await app.toggleGroupCollapsed('parent-anchor');
    assert.deepEqual(groupRect(containers, 'parent-anchor'), parentAfter, 're-expanding is stable');
    assert.deepEqual(groupRect(containers, 'parent-anchor-b'), expandedChildAfter, 'the expanded child stays stable');
});

test('expanding a middle root group preserves its top-left and restores the stack', async () => {
    const harness = createGroupCanvasHarness();
    const { app, containers } = harness;
    const ids = ['root-mid-a', 'root-mid-b', 'root-mid-c'];
    app.groups = ids.map((id, index) => ({
        id,
        name: `Group ${index + 1}`,
        x: 100,
        y: 100 + index * 100,
        collapsed: true
    }));
    app.groups.push({ id: 'root-mid-far', name: 'Far', x: 1200, y: 1200, collapsed: true });
    app.activities = ids.map((groupId, index) => ({
        id: `${groupId}-1`, name: `${groupId}-1`, position: index, groupId, size: 'medium'
    }));
    app.activities.push(
        { id: 'root-mid-far-1', name: 'Far activity', position: 4, groupId: 'root-mid-far', size: 'medium' },
        { id: 'root-mid-free', name: 'Free', position: 5, size: 'medium' }
    );
    app.activityLayouts = new Map(app.activities.map(activity => [
        activity.id, { activityId: activity.id, x: 0, y: 0, width: 200, height: 120 }
    ]));
    app.activityLayouts.set('root-mid-free', { activityId: 'root-mid-free', x: 900, y: 600, width: 200, height: 120 });
    app.renderMain();
    const rects = () => ids.map(id => groupRect(containers, id));
    const initial = rects();
    const farBefore = groupRect(containers, 'root-mid-far');
    const freeBefore = app.activities.find(activity => activity.id === 'root-mid-free');
    const freeButtonBefore = harness.buttons.find(button => button.dataset.activityId === freeBefore.id);
    const freePosition = { left: freeButtonBefore.style.left, top: freeButtonBefore.style.top };
    const orderBefore = app.groups.map(group => group.id);
    const targetBefore = initial[1];

    await app.toggleGroupCollapsed('root-mid-b');
    const after = rects();
    assert.equal(after[1].left, targetBefore.left, 'the expanded middle group keeps its left edge');
    assert.equal(after[1].top, targetBefore.top, 'the expanded middle group keeps its top edge');
    assert.ok(after[1].right >= targetBefore.right, 'the expanded group grows rightward');
    assert.ok(after[1].bottom >= targetBefore.bottom, 'the expanded group grows downward');
    assert.deepEqual(app.groups.map(group => group.id), orderBefore, 'logical order never changes');
    for (const [index, id] of ids.entries()) {
        if (index === 1) continue;
        assert.ok(after[index].left >= initial[index].left, `${id} never moves left`);
        assert.ok(after[index].top >= initial[index].top, `${id} never moves up`);
    }
    assert.equal(groupOverlaps(after[0], after[1]), false, 'the conflicting neighbour above is displaced');
    assert.equal(groupOverlaps(after[1], after[2]), false, 'the conflicting neighbour below is displaced');
    assert.deepEqual(JSON.parse(JSON.stringify(app.groups.map(group => [group.x, group.y]))),
        [[100, 100], [100, 200], [100, 300], [1200, 1200]], 'temporary offsets are not persisted');
    assert.deepEqual(groupRect(containers, 'root-mid-far'), farBefore, 'a non-conflicting group stays stationary');
    const freeButtonAfter = harness.buttons.find(button => button.dataset.activityId === 'root-mid-free');
    assert.deepEqual({ left: freeButtonAfter.style.left, top: freeButtonAfter.style.top }, freePosition, 'unrelated activities stay stationary');

    await app.toggleGroupCollapsed('root-mid-b');
    assert.deepEqual(rects(), initial, 'collapsing restores the exact pre-expansion layout');
    assert.deepEqual(groupRect(containers, 'root-mid-far'), farBefore, 'restoration does not move the unrelated group');
});

test('expanding a middle nested group preserves its anchor, parent anchor, and group order', async () => {
    const harness = createGroupCanvasHarness();
    const { app, containers, storageData } = harness;
    const childIds = ['mid-child-a', 'mid-child-b', 'mid-child-c'];
    app.groups = [
        { id: 'mid-parent', name: 'Parent', x: 100, y: 100, collapsed: false },
        ...childIds.map((id, index) => ({
            id,
            name: `Child ${index + 1}`,
            x: 140,
            y: 140 + index * 40,
            collapsed: true,
            parentId: 'mid-parent'
        }))
    ];
    app.activities = childIds.map((groupId, index) => ({
        id: `${groupId}-1`, name: `${groupId}-1`, position: index, groupId, size: 'medium'
    }));
    app.activityLayouts = new Map(app.activities.map(activity => [
        activity.id, { activityId: activity.id, x: 0, y: 0, width: 200, height: 120 }
    ]));
    storageData.groups = structuredClone(app.groups);
    app.renderMain();
    const rects = () => childIds.map(id => groupRect(containers, id));
    const initial = rects();
    const parentBefore = groupRect(containers, 'mid-parent');
    const orderBefore = app.groups.map(group => group.id);
    const domOrderBefore = containers.map(container => container.dataset.groupId);
    const savedBefore = JSON.parse(JSON.stringify(app.groups.map(group => [group.x, group.y])));
    const targetBefore = initial[1];

    await app.toggleGroupCollapsed('mid-child-b');
    const after = rects();
    const parentAfter = groupRect(containers, 'mid-parent');
    assert.equal(after[1].left, targetBefore.left, 'the middle group keeps its left edge');
    assert.equal(after[1].top, targetBefore.top, 'the middle group keeps its top edge');
    assert.ok(after[1].right >= targetBefore.right, 'the expanded middle group grows rightward');
    assert.ok(after[1].bottom >= targetBefore.bottom, 'the expanded middle group grows downward');
    assert.equal(parentAfter.left, parentBefore.left, 'the parent keeps its left edge');
    assert.equal(parentAfter.top, parentBefore.top, 'the parent keeps its top edge');
    assert.deepEqual(app.groups.map(group => group.id), orderBefore, 'logical group order is unchanged');
    assert.deepEqual(containers.map(container => container.dataset.groupId), domOrderBefore, 'visual group order is unchanged');
    for (const [index, id] of childIds.entries()) {
        if (index === 1) continue;
        assert.ok(after[index].left >= initial[index].left, `${id} only moves right`);
        assert.ok(after[index].top >= initial[index].top, `${id} only moves down`);
    }
    for (let first = 0; first < after.length; first += 1) {
        for (let second = first + 1; second < after.length; second += 1) {
            assert.equal(groupOverlaps(after[first], after[second]), false, 'sibling containers never overlap');
        }
    }
    assert.deepEqual(JSON.parse(JSON.stringify(app.groups.map(group => [group.x, group.y]))), savedBefore, 'saved coordinates are unchanged');

    await app.toggleGroupCollapsed('mid-child-b');
    assert.deepEqual(rects(), initial, 'collapsing restores every child exactly');
    assert.deepEqual(groupRect(containers, 'mid-parent'), parentBefore, 'collapsing restores the parent exactly');
});

test('group layout follows identity order, not saved coordinates', () => {
    const harness = createGroupCanvasHarness();
    const { app } = harness;
    app.activities = [
        { id: 'identity-a1', name: 'A1', position: 0, groupId: 'identity-a', size: 'medium' },
        { id: 'identity-b1', name: 'B1', position: 1, groupId: 'identity-b', size: 'medium' }
    ];
    app.activityLayouts = new Map([
        ['identity-a1', { activityId: 'identity-a1', x: 0, y: 0, width: 200, height: 120 }],
        ['identity-b1', { activityId: 'identity-b1', x: 0, y: 0, width: 200, height: 120 }]
    ]);
    app.groups = [
        { id: 'identity-a', name: 'A', x: 100, y: 180, collapsed: false },
        { id: 'identity-b', name: 'B', x: 100, y: 100, collapsed: false }
    ];
    app.renderMain();
    assert.deepEqual({ ...app.groupDisplayOffset('identity-b') }, { x: 0, y: 0 }, 'identity order chooses the anchor');
    assert.ok(app.groupDisplayOffset('identity-a').y > 0, 'the earlier identity is displaced instead of becoming the anchor');
    app.groups = [...app.groups].reverse();
    app.renderMain();
    assert.deepEqual({ ...app.groupDisplayOffset('identity-b') }, { x: 0, y: 0 }, 'array/storage order does not change the anchor');
    assert.ok(app.groupDisplayOffset('identity-a').y > 0, 'array/storage order does not change the displacement');
    assert.equal(app.groups.every(group => group.collapsed === false), true);
});

test('expanding a group keeps it anchored while collapsed neighbours step aside', async () => {
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
        const container = containers.filter(item => item.dataset.groupId === groupId).at(-1);
        return {
            left: Number.parseFloat(container.style.left),
            top: Number.parseFloat(container.style.top),
            width: Number.parseFloat(container.style.width),
            height: Number.parseFloat(container.style.height)
        };
    };

    app.renderMain();
    const initialA = { ...app.groupDisplayOffset('manual-a') };
    const initialB = { ...app.groupDisplayOffset('manual-b') };
    assert.deepEqual(initialA, { x: 0, y: 0 }, 'the first collapsed sibling stays at its saved position');
    assert.deepEqual(overlaps(boundsOf('manual-a'), boundsOf('manual-b')), false, 'collapsed siblings do not overlap');

    await app.toggleGroupCollapsed('manual-a');
    assert.deepEqual({ ...app.groupDisplayOffset('manual-a') }, { x: 0, y: 0 }, 'the expanded group stays anchored at its position');
    assert.notDeepEqual({ ...app.groupDisplayOffset('manual-b') }, { x: 0, y: 0 }, 'the collapsed neighbour steps aside');
    assert.equal(overlaps(boundsOf('manual-a'), boundsOf('manual-b')), false, 'the expanded group is visually separated from the neighbour');
    assert.equal(app.groups[0].x, 100, 'saved x is unchanged');
    assert.equal(app.groups[0].y, 100, 'saved y is unchanged');

    await app.toggleGroupCollapsed('manual-a');
    assert.deepEqual({ ...app.groupDisplayOffset('manual-b') }, initialB, 'collapsing restores the collapsed neighbour');
    assert.deepEqual({ ...app.groupDisplayOffset('manual-a') }, initialA, 'the collapsed group returns to its saved position');
    assert.equal(boundsOf('manual-a').left, 64, 'collapsed group renders at its grid-aligned position');
    assert.equal(boundsOf('manual-a').top, 48);

    app.groups[1].x = 600;
    app.renderMain();
    await app.toggleGroupCollapsed('manual-a');
    assert.deepEqual({ ...app.groupDisplayOffset('manual-a') }, { x: 0, y: 0 }, 'the expanded group still stays anchored');
    assert.deepEqual({ ...app.groupDisplayOffset('manual-b') }, { x: 0, y: 0 }, 'no displacement when nothing overlaps');
    assert.equal(app.groups[0].x, 100, 'saved positions are still untouched');

    app.activityLayouts.set('manual-a1', { activityId: 'manual-a1', x: 0, y: 0, width: 400, height: 160 });
    app.renderMain();
    assert.equal(boundsOf('manual-a').width, app.groupBaseBounds(app.groups[0]).width, 're-rendering uses the current member dimensions');
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
    assert.equal(free.style.left, '304px', 'magnetism aligns the activity between the group members');
    assert.equal(free.style.top, '96px');
    assert.equal(container.classList.contains('group-drop-target'), true, 'the hovered group is highlighted');
    const beforeDrop = { left: free.style.left, top: free.style.top };
    pointer('pointerup', free, -500, -500);

    const activity = app.activities.find(item => item.id === 'drop-free');
    assert.equal(activity.groupId, 'drop-a', 'the dropped activity joins the group');
    assert.deepEqual(
        { ...app.activityLayouts.get('drop-free') },
        { activityId: 'drop-free', x: 204, y: 124, width: 208, height: 128 },
        'the visual position converts into the group frame'
    );
    assert.equal(app.groups[0].x, 100, 'group x is unchanged');
    assert.equal(app.groups[0].y, 100, 'group y is unchanged');
    assert.equal(container.classList.contains('group-drop-target'), false, 'the highlight clears after the drop');

    const dropped = buttons.find(button => button.dataset.activityId === 'drop-free');
    assert.equal(dropped.style.left, beforeDrop.left, 'the horizontal position stays on the grid');
    assert.equal(Number.parseFloat(dropped.style.top) % 16, 0, 'the resolved vertical position stays on the grid');
    assert.notEqual(dropped.style.top, beforeDrop.top, 'the normalized collision may move the card to a free slot');
    assert.ok(storageData.activities.some(item => item.id === 'drop-free' && item.groupId === 'drop-a'), 'membership is persisted');
    assert.ok(storageData.layout.some(item => item.activityId === 'drop-free' && item.x === 204 && item.y === 124), 'the converted layout is persisted');

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
    assert.equal(mover.style.left, '1008px', 'the activity aligns between the target group members');
    assert.equal(containers.find(item => item.dataset.groupId === 'swap-b').classList.contains('group-drop-target'), true);
    pointer('pointerup', mover, 600, 0);

    const activity = app.activities.find(item => item.id === 'swap-mover');
    assert.equal(activity.groupId, 'swap-b', 'membership changes to the target group');
    assert.deepEqual(
        { ...app.activityLayouts.get('swap-mover') },
        { activityId: 'swap-mover', x: 208, y: 124, width: 208, height: 128 },
        'coordinates convert from group A to group B'
    );
    mover = buttons.find(button => button.dataset.activityId === 'swap-mover');
    assert.equal(mover.style.left, '1008px', 'the activity does not jump between groups');
    assert.equal(mover.style.top, '224px');
    assert.equal(app.groups[0].x, 100, 'group A does not move');
    assert.equal(app.groups[1].x, 800, 'group B does not move');

    pointer('pointerdown', mover, 0, 0);
    pointer('pointermove', mover, 0, 400);
    pointer('pointerup', mover, 0, 400);
    assert.equal(activity.groupId, undefined, 'dropping outside every group removes membership');
    assert.ok(!('groupId' in activity), 'groupId is removed from the activity');
    assert.deepEqual(
        { ...app.activityLayouts.get('swap-mover') },
        { activityId: 'swap-mover', x: 1008, y: 624, width: 208, height: 128 },
        'the visual position is kept and stays on the grid'
    );
    mover = buttons.find(button => button.dataset.activityId === 'swap-mover');
    assert.equal(mover.style.left, '1008px', 'the activity does not jump when leaving a group');
    assert.equal(mover.style.top, '624px');
    assert.equal(app.groups[0].x, 100);
    assert.equal(app.groups[1].x, 800);
});

test('group drop detection uses the center, the full box, zoom, pan, and temporary offsets', async () => {
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
    free.style.left = '-200px';
    free.style.top = '-150px';
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
        { id: 'offset-a', name: 'A', x: 100, y: 100, collapsed: true },
        { id: 'offset-b', name: 'B', x: 180, y: 100, collapsed: true }
    ];
    app.canvasZoom = 1;
    app.canvasPan = { x: 0, y: 0 };
    app.renderMain();
    await app.toggleGroupCollapsed('offset-a');
    await app.toggleGroupCollapsed('offset-b');
    assert.deepEqual({ ...app.groupDisplayOffset('offset-b') }, { x: 208, y: 0 }, 'the later expansion is displaced right');
    const offsetBounds = app.groupDisplayBounds.get('offset-b');
    assert.equal(app.groupDropTargetAt(offsetBounds.left + offsetBounds.width / 2, offsetBounds.top + offsetBounds.height / 2)?.id, 'offset-b', 'temporary collision offsets are part of the drop box');
    assert.equal(app.groups[1].x, 180, 'temporary offsets are never persisted');
    assert.equal(app.groups[1].y, 100);

    let freeOffset = buttons.find(button => button.dataset.activityId === 'offset-free');
    pointer('pointerdown', freeOffset, 0, 0);
    pointer('pointermove', freeOffset, -540, -508);
    pointer('pointerup', freeOffset, -540, -508);
    const offsetActivity = app.activities.find(item => item.id === 'offset-free');
    assert.equal(offsetActivity.groupId, 'offset-b', 'an offset group can receive a dropped activity');
    const offsetStored = app.activityLayouts.get('offset-free');
    assert.ok(Number.isFinite(offsetStored.x) && Number.isFinite(offsetStored.y), 'the resolved layout is finite');
    assert.equal(offsetStored.width, 208);
    assert.equal(offsetStored.height, 128);
    const finalOffset = { ...app.groupDisplayOffset('offset-b') };
    assert.deepEqual(finalOffset, { x: 208, y: 0 }, 'the anchored group keeps its displacement when it grows');
    freeOffset = buttons.find(button => button.dataset.activityId === 'offset-free');
    assert.equal(freeOffset.style.left, `${180 + finalOffset.x + offsetStored.x}px`, 'rendering combines saved coordinates and the temporary offset');
    assert.equal(freeOffset.style.top, `${100 + finalOffset.y + offsetStored.y}px`);
    const offsetMember = buttons.find(button => button.dataset.activityId === 'offset-b1');
    const droppedBox = freeOffset.getBoundingClientRect();
    const memberBox = offsetMember.getBoundingClientRect();
    const droppedOverlapsMember = droppedBox.left < memberBox.right && memberBox.left < droppedBox.right
        && droppedBox.top < memberBox.bottom && memberBox.top < droppedBox.bottom;
    assert.equal(droppedOverlapsMember, false, 'the resolved activity does not overlap the existing member');
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
    let bounds = app.groupBaseBounds(app.groups[0]);
    assert.equal(container.style.left, `${bounds.left}px`);
    assert.equal(container.style.top, `${bounds.top}px`);
    assert.equal(container.style.width, `${bounds.width}px`);
    assert.equal(container.style.height, `${bounds.height}px`);
    assert.equal(bounds.width % 16, 0);
    assert.equal(bounds.height % 16, 0);

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
        { activityId: 'grow-free', x: -4, y: 124, width: 208, height: 128 },
        'the new activity moves to the nearest free grid slot'
    );
    assert.equal(app.groups[0].x, 100, 'group x stays at its saved value');
    assert.equal(app.groups[0].y, 100, 'group y stays at its saved value');

    container = containers.find(item => item.dataset.groupId === 'grow-a');
    bounds = app.groupBaseBounds(app.groups[0]);
    assert.equal(container.style.left, `${bounds.left}px`, 'padding stays part of the required bounds');
    assert.equal(container.style.top, `${bounds.top}px`, 'the header stays part of the required bounds');
    assert.equal(container.style.width, `${bounds.width}px`);
    assert.equal(container.style.height, `${bounds.height}px`, 'the container grows to hold both activities');
    assert.equal(bounds.width % 16, 0);
    assert.equal(bounds.height % 16, 0);
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
        storageData.layout.some(item => item.activityId === 'grow-free' && item.x === -4 && item.y === 124),
        'the resolved position is persisted'
    );
    const exported = await app.storage.exportAll();
    assert.equal(exported.activities.find(item => item.id === 'grow-free').groupId, 'grow-a', 'export keeps the membership');
    app.activities = [];
    await app.loadActivities();
    assert.equal(app.activityLayouts.get('grow-free').y, 124, 'reload keeps the resolved layout');
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
    let bounds = app.groupBaseBounds(app.groups[0]);
    assert.equal(container.style.height, `${bounds.height}px`);
    assert.equal(bounds.height % 16, 0);

    const second = buttons.find(button => button.dataset.activityId === 'shrink-a2');
    pointer('pointerdown', second, 0, 0);
    pointer('pointermove', second, 700, 272);
    pointer('pointerup', second, 700, 272);

    const activity = app.activities.find(item => item.id === 'shrink-a2');
    assert.equal(activity.groupId, undefined, 'the activity leaves the group');
    container = containers.find(item => item.dataset.groupId === 'shrink-a');
    bounds = app.groupBaseBounds(app.groups[0]);
    assert.equal(container.style.height, `${bounds.height}px`, 'the group shrinks back to its remaining content');
    assert.equal(container.style.width, `${bounds.width}px`, 'the group is not left oversized');
    assert.equal(bounds.width % 16, 0);
    assert.equal(bounds.height % 16, 0);
    const removed = buttons.find(button => button.dataset.activityId === 'shrink-a2');
    assert.equal(Number.parseFloat(removed.style.top) % 16, 0, 'the removed activity keeps a grid-aligned visual position');
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
        { activityId: 'neg-free', x: 0, y: 124, width: 208, height: 128 },
        'grid snapping and overlap resolution survive zoom and pan'
    );
    assert.equal(app.groups[0].x, -400, 'negative group x is untouched');
    assert.equal(app.groups[0].y, -300, 'negative group y is untouched');
    free = buttons.find(button => button.dataset.activityId === 'neg-free');
    assert.equal(free.style.left, '-400px');
    assert.equal(free.style.top, '-176px', 'the resolved position keeps the negative frame on the grid');
    assert.equal(containers.find(item => item.dataset.groupId === 'neg-a').style.height, `${app.groupBaseBounds(app.groups[0]).height}px`);

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
        { id: 'off-a', name: 'A', x: 100, y: 100, collapsed: true },
        { id: 'off-b', name: 'B', x: 180, y: 100, collapsed: true }
    ];
    app.canvasZoom = 1;
    app.canvasPan = { x: 0, y: 0 };
    app.renderMain();
    await app.toggleGroupCollapsed('off-a');
    await app.toggleGroupCollapsed('off-b');
    assert.deepEqual({ ...app.groupDisplayOffset('off-b') }, { x: 208, y: 0 }, 'the later expansion is displaced right');

    let freeOffset = buttons.find(button => button.dataset.activityId === 'off-free');
    pointer('pointerdown', freeOffset, 0, 0);
    pointer('pointermove', freeOffset, -540, -508);
    pointer('pointerup', freeOffset, -540, -508);
    const offsetActivity = app.activities.find(item => item.id === 'off-free');
    assert.equal(offsetActivity.groupId, 'off-b');
    const offStored = app.activityLayouts.get('off-free');
    assert.ok(Number.isFinite(offStored.x) && Number.isFinite(offStored.y));
    assert.equal(offStored.width, 208);
    assert.equal(offStored.height, 128);
    const offFinalOffset = { ...app.groupDisplayOffset('off-b') };
    assert.deepEqual(offFinalOffset, { x: 208, y: 0 }, 'the anchored group keeps its displacement when it grows');
    assert.equal(app.groups[1].x, 180, 'the temporary offset is never persisted');
    freeOffset = buttons.find(button => button.dataset.activityId === 'off-free');
    assert.equal(freeOffset.style.left, `${180 + offFinalOffset.x + offStored.x}px`, 'rendering applies the temporary offset');
    assert.equal(freeOffset.style.top, `${100 + offFinalOffset.y + offStored.y}px`);
    const offMember = buttons.find(button => button.dataset.activityId === 'off-b1');
    const offDroppedBox = freeOffset.getBoundingClientRect();
    const offMemberBox = offMember.getBoundingClientRect();
    const offOverlaps = offDroppedBox.left < offMemberBox.right && offMemberBox.left < offDroppedBox.right
        && offDroppedBox.top < offMemberBox.bottom && offMemberBox.top < offDroppedBox.bottom;
    assert.equal(offOverlaps, false, 'the resolved activity does not overlap the member');
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
        { id: 'dragc-a', name: 'A', x: 100, y: 100, collapsed: true },
        { id: 'dragc-b', name: 'B', x: 180, y: 100, collapsed: true }
    ];
    app.renderMain();
    await app.toggleGroupCollapsed('dragc-a');
    await app.toggleGroupCollapsed('dragc-b');
    assert.deepEqual({ ...app.groupDisplayOffset('dragc-b') }, { x: 208, y: 0 });

    const title = containers.find(container => container.dataset.groupId === 'dragc-b').children[0];
    pointer('pointerdown', title, 0, 0);
    pointer('pointermove', title, 32, 0);
    assert.equal(app.groups[1].x, 208, 'the saved group position follows the pointer without the temporary offset');
    assert.deepEqual({ ...app.groupDisplayOffset('dragc-b') }, { x: 208, y: 0 }, 'the temporary offset is unchanged during the drag');
    const member = buttons.find(button => button.dataset.activityId === 'dragc-b1');
    assert.equal(member.style.left, '416px', 'the rendered position combines saved coordinates and the temporary offset');
    assert.equal(member.style.top, '96px', 'the drag also snaps the saved y to the grid');
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
    await repository.flushAutomaticSnapshot();

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

function makeClockodoReferenceClient({ customers = [], services = [], projects = null, failCode = null, projectFailCode = null, projectFailStatus = 403, projectFailDetails = null } = {}) {
    const state = { customerCalls: 0, serviceCalls: 0, projectCalls: 0 };
    const client = {
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
    if (projects) {
        client.getProjects = async () => {
            state.projectCalls += 1;
            if (failCode) throw Object.assign(new Error('safe failure'), { code: failCode });
            if (projectFailCode) throw Object.assign(new Error('project failure'), { code: projectFailCode, status: projectFailStatus, details: projectFailDetails });
            return { projects };
        };
    }
    return client;
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

test('sub-five-minute overlaps are still reported as conflicts', async () => {
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
    assert.deepEqual([...app.getOverlappingEntryIds()].sort(), ['entry-a', 'entry-b']);
    app.showEntryEditModal('entry-a');
    document.getElementById('entryEditDate').value = '2026-09-28';
    document.getElementById('entryEditStart').value = '12:00';
    document.getElementById('entryEditEndDate').value = '2026-09-28';
    document.getElementById('entryEditEnd').value = '12:30';
    await app.saveTimeEntry();
    assert.equal(document.getElementById('entryConflictWarning').style.display, 'block');
    assert.deepEqual(toasts, [app.t('overlappingEntry')]);
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

test('conflict detection uses exact stored timestamps while Clockodo rounding stays display-only', async () => {
    const { app, document, storageData, toasts, t } = await createConflictApp(t => [
        { id: 'entry-a', activityId: 'act-1', activityNameSnapshot: 'A', startTimestamp: t(12, 36, 0), endTimestamp: t(12, 37, 0) },
        { id: 'entry-b', activityId: 'act-2', activityNameSnapshot: 'B', startTimestamp: t(12, 36, 30), endTimestamp: t(12, 38, 0) }
    ]);

    assert.equal(app.roundToFiveMinutes(t(12, 38, 0)), t(12, 40, 0), '12:38 rounds to 12:40');
    assert.equal(app.roundToFiveMinutes(t(12, 40, 0)), t(12, 40, 0), 'exact five-minute boundaries stay unchanged');
    assert.equal(app.roundToFiveMinutes(t(12, 37, 29)), t(12, 35, 0), 'below the midpoint rounds down');
    assert.equal(app.roundToFiveMinutes(t(12, 37, 30)), t(12, 35, 0), 'the exact midpoint rounds down');
    assert.equal(app.roundToFiveMinutes(t(12, 37, 31)), t(12, 40, 0), 'above the midpoint rounds up');
    assert.deepEqual([...app.getOverlappingEntryIds()].sort(), ['entry-a', 'entry-b'], 'the 30-second real overlap is not hidden by rounding');

    app.showEntryEditModal('entry-b');
    await app.saveTimeEntry();

    assert.equal(document.getElementById('entryConflictWarning').style.display, 'block');
    assert.deepEqual(toasts, [app.t('overlappingEntry')]);
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
    app.clockodoProjects = [
        { id: 21, name: 'Project A1', active: true, customerId: 1 },
        { id: 22, name: 'Project B1', active: true, customerId: 2 }
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
    const canShareCalls = [];
    sender.context.navigator.canShare = options => {
        canShareCalls.push(options);
        return Array.isArray(options?.files) && options.files.length === 1;
    };
    sender.context.navigator.share = async options => { shares.push(options); };

    assert.equal(await sender.app.shareExchangeFile(), true);
    assert.equal(shares.length, 1);
    assert.equal(shares[0].files.length, 1);
    assert.equal(shares[0].files[0].name, prepared.shareFileName);
    assert.equal(shares[0].files[0].type, 'text/plain');
    assert.equal(await shares[0].files[0].text(), JSON.stringify(prepared.envelope));
    assert.equal(canShareCalls.length, 1);
    assert.equal(canShareCalls[0].files[0].name, prepared.shareFileName, 'the capability check must test the share-safe file');
    assert.equal(sender.app.lastExchange, prepared);
    assert.equal(sender.backupCapture.clicks, 0, 'a supported share must not download the file');
});

test('the share-safe file uses the Web Share allow-listed extension and MIME type', async () => {
    const sender = await createExchangeSender();
    assert.equal(await sender.app.exportReviewDay(), true);
    const prepared = sender.app.lastExchange;
    assert.match(prepared.fileName, /^timerhub-exchange_\d+\.timerhub$/);
    assert.equal(prepared.file.type, 'application/octet-stream');
    assert.match(prepared.shareFileName, /^timerhub-exchange_\d+\.timerhub\.txt$/);
    assert.equal(prepared.shareFile.type, 'text/plain');
    assert.equal(await prepared.shareFile.text(), await prepared.file.text(), 'both representations carry the same encrypted snapshot');
    assert.equal(sender.app.lastExchange.exportId, prepared.exportId);
});

test('canShare() returning false skips the share attempt and falls back safely', async () => {
    const sender = await createExchangeSender();
    assert.equal(await sender.app.exportReviewDay(), true);
    const prepared = sender.app.lastExchange;
    let shareCalls = 0;
    let infoMenuOpened = 0;
    sender.app.showDayExportModal = () => { infoMenuOpened += 1; };
    sender.context.navigator.canShare = () => false;
    sender.context.navigator.share = async () => { shareCalls += 1; };
    const clicksBefore = sender.backupCapture.clicks;

    assert.equal(await sender.app.shareExchangeFile(), true);
    assert.equal(shareCalls, 0, 'a rejected capability check must not call share()');
    assert.equal(sender.backupCapture.clicks, clicksBefore + 1);
    assert.equal(sender.backupCapture.filename, prepared.fileName);
    assert.equal(sender.toasts.at(-1), sender.app.t('exchangeShareUnsupported'));
    assert.equal(infoMenuOpened, 1, 'the fallback exposes the transfer code and QR');
    assert.equal(sender.app.lastExchange, prepared);
});

test('a missing canShare() still attempts the actual share instead of declaring it unsupported', async () => {
    const sender = await createExchangeSender();
    assert.equal(await sender.app.exportReviewDay(), true);
    const prepared = sender.app.lastExchange;
    const shares = [];
    sender.context.navigator.canShare = undefined;
    sender.context.navigator.share = async options => { shares.push(options); };

    assert.equal(await sender.app.shareExchangeFile(), true);
    assert.equal(shares.length, 1, 'share() must be attempted when the browser lacks canShare');
    assert.equal(shares[0].files[0].name, prepared.shareFileName);
    assert.equal(sender.backupCapture.clicks, 0);
});

test('a genuine navigator.share rejection is caught and falls back without throwing', async () => {
    const sender = await createExchangeSender();
    assert.equal(await sender.app.exportReviewDay(), true);
    const prepared = sender.app.lastExchange;
    sender.context.navigator.canShare = () => true;
    sender.context.navigator.share = async () => {
        throw Object.assign(new Error('Permission denied'), { name: 'NotAllowedError' });
    };
    const clicksBefore = sender.backupCapture.clicks;

    assert.equal(await sender.app.shareExchangeFile(), true);
    assert.equal(sender.backupCapture.clicks, clicksBefore + 1);
    assert.equal(sender.backupCapture.filename, prepared.fileName);
    assert.equal(sender.toasts.at(-1), sender.app.t('exchangeShareUnsupported'));
    assert.equal(sender.app.lastExchange, prepared);
});

test('cancelling the share sheet does not download and does not create a new export', async () => {
    const sender = await createExchangeSender();
    assert.equal(await sender.app.exportReviewDay(), true);
    const prepared = sender.app.lastExchange;
    sender.context.navigator.canShare = () => true;
    sender.context.navigator.share = async () => {
        throw Object.assign(new Error('Share canceled'), { name: 'AbortError' });
    };
    const clicksBefore = sender.backupCapture.clicks;
    const toastsBefore = sender.toasts.length;

    assert.equal(await sender.app.shareExchangeFile(), false);
    assert.equal(sender.backupCapture.clicks, clicksBefore, 'cancelling must not trigger the download fallback');
    assert.equal(sender.toasts.length, toastsBefore, 'cancelling must not add a fallback toast');
    assert.equal(sender.app.lastExchange, prepared);
});

test('the import picker accepts the share-safe .timerhub.txt file', async () => {
    const sender = await createExchangeSender();
    assert.equal(await sender.app.exportReviewDay(), true);
    const prepared = sender.app.lastExchange;
    const receiver = createExchangeReceiver();
    const file = {
        name: prepared.shareFileName,
        size: JSON.stringify(prepared.envelope).length,
        text: async () => JSON.stringify(prepared.envelope)
    };
    assert.equal(receiver.app.handleExchangeFileSelected(file), true);
    receiver.document.getElementById('exchangeCodeInput').value = receiver.app.getExchange().formatTransferCode(prepared.secret);
    receiver.app.refreshExchangeDecryptState();
    assert.equal(await receiver.app.decryptExchangeFile(), true);
    assert.equal(receiver.app.pendingExchange.payload.entries.length, 2);
});

test('unsupported file sharing falls back to a download without creating a new export', async () => {
    const sender = await createExchangeSender();
    assert.equal(await sender.app.exportReviewDay(), true);
    const prepared = sender.app.lastExchange;
    sender.context.navigator.share = undefined;
    sender.context.navigator.canShare = undefined;
    let infoMenuOpened = 0;
    sender.app.showDayExportModal = () => { infoMenuOpened += 1; };
    const clicksBefore = sender.backupCapture.clicks;

    assert.equal(await sender.app.shareExchangeFile(), true);
    assert.equal(sender.backupCapture.clicks, clicksBefore + 1, 'unsupported sharing falls back to a download');
    assert.equal(sender.backupCapture.filename, prepared.fileName);
    assert.equal(sender.toasts.at(-1), sender.app.t('exchangeShareUnsupported'));
    assert.equal(infoMenuOpened, 1, 'the fallback exposes the transfer code and QR');
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

test('the main Share action prepares the export and invokes native sharing directly', async () => {
    const sender = await createExchangeSender();
    assert.equal(sender.app.lastExchange, null);
    const shares = [];
    sender.context.navigator.canShare = () => true;
    sender.context.navigator.share = async options => { shares.push(options); };
    let infoMenuOpened = 0;
    sender.app.showDayExportModal = () => { infoMenuOpened += 1; };

    assert.equal(await sender.app.shareDayExchange(), true);
    assert.ok(sender.app.lastExchange?.file, 'Share must prepare the export when none exists');
    assert.equal(sender.app.lastExchange.payload.date, '2026-10-05');
    assert.equal(sender.app.lastExchange.shareFile.type, 'text/plain');
    assert.equal(shares.length, 1, 'the native share sheet must be invoked on the first press');
    assert.equal(shares[0].files[0].name, sender.app.lastExchange.shareFileName);
    assert.equal(infoMenuOpened, 0, 'the intermediate export menu must not open before native sharing');
});

test('repeated Share actions reuse the same prepared export, transfer code and exportId', async () => {
    const sender = await createExchangeSender();
    const shares = [];
    sender.context.navigator.canShare = () => true;
    sender.context.navigator.share = async options => { shares.push(options); };

    assert.equal(await sender.app.shareDayExchange(), true);
    const prepared = sender.app.lastExchange;
    const qrPayload = sender.app.getExchange().buildQrPayload(prepared.secret);

    assert.equal(await sender.app.shareDayExchange(), true);
    assert.equal(await sender.app.shareDayExchange(), true);

    assert.equal(sender.app.lastExchange, prepared, 'Share must not create a new export for the same day');
    assert.equal(sender.app.lastExchange.exportId, prepared.exportId);
    assert.equal(sender.app.lastExchange.secret, prepared.secret);
    assert.equal(sender.app.getExchange().buildQrPayload(sender.app.lastExchange.secret), qrPayload);
    assert.equal(shares.length, 3);
    assert.equal(shares[0].files[0], prepared.shareFile);
    assert.equal(shares[2].files[0], prepared.shareFile);
});

test('Share prepares a separate export only when the reviewed day changes', async () => {
    const sender = await createExchangeSender();
    sender.context.navigator.canShare = () => true;
    sender.context.navigator.share = async () => {};
    await sender.app.shareDayExchange();
    const first = sender.app.lastExchange;

    await sender.app.shareDayExchange();
    assert.equal(sender.app.lastExchange, first, 'the same day keeps the prepared export');

    await sender.app.addEntry({
        id: 'exchange-c', activityId: 'act-1', activityNameSnapshot: 'Anfahrt',
        startTimestamp: new Date(2026, 9, 6, 8, 0).getTime(),
        endTimestamp: new Date(2026, 9, 6, 9, 0).getTime()
    });
    sender.app.reviewDate = '2026-10-06';
    assert.equal(await sender.app.shareDayExchange(), true);
    assert.notEqual(sender.app.lastExchange, first);
    assert.equal(sender.app.lastExchange.payload.date, '2026-10-06');
});

test('Share on a day without completed entries reports and leaves the prepared export untouched', async () => {
    const sender = await createExchangeSender();
    sender.app.reviewDate = '2026-10-07';
    assert.equal(await sender.app.shareDayExchange(), false);
    assert.equal(sender.app.lastExchange, null);
    assert.equal(sender.toasts.at(-1), sender.app.t('exchangeNoEntries'));
});

test('after decryption the dialog hides Decrypt and promotes Import', async () => {
    const sender = await createExchangeSender();
    await sender.app.exportReviewDay();
    const receiver = createExchangeReceiver();
    assert.equal(await loadExchangeIntoReceiver(receiver, JSON.stringify(sender.app.lastExchange.envelope), sender.app.lastExchange.secret), true);

    const decrypt = receiver.document.getElementById('exchangeDecryptBtn');
    const importButton = receiver.document.getElementById('exchangeImportBtn');
    assert.equal(decrypt.style.display, 'none', 'Decrypt is no longer offered after a successful decryption');
    assert.equal(decrypt.disabled, true);
    assert.equal(importButton.style.display, '', 'Import becomes the next action');
    assert.equal(importButton.textContent, receiver.app.t('importBtn'));
    assert.equal(receiver.document.getElementById('exchangePreview').style.display, '');
});

test('changing the file or transfer code restores the Decrypt action', async () => {
    const sender = await createExchangeSender();
    await sender.app.exportReviewDay();
    const receiver = createExchangeReceiver();
    await loadExchangeIntoReceiver(receiver, JSON.stringify(sender.app.lastExchange.envelope), sender.app.lastExchange.secret);
    assert.equal(receiver.document.getElementById('exchangeDecryptBtn').style.display, 'none');

    receiver.document.getElementById('exchangeCodeInput').value = '';
    receiver.app.refreshExchangeDecryptState();
    assert.equal(receiver.document.getElementById('exchangeDecryptBtn').style.display, '');
    assert.equal(receiver.document.getElementById('exchangeImportBtn').style.display, 'none');
    assert.equal(receiver.app.pendingExchange, null);
});

test('Day Review cards are fully tappable and only carry a small pencil icon', async () => {
    const sender = await createExchangeSender();
    sender.app.renderReview();
    const html = sender.document.getElementById('reviewEntriesList').innerHTML;
    assert.equal(html.includes('review-edit-entry'), false, 'the large standalone edit button is gone');
    assert.match(html, /class="review-entry-card[^"]*"[^>]*role="button"/);
    assert.match(html, /class="review-entry-card[^"]*"[^>]*tabindex="0"/);
    assert.match(html, /class="review-entry-card[^"]*"[^>]*aria-label="Edit: /);
    assert.equal((html.match(/<span class="review-edit-icon" aria-hidden="true">/g) || []).length, 2, 'one small pencil icon per card');
    assert.equal(html.includes('>Edit</button>'), false, 'no standalone edit button text remains');
});

test('locked Day Review cards stay disabled but keep the small pencil icon', async () => {
    const sender = await createExchangeSender();
    sender.app.timeEntries[0].syncStatus = 'confirmed';
    sender.app.renderReview();
    const html = sender.document.getElementById('reviewEntriesList').innerHTML;
    assert.match(html, /class="review-entry-card[^"]*review-entry-locked[^"]*"[^>]*aria-disabled="true"/);
    assert.equal(html.includes('review-edit-entry'), false);
    assert.match(html, /class="review-edit-icon"/);
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

test('activity notes are saved on the canonical activity field and survive a reload', async () => {
    const { app, document, storageData } = createTestApp();
    app.activities = [{ id: 'note-act', name: 'Weiß gemalert', color: '#ffffff', shape: 'circle', size: 'medium', position: 0, archived: false }];

    app.showActivityModal('note-act');
    assert.equal(document.getElementById('activityNotes').value, '');
    document.getElementById('activityNotes').value = 'В зале';
    await app.saveActivity();

    assert.equal(storageData.activities.find(activity => activity.id === 'note-act').notes, 'В зале');
    assert.equal(app.activities.find(activity => activity.id === 'note-act').notes, 'В зале');

    app.showActivityModal('note-act');
    assert.equal(document.getElementById('activityNotes').value, 'В зале', 'the existing Activity editor shows the same note');

    const reloaded = createTestApp({ activities: storageData.activities });
    await reloaded.app.loadActivities();
    assert.equal(reloaded.app.activities.find(activity => activity.id === 'note-act').notes, 'В зале');
    reloaded.app.showActivityModal('note-act');
    assert.equal(reloaded.document.getElementById('activityNotes').value, 'В зале');
});

test('the long-press activity menu edit flow opens the same activity note', async () => {
    const { app, document } = createTestApp();
    app.activities = [{ id: 'menu-note', name: 'Weiß gemalert', notes: 'В зале', color: '#ffffff', shape: 'circle', size: 'medium', position: 0 }];

    app.showActivityMenu('menu-note');
    app.editActivity();
    assert.equal(document.getElementById('activityName').value, 'Weiß gemalert');
    assert.equal(document.getElementById('activityNotes').value, 'В зале');
});

test('editing other activity fields preserves the existing activity note', async () => {
    const { app, document, storageData } = createTestApp();
    app.activities = [{ id: 'keep-note', name: 'Paint', notes: 'Keep me', color: '#ffffff', shape: 'circle', size: 'medium', position: 0 }];

    app.showActivityModal('keep-note');
    assert.equal(document.getElementById('activityNotes').value, 'Keep me');
    document.getElementById('activityName').value = 'Paint v2';
    await app.saveActivity();

    assert.equal(app.activities.find(activity => activity.id === 'keep-note').name, 'Paint v2');
    assert.equal(storageData.activities.find(activity => activity.id === 'keep-note').notes, 'Keep me');
});

test('a newly created activity stores its note on creation', async () => {
    const { app, document, storageData } = createTestApp();
    app.showActivityModal();
    document.getElementById('activityName').value = 'Weiß gemalert';
    document.getElementById('activityNotes').value = 'В зале';
    await app.saveActivity();

    const stored = storageData.activities.find(activity => activity.name === 'Weiß gemalert');
    assert.equal(stored.notes, 'В зале');
    assert.equal(app.activities.find(activity => activity.name === 'Weiß gemalert').notes, 'В зале');
});

test('activity buttons show a subtle note indicator only when a note exists', () => {
    const { app, document } = createTestApp();
    app.activities = [
        { id: 'noted', name: 'Weiß gemalert', notes: 'В зале', color: '#ffffff', shape: 'circle', size: 'medium', position: 0 },
        { id: 'plain', name: 'Plain', color: '#ffffff', shape: 'circle', size: 'medium', position: 1 }
    ];
    app.renderMain();
    const grid = document.getElementById('activitiesGrid');
    const noted = grid.children.find(child => child.dataset?.activityId === 'noted');
    const plain = grid.children.find(child => child.dataset?.activityId === 'plain');
    assert.ok(noted, 'the noted activity renders');
    assert.ok(plain, 'the plain activity renders');
    assert.equal(noted.children.filter(child => child.className === 'btn-note-mark').length, 1);
    assert.equal(plain.children.filter(child => child.className === 'btn-note-mark').length, 0);
});

test('idle activity buttons no longer render the activityStartHint instructional text', () => {
    const { app, document, context } = createTestApp();
    app.currentLanguage = 'ru';
    app.activities = [{ id: 'hintless', name: 'Weiß gemalert', color: '#ffffff', shape: 'circle', size: 'medium', position: 0 }];
    app.renderMain();
    const grid = document.getElementById('activitiesGrid');
    const button = grid.children.find(child => child.dataset?.activityId === 'hintless');
    assert.ok(button, 'the idle activity renders');
    assert.equal(button.children.some(child => child.className === 'btn-hint'), false, 'idle buttons no longer show a hint line');
    assert.equal(
        button.children.some(child => child.textContent === 'Нажмите, чтобы начать или переключить'),
        false,
        'the exact instructional text is not rendered'
    );
    const dictionaries = vm.runInContext('translations', context);
    assert.equal(Object.hasOwn(dictionaries.en, 'activityStartHint'), false);
    assert.equal(Object.hasOwn(dictionaries.de, 'activityStartHint'), false);
    assert.equal(Object.hasOwn(dictionaries.ru, 'activityStartHint'), false);
});

test('activity assignment labels toggle without moving canvas nodes or groups', async () => {
    const harness = createGroupCanvasHarness();
    const { app, buttons, containers, overlays, storageData, activityAssignmentsToggleBtn } = harness;
    app.groups = [{ id: 'assign-group', name: 'Assignments', x: 100, y: 100, collapsed: false }];
    app.activities = [
        {
            id: 'assign-customer', name: 'Treppenhäuser', color: '#18794e', shape: 'rounded', size: 'medium',
            position: 0, groupId: 'assign-group', customerName: 'Customer Example GmbH', projectName: 'Musterstraße 11–15'
        },
        { id: 'assign-plain', name: 'No assignment', color: '#18794e', shape: 'rounded', size: 'medium', position: 1, groupId: 'assign-group' }
    ];
    app.activityLayouts = new Map([
        ['assign-customer', { activityId: 'assign-customer', x: 0, y: 0, width: 260, height: 150 }],
        ['assign-plain', { activityId: 'assign-plain', x: 0, y: 160, width: 260, height: 150 }]
    ]);
    storageData.groups = structuredClone(app.groups);
    storageData.activities = structuredClone(app.activities);
    storageData.layout = [...app.activityLayouts.values()].map(layout => structuredClone(layout));
    app.renderMain();

    const findButton = id => buttons.find(button => button.dataset.activityId === id);
    const findOverlay = id => overlays.find(overlay => overlay.dataset.activityId === id);
    const labels = id => {
        const overlay = findOverlay(id);
        return overlay ? overlay.children.filter(child => child.classList.contains('activity-assignment-label')) : [];
    };
    assert.equal(app.showActivityAssignments, false);
    assert.equal(activityAssignmentsToggleBtn['aria-pressed'], 'false');
    assert.equal(labels('assign-customer').length, 0, 'labels are hidden by default');
    const groupBefore = groupRect(containers, 'assign-group');
    const positionBefore = {
        left: findButton('assign-customer').style.left,
        top: findButton('assign-customer').style.top
    };
    const savedBefore = JSON.parse(JSON.stringify(app.groups.map(group => [group.id, group.x, group.y])));
    const activitiesBefore = JSON.stringify(app.activities);
    const storedActivitiesBefore = JSON.stringify(storageData.activities);
    const activeActivityBefore = app.activeActivityId;

    await app.toggleActivityAssignments();
    assert.equal(app.showActivityAssignments, true);
    assert.equal(storageData.settings.showActivityAssignments, true, 'the preference is persisted');
    assert.equal(activityAssignmentsToggleBtn['aria-pressed'], 'true', 'the toggle exposes its on state');
    assert.equal(activityAssignmentsToggleBtn['aria-label'], 'Hide assignments');
    const assigned = findButton('assign-customer');
    const overlay = findOverlay('assign-customer');
    assert.ok(overlay, 'assignment labels render in a sibling overlay');
    assert.equal(assigned.children.some(child => child.classList.contains('activity-assignment-label')), false,
        'labels are outside the shape-clipped button');
    const customerLabel = overlay.children.find(child => child.classList.contains('activity-customer-label'));
    const projectLabel = overlay.children.find(child => child.classList.contains('activity-project-label'));
    assert.equal(customerLabel.textContent, 'Customer Example GmbH');
    assert.equal(projectLabel.textContent, 'Musterstraße 11–15');
    assert.deepEqual([overlay.style.left, overlay.style.top, overlay.style.width, overlay.style.height],
        [assigned.style.left, assigned.style.top, assigned.style.width, assigned.style.height]);
    assert.equal(labels('assign-plain').length, 0, 'missing assignments stay empty without placeholders');
    assert.deepEqual(groupRect(containers, 'assign-group'), groupBefore, 'the group does not move');
    assert.deepEqual({
        left: findButton('assign-customer').style.left,
        top: findButton('assign-customer').style.top
    }, positionBefore, 'the activity position does not move');
    assert.deepEqual(JSON.parse(JSON.stringify(app.groups.map(group => [group.id, group.x, group.y]))), savedBefore);

    await app.toggleActivityAssignments();
    assert.equal(app.showActivityAssignments, false);
    assert.equal(storageData.settings.showActivityAssignments, false);
    assert.equal(activityAssignmentsToggleBtn['aria-pressed'], 'false');
    assert.equal(activityAssignmentsToggleBtn['aria-label'], 'Show assignments');
    assert.equal(labels('assign-customer').length, 0, 'labels disappear immediately');
    assert.equal(findOverlay('assign-customer'), undefined);
    assert.deepEqual(groupRect(containers, 'assign-group'), groupBefore);
    assert.deepEqual(app.activityLayouts.get('assign-customer'),
        { activityId: 'assign-customer', x: 0, y: 0, width: 260, height: 150 });
    assert.equal(JSON.stringify(app.activities), activitiesBefore, 'visibility does not modify activities');
    assert.equal(JSON.stringify(storageData.activities), storedActivitiesBefore, 'visibility does not write activities');
    assert.equal(app.activeActivityId, activeActivityBefore, 'visibility does not start or stop a timer');
});

test('assignment labels preserve activity content and update after edits and lookup fallback', async () => {
    const harness = createGroupCanvasHarness();
    const { app, buttons, overlays } = harness;
    app.activities = [{
        id: 'assign-live', name: 'Treppenhäuser', notes: 'Door code 1234', icon: 'car',
        color: '#18794e', shape: 'rounded', size: 'medium', position: 0,
        customerName: 'Old Customer', projectName: 'Old Project'
    }];
    app.activityLayouts = new Map([
        ['assign-live', { activityId: 'assign-live', x: 160, y: 160, width: 320, height: 190 }]
    ]);
    app.activeActivityId = 'assign-live';
    app.timeEntries = [{
        id: 'assign-entry', activityId: 'assign-live', startTimestamp: Date.now() - 60000,
        endTimestamp: null, createdAt: Date.now() - 60000, updatedAt: Date.now(), notes: ''
    }];
    app.setCanvasSelection(['assign-live']);
    await app.toggleActivityAssignments();
    let button = buttons.find(item => item.dataset.activityId === 'assign-live');
    assert.ok(button, 'the activity still renders');
    assert.equal(button.classList.contains('active'), true, 'timer state survives the toggle');
    assert.equal(button.classList.contains('selected'), true, 'selection survives the toggle');
    assert.equal(button.children.some(child => child.className === 'btn-name' && child.textContent === 'Treppenhäuser'), true);
    assert.equal(button.children.some(child => child.classList.contains('activity-icon')), true, 'the icon stays');
    assert.equal(button.children.some(child => child.className === 'btn-note-mark'), true, 'the note marker stays');
    assert.equal(button.children.some(child => child.className === 'btn-duration'), true, 'the running timer stays');
    const readLabels = id => {
        const overlay = overlays.find(item => item.dataset.activityId === id);
        return {
            customer: overlay?.children.find(child => child.classList.contains('activity-customer-label')),
            project: overlay?.children.find(child => child.classList.contains('activity-project-label'))
        };
    };
    let labelsNow = readLabels('assign-live');
    let customerLabel = labelsNow.customer;
    let projectLabel = labelsNow.project;
    assert.equal(customerLabel.textContent, 'Old Customer');
    assert.equal(projectLabel.textContent, 'Old Project');

    const activity = app.activities[0];
    activity.customerName = 'New Customer GmbH';
    activity.projectName = 'New Project 17';
    app.renderMain();
    button = buttons.find(item => item.dataset.activityId === 'assign-live');
    labelsNow = readLabels('assign-live');
    customerLabel = labelsNow.customer;
    projectLabel = labelsNow.project;
    assert.equal(customerLabel.textContent, 'New Customer GmbH', 'customer labels refresh after assignment edits');
    assert.equal(projectLabel.textContent, 'New Project 17', 'project labels refresh after assignment edits');

    activity.customerName = '';
    activity.projectName = '';
    activity.customerId = '88';
    activity.projectId = '99';
    app.clockodoCustomers = [{ id: 88, name: 'Lookup Customer' }];
    app.clockodoProjects = [{ id: 99, name: 'Lookup Project' }];
    app.renderMain();
    button = buttons.find(item => item.dataset.activityId === 'assign-live');
    labelsNow = readLabels('assign-live');
    customerLabel = labelsNow.customer;
    projectLabel = labelsNow.project;
    assert.equal(customerLabel.textContent, 'Lookup Customer', 'customer fallback uses the Clockodo lookup data');
    assert.equal(projectLabel.textContent, 'Lookup Project', 'project fallback uses the Clockodo lookup data');
    assert.equal(activity.customerName, '', 'lookup fallback does not duplicate assignment state');

    activity.customerId = '';
    activity.projectId = '';
    app.clockodoCustomers = [];
    app.clockodoProjects = [];
    app.renderMain();
    button = buttons.find(item => item.dataset.activityId === 'assign-live');
    assert.equal(button.children.some(child => child.classList.contains('activity-assignment-label')), false, 'labels never live inside the clipped button');
    assert.equal(overlays.some(overlay => overlay.dataset.activityId === 'assign-live'), false, 'empty assignments render no overlay');
});

test('assignment labels stay outside every clipped activity shape and follow geometry', async () => {
    const harness = createGroupCanvasHarness();
    const { app, buttons, handles, overlays, pointer } = harness;
    const shapes = ['circle', 'diamond', 'triangle', 'hexagon', 'star'];
    app.activities = shapes.map((shape, index) => ({
        id: `shape-${shape}`,
        name: `Activity ${shape}`,
        shape,
        color: index % 2 ? '#ffffff' : '#000000',
        position: index,
        customerName: `Customer ${shape}`,
        projectName: `Project ${shape}`
    }));
    app.activityLayouts = new Map(app.activities.map((activity, index) => [
        activity.id,
        {
            activityId: activity.id,
            x: 160 + (index % 2) * 320,
            y: 160 + index * 160,
            width: 224,
            height: 224
        }
    ]));
    await app.toggleActivityAssignments();

    for (const activity of app.activities) {
        const button = buttons.find(item => item.dataset.activityId === activity.id);
        const overlay = overlays.find(item => item.dataset.activityId === activity.id);
        assert.ok(overlay, `${activity.shape} has a label overlay`);
        assert.equal(button.children.includes(overlay), false, `${activity.shape} labels are not inside the clipped button`);
        assert.deepEqual([overlay.style.left, overlay.style.top, overlay.style.width, overlay.style.height],
            [button.style.left, button.style.top, button.style.width, button.style.height]);
        assert.equal(overlay.children.find(child => child.classList.contains('activity-customer-label')).textContent,
            `Customer ${activity.shape}`);
        assert.equal(overlay.children.find(child => child.classList.contains('activity-project-label')).textContent,
            `Project ${activity.shape}`);
    }

    const circle = app.activities.find(activity => activity.shape === 'circle');
    let button = buttons.find(item => item.dataset.activityId === circle.id);
    pointer('pointerdown', button, 0, 0);
    pointer('pointermove', button, 32, 16);
    pointer('pointerup', button, 32, 16);
    button = buttons.find(item => item.dataset.activityId === circle.id);
    let overlay = overlays.find(item => item.dataset.activityId === circle.id);
    assert.deepEqual([overlay.style.left, overlay.style.top], [button.style.left, button.style.top],
        'labels stay anchored while dragging');

    const handle = handles.find(item => item.dataset.activityId === circle.id);
    pointer('pointerdown', handle, 0, 0);
    pointer('pointermove', handle, 16, 16);
    pointer('pointerup', handle, 16, 16);
    button = buttons.find(item => item.dataset.activityId === circle.id);
    overlay = overlays.find(item => item.dataset.activityId === circle.id);
    assert.deepEqual([overlay.style.width, overlay.style.height], [button.style.width, button.style.height],
        'labels stay anchored while resizing');
    assert.equal(Number.parseFloat(overlay.style.width) % 16, 0);
    assert.equal(Number.parseFloat(overlay.style.height) % 16, 0);

    app.canvasZoom = 0.75;
    app.canvasPan = { x: 48, y: -32 };
    app.applyCanvasTransform(harness.stage);
    const overlayBox = overlay.getBoundingClientRect();
    const buttonBox = button.getBoundingClientRect();
    assert.equal(overlayBox.left, buttonBox.left, 'labels share the activity pan/zoom transform');
    assert.equal(overlayBox.top, buttonBox.top);
    assert.equal(overlayBox.width, buttonBox.width);
    assert.equal(overlayBox.height, buttonBox.height);
});

test('assignment visibility preference persists across reloads', async () => {
    const first = createGroupCanvasHarness();
    await first.app.toggleActivityAssignments();
    assert.equal(first.storageData.settings.showActivityAssignments, true);

    const reloaded = createTestApp({ settings: structuredClone(first.storageData.settings) });
    await reloaded.app.loadSettings();
    assert.equal(reloaded.app.showActivityAssignments, true, 'the saved preference is restored');
    const fresh = createTestApp();
    await fresh.app.loadSettings();
    assert.equal(fresh.app.showActivityAssignments, false, 'the default remains off');
});

function createActivityEntryNoteApp() {
    const harness = createTestApp();
    harness.app.activities = [
        { id: 'note-act', name: 'Weiß gemalert', notes: 'В зале', color: '#ffffff', shape: 'circle', size: 'medium', position: 0 },
        { id: 'plain-act', name: 'Plain', color: '#ffffff', shape: 'circle', size: 'medium', position: 1 }
    ];
    harness.app.cancelBackgroundAlarm = async () => {};
    harness.app.scheduleBackgroundAlarm = async () => {};
    harness.app.renderLog = () => {};
    return harness;
}

test('starting an activity copies its note into the new time entry', async () => {
    const { app, storageData } = createActivityEntryNoteApp();
    await app.toggleActivity('note-act');
    const entry = app.timeEntries.find(item => item.activityId === 'note-act');
    assert.equal(entry.notes, 'В зале');
    assert.equal(entry.endTimestamp, null);
    assert.equal(storageData.timeEntries.find(item => item.id === entry.id).notes, 'В зале');
});

test('legacy activities without a notes field create an entry with an empty note', async () => {
    const { app } = createActivityEntryNoteApp();
    const legacy = app.activities.find(activity => activity.id === 'plain-act');
    assert.equal(Object.hasOwn(legacy, 'notes'), false);
    await app.toggleActivity('plain-act');
    const entry = app.timeEntries.find(item => item.activityId === 'plain-act');
    assert.equal(entry.notes, '');
});

test('switching activities snapshots each activity note and leaves the previous entry untouched', async () => {
    const { app } = createActivityEntryNoteApp();
    await app.toggleActivity('note-act');
    await app.toggleActivity('plain-act');

    const previous = app.timeEntries.find(item => item.activityId === 'note-act');
    const current = app.timeEntries.find(item => item.activityId === 'plain-act');
    assert.notEqual(previous.endTimestamp, null, 'the previous entry was stopped');
    assert.equal(previous.notes, 'В зале', 'the previous entry keeps its note');
    assert.equal(current.endTimestamp, null);
    assert.equal(current.notes, '');
});

test('changing the activity note later does not change existing entries', async () => {
    const { app, storageData } = createActivityEntryNoteApp();
    await app.toggleActivity('note-act');
    const firstEntry = app.timeEntries.find(item => item.activityId === 'note-act' && item.endTimestamp === null);
    assert.equal(firstEntry.notes, 'В зале');

    app.activities.find(activity => activity.id === 'note-act').notes = 'В коридоре';
    assert.equal(firstEntry.notes, 'В зале', 'the entry keeps its string snapshot');
    assert.equal(storageData.timeEntries.find(item => item.id === firstEntry.id).notes, 'В зале');

    await app.toggleActivity('plain-act');
    await app.toggleActivity('note-act');
    const laterEntry = app.timeEntries
        .filter(item => item.activityId === 'note-act' && item.endTimestamp === null)
        .at(-1);
    assert.equal(laterEntry.notes, 'В коридоре', 'only future entries receive the updated note');
});

test('editing an entry note in Day Review leaves the activity note untouched', async () => {
    const { app, document } = createActivityEntryNoteApp();
    await app.toggleActivity('note-act');
    await app.toggleActivity('note-act');
    const entry = app.timeEntries.find(item => item.activityId === 'note-act');
    assert.equal(entry.notes, 'В зале');

    app.showEntryEditModal(entry.id);
    document.getElementById('entryEditNotes').value = 'Edited in Day Review';
    await app.saveTimeEntry();

    assert.equal(app.timeEntries.find(item => item.id === entry.id).notes, 'Edited in Day Review');
    assert.equal(app.activities.find(activity => activity.id === 'note-act').notes, 'В зале');
});

function makeAssignmentImportApp() {
    const harness = createTestApp();
    harness.app.cancelBackgroundAlarm = async () => {};
    harness.app.scheduleBackgroundAlarm = async () => {};
    return harness;
}

const sampleAssignment = {
    format: 'timerhub-assignment',
    version: 1,
    name: 'Flower Street job',
    groups: [
        {
            name: 'Flower Street',
            activities: [{ name: 'Set up scaffold' }],
            children: [
                {
                    name: '10',
                    activities: [{ name: 'Weiß gemalert', notes: 'В зале', color: '#e74c3c', shape: 'square', size: 'large' }]
                }
            ]
        }
    ],
    activities: [{ name: 'Load truck' }]
};

async function validateSample(harness, data = sampleAssignment) {
    harness.document.getElementById('assignmentJsonInput').value = typeof data === 'string' ? data : JSON.stringify(data);
    return harness.app.validateAssignmentJson();
}

test('a valid assignment previews and imports with correct parent-child relationships', async () => {
    const harness = makeAssignmentImportApp();
    const { app, document, storageData } = harness;
    assert.equal(await validateSample(harness), true);
    assert.equal(app.pendingAssignment.plan.groupCount, 2);
    assert.equal(app.pendingAssignment.plan.activityCount, 3);
    const previewHtml = document.getElementById('assignmentPreviewList').innerHTML;
    assert.ok(previewHtml.includes('Flower Street'));
    assert.ok(previewHtml.includes('10'), 'nested house groups appear in the preview');
    assert.ok(previewHtml.includes('Weiß gemalert'));

    assert.equal(await app.confirmAssignmentImport(), true);
    assert.equal(app.groups.length, 2);
    assert.equal(app.activities.length, 3);
    assert.equal(storageData.groups.length, 2);
    assert.equal(storageData.activities.length, 3);

    const street = app.groups.find(group => group.name === 'Flower Street');
    const house = app.groups.find(group => group.name === 'Flower Street · 10');
    assert.ok(street && house);
    const scaffold = app.activities.find(activity => activity.name === 'Set up scaffold');
    const painted = app.activities.find(activity => activity.name === 'Weiß gemalert');
    const truck = app.activities.find(activity => activity.name === 'Load truck');
    assert.equal(scaffold.groupId, street.id);
    assert.equal(painted.groupId, house.id);
    assert.equal(Object.hasOwn(truck, 'groupId'), false);
    assert.equal(painted.notes, 'В зале');
    assert.equal(painted.color, '#e74c3c');
    assert.equal(painted.shape, 'square');
    assert.equal(painted.size, 'large');
    assert.equal(street.assignment, 'Flower Street job');
    assert.equal(painted.assignment, 'Flower Street job');
});

test('cancelling the assignment import leaves stored and in-memory data unchanged', async () => {
    const harness = makeAssignmentImportApp();
    const { app, storageData } = harness;
    await validateSample(harness);
    app.closeAssignmentImportModal();
    assert.equal(app.pendingAssignment, null);
    assert.equal(app.groups.length, 0);
    assert.equal(app.activities.length, 0);
    assert.equal(storageData.groups.length, 0);
    assert.equal(storageData.activities.length, 0);
});

test('a failed atomic write leaves no partial hierarchy behind', async () => {
    const harness = makeAssignmentImportApp();
    const { app, document, storageData } = harness;
    await validateSample(harness);
    app.storage.applyAssignmentImport = async () => {
        throw Object.assign(new Error('storage_write_failed'), { code: 'storage_write_failed' });
    };
    assert.equal(await app.confirmAssignmentImport(), false);
    assert.equal(app.groups.length, 0);
    assert.equal(app.activities.length, 0);
    assert.equal(storageData.groups.length, 0);
    assert.equal(storageData.activities.length, 0);
    assert.equal(document.getElementById('assignmentImportError').style.display, '');
});

test('replace mode only replaces items from the same previous assignment', async () => {
    const harness = makeAssignmentImportApp();
    const { app, storageData } = harness;
    app.groups = [
        { id: 'old-group', name: 'Flower Street', x: 0, y: 0, collapsed: false, assignment: 'Flower Street job' },
        { id: 'user-group', name: 'My own group', x: 0, y: 0, collapsed: false }
    ];
    app.activities = [
        { id: 'old-activity', name: 'Old wall paint', groupId: 'old-group', assignment: 'Flower Street job', position: 0 },
        { id: 'user-activity', name: 'My own activity', position: 1 }
    ];
    storageData.groups = structuredClone(app.groups);
    storageData.activities = structuredClone(app.activities);

    await validateSample(harness, { ...sampleAssignment, mode: 'replace' });
    assert.equal(await app.confirmAssignmentImport(), true);

    assert.equal(app.groups.some(group => group.id === 'old-group'), false);
    assert.equal(app.activities.some(activity => activity.id === 'old-activity'), false);
    assert.equal(app.groups.some(group => group.id === 'user-group'), true);
    assert.equal(app.activities.some(activity => activity.id === 'user-activity'), true);
    assert.equal(storageData.groups.some(group => group.id === 'old-group'), false);
    assert.equal(storageData.activities.some(activity => activity.id === 'old-activity'), false);
});

test('repeat imports are flagged and require the explicit Import again action', async () => {
    const harness = makeAssignmentImportApp();
    const { app, document } = harness;
    await validateSample(harness);
    assert.equal(await app.confirmAssignmentImport(), true);

    await validateSample(harness);
    assert.equal(app.pendingAssignment.repeat, true);
    assert.equal(document.getElementById('assignmentImportConfirmBtn').textContent, app.t('assignmentImportAgainBtn'));
    assert.ok(document.getElementById('assignmentPreviewWarnings').innerHTML.includes(app.t('assignmentRepeatWarning')));
    assert.equal(await app.confirmAssignmentImport(), true);
    assert.equal(app.activities.length, 6, 'an explicitly confirmed repeat import is allowed');
});

test('invalid JSON and unexpected fields show localized errors and create nothing', async () => {
    const harness = makeAssignmentImportApp();
    const { app, document } = harness;
    assert.equal(await validateSample(harness, '{broken'), false);
    assert.equal(document.getElementById('assignmentImportError').textContent, app.t('assignmentInvalidJson'));
    assert.equal(document.getElementById('assignmentImportConfirmBtn').style.display, 'none');

    const withUnexpected = { ...sampleAssignment, secret: 'do-not-store' };
    assert.equal(await validateSample(harness, withUnexpected), false);
    assert.ok(document.getElementById('assignmentImportError').textContent.includes(app.t('assignmentUnexpectedProperty')));
    assert.ok(document.getElementById('assignmentImportError').textContent.includes('secret'));
    assert.equal(app.groups.length, 0);
    assert.equal(app.activities.length, 0);
});

test('script-like names are escaped in the preview and stored as plain text', async () => {
    const harness = makeAssignmentImportApp();
    const { app, document, storageData } = harness;
    const data = {
        format: 'timerhub-assignment',
        version: 1,
        groups: [{ name: '<img src=x onerror=alert(1)>', activities: [{ name: '<script>alert(1)</script>' }] }]
    };
    assert.equal(await validateSample(harness, data), true);
    const html = document.getElementById('assignmentPreviewList').innerHTML;
    assert.equal(html.includes('<script>alert(1)</script>'), false);
    assert.ok(html.includes('&lt;script&gt;'));
    assert.equal(await app.confirmAssignmentImport(), true);
    assert.equal(storageData.activities[0].name, '<script>alert(1)</script>');
    assert.equal(storageData.groups[0].name, '<img src=x onerror=alert(1)>');
});

test('imported activities are preserved by backups and usable by the existing timer', async () => {
    const harness = makeAssignmentImportApp();
    const { app, storageData } = harness;
    await validateSample(harness);
    assert.equal(await app.confirmAssignmentImport(), true);
    const backup = await app.storage.exportAll();
    assert.ok(backup.activities.some(activity => activity.name === 'Weiß gemalert'));
    assert.ok(backup.groups.some(group => group.name === 'Flower Street · 10'));
    const painted = app.activities.find(activity => activity.name === 'Weiß gemalert');
    await app.toggleActivity(painted.id);
    assert.equal(painted.id, app.activeActivityId);
    assert.equal(app.timeEntries[0].notes, 'В зале');
});

test('imported groups anchor to their members and do not jump when collapsing', async () => {
    const harness = createGroupCanvasHarness();
    const { app, containers, storageData } = harness;
    const many = Array.from({ length: 12 }, (unused, index) => ({ name: `Work ${index}` }));
    harness.context.document.getElementById('assignmentJsonInput').value = JSON.stringify({
        format: 'timerhub-assignment', version: 1, name: 'Job', groups: [{ name: 'Imported', activities: many }]
    });
    assert.equal(await app.validateAssignmentJson(), true);
    assert.equal(await app.confirmAssignmentImport(), true);
    app.renderMain();
    const lastContainer = groupId => containers.filter(container => container.dataset.groupId === groupId).at(-1);

    const group = app.groups.find(item => item.name === 'Imported');
    const members = app.activities.filter(activity => activity.groupId === group.id);
    assert.equal(members.length, 12);
    const memberLayouts = members.map(member => app.getActivityCanvasLayout(member, 0));
    assert.equal(group.x, app.snapToCanvasGrid(Math.min(...memberLayouts.map(layout => layout.x))));
    assert.equal(group.y, app.snapToCanvasGrid(Math.min(...memberLayouts.map(layout => layout.y))));
    for (const member of members) {
        const stored = storageData.layout.find(layout => layout.activityId === member.id);
        assert.ok(stored, 'each imported member stores a layout relative to its group');
        const absolute = app.getActivityCanvasLayout(member, 0);
        assert.ok(Math.abs(stored.x - (absolute.x - group.x)) < 1e-9, 'stored x matches the absolute layout minus the anchor');
        assert.ok(Math.abs(stored.y - (absolute.y - group.y)) < 1e-9, 'stored y matches the absolute layout minus the anchor');
    }

    const expanded = lastContainer(group.id);
    const expandedLeft = Number.parseFloat(expanded.style.left);
    const expandedTop = Number.parseFloat(expanded.style.top);

    await app.toggleGroupCollapsed(group.id);
    app.renderMain();
    const collapsed = lastContainer(group.id);
    assert.ok(
        Math.abs(Number.parseFloat(collapsed.style.left) - expandedLeft) <= 16 + 20,
        'horizontal anchor jump stays within the grid snap and padding'
    );
    assert.ok(
        Math.abs(Number.parseFloat(collapsed.style.top) - expandedTop) <= 16 + 36,
        'vertical anchor jump stays within the grid snap and header'
    );

    await app.toggleGroupCollapsed(group.id);
    app.renderMain();
    const reExpanded = lastContainer(group.id);
    assert.equal(Number.parseFloat(reExpanded.style.left), expandedLeft, 're-expanding restores the same layout');
    assert.equal(Number.parseFloat(reExpanded.style.top), expandedTop);
    assert.deepEqual(JSON.parse(JSON.stringify(app.groups.map(item => [item.x, item.y]))), [[group.x, group.y]], 'the saved anchor never changes');
});

test('repeated expand and collapse cycles keep imported group offsets and anchors stable', async () => {
    const harness = createGroupCanvasHarness();
    const { app } = harness;
    const groups = [];
    for (let street = 0; street < 4; street += 1) {
        const children = [];
        for (let house = 0; house < 3; house += 1) {
            const activities = Array.from({ length: 6 }, (unused, index) => ({ name: `Work ${street}-${house}-${index}` }));
            children.push({ name: `House ${house + 1}`, activities });
        }
        groups.push({ name: `Street ${street + 1}`, children });
    }
    harness.context.document.getElementById('assignmentJsonInput').value = JSON.stringify({
        format: 'timerhub-assignment', version: 1, name: 'Big job', groups
    });
    assert.equal(await app.validateAssignmentJson(), true);
    assert.equal(await app.confirmAssignmentImport(), true);
    app.renderMain();

    const offsets = () => Object.fromEntries(app.groups.map(group => [group.id, { ...app.groupDisplayOffset(group.id) }]));
    const anchors = () => app.groups.map(group => [group.x, group.y]);
    const collapseAll = async () => {
        for (const group of [...app.groups]) if (!group.collapsed) await app.toggleGroupCollapsed(group.id);
        app.renderMain();
    };
    const expandAll = async () => {
        for (const group of [...app.groups]) if (group.collapsed) await app.toggleGroupCollapsed(group.id);
        app.renderMain();
    };

    await collapseAll();
    await expandAll();
    const stableOffsets = JSON.parse(JSON.stringify(offsets()));
    const stableAnchors = JSON.parse(JSON.stringify(anchors()));

    await collapseAll();
    await expandAll();
    await collapseAll();
    await expandAll();

    assert.deepEqual(JSON.parse(JSON.stringify(offsets())), stableOffsets, 'neighbour displacement is recalculated without drift');
    assert.deepEqual(JSON.parse(JSON.stringify(anchors())), stableAnchors, 'saved coordinates are never written by expand/collapse');
});

test('three imported activities default to small and produce a compact group', async () => {
    const harness = createGroupCanvasHarness();
    const { app, containers } = harness;
    harness.context.document.getElementById('assignmentJsonInput').value = JSON.stringify({
        format: 'timerhub-assignment',
        version: 1,
        name: 'Small job',
        groups: [{ name: 'House 10', activities: [{ name: 'A' }, { name: 'B' }, { name: 'C' }] }]
    });
    assert.equal(await app.validateAssignmentJson(), true);
    assert.equal(await app.confirmAssignmentImport(), true);
    app.renderMain();

    const members = app.activities.filter(activity => activity.groupId);
    assert.equal(members.length, 3);
    for (const member of members) assert.equal(member.size, 'small');

    const group = app.groups[0];
    const layouts = members.map(member => app.getActivityCanvasLayout(member, 0));
    const minX = Math.min(...layouts.map(layout => layout.x));
    const minY = Math.min(...layouts.map(layout => layout.y));
    const maxX = Math.max(...layouts.map(layout => layout.x + layout.width));
    const maxY = Math.max(...layouts.map(layout => layout.y + layout.height));
    const container = containers.filter(item => item.dataset.groupId === group.id).at(-1);
    const expectedLeft = app.floorToCanvasGrid(minX - 20);
    const expectedTop = app.floorToCanvasGrid(minY - 36);
    const expectedWidth = app.ceilToCanvasGrid(maxX + 20) - expectedLeft;
    const expectedHeight = app.ceilToCanvasGrid(maxY + 20) - expectedTop;
    assert.equal(Number.parseFloat(container.style.width), expectedWidth, 'width rounds up to the canvas grid');
    assert.equal(Number.parseFloat(container.style.height), expectedHeight, 'height rounds up to the canvas grid');
    assert.equal(Number.parseFloat(container.style.left), expectedLeft);
    assert.equal(Number.parseFloat(container.style.top), expectedTop);
    assert.equal(expectedWidth % 16, 0);
    assert.equal(expectedHeight % 16, 0);
    assert.ok(Number.parseFloat(container.style.width) <= 400, 'three small activities stay compact');
});

test('explicit assignment sizes are honored and existing user sizes are untouched', async () => {
    const harness = createGroupCanvasHarness();
    const { app } = harness;
    app.activities = [
        { id: 'keep-big', name: 'Existing', position: 0, size: 'large', color: '#ffffff', shape: 'circle' }
    ];
    harness.context.document.getElementById('assignmentJsonInput').value = JSON.stringify({
        format: 'timerhub-assignment',
        version: 1,
        name: 'Sizes',
        groups: [{
            name: 'Street',
            activities: [{ name: 'Default' }, { name: 'Explicit medium', size: 'medium' }, { name: 'Explicit small', size: 'small' }]
        }]
    });
    assert.equal(await app.validateAssignmentJson(), true);
    assert.equal(await app.confirmAssignmentImport(), true);

    assert.equal(app.activities.find(activity => activity.id === 'keep-big').size, 'large', 'existing user sizing is preserved');
    assert.equal(app.activities.find(activity => activity.name === 'Default').size, 'small');
    assert.equal(app.activities.find(activity => activity.name === 'Explicit medium').size, 'medium');
    assert.equal(app.activities.find(activity => activity.name === 'Explicit small').size, 'small');
});

test('nested imported groups each fit their own contents', async () => {
    const harness = createGroupCanvasHarness();
    const { app, containers } = harness;
    harness.context.document.getElementById('assignmentJsonInput').value = JSON.stringify({
        format: 'timerhub-assignment',
        version: 1,
        name: 'Nested',
        groups: [{
            name: 'Street',
            activities: [{ name: 'Set up scaffold' }],
            children: [{
                name: '10',
                activities: [{ name: 'Paint walls' }, { name: 'Paint ceiling' }]
            }]
        }]
    });
    assert.equal(await app.validateAssignmentJson(), true);
    assert.equal(await app.confirmAssignmentImport(), true);
    app.renderMain();

    for (const group of app.groups) {
        const members = app.activities.filter(activity => activity.groupId === group.id);
        assert.ok(members.length >= 1, `${group.name} has members`);
        const container = containers.filter(item => item.dataset.groupId === group.id).at(-1);
        const bounds = app.groupBaseBounds(group);
        assert.equal(Number.parseFloat(container.style.width), bounds.width, `${group.name} width fits its own members`);
        assert.equal(Number.parseFloat(container.style.height), bounds.height, `${group.name} height fits its own members`);
        assert.equal(bounds.width % 16, 0, `${group.name} width is grid-aligned`);
        assert.equal(bounds.height % 16, 0, `${group.name} height is grid-aligned`);
    }
    const street = app.groups.find(group => group.name === 'Street');
    const house = app.groups.find(group => group.name === 'Street · 10');
    assert.equal(app.activities.filter(activity => activity.groupId === street.id).length, 1);
    assert.equal(app.activities.filter(activity => activity.groupId === house.id).length, 2);
});

function groupGeometry(containers, groupId) {
    const container = containers.filter(item => item.dataset.groupId === groupId).at(-1);
    return {
        left: Number.parseFloat(container.style.left),
        top: Number.parseFloat(container.style.top),
        width: Number.parseFloat(container.style.width),
        height: Number.parseFloat(container.style.height)
    };
}

function groupOverlaps(first, second) {
    return first.left < second.left + second.width && second.left < first.left + first.width &&
        first.top < second.top + second.height && second.top < first.top + first.height;
}

function createTwoGroupAnchorHarness(anchorX = 100, anchorY = 100) {
    const harness = createGroupCanvasHarness();
    const { app } = harness;
    app.activities = [
        { id: 'anchor-a1', name: 'A1', position: 0, groupId: 'anchor-a', size: 'medium' },
        { id: 'anchor-b1', name: 'B1', position: 1, groupId: 'anchor-b', size: 'medium' }
    ];
    app.activityLayouts = new Map([
        ['anchor-a1', { activityId: 'anchor-a1', x: 0, y: 0, width: 200, height: 120 }],
        ['anchor-b1', { activityId: 'anchor-b1', x: 0, y: 0, width: 200, height: 120 }]
    ]);
    app.groups = [
        { id: 'anchor-a', name: 'A', x: anchorX, y: anchorY, collapsed: false },
        { id: 'anchor-b', name: 'B', x: anchorX, y: anchorY, collapsed: true }
    ];
    return harness;
}

test('expanding an overlapping group grows it in place and leaves the neighbour anchored', async () => {
    const harness = createTwoGroupAnchorHarness();
    const { app, containers } = harness;
    app.renderMain();

    const displayedBefore = { ...app.groupDisplayOffset('anchor-b') };
    await app.toggleGroupCollapsed('anchor-b');
    assert.deepEqual(
        { ...app.groupDisplayOffset('anchor-b') },
        displayedBefore,
        'the newly expanded group grows where it was displayed'
    );
    assert.deepEqual(
        { ...app.groupDisplayOffset('anchor-a') },
        { x: 0, y: 0 },
        'the neighbour that no longer collides stays anchored'
    );
    assert.equal(groupOverlaps(groupGeometry(containers, 'anchor-a'), groupGeometry(containers, 'anchor-b')), false);
    assert.deepEqual(JSON.parse(JSON.stringify(app.groups.map(group => [group.x, group.y]))), [[100, 100], [100, 100]], 'saved anchors are untouched');

    await app.toggleGroupCollapsed('anchor-b');
    assert.deepEqual({ ...app.groupDisplayOffset('anchor-a') }, { x: 0, y: 0 }, 'collapsing restores the neighbour');
});

test('sequential expansions grow each group where it is displayed', async () => {
    const harness = createGroupCanvasHarness();
    const { app } = harness;
    app.activities = [
        { id: 'seq-a1', name: 'A1', position: 0, groupId: 'seq-a', size: 'medium' },
        { id: 'seq-b1', name: 'B1', position: 1, groupId: 'seq-b', size: 'medium' },
        { id: 'seq-c1', name: 'C1', position: 2, groupId: 'seq-c', size: 'medium' }
    ];
    app.activityLayouts = new Map([
        ['seq-a1', { activityId: 'seq-a1', x: 0, y: 0, width: 200, height: 120 }],
        ['seq-b1', { activityId: 'seq-b1', x: 0, y: 0, width: 200, height: 120 }],
        ['seq-c1', { activityId: 'seq-c1', x: 0, y: 0, width: 200, height: 120 }]
    ]);
    app.groups = [
        { id: 'seq-a', name: 'A', x: 100, y: 100, collapsed: true },
        { id: 'seq-b', name: 'B', x: 100, y: 100, collapsed: true },
        { id: 'seq-c', name: 'C', x: 100, y: 100, collapsed: true }
    ];
    app.renderMain();

    const displayedA = { ...app.groupDisplayOffset('seq-a') };
    await app.toggleGroupCollapsed('seq-a');
    assert.deepEqual({ ...app.groupDisplayOffset('seq-a') }, displayedA, 'A grows where it was displayed');

    const displayedB = { ...app.groupDisplayOffset('seq-b') };
    await app.toggleGroupCollapsed('seq-b');
    assert.deepEqual({ ...app.groupDisplayOffset('seq-b') }, displayedB, 'B grows where it was displayed');

    const displayedC = { ...app.groupDisplayOffset('seq-c') };
    await app.toggleGroupCollapsed('seq-c');
    assert.deepEqual({ ...app.groupDisplayOffset('seq-c') }, displayedC, 'C grows where it was displayed');
    assert.deepEqual(JSON.parse(JSON.stringify(app.groups.map(group => [group.x, group.y]))), [[100, 100], [100, 100], [100, 100]]);
});

test('a chain of nested expansions stacks later siblings and unwinds exactly', async () => {
    const { harness, childIds } = makeVerticalSiblingsHarness();
    const { app, containers } = harness;
    const initial = childIds.map(id => groupRect(containers, id));
    const savedAnchors = JSON.parse(JSON.stringify(
        app.groups.filter(group => group.parentId === 'v-parent').map(group => [group.id, group.x, group.y])
    ));
    const current = () => childIds.map(id => groupRect(containers, id));
    await app.toggleGroupCollapsed('v-1');
    const afterFirst = current();
    assert.ok(afterFirst[2].top > initial[2].top, 'the first expansion pushes the next-but-one sibling down');

    const secondBefore = afterFirst[1];
    await app.toggleGroupCollapsed('v-2');
    const afterSecond = current();
    assert.equal(afterSecond[1].left, secondBefore.left, 'the expanded sibling keeps its displayed left edge');
    assert.equal(afterSecond[1].top, secondBefore.top, 'the expanded sibling keeps its displayed top edge');
    assert.ok(afterSecond[3].top >= afterFirst[3].top, 'the indirect sibling does not move back up');
    assert.deepEqual({ ...app.groupDisplayOffset('v-1') }, { x: 0, y: 0 }, 'the earlier expansion keeps its saved anchor');
    for (let first = 0; first < afterSecond.length; first += 1) {
        for (let second = first + 1; second < afterSecond.length; second += 1) {
            assert.equal(groupOverlaps(afterSecond[first], afterSecond[second]), false);
        }
    }

    await app.toggleGroupCollapsed('v-2');
    assert.deepEqual(current(), afterFirst, 'collapsing the newer expansion unwinds exactly one step');
    await app.toggleGroupCollapsed('v-1');
    assert.deepEqual(current(), initial, 'collapsing the first expansion restores the saved board');
    assert.deepEqual(JSON.parse(JSON.stringify(
        app.groups.filter(group => group.parentId === 'v-parent').map(group => [group.id, group.x, group.y])
    )), savedAnchors, 'nested saved anchors are untouched');
});

test('collapsing a middle expansion keeps the newest anchor and restores only when nothing needs it', async () => {
    const harness = createGroupCanvasHarness();
    const { app, containers } = harness;
    const ids = ['chain-a', 'chain-b', 'chain-c'];
    app.groups = [
        { id: 'chain-a', name: 'A', x: 100, y: 100, collapsed: true },
        { id: 'chain-b', name: 'B', x: 100, y: 200, collapsed: true },
        { id: 'chain-c', name: 'C', x: 100, y: 300, collapsed: true }
    ];
    app.activities = ids.map((groupId, index) => ({
        id: `${groupId}-1`, name: `${groupId}-1`, position: index, groupId, size: 'medium'
    }));
    app.activityLayouts = new Map(app.activities.map(activity => [
        activity.id, { activityId: activity.id, x: 0, y: 0, width: 200, height: 120 }
    ]));
    app.renderMain();
    const rects = () => ids.map(id => groupRect(containers, id));
    const initial = rects();

    await app.toggleGroupCollapsed('chain-a');
    const afterA = rects();
    await app.toggleGroupCollapsed('chain-b');
    await app.toggleGroupCollapsed('chain-c');
    const afterAll = rects();

    await app.toggleGroupCollapsed('chain-b');
    const afterMiddleCollapse = rects();
    assert.deepEqual(afterMiddleCollapse[0], afterAll[0], 'the first expanded group keeps its position');
    assert.deepEqual(afterMiddleCollapse[2], afterAll[2], 'the newest expanded group keeps its anchor');
    assert.equal(app.groups[1].collapsed, true, 'the middle group is collapsed');
    assert.equal(groupOverlaps(afterMiddleCollapse[0], afterMiddleCollapse[1]), false);
    assert.equal(groupOverlaps(afterMiddleCollapse[1], afterMiddleCollapse[2]), false);

    await app.toggleGroupCollapsed('chain-c');
    assert.deepEqual(rects(), afterA, 'with no newer expansion left, the layout restores the prior state exactly');
    await app.toggleGroupCollapsed('chain-a');
    assert.deepEqual(rects(), initial, 'all chips return to the saved board');
    assert.deepEqual(JSON.parse(JSON.stringify(app.groups.map(group => [group.x, group.y]))), [[100, 100], [100, 200], [100, 300]]);
});

test('expanding and collapsing every group restores the saved board', async () => {
    const harness = createGroupCanvasHarness();
    const { app, containers, storageData } = harness;
    const ids = ['bulk-a', 'bulk-b', 'bulk-c'];
    app.groups = [
        { id: 'bulk-a', name: 'A', x: 100, y: 100, collapsed: true },
        { id: 'bulk-b', name: 'B', x: 100, y: 200, collapsed: true },
        { id: 'bulk-c', name: 'C', x: 100, y: 300, collapsed: true }
    ];
    app.activities = ids.map((groupId, index) => ({
        id: `${groupId}-1`, name: `${groupId}-1`, position: index, groupId, size: 'medium'
    }));
    app.activityLayouts = new Map(app.activities.map(activity => [
        activity.id, { activityId: activity.id, x: 0, y: 0, width: 200, height: 120 }
    ]));
    storageData.groups = structuredClone(app.groups);
    app.renderMain();
    const rects = () => ids.map(id => groupRect(containers, id));
    const initial = rects();
    const saved = JSON.parse(JSON.stringify(app.groups.map(group => [group.x, group.y])));

    await app.setAllGroupsCollapsed(false);
    assert.equal(app.groups.every(group => group.collapsed === false), true, 'every group is expanded');
    const expanded = rects();
    for (let first = 0; first < expanded.length; first += 1) {
        for (let second = first + 1; second < expanded.length; second += 1) {
            assert.equal(groupOverlaps(expanded[first], expanded[second]), false);
        }
    }
    assert.deepEqual(JSON.parse(JSON.stringify(app.groups.map(group => [group.x, group.y]))), saved);

    await app.setAllGroupsCollapsed(true);
    assert.equal(app.groups.every(group => group.collapsed === true), true);
    assert.deepEqual(rects(), initial, 'collapse all restores the saved boxes exactly');
    assert.deepEqual(JSON.parse(JSON.stringify(storageData.groups.map(group => [group.id, group.x, group.y]))),
        [['bulk-a', 100, 100], ['bulk-b', 100, 200], ['bulk-c', 100, 300]], 'stored anchors survive the bulk toggle');
    assert.equal(storageData.groups.every(group => group.collapsed === true), true);
});

test('expanded groups keep their displayed position near every canvas edge', async () => {
    const anchors = [[16, 16], [16, 2000], [3200, 16], [3200, 1980]];
    for (const [x, y] of anchors) {
        const harness = createTwoGroupAnchorHarness(x, y);
        const { app } = harness;
        app.renderMain();
        const displayed = { ...app.groupDisplayOffset('anchor-b') };
        await app.toggleGroupCollapsed('anchor-b');
        assert.deepEqual(
            { ...app.groupDisplayOffset('anchor-b') },
            displayed,
            `the expanded group stays where it was displayed at ${x},${y}`
        );
        assert.deepEqual(
            JSON.parse(JSON.stringify(app.groups.map(group => [group.x, group.y]))),
            [[x, y], [x, y]],
            `saved anchors are untouched at ${x},${y}`
        );
        assert.equal(
            groupGeometry(harness.containers, 'anchor-b').left,
            app.floorToCanvasGrid(x - 20) + displayed.x,
            'the expanded container starts at the displayed anchor'
        );
        assert.equal(groupGeometry(harness.containers, 'anchor-b').top, app.floorToCanvasGrid(y - 36) + displayed.y);
        assert.equal(groupGeometry(harness.containers, 'anchor-a').left, app.floorToCanvasGrid(x - 20), 'the neighbour stays at its saved anchor');
    }
});

test('collapsing does not snap a neighbour back over user changes made while expanded', async () => {
    const harness = createTwoGroupAnchorHarness();
    const { app } = harness;
    app.renderMain();
    await app.toggleGroupCollapsed('anchor-b');
    app.groups[0].x = 700;
    app.renderMain();
    assert.equal(groupGeometry(harness.containers, 'anchor-a').left, app.floorToCanvasGrid(700 - 20), 'the moved neighbour renders at its new saved position');

    await app.toggleGroupCollapsed('anchor-b');
    assert.deepEqual({ ...app.groupDisplayOffset('anchor-a') }, { x: 0, y: 0 });
    assert.equal(groupGeometry(harness.containers, 'anchor-a').left, app.floorToCanvasGrid(700 - 20), 'the user move is preserved after collapse');
});

test('equal-anchor groups keep the expanded group anchored and restore the previous layout', async () => {
    const harness = createGroupCanvasHarness();
    const { app, containers, storageData } = harness;
    app.activities = [
        { id: 'nest-street', name: 'S1', position: 0, groupId: 'nest-s', size: 'medium' },
        { id: 'nest-house', name: 'H1', position: 1, groupId: 'nest-h', size: 'medium' }
    ];
    app.activityLayouts = new Map([
        ['nest-street', { activityId: 'nest-street', x: 0, y: 0, width: 200, height: 120 }],
        ['nest-house', { activityId: 'nest-house', x: 0, y: 0, width: 200, height: 120 }]
    ]);
    app.groups = [
        { id: 'nest-s', name: 'Street', x: 200, y: 200, collapsed: true },
        { id: 'nest-h', name: 'Street · 10', x: 200, y: 200, collapsed: true }
    ];
    app.renderMain();
    const rects = () => [groupGeometry(containers, 'nest-s'), groupGeometry(containers, 'nest-h')];
    const layouts = [rects()];
    const anchorsBefore = JSON.parse(JSON.stringify(app.groups.map(group => [group.id, group.x, group.y])));

    for (const target of ['nest-s', 'nest-h']) {
        const before = groupGeometry(containers, target);
        await app.toggleGroupCollapsed(target);
        const after = groupGeometry(containers, target);
        assert.equal(after.left, before.left, `${target} expands from its displayed top-left`);
        assert.equal(after.top, before.top);
        assert.equal(groupOverlaps(...rects()), false, 'equal-anchor groups do not overlap');
        layouts.push(rects());
    }

    await app.toggleGroupCollapsed('nest-h');
    assert.deepEqual(rects(), layouts[1], 'collapsing the newer expansion restores the previous layout');
    await app.toggleGroupCollapsed('nest-s');
    assert.deepEqual(rects(), layouts[0], 'collapsing the remaining group restores the saved layout');
    assert.deepEqual(JSON.parse(JSON.stringify(app.groups.map(group => [group.id, group.x, group.y]))), anchorsBefore);
    assert.deepEqual(JSON.parse(JSON.stringify(storageData.groups.map(group => [group.id, group.x, group.y]))), anchorsBefore);
});

function assignmentWithGroups(counts) {
    return {
        format: 'timerhub-assignment',
        version: 1,
        name: 'Layout job',
        groups: counts.map((count, index) => ({
            name: `Group ${index + 1}`,
            activities: Array.from({ length: count }, (unused, activityIndex) => ({ name: `G${index + 1}A${activityIndex}` }))
        }))
    };
}

async function importGroupsIntoCanvas(harness, counts) {
    const { app, context } = harness;
    context.document.getElementById('assignmentJsonInput').value = JSON.stringify(assignmentWithGroups(counts));
    assert.equal(await app.validateAssignmentJson(), true, 'the assignment validates');
    assert.equal(await app.confirmAssignmentImport(), true, 'the assignment imports');
    app.renderMain();
}

function makeLegacyGroupActivities(count = 12) {
    const now = Date.now();
    return Array.from({ length: count }, (unused, index) => ({
        id: `legacy-${index}`,
        name: `Legacy ${index}`,
        color: '#18794e',
        shape: 'circle',
        size: 'small',
        position: 400 + index,
        archived: false,
        createdAt: now,
        updatedAt: now,
        assignment: 'Old job',
        importedAt: now,
        groupId: 'legacy-group'
    }));
}

test('size-aware import placement keeps imported group boxes from overlapping', async () => {
    const harness = createGroupCanvasHarness();
    const { app } = harness;
    await importGroupsIntoCanvas(harness, [4, 6, 12, 20]);

    const geometries = app.groups.map(group => ({
        id: group.id,
        ...groupGeometry(harness.containers, group.id)
    }));
    for (const geometry of geometries) {
        assert.ok(Number.isFinite(geometry.left) && Number.isFinite(geometry.top), 'positions are finite');
        assert.ok(geometry.width > 0 && geometry.height > 0, 'containers have real dimensions');
        assert.ok(geometry.left >= 0 && geometry.top >= 0, 'imported groups start inside the canvas');
        assert.deepEqual({ ...app.groupDisplayOffset(geometry.id) }, { x: 0, y: 0 }, 'a packed group stays at its saved anchor');
    }
    for (let first = 0; first < geometries.length; first += 1) {
        for (let second = first + 1; second < geometries.length; second += 1) {
            assert.equal(
                groupOverlaps(geometries[first], geometries[second]),
                false,
                `imported groups ${first} and ${second} must not overlap`
            );
        }
    }
});

test('newly imported groups render at their saved anchors', async () => {
    const harness = createGroupCanvasHarness();
    const { app } = harness;
    await importGroupsIntoCanvas(harness, [6, 12]);
    for (const group of app.groups) {
        const geometry = groupGeometry(harness.containers, group.id);
        assert.deepEqual({ ...app.groupDisplayOffset(group.id) }, { x: 0, y: 0 });
        const bounds = app.groupBaseBounds(group);
        assert.equal(geometry.left, bounds.left, 'the expanded container starts at the saved anchor');
        assert.equal(geometry.top, bounds.top);
    }
});

test('expanding and collapsing an imported group keeps its displayed position', async () => {
    const harness = createGroupCanvasHarness();
    const { app, containers } = harness;
    await importGroupsIntoCanvas(harness, [12, 12, 12]);
    const group = app.groups[1];
    const expanded = groupGeometry(containers, group.id);

    await app.toggleGroupCollapsed(group.id);
    app.renderMain();
    const collapsed = groupGeometry(containers, group.id);
    assert.equal(collapsed.left, expanded.left, 'collapsing does not move the group horizontally');
    assert.equal(collapsed.top, expanded.top, 'collapsing does not move the group vertically');
    assert.deepEqual({ ...app.groupDisplayOffset(group.id) }, { x: 0, y: 0 });

    await app.toggleGroupCollapsed(group.id);
    app.renderMain();
    const reexpanded = groupGeometry(containers, group.id);
    assert.equal(reexpanded.left, expanded.left);
    assert.equal(reexpanded.top, expanded.top);
    assert.deepEqual({ ...app.groupDisplayOffset(group.id) }, { x: 0, y: 0 });
});

test('expanding one imported group does not move unrelated imported groups', async () => {
    const harness = createGroupCanvasHarness();
    const { app, containers } = harness;
    await importGroupsIntoCanvas(harness, [12, 12, 12, 12]);
    const before = new Map(app.groups.map(group => [group.id, groupGeometry(containers, group.id)]));
    const target = app.groups[2];

    await app.toggleGroupCollapsed(target.id);
    app.renderMain();
    for (const group of app.groups) {
        if (group.id === target.id) continue;
        assert.deepEqual(groupGeometry(containers, group.id), before.get(group.id), 'unrelated groups stay in place');
    }

    await app.toggleGroupCollapsed(target.id);
    app.renderMain();
    for (const group of app.groups) {
        assert.deepEqual(groupGeometry(containers, group.id), before.get(group.id), 'every group returns to its layout');
    }
});

test('collision offsets do not depend on incidental group list order', () => {
    const harness = createGroupCanvasHarness();
    const { app } = harness;
    app.activities = ['a', 'b', 'c'].map((suffix, index) => ({
        id: `order-${suffix}`,
        name: suffix.toUpperCase(),
        position: index,
        groupId: `order-group-${suffix}`,
        size: 'medium'
    }));
    app.activityLayouts = new Map(app.activities.map(activity => [
        activity.id,
        { activityId: activity.id, x: 0, y: 0, width: 200, height: 120 }
    ]));
    app.groups = ['a', 'b', 'c'].map((suffix, index) => ({
        id: `order-group-${suffix}`,
        name: suffix.toUpperCase(),
        x: 100 + index * 80,
        y: 100,
        collapsed: false
    }));
    app.renderMain();
    const offsets = new Map(app.groups.map(group => [group.id, { ...app.groupDisplayOffset(group.id) }]));

    app.groups = [...app.groups].reverse();
    app.renderMain();
    for (const group of app.groups) {
        assert.deepEqual({ ...app.groupDisplayOffset(group.id) }, offsets.get(group.id), 'offsets stay stable when the array order changes');
    }
});

test('reloading imported groups in a different storage order keeps their positions', async () => {
    const harness = createGroupCanvasHarness();
    const { app, storageData, containers } = harness;
    await importGroupsIntoCanvas(harness, [12, 12, 12, 12]);
    const before = new Map(app.groups.map(group => [group.id, groupGeometry(containers, group.id)]));

    storageData.groups = [...storageData.groups].reverse();
    await app.loadGroups();
    app.renderMain();

    assert.equal(app.groups.length, before.size, 'no groups are lost on reload');
    for (const group of app.groups) {
        assert.deepEqual(groupGeometry(containers, group.id), before.get(group.id), 'reload order does not move imported groups');
        assert.deepEqual({ ...app.groupDisplayOffset(group.id) }, { x: 0, y: 0 });
    }
});

test('legacy groups without member layouts are migrated once and keep their activities', async () => {
    const harness = createGroupCanvasHarness();
    const { app, storageData } = harness;
    app.groups = [{ id: 'legacy-group', name: 'Legacy', x: 320, y: 224, collapsed: false, assignment: 'Old job', importedAt: 1 }];
    app.activities = makeLegacyGroupActivities(12);
    app.activityLayouts = new Map();
    storageData.activities = structuredClone(app.activities);
    storageData.groups = structuredClone(app.groups);
    storageData.layout = [];
    let writes = 0;
    app.storage.saveLayout = async layout => {
        writes += 1;
        const index = storageData.layout.findIndex(item => item.activityId === layout.activityId);
        if (index >= 0) storageData.layout[index] = structuredClone(layout);
        else storageData.layout.push(structuredClone(layout));
        return layout;
    };

    assert.equal(await app.migrateMissingGroupLayouts(), 12, 'every missing member layout is derived');
    assert.equal(writes, 12);
    assert.equal(app.activities.length, 12, 'activities are preserved');
    assert.equal(app.groups.length, 1, 'groups are preserved');
    for (const activity of app.activities) {
        const layout = app.activityLayouts.get(activity.id);
        assert.ok(layout, `a layout exists for ${activity.id}`);
        for (const field of ['x', 'y', 'width', 'height']) {
            assert.ok(Number.isFinite(Number(layout[field])), `${field} is finite`);
        }
    }
    const positions = new Set(app.activities.map(activity => `${app.activityLayouts.get(activity.id).x},${app.activityLayouts.get(activity.id).y}`));
    assert.equal(positions.size, 12, 'migrated legacy members do not stack');

    assert.equal(await app.migrateMissingGroupLayouts(), 0, 'migration is idempotent');
    assert.equal(writes, 12, 'no repeated migration writes');
    assert.equal(storageData.layout.length, 12, 'no duplicate layout records');

    app.renderMain();
    const geometry = groupGeometry(harness.containers, 'legacy-group');
    const layouts = app.activities.map(activity => app.getActivityCanvasLayout(activity, 0));
    const bounds = app.groupContainerBounds(layouts);
    assert.equal(geometry.left, bounds.left, 'the migrated group renders around its saved anchor');
    assert.equal(geometry.top, bounds.top);
});

test('legacy migration keeps valid layouts and does not duplicate records', async () => {
    const harness = createGroupCanvasHarness();
    const { app, storageData } = harness;
    const activities = makeLegacyGroupActivities(6);
    const validLayout = { activityId: 'legacy-0', x: 16, y: 16, width: 220, height: 120 };
    app.groups = [{ id: 'legacy-group', name: 'Legacy', x: 320, y: 224, collapsed: false }];
    app.activities = activities;
    app.activityLayouts = new Map([[validLayout.activityId, { ...validLayout }]]);
    storageData.activities = structuredClone(activities);
    storageData.groups = structuredClone(app.groups);
    storageData.layout = [{ ...validLayout }];

    assert.equal(await app.migrateMissingGroupLayouts(), 5, 'only the missing members are migrated');
    assert.deepEqual({ ...app.activityLayouts.get('legacy-0') }, validLayout, 'a valid layout is never reset');
    assert.equal(storageData.layout.filter(item => item.activityId === 'legacy-0').length, 1, 'no duplicate record');
    const ids = storageData.layout.map(item => item.activityId);
    assert.equal(new Set(ids).size, ids.length, 'layout records stay unique');
    assert.equal(await app.migrateMissingGroupLayouts(), 0, 'the migration does not run twice');
});

test('duplicating a legacy group gives every member a distinct relative position', async () => {
    const harness = createGroupCanvasHarness();
    const { app, storageData } = harness;
    app.groups = [{ id: 'legacy-group', name: 'Legacy', x: 320, y: 224, collapsed: false }];
    app.activities = makeLegacyGroupActivities(12);
    app.activityLayouts = new Map();
    storageData.activities = structuredClone(app.activities);
    storageData.groups = structuredClone(app.groups);
    storageData.layout = [];

    const duplicate = await app.duplicateGroup('legacy-group');
    assert.ok(duplicate, 'the duplicate is created');
    const copies = app.activities.filter(activity => activity.groupId === duplicate.id);
    assert.equal(copies.length, 12, 'every member is copied');
    const positions = new Set();
    for (const copy of copies) {
        const layout = app.activityLayouts.get(copy.id);
        assert.ok(layout, 'a copy layout exists');
        assert.ok(Number.isFinite(layout.x) && Number.isFinite(layout.y));
        positions.add(`${layout.x},${layout.y}`);
        assert.ok(storageData.layout.some(item => item.activityId === copy.id), 'the copy layout is persisted');
    }
    assert.equal(positions.size, 12, 'copied members do not stack on one position');
});

test('replace-mode imports recognize a previous assignment after a reload', async () => {
    const harness = makeAssignmentImportApp();
    const { app, document } = harness;
    assert.equal(await validateSample(harness), true);
    assert.equal(await app.confirmAssignmentImport(), true);
    assert.equal(app.groups.length, 2);

    app.groups = [];
    app.activities = [];
    app.activityLayouts = new Map();
    await app.loadActivities();
    await app.loadGroups();
    assert.equal(app.groups.length, 2, 'groups reload from storage');
    for (const group of app.groups) {
        assert.equal(group.assignment, 'Flower Street job', 'assignment metadata survives loading');
        assert.ok(Number.isFinite(Number(group.importedAt)));
    }

    document.getElementById('assignmentJsonInput').value = JSON.stringify({ ...sampleAssignment, mode: 'replace' });
    assert.equal(await app.validateAssignmentJson(), true);
    assert.equal(app.pendingAssignment.replaceTargets.groups.length, 2, 'the previous import is recognized');
    assert.equal(app.pendingAssignment.replaceTargets.activities.length, 3);
    assert.equal(await app.confirmAssignmentImport(), true);
    assert.equal(app.groups.length, 2, 'replace removes the previous import before adding the new one');
});

test('repeated expand and collapse of imported groups never accumulates offsets', async () => {
    const harness = createGroupCanvasHarness();
    const { app } = harness;
    await importGroupsIntoCanvas(harness, [12, 6, 20]);
    const stored = app.groups.map(group => ({ id: group.id, x: group.x, y: group.y }));
    for (let cycle = 0; cycle < 3; cycle += 1) {
        for (const group of [...app.groups]) {
            await app.toggleGroupCollapsed(group.id);
            app.renderMain();
        }
        for (const group of [...app.groups]) {
            await app.toggleGroupCollapsed(group.id);
            app.renderMain();
        }
    }
    for (const group of app.groups) {
        const original = stored.find(item => item.id === group.id);
        assert.equal(group.x, original.x, 'saved anchor never moves');
        assert.equal(group.y, original.y);
        assert.deepEqual({ ...app.groupDisplayOffset(group.id) }, { x: 0, y: 0 }, 'no residual offset after many toggles');
    }
    assert.equal(new Set(app.groups.map(group => group.id)).size, app.groups.length, 'no duplicate groups appear');
});

test('a second import is placed beside existing groups instead of on top of them', async () => {
    const harness = createGroupCanvasHarness();
    const { app, containers } = harness;
    await importGroupsIntoCanvas(harness, [12, 12]);
    const first = new Map(app.groups.map(group => [group.id, groupGeometry(containers, group.id)]));

    const secondAssignment = {
        format: 'timerhub-assignment',
        version: 1,
        name: 'Second job',
        groups: [{ name: 'Second', activities: Array.from({ length: 12 }, (unused, index) => ({ name: `S${index}` })) }]
    };
    harness.context.document.getElementById('assignmentJsonInput').value = JSON.stringify(secondAssignment);
    assert.equal(await app.validateAssignmentJson(), true);
    assert.equal(await app.confirmAssignmentImport(), true);
    app.renderMain();

    const imported = app.groups.find(group => group.name === 'Second');
    assert.ok(imported, 'the second import exists');
    const importedGeometry = groupGeometry(containers, imported.id);
    for (const geometry of first.values()) {
        assert.equal(groupOverlaps(importedGeometry, geometry), false, 'the new import avoids existing groups');
    }
    assert.deepEqual({ ...app.groupDisplayOffset(imported.id) }, { x: 0, y: 0 });
    for (const [id, geometry] of first) {
        assert.deepEqual(groupGeometry(containers, id), geometry, 'existing groups keep their positions');
    }
});

test('manually created groups remain draggable and expandable', async () => {
    const harness = createGroupCanvasHarness();
    const { app, containers, pointer } = harness;
    app.activities = [
        { id: 'manual-new-1', name: 'M1', position: 0, size: 'small' },
        { id: 'manual-new-2', name: 'M2', position: 1, size: 'small' },
        { id: 'manual-new-3', name: 'M3', position: 2, size: 'small' }
    ];
    app.activityLayouts = new Map([
        ['manual-new-1', { activityId: 'manual-new-1', x: 400, y: 300, width: 220, height: 120 }],
        ['manual-new-2', { activityId: 'manual-new-2', x: 700, y: 300, width: 220, height: 120 }],
        ['manual-new-3', { activityId: 'manual-new-3', x: 400, y: 500, width: 220, height: 120 }]
    ]);
    app.setCanvasSelection(['manual-new-1', 'manual-new-2', 'manual-new-3']);
    const group = await app.createGroupFromSelection('Crew');
    assert.ok(group, 'the manual group is created');
    app.renderMain();
    assert.deepEqual({ ...app.groupDisplayOffset(group.id) }, { x: 0, y: 0 });

    const before = groupGeometry(containers, group.id);
    const title = containers.filter(item => item.dataset.groupId === group.id).at(-1).children[0];
    pointer('pointerdown', title, 100, 100);
    pointer('pointermove', title, 148, 116);
    pointer('pointerup', title, 148, 116);
    assert.equal(group.x, 448, 'the manual group follows the pointer on the shared grid');
    assert.equal(group.y, 320);
    const moved = groupGeometry(containers, group.id);
    assert.equal(moved.left, before.left + 48, 'members follow the dragged group');
    assert.equal(moved.top, before.top + 16);

    await app.toggleGroupCollapsed(group.id);
    app.renderMain();
    assert.equal(groupGeometry(containers, group.id).left, app.groupCollapsedBounds(group).left, 'the collapsed group sits at its anchor');
    assert.deepEqual({ ...app.groupDisplayOffset(group.id) }, { x: 0, y: 0 });
    await app.toggleGroupCollapsed(group.id);
    app.renderMain();
    const expanded = groupGeometry(containers, group.id);
    assert.equal(expanded.left, moved.left, 'the group re-expands where it was dragged to');
    assert.equal(expanded.top, moved.top);
    assert.deepEqual({ ...app.groupDisplayOffset(group.id) }, { x: 0, y: 0 });
});

test('collapsed group dimensions resize through the handle, clamp, persist and reload', async () => {
    const harness = createGroupCanvasHarness();
    const { app, containers, pointer, storageData } = harness;
    app.activities = [
        { id: 'rz-a', name: 'A', position: 0, groupId: 'rz-g', size: 'small' },
        { id: 'rz-b', name: 'B', position: 1, groupId: 'rz-g', size: 'small' }
    ];
    app.activityLayouts = new Map([
        ['rz-a', { activityId: 'rz-a', x: 0, y: 0, width: 220, height: 120 }],
        ['rz-b', { activityId: 'rz-b', x: 400, y: 0, width: 220, height: 120 }]
    ]);
    app.groups = [{ id: 'rz-g', name: 'Resize', x: 200, y: 160, collapsed: true }];
    app.renderMain();
    const group = app.groups[0];
    assert.equal(app.groupCollapsedWidth(group), 224, 'legacy groups use the grid-rounded default width');
    assert.equal(app.groupCollapsedHeight(group), 48, 'legacy groups use the grid-rounded default height');

    const container = containers.filter(item => item.dataset.groupId === 'rz-g').at(-1);
    const handle = container.children.find(child => child.classList.contains('group-resize-handle'));
    assert.ok(handle, 'collapsed groups expose a resize handle');
    assert.equal(group.collapsed, true);
    pointer('pointerdown', handle, 300, 300);
    assert.equal(app.canvasGesture.mode, 'group-resize', 'the handle starts a resize, not a drag');
    pointer('pointermove', handle, 472, 382);
    pointer('pointerup', handle, 472, 382);
    assert.equal(group.collapsed, true, 'resizing never expands the group');
    assert.equal(app.groupCollapsedWidth(group), 400);
    assert.equal(app.groupCollapsedHeight(group), 128);
    assert.equal(app.groupCollapsedWidth(group) % 16, 0, 'resized width stays on the grid');
    assert.equal(app.groupCollapsedHeight(group) % 16, 0, 'resized height stays on the grid');
    assert.equal(storageData.groups[0].collapsedWidth, 400, 'the resized width is persisted');
    assert.equal(storageData.groups[0].collapsedHeight, 128, 'the resized height is persisted');
    assert.deepEqual(
        { ...app.activityLayouts.get('rz-a') },
        { activityId: 'rz-a', x: 0, y: 0, width: 220, height: 120 },
        'member layouts are untouched by the resize'
    );
    assert.deepEqual(
        { ...app.activityLayouts.get('rz-b') },
        { activityId: 'rz-b', x: 400, y: 0, width: 220, height: 120 }
    );

    const titleAwareMinWidth = app.ceilToCanvasGrid(app.groupTitleMinWidth(group));
    assert.ok(titleAwareMinWidth > 160, 'the collapsed minimum reserves room for the title');
    app.resizeCollapsedGroup(group, -100, -100);
    assert.equal(app.groupCollapsedWidth(group), titleAwareMinWidth, 'width clamps to the title-aware minimum');
    assert.equal(app.groupCollapsedHeight(group), 48, 'height clamps to the minimum grid-aligned value');
    app.resizeCollapsedGroup(group, 5000, 5000);
    assert.equal(app.groupCollapsedWidth(group), 640, 'width clamps to the maximum');
    assert.equal(app.groupCollapsedHeight(group), 400, 'height clamps to the maximum');
    assert.equal(app.groupCollapsedWidth(group) % 16, 0);
    assert.equal(app.groupCollapsedHeight(group) % 16, 0);
    await app.storage.saveGroup(group);

    await app.loadGroups();
    const reloaded = app.groups.find(item => item.id === 'rz-g');
    assert.equal(reloaded.collapsedWidth, 640, 'resized dimensions survive a reload');
    assert.equal(reloaded.collapsedHeight, 400);
    assert.equal(reloaded.collapsed, true);
});

test('resizing a collapsed group recomputes offsets without moving other groups', async () => {
    const harness = createGroupCanvasHarness();
    const { app, storageData } = harness;
    app.activities = [
        { id: 'ro-a1', name: 'A1', position: 0, groupId: 'ro-a', size: 'medium' },
        { id: 'ro-b1', name: 'B1', position: 1, groupId: 'ro-b', size: 'medium' }
    ];
    app.activityLayouts = new Map([
        ['ro-a1', { activityId: 'ro-a1', x: 0, y: 0, width: 200, height: 120 }],
        ['ro-b1', { activityId: 'ro-b1', x: 0, y: 0, width: 200, height: 120 }]
    ]);
    app.groups = [
        { id: 'ro-a', name: 'A', x: 100, y: 100, collapsed: false },
        { id: 'ro-b', name: 'B', x: 100, y: 100, collapsed: true }
    ];
    app.renderMain();
    const groupA = app.groups.find(item => item.id === 'ro-a');
    const groupB = app.groups.find(item => item.id === 'ro-b');
    const savedA = { x: groupA.x, y: groupA.y };
    const savedB = { x: groupB.x, y: groupB.y };
    const offsetBefore = { ...app.groupDisplayOffset('ro-b') };

    app.resizeCollapsedGroup(groupB, 300, 160);
    app.refreshGroupLayout();
    assert.deepEqual({ x: groupA.x, y: groupA.y }, savedA, 'the neighbouring group keeps its persistent position');
    assert.deepEqual({ x: groupB.x, y: groupB.y }, savedB, 'resizing never moves the group itself');
    const resizedBounds = app.groupDisplayBounds.get('ro-b');
    assert.equal(resizedBounds.right - resizedBounds.left, 304, 'the displayed bounds use the new collapsed width');
    assert.equal(resizedBounds.bottom - resizedBounds.top, 160, 'the displayed bounds use the new collapsed height');
    assert.deepEqual({ ...app.groupDisplayOffset('ro-b') }, offsetBefore, 'displacement stays valid for the enlarged collapsed box');
    assert.equal(storageData.groups.some(item => item.id === 'ro-b'), false, 'resizeCollapsedGroup alone does not persist');
});

test('group name and color editing persists across reloads and preserves group data', async () => {
    const harness = createGroupCanvasHarness();
    const { app, context, storageData, containers } = harness;
    const document = context.document;
    app.activities = [{ id: 'ed-a', name: 'A', position: 0, groupId: 'ed-g', size: 'small' }];
    app.activityLayouts = new Map([
        ['ed-a', { activityId: 'ed-a', x: 0, y: 0, width: 220, height: 120 }]
    ]);
    app.groups = [{
        id: 'ed-g',
        name: 'Old name',
        x: 100,
        y: 100,
        collapsed: true,
        collapsedWidth: 240,
        collapsedHeight: 64,
        assignment: 'Job',
        importedAt: 5
    }];
    app.renderMain();
    const title = containers.filter(item => item.dataset.groupId === 'ed-g').at(-1).children[0];
    assert.ok(title.children.some(child => child.classList.contains('group-edit-btn')), 'groups expose an edit control');

    assert.equal(app.openGroupEditModal('ed-g'), true);
    assert.equal(app.editingGroupId, 'ed-g', 'the dialog is open for the requested group');
    document.getElementById('groupEditNameInput').value = '  Renamed Group  ';
    const colorOptions = document.getElementById('groupEditColorOptions');
    const swatch = colorOptions.children.find(child => child.dataset.color === app.COLORS[2]);
    assert.ok(swatch, 'palette swatches render');
    swatch.handlers.get('click')();
    assert.equal(await app.saveGroupEdit(), true);
    assert.equal(app.editingGroupId, null, 'saving closes the dialog');

    const group = app.groups.find(item => item.id === 'ed-g');
    assert.equal(group.name, 'Renamed Group');
    assert.equal(group.color, app.COLORS[2]);
    assert.equal(group.x, 100, 'renaming keeps the position');
    assert.equal(group.y, 100);
    assert.equal(group.collapsedWidth, 240, 'renaming keeps collapsed dimensions');
    assert.equal(group.collapsedHeight, 64);
    assert.equal(group.collapsed, true, 'renaming keeps the collapsed state');
    assert.equal(group.assignment, 'Job', 'renaming keeps assignment metadata');
    assert.equal(group.importedAt, 5);
    assert.equal(typeof group.id, 'string');
    assert.equal(storageData.groups.find(item => item.id === 'ed-g').name, 'Renamed Group', 'the name is persisted');
    assert.equal(storageData.groups.find(item => item.id === 'ed-g').color, app.COLORS[2], 'the color is persisted');
    assert.deepEqual(
        { ...app.activityLayouts.get('ed-a') },
        { activityId: 'ed-a', x: 0, y: 0, width: 220, height: 120 },
        'editing never changes member layouts'
    );

    await app.loadGroups();
    const reloaded = app.groups.find(item => item.id === 'ed-g');
    assert.equal(reloaded.name, 'Renamed Group');
    assert.equal(reloaded.color, app.COLORS[2].toLowerCase());
    assert.equal(reloaded.collapsedWidth, 240);
    assert.equal(reloaded.assignment, 'Job');
});

test('canceling group editing leaves persisted data unchanged', async () => {
    const harness = createGroupCanvasHarness();
    const { app, context, storageData } = harness;
    const document = context.document;
    app.activities = [{ id: 'ec-a', name: 'A', position: 0, groupId: 'ec-g', size: 'small' }];
    app.activityLayouts = new Map([
        ['ec-a', { activityId: 'ec-a', x: 0, y: 0, width: 220, height: 120 }]
    ]);
    app.groups = [{ id: 'ec-g', name: 'Original', x: 50, y: 50, collapsed: false, color: app.COLORS[0] }];
    app.renderMain();
    const storedBefore = JSON.stringify(storageData.groups);

    app.openGroupEditModal('ec-g');
    document.getElementById('groupEditNameInput').value = 'Discarded';
    const swatch = document.getElementById('groupEditColorOptions').children
        .find(child => child.dataset.color === app.COLORS[3]);
    swatch.handlers.get('click')();
    app.closeGroupEditModal();

    const group = app.groups.find(item => item.id === 'ec-g');
    assert.equal(group.name, 'Original', 'cancel keeps the in-memory name');
    assert.equal(group.color, app.COLORS[0], 'cancel keeps the in-memory color');
    assert.equal(JSON.stringify(storageData.groups), storedBefore, 'cancel writes nothing to storage');
    assert.equal(app.editingGroupId, null, 'cancel clears the editing state');
});

test('group editing rejects blank names without losing the typed value', async () => {
    const harness = createGroupCanvasHarness();
    const { app, context, storageData } = harness;
    const document = context.document;
    app.activities = [{ id: 'ev-a', name: 'A', position: 0, groupId: 'ev-g', size: 'small' }];
    app.activityLayouts = new Map([
        ['ev-a', { activityId: 'ev-a', x: 0, y: 0, width: 220, height: 120 }]
    ]);
    app.groups = [{ id: 'ev-g', name: 'Keep', x: 0, y: 0, collapsed: false }];
    app.renderMain();
    const storedBefore = JSON.stringify(storageData.groups);

    app.openGroupEditModal('ev-g');
    const input = document.getElementById('groupEditNameInput');
    input.value = '   ';
    assert.equal(await app.saveGroupEdit(), false, 'blank names are rejected');
    assert.equal(document.getElementById('groupEditNameError').style.display, '', 'an error message is shown');
    assert.equal(input.value, '   ', 'the typed value is preserved');
    assert.equal(app.groups[0].name, 'Keep', 'the group is unchanged');
    assert.equal(JSON.stringify(storageData.groups), storedBefore, 'nothing is persisted');
    input.value = '';
    assert.equal(await app.saveGroupEdit(), false, 'empty names are rejected');
    assert.equal(document.getElementById('groupEditNameError').style.display, '');
});

test('dragging a group onto another nests it and preserves identity and data', async () => {
    const harness = createGroupCanvasHarness();
    const { app, containers, pointer, storageData } = harness;
    app.activities = [
        { id: 'nest-a1', name: 'A1', position: 0, groupId: 'nest-a', size: 'medium' },
        { id: 'nest-b1', name: 'B1', position: 1, groupId: 'nest-b', size: 'medium' }
    ];
    app.activityLayouts = new Map([
        ['nest-a1', { activityId: 'nest-a1', x: 0, y: 0, width: 200, height: 120 }],
        ['nest-b1', { activityId: 'nest-b1', x: 0, y: 0, width: 200, height: 120 }]
    ]);
    app.groups = [
        { id: 'nest-a', name: 'Parent', x: 100, y: 100, collapsed: false, color: '#e74c3c', collapsedWidth: 240, collapsedHeight: 64, assignment: 'Job', importedAt: 7 },
        { id: 'nest-b', name: 'Child', x: 900, y: 100, collapsed: false }
    ];
    storageData.groups = structuredClone(app.groups);
    app.renderMain();
    const child = app.groups.find(item => item.id === 'nest-b');
    const parent = app.groups.find(item => item.id === 'nest-a');
    const title = containers.filter(item => item.dataset.groupId === 'nest-b').at(-1).children[0];

    pointer('pointerdown', title, 900, 80);
    assert.equal(app.canvasGesture.mode, 'group-move');
    pointer('pointermove', title, 200, 100);
    assert.equal(app.canvasGesture.nestTargetId, 'nest-a', 'the group under the pointer is the nesting target');
    pointer('pointerup', title, 200, 100);
    await new Promise(resolve => setTimeout(resolve, 0));

    assert.equal(child.parentId, 'nest-a', 'the dragged group becomes a child of the target');
    assert.equal(parent.x, 100, 'the target keeps its persistent position');
    assert.notEqual(child.x, 900, 'the dragged group keeps its new persistent position');
    assert.ok(Number.isFinite(child.x) && Number.isFinite(child.y));
    assert.deepEqual({ ...app.activityLayouts.get('nest-b1') }, { activityId: 'nest-b1', x: 0, y: 0, width: 200, height: 120 }, 'member layouts are untouched');
    assert.equal(parent.name, 'Parent', 'parent identity is preserved');
    assert.equal(parent.color, '#e74c3c', 'parent color is preserved');
    assert.equal(parent.collapsedWidth, 240, 'parent collapsed dimensions are preserved');
    assert.equal(parent.assignment, 'Job', 'parent assignment metadata is preserved');
    assert.equal(parent.importedAt, 7);
    assert.ok(storageData.groups.some(item => item.id === 'nest-b' && item.parentId === 'nest-a'), 'the hierarchy is persisted');

    const parentContainer = containers.filter(item => item.dataset.groupId === 'nest-a').at(-1);
    const childContainer = containers.filter(item => item.dataset.groupId === 'nest-b').at(-1);
    assert.ok(parentContainer && childContainer, 'both containers render');
    const parentBox = parentContainer.getBoundingClientRect();
    const childBox = childContainer.getBoundingClientRect();
    assert.ok(childBox.left >= parentBox.left && childBox.right <= parentBox.right, 'the parent wraps the child horizontally');
    assert.ok(childBox.top >= parentBox.top && childBox.bottom <= parentBox.bottom, 'the parent wraps the child vertically');

    await app.loadGroups();
    const reloaded = app.groups.find(item => item.id === 'nest-b');
    assert.equal(reloaded.parentId, 'nest-a', 'nesting survives a reload');
    assert.equal(reloaded.name, 'Child');
});

test('dragging a nested group outside every group detaches it', async () => {
    const harness = createGroupCanvasHarness();
    const { app, containers, pointer } = harness;
    app.activities = [
        { id: 'det-a1', name: 'A1', position: 0, groupId: 'det-a', size: 'medium' },
        { id: 'det-b1', name: 'B1', position: 1, groupId: 'det-b', size: 'medium' }
    ];
    app.activityLayouts = new Map([
        ['det-a1', { activityId: 'det-a1', x: 0, y: 0, width: 200, height: 120 }],
        ['det-b1', { activityId: 'det-b1', x: 0, y: 0, width: 200, height: 120 }]
    ]);
    app.groups = [
        { id: 'det-a', name: 'Parent', x: 100, y: 100, collapsed: false },
        { id: 'det-b', name: 'Child', x: 130, y: 130, collapsed: false, parentId: 'det-a' }
    ];
    app.renderMain();
    const child = app.groups.find(item => item.id === 'det-b');
    assert.equal(child.parentId, 'det-a');

    const title = containers.filter(item => item.dataset.groupId === 'det-b').at(-1).children[0];
    pointer('pointerdown', title, 130, 110);
    pointer('pointermove', title, 2000, 2000);
    assert.equal(app.canvasGesture.nestTargetId, null, 'an empty area is not a nesting target');
    pointer('pointerup', title, 2000, 2000);
    await new Promise(resolve => setTimeout(resolve, 0));
    assert.equal(child.parentId, undefined, 'dropping outside detaches the group to the root level');
});

test('a group can never be nested into itself or its descendants', async () => {
    const harness = createGroupCanvasHarness();
    const { app } = harness;
    app.activities = [
        { id: 'cy-a1', name: 'A1', position: 0, groupId: 'cy-a', size: 'medium' },
        { id: 'cy-b1', name: 'B1', position: 1, groupId: 'cy-b', size: 'medium' },
        { id: 'cy-c1', name: 'C1', position: 2, groupId: 'cy-c', size: 'medium' }
    ];
    app.activityLayouts = new Map([
        ['cy-a1', { activityId: 'cy-a1', x: 0, y: 0, width: 200, height: 120 }],
        ['cy-b1', { activityId: 'cy-b1', x: 0, y: 0, width: 200, height: 120 }],
        ['cy-c1', { activityId: 'cy-c1', x: 0, y: 0, width: 200, height: 120 }]
    ]);
    app.groups = [
        { id: 'cy-a', name: 'A', x: 100, y: 100, collapsed: false },
        { id: 'cy-b', name: 'B', x: 130, y: 130, collapsed: false, parentId: 'cy-a' },
        { id: 'cy-c', name: 'C', x: 160, y: 160, collapsed: false, parentId: 'cy-b' }
    ];
    app.renderMain();
    assert.equal(await app.reparentGroup(app.groups[0], 'cy-a'), false, 'self nesting is rejected');
    assert.equal(await app.reparentGroup(app.groups[0], 'cy-b'), false, 'nesting into a child is rejected');
    assert.equal(await app.reparentGroup(app.groups[0], 'cy-c'), false, 'nesting into a grandchild is rejected');
    assert.equal(app.groups[0].parentId, undefined);
});

test('collapsing a parent hides nested groups and expanding restores them', async () => {
    const harness = createGroupCanvasHarness();
    const { app, containers, buttons } = harness;
    app.activities = [{ id: 'vis-b1', name: 'B1', position: 0, groupId: 'vis-b', size: 'medium' }];
    app.activityLayouts = new Map([
        ['vis-b1', { activityId: 'vis-b1', x: 0, y: 0, width: 200, height: 120 }]
    ]);
    app.groups = [
        { id: 'vis-a', name: 'Parent', x: 100, y: 100, collapsed: false },
        { id: 'vis-b', name: 'Child', x: 140, y: 140, collapsed: false, parentId: 'vis-a' }
    ];
    app.renderMain();
    assert.ok(containers.some(item => item.dataset.groupId === 'vis-b'), 'the child renders while the parent is expanded');
    assert.equal(buttons.length, 1, 'the child activity renders');

    await app.toggleGroupCollapsed('vis-a');
    assert.equal(containers.some(item => item.dataset.groupId === 'vis-b'), false, 'collapsing the parent hides the child');
    assert.equal(buttons.length, 0, 'collapsing the parent hides its nested activity');

    await app.toggleGroupCollapsed('vis-a');
    assert.ok(containers.some(item => item.dataset.groupId === 'vis-b'), 'expanding the parent restores the child');
    assert.equal(buttons.length, 1);
});

test('moving a nested parent moves every descendant and persists all coordinates', async () => {
    const harness = createGroupCanvasHarness();
    const { app, containers, pointer, storageData } = harness;
    app.activities = [
        { id: 'mv-a1', name: 'A1', position: 0, groupId: 'mv-a', size: 'medium' },
        { id: 'mv-b1', name: 'B1', position: 1, groupId: 'mv-b', size: 'medium' }
    ];
    app.activityLayouts = new Map([
        ['mv-a1', { activityId: 'mv-a1', x: 0, y: 0, width: 200, height: 120 }],
        ['mv-b1', { activityId: 'mv-b1', x: 0, y: 0, width: 200, height: 120 }]
    ]);
    app.groups = [
        { id: 'mv-a', name: 'Parent', x: 200, y: 200, collapsed: false },
        { id: 'mv-b', name: 'Child', x: 260, y: 260, collapsed: false, parentId: 'mv-a' }
    ];
    storageData.groups = structuredClone(app.groups);
    app.renderMain();
    const parent = app.groups.find(item => item.id === 'mv-a');
    const child = app.groups.find(item => item.id === 'mv-b');
    const relative = { x: child.x - parent.x, y: child.y - parent.y };

    const title = containers.filter(item => item.dataset.groupId === 'mv-a').at(-1).children[0];
    pointer('pointerdown', title, 200, 180);
    pointer('pointermove', title, 256, 236);
    pointer('pointerup', title, 256, 236);
    assert.equal(parent.x, 256, 'the parent follows the pointer on the grid');
    assert.equal(parent.y, 256);
    assert.equal(child.x - parent.x, relative.x, 'the child keeps its relative position');
    assert.equal(child.y - parent.y, relative.y);
    assert.ok(storageData.groups.some(item => item.id === 'mv-a' && item.x === 256));
    assert.ok(storageData.groups.some(item => item.id === 'mv-b' && item.x === parent.x + relative.x), 'the child position is persisted too');
});

test('legacy groups with missing or cyclic parents are sanitized on load', async () => {
    const harness = createGroupCanvasHarness();
    const { app, storageData } = harness;
    storageData.groups = [
        { id: 'san-a', name: 'A', x: 0, y: 0, collapsed: false, parentId: 'ghost' },
        { id: 'san-b', name: 'B', x: 0, y: 0, collapsed: false, parentId: 'san-c' },
        { id: 'san-c', name: 'C', x: 0, y: 0, collapsed: false, parentId: 'san-b' }
    ];
    await app.loadGroups();
    assert.equal(app.groups.find(item => item.id === 'san-a').parentId, undefined, 'a missing parent is removed');
    const b = app.groups.find(item => item.id === 'san-b');
    const c = app.groups.find(item => item.id === 'san-c');
    const cycleBroken = (b.parentId === undefined) !== (c.parentId === undefined);
    assert.ok(cycleBroken || (b.parentId === undefined && c.parentId === undefined), 'cycles are broken');
});

test('clicking a group title selects it and modifier clicks build a multi-selection', async () => {
    const harness = createGroupCanvasHarness();
    const { app, containers, pointer } = harness;
    app.activities = [
        { id: 'gs-a1', name: 'A1', position: 0, groupId: 'gs-a', size: 'medium' },
        { id: 'gs-b1', name: 'B1', position: 1, groupId: 'gs-b', size: 'medium' },
        { id: 'gs-c1', name: 'C1', position: 2, groupId: 'gs-c', size: 'medium' }
    ];
    app.activityLayouts = new Map([
        ['gs-a1', { activityId: 'gs-a1', x: 0, y: 0, width: 200, height: 120 }],
        ['gs-b1', { activityId: 'gs-b1', x: 0, y: 0, width: 200, height: 120 }],
        ['gs-c1', { activityId: 'gs-c1', x: 0, y: 0, width: 200, height: 120 }]
    ]);
    app.groups = [
        { id: 'gs-a', name: 'A', x: 100, y: 100, collapsed: false },
        { id: 'gs-b', name: 'B', x: 500, y: 100, collapsed: false },
        { id: 'gs-c', name: 'C', x: 900, y: 100, collapsed: false }
    ];
    app.renderMain();
    const titleOf = id => containers.filter(item => item.dataset.groupId === id).at(-1).children[0];

    pointer('pointerdown', titleOf('gs-a'), 100, 80);
    pointer('pointerup', titleOf('gs-a'), 100, 80);
    assert.deepEqual([...app.selectedGroupIds], ['gs-a'], 'a plain click selects one group');

    pointer('pointerdown', titleOf('gs-b'), 500, 80, { ctrlKey: true });
    pointer('pointerup', titleOf('gs-b'), 500, 80, { ctrlKey: true });
    assert.ok(app.selectedGroupIds.has('gs-a') && app.selectedGroupIds.has('gs-b'), 'ctrl-click adds to the selection');

    pointer('pointerdown', titleOf('gs-b'), 500, 80, { ctrlKey: true });
    pointer('pointerup', titleOf('gs-b'), 500, 80, { ctrlKey: true });
    assert.equal(app.selectedGroupIds.has('gs-b'), false, 'ctrl-click toggles a group off');

    pointer('pointerdown', titleOf('gs-c'), 900, 80);
    pointer('pointerup', titleOf('gs-c'), 900, 80);
    assert.deepEqual([...app.selectedGroupIds], ['gs-c'], 'a plain click replaces the selection');

    app.renderMain();
    const selectedContainer = containers.filter(item => item.dataset.groupId === 'gs-c').at(-1);
    const unselectedContainer = containers.filter(item => item.dataset.groupId === 'gs-a').at(-1);
    assert.ok(selectedContainer.classList.contains('is-selected'), 'the selected group is highlighted');
    assert.equal(unselectedContainer.classList.contains('is-selected'), false);

    app.handleGlobalKeydown({ key: 'Escape', target: { tagName: 'DIV' } });
    assert.equal(app.selectedGroupIds.size, 0, 'escape clears the group selection');
});

test('a selection rectangle selects groups and activities together', async () => {
    const harness = createGroupCanvasHarness();
    const { app, viewport } = harness;
    app.activities = [
        { id: 'rs-a1', name: 'A1', position: 0, groupId: 'rs-a', size: 'medium' },
        { id: 'rs-b1', name: 'B1', position: 1, groupId: 'rs-b', size: 'medium' }
    ];
    app.activityLayouts = new Map([
        ['rs-a1', { activityId: 'rs-a1', x: 0, y: 0, width: 200, height: 120 }],
        ['rs-b1', { activityId: 'rs-b1', x: 0, y: 0, width: 200, height: 120 }]
    ]);
    app.groups = [
        { id: 'rs-a', name: 'A', x: 100, y: 100, collapsed: false },
        { id: 'rs-b', name: 'B', x: 900, y: 100, collapsed: false }
    ];
    app.renderMain();

    const gesture = { startX: 0, startY: 0, lastX: 0, lastY: 0 };
    app.beginCanvasSelection(gesture, viewport);
    app.updateCanvasSelection(gesture, 700, 700);
    app.finishCanvasSelection(gesture);
    assert.deepEqual([...app.selectedGroupIds], ['rs-a'], 'the rectangle selects the covered group');
    assert.deepEqual([...app.selectedActivityIds], ['rs-a1'], 'the rectangle selects the covered activity');
});

test('dragging one selected group moves every selected group and its descendants', async () => {
    const harness = createGroupCanvasHarness();
    const { app, containers, pointer, storageData } = harness;
    app.activities = [
        { id: 'bm-a1', name: 'A1', position: 0, groupId: 'bm-a', size: 'medium' },
        { id: 'bm-b1', name: 'B1', position: 1, groupId: 'bm-b', size: 'medium' },
        { id: 'bm-b2', name: 'B2', position: 2, groupId: 'bm-b2', size: 'medium' }
    ];
    app.activityLayouts = new Map([
        ['bm-a1', { activityId: 'bm-a1', x: 0, y: 0, width: 200, height: 120 }],
        ['bm-b1', { activityId: 'bm-b1', x: 0, y: 0, width: 200, height: 120 }],
        ['bm-b2', { activityId: 'bm-b2', x: 0, y: 0, width: 200, height: 120 }]
    ]);
    app.groups = [
        { id: 'bm-a', name: 'A', x: 200, y: 200, collapsed: false },
        { id: 'bm-b', name: 'B', x: 600, y: 200, collapsed: false },
        { id: 'bm-b2', name: 'B2', x: 640, y: 240, collapsed: false, parentId: 'bm-b' }
    ];
    storageData.groups = structuredClone(app.groups);
    app.renderMain();
    const groupA = app.groups.find(item => item.id === 'bm-a');
    const groupB = app.groups.find(item => item.id === 'bm-b');
    const nested = app.groups.find(item => item.id === 'bm-b2');
    const relative = { x: nested.x - groupB.x, y: nested.y - groupB.y };
    app.setGroupSelection(['bm-a', 'bm-b']);

    const title = containers.filter(item => item.dataset.groupId === 'bm-a').at(-1).children[0];
    pointer('pointerdown', title, 200, 180);
    pointer('pointermove', title, 256, 236);
    pointer('pointerup', title, 256, 236);

    assert.equal(groupA.x, 256, 'the dragged group moved');
    assert.equal(groupA.y, 256);
    assert.equal(groupB.x, 656, 'the other selected group moved by the same delta');
    assert.equal(groupB.y, 256);
    assert.equal(nested.x - groupB.x, relative.x, 'the nested descendant follows its parent');
    assert.equal(nested.y - groupB.y, relative.y);
    assert.ok(storageData.groups.some(item => item.id === 'bm-a' && item.x === 256), 'every moved group is persisted');
    assert.ok(storageData.groups.some(item => item.id === 'bm-b' && item.x === 656));
});

test('the explicit action wraps selected groups in a new parent group', async () => {
    const harness = createGroupCanvasHarness();
    const { app, storageData } = harness;
    app.activities = [
        { id: 'wa-a1', name: 'A1', position: 0, groupId: 'wa-a', size: 'medium' },
        { id: 'wa-b1', name: 'B1', position: 1, groupId: 'wa-b', size: 'medium' }
    ];
    app.activityLayouts = new Map([
        ['wa-a1', { activityId: 'wa-a1', x: 0, y: 0, width: 200, height: 120 }],
        ['wa-b1', { activityId: 'wa-b1', x: 0, y: 0, width: 200, height: 120 }]
    ]);
    app.groups = [
        { id: 'wa-a', name: 'A', x: 100, y: 100, collapsed: false },
        { id: 'wa-b', name: 'B', x: 500, y: 100, collapsed: false }
    ];
    storageData.groups = structuredClone(app.groups);
    app.renderMain();
    app.setGroupSelection(['wa-a', 'wa-b']);
    const wrapper = await app.createGroupFromSelectedGroups();
    assert.ok(wrapper, 'a wrapper group is created');
    assert.equal(app.groups.find(item => item.id === 'wa-a').parentId, wrapper.id);
    assert.equal(app.groups.find(item => item.id === 'wa-b').parentId, wrapper.id);
    assert.equal(wrapper.parentId, undefined, 'the wrapper sits at the root level');
    assert.deepEqual([...app.selectedGroupIds], [wrapper.id], 'the wrapper becomes the selection');
    const bounds = app.groupBaseBounds(wrapper);
    const boundsA = app.groupBaseBounds(app.groups.find(item => item.id === 'wa-a'));
    const boundsB = app.groupBaseBounds(app.groups.find(item => item.id === 'wa-b'));
    assert.ok(bounds.left <= boundsA.left && bounds.right >= boundsB.right, 'the wrapper covers every child');
    assert.ok(storageData.groups.some(item => item.id === wrapper.id), 'the wrapper is persisted');
});

test('deleting selected groups keeps member activities and lifts nested groups', async () => {
    const harness = createGroupCanvasHarness();
    const { app, context, storageData } = harness;
    const document = context.document;
    app.activities = [
        { id: 'del-r1', name: 'R1', position: 0, groupId: 'del-root', size: 'medium' },
        { id: 'del-c1', name: 'C1', position: 1, groupId: 'del-child', size: 'medium' }
    ];
    app.activityLayouts = new Map([
        ['del-r1', { activityId: 'del-r1', x: 0, y: 0, width: 200, height: 120 }],
        ['del-c1', { activityId: 'del-c1', x: 0, y: 0, width: 200, height: 120 }]
    ]);
    app.groups = [
        { id: 'del-root', name: 'Root', x: 100, y: 100, collapsed: false },
        { id: 'del-child', name: 'Child', x: 140, y: 140, collapsed: false, parentId: 'del-root' }
    ];
    storageData.groups = structuredClone(app.groups);
    storageData.activities = structuredClone(app.activities);
    app.renderMain();
    app.setGroupSelection(['del-root']);

    assert.equal(app.openGroupDeleteModal(), true, 'the confirmation dialog opens');
    assert.ok(document.getElementById('groupDeleteSummary').textContent.includes('2'), 'the summary reports the hierarchy size');
    assert.equal(document.getElementById('groupDeleteConfirmBtn').disabled, true, 'confirmation stays disabled until both choices are explicit');
    app.pendingGroupDeletion.choices.activities = 'keep';
    app.pendingGroupDeletion.choices.nested = 'keep';
    assert.equal(app.updateGroupDeleteDialog(), true);
    assert.equal(document.getElementById('groupDeleteConfirmBtn').disabled, false);
    assert.equal(await app.deleteSelectedGroups(), true);

    assert.equal(app.groups.some(item => item.id === 'del-root'), false, 'the group is deleted');
    assert.equal(app.groups.find(item => item.id === 'del-child').parentId, undefined, 'the nested group moves up one level');
    const rootActivity = app.activities.find(item => item.id === 'del-r1');
    assert.equal(rootActivity.groupId, undefined, 'the member activity is ungrouped');
    assert.equal(app.activityLayouts.get('del-r1').x, 100, 'the ungrouped activity keeps its absolute position');
    assert.equal(app.activityLayouts.get('del-r1').y, 100);
    assert.equal(app.activities.find(item => item.id === 'del-c1').groupId, 'del-child', 'nested members stay in their group');
    assert.equal(app.groups.length, 1, 'only the selected group is removed');
    assert.equal(storageData.groups.some(item => item.id === 'del-root'), false, 'the deletion is persisted');
    assert.equal(storageData.activities.find(item => item.id === 'del-r1').groupId, undefined);
    assert.equal(storageData.layout.find(item => item.activityId === 'del-r1').x, 100, 'the converted layout is persisted');
    assert.ok(storageData.groups.find(item => item.id === 'del-child').parentId === undefined, 'the lifted parent is persisted');
});

test('canceling the delete confirmation changes nothing and keyboard delete opens it', async () => {
    const harness = createGroupCanvasHarness();
    const { app, context, storageData } = harness;
    const document = context.document;
    app.activities = [{ id: 'kd-a1', name: 'A1', position: 0, groupId: 'kd-a', size: 'medium' }];
    app.activityLayouts = new Map([
        ['kd-a1', { activityId: 'kd-a1', x: 0, y: 0, width: 200, height: 120 }]
    ]);
    app.groups = [{ id: 'kd-a', name: 'A', x: 100, y: 100, collapsed: false }];
    storageData.groups = structuredClone(app.groups);
    app.renderMain();
    const storedBefore = JSON.stringify(storageData.groups);

    app.setGroupSelection(['kd-a']);
    app.openGroupDeleteModal();
    app.closeGroupDeleteModal();
    assert.equal(app.groups.length, 1, 'cancel keeps the group');
    assert.equal(JSON.stringify(storageData.groups), storedBefore, 'cancel writes nothing');

    app.handleGlobalKeydown({ key: 'Delete', target: { tagName: 'DIV' }, preventDefault() {} });
    assert.ok(document.getElementById('groupDeleteSummary').textContent.length > 0, 'keyboard delete opens the confirmation');
    app.handleGlobalKeydown({ key: 'Escape', target: { tagName: 'DIV' } });
    assert.equal(app.pendingGroupDeletion, null, 'escape closes the confirmation dialog first');
    app.handleGlobalKeydown({ key: 'Escape', target: { tagName: 'DIV' } });
    assert.equal(app.selectedGroupIds.size, 0, 'a second escape clears the selection');
});

function createGroupDeletionHarness() {
    const harness = createGroupCanvasHarness();
    const { app, storageData } = harness;
    app.groups = [
        { id: 'hier-root', name: 'Root', x: 100, y: 100, collapsed: false },
        { id: 'hier-child', name: 'Child', x: 140, y: 140, collapsed: false, parentId: 'hier-root' },
        { id: 'hier-grand', name: 'Grand', x: 180, y: 180, collapsed: false, parentId: 'hier-child' },
        { id: 'hier-other', name: 'Other', x: 900, y: 100, collapsed: false }
    ];
    app.activities = [
        { id: 'hier-r1', name: 'R1', position: 0, groupId: 'hier-root', size: 'medium' },
        { id: 'hier-c1', name: 'C1', position: 1, groupId: 'hier-child', size: 'medium' },
        { id: 'hier-g1', name: 'G1', position: 2, groupId: 'hier-grand', size: 'medium' },
        { id: 'hier-o1', name: 'O1', position: 3, groupId: 'hier-other', size: 'medium' }
    ];
    app.activityLayouts = new Map([
        ['hier-r1', { activityId: 'hier-r1', x: 0, y: 0, width: 200, height: 120 }],
        ['hier-c1', { activityId: 'hier-c1', x: 0, y: 0, width: 200, height: 120 }],
        ['hier-g1', { activityId: 'hier-g1', x: 0, y: 0, width: 200, height: 120 }],
        ['hier-o1', { activityId: 'hier-o1', x: 0, y: 0, width: 200, height: 120 }]
    ]);
    app.timeEntries = [{ id: 'hier-entry', activityId: 'hier-r1', startTimestamp: 1, endTimestamp: 2, syncStatus: 'unsynced' }];
    storageData.groups = structuredClone(app.groups);
    storageData.activities = structuredClone(app.activities);
    storageData.layout = [...app.activityLayouts.values()].map(layout => structuredClone(layout));
    storageData.timeEntries = structuredClone(app.timeEntries);
    app.renderMain();
    app.setGroupSelection(['hier-root']);
    return harness;
}

async function confirmGroupDeletion(app, activities, nested) {
    app.openGroupDeleteModal();
    app.pendingGroupDeletion.choices.activities = activities;
    app.pendingGroupDeletion.choices.nested = nested;
    app.updateGroupDeleteDialog();
    return app.deleteSelectedGroups();
}

test('deletion keep/keep removes only the selected container', async () => {
    const { app, storageData } = createGroupDeletionHarness();
    assert.equal(await confirmGroupDeletion(app, 'keep', 'keep'), true);
    assert.equal(app.groups.some(group => group.id === 'hier-root'), false);
    assert.equal(app.groups.find(group => group.id === 'hier-child').parentId, undefined, 'child moves to the root level');
    assert.equal(app.groups.find(group => group.id === 'hier-grand').parentId, 'hier-child', 'grandchild keeps its parent');
    assert.equal(app.groups.some(group => group.id === 'hier-other'), true);
    assert.deepEqual(app.activities.map(activity => activity.id).sort(), ['hier-c1', 'hier-g1', 'hier-o1', 'hier-r1']);
    assert.equal(app.activities.find(activity => activity.id === 'hier-r1').groupId, undefined, 'direct members become ungrouped');
    assert.equal(app.activities.find(activity => activity.id === 'hier-c1').groupId, 'hier-child', 'nested members keep their group');
    assert.equal(app.activityLayouts.get('hier-r1').x, 100, 'ungrouped activity keeps its absolute position');
    assert.equal(app.activityLayouts.get('hier-r1').y, 100);
    assert.equal(storageData.groups.find(group => group.id === 'hier-child').parentId, undefined);
    assert.equal(storageData.activities.find(activity => activity.id === 'hier-r1').groupId, undefined);
    assert.equal(storageData.layout.find(layout => layout.activityId === 'hier-r1').x, 100);
    assert.equal(app.timeEntries.length, 1, 'Day Review history is untouched');
    assert.equal(storageData.timeEntries.length, 1);
});

test('deletion keep/delete removes nested groups but preserves every activity', async () => {
    const { app, storageData } = createGroupDeletionHarness();
    assert.equal(await confirmGroupDeletion(app, 'keep', 'delete'), true);
    assert.deepEqual(app.groups.map(group => group.id), ['hier-other'], 'the whole nested hierarchy is removed');
    assert.deepEqual(app.activities.map(activity => activity.id).sort(), ['hier-c1', 'hier-g1', 'hier-o1', 'hier-r1']);
    assert.equal(app.activities.find(activity => activity.id === 'hier-c1').groupId, undefined);
    assert.equal(app.activities.find(activity => activity.id === 'hier-g1').groupId, undefined);
    assert.equal(app.activityLayouts.get('hier-r1').x, 100);
    assert.equal(app.activityLayouts.get('hier-c1').x, 140, 'nested member keeps its absolute position');
    assert.equal(app.activityLayouts.get('hier-g1').x, 180);
    assert.equal(storageData.groups.length, 1);
    assert.equal(storageData.activities.length, 4, 'no activity is lost');
    assert.equal(storageData.layout.find(layout => layout.activityId === 'hier-g1').x, 180);
    assert.equal(app.timeEntries.length, 1);
});

test('deletion delete/keep removes activities but keeps nested group containers', async () => {
    const { app, storageData } = createGroupDeletionHarness();
    assert.equal(await confirmGroupDeletion(app, 'delete', 'keep'), true);
    assert.equal(app.groups.some(group => group.id === 'hier-root'), false);
    assert.equal(app.groups.find(group => group.id === 'hier-child').parentId, undefined);
    assert.equal(app.groups.some(group => group.id === 'hier-grand'), true, 'descendant groups survive');
    assert.deepEqual(app.activities.map(activity => activity.id).sort(), ['hier-o1'], 'all hierarchy activities are deleted');
    assert.equal(storageData.activities.length, 1);
    assert.equal(storageData.layout.some(layout => layout.activityId === 'hier-r1'), false, 'deleted layouts are removed');
    assert.equal(storageData.layout.some(layout => layout.activityId === 'hier-c1'), false);
    assert.equal(storageData.layout.some(layout => layout.activityId === 'hier-g1'), false);
    assert.equal(app.timeEntries.length, 1, 'logged time entries stay independent');
});

test('deletion delete/delete removes the whole hierarchy', async () => {
    const { app, storageData } = createGroupDeletionHarness();
    assert.equal(await confirmGroupDeletion(app, 'delete', 'delete'), true);
    assert.deepEqual(app.groups.map(group => group.id), ['hier-other']);
    assert.deepEqual(app.activities.map(activity => activity.id), ['hier-o1']);
    assert.deepEqual(storageData.groups.map(group => group.id), ['hier-other']);
    assert.deepEqual(storageData.activities.map(activity => activity.id), ['hier-o1']);
    assert.equal(storageData.layout.length, 1);
    assert.equal(app.timeEntries.length, 1);
});

test('the deletion dialog requires both explicit choices and reports the outcome', async () => {
    const { app, context } = createGroupDeletionHarness();
    const document = context.document;
    app.openGroupDeleteModal();
    assert.equal(document.getElementById('groupDeleteConfirmBtn').disabled, true, 'confirm is disabled before choices');
    assert.ok(document.getElementById('groupDeleteOutcome').textContent.length > 0, 'a hint asks for the choices');
    app.pendingGroupDeletion.choices.activities = 'delete';
    app.updateGroupDeleteDialog();
    assert.equal(document.getElementById('groupDeleteConfirmBtn').disabled, true, 'one choice is not enough');
    assert.equal(app.updateGroupDeleteDialog(), false);
    app.pendingGroupDeletion.choices.nested = 'delete';
    assert.equal(app.updateGroupDeleteDialog(), true);
    assert.equal(document.getElementById('groupDeleteConfirmBtn').disabled, false);
    assert.ok(document.getElementById('groupDeleteOutcome').textContent.includes('3'), 'the outcome reports the deleted activities');
    app.closeGroupDeleteModal();
    assert.equal(app.pendingGroupDeletion, null, 'closing resets the pending choices');
});

test('locked groups and locked ancestors block deletion until unlocked', async () => {
    const { app, context, storageData } = createGroupDeletionHarness();
    const document = context.document;
    app.groups.find(group => group.id === 'hier-child').locked = true;
    storageData.groups = structuredClone(app.groups);
    app.openGroupDeleteModal();
    app.pendingGroupDeletion.choices.activities = 'delete';
    app.pendingGroupDeletion.choices.nested = 'delete';
    assert.equal(app.updateGroupDeleteDialog(), false, 'locked descendants block the destructive delete');
    assert.notEqual(document.getElementById('groupDeleteLockedWarning').style.display, 'none');
    assert.equal(document.getElementById('groupDeleteConfirmBtn').disabled, true);
    assert.equal(await app.deleteSelectedGroups(), false, 'the deletion cannot run while locked');
    assert.equal(app.groups.length, 4, 'the hierarchy is untouched');

    // A locked descendant does not block choices where it survives.
    app.pendingGroupDeletion.choices.activities = 'keep';
    app.pendingGroupDeletion.choices.nested = 'keep';
    assert.equal(app.updateGroupDeleteDialog(), true, 'surviving locked groups do not block');

    // Explicit unlock through the editor is the authorized workflow.
    app.openGroupEditModal('hier-child');
    document.getElementById('groupEditLockedInput').checked = false;
    assert.equal(await app.saveGroupEdit(), true);
    app.groups.find(group => group.id === 'hier-root').locked = true;
    storageData.groups = structuredClone(app.groups);
    app.openGroupDeleteModal();
    app.pendingGroupDeletion.choices.activities = 'delete';
    app.pendingGroupDeletion.choices.nested = 'delete';
    assert.equal(app.updateGroupDeleteDialog(), false, 'a locked selected root blocks deletion too');
    app.openGroupEditModal('hier-root');
    document.getElementById('groupEditLockedInput').checked = false;
    assert.equal(await app.saveGroupEdit(), true);
    app.openGroupDeleteModal();
    app.pendingGroupDeletion.choices.activities = 'delete';
    app.pendingGroupDeletion.choices.nested = 'delete';
    assert.equal(app.updateGroupDeleteDialog(), true, 'after unlocking the delete is allowed again');
    assert.equal(await app.deleteSelectedGroups(), true);
    assert.equal(app.groups.some(group => group.id === 'hier-child'), false, 'the unlocked hierarchy is deleted correctly');
});

test('deleting groups is one undo entry and undo/redo restore exact states', async () => {
    const { app, storageData } = createGroupDeletionHarness();
    const sortedIds = records => [...records].sort((a, b) => String(a.id).localeCompare(String(b.id)));
    const beforeGroups = JSON.stringify(sortedIds(app.groups));
    const beforeActivities = JSON.stringify(sortedIds(app.activities));
    assert.equal(await confirmGroupDeletion(app, 'keep', 'delete'), true);
    assert.equal(app.canvasUndoStack.length, 1, 'the whole deletion is a single history entry');
    assert.equal(app.groups.length, 1);

    assert.equal(await app.undoCanvas(), true);
    assert.equal(JSON.stringify(sortedIds(app.groups)), beforeGroups, 'undo restores the hierarchy');
    assert.equal(JSON.stringify(sortedIds(app.activities)), beforeActivities, 'undo restores the activities');
    assert.equal(app.activityLayouts.get('hier-c1').x, 0, 'undo restores the group-relative layouts');
    assert.equal(storageData.groups.length, 4, 'undo restores persisted groups');
    assert.equal(storageData.activities.length, 4, 'undo restores persisted activities');
    assert.equal(app.canvasRedoStack.length, 1);

    assert.equal(await app.redoCanvas(), true);
    assert.deepEqual(app.groups.map(group => group.id), ['hier-other'], 'redo reapplies the same choices');
    assert.deepEqual(app.activities.map(activity => activity.id).sort(), ['hier-c1', 'hier-g1', 'hier-o1', 'hier-r1']);
    assert.equal(app.activityLayouts.get('hier-c1').x, 140, 'redo reapplies the ungrouped layouts');
    assert.equal(storageData.activities.length, 4);
    assert.equal(await app.undoCanvas(), true);
    assert.equal(JSON.stringify(sortedIds(app.groups)), beforeGroups);
});

test('multi-selection deletion handles each hierarchy without double processing', async () => {
    const { app } = createGroupDeletionHarness();
    app.setGroupSelection(['hier-root', 'hier-other']);
    assert.equal(await confirmGroupDeletion(app, 'keep', 'keep'), true);
    assert.equal(app.groups.some(group => group.id === 'hier-root'), false);
    assert.equal(app.groups.some(group => group.id === 'hier-other'), false);
    assert.equal(app.groups.find(group => group.id === 'hier-child').parentId, undefined);
    assert.equal(app.activities.find(activity => activity.id === 'hier-o1').groupId, undefined, 'the second hierarchy is ungrouped');
    assert.deepEqual(app.activities.map(activity => activity.id).sort(), ['hier-c1', 'hier-g1', 'hier-o1', 'hier-r1']);

    // A nested group that is also selected is handled once, through its root.
    const second = createGroupDeletionHarness();
    second.app.setGroupSelection(['hier-root', 'hier-child']);
    assert.deepEqual(second.app.selectedTopLevelGroups().map(group => group.id), ['hier-root']);
    assert.equal(await confirmGroupDeletion(second.app, 'keep', 'keep'), true);
    assert.equal(second.app.groups.some(group => group.id === 'hier-child'), true, 'the also-selected child survives');
    assert.equal(second.app.groups.filter(group => group.id === 'hier-child').length, 1, 'no duplicate processing');
});

test('empty groups and escape close the dialog without changing anything', async () => {
    const harness = createGroupCanvasHarness();
    const { app, context, storageData } = harness;
    const document = context.document;
    app.groups = [{ id: 'empty-group', name: 'Empty', x: 10, y: 10, collapsed: false }];
    storageData.groups = structuredClone(app.groups);
    app.activities = [];
    app.renderMain();
    app.setGroupSelection(['empty-group']);
    app.openGroupDeleteModal();
    assert.ok(document.getElementById('groupDeleteSummary').textContent.includes('0'), 'empty hierarchies report zero contents');
    app.pendingGroupDeletion.choices.activities = 'delete';
    app.pendingGroupDeletion.choices.nested = 'delete';
    app.updateGroupDeleteDialog();
    app.handleGlobalKeydown({ key: 'Escape', target: { tagName: 'DIV' } });
    assert.equal(app.pendingGroupDeletion, null, 'escape closes the dialog');
    assert.equal(app.groups.length, 1, 'escape changes nothing');
    app.openGroupDeleteModal();
    app.pendingGroupDeletion.choices.activities = 'delete';
    app.pendingGroupDeletion.choices.nested = 'delete';
    app.updateGroupDeleteDialog();
    assert.equal(await app.deleteSelectedGroups(), true);
    assert.equal(app.groups.length, 0, 'the empty group can still be deleted');
    assert.equal(app.activities.length, 0);
});

test('the activity icon catalog is consistent and shared with assignment import', () => {
    const { app, context } = createTestApp();
    const icons = app.ACTIVITY_ICONS;
    assert.ok(Array.isArray(icons), 'the catalog exists');
    assert.deepEqual(
        Array.from(icons, icon => icon.id),
        ['vacuum-attic', 'vacuum-basement', 'mop', 'squeegee', 'duster', 'car'],
        'the six required templates are present in a stable order'
    );
    assert.equal(new Set(icons.map(icon => icon.id)).size, icons.length, 'identifiers are unique');
    for (const icon of icons) {
        assert.ok(icon.key, `${icon.id} has a translation key`);
        assert.ok(Array.isArray(icon.elements) && icon.elements.length > 0, `${icon.id} has geometry`);
        for (const element of icon.elements) {
            assert.ok(['path', 'circle', 'rect', 'ellipse', 'line', 'polyline'].includes(element.tag), `${icon.id} uses a simple SVG tag`);
        }
    }
    const Assignment = vm.runInContext('TimerHubAssignment', context);
    assert.deepEqual(
        Array.from(Assignment.ACTIVITY_ICON_IDS),
        Array.from(icons, icon => icon.id),
        'assignment validation accepts exactly the icons the canvas can render'
    );
});

test('icon SVG builders fail safe for missing and unknown identifiers', () => {
    const { app } = createTestApp();
    assert.equal(app.activityIcon(undefined), null);
    assert.equal(app.activityIcon(''), null);
    assert.equal(app.activityIcon('rocket'), null, 'unknown ids resolve to no icon');
    const icon = app.activityIcon('mop');
    assert.ok(icon);
    const svg = app.buildIconSvg(icon, 'activity-icon');
    assert.ok(svg, 'an SVG is built for a known icon');
    assert.equal(svg.viewBox, '0 0 24 24');
    assert.equal(svg['aria-hidden'], 'true');
    assert.equal(svg.classList.contains('activity-icon'), true);
    assert.equal(svg.children.length, icon.elements.length, 'every shape is rendered');
});

test('creating, editing and clearing an activity icon keeps the other fields intact', async () => {
    const { app, document, storageData } = createTestApp();
    app.renderMain = () => {};
    app.generateId = () => 'icon-created';
    const originalQuerySelector = document.querySelector;
    const withIcon = icon => {
        document.querySelector = selector => selector === '.icon-option.selected'
            ? { dataset: { icon } }
            : (typeof originalQuerySelector === 'function' ? originalQuerySelector(selector) : null);
    };
    document.getElementById('activityName').value = 'Attic vacuum';

    withIcon('vacuum-attic');
    await app.saveActivity();
    const created = app.activities.find(activity => activity.id === 'icon-created');
    assert.equal(created.icon, 'vacuum-attic', 'the created activity stores the icon id');
    assert.equal(created.name, 'Attic vacuum', 'the name is stored independently');
    assert.equal(storageData.activities.find(activity => activity.id === 'icon-created').icon, 'vacuum-attic', 'the icon is persisted');

    app.editingActivityId = 'icon-created';
    document.getElementById('activityName').value = 'Attic vacuum';
    withIcon('car');
    await app.saveActivity();
    assert.equal(created.icon, 'car', 'editing changes only the icon');
    assert.equal(created.name, 'Attic vacuum');
    assert.equal(storageData.activities.find(activity => activity.id === 'icon-created').icon, 'car');

    app.editingActivityId = 'icon-created';
    document.getElementById('activityName').value = 'Attic vacuum';
    withIcon('');
    await app.saveActivity();
    assert.equal(Object.hasOwn(created, 'icon'), false, 'clearing the icon removes the property');
    assert.equal(Object.hasOwn(storageData.activities.find(activity => activity.id === 'icon-created'), 'icon'), false);
    document.querySelector = originalQuerySelector;
});

test('canvas nodes render template icons, keep names, and ignore unknown identifiers', () => {
    const harness = createGroupCanvasHarness();
    const { app, buttons } = harness;
    app.activities = [
        { id: 'icon-a', name: 'Attic', position: 0, size: 'medium', icon: 'vacuum-attic' },
        { id: 'icon-b', name: 'Plain', position: 1, size: 'medium' },
        { id: 'icon-c', name: 'Unknown', position: 2, size: 'medium', icon: 'rocket' }
    ];
    app.activityLayouts = new Map();
    app.groups = [];
    app.renderMain();
    const buttonOf = id => buttons.find(button => button.dataset.activityId === id);
    const iconA = buttonOf('icon-a');
    const iconB = buttonOf('icon-b');
    const iconC = buttonOf('icon-c');
    const renderedIcon = node => node.children.find(child => child.classList.contains('activity-icon'));
    assert.ok(renderedIcon(iconA), 'the selected template renders');
    assert.equal(iconA.classList.contains('has-icon'), true);
    assert.equal(
        renderedIcon(iconA).children.length,
        app.activityIcon('vacuum-attic').elements.length,
        'every artwork element renders on the canvas'
    );
    assert.ok(iconA.children.some(child => child.classList.contains('btn-name')), 'the editable name stays visible');
    assert.equal(renderedIcon(iconB), undefined, 'activities without an icon are unchanged');
    assert.equal(renderedIcon(iconC), undefined, 'unknown identifiers fail safe');
    assert.equal(iconB.classList.contains('has-icon'), false);
});

test('backup export and import preserve activity icons and legacy records', async () => {
    const { app, storageData } = createTestApp();
    storageData.activities = [
        { id: 'icon-rt', name: 'Roundtrip', icon: 'car', position: 0 },
        { id: 'legacy-rt', name: 'Legacy', position: 1 }
    ];
    await app.loadActivities();
    assert.equal(app.activities.find(activity => activity.id === 'icon-rt').icon, 'car');
    assert.equal(Object.hasOwn(app.activities.find(activity => activity.id === 'legacy-rt'), 'icon'), false, 'legacy activities stay valid');
    const backup = await app.storage.exportAll();
    assert.equal(backup.activities.find(activity => activity.id === 'icon-rt').icon, 'car', 'export keeps the icon');
    storageData.activities = [];
    await app.loadActivities();
    await app.storage.importAll(backup, false);
    await app.loadActivities();
    assert.equal(app.activities.find(activity => activity.id === 'icon-rt').icon, 'car', 'import restores the icon');
    assert.equal(Object.hasOwn(app.activities.find(activity => activity.id === 'legacy-rt'), 'icon'), false);
});

test('assignment import maps known icons, omits missing ones and rejects unknown ids', async () => {
    const harness = makeAssignmentImportApp();
    const { app, document } = harness;
    document.getElementById('assignmentJsonInput').value = JSON.stringify({
        format: 'timerhub-assignment',
        version: 1,
        name: 'Icon job',
        groups: [{
            name: 'Street',
            activities: [{ name: 'Attic vacuum', icon: 'vacuum-attic' }, { name: 'Ordinary work' }]
        }]
    });
    assert.equal(await app.validateAssignmentJson(), true);
    assert.equal(await app.confirmAssignmentImport(), true);
    const withIcon = app.activities.find(activity => activity.name === 'Attic vacuum');
    assert.equal(withIcon.icon, 'vacuum-attic', 'the imported activity carries the template');
    assert.equal(Object.hasOwn(app.activities.find(activity => activity.name === 'Ordinary work'), 'icon'), false, 'missing icons are not invented');

    document.getElementById('assignmentJsonInput').value = JSON.stringify({
        format: 'timerhub-assignment',
        version: 1,
        groups: [{ name: 'Street', activities: [{ name: 'Bad icon', icon: 'rocket' }] }]
    });
    assert.equal(await app.validateAssignmentJson(), false, 'unknown template ids are rejected');
    assert.ok(document.getElementById('assignmentImportError').textContent.includes('icon'));
});

test('activity display mode controls the canvas icon and label with graceful fallbacks', () => {
    const harness = createGroupCanvasHarness();
    const { app, buttons } = harness;
    app.groups = [];
    app.activities = [
        { id: 'dm-icon-only', name: 'Cellar vacuum', position: 0, size: 'medium', icon: 'vacuum-basement', displayMode: 'icon-only' },
        { id: 'dm-both', name: 'Windows', position: 1, size: 'medium', icon: 'squeegee', displayMode: 'icon-and-text' },
        { id: 'dm-legacy', name: 'Travel', position: 2, size: 'medium', icon: 'car' },
        { id: 'dm-no-icon', name: 'Plain work', position: 3, size: 'medium', displayMode: 'icon-only' },
        { id: 'dm-unknown-icon', name: 'Unknown icon', position: 4, size: 'medium', icon: 'rocket', displayMode: 'icon-only' }
    ];
    app.activityLayouts = new Map();
    app.renderMain();
    const buttonOf = id => buttons.find(button => button.dataset.activityId === id);
    const hasName = node => Boolean(node.children.find(child => child.classList.contains('btn-name')));

    const iconOnly = buttonOf('dm-icon-only');
    assert.equal(iconOnly.classList.contains('has-icon'), true);
    assert.equal(iconOnly.classList.contains('is-icon-only'), true, 'icon-only mode is applied when an icon exists');
    assert.ok(hasName(iconOnly), 'the label element stays in the DOM and is hidden by CSS');

    const both = buttonOf('dm-both');
    assert.equal(both.classList.contains('is-icon-only'), false, 'icon-and-text keeps the label');

    const legacy = buttonOf('dm-legacy');
    assert.equal(legacy.classList.contains('is-icon-only'), false, 'legacy activities without the property keep the default');

    const noIcon = buttonOf('dm-no-icon');
    assert.equal(noIcon.classList.contains('has-icon'), false);
    assert.equal(noIcon.classList.contains('is-icon-only'), false, 'icon-only without an icon falls back to text');
    assert.ok(hasName(noIcon));

    const unknownIcon = buttonOf('dm-unknown-icon');
    assert.equal(unknownIcon.classList.contains('has-icon'), false);
    assert.equal(unknownIcon.classList.contains('is-icon-only'), false, 'unknown icon ids fall back to text');
});

test('switching display modes edits only that property and removes the default value', async () => {
    const { app, document, storageData } = createTestApp();
    app.renderMain = () => {};
    const baseQuery = document.querySelector;
    const existing = {
        id: 'dm-edit', name: 'Keep me', color: '#123456', shape: 'hexagon', size: 'large',
        notes: 'note', customerId: '5', serviceId: '9', customerName: 'Beta', serviceName: 'Repair',
        icon: 'mop', displayMode: 'icon-only', position: 0
    };
    app.activities = [existing];
    app.editingActivityId = 'dm-edit';
    app.storage.saveActivity = async activity => {
        const index = storageData.activities.findIndex(item => item.id === activity.id);
        if (index >= 0) storageData.activities[index] = structuredClone(activity);
        else storageData.activities.push(structuredClone(activity));
        return activity;
    };
    storageData.activities = [structuredClone(existing)];

    const withQueries = selection => {
        document.querySelector = selector => selection[selector] ?? null;
    };
    document.getElementById('activityName').value = 'Keep me';
    document.getElementById('activityNotes').value = 'note';

    withQueries({
        '.color-option.selected': { style: { backgroundColor: '#123456' } },
        '.shape-option.selected': { dataset: { shape: 'hexagon' } },
        '.icon-option.selected': { dataset: { icon: 'mop' } },
        '.display-mode-btn.selected': { dataset: { displayMode: 'icon-and-text' } }
    });
    await app.saveActivity();
    assert.equal(Object.hasOwn(existing, 'displayMode'), false, 'the default mode is normalized away');
    assert.equal(existing.icon, 'mop', 'the icon is untouched');
    assert.equal(existing.size, 'large', 'legacy size is untouched');
    assert.equal(existing.notes, 'note');
    assert.equal(existing.id, 'dm-edit');
    assert.equal(storageData.activities[0].displayMode, undefined);

    app.editingActivityId = 'dm-edit';
    document.getElementById('activityName').value = 'Keep me';
    document.getElementById('activityNotes').value = 'note';
    withQueries({
        '.display-mode-btn.selected': { dataset: { displayMode: 'icon-only' } }
    });
    await app.saveActivity();
    assert.equal(existing.displayMode, 'icon-only');
    assert.equal(storageData.activities[0].displayMode, 'icon-only', 'the switch is persisted');
    assert.equal(existing.name, 'Keep me');
    document.querySelector = baseQuery;
});

test('display mode survives reload, backup round-trips and assignment import', async () => {
    const { app, storageData } = createTestApp();
    storageData.activities = [
        { id: 'dm-round', name: 'Roundtrip', icon: 'duster', displayMode: 'icon-only', position: 0 },
        { id: 'dm-legacy', name: 'Legacy', position: 1 }
    ];
    await app.loadActivities();
    assert.equal(app.activities.find(a => a.id === 'dm-round').displayMode, 'icon-only');
    assert.equal(Object.hasOwn(app.activities.find(a => a.id === 'dm-legacy'), 'displayMode'), false);
    const backup = await app.storage.exportAll();
    assert.equal(backup.activities.find(a => a.id === 'dm-round').displayMode, 'icon-only', 'export keeps the mode');
    storageData.activities = [];
    await app.loadActivities();
    await app.storage.importAll(backup, false);
    await app.loadActivities();
    assert.equal(app.activities.find(a => a.id === 'dm-round').displayMode, 'icon-only', 'import restores the mode');

    const harness = makeAssignmentImportApp();
    const assignmentDocument = harness.document;
    assignmentDocument.getElementById('assignmentJsonInput').value = JSON.stringify({
        format: 'timerhub-assignment',
        version: 1,
        name: 'Display modes',
        groups: [{
            name: 'Street',
            activities: [
                { name: 'Icon only task', icon: 'vacuum-attic', displayMode: 'icon-only' },
                { name: 'Default task', icon: 'mop' },
                { name: 'Explicit default', icon: 'car', displayMode: 'icon-and-text' }
            ]
        }]
    });
    assert.equal(await harness.app.validateAssignmentJson(), true);
    assert.equal(await harness.app.confirmAssignmentImport(), true);
    assert.equal(harness.app.activities.find(a => a.name === 'Icon only task').displayMode, 'icon-only');
    assert.equal(Object.hasOwn(harness.app.activities.find(a => a.name === 'Default task'), 'displayMode'), false, 'omitted mode stays absent');
    assert.equal(harness.app.activities.find(a => a.name === 'Explicit default').displayMode, 'icon-and-text');

    assignmentDocument.getElementById('assignmentJsonInput').value = JSON.stringify({
        format: 'timerhub-assignment',
        version: 1,
        groups: [{ name: 'Street', activities: [{ name: 'Bad mode', displayMode: 'sideways' }] }]
    });
    assert.equal(await harness.app.validateAssignmentJson(), false, 'unknown display modes are rejected');
    assert.ok(assignmentDocument.getElementById('assignmentImportError').textContent.includes('displayMode'));
});

test('the activity modal preselects the stored display mode and defaults to icon + text', () => {
    const { app, document } = createTestApp();
    app.activities = [
        { id: 'mode-a', name: 'A', displayMode: 'icon-only' },
        { id: 'mode-b', name: 'B' }
    ];
    const original = document.querySelector;
    const selected = [];
    document.querySelector = selector => {
        if (selector.startsWith('.display-mode-btn[data-display-mode=')) {
            return { classList: { add: () => selected.push(selector) } };
        }
        return original(selector);
    };
    app.showActivityModal('mode-a');
    assert.deepEqual(selected, ['.display-mode-btn[data-display-mode="icon-only"]']);
    selected.length = 0;
    app.showActivityModal('mode-b');
    assert.deepEqual(selected, ['.display-mode-btn[data-display-mode="icon-and-text"]'], 'legacy activities default to icon + text');
    selected.length = 0;
    app.showActivityModal();
    assert.deepEqual(selected, ['.display-mode-btn[data-display-mode="icon-and-text"]'], 'new activities default to icon + text');
    document.querySelector = original;
});

test('the icon picker offers a labeled choice for every template', () => {
    const { app, document } = createTestApp();
    app.populateIconPicker();
    const picker = document.getElementById('iconPicker');
    assert.equal(picker.children.length, 7, 'none plus the six templates');
    const expected = [
        ['', 'iconNone', 'No icon'],
        ['vacuum-attic', 'iconVacuumAttic', 'Roof'],
        ['vacuum-basement', 'iconVacuumBasement', 'Basement'],
        ['mop', 'iconMop', 'Mop'],
        ['squeegee', 'iconSqueegee', 'Window'],
        ['duster', 'iconDuster', 'Dust'],
        ['car', 'iconCar', 'Car']
    ];
    picker.children.forEach((option, index) => {
        const [id, key, label] = expected[index];
        assert.equal(option.dataset.icon, id, `option ${index} keeps its stable id`);
        assert.equal(option['aria-label'], label, `option ${index} has an accessible name`);
        assert.equal(option.title, label, `option ${index} has a tooltip`);
        assert.equal(option.dataset.i18nTitle, key);
        const labelNode = option.children.find(child => child.classList.contains('icon-option-label'));
        assert.ok(labelNode, `${id || 'none'} shows a visible label`);
        assert.equal(labelNode.textContent, label);
        assert.equal(labelNode.dataset.i18n, key, 'labels follow language changes');
        assert.ok(option.children.some(child => child.classList.contains('icon-option-svg')), `${id || 'none'} keeps its artwork`);
    });
});

function groupRect(containers, groupId) {
    const container = containers.filter(item => item.dataset.groupId === groupId).at(-1);
    assert.ok(container, `container for ${groupId}`);
    const left = Number.parseFloat(container.style.left);
    const top = Number.parseFloat(container.style.top);
    const width = Number.parseFloat(container.style.width);
    const height = Number.parseFloat(container.style.height);
    return { left, top, right: left + width, bottom: top + height, width, height };
}

function makeNestedHierarchyHarness(options = {}) {
    const harness = createGroupCanvasHarness();
    const { app, storageData } = harness;
    const baseX = options.baseX ?? 400;
    const baseY = options.baseY ?? 304;
    app.groups = [
        { id: 'nh-root', name: 'Root', x: baseX, y: baseY, collapsed: options.rootCollapsed === true },
        { id: 'nh-child', name: 'Child', x: baseX + 40, y: baseY + 40, collapsed: options.childCollapsed === true, parentId: 'nh-root' },
        { id: 'nh-grand', name: 'Grand', x: baseX + 80, y: baseY + 80, collapsed: options.grandCollapsed === true, parentId: 'nh-child' }
    ];
    app.activities = [
        { id: 'nh-r1', name: 'R1', position: 0, groupId: 'nh-root', size: 'medium' },
        { id: 'nh-c1', name: 'C1', position: 1, groupId: 'nh-child', size: 'medium' },
        { id: 'nh-g1', name: 'G1', position: 2, groupId: 'nh-grand', size: 'medium' }
    ];
    app.activityLayouts = new Map([
        ['nh-r1', { activityId: 'nh-r1', x: 0, y: 0, width: 200, height: 120 }],
        ['nh-c1', { activityId: 'nh-c1', x: 0, y: 0, width: 200, height: 120 }],
        ['nh-g1', { activityId: 'nh-g1', x: 0, y: 0, width: 200, height: 120 }]
    ]);
    storageData.groups = structuredClone(app.groups);
    storageData.activities = structuredClone(app.activities);
    storageData.layout = [...app.activityLayouts.values()].map(layout => structuredClone(layout));
    app.renderMain();
    return harness;
}

function makeGroupChain(depth, baseX = 200, baseY = 200) {
    const harness = createGroupCanvasHarness();
    const { app, storageData } = harness;
    app.groups = [];
    app.activities = [];
    app.activityLayouts = new Map();
    let parentId = null;
    for (let level = 0; level < depth; level += 1) {
        const id = `chain-${level}`;
        const group = {
            id,
            name: `Level ${level}`,
            x: baseX + level * 40,
            y: baseY + level * 40,
            collapsed: level === depth - 1
        };
        if (parentId) group.parentId = parentId;
        app.groups.push(group);
        const activityId = `${id}-activity`;
        app.activities.push({ id: activityId, name: `A${level}`, position: level, groupId: id, size: 'medium' });
        app.activityLayouts.set(activityId, { activityId, x: 0, y: 0, width: 200, height: 120 });
        parentId = id;
    }
    storageData.groups = structuredClone(app.groups);
    storageData.activities = structuredClone(app.activities);
    storageData.layout = [...app.activityLayouts.values()].map(layout => structuredClone(layout));
    app.renderMain();
    return harness;
}

test('root groups expand downward and rightward from their saved anchor', async () => {
    const harness = createGroupCanvasHarness();
    const { app } = harness;
    app.groups = [{ id: 'rx', name: 'R', x: 100, y: 100, collapsed: true }];
    app.activities = [
        { id: 'rx-1', name: 'A', position: 0, groupId: 'rx', size: 'medium' },
        { id: 'rx-2', name: 'B', position: 1, groupId: 'rx', size: 'medium' }
    ];
    app.activityLayouts = new Map([
        ['rx-1', { activityId: 'rx-1', x: 0, y: 0, width: 200, height: 120 }],
        ['rx-2', { activityId: 'rx-2', x: 300, y: 220, width: 200, height: 120 }]
    ]);
    app.renderMain();
    const collapsed = groupRect(harness.containers, 'rx');
    assert.equal(collapsed.left, 64, 'collapsed box starts on the grid at the anchor envelope');
    assert.equal(collapsed.top, 48, 'collapsed box starts on the grid at the anchor envelope');
    await app.toggleGroupCollapsed('rx');
    const expanded = groupRect(harness.containers, 'rx');
    assert.equal(expanded.left, collapsed.left, 'expansion never moves the left edge');
    assert.equal(expanded.top, collapsed.top, 'expansion never moves the top edge');
    assert.ok(expanded.right > collapsed.right, 'expansion grows rightward');
    assert.ok(expanded.bottom > collapsed.bottom, 'expansion grows downward');
    await app.toggleGroupCollapsed('rx');
    assert.deepEqual(groupRect(harness.containers, 'rx'), collapsed, 'collapsing restores the exact box');
    await app.toggleGroupCollapsed('rx');
    assert.deepEqual(groupRect(harness.containers, 'rx'), expanded, 're-expanding restores the exact box');
});

test('groups inside a parent expand downward and rightward within the parent layout', async () => {
    const harness = makeNestedHierarchyHarness({ childCollapsed: true });
    const { app } = harness;
    const rootBefore = groupRect(harness.containers, 'nh-root');
    const childBefore = groupRect(harness.containers, 'nh-child');
    assert.equal(harness.containers.some(item => item.dataset.groupId === 'nh-grand'), false, 'collapsing the child hides the grandchild');

    await app.toggleGroupCollapsed('nh-child');
    const rootAfter = groupRect(harness.containers, 'nh-root');
    const childAfter = groupRect(harness.containers, 'nh-child');
    const grandAfter = groupRect(harness.containers, 'nh-grand');
    assert.equal(childAfter.left, childBefore.left, 'the child expands from its own anchor');
    assert.equal(childAfter.top, childBefore.top);
    assert.ok(childAfter.right > childBefore.right, 'the child grows rightward inside the parent');
    assert.ok(childAfter.bottom > childBefore.bottom, 'the child grows downward inside the parent');
    assert.equal(rootAfter.left, rootBefore.left, 'the parent keeps its anchor');
    assert.equal(rootAfter.top, rootBefore.top);
    assert.ok(rootAfter.right >= childAfter.right, 'the parent contains the expanded child');
    assert.ok(rootAfter.bottom >= childAfter.bottom);
    assert.ok(grandAfter.left >= childAfter.left && grandAfter.top >= childAfter.top, 'the grandchild stays inside the child');
    assert.ok(grandAfter.right <= childAfter.right && grandAfter.bottom <= childAfter.bottom);
});

test('groups nested two or more levels deep follow the same predictable expansion rule', async () => {
    const harness = makeNestedHierarchyHarness({ grandCollapsed: true });
    const { app } = harness;
    const collapsed = {
        root: groupRect(harness.containers, 'nh-root'),
        child: groupRect(harness.containers, 'nh-child'),
        grand: groupRect(harness.containers, 'nh-grand')
    };
    await app.toggleGroupCollapsed('nh-grand');
    const expanded = {
        root: groupRect(harness.containers, 'nh-root'),
        child: groupRect(harness.containers, 'nh-child'),
        grand: groupRect(harness.containers, 'nh-grand')
    };
    assert.equal(expanded.grand.left, collapsed.grand.left, 'depth does not change the anchor rule');
    assert.equal(expanded.grand.top, collapsed.grand.top);
    assert.ok(expanded.grand.right > collapsed.grand.right, 'the deepest group grows rightward');
    assert.ok(expanded.grand.bottom > collapsed.grand.bottom, 'the deepest group grows downward');
    assert.equal(expanded.child.left, collapsed.child.left);
    assert.equal(expanded.child.top, collapsed.child.top);
    assert.ok(expanded.child.right >= expanded.grand.right && expanded.child.bottom >= expanded.grand.bottom);
    assert.equal(expanded.root.left, collapsed.root.left);
    assert.equal(expanded.root.top, collapsed.root.top);
    assert.ok(expanded.root.right >= expanded.child.right && expanded.root.bottom >= expanded.child.bottom);

    await app.toggleGroupCollapsed('nh-grand');
    assert.deepEqual(groupRect(harness.containers, 'nh-grand'), collapsed.grand);
    await app.toggleGroupCollapsed('nh-grand');
    assert.deepEqual(groupRect(harness.containers, 'nh-grand'), expanded.grand);
    assert.deepEqual(groupRect(harness.containers, 'nh-child'), expanded.child);
    assert.deepEqual(groupRect(harness.containers, 'nh-root'), expanded.root);
});

test('mixed hierarchies keep every container wrapping its own activities and children', () => {
    const harness = makeNestedHierarchyHarness();
    const { containers, buttons } = harness;
    const inside = (activityId, groupId) => {
        const button = buttons.find(item => item.dataset.activityId === activityId);
        assert.ok(button, `button ${activityId}`);
        const rect = groupRect(containers, groupId);
        const left = Number.parseFloat(button.style.left);
        const top = Number.parseFloat(button.style.top);
        const width = Number.parseFloat(button.style.width);
        const height = Number.parseFloat(button.style.height);
        return left >= rect.left && top >= rect.top && left + width <= rect.right && top + height <= rect.bottom;
    };
    assert.ok(inside('nh-r1', 'nh-root'), 'the root activity is inside the root container');
    assert.ok(inside('nh-c1', 'nh-child'), 'the child activity is inside the child container');
    assert.ok(inside('nh-g1', 'nh-grand'), 'the grandchild activity is inside the grandchild container');
    const root = groupRect(containers, 'nh-root');
    const child = groupRect(containers, 'nh-child');
    const grand = groupRect(containers, 'nh-grand');
    assert.ok(root.left <= child.left && root.top <= child.top && root.right >= child.right && root.bottom >= child.bottom, 'root wraps the child');
    assert.ok(child.left <= grand.left && child.top <= grand.top && child.right >= grand.right && child.bottom >= grand.bottom, 'child wraps the grandchild');
});

test('nested expansion near canvas boundaries never reverses direction', async () => {
    const harness = makeNestedHierarchyHarness({ baseX: 3200, baseY: 1980, grandCollapsed: true });
    const { app } = harness;
    const collapsed = groupRect(harness.containers, 'nh-grand');
    await app.toggleGroupCollapsed('nh-grand');
    const expanded = groupRect(harness.containers, 'nh-grand');
    assert.equal(expanded.left, collapsed.left, 'the far-right anchor is not nudged left');
    assert.equal(expanded.top, collapsed.top, 'the far-bottom anchor is not nudged up');
    assert.ok(expanded.right >= collapsed.right);
    assert.ok(expanded.bottom > collapsed.bottom);
    assert.ok(Number.isFinite(expanded.right) && Number.isFinite(expanded.bottom), 'coordinates stay finite near the boundary');
    const child = groupRect(harness.containers, 'nh-child');
    const root = groupRect(harness.containers, 'nh-root');
    assert.ok(child.right >= expanded.right && root.right >= child.right);
});

test('expanding or collapsing a parent keeps descendants directionally consistent', async () => {
    const harness = makeNestedHierarchyHarness();
    const { app } = harness;
    const baseline = {
        root: groupRect(harness.containers, 'nh-root'),
        child: groupRect(harness.containers, 'nh-child'),
        grand: groupRect(harness.containers, 'nh-grand')
    };
    await app.toggleGroupCollapsed('nh-root');
    assert.equal(harness.containers.some(item => item.dataset.groupId === 'nh-child'), false, 'collapsing the root hides the child');
    assert.equal(harness.containers.some(item => item.dataset.groupId === 'nh-grand'), false, 'collapsing the root hides the grandchild');
    await app.toggleGroupCollapsed('nh-root');
    assert.deepEqual(groupRect(harness.containers, 'nh-root'), baseline.root);
    assert.deepEqual(groupRect(harness.containers, 'nh-child'), baseline.child);
    assert.deepEqual(groupRect(harness.containers, 'nh-grand'), baseline.grand);

    await app.toggleGroupCollapsed('nh-child');
    const rootWithChildCollapsed = groupRect(harness.containers, 'nh-root');
    assert.equal(rootWithChildCollapsed.left, baseline.root.left, 'the parent stays anchored');
    assert.equal(rootWithChildCollapsed.top, baseline.root.top);
    assert.ok(rootWithChildCollapsed.right <= baseline.root.right, 'the parent shrinks with the hidden grandchild');
    assert.ok(rootWithChildCollapsed.bottom <= baseline.root.bottom);
    await app.toggleGroupCollapsed('nh-child');
    assert.deepEqual(groupRect(harness.containers, 'nh-root'), baseline.root);
    assert.deepEqual(groupRect(harness.containers, 'nh-child'), baseline.child);
    assert.deepEqual(groupRect(harness.containers, 'nh-grand'), baseline.grand);
});

test('repeated collapse and expand of a deeply nested group is stable', async () => {
    const harness = makeGroupChain(4, 200, 200);
    const { app } = harness;
    await app.toggleGroupCollapsed('chain-3');
    const expanded = [0, 1, 2, 3].map(level => groupRect(harness.containers, `chain-${level}`));
    const anchors = app.groups.map(group => ({ id: group.id, x: group.x, y: group.y }));
    for (let cycle = 0; cycle < 3; cycle += 1) {
        await app.toggleGroupCollapsed('chain-3');
        assert.equal(harness.containers.some(item => item.dataset.groupId === 'chain-3'), true, 'the deepest group still renders when collapsed');
        await app.toggleGroupCollapsed('chain-3');
    }
    [0, 1, 2, 3].forEach(level => {
        assert.deepEqual(groupRect(harness.containers, `chain-${level}`), expanded[level], `level ${level} is stable across cycles`);
    });
    assert.deepEqual(app.groups.map(group => ({ id: group.id, x: group.x, y: group.y })), anchors, 'saved anchors never change');
});

test('moved or resized ancestors keep nested expansion predictable', async () => {
    const harness = makeNestedHierarchyHarness({ grandCollapsed: true });
    const { app, containers, pointer } = harness;
    const relative = {
        child: { x: app.groups.find(g => g.id === 'nh-child').x - app.groups.find(g => g.id === 'nh-root').x, y: app.groups.find(g => g.id === 'nh-child').y - app.groups.find(g => g.id === 'nh-root').y },
        grand: { x: app.groups.find(g => g.id === 'nh-grand').x - app.groups.find(g => g.id === 'nh-child').x, y: app.groups.find(g => g.id === 'nh-grand').y - app.groups.find(g => g.id === 'nh-child').y }
    };
    const title = containers.filter(item => item.dataset.groupId === 'nh-root').at(-1).children[0];
    pointer('pointerdown', title, 400, 280);
    pointer('pointermove', title, 464, 344);
    pointer('pointerup', title, 464, 344);
    const root = app.groups.find(g => g.id === 'nh-root');
    const child = app.groups.find(g => g.id === 'nh-child');
    const grand = app.groups.find(g => g.id === 'nh-grand');
    assert.equal(root.x, 464, 'the dragged root is grid-snapped');
    assert.equal(root.y, 368);
    assert.equal(child.x - root.x, relative.child.x, 'the child keeps its relative position');
    assert.equal(child.y - root.y, relative.child.y);
    assert.equal(grand.x - child.x, relative.grand.x, 'the grandchild keeps its relative position');
    assert.equal(grand.y - child.y, relative.grand.y);

    await app.toggleGroupCollapsed('nh-grand');
    const expandedGrand = groupRect(containers, 'nh-grand');
    assert.equal(expandedGrand.left, app.floorToCanvasGrid(grand.x - 20), 'the moved descendant expands from its own anchor');
    assert.equal(expandedGrand.top, app.floorToCanvasGrid(grand.y - 36));
    await app.toggleGroupCollapsed('nh-grand');

    await app.toggleGroupCollapsed('nh-root');
    app.resizeCollapsedGroup(root, 420, 180);
    await app.toggleGroupCollapsed('nh-root');
    assert.equal(child.x - root.x, relative.child.x, 'resizing the collapsed ancestor never moves descendants');
    assert.equal(grand.x - child.x, relative.grand.x);
    await app.toggleGroupCollapsed('nh-grand');
    const afterResize = groupRect(containers, 'nh-grand');
    assert.equal(afterResize.left, app.floorToCanvasGrid(grand.x - 20), 'expansion stays anchored after an ancestor resize');
    assert.equal(afterResize.top, app.floorToCanvasGrid(grand.y - 36));
    assert.ok(afterResize.bottom > expandedGrand.bottom - 1, 'expansion still grows downward');
});

test('reloaded nested hierarchies retain structure and expansion behavior', async () => {
    const first = makeNestedHierarchyHarness({ grandCollapsed: true });
    const storedGroups = structuredClone(first.storageData.groups);
    const storedActivities = structuredClone(first.storageData.activities);
    const storedLayouts = structuredClone(first.storageData.layout);

    const harness = createGroupCanvasHarness();
    const { app, storageData, containers } = harness;
    storageData.groups = [...storedGroups].reverse();
    storageData.activities = storedActivities;
    storageData.layout = storedLayouts;
    await app.loadActivities();
    await app.loadGroups();
    app.renderMain();

    assert.equal(app.groups.length, 3);
    assert.equal(app.groups.find(group => group.id === 'nh-child').parentId, 'nh-root', 'hierarchy survives the reload');
    assert.equal(app.groups.find(group => group.id === 'nh-grand').parentId, 'nh-child');
    const collapsed = groupRect(containers, 'nh-grand');
    await app.toggleGroupCollapsed('nh-grand');
    const expanded = groupRect(containers, 'nh-grand');
    assert.equal(expanded.left, collapsed.left);
    assert.equal(expanded.top, collapsed.top);
    assert.ok(expanded.right > collapsed.right && expanded.bottom > collapsed.bottom, 'reloaded groups expand downward and rightward');
    const child = groupRect(containers, 'nh-child');
    const root = groupRect(containers, 'nh-root');
    assert.ok(child.right >= expanded.right && root.right >= child.right, 'the reloaded hierarchy stays nested');
    assert.ok(child.bottom >= expanded.bottom && root.bottom >= child.bottom);
});

test('root collision displacement carries every nested descendant by the same offset', () => {
    const harness = makeNestedHierarchyHarness();
    const { app } = harness;
    // A root that sorts before (and overlaps) the hierarchy anchors first and
    // pushes the whole hierarchy aside.
    app.groups.push({ id: 'nh-sibling', name: 'Sibling', x: 400, y: 200, collapsed: false });
    app.activities.push({ id: 'nh-s1', name: 'S1', position: 3, groupId: 'nh-sibling', size: 'medium' });
    app.activityLayouts.set('nh-s1', { activityId: 'nh-s1', x: 0, y: 0, width: 200, height: 120 });
    app.renderMain();

    const rootOffset = { ...app.groupDisplayOffset('nh-root') };
    const childOffset = { ...app.groupDisplayOffset('nh-child') };
    const grandOffset = { ...app.groupDisplayOffset('nh-grand') };
    assert.ok(rootOffset.x !== 0 || rootOffset.y !== 0, 'the sibling displaced the hierarchy');
    assert.deepEqual(childOffset, rootOffset, 'the child inherits the root offset');
    assert.deepEqual(grandOffset, rootOffset, 'the grandchild inherits the root offset');
    const root = groupRect(harness.containers, 'nh-root');
    const child = groupRect(harness.containers, 'nh-child');
    const grand = groupRect(harness.containers, 'nh-grand');
    assert.equal((child.left - root.left) % 16, 0, 'relative positions remain grid-discrete under displacement');
    assert.equal((grand.left - child.left) % 16, 0);
    assert.equal((child.top - root.top) % 16, 0);
    assert.equal((grand.top - child.top) % 16, 0);
    const rootBase = { ...app.groupBaseBounds(app.groups.find(group => group.id === 'nh-root')) };
    const grandBase = { ...app.groupBaseBounds(app.groups.find(group => group.id === 'nh-grand')) };
    assert.equal(root.left, rootBase.left + rootOffset.x, 'the root is displayed at its base bounds plus the offset');
    assert.equal(root.top, rootBase.top + rootOffset.y);
    assert.equal(grand.top, grandBase.top + rootOffset.y, 'the grandchild inherits the same offset');
});

test('overlapping nested siblings keep the latest expansion anchored and step aside', () => {
    const harness = createGroupCanvasHarness();
    const { app } = harness;
    app.groups = [
        { id: 'ns-parent', name: 'Parent', x: 300, y: 300, collapsed: false },
        { id: 'ns-a', name: 'A', x: 340, y: 340, collapsed: false, parentId: 'ns-parent' },
        { id: 'ns-b', name: 'B', x: 340, y: 340, collapsed: false, parentId: 'ns-parent' }
    ];
    app.activities = [
        { id: 'ns-a1', name: 'A1', position: 0, groupId: 'ns-a', size: 'medium' },
        { id: 'ns-b1', name: 'B1', position: 1, groupId: 'ns-b', size: 'medium' }
    ];
    app.activityLayouts = new Map([
        ['ns-a1', { activityId: 'ns-a1', x: 0, y: 0, width: 200, height: 120 }],
        ['ns-b1', { activityId: 'ns-b1', x: 0, y: 0, width: 200, height: 120 }]
    ]);
    app.renderMain();
    const a = groupRect(harness.containers, 'ns-a');
    const b = groupRect(harness.containers, 'ns-b');
    const parent = groupRect(harness.containers, 'ns-parent');
    assert.deepEqual({ ...app.groupDisplayOffset('ns-b') }, { x: 0, y: 0 }, 'the latest nested expansion keeps its anchor');
    assert.deepEqual({ ...app.groupDisplayOffset('ns-a') }, { x: 0, y: 224 }, 'the overlapping nested sibling steps down');
    assert.equal(a.left, b.left, 'the temporary displacement stays directional');
    assert.equal(a.top, b.bottom + 16, 'the sibling clears the anchored sibling by the shared gap');
    assert.ok(parent.bottom >= a.bottom, 'the parent wraps the displaced sibling');
    assert.ok(parent.right >= a.right && parent.right >= b.right);
});

test('expanding a nested group moves overlapping siblings so activity cards stay clear', async () => {
    const harness = createGroupCanvasHarness();
    const { app, containers, buttons } = harness;
    app.groups = [
        { id: 'mittwoch', name: 'MITTWOCH', x: 100, y: 100, collapsed: false },
        { id: 'herten1', name: '1 HERTEN', x: 140, y: 300, collapsed: false, parentId: 'mittwoch' },
        { id: 'herten2', name: '2 HERTEN', x: 700, y: 300, collapsed: false, parentId: 'mittwoch' },
        { id: 'gladbeck', name: '3 GLADBECK', x: 140, y: 700, collapsed: true, parentId: 'mittwoch' },
        { id: 'four', name: '4', x: 140, y: 1020, collapsed: true, parentId: 'mittwoch' }
    ];
    app.activities = [
        { id: 'h1a', name: 'H1A', position: 0, groupId: 'herten1', size: 'small' },
        { id: 'h2a', name: 'H2A', position: 1, groupId: 'herten2', size: 'small' },
        { id: 'g1', name: 'Treppenhäuser Theodorstraße 29-33 (Oleksandr)', position: 2, groupId: 'gladbeck', size: 'small' },
        { id: 'g2', name: 'G2', position: 3, groupId: 'gladbeck', size: 'small' },
        { id: 'g3', name: 'G3', position: 4, groupId: 'gladbeck', size: 'small' },
        { id: 'f1', name: 'F1', position: 5, groupId: 'four', size: 'small' }
    ];
    app.activityLayouts = new Map([
        ['h1a', { activityId: 'h1a', x: 0, y: 0, width: 220, height: 120 }],
        ['h2a', { activityId: 'h2a', x: 0, y: 0, width: 220, height: 120 }],
        ['g1', { activityId: 'g1', x: 0, y: 0, width: 320, height: 190 }],
        ['g2', { activityId: 'g2', x: 380, y: 0, width: 220, height: 120 }],
        ['g3', { activityId: 'g3', x: 0, y: 220, width: 220, height: 120 }],
        ['f1', { activityId: 'f1', x: 0, y: 0, width: 220, height: 120 }]
    ]);
    app.renderMain();
    const activityRect = id => {
        const button = buttons.find(item => item.dataset.activityId === id);
        assert.ok(button, `button ${id}`);
        const left = Number.parseFloat(button.style.left);
        const top = Number.parseFloat(button.style.top);
        return { left, top, right: left + Number.parseFloat(button.style.width), bottom: top + Number.parseFloat(button.style.height) };
    };
    const intersects = (a, b) => a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
    const gladbeckCollapsed = groupRect(containers, 'gladbeck');
    const fourBefore = groupRect(containers, 'four');
    const mittwochBefore = groupRect(containers, 'mittwoch');
    assert.equal(intersects(gladbeckCollapsed, fourBefore), false, 'the collapsed state has no overlap');

    await app.toggleGroupCollapsed('gladbeck');
    const gladbeck = groupRect(containers, 'gladbeck');
    const four = groupRect(containers, 'four');
    const herten1 = groupRect(containers, 'herten1');
    const herten2 = groupRect(containers, 'herten2');
    const mittwoch = groupRect(containers, 'mittwoch');

    assert.deepEqual({ ...app.groupDisplayOffset('gladbeck') }, { x: 0, y: 0 }, 'the expanded group keeps its anchor');
    assert.equal(four.top, fourBefore.top + (gladbeck.bottom + 16 - fourBefore.top), 'the sibling below is pushed down by the expanded bounds');
    assert.equal(four.left, fourBefore.left, 'the shared rule shifts downward, not sideways, when that is the smaller move');
    for (const id of ['g1', 'g2', 'g3']) {
        const card = activityRect(id);
        assert.ok(card.left >= gladbeck.left && card.top >= gladbeck.top && card.right <= gladbeck.right && card.bottom <= gladbeck.bottom, `${id} stays inside 3 GLADBECK`);
        assert.equal(intersects(card, four), false, `${id} does not overlap sibling 4`);
        assert.equal(intersects(card, herten1), false, `${id} does not overlap 1 HERTEN`);
        assert.equal(intersects(card, herten2), false, `${id} does not overlap 2 HERTEN`);
    }
    assert.equal(intersects(gladbeck, four), false, 'the expanded container does not overlap sibling 4');
    assert.ok(mittwoch.right >= gladbeck.right && mittwoch.bottom >= four.bottom, 'the parent wraps the displaced sibling');
    assert.ok(mittwoch.left <= gladbeck.left && mittwoch.top <= gladbeck.top);

    await app.toggleGroupCollapsed('gladbeck');
    assert.deepEqual(groupRect(containers, 'gladbeck'), gladbeckCollapsed, 'collapsing restores the collapsed box');
    assert.deepEqual(groupRect(containers, 'four'), fourBefore, 'collapsing returns the sibling to its intended position');
    assert.deepEqual(groupRect(containers, 'mittwoch'), mittwochBefore, 'collapsing restores the parent');

    await app.toggleGroupCollapsed('gladbeck');
    assert.deepEqual(groupRect(containers, 'gladbeck'), gladbeck, 're-expansion is stable');
    assert.deepEqual(groupRect(containers, 'four'), four, 'the sibling displacement is reproducible');
    assert.deepEqual(groupRect(containers, 'mittwoch'), mittwoch);
});

test('sibling displacement recurses through multiple nesting depths', async () => {
    const harness = createGroupCanvasHarness();
    const { app, containers } = harness;
    app.groups = [
        { id: 'deep-root', name: 'Root', x: 100, y: 100, collapsed: false },
        { id: 'deep-mid', name: 'Mid', x: 400, y: 400, collapsed: false, parentId: 'deep-root' },
        { id: 'deep-a', name: 'A', x: 440, y: 440, collapsed: true, parentId: 'deep-mid' },
        { id: 'deep-b', name: 'B', x: 440, y: 600, collapsed: true, parentId: 'deep-mid' }
    ];
    app.activities = [
        { id: 'deep-m1', name: 'M1', position: 0, groupId: 'deep-mid', size: 'small' },
        { id: 'deep-a1', name: 'A1', position: 1, groupId: 'deep-a', size: 'small' },
        { id: 'deep-b1', name: 'B1', position: 2, groupId: 'deep-b', size: 'small' }
    ];
    app.activityLayouts = new Map([
        ['deep-m1', { activityId: 'deep-m1', x: 600, y: 0, width: 220, height: 120 }],
        ['deep-a1', { activityId: 'deep-a1', x: 0, y: 0, width: 220, height: 120 }],
        ['deep-b1', { activityId: 'deep-b1', x: 0, y: 0, width: 220, height: 120 }]
    ]);
    app.renderMain();
    const bCollapsed = groupRect(containers, 'deep-b');
    await app.toggleGroupCollapsed('deep-a');
    const a = groupRect(containers, 'deep-a');
    const b = groupRect(containers, 'deep-b');
    const mid = groupRect(containers, 'deep-mid');
    const root = groupRect(containers, 'deep-root');
    assert.equal(b.top, a.bottom + 16, 'the depth-2 sibling is pushed below the expanded sibling');
    assert.equal(b.left, bCollapsed.left, 'the depth-2 displacement stays directional');
    assert.ok(mid.bottom >= b.bottom && mid.right >= b.right, 'the parent at depth 1 wraps the displaced child');
    assert.ok(root.bottom >= mid.bottom && root.right >= mid.right, 'the root at depth 0 wraps the whole subtree');
    assert.deepEqual({ ...app.groupDisplayOffset('deep-b') }, { x: 0, y: b.top - bCollapsed.top }, 'the depth-2 offset is local to its parent');
    assert.deepEqual({ ...app.groupDisplayOffset('deep-mid') }, { x: 0, y: 0 }, 'the intermediate parent is not displaced');
    await app.toggleGroupCollapsed('deep-a');
    assert.deepEqual(groupRect(containers, 'deep-b'), bCollapsed, 'collapsing the expressive sibling restores the other');
    await app.toggleGroupCollapsed('deep-a');
    assert.deepEqual(groupRect(containers, 'deep-b'), b, 're-expansion reproduces the same depth-2 layout');
});

function activityCardRect(buttons, activityId) {
    const button = buttons.find(item => item.dataset.activityId === activityId);
    assert.ok(button, `button ${activityId}`);
    const left = Number.parseFloat(button.style.left);
    const top = Number.parseFloat(button.style.top);
    const width = Number.parseFloat(button.style.width);
    const height = Number.parseFloat(button.style.height);
    return { left, top, right: left + width, bottom: top + height, width, height };
}

function rectanglesIntersect(a, b) {
    return a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
}

function makeVerticalSiblingsHarness({ baseX = 300, baseY = 340 } = {}) {
    const harness = createGroupCanvasHarness();
    const { app, storageData } = harness;
    const childIds = ['v-1', 'v-2', 'v-3', 'v-4'];
    app.groups = [
        { id: 'v-parent', name: 'Parent', x: baseX, y: baseY - 40, collapsed: false },
        ...childIds.map((id, index) => ({
            id,
            name: `Child ${index + 1}`,
            x: baseX + 40,
            y: baseY + index * 100,
            collapsed: true,
            parentId: 'v-parent'
        }))
    ];
    app.activities = childIds.map((id, index) => ({
        id: `${id}-a`,
        name: `Activity ${index + 1}`,
        position: index,
        groupId: id,
        size: 'small'
    }));
    app.activityLayouts = new Map(app.activities.map(activity => [
        activity.id,
        { activityId: activity.id, x: 0, y: 0, width: 220, height: 120 }
    ]));
    storageData.groups = structuredClone(app.groups);
    storageData.activities = structuredClone(app.activities);
    storageData.layout = [...app.activityLayouts.values()].map(layout => structuredClone(layout));
    app.renderMain();
    return { harness, childIds };
}

test('a parent with four vertical children moves only later siblings on expansion', async () => {
    const { harness, childIds } = makeVerticalSiblingsHarness();
    const { app, containers, buttons } = harness;
    const collapsedRects = childIds.map(id => groupRect(containers, id));
    assert.deepEqual(
        collapsedRects.map(rect => rect.top),
        [288, 400, 496, 592],
        'collapsed siblings start at their anchors'
    );
    const collapseChildren = () => {
        for (const group of app.groups) {
            if (group.parentId === 'v-parent') group.collapsed = true;
        }
        app.renderMain();
    };

    for (let target = 0; target < childIds.length; target += 1) {
        collapseChildren();
        await app.toggleGroupCollapsed(childIds[target]);
        const state = childIds.map(id => groupRect(containers, id));
        for (let index = 0; index < state.length; index += 1) {
            const expectedTop = index === 0
                ? collapsedRects[0].top
                : collapsedRects[index].top >= state[index - 1].bottom
                    ? collapsedRects[index].top
                    : state[index - 1].bottom + 16;
            assert.equal(state[index].top, expectedTop, `${childIds[index]} follows the downward stacking rule`);
            assert.equal(state[index].left, collapsedRects[index].left, `${childIds[index]} never moves sideways`);
            if (index !== target) {
                assert.equal(state[index].right, collapsedRects[index].right, `${childIds[index]} keeps its collapsed width`);
            }
        }
        assert.deepEqual({ ...app.groupDisplayOffset(childIds[target]) }, { x: 0, y: 0 }, `the expanded ${childIds[target]} stays at its anchor`);
        for (let index = 0; index < target; index += 1) {
            assert.deepEqual(state[index], collapsedRects[index], `earlier sibling ${childIds[index]} stays stationary`);
            assert.deepEqual({ ...app.groupDisplayOffset(childIds[index]) }, { x: 0, y: 0 });
        }
        for (let first = 0; first < state.length; first += 1) {
            for (let second = first + 1; second < state.length; second += 1) {
                assert.equal(groupOverlaps(state[first], state[second]), false, 'placed siblings never overlap');
            }
        }
        const parent = groupRect(containers, 'v-parent');
        for (const rect of state) {
            assert.ok(
                parent.left <= rect.left && parent.top <= rect.top && parent.right >= rect.right && parent.bottom >= rect.bottom,
                'the parent wraps every placed child'
            );
        }
        for (const activity of app.activities) {
            if (app.groups.find(group => group.id === activity.groupId).collapsed) continue;
            const card = activityCardRect(buttons, activity.id);
            const own = groupRect(containers, activity.groupId);
            assert.ok(
                card.left >= own.left && card.top >= own.top && card.right <= own.right && card.bottom <= own.bottom,
                `${activity.id} stays inside its group`
            );
            for (const id of childIds) {
                if (id === activity.groupId) continue;
                assert.equal(rectanglesIntersect(card, groupRect(containers, id)), false, `${activity.id} stays clear of ${id}`);
            }
        }
        collapseChildren();
        childIds.forEach((id, index) => {
            assert.deepEqual(groupRect(containers, id), collapsedRects[index], `collapsing ${id} resets it exactly`);
        });
    }
    assert.deepEqual(
        app.groups.filter(group => group.parentId === 'v-parent').map(group => [group.x, group.y]),
        [[340, 340], [340, 440], [340, 540], [340, 640]],
        'saved anchors never change'
    );
});

test('multiple expansions in sequence accumulate downward without moving earlier siblings', async () => {
    const { harness, childIds } = makeVerticalSiblingsHarness();
    const { app, containers } = harness;
    await app.toggleGroupCollapsed('v-1');
    const afterFirst = childIds.map(id => groupRect(containers, id));
    await app.toggleGroupCollapsed('v-2');
    const afterSecond = childIds.map(id => groupRect(containers, id));
    await app.toggleGroupCollapsed('v-3');
    const afterThird = childIds.map(id => groupRect(containers, id));

    assert.deepEqual(afterSecond[0], afterFirst[0], 'expanding the second child never moves the first');
    assert.deepEqual(afterThird[0], afterFirst[0], 'expanding the third child never moves the first');
    assert.deepEqual(afterThird[1], afterSecond[1], 'expanding the third child never moves the second');
    assert.equal(afterSecond[1].top, afterFirst[1].top, 'the already-displaced second child keeps its displayed position');
    assert.equal(afterThird[2].top, afterSecond[2].top, 'the already-displaced third child keeps its displayed position');
    assert.ok(afterThird[3].top > afterSecond[3].top, 'the next sibling is pushed further down');
    for (const state of [afterFirst, afterSecond, afterThird]) {
        for (let first = 0; first < state.length; first += 1) {
            for (let second = first + 1; second < state.length; second += 1) {
                assert.equal(groupOverlaps(state[first], state[second]), false);
            }
        }
    }
});

test('nested and mixed hierarchies stack downward at every depth', async () => {
    const harness = createGroupCanvasHarness();
    const { app, containers, buttons } = harness;
    app.groups = [
        { id: 'mix-root', name: 'Root', x: 100, y: 100, collapsed: false },
        { id: 'mix-mid', name: 'Mid', x: 140, y: 140, collapsed: false, parentId: 'mix-root' },
        { id: 'mix-s1', name: 'S1', x: 180, y: 200, collapsed: true, parentId: 'mix-mid' },
        { id: 'mix-s2', name: 'S2', x: 180, y: 320, collapsed: true, parentId: 'mix-mid' },
        { id: 'mix-g1', name: 'G1', x: 220, y: 260, collapsed: true, parentId: 'mix-s1' }
    ];
    app.activities = [
        { id: 'mix-r1', name: 'R1', position: 0, groupId: 'mix-root', size: 'small' },
        { id: 'mix-m1', name: 'M1', position: 1, groupId: 'mix-mid', size: 'small' },
        { id: 'mix-s1a', name: 'S1A', position: 2, groupId: 'mix-s1', size: 'small' },
        { id: 'mix-s2a', name: 'S2A', position: 3, groupId: 'mix-s2', size: 'small' },
        { id: 'mix-g1a', name: 'G1A', position: 4, groupId: 'mix-g1', size: 'small' }
    ];
    app.activityLayouts = new Map([
        ['mix-r1', { activityId: 'mix-r1', x: 600, y: 0, width: 220, height: 120 }],
        ['mix-m1', { activityId: 'mix-m1', x: 600, y: 0, width: 220, height: 120 }],
        ['mix-s1a', { activityId: 'mix-s1a', x: 0, y: 0, width: 220, height: 120 }],
        ['mix-s2a', { activityId: 'mix-s2a', x: 0, y: 0, width: 220, height: 120 }],
        ['mix-g1a', { activityId: 'mix-g1a', x: 0, y: 0, width: 220, height: 120 }]
    ]);
    app.renderMain();
    const s1Collapsed = groupRect(containers, 'mix-s1');
    const s2Collapsed = groupRect(containers, 'mix-s2');

    await app.toggleGroupCollapsed('mix-s1');
    const s1 = groupRect(containers, 'mix-s1');
    const s2 = groupRect(containers, 'mix-s2');
    const mid = groupRect(containers, 'mix-mid');
    const root = groupRect(containers, 'mix-root');
    assert.equal(s1.top, s1Collapsed.top, 'the expanded nested group stays at its anchor');
    assert.equal(s2.top, s1.bottom + 16, 'the later sibling stacks below the expanded group');
    assert.equal(s2.left, s2Collapsed.left, 'the nested sibling never moves sideways');
    assert.equal(groupRect(containers, 'mix-g1').top, 208, 'the nested child keeps its frame inside s1');
    assert.equal(groupRect(containers, 'mix-g1').left, 192, 'the nested child keeps its column inside s1');
    assert.ok(s1.bottom >= groupRect(containers, 'mix-g1').bottom - 20, 's1 wraps its collapsed child');
    assert.ok(mid.bottom >= s2.bottom && mid.right >= s1.right, 'the middle ancestor wraps the displaced children');
    assert.ok(root.bottom >= mid.bottom && root.right >= mid.right, 'the root wraps the whole mixed subtree');
    for (const cardId of ['mix-r1', 'mix-m1', 'mix-s1a']) {
        const card = activityCardRect(buttons, cardId);
        assert.equal(rectanglesIntersect(card, s2), false, `${cardId} stays clear of the displaced sibling`);
    }
    assert.equal(buttons.some(button => button.dataset.activityId === 'mix-s2a'), false, 'a collapsed sibling renders no cards');

    await app.toggleGroupCollapsed('mix-g1');
    const s2AfterGrandchild = groupRect(containers, 'mix-s2');
    assert.ok(s2AfterGrandchild.top > s2.top, 'expanding a grandchild pushes the later sibling down');
    assert.ok(groupRect(containers, 'mix-mid').bottom >= s2AfterGrandchild.bottom, 'the ancestor wraps the deeper displacement');

    await app.toggleGroupCollapsed('mix-g1');
    await app.toggleGroupCollapsed('mix-s1');
    assert.deepEqual(groupRect(containers, 'mix-s2'), s2Collapsed, 'collapsing everything restores the original layout');
});

test('four vertical siblings near canvas boundaries keep stacking downward', async () => {
    const { harness, childIds } = makeVerticalSiblingsHarness({ baseX: 3200, baseY: 2000 });
    const { app, containers } = harness;
    const collapsedRects = childIds.map(id => groupRect(containers, id));
    await app.toggleGroupCollapsed('v-2');
    const state = childIds.map(id => groupRect(containers, id));
    for (let index = 0; index < state.length; index += 1) {
        assert.ok(Number.isFinite(state[index].left) && Number.isFinite(state[index].top), 'coordinates stay finite');
        assert.equal(state[index].left, collapsedRects[index].left, 'no leftward movement at the boundary');
        const expectedTop = index === 0
            ? collapsedRects[0].top
            : collapsedRects[index].top >= state[index - 1].bottom
                ? collapsedRects[index].top
                : state[index - 1].bottom + 16;
        assert.equal(state[index].top, expectedTop, 'the boundary does not reverse the stacking direction');
    }
    assert.deepEqual(state[0], collapsedRects[0], 'the earlier sibling stays at the far-edge anchor');
});

test('dragging a sibling before expansion keeps the deterministic sequence', async () => {
    const { harness, childIds } = makeVerticalSiblingsHarness();
    const { app, containers, pointer } = harness;
    const title = containers.filter(item => item.dataset.groupId === 'v-4').at(-1).children[0];
    const start = app.groups.find(group => group.id === 'v-4');
    pointer('pointerdown', title, 340, 620);
    pointer('pointermove', title, 340, 684);
    pointer('pointerup', title, 340, 684);
    assert.equal(start.y, 704, 'the dragged anchor is grid-snapped');
    assert.equal(start.x, 336, 'the untouched axis is still snapped to the grid');
    await app.toggleGroupCollapsed('v-2');
    const state = childIds.map(id => groupRect(containers, id));
    assert.equal(state[3].left, app.floorToCanvasGrid(start.x - 20), 'the dragged sibling renders from its saved dragged anchor');
    assert.equal(state[3].width, groupRect(containers, 'v-1').width, 'the dragged sibling keeps its own width');
    assert.ok(state[3].top >= start.y - 36, 'the dragged sibling is never pulled above its saved anchor');
    for (let first = 0; first < state.length; first += 1) {
        for (let second = first + 1; second < state.length; second += 1) {
            assert.equal(groupOverlaps(state[first], state[second]), false);
        }
    }
});

test('reloaded four-sibling hierarchies expand identically in any storage order', async () => {
    const { harness: first, childIds } = makeVerticalSiblingsHarness();
    await first.app.loadActivities();
    await first.app.loadGroups();
    first.app.renderMain();
    await first.app.toggleGroupCollapsed('v-2');
    const expected = childIds.map(id => groupRect(first.containers, id));
    const storedGroups = structuredClone(first.storageData.groups);
    const storedActivities = structuredClone(first.storageData.activities);
    const storedLayouts = structuredClone(first.storageData.layout);

    const reloaded = createGroupCanvasHarness();
    const { app, storageData, containers } = reloaded;
    storageData.groups = [...storedGroups].reverse();
    storageData.activities = storedActivities;
    storageData.layout = storedLayouts;
    await app.loadActivities();
    await app.loadGroups();
    app.renderMain();
    assert.equal(app.groups.find(group => group.id === 'v-2').collapsed, false, 'the saved expanded state reloads');
    const actual = childIds.map(id => groupRect(containers, id));
    assert.deepEqual(actual, expected, 'the reloaded hierarchy expands to the same rectangles');
    for (const id of childIds) {
        assert.equal(app.groups.find(group => group.id === id).parentId, 'v-parent', 'nesting survives the reload');
    }
});

test('root siblings keep the latest expansion anchored and shift the other by the smaller move', async () => {
    const harness = createGroupCanvasHarness();
    const { app, containers } = harness;
    app.groups = [
        { id: 'root-a', name: 'A', x: 100, y: 100, collapsed: false },
        { id: 'root-b', name: 'B', x: 100, y: 200, collapsed: false }
    ];
    app.activities = [
        { id: 'root-a1', name: 'A1', position: 0, groupId: 'root-a', size: 'small' },
        { id: 'root-b1', name: 'B1', position: 1, groupId: 'root-b', size: 'small' }
    ];
    app.activityLayouts = new Map([
        ['root-a1', { activityId: 'root-a1', x: 0, y: 0, width: 220, height: 120 }],
        ['root-b1', { activityId: 'root-b1', x: 0, y: 0, width: 220, height: 120 }]
    ]);
    app.renderMain();
    const a = groupRect(containers, 'root-a');
    const b = groupRect(containers, 'root-b');
    assert.deepEqual({ ...app.groupDisplayOffset('root-b') }, { x: 0, y: 0 }, 'the latest root expansion stays anchored');
    assert.deepEqual({ ...app.groupDisplayOffset('root-a') }, { x: 304, y: 0 }, 'the overlapping root sibling takes the smaller rightward move');
    assert.equal(a.left, b.right + 16, 'the displaced sibling clears the anchor by the shared gap');
    assert.equal(a.top, 48, 'the displacement does not add an unnecessary vertical move');
    assert.equal(groupOverlaps(a, b), false, 'the root siblings do not overlap');
    assert.equal(app.groups[0].x, 100, 'the root anchor is untouched');
    assert.equal(app.groups[1].y, 200, 'the saved layout is untouched');
});

test('tightly packed random groups keep anchors and restore exactly', async () => {
    let seed = 987654321;
    const random = () => {
        seed = (seed * 1664525 + 1013904223) % 4294967296;
        return seed / 4294967296;
    };
    for (let scenario = 0; scenario < 36; scenario += 1) {
        const harness = createGroupCanvasHarness();
        const { app, containers } = harness;
        app.groups = Array.from({ length: 5 }, (unused, index) => ({
            id: `packed-${index}`,
            name: `Packed ${index}`,
            x: 100 + Math.floor(random() * 7) * 16,
            y: 100 + Math.floor(random() * 7) * 16,
            collapsed: true
        }));
        app.activities = app.groups.map((group, index) => ({
            id: `${group.id}-1`, name: `${group.id}-1`, position: index, groupId: group.id, size: 'medium'
        }));
        app.activityLayouts = new Map(app.activities.map(activity => [
            activity.id, { activityId: activity.id, x: 0, y: 0, width: 200, height: 120 }
        ]));
        app.renderMain();
        const ids = app.groups.map(group => group.id);
        const rects = () => ids.map(id => groupRect(containers, id));
        for (let step = 0; step < 5; step += 1) {
            const before = rects();
            const target = ids[Math.floor(random() * ids.length)];
            const targetBefore = groupRect(containers, target);
            await app.toggleGroupCollapsed(target);
            const expanded = rects();
            assert.equal(groupRect(containers, target).left, targetBefore.left, `scenario ${scenario}: left anchor`);
            assert.equal(groupRect(containers, target).top, targetBefore.top, `scenario ${scenario}: top anchor`);
            for (let first = 0; first < ids.length; first += 1) {
                for (let second = first + 1; second < ids.length; second += 1) {
                    assert.equal(groupOverlaps(expanded[first], expanded[second]), false, `scenario ${scenario}: ${ids[first]} and ${ids[second]} overlap`);
                }
            }
            await app.toggleGroupCollapsed(target);
            assert.deepEqual(rects(), before, `scenario ${scenario}: collapse restores every group exactly`);
        }
    }
});

test('nested expansions keep every anchor and restore every cycle across varied layouts', async () => {
    let state = 123456789;
    const random = () => {
        state = (state * 1103515245 + 12345) % 2147483648;
        return state / 2147483648;
    };
    for (let scenario = 0; scenario < 24; scenario += 1) {
        const harness = createGroupCanvasHarness();
        const { app, containers } = harness;
        app.groups = [{ id: 'fuzz-parent', name: 'Parent', x: 200, y: 200, collapsed: random() < 0.25 }];
        app.activities = [];
        app.activityLayouts = new Map();
        for (let index = 0; index < 4; index += 1) {
            const id = `fuzz-child-${index}`;
            app.groups.push({
                id,
                name: `Child ${index}`,
                x: 240 + Math.round(random() * 3) * 16,
                y: 240 + Math.round(random() * 6) * 24,
                collapsed: random() < 0.6,
                parentId: 'fuzz-parent'
            });
            app.activities.push({ id: `${id}-a`, name: `${id}-a`, position: index, groupId: id, size: 'medium' });
            app.activityLayouts.set(`${id}-a`, { activityId: `${id}-a`, x: 0, y: 0, width: 200, height: 120 });
        }
        app.renderMain();
        if (app.groups[0].collapsed) await app.toggleGroupCollapsed('fuzz-parent');
        const parentRect = () => groupRect(containers, 'fuzz-parent');
        const parentBefore = parentRect();
        const targets = app.groups.slice(1).filter(group => group.collapsed).map(group => group.id);
        for (const target of targets) {
            const before = app.groups.filter(group => app.isGroupVisible(group))
                .map(group => [group.id, groupRect(containers, group.id)]);
            const targetBefore = groupRect(containers, target);
            await app.toggleGroupCollapsed(target);
            assert.equal(groupRect(containers, target).left, targetBefore.left, `scenario ${scenario}: ${target} left anchor`);
            assert.equal(groupRect(containers, target).top, targetBefore.top, `scenario ${scenario}: ${target} top anchor`);
            assert.equal(parentRect().left, parentBefore.left, `scenario ${scenario}: parent left anchor`);
            assert.equal(parentRect().top, parentBefore.top, `scenario ${scenario}: parent top anchor`);
            const visible = app.groups.filter(group => app.isGroupVisible(group));
            for (let first = 0; first < visible.length; first += 1) {
                for (let second = first + 1; second < visible.length; second += 1) {
                    if (visible[first].parentId === visible[second].id || visible[second].parentId === visible[first].id) continue;
                    assert.equal(groupOverlaps(groupRect(containers, visible[first].id), groupRect(containers, visible[second].id)), false, `scenario ${scenario}: no overlaps`);
                }
            }
            await app.toggleGroupCollapsed(target);
            for (const [id, rect] of before) {
                assert.deepEqual(groupRect(containers, id), rect, `scenario ${scenario}: ${target} collapse restores ${id}`);
            }
        }
    }
});

test('backup validation rejects malformed records before touching the database', async () => {
    const { context } = createTestApp();
    const repository = vm.runInContext('new StorageRepository()', context);
    const harness = createIndexedDbHarness();
    repository.db = harness.db;
    harness.data.activities.set('keep', { id: 'keep', name: 'Keep' });
    harness.data.timeEntries.set('keep-entry', { id: 'keep-entry', activityId: 'keep', startTimestamp: 1, endTimestamp: 2 });
    const base = { format: 'timerhub-backup', version: 1, activities: [], timeEntries: [], settings: {} };
    const cases = [
        ['null activity', { ...base, activities: [null] }],
        ['missing id', { ...base, activities: [{ name: 'No id' }] }],
        ['wrong position type', { ...base, activities: [{ id: 'a', position: 'first' }] }],
        ['entry without activity', { ...base, timeEntries: [{ id: 'e', startTimestamp: 1, endTimestamp: 2 }] }],
        ['entry with bad timestamp', { ...base, timeEntries: [{ id: 'e', activityId: 'a', startTimestamp: 'soon', endTimestamp: 2 }] }],
        ['layout without key', { ...base, layout: [{ x: 1 }] }],
        ['group with bad coordinates', { ...base, groups: [{ id: 'g', x: 'left' }] }],
        ['invalid settings map', { ...base, settings: [] }],
        ['unsupported version', { ...base, version: 2 }],
        ['unknown format', { ...base, format: 'some-other-format' }],
        ['duplicate activity ids', { ...base, activities: [{ id: 'dup', name: 'One' }, { id: 'dup', name: 'Two' }] }],
        ['duplicate entry ids', { ...base, timeEntries: [{ id: 'e', activityId: 'a', startTimestamp: 1, endTimestamp: 2 }, { id: 'e', activityId: 'a', startTimestamp: 3, endTimestamp: 4 }] }],
        ['not an object', JSON.stringify({ activities: [], timeEntries: [] })]
    ];
    for (const [label, payload] of cases) {
        await assert.rejects(() => repository.importAll(payload, false), /invalid_backup/, label);
        assert.equal(harness.data.activities.has('keep'), true, `${label}: activities untouched`);
        assert.equal(harness.data.timeEntries.has('keep-entry'), true, `${label}: entries untouched`);
    }
    assert.doesNotThrow(() => repository.validateBackupData({ activities: [{ id: 'ok', name: 'Legacy' }], timeEntries: [] }));
});

test('failed replace import rolls back and keeps the original database intact', async () => {
    const { context } = createTestApp();
    const repository = vm.runInContext('new StorageRepository()', context);
    const harness = createIndexedDbHarness();
    repository.db = harness.db;
    harness.data.activities.set('keep', { id: 'keep', name: 'Keep' });
    harness.data.timeEntries.set('keep-entry', { id: 'keep-entry', activityId: 'keep', startTimestamp: 1, endTimestamp: 2 });
    harness.data.groups.set('keep-group', { id: 'keep-group', name: 'Crew', x: 0, y: 0 });
    harness.stats.failMutation = true;
    const backup = {
        format: 'timerhub-backup', version: 1,
        activities: [{ id: 'new', name: 'New' }],
        timeEntries: [],
        settings: { theme: 'dark' }
    };
    await assert.rejects(() => repository.importAll(backup, false));
    assert.equal(harness.data.activities.has('keep'), true, 'original activities survive a failed replace');
    assert.equal(harness.data.activities.has('new'), false, 'imported activities are not partially committed');
    assert.equal(harness.data.timeEntries.has('keep-entry'), true, 'original entries survive');
    assert.equal(harness.data.groups.has('keep-group'), true, 'original groups survive');
});

test('merge imports update by stable id and never duplicate records', async () => {
    const { context } = createTestApp();
    const repository = vm.runInContext('new StorageRepository()', context);
    const harness = createIndexedDbHarness();
    repository.db = harness.db;
    harness.data.activities.set('shared', { id: 'shared', name: 'Old' });
    const backup = {
        format: 'timerhub-backup', version: 1,
        activities: [{ id: 'shared', name: 'New' }, { id: 'added', name: 'Added' }],
        timeEntries: [],
        settings: {}
    };
    await repository.importAll(backup, true);
    await repository.importAll(backup, true);
    const activities = await repository.getActivities();
    assert.equal(activities.length, 2, 'merge never duplicates records');
    assert.equal(activities.find(item => item.id === 'shared').name, 'New');
    assert.equal(activities.find(item => item.id === 'added').name, 'Added');
});

test('replace import verifies store counts before reporting success', async () => {
    const { context } = createTestApp();
    const repository = vm.runInContext('new StorageRepository()', context);
    const harness = createIndexedDbHarness();
    repository.db = harness.db;
    harness.data.activities.set('stale', { id: 'stale', name: 'Stale' });
    const backup = {
        format: 'timerhub-backup', version: 1,
        activities: [{ id: 'a1', name: 'A' }, { id: 'a2', name: 'B', archived: true }],
        timeEntries: [{ id: 'e1', activityId: 'a1', startTimestamp: 1, endTimestamp: 2 }],
        layout: [{ activityId: 'a1', x: 0, y: 0, width: 260, height: 150 }],
        groups: [{ id: 'g1', name: 'Crew', x: 0, y: 0, collapsed: false }],
        settings: { theme: 'dark' }
    };
    await repository.importAll(backup, false);
    assert.equal((await repository.getActivities()).length, 2);
    assert.equal((await repository.getTimeEntries()).length, 1);
    assert.equal((await repository.getGroups()).length, 1);
    assert.equal((await repository.getLayout()).length, 1);
    assert.equal(await repository.getSetting('theme', ''), 'dark');
    assert.equal(harness.data.activities.has('stale'), false, 'replace removes records outside the backup');
});

test('restore verification rejects when a store is missing imported records', async () => {
    const { context } = createTestApp();
    const repository = vm.runInContext('new StorageRepository()', context);
    const harness = createIndexedDbHarness();
    repository.db = harness.db;
    const backup = {
        format: 'timerhub-backup', version: 1,
        activities: [{ id: 'a1', name: 'A' }],
        timeEntries: [],
        settings: {}
    };
    const originalGetActivities = repository.getActivities.bind(repository);
    repository.getActivities = async () => [];
    await assert.rejects(() => repository.importAll(backup, false), /restore_verification_failed/);
    repository.getActivities = originalGetActivities;
    assert.equal((await repository.getActivities()).length, 1, 'the commit itself succeeded; only the check failed');
});

test('empty backup replacement requires deliberate confirmation', async () => {
    const { app, document, toasts } = createTestApp({ activities: [{ id: 'a1', name: 'Existing' }] });
    app.activities = [{ id: 'a1', name: 'Existing' }];
    const calls = [];
    app.storage.validateBackupData = data => data;
    app.storage.importAll = async (_data, merge) => { calls.push(merge); };
    app.loadActivities = async () => {};
    app.loadGroups = async () => {};
    app.loadTimeEntries = async () => {};
    app.migrateMissingGroupLayouts = async () => {};
    app.renderAll = () => {};
    app.refreshAutomaticBackupStatus = async () => {};
    const emptyBackup = { format: 'timerhub-backup', version: 1, activities: [], timeEntries: [], groups: [], settings: {} };

    app.openRestoreConfirmation(emptyBackup);
    assert.equal(document.getElementById('backupRestoreEmptyWarning').hidden, false, 'the warning is shown');
    assert.equal(document.getElementById('backupRestoreReplaceBtn').disabled, true, 'replace stays disabled until confirmed');
    assert.equal(await app.restorePendingData(false), false, 'the guard blocks an unconfirmed empty replace');
    assert.deepEqual(calls, [], 'nothing was imported');
    assert.equal(toasts.at(-1), app.t('backupEmptyNeedsConfirmation'));

    app.setEmptyRestoreConfirmation(true);
    assert.equal(document.getElementById('backupRestoreReplaceBtn').disabled, false, 'confirmation enables replace');
    assert.equal(await app.restorePendingData(false), true, 'explicit confirmation allows the replace');
    assert.deepEqual(calls, [false]);
    assert.equal(document.getElementById('backupRestoreEmptyWarning').hidden, true, 'the warning resets after the restore');
});

test('a non-empty backup never triggers the empty-replacement guard', async () => {
    const { app, document } = createTestApp({ activities: [{ id: 'a1', name: 'Existing' }] });
    app.activities = [{ id: 'a1', name: 'Existing' }];
    app.storage.validateBackupData = data => data;
    app.storage.importAll = async () => {};
    app.loadActivities = async () => {};
    app.loadGroups = async () => {};
    app.loadTimeEntries = async () => {};
    app.migrateMissingGroupLayouts = async () => {};
    app.renderAll = () => {};
    app.refreshAutomaticBackupStatus = async () => {};
    app.openRestoreConfirmation({ format: 'timerhub-backup', version: 1, activities: [{ id: 'a2', name: 'Incoming' }], timeEntries: [], settings: {} });
    assert.equal(document.getElementById('backupRestoreEmptyWarning').hidden, true);
    assert.equal(document.getElementById('backupRestoreReplaceBtn').disabled, false);
    assert.equal(await app.restorePendingData(false), true);
});

test('storage persistence status is reported and degrades gracefully', async () => {
    const { app, context, document } = createTestApp();
    assert.equal(await app.refreshStoragePersistenceStatus(), 'unsupported');
    context.navigator.storage = { persisted: async () => true };
    assert.equal(await app.refreshStoragePersistenceStatus(), 'granted');
    context.navigator.storage = { persisted: async () => false, persist: async () => true };
    assert.equal(await app.refreshStoragePersistenceStatus(), 'granted');
    context.navigator.storage = { persisted: async () => false, persist: async () => false };
    assert.equal(await app.refreshStoragePersistenceStatus(), 'denied');
    context.navigator.storage = { persisted: async () => { throw new Error('nope'); } };
    assert.equal(await app.refreshStoragePersistenceStatus(), 'unknown');
    assert.match(document.getElementById('storagePersistenceStatus').textContent, /status unknown/i);
});

test('an unexpectedly empty database raises a recovery warning without false alarms', () => {
    const { app, localStorageData, document } = createTestApp();
    localStorageData.set('timerhubLastDataSeenAt', String(Date.now() - 2 * 24 * 60 * 60 * 1000));
    assert.equal(app.evaluateSuspiciousEmptyState(), true, 'previously stored data plus an empty database is suspicious');
    assert.equal(document.getElementById('missingDataWarning').style.display, 'block');

    app.activities = [{ id: 'a1', name: 'Back' }];
    assert.equal(app.evaluateSuspiciousEmptyState(), false, 'present data removes the warning');
    assert.equal(document.getElementById('missingDataWarning').style.display, 'none');

    localStorageData.set('timerhubLastDataSeenAt', '');
    app.activities = [];
    assert.equal(app.evaluateSuspiciousEmptyState(), false, 'a never-used device is not suspicious');

    localStorageData.set('timerhubLastDataSeenAt', String(Date.now() - 1000));
    app.activities = [];
    app.archivedActivities = [];
    app.timeEntries = [];
    app.groups = [];
    assert.equal(app.evaluateSuspiciousEmptyState(), true);
    app.activities = [{ id: 'a1', name: 'Recovered' }];
    app.updateDataPresenceMarker();
    assert.equal(app.missingDataSuspected, false, 'creating data clears the warning in the same session');
    assert.equal(document.getElementById('missingDataWarning').style.display, 'none');
    app.activities = [];
    localStorageData.set('timerhubLastDataSeenAt', String(Date.now() - 1000));
    assert.equal(app.evaluateSuspiciousEmptyState(), true);
    app.dismissMissingDataWarning();
    assert.equal(app.missingDataSuspected, false);
    assert.equal(localStorageData.has('timerhubLastDataSeenAt'), false, 'dismissal does not nag on every start');
    assert.equal(app.evaluateSuspiciousEmptyState(), false);

    app.activities = [{ id: 'a1', name: 'Back' }];
    app.updateDataPresenceMarker();
    assert.ok(Number(localStorageData.get('timerhubLastDataSeenAt')) > 0, 'data presence is recorded for the next start');
    app.activities = [];
    app.updateDataPresenceMarker();
    assert.equal(localStorageData.has('timerhubLastDataSeenAt'), false, 'a deliberately emptied database clears the marker');
});

test('manual backup records the export time and reports it in the backup status', async () => {
    const { app, backupCapture, localStorageData, document } = createTestApp({ activities: [{ id: 'a1', name: 'A' }] });
    await app.backupData();
    assert.equal(backupCapture.clicks, 1);
    assert.ok(Number(localStorageData.get('timerhubLastBackupAt')) > 0, 'the export time is remembered outside the database');
    assert.match(document.getElementById('lastBackupStatus').textContent, /Last backup file export/);
    const exported = JSON.parse(await backupCapture.blob.text());
    assert.equal(exported.format, 'timerhub-backup');
    assert.equal(exported.activities[0].id, 'a1');
});

test('database initialization reports blocked upgrades and releases stale connections', async () => {
    const { context } = createTestApp();
    const blockedRequest = { error: null, onerror: null, onsuccess: null, onupgradeneeded: null, onblocked: null, result: null };
    context.indexedDB = { open: () => blockedRequest };
    const blockedRepository = vm.runInContext('new StorageRepository()', context);
    const blockedInit = blockedRepository.init();
    await Promise.resolve();
    blockedRequest.onblocked?.();
    await assert.rejects(() => blockedInit, /storage_blocked/);

    let closed = false;
    const versionRequest = {
        error: null, onerror: null, onsuccess: null, onupgradeneeded: null, onblocked: null,
        result: { onversionchange: null, close() { closed = true; } }
    };
    context.indexedDB = { open: () => versionRequest };
    const repository = vm.runInContext('new StorageRepository()', context);
    const opened = repository.init();
    await Promise.resolve();
    versionRequest.onsuccess?.();
    await opened;
    versionRequest.result.onversionchange?.();
    assert.equal(closed, true, 'stale connections close when a newer version is requested');
});

test('backup and restore stay fully local without remote endpoints', () => {
    const repositorySection = source.slice(source.indexOf('class StorageRepository'), source.indexOf('// MAIN APPLICATION'));
    assert.doesNotMatch(repositorySection, /https?:\/\//, 'the storage repository must not reference remote endpoints');
    const exportSection = source.slice(source.indexOf('async backupData()'), source.indexOf('formatSnapshotDate('));
    assert.doesNotMatch(exportSection, /fetch\(|XMLHttpRequest|showSaveFilePicker|showDirectoryPicker/, 'the manual export must use browser-supported local download only');
    const restoreSection = source.slice(source.indexOf('async restoreData()'), source.indexOf('async loadDemoData()'));
    assert.doesNotMatch(restoreSection, /fetch\(|XMLHttpRequest|showOpenFilePicker/, 'restore must read a user-selected local file only');
});

function makeShareBackend() {
    const records = new Map();
    const alarmTimes = new Map();
    const objects = new Map();
    const env = {
        ASSETS: { fetch: async () => new Response('TimerHub asset') },
        TIMER_HUB: {
            idFromName: name => name,
            get: id => ({ fetch: request => getObject(id).fetch(request) })
        }
    };
    function getObject(id) {
        if (!objects.has(id)) {
            const values = records.get(id) || new Map();
            records.set(id, values);
            const state = {
                storage: {
                    put: async (key, value) => values.set(key, structuredClone(value)),
                    get: async key => structuredClone(values.get(key)),
                    delete: async key => values.delete(key),
                    list: async () => new Map(),
                    setAlarm: async timestamp => alarmTimes.set(id, timestamp),
                    deleteAlarm: async () => alarmTimes.delete(id)
                }
            };
            objects.set(id, new TimerHubDurableObject(state, env));
        }
        return objects.get(id);
    }
    return {
        records,
        alarmTimes,
        request: (path, init = {}) => worker.fetch(new Request(new URL(path, 'https://timerhub.example.test'), init), env),
        fireAlarm: async id => {
            alarmTimes.delete(id);
            await getObject(id).alarm();
        }
    };
}

function makeShareRecipientHarness(backend) {
    const harness = createTestApp({ fetch: (path, init) => backend.request(path, init) });
    const { app, context } = harness;
    app.clockodoClient = vm.runInContext('new ClockodoClient()', context);
    app.getPushClientId = () => 'client_1234567890abcdef';
    return harness;
}

function stubClockodoUpstream(t, { customers = [{ id: 1, name: 'Customer A' }], services = [{ id: 9, name: 'Service X' }], projects = [{ id: 4, name: 'Project A', customers_id: 1 }], entryHandler = null } = {}) {
    const originalFetch = globalThis.fetch;
    const calls = [];
    globalThis.fetch = async (url, init = {}) => {
        const href = String(url);
        const headers = init.headers || {};
        const record = {
            url: href,
            method: init.method || 'GET',
            key: headers['Idempotency-Key'] || null,
            body: init.body ? JSON.parse(init.body) : null
        };
        calls.push(record);
        if (href.includes('/v4/users/me')) return Response.json({ data: { id: 7 } });
        if (href.includes('/v3/customers')) return Response.json({ data: customers });
        if (href.includes('/v4/services')) return Response.json({ data: services });
        if (href.includes('/v4/projects')) return Response.json({ data: projects });
        if (href.includes('/v2/entries')) {
            if (entryHandler) {
                const custom = entryHandler(record, calls);
                if (custom) return custom;
            }
            return Response.json({ entry: { id: 7000 + calls.length } });
        }
        return Response.json({ error: 'unexpected_upstream_call' }, { status: 500 });
    };
    t.after(() => { globalThis.fetch = originalFetch; });
    return calls;
}

async function configureRecipientClockodo(app, document, backend) {
    document.getElementById('clockodoEmailInput').value = 'worker@example.test';
    document.getElementById('clockodoApiKeyInput').value = 'test-key-only';
    document.getElementById('clockodoCustomerIdInput').value = '1';
    document.getElementById('clockodoProjectIdInput').value = '4';
    document.getElementById('clockodoServiceIdInput').value = '9';
    document.getElementById('clockodoBillableSelect').value = 'true';
    const saved = await app.saveClockodoSettings();
    assert.equal(saved, true, 'Clockodo settings save through the protected Worker integration');
    await app.loadClockodoReferenceData({ force: true });
    return saved;
}

async function publishSharedDay(app, backend, { entries, date }) {
    const Exchange = app.getExchange();
    const ShareLink = app.getShareLinkModule();
    const payload = Exchange.buildDayPayload({ entries, date, exportId: `share-export-${Date.now()}` });
    const secret = Exchange.generateSecret();
    const envelope = await Exchange.encryptPayload(payload, secret);
    const shareId = ShareLink.generateShareId();
    const expiresAt = Date.now() + 60 * 60 * 1000;
    const response = await backend.request('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shareId, envelope, expiresAt })
    });
    assert.equal(response.status, 200, 'the encrypted share uploads');
    return { shareId, secret, expiresAt, payload };
}

test('share link sender selects all day entries by default and can exclude entries', () => {
    const { app, document } = createTestApp();
    const dayStart = new Date(2026, 8, 28, 8, 0, 0, 0).getTime();
    app.reviewDate = app.toDateString(new Date(dayStart));
    app.timeEntries = [
        { id: 'share-a', activityId: 'act-a', activityNameSnapshot: 'Painting', startTimestamp: dayStart, endTimestamp: dayStart + 3600000 },
        { id: 'share-b', activityId: 'act-b', activityNameSnapshot: 'Taping', startTimestamp: dayStart + 7200000, endTimestamp: dayStart + 10800000 }
    ];
    assert.equal(app.openShareLinkModal(), true);
    assert.equal(app.shareLinkEntries.length, 2);
    assert.deepEqual([...app.shareLinkSelection].sort(), [0, 1], 'all entries are selected by default');
    assert.equal(app.setShareLinkEntrySelected(1, false), true);
    assert.deepEqual([...app.shareLinkSelection], [0], 'individual entries can be excluded');
    assert.equal(app.setShareLinkEntrySelected(0, false), true);
    assert.deepEqual([...app.shareLinkSelection], []);
    assert.equal(app.updateShareLinkSummary(), 0);
    assert.equal(document.getElementById('shareLinkCreateBtn').disabled, true, 'create is blocked with nothing selected');
});

test('share link creation encrypts the selected day and stores only ciphertext', async () => {
    const backend = makeShareBackend();
    const posts = [];
    const { app, document } = createTestApp({
        fetch: (path, init) => {
            if (init?.method === 'POST' && String(path).endsWith('/api/share')) posts.push(JSON.parse(init.body));
            return backend.request(path, init);
        }
    });
    const dayStart = new Date(2026, 8, 28, 8, 0, 0, 0).getTime();
    app.reviewDate = app.toDateString(new Date(dayStart));
    app.timeEntries = [
        { id: 'share-a', activityId: 'act-a', activityNameSnapshot: 'Painting', startTimestamp: dayStart, endTimestamp: dayStart + 3600000, notes: 'First coat' },
        { id: 'share-b', activityId: 'act-b', activityNameSnapshot: 'Taping', startTimestamp: dayStart + 7200000, endTimestamp: dayStart + 10800000 }
    ];
    assert.equal(app.openShareLinkModal(), true);
    app.setShareLinkEntrySelected(1, false);
    document.getElementById('shareLinkExpirySelect').value = 'hour';
    const before = Date.now();
    assert.equal(await app.createShareLink(), true, `${app.shareLinkErrorCode}: ${app.shareLinkStatus}`);
    assert.equal(posts.length, 1, 'exactly one upload happens');
    const upload = posts[0];
    assert.deepEqual(Object.keys(upload).sort(), ['envelope', 'expiresAt', 'shareId']);
    assert.equal(upload.envelope.algorithm, 'AES-256-GCM');
    assert.ok(upload.expiresAt - before >= 59 * 60 * 1000 && upload.expiresAt - before <= 61 * 60 * 1000, 'the chosen one-hour expiry is honored');
    const link = app.getShareLinkModule().parseShareUrl(app.lastShareLink.url);
    assert.ok(link, 'the link exposes the key in the fragment');
    assert.equal(app.lastShareLink.url.includes('?share='), true);
    assert.equal(app.lastShareLink.url.includes(`#key=${link.secret}`), true);
    const uploaded = JSON.stringify(upload);
    assert.equal(uploaded.includes(link.secret), false, 'the encryption key never leaves the URL fragment');
    assert.equal(uploaded.includes('Painting'), false, 'entry names are not uploaded in plaintext');
    assert.equal(uploaded.includes('apiKey'), false);
    const fetched = await backend.request(`/api/share/${link.shareId}`);
    assert.equal(fetched.status, 200);
    const { envelope } = await fetched.json();
    const payload = await app.getExchange().decryptPayload(envelope, link.secret);
    assert.equal(payload.entries.length, 1, 'only the selected entry is shared');
    assert.equal(payload.entries[0].activityName, 'Painting');
    assert.equal(payload.entries[0].notes, 'First coat');
});

test('shared day preview shows every entry, including entries the sender synced', async () => {
    const backend = makeShareBackend();
    const { app, document } = makeShareRecipientHarness(backend);
    const dayStart = new Date(2026, 8, 28, 8, 0, 0, 0).getTime();
    const date = app.toDateString(new Date(dayStart));
    const entries = [
        { id: 'share-a', activityId: 'act-a', activityNameSnapshot: 'Painting', startTimestamp: dayStart, endTimestamp: dayStart + 3600000, syncStatus: 'synced', customerId: '1', serviceId: '9' },
        { id: 'share-b', activityId: 'act-b', activityNameSnapshot: 'Taping', startTimestamp: dayStart + 7200000, endTimestamp: dayStart + 10800000, syncStatus: 'unsynced', customerId: '1', serviceId: '9' }
    ];
    const published = await publishSharedDay(app, backend, { entries, date });
    assert.equal(await app.openSharedDay({ shareId: published.shareId, secret: published.secret }), true);
    assert.equal(app.pendingSharedDay.payload.entries.length, 2, 'synced and unsynced sender entries are both included');
    const list = document.getElementById('sharedDayPreviewList').innerHTML;
    assert.equal(list.includes('Painting'), true);
    assert.equal(list.includes('Taping'), true);
    assert.equal(app.sharedDayStatusMessage, '', 'a valid link opens without an error message');
});

test('shared import without Clockodo guides configuration and resumes after saving', async t => {
    const backend = makeShareBackend();
    stubClockodoUpstream(t);
    const { app, document } = makeShareRecipientHarness(backend);
    const dayStart = new Date(2026, 8, 28, 8, 0, 0, 0).getTime();
    const date = app.toDateString(new Date(dayStart));
    const published = await publishSharedDay(app, backend, {
        entries: [{ id: 'share-a', activityId: 'act-a', activityNameSnapshot: 'Painting', startTimestamp: dayStart, endTimestamp: dayStart + 3600000, customerId: '1', serviceId: '9' }],
        date
    });
    app.switchScreen = screen => { app.currentScreen = screen; };
    assert.equal(await app.openSharedDay({ shareId: published.shareId, secret: published.secret }), true);
    assert.equal(await app.initiateSharedImport(), false, 'import is guided through configuration first');
    assert.equal(app.sharedImportNeedsConfig, true);
    assert.equal(app.sharedDayStatusMessage, app.t('sharedImportConfigRequired'));
    assert.equal(app.currentScreen, 'settings', 'the app guides the user to the Clockodo settings');

    let resumed = false;
    app.resumeSharedDayAfterConfig = async () => { resumed = true; return true; };
    await configureRecipientClockodo(app, document, backend);
    assert.equal(resumed, true, 'saving Clockodo settings resumes the pending shared import');
    assert.equal(app.sharedImportNeedsConfig, false);
});

test('shared import stops when a customer or service mapping is missing', async t => {
    const backend = makeShareBackend();
    const calls = stubClockodoUpstream(t, { customers: [{ id: 1, name: 'Customer A' }], services: [{ id: 9, name: 'Service X' }] });
    const { app, document } = makeShareRecipientHarness(backend);
    const dayStart = new Date(2026, 8, 28, 8, 0, 0, 0).getTime();
    const date = app.toDateString(new Date(dayStart));
    const published = await publishSharedDay(app, backend, {
        entries: [{ id: 'share-a', activityId: 'act-a', activityNameSnapshot: 'Painting', startTimestamp: dayStart, endTimestamp: dayStart + 3600000, customerId: '99', serviceId: '9' }],
        date
    });
    assert.equal(await app.openSharedDay({ shareId: published.shareId, secret: published.secret }), true);
    await configureRecipientClockodo(app, document, backend);
    const entriesBefore = calls.filter(call => call.url.includes('/v2/entries')).length;
    assert.equal(await app.performSharedImport(), false, 'the import stops instead of sending unmapped entries');
    assert.equal(app.sharedImportStatus, 'missing_mapping');
    assert.match(app.sharedDayStatusMessage, /missing customers: 1/);
    assert.equal(calls.filter(call => call.url.includes('/v2/entries')).length, entriesBefore, 'nothing is sent to Clockodo');
    assert.equal((await backend.request(`/api/share/${published.shareId}`)).status, 200, 'the link stays open for a corrected retry');
});

test('shared import creates Clockodo entries once, retries failures, and closes the link', async t => {
    const backend = makeShareBackend();
    const calls = stubClockodoUpstream(t, {
        entryHandler: (record, allCalls) => {
            const entryCalls = allCalls.filter(call => call.url.includes('/v2/entries'));
            if (entryCalls.length === 1) return Response.json({ error: 'rejected once' }, { status: 422 });
            return null;
        }
    });
    const { app, document } = makeShareRecipientHarness(backend);
    const dayStart = new Date(2026, 8, 28, 8, 0, 0, 0).getTime();
    const date = app.toDateString(new Date(dayStart));
    const published = await publishSharedDay(app, backend, {
        entries: [
            { id: 'share-a', activityId: 'act-a', activityNameSnapshot: 'Painting', startTimestamp: dayStart, endTimestamp: dayStart + 3600000, notes: 'First coat', customerId: '1', serviceId: '9' },
            { id: 'share-b', activityId: 'act-b', activityNameSnapshot: 'Taping', startTimestamp: dayStart + 7200000, endTimestamp: dayStart + 10800000, customerId: '1', serviceId: '9' }
        ],
        date
    });
    assert.equal(await app.openSharedDay({ shareId: published.shareId, secret: published.secret }), true);
    await configureRecipientClockodo(app, document, backend);

    assert.equal(await app.performSharedImport(), false, 'a rejected entry keeps the import incomplete');
    assert.equal(app.sharedImportStatus, 'partial');
    assert.equal(app.sharedImport.entries[0].status, 'failed');
    assert.equal(app.sharedImport.entries[1].status, 'synced');
    assert.equal(app.hasRetryableSharedEntries(), true);
    assert.equal((await backend.request(`/api/share/${published.shareId}`)).status, 200, 'the link stays open for retries');

    assert.equal(await app.performSharedImport(), true, 'retrying the failed entry completes the import');
    assert.equal(app.sharedImportStatus, 'success');
    assert.equal(app.sharedImport.entries.every(row => row.status === 'synced'), true);
    assert.equal((await backend.request(`/api/share/${published.shareId}`)).status, 404, 'the link is invalidated after success');
    const recorded = await app.storage.getSetting('exchangeImports', []);
    assert.equal(recorded.some(item => item.exportId === published.payload.exportId), true, 'the share import is recorded locally');

    const entryCalls = calls.filter(call => call.url.includes('/v2/entries'));
    assert.equal(entryCalls.length, 3, 'two entries plus one retry reach Clockodo');
    const clockodoRecords = backend.records.get('client_1234567890abcdef');
    const operationKeys = [...clockodoRecords.keys()].filter(key => key.startsWith('clockodo-operation:timerhub-share:'));
    assert.equal(operationKeys.length, 2, 'each shared entry uses exactly one stable operation key');
    const retriedOperation = clockodoRecords.get(operationKeys.find(key => key.endsWith(':0')));
    assert.equal(retriedOperation.state, 'succeeded', 'the retry completes the same idempotent operation');
    assert.equal(entryCalls[0].body.customers_id, 1);
    assert.equal(entryCalls[0].body.services_id, 9);
    assert.equal(entryCalls[0].body.projects_id, 4);
    assert.equal(entryCalls[0].body.text, 'First coat');
    assert.equal(app.timeEntries.length, 0, 'nothing is duplicated into the local log');
});

test('shared import treats uncertain outcomes as non-retryable and never duplicates', async t => {
    const backend = makeShareBackend();
    const calls = stubClockodoUpstream(t, {
        entryHandler: (record, allCalls) => {
            const entryCalls = allCalls.filter(call => call.url.includes('/v2/entries'));
            if (entryCalls.length === 1) return Response.json({ error: 'upstream broke' }, { status: 503 });
            return null;
        }
    });
    const { app, document } = makeShareRecipientHarness(backend);
    const dayStart = new Date(2026, 8, 28, 8, 0, 0, 0).getTime();
    const date = app.toDateString(new Date(dayStart));
    const published = await publishSharedDay(app, backend, {
        entries: [
            { id: 'share-a', activityId: 'act-a', activityNameSnapshot: 'Painting', startTimestamp: dayStart, endTimestamp: dayStart + 3600000, customerId: '1', serviceId: '9' },
            { id: 'share-b', activityId: 'act-b', activityNameSnapshot: 'Taping', startTimestamp: dayStart + 7200000, endTimestamp: dayStart + 10800000, customerId: '1', serviceId: '9' }
        ],
        date
    });
    assert.equal(await app.openSharedDay({ shareId: published.shareId, secret: published.secret }), true);
    await configureRecipientClockodo(app, document, backend);

    assert.equal(await app.performSharedImport(), false);
    assert.equal(app.sharedImport.entries[0].status, 'unknown', 'an uncertain outcome is never marked as safe to retry');
    assert.equal(app.hasRetryableSharedEntries(), false);
    assert.equal(await app.performSharedImport(), false, 'the uncertain entry is not sent again');
    assert.equal(calls.filter(call => call.url.includes('/v2/entries')).length, 2, 'the uncertain entry is never sent a second time');
    const clockodoRecords = backend.records.get('client_1234567890abcdef');
    const operationKey = [...clockodoRecords.keys()].find(key => key.startsWith('clockodo-operation:timerhub-share:') && key.endsWith(':0'));
    assert.equal(clockodoRecords.get(operationKey).state, 'unknown', 'the uncertain operation stays permanently protected');
    assert.equal((await backend.request(`/api/share/${published.shareId}`)).status, 200, 'the link remains until the outcome is resolved');
});

test('closed or expired share links are reported instead of importing', async () => {
    const backend = makeShareBackend();
    const { app } = makeShareRecipientHarness(backend);
    const dayStart = new Date(2026, 8, 28, 8, 0, 0, 0).getTime();
    const date = app.toDateString(new Date(dayStart));
    const entries = [{ id: 'share-a', activityId: 'act-a', activityNameSnapshot: 'Painting', startTimestamp: dayStart, endTimestamp: dayStart + 3600000, customerId: '1', serviceId: '9' }];

    const closed = await publishSharedDay(app, backend, { entries, date });
    const completed = await backend.request(`/api/share/${closed.shareId}/complete`, { method: 'POST', body: '{}' });
    assert.equal(completed.status, 200);
    assert.equal(await app.openSharedDay({ shareId: closed.shareId, secret: closed.secret }), false);
    assert.equal(app.sharedDayStatusMessage, app.t('shareLinkNotFound'));
    assert.equal(app.pendingSharedDay, null);

    const expired = await publishSharedDay(app, backend, { entries, date });
    const stored = backend.records.get(`share:${expired.shareId}`).get('share');
    stored.expiresAt = Date.now() - 1000;
    assert.equal(await app.openSharedDay({ shareId: expired.shareId, secret: expired.secret }), false);
    assert.equal(app.sharedDayStatusMessage, app.t('shareLinkExpired'));
});

test('a share link URL in the address bar is captured and cleaned', () => {
    const backend = makeShareBackend();
    const { app, window } = createTestApp({ fetch: (path, init) => backend.request(path, init) });
    const secret = app.getExchange().generateSecret();
    const shareId = app.getShareLinkModule().generateShareId();
    window.location.search = `?share=${shareId}`;
    window.location.hash = `#key=${secret}`;
    const captured = app.captureSharedLinkFromLocation();
    assert.equal(captured.shareId, shareId);
    assert.equal(captured.secret, secret);
    assert.equal(app.pendingShareLink.shareId, shareId);
    assert.equal(app.pendingShareLink.secret, secret);
    assert.equal(String(window.location.search).includes('share='), true, 'the mock location keeps its value; real browsers are cleaned via replaceState');
});

test('Clockodo reference data loads projects with their customer when supported', async () => {
    const client = makeClockodoReferenceClient({
        customers: [{ id: 5, name: 'Beta' }],
        services: [{ id: 9, name: 'Repair' }],
        projects: [
            { id: 4, name: 'Object A', active: true, customerId: 5 },
            { id: 6, name: 'Object B', active: false, customerId: 7 }
        ]
    });
    const { app } = createTestApp({ clockodoClient: client });
    app.clockodoConfigured = true;
    assert.equal(await app.loadClockodoReferenceData(), true);
    assert.deepEqual(app.clockodoProjects.map(item => item.id), [4, 6]);
    assert.equal(client.state.projectCalls, 1);
    assert.equal(app.clockodoReferenceStatus, 'ready');
});

test('project choices follow the selected customer in activity and entry editors', () => {
    const { app, document } = createTestApp();
    app.clockodoReferenceStatus = 'ready';
    app.clockodoCustomers = [{ id: 5, name: 'Beta' }, { id: 7, name: 'Gamma' }];
    app.clockodoServices = [{ id: 9, name: 'Repair' }];
    app.clockodoProjects = [
        { id: 4, name: 'Object A', active: true, customerId: 5 },
        { id: 6, name: 'Object B', active: true, customerId: 7 }
    ];

    app.populateClockodoAssignmentSelects('activity', '5', null, 'Beta', '');
    app.openClockodoCombobox('activity', 'project');
    assert.deepEqual(clockodoComboboxLabels(app, document, 'activity', 'project'), [
        'No Clockodo assignment',
        'Object A'
    ], 'only projects of the selected customer are offered');
    app.selectClockodoComboboxOption('activity', 'project', app.clockodoCombobox.options[1]);
    assert.equal(document.getElementById('activityProjectSelect').value, '4');
    assert.equal(document.getElementById('activityProjectInput').value, 'Object A');

    document.getElementById('activityCustomerSelect').value = '7';
    document.getElementById('activityCustomerInput').value = 'Gamma';
    assert.equal(app.enforceClockodoProjectForCustomer('activity'), true);
    assert.equal(document.getElementById('activityProjectSelect').value, '', 'a project of another customer is cleared');
    assert.equal(document.getElementById('activityProjectInput').value, '');

    app.openClockodoCombobox('activity', 'project');
    assert.deepEqual(clockodoComboboxLabels(app, document, 'activity', 'project'), [
        'No Clockodo assignment',
        'Object B'
    ]);
    app.closeClockodoCombobox();

    app.populateClockodoAssignmentSelects('entry', '7', '9', 'Gamma', 'Repair', '6', 'Object B');
    assert.equal(document.getElementById('entryEditProjectSelect').value, '6');
    assert.equal(document.getElementById('entryEditProject').value, 'Object B');
    app.openClockodoCombobox('entry', 'project');
    assert.deepEqual(clockodoComboboxLabels(app, document, 'entry', 'project'), [
        'No Clockodo assignment',
        'Object B'
    ]);
    app.closeClockodoCombobox();
});

test('activity project assignments persist into entries and reach the Clockodo payload', async () => {
    const { app, document, context } = createTestApp();
    app.clockodoConfigured = true;
    app.clockodoReferenceStatus = 'ready';
    app.clockodoCustomers = [{ id: 5, name: 'Beta' }];
    app.clockodoServices = [{ id: 9, name: 'Repair' }];
    app.clockodoProjects = [{ id: 4, name: 'Object A', active: true, customerId: 5 }];
    app.clockodoCustomerId = '5';
    app.clockodoServiceId = '9';
    app.clockodoProjectId = '1';
    app.renderMain = () => {};
    app.generateId = () => 'activity-with-project';
    document.getElementById('activityName').value = 'Painting';
    document.getElementById('activityCustomerSelect').value = '5';
    document.getElementById('activityProjectSelect').value = '4';
    document.getElementById('activityServiceSelect').value = '9';

    await app.saveActivity();
    const activity = app.activities.find(item => item.id === 'activity-with-project');
    assert.equal(activity.projectId, '4');
    assert.equal(activity.projectName, 'Object A');

    const start = new Date(2026, 0, 7, 8, 0).getTime();
    const entry = await app.addEntry({
        activityId: activity.id,
        activityNameSnapshot: 'Painting',
        startTimestamp: start,
        endTimestamp: start + 60 * 60 * 1000
    });
    assert.equal(entry.projectId, '4', 'the entry inherits the activity project');
    assert.equal(entry.project, 'Object A');
    assert.equal(entry.customerId, '5');
    assert.equal(entry.serviceId, '9');

    const buildEntryPayload = vm.runInContext('ClockodoClient.buildEntryPayload', context);
    const payload = buildEntryPayload(entry, {
        customerId: app.clockodoCustomerId,
        serviceId: app.clockodoServiceId,
        projectId: app.clockodoProjectId,
        billable: app.clockodoBillable
    });
    assert.equal(payload.projects_id, 4, 'the activity project overrides the default project');
    assert.equal(payload.customers_id, 5);
    assert.equal(payload.services_id, 9);
});

test('new timer and manual entries copy the activity project assignment', async () => {
    const activity = {
        id: 'project-act', name: 'Painting', position: 0,
        projectId: '4', projectName: 'Object A',
        customerId: '5', customerName: 'Beta', serviceId: '9', serviceName: 'Repair'
    };
    const { app, storageData } = createTestApp({ activities: [activity] });
    app.cancelBackgroundAlarm = async () => {};
    app.scheduleBackgroundAlarm = async () => {};
    await app.loadActivities();

    await app.toggleActivity(activity.id);
    const timerEntry = app.timeEntries.find(entry => entry.activityId === activity.id);
    assert.equal(timerEntry.projectId, '4', 'the timer entry inherits the project ID');
    assert.equal(timerEntry.project, 'Object A', 'the timer entry inherits the project name');
    assert.equal(storageData.timeEntries.find(entry => entry.id === timerEntry.id).projectId, '4');

    const manual = await app.addEntry({
        activityId: activity.id,
        startTimestamp: new Date(2026, 0, 9, 8, 0).getTime(),
        endTimestamp: new Date(2026, 0, 9, 9, 0).getTime(),
        customerId: '7', serviceId: '9'
    });
    assert.equal(manual.projectId, '4', 'the project is inherited even when customer and service were supplied');
    assert.equal(manual.project, 'Object A');
});

test('Day Review migration fills missing project assignments and preserves explicit choices', async () => {
    const activity = {
        id: 'migrate-act', name: 'Painting', position: 0,
        projectId: '4', projectName: 'Object A',
        customerId: '5', customerName: 'Beta', serviceId: '9', serviceName: 'Repair'
    };
    const start = new Date(2026, 0, 10, 8, 0).getTime();
    const makeEntry = (id, offset, extra = {}) => ({
        id, activityId: activity.id, activityNameSnapshot: 'Painting',
        startTimestamp: start + offset, endTimestamp: start + offset + 60 * 60 * 1000,
        ...extra
    });
    const entries = [
        makeEntry('migrate-first', 0),
        makeEntry('migrate-second', 60 * 60 * 1000),
        makeEntry('explicit-project', 2 * 60 * 60 * 1000, { projectId: '9', project: 'Explicit Site' }),
        makeEntry('legacy-free-text', 3 * 60 * 60 * 1000, { project: 'Legacy Site' })
    ];
    const { app, storageData, document } = createTestApp({ activities: [activity], timeEntries: entries });
    await app.loadActivities();
    await app.loadTimeEntries();

    for (const id of ['migrate-first', 'migrate-second']) {
        const entry = app.timeEntries.find(item => item.id === id);
        assert.equal(entry.projectId, '4', `${id} recovers the project ID`);
        assert.equal(entry.project, 'Object A', `${id} recovers the project name`);
        const persisted = storageData.timeEntries.find(item => item.id === id);
        assert.equal(persisted.projectId, '4', `${id} is persisted`);
        assert.equal(persisted.project, 'Object A', `${id} persists the project name`);
    }
    const explicit = app.timeEntries.find(item => item.id === 'explicit-project');
    assert.equal(explicit.projectId, '9', 'an explicit project ID is never replaced');
    assert.equal(explicit.project, 'Explicit Site');
    const freeText = app.timeEntries.find(item => item.id === 'legacy-free-text');
    assert.equal(freeText.projectId, null, 'legacy free text is not guessed into another project');
    assert.equal(freeText.project, 'Legacy Site');

    app.reviewDate = '2026-01-10';
    app.renderReview();
    assert.match(document.getElementById('reviewEntriesList').innerHTML, /Object A/);
});

test('Day Review migration skips conflicting activity projects', async () => {
    const entries = [{
        id: 'conflict-entry', activityId: 'conflict-act', activityNameSnapshot: 'Painting',
        startTimestamp: new Date(2026, 0, 11, 8, 0).getTime(),
        endTimestamp: new Date(2026, 0, 11, 9, 0).getTime()
    }];
    const { app, storageData } = createTestApp({
        activities: [
            { id: 'conflict-act', name: 'Painting', projectId: '4', projectName: 'Object A' },
            { id: 'conflict-act', name: 'Painting', projectId: '9', projectName: 'Object B' }
        ],
        timeEntries: entries
    });
    await app.loadActivities();
    await app.loadTimeEntries();

    assert.equal(app.timeEntries[0].projectId, null);
    assert.equal(app.timeEntries[0].project, '');
    assert.deepEqual(storageData.timeEntries, entries, 'conflicting review data is left untouched');
    assert.deepEqual(JSON.parse(JSON.stringify(app.projectAssignmentMigration.conflicts)),
        [{ entryId: 'conflict-entry', activityId: 'conflict-act' }]);
});

test('project assignment migration is idempotent and survives reload', async () => {
    const entry = {
        id: 'migration-idempotent', activityId: 'migration-act', activityNameSnapshot: 'Painting',
        startTimestamp: new Date(2026, 0, 12, 8, 0).getTime(),
        endTimestamp: new Date(2026, 0, 12, 9, 0).getTime()
    };
    const { app, storageData } = createTestApp({
        activities: [{ id: 'migration-act', name: 'Painting', projectId: '4', projectName: 'Object A' }],
        timeEntries: [entry]
    });
    await app.loadActivities();
    const saves = [];
    const saveTimeEntry = app.storage.saveTimeEntry.bind(app.storage);
    app.storage.saveTimeEntry = async saved => {
        saves.push(structuredClone(saved));
        return saveTimeEntry(saved);
    };

    await app.loadTimeEntries();
    assert.equal(saves.length, 1, 'the missing project is migrated once');
    const persisted = structuredClone(storageData.timeEntries[0]);
    await app.loadTimeEntries();
    assert.equal(saves.length, 1, 'rerunning the migration does not rewrite entries');
    assert.deepEqual(storageData.timeEntries[0], persisted);
    assert.equal(storageData.timeEntries.length, 1, 'no duplicate entry is created');

    const { app: reloaded } = createTestApp({
        activities: storageData.activities,
        timeEntries: storageData.timeEntries,
        settings: storageData.settings
    });
    await reloaded.loadActivities();
    await reloaded.loadTimeEntries();
    assert.equal(reloaded.timeEntries[0].projectId, '4');
    assert.equal(reloaded.timeEntries[0].project, 'Object A');
});

test('entry editor saves a selected project and preserves legacy free text', async () => {
    const entry = {
        id: 'legacy-project-entry', activityId: 'act-1', activityNameSnapshot: 'Painting',
        startTimestamp: new Date(2026, 0, 8, 8, 0).getTime(),
        endTimestamp: new Date(2026, 0, 8, 9, 0).getTime(),
        project: 'Bridge',
        customerId: '5', serviceId: '9'
    };
    const { app, document } = createTestApp({ timeEntries: [entry] });
    app.clockodoReferenceStatus = 'ready';
    app.clockodoCustomers = [{ id: 5, name: 'Beta' }];
    app.clockodoServices = [{ id: 9, name: 'Repair' }];
    app.clockodoProjects = [{ id: 4, name: 'Object A', active: true, customerId: 5 }];
    app.activities = [{ id: 'act-1', name: 'Painting' }];
    app.timeEntries = [entry];

    app.showEntryEditModal('legacy-project-entry');
    assert.equal(document.getElementById('entryEditProject').value, 'Bridge', 'legacy free text stays visible');
    assert.equal(document.getElementById('entryEditProjectSelect').value, '');

    app.populateClockodoAssignmentSelects('entry', '5', '9', 'Beta', 'Repair', '4', 'Object A');
    assert.equal(document.getElementById('entryEditProjectSelect').value, '4');
    assert.equal(document.getElementById('entryEditProject').value, 'Object A');

    let saved = null;
    app.updateEntry = async (id, updates) => { saved = { id, updates }; };
    app.closeEntryEditModal = () => {};
    app.renderLog = () => {};
    app.renderReview = () => {};
    await app.saveTimeEntry();
    assert.equal(saved.updates.projectId, '4');
    assert.equal(saved.updates.project, 'Object A');

    document.getElementById('entryEditProjectSelect').value = '';
    document.getElementById('entryEditProject').value = 'Custom site';
    app.normalizeClockodoComboboxText('entry', 'project');
    assert.equal(document.getElementById('entryEditProject').value, 'Custom site', 'unmatched project text is still allowed as free text');
});

test('a legacy free-text project survives a reference-data refresh', () => {
    const { app, document } = createTestApp();
    app.clockodoReferenceStatus = 'ready';
    app.clockodoCustomers = [{ id: 5, name: 'Beta' }];
    app.clockodoServices = [{ id: 9, name: 'Repair' }];
    app.clockodoProjects = [{ id: 4, name: 'Object A', customerId: 5 }];
    document.getElementById('entryEditCustomerSelect').value = '5';
    document.getElementById('entryEditCustomerInput').value = 'Beta';
    document.getElementById('entryEditServiceSelect').value = '9';
    document.getElementById('entryEditServiceInput').value = 'Repair';
    document.getElementById('entryEditProjectSelect').value = '';
    document.getElementById('entryEditProject').value = 'Bridge';
    document.getElementById('entryEditModal').classList.contains = name => name === 'active';

    app.refreshClockodoAssignmentViews();
    assert.equal(document.getElementById('entryEditProject').value, 'Bridge', 'free text is not cleared by a refresh');
    assert.equal(document.getElementById('entryEditProjectSelect').value, '');
});

test('a project load failure does not block Clockodo customers and services', async () => {
    const client = makeClockodoReferenceClient({
        customers: [{ id: 5, name: 'Beta' }],
        services: [{ id: 9, name: 'Repair' }],
        projects: [{ id: 4, name: 'Object A', customerId: 5 }],
        projectFailCode: 'clockodo_rejected'
    });
    const { app, document } = createTestApp({ clockodoClient: client });
    app.clockodoConfigured = true;

    assert.equal(await app.loadClockodoReferenceData(), true, 'the reference load still succeeds');
    assert.equal(app.clockodoReferenceStatus, 'ready');
    assert.deepEqual(app.clockodoCustomers.map(item => item.id), [5]);
    assert.deepEqual(app.clockodoServices.map(item => item.id), [9]);
    assert.equal(app.clockodoProjects.length, 0, 'projects fall back to an empty list');
    assert.equal(app.clockodoProjectError, 'clockodo_rejected');
    assert.equal(client.state.projectCalls, 1);

    app.populateClockodoAssignmentSelects('activity', '5', '9', 'Beta', 'Repair');
    const failedHint = document.getElementById('activityClockodoHint').textContent;
    assert.match(failedHint, /projects could not be loaded/i);
    assert.match(failedHint, /clockodo_rejected/, 'the hint exposes the safe error code');
    assert.match(failedHint, /HTTP 403/, 'the hint exposes the upstream status');
    assert.equal(document.getElementById('activityClockodoRetryBtn').style.display, '', 'the retry action stays available');

    app.clockodoProjectError = null;
    app.populateClockodoAssignmentSelects('activity', '5', '9', 'Beta', 'Repair');
    assert.doesNotMatch(document.getElementById('activityClockodoHint').textContent, /projects could not be loaded/i);
    assert.equal(document.getElementById('activityClockodoRetryBtn').style.display, 'none');
});

test('project hints explain exactly why the project list is empty', () => {
    const { app, document } = createTestApp();
    app.clockodoReferenceStatus = 'ready';
    app.clockodoCustomers = [{ id: 5, name: 'Beta' }, { id: 7, name: 'Gamma' }];
    app.clockodoServices = [{ id: 9, name: 'Repair' }];
    app.clockodoProjects = [];

    app.populateClockodoAssignmentSelects('activity', '5');
    assert.equal(document.getElementById('activityClockodoHint').textContent, app.t('clockodoNoProjects'));

    app.clockodoProjects = [{ id: 4, name: 'Object A', active: true, customerId: 7 }];
    app.populateClockodoAssignmentSelects('activity');
    assert.equal(document.getElementById('activityClockodoHint').textContent, app.t('clockodoProjectChooseCustomer'));

    app.populateClockodoAssignmentSelects('activity', '5');
    assert.equal(document.getElementById('activityClockodoHint').textContent, app.t('clockodoNoProjectsForCustomer'));

    app.populateClockodoAssignmentSelects('activity', '7');
    assert.equal(document.getElementById('activityClockodoHint').textContent, app.clockodoAssignmentHint());
});

test('an outdated Cloudflare Worker is identified instead of a generic project error', async () => {
    const failingClient = () => makeClockodoReferenceClient({
        customers: [{ id: 5, name: 'Beta' }],
        services: [{ id: 9, name: 'Repair' }],
        projects: [{ id: 4, name: 'Object A', customerId: 5 }],
        projectFailCode: 'clockodo_rejected'
    });

    const outdated = createTestApp({
        clockodoClient: failingClient(),
        fetch: async () => new Response('TimerHub asset', { status: 404 })
    });
    outdated.app.clockodoConfigured = true;
    assert.equal(await outdated.app.loadClockodoReferenceData(), true);
    assert.equal(outdated.app.clockodoWorkerOutdated, true);
    outdated.app.populateClockodoAssignmentSelects('activity', '5');
    assert.equal(outdated.document.getElementById('activityClockodoHint').textContent, outdated.app.t('clockodoWorkerOutdated'));

    const current = createTestApp({
        clockodoClient: failingClient(),
        fetch: async () => Response.json({ version: '2026-10-18-projects-v4' })
    });
    current.app.clockodoConfigured = true;
    assert.equal(await current.app.loadClockodoReferenceData(), true);
    assert.equal(current.app.clockodoWorkerOutdated, false);
    current.app.populateClockodoAssignmentSelects('activity', '5');
    assert.match(current.document.getElementById('activityClockodoHint').textContent, /clockodo_rejected/);
});

test('Clockodo HTTP 410 explains that projects are unavailable for the account', async () => {
    const client = makeClockodoReferenceClient({
        customers: [{ id: 5, name: 'Beta' }],
        services: [{ id: 9, name: 'Repair' }],
        projects: [{ id: 4, name: 'Object A', customerId: 5 }],
        projectFailCode: 'clockodo_rejected'
    });
    const { app, document } = createTestApp({
        clockodoClient: client,
        fetch: async () => Response.json({ version: '2026-10-18-projects-v4' })
    });
    app.clockodoConfigured = true;
    assert.equal(await app.loadClockodoReferenceData(), true);
    app.clockodoWorkerOutdated = false;
    app.clockodoProjectErrorStatus = 410;
    app.populateClockodoAssignmentSelects('activity', '5');
    assert.equal(document.getElementById('activityClockodoHint').textContent, app.t('clockodoProjectsUnavailable', { detail: 'clockodo_rejected · HTTP 410' }));
});

test('Clockodo project errors show the safe upstream explanation', async () => {
    const client = makeClockodoReferenceClient({
        customers: [{ id: 5, name: 'Beta' }],
        services: [{ id: 9, name: 'Repair' }],
        projects: [{ id: 4, name: 'Object A', customerId: 5 }],
        projectFailCode: 'clockodo_rejected',
        projectFailStatus: 410,
        projectFailDetails: { status: 410, code: 'ProjectsNotAvailable', message: 'Projects are not booked for this account' }
    });
    const { app, document } = createTestApp({
        clockodoClient: client,
        fetch: async () => Response.json({ version: '2026-10-18-projects-v4' })
    });
    app.clockodoConfigured = true;
    assert.equal(await app.loadClockodoReferenceData(), true);
    app.populateClockodoAssignmentSelects('activity', '5');
    const hint = document.getElementById('activityClockodoHint').textContent;
    assert.match(hint, /HTTP 410/);
    assert.match(hint, /Projects are not booked for this account/);
    assert.equal(hint.includes('apiKey'), false);
});

test('duplicating an activity copies its configuration with a fresh independent identity', async () => {
    const source = {
        id: 'source-activity', name: 'Painting', color: '#123456', shape: 'hexagon',
        icon: 'car', displayMode: 'icon-only', size: 'large', notes: 'Two coats',
        customerId: '5', customerName: 'Beta', serviceId: '9', serviceName: 'Repair',
        projectId: '4', projectName: 'Object A', groupId: 'dup-group',
        position: 2, archived: false, createdAt: 1000, updatedAt: 2000,
        assignment: 'Old job', importedAt: 3000
    };
    const group = { id: 'dup-group', name: 'Crew', x: 300, y: 200, collapsed: false };
    const layout = { activityId: source.id, x: 40, y: 60, width: 320, height: 190 };
    const { app, storageData, document } = createTestApp({
        activities: [source],
        groups: [group],
        layout: [layout]
    });
    await app.loadActivities();
    await app.loadGroups();
    app.clockodoReferenceStatus = 'ready';
    app.clockodoCustomers = [{ id: 5, name: 'Beta' }];
    app.editingActivityId = source.id;

    const duplicate = await app.duplicateActivity();
    assert.ok(duplicate, 'the duplicate is created');
    assert.notEqual(duplicate.id, source.id, 'the duplicate has a fresh identity');
    assert.equal(duplicate.name, app.t('activityCopyName', { name: 'Painting' }));
    for (const field of [
        'color', 'shape', 'icon', 'displayMode', 'size', 'notes',
        'customerId', 'customerName', 'serviceId', 'serviceName',
        'projectId', 'projectName', 'groupId'
    ]) {
        assert.equal(duplicate[field], source[field], `${field} is copied`);
    }
    assert.equal(duplicate.archived, false);
    assert.equal(duplicate.createdAt >= 1000, true);
    assert.equal(duplicate.updatedAt, duplicate.createdAt);
    assert.equal(Object.hasOwn(duplicate, 'assignment'), false, 'import provenance is not copied');
    assert.equal(Object.hasOwn(duplicate, 'importedAt'), false, 'import metadata is not copied');
    assert.equal(source.customerId, '5', 'the original is untouched');
    assert.equal(storageData.activities.find(item => item.id === duplicate.id).icon, 'car');

    const duplicateLayout = storageData.layout.find(item => item.activityId === duplicate.id);
    assert.deepEqual({ ...duplicateLayout }, {
        activityId: duplicate.id,
        x: app.snapToCanvasGrid(40 + 48),
        y: app.snapToCanvasGrid(60 + 48),
        width: 320,
        height: 192
    }, 'the duplicate gets its own persisted canvas layout');

    const reloaded = createTestApp({
        activities: structuredClone(storageData.activities),
        groups: structuredClone(storageData.groups),
        layout: structuredClone(storageData.layout)
    });
    await reloaded.app.loadActivities();
    await reloaded.app.loadGroups();
    const persisted = reloaded.app.activities.find(item => item.id === duplicate.id);
    assert.ok(persisted, 'the duplicate survives a reload');
    assert.equal(persisted.groupId, 'dup-group');
    assert.equal(persisted.customerId, '5');
    assert.equal(reloaded.app.activityLayouts.get(duplicate.id).width, 320);

    duplicate.name = 'Changed duplicate';
    await app.storage.saveActivity(duplicate);
    assert.equal(storageData.activities.find(item => item.id === source.id).name, 'Painting', 'editing the duplicate never changes the original');

    app.editingActivityId = duplicate.id;
    app.confirmDelete = false;
    await app.deleteActivity();
    assert.equal(app.activities.some(item => item.id === source.id), true, 'deleting the duplicate never deletes the original');
    assert.equal(app.activities.some(item => item.id === duplicate.id), false);
});

test('a failed duplication leaves no partial record and keeps the original', async () => {
    const { app, storageData, toasts } = createTestApp({
        activities: [{ id: 'keep-me', name: 'Original', customerId: '5', customerName: 'Beta' }]
    });
    await app.loadActivities();
    app.editingActivityId = 'keep-me';
    const originalSaveLayout = app.storage.saveLayout;
    app.storage.saveLayout = async () => { throw new Error('layout write failed'); };

    const result = await app.duplicateActivity();
    assert.equal(result, null);
    assert.deepEqual(app.activities.map(item => item.id), ['keep-me']);
    assert.deepEqual(app.activityLayouts.size, 0);
    assert.equal(storageData.activities.some(item => item.id !== 'keep-me'), false, 'no partial activity record is persisted');
    assert.equal(storageData.layout.length, 0, 'no partial layout record is persisted');
    assert.equal(toasts.at(-1), app.t('activityDuplicateFailed'));
    assert.equal(app.activities[0].customerId, '5');
    app.storage.saveLayout = originalSaveLayout;
});

test('a group can select, change, and clear a persisted default customer', async () => {
    const { app, storageData, document } = createTestApp({
        groups: [{ id: 'default-customer-group', name: 'Crew', x: 100, y: 100, collapsed: false }]
    });
    await app.loadGroups();
    app.renderMain = () => {};
    app.clockodoReferenceStatus = 'ready';
    app.clockodoCustomers = [{ id: 5, name: 'Beta' }, { id: 7, name: 'Gamma' }];

    assert.equal(app.openGroupEditModal('default-customer-group'), true);
    app.selectClockodoComboboxOption('group', 'customer', { id: '5', label: 'Beta' });
    assert.equal(document.getElementById('groupEditCustomerSelect').value, '5');
    assert.equal(document.getElementById('groupEditCustomerInput').value, 'Beta');
    document.getElementById('groupEditLockedInput').checked = false;
    assert.equal(await app.saveGroupEdit(), true);
    let stored = storageData.groups.find(item => item.id === 'default-customer-group');
    assert.equal(stored.defaultCustomerId, '5');
    assert.equal(stored.defaultCustomerName, 'Beta');

    const reloaded = createTestApp({ groups: structuredClone(storageData.groups) });
    await reloaded.app.loadGroups();
    assert.equal(reloaded.app.groups[0].defaultCustomerId, '5', 'the setting survives a restart');
    assert.equal(reloaded.app.groups[0].defaultCustomerName, 'Beta');

    assert.equal(app.openGroupEditModal('default-customer-group'), true);
    app.selectClockodoComboboxOption('group', 'customer', { id: '7', label: 'Gamma' });
    assert.equal(await app.saveGroupEdit(), true);
    stored = storageData.groups.find(item => item.id === 'default-customer-group');
    assert.equal(stored.defaultCustomerId, '7');
    assert.equal(stored.defaultCustomerName, 'Gamma');

    assert.equal(app.openGroupEditModal('default-customer-group'), true);
    app.clockodoReferenceStatus = 'error';
    assert.equal(app.clearGroupDefaultCustomer(), true);
    assert.equal(document.getElementById('groupEditCustomerSelect').value, '');
    assert.equal(document.getElementById('groupEditCustomerInput').value, '');
    assert.equal(await app.saveGroupEdit(), true, 'the default can be cleared while offline');
    stored = storageData.groups.find(item => item.id === 'default-customer-group');
    assert.equal(Object.hasOwn(stored, 'defaultCustomerId'), false, 'clearing removes the reference');
    assert.equal(Object.hasOwn(stored, 'defaultCustomerName'), false);
});

test('duplicated activities use the group default unless the button has its own customer', async () => {
    const group = {
        id: 'customer-default-group', name: 'Crew', x: 100, y: 100, collapsed: false,
        defaultCustomerId: '5', defaultCustomerName: 'Beta'
    };
    const { app } = createTestApp({
        groups: [group],
        activities: [
            { id: 'plain', name: 'Plain', groupId: group.id, customerId: '', customerName: '', position: 0 },
            { id: 'assigned', name: 'Assigned', groupId: group.id, customerId: 7, customerName: 'Gamma', position: 1 },
            { id: 'solo', name: 'Solo', customerId: '', customerName: '', position: 2 }
        ]
    });
    await app.loadActivities();
    await app.loadGroups();
    app.clockodoReferenceStatus = 'ready';
    app.clockodoCustomers = [{ id: 5, name: 'Beta' }, { id: 7, name: 'Gamma' }];

    app.editingActivityId = 'plain';
    const plainCopy = await app.duplicateActivity();
    assert.equal(plainCopy.customerId, '5');
    assert.equal(plainCopy.customerName, 'Beta');

    app.editingActivityId = 'assigned';
    const assignedCopy = await app.duplicateActivity();
    assert.equal(assignedCopy.customerId, 7, 'an explicit button customer wins over the group default');
    assert.equal(assignedCopy.customerName, 'Gamma');

    app.editingActivityId = 'solo';
    const soloCopy = await app.duplicateActivity();
    assert.equal(soloCopy.customerId, '', 'an ungrouped button without a customer keeps the existing behavior');

    const duplicatedGroup = await app.duplicateGroup(group.id);
    const groupCopies = app.activities.filter(item => item.groupId === duplicatedGroup.id);
    const copiedPlain = groupCopies.find(item => item.name.startsWith('Plain'));
    const copiedAssigned = groupCopies.find(item => item.name.startsWith('Assigned'));
    assert.equal(copiedPlain.customerId, '5', 'group duplication applies the duplicated group default');
    assert.equal(copiedAssigned.customerId, 7, 'group duplication preserves explicit member customers');
    assert.equal(app.activities.find(item => item.id === 'plain').customerId, '', 'existing activities are not changed');

    const groupRecord = app.groups.find(item => item.id === group.id);
    groupRecord.defaultCustomerId = '7';
    groupRecord.defaultCustomerName = 'Gamma';
    await app.storage.saveGroup(groupRecord);
    app.editingActivityId = 'plain';
    const laterCopy = await app.duplicateActivity();
    assert.equal(laterCopy.customerId, '7', 'a changed group default affects future creations');
    assert.equal(plainCopy.customerId, '5', 'previously created activities keep their customer');
    assert.equal(app.activities.find(item => item.id === 'plain').customerId, '', 'the source button stays unchanged');
});

test('a missing group default customer is ignored when reference data is loaded', async () => {
    const group = {
        id: 'deleted-customer-group', name: 'Crew', x: 100, y: 100, collapsed: false,
        defaultCustomerId: '5', defaultCustomerName: 'Deleted customer'
    };
    const { app, document } = createTestApp({
        groups: [group],
        activities: [{ id: 'member', name: 'Member', groupId: group.id, customerId: '', customerName: '', position: 0 }]
    });
    await app.loadActivities();
    await app.loadGroups();
    app.clockodoReferenceStatus = 'ready';
    app.clockodoCustomers = [{ id: 7, name: 'Gamma' }];
    app.editingActivityId = 'member';
    const duplicate = await app.duplicateActivity();
    assert.equal(duplicate.customerId, '', 'a dangling default is not applied');
    assert.equal(duplicate.customerName, '');

    assert.equal(app.openGroupEditModal(group.id), true);
    assert.equal(
        document.getElementById('groupEditClockodoHint').textContent,
        app.t('groupDefaultCustomerMissing'),
        'the group editor warns about the unavailable default customer'
    );
    app.closeGroupEditModal();

    app.clockodoReferenceStatus = 'error';
    await app.storage.saveActivity({ ...app.activities.find(item => item.id === 'member'), customerId: '', customerName: '' });
    app.editingActivityId = 'member';
    const offlineDuplicate = await app.duplicateActivity();
    assert.equal(offlineDuplicate.customerId, '5', 'offline creation still uses the persisted default');
    assert.equal(offlineDuplicate.customerName, 'Deleted customer');
});

test('group default customers survive export and restore without touching existing activities', async () => {
    const group = {
        id: 'backup-group', name: 'Crew', x: 100, y: 100, collapsed: false,
        defaultCustomerId: '5', defaultCustomerName: 'Beta'
    };
    const { app } = createTestApp({
        groups: [group],
        activities: [{ id: 'existing', name: 'Existing', groupId: group.id, customerId: '', customerName: '', position: 0 }]
    });
    await app.loadActivities();
    await app.loadGroups();
    const { context } = createTestApp();
    const repository = vm.runInContext('new StorageRepository()', context);
    const harness = createIndexedDbHarness();
    repository.db = harness.db;
    const exported = await repository.exportAll();

    const source = createTestApp({ groups: [group], activities: [{ id: 'existing', name: 'Existing', groupId: group.id, customerId: '', customerName: '', position: 0 }] });
    source.app.clockodoReferenceStatus = 'ready';
    source.app.clockodoCustomers = [{ id: 5, name: 'Beta' }];
    const backup = await source.app.storage.exportAll();
    assert.equal(backup.groups[0].defaultCustomerId, '5', 'the group default is exported');
    await repository.importAll(backup, false);
    const restored = await repository.getGroups();
    assert.equal(restored[0].defaultCustomerId, '5');
    assert.equal(restored[0].defaultCustomerName, 'Beta');
    assert.equal((await repository.getActivities())[0].customerId, '', 'the existing activity assignment is untouched');
    assert.deepEqual(exported.groups, [], 'the fresh repository export is empty');
});

test('a failed group duplication cleans up partially persisted records', async () => {
    const { app, storageData, toasts } = createTestApp({
        groups: [{ id: 'rollback-group', name: 'Crew', x: 100, y: 100, collapsed: false }],
        activities: [{ id: 'rollback-member', name: 'Member', groupId: 'rollback-group', position: 0 }]
    });
    await app.loadActivities();
    await app.loadGroups();
    const originalSaveLayout = app.storage.saveLayout;
    app.storage.saveLayout = async () => { throw new Error('layout write failed'); };

    const result = await app.duplicateGroup('rollback-group');
    assert.equal(result, null);
    assert.deepEqual(app.groups.map(item => item.id), ['rollback-group']);
    assert.deepEqual(app.activities.map(item => item.id), ['rollback-member']);
    assert.deepEqual(storageData.groups.map(item => item.id), ['rollback-group'], 'no partial group remains');
    assert.deepEqual(storageData.activities.map(item => item.id), ['rollback-member'], 'no partial member remains');
    assert.equal(storageData.layout.length, 0, 'no partial layout remains');
    assert.equal(toasts.at(-1), app.t('groupCreateFailed'));
    app.storage.saveLayout = originalSaveLayout;
});

function makeProjectLookupApp() {
    const harness = createTestApp();
    const { app, document } = harness;
    app.clockodoReferenceStatus = 'ready';
    app.clockodoCustomers = [
        { id: 5, name: 'Beta', active: true },
        { id: 7, name: 'Gamma', active: true }
    ];
    app.clockodoServices = [];
    app.clockodoProjects = [
        { id: 4, name: 'Object A', active: true, customerId: 5 },
        { id: 10, name: 'Unique Site', active: true, customerId: 5 },
        { id: 6, name: 'Shared Site', active: true, customerId: 5 },
        { id: 8, name: 'Shared Site', active: true, customerId: 7 },
        { id: 9, name: 'Gamma Yard', active: true, customerId: 7 }
    ];
    app.renderMain = () => {};
    app.populateClockodoAssignmentSelects('activity');
    return harness;
}

test('a partially typed project selects its unique customer case-insensitively', () => {
    const { app, document } = makeProjectLookupApp();
    const projectInput = document.getElementById('activityProjectInput');
    projectInput.value = 'uniq';
    app.applyClockodoAssignmentInput('activity', 'project');
    assert.equal(document.getElementById('activityCustomerSelect').value, '5');
    assert.equal(document.getElementById('activityCustomerInput').value, 'Beta');
    assert.match(document.getElementById('activityClockodoHint').textContent, /selected from the project/i);
    assert.equal(app.clockodoCustomerAutoSelected.has('activity'), true);
    assert.equal(app.clockodoCustomerFilters.has('activity'), false);
});

test('a shared project name shows the matching customers instead of guessing', () => {
    const { app, document } = makeProjectLookupApp();
    const projectInput = document.getElementById('activityProjectInput');
    projectInput.value = 'shared';
    app.applyClockodoAssignmentInput('activity', 'project');
    assert.equal(document.getElementById('activityCustomerSelect').value, '', 'no customer is guessed');
    assert.deepEqual([...app.clockodoCustomerFilters.get('activity')], ['5', '7']);
    assert.match(document.getElementById('activityClockodoHint').textContent, /Beta, Gamma/);

    app.openClockodoCombobox('activity', 'customer');
    assert.deepEqual(clockodoComboboxLabels(app, document, 'activity', 'customer'), [
        'No Clockodo assignment',
        'Beta',
        'Gamma'
    ]);
    app.selectClockodoComboboxOption('activity', 'customer', { id: '7', label: 'Gamma' });
    assert.equal(document.getElementById('activityCustomerSelect').value, '7');
    assert.equal(document.getElementById('activityCustomerInput').value, 'Gamma');
    assert.equal(app.clockodoCustomerFilters.has('activity'), false);
    assert.equal(app.clockodoCustomerAutoSelected.has('activity'), false);
});

test('no project match keeps the typed text and a manual customer', () => {
    const { app, document } = makeProjectLookupApp();
    app.selectClockodoComboboxOption('activity', 'customer', { id: '7', label: 'Gamma' });
    const projectInput = document.getElementById('activityProjectInput');
    projectInput.value = 'Nowhere site';
    app.applyClockodoAssignmentInput('activity', 'project');
    assert.equal(projectInput.value, 'Nowhere site', 'the project text was kept');
    assert.equal(document.getElementById('activityCustomerSelect').value, '7', 'the selected customer was kept');
    assert.match(document.getElementById('activityClockodoHint').textContent, /No customer found/i);
});

test('an automatic project customer follows project changes, a manual customer does not', () => {
    const { app, document } = makeProjectLookupApp();
    const projectInput = document.getElementById('activityProjectInput');
    projectInput.value = 'unique';
    app.applyClockodoAssignmentInput('activity', 'project');
    assert.equal(document.getElementById('activityCustomerSelect').value, '5');
    projectInput.value = 'Gamma Yard';
    app.applyClockodoAssignmentInput('activity', 'project');
    assert.equal(document.getElementById('activityCustomerSelect').value, '7', 'the automatic customer follows the new project');
    assert.equal(document.getElementById('activityCustomerInput').value, 'Gamma');

    app.selectClockodoComboboxOption('activity', 'customer', { id: '5', label: 'Beta' });
    projectInput.value = 'Gamma Yard';
    app.applyClockodoAssignmentInput('activity', 'project');
    assert.equal(document.getElementById('activityCustomerSelect').value, '5', 'a manually selected customer is preserved');
    assert.match(document.getElementById('activityClockodoHint').textContent, /selected customer was kept/i);
});

test('the entry editor resolves customers from a selected project ID', () => {
    const { app, document } = makeProjectLookupApp();
    app.populateClockodoAssignmentSelects('entry');
    app.selectClockodoComboboxOption('entry', 'project', { id: '9', label: 'Gamma Yard' });
    assert.equal(document.getElementById('entryEditProjectSelect').value, '9');
    assert.equal(document.getElementById('entryEditCustomerSelect').value, '7');
    assert.equal(document.getElementById('entryEditCustomerInput').value, 'Gamma');
    assert.match(document.getElementById('entryEditClockodoHint').textContent, /selected from the project/i);
    assert.equal(app.clockodoCustomerAutoSelected.has('entry'), true);
});

function makeGroupInheritanceApp() {
    const groups = [
        { id: 'inherit-root', name: 'Root', x: 0, y: 0, collapsed: false, defaultCustomerId: '5', defaultCustomerName: 'Beta' },
        { id: 'inherit-mid', name: 'Mid', x: 100, y: 0, collapsed: false, parentId: 'inherit-root' },
        { id: 'inherit-leaf', name: 'Leaf', x: 200, y: 0, collapsed: false, parentId: 'inherit-mid' },
        { id: 'inherit-override', name: 'Override', x: 300, y: 0, collapsed: false, parentId: 'inherit-mid', defaultCustomerId: '7', defaultCustomerName: 'Gamma' },
        { id: 'inherit-override-leaf', name: 'Override leaf', x: 400, y: 0, collapsed: false, parentId: 'inherit-override' },
        { id: 'inherit-leaf-child', name: 'Leaf child', x: 500, y: 0, collapsed: false, parentId: 'inherit-leaf' },
        { id: 'inherit-plain', name: 'Plain', x: 0, y: 300, collapsed: false },
        { id: 'inherit-plain-child', name: 'Plain child', x: 100, y: 300, collapsed: false, parentId: 'inherit-plain' }
    ];
    const activities = [
        { id: 'inherit-leaf-a', name: 'Leaf A', groupId: 'inherit-leaf', position: 0 },
        { id: 'inherit-mid-a', name: 'Mid A', groupId: 'inherit-mid', position: 1 },
        { id: 'inherit-override-leaf-a', name: 'Override leaf A', groupId: 'inherit-override-leaf', position: 2 },
        { id: 'inherit-plain-child-a', name: 'Plain child A', groupId: 'inherit-plain-child', position: 3 },
        { id: 'inherit-leaf-child-a', name: 'Leaf child A', groupId: 'inherit-leaf-child', position: 4 }
    ];
    const harness = createTestApp({
        groups,
        activities,
        timeEntries: [{
            id: 'inherit-entry', activityId: 'inherit-leaf-a', activityNameSnapshot: 'Leaf A',
            startTimestamp: new Date(2026, 0, 10, 8, 0).getTime(),
            endTimestamp: new Date(2026, 0, 10, 9, 0).getTime(),
            customerId: '', customerName: ''
        }]
    });
    harness.app.renderMain = () => {};
    harness.app.clockodoReferenceStatus = 'ready';
    harness.app.clockodoCustomers = [
        { id: 5, name: 'Beta', active: true },
        { id: 7, name: 'Gamma', active: true }
    ];
    return harness;
}

test('nested groups inherit the nearest default customer for duplicated buttons and groups', async () => {
    const { app } = makeGroupInheritanceApp();
    await app.loadActivities();
    await app.loadGroups();

    app.editingActivityId = 'inherit-leaf-a';
    const leafCopy = await app.duplicateActivity();
    assert.equal(leafCopy.customerId, '5', 'the root default is inherited through the parent chain');
    assert.equal(leafCopy.customerName, 'Beta');

    app.editingActivityId = 'inherit-override-leaf-a';
    const overrideCopy = await app.duplicateActivity();
    assert.equal(overrideCopy.customerId, '7', 'the nearest explicit ancestor wins');

    app.editingActivityId = 'inherit-plain-child-a';
    const plainCopy = await app.duplicateActivity();
    assert.equal(plainCopy.customerId, '', 'a chain without defaults keeps the existing behavior');

    const leafGroupCopy = await app.duplicateGroup('inherit-leaf');
    const groupCopyMember = app.activities.find(item => item.groupId === leafGroupCopy.id);
    assert.equal(groupCopyMember.customerId, '5', 'duplicated group members inherit through the copied parent');

    const overrideGroupCopy = await app.duplicateGroup('inherit-override');
    assert.equal(overrideGroupCopy.defaultCustomerId, '7', 'group duplication copies the explicit default');
    assert.equal(app.activities.some(item => item.groupId === overrideGroupCopy.id), false, 'nested children are not duplicated implicitly');
});

test('the group editor shows inherited customers without persisting them', async () => {
    const { app, document } = makeGroupInheritanceApp();
    await app.loadActivities();
    await app.loadGroups();
    app.editingGroupId = 'inherit-leaf';
    assert.equal(app.openGroupEditModal('inherit-leaf'), true);
    assert.match(document.getElementById('groupEditClockodoHint').textContent, /Inherited from a parent group: Beta/);
    assert.equal(document.getElementById('groupEditCustomerSelect').value, '');
    assert.equal(await app.saveGroupEdit(), true);
    assert.equal(Object.hasOwn(app.groups.find(item => item.id === 'inherit-leaf'), 'defaultCustomerId'), false, 'inheritance is not written into the child group');

    assert.equal(app.openGroupEditModal('inherit-override-leaf'), true);
    assert.match(document.getElementById('groupEditClockodoHint').textContent, /Inherited from a parent group: Gamma/);
    app.closeGroupEditModal();

    assert.equal(app.openGroupEditModal('inherit-leaf'), true);
    app.selectClockodoComboboxOption('group', 'customer', { id: '7', label: 'Gamma' });
    assert.equal(await app.saveGroupEdit(), true);
    assert.equal(app.groups.find(item => item.id === 'inherit-leaf').defaultCustomerId, '7', 'an explicit override is persisted');

    app.editingActivityId = 'inherit-leaf-child-a';
    const childCopy = await app.duplicateActivity();
    assert.equal(childCopy.customerId, '7', 'the new override applies to descendants');

    assert.equal(app.openGroupEditModal('inherit-leaf'), true);
    app.clearGroupDefaultCustomer();
    assert.equal(await app.saveGroupEdit(), true);
    assert.equal(Object.hasOwn(app.groups.find(item => item.id === 'inherit-leaf'), 'defaultCustomerId'), false);
    assert.equal(app.openGroupEditModal('inherit-leaf-child'), true);
    assert.match(document.getElementById('groupEditClockodoHint').textContent, /Inherited from a parent group: Beta/, 'clearing restores inheritance');

    const root = app.groups.find(item => item.id === 'inherit-root');
    root.defaultCustomerId = '7';
    root.defaultCustomerName = 'Gamma';
    await app.storage.saveGroup(root);
    app.editingActivityId = 'inherit-leaf-child-a';
    const afterRootChange = await app.duplicateActivity();
    assert.equal(afterRootChange.customerId, '7', 'a changed ancestor default affects future descendants');
});

test('new time entries inherit the effective group customer without touching stored entries', async () => {
    const { app, document } = makeGroupInheritanceApp();
    await app.loadActivities();
    await app.loadGroups();
    await app.loadTimeEntries();
    app.showAddEntryModal();
    assert.equal(document.getElementById('entryEditCustomerSelect').value, '5', 'the add-entry default follows the group chain');
    assert.equal(document.getElementById('entryEditCustomerInput').value, 'Beta');
    assert.equal(app.editingEntryId, null);

    app.populateEntryAssignmentForActivity('inherit-override-leaf-a');
    assert.equal(document.getElementById('entryEditCustomerSelect').value, '7', 'changing the activity in add mode follows its group chain');
    assert.equal(document.getElementById('entryEditCustomerInput').value, 'Gamma');

    const existing = app.timeEntries.find(item => item.id === 'inherit-entry');
    app.showEntryEditModal(existing.id);
    assert.equal(document.getElementById('entryEditCustomerSelect').value, '', 'editing an existing entry does not inherit a new customer');
    assert.equal(app.timeEntries.find(item => item.id === 'inherit-entry').customerId, null, 'the stored entry keeps its empty assignment');
});

test('a missing inherited default customer is ignored and reported in the group editor', async () => {
    const { app, document } = makeGroupInheritanceApp();
    await app.loadActivities();
    await app.loadGroups();
    app.clockodoCustomers = [{ id: 7, name: 'Gamma', active: true }];
    app.editingActivityId = 'inherit-leaf-a';
    const copy = await app.duplicateActivity();
    assert.equal(copy.customerId, '', 'a dangling inherited customer is not applied');
    assert.equal(app.openGroupEditModal('inherit-leaf'), true);
    assert.match(document.getElementById('groupEditClockodoHint').textContent, /no longer available/i);
});

function makeIconServiceApp() {
    const harness = createTestApp();
    const { app, document } = harness;
    app.clockodoReferenceStatus = 'ready';
    app.clockodoCustomers = [{ id: 5, name: 'Beta', active: true, serviceAssignments: [31, 32, 33, 34] }];
    app.clockodoServices = [
        { id: 31, name: 'Anfahrt', active: true },
        { id: 32, name: 'Fensterreinigung', active: true },
        { id: 33, name: 'Treppenhaus/Keller Reinigung', active: true },
        { id: 34, name: 'Sonstiges', active: true }
    ];
    app.renderMain = () => {};
    app.populateClockodoAssignmentSelects('activity', '5', null, 'Beta', '');
    return harness;
}

test('icon changes select the mapped Clockodo services', () => {
    const { app, document } = makeIconServiceApp();
    assert.equal(app.applyIconServiceMapping('car'), true);
    assert.equal(document.getElementById('activityServiceSelect').value, '31');
    assert.equal(document.getElementById('activityServiceInput').value, 'Anfahrt');
    assert.equal(app.applyIconServiceMapping('squeegee'), true);
    assert.equal(document.getElementById('activityServiceSelect').value, '32');
    assert.equal(document.getElementById('activityServiceInput').value, 'Fensterreinigung');
    assert.equal(app.applyIconServiceMapping('mop'), true);
    assert.equal(document.getElementById('activityServiceSelect').value, '33');
    assert.equal(document.getElementById('activityServiceInput').value, 'Treppenhaus/Keller Reinigung');
    assert.equal(app.applyIconServiceMapping('duster'), false);
    assert.equal(document.getElementById('activityServiceSelect').value, '33', 'icons without a mapping preserve the service');
});

test('an unavailable mapped service preserves the current service and reports it', () => {
    const { app, document } = makeIconServiceApp();
    app.applyIconServiceMapping('car');
    app.clockodoServices = app.clockodoServices.filter(item => item.name !== 'Fensterreinigung');
    assert.equal(app.applyIconServiceMapping('squeegee'), false);
    assert.equal(document.getElementById('activityServiceSelect').value, '31');
    assert.equal(document.getElementById('activityServiceInput').value, 'Anfahrt');
    assert.match(document.getElementById('activityClockodoHint').textContent, /Fensterreinigung/);

    app.clockodoServices = [
        { id: 31, name: 'Anfahrt', active: true },
        { id: 33, name: 'Treppenhaus/Keller Reinigung', active: true }
    ];
    app.clockodoCustomers[0].serviceAssignments = [31];
    assert.equal(app.applyIconServiceMapping('mop'), false);
    assert.equal(document.getElementById('activityServiceSelect').value, '31', 'a service not allowed for the customer is not selected');
    assert.equal(document.getElementById('activityClockodoHint').textContent, app.t('clockodoServiceNotAllowedForCustomer'));
});

test('creating an activity applies the icon service default unless a service was chosen manually', async () => {
    const { app, document } = makeIconServiceApp();
    document.getElementById('activityName').value = 'Window cleaning';
    document.querySelector = selector => {
        if (selector === '.icon-option.selected') return { dataset: { icon: 'squeegee' } };
        if (selector === '.color-option.selected') return { style: { backgroundColor: '#123456' } };
        if (selector === '.shape-option.selected') return { dataset: { shape: 'circle' } };
        return null;
    };
    await app.saveActivity();
    const created = app.activities.find(item => item.name === 'Window cleaning');
    assert.ok(created);
    assert.equal(created.serviceId, '32');
    assert.equal(created.serviceName, 'Fensterreinigung');

    app.activityServiceManuallySelected = true;
    document.getElementById('activityServiceSelect').value = '34';
    document.getElementById('activityServiceInput').value = 'Sonstiges';
    document.getElementById('activityName').value = 'Manual service';
    await app.saveActivity();
    const manual = app.activities.find(item => item.name === 'Manual service');
    assert.equal(manual.serviceId, '34', 'a manually selected service is not overwritten by the icon mapping');
    assert.equal(manual.serviceName, 'Sonstiges');
});

test('unrelated edits and timer reloads keep the current service', async () => {
    const { app, document } = createTestApp({
        activities: [{
            id: 'existing-timer', name: 'Existing', groupId: '', customerId: '5', customerName: 'Beta',
            serviceId: '34', serviceName: 'Sonstiges', position: 0, archived: false
        }]
    });
    app.clockodoReferenceStatus = 'ready';
    app.clockodoCustomers = [{ id: 5, name: 'Beta', active: true, serviceAssignments: [31, 32, 33, 34] }];
    app.clockodoServices = [
        { id: 31, name: 'Anfahrt', active: true },
        { id: 32, name: 'Fensterreinigung', active: true },
        { id: 33, name: 'Treppenhaus/Keller Reinigung', active: true },
        { id: 34, name: 'Sonstiges', active: true }
    ];
    app.renderMain = () => {};
    await app.loadActivities();
    assert.equal(app.activities[0].serviceId, '34', 'loading a timer never applies a new default');

    app.editingActivityId = 'existing-timer';
    document.getElementById('activityServiceSelect').value = '34';
    document.getElementById('activityServiceInput').value = 'Sonstiges';
    document.getElementById('activityName').value = 'Existing renamed';
    document.querySelector = selector => {
        if (selector === '.icon-option.selected') return { dataset: { icon: 'car' } };
        if (selector === '.color-option.selected') return { style: { backgroundColor: '#123456' } };
        if (selector === '.shape-option.selected') return { dataset: { shape: 'circle' } };
        return null;
    };
    await app.saveActivity();
    assert.equal(app.activities[0].serviceId, '34', 'an unrelated edit does not overwrite the selected service');
    assert.equal(app.activities[0].serviceName, 'Sonstiges');
});

test('creation does not apply an icon service that the customer cannot use', async () => {
    const { app, document } = makeIconServiceApp();
    app.clockodoCustomers[0].serviceAssignments = [34];
    app.populateClockodoAssignmentSelects('activity', '5', '34', 'Beta', 'Sonstiges');
    document.getElementById('activityName').value = 'Restricted service';
    document.querySelector = selector => {
        if (selector === '.icon-option.selected') return { dataset: { icon: 'squeegee' } };
        if (selector === '.color-option.selected') return { style: { backgroundColor: '#123456' } };
        if (selector === '.shape-option.selected') return { dataset: { shape: 'circle' } };
        return null;
    };
    await app.saveActivity();
    const created = app.activities.find(item => item.name === 'Restricted service');
    assert.ok(created);
    assert.equal(created.serviceId, '34', 'the mapped service 32 is not allowed for the customer');
    assert.equal(created.serviceName, 'Sonstiges');
});

test('group headers reserve enough width for the full name in both states', () => {
    const harness = createGroupCanvasHarness();
    const { app, containers } = harness;
    const longName = 'Objekt Treppenhaus Theodorstraße 29-33';
    app.activities = [{ id: 'long-name-a', name: 'A', position: 0, groupId: 'long-name-group', size: 'small' }];
    app.activityLayouts = new Map([
        ['long-name-a', { activityId: 'long-name-a', x: 0, y: 0, width: 120, height: 120 }]
    ]);
    app.groups = [{ id: 'long-name-group', name: longName, x: 200, y: 200, collapsed: false }];
    app.renderMain();

    const requiredWidth = app.ceilToCanvasGrid(app.groupTitleMinWidth(app.groups[0]));
    assert.ok(requiredWidth > 160, 'the title needs more width than the small activity');
    const expanded = containers.filter(item => item.dataset.groupId === 'long-name-group').at(-1);
    assert.ok(Number.parseFloat(expanded.style.width) >= requiredWidth, 'the expanded group reserves the full title width');
    assert.equal(expanded.children[0].children[1].textContent, longName, 'the full name is rendered');

    app.groups[0].collapsed = true;
    app.renderMain();
    const collapsed = containers.filter(item => item.dataset.groupId === 'long-name-group').at(-1);
    assert.equal(app.groupCollapsedWidth(app.groups[0]), requiredWidth, 'the collapsed group reserves the full title width');
    assert.equal(Number.parseFloat(collapsed.style.width), requiredWidth);
    assert.equal(collapsed.children[0].children[1].textContent, longName, 'the full name stays in the collapsed header');
});

test('overnight entries are grouped by local start day without creating false overlaps', async () => {
    const { app } = createTestApp();
    const t = (day, hour, minute = 0) => new Date(2026, 9, day, hour, minute, 0).getTime();
    await app.addEntry({
        id: 'late', activityId: 'act-1', activityNameSnapshot: 'Late shift',
        startTimestamp: t(5, 23), endTimestamp: t(6, 0)
    });
    await app.addEntry({
        id: 'early', activityId: 'act-2', activityNameSnapshot: 'Early shift',
        startTimestamp: t(6, 0), endTimestamp: t(6, 2)
    });
    assert.deepEqual([...app.getOverlappingEntryIds()], []);
    assert.deepEqual(Array.from(app.getDayEntries('2026-10-05'), entry => entry.id), ['late']);
    assert.deepEqual(Array.from(app.getDayEntries('2026-10-06'), entry => entry.id), ['early']);
    assert.equal(app.calculateDayTotal('2026-10-05'), 60 * 60 * 1000);
});

test('entries around a daylight-saving jump stay non-overlapping and keep exact durations', async () => {
    const { app } = createTestApp();
    const beforeJump = new Date(2026, 2, 29, 1, 0, 0).getTime();
    const afterJump = new Date(2026, 2, 29, 3, 0, 0).getTime();
    await app.addEntry({
        id: 'before-dst', activityId: 'act-1', activityNameSnapshot: 'Before',
        startTimestamp: beforeJump, endTimestamp: beforeJump + 30 * 60 * 1000
    });
    await app.addEntry({
        id: 'after-dst', activityId: 'act-2', activityNameSnapshot: 'After',
        startTimestamp: afterJump, endTimestamp: afterJump + 60 * 60 * 1000
    });
    app.reviewDate = '2026-03-29';
    assert.deepEqual([...app.getOverlappingEntryIds()], []);
    const entries = app.getDayEntries('2026-03-29');
    assert.deepEqual(Array.from(entries, entry => entry.id), ['before-dst', 'after-dst']);
    assert.equal(app.getSuspiciousEntries('2026-03-29').length, 0);
    assert.equal(app.calculateDayTotal('2026-03-29'), 90 * 60 * 1000);
});

test('invalid and missing timestamps are preserved, excluded from overlap checks, and never replaced with now', async () => {
    const { app, storageData } = createTestApp();
    storageData.timeEntries.push(
        { id: 'missing-start', activityId: 'act-1', activityNameSnapshot: 'Missing start', endTimestamp: Date.now() },
        { id: 'reversed', activityId: 'act-1', activityNameSnapshot: 'Reversed', startTimestamp: 2000, endTimestamp: 1000 },
        { id: 'bad-end', activityId: 'act-1', activityNameSnapshot: 'Bad end', startTimestamp: 3000, endTimestamp: 'not-a-time' }
    );
    await app.loadTimeEntries();
    const missing = app.timeEntries.find(entry => entry.id === 'missing-start');
    const badEnd = app.timeEntries.find(entry => entry.id === 'bad-end');
    const reversed = app.timeEntries.find(entry => entry.id === 'reversed');
    assert.equal(missing.startTimestamp, null);
    assert.equal(missing.timeDataInvalid, true);
    assert.equal(badEnd.endTimestamp, null);
    assert.equal(badEnd.timeDataInvalid, true);
    assert.equal(reversed.startTimestamp, 2000);
    assert.equal(reversed.endTimestamp, 1000);
    assert.deepEqual([...app.getOverlappingEntryIds()], []);
    assert.deepEqual(Array.from(app.getSuspiciousEntries(app.toDateString(new Date(1970, 0, 1, 0, 0, 2))), item => item.entry.id).sort(), ['bad-end', 'reversed']);
});

test('a failed add or update never leaves stale in-memory entries that could create false overlaps', async () => {
    const { app, storageData } = createTestApp();
    const t = (hour, minute = 0) => new Date(2026, 9, 5, hour, minute, 0).getTime();
    const originalSave = app.storage.saveTimeEntry;
    let failNext = true;
    app.storage.saveTimeEntry = async entry => {
        if (failNext) {
            failNext = false;
            throw new Error('storage_write_failed');
        }
        return originalSave(entry);
    };

    await assert.rejects(() => app.addEntry({
        id: 'not-saved', activityId: 'act-1', activityNameSnapshot: 'Not saved',
        startTimestamp: t(10), endTimestamp: t(11)
    }), /storage_write_failed/);
    assert.equal(app.timeEntries.some(entry => entry.id === 'not-saved'), false);
    assert.equal(storageData.timeEntries.some(entry => entry.id === 'not-saved'), false);

    const saved = await app.addEntry({
        id: 'editable', activityId: 'act-1', activityNameSnapshot: 'Editable',
        startTimestamp: t(12), endTimestamp: t(13)
    });
    failNext = true;
    await assert.rejects(() => app.updateEntry(saved.id, {
        startTimestamp: t(14), endTimestamp: t(15)
    }), /storage_write_failed/);
    assert.equal(app.timeEntries.find(entry => entry.id === 'editable').startTimestamp, t(12));
    assert.equal(storageData.timeEntries.find(entry => entry.id === 'editable').startTimestamp, t(12));
});

test('a failed delete keeps the entry in memory and storage', async () => {
    const { app, storageData } = createTestApp();
    const t = (hour, minute = 0) => new Date(2026, 9, 5, hour, minute, 0).getTime();
    const entry = await app.addEntry({
        id: 'keep-on-failure', activityId: 'act-1', activityNameSnapshot: 'Keep',
        startTimestamp: t(8), endTimestamp: t(9)
    });
    const originalDelete = app.storage.deleteTimeEntry;
    app.storage.deleteTimeEntry = async () => { throw new Error('delete_failed'); };
    await assert.rejects(() => app.deleteEntry(entry.id), /delete_failed/);
    assert.equal(app.timeEntries.some(item => item.id === entry.id), true);
    assert.equal(storageData.timeEntries.some(item => item.id === entry.id), true);
    app.storage.deleteTimeEntry = originalDelete;
});

test('a restore failure rolls back to the pre-restore snapshot instead of leaving replaced data', async () => {
    const { app, storageData } = createTestApp();
    const t = (hour, minute = 0) => new Date(2026, 9, 5, hour, minute, 0).getTime();
    await app.addEntry({
        id: 'existing', activityId: 'act-1', activityNameSnapshot: 'Existing',
        startTimestamp: t(8), endTimestamp: t(9)
    });
    app.storage.validateBackupData = data => data;
    const originalImport = app.storage.importAll.bind(app.storage);
    let calls = 0;
    app.storage.importAll = async (data, merge) => {
        calls += 1;
        if (calls === 1) {
            await originalImport(data, merge);
            throw new Error('restore_verification_failed');
        }
        return originalImport(data, merge);
    };
    app.loadActivities = async () => {};
    app.loadGroups = async () => {};
    app.loadTimeEntries = async () => {};
    app.migrateMissingGroupLayouts = async () => {};
    app.migrateActivityCanvasGeometry = async () => {};
    app.renderAll = () => {};
    app.refreshAutomaticBackupStatus = async () => {};
    app.updateExternalBackupStatus = async () => {};
    app.showToast = () => {};
    app.openRestoreConfirmation({ format: 'timerhub-backup', version: 1, activities: [{ id: 'restored' }], timeEntries: [], settings: {} });
    assert.equal(await app.restorePendingData(false), false);
    assert.equal(calls, 2, 'the safety snapshot is restored after a failed replace');
    assert.equal(storageData.timeEntries.some(item => item.id === 'existing'), true);
});

test('startup backup gate distinguishes restored handles, permission renewal, and genuine setup', async () => {
    const { app } = createTestApp();
    const makeService = (state, verify) => ({
        state,
        directoryHandle: state === 'needs-selection' ? null : { kind: 'directory', name: 'Backups' },
        getStatus() {
            const hasHandle = state !== 'needs-selection' && state !== 'unsupported';
            return {
                state,
                permissionState: state === 'permission-required' ? 'prompt' : state === 'permission-denied' ? 'denied' : 'granted',
                savedHandleAvailable: hasHandle,
                directoryName: hasHandle ? 'Backups' : '',
                lastError: state === 'permission-required' ? 'permission_prompt' : state === 'permission-denied' ? 'permission_denied' : null,
                capabilities: { directoryPicker: state !== 'unsupported' }
            };
        },
        async verifyWritable() { if (verify) throw verify; return true; },
        async cleanupOwnTemporaryFiles() { return 0; },
        async init() { return this.getStatus(); },
        async requestAccess() { this.state = 'ready'; return this.getStatus(); }
    });
    app.backupService = makeService('unsupported');
    assert.equal((await app.evaluateBackupGate()).reason, 'unsupported');
    app.backupService = makeService('needs-selection');
    assert.equal((await app.evaluateBackupGate()).reason, 'needs-selection');
    app.backupService = makeService('handle-invalid');
    assert.equal((await app.evaluateBackupGate()).reason, 'handle-invalid');
    app.backupService = makeService('permission-required');
    const required = await app.evaluateBackupGate();
    assert.equal(required.ready, true, 'permission renewal must not hide the canvas');
    assert.equal(required.warning, 'permission-required');
    app.backupService = makeService('permission-denied');
    const denied = await app.evaluateBackupGate();
    assert.equal(denied.ready, true);
    assert.equal(denied.warning, 'permission-denied');
    app.backupService = makeService('restore-error');
    const restoreError = await app.evaluateBackupGate();
    assert.equal(restoreError.ready, true, 'a transient restore failure must not ask for a new folder');
    assert.equal(restoreError.warning, 'restore-error');
    app.backupService = makeService('ready');
    assert.equal((await app.evaluateBackupGate()).ready, true);
    app.backupService = makeService('ready', Object.assign(new Error('required'), { code: 'backup_permission_required' }));
    const renewal = await app.evaluateBackupGate();
    assert.equal(renewal.ready, true);
    assert.equal(renewal.warning, 'permission-required');
    app.backupService = makeService('ready', Object.assign(new Error('denied'), { code: 'backup_permission_denied' }));
    const failed = await app.evaluateBackupGate();
    assert.equal(failed.ready, true);
    assert.equal(failed.warning, 'permission-denied');
});

test('external backups are skipped while startup is locked and manual backup failures keep the app usable', async () => {
    const { app } = createTestApp();
    const calls = [];
    app.backupService = {
        directoryHandle: { kind: 'directory', name: 'Backups' },
        async createBackup(options) { calls.push(options); return { name: 'backup.json', skipped: false }; },
        async findLatestVerified() { return null; },
        async listBackups() { return []; },
        getStatus() { return { state: 'ready', directoryName: 'Backups' }; }
    };
    app.updateExternalBackupStatus = async () => {};
    app.showToast = () => {};
    app.startupFinalized = false;
    app.handleMutationCommitted(1);
    assert.equal(calls.length, 0, 'mutations during setup do not schedule external backups');
    app.startupFinalized = true;
    app.scheduleExternalBackup(2);
    if (app.autoBackupTimer !== null) clearTimeout(app.autoBackupTimer);
    await app.flushExternalBackup({ force: true });
    assert.equal(calls.length, 1);
    assert.equal(calls[0].force, true);
});

test('an empty local database with a non-empty external backup is treated as recoverable, not as a fresh install', () => {
    const { app, document, localStorageData } = createTestApp();
    app.activities = [];
    app.archivedActivities = [];
    app.timeEntries = [];
    app.groups = [];
    app.missingDataSuspected = false;
    app.latestExternalBackup = {
        name: 'timerhub_auto_backup_20260101_000000_x.json',
        createdAt: Date.now() - 1000,
        meta: { counts: { activities: 2, timeEntries: 5, groups: 1 } }
    };
    app.refreshMissingDataWarning();
    assert.equal(document.getElementById('missingDataWarning').style.display, 'block');
    app.dismissMissingDataWarning();
    assert.ok(Number(localStorageData.get('timerhubExternalEmptyWarningDismissedAt')) > 0);
    app.refreshMissingDataWarning();
    assert.equal(document.getElementById('missingDataWarning').style.display, 'none');
    app.latestExternalBackup = {
        name: 'newer.json', createdAt: Date.now() + 5000,
        meta: { counts: { activities: 2, timeEntries: 5, groups: 1 } }
    };
    app.refreshMissingDataWarning();
    assert.equal(document.getElementById('missingDataWarning').style.display, 'block', 'a newer backup reopens the recovery warning');
});

test('a burst of 50 saves coalesces into one automatic snapshot and one consistent export read', async () => {
    const { context } = createTestApp();
    const repository = vm.runInContext('new StorageRepository()', context);
    const harness = createIndexedDbHarness();
    repository.db = harness.db;
    let exportTransactions = 0;
    const originalTransaction = harness.db.transaction;
    harness.db.transaction = function (storeNames, mode) {
        if (mode === 'readonly' && Array.isArray(storeNames) && storeNames.length > 1) exportTransactions += 1;
        return originalTransaction.call(this, storeNames, mode);
    };
    for (let index = 0; index < 50; index += 1) {
        await repository.saveActivity({ id: `burst-${index}`, name: `Burst ${index}` });
    }
    assert.equal(harness.stats.snapshotTransactions, 0, 'no synchronous full-database snapshot is taken per save');
    await repository.flushAutomaticSnapshot();
    assert.equal(harness.stats.snapshotTransactions, 1, '50 saves produce exactly one local snapshot');
    assert.equal(exportTransactions, 1, 'one export transaction captures all stores consistently');
});

test('duplicate records with the same stable ID do not flag a free interval as overlapping', async () => {
    const { app } = createTestApp();
    const t = (hour, minute = 0) => new Date(2026, 9, 5, hour, minute, 0).getTime();
    const entry = {
        id: 'duplicate-id', activityId: 'act-1', activityNameSnapshot: 'Painting',
        startTimestamp: t(9), endTimestamp: t(10)
    };
    app.timeEntries = [entry, { ...entry }];
    app.reviewDate = '2026-10-05';
    assert.deepEqual([...app.getOverlappingEntryIds()], []);
    assert.equal(app.getSuspiciousEntries('2026-10-05').length, 0);
});

test('the setup screen reuses a saved handle instead of asking for folder selection', async () => {
    const { app, document } = createTestApp();
    const status = {
        state: 'permission-required',
        permissionState: 'prompt',
        savedHandleAvailable: true,
        directoryName: 'My backups',
        lastError: 'permission_prompt',
        capabilities: { directoryPicker: true }
    };
    app.backupService = { getStatus: () => status };
    app.showBackupSetup({ ready: false, reason: 'permission-required', status });
    assert.equal(document.getElementById('backupSetupChooseBtn').hidden, true, 'first-time selection is not offered for a saved handle');
    assert.equal(document.getElementById('backupSetupReauthorizeBtn').hidden, false, 'the primary action renews access to the saved handle');
    assert.equal(document.getElementById('backupSetupChangeDirBtn').hidden, false, 'changing folders remains an explicit secondary action');
    assert.equal(document.getElementById('backupSetupRetryBtn').hidden, true);
    assert.match(document.getElementById('backupSetupTitle').textContent, /Restore access/);
    assert.match(document.getElementById('backupSetupCompatibility').textContent, /do not need to select a new folder/i);

    const missing = {
        state: 'needs-selection',
        savedHandleAvailable: false,
        directoryName: '',
        capabilities: { directoryPicker: true }
    };
    app.backupService = { getStatus: () => missing };
    app.showBackupSetup({ ready: false, reason: 'needs-selection', status: missing });
    assert.equal(document.getElementById('backupSetupChooseBtn').hidden, false, 'selection is offered when no handle exists');
    assert.equal(document.getElementById('backupSetupReauthorizeBtn').hidden, true);
    assert.equal(document.getElementById('backupSetupChangeDirBtn').hidden, true);
});

test('the setup screen offers retry for a transient handle restore error and not a new folder first', async () => {
    const { app, document } = createTestApp();
    const status = {
        state: 'restore-error',
        savedHandleAvailable: false,
        directoryName: '',
        lastError: 'transient_read_failure',
        capabilities: { directoryPicker: true }
    };
    app.backupService = { getStatus: () => status };
    app.showBackupSetup({ ready: false, reason: 'restore-error', status });
    assert.equal(document.getElementById('backupSetupRetryBtn').hidden, false);
    assert.equal(document.getElementById('backupSetupChooseBtn').hidden, false, 'a different folder remains a recovery option');
    assert.match(document.getElementById('backupSetupTitle').textContent, /could not be loaded/i);
});

test('an invalid saved handle leads to a clear recoverable setup flow without deleting the handle', async () => {
    const { app, document } = createTestApp();
    const status = {
        state: 'handle-invalid',
        savedHandleAvailable: false,
        directoryName: '',
        lastError: 'saved_handle_invalid',
        capabilities: { directoryPicker: true }
    };
    app.backupService = { getStatus: () => status };
    app.showBackupSetup({ ready: false, reason: 'handle-invalid', status });
    assert.equal(document.getElementById('backupSetupChooseBtn').hidden, false);
    assert.equal(document.getElementById('backupSetupRetryBtn').hidden, true);
});

test('the setup reauthorize action renews the saved handle and never opens the directory picker', async () => {
    const { app } = createTestApp();
    let requestAccessCalls = 0;
    let selectCalls = 0;
    app.backupService = {
        async requestAccess() { requestAccessCalls += 1; this.state = 'ready'; return { state: 'ready' }; },
        async selectDirectory() { selectCalls += 1; return { state: 'ready' }; },
        getStatus() { return { state: 'ready', savedHandleAvailable: true, directoryName: 'Backups' }; }
    };
    app.ensureStartupExternalBackup = async () => ({ name: 'backup.json' });
    app.unlockMainApplication = () => {};
    app.finishStartup = async () => { app.finished = true; return true; };
    app.startupFinalized = false;
    assert.equal(await app.handleBackupSetupChoice('reauthorize'), true);
    assert.equal(requestAccessCalls, 1);
    assert.equal(selectCalls, 0);
    assert.equal(app.finished, true);
});

test('the setup retry action reloads the saved handle before deciding the canvas is blocked', async () => {
    const { app } = createTestApp();
    const order = [];
    app.backupService = {
        async init() { order.push('init'); return { state: 'ready' }; },
        async verifyWritable() { order.push('verify'); return true; },
        async cleanupOwnTemporaryFiles() { return 0; },
        getStatus() { return { state: 'ready', savedHandleAvailable: true, directoryName: 'Backups' }; }
    };
    app.ensureStartupExternalBackup = async () => ({ name: 'backup.json' });
    app.unlockMainApplication = () => {};
    app.finishStartup = async () => { app.finished = true; return true; };
    app.startupFinalized = false;
    assert.equal(await app.handleBackupSetupChoice('retry'), true);
    assert.deepEqual(order, ['init']);
    assert.equal(app.finished, true);
});

test('unsupported directory APIs show a compatibility explanation instead of a repeated setup action', () => {
    const { app, document } = createTestApp();
    const status = {
        state: 'unsupported',
        savedHandleAvailable: false,
        directoryName: '',
        capabilities: { directoryPicker: false }
    };
    app.backupService = { getStatus: () => status };
    app.showBackupSetup({ ready: false, reason: 'unsupported', status });
    assert.match(document.getElementById('backupSetupTitle').textContent, /not supported/i);
    assert.match(document.getElementById('backupSetupCompatibility').textContent, /Chrome 132|native wrapper/i);
    assert.equal(document.getElementById('backupSetupChooseBtn').hidden, true);
    assert.equal(document.getElementById('backupSetupReauthorizeBtn').hidden, true);
    assert.equal(document.getElementById('backupSetupChangeDirBtn').hidden, true);
    assert.equal(document.getElementById('backupSetupExportBtn').hidden, false, 'data export remains available');
});

test('startup decision opens the canvas for permission renewal and only blocks genuinely missing folders', () => {
    const { app } = createTestApp();
    for (const state of ['permission-required', 'permission-denied', 'permission-unknown', 'restore-error']) {
        const decision = app.decideBackupStartup({ state, savedHandleAvailable: true, directoryName: 'Backups' });
        assert.equal(decision.mode, 'degraded', `${state} must not hide the canvas`);
        assert.equal(decision.warning, state);
    }
    for (const state of ['needs-selection', 'handle-invalid', 'unsupported']) {
        const decision = app.decideBackupStartup({ state, savedHandleAvailable: false, directoryName: '' });
        assert.equal(decision.mode, 'setup', `${state} may show folder setup`);
    }
    assert.equal(app.decideBackupStartup({ state: 'ready' }).mode, 'ready');
});

test('temporary handle restore errors are retried before any setup decision', async () => {
    const { app } = createTestApp();
    let calls = 0;
    app.backupService = {
        async init() {
            calls += 1;
            return calls < 3
                ? { state: 'restore-error', savedHandleAvailable: false }
                : { state: 'ready', savedHandleAvailable: true, directoryName: 'Backups', permissionState: 'granted' };
        }
    };
    const status = await app.restoreBackupAccessBeforeScreen({ retryDelays: [0, 0] });
    assert.equal(calls, 3);
    assert.equal(status.state, 'ready');
    assert.equal(app.decideBackupStartup(status).mode, 'ready');
});

test('a permission warning is a non-blocking banner that names the saved folder', () => {
    const { app, document } = createTestApp();
    app.startupFinalized = true;
    app.showBackupAccessWarning('permission-required', {
        state: 'permission-required',
        savedHandleAvailable: true,
        directoryName: 'My backups'
    });
    const banner = document.getElementById('backupAccessBanner');
    assert.equal(banner.hidden, false);
    assert.match(document.getElementById('backupAccessBannerText').textContent, /My backups/);
    assert.match(document.getElementById('backupAccessRestoreBtn').textContent, /Restore access/);
    assert.notEqual(document.getElementById('backupAccessSettingsBtn').hidden, true);
    app.hideBackupAccessWarning();
    assert.equal(banner.hidden, true);
});

test('a permission warning does not mark the application as locked', () => {
    const { app, context } = createTestApp();
    let locked = false;
    app.lockMainApplication = () => { locked = true; };
    app.startupFinalized = true;
    app.showBackupAccessWarning('permission-required', {
        state: 'permission-required', savedHandleAvailable: true, directoryName: 'Backups'
    });
    assert.equal(locked, false);
    assert.equal(context.document.title, '');
});

test('setup retry with a restored folder but prompt permission opens the canvas in degraded mode', async () => {
    const { app } = createTestApp();
    let setupShown = 0;
    let finishArgs = null;
    app.backupService = {
        async init() {
            return {
                state: 'permission-required', savedHandleAvailable: true,
                directoryName: 'Backups', permissionState: 'prompt'
            };
        },
        getStatus() {
            return {
                state: 'permission-required', savedHandleAvailable: true,
                directoryName: 'Backups', permissionState: 'prompt'
            };
        }
    };
    app.showBackupSetup = () => { setupShown += 1; };
    app.finishStartup = async options => { finishArgs = options; return true; };
    app.startupFinalized = false;
    assert.equal(await app.handleBackupSetupChoice('retry'), true);
    assert.equal(setupShown, 0, 'a saved folder must not send the user back to setup');
    assert.equal(finishArgs.backupWarning, 'permission-required');
});

test('setup retry only offers setup when restoration confirms the handle is missing', async () => {
    const { app, document } = createTestApp();
    let finishCalled = false;
    app.backupService = {
        async init() {
            return { state: 'needs-selection', savedHandleAvailable: false, directoryName: '' };
        },
        getStatus() {
            return {
                state: 'needs-selection', savedHandleAvailable: false,
                directoryName: '', capabilities: { directoryPicker: true }
            };
        }
    };
    app.finishStartup = async () => { finishCalled = true; return true; };
    app.startupFinalized = false;
    assert.equal(await app.handleBackupSetupChoice('retry'), false);
    assert.equal(finishCalled, false);
    assert.equal(document.getElementById('backupSetupChooseBtn').hidden, false);
});

test('startup flow completes the canvas for granted and renewable handles but blocks only on missing folders', async () => {
    for (const scenario of [
        { state: 'ready', expectedSetup: 0, expectedWarning: null },
        { state: 'permission-required', expectedSetup: 0, expectedWarning: 'permission-required' },
        { state: 'permission-denied', expectedSetup: 0, expectedWarning: 'permission-denied' },
        { state: 'restore-error', expectedSetup: 0, expectedWarning: 'restore-error' },
        { state: 'needs-selection', expectedSetup: 1, expectedWarning: null },
        { state: 'handle-invalid', expectedSetup: 1, expectedWarning: null },
        { state: 'unsupported', expectedSetup: 1, expectedWarning: null }
    ]) {
        const { app } = createTestApp();
        let setupShown = 0;
        let finishOptions = null;
        const status = {
            state: scenario.state,
            savedHandleAvailable: !['needs-selection', 'handle-invalid', 'unsupported'].includes(scenario.state),
            directoryName: ['needs-selection', 'handle-invalid', 'unsupported'].includes(scenario.state) ? '' : 'Backups',
            permissionState: scenario.state === 'permission-required' ? 'prompt' : 'granted',
            capabilities: { directoryPicker: scenario.state !== 'unsupported' }
        };
        app.storage.init = async () => {};
        app.loadSettings = async () => {};
        app.loadBackupRetention = async () => 20;
        app.applyTranslations = () => {};
        app.loadActivities = async () => {};
        app.loadGroups = async () => {};
        app.loadTimeEntries = async () => {};
        app.evaluateSuspiciousEmptyState = () => false;
        app.updateDataPresenceMarker = () => {};
        app.restoreBackupAccessBeforeScreen = async () => status;
        app.showBackupSetup = () => { setupShown += 1; };
        app.finishStartup = async options => { finishOptions = options; return true; };
        await app.init();
        assert.equal(setupShown, scenario.expectedSetup, `${scenario.state} setup decision`);
        if (scenario.expectedWarning) {
            assert.equal(finishOptions?.backupWarning, scenario.expectedWarning, `${scenario.state} warning`);
        } else if (scenario.expectedSetup === 0) {
            assert.equal(finishOptions?.backupWarning || null, null, `${scenario.state} no warning`);
        }
    }
});

test('the non-blocking restore action renews access to the saved folder and clears the warning', async () => {
    const { app, document } = createTestApp();
    let requestAccessCalls = 0;
    const readyStatus = {
        state: 'ready', savedHandleAvailable: true, directoryName: 'Backups',
        permissionState: 'granted'
    };
    const promptStatus = {
        state: 'permission-required', savedHandleAvailable: true, directoryName: 'Backups',
        permissionState: 'prompt'
    };
    app.backupService = {
        async init() { return promptStatus; },
        async requestAccess() { requestAccessCalls += 1; return readyStatus; },
        async queryPermission() { return 'granted'; },
        getStatus() { return readyStatus; }
    };
    app.startupFinalized = true;
    app.ensureStartupExternalBackup = async () => ({ name: 'backup.json' });
    app.updateExternalBackupStatus = async () => {};
    app.showToast = () => {};
    app.showBackupAccessWarning('permission-required', promptStatus);
    assert.equal(document.getElementById('backupAccessBanner').hidden, false);
    assert.equal(await app.restoreBackupAccessFromBanner(), true);
    assert.equal(requestAccessCalls, 1);
    assert.equal(document.getElementById('backupAccessBanner').hidden, true);
});
