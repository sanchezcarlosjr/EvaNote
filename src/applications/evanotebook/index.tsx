import {IResourceComponentsProps, useGetIdentity} from "@refinedev/core";
import {BlockNoteView, useBlockNote} from "@blocknote/react";
import "@blocknote/react/style.css";
import {useContext} from "react";
import {ColorModeContext} from "../../contexts/color-mode";
import {Doc} from "yjs";
import {IndexeddbPersistence} from 'y-indexeddb';
import YPartyKitProvider from "y-partykit/provider";
import {useQuery} from "../../utility/useQuery";


export const Evanotebook: React.FC<IResourceComponentsProps> = () => {
    const {mode} = useContext(ColorModeContext);
    const {data: identity} = useGetIdentity<any>();
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

    return <BlockNoteView theme={mode as 'light' | 'dark'} editor={editor}/>;
};