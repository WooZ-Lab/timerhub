import webpush from "web-push";

export class TimerHubDurableObject {
    constructor(state, env) {
        this.state = state;
        this.env = env;
    }

    async fetch(request) {
        const url = new URL(request.url);

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
                webpush.setVapidDetails(
                    this.env.VAPID_SUBJECT,
                    this.env.VAPID_PUBLIC_KEY,
                    this.env.VAPID_PRIVATE_KEY
                );

                await webpush.sendNotification(
                    subscription,
                    JSON.stringify({
                        title: "TimerHub",
                        body: "Background Push funktioniert.",
                        tag: "timerhub-push-test"
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

    async alarm() {
        const alarm = await this.state.storage.get("alarm");
        if (!alarm) return;

        const subscription = await this.state.storage.get("subscription");
        if (!subscription) {
            await this.state.storage.delete("alarm");
            return;
        }

        try {
            webpush.setVapidDetails(
                this.env.VAPID_SUBJECT,
                this.env.VAPID_PUBLIC_KEY,
                this.env.VAPID_PRIVATE_KEY
            );

            await webpush.sendNotification(
                subscription,
                JSON.stringify({
                    title: alarm.title || "TimerHub",
                    body: alarm.body || "Timer is still running.",
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
