import {Divider, Menu, MenuList} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import {
    ContentCopyOutlined,
    ContentCut,
    CopyAllOutlined,
    DeleteOutlineOutlined,
    DifferenceOutlined,
    DriveFileMoveOutlined,
    DriveFileRenameOutlineOutlined,
    EnhancedEncryptionOutlined, FileDownload,
    FileOpenOutlined,
    FolderCopyOutlined,
    HistoryOutlined,
    InsertLinkOutlined,
    LaunchOutlined,
    ShareOutlined,
    SortOutlined,
    StarBorderPurple500Outlined,
    TerminalOutlined
} from "@mui/icons-material";
import Typography from "@mui/material/Typography";
import React from "react";
import {useGo} from "@refinedev/core";

export function ContextMenu({contextMenu, close}: {
    contextMenu: { mouseX: number; mouseY: number; } | null,
    close: () => void
}) {
    const go = useGo();
    return <Menu
        open={contextMenu !== null}
        anchorReference="anchorPosition"
        anchorPosition={
            contextMenu !== null
                ? {top: contextMenu.mouseY, left: contextMenu.mouseX}
                : undefined
        }
        anchorOrigin={{
            vertical: 'center',
            horizontal: 'center',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
        }}
    >
        <MenuList dense>
            <MenuItem onClick={() => {
                close();
                go({
                   to: '/create',
                   type: "push",
                });
            }}>
                <ListItemText>New</ListItemText>
            </MenuItem>
            <Divider/>
            <MenuItem onClick={close}>
                <ListItemIcon>
                    <FileOpenOutlined fontSize="small"/>
                </ListItemIcon>
                <ListItemText>Open with EvaNotebook</ListItemText>
                <Typography variant="body2" color="text.secondary">
                </Typography>
            </MenuItem>
            <MenuItem onClick={close}>
                <ListItemIcon>
                    <FileOpenOutlined fontSize="small"/>
                </ListItemIcon>
                <ListItemText>Open with</ListItemText>
                <Typography variant="body2" color="text.secondary">
                </Typography>
            </MenuItem>
            <Divider/>
            <MenuItem onClick={close}>
                <ListItemIcon>
                    <ContentCut fontSize="small"/>
                </ListItemIcon>
                <ListItemText>Cut</ListItemText>
                <Typography variant="body2" color="text.secondary">
                </Typography>
            </MenuItem>
            <MenuItem onClick={close}>
                <ListItemIcon>
                    <ContentCopyOutlined fontSize="small"/>
                </ListItemIcon>
                <ListItemText>Copy</ListItemText>
                <Typography variant="body2" color="text.secondary">
                </Typography>
            </MenuItem>
            <MenuItem onClick={close}>
                <ListItemIcon>
                    <FolderCopyOutlined fontSize="small"/>
                </ListItemIcon>
                <ListItemText>Copy Location</ListItemText>
                <Typography variant="body2" color="text.secondary">
                </Typography>
            </MenuItem>
            <MenuItem onClick={close}>
                <ListItemIcon>
                    <FolderCopyOutlined fontSize="small"/>
                </ListItemIcon>
                <ListItemText>Copy Name</ListItemText>
            </MenuItem>
            <MenuItem onClick={close}>
                <ListItemIcon>
                    <CopyAllOutlined fontSize="small"/>
                </ListItemIcon>
                <ListItemText>Duplicate Here</ListItemText>
                <Typography variant="body2" color="text.secondary">
                </Typography>
            </MenuItem>
            <MenuItem onClick={close}>
                <ListItemIcon>
                    <DriveFileRenameOutlineOutlined fontSize="small"/>
                </ListItemIcon>
                <ListItemText>Rename</ListItemText>
                <Typography variant="body2" color="text.secondary">
                </Typography>
            </MenuItem>
            <MenuItem onClick={close}>
                <ListItemIcon>
                    <DeleteOutlineOutlined fontSize="small"/>
                </ListItemIcon>
                <ListItemText>Move to Trash</ListItemText>
                <Typography variant="body2" color="text.secondary">
                </Typography>
            </MenuItem>
            <Divider/>
            <MenuItem onClick={close}>
                <ListItemIcon>
                    <SortOutlined fontSize="small"/>
                </ListItemIcon>
                <ListItemText>Sort by</ListItemText>
            </MenuItem>
            <MenuItem onClick={close}>
                <ListItemIcon>
                    <StarBorderPurple500Outlined fontSize="small"/>
                </ListItemIcon>
                <ListItemText>Add to Favorites</ListItemText>
                <Typography variant="body2" color="text.secondary">
                </Typography>
            </MenuItem>
            <MenuItem onClick={close}>
                <ListItemIcon>
                    <InsertLinkOutlined fontSize="small"/>
                </ListItemIcon>
                <ListItemText>Copy link</ListItemText>
                <Typography variant="body2" color="text.secondary">
                </Typography>
            </MenuItem>
            <MenuItem onClick={close}>
                <ListItemIcon>
                    <ShareOutlined fontSize="small"/>
                </ListItemIcon>
                <ListItemText>Share</ListItemText>
                <Typography variant="body2" color="text.secondary">
                </Typography>
            </MenuItem>
            <MenuItem onClick={close}>
                <ListItemIcon>
                    <FileDownload fontSize="small"/>
                </ListItemIcon>
                <ListItemText>Export</ListItemText>
                <Typography variant="body2" color="text.secondary">
                </Typography>
            </MenuItem>
            <MenuItem onClick={close}>
                <ListItemIcon>
                    <DriveFileMoveOutlined fontSize="small"/>
                </ListItemIcon>
                <ListItemText>Move to</ListItemText>
                <Typography variant="body2" color="text.secondary">
                </Typography>
            </MenuItem>
            <MenuItem onClick={close}>
                <ListItemIcon>
                    <LaunchOutlined fontSize="small"/>
                </ListItemIcon>
                <ListItemText>Open in new tab</ListItemText>
                <Typography variant="body2" color="text.secondary">
                </Typography>
            </MenuItem>
            <MenuItem onClick={close}>
                <ListItemIcon>
                    <DifferenceOutlined fontSize="small"/>
                </ListItemIcon>
                <ListItemText>Compare with</ListItemText>
                <Typography variant="body2" color="text.secondary">
                </Typography>
            </MenuItem>
            <Divider/>
            <MenuItem onClick={close}>
                <ListItemText>Properties</ListItemText>
            </MenuItem>
            <MenuItem onClick={close}>
                <ListItemText>View mode</ListItemText>
            </MenuItem>
            <MenuItem onClick={close}>
                <ListItemIcon>
                    <TerminalOutlined fontSize="small"/>
                </ListItemIcon>
                <ListItemText>Open terminal here</ListItemText>
                <Typography variant="body2" color="text.secondary">
                </Typography>
            </MenuItem>
            <MenuItem onClick={close}>
                <ListItemIcon>
                    <EnhancedEncryptionOutlined fontSize="small"/>
                </ListItemIcon>
                <ListItemText>Sign & Encrypt</ListItemText>
                <Typography variant="body2" color="text.secondary">
                </Typography>
            </MenuItem>
            <MenuItem onClick={close}>
                <ListItemText>Show additional information</ListItemText>
            </MenuItem>
            <MenuItem onClick={close}>
                <ListItemIcon>
                    <HistoryOutlined fontSize="small"/>
                </ListItemIcon>
                <ListItemText>Show History</ListItemText>
                <Typography variant="body2" color="text.secondary">
                </Typography>
            </MenuItem>
        </MenuList>
    </Menu>;
}