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
import {Announcement, Assistant, Code, Directions, Explore, LiveHelp, Translate} from '@mui/icons-material';
import {Identity} from "../../providers/identity";
import {codeblock} from "./codeBlock";
import {mermaidblock} from "./mermaidChart";
import {AIButton} from "./AIButton";
import {Alert} from "./Alert";

const schema = BlockNoteSchema.create({
    blockSpecs: {
        ...defaultBlockSpecs, codeblock: codeblock, mermaidblock: mermaidblock, alert: Alert,
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
    aliases: ["alert", "notification", "emphasize", "warning", "error", "info", "success",],
    group: "Other",
    icon: <Announcement/>,
});

// List containing all default Slash Menu Items, as well as our custom one.
const getCustomSlashMenuItems = (editor: typeof schema.BlockNoteEditor): DefaultReactSuggestionItem[] => [...getDefaultReactSlashMenuItems(editor), insertMermaid(editor), insertCode(editor), insertAlert(editor)];


const ListAIButtonToolbar = ({blockType, list}: any) => {
    return (list.map((block: any[]) => <AIButton blockType={blockType} mainTooltip={block[0]}
                                                 userPrompt={`${block[1]}. Mi selección en la plataforma es (aquello que tengo duda): {{selection}}`}>
            {block[2]}
        </AIButton>))
}

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
                <ListAIButtonToolbar
                    blockType={"heading"}
                    list={[["Explicación del Ejercicio", "Actua como mi profesor con mucha experiencia en temas de matemáticas, lógica y programación, encargado de apoyar al usuario en el proceso de aprendizaje. Tu única función consiste en explicar la descripción de un ejercicio para que quede completamente claro lo que te pide hacer. Explica que estás aquí para ayudar.",
                        <Explore/>], ["Clarificación Rápida de Conceptos", "Ayudame a responder preguntas y/o dudas sobre conceptos relacionados con programación. Espera mi respuesta y preguntame si tiene idea de cuál debe ser la respuesta correcta. Genera una respuesta clara, concisa y verificada (es decir, que incluya fuentes y/o bibliografía reales).",
                        <LiveHelp/>], ["Tutor Inteligente", "Asistime en adquirir conocimientos. Preguntame mi nivel académico en el que se encuentra actualmente (Secundaria, Preparatoria, Universidad, etc.). Ayudame a aprender el tema, proporcionando explicaciones, ejemplos y analogías adaptadas a su nivel académico y conocimientos previos sobre el tema.",
                        <Assistant/>], ["Generación de Instrucciones", "Proporcioname una lista de instrucciones precisa y útil para realizar cierta tarea, basándose en la información proporcionada y tu conocimiento. Pregunta al usuario por la información sobre el objetivo que se quiere lograr. Espera su respuesta y pregunta al usuario si tiene idea de los pasos que se deben seguir para lograr el objetivo propuesto. Aplica un profundo y detallado análisis para generar una instrucción, una secuencia completa de pasos complementada con aquellos que no te dio el usuario y, de ser necesario, especifica cuáles de sus pasos son innecesarios. Si el usuario está satisfecho con tu trabajo, termina la conversación. De lo contrario, pídele indicaciones para rehacer generación de instrucciones conforme sus necesidades.",
                        <LiveHelp/>], ["Preguntas relacionadas con el tema", "Preguntame tantas preguntas cuantas sean necesarias para asegurarse de que tengo los conocimientos en un tema dado.   Pregunta al usuario por un problema o tema en el que necesita ayuda. Espera su respuesta y pregunta al usuario si tiene idea de cómo se puede solucionar su problema. Pregunta al usuario, de forma iterativa y en orden de crecimiento de dificultad, preguntas encaminadas a verificar y poner a prueba sus conocimientos. Una vez que el usuario te diga que pares, presentale una lista de referencias y bibliografías que puede consultar para mejorar su comprensión del tema. Si el usuario está satisfecho con tu trabajo, termina la conversación. De lo contrario, pídele indicaciones para rehacer entrenamiento con preguntas conforme sus necesidades.",
                        <LiveHelp/>]]}
                />

                <ListAIButtonToolbar
                    blockType={"codeblock"}
                    list={[["Explicación del Código", "Asume el rol de experto en programación, encargado de apoyar al usuario en el proceso de codificación. Tu única función consiste en explicar el funcionamiento del código proporcionado es explicarme el código. Preguntame por el código completo o los módulos, uno por uno, sobre los cuales se desea obtener la explicación. Espera su respuesta y pregunta al usuario si desea una explicación general, línea por línea o mixta del código que te proporciono. Analiza el código y elabora una explicación detallada de este. ",
                        <Assistant/>], ["“Debugging” o el Análisis de Errores", "Explicame y ayudame a resolver los errores de mi código desarrollado. Preguntame por los mensajes de error que me salieron durante la compilación de su programa. Analiza los mensajes de error y, si es necesario, preguntame por parte de código en la que ocurrió el problema para poder entender cómo solucionarlo. Genera una solución factible a los errores proporcionados, explicando detalladamente la naturaleza de cada uno y por qué optaste por el método de solución seleccionado.",
                        <LiveHelp/>], ["Simulación de Ejecución", "Asume el rol de un sistema experto, encargado de apoyar al usuario en el proceso de codificación. Tu única función consiste en simular la ejecución de código, indicando paso por paso lo que ocurre durante este proceso. Pregunta al usuario por el código completo o los módulos, uno por uno, sobre los cuales se desea obtener la simulación de ejecución. Espera su respuesta y pregunta al usuario si conoce el orden en el cual se van ejecutando las líneas de su código. Analiza el código y elabora una explicación detallada de su ejecución, indicando el orden en el que se ejecutan las líneas, las veces que se repiten los ciclos, ciclo de vida de las variables, etc.",
                        <Directions/>], ["Traducción de un Lenguaje a otro", "  Asume el rol de experto en los lenguajes de programación. Tu única función consiste en traducir el código de un lenguaje de programación a otro.   Pregunta al usuario por su código. Pregunta al usuario por el lenguaje de programación de su código y el lenguaje de programación al cual lo quiere traducir. Evalua el código para brindar retroalimentación sobre su funcionalidad. Presenta un resumen equilibrado, señalando fortalezas y áreas de mejora. Traduce el código proporcionado al lenguaje establecido, respetando la estructura y sintaxis del nuevo lenguaje, sin inventar cosas que no estén en el código original, explicando a detalle las variables, funciones, ciclos y otros elementos empleados. Si el usuario está satisfecho con tu trabajo, termina la conversación. De lo contrario, pídele indicaciones para rehacer traducción de un lenguaje a otro conforme sus necesidades.",
                        <Translate/>], ["Análisis de Sintaxis y Semántica", "  Asume el rol de experto en programación, encargado de apoyar al usuario en el proceso de codificación. Tu única función consiste en redactar el código para eliminar errores de sintaxis y semántica.   Pregunta al usuario por el código completo o los módulos, uno por uno, los cuales necesitan ser revisados. Espera su respuesta y pregunta al usuario si tiene idea de cuáles son algunos de los errores sintácticos y/o semánticos que presenta su código. Corrige todos los errores sintácticos y/o semánticos del código, sin afectar negativamente su funcionalidad. Presenta una lista detallada de los errores identificados, junto con la solución aplicada. Si el usuario está satisfecho con tu trabajo, termina la conversación. De lo contrario, pídele indicaciones para rehacer análisis de sintaxis y semántica conforme sus necesidades.",
                        <LiveHelp/>]]}
                />

                <ListAIButtonToolbar
                    blockType={"paragraph"}
                    list={[["Comprobación de Información", "Mi profesor es un crítico académico muy minucioso y encargado de verificar la autenticidad de cualquier información que se le proporcione. Dame retroalimentacion para verificar si la información que te doy es cierta o falsa, basándote en tu amplio conocimiento sobre el mundo, ya que nunca te da miedo o incomodidad de responder solo con la verdad, sin importar las condiciones.",
                        <Assistant/>], ["Generación de Enfoques Alternativos", "Ayudame a encontrar enfoques alternativos para realizar mi tarea, basándose en las soluciones existentes y mis preferencias.   Preguntame sobre el objetivo que se quiere lograr, algunos de los enfoques que he pensado seguir y mi experiencia previa. Espera su respuesta y preguntame por las rúbricas de evaluación o instrucciones que se tienen que seguir para lograr el objetivo propuesto. Aplica un profundo y detallado análisis para generar enfoques alternativos, explicarlos y comparar sus pros y cons.",
                        <Explore/>], ["Redacción de Escritura", "Ayudame en la redacción de sus trabajos académicos, resúmenes, sintaxis, ensayos, reportes de laboratorio y muchos más. Presentame el catálogo de diferentes tipos de trabajos escritos y pide que seleccione aquel que mejor refleje la naturaleza de trabajo con el que necesita ayuda. Espera su respuesta y pregunta al usuario por un texto con el que necesita ayuda (en el caso de que lo tenga), de lo contrario le muestras una plantilla con la cual puede empezar a trabajar. Si el usuario no logró seleccionar el tipo de trabajo escrito con el que necesita ayuda, basate en el texto que te proporciono para identificar qué tipo de trabajo es. Genera consejos y ejemplos detallados de cómo se puede mejorar su trabajo escrito: corregir los errores de redacción, enriquecer la información, adaptarse al formato correcto, etc.",
                        <LiveHelp/>], ["Creación de Diagramas de Flujo", "Ayudame a generar diagramas de flujo a partir del pseudocódigo/código.   Pregunta al usuario por el pseudocódigo/código que requiere representar con un diagrama de flujo. Espera su respuesta y pregunta al usuario si tiene idea de cuál podría ser el método adecuado para diseñar este diagrama. Genera un diagrama de flujo en formato textual que explique el funcionamiento del pseudocódigo/código proporcionado por el usuario. Ayuda a convertirlo en formato gráfico, proporcionando explicación detallada, paso por paso, de cuales son los elementos del diagrama y sus roles. Si el usuario está satisfecho con tu trabajo, termina la conversación. De lo contrario, pídele indicaciones para rehacer creación de diagramas de flujo conforme sus necesidades.",
                        <LiveHelp/>], ["Ayuda Creativa", "Asume el rol de artista y creador de contenido con décadas de experiencia y cientos de proyectos exitosos en muchas áreas, encargado de apoyar al usuario en el proceso de aprendizaje. Tu única función consiste en brindar ideas y sugerencias creativas, innovadoras y útiles.   Pregunta al usuario por el tema en el cual le gustaría recibir ayuda creativa. Espera su respuesta y pregunta al usuario por la información referente a su cuestión, como los requerimientos, limitaciones, herramientas y/o recursos al alcance. Después pregunta al usuario sobre qué tanto trabajo ya está hecho y pídele que lo comparta contigo. Analiza información proporcionada y presenta varias soluciones creativas, innovadoras y útiles, con una explicación detallada de cada una así como un breve instructivo de cómo implementarlas. ",
                        <LiveHelp/>]]}
                />


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
