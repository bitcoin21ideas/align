# AGENTS.md — Align

## What this is
Personal voice-to-memory pipeline. Walking monologues → structured notes +
rolling task dashboard + typed memory entries. Built on n8n, Deepgram,
Gemini Flash, GitHub.

## Stack
- n8n (self-hosted) for orchestration
- Deepgram Nova-3 for transcription
- Gemini Flash for processing (4 outputs per run)
- GitHub API for storage
- Obsidian for local reading

## Key files
- workflows/walks-processing.json — sanitized public n8n workflow template
- workflows/.local/walks-processing.raw.json — ignored raw export from live n8n, never commit
- scripts/sanitize-n8n-workflow.mjs — converts raw n8n export to public template
- scripts/check-public-workflow.mjs — verifies public workflow has no private metadata
- prompts/gemini-main.md — the system prompt, edit here not in the workflow
- docs/architecture.md — how it all connects

## Constraints
- Never edit the Gemini prompt inside the workflow JSON — edit prompts/gemini-main.md
- The private storage repo (walks/, handover/, memory/) is a data store — don't confuse it with this repo
- Archive and memory files must exist before first workflow run
- Never commit raw n8n exports. Save them under workflows/.local/ and sanitize first.
- After any n8n workflow export, run:
  - `node scripts/sanitize-n8n-workflow.mjs`
  - `node scripts/check-public-workflow.mjs`
- Only commit workflows/walks-processing.json after the public workflow checker passes.
- On every git commit, update CHANGELOG.md — add an entry under the appropriate version with a one-line description of what changed. Keep entries minimal and direct.

## Git
- Always push with `git push origin HEAD:main` — the working branch is always a worktree, never push to it directly.
- Stage specific files only. Never use `git add .` or `git add -A`.
- Never add `Co-Authored-By` or similar agent attribution trailers to commits.
- Never use `--no-verify` unless the user explicitly asks for it and accepts the risk.

## Commit procedure
- Start with `git status --short`, `git diff --stat`, `git diff --cached --stat`, `git log --oneline -20`, and `git branch --show-current`.
- If there are merge conflicts, stop and report the conflicted files.
- Respect existing staging. If files are already staged, inspect staged diffs first and do not unstage or regroup without user approval.
- If nothing is staged, group changes into logical commits by area: workflow/prompt changes, docs, scripts/CI, and repo metadata.
- Never stage `.env*`, `.claude/`, `docs/plans/`, `workflows/.local/`, raw n8n exports, private keys, or local editor/build artifacts.
- Scan staged or about-to-be-staged `.md`, `.json`, `.js`, and `.mjs` files for obvious secrets before committing. Do not print secret-looking values; report only file and line.
- If `workflows/walks-processing.json` changed, run `node scripts/check-public-workflow.mjs` before committing.
- If a live n8n workflow was exported, save it as `workflows/.local/walks-processing.raw.json`, then run `node scripts/sanitize-n8n-workflow.mjs` and `node scripts/check-public-workflow.mjs`.
- Validate workflow JSON before committing: `node -e "JSON.parse(require('fs').readFileSync('workflows/walks-processing.json', 'utf8'))"`.
- Update `CHANGELOG.md` for every commit with one minimal line under the appropriate version.
- Propose the commit grouping and messages before committing when multiple logical units are present.
- Use concise conventional commit messages matching recent history, e.g. `fix(workflow): skip empty memory appends` or `docs: document workflow export hygiene`.

## Current status
Core pipeline working. Discord integration next.
