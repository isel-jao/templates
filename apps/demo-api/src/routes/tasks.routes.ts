import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { sessionGuard, type SessionVariables } from "../middleware/session-guard.js";
import { CreateTaskBodySchema, UpdateTaskBodySchema } from "../models/task.js";
import type { TaskRepository } from "../db/task-repo.js";

export function createTasksRouter(repo: TaskRepository) {
  const app = new Hono<{ Variables: SessionVariables }>();

  app.use("*", sessionGuard);

  // GET /api/tasks
  app.get("/", async (c) => {
    const userId = c.get("userId");
    const { status, priority } = c.req.query();
    const tasks = await repo.findAll({ userId, status, priority });
    return c.json(tasks);
  });

  // POST /api/tasks
  app.post("/", zValidator("json", CreateTaskBodySchema), async (c) => {
    const userId = c.get("userId");
    const tenantId = c.get("tenantId");
    const body = c.req.valid("json");

    const task = await repo.create({
      title: body.title,
      description: body.description ?? null,
      status: body.status ?? "todo",
      priority: body.priority ?? "medium",
      userId,
      tenantId: tenantId ?? null,
    });

    return c.json(task, 201);
  });

  // GET /api/tasks/:id
  app.get("/:id", async (c) => {
    const task = await repo.findById(c.req.param("id"));
    if (!task || task.userId !== c.get("userId")) {
      return c.json({ error: "Not found" }, 404);
    }
    return c.json(task);
  });

  // PATCH /api/tasks/:id
  app.patch("/:id", zValidator("json", UpdateTaskBodySchema), async (c) => {
    const userId = c.get("userId");
    const task = await repo.findById(c.req.param("id"));
    if (!task || task.userId !== userId) {
      return c.json({ error: "Not found" }, 404);
    }
    const updated = await repo.update(c.req.param("id"), c.req.valid("json"));
    return c.json(updated);
  });

  // DELETE /api/tasks/:id
  app.delete("/:id", async (c) => {
    const userId = c.get("userId");
    const task = await repo.findById(c.req.param("id"));
    if (!task || task.userId !== userId) {
      return c.json({ error: "Not found" }, 404);
    }
    await repo.delete(c.req.param("id"));
    return c.body(null, 204);
  });

  return app;
}
