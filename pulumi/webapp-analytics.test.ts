import assert from "node:assert/strict";
import path from "node:path";
import { describe, it, before } from "node:test";
import { fileURLToPath } from "node:url";
import * as pulumi from "@pulumi/pulumi";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

const registered: Array<{ type: string; name: string }> = [];

await pulumi.runtime.setMocks(
  {
    newResource(args: pulumi.runtime.MockResourceArgs) {
      registered.push({ type: args.type, name: args.name });
      return {
        id: `${args.name}_id`,
        state: args.inputs,
      };
    },
    call(args: pulumi.runtime.MockCallArgs) {
      return args.inputs;
    },
  },
  "modreq-webapp-infra",
  "test",
  false,
);

const { createWebappProductAnalytics, repoHasWebapp, WEBAPP_TYPE } =
  await import("./webapp-analytics.ts");

async function flushPulumiMocks(): Promise<void> {
  await new Promise<void>((resolve) => setImmediate(resolve));
  await new Promise<void>((resolve) => setImmediate(resolve));
}

describe("modreq webapp product analytics (Pulumi mocks)", () => {
  before(() => {
    assert.equal(
      repoHasWebapp(repoRoot),
      true,
      "modreq must have apps/webapp so the Webapp pack is required",
    );
  });

  it("registers shared Webapp ComponentResource when webapp exists", async () => {
    createWebappProductAnalytics({
      gcpProjectId: "sargonpiraev",
      datasetId: "searchconsole_modreq",
      location: "EU",
      gscSiteUrl: "sc-domain:modreq.example.invalid",
      gscServiceAccountKeyB64: Buffer.from(
        JSON.stringify({ project_id: "sargonpiraev" }),
      ).toString("base64"),
      gcpServiceAccountKeyB64: Buffer.from(
        JSON.stringify({ project_id: "sargonpiraev" }),
      ).toString("base64"),
      vercelApiToken: "test",
    });
    await flushPulumiMocks();

    const types = new Set(registered.map((r) => r.type));
    assert.ok(
      types.has(WEBAPP_TYPE),
      `expected ${WEBAPP_TYPE}, got: ${[...types].join(", ")}`,
    );
    assert.ok(
      types.has("ga4:index:Property"),
      `expected ga4:index:Property, got: ${[...types].join(", ")}`,
    );
    assert.ok(
      types.has("ga4:index:BigQueryLink"),
      `expected ga4:index:BigQueryLink, got: ${[...types].join(", ")}`,
    );
  });
});
