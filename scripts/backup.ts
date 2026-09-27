import { mkdirSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { sqlite } from "../app/db/client.server";
import { env } from "../app/lib/env.server";

const databaseName = basename(env.databasePath, ".sqlite");
const backupDirectory =
  process.env.BACKUP_DIRECTORY ?? dirname(env.databasePath);
const timestamp = new Date()
  .toISOString()
  .replaceAll(":", "-")
  .replace(".", "-");
const backupPath = join(backupDirectory, `${databaseName}-${timestamp}.sqlite`);

mkdirSync(backupDirectory, { recursive: true });
await sqlite.backup(backupPath);
