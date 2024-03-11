import {useContext} from "react";
import {UseThemedLayoutContextType} from "./themedLayoutContextProvider";
import {ThemedLayoutContext} from "./themedLayoutContext";

export const useThemedLayoutContext = (): UseThemedLayoutContextType => {
    const {
        mobileSiderOpen,
        siderCollapsed,
        setMobileSiderOpen,
        setSiderCollapsed,
        rightSiderWidget,
        setRightSiderWidget
    } = useContext(ThemedLayoutContext);

    return {
        mobileSiderOpen,
        siderCollapsed,
        setMobileSiderOpen,
        setSiderCollapsed,
        rightSiderWidget,
        setRightSiderWidget
    };
};