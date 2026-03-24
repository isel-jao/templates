import type { MiddlewareHandler } from "hono";
import type { AuthVariables } from "./auth-guard.js";

/**
 * Ensures a request's tenantId query param matches the session's tenantId,
 * unless the user is a superadmin (who can access all tenants).
 */
export const tenantGuard: MiddlewareHandler<{ Variables: AuthVariables }> = async (c, next) => {
  const role = c.get("userRole");
  if (role === "superadmin") {
    await next();
    return;
  }

  const sessionTenantId = c.get("tenantId");
  const requestTenantId = c.req.param("tenantId") ?? c.req.query("tenantId");

  if (requestTenantId && requestTenantId !== sessionTenantId) {
    return c.json({ error: "Forbidden: tenant mismatch" }, 403);
  }

  await next();
};
