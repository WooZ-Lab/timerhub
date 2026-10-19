import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { webcrypto } from 'node:crypto';
import test from 'node:test';
import vm from 'node:vm';
import worker, { TimerHubDurableObject } from '../worker/index.js';

const shareLinkSource = await readFile(new URL('../share-link.js', import.meta.url), 'utf8');

function makeShareLinkModule() {
    const sandbox = {
        btoa,
        atob,
        Uint8Array,
        TextEncoder,
        TextDecoder,
        URL,
        Date,
        Number,
        Math,
        JSON,
        crypto: webcrypto
    };
    vm.createContext(sandbox);
    vm.runInContext(shareLinkSource, sandbox, { filename: 'share-link.js' });
    return sandbox.TimerHubShareLink;
}

function makeBackend() {
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
        records,
        alarmTimes,
        getObject,
        request: (path, init = {}) => worker.fetch(new Request(new URL(path, 'https://timerhub.example.test'), init), env),
        fireAlarm: async id => {
            alarmTimes.delete(id);
            await getObject(id).alarm();
        }
    };
}

const VALID_ENVELOPE = {
    format: 'timerhub-exchange',
    version: 1,
    algorithm: 'AES-256-GCM',
    iv: 'AAAAAAAAAAAAAAAA',
    ciphertext: 'ciphertext-payload-value',
    createdAt: 1770000000000
};

function postShare(backend, shareId, envelope = VALID_ENVELOPE, expiresAt = Date.now() + 60 * 60 * 1000) {
    return backend.request('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shareId, envelope, expiresAt })
    });
}

test('share routes store only ciphertext and return it until completion', async () => {
    const backend = makeBackend();
    const shareId = 'share-id-0123456789ab';
    const created = await postShare(backend, shareId);
    assert.equal(created.status, 200);
    const createdBody = await created.json();
    assert.deepEqual(Object.keys(createdBody).sort(), ['expiresAt', 'ok']);
    assert.equal(createdBody.ok, true);

    const fetched = await backend.request(`/api/share/${shareId}`);
    assert.equal(fetched.status, 200);
    const fetchedBody = await fetched.json();
    assert.deepEqual(fetchedBody.envelope, VALID_ENVELOPE);
    assert.equal(Number.isFinite(fetchedBody.expiresAt), true);
    assert.equal(JSON.stringify(fetchedBody).includes('timerhub-backup'), false);

    const completed = await backend.request(`/api/share/${shareId}/complete`, { method: 'POST', body: '{}' });
    assert.equal(completed.status, 200);
    assert.deepEqual(await completed.json(), { ok: true });
    assert.equal((await backend.request(`/api/share/${shareId}`)).status, 404);
});

test('share creation validates ids, envelopes, expiry bounds, and methods', async () => {
    const backend = makeBackend();
    const invalidId = await backend.request('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shareId: 'short', envelope: VALID_ENVELOPE, expiresAt: Date.now() + 60000 })
    });
    assert.equal(invalidId.status, 400);
    assert.deepEqual(await invalidId.json(), { error: 'invalid_share' });

    const malformedEnvelopes = [
        { ...VALID_ENVELOPE, format: 'timerhub-backup' },
        { ...VALID_ENVELOPE, version: 2 },
        { ...VALID_ENVELOPE, algorithm: 'AES-128-GCM' },
        { ...VALID_ENVELOPE, iv: '' },
        { ...VALID_ENVELOPE, ciphertext: 'not a base64url value!' },
        { ...VALID_ENVELOPE, createdAt: 0 }
    ];
    for (const envelope of malformedEnvelopes) {
        const response = await postShare(backend, 'share-id-0123456789ab', envelope);
        assert.equal(response.status, 400, JSON.stringify(envelope));
        assert.deepEqual(await response.json(), { error: 'invalid_share_payload' });
    }

    const past = await postShare(backend, 'share-id-0123456789ab', VALID_ENVELOPE, Date.now() - 1000);
    assert.equal(past.status, 400);
    assert.deepEqual(await past.json(), { error: 'invalid_share' });
    const tooFar = await postShare(backend, 'share-id-0123456789ab', VALID_ENVELOPE, Date.now() + 33 * 24 * 60 * 60 * 1000);
    assert.equal(tooFar.status, 400);

    const wrongMethod = await backend.request('/api/share');
    assert.equal(wrongMethod.status, 405);
    const wrongItemMethod = await backend.request(`/api/share/share-id-0123456789ab`, { method: 'POST' });
    assert.equal(wrongItemMethod.status, 405);
    assert.equal((await backend.request('/api/share/unknown-id-12345678')).status, 404);
});

test('share creation is create-once until the link is completed', async () => {
    const backend = makeBackend();
    const shareId = 'share-id-0123456789ab';
    assert.equal((await postShare(backend, shareId)).status, 200);
    const duplicate = await postShare(backend, shareId);
    assert.equal(duplicate.status, 409);
    assert.deepEqual(await duplicate.json(), { error: 'share_exists' });
    assert.equal((await backend.request(`/api/share/${shareId}/complete`, { method: 'POST', body: '{}' })).status, 200);
    assert.equal((await postShare(backend, shareId)).status, 200, 'a completed id may be reused for a new link');
});

test('expired share links are rejected and purged on read and by the alarm', async () => {
    const backend = makeBackend();
    const shareId = 'share-id-0123456789ab';
    await postShare(backend, shareId);
    const stored = backend.records.get(`share:${shareId}`).get('share');
    stored.expiresAt = Date.now() - 1000;

    const expired = await backend.request(`/api/share/${shareId}`);
    assert.equal(expired.status, 410);
    assert.deepEqual(await expired.json(), { error: 'share_expired' });
    assert.equal(backend.records.get(`share:${shareId}`).has('share'), false, 'the expired record is purged on read');

    const secondId = 'share-id-0123456789ac';
    await postShare(backend, secondId);
    const secondStored = backend.records.get(`share:${secondId}`).get('share');
    secondStored.expiresAt = Date.now() - 1000;
    await backend.fireAlarm(`share:${secondId}`);
    assert.equal(backend.records.get(`share:${secondId}`).has('share'), false, 'the alarm purges the expired share');
    assert.equal(backend.alarmTimes.has(`share:${secondId}`), false, 'the share alarm is cleared');
});

test('share completion rejects missing and expired links without touching push state', async () => {
    const backend = makeBackend();
    assert.equal((await backend.request('/api/share/unknown-id-12345678/complete', { method: 'POST', body: '{}' })).status, 404);
    const shareId = 'share-id-0123456789ab';
    await postShare(backend, shareId);
    const stored = backend.records.get(`share:${shareId}`).get('share');
    stored.expiresAt = Date.now() - 1000;
    const expired = await backend.request(`/api/share/${shareId}/complete`, { method: 'POST', body: '{}' });
    assert.equal(expired.status, 410);
    assert.deepEqual(await expired.json(), { error: 'share_expired' });
    assert.equal(backend.records.get(`share:${shareId}`).has('share'), false);

    const pushId = 'share-id-0123456789ad';
    await postShare(backend, pushId);
    const pushRecords = backend.records.get(`share:${pushId}`);
    pushRecords.get('share').expiresAt = Date.now() - 1000;
    pushRecords.set('alarm', { alarmId: 'push-alarm', timestamp: Date.now() + 60000 });
    await backend.fireAlarm(`share:${pushId}`);
    assert.equal(pushRecords.has('share'), false, 'the expired share is purged by the alarm');
    assert.equal(pushRecords.has('alarm'), true, 'an unrelated push alarm is not disturbed by share cleanup');
});

test('share link module builds and parses link URLs with the key only in the fragment', () => {
    const ShareLink = makeShareLinkModule();
    const shareId = ShareLink.generateShareId(webcrypto);
    assert.match(shareId, /^[A-Za-z0-9_-]{22}$/);
    const secret = 'A'.repeat(43);
    const url = ShareLink.buildShareUrl({ origin: 'https://timerhub.example.test', pathname: '/', shareId, secret });
    assert.equal(url, `https://timerhub.example.test/?share=${shareId}#key=${secret}`);
    assert.equal(url.split('#')[0].includes(secret), false, 'the key is never part of the requestable URL');
    const parsed = ShareLink.parseShareUrl(url);
    assert.equal(parsed.shareId, shareId);
    assert.equal(parsed.secret, secret);
    assert.equal(ShareLink.parseShareUrl('https://timerhub.example.test/'), null);
    assert.equal(ShareLink.parseShareUrl(`https://timerhub.example.test/?share=${shareId}`), null, 'a missing key is rejected');
    assert.equal(ShareLink.parseShareUrl(`https://timerhub.example.test/?share=short#key=${secret}`), null);
});

test('share link module maps server and network failures to safe codes', async () => {
    const ShareLink = makeShareLinkModule();
    const shareId = 'share-id-0123456789ab';
    const secret = 'B'.repeat(43);
    const envelope = {
        format: 'timerhub-exchange', version: 1, algorithm: 'AES-256-GCM',
        iv: 'AAAAAAAAAAAAAAAA', ciphertext: 'payload', createdAt: Date.now()
    };
    const respond = (status, body) => async () => new Response(JSON.stringify(body), { status });

    await assert.rejects(() => ShareLink.fetchShare(respond(404, { error: 'share_not_found' }), 'https://timerhub.example.test', shareId), /share_not_found/);
    await assert.rejects(() => ShareLink.fetchShare(respond(410, { error: 'share_expired' }), 'https://timerhub.example.test', shareId), /share_expired/);
    await assert.rejects(() => ShareLink.fetchShare(respond(503, { error: 'boom' }), 'https://timerhub.example.test', shareId), /share_unavailable/);
    await assert.rejects(() => ShareLink.fetchShare(async () => { throw new Error('offline'); }, 'https://timerhub.example.test', shareId), /network_error/);
    let capturedInit = null;
    await ShareLink.fetchShare(async (url, init) => {
        capturedInit = init;
        return new Response(JSON.stringify({ envelope: { format: 'timerhub-exchange', version: 1, algorithm: 'AES-256-GCM', iv: 'AAAAAAAAAAAAAAAA', ciphertext: 'payload', createdAt: Date.now() }, expiresAt: Date.now() + 60000 }), { status: 200 });
    }, 'https://timerhub.example.test', shareId);
    assert.equal(capturedInit.cache, 'no-store', 'share fetches bypass browser caches');
    await assert.rejects(() => ShareLink.completeShare(respond(404, { error: 'share_not_found' }), 'https://timerhub.example.test', shareId), /share_not_found/);
    await assert.rejects(() => ShareLink.createShare(respond(409, { error: 'share_exists' }), 'https://timerhub.example.test', { shareId, envelope, expiresAt: Date.now() + 60000 }), /share_exists/);
    await assert.rejects(() => ShareLink.createShare(respond(200, { ok: true }), 'https://timerhub.example.test', { shareId, envelope: { ...envelope, format: 'nope' }, expiresAt: Date.now() + 60000 }), /invalid_share_payload/);
    await assert.rejects(() => ShareLink.createShare(respond(200, { ok: true }), 'https://timerhub.example.test', { shareId, envelope, expiresAt: Date.now() - 1 }), /invalid_expiry/);
    await assert.rejects(() => ShareLink.createShare(respond(200, { ok: true }), 'https://timerhub.example.test', { shareId, envelope, expiresAt: Date.now() + 33 * 24 * 60 * 60 * 1000 }), /invalid_expiry/);

    const created = await ShareLink.createShare(
        respond(200, { ok: true, expiresAt: Date.now() + 60000 }),
        'https://timerhub.example.test',
        { shareId, envelope, expiresAt: Date.now() + 60000 }
    );
    assert.equal(created.shareId, shareId);
    assert.equal(secret.length, 43);
});
