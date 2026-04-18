# Competitive Landscape

Last updated: 2026-04-18

A living reference. Update when tools pivot, raise, or die.

---

## Is the problem real?

Yes. The 2024 State of Developer Productivity report found "time spent
gathering project context" tied for #1 productivity leak at 26%. The AI
coding era is making this worse — closing a Claude Code session loses the
entire project model the AI built. A micro-ecosystem of workarounds has
emerged (session managers, CLAUDE.md patterns) because no tool solves it.

The PKM graveyard is the other evidence. Roam, Notion, Obsidian — all
solve capture, none solve maintenance. People abandon them not from lack
of discipline but because the upkeep cost exceeds the value extracted.
This is a design failure Align is correctly diagnosing.

---

## Competitors

### Limitless AI — *dead*
https://www.limitless.ai

Always-on pendant recording conversations; transcribed and surfaced action
items. Cloud storage with configurable AI models. **Acquired by Meta,
December 2025. Sales stopped immediately; EU/UK access already revoked.**
Existing users have no path forward.

**Failure mode:** Passive accumulation with no pruning. Classic memory
bloat. Also: wearable hardware is a fragile dependency.

**What Align does differently:** Conscious capture, forced triage.

---

### Mem.ai — *active, well-funded*
https://mem.ai

"Notes app that thinks alongside you." Voice mode for brain dumps, semantic
search, and an AI Copilot that surfaces relevant notes while you work
(not on demand — proactively). Agentic chat creates and edits notes with
full vault context. Raised $28.6M including OpenAI Startup Fund.

**Strengths:** Copilot's proactive surfacing is genuinely differentiated.
Becomes smarter as the collection grows. Good for prolific note-takers.

**Weakness:** Passive accumulation model. No pruning, no triage, no
concept of "what is in flight." The pile grows; the hygiene problem is
deferred forever.

**Technique worth stealing:** The Copilot pattern — surface relevant
memory *during* a session, not only when queried. In Align terms: inject
potentially relevant past decisions into the Gemini prompt automatically,
not just on `#ask`.

---

### Granola — *pivoting fast, $1.5B valuation*
https://granola.so

Started as AI meeting notetaker. Raised $125M Series C in March 2026 and
explicitly repositioned as an "enterprise AI context layer." Key move:
MCP integration (February 2026) so tools like Claude and Figma can pull
context from Granola without user intervention. Personal and enterprise
APIs for programmatic access.

**Strengths:** MCP integration is the right architectural bet. Positions
memory as infrastructure for AI tools, not just a notes app.

**Weakness:** Meeting-centric. No voice monologue support. No self-pruning.
Accumulates passively. Enterprise orientation means individual/developer
use is secondary.

**Technique worth stealing:** MCP server exposure of memory store. Align's
GitHub-stored Markdown is already MCP-ready. Exposing memory via MCP lets
Claude Code sessions bootstrap from your memory index directly — this
directly closes the AI context loss problem.

---

### Tana — *active*
https://tana.inc

AI-native workspace treating information as typed nodes in a knowledge
graph (supertags: Meeting, Person, Book, Project, custom types). Records
meetings without a bot, auto-summarizes, extracts action items, links to
existing nodes. Desktop app exposes workspace via MCP, enabling Claude
Code integration.

**Strengths:** Typed nodes map to graph edges, enabling relationship
traversal ("what decisions involving #AIDev have downstream constraints?").
Voice + capture + AI extraction + graph linking in one tool.

**Weakness:** Proprietary workspace. No forced expiration or pruning.
Accumulates as a graph rather than a pile, but still accumulates.

**Technique worth stealing:** Model typed memory entries as graph nodes,
not just flat Markdown records. When the memory index grows, relationship
traversal (decision → constraint → affected project) outperforms
keyword search. Design the index schema with future graph traversal in
mind.

---

### Reflect Notes — *active, niche*
https://reflect.app

Minimalist, end-to-end encrypted note-taking with GPT-4o / Claude 3.5
Sonnet integration, backlinks, Kindle/web snippet collection, and AI chat
over notes. Strong privacy story — used by lawyers, journalists, therapists.

**Strengths:** Privacy-first. Clean UX. AI chat grounded in your notes.

**Weakness:** Traditional note-taking model. No voice-first approach.
No self-pruning. No operational dashboard.

**What Align does differently:** Everything Reflect doesn't — voice input,
triage mechanics, typed structured extraction.

---

### NotebookLM — *active, Google-backed*
https://notebooklm.google.com

Source-grounded AI research assistant. Upload documents; ask questions;
generate podcasts, overviews, quizzes from the material. RAG over your
sources. Recent additions (2026): EPUB support, session persistence,
auto-save, video overviews.

**Strengths:** Excellent for synthesizing existing documents. Source
citations prevent hallucination. Free, Google-maintained.

**Weakness:** Oriented toward research, not ongoing project memory. No
voice monologue input. No operational layer. No self-maintenance.

**Not a direct competitor** — different use case (deep-dive research vs.
daily operational memory). Worth knowing because target users often use
both.

---

### Capacities — *active*
https://capacities.io

Object-oriented note-taking: Books, People, Topics, Projects, custom
types. Daily notes hub. AI assistant with multi-note context and smart
searching with source citations. AI can auto-include backlinks.

**Strengths:** Object model is cleaner than flat notes. Good for
relationship-heavy knowledge work.

**Weakness:** Accumulation model with no pruning. Requires discipline
to stay useful. No voice input. No operational dashboard.

**Technique worth stealing:** Object types as first-class entities. Align's
typed memory (decision, constraint, mistake, pattern) is already this —
just stored as Markdown fields rather than native object types.

---

### Obsidian + AI plugins — *active, ecosystem fragmented*
https://obsidian.md

Vault of Markdown files; extensive plugin ecosystem. AI plugins: Smart
Connections (semantic search), Copilot, Text Generator, Letta (stateful
agents). MCP integration emerging. The Karpathy "compiled wiki" pattern
(LLM continuously writes and maintains Markdown, git as audit trail) is
explicitly Obsidian-inspired.

**Strengths:** Full data ownership. Human-readable files. Git version
history. Dataview for structured queries. Increasingly MCP-connected.

**Weakness:** Requires manual curation or complex plugin stacks. Plugin
ecosystem is fragmented (~20 plugins is the performance sweet spot).
No self-pruning built in.

**Technique worth stealing:** The Letta plugin pattern — stateful AI agents
that know vault contents and remember conversations across sessions. Relevant
for the `#ask` Discord endpoint: the agent should remember previous queries
and build a model of what you've asked before.

---

### Voice-to-notes utilities (Jamie, Otter, VoiceToNotes, SpeakNotes)
https://meetjamie.ai / https://otter.ai / https://voicetonotes.com

Single-pass conversion: speech → structured notes + action items. Some
integrate with CRMs (Jamie, Otter). Custom prompt support (VoiceToNotes).
Multiple output formats.

**Not direct competitors** — no persistent cross-session memory, no
self-maintenance, no typed extraction. Utility players.

**Relevant for:** understanding what the voice transcription UX baseline
is; users may already use these and expect similar output quality.

---

## Techniques worth stealing

### 1. MCP exposure (from Granola, Tana, Obsidian)
Expose `memory/memory-index.md` (and optionally monthly memory files) via an MCP
server. AI coding tools can then pull relevant context automatically per
session. This closes the AI context loss problem directly. No new
infrastructure — just an MCP wrapper over the existing GitHub files.

### 2. Proactive surfacing (from Mem.ai Copilot)
During the main Gemini call, inject potentially relevant past memory
entries from the index — not just when the user asks via `#ask`. The
index (Phase 2) makes this possible. Cost: a few hundred extra tokens
per run. Benefit: Gemini can detect supersessions and flag contradictions
without the user remembering to ask.

### 3. Typed memory as graph edges (from Tana)
The decision/constraint/mistake/pattern taxonomy is already a weak graph.
A constraint entry is an edge: *decision X → is blocked by → constraint Y*.
Design the index schema to support this. When retrieval grows complex,
traversal over this structure outperforms flat keyword search.

### 4. Recency-weighted retrieval scoring
When the `#ask` endpoint queries memory, score results as:
`relevance = semantic_similarity × exp(-λ × days_since_entry)`
Older entries need stronger signal to surface. Prevents stale decisions
from dominating recent queries.

### 5. Tiered summarization (from research consensus)
Daily notes → weekly digest → monthly pattern summary. Each tier is a
retrieval target at different granularity. The weekly digest (Phase 2)
and monthly pattern detective (Phase 3) are already planned — these are
also the right retrieval tiers when the corpus grows.

### 6. Git-native Markdown as infrastructure
The Karpathy "compiled wiki" pattern validates the existing architecture:
no vector DB, no RAG infrastructure, typed Markdown sections as schema,
git history as audit trail. Don't rush to RAG. The typed structure +
good indexing covers 80% of retrieval quality at 5% of infrastructure
cost. RAG belongs in Phase 4 when the corpus justifies it.

---

## Memory retrieval approaches at scale

For reference when Phase 4 (RAG) becomes relevant:

**Hybrid retrieval** wins over pure vector search in every benchmark:
vector similarity (semantic queries) + BM25 full-text (keyword queries)
+ structured metadata lookup (typed queries: `type: mistake`). Route
query to appropriate backend based on query type.

**GraphRAG** (Microsoft, 2024): knowledge graph traversal over RAG
improves precision ~35% for relationship-heavy queries. Relevant when
typed entries accumulate into a meaningful graph.

**Semantic caching**: cache LLM responses for similar queries. Cuts
cost significantly for repeated question patterns (e.g. weekly "what
did I decide about X?").

**Hard TTL by category**: tool discoveries expire after 30 days (already
enforced in the handover); memory entries of type `constraint` might
warrant longer TTL than `pattern`. Bake expiration into the index schema,
not cleanup code.

---

## Market signals

- Granola: $125M Series C, $1.5B valuation (March 2026) — validates the
  "AI context layer" thesis at scale
- Mem.ai: $28.6M including OpenAI Startup Fund — validates typed memory
  and proactive surfacing
- Limitless: dead — validates that passive accumulation + wearable
  hardware is not the answer
- MCP: adopted by Granola, Tana, Obsidian simultaneously in early 2026 —
  becoming table stakes for any memory tool connecting to AI workflows
- Research consensus (mem0.ai State of AI Agent Memory 2026): pure vector
  RAG is failing for large stores; hybrid + typed metadata + decay is
  the current standard
