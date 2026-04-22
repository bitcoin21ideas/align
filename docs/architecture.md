# Architecture

## Overview

Align is a linear pipeline triggered by a voice recording. Each run produces four output files written to GitHub. The pipeline has no database, no persistent server state, and no queue — it is a stateless transformation from audio to structured markdown.

```
iOS Shortcut
    │
    ▼
n8n webhook
    │
    ├─── Deepgram Nova-3 (transcription)
    │
    ├─── GitHub API (read rolling-handover.md)
    │
    ▼
Gemini Flash (single prompt → 4 structured outputs)
    │
    ├─── Output 1: daily note       → GitHub (walks/YYYY-MM-DD.md)
    ├─── Output 2: rolling handover → GitHub (rolling-handover.md, overwrite)
    ├─── Output 3: archive entries  → GitHub (archive.md, append)
    └─── Output 4: memory entries   → GitHub (memory/YYYY-MM.md, append) → GitHub (memory/memory-index.md, append — derived)
```

---

## Components

### iOS Shortcut

Triggers the pipeline. Records audio, uploads the file to a webhook URL, and fires the n8n trigger. No other client-side logic.

### n8n (orchestration)

Self-hosted. Receives the webhook, sequences all downstream calls, and handles the four GitHub writes at the end of each run.

All workflow logic lives in the importable workflow JSON. The Gemini system prompt is managed in `prompts/gemini-main.md` and injected at runtime — it is not embedded in the workflow itself.

### Deepgram Nova-3 (transcription)

Handles multilingual input (Russian/English code-switching). Returns a raw transcript string passed directly to Gemini with no intermediate cleaning.

### GitHub API (storage)

Four read operations before the Gemini call:
- Fetch current `rolling-handover.md` (injected as rolling context)
- Fetch current `memory/YYYY-MM.md` if it exists (for continuity)
- Fetch `memory/_projects.md` (injected as project registry — authoritative tag list)
- Fetch `memory/memory-index.md` (injected as memory index for supersession detection)

Five write operations after:
- Create or update `walks/YYYY-MM-DD.md`
- Overwrite `handover/rolling-handover.md`
- Append to `handover/archive.md`
- Append to `memory/YYYY-MM.md`
- Append to `memory/memory-index.md` (only when new memory entries were written)

All writes target a private repository separate from this one.

### Gemini Flash (processing)

Receives a single prompt containing:
1. Today's date
2. The project registry (authoritative list of valid project tags, from `memory/_projects.md`)
3. The memory index (all prior entries, one line each)
4. The current rolling handover
5. The raw transcript

Produces four outputs separated by delimiter lines:
```
===ROLLING_UPDATE===
===ARCHIVE_ENTRIES===
===MEMORY_ENTRIES===
```

n8n splits on these delimiters to route each output to the correct GitHub write.

### Obsidian (local reading)

Syncs the private storage repo via the Obsidian Git plugin. Read-only view — no writes from Obsidian. Dataview queries work against the YAML frontmatter in daily notes.

---

## Data flow in detail

### Normal run (single recording)

1. iOS Shortcut uploads audio → n8n webhook fires
2. n8n sends audio to Deepgram → receives transcript
3. n8n fetches `handover/rolling-handover.md`, `memory/_projects.md`, and `memory/memory-index.md` from GitHub
4. n8n assembles prompt: date + project registry + memory index + handover + transcript
5. n8n sends prompt to Gemini Flash → receives combined output
6. n8n splits output on delimiters
7. n8n writes all outputs to GitHub; if memory entries were produced, also appends to `memory/memory-index.md`

Total runtime: ~30–60 seconds depending on transcript length.

### Second recording same day

The daily note write checks whether `walks/YYYY-MM-DD.md` already exists.
If it does, new content is appended under a timestamped `## HH:MM` section rather than overwriting. The rolling handover is always fully rewritten regardless.

---

## File locations (storage repo)

```
(private repo)/
├── walks/
│   └── YYYY-MM-DD.md       # one per day, frontmatter for Dataview
├── handover/
│   ├── rolling-handover.md # overwritten each run, 60-line cap
│   └── archive.md          # append-only, never modified
└── memory/
    └── _projects.md        # project tag registry, injected into every run
    └── YYYY-MM.md          # append-only, one file per month
    └── memory-index.md     # append-only, one line per entry, injected into every run
```

---

## What n8n does not do

- No validation of Gemini output structure — delimiter parsing assumes well-formed output
- No deduplication of archive entries

These are intentional omissions. Robustness complexity is not justified at this scale.

---

## Planned additions

See [ROADMAP.md](../ROADMAP.md) for sequencing. The next architectural change is Discord integration, which adds:
- An outbound webhook from n8n to a Discord channel after each run
- A second n8n workflow triggered by Discord messages for text-input capture and memory queries

These are additive — the core pipeline does not change.
