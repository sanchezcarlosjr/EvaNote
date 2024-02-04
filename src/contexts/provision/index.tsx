import { ThemeProvider } from "@mui/material/styles";
import { RefineThemes } from "@refinedev/mui";
import React, {
  createContext,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";

type ProvisionContextType = any;
import {render} from "@evanote/template-engine";
import defaultPlaybook from '/playbook.json?raw';
import {EditNote, Subject, TextSnippet, Try} from "@mui/icons-material";

import fs, {configure} from 'browserfs';
import {ResourceProps} from "@refinedev/core";
import path from "bfs-path";
import {capitalize} from "@mui/material";
import {createAction, Priority, useRegisterActions} from "@refinedev/kbar";
import {Mutex} from "../../utility/mutex";


const defaultPlaybookJson = render(defaultPlaybook, {});
export const ProvisionContext = createContext<ProvisionContextType>({playbook: defaultPlaybookJson, resources: [], filesystem: null} as ProvisionContextType);
const mutex = new Mutex();

export const ProvisionContextProvider: React.FC<PropsWithChildren> = ({children}) => {
  const [playbook, setPlaybook] = useState(defaultPlaybookJson);
  const [filesystem, setFilesystem] = useState(null);

  const [resources, setResources] = useState<ResourceProps[]>([]);
    useEffect(() => {
        mutex.execute(async() =>
            {
                await configure({
                    '/': { fs: 'AsyncMirror', options: { sync: { fs: 'InMemory' }, async: { fs: 'IndexedDB' } } },
                    '/tmp': 'InMemory',
                });
                await fs.isReady;

                const newResources = [];

                newResources.push({
                    name: "audit-logs",
                    list: "/audit-logs",
                    show: "/audit-logs/show/:id"
                });

                for (const resource of fs.walkSync('/')) {
                    const uri = `browser:${resource}`;
                    let application = "text-editor";
                    let icon = <TextSnippet />
                    if (resource.match(/.+\.nb$/)) {
                        application = "evanotebook";
                        icon = <EditNote/>;
                    }
                    newResources.push(
                        {
                            name: uri,
                            meta: {
                                label: capitalize(path.basename(resource, path.extname(resource))),
                                icon
                            },
                            list: `/${application}?uri=${uri}`
                        }
                    )
                }

                setResources(newResources);

                setFilesystem(fs);

            }
        ).then();
        return () => {
            mutex.execute(() => {
                return fs.umount('/tmp');
            });
        }
    }, []);


    useRegisterActions([createAction({
        name: "Write new resource",
        section: "Resources",
        perform: () => {
            const resource = window.prompt("Resource path");
            if (!resource)
                return;
            if (!fs.existsSync(resource)) {
                fs.writeFileSync(resource, '');
            }
            const uri = `browser:${resource}`;
            setResources(r => [
                ...r,
                {
                    name: uri,
                    meta: {
                        label: capitalize(path.basename(resource, path.extname(resource))),
                        icon: <TextSnippet/>
                    },
                    list: `text-editor?uri=${uri}`
                }
            ]);
        },
        priority: Priority.HIGH,
    })]);

  return (
    <ProvisionContext.Provider
      value={
      {
        playbook,
        resources,
        filesystem
      }
      }
    >
      {children}
    </ProvisionContext.Provider>
  );
};
