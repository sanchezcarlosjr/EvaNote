import {ThemeProvider} from "@mui/material/styles";
import {RefineThemes} from "@refinedev/mui";
import React, {
    createContext, PropsWithChildren, useEffect, useState,
} from "react";


import {render} from "@evanote/template-engine";
import defaultPlaybook from '/playbook.json?raw';
import {EditNote, InsertChart, Subject, SvgIconComponent, TextSnippet, Try} from "@mui/icons-material";
import * as MaterialIcons from "@mui/icons-material";

import fs, {configure} from 'browserfs';
import {ResourceProps, useGetIdentity, useNavigation, useNotification} from "@refinedev/core";
import path from "bfs-path";
import {capitalize} from "@mui/material";
import {createAction, Priority, useRegisterActions} from "@refinedev/kbar";
import {Mutex} from "../../utility/mutex";
import {Playbook} from "./types";


const defaultPlaybookJson: Playbook = render(defaultPlaybook, import.meta.env);

export interface ToolbarWidget {
    label: string;
    component: string;
}

interface ProvisionContextType {
    playbook: Playbook;
    resources: any;
    filesystem: any;
    toolbarWidgets: ToolbarWidget[];
    widgets: any
}

export const ProvisionContext = createContext<ProvisionContextType>({
    playbook: defaultPlaybookJson,
    resources: [],
    filesystem: null,
    toolbarWidgets: [],
     widgets: {}
} as ProvisionContextType);
const mutex = new Mutex();

interface URI extends ResourceProps {
    pattern: RegExp|string;
    servicePreferenceOrder: string[];
}

class URIAssociation {
    // @TODO: Increase performance with a better data structure.
    constructor(private uris: URI[] = []) {
    }

    map(resource_pathname: string) {
        const uri = this.uris.find(uri => resource_pathname.match(uri.pattern));
        const name = `browser:${resource_pathname}`;
        let application = uri?.servicePreferenceOrder[0] ?? "text-editor";
        return {
            name, meta: {
                label: capitalize(path.basename(resource_pathname, path.extname(resource_pathname))),
                icon: uri?.meta?.icon ?? <TextSnippet/>
            }, list: `/${application}?uri=${name}`
        }
    }

}

export const ProvisionContextProvider: React.FC<PropsWithChildren> = ({children}) => {
    const [playbook] = useState(defaultPlaybookJson);
    const [toolbarWidgets, setToolbarWidgets] = useState<any>([]);
    const [filesystem, setFilesystem] = useState(null);
    const addToolbarWidget = (dependency: any) => setToolbarWidgets([...toolbarWidgets, dependency]);

    const widgets = {addToolbarWidget};

    const uriAssociation = new URIAssociation(playbook.settings.uriAssociation.map((association: URI) => {
            // @ts-ignore
            //  Element implicitly has an 'any' type because expression of type 'string | number' can't be used to Indexer type
            const Icon: SvgIconComponent  = MaterialIcons[association.meta.icon as string] as SvgIconComponent;
            return (
                {
                    ...association,
                    pattern: new RegExp(association.pattern),
                    meta: {
                        ...association.meta,
                        icon: <Icon />
                    }
                }
            )
        }
    ));

    function reloadResources() {
        const newResources = [];

        newResources.push({
            name: "audit-logs", list: "/audit-logs", show: "/audit-logs/show/:id"
        });

        newResources.push({
            name: "user-progress",
            list: "/user-progress",
            meta: {
                label: "User progress",
                icon: <InsertChart />
            }
        });

        for (const resource_pathname of fs.walkSync('/')) {
            newResources.push(uriAssociation.map(resource_pathname));
        }

        setResources(newResources);
    }

    const [resources, setResources] = useState<ResourceProps[]>([]);

    useEffect(() => {
        mutex.execute(async () => {
            await configure({
                '/': {fs: 'AsyncMirror', options: {sync: {fs: 'InMemory'}, async: {fs: 'IndexedDB'}}},
                '/tmp': 'InMemory'
            });
            await fs.isReady;

            fs.writeFileSync('/tmp/playbook.json', JSON.stringify(playbook, null, 2));

            fs.writeFileSync('/tmp/getting-started.nb', '');

            reloadResources();

            setFilesystem(fs);

        }).then();
        return () => {
            mutex.execute(() => {
                return fs.umount('/tmp');
            }).then();
        }
    }, []);


    useRegisterActions([createAction({
        name: "Write new resource", section: "Action over Resources", perform: () => {
            const resource_pathname = window.prompt("Resource path");
            if (!resource_pathname) return;
            if (!fs.existsSync(resource_pathname)) {
                fs.writeFileSync(resource_pathname, '');
            }
            reloadResources();
        }, priority: Priority.HIGH,
    }), createAction({
        name: "Delete resource", section: "Action over Resources", perform: () => {
            const resource_pathname = window.prompt("Resource path");
            if (!resource_pathname) return;
            resources
                .filter(resource => resource.name.match(new RegExp(resource_pathname)))
                .map(resource => new URL(resource.name).pathname)
                .filter(pathname => fs.existsSync(pathname))
                .forEach(pathname => fs.unlinkSync(pathname));
            reloadResources();
        }, priority: Priority.HIGH,
    }),
        ...resources.map(resource => createAction({
            name: resource.name, section: "Resources", perform: () => {
                window.location.href = resource.list as string ?? "/";
            }, priority: Priority.HIGH,
        }))
    ], [resources]);


    return (<ProvisionContext.Provider
            value={{
                playbook,
                resources,
                filesystem,
                toolbarWidgets,
                widgets
            }}
        >
            {children}
        </ProvisionContext.Provider>);
};
