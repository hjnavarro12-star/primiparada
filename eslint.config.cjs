const parser = require("@typescript-eslint/parser");

module.exports = {
  ignores: ["dist/**", "node_modules/**", "notes/**"],
  languageOptions: {
    parser,
    parserOptions: {
      ecmaVersion: 2024,
      sourceType: "module",
      project: ["./tsconfig.app.json", "./tsconfig.spec.json"],
      tsconfigRootDir: __dirname
    }
  },
  plugins: {
    "@typescript-eslint": require("@typescript-eslint/eslint-plugin")
  },
  rules: {
    "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/no-explicit-any": "off"
  },
  files: ["src/**/*.{ts,js}"]
};
