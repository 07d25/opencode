# Risk assessment reference

Depth of documentation and verification is proportional to risk. Classify the
change **before** writing `spec.md` and record the profile plus its
justification at the top of the spec.

## Classification drivers

Assess four axes; the highest axis determines the profile.

| Axis | Low | Medium | High |
| ---- | --- | ------ | ---- |
| **Impact if wrong** | Cosmetic, docs | Single feature degraded | Data loss, money, security, outage |
| **Reversibility** | Trivial revert | Revert with effort/backfill | Hard or impossible to undo |
| **Affected surface** | One file/module | Several modules/service | Cross-service, infra, data model |
| **Failure probability** | Well-trodden path | Some unknowns | New tech, concurrency, external deps |

## Profiles

### LIGHT
- Small fixes, isolated changes, docs/build steps, low impact and easy revert.
- Allow: a single-page spec, short AC list, LIGHT-trimmed gates.
- Still required: stable IDs, at least one test per change, known repo state.

### STANDARD
- New features, module changes, SaaS evolution, medium surface.
- Required: full four-artifact flow and full gates.
- Include alternatives, trade-offs, and regression tests.

### CRITICAL
- Authentication, authorization, payments, sensitive/personal data, destructive
  migrations, critical infrastructure, hard-to-reverse operations.
- Required on top of STANDARD: mandatory rollback plan, an explicit
  **verification vs validation** section, security review, and stricter
  evidence for every gate (observed outputs, not summaries).

## Risk register fields (used in spec and plan)

| Field | Meaning |
| ----- | ------- |
| Risk | The uncertain event |
| Impact | Consequence if it occurs (`H/M/L`) |
| Probability | Likelihood (`H/M/L`) |
| Mitigation | Action that reduces impact or probability |
| Owner | Who tracks it |
| Trigger | Early signal that the risk is materializing |

Priority = Impact × Probability (qualitative). Focus mitigation on
high-impact items first, regardless of probability, for CRITICAL systems.

## Failure-mode prompts

Ask these while planning; record the answers, do not assume safety.

- What happens on partial failure (step 3 of 5 fails)?
- What happens under concurrency or double submission?
- What happens with empty, maximum, or malformed input?
- What happens if an external dependency is slow, down, or returns garbage?
- Can the operation be retried safely (idempotency)?
- Can the change be reverted without data loss?
- Who is authorized, and is authorization checked at every entry point?

## Proportionality warning

Do not turn a LIGHT change into a CRITICAL procedure. Matching rigor to risk is
itself a requirement: over-process slows delivery and hides real risk in noise.
When unsure between two profiles, choose the higher one and record why.
