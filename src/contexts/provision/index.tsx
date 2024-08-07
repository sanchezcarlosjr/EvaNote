import React, {createContext, Dispatch, PropsWithChildren, ReactNode, SetStateAction, useState,} from "react";

import defaultPlaybook from "../../playbook";
import {ResourceProps} from "@refinedev/core";
import {Mutex} from "../../utility/mutex";
import {Playbook} from "./types";


export interface ToolbarWidget {
    label: string;
    component: string;
}

export interface ProvisionContextType {
    playbook: Playbook;
    resources: ResourceProps[];
    filesystem: any;
    routes: RouteProps[];
    toolbarWidgets: ToolbarWidget[];
    setResources: Dispatch<SetStateAction<ResourceProps[]>>;
    setRoutes: Dispatch<SetStateAction<RouteProps[]>>;
    widgets: any
}

export interface RouteProps {
    path: string;
    element: ReactNode;
}

export const ProvisionContext = createContext<ProvisionContextType>({
    playbook: defaultPlaybook,
    resources: [],
    routes: [],
    filesystem: null,
    toolbarWidgets: [],
    setResources: () => {
    },
    setRoutes: () => {
    },
    widgets: {}
} as ProvisionContextType);


const defaultRoutes = (defaultPlaybook as Playbook).dependencies.find(library => library.uri.match('in-memory:routes'))?.data ?? [];


export const ProvisionContextProvider: React.FC<PropsWithChildren> = ({children}) => {
    const [playbook] = useState(defaultPlaybook);
    const [toolbarWidgets, setToolbarWidgets] = useState<any>([]);
    const [filesystem, setFilesystem] = useState(null);
    const addToolbarWidget = (dependency: any) => setToolbarWidgets([...toolbarWidgets, dependency]);

    const widgets = {addToolbarWidget};

    const [resources, setResources] = useState<ResourceProps[]>([]);
    const [routes, setRoutes] = useState<RouteProps[]>(defaultRoutes);

    return (<ProvisionContext.Provider
        value={{
            playbook, resources, setResources, routes, setRoutes, filesystem, toolbarWidgets, widgets
        }}
    >
        {children}
    </ProvisionContext.Provider>);
};
