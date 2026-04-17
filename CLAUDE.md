# CLAUDE.md — Align

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
- workflows/walks-processing.json — full n8n workflow, import directly
- prompts/gemini-main.md — the system prompt, edit here not in the workflow
- docs/architecture.md — how it all connects

## Constraints
- Never edit the Gemini prompt inside the workflow JSON — edit prompts/gemini-main.md
- The private storage repo (walks/, handover/, memory/) is a data store — don't confuse it with this repo
- Archive and memory files must exist before first workflow run
- On every git commit, update CHANGELOG.md — add an entry under the appropriate version with a one-line description of what changed. Keep entries minimal and direct.

## Git
- Always push with `git push origin HEAD:main` — the working branch is always a worktree, never push to it directly.

## Current status
Core pipeline working. Discord integration next.