import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    include: ["src/**/*.test.ts", "mcp/tests/*.spec.ts"],
    exclude: ["repos/**", "node_modules/**", "dist/**"],
  },
});
