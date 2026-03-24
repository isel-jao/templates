import { serve } from "@hono/node-server";
import { createApp } from "./app.js";
import { config } from "./config.js";
import { TaskRepository } from "./db/task-repo.js";
import { closeAuthGrpcClient } from "./grpc/auth-client.js";

const taskRepo = new TaskRepository(config.LOWDB_PATH);

async function main() {
  await taskRepo.connect();
  console.log("Task repository connected");

  const app = createApp(taskRepo);

  serve({ fetch: app.fetch, port: config.PORT }, () => {
    console.log(`Demo API listening on http://localhost:${config.PORT}`);
  });
}

async function shutdown() {
  await closeAuthGrpcClient();
  await taskRepo.disconnect();
  process.exit(0);
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
