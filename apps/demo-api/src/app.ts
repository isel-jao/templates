import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { config } from "./config.js";
import { createTasksRouter } from "./routes/tasks.routes.js";
import { createMeRouter } from "./routes/me.routes.js";
import type { TaskRepository } from "./db/task-repo.js";

export function createApp(taskRepo: TaskRepository) {
  const app = new Hono();

  app.use(
    "*",
    cors({
      origin: config.CORS_ORIGINS.split(","),
      credentials: true,
    })
  );
  app.use("*", logger());

  app.route("/api/me", createMeRouter());
  app.route("/api/tasks", createTasksRouter(taskRepo));

  app.get("/health", (c) => c.json({ status: "ok" }));

  return app;
}
