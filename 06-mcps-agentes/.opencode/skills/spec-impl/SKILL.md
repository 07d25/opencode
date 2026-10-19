---
name: spec-impl
description: Implements an approved spec by executing its tasks.md step by step. Validates that spec.md and plan.md mean "Approved", creates the git branch spec-NNN-slug, updates each TASK status with evidence, and pauses for review after every task.
disable-model-invocation: true
argument-hint: <NNN-spec-name>
allowed-tools: Bash(git status:*), Bash(git branch:*), Bash(git checkout:*), Bash(cat:*), Bash(ls:*)
---

# /spec-impl — Implementer of approved specs

## Session context

Current repository state:

!`git status --short`

Current branch:

!`git branch --show-current`

Specs available:

!`ls specs/ 2>/dev/null || echo "The specs/ folder does not exist"`

Branch-creation config:

!`cat specs/.spec-config.yml 2>/dev/null || echo "AutoCreateBranch: true (default, no config file)"`

---

This is the **implementation stage** of the pipeline:

```
/spec <idea>  →  spec.md  →  /spec plan  →  plan.md  →  /spec tasks  →  tasks.md  →  /spec-impl  →  spec-verifier
```

It consumes `tasks.md` and follows it exactly. It does **not** verify acceptance criteria or write the retrospective; the `spec-verifier` agent handles both after implementation.

## Instructions

Follow these phases in strict order. **Do not advance if the previous one did not complete correctly.**

### Phase 1 — Identify the spec

The received argument is: `$ARGUMENTS`

- If empty: list the specs available above and ask the user for the exact name. Stop.
- If it has a value: resolve it in `specs/` (full name `001-habits-mvp`, number `001`, or slug `habits-mvp`). If not found, show the list and ask. If found, continue.

### Phase 2 — Validate states

Read `specs/NNN-slug/spec.md` and check the state line. It must mean **Approved** (`Approved`, `Aprobado`, `Aprovado`, or the equivalent in another language). Anything else → stop with:

```
❌ I cannot implement this spec.

Current state: [STATE FOUND]
I only work with specs whose state means "Approved".
Change it to "Approved" manually (the human does this), or finish the spec with /spec.
```

Then read `specs/NNN-slug/plan.md` and `specs/NNN-slug/tasks.md`. The plan must mean **Approved** and `tasks.md` must exist with no `Not covered` row in its traceability matrix. If either condition fails, send the user to `/spec plan NNN-slug` or `/spec tasks NNN-slug` respectively.

### Phase 3 — Create the git branch and switch to it

1. Derive the branch name from the spec folder: `spec-NNN-slug` (e.g. `001-habits-mvp` → `spec-001-habits-mvp`).
2. Read `AutoCreateBranch` from the config above. Missing/unrecognized → treat as `true`; only an explicit `false` disables it.
   - **`true`:** if the branch does not exist, `git checkout -b spec-NNN-slug`; if it exists, inform the user you are resuming it; then `git checkout spec-NNN-slug` and confirm.
   - **`false`:** ask `Create and switch to the branch spec-NNN-slug? [y/N]`. Yes → as above. No/empty → do not create any branch; tell the user you will work on the current branch and wait for explicit confirmation.
3. Confirm the setup:

   ```
   ✅ Ready to implement.

   Spec:   specs/NNN-slug/spec.md
   Plan:   specs/NNN-slug/plan.md
   Tasks:  specs/NNN-slug/tasks.md
   Branch: spec-NNN-slug  (active)
   State:  Approved
   ```

4. **Do not start implementing yet.** Show the objective, scope, and the ordered task list so the user has it fresh.

### Phase 4 — Implement task by task

Tell the user:

```
I will implement tasks.md in order, updating each TASK status as I go.
I will pause after every task so you can review the diff.

Shall we start with TASK-001?
```

Wait for explicit confirmation before starting.

**One rule above all:** implement what the spec, plan, and tasks say. If something looks suboptimal, mention it as an observation but implement what was agreed. Changes to the spec go into the spec, not silently into the code.

**Work rhythm, per task:**

1. Set the task `Status` to `IN_PROGRESS` in `tasks.md`.
2. Implement it, following its steps.
3. Run its tests / checks.
4. If verified, set `Status` to `DONE` and record the evidence in the task (command, file, or test name). Update the traceability matrix row.
5. Show which files changed and what was done.
6. Say: `TASK-00N completed. Could you review the diff and let me know if I continue with TASK-00M?`
7. Wait for confirmation before continuing.

**If you find an ambiguity** the spec/plan do not resolve: stop, describe it, present two or three concrete options, and wait. Do not improvise.

**If the user asks for something out of scope:** remind them it is out of this spec's scope, suggest noting it for the next spec, and do not implement it on this branch.

**If a task is impossible as written:** mark it `BLOCKED` in `tasks.md` with the reason and the need, add it to the Blockers table, and ask the user how to proceed. Do not invent a workaround silently.

**When the last task is done:**

```
✅ All tasks are DONE.

Next step: use the `spec-verifier` agent with `NNN-slug` to verify the acceptance criteria and write the retrospective.
```

## Hard rules

- **Never mark a task `DONE` without evidence.**
- **Never implement beyond the approved scope.**
- **Never skip the per-task review pause.**
- **Never create a commit, push, or deploy without explicit authorization.**
- **Changes to requirements or design go into the spec/plan, not into the code by surprise.**
