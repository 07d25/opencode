# Worked example — small feature (STANDARD)

A condensed, end-to-end example across the four artifacts. Real artifacts are
fuller; this shows shape and traceability, not exhaustive detail. Feature:
"search habits by name in the listing".

---

## spec.md (excerpt)

**Risk profile**: STANDARD — touches core + CLI, medium surface, easily
reversible, low failure probability.

### Problem
With many habits, the table becomes hard to scan; users cannot find one habit by
name.

### Included scope
- Filter the `listar` output by a case-insensitive name substring.

### Excluded scope (non-goals)
- Fuzzy search, search by date, persistent filters. Reason: no measured need.

### Requirements (EARS)

| ID | Requirement | Priority |
| -- | ----------- | -------- |
| FR-001 | When the user provides a search term, the system shall list only habits whose name contains the term, case-insensitively. | Must |
| FR-002 | When no search term is provided, the system shall list all habits (unchanged behavior). | Must |
| FR-003 | If the search term matches no habit, then the system shall report an empty result without error. | Must |

### Non-functional requirements

| ID | Requirement |
| -- | ----------- |
| NFR-001 | Filtering 1 000 habits shall complete in < 50 ms on a laptop. |

### Acceptance criteria

| ID | Criterion | Verifies |
| -- | --------- | -------- |
| AC-001 | Given habits ["Leer","Meditar"], when search term "lee", then only "Leer" is listed. | FR-001 |
| AC-002 | Given any habits, when no term, then all are listed. | FR-002 |
| AC-003 | Given no match, then output shows "0 hábitos encontrados." | FR-003 |

---

## plan.md (excerpt)

**Repository check**: confirmed existing pure core (`src/core.ts`) and CLI
routing (`src/cli.ts`); `[Confirmed]` listing is rendered by
`formatHabitTable`. `[Proposed]` filter the in-memory `Habit[]` before
rendering, reusing `nameKey` normalization.

### Proposed architecture
`listar [term]` → CLI parses optional term → core `filterHabits(habits, term)`
(pure) → `formatHabitTable` renders the subset.

### Affected files

| Path | Change | Evidence |
| ---- | ------ | -------- |
| `src/core.ts` | add pure `filterHabits` | `[Proposed]` |
| `src/cli.ts` | accept optional term in `listar` | `[Confirmed]` routing exists |

### Contracts

| Interface | Input | Output | Errors |
| --------- | ----- | ------ | ------ |
| `filterHabits(habits, term)` | `Habit[]`, `string` | `Habit[]` | none |

### Alternatives considered
- Filter in the CLI directly: rejected, duplicates normalization logic.
- Add a search dependency: rejected, violates zero-dependency rule.

### Test strategy
Unit: `filterHabits` (case-insensitive, no match, empty term). Integration:
`listar lee` filters; `listar` unchanged.

### Rollback
Revert commit; no data model change, no migration.

### ADR-001
- **Decision**: filter in a pure core function before rendering.
- **Consequences**: testable without I/O; rendering stays untouched.

---

## tasks.md (excerpt)

- [ ] **TASK-001 — `filterHabits` in core (tests first)**
  - **Requirements**: `FR-001, FR-003, AC-001, AC-003`
  - **Dependencies**: none
  - **Tests**: unit — case-insensitive match, no match, empty term returns all
  - **Done when**: `bun test` green; `filterHabits` pure and non-mutating

- [ ] **TASK-002 — `listar [term]` in CLI**
  - **Requirements**: `FR-001, FR-002, AC-002`
  - **Dependencies**: `TASK-001`
  - **Tests**: integration — `listar lee` filters; `listar` lists all
  - **Done when**: both integration tests pass; existing listing tests green

### Traceability matrix

| Requirement | Acceptance | Task     | Test     | Status |
| ----------- | ---------- | -------- | -------- | ------ |
| FR-001      | AC-001     | TASK-001 | TEST-001 | Done   |
| FR-002      | AC-002     | TASK-002 | TEST-002 | Done   |
| FR-003      | AC-003     | TASK-001 | TEST-003 | Done   |

---

## retrospective.md (excerpt)

- **Final state**: COMPLETED
- **Tests executed**: `bun test` → 88 pass / 0 fail (observed).
- **Deviations**: none.
- **Residual risk**: NFR-001 measured only on dev hardware; production dataset
  not tested.
- **Debt**: search is substring-only; fuzzy search deferred.
- **Learning**: filtering in the pure core kept CLI tests trivial.
- **Closure gate**: PASS.

---

## Gate verdicts

```text
SPEC Gate: PASS
PLAN Gate: PASS
TASKS Gate: PASS   (matrix has no Not covered rows)
IMPLEMENTATION Gate: PASS   (tests observed green)
CLOSURE Gate: PASS
```
