import {render, waitFor} from "@testing-library/react";
import {PlaybookExecutor} from "../src/PlaybookExecutor";
import { ProvisionContext } from "../src/contexts/provision";
import { vi } from 'vitest';
import {ResourceProps} from "@refinedev/core";

vi.mock('/src/utility/supabaseClient.ts', () => {
    // Mock any methods your tests will use
    const mockSupabaseClient = {
        auth: {
            signIn: vi.fn().mockResolvedValue({ user: { id: 'user-id' }, session: 'session-data' }),
            signOut: vi.fn().mockResolvedValue({}),
            // Add other auth methods you use
        },
        from: vi.fn().mockReturnThis(), // Chainable
        select: vi.fn().mockReturnThis(), // Chainable
        insert: vi.fn().mockReturnThis(), // Chainable
        eq: vi.fn().mockResolvedValue([{ id: 'data-id', name: 'Data Name' }]), // Resolve with mock data
        // Add other Supabase service methods you use
    };

    return { supabaseClient: mockSupabaseClient };
});

// Mocking useGetIdentity to return an identity object
vi.mock('@refinedev/core', () => ({ // Updated path
    useGetIdentity: () => ({ data: { id: 'test-identity' } }),
}));

// Mocking React with createContext and lazy
vi.mock('react', async (importOriginal) => {
    const actual = await importOriginal(); // Importing the actual React module
    return {
        // @ts-ignore
        ...actual, // Spreading all original React exports
        lazy: vi.fn().mockImplementation((fn) => {
            const Module = fn();
            // @ts-ignore
            return Module.then((mod) => mod);
        }),
        // You can add other mocks or overrides here if needed
    };
});

describe('PlaybookExecutor', () => {
    it('should set resources and routes when identity is present', async () => {
        const setResources = vi.fn();
        const setRoutes = vi.fn();
        const resources: ResourceProps[] = [];

        render(
            <ProvisionContext.Provider value={{ resources, setResources, setRoutes }}>
                <PlaybookExecutor />
            </ProvisionContext.Provider>
        );

        await waitFor(() => expect(setRoutes).toHaveBeenCalled());
        await waitFor(() => expect(setResources).toHaveBeenCalled());
        const expectedResources = [{
            name: "user-progress", list: "/user-progress", meta: {
                label: "User progress", icon: expect.anything() // Use expect.anything() if you don't need to assert the exact icon
            }
        }];
        expect(setResources).toHaveBeenCalledWith(expectedResources);
    });
});
