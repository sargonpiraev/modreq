import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));

mkdirSync(join(root, "deploy"), { recursive: true });

// Cloud Functions runs `npm run build` if present — ship prebuilt lib only.
writeFileSync(
  join(root, "deploy/package.json"),
  JSON.stringify(
    {
      name: src.name,
      version: src.version,
      private: true,
      main: "lib/index.js",
      engines: src.engines,
      dependencies: src.dependencies,
    },
    null,
    2,
  ) + "\n",
);
