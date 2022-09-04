import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";

const ROOT_DIR = resolve(__dirname);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: "src",
        replacement: resolve(ROOT_DIR, "src"),
      },
    ],
  },
});
