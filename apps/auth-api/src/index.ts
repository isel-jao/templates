import { serve } from "@hono/node-server";
import { createApp } from "./app.js";
import { config } from "./config.js";
import { createDatabase } from "./db/factory.js";
import { startGrpcServer } from "./grpc/server.js";

const db = createDatabase();

async function main() {
  await db.connect();
  console.log(`Database connected (adapter: ${config.DB_ADAPTER})`);

  const sessionCleanup = setInterval(
    () => db.sessions.deleteExpired(),
    60 * 60 * 1000
  );

  const app = createApp(db);

  serve({ fetch: app.fetch, port: config.PORT }, () => {
    console.log(`HTTP server listening on http://localhost:${config.PORT}`);
  });

  const grpcServer = startGrpcServer(config.GRPC_PORT, db);

  async function shutdown() {
    clearInterval(sessionCleanup);
    grpcServer.forceShutdown();
    await db.disconnect();
    process.exit(0);
  }

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
