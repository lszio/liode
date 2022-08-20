import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from "path"
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin"
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "EliyaGames",
      fileName: "index"
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "react",
          "react-dom": "react-dom"
        }
      }
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    },
  },
  plugins: [react(), vanillaExtractPlugin()]
})
