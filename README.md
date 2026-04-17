# Align

A voice-first personal memory and productivity pipeline. Walking 
monologues become structured notes, a self-maintaining operational 
dashboard, and a typed memory layer — automatically, every run.

---

## What it does

You record a 15–30 minute walking monologue. Align produces four outputs:

| Output | Description |
|---|---|
| **Daily note** | Structured markdown with frontmatter — focus, tasks, project notes, dev learnings, open questions |
| **Rolling handover** | A living 60-line operational dashboard, fully rewritten each run with aggressive triage |
| **Archive** | Append-only record of every item removed from the handover, with reason and date |
| **Memory entries** | 0–5 typed extractions per session: decisions, constraints, mistakes, patterns |

The rolling handover is the differentiating output. It answers "what is 
actually in flight right now?" — not "what happened in the past." A hard 
60-line cap forces triage every run. Items that aren't worth defending 
get removed. The result is a document you can act from, not just archive to.

---

## Stack

- **n8n** (self-hosted) — orchestration
- **Deepgram Nova-3** — transcription, multilingual (Russian/English)
- **Gemini Flash** — AI processing, 4 structured outputs per run
- **GitHub API** — storage (private repository)
- **Obsidian + Git plugin** — local reading and Dataview queries
- **iOS Shortcut** — recording and pipeline trigger

---

## How a run works

1. Record a voice monologue via iOS Shortcut → uploads to n8n webhook
2. Deepgram transcribes the audio
3. n8n reads the current rolling handover from GitHub
4. Gemini Flash processes: transcript + handover → 4 delimited outputs
5. n8n writes all four outputs to GitHub

Total runtime: ~30–60 seconds.

---

## Repository structure

```
align/
├── prompts/
│   ├── gemini-main.md      # system prompt — edit here, not in the workflow
│   └── README.md
├── workflows/
│   ├── walks-processing.json  # n8n workflow — import directly
│   └── README.md
└── docs/
    ├── philosophy.md       # design principles and why they exist
    ├── architecture.md     # full pipeline and data flow
    ├── memory-schema.md    # memory entry types, format, and examples
    ├── discord-design.md   # Discord integration design spec
    └── product-vision.md   # longer-horizon product thinking
```

Storage lives in a separate private repository:

```
(storage repo)/
├── walks/                  # daily notes
├── handover/               # rolling-handover.md + archive.md
└── memory/                 # monthly memory files
```

---

## Setup

### Prerequisites

- n8n instance (self-hosted)
- Deepgram API key
- Google AI API key (Gemini Flash)
- GitHub personal access token with repo read/write scope
- Private GitHub repository for storage (with `walks/`, `handover/`, 
  and `memory/` directories and seed files created)

### Install

1. Clone this repository
2. Import `workflows/walks-processing.json` into n8n
3. Configure credentials in n8n for Deepgram, Google AI, and GitHub
4. Set environment variables (see `workflows/README.md` for the full list)
5. Activate the workflow — note the generated webhook URL
6. Update your iOS Shortcut with the webhook URL

### First run requirements

The storage repository must contain these files before the first run:

- `handover/rolling-handover.md` — can be empty or seeded with existing tasks
- `handover/archive.md` — can be empty
- `memory/YYYY-MM.md` — current month, can be empty

---

## Philosophy

Conscious capture beats auto-capture. The act of speaking a decision out 
loud — naming what you chose and why — produces clarity that passive 
recording never does. Every item in this system was put there 
intentionally.

See [docs/philosophy.md](docs/philosophy.md) for the full design rationale.

---

## Roadmap

See [ROADMAP.md](ROADMAP.md). Discord integration is next.
