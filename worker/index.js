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
                !subscription.keys ||
                typeof subscription.keys.p256dh !== "string" ||
                typeof subscription.keys.auth !== "string"
            ) {
                return Response.json(
                    { error: "Invalid push subscription" },
                    { status: 400 }
                );
            }

            await this.state.storage.put("subscription", subscription);

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
            return Response.json({
                subscriptionStored:
                    Boolean(
                        await this.state.storage.get("subscription")
                    )
            });
        }

        return new Response("Not found", { status: 404 });
    }
}

export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        if (url.pathname === "/api/test") {
            const id = env.TIMER_HUB.idFromName("test");
            const stub = env.TIMER_HUB.get(id);
            return stub.fetch(request);
        }

        if (url.pathname === "/api/push/config") {
            if (!env.VAPID_PUBLIC_KEY || !env.VAPID_SUBJECT) {
                return Response.json(
                    { error: "VAPID configuration is incomplete" },
                    { status: 500 }
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
            url.pathname === "/api/push/status"
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
                      : "/status";

            const targetUrl = new URL(request.url);
            targetUrl.pathname = targetPath;

            return stub.fetch(
                new Request(targetUrl, request)
            );
        }

        return env.ASSETS.fetch(request);
    }
};
