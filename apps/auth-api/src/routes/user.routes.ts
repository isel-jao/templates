import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import bcrypt from "bcryptjs";
import type { IDatabase } from "../db/interface.js";
import { CreateUserBodySchema, UpdateUserBodySchema, toSafeUser } from "../models/user.js";
import { createAuthGuard, type AuthVariables } from "../middleware/auth-guard.js";
import { adminGuard } from "../middleware/admin-guard.js";

export function createUserRouter(db: IDatabase) {
  const app = new Hono<{ Variables: AuthVariables }>();
  const authGuard = createAuthGuard(db);

  app.use("*", authGuard, adminGuard);

  app.get("/", async (c) => {
    const tenantId = c.req.query("tenantId");
    const role = c.req.query("role");
    const users = await db.users.findAll({
      tenantId: tenantId ?? undefined,
      role: role ?? undefined,
    });
    return c.json(users.map(toSafeUser));
  });

  app.post("/", zValidator("json", CreateUserBodySchema), async (c) => {
    const body = c.req.valid("json");

    const existing = await db.users.findByEmail(body.email);
    if (existing) return c.json({ error: "Email already registered" }, 409);

    const passwordHash = await bcrypt.hash(body.password, 10);
    const user = await db.users.create({
      email: body.email,
      name: body.name,
      passwordHash,
      role: body.role ?? "user",
      tenantId: body.tenantId ?? null,
    });

    return c.json(toSafeUser(user), 201);
  });

  app.get("/:id", async (c) => {
    const user = await db.users.findById(c.req.param("id"));
    if (!user) return c.json({ error: "User not found" }, 404);
    return c.json(toSafeUser(user));
  });

  app.patch("/:id", zValidator("json", UpdateUserBodySchema), async (c) => {
    const updated = await db.users.update(c.req.param("id"), c.req.valid("json"));
    if (!updated) return c.json({ error: "User not found" }, 404);
    return c.json(toSafeUser(updated));
  });

  app.delete("/:id", async (c) => {
    const id = c.req.param("id");
    await db.sessions.deleteAllForUser(id);
    const deleted = await db.users.delete(id);
    if (!deleted) return c.json({ error: "User not found" }, 404);
    return c.body(null, 204);
  });

  return app;
}
