import {ResourceProps} from "@refinedev/core";
import {capitalize} from "@mui/material";
import path from "bfs-path";
import {TextSnippet} from "@mui/icons-material";
import React from "react";

export interface URI extends ResourceProps {
    pattern: RegExp;
    servicePreferenceOrder: string[];
}

export class URIAssociation {
    private matcher: RegExp;
    constructor(private uris: URI[] = []) {
        this.matcher =
            new RegExp(uris.reduce((acc, value, index) => `(?<I${index}>${value.pattern.source})|${acc}`, ""));
    }
    find(name: string) {
        const result = Object.entries(this.matcher.exec(name)?.groups ?? {}).find(([key, value]) => value);
        if (!result)
            return null;
        const index = Number(result[0].split("I")[1]);
        return this.uris[index];
    }

    map(resource: ResourceProps) {
        const uri = this.find(resource.name);
        let application = uri?.servicePreferenceOrder[0] ?? "text-editor";
        return {
            name: resource.name,
            meta: {
                ...resource.meta,
                label: capitalize(resource.meta?.label ?? ""),
                icon: uri?.meta?.icon ?? <TextSnippet/>
            },
            list: `/${application}?uri=browser:${resource.name}`
        }
    }

}