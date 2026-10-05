import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

const source = await readFile(new URL('../clockodo-client.js', import.meta.url), 'utf8');

function makeClient(fetchImpl, timeoutMs = 30) {
    const context = vm.createContext({ fetch: fetchImpl, AbortController, setTimeout, clearTimeout, encodeURIComponent });
    vm.runInContext(source, context, { filename: 'clockodo-client.js' });
    return { Client: context.ClockodoClient, client: new context.ClockodoClient({ fetchImpl, timeoutMs }) };
}

const clientOptions = { clientId: 'client_1234567890abcdef', accessToken: 'a'.repeat(48) };

test('Clockodo client builds the documented v2 entry payload', () => {
    const { Client } = makeClient(async () => new Response('{}'));
    const payload = Client.buildEntryPayload({
        startTimestamp: Date.parse('2026-09-28T08:00:00Z'),
        endTimestamp: Date.parse('2026-09-28T09:15:00Z'),
        activityNameSnapshot: 'Painting', project: '321', service: '55', notes: 'First coat'
    }, { customerId: '123', projectId: '654', serviceId: '99', billable: true });
    assert.deepEqual(JSON.parse(JSON.stringify(payload)), {
        time_since: '2026-09-28T08:00:00.000Z',
        time_until: '2026-09-28T09:15:00.000Z',
        customers_id: 123,
        services_id: 55,
        projects_id: 321,
        billable: 1,
        text: 'Painting · First coat'
    });
    assert.throws(() => Client.buildEntryPayload({ startTimestamp: 1, endTimestamp: 2 }, {}), error => error.code === 'missing_clockodo_assignment');
});

test('Clockodo client sends only proxy credentials and validates successful entry responses', async () => {
    let request;
    const { client } = makeClient(async (url, init) => {
        request = { url, init };
        return Response.json({ created: true, entryId: 123 });
    });
    const result = await client.createEntry(...Object.values(clientOptions), { customers_id: 1 }, 'batch:entry:1');
    assert.deepEqual(JSON.parse(JSON.stringify(result)), { created: true, entryId: 123 });
    assert.match(request.url, /\/api\/clockodo\/entries\?clientId=/);
    assert.equal(request.init.headers.Authorization, `Bearer ${clientOptions.accessToken}`);
    assert.equal(request.init.headers['Idempotency-Key'], 'batch:entry:1');
    assert.equal(request.init.body, JSON.stringify({ customers_id: 1 }));
    assert.equal(JSON.stringify(request.init).includes('ClockodoApiKey'), false);
});

test('Clockodo client exposes CREATE only for time entries', () => {
    const { client } = makeClient(async () => Response.json({ created: true, entryId: 987 }));
    assert.equal(typeof client.createEntry, 'function');
    assert.equal(client.updateEntry, undefined);
});

test('Clockodo client loads customers and services through the authenticated proxy', async () => {
    const requests = [];
    const { client } = makeClient(async (url, init) => {
        requests.push({ url, init });
        if (url.includes('/api/clockodo/customers')) {
            return Response.json({ customers: [{ id: 5, name: ' Beta ', active: true }, { id: 3, name: 'Alpha', active: false }] });
        }
        return Response.json({ services: [{ id: 9, name: 'Repair', active: true }] });
    });
    const customerResult = await client.getCustomers(...Object.values(clientOptions));
    const serviceResult = await client.getServices(...Object.values(clientOptions));
    assert.deepEqual(JSON.parse(JSON.stringify(customerResult)), {
        customers: [{ id: 5, name: 'Beta', active: true }, { id: 3, name: 'Alpha', active: false }]
    });
    assert.deepEqual(JSON.parse(JSON.stringify(serviceResult)), {
        services: [{ id: 9, name: 'Repair', active: true }]
    });
    assert.match(requests[0].url, /\/api\/clockodo\/customers\?clientId=/);
    assert.match(requests[1].url, /\/api\/clockodo\/services\?clientId=/);
    assert.equal(requests[0].init.headers.Authorization, `Bearer ${clientOptions.accessToken}`);
    assert.equal(JSON.stringify(requests.map(item => item.init)).includes('ClockodoApiKey'), false);
});

test('Clockodo client rejects malformed customer and service lists without exposing response bodies', async () => {
    const missingList = makeClient(async () => Response.json({ customers: 'not-a-list' }));
    await assert.rejects(
        () => missingList.client.getCustomers(...Object.values(clientOptions)),
        error => error.code === 'malformed_response'
    );
    const badItem = makeClient(async () => Response.json({ services: [{ id: '9', name: 'Repair' }] }));
    await assert.rejects(
        () => badItem.client.getServices(...Object.values(clientOptions)),
        error => error.code === 'malformed_response' && !error.message.includes('Repair')
    );
    const invalidCredentials = makeClient(async () => Response.json({ error: 'secret details' }, { status: 401 }));
    await assert.rejects(
        () => invalidCredentials.client.getServices(...Object.values(clientOptions)),
        error => error.code === 'invalid_credentials' && error.status === 401
    );
});

test('Clockodo client prefers per-entry customer and service over configured defaults', () => {
    const { Client } = makeClient(async () => new Response('{}'));
    const payload = Client.buildEntryPayload({
        startTimestamp: Date.parse('2026-09-28T08:00:00Z'),
        endTimestamp: Date.parse('2026-09-28T09:15:00Z'),
        activityNameSnapshot: 'Painting',
        customerId: '77',
        serviceId: '88'
    }, { customerId: '123', serviceId: '99', billable: true });
    assert.equal(payload.customers_id, 77);
    assert.equal(payload.services_id, 88);
});

test('Clockodo client classifies invalid credentials and malformed responses without exposing response bodies', async () => {
    const unauthorized = makeClient(async () => Response.json({ error: 'secret must not leak' }, { status: 401 }));
    await assert.rejects(() => unauthorized.client.testConnection(...Object.values(clientOptions)), error => error.code === 'invalid_credentials' && error.status === 401);
    const malformed = makeClient(async () => ({ status: 200, ok: true, json: async () => null }));
    await assert.rejects(() => malformed.client.testConnection(...Object.values(clientOptions)), error => error.code === 'malformed_response');
    const limited = makeClient(async () => Response.json({ error: 'slow down' }, { status: 429 }));
    await assert.rejects(() => limited.client.testConnection(...Object.values(clientOptions)), error => error.code === 'rate_limited' && error.status === 429);
    const service = makeClient(async () => Response.json({ error: 'service_error' }, { status: 503 }));
    await assert.rejects(() => service.client.testConnection(...Object.values(clientOptions)), error => error.code === 'service_error' && error.status === 503);
});

test('Clockodo client reports network failures and timeouts distinctly', async () => {
    const network = makeClient(async () => { throw new Error('private failure detail'); });
    await assert.rejects(() => network.client.testConnection(...Object.values(clientOptions)), error => error.code === 'network_error' && !error.message.includes('private'));
    const timeout = makeClient((url, init) => new Promise((resolve, reject) => {
        init.signal.addEventListener('abort', () => reject(Object.assign(new Error('aborted'), { name: 'AbortError' })));
    }), 5);
    await assert.rejects(() => timeout.client.testConnection(...Object.values(clientOptions)), error => error.code === 'timeout');
});

test('Clockodo client allows retry after a rejected request and coalesces concurrent duplicate operations', async () => {
    let count = 0;
    const { client } = makeClient(async () => {
        count += 1;
        if (count === 1) throw new Error('offline');
        await new Promise(resolve => setTimeout(resolve, 5));
        return Response.json({ created: true, entryId: 44 });
    });
    const args = [...Object.values(clientOptions), { customers_id: 1 }, 'batch:entry:retry'];
    await assert.rejects(() => client.createEntry(...args), error => error.code === 'network_error');
    const [first, duplicate] = await Promise.all([client.createEntry(...args), client.createEntry(...args)]);
    assert.equal(count, 2);
    assert.deepEqual(JSON.parse(JSON.stringify(first)), JSON.parse(JSON.stringify(duplicate)));
});
