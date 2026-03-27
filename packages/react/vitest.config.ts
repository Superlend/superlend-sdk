import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const reactDir = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      // Tests run against SDK source so new client methods are available without pre-building `packages/sdk/dist`.
      "@superlend/sdk": path.resolve(reactDir, "../sdk/src/index.ts"),
    },
  },
  test: {
    environment: "happy-dom",
  },
});
