
export function makeid(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

export class Buffer {
    constructor(
        private buffer: Event[] = [],
        private callback: EventListener | null = null
    ) {}
    next(event: Event): boolean {
        this.buffer.push(event);
        if (this.callback) {
            this.callback(event);
        }
        return true;
    }
    subscribe(callback: EventListener | null) {
        this.callback = callback;
        if (this.callback && this.buffer.length > 0) {
            this.callback(this.buffer[this.buffer.length-1]);
        }
    }
}

class RemoteProcedureCaller {
    constructor(private timeoutInMilliseconds = 3000) {
    }
    remoteCall(name: string, payload: never) {
        const id = makeid(20);
        const buffer = new Buffer();
        const listener = buffer.next.bind(buffer);
        document.addEventListener(id, listener);
        document.dispatchEvent(new CustomEvent(name, {
            detail: {
                id,
                payload
            }
        }));
        return new Promise((resolve, reject) => {
            buffer.subscribe((event) => {
                resolve(event);
                document.removeEventListener(id, listener);
            });
            setTimeout(() => {
                document.removeEventListener(id, listener);
                reject("The remote procedure has not responded.");
            }, this.timeoutInMilliseconds);
        });
    }
    call(name: string) {
        return async (payload: never) => this.remoteCall(name, payload)
    }
}

const handler = {
    get(obj: RemoteProcedureCaller, property: string) {
        return obj.call(property);
    }
};

export interface RemoteProcedureCalls {
    ai_explain: (prompt: string) => Promise<void>
}

export default new Proxy(new RemoteProcedureCaller(), handler) as unknown as RemoteProcedureCalls;

