import {Breadcrumbs, IconButton, Link} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import {Breadcrumb, HamburgerMenu,  RefineThemedLayoutV2HeaderProps} from "@refinedev/mui";
import React, {useContext, useEffect, useState} from "react";
import {HistoryOutlined, Comment, MoreHoriz, Close} from "@mui/icons-material";
import {useQuery} from "../../utility/useQuery";
import {useLink, useNotification, useResource} from "@refinedev/core";
import {ProvisionContext} from "../../contexts/provision";
import Drawer from "@mui/material/Drawer";
import {IResourceItem} from "@refinedev/core/src/interfaces";


type IUser = {
    id: number;
    name: string;
    avatar: string;
};

const useBreadcrumb = () => {
    const params = useQuery();
    const uri = new URL(params.get('uri') ?? "browser:/tmp");
    const resource = useResource(uri.pathname);
    const path: (IResourceItem|null)[] = [null, null, null, null];
    let parent = resource.resource;
    let i = path.length-1;
    do {
        path[i] = parent;
        i = i > 0 ? i-1 : 0;
    } while((parent = resource.select(parent.meta?.parent ?? "").resource).name);
    return path.filter(x => x) as IResourceItem[];
}

export const GlobalBreadcrumb = () => {
    const path = useBreadcrumb();
    const link = useLink();

    return  <Breadcrumbs aria-label="breadcrumb">
        {
            path.map((resource: IResourceItem) => <Link key={resource.name} underline="hover" color="inherit" component={link} to={resource.list ?? ""}>
                {resource.meta?.label}
            </Link>)
        }
    </Breadcrumbs>
}

export const Header: React.FC<RefineThemedLayoutV2HeaderProps> = ({
                                                                      sticky = true,
                                                                  }) => {

    const { open } = useNotification();
    const {toolbarWidgets} = useContext(ProvisionContext);
    const [isVisibleDrawer, setVisibleDrawer] = useState(false);

    const [widget, setWidget] = useState("<p></p>");

    function sharePage() {
        return navigator.clipboard.writeText(window.location.href).then(
            () => open?.({
                type: "success",
                message: "Copied link to clipboard",
                description: "",
                key: "copy-link",
            }
        ));
    }

    function toggleDrawer() {
        setVisibleDrawer(state => !state);
    }

    return (
        <>
            <Toolbar variant="dense">
                <Stack direction="row" width="100%" alignItems="center">
                    <HamburgerMenu/>
                    <Stack   direction="row"
                             width="100%"
                             justifyContent="flex-start"
                             alignItems="center"
                             id="header-flex-start"
                    >
                        <GlobalBreadcrumb />
                    </Stack>
                    <Stack
                        direction="row"
                        width="100%"
                        justifyContent="flex-end"
                        alignItems="center"
                        id="header-flex-end"
                    >
                        {
                            toolbarWidgets.map((toolbarWidget, index) =>
                                <MenuItem key={`${index}-${toolbarWidget.label}`} onClick={() => {toggleDrawer(); setWidget(toolbarWidget.component)}} aria-label={`toolbar-widget-${toolbarWidget.label}`} >{toolbarWidget.label}</MenuItem>
                            )
                        }
                        <MenuItem onClick={sharePage} aria-label="share-resource" >Share</MenuItem>
                        <IconButton aria-label="resource-history" disabled color="primary" size="small">
                            <HistoryOutlined />
                        </IconButton>
                        <IconButton aria-label="resource-comments" disabled color="primary" size="small">
                            <Comment />
                        </IconButton>
                        <IconButton aria-label="more-options" disabled color="primary" size="small">
                            <MoreHoriz />
                        </IconButton>
                    </Stack>
                </Stack>
            </Toolbar>
            <Drawer
                anchor={'right'}
                open={isVisibleDrawer}
                hideBackdrop={true}
                variant={'persistent'}
            >
                <IconButton onClick={toggleDrawer}>
                    <Close/>
                </IconButton>
                <div style={{width: "33vw"}} dangerouslySetInnerHTML={{__html: widget}}></div>
            </Drawer>
        </>
    );
};
