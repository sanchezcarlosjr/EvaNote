import {useContext, useEffect} from "react";
import {ProvisionContext} from "./contexts/provision";
import {useGetIdentity} from "@refinedev/core";
import {supabaseClient} from "./utility";
import {Dependency, Playbook} from "./contexts/provision/types";
import {Identity} from "./providers/identity";


class Supabase {
    private path: string[];
    constructor(private uri: URL) {
        this.path = this.uri.pathname.split("/").filter(x => x);
    }
    download() {
        return supabaseClient.storage.from(this.path[0]).download(this.path.slice(1).join('/'));
    }
}


function factoryDependencyDownloader(dependency: Dependency) {
    const url = new URL(dependency.uri);
    return new Supabase(url);
}

function prepareInstallation(playbook: Playbook, widgets: any, identity: any) {
    const promises: Promise<any[]> = Promise.all(playbook.dependencies.map(async (dependency: Dependency) => {
        const {data, error}  = await factoryDependencyDownloader(dependency).download();
        if (error) {
            return;
        }
        const objectURL = URL.createObjectURL(data as Blob);
        return import(/* @vite-ignore */ objectURL).then(importDependency => {
            importDependency.declareWidgets({widgets, identity});
            return dependency;
        });
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