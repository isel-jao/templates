import { Hono } from "hono";
import type { IDatabase } from "../db/interface.js";
import { createAuthRouter } from "./auth.routes.js";
import { createUserRouter } from "./user.routes.js";
import { createTenantRouter } from "./tenant.routes.js";

export function createRouter(db: IDatabase) {
  const app = new Hono();

  app.route("/auth", createAuthRouter(db));
  app.route("/users", createUserRouter(db));
  app.route("/tenants", createTenantRouter(db));

  return app;
}
