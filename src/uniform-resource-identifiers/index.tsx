import {useContext, useEffect, useState} from "react";
import {Try} from "@mui/icons-material";
import {ProvisionContext} from "../contexts/provision";
import fs, {configure} from 'browserfs';
import {Mutex} from "../utility/mutex";
import {ResourceProps} from "@refinedev/core";
import path from "bfs-path";
import {capitalize} from "@mui/material";


const mutex = new Mutex();


export function useUniformResourceIdentifiers() {
    const playbook = useContext(ProvisionContext);
    const [resources, setResources] = useState<ResourceProps[]>([]);
    useEffect(() => {
        mutex.execute(async() =>
            {
                await configure({
                    '/tmp': 'InMemory',
                    '/home': { fs: 'AsyncMirror', options: { sync: { fs: 'InMemory' }, async: { fs: 'IndexedDB' } } },
                });
                await fs.isReady;

                for (const resource of fs.walkSync('/')) {
                    const uri = `browser://${resource}`;
                    setResources([
                        {
                            name: uri,
                            meta: {
                                label: capitalize(path.basename(resource, path.extname(resource))),
                                icon: <Try/>
                            },
                            list: `/evanotebook?uri=${uri}`
                        }
                    ]);
                }

            }
        ).then();
        return () => {
            mutex.execute(() => {
                fs.umount('/tmp');
                return fs.umount('/home');
            }).then();
        }
    }, []);




    return resources;
}