import {useContext, useEffect, useState} from "react";
import {Try} from "@mui/icons-material";
import {ProvisionContext} from "../contexts/provision";
import fs, {configure} from 'browserfs';
import {Mutex} from "../utility/mutex";


const mutex = new Mutex();

export function useUniformResourceIdentifiers() {
    const playbook = useContext(ProvisionContext);

    useEffect(() => {
        mutex.execute(() => {
            console.log("A", 87);
            return configure({
                '/tmp': {
                    'fs': 'InMemory'
                }
            });
        }).then(_ => console.log("B", 89));
        return () => {
            mutex.execute(() => {
                console.log("A", 92);
                return fs.umount('/tmp');
            }).then(_ => console.log("B", 94));
        }
    }, []);

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


    return resources;
}