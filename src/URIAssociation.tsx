import {IResourceItem, ResourceProps} from "@refinedev/core";
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

    map(resource: ResourceProps & {parent: string|undefined, access: '*' | 'can_edit' | 'can_input' | 'can_comment' | 'can_view'}): IResourceItem {
        const uri = this.find(resource?.meta?.['content-type'] ?? "");
        let application = uri?.servicePreferenceOrder[0] ?? "evanotebook";
        return {
            name: resource.name,
            meta: {
                ...resource.meta,
                parent: resource.parent,
                label: resource.meta?.label ?? "",
                icon: uri?.meta?.icon ?? <TextSnippet/>,
                canInput: resource.access == '*' || resource.access == 'can_edit' || resource.access == 'can_input'
            },
            list: `/${application}/${resource.name}`,
            edit:  ((resource.access == '*' || resource.access == 'can_edit' ) || undefined) && `/resources/new?parent=${resource.name}`,
            show: `/${application}/${resource.name}`,
            create: ((resource.access == '*' || resource.access == 'can_edit' ) || undefined) && `/resources/new?parent=${resource.name}`,
        };
    }

}