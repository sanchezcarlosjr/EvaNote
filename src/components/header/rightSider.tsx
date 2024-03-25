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

    const gradioApp = document.querySelector("gradio-app");
    gradioApp?.setAttribute('theme_mode', mode);
    gradioApp?.setAttribute('class', mode);

    useEffect(() => {
        if (!rightSiderWidget) return;
        setDrawerWidth('30vw');

        const gradioApp = document.querySelector("gradio-app");

        function handleLoadComplete() {
            gradioApp?.setAttribute('theme_mode', mode);
            gradioApp?.setAttribute('class', mode);
        }

        handleLoadComplete();

        gradioApp?.addEventListener("render", handleLoadComplete);
        return () => gradioApp?.removeEventListener("render", handleLoadComplete);
    }, [rightSiderWidget]);


    return <Drawer
        variant="permanent"
        anchor="right"
        sx={{
            width: drawerWidth, flexShrink: 0, "& .MuiDrawer-paper": {
                width: drawerWidth,
                overflowY: "auto",
                overflowX: "hidden",
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