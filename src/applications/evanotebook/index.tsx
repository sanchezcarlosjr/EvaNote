import {IResourceComponentsProps, useGetIdentity} from "@refinedev/core";
import { BlockNoteEditor } from "@blocknote/core";
import { BlockNoteView, useBlockNote } from "@blocknote/react";
import "@blocknote/react/style.css";
import {useContext, useEffect, useMemo, useState} from "react";
import {ColorModeContext} from "../../contexts/color-mode";
import {useLocation} from "react-router-dom";
import {Doc} from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { IndexeddbPersistence } from 'y-indexeddb';
import {Web} from "@mui/icons-material";
import YPartyKitProvider from "y-partykit/provider";

// TODO: move to some specific package
function useQuery() {
    const { search } = useLocation();

    return useMemo(() => new URLSearchParams(search), [search]);
}



export const Evanotebook: React.FC<IResourceComponentsProps> = () => {
    const { mode } = useContext(ColorModeContext);
    const { data: identity } = useGetIdentity<any>();
    const url = useQuery();
    const room = url.get("uri") ?? "file:///tmp/getting-started";

    const doc = new Doc();
    new IndexeddbPersistence(room, doc);
    const provider = new YPartyKitProvider(
        "blocknote-dev.yousefed.partykit.dev",
        room,
        doc
    );

    const editor = useBlockNote({
        collaboration: {
            provider,
            fragment: doc.getXmlFragment("document-store"),
            user: {
                name: identity?.email ?? "",
                color: identity?.color ?? "",
            },
        }
    });


    if (!identity && !identity?.color)
        return <>Loading</>;


    editor.updateCollaborationUserInfo({
        name: identity?.email ?? "",
        color: identity?.color ?? "",
    })

    return <BlockNoteView theme={mode} editor={editor} />;
};