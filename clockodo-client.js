(function attachClockodoClient(root) {
    class ClockodoClientError extends Error {
        constructor(code, status = 0, details = null) {
            super(code);
            this.name = 'ClockodoClientError';
            this.code = code;
            this.status = status;
            this.details = details;
        }
    }

    class ClockodoClient {
        constructor({ fetchImpl = (...args) => fetch(...args), timeoutMs = 15000 } = {}) {
            this.fetchImpl = fetchImpl;
            this.timeoutMs = timeoutMs;
            this.inFlight = new Map();
        }

        static sanitizeRejectionDetails(raw) {
            if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
            const clean = value => typeof value === 'string'
                ? value.replace(/[\u0000-\u001f\u007f]+/g, ' ').replace(/\s+/g, ' ').trim()
                : '';
            const details = {};
            const status = Number(raw.status);
            if (Number.isSafeInteger(status) && status > 0) details.status = status;
            const code = clean(raw.code).slice(0, 100);
            const message = clean(raw.message).slice(0, 300);
            const path = clean(raw.path).slice(0, 200);
            const fields = Array.isArray(raw.fields)
                ? raw.fields.map(field => clean(field).slice(0, 100)).filter(Boolean).slice(0, 5)
                : [];
            if (code) details.code = code;
            if (message) details.message = message;
            if (path) details.path = path;
            if (fields.length) details.fields = fields;
            return Object.keys(details).length ? details : null;
        }

        async request(path, { clientId, accessToken, method = 'GET', body, idempotencyKey } = {}) {
            if (!/^[a-zA-Z0-9_-]{16,128}$/.test(clientId || '') ||
                typeof accessToken !== 'string' || accessToken.length < 32) {
                throw new ClockodoClientError('invalid_client_configuration');
            }
            const key = idempotencyKey ? `${clientId}:${idempotencyKey}` : null;
            if (key && this.inFlight.has(key)) return this.inFlight.get(key);

            const operation = this.performRequest(path, { clientId, accessToken, method, body, idempotencyKey });
            if (key) this.inFlight.set(key, operation);
            try {
                return await operation;
            } finally {
                if (key && this.inFlight.get(key) === operation) this.inFlight.delete(key);
            }
        }

        async performRequest(path, { clientId, accessToken, method, body, idempotencyKey }) {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), this.timeoutMs);
            const headers = { Authorization: `Bearer ${accessToken}` };
            if (body !== undefined) headers['Content-Type'] = 'application/json';
            if (idempotencyKey) headers['Idempotency-Key'] = idempotencyKey;

            try {
                let response;
                try {
                    response = await this.fetchImpl(`${path}?clientId=${encodeURIComponent(clientId)}`, {
                        method,
                        headers,
                        body: body === undefined ? undefined : JSON.stringify(body),
                        signal: controller.signal
                    });
                } catch (error) {
                    if (error?.name === 'AbortError') throw new ClockodoClientError('timeout');
                    throw new ClockodoClientError('network_error');
                }
                if (!response || !Number.isInteger(response.status)) throw new ClockodoClientError('malformed_response');
                const data = await response.json().catch(() => null);
                if (!response.ok) {
                    const status = response.status;
                    const safeErrorCodes = new Set([
                        'invalid_credentials', 'rate_limited', 'clockodo_rejected', 'service_error', 'timeout', 'network_error',
                        'malformed_response', 'configuration_missing', 'invalid_entry', 'missing_idempotency_key',
                        'operation_outcome_unknown', 'timeout_outcome_unknown', 'network_outcome_unknown',
                        'clockodo_outcome_unknown', 'not_found', 'unauthorized', 'method_not_allowed', 'invalid_client_id'
                    ]);
                    const safeErrorCode = safeErrorCodes.has(data?.error) ? data.error : '';
                    const code = safeErrorCode || (status === 401 ? 'invalid_credentials'
                        : status === 429 ? 'rate_limited'
                        : status >= 500 ? 'service_error'
                        : 'request_rejected');
                    throw new ClockodoClientError(code, status, ClockodoClient.sanitizeRejectionDetails(data?.clockodo));
                }
                if (!data || typeof data !== 'object' || Array.isArray(data)) {
                    throw new ClockodoClientError('malformed_response', response.status);
                }
                return data;
            } finally {
                clearTimeout(timeout);
            }
        }

        getConfig(clientId, accessToken) {
            return this.request('/api/clockodo/config', { clientId, accessToken });
        }

        validateReferenceList(data, key) {
            if (!data || typeof data !== 'object' || Array.isArray(data) || !Array.isArray(data[key])) {
                throw new ClockodoClientError('malformed_response');
            }
            return data[key].map(item => {
                if (!item || typeof item !== 'object' ||
                    !Number.isSafeInteger(item.id) || item.id < 1 ||
                    typeof item.name !== 'string' || !item.name.trim()) {
                    throw new ClockodoClientError('malformed_response');
                }
                return { id: item.id, name: item.name.trim(), active: item.active === true };
            });
        }

        async getCustomers(clientId, accessToken) {
            const data = await this.request('/api/clockodo/customers', { clientId, accessToken });
            return { customers: this.validateReferenceList(data, 'customers') };
        }

        async getServices(clientId, accessToken) {
            const data = await this.request('/api/clockodo/services', { clientId, accessToken });
            return { services: this.validateReferenceList(data, 'services') };
        }

        saveConfig(clientId, accessToken, credentials) {
            return this.request('/api/clockodo/config', { clientId, accessToken, method: 'PUT', body: credentials });
        }

        removeConfig(clientId, accessToken) {
            return this.request('/api/clockodo/config', { clientId, accessToken, method: 'DELETE' });
        }

        testConnection(clientId, accessToken) {
            return this.request('/api/clockodo/test', { clientId, accessToken, method: 'POST', body: {} });
        }

        createEntry(clientId, accessToken, entry, idempotencyKey) {
            return this.request('/api/clockodo/entries', {
                clientId, accessToken, method: 'POST', body: entry, idempotencyKey
            });
        }

        buildEntryPayload(entry, config) {
            return ClockodoClient.buildEntryPayload(entry, config);
        }

        isNormalizedEntryPayload(payload) {
            return ClockodoClient.isNormalizedEntryPayload(payload);
        }

        static formatTimestamp(timestamp) {
            return new Date(timestamp).toISOString().replace(/\.\d{3}Z$/, 'Z');
        }

        static isNormalizedEntryPayload(payload) {
            if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return false;
            const isSecondPrecision = value => typeof value === 'string' && /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ$/.test(value);
            return isSecondPrecision(payload.time_since) && isSecondPrecision(payload.time_until);
        }

        static buildEntryPayload(entry, config) {
            if (!entry || !config || typeof config !== 'object') throw new ClockodoClientError('invalid_time_entry');
            const id = (value, fallback) => {
                const source = /^\d+$/.test(String(value ?? '')) ? value : fallback;
                if (source === null || source === undefined || String(source).trim() === '') return null;
                const parsed = Number(source);
                return Number.isSafeInteger(parsed) && parsed >= 0 ? parsed : null;
            };
            const customerId = id(entry.customerId, id(config.customerId, null));
            const serviceId = id(entry.serviceId, id(entry.service, config.serviceId));
            const projectId = id(entry.project, config.projectId);
            if (!Number.isInteger(customerId) || customerId < 0 || !Number.isInteger(serviceId) || serviceId < 0) {
                throw new ClockodoClientError('missing_clockodo_assignment');
            }
            if (!Number.isFinite(entry.startTimestamp) || !Number.isFinite(entry.endTimestamp) || entry.endTimestamp <= entry.startTimestamp) {
                throw new ClockodoClientError('invalid_time_entry');
            }
            const description = [
                entry.activityNameSnapshot,
                entry.project && !/^\d+$/.test(String(entry.project)) ? entry.project : '',
                entry.service && !/^\d+$/.test(String(entry.service)) ? entry.service : '',
                entry.notes
            ]
                .filter(value => typeof value === 'string' && value.trim())
                .join(' · ')
                .slice(0, 1000);
            return {
                time_since: ClockodoClient.formatTimestamp(entry.startTimestamp),
                time_until: ClockodoClient.formatTimestamp(entry.endTimestamp),
                customers_id: customerId,
                services_id: serviceId,
                ...(projectId === null ? {} : { projects_id: projectId }),
                billable: config.billable === false ? 0 : 1,
                text: description || null
            };
        }
    }

    root.ClockodoClient = ClockodoClient;
    root.ClockodoClientError = ClockodoClientError;
})(globalThis);
