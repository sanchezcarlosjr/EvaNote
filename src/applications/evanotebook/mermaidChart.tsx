import React, {useContext, useEffect, useRef, useState} from "react";
import {ColorModeContext} from "../../contexts/color-mode";
import mermaid from "mermaid";
import {createReactBlockSpec} from "@blocknote/react";
import CodeMirror from "@uiw/react-codemirror";
import {color} from "@uiw/codemirror-extensions-color";
import {hyperLink} from "@uiw/codemirror-extensions-hyper-link";
import {materialDark, materialLight} from "@uiw/codemirror-theme-material";

mermaid.initialize({
    startOnLoad: false, securityLevel: 'loose', theme: 'forest',
});

mermaid.run({
    suppressErrors: true,
});

const MermaidChart = ({chart}: { chart: string }) => {
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

    return <div ref={mermaidRef} dangerouslySetInnerHTML={{__html: svg}}/>;
};
export const mermaidblock = createReactBlockSpec({
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
            {props.editor.isEditable ? <CodeMirror
                value={props.block.props.code}
                onChange={(code) => {
                    props.editor.updateBlock(props.block, {
                        type: "mermaidblock", props: {code},
                    });
                    setInput(code);
                }}
                extensions={[color, hyperLink]}
                theme={mode === "dark" ? materialDark : materialLight}
            /> : null}
            <MermaidChart chart={input}></MermaidChart>
        </div>)
    }
});