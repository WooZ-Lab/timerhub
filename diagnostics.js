(function attachTimerHubDiagnostics(root) {
    'use strict';

    const STORAGE_KEY = 'timerhubDiagnosticsV1';
    const DEFAULT_MAX_MEMORY = 200;
    const DEFAULT_MAX_PERSISTED = 100;
    const SENSITIVE_KEY = /api.?key|(?:access|refresh|id|auth)?token|secret|password|credential|authorization|cookie|clockodoPayload|clockodoApi/i;
    const MAX_STRING = 300;
    const MAX_DEPTH = 3;

    const LEVELS = new Set(['debug', 'info', 'warn', 'error']);
    const STATUSES = new Set(['succeeded', 'failed', 'rolled_back', 'unknown']);

    function sanitizeString(value) {
        return String(value ?? '')
            .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, ' ')
            .replace(/\s+/g, ' ')
            .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, '[redacted-email]')
            .replace(/\b(api[_-]?key|token|secret|password)\s*[:=]\s*\S+/gi, '$1=[redacted]')
            .replace(/\b[A-Za-z0-9_-]{40,}\b/g, '[redacted]')
            .trim()
            .slice(0, MAX_STRING);
    }

    function sanitize(value, depth = 0) {
        if (depth > MAX_DEPTH) return '[truncated]';
        if (value === null || value === undefined) return value;
        if (typeof value === 'string') return sanitizeString(value);
        if (typeof value === 'number' || typeof value === 'boolean') return value;
        if (value instanceof Error) {
            return {
                name: sanitizeString(value.name || 'Error'),
                code: sanitizeString(value.code || ''),
                message: sanitizeString(value.message || '')
            };
        }
        if (Array.isArray(value)) {
            return value.slice(0, 10).map(item => sanitize(item, depth + 1));
        }
        if (typeof value === 'object') {
            const result = {};
            let count = 0;
            for (const [key, nested] of Object.entries(value)) {
                if (count >= 20) break;
                if (SENSITIVE_KEY.test(key)) {
                    result[key] = '[redacted]';
                } else {
                    result[sanitizeString(key)] = sanitize(nested, depth + 1);
                }
                count += 1;
            }
            return result;
        }
        return sanitizeString(value);
    }

    class TimerHubDiagnostics {
        constructor({
            storage = null,
            maxMemory = DEFAULT_MAX_MEMORY,
            maxPersisted = DEFAULT_MAX_PERSISTED,
            now = () => Date.now(),
            consoleRef = typeof console !== 'undefined' ? console : null
        } = {}) {
            this.storage = storage;
            this.maxMemory = Math.max(20, Number(maxMemory) || DEFAULT_MAX_MEMORY);
            this.maxPersisted = Math.max(10, Math.min(this.maxMemory, Number(maxPersisted) || DEFAULT_MAX_PERSISTED));
            this.now = now;
            this.consoleRef = consoleRef;
            this.entries = [];
            this.globalHandlersInstalled = false;
            this.sequence = 0;
            this.loadPersisted();
        }

        loadPersisted() {
            try {
                if (!this.storage) return;
                const raw = this.storage.getItem(STORAGE_KEY);
                if (!raw) return;
                const parsed = JSON.parse(raw);
                if (!Array.isArray(parsed)) return;
                this.entries = parsed
                    .filter(entry => entry && typeof entry === 'object' && LEVELS.has(entry.level))
                    .slice(-this.maxPersisted);
                if (this.entries.length) {
                    this.sequence = Math.max(0, ...this.entries.map(entry => Number(entry.sequence) || 0));
                }
            } catch {
                this.entries = [];
            }
        }

        persist() {
            try {
                if (!this.storage) return;
                const persisted = this.entries.filter(entry => entry.level === 'warn' || entry.level === 'error')
                    .slice(-this.maxPersisted);
                this.storage.setItem(STORAGE_KEY, JSON.stringify(persisted));
            } catch {
                // Diagnostics must never fail the operation they observe.
            }
        }

        record(level, category, operation, messageOrError, options = {}) {
            try {
                const normalizedLevel = LEVELS.has(level) ? level : 'error';
                const entry = {
                    id: `diag_${this.now().toString(36)}_${(++this.sequence).toString(36)}`,
                    timestamp: this.now(),
                    level: normalizedLevel,
                    category: sanitizeString(category || 'app'),
                    operation: sanitizeString(operation || 'unknown'),
                    status: STATUSES.has(options.status) ? options.status : 'unknown',
                    message: '',
                    details: null
                };
                if (messageOrError instanceof Error) {
                    entry.message = sanitizeString(messageOrError.code || messageOrError.message || messageOrError.name || 'error');
                    entry.details = sanitize(messageOrError);
                } else if (messageOrError && typeof messageOrError === 'object') {
                    entry.message = sanitizeString(messageOrError.code || messageOrError.message || 'error');
                    entry.details = sanitize(messageOrError);
                } else {
                    entry.message = sanitizeString(messageOrError || '');
                }
                if (options.details !== undefined) {
                    entry.details = sanitize(options.details);
                }
                this.entries.push(entry);
                if (this.entries.length > this.maxMemory) {
                    this.entries.splice(0, this.entries.length - this.maxMemory);
                }
                this.persist();
                if (normalizedLevel === 'error' || normalizedLevel === 'warn') {
                    try {
                        const method = normalizedLevel === 'error' ? 'error' : 'warn';
                        this.consoleRef?.[method]?.(
                            `TimerHub ${entry.category}/${entry.operation} ${entry.status}: ${entry.message}`
                        );
                    } catch {
                        // Console access can be restricted.
                    }
                }
                return entry;
            } catch {
                return null;
            }
        }

        error(category, operation, error, options = {}) {
            return this.record('error', category, operation, error, { status: 'failed', ...options });
        }

        warn(category, operation, message, options = {}) {
            return this.record('warn', category, operation, message, options);
        }

        info(category, operation, message, options = {}) {
            return this.record('info', category, operation, message, options);
        }

        list({ level = null, limit = 50 } = {}) {
            const filtered = level
                ? this.entries.filter(entry => entry.level === level)
                : this.entries;
            return filtered.slice(-Math.max(1, Math.min(this.maxMemory, Number(limit) || 50))).reverse();
        }

        clear() {
            this.entries = [];
            try {
                this.storage?.removeItem?.(STORAGE_KEY);
            } catch {
                // ignore
            }
        }

        exportPayload() {
            return {
                format: 'timerhub-diagnostics',
                version: 1,
                exportedAt: this.now(),
                entries: this.list({ limit: this.maxMemory })
            };
        }

        installGlobalHandlers(target = root) {
            if (this.globalHandlersInstalled || !target?.addEventListener) return false;
            this.globalHandlersInstalled = true;
            try {
                target.addEventListener('error', event => {
                    this.error('runtime', 'window.error', {
                        name: event?.error?.name || 'Error',
                        message: event?.message || 'Unhandled runtime error'
                    });
                });
                target.addEventListener('unhandledrejection', event => {
                    const reason = event?.reason;
                    this.error('runtime', 'unhandledrejection', {
                        name: reason?.name || 'Error',
                        code: reason?.code || '',
                        message: reason?.message || 'Unhandled promise rejection'
                    });
                });
            } catch {
                this.globalHandlersInstalled = false;
            }
            return true;
        }
    }

    TimerHubDiagnostics.STORAGE_KEY = STORAGE_KEY;
    TimerHubDiagnostics.sanitize = sanitize;
    root.TimerHubDiagnostics = TimerHubDiagnostics;
})(globalThis);
