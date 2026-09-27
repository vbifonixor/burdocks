import { and, desc, eq } from "drizzle-orm";
import { useState } from "react";
import { Form, Link, redirect, useNavigate } from "react-router";
import { db } from "../db/client.server";
import { groceryItems } from "../db/schema";
import { authClient } from "../lib/auth-client";
import { normalizeGroceryItemText } from "../lib/grocery";
import { requireUser } from "../lib/session.server";
import type { Route } from "./+types/home";

function itemText(value: FormDataEntryValue | null) {
  try {
    return normalizeGroceryItemText(value);
  } catch {
    throw new Response("Item text must be between 1 and 200 characters.", {
      status: 400,
    });
  }
}

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requireUser(request);
  const items = await db
    .select()
    .from(groceryItems)
    .where(eq(groceryItems.userId, user.id))
    .orderBy(desc(groceryItems.createdAt));

  return { items, user };
}

export async function action({ request }: Route.ActionArgs) {
  const user = await requireUser(request);
  const formData = await request.formData();
  const intent = formData.get("intent");
  const itemId = formData.get("itemId");

  if (intent === "create") {
    await db.insert(groceryItems).values({
      id: crypto.randomUUID(),
      text: itemText(formData.get("text")),
      userId: user.id,
    });
  }

  if (typeof itemId === "string" && intent === "toggle") {
    const [item] = await db
      .select({ completed: groceryItems.completed })
      .from(groceryItems)
      .where(
        and(eq(groceryItems.id, itemId), eq(groceryItems.userId, user.id)),
      );

    if (!item) {
      throw new Response("Not found", { status: 404 });
    }

    await db
      .update(groceryItems)
      .set({ completed: !item.completed, updatedAt: new Date() })
      .where(
        and(eq(groceryItems.id, itemId), eq(groceryItems.userId, user.id)),
      );
  }

  if (typeof itemId === "string" && intent === "delete") {
    const deleted = await db
      .delete(groceryItems)
      .where(
        and(eq(groceryItems.id, itemId), eq(groceryItems.userId, user.id)),
      );

    if (deleted.changes === 0) {
      throw new Response("Not found", { status: 404 });
    }
  }

  if (typeof itemId === "string" && intent === "edit") {
    const updated = await db
      .update(groceryItems)
      .set({ text: itemText(formData.get("text")), updatedAt: new Date() })
      .where(
        and(eq(groceryItems.id, itemId), eq(groceryItems.userId, user.id)),
      );

    if (updated.changes === 0) {
      throw new Response("Not found", { status: 404 });
    }
  }

  return redirect("/");
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const navigate = useNavigate();

  async function signOut() {
    await authClient.signOut();
    navigate("/sign-in");
  }

  return (
    <main>
      <h1>Grocery list</h1>
      <p>{loaderData.user.email}</p>
      {loaderData.user.role === "admin" ? <Link to="/admin">Admin</Link> : null}
      <button onClick={signOut} type="button">
        Sign out
      </button>
      <Form method="post">
        <label>
          Add item
          <input maxLength={200} name="text" required />
        </label>
        <button name="intent" type="submit" value="create">
          Add
        </button>
      </Form>
      <ul>
        {loaderData.items.map((item) => (
          <li key={item.id}>
            {editingItemId === item.id ? (
              <Form method="post" onSubmit={() => setEditingItemId(null)}>
                <input name="itemId" type="hidden" value={item.id} />
                <input
                  defaultValue={item.text}
                  maxLength={200}
                  name="text"
                  required
                />
                <button name="intent" type="submit" value="edit">
                  Save
                </button>
              </Form>
            ) : (
              <>
                {item.completed ? <del>{item.text}</del> : item.text}
                <Form method="post">
                  <input name="itemId" type="hidden" value={item.id} />
                  <button
                    aria-label="Cross out item"
                    name="intent"
                    type="submit"
                    value="toggle"
                  >
                    x
                  </button>
                </Form>
                <Form method="post">
                  <input name="itemId" type="hidden" value={item.id} />
                  <button
                    aria-label="Delete item"
                    name="intent"
                    type="submit"
                    value="delete"
                  >
                    d
                  </button>
                </Form>
                <button onClick={() => setEditingItemId(item.id)} type="button">
                  e
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
