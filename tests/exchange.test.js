import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { webcrypto } from 'node:crypto';
import test from 'node:test';
import vm from 'node:vm';

const exchangeSource = await readFile(new URL('../exchange.js', import.meta.url), 'utf8');

function makeExchange() {
    const context = vm.createContext({
        crypto: webcrypto,
        btoa,
        atob,
        TextEncoder,
        TextDecoder,
        Uint8Array,
        JSON,
        Math,
        Date,
        Number,
        String,
        Array,
        Object,
        Error
    });
    vm.runInContext(exchangeSource, context, { filename: 'exchange.js' });
    return vm.runInContext('TimerHubExchange', context);
}

const sampleEntries = [
    {
        id: 'local-entry-1', activityId: 'local-act-1', activityNameSnapshot: 'Anfahrt',
        startTimestamp: new Date(2026, 9, 5, 15, 35, 0).getTime(),
        endTimestamp: new Date(2026, 9, 5, 16, 21, 3).getTime(),
        notes: 'Drove to the site', customerId: '11', serviceId: '21',
        customerName: 'Bau GmbH', serviceName: 'Anfahrt', project: 'Bridge',
        syncStatus: 'synced', clockodoEntryId: 987654, syncBatchId: 'batch-secret',
        clockodoError: 'none', clockodoPayload: { secret: 'payload-token' },
        customerApiToken: 'api-key-value'
    },
    {
        id: 'local-entry-2', activityId: 'local-act-1', activityNameSnapshot: 'Concrete pour',
        startTimestamp: new Date(2026, 9, 5, 16, 30, 0).getTime(),
        endTimestamp: new Date(2026, 9, 5, 18, 0, 0).getTime(),
        notes: 'Second coating', customerId: null, serviceId: null
    }
];

const buildPayload = Exchange => Exchange.buildDayPayload({
    entries: sampleEntries,
    date: '2026-10-05',
    exportId: 'export_12345678',
    exportedAt: 1234567890
});

test('exchange payload keeps only the allowed cross-device fields', () => {
    const Exchange = makeExchange();
    const payload = buildPayload(Exchange);
    assert.equal(payload.format, 'timerhub-exchange');
    assert.equal(payload.version, 1);
    assert.equal(payload.exportId, 'export_12345678');
    assert.equal(payload.date, '2026-10-05');
    assert.equal(payload.entries.length, 2);

    const first = payload.entries[0];
    assert.deepEqual(Object.keys(first).sort(), [
        'activityName', 'customerId', 'customerName', 'endTimestamp',
        'notes', 'serviceId', 'serviceName', 'startTimestamp'
    ].sort());
    assert.equal(first.activityName, 'Anfahrt');
    assert.equal(first.customerId, '11');
    assert.equal(first.serviceId, '21');
    assert.equal(first.customerName, 'Bau GmbH');
    assert.equal(first.notes, 'Drove to the site');

    const serialized = JSON.stringify(payload);
    for (const forbidden of ['local-entry-1', 'local-act-1', 'synced', '987654', 'batch-secret', 'api-key-value', 'payload-token', 'clockodoPayload']) {
        assert.equal(serialized.includes(forbidden), false, `payload must not contain ${forbidden}`);
    }
});

test('exchange payload rejects invalid intervals and empty exports', () => {
    const Exchange = makeExchange();
    assert.throws(() => Exchange.buildDayPayload({
        entries: [{ activityNameSnapshot: 'Bad', startTimestamp: 100, endTimestamp: 100 }],
        date: '2026-10-05', exportId: 'export_12345678'
    }), error => error.code === 'invalid_exchange_payload');
    assert.throws(() => Exchange.buildDayPayload({
        entries: [], date: '2026-10-05', exportId: 'export_12345678'
    }), error => error.code === 'invalid_exchange_payload');
    assert.throws(() => Exchange.validatePayload({
        format: 'timerhub-exchange', version: 1, exportId: 'export_12345678',
        date: '05.10.2026', exportedAt: 1, entries: [{}]
    }), error => error.code === 'invalid_exchange_payload');
});

test('transfer code formatting and normalization keep the full secret', () => {
    const Exchange = makeExchange();
    const secret = Exchange.generateSecret(webcrypto);
    assert.equal(secret.length, 43);
    const formatted = Exchange.formatTransferCode(secret);
    assert.ok(formatted.includes(' '));
    assert.equal(Exchange.normalizeTransferCode(formatted), secret);
    assert.equal(Exchange.normalizeTransferCode(`  ${secret}  `), secret);
    assert.throws(() => Exchange.normalizeTransferCode('too-short'), error => error.code === 'invalid_transfer_code');
    assert.throws(() => Exchange.normalizeTransferCode('!'.repeat(43)), error => error.code === 'invalid_transfer_code');
});

test('AES-256-GCM round trip restores the exact payload', async () => {
    const Exchange = makeExchange();
    const payload = buildPayload(Exchange);
    const secret = Exchange.generateSecret(webcrypto);
    const envelope = await Exchange.encryptPayload(payload, secret, webcrypto);
    assert.equal(envelope.format, 'timerhub-exchange');
    assert.equal(envelope.version, 1);
    assert.equal(envelope.algorithm, 'AES-256-GCM');
    assert.equal(Exchange.base64UrlToBytes(envelope.iv).length, 12);

    const decrypted = await Exchange.decryptPayload(envelope, secret, webcrypto);
    assert.deepEqual(JSON.parse(JSON.stringify(decrypted)), JSON.parse(JSON.stringify(payload)));
});

test('the encrypted file never exposes plaintext work data', async () => {
    const Exchange = makeExchange();
    const payload = buildPayload(Exchange);
    const secret = Exchange.generateSecret(webcrypto);
    const envelope = await Exchange.encryptPayload(payload, secret, webcrypto);
    const file = JSON.stringify(envelope);
    for (const value of ['Anfahrt', 'Concrete pour', 'Drove to the site', 'Bau GmbH', '2026-10-05', 'export_12345678']) {
        assert.equal(file.includes(value), false, `encrypted file must not contain ${value}`);
    }
    assert.ok(/^[A-Za-z0-9_-]+$/.test(envelope.ciphertext));
});

test('a wrong transfer secret fails safely', async () => {
    const Exchange = makeExchange();
    const payload = buildPayload(Exchange);
    const secret = Exchange.generateSecret(webcrypto);
    const wrong = Exchange.generateSecret(webcrypto);
    const envelope = await Exchange.encryptPayload(payload, secret, webcrypto);
    await assert.rejects(() => Exchange.decryptPayload(envelope, wrong, webcrypto), error => error.code === 'exchange_decrypt_failed');
});

test('modified ciphertext fails authentication', async () => {
    const Exchange = makeExchange();
    const payload = buildPayload(Exchange);
    const secret = Exchange.generateSecret(webcrypto);
    const envelope = await Exchange.encryptPayload(payload, secret, webcrypto);
    const flipped = { ...envelope, ciphertext: `${envelope.ciphertext.slice(0, -2)}${envelope.ciphertext.slice(-2) === 'AA' ? 'BB' : 'AA'}` };
    await assert.rejects(() => Exchange.decryptPayload(flipped, secret, webcrypto), error => error.code === 'exchange_decrypt_failed');
});

test('modified envelope metadata fails authentication', async () => {
    const Exchange = makeExchange();
    const payload = buildPayload(Exchange);
    const secret = Exchange.generateSecret(webcrypto);
    const envelope = await Exchange.encryptPayload(payload, secret, webcrypto);
    await assert.rejects(
        () => Exchange.decryptPayload({ ...envelope, createdAt: envelope.createdAt + 1 }, secret, webcrypto),
        error => error.code === 'exchange_decrypt_failed'
    );
    await assert.rejects(
        () => Exchange.decryptPayload({ ...envelope, iv: Exchange.bytesToBase64Url(webcrypto.getRandomValues(new Uint8Array(12))) }, secret, webcrypto),
        error => error.code === 'exchange_decrypt_failed'
    );
});

test('corrupted and unsupported files are rejected before decryption', async () => {
    const Exchange = makeExchange();
    assert.throws(() => Exchange.validateEnvelope(null), error => error.code === 'invalid_exchange_file');
    assert.throws(() => Exchange.validateEnvelope({ format: 'timerhub-exchange', version: 1 }), error => error.code === 'invalid_exchange_file');
    assert.throws(() => Exchange.validateEnvelope({
        format: 'timerhub-exchange', version: 1, algorithm: 'AES-256-GCM', iv: 'AAAA', ciphertext: 'AAAA', createdAt: 1
    }), error => error.code === 'invalid_exchange_file');
    assert.throws(() => Exchange.validateEnvelope({
        format: 'timerhub-exchange', version: 2, algorithm: 'AES-256-GCM',
        iv: Exchange.bytesToBase64Url(new Uint8Array(12)), ciphertext: 'AAAA', createdAt: 1
    }), error => error.code === 'unsupported_exchange_version');
    assert.throws(() => Exchange.validatePayload({ format: 'timerhub-exchange', version: 2, entries: [] }), error => error.code === 'unsupported_exchange_version');
});

test('a valid envelope carrying a malformed payload is rejected after decryption', async () => {
    const Exchange = makeExchange();
    const secret = Exchange.generateSecret(webcrypto);
    const secretBytes = Exchange.base64UrlToBytes(secret);
    const createdAt = Date.now();
    const iv = webcrypto.getRandomValues(new Uint8Array(12));
    const key = await webcrypto.subtle.importKey('raw', secretBytes, 'AES-GCM', false, ['encrypt']);
    const ciphertext = await webcrypto.subtle.encrypt(
        { name: 'AES-GCM', iv, additionalData: new TextEncoder().encode(`timerhub-exchange|1|${createdAt}`) },
        key,
        new TextEncoder().encode(JSON.stringify({
            format: 'timerhub-exchange', version: 1, exportId: 'export_12345678',
            date: '2026-10-05', exportedAt: 1, entries: [{ activityName: 'X', startTimestamp: 10, endTimestamp: 5 }]
        }))
    );
    const envelope = {
        format: 'timerhub-exchange', version: 1, algorithm: 'AES-256-GCM',
        iv: Exchange.bytesToBase64Url(iv), ciphertext: Exchange.bytesToBase64Url(new Uint8Array(ciphertext)), createdAt
    };
    await assert.rejects(() => Exchange.decryptPayload(envelope, secret, webcrypto), error => error.code === 'invalid_exchange_payload');
});

test('QR payload carries only the protocol tag and the transfer secret', () => {
    const Exchange = makeExchange();
    const secret = Exchange.generateSecret(webcrypto);
    const qr = Exchange.buildQrPayload(secret);
    assert.equal(qr, `timerhub-exchange:1:${secret}`);
    assert.equal(Exchange.parseQrPayload(qr), secret);
    for (const value of ['Anfahrt', 'Concrete', 'Bau GmbH', '2026-10-05']) {
        assert.equal(qr.includes(value), false);
    }
    assert.throws(() => Exchange.parseQrPayload(`${qr}:extra`), error => error.code === 'invalid_qr_payload');
    assert.throws(() => Exchange.parseQrPayload('timerhub-exchange:2:abc'), error => error.code === 'invalid_qr_payload');
    assert.throws(() => Exchange.parseQrPayload(`https://example.test/?code=${secret}`), error => error.code === 'invalid_qr_payload');
});
