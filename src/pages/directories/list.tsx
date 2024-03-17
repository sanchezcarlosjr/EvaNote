import {IResourceComponentsProps, useResource, useTranslate} from "@refinedev/core";
import {ShowButton, useDataGrid} from "@refinedev/mui";
import {DataGrid, GridColDef, GridToolbar} from "@mui/x-data-grid";
import { List } from "@refinedev/mui";
import React from "react";
import {CircularProgress} from "@mui/material";
import Typography from "@mui/material/Typography";

export const DirectoryList: React.FC<IResourceComponentsProps> = () => {
    const translate = useTranslate();
    const {resource} = useResource();

    const { dataGridProps } = useDataGrid({
        resource: "resources",
        filters: {
            permanent: [
                {
                    field: "meta->>parent",
                    operator: "eq",
                    value: resource?.name ?? ""
                },
            ],
        },
    });

    const columns = React.useMemo<GridColDef[]>(
        () => [
            {
                field: "name",
                headerName: translate("table.name"),
                sortable: false,
                align: "center",
                headerAlign: "center",
                flex: 1
            },
            {
                field: "meta->>label",
                headerName: translate("table.label"),
                sortable: false,
                align: "center",
                headerAlign: "center",
                editable: true,
                flex: 1,
                valueGetter: (params) => params.row?.meta?.label ?? params.row?.meta?.uri ?? params.row?.name
            },
            {
                field: "actions",
                headerName: translate("table.actions"),
                sortable: false,
                renderCell: function render({ row }) {
                    return (
                        <>
                            <ShowButton hideText recordItemId={row.id} />
                        </>
                    );
                },
                align: "center",
                headerAlign: "center",
                minWidth: 80,
            },
        ],
        [translate],
    );

    if (!resource?.name)
        return <CircularProgress />

    return (
        <List
            title={<Typography variant="h5" gutterBottom>{resource.meta?.label ?? ""}</Typography>}
            canCreate={true}
        >
            <DataGrid
                {...dataGridProps}
                getRowId={(row) => row?.name}
                columns={columns}
                slots={{
                    toolbar: GridToolbar,
                }}
                checkboxSelection
                autoHeight
            />
        </List>
    );
};
