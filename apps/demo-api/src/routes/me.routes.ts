import { Hono } from "hono";
import { sessionGuard, type SessionVariables } from "../middleware/session-guard.js";
import { getUserById } from "../grpc/auth-client.js";

export function createMeRouter() {
  const app = new Hono<{ Variables: SessionVariables }>();

  app.use("*", sessionGuard);

  // GET /api/me
  app.get("/", async (c) => {
    const userId = c.get("userId");
    const user = await getUserById(userId);
    if (!user.found) {
      return c.json({ error: "User not found" }, 404);
    }
    return c.json({
      id: user.userId,
      email: user.email,
      name: user.name,
      role: user.role,
      tenantId: user.tenantId || null,
    });
  });

  return app;
}
