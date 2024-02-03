// @ts-ignore
import jq from './jq';

function replaceValue(matcher: RegExpMatchArray, json: any, defaultValue: string = "") {
    for (const [_, expression] of matcher) {
        for (const result of  jq.compile(expression)(json)) {
            if (result)
                return result;
        }
    }
    return defaultValue;
}

export function render(template: string, json: any) {
    return JSON.parse(template, (_key: string, value) => {
        let matches: any = null;
        return typeof value === "string" ? (
            (matches = value.matchAll( /\{\{(?<expression>.+)}}/g)) ? replaceValue(matches, json, value) : value
        ) : value;
    });
}
