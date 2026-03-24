import type { MiddlewareHandler } from "hono";
import { getCookie } from "hono/cookie";
import { validateSession } from "../grpc/auth-client.js";

export type SessionVariables = {
  userId: string;
  tenantId: string | null;
  userRole: string;
};

export const sessionGuard: MiddlewareHandler<{ Variables: SessionVariables }> = async (
  c,
  next
) => {
  const sessionId = getCookie(c, "session_id");
  if (!sessionId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  try {
    const result = await validateSession(sessionId);

    if (!result.valid) {
      return c.json({ error: result.error || "Invalid session" }, 401);
    }

    c.set("userId", result.userId);
    c.set("tenantId", result.tenantId || null);
    c.set("userRole", result.role);
    await next();
  } catch {
    return c.json({ error: "Auth service unavailable" }, 503);
  }
};
