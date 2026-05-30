#!/usr/bin/env node

import fs from "node:fs";

const workflowPath = process.argv[2] ?? "workflows/walks-processing.json";
loadLocalEnvFile(".env");

const text = fs.readFileSync(workflowPath, "utf8");
const workflow = JSON.parse(text);
const errors = [];

const forbiddenText = Object.entries(process.env)
  .filter(([key, value]) => key.startsWith("PUBLIC_WORKFLOW_FORBIDDEN_TEXT_") && String(value ?? "").trim())
  .map(([key, value]) => [key, String(value).trim()]);

for (const [envKey, needle] of forbiddenText) {
  if (text.includes(needle)) {
    errors.push(`Found local forbidden text configured by ${envKey}`);
  }
}

const tokenPatterns = [
  ["GitHub token", /github_pat_[A-Za-z0-9_]{20,}|gh[pousr]_[A-Za-z0-9_]{20,}/],
  ["Google API key", /AIza[0-9A-Za-z_-]{35}/],
  ["OpenAI API key", /sk-[A-Za-z0-9]{20,}/],
  ["Deepgram-like token", /dg_[A-Za-z0-9]{20,}/],
  ["Discord webhook URL", /https:\/\/discord(?:app)?\.com\/api\/webhooks\/[0-9]+\/[A-Za-z0-9._-]+/],
];

for (const [label, pattern] of tokenPatterns) {
  if (pattern.test(text)) {
    errors.push(`Found ${label} pattern`);
  }
}

for (const node of workflow.nodes ?? []) {
  if ("webhookId" in node) {
    errors.push(`Node "${node.name}" still has webhookId metadata`);
  }

  if (node.credentials && typeof node.credentials === "object") {
    for (const [type, credential] of Object.entries(node.credentials)) {
      if (!String(credential.id ?? "").startsWith("REPLACE_WITH_")) {
        errors.push(`Node "${node.name}" has non-placeholder ${type} credential id`);
      }
      if (!String(credential.name ?? "").startsWith("REPLACE_WITH_")) {
        errors.push(`Node "${node.name}" has non-placeholder ${type} credential name`);
      }
    }
  }

  if (node.type === "n8n-nodes-base.github") {
    const params = node.parameters ?? {};
    const owner = String(params.owner?.value ?? "");
    const repo = String(params.repository?.value ?? "");
    const cachedUrl = String(params.repository?.cachedResultUrl ?? "");

    if (!owner.includes("REPLACE_WITH_GITHUB_OWNER")) {
      errors.push(`Node "${node.name}" has non-placeholder GitHub owner`);
    }
    if (!repo.startsWith("REPLACE_WITH_")) {
      errors.push(`Node "${node.name}" has non-placeholder GitHub repository`);
    }
    if (!cachedUrl.includes("REPLACE_WITH_GITHUB_OWNER")) {
      errors.push(`Node "${node.name}" has non-placeholder cached GitHub URL`);
    }
  }
}

if (errors.length) {
  console.error("Public workflow check failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Public workflow check passed: ${workflowPath}`);

function loadLocalEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;

  const envText = fs.readFileSync(filePath, "utf8");
  for (const rawLine of envText.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!match) continue;

    const [, key, rawValue] = match;
    if (process.env[key] !== undefined) continue;

    process.env[key] = parseEnvValue(rawValue);
  }
}

function parseEnvValue(rawValue) {
  const value = rawValue.trim();
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }
  return value;
}
