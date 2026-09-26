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
const serviceWorkerSource = await readFile(new URL('../sw.js', import.meta.url), 'utf8');
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
        document: { getElementById: id => id === 'notificationStatus' ? statusNode : null },
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
        statusNode,
        localStorageValues,
        notificationDisplays,
        subscribedApplicationServerKeys,
        get subscribeCount() { return subscribeCount; },
        get subscription() { return subscription; }
    };
}

function captureServiceWorkerNotifications() {
    const handlers = {};
    const shown = [];
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
            open: async () => ({ addAll: async () => {}, put: async () => {} }),
            keys: async () => [],
            delete: async () => {},
            match: async () => undefined
        },
        fetch,
        console,
        Promise
    });
    vm.runInContext(serviceWorkerSource, context, { filename: 'sw.js' });
    return { handlers, shown };
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
