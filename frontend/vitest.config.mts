import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    exclude: ["tests/e2e/**", "**/node_modules/**"],
    include: ["tests/**/*.test.{ts,tsx}"],
  },
  coverage: {
    provider: "v8",
    exclude: [
      "src/main.tsx",
      "src/vite-env.d.ts",
      "tests/**",
      "vite.config.ts",
      "vitest.config.mts",
      "tailwind.config.js",
      "postcss.config.js",
      "eslint.config.js",
    ],
  },
});
