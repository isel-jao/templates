import { z } from "zod";

const ConfigSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().default(3200),
  AUTH_GRPC_ADDRESS: z.string().default("localhost:50051"),
  LOWDB_PATH: z.string().default("./data/tasks.json"),
  CORS_ORIGINS: z.string().default("http://localhost:5174"),
});

export const config = ConfigSchema.parse(process.env);
