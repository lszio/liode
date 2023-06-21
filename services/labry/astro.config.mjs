import { defineConfig } from 'astro/config'; // https://astro.build/config

import mdx from "@astrojs/mdx"; // https://astro.build/config

import vue from "@astrojs/vue"; // https://astro.build/config

import react from "@astrojs/react";

import elm from "astro-integration-elm"

// https://astro.build/config
export default defineConfig({
  integrations: [mdx(), vue(), react(), elm()]
});
