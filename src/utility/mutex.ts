import {Actor, createActor, createMachine} from "xstate";

export class Mutex {
    private readonly actor: Actor<any>;

    constructor() {
        this.actor = createActor(createMachine(
            {
                id: "Mutex",
                initial: "Available",
                states: {
                    Available: {
                        on: {
                            acquire: {
                                target: "Unavailable",
                            },
                        },
                    },
                    Unavailable: {
                        on: {
                            release: {
                                target: "Available",
                            },
                        },
                    },
                },
                types: {events: {} as { type: "acquire" } | { type: "release" }},
            },
            {
                actions: {},
                actors: {},
                guards: {},
                delays: {},
            },
        ));
        this.actor.start();
    }

    release() {
        this.actor.send({type: 'release'});
    }

    acquire() {
        return new Promise((r) => {
            if (this.actor.getSnapshot().value === "Available") {
                this.actor.send({type: 'acquire'});
                return r(null);
            }
            const subscription = this.actor.subscribe(state => {
                if (state.value === "Available") {
                    subscription.unsubscribe();
                    r(null);
                }
            });
        });
    }

    async execute(functor: () => Promise<any>) {
        await this.acquire();
        await functor();
        this.release();
    }
}