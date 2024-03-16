import {Breadcrumbs, IconButton, Link} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import React, {useContext, useEffect, useState} from "react";
import {Close, Comment, HistoryOutlined, MoreHoriz} from "@mui/icons-material";
import {useQuery} from "../../utility/useQuery";
import {IResourceItem, useLink, useNotification, useResource} from "@refinedev/core";
import {ProvisionContext} from "../../contexts/provision";
import Drawer from "@mui/material/Drawer";
import {useThemedLayoutContext} from "../layout/useThemedLayoutContext";
import {HamburgerMenu} from "../layout/hamburgerMenu";


export const RightSider = () => {
    const [drawerWidth, setDrawerWidth] = useState('0');
    const {
        rightSiderWidget, setRightSiderWidget
    } = useThemedLayoutContext();

    function clear() {
        setDrawerWidth('0');
        setRightSiderWidget("");
    }

    useEffect(() => {
        if (!rightSiderWidget) return;
        setDrawerWidth('30vw');
    }, [rightSiderWidget]);

    return <Drawer
        variant="permanent"
        anchor="right"
        sx={{
            width: drawerWidth, flexShrink: 0, "& .MuiDrawer-paper": {
                width: drawerWidth,
                overflow: "hidden",
                zIndex: 0,
                transition: "width 200ms cubic-bezier(0.4, 0, 0.6, 1) 0ms",
            }
        }}
        open
    >
        <IconButton size="small" onClick={_ => clear()}>
            <Close/>
        </IconButton>
        <div dangerouslySetInnerHTML={{__html: rightSiderWidget}}></div>
    </Drawer>;
}


const useBreadcrumb = () => {
    const resource = useResource();
    const path: (IResourceItem | null | undefined)[] = [null, null, null, null];
    let parent = resource.resource;
    let i = path.length - 1;
    do {
        path[i] = parent;
        i = i > 0 ? i - 1 : 0;
    } while ((parent = resource.select(parent?.meta?.parent ?? "").resource).name);
    return path.filter(x => x) as IResourceItem[];
}

export const GlobalBreadcrumb = () => {
    const path = useBreadcrumb();
    const link = useLink();

    return <Breadcrumbs aria-label="breadcrumb">
        {path.map((resource: IResourceItem) => <Link key={resource.name} underline="hover" color="inherit"
                                                     component={link} to={resource.list ?? ""}>
            {resource.meta?.label}
        </Link>)}
    </Breadcrumbs>
}

export const Header = () => {

    const {open} = useNotification();
    const {toolbarWidgets} = useContext(ProvisionContext);

    const {
        setRightSiderWidget
    } = useThemedLayoutContext();

    function sharePage() {
        return navigator.clipboard.writeText(window.location.href).then(() => open?.({
            type: "success", message: "Copied link to clipboard", description: "", key: "copy-link",
        }));
    }

    return (<>
        <Toolbar variant="dense">
            <Stack direction="row" width="100%" alignItems="center">
                <HamburgerMenu/>
                <Stack direction="row"
                       width="100%"
                       justifyContent="flex-start"
                       alignItems="center"
                       id="header-flex-start"
                >
                    <GlobalBreadcrumb/>
                </Stack>
                <Stack
                    direction="row"
                    width="100%"
                    justifyContent="flex-end"
                    alignItems="center"
                    id="header-flex-end"
                >
                    {toolbarWidgets.map((toolbarWidget, index) => <MenuItem key={`${index}-${toolbarWidget.label}`}
                                                                            onClick={() => {
                                                                                setRightSiderWidget(toolbarWidget.component)
                                                                            }}
                                                                            aria-label={`toolbar-widget-${toolbarWidget.label}`}>{toolbarWidget.label}</MenuItem>)}
                    <MenuItem onClick={sharePage} aria-label="share-resource">Share</MenuItem>
                    <IconButton aria-label="resource-history" disabled color="primary" size="small">
                        <HistoryOutlined/>
                    </IconButton>
                    <IconButton aria-label="resource-comments" disabled color="primary" size="small">
                        <Comment/>
                    </IconButton>
                    <IconButton aria-label="more-options" disabled color="primary" size="small">
                        <MoreHoriz/>
                    </IconButton>
                </Stack>
            </Stack>
        </Toolbar>
    </>);
};
