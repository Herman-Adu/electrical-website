import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import unusedImportsPlugin from "eslint-plugin-unused-imports";
import globals from "globals";

export default [
  // Global ignores
  {
    ignores: [
      ".next",
      "node_modules",
      "build",
      "dist",
      ".git",
      ".vercel",
      "*.log",
      ".env",
      ".env.local",
      ".env*.local",
      "coverage",
      "playwright-report",
      ".nyc_output",
      "out",
      ".cache",
      ".DS_Store",
      "next-env.d.ts",
    ],
  },

  // TypeScript and React configuration
  {
    files: ["**/*.{js,jsx,mjs,cjs,ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2024,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      "react-hooks": reactHooksPlugin,
      "unused-imports": unusedImportsPlugin,
    },
    rules: {
      // React hooks
      "react-hooks/rules-of-hooks": "error",
      // Disable exhaustive deps warnings for custom hooks (can be re-enabled per-hook with comments)
      "react-hooks/exhaustive-deps": "off",

      // TypeScript
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        {
          prefer: "type-imports",
        },
      ],
      "@typescript-eslint/explicit-module-boundary-types": "off",

      // Unused imports
      "unused-imports/no-unused-imports": "warn",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],

      // General rules
      "no-console": [
        "warn",
        {
          allow: ["warn", "error"],
        },
      ],
      "prefer-const": "warn",
      "no-var": "error",
    },
  },
];
