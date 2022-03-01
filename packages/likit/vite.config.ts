import { defineConfig } from "vite";
import { join } from "path";
import dts from "vite-plugin-dts";

const resolve = (dir) => join(__dirname, dir);

// https://vitejs.dev/config/
export default defineConfig(({ }) => {
  return {
    resolve: {
      alias: {},
    },
    build: {
      lib: {
        entry: "src/likit",
        name: "likit",
        fileName: (format) => `likit.${format}.js`,
      },
      rollupOptions: {
        external: ["vue"],
        output: {
          globals: {
            vue: "Vue",
          },
        },
      },
    },
    plugins: [dts()]
  };
});
