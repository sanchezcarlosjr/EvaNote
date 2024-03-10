import {expect, test} from 'vitest'
import "fake-indexeddb/auto";

// @ts-ignore
import fs, {configure, initialize} from 'browserfs';


test('x', async () => {
    const listing = {
        'README.md': null,
        test: {
            fixtures: {
                static: {
                    '49chars.txt': null,
                },
            },
        },
        src: {
            'README.md': null,
            backend: { 'AsyncMirror.ts': null, 'XmlHttpRequest.ts': null, 'ZipFS.ts': null },
            'main.ts': null,
        },
    };
    await configure({
        '/x': {fs: 'HTTPRequest', options: {
                index: 'http://127.0.0.1:8081/index.json',
                baseUrl: 'http://127.0.0.1:8081/',
            }},
    });
    await fs.isReady;
});