import {useNotification} from "@refinedev/core";


export const useClipboard = () => {
    const {open} = useNotification();
    const writeText = async (text?: string) => {
        try {
            await navigator.clipboard?.writeText(text ?? "");
            open?.({
                message: "Copied it to clipboard",
                type: "success"
            });
        } catch (error) {
            open?.({
                message: "Something goes wrong with your browser.",
                type: "error",
                description: "Please enable the clipboard permissions."
            });
        }
    }
    return {writeText};
}