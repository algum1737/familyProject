import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
  recommendedConfig: js.configs.recommended
});

const config = [
  {
    ignores: [".next/**", "node_modules/**"]
  },
  ...compat.extends("next/core-web-vitals")
];

export default config;

