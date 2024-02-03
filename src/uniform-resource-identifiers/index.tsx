import {useContext, useEffect, useState} from "react";
import {Try} from "@mui/icons-material";
import {ProvisionContext} from "../contexts/provision";


export function useUniformResourceIdentifiers(){
    const playbook = useContext(ProvisionContext);

    const [resources, setResources] = useState([
        {
            name: "file:///tmp/getting-started",
            meta: {
                label: "Getting started",
                icon: <Try/>
            },
            list: "/evanotebook?uri=file:///tmp/getting-started"
        }
    ]);

    console.log(playbook);

    return resources;
}