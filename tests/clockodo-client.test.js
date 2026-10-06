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
        time_since: '2026-09-28T08:00:00Z',
        time_until: '2026-09-28T09:15:00Z',
        customers_id: 123,
        services_id: 55,
        projects_id: 321,
        billable: 1,
        text: 'First coat'
    });
    assert.throws(() => Client.buildEntryPayload({ startTimestamp: 1, endTimestamp: 2 }, {}), error => error.code === 'missing_clockodo_assignment');
});

test('Clockodo client formats entry timestamps without milliseconds', () => {
    const { Client } = makeClient(async () => new Response('{}'));
    assert.equal(Client.formatTimestamp(Date.parse('2026-10-05T06:33:25.109Z')), '2026-10-05T06:33:25Z');
    assert.equal(Client.formatTimestamp(Date.parse('2026-10-05T08:33:25.109+02:00')), '2026-10-05T06:33:25Z');
    assert.equal(Client.formatTimestamp(Date.parse('2026-10-05T06:33:25Z')), '2026-10-05T06:33:25Z');
    const payload = Client.buildEntryPayload({
        startTimestamp: Date.parse('2026-10-05T06:33:25.109Z'),
        endTimestamp: Date.parse('2026-10-05T06:33:26.987Z'),
        activityNameSnapshot: 'Painting', customerId: '11', serviceId: '21'
    }, { billable: true });
    assert.equal(payload.time_since, '2026-10-05T06:35:00Z');
    assert.equal(payload.time_until, '2026-10-05T06:35:00Z');
    assert.equal(/\.\d{3}Z$/.test(payload.time_since) || /\.\d{3}Z$/.test(payload.time_until), false);
    assert.equal(payload.customers_id, 11);
    assert.equal(payload.services_id, 21);
    assert.equal(Number.isInteger(payload.customers_id) && Number.isInteger(payload.services_id), true);
    assert.equal(Client.isNormalizedEntryPayload(payload), true);
    assert.equal(Client.isNormalizedEntryPayload({ time_since: '2026-10-05T06:33:25.109Z', time_until: '2026-10-05T06:33:26.109Z' }), false);
    assert.equal(Client.isNormalizedEntryPayload({ time_since: '2026-10-05T06:33:25Z', time_until: '2026-10-05T06:33:26.109Z' }), false);
    assert.equal(Client.isNormalizedEntryPayload(null), false);
});

test('Clockodo client rounds entry timestamps to the nearest five minutes', () => {
    const { Client, client } = makeClient(async () => new Response('{}'));
    const iso = timestamp => new Date(timestamp).toISOString();
    const cases = [
        ['2026-10-05T12:35:00.000Z', '2026-10-05T12:35:00.000Z', 'exact boundary stays put'],
        ['2026-10-05T12:37:29.000Z', '2026-10-05T12:35:00.000Z', 'one second below the midpoint rounds down'],
        ['2026-10-05T12:37:30.000Z', '2026-10-05T12:40:00.000Z', 'exactly 30 seconds rounds up'],
        ['2026-10-05T12:37:31.000Z', '2026-10-05T12:40:00.000Z', 'one second above the midpoint rounds up'],
        ['2026-10-05T12:39:59.000Z', '2026-10-05T12:40:00.000Z', 'rounds up from just below the boundary'],
        ['2026-10-05T12:40:00.000Z', '2026-10-05T12:40:00.000Z', 'landing on a boundary stays put'],
        ['2026-10-05T12:42:29.000Z', '2026-10-05T12:40:00.000Z', 'rounds down from just below the boundary'],
        ['2026-10-05T12:42:30.000Z', '2026-10-05T12:45:00.000Z', 'rounds up past the boundary midpoint'],
        ['2026-10-05T12:58:30.000Z', '2026-10-05T13:00:00.000Z', 'rounds across an hour boundary'],
        ['2026-10-05T23:57:30.000Z', '2026-10-06T00:00:00.000Z', 'rounds across midnight']
    ];
    for (const [input, expected, message] of cases) {
        assert.equal(iso(Client.roundToNearestFiveMinutes(Date.parse(input))), expected, message);
        assert.equal(iso(client.roundToNearestFiveMinutes(Date.parse(input))), expected, `${message} (instance method)`);
    }

    const entry = {
        startTimestamp: Date.parse('2026-10-05T12:37:29.000Z'),
        endTimestamp: Date.parse('2026-10-05T12:58:30.000Z'),
        activityNameSnapshot: 'Painting', customerId: '11', serviceId: '21'
    };
    const payload = Client.buildEntryPayload(entry, { billable: true });
    assert.equal(payload.time_since, '2026-10-05T12:35:00Z');
    assert.equal(payload.time_until, '2026-10-05T13:00:00Z');
    assert.equal(entry.startTimestamp, Date.parse('2026-10-05T12:37:29.000Z'), 'raw start timestamp is preserved');
    assert.equal(entry.endTimestamp, Date.parse('2026-10-05T12:58:30.000Z'), 'raw end timestamp is preserved');
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

test('Clockodo client surfaces safe upstream rejection details', async () => {
    const { client } = makeClient(async () => Response.json({
        error: 'clockodo_rejected',
        clockodo: {
            status: 422,
            code: 'Validation',
            message: 'Service is not available for this customer.',
            path: '/services_id',
            fields: ['services_id'],
            apiKey: 'never-leak-this'
        }
    }, { status: 422 }));
    await assert.rejects(
        () => client.createEntry(...Object.values(clientOptions), { customers_id: 1 }, 'rejection:client:1'),
        error => {
            assert.equal(error.code, 'clockodo_rejected');
            assert.equal(error.status, 422);
            assert.deepEqual(JSON.parse(JSON.stringify(error.details)), {
                status: 422,
                code: 'Validation',
                message: 'Service is not available for this customer.',
                path: '/services_id',
                fields: ['services_id']
            });
            assert.equal(JSON.stringify(error.details).includes('never-leak-this'), false);
            return true;
        }
    );
});

test('Clockodo client sanitizes malformed rejection details and keeps generic fallback', async () => {
    const { client } = makeClient(async () => Response.json({
        error: 'clockodo_rejected',
        clockodo: {
            status: 'not-a-number',
            message: `  ${'x'.repeat(400)}\u0000  `,
            fields: 'not-a-list',
            apiKey: 'never-leak-this'
        }
    }, { status: 400 }));
    await assert.rejects(
        () => client.createEntry(...Object.values(clientOptions), { customers_id: 1 }, 'rejection:client:2'),
        error => {
            assert.equal(error.code, 'clockodo_rejected');
            assert.equal(error.details.status, undefined);
            assert.equal(error.details.message.length, 300);
            assert.equal(error.details.message.includes('\u0000'), false);
            assert.equal(error.details.fields, undefined);
            assert.equal(JSON.stringify(error.details).includes('never-leak-this'), false);
            return true;
        }
    );
    const { client: withoutDetails } = makeClient(async () => Response.json({ error: 'clockodo_rejected' }, { status: 400 }));
    await assert.rejects(
        () => withoutDetails.createEntry(...Object.values(clientOptions), { customers_id: 1 }, 'rejection:client:3'),
        error => error.code === 'clockodo_rejected' && error.details === null
    );
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

test('Clockodo client keeps customer service assignments and drops invalid IDs', async () => {
    const { client } = makeClient(async () => Response.json({
        customers: [
            { id: 1, name: 'Customer A', active: true, serviceAssignments: [11, 12, 0, 'x', -1] },
            { id: 2, name: 'Customer B', active: true }
        ]
    }));
    const result = await client.getCustomers(...Object.values(clientOptions));
    assert.deepEqual(JSON.parse(JSON.stringify(result)), {
        customers: [
            { id: 1, name: 'Customer A', active: true, serviceAssignments: [11, 12] },
            { id: 2, name: 'Customer B', active: true }
        ]
    });
});

test('Clockodo entry text is notes only and never the activity or project name', () => {
    const { Client } = makeClient(async () => new Response('{}'));
    const base = {
        startTimestamp: Date.parse('2026-10-05T12:38:02Z'),
        endTimestamp: Date.parse('2026-10-05T12:40:00Z'),
        activityNameSnapshot: 'Снимал замеры для дерева и инт',
        customerId: '3', serviceId: '9'
    };
    const withoutNotes = Client.buildEntryPayload(base, { billable: true });
    assert.equal(withoutNotes.text, null);
    assert.equal(JSON.stringify(withoutNotes).includes('Снимал'), false);

    const withNotes = Client.buildEntryPayload({ ...base, notes: '  Measured the tree  ', project: 'Alpha', service: 'Beta' }, { billable: true });
    assert.equal(withNotes.text, 'Measured the tree');
    const serialized = JSON.stringify(withNotes);
    assert.equal(serialized.includes('Снимал'), false);
    assert.equal(serialized.includes('Alpha'), false);
    assert.equal(serialized.includes('Beta'), false);
    assert.equal(withNotes.customers_id, 3);
    assert.equal(withNotes.services_id, 9);
    assert.equal(withNotes.time_since, '2026-10-05T12:40:00Z');
    assert.equal(withNotes.time_until, '2026-10-05T12:40:00Z');
});
