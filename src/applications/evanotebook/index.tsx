import {IResourceComponentsProps, useGetIdentity, useResource} from "@refinedev/core";
import {
    BlockNoteView,
    DefaultReactSuggestionItem,
    getDefaultReactSlashMenuItems,
    SuggestionMenuController
} from "@blocknote/react";
import "@blocknote/react/style.css";
import './styles.css';
import React, {useContext, useMemo} from "react";
import {ColorModeContext} from "../../contexts/color-mode";
import {Doc, PermanentUserData} from "yjs";
import {IndexeddbPersistence} from 'y-indexeddb';
import YPartyKitProvider from "y-partykit/provider";
import {CircularProgress} from "@mui/material";
import {MathExtension} from "tiptap-math-extension";
import "katex/dist/katex.min.css";
import {
    BlockNoteEditor,
    BlockNoteSchema,
    defaultBlockSpecs,
    filterSuggestionItems,
    insertOrUpdateBlock
} from "@blocknote/core";
import {Code} from '@mui/icons-material';
import {Identity} from "../../providers/identity";
import {codeblock} from "./output";
import {mermaidblock} from "./mermaidChart";

const schema = BlockNoteSchema.create({
    blockSpecs: {
        ...defaultBlockSpecs, codeblock: codeblock, mermaidblock: mermaidblock
    },
});

const insertCode = (editor: typeof schema.BlockNoteEditor) => ({
    title: "Code block", onItemClick: () => {
        insertOrUpdateBlock(editor, {
            type: "codeblock",
        });
    }, hint: "Add a live code block", aliases: ["code", "python", "c++"], group: "Code", icon: <Code/>
});

const insertMermaid = (editor: typeof schema.BlockNoteEditor) => ({
    title: "Mermaid", onItemClick: () => {
        insertOrUpdateBlock(editor, {
            type: "mermaidblock",
        });
    }, hint: "Add a Mermaid code block", aliases: ["code", "mermaid"], group: "Code", icon: <Code/>
});


// List containing all default Slash Menu Items, as well as our custom one.
const getCustomSlashMenuItems = (editor: typeof schema.BlockNoteEditor): DefaultReactSuggestionItem[] => [...getDefaultReactSlashMenuItems(editor), insertMermaid(editor), insertCode(editor)];


const Application: React.FC<IResourceComponentsProps> = () => {
    const {mode} = useContext(ColorModeContext);
    const {data: identity} = useGetIdentity<Identity>();
    const {resource} = useResource();

    const name: string = resource?.meta?.uri || resource?.name || "";

    const editor: typeof schema.BlockNoteEditor  = useMemo(() => {
        const doc = new Doc();
        const permantentUserData = new PermanentUserData(doc);
        new IndexeddbPersistence(name, doc);
        permantentUserData.setUserMapping(doc, doc.clientID, identity?.id ?? "");
        return BlockNoteEditor.create({
            collaboration: {
                provider: new YPartyKitProvider("blocknote-dev.yousefed.partykit.dev", name, doc),
                fragment: doc.getXmlFragment("document-store"),
                user: {
                    name: identity?.email ?? "", color: identity?.color ?? "",
                }
            }, schema, _tiptapOptions: {
                extensions: [MathExtension]
            }
        });
    }, [identity?.color, identity?.email, identity?.id, name]);

    if (editor === undefined) return <CircularProgress/>;

    return <BlockNoteView
        editable={editor && !!resource?.edit}
        theme={mode as 'light' | 'dark'} editor={editor} slashMenu={false}>
        <SuggestionMenuController
            triggerCharacter={"/"}
            // Replaces the default Slash Menu items with our custom ones.
            getItems={async (query) => filterSuggestionItems(getCustomSlashMenuItems(editor), query)}
        />
    </BlockNoteView>;
};

export default Application;
