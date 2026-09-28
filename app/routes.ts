import { index, type RouteConfig, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("sign-in", "routes/sign-in.tsx"),
  route("admin", "routes/admin.tsx"),
  route("api/auth/*", "routes/api.auth.$.ts"),
  route("ping", "routes/ping.ts"),
] satisfies RouteConfig;
