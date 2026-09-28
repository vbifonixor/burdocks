import { eq } from "drizzle-orm";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { auth } from "./auth.server";
import { db } from "./db/client.server";
import { user } from "./db/schema";
import { env } from "./lib/env.server";

export function migrateDatabase() {
  migrate(db, { migrationsFolder: "drizzle" });
}

export async function bootstrapSuperuser() {
  const existingUser = await db.query.user.findFirst({
    where: eq(user.email, env.superuserEmail),
  });

  if (existingUser) {
    return;
  }

  await auth.api.createUser({
    body: {
      email: env.superuserEmail,
      name: "Burdocks admin",
      password: env.superuserPassword,
      role: "admin",
    },
  });
}
