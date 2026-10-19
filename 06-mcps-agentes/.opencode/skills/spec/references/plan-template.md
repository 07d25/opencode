# Template for `plan.md` (HOW)

Reference consulted by `/spec plan`. It describes the technical solution for an approved `spec.md`. **Never restate the problem** — reference the spec. No full product code; pseudo-structure and contracts are fine.

---

## Header

```markdown
# PLAN NNN — <feature name>

> **Spec:** `specs/NNN-slug/spec.md`
> **Status:** Draft
> **Date:** YYYY-MM-DD
```

**Valid states:** `Draft`, `In review`, `Approved`.

---

## Section 1 — Repository check (inspection before design)

Record what was actually inspected. Do not invent findings.

```markdown
## Repository check

| Area                     | Finding        | Evidence (path/command) |
| ------------------------ | -------------- | ----------------------- |
| Architecture             | <...>          | `src/...`               |
| Stack / versions         | Nuxt 4, Vue 3  | `package.json`          |
| Conventions              | <...>          | `AGENTS.md`             |
| Module structure         | <...>          | <...>                   |
| Reusable components      | <...>          | <...>                   |
| Persistence / migrations | <...>          | <...>                   |
| Auth / authorization     | <...>          | <...>                   |
| Security posture         | <...>          | <...>                   |
| Testing setup            | none           | `package.json`          |
| Dependencies             | <...>          | <...>                   |
| Infrastructure           | <...>          | <...>                   |
| Configuration            | <...>          | `nuxt.config.ts`        |
| Performance / cost limits| <...>          | <...>                   |
| Repo rules               | <...>          | `AGENTS.md`             |
```

Mark each area `Inspected` or `Not inspected (reason)`.

---

## Section 2 — Technical summary

`<2–4 sentences: the chosen approach and why it fits this repository.>`

---

## Section 3 — Relevant current state

Existing components, flows, and constraints the change builds on. Tag each technical statement:

- `[Confirmed]` observed by inspection (cite path/command)
- `[Assumption]` reasonable deduction that must be verified

---

## Section 4 — Proposed architecture

Diagram or bullet description of the target flow. Show boundaries and sequence.

---

## Section 5 — Involved components

```markdown
| Component   | Role in this change | New / Modified / Reused |
| ----------- | ------------------- | ----------------------- |
| <...>       | <...>               | <...>                   |
```

---

## Section 6 — Potentially affected files and modules

```markdown
| Path            | Change | Evidence tag        |
| --------------- | ------ | ------------------- |
| `app/pages/x.vue` | <...> | `[Confirmed]`       |
```

---

## Section 7 — Contracts and interfaces

Interfaces, inputs, outputs, and errors. Note breaking changes explicitly.

---

## Section 8 — Data model changes

```markdown
| Entity / field | Change           | Compatibility                 |
| -------------- | ---------------- | ----------------------------- |
| <...>          | add/modify/drop  | backward-compatible/breaking  |
```

---

## Section 9 — Migration strategy

Steps, batching, backfill, dual-write, downtime, verification. Or `*(not applicable: <reason>)*`.

---

## Section 10 — Validation and security

Input validation, authorization checks, secrets handling, injection/XSS/CSRF, rate limits, audit logging. What is required by the change.

---

## Section 11 — Rollback and compatibility

How to revert safely, in what time, and what happens to data already written. Forward/backward compatibility. **Fixed section** — use `*(not applicable: <reason>)*` if truly none.

---

## Section 12 — Observability

Logs, metrics, traces, and alerts to add or reuse. What signals "healthy" and what triggers an alert. **Fixed section.**

---

## Section 13 — Technical risks

```markdown
| ID     | Risk   | Impact (H/M/L) | Probability (H/M/L) | Mitigation |
| ------ | ------ | -------------- | ------------------- | ---------- |
| TR-001 | <...>  | <...>          | <...>               | <...>      |
```

---

## Section 14 — Alternatives considered

```markdown
| Alternative | Why rejected |
| ----------- | ------------ |
| <...>       | <...>        |
```

---

## Section 15 — Trade-offs

```markdown
| Decision | Gained | Cost / given up |
| -------- | ------ | --------------- |
| <...>    | <...>  | <...>           |
```

---

## Section 16 — Implementation strategy

Ordered approach, incremental and reversible steps, feature flags, rollout.

---

## Section 17 — Test strategy

```markdown
| Level (unit/integration/e2e) | What it covers | Requirement IDs   |
| ---------------------------- | -------------- | ----------------- |
| <...>                        | <...>          | `R-1, AC-1`       |
```

Include regression coverage for touched behavior.

---

## Section 18 — Technical closure criteria

```markdown
- [ ] <verifiable technical condition>
- [ ] Migration verified / not applicable
- [ ] Rollback tested or documented
- [ ] No high-severity security finding open
```

---

## Global rules

- **No restating the problem.** Reference `spec.md`.
- **Concrete paths.** Real file names, not "the module".
- **Fixed sections** (Migration, Rollback, Observability) are never deleted; use the not-applicable note.
- **No full product code.** Contracts and shapes are enough. Code belongs to `/spec-impl`.
