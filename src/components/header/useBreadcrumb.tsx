import {IResourceItem, useResource} from "@refinedev/core";

export const useBreadcrumb = () => {
    const resource = useResource();
    const path: (IResourceItem | null | undefined)[] = [null, null, null, null];
    let parent = resource.resource;
    let i = path.length - 1;
    do {
        path[i] = parent;
        i = i > 0 ? i - 1 : 0;
    } while ((parent = resource.select(parent?.meta?.parent ?? "").resource).name);
    return path.filter(x => x) as IResourceItem[];
}