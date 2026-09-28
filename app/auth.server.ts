import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import { db } from "./db/client.server";
import { env } from "./lib/env.server";

export const auth = betterAuth({
  baseURL: env.hostname,
  database: drizzleAdapter(db, {
    provider: "sqlite",
  }),
  emailAndPassword: {
    disableSignUp: true,
    enabled: true,
  },
  plugins: [admin()],
  secret: env.authSecret,
  trustedOrigins: [env.hostname],
});
