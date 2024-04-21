import React from 'react'
import { AIButton } from './AIButton'
import {MantineProvider} from "@mantine/core";

describe('<AIButton />', () => {
  it('renders', () => {
    cy.mount(
        <MantineProvider>
          <AIButton />
        </MantineProvider>
    )
  });
    it('toggles the autocomplete when user clicks the AI Button', async () => {
        cy.mount(
            <MantineProvider>
                <AIButton />
            </MantineProvider>
        );
        document.addEventListener('ai_explain', (event) => {
            document.dispatchEvent(new CustomEvent(event.detail.id, {
                detail: true
            }));
            assert.isOk(true, 'this will fail');
        });
        cy.get('[data-test="explainthis"]').click();
    });
})