import {IResourceComponentsProps, ResourceContext, useGetIdentity} from "@refinedev/core";
import React, {useContext, useEffect, useLayoutEffect} from "react";
import {ColorModeContext} from "../../contexts/color-mode";
import {Button, CircularProgress, useMediaQuery} from "@mui/material";
import {ProvisionContext} from "../../contexts/provision";
import {match, P} from "ts-pattern";
import {redirect, useNavigate} from "react-router-dom";



const Application: React.FC<IResourceComponentsProps> = () => {
    const {playbook, resources} = useContext(ProvisionContext);
    const {data: identity} = useGetIdentity<any>();
    const navigate = useNavigate();
    useEffect(() => {
        if (!playbook || !resources || resources.length === 0)
            return;
        const route = match(playbook.settings.applications.indexer.redirect_policy)
            .with(P.string.regex(/^(always) ([\/A-Z-?"']+)$/i), (redirect_policy: string) => {
                const [_, param] = redirect_policy.split(" ");
                return param;
            })
            .otherwise(() => resources[0].list);
        // @ts-ignore
        navigate(route);
    }, [resources, playbook]);

    if (!identity || !identity?.color)
         return <CircularProgress/>;

    return null;
};

export default Application;