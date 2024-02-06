import {useContext, useEffect} from "react";
import {ProvisionContext} from "./contexts/provision";
import {useGetIdentity} from "@refinedev/core";
import {supabaseClient} from "./utility";

export function PlaybookExecutor() {
    const {playbook} = useContext(ProvisionContext);
    const { data }= useGetIdentity();
    useEffect(() => {
        if (!playbook || !data)
            return;
        console.log(data);
    }, [playbook, data]);
    return <></>;
}