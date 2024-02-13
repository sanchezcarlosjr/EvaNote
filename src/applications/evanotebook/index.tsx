import {IResourceComponentsProps, useGetIdentity} from "@refinedev/core";
import {BlockNoteView, createReactBlockSpec, getDefaultReactSlashMenuItems, useBlockNote} from "@blocknote/react";
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
import {BlockNoteEditor, DefaultBlockSchema, defaultBlockSpecs, formatKeyboardShortcut, defaultProps, PartialBlock} from "@blocknote/core";
import {Code} from '@mui/icons-material';


const codeblock = createReactBlockSpec(
    {
        type: "codeblock",
        propSchema: {
            src: {
                default:
                    "https://www.pulsecarshalton.co.uk/wp-content/uploads/2016/08/jk-placeholder-image.jpg",
            },
        },
        content: "none",
    },
    {
        render: (props) => (
            <img
                className={"simple-image"}
                src={props.block.props.src}
                alt="placeholder"
            />
        ),
    }
);

function insertOrUpdateBlock<BSchema extends DefaultBlockSchema>(
    editor: BlockNoteEditor<BSchema>,
    block: PartialBlock<BSchema, any, any>,
) {
    const currentBlock = editor.getTextCursorPosition().block;
    // @ts-ignore
    const hasContent: boolean = (currentBlock.content.length === 1 && currentBlock.content[0].type === "text" && currentBlock.content[0].text === "/") || currentBlock.content.length === 0;
    if (hasContent) {
        // @ts-ignore
        editor.updateBlock(currentBlock, block);
    } else {
        // @ts-ignore
        editor.insertBlocks([block], currentBlock, "after");
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        editor.setTextCursorPosition(editor.getTextCursorPosition().nextBlock!);
    }
}

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
        blockSpecs: {
            ...defaultBlockSpecs,
            codeblock: codeblock
        },
        slashMenuItems: [
            ...getDefaultReactSlashMenuItems(),
            {
                name: "Code block",
                execute: (editor) =>
                    insertOrUpdateBlock(editor, {
                        type: "codeblock",
                    }),
                aliases: ["code"],
                // @ts-ignore
                hint: "Add a live code block",
                group: "Code",
                icon: <Code />,
            },
        ],
        _tiptapOptions: {
            extensions: [MathExtension]
        }
    }, [uri]);

    if (!identity && !identity?.color) return <CircularProgress/>;


    editor.updateCollaborationUserInfo({
        name: identity?.email ?? "", color: identity?.color ?? "",
    });


    return <BlockNoteView theme={mode as 'light' | 'dark'} editor={editor}/>;
};

export default Application;