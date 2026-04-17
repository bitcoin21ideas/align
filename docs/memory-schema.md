# Memory Schema

## Purpose

Memory entries are the highest-signal output of each pipeline run. They 
are not tasks, not summaries, and not notes — they are typed, structured 
extractions of the things most worth carrying forward across projects and 
time.

The format is intentionally constrained. Constraints force specificity.

---

## Entry format

Each entry uses this exact structure:

```
---
type: decision|constraint|mistake|pattern
project: [project name or cross-project]
entry: [one clear sentence]
why: [one sentence — the reasoning or consequence]
---
```

All four fields are required. One sentence per field — not a paragraph, 
not a fragment.

---

## Types

### `decision`

A choice made with explicit reasoning.

Qualifies when: you committed to an approach over alternatives, and the 
reasoning is worth preserving for future reference.

Does not qualify for: routine choices with obvious answers, or decisions 
that will be reversed within days.

```
---
type: decision
project: AIDev
entry: Chose Inngest over BullMQ for background job processing.
why: Inngest is compatible with the Workers runtime and requires no Redis dependency.
---
```

---

### `constraint`

Something that cannot be violated — a hard limit, not a preference.

Qualifies when: a boundary has been established that future work must 
respect. Technical, product, legal, or resource constraints all count.

Does not qualify for: soft preferences, things you'd like to avoid, or 
guidelines that bend under pressure.

```
---
type: constraint
project: cross-project
entry: Never embed API keys or credentials in workflow JSON files.
why: Workflow files are checked into version-controlled repositories.
---
```

---

### `mistake`

What went wrong and why. The most valuable type.

Qualifies when: something failed, cost time, or produced the wrong result — 
and the cause is clear enough to name. Near-misses count.

Does not qualify for: vague frustrations, things that went fine in the end, 
or problems without an identifiable cause.

```
---
type: mistake
project: Loom
entry: Launched a feature without validating the mobile layout first.
why: Desktop testing passed but the component broke on small viewports, requiring a hotfix the same day.
---
```

---

### `pattern`

A reusable approach that worked.

Qualifies when: a method, structure, or habit produced a clearly better 
result — and would generalise to future situations.

Does not qualify for: one-off solutions to specific problems, or things 
that worked by luck rather than design.

```
---
type: pattern
project: cross-project
entry: Writing the rollback plan before the migration script catches edge cases earlier.
why: Forces you to think about failure modes before you are committed to an approach.
---
```

---

## Storage

Memory entries are stored in monthly files in the `memory/` directory 
of the private storage repository:

```
memory/
├── 2025-01.md
├── 2025-02.md
└── YYYY-MM.md
```

Each run appends new entries to the current month's file. Files are 
never overwritten — only appended. If the file for the current month 
does not exist, n8n creates it.

A month with no qualifying entries produces no file.

---

## Extraction rules (enforced by Gemini)

- **0–5 entries per session.** Most sessions produce 1–3. Zero is a valid 
  output if nothing qualifies.
- **Qualify:** would a developer starting a new project benefit from 
  knowing this?
- **Disqualify:** routine tasks, vague observations, things already obvious 
  from context.
- Gemini extracts from the transcript only — it does not re-extract from 
  previous memory files.

---

## Querying memory

Memory files are plain markdown. They can be:

- Read directly in Obsidian
- Searched with standard text search across the `memory/` directory
- Queried via the `#ask` Discord channel (see [discord-design.md](discord-design.md))
- Eventually embedded for semantic search (planned — see ROADMAP)

The typed structure makes filtered queries straightforward: grep for 
`type: mistake` across all monthly files to get a full mistake log.

---

## What memory is not

- **Not a task list.** Tasks belong in the rolling handover.
- **Not a journal.** Daily notes capture what happened. Memory captures 
  what should be carried forward.
- **Not auto-generated.** Every entry was spoken aloud, extracted, and 
  reviewed. The conscious capture is the point.
