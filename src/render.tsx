import {lazy} from "react";

export function render(path: string) {
    const Component = lazy(() => import(path));
    return <Component/>;
}