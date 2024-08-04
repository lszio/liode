import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import solid from "@astrojs/solid-js";
import unocss from "@unocss/astro"

// https://astro.build/config
export default defineConfig({
    integrations: [
        mdx(),
        solid({ devtools: true }),
        unocss()
    ]
});
