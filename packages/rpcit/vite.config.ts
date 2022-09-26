import { defineConfig } from "vite";
import * as path from "path";
import { resolve } from "path";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "rpcit",
      formats: ["es", "umd"],
      fileName: (format) => `index.${format}.js`
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    },
  },
  plugins: [dts({ insertTypesEntry: true })]
});
