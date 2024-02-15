import {useContext, useEffect} from "react";
import {ProvisionContext} from "./contexts/provision";
import {useGetIdentity, useNotification} from "@refinedev/core";
import {supabaseClient} from "./utility";

export function PlaybookExecutor() {
    const {playbook} = useContext(ProvisionContext);
    const { data }= useGetIdentity();
    const { open, close } = useNotification();

    useEffect(() => {
        if (!playbook || !data)
            return;
        const promises: Promise<{mount: () => void, unmount: () => void}[]> = Promise.all(playbook.dependencies.map(async (dependency: { uri: string | URL; integrity: string }) => {
            const url = new URL(dependency.uri);
            const path = url.pathname.split("/").filter(x => x);
            const { data: blob, error } = await supabaseClient.storage.from(path[0]).download(path.slice(1).join('/'));
            if (error) {
                return;
            }
            const objectURL = URL.createObjectURL(blob as Blob);
            return import(/* @vite-ignore */ objectURL).then(module => {
                module.mount();
                return module;
            });
        }));
        return () => {
            promises.then(dependencies => dependencies.map(dependency => dependency.unmount()));
        }
    }, [playbook, data]);
    return <></>;
}