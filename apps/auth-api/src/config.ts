import { z } from "zod";

const ConfigSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().default(3100),
  GRPC_PORT: z.coerce.number().default(50051),
  DB_ADAPTER: z.enum(["lowdb", "mongodb"]).default("lowdb"),
  LOWDB_PATH: z.string().default("./data/db.json"),
  MONGODB_URI: z.string().default("mongodb://localhost:27017"),
  MONGODB_DB_NAME: z.string().default("session_auth"),
  SESSION_TTL_SECONDS: z.coerce.number().default(86400),
  CORS_ORIGINS: z.string().default("http://localhost:5173,http://localhost:5174"),
});

export const config = ConfigSchema.parse(process.env);
