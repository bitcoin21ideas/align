# Changelog

---

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
