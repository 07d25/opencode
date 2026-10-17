# Tasks — <feature name>

> Artifact: EXECUTION. Never redesign the solution here.
> Inputs: approved `spec.md` + `plan.md`.

## Header

- **Feature / change**: `<...>`
- **Spec**: `specs/<feature-name>/spec.md`
- **Plan**: `specs/<feature-name>/plan.md`
- **Risk profile**: `<LIGHT | STANDARD | CRITICAL>`
- **Date**: `<YYYY-MM-DD>`

## Rules

1. Every task delivers one verifiable result (build green, test passing, file
   written, migration verified).
2. Keep tasks small (roughly 20–40 minutes of human work). Split anything larger.
3. Order by real dependencies.
4. Reuse existing components before creating new ones.
5. No functionality beyond the approved scope.
6. Include regression tests for touched behavior.
7. Maintain traceability to `FR / NFR / BR / AC`.
8. Never mark a task `DONE` without verification evidence.
9. Record blockers; do not invent workarounds.
10. Mark parallelizable tasks only when they do not conflict.

Allowed states: `TODO`, `IN_PROGRESS`, `BLOCKED`, `DONE`.

## Phase 1 — <name>

- [ ] **TASK-001 — <short title>**
  - **Status**: `TODO`
  - **Objective**: `<one sentence>`
  - **Description**: `<what and why>`
  - **Requirements**: `FR-001, AC-001`
  - **Dependencies**: `<TASK-000 or none>`
  - **Files / modules**: `<known paths, or "to determine during implementation">`
  - **Steps**:
    1. `<step>`
    2. `<step>`
  - **Tests**: `<unit/integration/e2e to add or run>`
  - **Acceptance**: `<verifiable condition>`
  - **Done when**: `<evidence required, e.g. "<command> passes; regression suite green">`

- [ ] **TASK-002 — <short title>**
  - **Status**: `TODO`
  - **Objective**: `<...>`
  - **Requirements**: `<...>`
  - **Dependencies**: `TASK-001`

## Phase 2 — <name>

- [ ] **TASK-003 — <short title>**
  - **Status**: `TODO`
  - ...

## Parallelization

| Group | Tasks | Precondition |
| ----- | ----- | ------------ |
| A | `TASK-002, TASK-004` | No shared files |

## Traceability matrix

Keep updated as tasks progress.

| Requirement | Acceptance | Task     | Test     | Status  |
| ----------- | ---------- | -------- | -------- | ------- |
| FR-001      | AC-001     | TASK-001 | TEST-001 | Pending |

Status values: `Pending | In progress | Done | Not covered`.
Audit rule: any `Not covered` row blocks the TASKS Gate.

## Blockers

| Blocked task | Reason | Needs | Since |
| ------------ | ------ | ----- | ----- |
| `<TASK-00x>` | `<...>` | `<...>` | `<YYYY-MM-DD>` |
