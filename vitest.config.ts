import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    include: ["tests/**/*.{test,spec}.ts"],
    exclude: ["tests/e2e/**", "node_modules/**", ".next/**"]
  },
  resolve: {
    alias: {
      "@": new URL("./src", import.meta.url).pathname,
      // Next.js resolves `server-only` internally; stub it for Vitest.
      "server-only": new URL("./node_modules/next/dist/compiled/server-only/empty.js", import.meta.url).pathname
    }
  }
});

