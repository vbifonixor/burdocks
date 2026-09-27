import { useEffect } from "react";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "react-router";

export const links = () => [
  { href: "/manifest.webmanifest", rel: "manifest" },
  { href: "/apple-touch-icon-180x180.png", rel: "apple-touch-icon" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();

  useEffect(() => {
    if (error instanceof TypeError) {
      window.alert("The request could not reach the server.");
    }
  }, [error]);

  return (
    <main>
      <h1>Something went wrong</h1>
      <p>Please try again.</p>
    </main>
  );
}
