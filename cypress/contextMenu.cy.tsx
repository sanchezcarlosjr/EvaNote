import React from 'react'
import { ContextMenu } from '../src/components/context-menu/contextMenu'
import {Refine} from "@refinedev/core";

describe('<ContextMenu />', () => {
  it('renders', () => {
    cy.mount(<ContextMenu  close={() => null} contextMenu={{
      mouseX: 0,
      mouseY: 0
    }}/>);
  });

  it.only('renders', async () => {
    cy.mount(
        <Refine
            dataProvider={null}
            resources={[
              {
                name: "id",
                list: '/evanotebook/id'
              },
            ]}
        >
          <ContextMenu close={() => null} contextMenu={{
            mouseX: 0,
            mouseY: 0,
            item_id: 'id'
          }}/>
        </Refine>
    );
    const textPromise = new Promise(
        (notify) => {
          window.navigator.clipboard = {
            writeText: (text) => {
              return new Promise(resolve => {
                resolve(text);
                notify(text);
              });
            }
          };
        }
    );
    cy.get('[data-test="copy-location"]').click();
    const result = await textPromise;
    expect(result).to.equal("/evanotebook/id");
  });
})