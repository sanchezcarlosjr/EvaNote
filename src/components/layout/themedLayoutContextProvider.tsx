import React, {ReactNode, useState} from "react";
import {IThemedLayoutContext, ThemedLayoutContext} from "./themedLayoutContext";
export type UseThemedLayoutContextType = IThemedLayoutContext;
export const ThemedLayoutContextProvider: React.FC<{
    children: ReactNode;
    initialSiderCollapsed?: boolean;
}> = ({children, initialSiderCollapsed}) => {
    const [siderCollapsed, setSiderCollapsed] = useState(
        initialSiderCollapsed ?? false,
    );
    const [mobileSiderOpen, setMobileSiderOpen] = useState(false);

    const [rightSiderWidget, setRightSiderWidget] = useState("");

    return (
        <ThemedLayoutContext.Provider
            value={{
                siderCollapsed,
                mobileSiderOpen,
                setSiderCollapsed,
                setMobileSiderOpen,
                rightSiderWidget,
                setRightSiderWidget
            }}
        >
            {children}
        </ThemedLayoutContext.Provider>
    );
};