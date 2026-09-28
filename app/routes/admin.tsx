import { desc } from "drizzle-orm";
import { Form, Link, redirect } from "react-router";
import { auth } from "../auth.server";
import { db } from "../db/client.server";
import { user } from "../db/schema";
import { requireAdmin } from "../lib/session.server";
import type { Route } from "./+types/admin";

export async function loader({ request }: Route.LoaderArgs) {
  await requireAdmin(request);
  const users = await db.select().from(user).orderBy(desc(user.createdAt));
  return { users };
}

export async function action({ request }: Route.ActionArgs) {
  await requireAdmin(request);
  const formData = await request.formData();
  const email = formData.get("email");
  const name = formData.get("name");
  const password = formData.get("password");
  const role = formData.get("role");

  if (
    typeof email !== "string" ||
    typeof name !== "string" ||
    typeof password !== "string" ||
    (role !== "admin" && role !== "user")
  ) {
    throw new Response("Invalid account details", { status: 400 });
  }

  await auth.api.createUser({
    body: { email, name, password, role },
    headers: request.headers,
  });

  return redirect("/admin");
}

export default function Admin({ loaderData }: Route.ComponentProps) {
  return (
    <main>
      <h1>Admin</h1>
      <Form method="post">
        <label>
          Name
          <input name="name" required />
        </label>
        <label>
          Email
          <input name="email" required type="email" />
        </label>
        <label>
          Password
          <input name="password" required type="password" />
        </label>
        <label>
          Role
          <select defaultValue="user" name="role">
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </label>
        <button type="submit">Create account</button>
      </Form>
      <ul>
        {loaderData.users.map((account) => (
          <li key={account.id}>
            {account.email} ({account.role ?? "user"})
          </li>
        ))}
      </ul>
      <p>
        <Link to="/">Back</Link>
      </p>
    </main>
  );
}
