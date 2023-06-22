import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import org from "@orgajs/astro"

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://example.com',
  integrations: [org({}), mdx(), sitemap()],
});
