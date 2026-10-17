# Skill self-validation checklist

Run this to validate the health of the `engineering-spec-generator` skill itself
(after cloning it into a new repository, after editing it, or on user request).
It checks the skill, not a product feature. Report `PASS / FAIL / BLOCKED /
NOT_VERIFIED` per item.

## A. Discovery and structure

- [ ] `SKILL.md` exists at the skill root with valid frontmatter.
- [ ] `name` and `description` are present; `description` states when to use it.
- [ ] The directory name matches the intended skill ID
      (`engineering-spec-generator`, lowercase kebab-case).
- [ ] This skill appears in the agent's available skills list.
- [ ] No duplicate ID shadows it from a higher-precedence source.

## B. Progressive disclosure and context efficiency

- [ ] `SKILL.md` is concise and actionable (no long reference dumps).
- [ ] Extended material lives in `references/` and is linked, not inlined.
- [ ] Every referenced file exists and its path is correct.

## C. Reference completeness

- [ ] `references/spec-template.md`
- [ ] `references/plan-template.md`
- [ ] `references/tasks-template.md`
- [ ] `references/retrospective-template.md`
- [ ] `references/ears-requirements.md`
- [ ] `references/quality-gates.md`
- [ ] `references/risk-assessment.md`
- [ ] A worked example exists.
- [ ] `README.md` step-by-step guide exists.

## D. Methodological coverage

- [ ] Four artifacts are separated with non-duplication rules.
- [ ] Workflow shows review gates between stages.
- [ ] Modes of operation are defined.
- [ ] Risk profiles (LIGHT/STANDARD/CRITICAL) are defined with justification
      drivers.
- [ ] Stable requirement IDs (FR/NFR/BR/AC) are defined.
- [ ] EARS patterns are documented with anti-patterns.
- [ ] Traceability matrix is specified.
- [ ] Gate verdicts use `PASS/FAIL/BLOCKED/NOT_VERIFIED`.
- [ ] Agent rules forbid inventing evidence, silent scope changes, and
      unauthorized commits/deploys.

## E. Behavioral smoke test

Run at least one live check:

- [ ] `spec review` on an existing spec returns a verdict with findings.
- [ ] `phase audit` on a partial artifact set returns per-gate verdicts.
- [ ] `tasks next` returns the first unblocked, not-DONE task.
- [ ] The skill does not write product code during `spec` or `plan` stages.

## F. Portability

- [ ] Stack-agnostic: no hard dependency on a specific language or framework.
- [ ] Language rule is explicit (identifiers English; body follows user/repo).
- [ ] No external service or project-management tool required.

## Report format

```text
Skill self-validation: PASS
  A discovery: PASS
  B disclosure: PASS
  C references: PASS
  D methodology: PASS
  E smoke test: PASS (spec review on specs/002)
  F portability: PASS
Gaps: none
```
