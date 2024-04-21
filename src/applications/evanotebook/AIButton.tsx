import {ToolbarButton,} from "@blocknote/react";
import {formatKeyboardShortcut} from "@blocknote/core";
import {QuestionMarkOutlined} from "@mui/icons-material";
import remoteProcedureCaller from "../../events/remoteProcedureCaller";
import {useNotification} from "@refinedev/core";

export function AIButton() {
    const {open} = useNotification();

    const onClick = async () => {
        try {
            await remoteProcedureCaller.ai_explain(`Explicame lo que sigue: ${document.getSelection()?.toString() ?? ""}`);
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
            mainTooltip={"Explain this"}
            secondaryTooltip={formatKeyboardShortcut("Mod+J")}
        >
            <QuestionMarkOutlined fontSize={"small"}/>
        </ToolbarButton>);
}
