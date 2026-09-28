import { redirect } from "react-router";
import { auth } from "../auth.server";

export async function getSessionUser(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  return session?.user ?? null;
}

export async function requireUser(request: Request) {
  const user = await getSessionUser(request);

  if (!user) {
    throw redirect("/sign-in");
  }

  return user;
}

export async function requireAdmin(request: Request) {
  const user = await requireUser(request);

  if (user.role !== "admin") {
    throw new Response("Forbidden", { status: 403 });
  }

  return user;
}
