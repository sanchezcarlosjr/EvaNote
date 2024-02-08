import {IResourceComponentsProps, useGetIdentity} from "@refinedev/core";
import {BlockNoteView, useBlockNote} from "@blocknote/react";
import "@blocknote/react/style.css";
import './styles.css';
import React, {useContext} from "react";
import {ColorModeContext} from "../../contexts/color-mode";
import {Doc} from "yjs";
import {IndexeddbPersistence} from 'y-indexeddb';
import YPartyKitProvider from "y-partykit/provider";
import {useQuery} from "../../utility/useQuery";
import {Button, CircularProgress, useMediaQuery} from "@mui/material";
import { MathExtension } from "tiptap-math-extension";
import "katex/dist/katex.min.css";
const Application: React.FC<IResourceComponentsProps> = () => {
    const {mode} = useContext(ColorModeContext);
    const {data: identity} = useGetIdentity<any>();
    const url = useQuery();
    const uri = url.get("uri") ?? "browser:/tmp/getting-started.nb";

    const doc = new Doc();
    new IndexeddbPersistence(uri, doc);
    const provider = new YPartyKitProvider("blocknote-dev.yousefed.partykit.dev", uri, doc);

    const editor = useBlockNote({
        collaboration: {
            provider, fragment: doc.getXmlFragment("document-store"), user: {
                name: identity?.email ?? "", color: identity?.color ?? "",
            },
        },
        _tiptapOptions: {
            extensions: [MathExtension]
        }
    });

    if (!identity && !identity?.color) return <CircularProgress/>;


    editor.updateCollaborationUserInfo({
        name: identity?.email ?? "", color: identity?.color ?? "",
    });


    return <BlockNoteView theme={mode as 'light' | 'dark'} editor={editor}/>;
};

export default Application;