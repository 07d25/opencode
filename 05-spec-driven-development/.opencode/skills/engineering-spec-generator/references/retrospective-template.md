# Retrospective — <feature name>

> Artifact: LEARNINGS. Be objective. Never fabricate test results, metrics,
> commits, deployments, or validations. Separate observed evidence from inferred
> conclusions.

## Header

- **Feature / change**: `<...>`
- **Spec / Plan / Tasks**: `specs/<feature-name>/`
- **Final phase state**: `COMPLETED | PARTIALLY_COMPLETED | BLOCKED | FAILED`
- **Date**: `<YYYY-MM-DD>`

## 1. Initial objective

`<The goal as stated in the spec, in one paragraph.>`

## 2. Scope actually implemented

`<What was delivered versus planned. Reference identifiers.>`

## 3. Completed tasks

| Task | Evidence (observed) |
| ---- | ------------------- |
| `TASK-001` | `<command output, file, test name>` |

## 4. Pending tasks

| Task | Reason | Next step |
| ---- | ------ | --------- |
| `TASK-00x` | `<...>` | `<...>` |

## 5. Architectural decisions taken

`<Link to ADRs in the plan, plus any decisions made during implementation.>`

## 6. Deviations from the plan

| Planned | Actual | Why |
| ------- | ------ | --- |
| `<...>` | `<...>` | `<...>` |

## 7. Problems found

- `<problem, when detected>`

## 8. Root cause (when determinable)

- `<problem>: <root cause>`

## 9. Solutions applied

- `<solution and why it resolves the root cause>`

## 10. Tests executed

| Test / command | Scope | Result (observed) |
| -------------- | ----- | ----------------- |
| `<command>` | `<unit/integration/e2e>` | `<pass/fail counts>` |

## 11. Observed results

`<Measured outcomes mapped to success metrics M-001...>`

## 12. Residual risks

| Risk | Impact | Follow-up |
| ---- | ------ | --------- |
| `<...>` | `<...>` | `<...>` |

## 13. Technical debt introduced

| Debt | Reason | Proposed repayment |
| ---- | ------ | ------------------ |
| `<...>` | `<...>` | `<...>` |

## 14. Learnings

- `<what worked, what did not, transferable insight>`

## 15. Improvements for future iterations

- `<concrete improvement to the process or system>`

## 16. Final phase state

- **State**: `COMPLETED | PARTIALLY_COMPLETED | BLOCKED | FAILED`
- **Justification**: `<evidence-based>`
- **Closure gate**: `PASS | FAIL | BLOCKED | NOT_VERIFIED`
