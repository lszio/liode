import { defineConfig } from 'astro/config';

import mdx from "@astrojs/mdx";
import org from "@orgajs/astro"
import react from "@astrojs/react";
import vue from "@astrojs/vue";
import tailwind from "@astrojs/tailwind"

import sitemap from "@astrojs/sitemap"
import vercel from "@astrojs/vercel/serverless"

export default defineConfig({
  site: "https://labry.vercel.app",
  integrations: [mdx(), org({}), vue(), react(), tailwind(), sitemap()],
  output: "server",
  adapter: vercel({
    functionPerRoute: false
  }),
  vite: {
    ssr: {
      noExternal: ["react-icons",]
    }
  }
});
