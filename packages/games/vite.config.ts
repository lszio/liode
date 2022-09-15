import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "path";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import { resolve } from "path";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "ferldGames",
      formats: ["es", "umd"],
      fileName: (format) => `index.${format}.js`
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDom"
        }
      }
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    },
  },
  plugins: [react(), vanillaExtractPlugin(), dts({
    insertTypesEntry: true
  })]
});
