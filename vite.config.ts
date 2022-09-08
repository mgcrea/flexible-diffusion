import react from "@vitejs/plugin-react";
import svgr from "@svgr/rollup";
import { resolve } from "path";
import { defineConfig, loadEnv } from "vite";

const ROOT_DIR = resolve(__dirname);

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const { STABLE_DIFFUSION_SERVER = "http://localhost:9090" } = env;

  return {
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
    server: {
      proxy: {
        "/cancel": {
          target: STABLE_DIFFUSION_SERVER,
          changeOrigin: true,
        },
        "/config.js": {
          target: STABLE_DIFFUSION_SERVER,
          changeOrigin: true,
        },
        "/dream": {
          target: STABLE_DIFFUSION_SERVER,
          changeOrigin: true,
        },
        "/outputs": {
          target: STABLE_DIFFUSION_SERVER,
          changeOrigin: true,
        },
      },
    },
  };
});
