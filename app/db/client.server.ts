import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { env } from "../lib/env.server";
import * as schema from "./schema";

if (env.databasePath !== ":memory:") {
  mkdirSync(dirname(env.databasePath), { recursive: true });
}

const sqlite = new Database(env.databasePath);
sqlite.pragma("journal_mode = WAL");

export const db = drizzle({ client: sqlite, schema });
export { sqlite };
