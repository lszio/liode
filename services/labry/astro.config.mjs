import { defineConfig } from 'astro/config';

import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import vue from "@astrojs/vue";
import tailwind from "@astrojs/tailwind"
import elm from "astro-integration-elm"

export default defineConfig({
  integrations: [mdx(), vue(), react(), elm(), tailwind()]
});
