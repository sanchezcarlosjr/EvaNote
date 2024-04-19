import React, {useContext} from "react";
import {RefineThemedLayoutV2HeaderProps, ThemedTitleV2} from "@refinedev/mui";
import {AppIcon} from "../app-icon";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import {useActiveAuthProvider, useGetIdentity, useGetLocale, useLogout, useSetLocale} from "@refinedev/core";
import {capitalize, ListItemIcon, Popover} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import i18n from "i18next";
import MenuItem from "@mui/material/MenuItem";
import {ColorModeContext} from "../../contexts/color-mode";
import {ContentPaste, LogoutOutlined} from "@mui/icons-material";
import ListItemText from "@mui/material/ListItemText";
import LightModeOutlined from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlined from "@mui/icons-material/DarkModeOutlined";

export const Title = ({collapsed = true,}) => {
    const authProvider = useActiveAuthProvider();
    const { data: user } = useGetIdentity({
        v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
    });
    const { mode, setMode } = useContext(ColorModeContext);


    const changeLanguage = useSetLocale();
    const locale = useGetLocale();
    const currentLocale = locale();
    const { mutate: logout } = useLogout();


    const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);

    const onStackClick = (event:  React.MouseEvent<HTMLDivElement>) => setAnchorEl(event.currentTarget);

    const onClosePopover = (e: Event) => {
        e.preventDefault();
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'title-popover' : undefined;

    return   <>
        <Stack
            direction="row"
            width="100%"
            justifyContent="center"
            alignItems="center"
        >
            <Stack
                direction="row"
                gap="16px"
                alignItems="center"
                justifyContent="center"
                onClick={onStackClick}
            >
                {(user?.avatar || user?.name) && (
                    <Stack
                        direction="row"
                        gap="6px"
                        alignItems="center"
                        justifyContent="center"
                    >
                            <Avatar sx={{ width: 24, height: 24 }} src={user?.avatar} alt={user?.name} />

                            {user?.name && !collapsed && (
                                <Typography
                                    sx={{
                                        display: {
                                            xs: "none",
                                            sm: "inline-block",
                                        },
                                    }}
                                    variant="subtitle2"
                                >
                                    {user?.name}
                                </Typography>
                            )}
                    </Stack>
                )}
            </Stack>
        </Stack>

        <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={onClosePopover}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
        >
            <MenuItem>
                <FormControl sx={{ minWidth: 64 }}>
                    <Select
                        disableUnderline
                        defaultValue={currentLocale}
                        inputProps={{ "aria-label": "Without label" }}
                        variant="standard"
                        sx={{
                            color: "inherit",
                            "& .MuiSvgIcon-root": {
                                color: "inherit",
                            },
                            "& .MuiStack-root > .MuiTypography-root": {
                                display: {
                                    xs: "none",
                                    sm: "block",
                                },
                            },
                        }}
                    >
                        {[...(i18n.languages ?? [])].sort().map((lang: string) => (
                            // @ts-ignore
                            <MenuItem
                                selected={currentLocale === lang}
                                key={lang}
                                defaultValue={lang}
                                onClick={() => {
                                    changeLanguage(lang);
                                }}
                                value={lang}
                            >
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <Avatar
                                        sx={{
                                            width: "24px",
                                            height: "24px",
                                            marginRight: "5px",
                                        }}
                                        src={`${import.meta.env.BASE_URL}/images/flags/${lang}.svg`}
                                    />
                                    <Typography>
                                        {lang === "en" ? "English" : "German"}
                                    </Typography>
                                </Stack>
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </MenuItem>
            <MenuItem
                onClick={() => {
                    setMode();
                }}
            >
                <ListItemIcon color="inherit">
                    {mode === "dark" ? <LightModeOutlined fontSize="small" /> : <DarkModeOutlined fontSize="small"/>}
                </ListItemIcon>
                <ListItemText>{capitalize(mode)}</ListItemText>
            </MenuItem>

            <MenuItem
                onClick={() => {
                    logout({redirectPath: 'login'});
                }}
            >
                <ListItemIcon color="inherit">
                    <LogoutOutlined />
                </ListItemIcon>
                <ListItemText>Logout</ListItemText>
            </MenuItem>
        </Popover>
    </>;
}