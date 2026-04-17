# Workflow: walks-processing

The main Align pipeline. Triggered by a voice recording, produces four 
structured outputs written to GitHub.

---

## Node map

```
Webhook (Receive File)
    └── HTTP Request (Deepgram)
            └── Get transcript
                    └── Get prompt (align repo)
                            └── Decode prompt
                                    └── Get handover (storage repo)
                                            └── Decode
                                                    └── Message a model (Gemini)
                                                            └── Parse Output
                                                                    ├── Edit a file (rolling handover)
                                                                    ├── Get archive → Decode archive → Append to archive
                                                                    ├── Get memory → Decode memory → Append memory
                                                                    └── Check daily note exists → Decode daily note → If
                                                                                                                        ├── true  → Edit daily note
                                                                                                                        └── false → Create a file
```

---

## Nodes

### Webhook (Receive File)
**Type:** Webhook trigger  
**Path:** `process-the-walk`  
**Method:** POST, binary data enabled

Entry point for the pipeline. Receives the audio file uploaded by the 
iOS Shortcut. Binary mode is required — the audio arrives as a file, 
not JSON.

After importing the workflow, activate it and copy the generated webhook 
URL into your iOS Shortcut.

---

### HTTP Request
**Type:** HTTP Request  
**Service:** Deepgram Nova-3

Sends the audio binary to Deepgram's `/v1/listen` endpoint with three 
query parameters:
- `model: nova-3` — latest Deepgram model
- `smart_format: true` — adds punctuation and paragraph breaks
- `detect_language: true` — handles Russian/English code-switching 
  without specifying a language upfront

Uses an HTTP Header Auth credential (your Deepgram API key as a 
`Authorization: Token ...` header).

---

### Get transcript
**Type:** Code (JavaScript)

Extracts the transcript string from Deepgram's response. Prefers the 
paragraphs transcript (formatted) over the raw alternatives transcript. 
Returns `{ transcript }`.

---

### Get prompt
**Type:** GitHub (get file)  
**Repo:** this Align repository  
**File:** `prompts/gemini-main.md`

Reads the Gemini system prompt from this repo at runtime. Because the 
prompt is fetched live on every run, editing `prompts/gemini-main.md` 
and pushing takes effect immediately — no workflow reimport required.

---

### Decode prompt
**Type:** Code (JavaScript)

Decodes the base64 file content returned by the GitHub API into a plain 
string and passes it forward as `{ prompt }`.

---

### Get handover
**Type:** GitHub (get file)  
**File:** `handover/rolling-handover.md`

Reads the current rolling handover from the storage repo. The file 
content is returned base64-encoded by the GitHub API.

---

### Decode
**Type:** Code (JavaScript)

Decodes the base64 handover content and assembles the three inputs 
Gemini needs: `rollingContext`, `transcript`, and `today` (ISO date 
string). This is the final preparation step before the AI call.

---

### Message a model
**Type:** Google Gemini (LangChain node)  
**Model:** `gemini-3-flash-preview`

The core AI step. Receives two messages:
1. **User message** — today's date, rolling context, and transcript
2. **System message** — the full processing prompt

The system prompt is injected at runtime via the `Decode prompt` node — 
it is not embedded here. Edit `prompts/gemini-main.md` directly; 
changes take effect on the next run.

Produces a single text response containing all four outputs separated 
by delimiter lines.

---

### Parse Output
**Type:** Code (JavaScript)

Splits the Gemini response on three delimiters:
```
===ROLLING_UPDATE===
===ARCHIVE_ENTRIES===
===MEMORY_ENTRIES===
```

Throws an explicit error if any delimiter is missing — this surfaces 
malformed Gemini output immediately rather than writing corrupt data 
to GitHub. Returns `{ dailyNote, rollingUpdate, archiveEntries, memoryEntries, today }`.

From here the workflow fans out into four parallel branches.

---

### Branch 1 — Rolling handover

**Edit a file** (GitHub, edit)  
Overwrites `handover/rolling-handover.md` with the new handover. 
This is a full rewrite every run — not an append.

---

### Branch 2 — Archive

**Get archive** (GitHub, get file)  
Reads the current `handover/archive.md`.

**Decode archive** (Code)  
Decodes the base64 content into a plain string.

**Append to archive** (GitHub, edit)  
Appends today's archive entries under a `### YYYY-MM-DD` heading. 
Concatenates existing content + new entries — the file only grows.

---

### Branch 3 — Memory

**Get memory** (GitHub, get file)  
Reads the current month's memory file (`memory/YYYY-MM.md`).

**Decode memory** (Code)  
Decodes the base64 content.

**Append memory** (GitHub, edit)  
Appends today's memory entries under a `## YYYY-MM-DD` heading. 
File path is computed dynamically from today's date, so a new file 
is created automatically at the start of each month.

---

### Branch 4 — Daily note

**Check daily note exists** (GitHub, get file)  
Attempts to fetch `walks/YYYY-MM-DD.md`. The node is set to 
`continueRegularOutput` on error — a 404 (file not found) is the 
expected state on first run of the day and should not halt the workflow.

**Decode daily note** (Code)  
Handles both cases: if the file exists, decodes and returns the content 
with `fileExists: true`; if not (error or empty content), returns an 
empty string with `fileExists: false`.

**If**  
Routes on `fileExists`:
- `true` → **Edit daily note** — appends new content under a 
  `## Second Note — HH:MM` section
- `false` → **Create a file** — writes the daily note as a new file

---

## One thing to know before importing

The GitHub nodes use `mode: list` for the repository selector, which 
caches the repo name and URL at workflow-build time. After importing, 
open each GitHub node and reselect your repository from the dropdown — 
this refreshes the cached values to point at your actual repo. There are 
nine GitHub nodes in total.
