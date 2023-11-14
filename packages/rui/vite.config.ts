import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from "path";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "rui",
      formats: ["es"],
      fileName: "index",
    },
  },
  plugins: [
    react(),
    dts({
      rollupTypes: true,
    }),
  ],
});
