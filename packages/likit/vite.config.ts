import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    build: {
      lib: {
        entry: "src/index",
        name: "likit",
        fileName: (format) =>
          format === "es" ? "index.js" : `index.${format}.js`,
      },
    },
    plugins: [
      dts({
        rollupTypes: true,
      }),
    ],
  };
});
