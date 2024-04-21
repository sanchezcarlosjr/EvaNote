import {test} from "vitest";
import remoteProcedureCaller, {Buffer} from "../src/events/remoteProcedureCaller";


test('enqueue event such that the dispatch of the event happens first', async () => {
    const buffer = new Buffer();
    buffer.next(new CustomEvent('1', {
        detail: 'A'
    }));
    buffer.subscribe( (event) => {
        expect(event.detail).toBe('A');
    });
});

test('enqueue event such that the insertion of event listener happens first', async () => {
    const buffer = new Buffer();
    buffer.subscribe((event) => {
        expect(event.detail).toBe('A');
    });
    buffer.next(new CustomEvent('1', {
        detail: 'A'
    }));
});

test('call remote procedure', async () => {
    const expectedResponse = "RESPONSE";
    document.addEventListener("f", (x: CustomEvent|any) => {
        document.dispatchEvent(new CustomEvent(x.detail.id, {
            detail: expectedResponse
        }))
    });
    const {detail} = await remoteProcedureCaller.f("1");
    expect(detail).toBe(expectedResponse);
});