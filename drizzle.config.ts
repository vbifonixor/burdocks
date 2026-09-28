import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dbCredentials: {
    url: process.env.DATABASE_PATH ?? "./data/db.sqlite",
  },
  dialect: "sqlite",
  out: "./drizzle",
  schema: "./app/db/schema.ts",
});
