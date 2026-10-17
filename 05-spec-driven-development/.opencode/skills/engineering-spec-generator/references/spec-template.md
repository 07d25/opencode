# Specification — <feature name>

> Artifact: WHAT & WHY. No implementation code or unnecessary technical choices.
> Replace every `<...>` placeholder. Trim non-applicable sections to
> `*(not applicable: <reason>)*`.

## Header

- **Feature / change**: `<short kebab or title>`
- **Spec ID**: `specs/<feature-name>/`
- **Risk profile**: `LIGHT | STANDARD | CRITICAL` — justification: `<impact, reversibility, surface, failure probability>`
- **Owner**: `<name / role>`
- **Status**: `Draft | In review | Approved | Implemented | Deprecated`
- **Date**: `<YYYY-MM-DD>`

## 1. Context

`<Background, product area, current situation, why now.>`

## 2. Problem

`<The concrete problem, who suffers it, its cost. Problem-first: describe the
problem before any solution.>`

## 3. Users and actors

| Actor | Role | Primary need | Notes |
| ----- | ---- | ------------ | ----- |
| `<...>` | `<...>` | `<...>` | `<...>` |

## 4. Goals

`<Outcome-oriented goals. What success looks like, not the feature list.>`

## 5. Hypotheses

| ID | Hypothesis (testable) | Signal that confirms | Signal that refutes |
| -- | --------------------- | -------------------- | ------------------- |
| H-001 | `<If we ..., then ...>` | `<...>` | `<...>` |

## 6. Success metrics

| ID | Metric | Baseline | Target | Window | Source |
| -- | ------ | -------- | ------ | ------ | ------ |
| M-001 | `<measurable>` | `<...>` | `<...>` | `<...>` | `<...>` |

Avoid unmeasurable wording ("fast", "secure"). State thresholds.

## 7. Included scope

- `<capability in scope>`

## 8. Excluded scope (non-goals)

- `<explicitly out of scope, with reason>`

## 9. User stories

- **US-001** — As `<actor>`, I want `<capability>` so that `<benefit>`.

## 10. Functional requirements (FR)

EARS clauses. See `references/ears-requirements.md`.

| ID | Requirement (EARS) | Priority | Related stories |
| -- | ------------------ | -------- | --------------- |
| FR-001 | `<When <trigger>, the system shall <response>.>` | Must | US-001 |

## 11. Non-functional requirements (NFR)

| ID | Attribute | Requirement (measurable) |
| -- | --------- | ------------------------ |
| NFR-001 | `<performance, security, availability, accessibility, ...>` | `<e.g. p95 < 300 ms at 100 rps>` |

## 12. Business rules (BR)

| ID | Rule |
| -- | ---- |
| BR-001 | `<invariant or policy the system must enforce>` |

## 13. Edge cases

- `<empty, null, maximum, concurrency, duplicate, boundary, offline, error>` → expected behavior

## 14. Constraints

- `<budget, deadline, regulation, platform, dependency limits>`

## 15. Known dependencies

| Dependency | Type | Impact if unavailable |
| ---------- | ---- | --------------------- |
| `<...>` | `<internal/external>` | `<...>` |

## 16. Acceptance criteria (AC)

| ID | Criterion (verifiable) | Verifies |
| -- | ---------------------- | -------- |
| AC-001 | Given `<...>` when `<...>` then `<...>` | FR-001 |

## 17. Product risks

| ID | Risk | Impact | Probability | Mitigation |
| -- | ---- | ------ | ----------- | ---------- |
| R-001 | `<...>` | `<H/M/L>` | `<H/M/L>` | `<...>` |

## 18. Assumptions and open questions

| ID | Item | Type | Owner | Status |
| -- | ---- | ---- | ----- | ------ |
| Q-001 | `<...>` | Assumption / Open question | `<...>` | Open / Resolved |

## Change records

Append one block per approved scope change. Never rewrite published
requirements silently; mark superseded ones.

### Change 1 — `<title>`

- **State**: `Proposed | Approved | Implemented | Rejected`
- **Affects**: `FR-00x, AC-00x`
- **Date**: `<YYYY-MM-DD>`
- **Reason / objective**: `<...>`
- **Evidence**: `<...>`
