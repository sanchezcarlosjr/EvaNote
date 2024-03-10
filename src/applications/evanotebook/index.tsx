import {IResourceComponentsProps, useGetIdentity, useGo, useNotification, useResource} from "@refinedev/core";
import {
    BlockNoteView,
    createReactBlockSpec, DragHandle,
    getDefaultReactSlashMenuItems, SideMenu, SideMenuButton, SideMenuPositioner,
    SideMenuProps,
    AddBlockButton,
    useBlockNote,
    DefaultSideMenu
} from "@blocknote/react";
import "@blocknote/react/style.css";
import './styles.css';
import React, {useContext, useState} from "react";
import {ColorModeContext} from "../../contexts/color-mode";
import {Doc, PermanentUserData} from "yjs";
import {IndexeddbPersistence} from 'y-indexeddb';
import YPartyKitProvider from "y-partykit/provider";
import {useQuery} from "../../utility/useQuery";
import {Button, CircularProgress, useMediaQuery} from "@mui/material";
import {MathExtension} from "tiptap-math-extension";
import "katex/dist/katex.min.css";
import {
    BlockNoteEditor,
    DefaultBlockSchema,
    defaultBlockSpecs,
    formatKeyboardShortcut,
    defaultProps,
    PartialBlock
} from "@blocknote/core";
import {Code, PlayArrow, PlayCircle} from '@mui/icons-material';
import CodeMirror, {keymap, Prec} from '@uiw/react-codemirror';
import {python} from '@codemirror/lang-python';
import {materialDark, materialDarkInit, materialLight, materialLightInit} from '@uiw/codemirror-theme-material';
import {color, colorView, colorTheme} from '@uiw/codemirror-extensions-color';
import {hyperLink, hyperLinkExtension, hyperLinkStyle} from '@uiw/codemirror-extensions-hyper-link';
import { IconButton, Tooltip } from '@mui/material';
import _ from 'lodash';
import Typography from "@mui/material/Typography";
import {Identity} from "../../providers/identity";
import {redirect} from "react-router-dom";

let pyodide: any = null;

async function importPyodide() {
    if (pyodide)
        return pyodide;
    // @ts-ignore
    pyodide = await window.loadPyodide();
    return pyodide;
}

const codeblock = createReactBlockSpec({
    type: "codeblock", propSchema: {
        code: {
            default: ""
        },
    }, content: "none",
}, {
    render: (props) => {
        const {mode} = useContext(ColorModeContext);
        const { open, close } = useNotification();
        const [output, write] = useState<string>("");
        return (<div>
            <CodeMirror
                value={props.block.props.code}
                onChange={(code) => {
                    props.editor.updateBlock(props.block, {
                        type: "codeblock", props: {code},
                    });
                }}
                extensions={[
                    Prec.highest(
                        keymap.of([
                            { key: "Mod-Enter", run: (command) => {
                                    open?.({
                                        type: "progress",
                                        message: "We've begun executing your code.",
                                        description: "Loading...",
                                    });
                                    importPyodide().then(pyodide => {
                                        pyodide.setStdin({ stdin: () => prompt() });
                                        pyodide.setStderr({ stdin: (output: React.SetStateAction<string>) => write(output) });
                                        pyodide.setStdout({
                                            batched: (input: string) => {
                                                write(input);
                                            }
                                        });
                                        return pyodide.runPythonAsync(command.state.doc.toString());
                                    }).then(x => write(x)).catch(
                                        output => write(output.message)
                                    );
                                    return true;
                                }
                            }
                        ])
                    ),
                    python(), color, hyperLink
                ]}
                theme={mode === "dark" ? materialDark : materialLight}
            />
            <pre>
                {output}
            </pre>
        </div>)
    }
});

function insertOrUpdateBlock<BSchema extends DefaultBlockSchema>(editor: BlockNoteEditor<BSchema>, block: PartialBlock<BSchema, any, any>,) {
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
    const {data: identity} = useGetIdentity<Identity>();
    const url = useQuery();
    const uri = url.get("uri") ?? "browser:/tmp/getting-started.nb";
    const resource = useResource(new URL(uri).pathname);
    const go = useGo();

    if (!resource.resource.list) {
        go({
            to: "/not-found"
        });
        return null;
    }

    const doc = new Doc();
    new IndexeddbPersistence(uri, doc);
    const permantentUserData = new PermanentUserData(doc);

    const provider = new YPartyKitProvider("blocknote-dev.yousefed.partykit.dev", uri, doc);

    const editor = useBlockNote({
        collaboration: {
            provider, fragment: doc.getXmlFragment("document-store"), user: {
                name: identity?.email ?? "", color: identity?.color ?? "",
            },
        }, blockSpecs: {
            ...defaultBlockSpecs, codeblock: codeblock
        }, slashMenuItems: [...getDefaultReactSlashMenuItems(), {
            name: "Code block", execute: (editor) => insertOrUpdateBlock(editor, {
                type: "codeblock",
            }), aliases: ["code"], // @ts-ignore
            hint: "Add a live code block", group: "Code", icon: <Code/>,
        },], _tiptapOptions: {
            extensions: [MathExtension]
        }
    }, [uri]);

    if (!identity && !identity?.color) return <CircularProgress/>;


    editor.updateCollaborationUserInfo({
        name: identity?.email ?? "", color: identity?.color ?? "",
    });

    permantentUserData.setUserMapping(doc, doc.clientID, identity?.id ?? "");

    return <BlockNoteView theme={mode as 'light' | 'dark'} editor={editor} />;
};

export default Application;