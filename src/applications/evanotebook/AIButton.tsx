import {ToolbarButton, useBlockNoteEditor, useSelectedBlocks,} from "@blocknote/react";
import {BlockSchema, formatKeyboardShortcut, InlineContentSchema, StyleSchema} from "@blocknote/core";
import remoteProcedureCaller from "../../events/remoteProcedureCaller";
import {useNotification} from "@refinedev/core";
import Handlebars from "handlebars";
import {ReactElement, useMemo} from "react";

export interface AIButtonProps {
    mainTooltip: string;
    userPrompt: string;
    shortcut?: string;
    blockType: string;
    children: string | ReactElement
}

export function AIButton({mainTooltip, shortcut, userPrompt, children, blockType}: AIButtonProps) {
    const {open} = useNotification();
    const editor = useBlockNoteEditor<BlockSchema, InlineContentSchema, StyleSchema>();
    const selectedBlocks = useSelectedBlocks(editor);

    const filteredItems = useMemo(() => selectedBlocks.filter(block => block.type == blockType), []);

    if (filteredItems.length != selectedBlocks.length || filteredItems.length == 0) return null;

    const onClick = async () => {
        try {
            const template = Handlebars.compile(userPrompt);
            await remoteProcedureCaller.ai_explain(template({selection: document.getSelection()?.toString() ?? ""}));
        } catch (e) {
            open?.({
                type: 'error',
                message: `Please attempt to reopen the chatbot or refresh the page.`,
                description: `The AI agent doesn't respond.`,
            });
        }
    }

    return (<ToolbarButton
        onClick={onClick}
        mainTooltip={mainTooltip}
        secondaryTooltip={shortcut ? formatKeyboardShortcut(shortcut) : shortcut}
    >
        {children}
    </ToolbarButton>);
}
