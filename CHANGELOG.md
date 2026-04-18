# Changelog

---

## v0.2.0 — 2026-04-18

- Add: memory index — `memory/memory-index.md` injected into every Gemini call; one line per entry (`id | type | project | summary | supersedes | affects`)
- Add: n8n nodes — Get memory index (pre-Gemini read), Extract index lines, Has new entries, Update memory index (post-memory-append write)
- Update: Decode node — reads and decodes memory index, passes `memoryIndex` and `memoryIndexSHA` downstream
- Update: Message a model — MEMORY INDEX section injected between date and rolling context
- Update: Gemini prompt — three inputs declared, `supersedes` field added to OUTPUT 4, `status` field removed
- Fix: Get memory — `continueRegularOutput` added; workflow no longer crashes on month boundary when monthly file doesn't exist yet
- Fix: Decode memory — gracefully handles missing content instead of crashing on `Buffer.from(undefined)`
- Update: memory-schema.md — removes `status` field and retraction section; supersession lifecycle now documented via index
- Update: architecture.md — documents three reads and five writes, corrects `notes/` → `walks/` path, corrects Gemini retry claim

## v0.1.4 — 2026-04-18

- Add: docs/competitive-landscape.md — competitor profiles, techniques to steal, memory retrieval approaches
- Update: docs/product-vision.md market gap section names specific tools and links to new landscape doc

## v0.1.3 — 2026-04-17

- Add: .gitignore excluding .claude/ (ephemeral worktree state)
- Add: Git section to CLAUDE.md documenting worktree push convention

## v0.1.2 — 2026-04-17

- Update: memory entries switch from YAML blocks to Markdown list blocks with heading-as-ID (`YYYYMMDD-<slug>`)
- Update: memory schema adds `status` field (`active`/`retracted`), optional `supersedes` pointer, two-sentence `why` allowance
- Update: memory-schema.md rewritten to document new format, lifecycle, and supersession/retraction patterns
- Update: ROADMAP adds memory index + retrieval item to Phase 2

## v0.1.1 — 2026-04-17

- Fix: added `asBinaryProperty: false` to `Check daily note exists` node to correctly detect existing daily notes
- Fix: `Decode daily note` now extracts file sha for proper update routing
- Add: `retryOnFail` with 5s delay on Gemini node to handle transient API errors

## v0.1.0 — 2026-04-17

- Core pipeline: audio → Deepgram → Gemini Flash → 4 GitHub outputs
- iOS Shortcut trigger and webhook
- Multiple recordings per day (append under timestamped section)
- Repo documentation: README, ROADMAP, architecture, philosophy, memory schema, discord design, product vision
