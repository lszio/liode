const path = require("path");
const root = path.resolve(__dirname, "../../..");
const glob = require("glob");
const { vanillaExtractPlugin } = require("@vanilla-extract/vite-plugin");

const mdxFiles = glob.sync(`${root}/**/*.stories.mdx`).filter(file => !file.match("node_modules"))

console.log(mdxFiles)

module.exports = {
  "stories": [
    // ...mdxFiles,
    `${root}/packages/**/*.stories.mdx`,
    `${root}/packages/**/*.stories.@(js|jsx|ts|tsx)`,
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  "framework": "@storybook/react",
  "core": {
    "builder": "@storybook/builder-vite"
  },
  features: {
    storyStoreV7: true
  },
  async viteFinal(config, { configType }) {
    config.plugins.push(vanillaExtractPlugin());
    return config;
  }
}
// see https://github.com/storybookjs/builder-vite/blob/main/examples/react-18/.storybook/main.js
