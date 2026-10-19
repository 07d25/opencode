<!-- BEGIN:nuxt-agent-rules -->

# This is Nuxt 4 + Nitro, not Next.js

This project uses Nuxt 4 (Vue 3) with the Nitro server. Routing, data fetching, server endpoints, and directory conventions differ from Next.js. Put client code under `app/` and server code under `server/`. Read the relevant Nuxt 4 docs before writing code and heed deprecation notices.

<!-- END:nuxt-agent-rules -->

## Commands

- `npm run dev` — Nuxt dev server at http://localhost:3000 (HMR)
- `npm run build` — production build (`nuxt build`)
- `npm run generate` — static generation (`nuxt generate`)
- `npm run preview` — preview the production build
- `npm run postinstall` — `nuxt prepare`; regenerates `.nuxt` types after install
- `bun.lock` is present, so `bun run <script>` also works.
- No linter is configured — don't invent `npm run lint`. If one is added, use ESLint 9 flat config, not `next lint`.
- Typecheck is not set up (no `typescript`/`vue-tsc` installed). To enable it, install both and run `npx nuxt typecheck`.
- No test framework is configured — don't invent test commands.

## Stack notes

- Nuxt 4.6.2 + Vue 3.5.44 + Vue Router 5.4.0. ESM project (`"type": "module"`).
- Layout: `app/app.vue` is the root component; file-based routes go in `app/pages/`, with `app/components/`, `app/layouts/`, `app/composables/`, and `app/assets/` alongside. Nitro server code goes in `server/api/` and `server/routes/`.
- Auto-imports: Vue APIs, Nuxt composables, components, and `app/composables/` are auto-imported — don't add redundant imports.
- Data fetching: `useFetch` / `useAsyncData` / `$fetch`; server handlers use `defineEventHandler` and return JSON directly.
- Meta/SEO: `useHead` / `useSeoMeta` (not Next.js `metadata` exports).
- Config lives in `nuxt.config.ts`; Nitro options go under the `nitro` key.
- No Tailwind or CSS framework is configured. Prefer scoped `<style>` blocks or global CSS registered via the `css` option in `nuxt.config.ts`; don't create `tailwind.config.ts` unless Tailwind is explicitly added.
- `nuxt.config.ts` is TypeScript, but app code is currently plain JS/Vue. Don't assume TS tooling is available in the app.

## Project context

- `open-daycare`: a Spanish-language daycare management app (staff + family/parent flows). UI copy is in Spanish.
- This workspace/package is `06-mcps-agentes`.
- `app/app.vue` still renders `<NuxtWelcome />` — the real UI has not been built yet.
- `pantallas/*.dc.html` are the design source of truth for each screen; open `pantallas/index.dc.html` for the catalog of 15 screens. `screenshots/*.png` are rendered previews. Implement against these: fonts are Fredoka (headings) + Nunito (body) on a warm palette (background `#f6ecdf`, accent `#d9583c`/`#f2937a`, staff blue `#2e89a6`, family purple `#7b5fc0`).

## MCPs

- Playwright: use it for browser checks and screenshots. Put raw Playwright output in `.playwright-mcp/` (gitignored); curated captures go in `screenshots/`.
  - It is configured in `opencode.json` with `--browser chromium` because desktop Chrome is not installed in this environment.
- Context7: use it to fetch current Nuxt/Nitro/Vue docs instead of relying on training data.

## Agents

- `spec-verifier` (`.opencode/agents/spec-verifier.md`): verifies the acceptance criteria of a spec, gathers observed evidence, fixes contained code/spec issues, marks the checkboxes in `spec.md` and reports a PASS/FAIL/BLOCKED verdict per criterion. Uses Playwright MCP with vision to compare rendered screens against `pantallas/` references, and Context7 MCP to validate Nuxt/Nitro best practices.

## Spec Driven Development - simple flow

All methodology lives in `.opencode/` (project-local). Each feature gets one folder, `specs/NNN-slug/`, so its documents never scatter across project folders.

```
/spec <idea>              → specs/NNN-slug/spec.md    WHAT & WHY
/spec plan NNN-slug       → specs/NNN-slug/plan.md    HOW
/spec tasks NNN-slug      → specs/NNN-slug/tasks.md   EXECUTION
/spec-impl NNN-slug       → implements task by task on branch spec-NNN-slug
spec-verifier NNN-slug    → verifies ACs and writes retrospective.md
```

- `spec.md`: scope, requirements, security/NFR, failure modes, acceptance criteria, decisions, and risks.
- `plan.md`: repository inspection, architecture, contracts, migration, rollback, observability, tests, and technical risks.
- `tasks.md`: ordered `TASK-nnn` items, states, evidence, traceability, and blockers.
- `retrospective.md`: produced by `spec-verifier` after verification; records delivered scope, evidence, deviations, debt, and closure verdict.
- Skills: `.opencode/skills/spec/SKILL.md` and `.opencode/skills/spec-impl/SKILL.md`; the templates for all four artifacts are centralized in `.opencode/skills/spec/references/`.
- The user manually marks `spec.md` and `plan.md` as **Approved** before their next stage.
- Task states: `TODO`, `IN_PROGRESS`, `BLOCKED`, `DONE`. Never mark a task `DONE` without evidence.
- Branch creation is controlled by `AutoCreateBranch` in `specs/.spec-config.yml` (default `true`).
- Rule of proportionality: small internal changes may use a short spec; features use the full flow; anything touching auth, data, money or infra also requires rollback + security + audit sections.
- The old `klerith/fernando-skills` `spec`/`spec-impl` are archived in `.agents/skills-archive/` — do not use them.

## Reglas de código

- Usar código limpio, nombres, funciones, variables, etc. en inglés.
