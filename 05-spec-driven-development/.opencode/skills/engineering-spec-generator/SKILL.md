---
name: Engineering Spec Generator
description: Spec-driven engineering system. Turns an idea, bug, or feature request into four separated, traceable artifacts (spec.md -> plan.md -> tasks.md -> retrospective.md) with review gates, risk-based depth (LIGHT/STANDARD/CRITICAL), EARS requirements, a requirement-to-test traceability matrix, and explicit evidence classification. Use when the user wants to define, generate, review, or audit a specification, technical plan, task breakdown, or retrospective before writing code.
metadata:
  opencode/autoinvoke: true
---

# Engineering Spec Generator

You operate a specification-driven engineering system that moves an idea from a
business need to verified implementation, keeping traceability, technical
control, quality, and continuous learning. The principles used here are public,
widely recognized software-engineering, systems-engineering, and product
practices. They are not the proprietary internal methodology of any company.

## 1. Artifacts and separation of concerns

| Artifact           | Answers      | Owns                                                                    |
| ------------------ | ------------ | ----------------------------------------------------------------------- |
| `spec.md`          | WHAT & WHY   | Problem, users, goals, scope, requirements, acceptance criteria (EARS)  |
| `plan.md`          | HOW          | Architecture fit, affected modules, contracts, data changes, tests, risk |
| `tasks.md`         | EXECUTION    | Small ordered verifiable tasks, dependencies, traceability matrix       |
| `retrospective.md` | LEARNINGS    | Executed evidence, deviations, root causes, residual risk, final state  |

Hard rules:

- Never duplicate a decision across artifacts. `spec.md` owns requirements;
  `plan.md` owns the technical solution; `tasks.md` owns the breakdown;
  `retrospective.md` owns outcomes. If a statement is needed in two places,
  state it fully in one and reference it by identifier from the other.
- `spec.md` must not contain implementation code or unnecessary technical
  decisions. `plan.md` must not restate the problem. `tasks.md` must not
  redesign the solution.
- Each feature lives in `specs/<feature-name>/` with all four files.
- Do not overwrite existing artifacts without explicit authorization. Prefer
  targeted edits and change records over regeneration.

## 2. Non-negotiable agent rules

1. Inspect the repository before proposing anything. Never assume files, APIs,
   functions, or dependencies exist.
2. Never invent results: no fabricated test output, metrics, commits, or
   deployments. Label evidence as observed or inferred.
3. Never silently expand scope. Scope changes go through a spec change record.
4. During `spec` and `plan` stages, do not modify product code and do not
   install dependencies.
5. Never commit, push, or deploy without explicit user authorization.
6. Prefer reuse over new components; no premature abstraction, no unjustified
   over-engineering.
7. Follow repository conventions. If the repo documents stricter rules
   (`AGENTS.md`, `constitution.md`, style guides), read and obey them first.
8. Never declare a phase PASS with pending verifications. Verdicts are
   `PASS / FAIL / BLOCKED / NOT_VERIFIED`, and only with evidence.
9. Record blockers instead of inventing workarounds.
10. Classify every technical statement in `plan.md` as **Confirmed / Inferred /
    Proposed / To-verify**.
11. Do not advance a stage without a REVIEW GATE pass or an explicit user
    override.
12. Prioritize safety and correctness over speed on CRITICAL changes; otherwise
    stay lean and avoid bureaucracy.

## 3. Workflow with review gates

```text
IDEA / REQUIREMENT
      |
      v
  DISCOVERY            (one focused question at a time while ambiguity is high)
      |
      v
   SPEC.md  ---- REVIEW GATE ---- pass required to proceed
      |
      v
   PLAN.md  ---- REVIEW GATE ---- pass required to proceed
      |
      v
  TASKS.md  ---- REVIEW GATE ---- pass required to proceed
      |
      v
  IMPLEMENTATION (human or agent)
      |
      v
  VERIFICATION
      |
      v
RETROSPECTIVE.md ---- CLOSURE GATE
```

- Ask clarifying questions **one at a time** while ambiguity is high (bounded to
  ~6); batch the remainder into "Assumptions and open questions" in the spec.
- Each gate can be re-run after edits without regenerating the whole artifact
  set.
- A pending review must block the next stage unless the user explicitly
  overrides it.
- Phase closure requires the implemented half (tasks DONE with evidence) plus
  the retrospective.

## 4. Modes of operation

The user expresses intent in natural language. Mode names are labels, not a
CLI. Announce the active mode at each step.

| Mode                     | Intent triggers                        | Required input                 | Output                                                       |
| ------------------------ | -------------------------------------- | ------------------------------ | ------------------------------------------------------------ |
| `spec init`              | "empezar", "define ...", "spec init"   | Idea, problem, or bug report   | `specs/<name>/` initialized; discovery questions begin        |
| `spec generate`          | "genera la spec"                       | Discovery answered             | `spec.md` (WHAT & WHY), then self-check                        |
| `spec review`            | "revisa la spec", "audit the spec"     | Existing `spec.md`             | SPEC Gate verdict + findings                                  |
| `plan generate`          | "genera el plan"                       | Approved spec + repository     | `plan.md` (HOW), evidence-classified                          |
| `plan review`            | "revisa el plan"                       | Existing `plan.md`             | PLAN Gate verdict + findings                                  |
| `tasks generate`         | "genera las tasks"                     | Approved spec + plan           | `tasks.md` ordered by dependencies                            |
| `tasks review`           | "revisa las tasks"                     | Existing `tasks.md`            | TASKS Gate + coverage check                                   |
| `tasks next`             | "cuál es la próxima task"              | Existing `tasks.md`            | First unblocked, not-DONE task with its steps                 |
| `retrospective generate` | "cierra la fase", "retrospective"      | Executed and verified work     | `retrospective.md` with observed evidence                     |
| `phase audit`            | "audit de la fase", "dónde estamos"    | Any partial artifact set       | Each gate as PASS/FAIL/BLOCKED/NOT_VERIFIED + pending list    |

Exact gate checks and verdict rules: `references/quality-gates.md`.

## 5. Risk-based depth (proportional rigor)

Classify the change before writing `spec.md` and record the classification and
its justification at the top of the spec. Full rubric:
`references/risk-assessment.md`.

| Profile  | Typical changes                                                                | Adjustments                                                                |
| -------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| LIGHT    | Small fixes, isolated changes, docs/build steps                                | One-page spec allowed; short AC list; stable IDs still required             |
| STANDARD | New features, module changes, SaaS evolution                                   | Full four-artifact flow and full gates                                     |
| CRITICAL | Auth, authorization, payments, sensitive data, destructive migrations, infra   | Full gates + mandatory rollback plan + verification-vs-validation section  |

Justify the classification by impact, reversibility, affected surface, and
probability of failure. Never turn a small change into an aerospace procedure.

## 6. Requirement identifiers and EARS

Stable identifiers (never renumber after publishing; replaced items move to a
"change record"):

- `FR-nnn` functional requirement
- `NFR-nnn` non-functional requirement
- `BR-nnn` business rule
- `AC-nnn` acceptance criterion

Write requirements as EARS clauses where it adds clarity. Patterns, examples,
and anti-patterns: `references/ears-requirements.md`.

## 7. Traceability matrix

`tasks.md` contains and keeps updated a plain-Markdown matrix:

| Requirement | Acceptance | Task     | Test     | Status  |
| ----------- | ---------- | -------- | -------- | ------- |
| FR-001      | AC-001     | TASK-001 | TEST-001 | Pending |

It must expose: requirements with no task, criteria with no test, tasks with no
justification, and pending criteria. No external project-management tool is
required.

## 8. Artifact layouts

Generate artifacts from the templates. Trim non-applicable sections to a
centered `*(not applicable: <reason>)*` note instead of leaving filler.

- `references/spec-template.md`
- `references/plan-template.md`
- `references/tasks-template.md`
- `references/retrospective-template.md`
- Worked mini-example: `references/example-search-filter.md`

Language: keep artifact identifiers and code English; write the artifact body in
the user's language unless the repository defines otherwise.

## 9. Stack-agnostic compatibility

Works for Laravel/PHP, Nuxt/Vue/TypeScript, Node.js, PostgreSQL, SQLite,
monoliths, modular monoliths, hexagonal architectures, APIs, web, and desktop.
Do not impose microservices, full DDD, CQRS, event sourcing, or extra
infrastructure without a demonstrated need. The inspection checklist that
precedes planning lives in the plan template ("Repository check").

## 10. Skill self-audit

To validate this skill's own health (after cloning it, editing it, or on user
request), run `references/skill-checklist.md`.

## Reference index

- Step-by-step user guide (Spanish): `README.md`
- EARS requirements guide: `references/ears-requirements.md`
- Quality gates and verdicts: `references/quality-gates.md`
- Risk assessment rubric: `references/risk-assessment.md`
- Self-validation checklist: `references/skill-checklist.md`
