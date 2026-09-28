const developmentAuthSecret =
  "development-auth-secret-change-before-production";

function required(name: string, fallback?: string) {
  const value = process.env[name] ?? fallback;

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

const isProduction = process.env.NODE_ENV === "production";

export const env = {
  authSecret: required(
    "AUTH_SECRET",
    isProduction ? undefined : developmentAuthSecret,
  ),
  databasePath: required("DATABASE_PATH", "./data/db.sqlite"),
  hostname: required("HOSTNAME", "http://localhost:3027"),
  port: Number.parseInt(process.env.PORT ?? "3027", 10),
  superuserEmail: required(
    "SU_EMAIL",
    isProduction ? undefined : "admin@example.com",
  ),
  superuserPassword: required(
    "SU_PASSWORD",
    isProduction ? undefined : "development-password-change-before-production",
  ),
};

if (!Number.isInteger(env.port) || env.port <= 0 || env.port > 65_535) {
  throw new Error("PORT must be a valid TCP port number");
}
