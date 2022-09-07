import react from "@vitejs/plugin-react";
import svgr from "@svgr/rollup";
import { resolve } from "path";
import { defineConfig } from "vite";

const ROOT_DIR = resolve(__dirname);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      icon: true,
      replaceAttrValues: { "#000": "currentColor" },
      titleProp: true,
      svgoConfig: {
        plugins: [
          {
            name: "prefixIds",
            active: false,
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: [
      {
        find: "src",
        replacement: resolve(ROOT_DIR, "src"),
      },
    ],
  },
});
