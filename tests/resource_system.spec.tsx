import {test} from 'vitest'
import {prettyDOM, render} from "@testing-library/react";
import ResourceView from "../src/components/resource-view";
import {Folder} from "@mui/icons-material";
import {BrowserRouter} from "react-router-dom";

test('list resources', async () => {
    const result = render(<BrowserRouter>
        <ResourceView tree={[{
            name: "1", meta: {icon: <Folder/>, label: "1"}, list: "1", children: [
                {name: "2", meta: {icon: <Folder/>, label: "2"}, list: "2", children: []}
            ],
        },
            {
                name: "3", meta: {icon: <Folder/>, label: "3"}, list: "3", children: []
            },
            {
                name: "4", meta: {icon: <Folder/>, label: "4"}, list: "https://www.google.com/", children: []
            }
        ]}/>
    </BrowserRouter>);
    const links = await result.findAllByRole('link');
    const hrefs = links.map(x => x.href);
    console.log(prettyDOM(result.container));
    expect(hrefs).toStrictEqual(['http://localhost:3000/1', 'http://localhost:3000/3', 'https://www.google.com/']);
});