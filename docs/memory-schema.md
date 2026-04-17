# Memory Schema

## Purpose

Memory entries are the highest-signal output of each pipeline run. They
are not tasks, not summaries, and not notes — they are typed, structured
extractions of the things most worth carrying forward across projects and
time.

The format is intentionally constrained. Constraints force specificity.

---

## Entry format

Each entry uses a Markdown heading as its ID, followed by a list of fields:

```markdown
### YYYYMMDD-<slug>
- type: decision|constraint|mistake|pattern
- project: [project name or cross-project]
- status: active
- entry: [one clear sentence — what was decided, learned, or discovered]
- why: [one sentence — the reasoning or consequence that makes this worth remembering]
```

All fields are required. The heading doubles as the entry's permanent ID —
never change it after writing.

**ID format:** `YYYYMMDD-<slug>` where slug is 2–4 lowercase hyphenated
words derived from the entry text (e.g. `inngest-over-bullmq`,
`stripe-test-mode-default`).

**`entry`:** one sentence, always.

**`why`:** one sentence required. A second sentence is allowed only when
the causal chain has a non-obvious second step that would be lost otherwise.

**`status`:** always `active` on new entries. The only other valid value
is `retracted` — reserved for manually written tombstone entries that mark
a prior entry as wrong (see Lifecycle below).

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
- status: active
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
- status: active
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
- status: active
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
- status: active
- entry: Writing the rollback plan before the migration script catches edge cases earlier.
- why: Forces you to think about failure modes before you are committed to an approach.
```

---

## Lifecycle

### Supersession (append-only)

When a new entry replaces a prior one, write the new entry as normal and
add an optional `supersedes` field pointing to the old ID. The old entry
is never edited.

```markdown
### 20260501-inngest-replaced-by-trigger-dev
- type: decision
- project: AIDev
- status: active
- supersedes: 20260417-inngest-over-bullmq
- entry: Switched from Inngest to Trigger.dev for background jobs.
- why: Trigger.dev has better observability tooling and first-party Cloudflare Workers support.
```

To find whether an entry has been superseded, search for its ID in
`supersedes` fields across all monthly files.

### Retraction (append-only)

When an entry turns out to be wrong — not just replaced but incorrect —
write a tombstone entry with `status: retracted` and `supersedes` pointing
to the bad entry. This is a human-authored operation, not something Gemini
writes automatically.

```markdown
### 20260501-retract-stripe-test-mode
- type: constraint
- project: Loom
- status: retracted
- supersedes: 20260412-stripe-test-mode-default
- entry: Prior entry was wrong — legal review completed; Stripe can move to live mode.
- why: The constraint no longer applies as of 2026-05-01.
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
- Gemini extracts from the transcript only — it does not currently have
  access to prior memory files.

---

## Querying memory

Memory files are plain Markdown. They can be:

- Read directly in Obsidian
- Searched with standard text search across the `memory/` directory
- Queried via the `#ask` Discord channel (see [discord-design.md](discord-design.md))

The typed structure makes filtered queries straightforward: search for
`type: mistake` across all monthly files to get a full mistake log.
Search for `supersedes:` to find all entries that replaced a prior one.

A memory index file and Gemini retrieval support (to enable automatic
supersession detection) are planned — see ROADMAP.

---

## What memory is not

- **Not a task list.** Tasks belong in the rolling handover.
- **Not a journal.** Daily notes capture what happened. Memory captures
  what should be carried forward.
- **Not auto-generated.** Every entry was spoken aloud, extracted, and
  reviewed. The conscious capture is the point.
