import type { MiddlewareHandler } from "hono";
import type { AuthVariables } from "./auth-guard.js";

function createRoleGuard(
  allowedRoles: string[],
  errorMessage: string
): MiddlewareHandler<{ Variables: AuthVariables }> {
  return async (c, next) => {
    if (!allowedRoles.includes(c.get("userRole"))) {
      return c.json({ error: errorMessage }, 403);
    }
    await next();
  };
}

export const adminGuard = createRoleGuard(
  ["admin", "superadmin"],
  "Forbidden: admin access required"
);

export const superadminGuard = createRoleGuard(
  ["superadmin"],
  "Forbidden: superadmin access required"
);
