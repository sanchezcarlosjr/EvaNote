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
        playbook.dependencies.forEach(async (dependency: { uri: string | URL; integrity: string }) => {
            const url = new URL(dependency.uri);
            const path = url.pathname.split("/").filter(x => x);
            const { data: blob, error } = await supabaseClient.storage.from(path[0]).download(path.slice(1).join('/'));
            if (error) {
                return;
            }
            const algorithm = dependency.integrity.split(':')[0];
            const hashAsArrayBuffer = await crypto.subtle.digest(algorithm, await blob?.arrayBuffer())
            const uint8ViewOfHash = new Uint8Array(hashAsArrayBuffer);
            const hashAsString = Array.from(uint8ViewOfHash).map((b) => b.toString(16).padStart(2, "0")).join("");
            if (`${algorithm}:${hashAsString}` !== dependency.integrity) {
                open?.({
                    type: "error",
                    message: "Something goes wrong.",
                    description: `We could install the dependency ${dependency.uri}.`,
                    key: "notification-key",
                });
                return;
            }
            const objectURL = URL.createObjectURL(blob as Blob);
            import(/* @vite-ignore */ objectURL).then();
        });
    }, [playbook, data]);
    return <></>;
}