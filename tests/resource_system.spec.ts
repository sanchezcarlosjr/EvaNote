import { expect, test } from 'vitest'
import { configure, BFSRequire } from 'browserfs';
test('it should execute playbook ', async () => {
    await configure({ fs: 'LocalStorage' });
    const fs = BFSRequire('fs');
    fs.writeFile('/test.txt', 'Cool, I can do this in the browser!', function(err) {
        fs.readFile('/test.txt', function(err: any, contents: { toString: () => any; }) {
            console.log(contents.toString());
        });
    });
});