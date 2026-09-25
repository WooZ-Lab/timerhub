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

        return env.ASSETS.fetch(request);
    }
};
