import { bootstrapSuperuser, migrateDatabase } from "../app/startup.server";

migrateDatabase();
await bootstrapSuperuser();
