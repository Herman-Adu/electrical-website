/// <reference types="vitest" />
import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    {
      name: 'strip-shebang',
      enforce: 'pre' as const,
      transform(code: string, id: string) {
        if (/\.mjs$/.test(id) && code.startsWith('#!')) {
          return code.replace(/^#![^\n]*\n?/, '');
        }
      },
    },
  ],
  test: {
    environment: "happy-dom",
    globals: true,
    setupFiles: ["./test/setup.ts"],
    testTimeout: 15000,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      exclude: [
        "node_modules/",
        "test/",
        "*.config.ts",
        "**/*.d.ts",
        "**/dist/**",
        ".next/**",
      ],
    },
    include: ["**/__tests__/**/*.test.ts", "**/__tests__/**/*.test.tsx"],
    exclude: ["node_modules", "dist", ".idea", ".git", ".cache"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
      "server-only": path.resolve(__dirname, "./test/mocks/server-only.ts"),
    },
  },
});
