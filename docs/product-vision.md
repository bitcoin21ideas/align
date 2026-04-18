# Product Vision

## Current state

Align is a personal tool. One user, self-hosted, built to solve a 
specific problem: turning daily walking monologues into structured memory 
and operational clarity. It works. The core pipeline is stable.

This document is about what it could become — if the personal tool proves 
out the underlying thesis, and if the thesis is worth packaging for a 
wider audience.

Nothing here is on the current roadmap. This is a longer-horizon 
exploration.

---

## The thesis

Most productivity and note-taking tools fail in the same way: they make 
it easy to capture but hard to trust what you've captured.

The result is a productivity system that requires maintenance to stay 
useful. You have to regularly audit your task list, archive your old 
notes, prune your tags, and decide what still matters. Most people don't 
do this consistently. The system drifts. It stops being a trusted source 
of truth and becomes another place to feel guilty about not keeping up.

Align's thesis is that the system should enforce its own hygiene. The 
rolling handover rewriting itself every run, with hard caps and mandatory 
removal rules, is the mechanic that makes this real. You cannot let it 
drift — the structure won't permit it.

The second part of the thesis is typed memory. Not notes. Not summaries. 
Typed, structured extractions: decisions, constraints, mistakes, patterns. 
The typing forces specificity. The specificity creates a corpus that 
compounds in value over time.

Together: a system you can trust because it cannot become untrustworthy.

---

## The market gap

The tools Align competes with, and where they fall short:

**Voice-first tools** (Limitless — now dead, acquired by Meta Dec 2025; 
SpeakNotes; Jamie; Otter): transcribe everything, summarise on demand. 
High capture volume, low signal density. No operational layer. No typed 
memory. No concept of "what is in flight right now." Limitless's failure 
validates that passive accumulation doesn't work even with hardware.

**AI note-taking** (Mem.ai, Reflect, Capacities): smart search and 
synthesis over a growing pile of notes. The pile grows; the hygiene 
problem is deferred, not solved. Passive capture produces more noise 
than signal over time. Mem.ai's proactive Copilot surfacing is the 
most differentiated feature in this category.

**AI context layers** (Granola — $1.5B valuation, March 2026): 
pivoting from meeting notes to enterprise memory infrastructure with 
MCP integration. Meeting-centric, not voice monologue. No self-pruning. 
Validates the "memory as AI infrastructure" thesis at scale.

**Task managers** (Things, Linear, Todoist): excellent for task tracking, 
no voice input, no memory layer, no synthesis. Require manual entry and 
manual pruning.

**Personal CRMs and second brains** (Roam, Obsidian with plugins, Tana): 
powerful but high-maintenance. The system is only as good as the 
discipline of the person maintaining it. Tana's typed-node graph model 
is the most architecturally interesting approach in this category.

The gap: no tool combines low-friction voice input, a self-maintaining 
operational dashboard, and a typed memory layer in a single coherent 
pipeline. See [competitive-landscape.md](competitive-landscape.md) for 
detailed profiles and techniques worth adopting.

---

## Key differentiators

**The rolling handover.** A fixed-size, self-trimming operational 
dashboard that is rewritten — not appended to — every run. Nobody else 
produces this. It is the feature that makes Align a tool you act from, 
not just a tool you archive to.

**Typed memory with conscious curation.** The HITL philosophy means 
every memory entry was spoken intentionally. The typed structure means 
it is queryable and compounds over time. This is categorically different 
from "AI summarised my notes."

**Full data ownership.** Everything lives in files you own, in 
repositories you control, readable without the app. No lock-in, no 
privacy trade-offs, no subscription required to access your own thoughts.

**Self-hostable pipeline.** The orchestration layer (n8n) is open-source 
and self-hostable. Users who want full control can have it. Users who 
want managed hosting are a future option, not a requirement.

---

## Who the wider audience is

The personal tool targets a specific type of user: someone who thinks 
out loud, manages multiple projects simultaneously, and has been 
frustrated by note systems that require maintenance to stay useful.

More concretely:
- Founders and operators running 2–5 parallel initiatives
- Consultants and freelancers who need project context that persists 
  across engagements
- Developers who make architectural decisions frequently and want a 
  typed record of them
- Anyone who has tried a second brain system and abandoned it because 
  the upkeep cost exceeded the value

The common thread: people who have enough going on that an untrustworthy 
system is worse than no system, and who would pay for something that 
stays trustworthy without their intervention.

---

## What packaging would require

The core pipeline works as a personal tool today. Packaging it for a 
wider audience would require, at minimum:

**Managed hosting option.** Self-hosting n8n is not a reasonable 
expectation for a general audience. A hosted version of the pipeline — 
where users connect their own API keys and GitHub — removes this barrier.

**Onboarding and setup flow.** Currently: import a JSON file into n8n 
and configure environment variables. For a wider audience: a guided 
setup that handles credential configuration, creates the storage repo, 
and validates the pipeline end-to-end.

**UI beyond Discord.** A web or mobile interface for reading the rolling 
handover, browsing memory entries, and querying — without requiring 
Obsidian or a Discord server.

**Multi-language support.** The current Gemini prompt is tuned for 
Russian/English input. Generalising to other languages is a prompt and 
testing problem, not an architectural one.

None of this changes the core pipeline. The pipeline is the product. 
Everything else is surface.

---

## The sequencing principle

The personal tool validates the thesis before any packaging investment.

If the rolling handover and typed memory layer prove genuinely valuable 
over 6–12 months of personal use — if the system stays trusted, if the 
memory entries surface useful context, if the operational clarity holds — 
then the thesis is real and worth packaging.

If the system drifts, or the memory layer stops being used, or the 
handover stops reflecting reality, then something in the thesis is wrong 
and needs to be fixed at the personal scale before it is offered to 
anyone else.

Build trust in the tool before building the tool for others.
