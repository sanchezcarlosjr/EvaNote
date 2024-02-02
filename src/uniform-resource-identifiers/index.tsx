import {useEffect, useState} from "react";
import {Try} from "@mui/icons-material";


export function useUniformResourceIdentifiers(){
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

    // useEffect(() => {
    //     const interval = setInterval(() => setResources(r => [...r,  {
    //         name: `file:///home/${crypto.randomUUID()}/getting-started`,
    //         meta: {
    //             label: "Getting started",
    //             icon: <Try/>
    //         },
    //         list: `/evanotebook?uri=file:///home/${crypto.randomUUID()}/getting-started`
    //     }]), 5000);
    //     return () => clearInterval(interval);
    // }, []);

    return resources;
}