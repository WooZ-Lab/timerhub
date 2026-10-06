(function attachTimerHubExchange(root) {
    const FORMAT = 'timerhub-exchange';
    const VERSION = 1;
    const ALGORITHM = 'AES-256-GCM';
    const WEB_CRYPTO_ALGORITHM = 'AES-GCM';
    const QR_PREFIX = 'timerhub-exchange';
    const SECRET_BYTES = 32;
    const IV_BYTES = 12;
    const MAX_ENTRIES = 500;
    const MAX_TEXT = 500;
    const MAX_NOTES = 2000;
    const MAX_CLOCKODO_ID = 100000000000000;

    class ExchangeError extends Error {
        constructor(code) {
            super(code);
            this.name = 'ExchangeError';
            this.code = code;
        }
    }

    const fail = code => {
        throw new ExchangeError(code);
    };

    const isRecord = value => value !== null && typeof value === 'object' && !Array.isArray(value);

    const sanitizeText = (value, max) => typeof value === 'string'
        ? value.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, ' ').slice(0, max)
        : '';

    const normalizeClockodoIdValue = value => {
        if (value === null || value === undefined || value === '') return null;
        const text = String(value).trim();
        if (!/^\d{1,15}$/.test(text)) return null;
        const numeric = Number(text);
        return Number.isSafeInteger(numeric) && numeric >= 0 && numeric <= MAX_CLOCKODO_ID ? text : null;
    };

    const normalizeEntryForExchange = entry => {
        if (!isRecord(entry)) return null;
        const startTimestamp = Number(entry.startTimestamp);
        const endTimestamp = Number(entry.endTimestamp);
        if (!Number.isFinite(startTimestamp) || !Number.isFinite(endTimestamp) || startTimestamp <= 0) return null;
        if (endTimestamp <= startTimestamp) return null;
        if (endTimestamp - startTimestamp > 24 * 60 * 60 * 1000) return null;
        const activityName = sanitizeText(entry.activityNameSnapshot, MAX_TEXT).trim();
        if (!activityName) return null;
        return {
            startTimestamp,
            endTimestamp,
            activityName,
            notes: sanitizeText(entry.notes, MAX_NOTES).trim(),
            customerId: normalizeClockodoIdValue(entry.customerId),
            serviceId: normalizeClockodoIdValue(entry.serviceId),
            customerName: sanitizeText(entry.customerName, MAX_TEXT).trim(),
            serviceName: sanitizeText(entry.serviceName, MAX_TEXT).trim()
        };
    };

    const validatePayload = (payload, { expectedVersion = VERSION } = {}) => {
        if (!isRecord(payload) || payload.format !== FORMAT) fail('invalid_exchange_payload');
        if (Number(payload.version) !== expectedVersion) fail('unsupported_exchange_version');
        if (typeof payload.exportId !== 'string' || !/^[A-Za-z0-9_-]{8,128}$/.test(payload.exportId)) fail('invalid_exchange_payload');
        if (typeof payload.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(payload.date)) fail('invalid_exchange_payload');
        if (!Array.isArray(payload.entries) || payload.entries.length === 0 || payload.entries.length > MAX_ENTRIES) fail('invalid_exchange_payload');
        const exportedAt = Number(payload.exportedAt);
        if (!Number.isFinite(exportedAt) || exportedAt <= 0) fail('invalid_exchange_payload');
        const entries = payload.entries.map(entry => {
            if (!isRecord(entry)) return null;
            const startTimestamp = Number(entry.startTimestamp);
            const endTimestamp = Number(entry.endTimestamp);
            if (!Number.isFinite(startTimestamp) || !Number.isFinite(endTimestamp)) return null;
            if (startTimestamp <= 0 || endTimestamp <= startTimestamp) return null;
            if (endTimestamp - startTimestamp > 24 * 60 * 60 * 1000) return null;
            const activityName = sanitizeText(entry.activityName, MAX_TEXT).trim();
            if (!activityName) return null;
            const customerId = entry.customerId === null || entry.customerId === undefined
                ? null
                : normalizeClockodoIdValue(entry.customerId);
            const serviceId = entry.serviceId === null || entry.serviceId === undefined
                ? null
                : normalizeClockodoIdValue(entry.serviceId);
            if (entry.customerId !== null && entry.customerId !== undefined && customerId === null) return null;
            if (entry.serviceId !== null && entry.serviceId !== undefined && serviceId === null) return null;
            return {
                startTimestamp,
                endTimestamp,
                activityName,
                notes: sanitizeText(entry.notes, MAX_NOTES).trim(),
                customerId,
                serviceId,
                customerName: sanitizeText(entry.customerName, MAX_TEXT).trim(),
                serviceName: sanitizeText(entry.serviceName, MAX_TEXT).trim()
            };
        });
        if (entries.some(entry => entry === null)) fail('invalid_exchange_payload');
        return { ...payload, version: expectedVersion, entries };
    };

    const buildDayPayload = ({ entries, date, exportId, exportedAt = Date.now() } = {}) => {
        if (!Array.isArray(entries)) fail('invalid_exchange_payload');
        const safeEntries = entries.map(normalizeEntryForExchange).filter(Boolean);
        if (!safeEntries.length) fail('invalid_exchange_payload');
        return validatePayload({
            format: FORMAT,
            version: VERSION,
            exportId,
            date,
            exportedAt,
            entries: safeEntries
        });
    };

    const validateEnvelope = envelope => {
        if (!isRecord(envelope) || envelope.format !== FORMAT) fail('invalid_exchange_file');
        if (Number(envelope.version) !== VERSION) fail('unsupported_exchange_version');
        if (envelope.algorithm !== ALGORITHM) fail('invalid_exchange_file');
        if (typeof envelope.iv !== 'string' || typeof envelope.ciphertext !== 'string') fail('invalid_exchange_file');
        const createdAt = Number(envelope.createdAt);
        if (!Number.isFinite(createdAt) || createdAt <= 0) fail('invalid_exchange_file');
        const iv = base64UrlToBytes(envelope.iv);
        if (!iv || iv.length !== IV_BYTES) fail('invalid_exchange_file');
        if (!base64UrlToBytes(envelope.ciphertext)) fail('invalid_exchange_file');
        return { ...envelope, version: VERSION, createdAt };
    };

    function bytesToBase64Url(bytes) {
        let binary = '';
        const chunk = 0x8000;
        for (let index = 0; index < bytes.length; index += chunk) {
            binary += String.fromCharCode.apply(null, bytes.subarray(index, index + chunk));
        }
        return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }

    function base64UrlToBytes(value) {
        if (typeof value !== 'string' || value.length === 0 || !/^[A-Za-z0-9_-]+$/.test(value)) return null;
        const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
        const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
        try {
            const binary = atob(padded);
            const bytes = new Uint8Array(binary.length);
            for (let index = 0; index < binary.length; index++) bytes[index] = binary.charCodeAt(index);
            return bytes;
        } catch (error) {
            return null;
        }
    }

    const defaultCrypto = () => {
        const implementation = root.crypto;
        if (!implementation?.subtle || !implementation?.getRandomValues) fail('secure_crypto_unavailable');
        return implementation;
    };

    const generateSecret = (cryptoImpl) => {
        const implementation = cryptoImpl || defaultCrypto();
        const bytes = implementation.getRandomValues(new Uint8Array(SECRET_BYTES));
        return bytesToBase64Url(bytes);
    };

    const formatTransferCode = secret => String(secret || '').replace(/(.{4})/g, '$1 ').trim();

    const normalizeTransferCode = input => {
        const compact = String(input || '').replace(/[^A-Za-z0-9_-]/g, '');
        if (compact.length !== 43) fail('invalid_transfer_code');
        const bytes = base64UrlToBytes(compact);
        if (!bytes || bytes.length !== SECRET_BYTES) fail('invalid_transfer_code');
        return bytesToBase64Url(bytes);
    };

    const canonicalAad = createdAt => `timerhub-exchange|${VERSION}|${createdAt}`;

    const encodeJson = value => new TextEncoder().encode(JSON.stringify(value));

    const encryptPayload = async (payload, secret, cryptoImpl) => {
        const implementation = cryptoImpl || defaultCrypto();
        const validated = validatePayload(payload);
        const secretBytes = base64UrlToBytes(normalizeTransferCode(secret));
        if (!secretBytes || secretBytes.length !== SECRET_BYTES) fail('invalid_transfer_code');
        const createdAt = Date.now();
        const iv = implementation.getRandomValues(new Uint8Array(IV_BYTES));
        const key = await implementation.subtle.importKey('raw', secretBytes, WEB_CRYPTO_ALGORITHM, false, ['encrypt']);
        const ciphertext = await implementation.subtle.encrypt(
            { name: WEB_CRYPTO_ALGORITHM, iv, additionalData: new TextEncoder().encode(canonicalAad(createdAt)) },
            key,
            encodeJson(validated)
        );
        return {
            format: FORMAT,
            version: VERSION,
            algorithm: ALGORITHM,
            iv: bytesToBase64Url(iv),
            ciphertext: bytesToBase64Url(new Uint8Array(ciphertext)),
            createdAt
        };
    };

    const decryptPayload = async (envelope, secret, cryptoImpl) => {
        const implementation = cryptoImpl || defaultCrypto();
        const validated = validateEnvelope(envelope);
        const secretBytes = base64UrlToBytes(normalizeTransferCode(secret));
        if (!secretBytes || secretBytes.length !== SECRET_BYTES) fail('invalid_transfer_code');
        const iv = base64UrlToBytes(validated.iv);
        const ciphertext = base64UrlToBytes(validated.ciphertext);
        const key = await implementation.subtle.importKey('raw', secretBytes, WEB_CRYPTO_ALGORITHM, false, ['decrypt']);
        let plaintext;
        try {
            plaintext = await implementation.subtle.decrypt(
                { name: WEB_CRYPTO_ALGORITHM, iv, additionalData: new TextEncoder().encode(canonicalAad(validated.createdAt)) },
                key,
                ciphertext
            );
        } catch (error) {
            fail('exchange_decrypt_failed');
        }
        let parsed;
        try {
            parsed = JSON.parse(new TextDecoder().decode(plaintext));
        } catch (error) {
            fail('invalid_exchange_payload');
        }
        return validatePayload(parsed);
    };

    const buildQrPayload = secret => `${QR_PREFIX}:${VERSION}:${normalizeTransferCode(secret)}`;

    const parseQrPayload = text => {
        const match = /^timerhub-exchange:(\d+):([A-Za-z0-9_-]+)$/.exec(String(text || '').trim());
        if (!match || Number(match[1]) !== VERSION) fail('invalid_qr_payload');
        return normalizeTransferCode(match[2]);
    };

    root.TimerHubExchange = {
        FORMAT,
        VERSION,
        ALGORITHM,
        QR_PREFIX,
        SECRET_BYTES,
        ExchangeError,
        buildDayPayload,
        validatePayload,
        validateEnvelope,
        normalizeEntryForExchange,
        normalizeClockodoIdValue,
        bytesToBase64Url,
        base64UrlToBytes,
        generateSecret,
        formatTransferCode,
        normalizeTransferCode,
        encryptPayload,
        decryptPayload,
        buildQrPayload,
        parseQrPayload
    };
})(globalThis);
