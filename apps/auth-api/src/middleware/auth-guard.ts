import type { MiddlewareHandler } from "hono";
import { getCookie } from "hono/cookie";
import type { IDatabase } from "../db/interface.js";

export type AuthVariables = {
  userId: string;
  sessionId: string;
  userRole: string;
  tenantId: string | null;
};

export function createAuthGuard(db: IDatabase): MiddlewareHandler<{ Variables: AuthVariables }> {
  return async (c, next) => {
    const sessionId = getCookie(c, "session_id");
    if (!sessionId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const session = await db.sessions.findById(sessionId);
    if (!session || new Date(session.expiresAt) < new Date()) {
      return c.json({ error: "Session expired or invalid" }, 401);
    }

    c.set("userId", session.userId);
    c.set("sessionId", session.id);
    c.set("userRole", session.userRole);
    c.set("tenantId", session.tenantId);
    await next();
  };
}
