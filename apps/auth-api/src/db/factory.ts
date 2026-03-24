import { config } from "../config.js";
import { LowDBAdapter } from "./lowdb/adapter.js";
import { MongoDBAdapter } from "./mongodb/adapter.js";
import type { IDatabase } from "./interface.js";

export function createDatabase(): IDatabase {
  switch (config.DB_ADAPTER) {
    case "lowdb":
      return new LowDBAdapter(config.LOWDB_PATH);
    case "mongodb":
      return new MongoDBAdapter(config.MONGODB_URI, config.MONGODB_DB_NAME);
    default:
      throw new Error(`Unknown DB_ADAPTER: ${config.DB_ADAPTER}`);
  }
}
