export class TimerHubDurableObject {
    constructor(state, env) {
        this.state = state;
        this.env = env;
    }

    async fetch() {
        return new Response("TimerHub Durable Object OK");
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
            return Response.json({
                publicKeyPresent: Boolean(env.VAPID_PUBLIC_KEY),
                privateKeyPresent: Boolean(env.VAPID_PRIVATE_KEY),
                subjectPresent: Boolean(env.VAPID_SUBJECT)
            });
        }

        return env.ASSETS.fetch(request);
    }
};
