# Prompts

This directory contains the system prompts used by Align's AI processing 
steps. Prompts are managed here and injected at runtime — never edited 
inside workflow JSON files.

---

## Files

### `gemini-main.md`

The system prompt for the main pipeline. Sent to Gemini Flash on every 
walk processing run.

**Instructs Gemini to produce four outputs:**

1. **Daily note** — structured markdown with YAML frontmatter for 
   Obsidian Dataview. Sections: Today's Focus, Tasks & Decisions, Project 
   Notes, Dev Learnings, Open Questions, Energy/Tone.

2. **Updated rolling handover** — fully rewritten on every run. Hard 
   60-line cap. Enforces triage rules: priority signals on tasks, age-based 
   removal, hard caps per section. Never appends — always rewrites.

3. **Archive entries** — every item removed from the handover this session, 
   with removal reason and date.

4. **Memory entries** — 0–5 typed entries extracted from the transcript. 
   Types: `decision`, `constraint`, `mistake`, `pattern`. Each entry 
   requires a one-sentence `entry` and a one-sentence `why`.

Outputs are separated by delimiter lines that n8n splits on:
```
===ROLLING_UPDATE===
===ARCHIVE_ENTRIES===
===MEMORY_ENTRIES===
```

**Editing this prompt:** edit `gemini-main.md` directly. The workflow 
reads it at runtime. Changes take effect on the next run — no workflow 
reimport required.

For schema details on the rolling handover rules and memory entry types, 
see [docs/memory-schema.md](../docs/memory-schema.md) and 
[docs/architecture.md](../docs/architecture.md).

---

## Planned prompts

**`discord-query.md`** — query prompt for the `#ask` Discord channel. 
Instructs Gemini to answer questions strictly from provided memory and 
note files, without hallucinating facts not present in the context.

**`weekly-digest.md`** — synthesis prompt for the Sunday digest. Reads 
7 daily notes and the current memory file; produces a structured weekly 
summary for `#weekly-digest`.

**`monthly-pattern.md`** — pattern detective prompt. Runs across all 
notes and memory entries for the month; surfaces recurring themes, 
unresolved tensions, and compounding patterns.

---

## Prompt editing guidelines

- Edit the prompt here, not in the workflow JSON. The workflow JSON 
  treats this file as the source of truth.
- Test changes against a real transcript before considering them stable. 
  Gemini output structure is sensitive to prompt wording — small changes 
  can break delimiter parsing.
- The four-output structure and delimiter lines are load-bearing. Do not 
  modify them without updating the n8n split logic in the workflow.
- Project tags in the daily note (`#Loom`, `#AIDev`, etc.) are defined 
  in the prompt. Add new tags here if you add projects — do not rely on 
  Gemini inventing them.
