import webpush from "web-push";

const notificationCopy = {
    en: { testTitle: "TimerHub notification test", testBody: "This is a background push test.", reminder: "Timer reminder" },
    de: { testTitle: "TimerHub-Benachrichtigungstest", testBody: "Dies ist ein Push-Test im Hintergrund.", reminder: "Timer-Erinnerung" },
    ru: { testTitle: "Проверка уведомлений TimerHub", testBody: "Это тестовое Push-уведомление.", reminder: "Напоминание таймера" }
};

function validLocale(locale, fallback = "en") {
    if (Object.prototype.hasOwnProperty.call(notificationCopy, locale)) return locale;
    return Object.prototype.hasOwnProperty.call(notificationCopy, fallback) ? fallback : "en";
}

function validText(value, fallback, maxLength) {
    return typeof value === "string" && value.trim()
        ? value.trim().slice(0, maxLength)
        : fallback;
}

function bytesToBase64(bytes) {
    let binary = "";
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return btoa(binary);
}

function base64ToBytes(value) {
    return Uint8Array.from(atob(value), character => character.charCodeAt(0));
}

function jsonError(error, status) {
    return Response.json({ error }, { status });
}

export class TimerHubDurableObject {
    constructor(state, env) {
        this.state = state;
        this.env = env;
    }

    async fetch(request) {
        const url = new URL(request.url);

        if (url.pathname.startsWith("/clockodo/")) {
            return this.handleClockodo(request, url);
        }

        if (request.method === "POST" && url.pathname === "/subscribe") {
            const subscription = await request.json();

            if (
                !subscription ||
                typeof subscription.endpoint !== "string" ||
                !subscription.endpoint.startsWith("https://") ||
                !subscription.keys ||
                typeof subscription.keys.p256dh !== "string" ||
                typeof subscription.keys.auth !== "string" ||
                subscription.keys.p256dh.length > 256 ||
                subscription.keys.auth.length > 256
            ) {
                return Response.json(
                    { error: "Invalid push subscription" },
                    { status: 400 }
                );
            }

            await this.state.storage.put("subscription", subscription);
            await this.state.storage.put("locale", validLocale(url.searchParams.get("locale")));
            await this.state.storage.delete("lastDelivery");

            return Response.json({ ok: true });
        }

        if (request.method === "POST" && url.pathname === "/test") {
            const subscription =
                await this.state.storage.get("subscription");

            if (!subscription) {
                return Response.json(
                    { error: "No push subscription stored" },
                    { status: 404 }
                );
            }

            try {
                const payload = await request.json().catch(() => ({}));
                const storedLocale = validLocale(await this.state.storage.get("locale"));
                const locale = validLocale(payload?.locale, storedLocale);
                const copy = notificationCopy[locale];
                webpush.setVapidDetails(
                    this.env.VAPID_SUBJECT,
                    this.env.VAPID_PUBLIC_KEY,
                    this.env.VAPID_PRIVATE_KEY
                );

                await webpush.sendNotification(
                    subscription,
                    JSON.stringify({
                        title: validText(payload?.title, copy.testTitle, 100),
                        body: validText(payload?.body, copy.testBody, 300),
                        locale,
                        tag: validText(payload?.tag, "timerhub-push-test", 100)
                    })
                );

                return Response.json({ ok: true });
            } catch (error) {
                const statusCode =
                    error instanceof webpush.WebPushError
                        ? error.statusCode
                        : 0;

                if (statusCode === 404 || statusCode === 410) {
                    await this.state.storage.delete("subscription");
                }

                return Response.json(
                    {
                        error: "Push delivery failed",
                        statusCode
                    },
                    { status: 502 }
                );
            }
        }

        if (url.pathname === "/status") {
            const alarm = await this.state.storage.get("alarm");
            return Response.json({
                subscriptionStored: Boolean(await this.state.storage.get("subscription")),
                alarmScheduled: Boolean(alarm),
                nextNotificationAt: alarm?.timestamp || null,
                lastDelivery: await this.state.storage.get("lastDelivery") || null
            });
        }


        if (request.method === "POST" && url.pathname === "/schedule") {
            const data = await request.json();
            if (!data || typeof data.alarmId !== "string" || !data.alarmId ||
                !Number.isFinite(data.timestamp) || data.timestamp <= Date.now() ||
                (data.intervalMs !== undefined &&
                    (!Number.isFinite(data.intervalMs) || data.intervalMs < 60000 || data.intervalMs > 86400000))) {
                return Response.json({ error: "Invalid alarm schedule" }, { status: 400 });
            }
            if (!await this.state.storage.get("subscription")) {
                return Response.json(
                    { error: "Register a push subscription before scheduling reminders" },
                    { status: 409 }
                );
            }
            await this.state.storage.put("alarm", data);
            await this.state.storage.setAlarm(data.timestamp);
            return Response.json({ ok: true });
        }

        if (request.method === "POST" && url.pathname === "/cancel") {
            await this.state.storage.deleteAlarm();
            await this.state.storage.delete("alarm");
            return Response.json({ ok: true });
        }

        return new Response("Not found", { status: 404 });
        }

    async clockodoTokenDigest(token) {
        const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
        return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, "0")).join("");
    }

    async authorizeClockodo(request, allowBootstrap = false) {
        const token = request.headers.get("Authorization")?.replace(/^Bearer\s+/i, "") || "";
        if (!/^[A-Za-z0-9_-]{32,128}$/.test(token)) return null;
        const storedDigest = await this.state.storage.get("clockodoTokenDigest");
        if (!storedDigest && allowBootstrap) {
            await this.state.storage.put("clockodoTokenDigest", await this.clockodoTokenDigest(token));
            return token;
        }
        if (!storedDigest || storedDigest !== await this.clockodoTokenDigest(token)) return null;
        return token;
    }

    async encryptClockodoKey(token, apiKey) {
        const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
        const key = await crypto.subtle.importKey("raw", digest, "AES-GCM", false, ["encrypt"]);
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(apiKey));
        return { keyCipher: bytesToBase64(new Uint8Array(ciphertext)), keyIv: bytesToBase64(iv) };
    }

    async decryptClockodoKey(token, credentials) {
        const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
        const key = await crypto.subtle.importKey("raw", digest, "AES-GCM", false, ["decrypt"]);
        const plaintext = await crypto.subtle.decrypt(
            { name: "AES-GCM", iv: base64ToBytes(credentials.keyIv) },
            key,
            base64ToBytes(credentials.keyCipher)
        );
        return new TextDecoder().decode(plaintext);
    }

    clockodoErrorCode(status) {
        return status === 401 ? "invalid_credentials"
            : status === 429 ? "rate_limited"
            : status >= 500 ? "service_error"
            : "clockodo_rejected";
    }

    clockodoRejectionDetails(status, data) {
        const clean = value => typeof value === "string"
            ? value.replace(/[\u0000-\u001f\u007f]+/g, " ").replace(/\s+/g, " ").trim().slice(0, 300)
            : "";
        const details = { status };
        const errors = data && Array.isArray(data.errors) ? data.errors : [];
        const apiError = errors.find(item => item && typeof item === "object" && !Array.isArray(item)) || null;
        if (apiError) {
            const code = clean(apiError.type);
            const message = clean(apiError.message);
            const alternative = clean(apiError.details);
            const path = clean(apiError.path);
            if (code) details.code = code;
            if (message) details.message = message;
            if (alternative && !message) details.message = alternative;
            if (path) details.path = path;
        }
        const simple = data && data.error && typeof data.error === "object" && !Array.isArray(data.error)
            ? data.error
            : null;
        if (simple) {
            const code = Number(simple.code);
            const message = clean(simple.message);
            const fields = Array.isArray(simple.fields)
                ? simple.fields.map(clean).filter(Boolean).slice(0, 5)
                : [];
            if (!details.code && Number.isSafeInteger(code) && code > 0) details.code = String(code);
            if (!details.message && message) details.message = message;
            if (fields.length) details.fields = fields;
        }
        return details.code || details.message || details.path || details.fields ? details : null;
    }

    async clockodoListResponse(token, credentials, resource, responseKey) {
        const items = [];
        try {
            for (let page = 1; page <= 5; page += 1) {
                const response = await this.clockodoFetch(
                    null,
                    token,
                    credentials,
                    `${resource}?items_per_page=1000&page=${page}`
                );
                if (!response.ok) {
                    return jsonError(this.clockodoErrorCode(response.status), response.status);
                }
                const data = await response.json().catch(() => null);
                if (!data || typeof data !== "object" || Array.isArray(data) ||
                    !Array.isArray(data.data)) {
                    return jsonError("malformed_response", 502);
                }
                for (const item of data.data) {
                    if (!item || typeof item !== "object" ||
                        !Number.isSafeInteger(item.id) || item.id < 1 ||
                        typeof item.name !== "string" || !item.name.trim()) {
                        return jsonError("malformed_response", 502);
                    }
                    const entry = {
                        id: item.id,
                        name: item.name.trim().slice(0, 100),
                        active: item.active === true
                    };
                    if (responseKey === "customers" && Array.isArray(item.service_assignments)) {
                        entry.serviceAssignments = item.service_assignments
                            .filter(value => Number.isSafeInteger(value) && value > 0)
                            .slice(0, 500);
                    }
                    items.push(entry);
                }
                const countPages = data.paging && Number.isSafeInteger(data.paging.count_pages)
                    ? data.paging.count_pages
                    : 1;
                if (page >= countPages) break;
            }
        } catch (error) {
            return jsonError(error?.name === "AbortError" ? "timeout" : "network_error", 502);
        }
        items.sort((a, b) => {
            const left = a.name.toLowerCase();
            const right = b.name.toLowerCase();
            return left < right ? -1 : left > right ? 1 : a.id - b.id;
        });
        return Response.json({ [responseKey]: items });
    }

    async clockodoFetch(request, token, credentials, path, body, method = body === undefined ? "GET" : "POST") {
        const apiKey = await this.decryptClockodoKey(token, credentials);
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 12000);
        try {
            return await fetch(`https://my.clockodo.com/api/${path}`, {
                method,
                headers: {
                    "X-ClockodoApiUser": credentials.apiUser,
                    "X-ClockodoApiKey": apiKey,
                    "X-Clockodo-External-Application": `TimerHub;${credentials.apiUser}`,
                    "Accept": "application/json",
                    ...(body === undefined ? {} : { "Content-Type": "application/json" })
                },
                body: body === undefined ? undefined : JSON.stringify(body),
                signal: controller.signal
            });
        } finally {
            clearTimeout(timeout);
        }
    }

    async handleClockodo(request, url) {
        const path = url.pathname;
        if (path === "/clockodo/config" && request.method === "GET" &&
            !await this.state.storage.get("clockodoTokenDigest")) {
            return Response.json({ configured: false, apiUser: "" });
        }
        if (path === "/clockodo/config" && request.method === "PUT") {
            const credentials = await request.json().catch(() => null);
            if (!credentials || typeof credentials.apiUser !== "string" ||
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.apiUser) ||
                typeof credentials.apiKey !== "string" || !credentials.apiKey.trim() || credentials.apiKey.length > 512) {
                return jsonError("invalid_configuration", 400);
            }
            const token = await this.authorizeClockodo(request, true);
            if (!token) return jsonError("unauthorized", 401);
            const encrypted = await this.encryptClockodoKey(token, credentials.apiKey.trim());
            await this.state.storage.put("clockodoCredentials", {
                apiUser: credentials.apiUser.trim(),
                ...encrypted
            });
            return Response.json({ configured: true });
        }

        const token = await this.authorizeClockodo(request);
        if (!token) return jsonError("unauthorized", 401);
        const credentials = await this.state.storage.get("clockodoCredentials");

        if (path === "/clockodo/config" && request.method === "GET") {
            return Response.json({ configured: Boolean(credentials), apiUser: credentials?.apiUser || "" });
        }
        if (path === "/clockodo/config" && request.method === "DELETE") {
            await this.state.storage.delete("clockodoCredentials");
            await this.state.storage.delete("clockodoTokenDigest");
            for (const item of await this.state.storage.list({ prefix: "clockodo-operation:" })) {
                await this.state.storage.delete(item[0]);
            }
            return Response.json({ configured: false });
        }
        if (!credentials) return jsonError("configuration_missing", 409);

        if (path === "/clockodo/customers" && request.method === "GET") {
            return this.clockodoListResponse(token, credentials, "v3/customers", "customers");
        }

        if (path === "/clockodo/services" && request.method === "GET") {
            return this.clockodoListResponse(token, credentials, "v4/services", "services");
        }

        if (path === "/clockodo/test" && request.method === "POST") {
            try {
                const response = await this.clockodoFetch(request, token, credentials, "v4/users/me");
                if (!response.ok) {
                    const error = this.clockodoErrorCode(response.status);
                    return jsonError(error, response.status);
                }
                const data = await response.json().catch(() => null);
                if (!data || typeof data !== "object" || Array.isArray(data) ||
                    !data.data || typeof data.data !== "object" || Array.isArray(data.data) ||
                    !Number.isSafeInteger(data.data.id) || data.data.id < 1) {
                    return jsonError("malformed_response", 502);
                }
                return Response.json({ connected: true });
            } catch (error) {
                return jsonError(error?.name === "AbortError" ? "timeout" : "network_error", 502);
            }
        }

        if (path === "/clockodo/entries" && request.method === "POST") {
            const body = await request.json().catch(() => null);
            const operationId = request.headers.get("Idempotency-Key") || "";
            if (!body || typeof body !== "object" || Array.isArray(body) ||
                !/^\d{4}-\d\d-\d\dT/.test(body.time_since || "") ||
                !/^\d{4}-\d\d-\d\dT/.test(body.time_until || "") ||
                !Number.isInteger(body.customers_id) || body.customers_id < 0 ||
                !Number.isInteger(body.services_id) || body.services_id < 0 ||
                ![0, 1].includes(body.billable) ||
                (body.projects_id !== undefined && body.projects_id !== null && (!Number.isInteger(body.projects_id) || body.projects_id < 0)) ||
                (body.text !== undefined && body.text !== null && (typeof body.text !== "string" || body.text.length > 1000))) {
                return jsonError("invalid_entry", 400);
            }
            if (!/^[A-Za-z0-9:_-]{8,200}$/.test(operationId)) return jsonError("missing_idempotency_key", 400);
            const storageKey = `clockodo-operation:${operationId}`;
            const previous = await this.state.storage.get(storageKey);
            if (previous?.state === "succeeded") return Response.json({ ...previous.result, duplicate: true });
            if (previous?.state === "unknown" || previous?.state === "sending") return jsonError("operation_outcome_unknown", 409);
            await this.state.storage.put(storageKey, { state: "sending", at: Date.now() });
            try {
                const response = await this.clockodoFetch(request, token, credentials, "v2/entries", body, "POST");
                const rawBody = await response.text().catch(() => "");
                let data = null;
                try {
                    data = rawBody ? JSON.parse(rawBody) : null;
                } catch {
                    data = null;
                }
                if (!response.ok) {
                    const uncertain = response.status >= 500;
                    const rejection = this.clockodoRejectionDetails(response.status, data);
                    await this.state.storage.put(storageKey, { state: uncertain ? "unknown" : "failed", status: response.status, at: Date.now() });
                    const error = response.status === 401 ? "invalid_credentials"
                        : response.status === 429 ? "rate_limited"
                        : uncertain ? "clockodo_outcome_unknown"
                        : "clockodo_rejected";
                    return Response.json({ error, ...(rejection ? { clockodo: rejection } : {}) }, { status: response.status });
                }
                if (!data?.entry || !Number.isInteger(Number(data.entry.id)) || Number(data.entry.id) <= 0) {
                    await this.state.storage.put(storageKey, { state: "unknown", at: Date.now() });
                    return jsonError("malformed_response", 502);
                }
                const result = { created: true, entryId: Number(data.entry.id) };
                await this.state.storage.put(storageKey, { state: "succeeded", result, at: Date.now() });
                return Response.json(result);
            } catch (error) {
                await this.state.storage.put(storageKey, { state: "unknown", at: Date.now() });
                return jsonError(error?.name === "AbortError" ? "timeout_outcome_unknown" : "network_outcome_unknown", 502);
            }
        }

        return jsonError("not_found", 404);
    }

    async alarm() {
        const alarm = await this.state.storage.get("alarm");
        if (!alarm) return;

        const subscription = await this.state.storage.get("subscription");
        if (!subscription) {
            await this.state.storage.delete("alarm");
            return;
        }

        try {
            const storedLocale = validLocale(await this.state.storage.get("locale"));
            const locale = validLocale(alarm.locale, storedLocale);
            webpush.setVapidDetails(
                this.env.VAPID_SUBJECT,
                this.env.VAPID_PUBLIC_KEY,
                this.env.VAPID_PRIVATE_KEY
            );

            await webpush.sendNotification(
                subscription,
                JSON.stringify({
                    title: validText(alarm.title, "TimerHub", 100),
                    body: validText(alarm.body, notificationCopy[locale].reminder, 300),
                    locale,
                    tag: alarm.tag || "timerhub-timer"
                })
            );
            await this.state.storage.put("lastDelivery", {
                ok: true,
                at: Date.now()
            });
        } catch (error) {
            const statusCode =
                error instanceof webpush.WebPushError
                    ? error.statusCode
                    : 0;

            await this.state.storage.put("lastDelivery", {
                ok: false,
                at: Date.now(),
                statusCode,
                error: String(error?.message || error).slice(0, 500)
            });

            if (statusCode === 404 || statusCode === 410) {
                await this.state.storage.delete("subscription");
                await this.state.storage.delete("alarm");
                return;
            }

            console.error(
                "TimerHub alarm push delivery failed:",
                error
            );
        }

        const currentAlarm = await this.state.storage.get("alarm");
        if (!currentAlarm || currentAlarm.alarmId !== alarm.alarmId ||
            currentAlarm.timestamp !== alarm.timestamp) return;

        if (Number.isFinite(alarm.intervalMs) && alarm.intervalMs > 0) {
            const nextTimestamp = Date.now() + alarm.intervalMs;
            await this.state.storage.put("alarm", {
                ...alarm,
                timestamp: nextTimestamp
            });
            await this.state.storage.setAlarm(nextTimestamp);
        } else {
            await this.state.storage.delete("alarm");
        }
    }


}
export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        if (url.pathname === "/api/test") {
            return new Response("TimerHub Web Push Worker OK");
        }

        if (url.pathname === "/api/push/config") {
            if (!env.VAPID_PUBLIC_KEY || !env.VAPID_SUBJECT || !env.VAPID_PRIVATE_KEY) {
                return Response.json(
                    { error: "VAPID configuration is incomplete" },
                    { status: 503 }
                );
            }

            return Response.json({
                publicKey: env.VAPID_PUBLIC_KEY,
                subject: env.VAPID_SUBJECT
            });
        }

        const clockodoRoutes = new Map([
            ["/api/clockodo/config", { path: "/clockodo/config", methods: ["GET", "PUT", "DELETE"] }],
            ["/api/clockodo/test", { path: "/clockodo/test", methods: ["POST"] }],
            ["/api/clockodo/entries", { path: "/clockodo/entries", methods: ["POST"] }],
            ["/api/clockodo/customers", { path: "/clockodo/customers", methods: ["GET"] }],
            ["/api/clockodo/services", { path: "/clockodo/services", methods: ["GET"] }]
        ]);
        const clockodoEntryMutation = /^\/api\/clockodo\/entries\/\d+$/.test(url.pathname);
        if (clockodoEntryMutation) return jsonError("method_not_allowed", 405);
        if (clockodoRoutes.has(url.pathname)) {
            const route = clockodoRoutes.get(url.pathname);
            if (!route.methods.includes(request.method)) {
                return jsonError("method_not_allowed", 405);
            }
            const clientId = url.searchParams.get("clientId");
            if (!clientId || !/^[a-zA-Z0-9_-]{16,128}$/.test(clientId)) {
                return jsonError("invalid_client_id", 400);
            }
            const id = env.TIMER_HUB.idFromName(clientId);
            const stub = env.TIMER_HUB.get(id);
            const targetUrl = new URL(request.url);
            targetUrl.pathname = route.path;
            return stub.fetch(new Request(targetUrl, request));
        }

        if (
            url.pathname === "/api/push/subscribe" ||
            url.pathname === "/api/push/test" ||
            url.pathname === "/api/push/status" ||
            url.pathname === "/api/push/schedule" ||
            url.pathname === "/api/push/cancel"
        ) {
            const clientId = url.searchParams.get("clientId");

            if (!clientId || !/^[a-zA-Z0-9_-]{16,128}$/.test(clientId)) {
                return Response.json(
                    { error: "Invalid clientId" },
                    { status: 400 }
                );
            }

            const id = env.TIMER_HUB.idFromName(clientId);
            const stub = env.TIMER_HUB.get(id);

            const targetPath =
                url.pathname === "/api/push/subscribe"
                    ? "/subscribe"
                    : url.pathname === "/api/push/test"
                      ? "/test"
                      : url.pathname === "/api/push/status"
                        ? "/status"
                        : url.pathname === "/api/push/schedule"
                          ? "/schedule"
                          : "/cancel";

            const targetUrl = new URL(request.url);
            targetUrl.pathname = targetPath;

            return stub.fetch(
                new Request(targetUrl, request)
            );
        }

        return env.ASSETS.fetch(request);
    }
};
