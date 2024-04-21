import React from 'react'
import { AIButton } from '../src/applications/evanotebook/AIButton'
import {MantineProvider} from "@mantine/core";
import {QuestionMarkOutlined} from "@mui/icons-material";

describe('<AIButton />', () => {
  it('renders', () => {
    cy.mount(
        <MantineProvider>
            <AIButton  mainTooltip={'Explain this'} shortcut={'Mod+J'} userPrompt={'Explicame lo que sigue: {{selection}}'}>
                <QuestionMarkOutlined fontSize={"small"}/>
            </AIButton>
        </MantineProvider>
    )
  });
    it('propagates the event when user clicks the AI Button', async () => {
        cy.mount(
            <MantineProvider>
                <AIButton  mainTooltip={'Explain this'} shortcut={'Mod+J'} userPrompt={'Explicame lo que sigue: {{selection}}'}>
                    <QuestionMarkOutlined fontSize={"small"}/>
                </AIButton>
            </MantineProvider>
        );
        const eventPromise = new Promise<CustomEvent<{id: string, payload: string}>>(resolve => {
            document.addEventListener('ai_explain', (event: Event) => {
                document.dispatchEvent(new CustomEvent(event.detail.id, {
                    detail: true
                }));
                resolve(event as CustomEvent);
            });
        })
        cy.get('[data-test="explainthis"]').click();
        const event = await eventPromise;
        expect(event.detail.payload).to.equal("Explicame lo que sigue: ");
    });
})