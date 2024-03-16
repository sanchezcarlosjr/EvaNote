import {
    IResourceComponentsProps,
    IResourceItem,
    useCan,
    useGetIdentity,
    useNotification,
    useResource
} from "@refinedev/core";
import {BlockNoteView, createReactBlockSpec, getDefaultReactSlashMenuItems, useBlockNote} from "@blocknote/react";
import "@blocknote/react/style.css";
import './styles.css';
import React, {useContext, useEffect, useRef, useState} from "react";
import {ColorModeContext} from "../../contexts/color-mode";
import {Doc, PermanentUserData} from "yjs";
import {IndexeddbPersistence} from 'y-indexeddb';
import YPartyKitProvider from "y-partykit/provider";
import {useQuery} from "../../utility/useQuery";
import {CircularProgress} from "@mui/material";
import {MathExtension} from "tiptap-math-extension";
import "katex/dist/katex.min.css";
import {BlockNoteEditor, DefaultBlockSchema, defaultBlockSpecs, PartialBlock} from "@blocknote/core";
import {Code} from '@mui/icons-material';
import CodeMirror, {keymap, Prec} from '@uiw/react-codemirror';
import {python} from '@codemirror/lang-python';
import {materialDark, materialLight} from '@uiw/codemirror-theme-material';
import {color} from '@uiw/codemirror-extensions-color';
import {hyperLink} from '@uiw/codemirror-extensions-hyper-link';
import {Identity} from "../../providers/identity";
import mermaid from "mermaid";

let pyodide: any = null;

mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'loose',
    theme: 'forest',
});

mermaid.run({
    suppressErrors: true,
});

async function importPyodide() {
    if (pyodide) return pyodide;
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
        const {open, close} = useNotification();
        const [output, write] = useState<string>("");
        return (<div>
            <CodeMirror
                editable={props.editor.isEditable}
                value={props.block.props.code}
                onChange={(code) => {
                    props.editor.updateBlock(props.block, {
                        type: "codeblock", props: {code},
                    });
                }}
                extensions={[Prec.highest(keymap.of([{
                    key: "Mod-Enter", run: (command) => {
                        open?.({
                            type: "progress", message: "We've begun executing your code.", description: "Loading...",
                        });
                        importPyodide().then(pyodide => {
                            pyodide.setStdin({stdin: () => prompt()});
                            pyodide.setStderr({stdin: (output: React.SetStateAction<string>) => write(output)});
                            pyodide.setStdout({
                                batched: (input: string) => {
                                    write(input);
                                }
                            });
                            return pyodide.runPythonAsync(command.state.doc.toString());
                        }).then(x => write(x)).catch(output => write(output.message));
                        return true;
                    }
                }])), python(), color, hyperLink]}
                theme={mode === "dark" ? materialDark : materialLight}
            />
            <pre>
                {output}
            </pre>
        </div>)
    }
});

const MermaidChart = ({ chart }: {chart: string}) => {
    const {mode} = useContext(ColorModeContext);
    const mermaidRef = useRef(null);
    const [svg, setSvg] = useState('');
    const diagramId = `mermaid-${Math.floor(Math.random() * 1000000)}`;

    chart = chart.replace("$EVANOTE_THEME", mode == "dark" ? "dark" : "forest");

    useEffect(() => {
        if (chart && mermaidRef.current) {
            try {
                mermaid.render(diagramId, chart).then(x => setSvg(x.svg));
            } catch (error) {
                console.error('Failed to render Mermaid chart:', error);
                setSvg('<p>Error rendering Mermaid chart</p>');
            }
        }
    }, [chart]);

    return <div ref={mermaidRef} dangerouslySetInnerHTML={{ __html: svg }} />;
};

const mermaidblock = createReactBlockSpec({
    type: "mermaidblock", propSchema: {
        code: {
            default: ""
        },
    }, content: "none",
}, {
    render: (props) => {
        const {mode} = useContext(ColorModeContext);
        const [input, setInput] = useState(props.block.props.code);

        return (<div>
            {
                props.editor.isEditable ? <CodeMirror
                    value={props.block.props.code}
                    onChange={(code) => {
                        props.editor.updateBlock(props.block, {
                            type: "mermaidblock", props: {code},
                        });
                        setInput(code);
                    }}
                    extensions={[color, hyperLink]}
                    theme={mode === "dark" ? materialDark : materialLight}
                /> : null
            }
            <MermaidChart chart={input} ></MermaidChart>
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
    const {resource} = useResource();

    const name = resource?.name ?? "getting-started";

    const doc = new Doc();
    new IndexeddbPersistence(name, doc);
    const permantentUserData = new PermanentUserData(doc);

    const provider = new YPartyKitProvider("blocknote-dev.yousefed.partykit.dev", name, doc);

    const editor = useBlockNote({
        editable: true,
        collaboration: {
            provider, fragment: doc.getXmlFragment("document-store"), user: {
                name: identity?.email ?? "", color: identity?.color ?? "",
            },
        }, blockSpecs: {
            ...defaultBlockSpecs,
            codeblock,
            mermaidblock
        },
        slashMenuItems: [
            ...getDefaultReactSlashMenuItems(),
            {
                name: "Code block", execute: (editor) => insertOrUpdateBlock(editor, {
                    type: "codeblock",
                }),
                aliases: ["code"],
                // @ts-ignore
                hint: "Add a live code block", group: "Code", icon: <Code/>
            },
            {
                name: "Mermaid", execute: (editor) => insertOrUpdateBlock(editor, {
                    type: "mermaidblock",
                }),
                aliases: ["mermaid"],
                // @ts-ignore
                hint: "Add a diagram generator block", group: "Code", icon: <Code/>
            }
        ], _tiptapOptions: {
            extensions: [MathExtension]
        }
    }, [name]);


    editor.updateCollaborationUserInfo({
        name: identity?.email ?? "", color: identity?.color ?? "",
    });

    permantentUserData.setUserMapping(doc, doc.clientID, identity?.id ?? "");

    // @ts-ignore
    if (!identity && !identity?.color) return <CircularProgress/>;


    return <BlockNoteView theme={mode as 'light' | 'dark'} editor={editor}/>;
};

export default Application;
