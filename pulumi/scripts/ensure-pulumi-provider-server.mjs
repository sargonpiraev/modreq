import { existsSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

/**
 * `@sargonpiraev/pulumi-gsc` imports `@pulumi/pulumi/provider/server` (no .js).
 * Fresh npm installs of @pulumi/pulumi only ship `provider/server.js`, so Node ESM fails.
 */
const require = createRequire(import.meta.url);
const stub = join(
  dirname(require.resolve("@pulumi/pulumi/package.json")),
  "provider/server",
);
if (!existsSync(stub)) {
  writeFileSync(stub, 'export * from "./server.js";\n');
}
