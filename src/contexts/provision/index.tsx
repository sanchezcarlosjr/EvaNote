import {ThemeProvider} from "@mui/material/styles";
import {RefineThemes} from "@refinedev/mui";
import React, {
    createContext, PropsWithChildren, useEffect, useState,
} from "react";

type ProvisionContextType = any;
import {render} from "@evanote/template-engine";
import defaultPlaybook from '/playbook.json?raw';
import {EditNote, Subject, TextSnippet, Try} from "@mui/icons-material";

import fs, {configure} from 'browserfs';
import {ResourceProps, useNavigation, useNotification} from "@refinedev/core";
import path from "bfs-path";
import {capitalize} from "@mui/material";
import {createAction, Priority, useRegisterActions} from "@refinedev/kbar";
import {Mutex} from "../../utility/mutex";


const defaultPlaybookJson = render(defaultPlaybook, {});
export const ProvisionContext = createContext<ProvisionContextType>({
    playbook: defaultPlaybookJson,
    resources: [],
    filesystem: null
} as ProvisionContextType);
const mutex = new Mutex();

interface URI extends ResourceProps {
    pattern: RegExp;
    servicePreferenceOrder: string[];
}

class URIAssociation {
    // @TODO: Increase perfomance with a better data structure.
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
    const [playbook, setPlaybook] = useState(defaultPlaybookJson);
    const [filesystem, setFilesystem] = useState(null);

    const uriAssociation = new URIAssociation([{
        name: 'Notebook', pattern: /.+\.nb$/, meta: {
            icon: <EditNote/>
        }, servicePreferenceOrder: ['evanotebook']
    }, {
        name: 'Plain Text', pattern: /.+\.txt$/, meta: {
            icon: <TextSnippet/>
        }, servicePreferenceOrder: ['text-editor']
    }]);

    function reloadResources() {
        const newResources = [];

        newResources.push({
            name: "audit-logs", list: "/audit-logs", show: "/audit-logs/show/:id"
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
            if (!fs.existsSync(resource_pathname)) {
                alert(`The resource "${resource_pathname}" has not been found.`);
                return;
            }
            fs.unlinkSync(resource_pathname);
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
                playbook, resources, filesystem
            }}
        >
            {children}
        </ProvisionContext.Provider>);
};
