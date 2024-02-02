import DarkModeOutlined from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlined from "@mui/icons-material/LightModeOutlined";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import {useGetIdentity, useGetLocale, useSetLocale} from "@refinedev/core";
import {HamburgerMenu, RefineThemedLayoutV2HeaderProps} from "@refinedev/mui";
import i18n from "i18next";
import React, {useContext} from "react";
import {ColorModeContext} from "../../contexts/color-mode";

type IUser = {
    id: number;
    name: string;
    avatar: string;
};

export const Header: React.FC<RefineThemedLayoutV2HeaderProps> = ({
                                                                      sticky = true,
                                                                  }) => {

    return (
        <Toolbar>
            <Stack direction="row" width="100%" alignItems="center">
                <HamburgerMenu/>
            </Stack>
        </Toolbar>
    );
};
