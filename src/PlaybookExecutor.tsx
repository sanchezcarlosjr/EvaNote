import React, {Suspense, useContext, useEffect} from "react";
import {ProvisionContext, ProvisionContextType} from "./contexts/provision";
import {ResourceProps, useGetIdentity, useList} from "@refinedev/core";
import {supabaseClient} from "./utility";
import {Dependency, Playbook} from "./contexts/provision/types";
import {Identity} from "./providers/identity";
import {match} from "ts-pattern";


class Installer {
    constructor(protected uri: URL) {
        this.setup();
    }

    install(context: DependencyContext) {
        return Promise.resolve({
            unmount: () => {}
        })
    }

    protected setup() {
    }
    protected async importObject(objectURL: string, context: DependencyContext) {
        let importDependency = await import(/* @vite-ignore */ objectURL);
        await importDependency.install(context);
        return importDependency;
    }
}


export interface DependencyContext {
    widgets: any;
    identity: Identity;
}

class Supabase extends Installer {
    private path: string[] = [];

    async install(context: DependencyContext) {
        const {data, error} = await supabaseClient.storage.from(this.path[0]).download(this.path.slice(1).join('/'));
        if (error) {
            return;
        }
        const objectURL = URL.createObjectURL(data as Blob);
        return this.importObject(objectURL, context);
    }

    protected setup() {
        this.path = this.uri.pathname.split("/").filter(x => x);
    }
}

class RPC extends Installer {
    async install(context: DependencyContext) {
        const {data, error} = await supabaseClient.rpc(this.uri.pathname);
        if (error) {
            return;
        }
        const objectURL = URL.createObjectURL(new Blob([data], {
            type: 'application/javascript'
        }));
        return this.importObject(objectURL, context);
    }
}

class Https extends Installer {
    async install(context: DependencyContext) {
        const response = await fetch(this.uri.toString()).then(response => response.blob());
        return this.importObject(URL.createObjectURL(response), context);
    }
}

class SharedLibrary {
    async install(context: DependencyContext, blob: Blob) {
        const objectURL = URL.createObjectURL(blob);
        let importDependency = await import(/* @vite-ignore */ objectURL);
        await importDependency.install(context);
        return importDependency;
    }
}


function downloadDependency(dependency: Dependency) {
    const url = new URL(dependency.uri);
    return match(url.protocol)
        .with('supabase+s3:', (protocol) => new Supabase(url))
        .with('https:', (protocol) => new Https(url))
        .with('supabase+rpc:', (protocol) => new RPC(url))
        .with('in-memory:', () => new Installer(url))
        .otherwise(() => new Supabase(url));
}

function prepareInstallation({playbook, widgets, setResources}: ProvisionContextType, identity: Identity) {
    const promises: Promise<any[]> = Promise.all(playbook.dependencies.map(async (dependency: Dependency) => {
        return downloadDependency(dependency).install({widgets, identity});
    }));
    return () => {
        promises.then(dependencies => dependencies.map(dependency => dependency.unmount()));
    }
}

export function PlaybookExecutor() {
    const context = useContext(ProvisionContext);
    const {data: identity} = useGetIdentity<Identity>();
    const {data} = useList({
        resource: 'resources',
        liveMode: 'auto',
        pagination: {
            pageSize: 35
        }
    });

    useEffect(() => {
        if (!context.playbook || !identity)
            return;
        return prepareInstallation(context, identity);
    }, [context.playbook, identity]);

    useEffect(() => {
        if (!identity) return;
        context.setResources(
            data?.data?.map((resource: any) => context.playbook.settings.uriAssociation.map(resource)) ?? []
        )
    }, [identity, data?.data]);

    return <></>;
}