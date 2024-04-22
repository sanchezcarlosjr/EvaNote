import React, {useEffect} from "react";


export function useContextMenu() {
    const [contextMenu, setContextMenu] = React.useState<{
        mouseX: number; mouseY: number; item_id?: string;
    } | null>(null);

    const onContextMenu = (event: React.MouseEvent & {resource_name?: string}) => {
        event.preventDefault();
        setContextMenu(contextMenu === null ? {
                mouseX: event.clientX + 2, mouseY: event.clientY - 6, item_id: event?.id
            } : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
                // Other native context menus might behave different.
                // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
            null,);
    };

    const close = () => {
        setContextMenu(null);
    };

    useEffect(() => {
        window.addEventListener("click", close);
        return () => window.removeEventListener('scroll', close);
    }, []);


    return {
        contextMenu: {contextMenu, onContextMenu, close}
    };
}