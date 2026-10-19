# Template for `spec.md` (WHAT & WHY)

This file is the reference the `/spec` skill consults. Each section includes its purpose and a minimal example. **It is not text to be copied verbatim** — it is the shape the skill must respect.

> This artifact owns **requirements** (what and why). It must not contain implementation code, the technical plan, or the task breakdown. Use `/spec plan` and `/spec tasks` to create `plan.md` and `tasks.md` in the same folder.

---

## Header

```markdown
# SPEC NNN — Short, descriptive title

> **Status:** Draft
> **Depends on:** SPEC 001, SPEC 002
> **Date:** YYYY-MM-DD
> **Objective:** A single sentence. If you need two sentences, the feature is too big.
```

**Valid states:** `Draft`, `In review`, `Approved`, `Implemented`, `Obsolete`.

> These labels are the English defaults. The pipeline also accepts equivalents in any language (Spanish `Borrador` / `En revisión` / `Aprobado` / `Implementado` / `Obsoleto`). Pick one set per repo and stay consistent.

**Objective rule:** one sentence a human reads in 5 seconds and understands what is going to be built. If it does not fit in one sentence, split the feature.

---

## Section 1 — Why this spec exists (optional)

For specs that take non-obvious decisions or break project patterns, a brief **why**. Not the what — the what comes later. Omit for simple specs.

---

## Section 2 — Scope

```markdown
## Scope

**In:**

- Concrete thing one.
- Concrete thing two.

**Out of scope (for future specs):**

- Something that could be done but not now.
- Something that came up in the conversation but is not in.
```

**Both sub-blocks are mandatory.** The "Out" records what was mentioned and deliberately deferred, so it is not slipped in "while we're at it" during implementation.

---

## Section 3 — Requirements

Stable identifiers (do not renumber after publishing; replaced items move to a change record):

- `R-n` functional requirement
- `NFR-n` non-functional requirement
- `BR-n` business rule

```markdown
## Requirements

| ID    | Requirement                                   | Priority |
| ----- | --------------------------------------------- | -------- |
| R-1   | The user can register a childcare center.     | Must     |
| R-2   | The listing shows only centers of the family. | Must     |
| NFR-1 | The feed loads in under 2s on 3G.             | Should   |
| BR-1  | A staff member cannot edit another center.    | Must     |
```

---

## Section 4 — Security and non-functional requirements

Mandatory for **any change touching auth, data, money, or infrastructure**. Mark `(not applicable: <reason>)` when a line truly does not apply.

```markdown
## Security and non-functional requirements

- **Authorization:** who can do what, per role and per endpoint.
- **Input validation:** schema, sanitization, size/type limits. Never trust the client.
- **Secrets:** where credentials come from; what never reaches the repo or logs.
- **PII / data protection:** what personal data is stored, classification, retention, deletion.
- **Rate limiting / abuse:** limits, quotas, anti-enumeration.
- **Audit trail:** which sensitive actions are logged (who, what, when).
- **Performance:** latency/throughput targets and expected load.
- **Availability / reliability:** uptime expectation and graceful behavior.
```

---

## Section 5 — Data model

Concrete structures that appear or change. Use real names, not abstract pseudocode.

```markdown
## Data model

\`\`\`ts
// Center
type Center = {
  id: string
  name: string
  ownerId: string
  createdAt: string // ISO 8601
}
\`\`\`
```

If the feature introduces no new data, write it explicitly: _"This feature introduces no new data structures. It reuses the model from SPEC 001."_

---

## Section 6 — Contracts and interfaces

```markdown
## Contracts and interfaces

| Interface         | Direction | Input              | Output            | Errors               |
| ----------------- | --------- | ------------------ | ----------------- | -------------------- |
| `POST /api/center`| in        | `{ name, ownerId }`| `{ id }`          | 400, 401, 403, 409   |
```

Covers APIs, function signatures, events, and CLI contracts. Note breaking changes explicitly.

---

## Section 7 — Failure modes and degradation

```markdown
## Failure modes and degradation

- **Database down:** the feed shows a retry state; no partial writes.
- **Third-party timeout:** fall back to cached data; never block the page.
- **Duplicate submit:** the operation is idempotent via `Idempotency-Key`.
```

---

## Section 8 — Acceptance criteria

Boolean checklist. Each item is verifiable with yes or no. Reference the requirement it covers.

```markdown
## Acceptance criteria

- [ ] AC-1 (R-1): registering a center returns 201 and persists the record.
- [ ] AC-2 (R-2): a family only sees centers linked to it.
- [ ] AC-3 (BR-1): editing another center returns 403.
- [ ] AC-4 (NFR-1): the feed loads in under 2s on a throttled 3G profile.
```

**Anti-patterns to avoid:**

- ❌ "That it works well." → not verifiable.
- ❌ "Good UX." → subjective.
- ❌ "No bugs." → not operational.
- ✅ "Pressing Esc pauses the game and shows the menu." → verifiable, boolean.

---

## Section 9 — Assumptions and open questions

```markdown
## Assumptions and open questions

- **Assumption:** centers are created only by authenticated staff.
- **Open question:** do families authenticate by email or by invitation code? (owner: product, needed before `/spec plan`)
```

---

## Section 10 — Decisions taken and discarded

The section with the most value 3 months from now. Capture **what you considered**, not only what you chose.

```markdown
## Decisions

- **Yes:** localStorage for persistence. Fits in <5MB and we don't need queries.
- **No:** IndexedDB. Overengineering for this case.
- **Yes:** versioned key (`save:v1`). Lets us migrate the schema later.
- **No:** cloud sync. Goes in another spec if it ever lands.
```

Each decision needs a brief reason.

---

## Section 11 — Risks

Only when there are non-obvious risks.

```markdown
## Risks

| Risk                                  | Impact | Mitigation                                                   |
| ------------------------------------- | ------ | ------------------------------------------------------------ |
| localStorage disabled in private mode | Low    | Fallback to in-memory; the app still runs, it just persists. |
```

---

## Section 12 — What is NOT in this spec (reinforcement)

Repeat explicitly what **will not** be done. This repetition is deliberate — the Scope already says it, but at the end it reminds whoever reads only the last lines.

```markdown
## What is **not** in this spec

- Visual editor (another spec if it ever lands).
- Multiplayer.
- Mobile version.
```

---

## Global rules about the whole document

- **One sentence per idea.** If a sentence has two commas and a semicolon, split it.
- **Concrete names.** Say `app/pages/feed.vue`, not "the feed module". Give exact strings.
- **No TODOs.** A TODO means the decision was not made. Make it, or record it as an open question with a reason.
- **No long executable code.** Short snippets to illustrate data shapes are fine; full functions are not.
- **Standard markdown.** It must render on GitHub without surprises.
- **No technical plan here.** If a "how" appears, it is an input for `/spec plan`, not a section of this file.
