import {Breadcrumbs, IconButton, Link} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import {Breadcrumb, HamburgerMenu, RefineThemedLayoutV2HeaderProps} from "@refinedev/mui";
import React, {useContext, useEffect, useState} from "react";
import {HistoryOutlined, Comment, MoreHoriz} from "@mui/icons-material";
import Typography from "@mui/material/Typography";
import {useQuery} from "../../utility/useQuery";

type IUser = {
    id: number;
    name: string;
    avatar: string;
};

export const Header: React.FC<RefineThemedLayoutV2HeaderProps> = ({
                                                                      sticky = true,
                                                                  }) => {
    const params = useQuery();
    const uri = params.get('uri');
    const [path, setPath] = useState<string[]>([]);
    useEffect(() => {
        if (!uri)
            return;
        const url = new URL(uri);
        setPath([
            url.protocol.replace(":", ""),
            ...url.pathname.substring(1).split('/').filter(x => x),
        ]);
    }, [uri]);
    return (

        <Toolbar variant="dense">
            <Stack direction="row" width="100%" alignItems="center">
                <HamburgerMenu/>
                <Stack   direction="row"
                         width="100%"
                         justifyContent="flex-start"
                         alignItems="center">
                    <Breadcrumbs aria-label="breadcrumb">
                        {
                            path.map((pathname) => <Link key={pathname} underline="hover" color="inherit" href="#">
                                {pathname}
                            </Link>)
                        }
                    </Breadcrumbs>
                </Stack>
                <Stack
                    direction="row"
                    width="100%"
                    justifyContent="flex-end"
                    alignItems="center"
                >
                    <MenuItem aria-label="share-resource" disabled>Share</MenuItem>
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
    );
};
