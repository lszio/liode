import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    resolve: {
      alias: {}
    },
    build: {
      lib: {
        entry: "src/index",
        name: "likit",
        fileName: format => `likit.${format}.js`
      }
    },
    plugins: [dts()]
  };
});
