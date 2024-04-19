import {createReactBlockSpec} from "@blocknote/react";
import React, {useContext, useState} from "react";
import {ColorModeContext} from "../../contexts/color-mode";
import Box from "@mui/material/Box";
import CodeMirror, {keymap, Prec} from "@uiw/react-codemirror";
import {python} from "@codemirror/lang-python";
import {color} from "@uiw/codemirror-extensions-color";
import {hyperLink} from "@uiw/codemirror-extensions-hyper-link";
import {materialDark, materialLight} from "@uiw/codemirror-theme-material";
import {CircularProgress, IconButton, Tooltip} from "@mui/material";
import {PlayCircle} from "@mui/icons-material";

let pyodide: any = null;

async function importPyodide() {
    if (pyodide) return pyodide;
    // @ts-ignore
    pyodide = await window.loadPyodide();
    return pyodide;
}

export const codeblock = createReactBlockSpec({
    type: "codeblock", propSchema: {
        code: {
            default: ""
        },
    }, content: "none",
}, {
    render: (props) => {
        const {mode} = useContext(ColorModeContext);
        const [output, write] = useState<string>("");
        const [isExecuting, setExecutingState] = useState(false);

        function execute(code: string) {
            setExecutingState(true);
            write("");
            importPyodide().then(pyodide => {
                pyodide.setStdin({stdin: () => prompt()});
                pyodide.setStderr({stdin: (output: React.SetStateAction<string>) => write(output)});
                pyodide.setStdout({
                    raw: (charcode: number) => {
                        write(state => state + String.fromCharCode(charcode));
                    }
                });
                return pyodide.runPythonAsync(code);
            }).then(stdout => {
                write(state => state + (stdout ?? ""));
                setExecutingState(false);
            }).catch(output => {
                write(output.message);
                setExecutingState(false);
            })
        }

        return (<div>
            <Box
                sx={{position: 'relative'}}
            >
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
                            execute(command.state.doc.toString());
                            return true;
                        }
                    }])), python(), color, hyperLink]}
                    theme={mode === "dark" ? materialDark : materialLight}
                />
                <Box sx={{position: 'absolute', top: '0.15em', right: '0.15em'}}>
                    {isExecuting ? <CircularProgress size={'1.4em'}/> : <Tooltip title="Run cell (Ctrl+Enter)">
                        <IconButton sx={{padding: 0}} onClick={_ => execute(props.block.props.code)}>
                            <PlayCircle/>
                        </IconButton>
                    </Tooltip>}
                </Box>

            </Box>
            <pre>
                {output}
            </pre>
        </div>)
    }
});