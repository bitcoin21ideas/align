# Roadmap

Sequenced by personal utility first. Community/scale features follow 
once the core is validated through daily use.

Effort signals: `S` = hours | `M` = 1–2 days | `L` = 3–5 days

---

## Phase 1 — Discord basics
*Goal: make outputs visible and inputs possible from mobile.*

- [ ] `#walk-briefs` post-run summary `S`  
  n8n posts Today's Focus + run stats to Discord after each pipeline run.
  No new workflow — appended to the existing run.

- [ ] `#quick-capture` text input trigger `M`  
  Discord message → n8n workflow → same pipeline, skips transcription.
  Captures decisions mid-session without recording.

---

## Phase 2 — Query and synthesis
*Goal: get value back out of what's been captured.*

- [x] Memory index file + retrieval `S`  
  `memory/memory-index.md` — one line per entry (id, type, project, summary, supersedes, affects).
  Fetched before each Gemini call and injected into the prompt. Gemini detects
  supersessions and emits `supersedes: <id>` automatically. New entries appended
  to the index after each run. Shipped in v0.2.0.

- [ ] Weekly digest — `#weekly-digest` `M`  
  Scheduled Sunday run. Reads last 7 daily notes + current memory file.
  Posts structured synthesis: what got done, what stalled, patterns, oldest open questions.

- [ ] `#ask` memory query endpoint `M`  
  Discord message → n8n reads memory files + recent notes → Gemini answers strictly from provided context → Discord reply in thread.
  Initial scope: current month's memory + last 7 daily notes.

---

## Phase 3 — Deeper context
*Goal: make the system smarter about what it already knows.*

- [ ] Monthly pattern detective `M`  
  Scheduled end-of-month run. Same mechanic as weekly digest, full month of data. Surfaces recurring themes, unresolved tensions, compounding patterns across projects.

- [ ] 7-day context window in daily processing `L`  
  Inject last 7 daily notes into the main Gemini prompt alongside the rolling handover. Improves task continuity, pattern detection, and memory entry quality. Adds token cost and n8n read complexity — worthwhile after the corpus is dense enough to justify it.

---

## Phase 4 — Scale and community
*Goal: make the system shareable if the thesis proves out.*

- [ ] RAG with proactive surfacing `L`  
  Embed memory entries; surface relevant past decisions automatically during daily note generation. Requires embedding pipeline and vector store — first real infrastructure addition.

- [ ] Semantic search `L`  
  Query memory and notes by meaning rather than keyword. Depends on RAG infrastructure. Meaningful after 50+ notes in corpus.

- [ ] Packaging and onboarding `L`  
  Guided setup flow, managed hosting option, UI beyond Discord. Only warranted if personal use validates the thesis over 6–12 months.  
  See [docs/product-vision.md](docs/product-vision.md).

---

## Done

- [x] Core pipeline — audio → transcription → Gemini → 4 GitHub outputs
- [x] iOS Shortcut trigger
- [x] Multiple recordings per day (append under timestamped section)
- [x] Repo documentation
- [x] Memory index — persistent flat index injected into every Gemini call, supersession detection live (v0.2.0)
- [x] Project Registry — `memory/_projects.md` injected each run; Gemini uses only registry tags (never invents tags)
