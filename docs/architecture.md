# Architecture

## Overview

Align is a linear pipeline triggered by a voice recording. Each run 
produces four output files written to GitHub. The pipeline has no database, 
no persistent server state, and no queue — it is a stateless transformation 
from audio to structured markdown.

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
    ├─── Output 1: daily note       → GitHub (notes/YYYY-MM-DD.md)
    ├─── Output 2: rolling handover → GitHub (rolling-handover.md, overwrite)
    ├─── Output 3: archive entries  → GitHub (archive.md, append)
    └─── Output 4: memory entries   → GitHub (memory/YYYY-MM.md, append)
```

---

## Components

### iOS Shortcut

Triggers the pipeline. Records audio, uploads the file to a webhook URL, 
and fires the n8n trigger. No other client-side logic.

### n8n (orchestration)

Self-hosted. Receives the webhook, sequences all downstream calls, and 
handles the four GitHub writes at the end of each run.

All workflow logic lives in the importable workflow JSON. The Gemini 
system prompt is managed in `prompts/gemini-main.md` and injected at 
runtime — it is not embedded in the workflow itself.

### Deepgram Nova-3 (transcription)

Handles multilingual input (Russian/English code-switching). Returns a 
raw transcript string passed directly to Gemini with no intermediate 
cleaning.

### GitHub API (storage)

Two read operations before the Gemini call:
- Fetch current `rolling-handover.md` (injected as rolling context)
- Fetch current `memory/YYYY-MM.md` if it exists (for continuity)

Four write operations after:
- Create or update `walks/YYYY-MM-DD.md`
- Overwrite `handover/rolling-handover.md`
- Append to `handover/archive.md`
- Append to `memory/YYYY-MM.md`

All writes target a private repository separate from this one.

### Gemini Flash (processing)

Receives a single prompt containing:
1. Today's date
2. The current rolling handover
3. The raw transcript

Produces four outputs separated by delimiter lines:
```
===ROLLING_UPDATE===
===ARCHIVE_ENTRIES===
===MEMORY_ENTRIES===
```

n8n splits on these delimiters to route each output to the correct 
GitHub write.

### Obsidian (local reading)

Syncs the private storage repo via the Obsidian Git plugin. Read-only 
view — no writes from Obsidian. Dataview queries work against the YAML 
frontmatter in daily notes.

---

## Data flow in detail

### Normal run (single recording)

1. iOS Shortcut uploads audio → n8n webhook fires
2. n8n sends audio to Deepgram → receives transcript
3. n8n fetches `rolling-handover.md` from GitHub
4. n8n assembles prompt: date + handover + transcript
5. n8n sends prompt to Gemini Flash → receives combined output
6. n8n splits output on delimiters
7. n8n writes all four outputs to GitHub in parallel

Total runtime: ~30–60 seconds depending on transcript length.

### Second recording same day

The daily note write checks whether `walks/YYYY-MM-DD.md` already exists.
If it does, new content is appended under a timestamped `## HH:MM` 
section rather than overwriting. The rolling handover is always fully 
rewritten regardless.

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
    └── YYYY-MM.md          # append-only, one file per month
```

---

## What n8n does not do

- No retry logic on Deepgram or Gemini failures — acceptable for a 
  personal tool with low run frequency; just re-run manually
- No validation of Gemini output structure — delimiter parsing assumes 
  well-formed output
- No deduplication of archive entries

These are intentional omissions. Robustness complexity is not justified 
at this scale.

---

## Planned additions

See [ROADMAP.md](../ROADMAP.md) for sequencing. The next architectural 
change is Discord integration, which adds:
- An outbound webhook from n8n to a Discord channel after each run
- A second n8n workflow triggered by Discord messages for text-input 
  capture and memory queries

These are additive — the core pipeline does not change.
