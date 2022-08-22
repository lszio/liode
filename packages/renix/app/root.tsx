import type { MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import tailwindcss from "./styles/tailwind.css";
import { Layout } from "./layout";

export function links() {
  return [{ rel: "stylesheet", href: tailwindcss }]
}

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Renix",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Layout >
          <Outlet />
        </Layout>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
