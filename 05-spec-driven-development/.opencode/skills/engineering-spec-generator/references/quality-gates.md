# Quality gates reference

Gates are proportional to the risk profile: LIGHT trims checks marked *[S/C]*
(STANDARD/CRITICAL only). Verdicts are always one of:

- `PASS` — every check satisfied with evidence.
- `FAIL` — one or more checks unsatisfied; list the exact gap.
- `BLOCKED` — cannot evaluate (missing input, unresolved dependency).
- `NOT_VERIFIED` — could not be confirmed; never report as PASS.

Never declare `PASS` with pending verifications. Never fabricate gate evidence.

## SPEC Gate

Input: `spec.md`. Output: verdict + findings.

- [ ] Problem is understandable without reading the solution.
- [ ] Users/actors identified.
- [ ] Included and excluded scope defined.
- [ ] Requirements use stable IDs and are testable (EARS where useful).
- [ ] No contradictions between requirements.
- [ ] Critical open questions resolved or explicitly carried with an owner.
- [ ] Acceptance criteria are clear and verifiable.
- [ ] Success metrics are measurable with thresholds. *[S/C]*
- [ ] Risks and assumptions recorded. *[S/C]*
- [ ] Risk profile justified (impact, reversibility, surface, failure
      probability).

## PLAN Gate

Input: approved `spec.md` + `plan.md` + inspected repository.

- [ ] Architecture is compatible with the existing repository.
- [ ] No invented files/APIs; statements carry evidence tags.
- [ ] Dependencies identified (internal and external).
- [ ] Alternatives evaluated when a non-trivial decision exists.
- [ ] Risks identified with mitigation.
- [ ] Test strategy defined and mapped to requirements.
- [ ] Security considered per risk profile. *[S/C]*
- [ ] Data changes have a migration and rollback strategy. *[S/C]*
- [ ] No unjustified over-engineering (no premature abstraction, no unneeded
      infra).
- [ ] Verification vs validation distinguished. *[C]*

## TASKS Gate

Input: `spec.md` + `plan.md` + `tasks.md`.

- [ ] Every `FR/NFR/BR` is covered by at least one task.
- [ ] Every `AC` maps to at least one test; no `Not covered` rows.
- [ ] Dependency order is correct and acyclic.
- [ ] Every task is executable and has verifiable acceptance and "Done when".
- [ ] No task exceeds the approved scope.
- [ ] Regression tests planned for touched behavior.
- [ ] Parallel groups do not conflict over shared files.

## IMPLEMENTATION Gate

Input: implemented work + evidence.

- [ ] Code consistent with the approved plan (or deviations documented).
- [ ] Requirements implemented and mapped.
- [ ] Relevant tests executed; results observed, not assumed.
- [ ] No known regressions left undocumented.
- [ ] Security validations performed per risk profile. *[S/C]*
- [ ] Changes reviewed (human or agent review recorded). *[S/C]*
- [ ] Rollback validated or feasible. *[C]*

## CLOSURE Gate

Input: `retrospective.md` + artifacts.

- [ ] Evidence recorded for completed tasks.
- [ ] Retrospective finished with an explicit final state.
- [ ] Residual risks documented.
- [ ] Technical debt documented.
- [ ] Repository left in a known state (build/tests status stated).
- [ ] Final phase state is one of `COMPLETED / PARTIALLY_COMPLETED / BLOCKED /
      FAILED`.

## Audit output format

Report each gate compactly:

```text
SPEC Gate: PASS
  - Problem and scope: OK
  - FR-004 has no AC -> FAIL

PLAN Gate: NOT_VERIFIED
  - Migration strategy missing; cannot evaluate.

Pending to unblock: FR-004 AC, migration section.
```
