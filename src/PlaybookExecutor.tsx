import {useContext, useEffect} from "react";
import {ProvisionContext} from "./contexts/provision";
import {useGetIdentity} from "@refinedev/core";
import {supabaseClient} from "./utility";
import {Dependency, Playbook} from "./contexts/provision/types";
import {Identity} from "./providers/identity";
import {match} from "ts-pattern";

abstract class Installer  {
    constructor(protected uri: URL) {
        this.setup();
    }
    protected setup() {
    }
    install(context: DependencyContext) {}

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
    protected setup() {
        this.path = this.uri.pathname.split("/").filter(x => x);
    }
    async install(context: DependencyContext) {
        const {data, error} = await supabaseClient.storage.from(this.path[0]).download(this.path.slice(1).join('/'));
        if (error) {
            return;
        }
        const objectURL = URL.createObjectURL(data as Blob);
        return this.importObject(objectURL, context);
    }
}

class RPC extends Installer {
    async install(context: DependencyContext) {
        const { data, error } = await supabaseClient.rpc(this.uri.pathname);
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
        const objectURL = URL.createObjectURL(response);
        return this.importObject(objectURL, context);
    }
}


function factoryDependencyDownloader(dependency: Dependency) {
    const url = new URL(dependency.uri);
    return match(url.protocol)
        .with('supabase+s3:', (protocol) => new Supabase(url))
        .with('https:', (protocol) => new Https(url))
        .with('supabase+rpc:', (protocol) => new RPC(url))
        .otherwise(() => new Supabase(url));
}

function prepareInstallation(playbook: Playbook, widgets: any, identity: any) {
    const promises: Promise<any[]> = Promise.all(playbook.dependencies.map(async (dependency: Dependency) => {
        return factoryDependencyDownloader(dependency).install({widgets, identity});
    }));
    return () => {
        promises.then(dependencies => dependencies.map(dependency => dependency.unmount()));
    }
}

export function PlaybookExecutor() {
    const {playbook, widgets} = useContext(ProvisionContext);
    const { data: identity }= useGetIdentity<Identity>();

    useEffect(() => {
        if (!playbook || !identity)
            return;
        return prepareInstallation(playbook, widgets, identity);
    }, [playbook, identity]);
    return <></>;
}