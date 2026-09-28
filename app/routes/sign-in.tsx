import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { authClient } from "../lib/auth-client";

export default function SignIn() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  async function signIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    if (typeof email !== "string" || typeof password !== "string") {
      return;
    }

    const result = await authClient.signIn.email({ email, password });

    if (result.error) {
      setError(result.error.message ?? "Sign in failed.");
      return;
    }

    navigate("/");
  }

  return (
    <main>
      <h1>Sign in</h1>
      <form onSubmit={signIn}>
        <label>
          Email
          <input autoComplete="email" name="email" required type="email" />
        </label>
        <label>
          Password
          <input
            autoComplete="current-password"
            name="password"
            required
            type="password"
          />
        </label>
        <button type="submit">Sign in</button>
      </form>
      {error ? <p role="alert">{error}</p> : null}
      <p>
        <Link to="/">Back</Link>
      </p>
    </main>
  );
}
