import * as React from 'react';
import {styled} from '@mui/material/styles';
import Box from '@mui/material/Box';

import {TreeItem, treeItemClasses, TreeItemContentProps, TreeItemProps, useTreeItem} from '@mui/x-tree-view/TreeItem';
import clsx from "clsx";
import {Button, IconButton} from "@mui/material";
import {useLink} from "@refinedev/core";

const CustomContent = React.forwardRef(function CustomContent(props: TreeItemContentProps, ref,) {
    const {
        classes, className, label, nodeId, icon: iconProp, expansionIcon, displayIcon,
    } = props;

    const {
        disabled, expanded, selected, focused, handleExpansion, handleSelection, preventSelection,
    } = useTreeItem(nodeId);
    const Link = useLink();

    const icon = iconProp || displayIcon;

    const handleMouseDown = (event: React.MouseEvent<any, MouseEvent>) => {
        preventSelection(event);
    };

    const handleExpansionClick = (event: React.MouseEvent<any, MouseEvent>,) => {
        handleExpansion(event);
    };

    const handleSelectionClick = (event: React.MouseEvent<any, MouseEvent>,) => {
        handleSelection(event);
    };

    return (// eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <Box
            sx={{
                display: 'flex', alignItems: 'center', p: 0.5, pr: 0,
            }}
            className={clsx(className, classes.root, {
                [classes.expanded]: expanded,
                [classes.selected]: selected,
                [classes.focused]: focused,
                [classes.disabled]: disabled,
            })}
            onMouseDown={handleMouseDown}
            ref={ref as React.Ref<HTMLDivElement>}
        >
            <IconButton
                onClick={handleExpansionClick}
                sx={{p: 0}}
            >
                {expansionIcon}
            </IconButton>
            <Button
                component={Link}
                to={nodeId}
                startIcon={icon}
                size="small"
                color="inherit"
                onClick={handleSelectionClick} sx={{fontWeight: 'inherit', flexGrow: 1, textTransform: 'none', justifyContent: "left"}}>
                {label}
            </Button>
        </Box>);
});

export const CustomTreeItem = React.forwardRef(function CustomTreeItem(props: any, ref: React.Ref<HTMLLIElement>,) {
    return <TreeItem ContentComponent={CustomContent} {...props} ref={ref}/>;
});