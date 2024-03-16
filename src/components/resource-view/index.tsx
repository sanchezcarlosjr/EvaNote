import * as React from 'react';
import {TreeView} from '@mui/x-tree-view/TreeView';
import {CustomTreeItem} from "./item";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import {ITreeMenu} from "@refinedev/core";

export interface ResourceViewProps {
    tree: ITreeMenu[];
    selectedKey?: string;
    siderCollapsed: boolean;
}

const renderTreeView = (tree: ITreeMenu[]) =>
    (
        tree.map(item =>
            {
                return <CustomTreeItem key={item?.list as string} icon={item.meta?.icon} nodeId={item.list}  label={item.meta?.label ?? item.name}>
                    {
                        renderTreeView(item.children)
                    }
                </CustomTreeItem>
            }
        )
    );

export default function ResourceView(resourceViewProps: ResourceViewProps) {
    return (<TreeView
            aria-label="icon expansion"
            defaultCollapseIcon={<ArrowDropDownIcon/>}
            defaultExpandIcon={<ArrowRightIcon/>}
            defaultExpanded={[resourceViewProps?.selectedKey ?? ""]}
            sx={{flexGrow: 1}}
    >
        {
            renderTreeView(resourceViewProps.tree)
        }
        </TreeView>);
}