# Technical Plan — <feature name>

> Artifact: HOW. Never restate the problem; reference the spec.
> Input: an approved `spec.md` plus an inspected repository.

## Header

- **Feature / change**: `<...>`
- **Spec**: `specs/<feature-name>/spec.md`
- **Risk profile**: `<LIGHT | STANDARD | CRITICAL>` (inherited from spec)
- **Status**: `Draft | In review | Approved`
- **Date**: `<YYYY-MM-DD>`

## 0. Repository check (inspection before design)

Record what was actually inspected. Mark each area `Inspected` or `Not inspected`
(with reason). Do not invent findings.

| Area | Finding | Evidence (path/command) |
| ---- | ------- | ----------------------- |
| Architecture | `<...>` | `<...>` |
| Stack / versions | `<...>` | `<...>` |
| Conventions | `<...>` | `<...>` |
| Module structure | `<...>` | `<...>` |
| Reusable components | `<...>` | `<...>` |
| Persistence / migrations | `<...>` | `<...>` |
| Auth / authorization | `<...>` | `<...>` |
| Security posture | `<...>` | `<...>` |
| Testing setup | `<...>` | `<...>` |
| Dependencies | `<...>` | `<...>` |
| Infrastructure | `<...>` | `<...>` |
| Configuration | `<...>` | `<...>` |
| Performance / cost limits | `<...>` | `<...>` |
| Repo rules (`AGENTS.md`, constitution) | `<...>` | `<...>` |

## 1. Technical summary

`<2–4 sentences: the chosen approach and why it fits this repository.>`

## 2. Relevant current state

`<Existing components, flows, and constraints the change builds on, each
classified with an evidence tag below.>`

Evidence classification — tag **every** technical statement:

- `[Confirmed]` observed by inspection (cite path/command)
- `[Inferred]` reasonable deduction (state the basis)
- `[Proposed]` design choice made here
- `[To-verify]` must be checked before or during implementation

## 3. Proposed architecture

`<Diagram or bullet description of the target flow. Show boundaries and sequence.>`

## 4. Involved components

| Component | Role in this change | New / Modified / Reused |
| --------- | ------------------- | ----------------------- |
| `<...>` | `<...>` | `<...>` |

## 5. Potentially affected files and modules

| Path | Change | Evidence tag |
| ---- | ------ | ------------ |
| `<path>` | `<...>` | `<Confirmed/Inferred/Proposed/To-verify>` |

## 6. Contracts and interfaces

| Interface | Direction | Input | Output | Errors |
| --------- | --------- | ----- | ------ | ------ |
| `<...>` | `<in/out>` | `<...>` | `<...>` | `<...>` |

Covers APIs, function signatures, events, and CLI contracts. Note breaking
changes explicitly.

## 7. Data model changes

| Entity / field | Change | Compatibility |
| -------------- | ------ | ------------- |
| `<...>` | `<add/modify/drop>` | `<backward-compatible / breaking>` |

## 8. Migration strategy

`<Steps, batching, dual-write/backfill, downtime, verification. Or "not
applicable".>`

## 9. Validation and security

`<Input validation, authorization checks, secrets, injection/XSS/CSRF, rate
limits, audit logging. State what is required by the risk profile.>`

## 10. Technical risks

| ID | Risk | Impact | Probability | Mitigation | Owner |
| -- | ---- | ------ | ----------- | ---------- | ----- |
| TR-001 | `<...>` | `<H/M/L>` | `<H/M/L>` | `<...>` | `<...>` |

## 11. Alternatives considered

| Alternative | Why rejected |
| ----------- | ------------ |
| `<...>` | `<...>` |

## 12. Trade-offs

| Decision | Gained | Cost / given up |
| -------- | ------ | --------------- |
| `<...>` | `<...>` | `<...>` |

## 13. Implementation strategy

`<Ordered approach, incremental and reversible steps, feature flags, rollout.>`

## 14. Test strategy

| Level (unit/integration/e2e) | What it covers | Requirement IDs |
| ---------------------------- | -------------- | --------------- |
| `<...>` | `<...>` | `FR-001, AC-001` |

Include regression tests for affected existing behavior.

## 15. Rollback and compatibility

`<How to revert safely, data implications, backward/forward compatibility.>`

## 16. Technical closure criteria

- [ ] `<verifiable technical condition, e.g. all NFR thresholds met, migration verified>`

## Architecture decisions (ADR-lite)

### ADR-001 — `<decision>`

- **Status**: `Proposed | Accepted | Superseded`
- **Context**: `<...>`
- **Decision**: `<...>`
- **Alternatives**: `<...>`
- **Consequences**: `<...>`
- **Evidence tag**: `<Confirmed/Inferred/Proposed/To-verify>`
