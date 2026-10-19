(function attachTimerHubShareLink(root) {
    const API_PATH = '/api/share';
    const ID_BYTES = 16;
    const MIN_EXPIRY_MS = 5 * 60 * 1000;
    const MAX_EXPIRY_MS = 32 * 24 * 60 * 60 * 1000;
    const MAX_CIPHERTEXT_CHARS = 2_000_000;
    const SHARE_ID_PATTERN = /^[A-Za-z0-9_-]{16,64}$/;
    const SECRET_PATTERN = /^[A-Za-z0-9_-]{43}$/;

    // The encryption key never leaves the URL fragment, so it is not sent to
    // the Worker or written to server logs. Only the envelope is uploaded.
    const EXPIRY_OPTIONS = Object.freeze([
        { id: 'hour', minutes: 60 },
        { id: 'day', minutes: 60 * 24 },
        { id: 'week', minutes: 60 * 24 * 7 },
        { id: 'month', minutes: 60 * 24 * 30 }
    ]);

    class ShareLinkError extends Error {
        constructor(code, status = 0) {
            super(code);
            this.name = 'ShareLinkError';
            this.code = code;
            this.status = status;
        }
    }

    const fail = (code, status) => {
        throw new ShareLinkError(code, status);
    };

    const isRecord = value => value !== null && typeof value === 'object' && !Array.isArray(value);

    function bytesToBase64Url(bytes) {
        let binary = '';
        const chunk = 0x8000;
        for (let index = 0; index < bytes.length; index += chunk) {
            binary += String.fromCharCode.apply(null, bytes.subarray(index, index + chunk));
        }
        return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }

    const generateShareId = cryptoImpl => {
        const implementation = cryptoImpl || root.crypto;
        if (!implementation?.getRandomValues) fail('secure_crypto_unavailable');
        return bytesToBase64Url(implementation.getRandomValues(new Uint8Array(ID_BYTES)));
    };

    const normalizeExpiryMs = minutes => {
        const value = Number(minutes);
        if (!Number.isFinite(value) || value <= 0) fail('invalid_expiry');
        const milliseconds = Math.round(value * 60 * 1000);
        if (milliseconds < MIN_EXPIRY_MS || milliseconds > MAX_EXPIRY_MS) fail('invalid_expiry');
        return milliseconds;
    };

    const validateEnvelope = envelope => {
        if (!isRecord(envelope) ||
            envelope.format !== 'timerhub-exchange' ||
            Number(envelope.version) !== 1 ||
            envelope.algorithm !== 'AES-256-GCM') {
            fail('invalid_share_payload');
        }
        if (typeof envelope.iv !== 'string' || !/^[A-Za-z0-9_-]{1,64}$/.test(envelope.iv)) fail('invalid_share_payload');
        if (typeof envelope.ciphertext !== 'string' ||
            !/^[A-Za-z0-9_-]+$/.test(envelope.ciphertext) ||
            envelope.ciphertext.length > MAX_CIPHERTEXT_CHARS) {
            fail('invalid_share_payload');
        }
        if (!Number.isFinite(Number(envelope.createdAt)) || Number(envelope.createdAt) <= 0) fail('invalid_share_payload');
        return envelope;
    };

    const buildShareUrl = ({ origin, pathname = '/', shareId, secret }) => {
        if (typeof origin !== 'string' || !origin) fail('invalid_share_url');
        if (!SHARE_ID_PATTERN.test(String(shareId || '')) || !SECRET_PATTERN.test(String(secret || ''))) fail('invalid_share_url');
        let url;
        try {
            url = new URL(pathname || '/', origin);
        } catch {
            fail('invalid_share_url');
        }
        url.searchParams.set('share', shareId);
        url.hash = `key=${secret}`;
        return url.toString();
    };

    const parseShareUrl = href => {
        let url;
        try {
            url = new URL(String(href || ''));
        } catch {
            return null;
        }
        const shareId = url.searchParams.get('share') || '';
        const match = /(?:^|[#&])key=([A-Za-z0-9_-]+)/.exec(url.hash || '');
        const secret = match ? match[1] : '';
        if (!SHARE_ID_PATTERN.test(shareId) || !SECRET_PATTERN.test(secret)) return null;
        return { shareId, secret };
    };

    async function requestJson(fetchImpl, url, init) {
        if (typeof fetchImpl !== 'function') fail('network_error');
        let response;
        try {
            response = await fetchImpl(url, { ...init, cache: 'no-store' });
        } catch {
            fail('network_error');
        }
        if (!response || !Number.isInteger(response.status)) fail('network_error');
        let body = null;
        try {
            body = await response.json();
        } catch {
            body = null;
        }
        return { response, body };
    }

    const serverError = (response, body, fallback) => {
        const code = typeof body?.error === 'string' ? body.error : '';
        if (['share_not_found', 'share_expired', 'share_exists', 'invalid_share', 'invalid_share_payload',
            'share_storage_failed', 'method_not_allowed'].includes(code)) return code;
        return fallback || (response.status >= 500 ? 'share_unavailable' : 'invalid_share_request');
    };

    const createShare = async (fetchImpl, origin, { shareId, envelope, expiresAt }) => {
        if (!SHARE_ID_PATTERN.test(String(shareId || ''))) fail('invalid_share_id');
        validateEnvelope(envelope);
        if (!Number.isFinite(Number(expiresAt)) || Number(expiresAt) <= Date.now()) fail('invalid_expiry');
        if (Number(expiresAt) - Date.now() > MAX_EXPIRY_MS) fail('invalid_expiry');
        const { response, body } = await requestJson(fetchImpl, `${origin}${API_PATH}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ shareId, envelope, expiresAt: Number(expiresAt) })
        });
        if (!response.ok || body?.ok !== true) fail(serverError(response, body), response.status);
        return { shareId, expiresAt: Number(body.expiresAt) || Number(expiresAt) };
    };

    const fetchShare = async (fetchImpl, origin, shareId) => {
        if (!SHARE_ID_PATTERN.test(String(shareId || ''))) fail('invalid_share_id');
        const { response, body } = await requestJson(fetchImpl, `${origin}${API_PATH}/${encodeURIComponent(shareId)}`);
        if (!response.ok) fail(serverError(response, body), response.status);
        if (!isRecord(body?.envelope)) fail('share_unavailable', response.status);
        return { envelope: body.envelope, expiresAt: Number(body.expiresAt) };
    };

    const completeShare = async (fetchImpl, origin, shareId) => {
        if (!SHARE_ID_PATTERN.test(String(shareId || ''))) fail('invalid_share_id');
        const { response, body } = await requestJson(fetchImpl, `${origin}${API_PATH}/${encodeURIComponent(shareId)}/complete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: '{}'
        });
        if (!response.ok || body?.ok !== true) fail(serverError(response, body), response.status);
        return true;
    };

    root.TimerHubShareLink = {
        API_PATH,
        MIN_EXPIRY_MS,
        MAX_EXPIRY_MS,
        MAX_CIPHERTEXT_CHARS,
        SHARE_ID_PATTERN,
        EXPIRY_OPTIONS,
        ShareLinkError,
        generateShareId,
        normalizeExpiryMs,
        validateEnvelope,
        buildShareUrl,
        parseShareUrl,
        createShare,
        fetchShare,
        completeShare
    };
})(globalThis);
