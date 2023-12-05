import { defineConfig } from 'astro/config';

import mdx from "@astrojs/mdx";
import org from "@orgajs/astro"
import vue from "@astrojs/vue";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap"
import tailwind from "@astrojs/tailwind"

import nodejs from "@astrojs/node"
import vercel from "@astrojs/vercel/serverless"
import { loadEnv } from "vite"
const { ADAPTER_TYPE } = loadEnv(process.env.NODE_ENV, process.cwd(), "")

let adapter;

switch (ADAPTER_TYPE) {
  case "vercel":
    adapter = vercel({
      functionPerRoute: false
    })
    break;
  default:
    adapter = nodejs({
      mode: "standalone"
    })
}

export default defineConfig({
  site: "https://labry.vercel.app",
  integrations: [mdx(), org({}), vue(), react({}), tailwind(), sitemap()],
  output: "server",
  adapter,
  vite: {
    ssr: {
      noExternal: ["react-icons",]
    },
  }
});
