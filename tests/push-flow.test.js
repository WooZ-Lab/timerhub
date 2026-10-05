import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createECDH, randomBytes } from 'node:crypto';
import { EventEmitter } from 'node:events';
import https from 'node:https';
import test from 'node:test';
import vm from 'node:vm';
import webpush from 'web-push';
import worker, { TimerHubDurableObject } from '../worker/index.js';

const source = await readFile(new URL('../app.js', import.meta.url), 'utf8');
const htmlSource = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const styleSource = await readFile(new URL('../style.css', import.meta.url), 'utf8');
const serviceWorkerSource = await readFile(new URL('../sw.js', import.meta.url), 'utf8');
const testsSource = await readFile(new URL(import.meta.url), 'utf8');
const vapid = webpush.generateVAPIDKeys();
const clientEcdh = createECDH('prime256v1');
const subscriptionJson = {
    endpoint: 'https://push.example.test/send/test-subscription',
    expirationTime: null,
    keys: {
        p256dh: clientEcdh.generateKeys().toString('base64url'),
        auth: randomBytes(16).toString('base64url')
    }
};

function translationObjectSource(name) {
    const start = source.indexOf(`const ${name} = `) + `const ${name} = `.length;
    let depth = 0;
    let quote = null;
    let escaped = false;
    for (let i = start; i < source.length; i += 1) {
        const character = source[i];
        if (quote) {
            if (escaped) escaped = false;
            else if (character === '\\') escaped = true;
            else if (character === quote) quote = null;
            continue;
        }
        if (character === "'" || character === '"' || character === '`') quote = character;
        else if (character === '{') depth += 1;
        else if (character === '}' && --depth === 0) return source.slice(start, i + 1);
    }
    throw new Error(`Could not read translation object ${name}`);
}

function makeBackend() {
    const records = new Map();
    const alarmTimes = new Map();
    const objects = new Map();
    const env = {
        VAPID_PUBLIC_KEY: vapid.publicKey,
        VAPID_PRIVATE_KEY: vapid.privateKey,
        VAPID_SUBJECT: 'mailto:timerhub@example.test',
        ASSETS: { fetch: async () => new Response('TimerHub asset') },
        TIMER_HUB: {
            idFromName: name => name,
            get: id => ({
                fetch: request => getObject(id).fetch(request)
            })
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
                    list: async ({ prefix = '' } = {}) => new Map([...values.entries()]
                        .filter(([key]) => key.startsWith(prefix))
                        .map(([key, value]) => [key, structuredClone(value)])),
                    setAlarm: async timestamp => alarmTimes.set(id, timestamp),
                    deleteAlarm: async () => alarmTimes.delete(id)
                }
            };
            objects.set(id, new TimerHubDurableObject(state, env));
        }
        return objects.get(id);
    }

    return {
        env,
        records,
        alarmTimes,
        getObject,
        restart: () => objects.clear(),
        fireAlarm: async id => {
            alarmTimes.delete(id); // Cloudflare consumes the fired alarm first.
            await getObject(id).alarm();
        },
        request: (path, init = {}) => worker.fetch(
            new Request(new URL(path, 'https://timerhub.example.test'), init),
            env
        )
    };
}

function makeBrowserHarness(backend, initialSubscription = null) {
    const localStorageValues = new Map();
    const statusNode = { textContent: '' };
    const document = {
        title: '',
        documentElement: { lang: '' },
        getElementById: id => id === 'notificationStatus' ? statusNode : null,
        querySelectorAll: () => []
    };
    let subscription = initialSubscription;
    let subscribeCount = 0;
    const subscribedApplicationServerKeys = [];
    const notificationDisplays = [];
    const registration = {
        pushManager: {
            getSubscription: async () => subscription,
            subscribe: async options => {
                subscribeCount += 1;
                subscribedApplicationServerKeys.push([...options.applicationServerKey]);
                subscription = {
                    options: { applicationServerKey: options.applicationServerKey },
                    getKey: () => null,
                    unsubscribe: async () => { subscription = null; return true; },
                    toJSON: () => structuredClone(subscriptionJson)
                };
                return subscription;
            }
        },
        showNotification: async (title, options) => {
            notificationDisplays.push({ title, options });
        }
    };
    class MockNotification {
        static permission = 'granted';
        static requestPermission = async () => 'granted';
    }
    const window = {
        location: { hostname: 'timerhub.example.test' },
        addEventListener() {},
        PushManager: function PushManager() {},
        Notification: MockNotification
    };
    const context = vm.createContext({
        window,
        document,
        navigator: { serviceWorker: { ready: Promise.resolve(registration) } },
        localStorage: {
            getItem: key => localStorageValues.has(key) ? localStorageValues.get(key) : null,
            setItem: (key, value) => localStorageValues.set(key, String(value))
        },
        crypto: { randomUUID: () => '11111111-2222-4333-8444-555555555555' },
        Notification: MockNotification,
        fetch: async (path, options = {}) => backend.request(path, options),
        URL,
        Request,
        Response,
        Uint8Array,
        atob,
        encodeURIComponent,
        Date,
        Number,
        Math,
        setTimeout,
        clearTimeout,
        console
    });
    vm.runInContext(source, context, { filename: 'app.js' });
    const app = vm.runInContext('Object.create(TimerHubApp.prototype)', context);
    Object.assign(app, {
        activeActivityId: 'activity-1',
        activities: [{ id: 'activity-1', name: 'Painting' }, { id: 'activity-2', name: 'Taping' }],
        timeEntries: [{
            id: 'entry-1', activityId: 'activity-1', activityNameSnapshot: 'Painting',
            startTimestamp: Date.now() - 5000, endTimestamp: null
        }],
        notificationInterval: 1,
        notificationTimeout: null,
        storage: { saveTimeEntry: async () => {} },
        renderMain() {}
    });
    return {
        app,
        context,
        document,
        statusNode,
        localStorageValues,
        notificationDisplays,
        subscribedApplicationServerKeys,
        get subscribeCount() { return subscribeCount; },
        get subscription() { return subscription; }
    };
};

test('all supported languages update translated UI text and color contrast stays legible', async () => {
    const browser = makeBrowserHarness(makeBackend());
    const dictionaries = vm.runInContext('translations', browser.context);
    const baseDictionaries = vm.runInNewContext(`(${translationObjectSource('translations')})`);
    const extensionDictionaries = vm.runInNewContext(`(${translationObjectSource('extendedTranslations')})`);
    const languageKeys = Object.keys(dictionaries.en).sort();
    assert.deepEqual(Object.keys(dictionaries.de).sort(), languageKeys);
    assert.deepEqual(Object.keys(dictionaries.ru).sort(), languageKeys);
    const references = new Set([
        ...[...htmlSource.matchAll(/data-i18n(?:-[\w-]+)?="([\w]+)"/g)].map(match => match[1]),
        ...[...source.matchAll(/this\.t\(['"]([\w]+)['"]/g)].map(match => match[1]),
        ...[...source.matchAll(/notificationError\(['"]([\w]+)['"]/g)].map(match => match[1]),
        ...[...source.matchAll(/key:\s*['"]([\w]+)['"]/g)].map(match => match[1]),
        ...[...testsSource.matchAll(/dictionaries\[language\]\.([\w]+)/g)].map(match => match[1])
    ]);
    for (const language of ['en', 'de', 'ru']) {
        const overlap = Object.keys(baseDictionaries[language]).filter(key => Object.hasOwn(extensionDictionaries[language], key));
        assert.deepEqual(overlap, [], `${language} has duplicate base/extension translation keys`);
    }
    assert.deepEqual([...Object.keys(dictionaries.en)].sort(), [...new Set(references)].sort(), 'translation dictionary has missing or unused keys');
    for (const language of ['en', 'de', 'ru']) {
        for (const key of references) assert.ok(Object.hasOwn(dictionaries[language], key), `${language} is missing ${key}`);
    }
    const swHarness = captureServiceWorkerNotifications();
    const swCopy = vm.runInContext('PUSH_COPY', swHarness.context);
    for (const language of ['en', 'de', 'ru']) {
        assert.equal(swCopy[language].title, dictionaries[language].notificationBackgroundFallbackTitle);
        assert.equal(swCopy[language].body, dictionaries[language].notificationBackgroundFallbackBody);
    }
    const nodes = [
        { dataset: { i18n: 'timerNotifications' } },
        { dataset: { i18n: 'confirmDelete' } },
        { dataset: { i18nPlaceholder: 'activityNamePlaceholder' } },
        { dataset: { i18nTitle: 'shapePickerLabel' } },
        { dataset: { i18nAriaLabel: 'homeScreen' }, setAttribute(name, value) { this[name] = value; } }
    ];
    const root = {
        querySelectorAll(selector) {
            const attr = selector.match(/\[data-i18n(?:-([\w-]+))?\]/)?.[1];
            const property = attr ? `i18n${attr.split('-').map(part => part[0].toUpperCase() + part.slice(1)).join('')}` : 'i18n';
            return nodes.filter(node => node.dataset[property]);
        }
    };

    for (const [language, expected] of Object.entries({
        en: ['Timer Notifications', 'Confirm before delete'],
        de: ['Timer-Benachrichtigungen', 'Vor dem Löschen bestätigen'],
        ru: ['Напоминания таймера', 'Подтверждать удаление']
    })) {
        browser.app.currentLanguage = language;
        browser.app.applyTranslations(root);
        assert.equal(browser.document.documentElement.lang, language);
        assert.equal(nodes[0].textContent, expected[0]);
        assert.equal(nodes[1].textContent, expected[1]);
        assert.ok(nodes[2].placeholder);
        assert.ok(nodes[3].title);
        assert.ok(nodes[4]['aria-label']);
    }

    for (const [color, expected] of [
        ['#ffffff', '#000000'], ['#fff', '#000000'],
        ['#000000', '#ffffff'], ['#000', '#ffffff']
    ]) {
        assert.equal(browser.app.contrastingTextColor(color), expected);
    }
    assert.match(styleSource, /\.activity-btn\s*\{[^}]*box-shadow:[^;}]*var\(--text-primary\)/s);
    assert.match(styleSource, /\.activity-btn\.active\s*\{[^}]*box-shadow:[^;}]*var\(--text-primary\)/s);
    assert.match(styleSource, /\.color-option\s*\{[^}]*box-shadow:[^;}]*var\(--text-primary\)/s);
    assert.match(styleSource, /\.color-option\.selected\s*\{[^}]*box-shadow:[^;}]*var\(--text-primary\)/s);
    for (const color of ['#4A90E2', '#808080', '#F1C40F']) {
        assert.ok(['#000000', '#ffffff'].includes(browser.app.contrastingTextColor(color)));
    }

    const activeModal = { classList: { contains: name => name === 'active' } };
    const modalTitle = { textContent: '' };
    const activeMenu = { classList: { contains: name => name === 'active' } };
    const menuTitle = { textContent: '' };
    const transientToast = {
        classList: { remove(name) { this.removed = name; } },
        replaceChildren() { this.cleared = true; }
    };
    const dynamicNodes = {
        activityModal: activeModal,
        modalTitle,
        activityMenuModal: activeMenu,
        activityMenuTitle: menuTitle,
        toast: transientToast
    };
    browser.document.getElementById = id => dynamicNodes[id] || null;
    browser.app.activities = [{ id: 'editing-activity', name: 'Workshop' }];
    browser.app.editingActivityId = 'editing-activity';
    browser.app.currentLanguage = 'ru';
    browser.app.refreshTranslatedDynamicText();
    assert.equal(modalTitle.textContent, 'Изменить занятие');
    assert.equal(menuTitle.textContent, 'Workshop');
    browser.app.toastTimeout = setTimeout(() => {}, 10000);
    browser.app.clearToast();
    assert.equal(browser.app.toastTimeout, null);
    assert.equal(transientToast.cleared, true);

    const postedMessages = [];
    browser.context.navigator.serviceWorker.ready = Promise.resolve({
        active: { postMessage: message => postedMessages.push(message) }
    });
    await browser.app.syncServiceWorkerLocale();
    assert.equal(postedMessages.length, 1);
    assert.equal(postedMessages[0].type, 'SET_LOCALE');
    assert.equal(postedMessages[0].locale, 'ru');
});

test('custom activity colors persist without changing the selected color', async () => {
    const browser = makeBrowserHarness(makeBackend());
    const saved = [];
    const colorOption = { style: { backgroundColor: 'rgb(255, 255, 255)' } };
    const activityName = { value: 'White activity' };
    const activityModal = { classList: { remove() {} } };
    const nodes = { activityName, activityModal };
    browser.document.getElementById = id => nodes[id] || null;
    browser.document.querySelector = selector => selector === '.color-option.selected' ? colorOption : null;
    browser.app.storage = { saveActivity: async activity => saved.push({ ...activity }) };
    browser.app.generateId = () => 'custom-color-activity';
    browser.app.renderMain = () => {};

    await browser.app.saveActivity();
    assert.equal(browser.app.rgbStringToHex(saved.at(-1).color), '#ffffff');

    browser.app.editingActivityId = 'custom-color-activity';
    activityName.value = 'Black activity';
    colorOption.style.backgroundColor = 'rgb(0, 0, 0)';
    await browser.app.saveActivity();
    assert.equal(browser.app.rgbStringToHex(saved.at(-1).color), '#000000');
    assert.equal(browser.app.activities.find(activity => activity.id === 'custom-color-activity').color, 'rgb(0, 0, 0)');
});

test('date/time and CSV formatting follow locale and quote activity values', () => {
    const browser = makeBrowserHarness(makeBackend());
    const timestamp = new Date(2025, 0, 2, 0, 5).getTime();
    browser.app.timeFormat = '12h';
    browser.app.currentLanguage = 'en';
    assert.match(browser.app.getDateString(timestamp), /01\/02\/2025/);
    assert.match(browser.app.formatTime(timestamp), /12:05.*AM/);
    browser.app.currentLanguage = 'de';
    browser.app.timeFormat = '24h';
    assert.match(browser.app.getDateString(timestamp), /02\.01\.2025/);
    assert.match(browser.app.formatTime(timestamp), /00:05/);
    browser.app.timeEntries = [{
        id: 'log-entry', activityId: 'activity-1', activityNameSnapshot: 'Desk, "blue"',
        startTimestamp: timestamp, endTimestamp: timestamp + 60000
    }];
    const csv = browser.app.getLogAsCSV();
    assert.match(csv, /"Desk, ""blue"""/);
    assert.match(csv.split('\n')[0], /"Datum","Startzeit","Endzeit","Aktivität","Dauer"/);
});

test('log rendering escapes imported entry identifiers and activity names', () => {
    const browser = makeBrowserHarness(makeBackend());
    const logContent = { innerHTML: '' };
    browser.document.getElementById = id => ({
        logDateFilter: { value: 'all' },
        logActivityFilter: { value: '' },
        logContent
    })[id] || null;
    browser.document.querySelectorAll = () => [];
    browser.app.timeEntries = [{
        id: 'entry"><img src=x onerror=alert(1)>', activityId: 'activity-1',
        activityNameSnapshot: '<script>alert(1)</script>',
        startTimestamp: Date.now() - 60000, endTimestamp: Date.now()
    }];
    browser.app.renderLog();
    assert.ok(!logContent.innerHTML.includes('<script>alert(1)</script>'));
    assert.ok(!logContent.innerHTML.includes('<img src=x onerror=alert(1)>'));
    assert.ok(logContent.innerHTML.includes('&lt;script&gt;'));
    assert.ok(logContent.innerHTML.includes('&lt;img'));
});

test('date-range filtering includes entries that overlap the selected range', () => {
    const browser = makeBrowserHarness(makeBackend());
    const rangeStart = new Date(2025, 4, 2).getTime();
    const logContent = { innerHTML: '' };
    const controls = {
        logDateFilter: { value: 'range' },
        logActivityFilter: { value: '' },
        dateFrom: { value: '2025-05-02' },
        dateTo: { value: '2025-05-02' },
        logContent
    };
    browser.document.getElementById = id => controls[id] || null;
    browser.document.querySelectorAll = () => [];
    browser.app.timeEntries = [
        { id: 'crossing', activityId: 'a', activityNameSnapshot: 'Crossing', startTimestamp: rangeStart - 1800000, endTimestamp: rangeStart + 1800000 },
        { id: 'outside', activityId: 'a', activityNameSnapshot: 'Outside', startTimestamp: rangeStart - 10800000, endTimestamp: rangeStart - 7200000 }
    ];
    browser.app.renderLog();
    assert.ok(logContent.innerHTML.includes('data-entry-id="crossing"'));
    assert.ok(!logContent.innerHTML.includes('data-entry-id="outside"'));
});

test('test and fallback push notifications use the requested English, German, and Russian locale', async t => {
    const backend = makeBackend();
    const sent = [];
    const originalSend = webpush.sendNotification;
    const originalSetVapid = webpush.setVapidDetails;
    webpush.sendNotification = async (subscription, payload) => {
        sent.push(JSON.parse(payload));
        return { statusCode: 201 };
    };
    webpush.setVapidDetails = () => {};
    t.after(() => {
        webpush.sendNotification = originalSend;
        webpush.setVapidDetails = originalSetVapid;
    });

    await backend.request('/api/push/subscribe?clientId=locale-test-identifier&locale=en', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(subscriptionJson)
    });
    const expected = {
        en: 'This is a background push test.',
        de: 'Dies ist ein Push-Test im Hintergrund.',
        ru: 'Это тестовое Push-уведомление.'
    };
    const expectedTitles = {
        en: 'TimerHub notification test',
        de: 'TimerHub-Benachrichtigungstest',
        ru: 'Проверка уведомлений TimerHub'
    };
    for (const [locale, body] of Object.entries(expected)) {
        const response = await backend.request('/api/push/test?clientId=locale-test-identifier', {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ locale })
        });
        assert.equal(response.status, 200);
        assert.equal(sent.at(-1).locale, locale);
        assert.equal(sent.at(-1).title, expectedTitles[locale]);
        assert.equal(sent.at(-1).body, body);

        const sw = captureServiceWorkerNotifications();
        const waits = [];
        sw.handlers.push({
            data: { json: () => ({ locale }) },
            waitUntil: promise => waits.push(promise)
        });
        await Promise.all(waits);
        assert.equal(sw.shown[0].options.body, locale === 'en'
            ? 'Timer reminder'
            : locale === 'de' ? 'Timer-Erinnerung' : 'Напоминание таймера');

        await backend.request('/api/push/schedule?clientId=locale-test-identifier', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ alarmId: `fallback-${locale}`, timestamp: Date.now() + 60000, locale })
        });
        await backend.fireAlarm('locale-test-identifier');
        assert.equal(sent.at(-1).locale, locale);
        assert.equal(sent.at(-1).body, locale === 'en'
            ? 'Timer reminder'
            : locale === 'de' ? 'Timer-Erinnerung' : 'Напоминание таймера');
    }

    await backend.request('/api/push/subscribe?clientId=locale-ru-identifier&locale=ru', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(subscriptionJson)
    });
    await backend.request('/api/push/test?clientId=locale-ru-identifier', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ locale: 'unsupported-locale' })
    });
    assert.equal(sent.at(-1).locale, 'ru');
    assert.equal(sent.at(-1).body, expected.ru);
    await backend.request('/api/push/schedule?clientId=locale-ru-identifier', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alarmId: 'fallback-invalid-locale', timestamp: Date.now() + 60000, locale: 'unsupported-locale' })
    });
    await backend.fireAlarm('locale-ru-identifier');
    assert.equal(sent.at(-1).locale, 'ru');
    assert.equal(sent.at(-1).body, 'Напоминание таймера');
});

test('application test pushes and scheduled reminders carry localized copy for every supported language', async t => {
    const backend = makeBackend();
    const browser = makeBrowserHarness(backend);
    const sent = [];
    const originalSend = webpush.sendNotification;
    const originalSetVapid = webpush.setVapidDetails;
    webpush.sendNotification = async (subscription, payload) => {
        sent.push(JSON.parse(payload));
        return { statusCode: 201 };
    };
    webpush.setVapidDetails = () => {};
    t.after(() => {
        webpush.sendNotification = originalSend;
        webpush.setVapidDetails = originalSetVapid;
    });

    const expected = {
        en: { title: 'TimerHub notification test', test: 'This is a background push test.', reminder: 'Timer is still running: Painting' },
        de: { title: 'TimerHub-Benachrichtigungstest', test: 'Dies ist ein Push-Test im Hintergrund.', reminder: 'Der Timer läuft noch: Painting' },
        ru: { title: 'Проверка уведомлений TimerHub', test: 'Это тестовое Push-уведомление.', reminder: 'Таймер всё ещё работает: Painting' }
    };
    for (const [locale, copy] of Object.entries(expected)) {
        browser.app.currentLanguage = locale;
        await browser.app.sendBackgroundPushTest();
        assert.equal(sent.at(-1).locale, locale);
        assert.equal(sent.at(-1).title, copy.title);
        assert.equal(sent.at(-1).body, copy.test);

        const entry = {
            id: `entry-${locale}`, activityId: 'activity-1',
            activityNameSnapshot: 'Watercolor', startTimestamp: Date.now(), endTimestamp: null
        };
        await browser.app.scheduleBackgroundAlarm(entry);
        const clientId = browser.localStorageValues.get('timerhubPushClientId');
        await backend.fireAlarm(clientId);
        assert.equal(sent.at(-1).locale, locale);
        assert.equal(sent.at(-1).body, copy.reminder);
    }
});

test('Service Worker remembers the selected locale for malformed and locale-less pushes', async () => {
    const sw = captureServiceWorkerNotifications();
    const messageWaits = [];
    sw.handlers.message({
        data: { type: 'SET_LOCALE', locale: 'ru' },
        waitUntil: promise => messageWaits.push(promise)
    });
    await Promise.all(messageWaits);

    const pushWaits = [];
    sw.handlers.push({
        data: { json: () => { throw new SyntaxError('invalid JSON'); }, text: () => 'Custom push body' },
        waitUntil: promise => pushWaits.push(promise)
    });
    sw.handlers.push({
        data: { json: () => ({}) },
        waitUntil: promise => pushWaits.push(promise)
    });
    await Promise.all(pushWaits);
    assert.equal(sw.shown[0].options.body, 'Custom push body');
    assert.equal(sw.shown[1].options.body, 'Напоминание таймера');
});

function captureServiceWorkerNotifications() {
    const handlers = {};
    const shown = [];
    const cacheEntries = new Map();
    const cache = {
        addAll: async () => {},
        put: async (key, value) => cacheEntries.set(String(key), value.clone()),
        match: async key => cacheEntries.get(String(key))?.clone()
    };
    const self = {
        location: { origin: 'https://timerhub.example.test' },
        registration: {
            showNotification: async (title, options) => shown.push({ title, options })
        },
        clients: { matchAll: async () => [], openWindow: async () => {} },
        addEventListener: (name, callback) => { handlers[name] = callback; },
        skipWaiting: async () => {}
    };
    const context = vm.createContext({
        self,
        caches: {
            open: async () => cache,
            keys: async () => [],
            delete: async () => {},
            match: async () => undefined
        },
        fetch,
        console,
        Promise,
        URL,
        Response
    });
    vm.runInContext(serviceWorkerSource, context, { filename: 'sw.js' });
    return { handlers, shown, context };
}

test('push registration, persistent alarm, closed-page delivery, restart, reschedule, and cancellation', async t => {
    const backend = makeBackend();
    const browser = makeBrowserHarness(backend);
    const sent = [];
    const originalSend = webpush.sendNotification;
    const originalSetVapid = webpush.setVapidDetails;
    webpush.sendNotification = async (subscription, payload) => {
        sent.push({ subscription, payload: JSON.parse(payload) });
        return { statusCode: 201 };
    };
    webpush.setVapidDetails = () => {};
    t.after(() => {
        webpush.sendNotification = originalSend;
        webpush.setVapidDetails = originalSetVapid;
    });

    const configResponse = await backend.request('/api/push/config');
    assert.equal(configResponse.status, 200);
    assert.equal((await configResponse.json()).publicKey, vapid.publicKey);

    await browser.app.requestNotificationPermission();
    const clientId = browser.localStorageValues.get('timerhubPushClientId');
    assert.equal(clientId, '11111111222243338444555555555555');
    assert.equal(browser.subscribeCount, 1);
    assert.deepEqual(
        browser.subscribedApplicationServerKeys[0],
        [...Buffer.from(vapid.publicKey, 'base64url')]
    );
    assert.deepEqual(backend.records.get(clientId).get('subscription'), subscriptionJson);
    assert.equal(backend.records.get(clientId).get('alarm').alarmId, 'entry-1');
    assert.equal(backend.alarmTimes.has(clientId), true);

    // Browser and Worker restart: browser subscription and DO storage remain,
    // and startup reconciliation re-arms the active timer.
    backend.restart();
    const persistentSubscription = browser.subscription;
    const restartedBrowser = makeBrowserHarness(backend, persistentSubscription);
    restartedBrowser.localStorageValues.set('timerhubPushClientId', clientId);
    restartedBrowser.app.timeEntries = browser.app.timeEntries;
    restartedBrowser.app.activeActivityId = 'activity-1';
    restartedBrowser.app.notificationInterval = 1;
    // Carry the browser's persistent PushSubscription over the page restart.
    await restartedBrowser.app.reconcileBackgroundAlarm();
    assert.equal(backend.records.get(clientId).get('subscription').endpoint, subscriptionJson.endpoint);
    assert.equal(backend.records.get(clientId).get('alarm').alarmId, 'entry-1');

    // A fired Durable Object alarm sends the push payload and persists delivery
    // state before scheduling the recurring reminder.
    await backend.fireAlarm(clientId);
    assert.equal(sent.length, 1);
    assert.equal(sent[0].payload.body, 'Timer is still running: Painting');
    assert.equal(backend.records.get(clientId).get('lastDelivery').ok, true);
    assert.ok(backend.alarmTimes.get(clientId) > Date.now());

    // Service worker can display the server payload without a page context.
    const sw = captureServiceWorkerNotifications();
    const waits = [];
    sw.handlers.push({
        data: { json: () => sent[0].payload },
        waitUntil: promise => waits.push(promise)
    });
    await Promise.all(waits);
    assert.equal(sw.shown[0].title, 'TimerHub');
    assert.equal(sw.shown[0].options.body, 'Timer is still running: Painting');

    // Test push endpoint is the actual backend delivery path, not a local
    // Notification API call.
    await restartedBrowser.app.sendBackgroundPushTest();
    assert.equal(sent.length, 2);
    assert.equal(sent[1].payload.tag, 'timerhub-push-test');

    // A push-service 410 invalidates the server copy. On next app launch the
    // client drops its stale browser subscription, creates a fresh one, and
    // restores the active timer alarm.
    webpush.sendNotification = async () => {
        throw new webpush.WebPushError('Subscription expired', 410, {}, '', subscriptionJson.endpoint);
    };
    await backend.fireAlarm(clientId);
    assert.equal(backend.records.get(clientId).has('subscription'), false);
    assert.equal(backend.records.get(clientId).get('lastDelivery').statusCode, 410);
    assert.equal(backend.alarmTimes.has(clientId), false);
    await restartedBrowser.app.reconcileBackgroundAlarm();
    assert.equal(restartedBrowser.subscribeCount, 1);
    assert.equal(backend.records.get(clientId).has('subscription'), true);
    assert.equal(backend.alarmTimes.has(clientId), true);
    webpush.sendNotification = async (subscription, payload) => {
        sent.push({ subscription, payload: JSON.parse(payload) });
        return { statusCode: 201 };
    };

    // Changing activities cancels the previous alarm then stores a new one.
    const switchApp = makeBrowserHarness(backend).app;
    switchApp.timeEntries = [{ ...browser.app.timeEntries[0] }];
    switchApp.activeActivityId = 'activity-1';
    switchApp.notificationInterval = 1;
    switchApp.activities = browser.app.activities;
    switchApp.storage = { saveTimeEntry: async () => {} };
    await switchApp.toggleActivity('activity-2');
    assert.equal(switchApp.activeActivityId, 'activity-2');
    assert.equal(backend.records.get(clientId).get('alarm').body, 'Timer is still running: Taping');

    // Stopping the new activity cancels both the persisted record and alarm.
    await switchApp.toggleActivity('activity-2');
    assert.equal(backend.records.get(clientId).has('alarm'), false);
    assert.equal(backend.alarmTimes.has(clientId), false);

    const unavailable = makeBackend();
    const noSubscriptionId = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
    const rejected = await unavailable.request(
        `/api/push/schedule?clientId=${noSubscriptionId}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ alarmId: 'x', timestamp: Date.now() + 60000 }) }
    );
    assert.equal(rejected.status, 409);
});

test('VAPID payload encryption produces a signed Web Push request', () => {
    const details = webpush.generateRequestDetails(
        subscriptionJson,
        JSON.stringify({ title: 'TimerHub', body: 'Closed browser check' }),
        { vapidDetails: { ...vapid, subject: 'mailto:timerhub@example.test' } }
    );
    assert.equal(details.method, 'POST');
    assert.equal(details.endpoint, subscriptionJson.endpoint);
    assert.match(details.headers.Authorization, /^vapid t=/);
    assert.equal(details.headers['Content-Encoding'], 'aes128gcm');
    assert.ok(details.body.length > 0);
});

test('Durable Object sends an encrypted VAPID request to the push service', async t => {
    const values = new Map([
        ['subscription', subscriptionJson],
        ['alarm', {
            alarmId: 'alarm-real-request',
            timestamp: Date.now() - 1,
            title: 'TimerHub',
            body: 'Closed browser delivery',
            tag: 'timerhub-timer'
        }]
    ]);
    const state = {
        storage: {
            get: async key => values.get(key),
            put: async (key, value) => values.set(key, value),
            delete: async key => values.delete(key),
            setAlarm: async timestamp => { state.alarmAt = timestamp; },
            deleteAlarm: async () => { state.alarmAt = null; }
        }
    };
    const env = {
        VAPID_SUBJECT: 'mailto:timerhub@example.test',
        VAPID_PUBLIC_KEY: vapid.publicKey,
        VAPID_PRIVATE_KEY: vapid.privateKey
    };
    const originalRequest = https.request;
    let captured;
    https.request = (options, onResponse) => {
        const request = new EventEmitter();
        const chunks = [];
        request.write = chunk => chunks.push(Buffer.from(chunk));
        request.end = () => {
            captured = { options, body: Buffer.concat(chunks) };
            const response = new EventEmitter();
            response.statusCode = 201;
            response.headers = {};
            queueMicrotask(() => {
                onResponse(response);
                response.emit('data', 'accepted');
                response.emit('end');
            });
        };
        request.destroy = error => request.emit('error', error);
        return request;
    };
    t.after(() => { https.request = originalRequest; });

    await new TimerHubDurableObject(state, env).alarm();
    assert.equal(captured.options.hostname, 'push.example.test');
    assert.match(captured.options.headers.Authorization, /^vapid t=/);
    assert.equal(captured.options.headers['Content-Encoding'], 'aes128gcm');
    assert.ok(captured.body.length > 0);
    assert.equal(values.get('lastDelivery').ok, true);
    assert.equal(state.alarmAt, undefined); // one-shot alarms are cleared
});

test('missing VAPID secrets fail config before subscription is created', async () => {
    const backend = makeBackend();
    const missingPrivate = { ...backend.env, VAPID_PRIVATE_KEY: undefined };
    const response = await worker.fetch(
        new Request('https://timerhub.example.test/api/push/config'),
        missingPrivate
    );
    assert.equal(response.status, 503);
    assert.match((await response.json()).error, /VAPID/);
});

test('Clockodo Worker stores credentials encrypted, proxies documented operations, and deduplicates creates', async t => {
    const backend = makeBackend();
    const originalFetch = globalThis.fetch;
    const requests = [];
    globalThis.fetch = async (url, init) => {
        requests.push({ url: String(url), init });
        if (String(url).endsWith('/v4/users/me')) return Response.json({ data: { id: 7, name: 'Test user' } });
        return Response.json({ entry: { id: 8765 } });
    };
    t.after(() => { globalThis.fetch = originalFetch; });

    const clientId = 'clockodo_client_1234567890';
    const token = 'clockodo-access-token-'.padEnd(48, 'x');
    const apiKey = 'never-store-this-api-key';
    const auth = { Authorization: `Bearer ${token}` };
    const configured = await backend.request(`/api/clockodo/config?clientId=${clientId}`, {
        method: 'PUT', headers: { ...auth, 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiUser: 'person@example.test', apiKey })
    });
    assert.equal(configured.status, 200);
    const saveBody = await configured.text();
    assert.deepEqual(JSON.parse(saveBody), { configured: true });
    assert.equal(saveBody.includes(apiKey), false, 'save response must not contain the API key');
    const stored = backend.records.get(clientId);
    assert.equal(JSON.stringify([...stored.entries()]).includes(apiKey), false);
    assert.equal(stored.get('clockodoCredentials').apiUser, 'person@example.test');

    const unauthorized = await backend.request(`/api/clockodo/config?clientId=${clientId}`, {
        headers: { Authorization: `Bearer ${'z'.repeat(48)}` }
    });
    assert.equal(unauthorized.status, 401);
    const config = await backend.request(`/api/clockodo/config?clientId=${clientId}`, { headers: auth });
    const configBody = await config.text();
    assert.deepEqual(JSON.parse(configBody), { configured: true, apiUser: 'person@example.test' });
    assert.equal(configBody.includes(apiKey), false, 'configuration reads must not contain the API key');

    const tested = await backend.request(`/api/clockodo/test?clientId=${clientId}`, {
        method: 'POST', headers: { ...auth, 'Content-Type': 'application/json' }, body: '{}'
    });
    assert.deepEqual(await tested.json(), { connected: true });
    assert.equal(requests[0].url, 'https://my.clockodo.com/api/v4/users/me');
    assert.equal(requests[0].init.method, 'GET');
    assert.equal(requests[0].init.body, undefined);
    assert.equal(requests[0].init.headers['X-ClockodoApiUser'], 'person@example.test');
    assert.equal(requests[0].init.headers['X-ClockodoApiKey'], apiKey);
    assert.equal(requests[0].init.headers['X-Clockodo-External-Application'], 'TimerHub;person@example.test');

    const payload = {
        time_since: '2026-09-28T08:00:00.000Z', time_until: '2026-09-28T09:00:00.000Z',
        customers_id: 3, services_id: 9, projects_id: 4, billable: 1, text: 'Painting'
    };
    const headers = { ...auth, 'Content-Type': 'application/json', 'Idempotency-Key': 'timerhub-entry:review-entry-1' };
    const createPath = `/api/clockodo/entries?clientId=${clientId}`;
    const create = () => backend.request(createPath, { method: 'POST', headers, body: JSON.stringify(payload) });
    assert.deepEqual(await (await create()).json(), { created: true, entryId: 8765 });
    assert.deepEqual(await (await create()).json(), { created: true, entryId: 8765, duplicate: true });
    assert.equal(requests.length, 2);
    assert.equal(JSON.parse(requests[1].init.body).customers_id, 3);

    const update = await backend.request(`/api/clockodo/entries/8765?clientId=${clientId}`, {
        method: 'PUT', headers: { ...auth, 'Content-Type': 'application/json', 'Idempotency-Key': 'batch:entry:update' },
        body: JSON.stringify(payload)
    });
    assert.equal(update.status, 405);
    const deletion = await backend.request(`/api/clockodo/entries/8765?clientId=${clientId}`, {
        method: 'DELETE', headers: auth
    });
    assert.equal(deletion.status, 405);
    const collectionDelete = await backend.request(createPath, { method: 'DELETE', headers: auth });
    assert.equal(collectionDelete.status, 405);
    assert.equal(requests.length, 2, 'UPDATE and DELETE paths must not reach Clockodo');

    const removed = await backend.request(`/api/clockodo/config?clientId=${clientId}`, { method: 'DELETE', headers: auth });
    assert.deepEqual(await removed.json(), { configured: false });
    const unconfigured = await backend.request(`/api/clockodo/config?clientId=${clientId}`, { headers: auth });
    assert.deepEqual(await unconfigured.json(), { configured: false, apiUser: '' });
});

test('Clockodo connection check uses v4 user endpoint and safely classifies upstream responses', async t => {
    const backend = makeBackend();
    const originalFetch = globalThis.fetch;
    const requests = [];
    let upstreamResponse = Response.json({ data: { id: 19, name: 'Stub user' } });
    globalThis.fetch = async (url, init) => {
        requests.push({ url: String(url), init });
        return upstreamResponse;
    };
    t.after(() => { globalThis.fetch = originalFetch; });

    const clientId = 'clockodo_v4_check_client_123';
    const token = 'clockodo-v4-check-token'.padEnd(48, 'z');
    const auth = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
    const save = await backend.request(`/api/clockodo/config?clientId=${clientId}`, {
        method: 'PUT', headers: auth,
        body: JSON.stringify({ apiUser: 'person@example.test', apiKey: 'test fixture only' })
    });
    assert.equal(save.status, 200);

    const check = () => backend.request(`/api/clockodo/test?clientId=${clientId}`, {
        method: 'POST', headers: auth, body: '{}'
    });
    const success = await check();
    assert.equal(success.status, 200);
    assert.deepEqual(await success.json(), { connected: true });
    assert.equal(requests[0].url, 'https://my.clockodo.com/api/v4/users/me');
    assert.equal(requests[0].init.method, 'GET');
    assert.equal(requests[0].init.body, undefined);
    assert.equal(requests[0].init.headers['X-ClockodoApiUser'], 'person@example.test');
    assert.equal(requests[0].init.headers['X-Clockodo-External-Application'], 'TimerHub;person@example.test');

    const failures = [
        [401, 'invalid_credentials'],
        [429, 'rate_limited'],
        [403, 'clockodo_rejected'],
        [503, 'service_error']
    ];
    for (const [status, expectedError] of failures) {
        upstreamResponse = Response.json({ error: 'sensitive upstream detail' }, { status });
        const response = await check();
        assert.equal(response.status, status);
        const responseText = await response.text();
        assert.deepEqual(JSON.parse(responseText), { error: expectedError });
        assert.equal(responseText.includes('sensitive upstream detail'), false);
        assert.equal(responseText.includes('test fixture only'), false);
    }

    upstreamResponse = Response.json({ user: { id: 19 } }); // legacy shape is not the documented v4 user response
    const malformed = await check();
    assert.equal(malformed.status, 502);
    assert.deepEqual(await malformed.json(), { error: 'malformed_response' });
    assert.equal(requests.every(item => item.url === 'https://my.clockodo.com/api/v4/users/me'), true);
});

test('Clockodo Worker reports authentication and uncertain malformed-create outcomes safely', async t => {
    const backend = makeBackend();
    const originalFetch = globalThis.fetch;
    let externalResponse = Response.json({ error: 'private API details must not reach the browser' }, { status: 401 });
    let calls = 0;
    globalThis.fetch = async () => { calls += 1; return externalResponse; };
    t.after(() => { globalThis.fetch = originalFetch; });

    const clientId = 'clockodo_error_test_123456';
    const token = 'another-long-access-token'.padEnd(48, 'q');
    const auth = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
    await backend.request(`/api/clockodo/config?clientId=${clientId}`, {
        method: 'PUT', headers: auth, body: JSON.stringify({ apiUser: 'person@example.test', apiKey: 'private-key' })
    });
    const payload = {
        time_since: '2026-09-28T08:00:00.000Z', time_until: '2026-09-28T09:00:00.000Z',
        customers_id: 3, services_id: 9, billable: 1
    };
    const send = key => backend.request(`/api/clockodo/entries?clientId=${clientId}`, {
        method: 'POST', headers: { ...auth, 'Idempotency-Key': key }, body: JSON.stringify(payload)
    });
    const unauthorized = await send('batch:auth-error:1');
    assert.equal(unauthorized.status, 401);
    assert.equal(JSON.stringify(await unauthorized.json()).includes('private API details'), false);

    externalResponse = Response.json({ unexpected: true });
    const malformed = await send('batch:malformed:1');
    assert.equal(malformed.status, 502);
    assert.deepEqual(await malformed.json(), { error: 'malformed_response' });
    const duplicate = await send('batch:malformed:1');
    assert.equal(duplicate.status, 409);
    assert.deepEqual(await duplicate.json(), { error: 'operation_outcome_unknown' });
    assert.equal(calls, 2);
});

test('Clockodo Worker loads customers and services from documented paginated endpoints without leaking the API key', async t => {
    const backend = makeBackend();
    const originalFetch = globalThis.fetch;
    const requests = [];
    globalThis.fetch = async (url, init) => {
        requests.push({ url: String(url), init });
        const parsed = new URL(String(url));
        if (parsed.pathname === '/api/v3/customers') {
            if (parsed.searchParams.get('page') === '1') {
                return Response.json({
                    paging: { items_per_page: 1000, current_page: 1, count_pages: 2, count_items: 3 },
                    data: [
                        { id: 5, name: 'Beta', active: true, note: 'private customer note' },
                        { id: 3, name: 'Alpha', active: false }
                    ]
                });
            }
            return Response.json({
                paging: { items_per_page: 1000, current_page: 2, count_pages: 2, count_items: 3 },
                data: [{ id: 7, name: 'Gamma', active: true }]
            });
        }
        if (parsed.pathname === '/api/v4/services') {
            return Response.json({
                paging: { items_per_page: 1000, current_page: 1, count_pages: 1, count_items: 1 },
                data: [{ id: 9, name: 'Repair', active: true, note: 'private service note' }]
            });
        }
        return Response.json({ error: 'unexpected upstream route' }, { status: 500 });
    };
    t.after(() => { globalThis.fetch = originalFetch; });

    const clientId = 'clockodo_lists_client_123456';
    const token = 'clockodo-lists-token'.padEnd(48, 'k');
    const apiKey = 'list-access-api-key';
    const auth = { Authorization: `Bearer ${token}` };

    const unconfigured = await backend.request(`/api/clockodo/customers?clientId=${clientId}`, { headers: auth });
    assert.equal(unconfigured.status, 401);
    assert.deepEqual(await unconfigured.json(), { error: 'unauthorized' });

    await backend.request(`/api/clockodo/config?clientId=${clientId}`, {
        method: 'PUT', headers: { ...auth, 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiUser: 'person@example.test', apiKey })
    });

    const unauthorized = await backend.request(`/api/clockodo/customers?clientId=${clientId}`, {
        headers: { Authorization: `Bearer ${'z'.repeat(48)}` }
    });
    assert.equal(unauthorized.status, 401);

    const customersResponse = await backend.request(`/api/clockodo/customers?clientId=${clientId}`, { headers: auth });
    assert.equal(customersResponse.status, 200);
    const customersBody = await customersResponse.text();
    assert.deepEqual(JSON.parse(customersBody), {
        customers: [
            { id: 3, name: 'Alpha', active: false },
            { id: 5, name: 'Beta', active: true },
            { id: 7, name: 'Gamma', active: true }
        ]
    });
    assert.equal(customersBody.includes('private customer note'), false);
    assert.equal(customersBody.includes(apiKey), false);

    const servicesResponse = await backend.request(`/api/clockodo/services?clientId=${clientId}`, { headers: auth });
    assert.equal(servicesResponse.status, 200);
    const servicesBody = await servicesResponse.text();
    assert.deepEqual(JSON.parse(servicesBody), { services: [{ id: 9, name: 'Repair', active: true }] });
    assert.equal(servicesBody.includes('private service note'), false);

    const customerRequests = requests.filter(item => item.url.includes('/api/v3/customers'));
    assert.equal(customerRequests.length, 2);
    assert.ok(customerRequests.every(item => item.url.includes('items_per_page=1000')));
    assert.ok(customerRequests.every(item => item.init.method === 'GET'));
    assert.equal(customerRequests[0].init.headers['X-ClockodoApiKey'], apiKey);
    assert.equal(customerRequests[0].init.headers['X-ClockodoApiUser'], 'person@example.test');

    const methodNotAllowed = await backend.request(`/api/clockodo/customers?clientId=${clientId}`, {
        method: 'POST', headers: auth
    });
    assert.equal(methodNotAllowed.status, 405);
    const serviceMethodNotAllowed = await backend.request(`/api/clockodo/services?clientId=${clientId}`, {
        method: 'DELETE', headers: auth
    });
    assert.equal(serviceMethodNotAllowed.status, 405);
});

test('Clockodo customer and service loads classify upstream failures without leaking details', async t => {
    const backend = makeBackend();
    const originalFetch = globalThis.fetch;
    const requests = [];
    let upstreamResponse = Response.json({ data: [] });
    globalThis.fetch = async (url, init) => {
        requests.push({ url: String(url), init });
        return upstreamResponse;
    };
    t.after(() => { globalThis.fetch = originalFetch; });

    const clientId = 'clockodo_lists_errors_123456';
    const token = 'clockodo-error-token'.padEnd(48, 'e');
    const auth = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
    await backend.request(`/api/clockodo/config?clientId=${clientId}`, {
        method: 'PUT', headers: auth,
        body: JSON.stringify({ apiUser: 'person@example.test', apiKey: 'private-api-key' })
    });
    const load = resource => backend.request(`/api/clockodo/${resource}?clientId=${clientId}`, { headers: auth });

    for (const [status, expectedError] of [[401, 'invalid_credentials'], [429, 'rate_limited'], [403, 'clockodo_rejected'], [503, 'service_error']]) {
        upstreamResponse = Response.json({ error: 'sensitive upstream detail' }, { status });
        const response = await load('customers');
        assert.equal(response.status, status);
        const responseText = await response.text();
        assert.deepEqual(JSON.parse(responseText), { error: expectedError });
        assert.equal(responseText.includes('sensitive upstream detail'), false);
        assert.equal(responseText.includes('private-api-key'), false);
    }

    upstreamResponse = Response.json({ data: [{ id: 0, name: 'Invalid' }] });
    const malformedItem = await load('services');
    assert.equal(malformedItem.status, 502);
    assert.deepEqual(await malformedItem.json(), { error: 'malformed_response' });

    upstreamResponse = Response.json({ data: 'not-a-list' });
    const malformedShape = await load('services');
    assert.equal(malformedShape.status, 502);
    assert.deepEqual(await malformedShape.json(), { error: 'malformed_response' });

    const paths = requests.filter(item => item.url.includes('my.clockodo.com')).map(item => new URL(item.url).pathname);
    assert.ok(paths.every(path => path === '/api/v3/customers' || path === '/api/v4/services'));
});

test('Clockodo entry rejections expose safe upstream diagnostics without leaking secrets', async t => {
    const backend = makeBackend();
    const originalFetch = globalThis.fetch;
    let upstreamResponse = Response.json({}, { status: 400 });
    globalThis.fetch = async () => upstreamResponse;
    t.after(() => { globalThis.fetch = originalFetch; });

    const clientId = 'clockodo_rejection_client_1';
    const token = 'clockodo-rejection-token'.padEnd(48, 'r');
    const auth = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
    await backend.request(`/api/clockodo/config?clientId=${clientId}`, {
        method: 'PUT', headers: auth,
        body: JSON.stringify({ apiUser: 'person@example.test', apiKey: 'private-rejection-key' })
    });
    const payload = {
        time_since: '2026-09-28T08:00:00.000Z', time_until: '2026-09-28T08:00:01.000Z',
        customers_id: 3, services_id: 9, billable: 1, text: 'Diagnostic'
    };
    let attempt = 0;
    const send = () => {
        attempt += 1;
        return backend.request(`/api/clockodo/entries?clientId=${clientId}`, {
            method: 'POST',
            headers: { ...auth, 'Idempotency-Key': `rejection:entry:${attempt}` },
            body: JSON.stringify(payload)
        });
    };

    upstreamResponse = Response.json(
        { error: { code: 400, message: 'Validation failed', fields: ['services_id'] } },
        { status: 400 }
    );
    const badRequest = await send();
    assert.equal(badRequest.status, 400);
    const badRequestBody = await badRequest.text();
    assert.deepEqual(JSON.parse(badRequestBody), {
        error: 'clockodo_rejected',
        clockodo: { status: 400, code: '400', message: 'Validation failed', fields: ['services_id'] }
    });
    assert.equal(badRequestBody.includes('private-rejection-key'), false);

    upstreamResponse = Response.json(
        { errors: [{ type: 'Validation', message: 'Service is not available for this customer.', details: 'services_id 9 has no assignment', path: '/services_id' }] },
        { status: 422 }
    );
    const unprocessable = await send();
    assert.equal(unprocessable.status, 422);
    assert.deepEqual(await unprocessable.json(), {
        error: 'clockodo_rejected',
        clockodo: {
            status: 422, code: 'Validation',
            message: 'Service is not available for this customer.', path: '/services_id'
        }
    });

    upstreamResponse = Response.json(
        { errors: [{ type: 'General', message: 'Authentication failed' }] },
        { status: 401 }
    );
    const unauthorized = await send();
    assert.equal(unauthorized.status, 401);
    assert.deepEqual(await unauthorized.json(), {
        error: 'invalid_credentials',
        clockodo: { status: 401, code: 'General', message: 'Authentication failed' }
    });

    upstreamResponse = new Response('<html>gateway error with private details</html>', { status: 400 });
    const malformed = await send();
    assert.equal(malformed.status, 400);
    const malformedText = await malformed.text();
    assert.deepEqual(JSON.parse(malformedText), { error: 'clockodo_rejected' });
    assert.equal(malformedText.includes('private details'), false);

    upstreamResponse = Response.json({
        errors: [{ type: 'General', message: 'Nope', apiKey: 'never-leak-this' }],
        apiKey: 'never-leak-this'
    }, { status: 403 });
    const redacted = await send();
    const redactedText = await redacted.text();
    assert.deepEqual(JSON.parse(redactedText), {
        error: 'clockodo_rejected',
        clockodo: { status: 403, code: 'General', message: 'Nope' }
    });
    assert.equal(redactedText.includes('never-leak-this'), false);

    upstreamResponse = Response.json({ entry: { id: 4242 } });
    const created = await send();
    assert.deepEqual(await created.json(), { created: true, entryId: 4242 });
});

test('Clockodo Worker forwards customer service assignments without leaking other fields', async t => {
    const backend = makeBackend();
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () => Response.json({
        paging: { items_per_page: 1000, current_page: 1, count_pages: 1, count_items: 2 },
        data: [
            { id: 5, name: 'Customer A', active: true, service_assignments: [11, 12, 0, 'x'], note: 'private customer note' },
            { id: 6, name: 'Customer B', active: false }
        ]
    });
    t.after(() => { globalThis.fetch = originalFetch; });

    const clientId = 'clockodo_assignments_client_1';
    const token = 'clockodo-assignments-token'.padEnd(48, 'a');
    const auth = { Authorization: `Bearer ${token}` };
    await backend.request(`/api/clockodo/config?clientId=${clientId}`, {
        method: 'PUT', headers: { ...auth, 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiUser: 'person@example.test', apiKey: 'private-assignment-key' })
    });
    const response = await backend.request(`/api/clockodo/customers?clientId=${clientId}`, { headers: auth });
    assert.equal(response.status, 200);
    const text = await response.text();
    assert.deepEqual(JSON.parse(text), {
        customers: [
            { id: 5, name: 'Customer A', active: true, serviceAssignments: [11, 12] },
            { id: 6, name: 'Customer B', active: false }
        ]
    });
    assert.equal(text.includes('private'), false);
});

test('activity color and shape selectors render as single horizontal scrollable rows', () => {
    const colorRule = styleSource.match(/\.color-picker\s*\{([^}]*)\}/s)?.[1] || '';
    assert.match(colorRule, /display:\s*flex/);
    assert.match(colorRule, /flex-wrap:\s*nowrap/);
    assert.match(colorRule, /overflow-x:\s*auto/);
    assert.equal(/grid-template-columns/.test(colorRule), false);

    const shapeRule = styleSource.match(/\.shape-picker\s*\{([^}]*)\}/s)?.[1] || '';
    assert.match(shapeRule, /display:\s*flex/);
    assert.match(shapeRule, /flex-wrap:\s*nowrap/);
    assert.match(shapeRule, /overflow-x:\s*auto/);
    assert.equal(/grid-template-columns/.test(shapeRule), false);

    const nameRule = styleSource.match(/\.activity-name-input\s*\{([^}]*)\}/s)?.[1] || '';
    assert.match(nameRule, /min-height/);
    assert.match(nameRule, /font-size:\s*16px/);
});

test('activity name, color, and shape selections persist when saving', async () => {
    const browser = makeBrowserHarness(makeBackend());
    const saved = [];
    const colorOption = { style: { backgroundColor: 'rgb(255, 255, 255)' } };
    const shapeOption = { dataset: { shape: 'diamond' } };
    const sizeOption = { dataset: { size: 'large' } };
    const nodes = {
        activityName: { value: 'Diamond activity' },
        activityModal: { classList: { remove() {} } }
    };
    browser.document.getElementById = id => nodes[id] || null;
    browser.document.querySelector = selector => ({
        '.color-option.selected': colorOption,
        '.shape-option.selected': shapeOption,
        '.size-btn.selected': sizeOption
    })[selector] || null;
    browser.app.storage = { saveActivity: async activity => saved.push({ ...activity }) };
    browser.app.generateId = () => 'shape-activity';
    browser.app.renderMain = () => {};

    await browser.app.saveActivity();
    assert.equal(saved.at(-1).name, 'Diamond activity');
    assert.equal(saved.at(-1).color, 'rgb(255, 255, 255)');
    assert.equal(saved.at(-1).shape, 'diamond');
    assert.equal(saved.at(-1).size, 'large');
});

test('Clockodo customer and service fields use input placeholders instead of separate labels', () => {
    for (const inputId of ['activityCustomerInput', 'activityServiceInput', 'entryEditCustomerInput', 'entryEditServiceInput']) {
        assert.equal(htmlSource.includes(`for="${inputId}"`), false);
    }
    assert.match(htmlSource, /id="activityCustomerInput"[^>]*data-i18n-aria-label="clockodoCustomerSelectLabel"/);
    assert.match(htmlSource, /id="activityServiceInput"[^>]*data-i18n-aria-label="clockodoServiceSelectLabel"/);
    assert.match(htmlSource, /id="entryEditCustomerInput"[^>]*data-i18n-aria-label="clockodoCustomerSelectLabel"/);
    assert.match(htmlSource, /id="entryEditServiceInput"[^>]*data-i18n-aria-label="clockodoServiceSelectLabel"/);
});

test('activity contrast rule maximizes WCAG contrast for every palette color', () => {
    const browser = makeBrowserHarness(makeBackend());
    const luminance = hexColor => {
        const hex = hexColor.replace('#', '');
        const channels = [0, 2, 4].map(index => parseInt(hex.slice(index, index + 2), 16) / 255);
        const linear = channels.map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
        return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
    };
    const contrast = (a, b) => {
        const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
        return (light + 0.05) / (dark + 0.05);
    };

    assert.equal(browser.app.contrastingTextColor('#ffffff'), '#000000');
    assert.equal(browser.app.contrastingTextColor('#000000'), '#ffffff');
    assert.equal(browser.app.contrastingTextColor('#F1C40F'), '#000000');
    assert.equal(browser.app.contrastingTextColor('#2C3E50'), '#ffffff');

    const palette = source.match(/this\.COLORS = \[([\s\S]*?)\];/)[1]
        .split(',')
        .map(value => value.trim().replace(/^'|'$/g, ''))
        .filter(Boolean);
    assert.ok(palette.length > 0);
    for (const color of palette) {
        const foreground = browser.app.contrastingTextColor(color);
        assert.ok(['#000000', '#ffffff'].includes(foreground), `${color} produced ${foreground}`);
        assert.notEqual(foreground, color);
        assert.ok(contrast(color, foreground) >= 4.5, `${color} with ${foreground} has insufficient contrast`);
    }
});

test('activity rendering derives text color from the centralized contrast helper', () => {
    assert.match(source, /btn\.style\.setProperty\('--activity-text-color', this\.contrastingTextColor\(/);
    assert.match(styleSource, /#activitiesGrid \.activity-btn\.activity-node \{[^}]*background:\s*var\(--activity-accent[^}]*color:\s*var\(--activity-text-color/);
    assert.equal(/#activitiesGrid \.activity-btn\.activity-node \{[^}]*color:\s*#fff/i.test(styleSource), false);
    assert.match(styleSource, /\.activity-node \.btn-name,[\s\S]*?\.btn-hint \{\s*color:\s*var\(--activity-text-color/);
});
