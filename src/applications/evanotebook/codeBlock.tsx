import {createReactBlockSpec} from "@blocknote/react";
import React, {useContext, useMemo, useState} from "react";
import {ColorModeContext} from "../../contexts/color-mode";
import Box from "@mui/material/Box";
import CodeMirror, {keymap, Prec} from "@uiw/react-codemirror";
import {python} from "@codemirror/lang-python";
import {color} from "@uiw/codemirror-extensions-color";
import {hyperLink} from "@uiw/codemirror-extensions-hyper-link";
import {materialDark, materialLight} from "@uiw/codemirror-theme-material";
import {CircularProgress, IconButton, Tooltip} from "@mui/material";
import {PlayCircle} from "@mui/icons-material";
import {autocompletion, CompletionContext, CompletionResult} from "@codemirror/autocomplete"

// @ts-ignore
import {API} from './cpp/api';
import {cpp} from "@codemirror/lang-cpp";

function autocompleteCpp(context: CompletionContext): CompletionResult | null {
    let word = context.matchBefore(/\w*/)
    if (!word || word.from == word.to && !context.explicit)
        return null
    return {
        from: word.from,
        options: [
            {label: "include", type: "include", apply: "#include", detail: "include library"},
            {label: "stdio.h", type: "include", apply: "#include <stdio.h>", detail: "include library"},
            {label: "function", type: "function", apply: `int f() {
      return 0;
      }`, detail: "function"},
            {label: "int", type: "function", apply: `int f() {
      return 0;
      }`, detail: "function"},
            {label: "int", type: "variable", apply: "int x=0;",detail:  "create a int variable"},
            {label: "for", type: "loop", apply: `for(int i=0; i<n;i++) {
      }`,detail:  "create a for i=0;i<n;i++"},
            {label: "while", type: "loop", apply: `while() {
      }`,detail:  "create a while"},
            {label: "hello world", type: "text", apply: `#include <stdio.h>
int main() {
   printf("Hello World");
   return 0;
}`, detail: "macro"}
        ]
    }
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
        const api = useMemo(() => {
            return new API({
                hostWrite: (stdout: string) => write(state => state + (stdout ?? "")),
                hostRead: () => prompt()
            });
        }, []);

        function execute(code: string) {
            setExecutingState(true);
            write("");
            api.compileLinkRun(code)
                .then((stdout: string) => {
                    write(state => state + (stdout ?? ""));
                    setExecutingState(false);
                }).catch((error: any) => {
                write(error.message);
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
                    }])), cpp(), autocompletion({ override: [autocompleteCpp] }), color, hyperLink]}
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