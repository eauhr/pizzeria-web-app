import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

const sourceDirectory = fileURLToPath(new URL("./src", import.meta.url));

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === "build" ? "/pizzeria-web-app/" : "/",
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
  },

  resolve: {
    alias: {
      "@": sourceDirectory,
    },
  },

  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5127',
        changeOrigin: true,
        secure: false,
      }
    },
  },
}));
