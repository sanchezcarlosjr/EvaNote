import {AccessControlProvider, CanParams} from "@refinedev/core";

/**
 * Check out the Access Control Provider documentation for detailed information
 * https://refine.dev/docs/api-reference/core/providers/accessControl-provider
 **/
export const accessControlProvider: AccessControlProvider = {
    can: async ({resource, action, params}: CanParams) => {
        if (action == 'list') return {can: true};
        if (action == 'create') return {can: true};
        if (!resource) return {can: false};
        return {can: false};
    }, options: {
        buttons: {
            enableAccessControl: true, hideIfUnauthorized: true
        },
    },
};
