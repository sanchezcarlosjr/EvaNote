import {expect, test} from 'vitest'
import {Mutex} from "../src/utility/mutex";

test('mutex should generate right pattern', async () => {
    const pattern: string[] = [];
    const mutex = new Mutex();
    mutex.execute(() =>
        new Promise(r => {
            setTimeout(_ => {
                pattern.push("A");
                r(null);
            }, 500);
        })
    ).then(_ => null);
    mutex.execute(() =>
        new Promise(r => {
            pattern.push("B");
            r(null);
        })
    ).then(_ => null);
    await mutex.execute(() =>
        new Promise((r) => {
                pattern.push("C");
                expect(pattern).toStrictEqual(['A', 'B', "C"]);
                r(null);
        })
    )
});