import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    // No test suite currently ships for this calculator's pure functions —
    // don't fail CI on an empty run; add tests and this stays a no-op.
    passWithNoTests: true,
  },
});
