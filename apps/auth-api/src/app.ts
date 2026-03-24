import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { config } from "./config.js";
import { createRouter } from "./routes/index.js";
import type { IDatabase } from "./db/interface.js";

export function createApp(db: IDatabase) {
  const app = new Hono();

  app.use(
    "*",
    cors({
      origin: config.CORS_ORIGINS.split(","),
      credentials: true,
    })
  );
  app.use("*", logger());

  app.route("/api", createRouter(db));

  app.get("/health", (c) => c.json({ status: "ok" }));

  return app;
}
