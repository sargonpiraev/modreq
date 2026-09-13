import { existsSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'

/**
 * `@sargonpiraev/pulumi-gsc` imports `@pulumi/pulumi/provider/server` (no .js).
 * Fresh npm installs of @pulumi/pulumi only ship `provider/server.js`, so Node ESM fails.
 */
const stub = join(
  dirname(createRequire(import.meta.url).resolve('@pulumi/pulumi/package.json')),
  'provider/server'
)
if (!existsSync(stub)) {
  writeFileSync(stub, 'export * from "./server.js";\n')
}
