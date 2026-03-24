import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import type { IDatabase } from "../db/interface.js";
import { CreateTenantBodySchema, UpdateTenantBodySchema } from "../models/tenant.js";
import { createAuthGuard, type AuthVariables } from "../middleware/auth-guard.js";
import { adminGuard, superadminGuard } from "../middleware/admin-guard.js";

export function createTenantRouter(db: IDatabase) {
  const app = new Hono<{ Variables: AuthVariables }>();
  const authGuard = createAuthGuard(db);

  app.get("/", authGuard, adminGuard, async (c) => {
    return c.json(await db.tenants.findAll());
  });

  app.post(
    "/",
    authGuard,
    superadminGuard,
    zValidator("json", CreateTenantBodySchema),
    async (c) => {
      const body = c.req.valid("json");
      const existing = await db.tenants.findBySlug(body.slug);
      if (existing) return c.json({ error: "Slug already in use" }, 409);
      const tenant = await db.tenants.create({ name: body.name, slug: body.slug });
      return c.json(tenant, 201);
    }
  );

  app.get("/:id", authGuard, adminGuard, async (c) => {
    const tenant = await db.tenants.findById(c.req.param("id"));
    if (!tenant) return c.json({ error: "Tenant not found" }, 404);
    return c.json(tenant);
  });

  app.patch(
    "/:id",
    authGuard,
    superadminGuard,
    zValidator("json", UpdateTenantBodySchema),
    async (c) => {
      const updated = await db.tenants.update(c.req.param("id"), c.req.valid("json"));
      if (!updated) return c.json({ error: "Tenant not found" }, 404);
      return c.json(updated);
    }
  );

  app.delete("/:id", authGuard, superadminGuard, async (c) => {
    const deleted = await db.tenants.delete(c.req.param("id"));
    if (!deleted) return c.json({ error: "Tenant not found" }, 404);
    return c.body(null, 204);
  });

  return app;
}
