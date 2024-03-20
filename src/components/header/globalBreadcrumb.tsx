import {useBreadcrumb} from "./useBreadcrumb";
import {IResourceItem, useLink} from "@refinedev/core";
import {Breadcrumbs, Link} from "@mui/material";
import React from "react";

export const GlobalBreadcrumb = () => {
    const path = useBreadcrumb();
    const link = useLink();

    return <Breadcrumbs aria-label="breadcrumb">
        {path.map((resource: IResourceItem) => <Link sx={{
            display: "flex",
            alignItems: "center",
            "& .MuiSvgIcon-root": {
                fontSize: "20px",
                mr: '0.3em'
            },
        }} key={resource.name} underline="hover" color="inherit"
                                                     component={link} to={resource.list ?? ""}>
            {resource.meta?.icon}
            {resource.meta?.label}
        </Link>)}
    </Breadcrumbs>
}