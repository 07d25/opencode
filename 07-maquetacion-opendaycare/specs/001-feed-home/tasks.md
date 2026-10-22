# TASKS 001 — Feed del staff como Home (`/`)

> **Spec:** `specs/001-feed-home/spec.md`
> **Plan:** `specs/001-feed-home/plan.md`
> **Date:** 2026-10-19

---

## Rules

1. Every task delivers one verifiable result.
2. Keep tasks small (roughly 20–40 minutes of human work). Split anything larger.
3. Order by real dependencies.
4. Reuse existing components before creating new ones.
5. No functionality beyond the approved scope.
6. Include regression checks for touched behavior (visual/console, no test runner in repo).
7. Maintain traceability to `R / NFR / AC`.
8. Never mark a task `DONE` without verification evidence.
9. Record blockers; do not invent workarounds.
10. Mark parallelizable tasks only when they do not conflict.

Allowed states: `TODO`, `IN_PROGRESS`, `BLOCKED`, `DONE`.

---

## Phase 1 — Tailwind v4 foundation

- [x] **TASK-001 — Install & wire Tailwind v4**
  - **Status**: `DONE`
  - **Evidence**: `bun add tailwindcss @tailwindcss/vite` → `tailwindcss@4.3.3`, `@tailwindcss/vite@4.3.3`. `nuxt.config.ts` registra `vite.plugins: [tailwindcss()]` y `css: ['~/assets/css/main.css']`. `GET /_nuxt/assets/css/main.css` devuelve `--color-surf: #f6ecdf` (tokens `@theme` compilados) y `GET /` responde 200 con el CSS enlazado. Fuentes Fredoka/Nunito cargadas vía `app.head.link` (preconnect + stylesheet).
  - **Objective**: Tailwind v4 pipeline usable and `@theme` tokens mapped 1:1 from the reference.
  - **Requirements**: `R-9, AC-8, AC-10`
  - **Dependencies**: `none`
  - **Files / modules**: `package.json`, `nuxt.config.ts`, `app/assets/css/main.css`
  - **Steps**:
    1. Add `tailwindcss` and `@tailwindcss/vite` dependencies.
    2. Register the plugin in `nuxt.config.ts` (`vite.plugins`) and set `css: ['~/assets/css/main.css']`.
    3. Create `app/assets/css/main.css` with `@import "tailwindcss";` plus `@theme`: Fredoka/Nunito (`--font-display`, `--font-sans`), full palette of `pantallas/feed.dc.html` (surf `#F6ECDF`, card `#FFFDF9`, hairline `#ECE0D0`, terracota `#D9583C`/`#E0654A`/`#C5503A`, coral gradient, blue `#2E89A6`/sky/royal, mint/success, muted tones, dashed photo colors) pulling design values from the reference HTML inline styles.
    4. Add Google Fonts preconnect + stylesheet tags (Fredoka/Nunito) globally (nuxt.config `app.head`), matching the reference helmet.
  - **Tests**: `npm run dev` smoke — Nuxt boots and `/` still loads with the new CSS pipeline; no Tailwind build errors.
  - **Acceptance**: Theme tokens exist and utilities compile (e.g., a test render uses `bg-surf`). Dev server boots clean.
  - **Done when**: `npm run dev` boots without errors and `/` renders with Tailwind styles injected.
- [x] **TASK-002 — Traceability-less types + mock data**
  - **Status**: `DONE`
  - **Evidence**: `app/types/feed.ts` (tipos `FeedUser`, `FeedMeta`, `FeedPost`, `FeedPostType`) y `app/data/PublicacionesMock.ts` (`currentTeacher`, `feedMeta`, `feedPosts` con las 3 publicaciones exactas de la referencia). Verificación: página temporal `app/pages/__tmp-mock-check.vue` importando `~/data/PublicacionesMock` respondió HTTP 200 con el payload `Caro Giménez|Buenas, Caro|3|Foto · pintando con témperas`; la página temporal y el parche temporal de `app.vue` se eliminaron luego (verificado con `git status`).
  - **Objective**: Static content modules matching the reference text become the single feed source.
  - **Requirements**: `R-5, AC-5, AC-6, AC-7`
  - **Dependencies**: `none`
  - **Files / modules**: `app/types/feed.ts`, `app/data/PublicacionesMock.ts`
  - **Steps**:
    1. Create `FeedUser`, `FeedPost` types (IDs/comments/likes/photoCaption) in `app/types/feed.ts`.
    2. Create `app/data/PublicacionesMock.ts` with `currentTeacher`, `feedMeta` (kicker, saludo, subtítulo) and the 3 exact publications from `pantallas/feed.dc.html` (order, times, recipients, like/comment counts, literal copy).
  - **Tests**: imports compile during dev build.
  - **Acceptance**: `pnpm`/`npm` build succeeds; mock mirrors the reference copy.
  - **Done when**: dev server runs with the mock imported in a temporary route render or type reserved (no runtime usage error).
- [x] **TASK-003 — Iconografía Lucide + avatar** *(revisada tras R-10: iconos desde `@lucide/vue` en lugar de SVG propios)*
  - **Status**: `DONE`
  - **Evidence**: `bun add @lucide/vue` → `@lucide/vue@1.59.0`. Componentes SVG propios eliminados (`app/components/ui/icons/` borrado). Mapeo 1:1 con la referencia: `Sun` (logo), `Plus` (CTA), `House` (Feed), `Users` (Niños), `Bell` (Avisos), `UserRound` (Mi cuenta), `Camera` (prompt), `Heart` (likes), `MessageCircle` (comentarios), `LogOut` (salir), `Megaphone` (anuncio), `Image` (placeholder de foto) — los 12 nombres verificados como exports de `@lucide/vue`. `app/components/ui/BaseAvatar.vue` con tonos coral/sky/royal y tamaños 38/40/44px.
  - **Objective**: Iconografía de la pantalla servida por la librería Lucide, con imports tree-shakeable, y `BaseAvatar` alineado al diseño.
  - **Requirements**: `R-1 (íconos de nav y footer), R-10, AC-1, AC-7, AC-12`
  - **Dependencies**: `TASK-001`
  - **Files / modules**: `package.json`, `app/components/ui/BaseAvatar.vue`
  - **Steps**:
    1. Instalar `@lucide/vue` y borrar los componentes SVG propios de `app/components/ui/icons/`.
    2. Verificar que los 12 íconos requeridos existan como exports de `@lucide/vue`.
    3. Usar los imports directos de `@lucide/vue` en cada componente, ajustando `size` y `strokeWidth` a la referencia.
    4. Mantener `ui/BaseAvatar.vue` con slots para ícono (megáfono del anuncio general) y clases de token.
  - **Tests**: render de prueba con los 12 iconos + avatares; chequeo de consola del navegador.
  - **Acceptance**: todos los iconos provienen de `@lucide/vue`; no queda ningún componente SVG propio de iconos; los avatares conservan los colores y tamaños del diseño.
  - **Done when**: la pantalla renderiza los iconos desde Lucide sin errores de consola ni hex inline fuera de tokens.
- [x] **TASK-004 — Sidebar composition**
  - **Status**: `DONE`
  - **Evidence**: `app/components/app/AppSidebar.vue` (aside de 248px, `hidden` por debajo de 640px y `sm:flex` desde ese breakpoint), `app/components/app/NavItems.vue` (4 ítems, "Feed" activo con `bg-coral-soft`/`text-terracotta`, iconos Lucide `House`/`Users`/`Bell`/`UserRound`) y `app/components/app/SidebarProfile.vue` (avatar coral "C", "Caro Giménez", "Maestra · Soles", botón de salida). Verificación Playwright a 1440×900: `aside` con `width: 248px`, contenido completo renderizado (`OpenDayCare`, `Nueva publicación`, `Feed`, `Niños`, `Avisos`, `Mi cuenta`, `Caro Giménez`, `Maestra · Soles`) y captura `.playwright-mcp/sidebar-desktop.png` equivalente a `screenshots/feed.png`. A 390×844: `aside` con `display: none`, `scrollWidth === clientWidth === 390` (sin scroll horizontal). Consola del navegador: 0 errores y 0 warnings. Nota: los gradientes de la referencia se implementaron con utilidades nativas de Tailwind v4 (`bg-linear-to-b from-coral-500 to-coral-600` y `bg-linear-[155deg] from-coral-light to-coral`); las variables CSS `--gradient-cta/--gradient-logo` se descartaron por no generar `background-image` válido.
  - **Objective**: Sidebar replicates the 248px rail with active state, CTA, nav and teacher profile, hidden on mobile.
  - **Requirements**: `R-1, AC-1, AC-11`
  - **Dependencies**: `TASK-003`
  - **Files / modules**: `app/components/app/AppSidebar.vue`, `app/components/app/NavItems.vue`, `app/components/app/SidebarProfile.vue`
  - **Steps**:
    1. Compose sidebar: logo block (sun-logo + "OpenDayCare"/"Sala Soles"), gradient CTA "Nueva publicación" con plus icon y sombra.
    2. `NavItems.vue` maps the 4 nav entries with active state on "Feed" (bg `#FBE3D8`, text `#D9583C`) and muted inactive items.
    3. `SidebarProfile.vue` renders avatar, name, role ("Maestra · Soles"), y logout button (32px, neutral bg).
    4. Apply responsive rule `hidden` under 640px (`max-sm`) per spec, keeping test on 390×844 viewport.
  - **Tests**: visual check via Playwright MCP at 1440×900 and 390×844.
  - **Acceptance**: AC-1 rows exact; sidebar absent on mobile.
  - **Done when**: screenshot 1440×900 sidebar pixel-match + 390×844 sidebar not rendered.
- [x] **TASK-005 — Feed layout & cards**
  - **Status**: `DONE`
  - **Evidence**: Componentes nuevos en `app/components/feed/`: `FeedHeader.vue`, `CreatePostPrompt.vue`, `PostsDivider.vue`, `PostBadge.vue`, `PhotoPlaceholder.vue`, `PostFooter.vue`, `PostCard.vue`; página `app/pages/index.vue` con columna de 760px (`max-w-[760px]`) y padding `px-5 sm:px-10`. Verificación: `GET /` → 200 con todos los textos de la referencia (`Buenas, Caro`, `Compartí un momento…`, `PUBLICADO HOY`, `LOGRO`/`ACTIVIDAD`/`ANUNCIO`, `Para: familia de Mateo`/`Para: toda la sala`, `Foto · pintando con témperas`, `Anuncio general`, 3× `Editar`). Captura desktop 1440×900 (`.playwright-mcp/feed-desktop.png`) equivalente a `screenshots/feed.png`. Móvil 390×844: `aside` oculto, `scrollWidth === clientWidth === 380`, feed a ancho completo (`.playwright-mcp/feed-mobile.png`). Consola: 0 errores, 0 warnings.
  - **Objective**: Main column replicates header, prompt, divider and the three exact posts.
  - **Requirements**: `R-2, R-3, R-4, R-5, R-6, R-7, R-8, AC-2..AC-7`
  - **Dependencies**: `TASK-002, TASK-003, TASK-004`
  - **Files / modules**: `app/pages/index.vue`, `app/components/feed/*.vue` (`FeedHeader`, `CreatePostPrompt`, `PostsDivider`, `PostCard`, `PostBadge`, `PhotoPlaceholder`, `PostFooter`)
  - **Steps**:
    1. Compose `FeedHeader.vue` (kicker, H1 saludo, sub) using `feedMeta` and the teacher mock.
    2. Build `CreatePostPrompt.vue` (pill with avatar + "Compartí un momento…" + camera tile).
    3. Build `PostsDivider.vue` ("PUBLICADO HOY" + hairline).
    4. Build `PostCard.vue` receiving `post: FeedPost`; internal header (avatar, name, time/"publicado por vos", `PostBadge`), recipient line, paragraph copy, `PhotoPlaceholder` when `photoCaption` exists, y `PostFooter` (heart + count, comment icon + count, "Editar").
    5. Wire `app/pages/index.vue` composing sidebar + main column with max-width 760px, padding 34/40/80, content from mock.
  - **Tests**: Playwright screenshots desktop 1440×900 + console check (NFR-1) + mobile 390×844 AC-11 check.
  - **Acceptance**: AC-2 through AC-7 hold; card order LOGRO→ACTIVIDAD→ANUNCIO preserved with likes/comments numbers and recipient strings exact.
  - **Done when**: rendered `/` visually matches reference on 1440×900; console clean; mobile screenshot passes AC-11.
- [x] **TASK-006 — Root page wiring & opt-out of Welcome**
  - **Status**: `DONE`
  - **Evidence**: `app/app.vue` reemplazó `<NuxtWelcome />` por `<NuxtPage />` (se mantiene `<NuxtRouteAnnouncer />`). Verificación: `GET /` → 200 con el feed renderizado en SSR (`Buenas, Caro` presente en el HTML servido) y la captura `.playwright-mcp/feed-desktop.png` muestra la pantalla de diseño, no la pantalla de bienvenida de Nuxt.
  - **Objective**: `/` stops rendering NuxtWelcome and routes through `pages/index.vue`.
  - **Requirements**: `R-1, AC-1`
  - **Dependencies**: `TASK-005`
  - **Files / modules**: `app/app.vue`
  - **Steps**:
    1. Replace `<NuxtWelcome />` for `<NuxtPage />` (keep `NuxtRouteAnnouncer`).
  - **Tests**: `npm run dev`, load `/` and see the feed, not the Welcome page.
  - **Acceptance**: AC-1 visible at `/`.
  - **Done when**: browser shows the feed on `/` (evidence: Playwright URL + snapshot).
- [x] **TASK-007 — Final visual & console verification**
  - **Status**: `DONE`
  - **Evidence**: Playwright sobre `http://localhost:3000/`. Desktop 1440×900: captura `.playwright-mcp/feed-desktop.png` (curada en `screenshots/feed-home.png`) equivalente a `screenshots/feed.png`; métricas medidas en el DOM: fondo `rgb(246,236,223)` (#F6ECDF), card `rgb(255,253,249)` (#FFFDF9), borde `rgb(236,224,208)` (#ECE0D0), `h1` con `font-family: Fredoka, Nunito, system-ui` y `font-size: 30px`, sidebar `248px`, columna principal `max-width: 760px`, 3 tarjetas en orden LOGRO → ACTIVIDAD → ANUNCIO. Móvil 390×844: `.playwright-mcp/feed-mobile.png` (curada en `screenshots/feed-home-mobile.png`), sidebar oculto, sin scroll horizontal. Consola en carga normal: **0 errores, 0 warnings** (AC-8). AC-9: bloqueando `fonts.googleapis.com`/`fonts.gstatic.com` la página mantiene las 3 tarjetas, el texto del `h1` y sin overflow horizontal (`scrollWidth === clientWidth`), con un único error de red por la fuente bloqueada (esperado en ese escenario). Desviaciones registradas: (a) iconos de `@lucide/vue` en lugar de los SVG inline de la referencia — `House` y `MessageCircle` no son path-idénticos (TR-005); (b) gradientes con utilidades `bg-linear-* from/to` en vez de variables CSS; (c) la referencia no define comportamiento móvil, se aplicó la adaptación de la spec (sidebar oculto bajo 640px).
  - **Objective**: Full AC pass (AC-1..AC-11) documented with evidence before `spec-verifier` runs.
  - **Requirements**: `NFR-1, NFR-2, AC-1..AC-11`
  - **Dependencies**: `TASK-006`
  - **Files / modules**: `screenshots/` outputs, `.playwright-mcp/` artifacts
  - **Steps**:
    1. Playwright MCP: navigate to `/`, capture 1440×900 and 390×844, console messages, fonts fallback check (block fonts and confirm layout integrity).
    2. Compare against reference screenshot `screenshots/feed.png` (or `pantallas/feed.dc.html` rendered capture) side-by-side.
    3. Record deviations (if any) with values; fix or note explicitly for `spec-verifier`.
  - **Tests**: Playwright visual + console + fallback checks.
  - **Acceptance**: every AC marked with real evidence, no unresolved `FAIL` rows.
  - **Done when**: screenshots saved under `screenshots/` and the console log confirms AC-8; deviations documented.

---

## Parallelization

| Group | Tasks | Precondition |
| ----- | ----- | ------------ |
| A | `TASK-002, TASK-003` | `TASK-001` done (Tailwind tokens compiled); no shared files |

---

## Traceability matrix

Keep updated as tasks progress.

| Requirement | Acceptance | Task     | Status  |
| ----------- | ---------- | -------- | ------- |
| R-1         | AC-1       | TASK-003, TASK-004, TASK-006 | Done |
| R-2         | AC-2       | TASK-005 | Done |
| R-3         | AC-3       | TASK-005 | Done |
| R-4         | AC-4       | TASK-005 | Done |
| R-5         | AC-5       | TASK-002, TASK-005 | Done |
| R-6         | AC-5       | TASK-005 | Done |
| R-7         | AC-6       | TASK-005 | Done |
| R-8         | AC-7       | TASK-005 | Done |
| R-9         | AC-10      | TASK-001, TASK-007 | Done |
| R-10        | AC-12      | TASK-003, TASK-007 | Done |
| NFR-1       | AC-8       | TASK-001, TASK-007 | Done |
| NFR-2       | AC-9       | TASK-001, TASK-007 | Done |
| — (responsive) | AC-11   | TASK-004, TASK-005 | Done |

Status values: `Pending | In progress | Done | Not covered`.

Audit rule: any `Not covered` row blocks the TASKS gate.

---

## Blockers

| Blocked task | Reason | Needs | Since |
| ------------ | ------ | ----- | ----- |
| — | — | — | — |

---

## Global rules

- **No design decisions.** If one is needed, `plan.md` must change first.
- **One verifiable result per task.**
- **Every `AC` maps to at least one task.**
- **Evidence or it did not happen.** A task is `DONE` only with a command, file, or screenshot proving it.
