#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const DEFAULT_INPUT = "workflows/.local/walks-processing.raw.json";
const DEFAULT_OUTPUT = "workflows/walks-processing.json";

const PLACEHOLDERS = {
  ownerUrl: "https://github.com/REPLACE_WITH_GITHUB_OWNER",
  alignRepo: "REPLACE_WITH_ALIGN_REPO",
  storageRepo: "REPLACE_WITH_STORAGE_REPO",
  alignRepoUrl: "https://github.com/REPLACE_WITH_GITHUB_OWNER/REPLACE_WITH_ALIGN_REPO",
  storageRepoUrl: "https://github.com/REPLACE_WITH_GITHUB_OWNER/REPLACE_WITH_STORAGE_REPO",
  webhookPath: "replace-with-random-webhook-path",
};

const CREDENTIAL_PLACEHOLDERS = {
  githubApi: {
    id: "REPLACE_WITH_GITHUB_CREDENTIAL_ID",
    name: "REPLACE_WITH_GITHUB_CREDENTIAL",
  },
  httpHeaderAuth: {
    id: "REPLACE_WITH_DEEPGRAM_HEADER_AUTH_ID",
    name: "REPLACE_WITH_DEEPGRAM_HEADER_AUTH",
  },
  googlePalmApi: {
    id: "REPLACE_WITH_GEMINI_CREDENTIAL_ID",
    name: "REPLACE_WITH_GEMINI_CREDENTIAL",
  },
};

function usage() {
  console.error(
    [
      "Usage:",
      "  node scripts/sanitize-n8n-workflow.mjs [input] [output]",
      "",
      `Defaults: ${DEFAULT_INPUT} -> ${DEFAULT_OUTPUT}`,
    ].join("\n"),
  );
}

const [input = DEFAULT_INPUT, output = DEFAULT_OUTPUT] = process.argv.slice(2);

if (process.argv.includes("--help") || process.argv.includes("-h")) {
  usage();
  process.exit(0);
}

if (!fs.existsSync(input)) {
  console.error(`Input workflow not found: ${input}`);
  console.error("Export your live n8n workflow there first, then rerun this script.");
  process.exit(1);
}

const workflow = JSON.parse(fs.readFileSync(input, "utf8"));

for (const node of workflow.nodes ?? []) {
  delete node.webhookId;

  if (node.credentials && typeof node.credentials === "object") {
    for (const credentialType of Object.keys(node.credentials)) {
      node.credentials[credentialType] = CREDENTIAL_PLACEHOLDERS[credentialType] ?? {
        id: `REPLACE_WITH_${credentialType.toUpperCase()}_CREDENTIAL_ID`,
        name: `REPLACE_WITH_${credentialType.toUpperCase()}_CREDENTIAL`,
      };
    }
  }

  if (node.type === "n8n-nodes-base.webhook") {
    node.parameters ??= {};
    node.parameters.path = PLACEHOLDERS.webhookPath;
  }

  sanitizeGitHubNode(node);
}

function sanitizeGitHubNode(node) {
  if (node.type !== "n8n-nodes-base.github") return;

  const params = node.parameters ?? {};

  if (params.owner && typeof params.owner === "object") {
    params.owner.value = PLACEHOLDERS.ownerUrl;
    params.owner.mode = "url";
  }

  if (!params.repository || typeof params.repository !== "object") return;

  const filePath = String(params.filePath ?? "");
  const isAlignPromptNode = filePath === "prompts/gemini-main.md";
  const repoName = isAlignPromptNode ? PLACEHOLDERS.alignRepo : PLACEHOLDERS.storageRepo;
  const repoUrl = isAlignPromptNode ? PLACEHOLDERS.alignRepoUrl : PLACEHOLDERS.storageRepoUrl;

  params.repository.value = repoName;
  params.repository.mode = "list";
  params.repository.cachedResultName = repoName;
  params.repository.cachedResultUrl = repoUrl;
}

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, `${JSON.stringify(workflow, null, 2)}\n`);

console.log(`Sanitized workflow written to ${output}`);
