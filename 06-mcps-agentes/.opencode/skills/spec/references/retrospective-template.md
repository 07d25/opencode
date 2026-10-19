# Template for `retrospective.md` (LEARNINGS)

Reference consulted by the `spec-verifier` agent after verification. Be objective. Never fabricate test results, metrics, commits, deployments, or validations. Separate observed evidence from inferred conclusions.

---

## Header

```markdown
# RETROSPECTIVE NNN — <feature name>

> **Spec / Plan / Tasks:** `specs/NNN-slug/`
> **Final phase state:** COMPLETED | PARTIALLY_COMPLETED | BLOCKED | FAILED
> **Date:** YYYY-MM-DD
```

---

## Section 1 — Initial objective

`<The goal as stated in the spec, in one paragraph.>`

---

## Section 2 — Scope actually implemented

`<What was delivered versus planned. Reference identifiers.>`

---

## Section 3 — Completed tasks

```markdown
| Task     | Evidence (observed)             |
| -------- | ------------------------------- |
| TASK-001 | `<command output, file, test>`  |
```

---

## Section 4 — Pending or blocked tasks

```markdown
| Task     | Reason   | Next step |
| -------- | -------- | --------- |
| TASK-00x | <...>    | <...>     |
```

---

## Section 5 — Decisions taken during implementation

`<Decisions made while coding, plus links back to the spec/plan decisions.>`

---

## Section 6 — Deviations from the plan

```markdown
| Planned | Actual | Why |
| ------- | ------ | --- |
| <...>   | <...>  | <...> |
```

---

## Section 7 — Problems found and root cause

```markdown
- <problem, when detected>
- Root cause: <root cause, when determinable>
- Solution applied: <solution and why it resolves it>
```

---

## Section 8 — Tests executed

```markdown
| Test / command | Scope               | Result (observed) |
| -------------- | ------------------- | ----------------- |
| `<command>`    | unit/integration/e2e| `<pass/fail>`     |
```

---

## Section 9 — Observed results

`<Measured outcomes mapped to the spec's acceptance criteria.>`

---

## Section 10 — Residual risks

```markdown
| Risk   | Impact (H/M/L) | Follow-up |
| ------ | -------------- | --------- |
| <...>  | <...>          | <...>     |
```

---

## Section 11 — Technical debt introduced

```markdown
| Debt   | Reason | Proposed repayment |
| ------ | ------ | ------------------ |
| <...>  | <...>  | <...>              |
```

---

## Section 12 — Learnings

```markdown
- <what worked, what did not, transferable insight>
```

---

## Section 13 — Improvements for future iterations

```markdown
- <concrete improvement to the process or the system>
```

---

## Section 14 — Final phase state

```markdown
- **State**: COMPLETED | PARTIALLY_COMPLETED | BLOCKED | FAILED
- **Justification**: <evidence-based>
- **Closure gate**: PASS | FAIL | BLOCKED | NOT_VERIFIED
```

---

## Global rules

- **Evidence or it did not happen.** Every claim of completion cites a command, file, or test.
- **Observed vs inferred** is stated, never blurred.
- **No product code here.** This artifact records, it does not change.
