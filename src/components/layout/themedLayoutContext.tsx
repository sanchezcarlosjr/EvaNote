import React from "react";

export interface IThemedLayoutContext {
    siderCollapsed: boolean;
    setSiderCollapsed: (visible: boolean) => void;
    mobileSiderOpen: boolean;
    setMobileSiderOpen: (visible: boolean) => void;
    rightSiderWidget: string;
    setRightSiderWidget: (html: string) => void;
}

export const ThemedLayoutContext = React.createContext<IThemedLayoutContext>({
    siderCollapsed: false,
    mobileSiderOpen: false,
    rightSiderWidget: "",
    setRightSiderWidget: (html: string) => undefined,
    setSiderCollapsed: () => undefined,
    setMobileSiderOpen: () => undefined,
});