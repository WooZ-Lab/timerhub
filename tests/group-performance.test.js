import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { performance } from 'node:perf_hooks';
import { webcrypto } from 'node:crypto';
import test from 'node:test';
import vm from 'node:vm';

const source = await readFile(new URL('../app.js', import.meta.url), 'utf8');
const clockodoClientSource = await readFile(new URL('../clockodo-client.js', import.meta.url), 'utf8');
const exchangeSource = await readFile(new URL('../exchange.js', import.meta.url), 'utf8');
const assignmentSource = await readFile(new URL('../assignment.js', import.meta.url), 'utf8');

function createTestApp(initialData = {}) {
    const storageData = {
        activities: initialData.activities || [],
        timeEntries: initialData.timeEntries || [],
        syncBatches: initialData.syncBatches || [],
        groups: initialData.groups || [],
        layout: initialData.layout || [],
        settings: initialData.settings || {}
    };
    const writes = { activity: 0, layout: 0, group: 0, setting: 0, import: 0 };
    const mockStorage = {
        async init() {},
        async getActivities() { return structuredClone(storageData.activities); },
        async saveActivity(a) {
            writes.activity += 1;
            const idx = storageData.activities.findIndex(item => item.id === a.id);
            if (idx >= 0) storageData.activities[idx] = structuredClone(a);
            else storageData.activities.push(structuredClone(a));
            return a;
        },
        async deleteActivity(id) { storageData.activities = storageData.activities.filter(a => a.id !== id); },
        async getTimeEntries() { return structuredClone(storageData.timeEntries); },
        async saveTimeEntry(e) { return e; },
        async deleteTimeEntry() {},
        async getSyncBatches() { return structuredClone(storageData.syncBatches); },
        async getGroups() { return structuredClone(storageData.groups); },
        async applyAssignmentImport({ putGroups = [], putActivities = [], putLayouts = [], deleteGroupIds = [], deleteActivityIds = [], deleteLayoutIds = [], settings = {} } = {}) {
            writes.import += 1;
            const nextGroups = structuredClone(storageData.groups).filter(group => !deleteGroupIds.includes(group.id));
            const nextActivities = structuredClone(storageData.activities).filter(activity => !deleteActivityIds.includes(activity.id));
            const nextLayouts = structuredClone(storageData.layout).filter(layout => !deleteLayoutIds.includes(layout.activityId));
            putGroups.forEach(group => nextGroups.push(structuredClone(group)));
            putActivities.forEach(activity => nextActivities.push(structuredClone(activity)));
            putLayouts.forEach(layout => {
                const index = nextLayouts.findIndex(item => item.activityId === layout.activityId);
                if (index >= 0) nextLayouts[index] = structuredClone(layout);
                else nextLayouts.push(structuredClone(layout));
            });
            storageData.groups = nextGroups;
            storageData.activities = nextActivities;
            storageData.layout = nextLayouts;
            for (const [key, value] of Object.entries(settings)) storageData.settings[key] = structuredClone(value);
            return true;
        },
        async saveGroup(group) {
            writes.group += 1;
            const idx = storageData.groups.findIndex(item => item.id === group.id);
            if (idx >= 0) storageData.groups[idx] = structuredClone(group);
            else storageData.groups.push(structuredClone(group));
            return group;
        },
        async deleteGroup(id) {
            storageData.groups = storageData.groups.filter(group => group.id !== id);
        },
        async deleteLayout(id) {
            storageData.layout = storageData.layout.filter(layout => layout.activityId !== id);
        },
        async getLayout() { return structuredClone(storageData.layout); },
        async saveLayout(layout) {
            writes.layout += 1;
            const idx = storageData.layout.findIndex(item => item.activityId === layout.activityId);
            if (idx >= 0) storageData.layout[idx] = structuredClone(layout);
            else storageData.layout.push(structuredClone(layout));
            return layout;
        },
        async saveConfirmedBatch() {},
        async saveSyncProgress() {},
        async getSetting(k, def) { return storageData.settings[k] !== undefined ? storageData.settings[k] : def; },
        async setSetting(k, v) { writes.setting += 1; storageData.settings[k] = v; },
        async exportAll() { return structuredClone(storageData); },
        async importAll() {}
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
        'activityCustomerInput', 'activityCustomerList', 'activityServiceInput', 'activityServiceList',
        'syncConfirmEntriesList', 'syncConfirmDesc', 'syncConfirmSummary',
        'syncConfirmAlreadySyncedNotice', 'syncConfirmSubmitBtn', 'syncConfirmModal',
        'clockodoEmailInput', 'clockodoApiKeyInput', 'clockodoCustomerIdInput', 'clockodoProjectIdInput', 'clockodoServiceIdInput', 'clockodoSaveBtn',
        'clockodoBillableSelect', 'clockodoTestBtn', 'clockodoRemoveBtn', 'clockodoStatusValue', 'clockodoToggleKeyBtn',
        'automaticBackupStatus', 'automaticSnapshotSelect', 'restoreSnapshotBtn', 'backupRestoreModal',
        'backupRestoreMergeBtn', 'backupRestoreReplaceBtn', 'backupRestoreCancelBtn', 'backupRestoreCloseBtn',
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
        'createGroupFromGroupsBtn', 'deleteGroupsBtn', 'groupDeleteModal', 'groupDeleteModalTitle',
        'groupDeleteModalCloseBtn', 'groupDeleteSummary', 'groupDeleteOutcome', 'groupDeleteLockedWarning',
        'groupDeleteActivitiesKeep', 'groupDeleteActivitiesDelete', 'groupDeleteNestedKeep', 'groupDeleteNestedDelete',
        'groupDeleteCancelBtn', 'groupDeleteConfirmBtn', 'groupEditLockedInput', 'undoCanvasBtn', 'redoCanvasBtn', 'iconPicker'
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
    const testDocument = {
        title: '',
        documentElement: { lang: '' },
        body: { appendChild() {}, removeChild() {} },
        getElementById: id => elements.get(id) || null,
        querySelector: () => null,
        querySelectorAll: () => [],
        createElementNS: () => testDocument.createElement(),
        createElement: () => {
            const element = {
                value: '', textContent: '', style: { setProperty(name, value) { this[name] = value; } },
                dataset: {}, className: '', id: '', hidden: false, children: [],
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
                click() {}
            };
            return element;
        }
    };
    const context = vm.createContext({
        window: { location: { hostname: 'localhost' }, addEventListener() {} },
        document: testDocument,
        Blob,
        File,
        URL: { createObjectURL() { return 'blob:x'; }, revokeObjectURL() {} },
        navigator: {},
        localStorage: { getItem: () => null, setItem() {}, removeItem() {} },
        crypto: {
            randomUUID: () => `id-${Math.random().toString(36).slice(2)}`,
            getRandomValues: bytes => { bytes.fill(7); return bytes; },
            subtle: webcrypto.subtle
        },
        btoa, atob, TextEncoder, TextDecoder, Uint8Array, Array, Object, Date, Number, Math,
        setTimeout: () => 1, clearTimeout,
        console: { log() {}, error() {}, warn() {}, info() {} },
        Intl, AbortController
    });
    vm.runInContext(clockodoClientSource, context, { filename: 'clockodo-client.js' });
    vm.runInContext(exchangeSource, context, { filename: 'exchange.js' });
    vm.runInContext(assignmentSource, context, { filename: 'assignment.js' });
    vm.runInContext(source, context, { filename: 'app.js' });
    const app = vm.runInContext('new TimerHubApp()', context);
    app.storage = mockStorage;
    app.clockodoClient = null;
    app.showToast = () => {};
    return { app, storageData, document: testDocument, context, writes };
}

function createGroupCanvasHarness(initialData = {}) {
    const { app, context, storageData, writes } = createTestApp(initialData);
    context.CSS = { escape: value => value };
    context.setTimeout = (callback, delay) => setTimeout(callback, delay);
    const viewportBounds = { left: 0, top: 0, width: 1200, height: 800 };
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
    viewport.getBoundingClientRect = () => viewportBounds;
    const buttons = [];
    const handles = [];
    const containers = [];
    const stage = makeElement();
    stage.querySelector = selector => {
        const id = /data-activity-id="([^"]+)"/.exec(selector)?.[1]
            ?? /data-group-id="([^"]+)"/.exec(selector)?.[1];
        if (selector.startsWith('.group-container')) return containers.find(node => node.dataset.groupId === id) || null;
        if (selector.startsWith('.activity-resize-handle')) return handles.find(node => node.dataset.activityId === id) || null;
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
    context.document.createElementNS = () => makeElement();
    app.toggleActivity = async () => {};
    app.setupActivityCanvasInteractions();

    const pointer = (type, target, x, y, modifiers = {}) => viewport.handlers.get(type)?.({
        isPrimary: true, pointerType: 'mouse', button: 0, pointerId: 1,
        clientX: x, clientY: y, target, type, preventDefault() {}, ...modifiers
    });

    return {
        app, context, storageData, writes, viewport, stage,
        buttons, handles, containers, status, addActivityBtn, createGroupBtn, groupToggleAllBtn,
        pointer, makeElement
    };
}

function buildGroupDataset(groupCount, activitiesPerGroup) {
    const now = Date.now();
    const groups = [];
    const activities = [];
    const layouts = [];
    const columns = 8;
    const columnWidth = 720;
    const rowHeight = 560;
    for (let groupIndex = 0; groupIndex < groupCount; groupIndex += 1) {
        const groupId = `perf-group-${groupIndex}`;
        const column = groupIndex % columns;
        const row = Math.floor(groupIndex / columns);
        groups.push({
            id: groupId,
            name: `Group ${groupIndex}`,
            x: 32 + column * columnWidth,
            y: 32 + row * rowHeight,
            collapsed: false
        });
        for (let memberIndex = 0; memberIndex < activitiesPerGroup; memberIndex += 1) {
            const activityId = `perf-activity-${groupIndex}-${memberIndex}`;
            activities.push({
                id: activityId,
                name: `A${groupIndex}-${memberIndex}`,
                color: '#18794e',
                shape: 'circle',
                size: memberIndex % 3 === 0 ? 'large' : 'small',
                position: groupIndex * activitiesPerGroup + memberIndex,
                archived: false,
                createdAt: now,
                updatedAt: now,
                groupId
            });
            layouts.push({
                activityId,
                x: (memberIndex % 4) * 340,
                y: Math.floor(memberIndex / 4) * 200,
                width: memberIndex % 3 === 0 ? 320 : 220,
                height: memberIndex % 3 === 0 ? 190 : 120
            });
        }
    }
    return { groups, activities, layouts };
}

function measure(label, callback) {
    const start = performance.now();
    const result = callback();
    const elapsed = performance.now() - start;
    return { label, elapsed, result };
}

function formatMs(value) {
    return `${value.toFixed(1)}ms`;
}

function reportTable(title, rows) {
    const lines = [`\n[perf] ${title}`];
    for (const row of rows) {
        lines.push(`[perf]   ${row.label.padEnd(46)} ${formatMs(row.elapsed)}${row.extra ? `  ${row.extra}` : ''}`);
    }
    console.info(lines.join('\n'));
}

function instrument(app) {
    const counts = {};
    for (const name of [
        'getActivityCanvasLayout',
        'activityGroup',
        'groupMemberBoxes',
        'computeGroupDisplayOffsets',
        'resolveGroupCollision',
        'renderMain',
        'renderGroups',
        'updateMoveDropTarget',
        'magneticActivityOthers',
        'groupDropTargetAt'
    ]) {
        const original = app[name];
        if (typeof original !== 'function') continue;
        counts[name] = 0;
        app[name] = function counted(...args) {
            counts[name] += 1;
            return original.apply(this, args);
        };
    }
    return counts;
}

function applyDataset(harness, dataset) {
    const { app } = harness;
    app.activities = structuredClone(dataset.activities);
    app.groups = structuredClone(dataset.groups);
    app.activityLayouts = new Map(dataset.layouts.map(layout => [layout.activityId, structuredClone(layout)]));
    return harness;
}

test('performance: initial render scales with flat group counts', async () => {
    const rows = [];
    for (const groupCount of [10, 25, 50, 100]) {
        const dataset = buildGroupDataset(groupCount, 8);
        const harness = applyDataset(createGroupCanvasHarness(), dataset);
        const { app, writes } = harness;
        assert.equal(app.groups.length, groupCount);
        assert.equal(app.activities.length, groupCount * 8);
        const render = measure(`${groupCount} groups x 8 activities: first renderMain`, () => app.renderMain());
        const second = measure(`${groupCount} groups x 8 activities: second renderMain`, () => app.renderMain());
        rows.push({ label: `${groupCount} groups: first paint`, elapsed: render.elapsed });
        rows.push({ label: `${groupCount} groups: second paint`, elapsed: second.elapsed });
        assert.equal(app.groups.length, groupCount, 'render keeps all groups');
        assert.equal(app.activities.length, groupCount * 8, 'render keeps all activities');
        assert.equal(writes.group + writes.activity + writes.layout, 0, 'rendering never writes to storage');
        // Generous ceiling: later optimizations must keep this well below it.
        assert.ok(render.elapsed < 4000, `${groupCount} groups must render in under 4s (was ${formatMs(render.elapsed)})`);
    }
    reportTable('initial render (baseline)', rows);
});

test('performance: expand/collapse a group with many neighbours', async () => {
    const rows = [];
    for (const groupCount of [25, 50, 100]) {
        const dataset = buildGroupDataset(groupCount, 8);
        const harness = applyDataset(createGroupCanvasHarness(), dataset);
        const { app, writes } = harness;
        app.renderMain();
        const target = app.groups[Math.floor(groupCount / 2)];
        const collapseStart = performance.now();
        await app.toggleGroupCollapsed(target.id);
        const collapseElapsed = performance.now() - collapseStart;
        const expandStart = performance.now();
        await app.toggleGroupCollapsed(target.id);
        const expandElapsed = performance.now() - expandStart;
        rows.push({ label: `${groupCount} groups: collapse`, elapsed: collapseElapsed, extra: `group writes=${writes.group}` });
        rows.push({ label: `${groupCount} groups: expand`, elapsed: expandElapsed });
        assert.equal(writes.group, 2, 'one persistence write per toggle');
        assert.ok(expandElapsed < 4000, `expand must stay under 4s (was ${formatMs(expandElapsed)})`);
    }
    reportTable('expand/collapse (baseline)', rows);
});

test('performance: activity drag pointermove stays cheap', async () => {
    const rows = [];
    for (const groupCount of [25, 50, 100]) {
        const dataset = buildGroupDataset(groupCount, 8);
        const harness = applyDataset(createGroupCanvasHarness(), dataset);
        const { app } = harness;
        app.renderMain();
        const gesture = { activityId: dataset.activities[0].id, activityButton: null, dropTargetGroupId: null };
        const moves = 60;
        const drag = measure(`${groupCount} groups: ${moves} pointermove frames`, () => {
            for (let frame = 0; frame < moves; frame += 1) {
                gesture.activityButton = harness.buttons.find(button => button.dataset.activityId === gesture.activityId) || null;
                app.updateMoveDropTarget(gesture);
            }
        });
        rows.push({ label: `${groupCount} groups: ${moves} drag frames`, elapsed: drag.elapsed });
        assert.ok(drag.elapsed < 4000, `drag frames must stay under 4s (was ${formatMs(drag.elapsed)})`);
    }
    reportTable('activity drag (baseline)', rows);
});

test('performance: hot-path call counts for a 50-group canvas', async () => {
    const dataset = buildGroupDataset(50, 8);
    const harness = applyDataset(createGroupCanvasHarness(), dataset);
    const { app } = harness;
    const counts = instrument(app);
    app.renderMain();
    const snapshot = { ...counts };
    console.info(`\n[perf] call counts for 50 groups x 8 activities (400 activities):\n${Object.entries(snapshot)
        .map(([name, count]) => `[perf]   ${name.padEnd(32)} ${count}`)
        .join('\n')}`);
    assert.ok(snapshot.getActivityCanvasLayout > 0, 'layout calculations happen during render');
    assert.equal(app.groups.length, 50);
});

test('performance: render phase breakdown for 100 groups', async () => {
    const dataset = buildGroupDataset(100, 8);
    const harness = applyDataset(createGroupCanvasHarness(), dataset);
    const { app } = harness;
    app.renderMain();
    const containerCount = harness.containers.length;
    const buttonCount = harness.buttons.length;

    let renderGroupsElapsed = 0;
    let offsetsElapsed = 0;
    const originalRenderGroups = app.renderGroups.bind(app);
    app.renderGroups = grid => {
        const start = performance.now();
        originalRenderGroups(grid);
        renderGroupsElapsed += performance.now() - start;
    };
    const originalOffsets = app.computeGroupDisplayOffsets.bind(app);
    app.computeGroupDisplayOffsets = () => {
        const start = performance.now();
        const result = originalOffsets();
        offsetsElapsed += performance.now() - start;
        return result;
    };
    const paintStart = performance.now();
    app.renderMain();
    const paintElapsed = performance.now() - paintStart;

    const rows = [
        { label: 'computeGroupDisplayOffsets (in-render)', elapsed: offsetsElapsed },
        { label: 'renderGroups (in-render)', elapsed: renderGroupsElapsed },
        { label: 'renderMain total (DOM rebuild included)', elapsed: paintElapsed }
    ];
    reportTable('render phase breakdown', rows);
    console.info(`[perf] rendered ${containerCount} containers and ${buttonCount} activity buttons`);
    assert.ok(paintElapsed < 4000);
});

function buildNestedDataset(groupCount, activitiesPerGroup) {
    const dataset = buildGroupDataset(groupCount, activitiesPerGroup);
    // Every fourth group nests into the preceding root, giving realistic
    // parent/child hierarchies at every scale.
    for (let index = 1; index < dataset.groups.length; index += 4) {
        const parent = dataset.groups[index - 1];
        const child = dataset.groups[index];
        child.parentId = parent.id;
        child.x = parent.x + 40;
        child.y = parent.y + 40;
    }
    return dataset;
}

test('performance: nested groups render, toggle and drag with the same budget', async () => {
    const rows = [];
    for (const groupCount of [10, 25, 50, 100]) {
        const dataset = buildNestedDataset(groupCount, 8);
        const harness = applyDataset(createGroupCanvasHarness(), dataset);
        const { app } = harness;
        const render = measure(`${groupCount} nested groups: first render`, () => app.renderMain());
        assert.equal(app.groups.length, groupCount);
        assert.equal(app.activities.length, groupCount * 8);

        const parent = app.groups[0];
        const collapseStart = performance.now();
        await app.toggleGroupCollapsed(parent.id);
        const collapseElapsed = performance.now() - collapseStart;
        const expandStart = performance.now();
        await app.toggleGroupCollapsed(parent.id);
        const expandElapsed = performance.now() - expandStart;

        const gesture = { activityId: dataset.activities[dataset.activities.length - 1].id, activityButton: null, dropTargetGroupId: null };
        const drag = measure(`${groupCount} nested groups: 60 drag frames`, () => {
            for (let frame = 0; frame < 60; frame += 1) {
                gesture.activityButton = harness.buttons.find(button => button.dataset.activityId === gesture.activityId) || null;
                app.updateMoveDropTarget(gesture);
            }
        });

        for (const group of app.groups) {
            for (const field of ['x', 'y']) {
                assert.ok(Number.isFinite(Number(group[field])), 'group coordinates stay finite');
            }
        }
        rows.push({ label: `${groupCount} nested groups: first render`, elapsed: render.elapsed });
        rows.push({ label: `${groupCount} nested groups: parent collapse`, elapsed: collapseElapsed });
        rows.push({ label: `${groupCount} nested groups: parent expand`, elapsed: expandElapsed });
        rows.push({ label: `${groupCount} nested groups: 60 drag frames`, elapsed: drag.elapsed });
        assert.ok(render.elapsed < 4000, `nested render under 4s (was ${formatMs(render.elapsed)})`);
        assert.ok(drag.elapsed < 4000, `nested drag under 4s (was ${formatMs(drag.elapsed)})`);
    }
    reportTable('nested groups', rows);
});

test('performance: template icons keep activity rendering cheap', async () => {
    const rows = [];
    for (const withIcons of [false, true]) {
        const harness = createGroupCanvasHarness();
        const { app } = harness;
        app.groups = [];
        app.activities = Array.from({ length: 100 }, (unused, index) => ({
            id: `icon-perf-${index}`,
            name: `Icon activity ${index}`,
            position: index,
            size: 'medium',
            ...(withIcons ? { icon: 'vacuum-attic' } : {})
        }));
        app.activityLayouts = new Map();
        const render = measure(withIcons ? 'with icons' : 'without icons', () => app.renderMain());
        rows.push({
            label: withIcons ? '100 activities with template icons' : '100 activities without icons',
            elapsed: render.elapsed
        });
        assert.equal(app.activities.length, 100);
        assert.ok(render.elapsed < 4000, `icon render stays under 4s (was ${formatMs(render.elapsed)})`);
    }
    reportTable('template icon render', rows);
});
