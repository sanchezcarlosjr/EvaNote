import React, {useContext, useEffect, useRef, useState} from "react";
import {useThemedLayoutContext} from "../layout/useThemedLayoutContext";
import Drawer from "@mui/material/Drawer";
import {IconButton} from "@mui/material";
import {Close} from "@mui/icons-material";
import {ColorModeContext} from "../../contexts/color-mode";

export const RightSider = () => {
    const [drawerWidth, setDrawerWidth] = useState('0');
    const ref = useRef<HTMLDivElement>(null);
    const {
        rightSiderWidget, setRightSiderWidget
    } = useThemedLayoutContext();

    const {mode} = useContext(ColorModeContext);

    function clear() {
        setDrawerWidth('0');
        setRightSiderWidget("");
    }

    useEffect(() => {
        if (!rightSiderWidget) return;
        setDrawerWidth('30vw');
        for (const child of ref.current?.children ?? []) {
            child.setAttribute('theme_mode', mode);
            child.setAttribute('class', mode);
        }
    }, [rightSiderWidget, mode]);

    return <Drawer
        variant="permanent"
        anchor="right"
        sx={{
            width: drawerWidth, flexShrink: 0, "& .MuiDrawer-paper": {
                width: drawerWidth,
                'overflow-y': "auto",
                'overflow-x': "hidden",
                zIndex: 0,
                transition: "width 200ms cubic-bezier(0.4, 0, 0.6, 1) 0ms",
            }
        }}
        open
    >
        <IconButton size="small" onClick={_ => clear()}>
            <Close/>
        </IconButton>
        <div ref={ref} dangerouslySetInnerHTML={{__html: rightSiderWidget}}></div>
    </Drawer>;
}