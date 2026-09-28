import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { createRequestHandler, type ServerBuild } from "react-router";
import { auth } from "../app/auth.server";
import { db } from "../app/db/client.server";
import { groceryItems } from "../app/db/schema";
import { env } from "../app/lib/env.server";
import { bootstrapSuperuser, migrateDatabase } from "../app/startup.server";

migrateDatabase();
await bootstrapSuperuser();

const buildPath = pathToFileURL(resolve("build/server/index.js")).href;
const build = (await import(buildPath)) as ServerBuild;
const handleRequest = createRequestHandler(build, process.env.NODE_ENV);
const app = new Hono();

app.get("/ping", (context) => context.json({ ok: true }));
app.all("/api/auth/*", (context) => auth.handler(context.req.raw));
app.delete("/api/grocery/:id", async (context) => {
  const session = await auth.api.getSession({
    headers: context.req.raw.headers,
  });

  if (!session) {
    return context.text("Unauthorized", 401);
  }

  const deleted = await db
    .delete(groceryItems)
    .where(
      and(
        eq(groceryItems.id, context.req.param("id")),
        eq(groceryItems.userId, session.user.id),
      ),
    );

  return deleted.changes === 0
    ? context.text("Not found", 404)
    : context.body(null, 204);
});
app.get("*", serveStatic({ root: "./build/client" }));
app.all("*", (context) => handleRequest(context.req.raw));

serve({ fetch: app.fetch, port: env.port });
