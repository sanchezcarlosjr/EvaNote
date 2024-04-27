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
import {useForm, useGo, useResource} from "@refinedev/core";
import {useClipboard} from "../../browserApis/clipboard";
import {Doc,applyUpdate,encodeStateAsUpdate, encodeStateVector} from "yjs";
import {IndexeddbPersistence} from "y-indexeddb";
import YPartyKitProvider from "y-partykit/provider";

type ContextMenuEvent = { mouseX: number; mouseY: number; item_id?: string } | null;

export function ContextMenu(props: {
    contextMenu: ContextMenuEvent,
    close: () => void
}) {
    const {contextMenu, close} = props;
    const go = useGo();
    const {resource} = useResource(contextMenu?.item_id);
    const {writeText} = useClipboard();
    const {
        onFinish
    } = useForm<any, any, any, any>({
        action: "create",
        resource: "resources",
        redirect: false
    });
    if (!contextMenu)
        return null;
    return <Menu
        open={true}
        anchorReference="anchorPosition"
        anchorPosition={
            {top: contextMenu.mouseY, left: contextMenu.mouseX}
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
                   to: `/resources/new${contextMenu?.item_id ? `?parent=${contextMenu?.item_id}` : ""}`,
                   type: "push",
                });
            }}>
                <ListItemText>New</ListItemText>
            </MenuItem>
            <Divider/>
            <MenuItem onClick={() => {
                close();
                writeText(resource?.list as string).then();
            }} data-test="copy-location">
                <ListItemIcon>
                    <FolderCopyOutlined fontSize="small"/>
                </ListItemIcon>
                <ListItemText>Copy Location</ListItemText>
                <Typography variant="body2" color="text.secondary">
                </Typography>
            </MenuItem>
            <MenuItem onClick={() => {
                close();
                writeText(resource?.meta?.label as string).then();
            }}>
                <ListItemIcon>
                    <FolderCopyOutlined fontSize="small"/>
                </ListItemIcon>
                <ListItemText>Copy Name</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => {
                const name = contextMenu?.item_id as string;
                const oldDoc = new Doc();
                new IndexeddbPersistence(name, oldDoc);
                const stateVector = encodeStateVector(oldDoc);
                const update = encodeStateAsUpdate(oldDoc, stateVector);
                const newDoc = new Doc();
                applyUpdate(newDoc, update);
                const newName = crypto.randomUUID();
                new YPartyKitProvider("blocknote-dev.yousefed.partykit.dev", newName, newDoc)
                new IndexeddbPersistence(newName, oldDoc);
                onFinish({
                    name: newName,
                    parent: resource?.meta?.parent ?? undefined,
                    meta: {
                        label: resource?.meta?.label || alert(),
                        'content-type': 'nb'
                    }
                }).then();
            }}>
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
            <MenuItem onClick={() => {
                close();
                writeText(import.meta.env.VITE_HOSTNAME_URL+resource?.list as string).then();
            }}>
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
            <MenuItem
                component="a"
                href={import.meta.env.VITE_HOSTNAME_URL+resource?.list as string} target={'_blank'}>
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