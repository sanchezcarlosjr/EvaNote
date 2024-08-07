import React, {useState} from "react";
import {
    useActiveAuthProvider, useLink, useMenu, useRefineContext, useRouterContext, useRouterType, useTitle, useTranslate,
} from "@refinedev/core";
import type {RefineThemedLayoutV2SiderProps} from "@refinedev/mui";
import {ThemedTitleV2 as DefaultTitle,} from "@refinedev/mui";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import {Search} from "@mui/icons-material";
import {useKBar} from "@refinedev/kbar";
import {useContextMenu} from "../context-menu/useContextMenu";
import {ContextMenu} from "../context-menu/contextMenu";
import {useThemedLayoutContext} from "./useThemedLayoutContext";
import ResourceView from "../resource-view";


export const ThemedSiderV2: React.FC<RefineThemedLayoutV2SiderProps> = ({
                                                                            Title: TitleFromProps,
                                                                            render,
                                                                            meta,
                                                                            activeItemDisabled = false,
                                                                        }) => {
    const {
        siderCollapsed, setSiderCollapsed, mobileSiderOpen, setMobileSiderOpen,
    } = useThemedLayoutContext();

    const drawerWidth = () => {
        if (siderCollapsed) return 0;
        return 240;
    };

    const t = useTranslate();
    const routerType = useRouterType();
    const Link = useLink();
    const {Link: LegacyLink} = useRouterContext();
    const ActiveLink = routerType === "legacy" ? LegacyLink : Link;
    const {hasDashboard} = useRefineContext();
    const translate = useTranslate();

    const {menuItems, selectedKey, defaultOpenKeys} = useMenu({meta});

    const TitleFromContext = useTitle();
    const authProvider = useActiveAuthProvider();

    const [open, setOpen] = useState<{ [k: string]: any }>({});


    React.useEffect(() => {
        setOpen((previous) => {
            const previousKeys: string[] = Object.keys(previous);
            const previousOpenKeys = previousKeys.filter((key) => previous[key]);

            const uniqueKeys = new Set([...previousOpenKeys, ...defaultOpenKeys]);
            const uniqueKeysRecord = Object.fromEntries(Array.from(uniqueKeys.values()).map((key) => [key, true]));
            return uniqueKeysRecord;
        });
    }, [defaultOpenKeys]);

    const {
        contextMenu: {contextMenu, close, onContextMenu}
    } = useContextMenu();

    const RenderToTitle = TitleFromProps ?? TitleFromContext ?? DefaultTitle;

    const {query} = useKBar();

    const kbar = (<Tooltip
            title={t("buttons.search", "Search") + " Ctrl+K"}
            placement="right"
            disableHoverListener={!siderCollapsed}
            arrow
        >
            <ListItemButton
                key="search"
                onClick={query.toggle}
                sx={{
                    justifyContent: "center",
                }}
            >
                <ListItemIcon
                    sx={{
                        justifyContent: "center",
                        minWidth: "24px",
                        transition: "margin-right 0.3s",
                        marginRight: siderCollapsed ? "0px" : "12px",
                        color: "currentColor",
                    }}
                >
                    <Search/>
                </ListItemIcon>
                <ListItemText
                    primary={t("buttons.search", "Search")}
                    secondary={"Ctrl+K"}
                    secondaryTypographyProps={{
                        noWrap: true, fontSize: "10px",
                    }}
                    primaryTypographyProps={{
                        noWrap: true, fontSize: "14px",
                    }}
                />
            </ListItemButton>
        </Tooltip>);

    const items = <ResourceView onContextMenu={onContextMenu} tree={menuItems} selectedKey={selectedKey}/>;

    const renderSider = () => {
        return (<>
                {kbar}
                {items}
            </>);
    };

    const drawer = (<List
            disablePadding
            sx={{
                flexGrow: 1, paddingTop: "16px",
            }}
        >
            {renderSider()}
        </List>);

    return (<div onContextMenu={onContextMenu}>
            <Box
                sx={{
                    width: {xs: drawerWidth()}, display: {
                        xs: "none", md: "block",
                    }, transition: "width 0.3s ease",
                }}
            />
            <Box
                component="nav"
                sx={{
                    position: "fixed", zIndex: 2, width: {sm: drawerWidth()}, display: "flex",
                }}
            >
                <Drawer
                    variant="temporary"
                    elevation={2}
                    open={mobileSiderOpen}
                    onClose={() => setMobileSiderOpen(false)}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: {
                            sm: "block", md: "none",
                        },
                    }}
                >
                    <Box
                        sx={{
                            width: drawerWidth(),
                        }}
                    >
                        <Box
                            sx={{
                                height: 64,
                                display: "flex",
                                alignItems: "center",
                                paddingLeft: "16px",
                                fontSize: "14px",
                            }}
                        >
                            <RenderToTitle collapsed={false}/>
                        </Box>
                        {drawer}
                    </Box>
                </Drawer>
                <Drawer
                    variant="permanent"
                    anchor="left"
                    sx={{
                        display: {xs: "none", md: "block"}, width: drawerWidth, flexShrink: 0, "& .MuiDrawer-paper": {
                            width: drawerWidth(),
                            overflow: "hidden",
                            zIndex: 0,
                            transition: "width 200ms cubic-bezier(0.4, 0, 0.6, 1) 0ms",
                        },
                    }}
                    open
                >
                    <Paper
                        elevation={0}
                        sx={{
                            fontSize: "14px",
                            width: "100%",
                            height: 64,
                            display: "flex",
                            flexShrink: 0,
                            alignItems: "center",
                            justifyContent: siderCollapsed ? "center" : "space-between",
                            paddingLeft: siderCollapsed ? 0 : "16px",
                            paddingRight: siderCollapsed ? 0 : "8px",
                            variant: "outlined",
                            borderRadius: 0,
                            borderBottom: (theme) => `1px solid ${theme.palette.action.focus}`,
                        }}
                    >
                        <RenderToTitle collapsed={siderCollapsed}/>
                        {!siderCollapsed && (<IconButton size="small" onClick={() => setSiderCollapsed(true)}>
                                {<ChevronLeft/>}
                            </IconButton>)}
                    </Paper>
                    <Box
                        sx={{
                            flexGrow: 1, overflowX: "hidden", overflowY: "auto",
                        }}
                    >
                        {drawer}
                    </Box>
                </Drawer>
            </Box>
            {<ContextMenu contextMenu={contextMenu} close={close}/>}
        </div>);
};
