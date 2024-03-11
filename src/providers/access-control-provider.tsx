import {AccessControlProvider, CanParams, IAccessControlContext} from "@refinedev/core";

/**
 * Check out the Access Control Provider documentation for detailed information
 * https://refine.dev/docs/api-reference/core/providers/accessControl-provider
 **/
export const accessControlProvider: AccessControlProvider = {
    can: async ({ resource, action, params }: CanParams) => {
        return { can: true };
    },
    options: {
        buttons: {
            enableAccessControl: true,
            hideIfUnauthorized: false,
        },
    },
};
