import * as React from 'react';
import {TreeView} from '@mui/x-tree-view/TreeView';
import {CustomTreeItem} from "./item";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import {ITreeMenu} from "@refinedev/core";
import {TreeItem} from "@mui/x-tree-view/TreeItem";

export interface ResourceViewProps {
    tree: ITreeMenu[];
    selectedKey?: string;
}

const renderTreeView = (tree: ITreeMenu[]) =>
    (
        tree.map(item =>
            {
                return <CustomTreeItem key={item?.list as string} icon={item.meta?.icon} nodeId={item?.list as string ?? ""}  label={item.meta?.label ?? item.name}>
                    {
                        renderTreeView(item.children)
                    }
                </CustomTreeItem>
            }
        )
    );

export default function ResourceView(resourceViewProps: ResourceViewProps) {
    return (<TreeView
            aria-label="resource expansion"
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