import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export * from "./auth-schema";

export const groceryItems = sqliteTable("grocery_item", {
  completed: integer("completed", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  id: text("id").primaryKey(),
  text: text("text").notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  userId: text("user_id").notNull(),
});
