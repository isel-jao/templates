import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { setCookie, deleteCookie } from "hono/cookie";
import bcrypt from "bcryptjs";
import type { IDatabase } from "../db/interface.js";
import {
  CreateUserBodySchema,
  LoginBodySchema,
  UpdateMeBodySchema,
  toSafeUser,
} from "../models/user.js";
import { createAuthGuard, type AuthVariables } from "../middleware/auth-guard.js";
import { config } from "../config.js";

export function createAuthRouter(db: IDatabase) {
  const app = new Hono<{ Variables: AuthVariables }>();
  const authGuard = createAuthGuard(db);

  app.post("/register", zValidator("json", CreateUserBodySchema), async (c) => {
    const body = c.req.valid("json");

    const existing = await db.users.findByEmail(body.email);
    if (existing) {
      return c.json({ error: "Email already registered" }, 409);
    }

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

  app.post("/login", zValidator("json", LoginBodySchema), async (c) => {
    const { email, password } = c.req.valid("json");

    const user = await db.users.findByEmail(email);
    if (!user) {
      return c.json({ error: "Invalid credentials" }, 401);
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return c.json({ error: "Invalid credentials" }, 401);
    }

    const expiresAt = new Date(
      Date.now() + config.SESSION_TTL_SECONDS * 1000
    ).toISOString();

    const session = await db.sessions.create({
      userId: user.id,
      tenantId: user.tenantId,
      userRole: user.role,
      expiresAt,
    });

    setCookie(c, "session_id", session.id, {
      httpOnly: true,
      sameSite: "Lax",
      maxAge: config.SESSION_TTL_SECONDS,
      path: "/",
      secure: config.NODE_ENV === "production",
    });

    return c.json({ user: toSafeUser(user) });
  });

  app.post("/logout", authGuard, async (c) => {
    await db.sessions.delete(c.get("sessionId"));
    deleteCookie(c, "session_id", { path: "/" });
    return c.json({ message: "Logged out" });
  });

  app.get("/me", authGuard, async (c) => {
    const user = await db.users.findById(c.get("userId"));
    if (!user) return c.json({ error: "User not found" }, 404);
    return c.json(toSafeUser(user));
  });

  app.patch("/me", authGuard, zValidator("json", UpdateMeBodySchema), async (c) => {
    const body = c.req.valid("json");

    const updates = {
      ...(body.name && { name: body.name }),
      ...(body.password && { passwordHash: await bcrypt.hash(body.password, 10) }),
    };

    const updated = await db.users.update(c.get("userId"), updates);
    if (!updated) return c.json({ error: "User not found" }, 404);

    return c.json(toSafeUser(updated));
  });

  return app;
}
