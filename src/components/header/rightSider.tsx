import React, {useEffect, useState} from "react";
import {useThemedLayoutContext} from "../layout/useThemedLayoutContext";
import Drawer from "@mui/material/Drawer";
import {IconButton} from "@mui/material";
import {Close} from "@mui/icons-material";

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