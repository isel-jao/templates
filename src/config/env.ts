import { z } from "zod";

const envSchema = z.object({
  VITE_NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  VITE_BACKEND_URL: z.string().url().default("http://localhost:3000/api"),
  VITE_WEBSOCKET_URL: z.url().default("http://localhost:3000"),
  VITE_AUTH_URL: z.url().default("http://localhost:3000"),
});

export const env = envSchema.parse(import.meta.env);
