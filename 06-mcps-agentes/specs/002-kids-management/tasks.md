# TASKS 002 — Gestión de niños (listado y perfil)

> **Spec:** `specs/002-kids-management/spec.md`
> **Plan:** `specs/002-kids-management/plan.md`
> **Date:** 2026-10-19

---

## Rules

1. Every task delivers one verifiable result.
2. Keep tasks small (roughly 20–40 minutes of human work). Split anything larger.
3. Order by real dependencies.
4. Reuse existing components before creating new ones.
5. No functionality beyond the approved scope.
6. Include regression checks for touched behavior (visual/console; no test runner in repo).
7. Maintain traceability to `R / NFR / BR / AC`.
8. Never mark a task `DONE` without verification evidence.
9. Record blockers; do not invent workarounds.
10. Mark parallelizable tasks only when they do not conflict.

Allowed states: `TODO`, `IN_PROGRESS`, `BLOCKED`, `DONE`.

---

## Phase 1 — Foundation

- [x] **TASK-001 — Child types and static mock data**
  - **Status**: `DONE`
  - **Evidence**: `app/types/child.ts` (`Child`, `ChildAlert`, `ChildParent`, `ChildAlertKind`, `ParentStatus`) y `app/data/KidsMock.ts` (`kids`, `kidsRoomLabel`, `kidsCountLabel`, `getChildBySlug`). Verificación con página temporal `__tmp-kids-check.vue` → HTTP 200 con `SALA SOLES · 8 niños`, las 8 fichas literales de la referencia (`Mateo Fernández — 3 años — 2 padres vinculados — MANÍ`, `Sofía Méndez — 2 años — 1 padre vinculado`, `Valentina Soto — 2 años — sin padres vinculados — VINCULAR`, `Tomás Díaz — 3 años — 1 padre vinculado — LACTOSA`), `getChildBySlug('mateo-fernandez').birthDate === '12 mar 2022'` y `getChildBySlug('no-existe') === undefined`. Consola: 0 errores, 0 warnings. Página temporal y `app.vue` restaurados.
  - **Objective**: Domain types plus a single static mock module with the 8 children of the reference.
  - **Requirements**: `R-1, R-2, R-7, R-13, BR-1`
  - **Dependencies**: `none`
  - **Files / modules**: `app/types/child.ts`, `app/data/KidsMock.ts`
  - **Steps**:
    1. Create `Child`, `ChildAlert`, `ChildParent` in `app/types/child.ts` exactly as declared in the spec (identifiers in English, comments in Spanish).
    2. Create `app/data/KidsMock.ts` with `kids`, `kidsRoomLabel` (`SALA SOLES`) and `kidsCountLabel` (`8 niños`).
    3. Copy the 8 list entries literally from `pantallas/ninos.dc.html`: name, initials, age, parents label, avatar tone, badge (MANÍ / LACTOSA / VINCULAR / none), and slug.
    4. Add profile data: Mateo's fields copied literally from `pantallas/perfil-nino.dc.html` (birth date `12 mar 2022`, room `Soles`, enrolled `feb 2025`, allergy notes, Lucía/Diego with their statuses); for the other 7 children create internally consistent fictional data following the same shape.
    5. Comment the module header stating the data is static design mock (no DB, no API, no seed).
  - **Tests**: import the mock in a temporary page and render the 8 names; dev server compiles without errors.
  - **Acceptance**: `KidsMock.ts` exports 8 children whose names, ages, parent labels and badges match the reference; every child has a unique `slug` and a `parents` array.
  - **Done when**: the temp render shows the 8 expected names and the dev server log has no errors.
- [x] **TASK-002 — Design tokens and avatar extension**
  - **Status**: `DONE`
  - **Evidence**: `app/assets/css/main.css` suma 27 líneas de tokens `@theme` (avatares pink/mint/yellow/violet + `parent-blue`, badges `#FBD8CC`/`#D9684A` y `#F9D2DE`/`#C56486`, panel de alergias `#FBDAD6`/`#F4A8A0`/`#C5413A`/`#B25249`, `--color-chevron`, `--color-card-hover`). `app/components/ui/BaseAvatar.vue` extiende `size` con `xl` (48px) y `2xl` (84px) y `tone` con `pink`, `mint`, `yellow`, `violet`, `parent-violet` y `parent-blue`, conservando los valores previos. Medición en navegador: avatar `xl` = 48×48px, `background rgb(244,184,204)` (#F4B8CC), `color rgb(196,74,122)` (#C44A7A), `font-size 19px` — idéntico a la referencia. CSS servido con `--color-pink: #f4b8cc` y `--color-parent-blue: #a9c7e8` (Tailwind v4 emite las variables `@theme` bajo demanda, al usarlas). Regresión del feed verificada en `/`: avatares 38/40/44px con los colores previos, `h1` "Buenas, Caro" y 3 cards; captura `.playwright-mcp/feed-regression.png`.
  - **Objective**: Theme tokens and avatar sizes/tones needed by the children screens exist in the shared design system.
  - **Requirements**: `R-1, R-2, R-6, R-9`
  - **Dependencies**: `none`
  - **Files / modules**: `app/assets/css/main.css`, `app/components/ui/BaseAvatar.vue`
  - **Steps**:
    1. Add to `@theme` the reference colors not present today: avatar pairs `#F4B8CC`/`#C44A7A`, `#B9DEC4`/`#3E8B62`, `#F4DC8E`/`#9A7B1E`, `#C9B6E8`/`#7B5FC0`; badges `#FBD8CC`/`#D9684A` and `#F9D2DE`/`#C56486`; alert panel `#FBDAD6`, `#F4A8A0`, `#C5413A`, `#B25249`; chevron `#CBB89F`; card hover border `#F2A78E`; plus the parent status pills `#CFEBD8`/`#3E9B6C` and `#F7E7A6`/`#9A7B1E` and the parent avatars `#C9B6E8`/`#A9C7E8`.
    2. Extend `BaseAvatar` sizes with 48px (`xl`) and 84px (`2xl`) and tones `pink`, `mint`, `yellow`, `violet`, keeping every existing size and tone working.
    3. Verify the new utilities compile (fetch the served CSS and confirm the new color variables exist).
  - **Tests**: served CSS contains the new tokens; the feed (`/`) still renders the same avatars.
  - **Acceptance**: new tokens present in `:root`; `BaseAvatar` accepts the new sizes/tones without changing current usages.
  - **Done when**: CSS inspection shows the new variables and the feed route has no visual or console regression.

---

## Phase 2 — Shared navigation

- [x] **TASK-003 — Sidebar navigation with NuxtLink**
  - **Status**: `DONE`
  - **Evidence**: `app/components/app/NavItems.vue` renderiza "Feed" (`to="/"`, `exact-active-class`) y "Niños" (`to="/kids"`, `active-class`) como `<NuxtLink>`; "Avisos" y "Mi cuenta" quedan como elementos visuales. El estado activo se aplica con la clase `is-active` definida en el `<style scoped>` del componente (colores de la referencia, sin conflicto con Tailwind). `app/components/app/AppSidebar.vue` convierte el bloque de marca en `<NuxtLink to="/">`. Verificación en navegador: en `/` el item "Feed" tiene `is-active` y "Niños" no; en `/kids` y en `/kids/mateo-fernandez` "Niños" tiene `is-active` y "Feed" no; `href` de los enlaces = `/` y `/kids`. Regresión visual del sidebar medida en `/`: aside 248px, fondo `rgb(255,253,249)`, borde `rgb(236,224,208)`, padding 24px 16px; items con `font-size 14.5px`, `padding 11px 12px`, `border-radius 12px`, `gap 12px`; activo `rgb(217,88,60)` sobre `rgb(251,227,216)` peso 800, inactivos `rgb(110,99,89)` peso 600 — idéntico a SPEC 001. Captura `.playwright-mcp/sidebar-nav-refactor.png`. Consola: 0 errores, 0 warnings. Nota de implementación: Vue Router activa por *route record*, por lo que las rutas de niños se organizan anidadas (`app/pages/kids.vue` y `app/pages/kids/[slug].vue` como layouts con `<NuxtPage/>`); la decisión quedó registrada en `plan.md` (TR-007).
  - **Objective**: Sidebar items navigate internally and the active item follows the current route.
  - **Requirements**: `R-11, R-12`
  - **Dependencies**: `TASK-002`
  - **Files / modules**: `app/components/app/NavItems.vue`, `app/components/app/AppSidebar.vue`
  - **Steps**:
    1. In `NavItems.vue`, give each item a `to` route (`/` for Feed, `/kids` for Niños) and render `<NuxtLink>` instead of inert `<a>`; keep Avisos and Mi cuenta as non-navigating visual entries.
    2. Apply the active styles through `exact-active-class` for Feed and `active-class` for Niños so `/kids/**` keeps Niños active.
    3. In `AppSidebar.vue`, convert the brand block into a `<NuxtLink to="/">`; keep the "Nueva publicación" CTA visual (its target is out of scope).
    4. Preserve the current markup, spacing and typography of the sidebar.
  - **Tests**: Playwright at 1440×900 on `/` and `/kids` checking the active classes and that clicking "Niños" reaches `/kids`.
  - **Acceptance**: on `/` Feed is active; on `/kids` and `/kids/<slug>` Niños is active; the sidebar layout is pixel-identical to SPEC 001.
  - **Done when**: navigation and active state are confirmed by URL and computed classes, with no console errors.

---

## Phase 3 — Listing

- [x] **TASK-004 — Listing building blocks**
  - **Status**: `DONE`
  - **Evidence**: `app/components/kids/KidsHeader.vue` (kicker "GESTIÓN" + `h1` "Niños" + CTA "Agregar niño" con `NuxtLink` a `/kids/add`), `KidsSearchInput.vue` (icono `Search` + input con `modelValue`/`update:modelValue`, placeholder "Buscar niño…"), `KidsSectionHeader.vue` ("SALA SOLES" + "8 niños" + hairline), `ChildCard.vue` (avatar 48px, nombre Fredoka 16px, "edad · N padres vinculados", indicador derecho: badge de alerta / badge VINCULAR / chevron `ChevronRight`; card completa como `NuxtLink` con hover `#F2A78E` y elevación de 2px) y `KidsEmptyState.vue` (mensaje "No encontramos niños con ese nombre." + acción "Limpiar búsqueda"). Verificado en `/kids`: 8 cards con `href` `/kids/mateo-fernandez` … `/kids/olivia-vega`, copy literal de la referencia y badges MANÍ / LACTOSA / VINCULAR / chevron. Captura `.playwright-mcp/kids-kids-desktop.png`.
  - **Objective**: Reusable pieces of the children list ready to be composed.
  - **Requirements**: `R-1, R-2, R-4, R-5`
  - **Dependencies**: `TASK-001`, `TASK-002`
  - **Files / modules**: `app/components/kids/KidsHeader.vue`, `KidsSearchInput.vue`, `KidsSectionHeader.vue`, `ChildCard.vue`, `KidsEmptyState.vue`
  - **Steps**:
    1. `KidsHeader.vue`: "GESTIÓN" kicker in terracotta, "Niños" title in Fredoka 30px, and the gradient "Agregar niño" button.
    2. `KidsSearchInput.vue`: search icon plus a borderless input with placeholder "Buscar niño…" and `v-model`-style `modelValue`/`update:modelValue` contract.
    3. `KidsSectionHeader.vue`: "SALA SOLES", the children count and the trailing hairline.
    4. `ChildCard.vue`: card with 48px avatar, name, "age · parents" line and the right-side indicator (alert badge, VINCULAR badge or chevron) with the reference colors; the whole card is a `<NuxtLink>` to the child profile.
    5. `KidsEmptyState.vue`: Spanish message plus a "Limpiar búsqueda" action emitting `clear`.
  - **Tests**: render the pieces in a temporary page; check classes and copy.
  - **Acceptance**: copy, sizes and colors match `pantallas/ninos.dc.html`; the card exposes a working profile link.
  - **Done when**: the temp render shows the expected strings and the card link points to `/kids/<slug>`.
- [x] **TASK-005 — `/kids` route with search and empty state**
  - **Status**: `DONE`
  - **Evidence**: `app/pages/kids/index.vue` compone `KidsHeader`, `KidsSearchInput`, `KidsSectionHeader` y la grilla `grid-cols-1 sm:grid-cols-2 gap-[14px]` dentro de `max-w-[880px]`. El filtro es un `computed` local que normaliza acentos y mayúsculas y compara contra el nombre y las alertas (etiqueta + notas). Verificación Playwright: carga inicial 8 cards; "maní" → 1 card (Mateo); "lactosa" → 1 card (Tomás); "mateo" → 1 card; "zzz" → 0 cards con el estado vacío visible. Móvil 390×844: `aside` `display: none`, grilla de una sola columna (`grid-template-columns: 340px`), `scrollWidth === clientWidth === 380` (sin scroll horizontal). Consola: 0 errores, 0 warnings. Capturas `.playwright-mcp/kids-kids-desktop.png` y `.playwright-mcp/kids-kids-mobile.png` (curadas en `screenshots/kids.png` y `screenshots/kids-mobile.png`).
  - **Objective**: The listing page renders the 8 children and filters them by name and alerts.
  - **Requirements**: `R-1, R-2, R-3, R-4, R-5, R-13, NFR-2, BR-2`
  - **Dependencies**: `TASK-004`
  - **Files / modules**: `app/pages/kids/index.vue`
  - **Steps**:
    1. Compose the page with the shared `AppSidebar` (teacher and room from `PublicacionesMock`) and a content column of `max-w-[880px]` with `px-10` padding.
    2. Render the 8 children in a 2-column grid (`sm:grid-cols-2`), one column below 640px, `gap-[14px]`.
    3. Keep the search term in local state and compute the filtered list matching the term (case- and accent-insensitive) against the child name and the alert labels/notes.
    4. Show `KidsEmptyState` when the filter returns no children; the clear action resets the term.
    5. Use the reference hover behavior (coral border `#F2A78E` and 2px lift) on the cards.
  - **Tests**: Playwright at 1440×900 and 390×844; type "maní", "lactosa", a name fragment and a non-matching term; count the cards and check the empty state and the clear action.
  - **Acceptance**: 8 cards on load; "maní" leaves only Mateo; "lactosa" leaves only Tomás; a non-match shows the empty state; mobile shows one column and no horizontal scroll.
  - **Done when**: the Playwright run records the expected card counts and the empty state, with a clean console.

---

## Phase 4 — Profile

- [x] **TASK-006 — Profile building blocks**
  - **Status**: `DONE`
  - **Evidence**: `app/components/kids/ChildProfileHeader.vue` (link "Volver a Niños" a `/kids` con `ChevronLeft`, avatar 84px, `h1` Fredoka 28px, "edad · Sala" y botón "Editar" con `NuxtLink` a `/kids/[slug]/edit`), `ChildAlertPanel.vue` (icono `TriangleAlert` sobre `#F4A8A0`, título "Alergias y notas" en `#C5413A` y notas en `#B25249` sobre `#FBDAD6`), `ChildDetailsCard.vue` (tres filas: "Fecha de nacimiento" / "Sala" / "Ingreso") y `LinkedParentsCard.vue` (botón "Resumen del día", encabezado "PADRES VINCULADOS", filas de familiares con avatar 40px, rol, estado y pill ACTIVA/PENDIENTE, más la acción punteada "Vincular otro padre"). Verificación en `/kids/mateo-fernandez`: "Alergias y notas", "Fecha de nacimiento 12 mar 2022", "Sala Soles", "Ingreso feb 2025", "Lucía Fernández · Mamá · activa · ACTIVA" y "Diego Fernández · Papá · invitación enviada · PENDIENTE". Captura `.playwright-mcp/kids-profile-desktop.png`.
  - **Objective**: Reusable pieces of the child profile ready to be composed.
  - **Requirements**: `R-6, R-7, R-8, R-9, R-10, R-12`
  - **Dependencies**: `TASK-002`
  - **Files / modules**: `app/components/kids/ChildProfileHeader.vue`, `ChildAlertPanel.vue`, `ChildDetailsCard.vue`, `LinkedParentsCard.vue`
  - **Steps**:
    1. `ChildProfileHeader.vue`: "Volver a Niños" link to `/kids` with a chevron, 84px avatar, name, "age · Sala" and the "Editar" outline button linking to the child edit placeholder.
    2. `ChildAlertPanel.vue`: the warning block with the rounded icon tile, "Alergias y notas" title and the notes text; rendered only when the child has alerts.
    3. `ChildDetailsCard.vue`: the three rows (birth date, room, enrollment) separated by hairlines.
    4. `LinkedParentsCard.vue`: "PADRES VINCULADOS" header, one row per parent with 40px avatar, name, role, status text and the ACTIVA/PENDIENTE pill, plus the dashed "Vincular otro padre" action linking to the placeholder.
  - **Tests**: render the pieces with Mateo's data in a temporary page; check copy and classes.
  - **Acceptance**: the blocks reproduce `pantallas/perfil-nino.dc.html` and the alert panel is omitted when there are no alerts.
  - **Done when**: the temp render shows the expected strings and the alert block only appears for children with alerts.
- [x] **TASK-007 — `/kids/[slug]` route**
  - **Status**: `DONE`
  - **Evidence**: `app/pages/kids/[slug]/index.vue` resuelve el niño con `useRoute().params.slug` + `getChildBySlug()`; el layout `app/pages/kids/[slug].vue` renderiza `<NuxtPage />` y `app/pages/kids.vue` monta el sidebar compartido. Contenido en `max-w-[820px]` con columna principal flexible y lateral de 300px, apiladas bajo `lg`. Verificación: `/kids/mateo-fernandez` → `h1` "Mateo Fernández", "3 años · Sala Soles", panel de alergias y panel de familiares; `/kids/sofia-mendez` → `h1` "Sofía Méndez" **sin** panel de alergias (bloque condicional, AC-8) y con sus propios familiares; `/kids/no-existe` → estado "No encontramos ese niño" con enlace a `/kids`, sin excepción ni error de consola. Consola: 0 errores, 0 warnings. Capturas `.playwright-mcp/kids-profile-desktop.png` y `.playwright-mcp/kids-profile-mobile.png` (curadas en `screenshots/kid-profile.png` y `screenshots/kid-profile-mobile.png`).
  - **Objective**: The dynamic profile page shows the child of the route and handles unknown slugs safely.
  - **Requirements**: `R-6, R-7, R-8, R-9, R-10, R-12, R-13, NFR-2`
  - **Dependencies**: `TASK-006`
  - **Files / modules**: `app/pages/kids/[slug].vue`
  - **Steps**:
    1. Read the slug with `useRoute()` and resolve the child from `KidsMock` with `kids.find(child => child.slug === slug)`.
    2. Compose the page with the shared sidebar and a content column of `max-w-[820px]`: the back link, then a two-column layout (main column flexible, side column 300px) that stacks below 640px.
    3. Render the profile blocks of TASK-006 with the resolved child and the "Resumen del día" button linking to the daily-summary placeholder.
    4. When the slug does not exist, render a contained not-found state without throwing and without inventing data.
  - **Tests**: Playwright on `/kids/mateo-fernandez`, on a child without alerts and on an unknown slug; check copy, data and console.
  - **Acceptance**: Mateo's profile matches the reference; another child shows its own data and no alert panel; an unknown slug shows the not-found state with no console error.
  - **Done when**: the three navigations are verified by URL, copy and a clean console.

---

## Phase 5 — Placeholders and verification

- [x] **TASK-008 — Coming soon routes**
  - **Status**: `DONE`
  - **Evidence**: `app/components/kids/ComingSoonPage.vue` (icono `Clock`, título, descripción y marca "PRÓXIMAMENTE" en español) reutilizado por `app/pages/kids/add.vue`, `app/pages/kids/[slug]/edit.vue`, `app/pages/kids/[slug]/daily-summary.vue` y `app/pages/kids/[slug]/parents/add.vue`. Verificación Playwright: las cuatro rutas responden 200 y muestran el texto "PRÓXIMAMENTE" con su título propio ("Agregar niño", "Editar niño", "Resumen del día", "Vincular otro padre") y el shell del producto (sidebar + fondo cálido). Consola: 0 errores, 0 warnings.
  - **Objective**: The four auxiliary actions lead to a reusable "Próximamente" screen.
  - **Requirements**: `R-10, R-13, NFR-1`
  - **Dependencies**: `TASK-007`
  - **Files / modules**: `app/components/kids/ComingSoonPage.vue`, `app/pages/kids/add.vue`, `app/pages/kids/[slug]/edit.vue`, `app/pages/kids/[slug]/daily-summary.vue`, `app/pages/kids/[slug]/parents/add.vue`
  - **Steps**:
    1. Build `ComingSoonPage.vue` reusing the product shell (sidebar, warm background) with a Spanish title, a short description and an icon.
    2. Create the four pages reusing that component, each with its own title and copy.
    3. Confirm the routes are distinct: `/kids/add` resolves to the add page and not to the dynamic `[slug]` page.
  - **Tests**: Playwright on each of the four URLs; check the "Próximamente" copy and that no console error appears.
  - **Acceptance**: the four routes render the coming-soon screen with the product shell and no 404.
  - **Done when**: all four URLs respond 200 with the expected copy and a clean console.
- [x] **TASK-009 — Final visual, responsive and regression verification**
  - **Status**: `DONE`
  - **Evidence**: Capturas 1440×900 y 390×844 de `/kids` y `/kids/mateo-fernandez` (`.playwright-mcp/kids-*-desktop.png`, `.playwright-mcp/kids-*-mobile.png`; curadas en `screenshots/kids.png`, `screenshots/kids-mobile.png`, `screenshots/kid-profile.png`, `screenshots/kid-profile-mobile.png`). Regresión del feed verificada en `/`: `h1` "Buenas, Caro", 3 cards y "Feed" activo. Consola: 0 errores en `/`, `/kids`, `/kids/mateo-fernandez` y `/kids/add`. Fuentes bloqueadas (`fonts.googleapis.com` y `fonts.gstatic.com`): el perfil mantiene `h1` "Mateo Fernández" y el listado 9 enlaces (8 niños + "Agregar niño"), sin overflow (`scrollWidth === clientWidth === 1440`); el único error de consola es la request de fuentes abortada, propia del escenario. Red: las únicas requests externas son las del CDN de Google Fonts — no hay endpoints, tablas ni llamadas de red a la app (AC-17). Responsive: a 390×844 el sidebar está oculto, el listado es de una columna y el perfil se apila, sin scroll horizontal en ninguna de las dos pantallas.
  - **Objective**: Full AC pass (AC-1..AC-18) documented with evidence before `spec-verifier` runs.
  - **Requirements**: `NFR-1, NFR-2, NFR-3, BR-1, BR-2`
  - **Dependencies**: `TASK-008`
  - **Files / modules**: `screenshots/`, `.playwright-mcp/`
  - **Steps**:
    1. Capture `/kids` and `/kids/mateo-fernandez` at 1440×900 and 390×844, and compare them with `screenshots/ninos.png` and `pantallas/perfil-nino.dc.html`.
    2. Re-check the feed on `/` to confirm the sidebar refactor caused no regression.
    3. Collect console messages on the new routes and verify there are no errors or warnings.
    4. Block Google Fonts and verify both new routes keep their structure without horizontal overflow.
    5. Confirm no network calls other than the fonts CDN (no API, no DB).
    6. Record any deviation (Lucide icon paths, tokens, mocked data) with its exact scope.
  - **Tests**: Playwright visual, console, fallback and network checks.
  - **Acceptance**: every AC has observed evidence and no unresolved failure.
  - **Done when**: screenshots are stored under `screenshots/` and the recorded evidence covers AC-1..AC-18.

---

## Parallelization

| Group | Tasks                 | Precondition                          |
| ----- | --------------------- | ------------------------------------- |
| A     | `TASK-001, TASK-002`  | None; no shared files                 |

---

## Traceability matrix

Keep updated as tasks progress.

| Requirement | Acceptance             | Task                  | Status      |
| ----------- | ---------------------- | --------------------- | ----------- |
| R-1         | AC-1                   | TASK-001, TASK-004, TASK-005 | Done |
| R-2         | AC-2                   | TASK-001, TASK-004, TASK-005 | Done |
| R-3         | AC-3                   | TASK-005              | Done        |
| R-4         | AC-4                   | TASK-004, TASK-005    | Done        |
| R-5         | AC-5                   | TASK-004, TASK-005    | Done        |
| R-6         | AC-6                   | TASK-002, TASK-006, TASK-007 | Done |
| R-7         | AC-7, AC-13            | TASK-001, TASK-006, TASK-007 | Done |
| R-8         | AC-8                   | TASK-006, TASK-007    | Done        |
| R-9         | AC-9                   | TASK-002, TASK-006, TASK-007 | Done |
| R-10        | AC-10                  | TASK-006, TASK-007, TASK-008 | Done |
| R-11        | AC-11                  | TASK-003              | Done        |
| R-12        | AC-12                  | TASK-003, TASK-006, TASK-007 | Done |
| R-13        | AC-14, AC-18           | TASK-001, TASK-005, TASK-007, TASK-008 | Done |
| NFR-1       | AC-14                  | TASK-005, TASK-007, TASK-008, TASK-009 | Done |
| NFR-2       | AC-15                  | TASK-005, TASK-007, TASK-009 | Done |
| NFR-3       | AC-16                  | TASK-002, TASK-009    | Done        |
| BR-1        | AC-17                  | TASK-001, TASK-009    | Done        |
| BR-2        | AC-17                  | TASK-005, TASK-009    | Done        |

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
