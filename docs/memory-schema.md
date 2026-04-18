# Memory Schema

## Purpose

Memory entries are the highest-signal output of each pipeline run. They are not tasks, not summaries, and not notes — they are typed, structured extractions of the things most worth carrying forward across projects and time.

The format is intentionally constrained. Constraints force specificity.

---

## Entry format

Each entry uses a Markdown heading as its ID, followed by a list of fields:

```markdown
### YYYYMMDD-<slug>
- type: decision|constraint|mistake|pattern
- project: [project name or cross-project]
- entry: [one clear sentence — what was decided, learned, or discovered]
- why: [one sentence — the reasoning or consequence that makes this worth remembering]
- supersedes: [ID of prior entry this replaces — omit line entirely if not applicable]
```

All fields except `supersedes` are required. The heading doubles as the entry's permanent ID —
never change it after writing.

**ID format:** `YYYYMMDD-<slug>` where slug is 2–4 lowercase hyphenated words derived from the entry text (e.g. `inngest-over-bullmq`, `stripe-test-mode-default`).

**`entry`:** one sentence, always.

**`why`:** one sentence required. A second sentence is allowed only when the causal chain has a non-obvious second step that would be lost otherwise.

**`supersedes`**: optional. Include only when this entry directly replaces a prior one. Point to the exact prior entry ID. The prior entry is never edited — both entries remain in the monthly file; the index reflects the supersession chain.

---

## Types

### `decision`

A choice made with explicit reasoning.

Qualifies when: you committed to an approach over alternatives, and the
reasoning is worth preserving for future reference.

Does not qualify for: routine choices with obvious answers, or decisions
that will be reversed within days.

```markdown
### 20260417-inngest-over-bullmq
- type: decision
- project: AIDev
- entry: Chose Inngest over BullMQ for background job processing.
- why: Inngest is compatible with the Workers runtime and requires no Redis dependency.
```

---

### `constraint`

Something that cannot be violated — a hard limit, not a preference.

Qualifies when: a boundary has been established that future work must
respect. Technical, product, legal, or resource constraints all count.

Does not qualify for: soft preferences, things you'd like to avoid, or
guidelines that bend under pressure.

```markdown
### 20260417-no-credentials-in-workflow-json
- type: constraint
- project: cross-project
- entry: Never embed API keys or credentials in workflow JSON files.
- why: Workflow files are checked into version-controlled repositories.
```

---

### `mistake`

What went wrong and why. The most valuable type.

Qualifies when: something failed, cost time, or produced the wrong result —
and the cause is clear enough to name. Near-misses count.

Does not qualify for: vague frustrations, things that went fine in the end,
or problems without an identifiable cause.

```markdown
### 20260417-mobile-layout-untested
- type: mistake
- project: Loom
- entry: Launched a feature without validating the mobile layout first.
- why: Desktop testing passed but the component broke on small viewports, requiring a hotfix the same day.
```

---

### `pattern`

A reusable approach that worked.

Qualifies when: a method, structure, or habit produced a clearly better
result — and would generalise to future situations.

Does not qualify for: one-off solutions to specific problems, or things
that worked by luck rather than design.

```markdown
### 20260417-rollback-plan-before-migration
- type: pattern
- project: cross-project
- entry: Writing the rollback plan before the migration script catches edge cases earlier.
- why: Forces you to think about failure modes before you are committed to an approach.
```

---

## Lifecycle

### Supersession (append-only)

When a new entry replaces a prior one, write the new entry as normal and add a `supersedes` field pointing to the old ID. The old entry is never edited or deleted.

```markdown
### 20260501-trigger-dev-over-inngest
- type: decision
- project: AIDev
- entry: Switched from Inngest to Trigger.dev for background jobs.
- why: Trigger.dev has better observability tooling and first-class Cloudflare Workers support.
- supersedes: 20260417-inngest-over-bullmq
```

The supersession chain is visible in two places: the `supersedes` field in the monthly file, and the `supersedes` column in `memory/memory-index.md`. Gemini reads the index before each run and can detect when a new entry would replace a prior one — it emits supersedes automatically when the connection is clear.

To find all superseded entries, search for `supersedes:` across all monthly files, or read the `supersedes` column in the index.

---

## Storage

Memory entries are stored in monthly files in the `memory/` directory
of the private storage repository:

```
memory/
├── memory-index.md        # one line per entry: id | type | project | summary | supersedes | affects
├── 2026-04.md
└── YYYY-MM.md
```

`memory-index.md` is the authoritative flat list of all entries. It is read before every Gemini call (injected into the prompt) and appended after every run that produces new entries. It is never overwritten — only appended.

Monthly files are append-only. Each run adds new entries under a `## YYYY-MM-DD` heading. If no entries qualify, no append occurs and no heading is added.

---

## Extraction rules (enforced by Gemini)

- **0–5 entries per session.** Most sessions produce 1–3. Zero is a valid output if nothing qualifies.
- **Qualify:** would a developer starting a new project benefit from knowing this?
- **Disqualify:** routine tasks, vague observations, things already obvious from context.
- Gemini receives the full memory index before each run and uses it to detect supersessions automatically.

---

## Querying memory

Memory files are plain Markdown. They can be:

- Read directly in Obsidian
- Searched with standard text search across the `memory/` directory
- Filtered by type: search `type: mistake` across monthly files for a full mistake log
- Traversed by supersession: search supersedes: to find replacement chains
- Scanned via `memory/memory-index.md` for a compact view of all entries

A future Discord `#ask` endpoint will support natural language queries over the index and monthly files.

---

## What memory is not

- **Not a task list.** Tasks belong in the rolling handover.
- **Not a journal.** Daily notes capture what happened. Memory captures what should be carried forward.
- **Not auto-generated.** Every entry was spoken aloud, extracted, and reviewed. The conscious capture is the point.
