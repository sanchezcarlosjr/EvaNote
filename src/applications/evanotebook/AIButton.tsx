import {ToolbarButton,} from "@blocknote/react";
import {formatKeyboardShortcut} from "@blocknote/core";
import {QuestionMarkOutlined} from "@mui/icons-material";
import remoteProcedureCaller from "../../events/remoteProcedureCaller";
import {useNotification} from "@refinedev/core";
import Handlebars from "handlebars";
import {ReactElement} from "react";

export interface AIButtonProps {
    mainTooltip: string;
    userPrompt: string;
    shortcut: string;
    children: string | ReactElement
}

export function AIButton({mainTooltip, shortcut, userPrompt, children}: AIButtonProps) {
    const {open} = useNotification();
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
            secondaryTooltip={formatKeyboardShortcut(shortcut)}
        >
           {children}
        </ToolbarButton>);
}
