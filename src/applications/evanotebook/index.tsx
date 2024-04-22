import {IResourceComponentsProps, useGetIdentity, useResource} from "@refinedev/core";
import {
    BasicTextStyleButton,
    BlockNoteView,
    BlockTypeSelect,
    ColorStyleButton,
    CreateLinkButton,
    DefaultReactSuggestionItem,
    FormattingToolbar,
    FormattingToolbarController,
    getDefaultReactSlashMenuItems,
    ImageCaptionButton,
    NestBlockButton,
    ReplaceImageButton,
    SuggestionMenuController,
    TextAlignButton,
    UnnestBlockButton
} from "@blocknote/react";
import "@blocknote/react/style.css";
import React, {useContext, useMemo} from "react";
import {ColorModeContext} from "../../contexts/color-mode";
import {Doc, PermanentUserData} from "yjs";
import {IndexeddbPersistence} from 'y-indexeddb';
import YPartyKitProvider from "y-partykit/provider";
import {CircularProgress} from "@mui/material";
import {MathExtension} from "tiptap-math-extension";
import "katex/dist/katex.min.css";
import {
    BlockNoteEditor, BlockNoteSchema, defaultBlockSpecs, filterSuggestionItems, insertOrUpdateBlock
} from "@blocknote/core";
import {Announcement, Code, FormatListNumbered, QuestionMarkOutlined} from '@mui/icons-material';
import {Identity} from "../../providers/identity";
import {codeblock} from "./codeBlock";
import {mermaidblock} from "./mermaidChart";
import {AIButton} from "./AIButton";
import {Alert} from "./Alert";

const schema = BlockNoteSchema.create({
    blockSpecs: {
        ...defaultBlockSpecs, codeblock: codeblock, mermaidblock: mermaidblock,  alert: Alert,
    },
});

const insertCode = (editor: typeof schema.BlockNoteEditor) => ({
    title: "Code block",
    onItemClick: () => {
        insertOrUpdateBlock(editor, {
            type: "codeblock",
        });
    },
    subtext: "Add a live code block",
    aliases: ["code", "python", "c++"],
    group: "Code",
    icon: <Code fontSize={"small"}/>
});

const insertMermaid = (editor: typeof schema.BlockNoteEditor) => ({
    title: "Mermaid",
    onItemClick: () => {
        insertOrUpdateBlock(editor, {
            type: "mermaidblock",
        });
    },
    subtext: "Add a Mermaid code block",
    aliases: ["code", "mermaid"],
    group: "Code",
    icon: <Code fontSize={"small"}/>
});


// Slash menu item to insert an Alert block
const insertAlert = (editor: typeof schema.BlockNoteEditor) => ({
    title: "Alert",
    onItemClick: () => {
        insertOrUpdateBlock(editor, {
            type: "alert",
        });
    },
    aliases: [
        "alert",
        "notification",
        "emphasize",
        "warning",
        "error",
        "info",
        "success",
    ],
    group: "Other",
    icon: <Announcement />,
});

// List containing all default Slash Menu Items, as well as our custom one.
const getCustomSlashMenuItems = (editor: typeof schema.BlockNoteEditor): DefaultReactSuggestionItem[] => [...getDefaultReactSlashMenuItems(editor), insertMermaid(editor), insertCode(editor), insertAlert(editor)];

const Application: React.FC<IResourceComponentsProps> = () => {
    const {mode} = useContext(ColorModeContext);
    const {data: identity} = useGetIdentity<Identity>();
    const {resource} = useResource();

    const name: string = resource?.meta?.uri || resource?.name || "";

    const editor: typeof schema.BlockNoteEditor = useMemo(() => {
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
        theme={mode as 'light' | 'dark'} editor={editor} slashMenu={false} formattingToolbar={false}>
        <SuggestionMenuController
            triggerCharacter={"/"}
            // Replaces the default Slash Menu items with our custom ones.
            getItems={async (query) => filterSuggestionItems(getCustomSlashMenuItems(editor), query)}
        />
        <FormattingToolbarController
            formattingToolbar={() => (<FormattingToolbar>
                <AIButton mainTooltip={'Explain this'} shortcut={'Mod+J'}
                          userPrompt={'Explicame lo que sigue: {{selection}}'}>
                    <QuestionMarkOutlined fontSize={"small"}/>
                </AIButton>
                <AIButton mainTooltip={'Exmples'} shortcut={'Mod+Q'}
                          userPrompt={'Dame ejemplos claros y distintos tal que sean suficientes para realizar pruebas significativas: {{selection}}'}>
                    <FormatListNumbered fontSize={"small"}/>
                </AIButton>

                <BlockTypeSelect key={"blockTypeSelect"}/>

                <ImageCaptionButton key={"imageCaptionButton"}/>
                <ReplaceImageButton key={"replaceImageButton"}/>

                <BasicTextStyleButton
                    basicTextStyle={"bold"}
                    key={"boldStyleButton"}
                />
                <BasicTextStyleButton
                    basicTextStyle={"italic"}
                    key={"italicStyleButton"}
                />
                <BasicTextStyleButton
                    basicTextStyle={"underline"}
                    key={"underlineStyleButton"}
                />
                <BasicTextStyleButton
                    basicTextStyle={"strike"}
                    key={"strikeStyleButton"}
                />
                {/* Extra button to toggle code styles */}
                <BasicTextStyleButton
                    key={"codeStyleButton"}
                    basicTextStyle={"code"}
                />

                <TextAlignButton
                    textAlignment={"left"}
                    key={"textAlignLeftButton"}
                />
                <TextAlignButton
                    textAlignment={"center"}
                    key={"textAlignCenterButton"}
                />
                <TextAlignButton
                    textAlignment={"right"}
                    key={"textAlignRightButton"}
                />

                <ColorStyleButton key={"colorStyleButton"}/>

                <NestBlockButton key={"nestBlockButton"}/>
                <UnnestBlockButton key={"unnestBlockButton"}/>

                <CreateLinkButton key={"createLinkButton"}/>
            </FormattingToolbar>)}
        />
    </BlockNoteView>;
};

export default Application;
