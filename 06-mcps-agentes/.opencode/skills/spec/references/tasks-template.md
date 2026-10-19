# Template for `tasks.md` (EXECUTION)

Reference consulted by `/spec tasks`. It breaks an approved `plan.md` into small, ordered, verifiable tasks. **Never redesign the solution here.**

---

## Header

```markdown
# TASKS NNN — <feature name>

> **Spec:** `specs/NNN-slug/spec.md`
> **Plan:** `specs/NNN-slug/plan.md`
> **Date:** YYYY-MM-DD
```

---

## Rules

1. Every task delivers one verifiable result.
2. Keep tasks small (roughly 20–40 minutes). Split anything larger.
3. Order by real dependencies.
4. Reuse existing components before creating new ones.
5. No functionality beyond the approved scope.
6. Include regression tests for touched behavior.
7. Maintain traceability to `R / NFR / BR / AC`.
8. Never mark a task `DONE` without verification evidence.
9. Record blockers; do not invent workarounds.
10. Mark parallelizable tasks only when they do not conflict.

Allowed states: `TODO`, `IN_PROGRESS`, `BLOCKED`, `DONE`.

---

## Phase 1 — <name>

```markdown
- [ ] **TASK-001 — <short title>**
  - **Status**: `TODO`
  - **Objective**: <one sentence>
  - **Requirements**: `R-1, AC-1`
  - **Dependencies**: `none` | `TASK-000`
  - **Files / modules**: `<path>` | `to determine during implementation`
  - **Steps**:
    1. <step>
    2. <step>
  - **Tests**: <unit/integration/e2e to add or run>
  - **Acceptance**: <verifiable condition>
  - **Done when**: <evidence required, e.g. "<command> passes; regression suite green">
```

---

## Phase 2 — <name>

```markdown
- [ ] **TASK-00N — <short title>**
  - **Status**: `TODO`
  - **Objective**: <...>
  - **Requirements**: <...>
  - **Dependencies**: `TASK-00M`
```

---

## Parallelization

```markdown
| Group | Tasks              | Precondition    |
| ----- | ------------------ | --------------- |
| A     | `TASK-002, TASK-004` | No shared files |
```

---

## Traceability matrix

Keep updated as tasks progress.

```markdown
| Requirement | Acceptance | Task     | Status      |
| ----------- | ---------- | -------- | ----------- |
| R-1         | AC-1       | TASK-001 | Pending     |
| NFR-1       | AC-4       | TASK-003 | Pending     |
```

Status values: `Pending | In progress | Done | Not covered`.

Audit rule: any `Not covered` row blocks the TASKS gate.

---

## Blockers

```markdown
| Blocked task | Reason   | Needs   | Since      |
| ------------ | -------- | ------- | ---------- |
| `TASK-00x`   | <...>    | <...>   | YYYY-MM-DD |
```

---

## Global rules

- **No design decisions.** If one is needed, the plan must change first.
- **One verifiable result per task.**
- **Every `AC` maps to at least one task.**
- **Evidence or it did not happen.** A task is `DONE` only with a command, file, or test that proves it.
