import {IResourceComponentsProps} from "@refinedev/core";
import React, {useEffect, useState} from "react";
import mermaid from 'mermaid';
import Stack from "@mui/material/Stack";


const Application: React.FC<IResourceComponentsProps> = () => {
    const [data, setData] = useState('');
    useEffect(() => {
        mermaid.initialize({
            startOnLoad: false, securityLevel: 'loose', theme: 'base',
        });
        (async () => {
            await mermaid.run({
                suppressErrors: true,
            });
            const {svg} = await mermaid.render('dx', `---
title: Homework
---
flowchart LR
    subgraph subgraph1
        direction TB
        top1[top] --> bottom1[bottom]
    end
    subgraph subgraph2
        direction TB
        top2[top] --> bottom2[bottom]
    end
    %% ^ These subgraphs are identical, except for the links to them:

    %% Link *to* subgraph1: subgraph1 direction is maintained
    outside --> subgraph1
    %% Link *within* subgraph2:
    %% subgraph2 inherits the direction of the top-level graph (LR)
    outside ---> top2`);

            setData(svg);
        })();
    }, []);
    return <Stack>
        <h1>User progress</h1>
        <div dangerouslySetInnerHTML={{__html: data}}></div>
    </Stack>;
};

export default Application;