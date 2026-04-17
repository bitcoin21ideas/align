# Discord Integration Design

## Purpose

Discord serves as the primary UI layer for Align — a persistent, 
mobile-accessible interface for reading outputs, capturing text notes, 
and querying memory without opening a file editor.

The core pipeline (audio → n8n → Gemini → GitHub) does not change. 
Discord is additive: a read surface and a secondary input channel.

---

## Channel structure

A single personal Discord server with four channels:

| Channel | Role |
|---|---|
| `#walk-briefs` | Auto-posted summary after each pipeline run |
| `#quick-capture` | Text input → triggers pipeline, skips transcription |
| `#ask` | Natural language queries against memory and notes |
| `#weekly-digest` | Sunday synthesis (planned, lower priority) |

---

## `#walk-briefs` — post-run summary

After every pipeline run, n8n posts a formatted message containing the 
**Today's Focus** section from the daily note.

This gives an at-a-glance confirmation that the run completed and what 
the system understood as the day's priorities — without requiring you to 
open the note.

**Format:**
```
📅 YYYY-MM-DD

**Today's Focus**
• bullet one
• bullet two
• bullet three

[X tasks added] · [Y items archived] · [Z memory entries]
```

Implementation: n8n HTTP node → Discord webhook after the four GitHub 
writes complete. No new workflow — appended to the existing run.

---

## `#quick-capture` — text input trigger

A Discord message in this channel triggers a second n8n workflow that 
runs the same Gemini processing pipeline, skipping the transcription step.

**Use case:** capturing a decision or constraint mid-session without 
recording a full monologue. "Just decided X because Y" sent from a phone 
is enough.

**Flow:**
```
Discord message in #quick-capture
    │
    ▼
n8n Discord trigger
    │
    ▼
Gemini Flash (same prompt, text substituted for transcript)
    │
    └─── same four GitHub writes as normal run
```

The message text is treated as the transcript. The rolling handover is 
read from GitHub and injected the same way. Outputs are identical in 
structure.

**Constraints:**
- Only messages from the server owner trigger the workflow (bot checks 
  author ID)
- No confirmation message needed — the `#walk-briefs` post after the run 
  serves as confirmation

---

## `#ask` — memory queries

A message in `#ask` triggers a query workflow that reads relevant memory 
and note files from GitHub and returns a synthesised answer.

**Use cases:**
- "What did I decide about X last month?"
- "What constraints have I logged for project Y?"
- "What mistakes have I made that are tagged cross-project?"

**Flow:**
```
Discord message in #ask
    │
    ▼
n8n Discord trigger
    │
    ├─── GitHub API: read memory/YYYY-MM.md (current + prior months)
    ├─── GitHub API: read recent walks/ notes (configurable window)
    │
    ▼
Gemini Flash (query prompt + files as context)
    │
    ▼
Discord reply in thread
```

The query prompt instructs Gemini to answer from provided context only — 
no hallucination of facts not present in the files.

**Scope at launch:** current month's memory file + last 7 daily notes. 
Expanding to full corpus is a later milestone (see RAG in ROADMAP).

---

## `#weekly-digest` — Sunday synthesis (planned)

A scheduled n8n workflow runs every Sunday, reads the past 7 daily notes 
and the current month's memory file, and posts a synthesis to this channel.

Covers:
- What got done vs. what stalled
- Patterns across the week
- Memory entries worth highlighting
- Open questions that have been sitting longest

**Status:** planned. Not implemented until the monthly pattern detective 
(a similar but longer-horizon workflow) is validated as useful first.

---

## Implementation order

1. `#walk-briefs` webhook — lowest complexity, immediate value, no new 
   workflow required
2. `#quick-capture` text trigger — new workflow, but reuses all existing 
   pipeline logic
3. `#ask` query endpoint — new prompt, new read logic, most novel piece
4. `#weekly-digest` — last, conditional on monthly pattern detective

---

## What Discord is not

- Not a storage layer — all data still lives in GitHub
- Not a collaboration surface — single-user personal server
- Not a replacement for Obsidian — Discord is for mobile interaction, 
  Obsidian is for desktop reading and Dataview queries
