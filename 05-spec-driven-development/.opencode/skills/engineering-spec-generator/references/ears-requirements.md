# EARS requirements reference

EARS (Easy Approach to Requirements Syntax) turns vague intent into testable
requirements. Use it in `spec.md` where it adds clarity; a plain affirmative
statement is acceptable when it is already unambiguous and measurable.

## The five patterns

1. **Ubiquitous** — always true, no trigger.
   `The system shall <response>.`
   Example: `The system shall store each habit in a single local JSON file.`

2. **Event-driven** — triggered by an event.
   `When <trigger>, the system shall <response>.`
   Example: `When the user marks a past day, the system shall recompute the
   current streak.`

3. **State-driven** — true while a state holds.
   `While <state>, the system shall <response>.`
   Example: `While the user is unauthenticated, the system shall reject writes.`

4. **Optional feature** — only if a feature/config is present.
   `Where <feature is enabled>, the system shall <response>.`
   Example: `Where color output is enabled and stdout is a TTY, the system shall
   colorize the completion bar.`

5. **Unwanted behavior** — how the system responds to a condition it must
   handle.
   `If <condition>, then the system shall <response>.`
   Example: `If the JSON file is corrupt, then the system shall report a format
   error and shall not overwrite the file.`

Combinations are allowed: `While <state>, when <trigger>, the system shall
<response>.`

## Writing rules

- One requirement per identifier (`FR-nnn`). Do not bundle unrelated behaviors.
- Use "shall" for mandatory, "should" for recommended; never mix silently.
- Make the response observable and testable: something a test can assert.
- State the condition, not the implementation. Prefer "the system shall reject
  the request" over "the system shall return HTTP 422 via the validator class".
- Keep NFRs measurable with a threshold, unit, and under which load/window.
- Business rules (`BR-nnn`) capture invariants: "the system shall never allow
  two active habits with the same name (case-insensitive)".

## Anti-patterns to reject

| Vague | Problem | Rewrite |
| ----- | ------- | ------- |
| "Debe ser rápido." | No threshold | "p95 de latencia < 300 ms con 100 rps." |
| "Debe ser seguro." | No attribute | "Las contraseñas se almacenan con hash Argon2id y sal única." |
| "Será fácil de usar." | Unmeasurable | "Un usuario nuevo completa la tarea principal en < 2 minutos." |
| "Debe funcionar bien con muchos datos." | No bound | "Lista 10 000 registros paginados en < 1 s." |
| "Maneja errores." | No trigger/response | "Si falta un campo obligatorio, el sistema rechaza la solicitud con un mensaje por campo." |

## Mapping requirement → acceptance criterion → test

- One `FR` may map to one or more `AC`; each `AC` must be independently
  verifiable (Given/When/Then).
- Each `AC` must map to at least one test in `tasks.md` (traceability matrix).
- A requirement without an `AC` is incomplete; an `AC` without a test is
  `Not covered` and blocks the TASKS Gate.
