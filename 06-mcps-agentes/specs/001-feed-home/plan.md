# PLAN 001 — Feed del staff como Home (`/`)

> **Spec:** `specs/001-feed-home/spec.md`
> **Status:** Approved
> **Date:** 2026-10-19

---

## Repository check

| Area                      | Finding                                                                                                         | Evidence (path/command)  |
| ------------------------- | --------------------------------------------------------------------------------------------------------------- | ------------------------ |
| Architecture              | Nuxt 4 con `app/` como raíz de aplicación; `app.vue` aún renderiza `<NuxtWelcome />`                            | `app/app.vue`            |
| Stack / versions          | `nuxt ^4.6.2`, `vue ^3.5.44`, `vue-router ^5.4.0`; ESM; sin Nuxt UI ni Tailwind aún                             | `package.json`           |
| Conventions               | Código en inglés, comentarios en español, UI copy en español; sin linter ni framework de tests                  | `AGENTS.md`              |
| Module structure          | Solo `app/app.vue` existe; faltan `app/pages/`, `app/components/`, `app/assets/css/`, `app/data/`, `app/types/` | `find app server`        |
| Reusable components       | Ninguno todavía (proyecto recién creado con starter)                                                            | `app/`                   |
| Persistence / migrations  | Ninguna; sin `server/` activo                                                                                   | `find server`            |
| Auth / authorization      | No aplica para esta spec (pública)                                                                              | `spec.md`                |
| Security posture          | Dep. externa única: `fonts.googleapis.com`; sin secretos                                                        | `pantallas/feed.dc.html` |
| Testing setup             | Sin runner de tests; verificación visual con Playwright MCP                                                     | `package.json`           |
| Dependencies              | Bun lockfile (`bun.lock`); package.json con scripts `dev/build/generate/preview/postinstall`                    | `package.json`           |
| Infrastructure            | Solo Vite dev server en localhost                                                                               | `nuxt.config.ts`         |
| Configuration             | `nuxt.config.ts` mínimo con `devtools.enabled: true`; sin `css` ni `vite.plugins`                               | `nuxt.config.ts`         |
| Performance / cost limits | NFR-1/2: consola limpia y fallback de fuentes; `display=swap`                                                   | `spec.md`                |
| Repo rules                | Nuxt 4: cliente en `app/`, server en `server/`; Tailwind sin `tailwind.config.ts`                               | `AGENTS.md`              |

---

## Technical summary

Se instalará Tailwind CSS v4 (plugin oficial `@tailwindcss/vite`) y un único `app/assets/css/main.css` con tokens `@theme` derivados 1:1 del HTML de referencia (`pantallas/feed.dc.html`): tipografías Fredoka/Nunito y toda la paleta cálida. La iconografía proviene de la librería Lucide (`@lucide/vue`), importada de forma tree-shakeable (sin componentes SVG propios). La home se compondrá con componentes en `app/components/` alimentados por datos mock estáticos en `app/data/PublicacionesMock.ts` y tipados en `app/types/feed.ts`; `app/app.vue` pasará a montar `NuxtPage` y la ruta `/` será `app/pages/index.vue`.

---

## Relevant current state

- `[Confirmed]` `app/app.vue` solo tiene `<NuxtRouteAnnouncer />` + `<NuxtWelcome />` (`app/app.vue`).
- `[Confirmed]` No existe `app/pages/` aún, por lo que Nuxt sirve el Welcome por defecto (`find app`).
- `[Confirmed]` No hay Tailwind instalado ni tema definido (`package.json`, `nuxt.config.ts`).
- `[Confirmed]` El diseño de referencia define paleta y tipografía en `pantallas/feed.dc.html` (house `helmet`, fuentes desde Google Fonts).
- `[Confirmed]` `screenshots/feed.png` es la captura de la pantalla target para comparación visual.

---

## Proposed architecture

```text
app/
├── app.vue                      → <NuxtRouteAnnouncer /> + <NuxtPage />
├── pages/index.vue              → layout del feed (sidebar + main)
├── components/
│   ├── app/AppSidebar.vue       → logo, CTA "Nueva publicación", nav y perfil
│   ├── app/NavItems.vue         → links Feed/Niños/Avisos/Mi cuenta (solo visual)
│   ├── app/SidebarProfile.vue   → avatar, nombre, rol, botón cerrar sesión
│   ├── feed/FeedHeader.vue      → eyebrow/kicker + saludo + subtítulo
│   ├── feed/CreatePostPrompt.vue→ pill simulado "Compartí un momento…"
│   ├── feed/PostsDivider.vue    → "PUBLICADO HOY" + línea
│   ├── feed/PostCard.vue        → card de publicación
│   ├── feed/PostBadge.vue       → pill tipo (LOGRO/ACTIVIDAD/ANUNCIO)
│   ├── feed/PhotoPlaceholder.vue→ bloque de foto punteado 200px
│   ├── feed/PostFooter.vue      → likes, comentarios, editar
│   └── ui/BaseAvatar.vue        → avatar circular con iniciales
│                                  (los iconos vienen de `@lucide/vue`, sin componentes propios)
├── data/PublicacionesMock.ts    → mock estático (sin DB ni seed)
├── types/feed.ts                → FeedPost, FeedUser, FeedPostType
└── assets/css/main.css          → @import "tailwindcss" + @theme (fonts/colors/breakpoints)
```

Flujo: `app.vue` monta `NuxtPage` → `pages/index.vue` compone la escena → `FeedSidebar` recibirá datos estáticos (`PublicacionesMock.ts`) vía props de` FeedPost` y delega visual en subcomponentes.

---

## Involved components

| Component                            | Role in this change                            | New / Modified / Reused |
| ------------------------------------ | ---------------------------------------------- | ----------------------- |
| `app.vue`                            | Monta `NuxtPage` global                        | Modified                |
| `app/pages/index.vue`                | Home `/` con sidebar + feed                    | New                     |
| `app/components/app/*.vue`           | Bloques fijos de navegación lateral            | New                     |
| `app/components/feed/*.vue`          | Piezas del feed (cards, badges, foto, footer)  | New                     |
| `app/components/ui/*`             | Avatar reutilizable                            | New                     |
| `@lucide/vue`                     | Librería de iconos (imports tree-shakeable)    | New (dependencia)       |
| `app/data/PublicacionesMock.ts`      | Fuente única de contenido mock                 | New                     |
| `app/types/feed.ts`                  | Tipos compartidos del feed                     | New                     |
| `app/assets/css/main.css`            | Import de Tailwind v4 + tokens `@theme`        | New                     |
| `nuxt.config.ts`                     | `css: ['~/assets/css/main.css']` + plugin Vite | Modified                |
| `package.json`                       | agrega `tailwindcss`, `@tailwindcss/vite` y `@lucide/vue` | Modified      |

---

## Potentially affected files and modules

| Path                            | Change                       | Evidence tag  |
| ------------------------------- | ---------------------------- | ------------- |
| `package.json`                  | agrega tailwind deps + `@lucide/vue` | `[Confirmed]` |
| `nuxt.config.ts`                | css + vite plugins           | `[Confirmed]` |
| `app/app.vue`                   | `NuxtPage` reemplaza Welcome | `[Confirmed]` |
| `app/pages/index.vue`           | nueva                        | `[Confirmed]` |
| `app/assets/css/main.css`       | nueva                        | `[Confirmed]` |
| `app/types/feed.ts`             | nueva                        | `[Confirmed]` |
| `app/data/PublicacionesMock.ts` | nueva                        | `[Confirmed]` |
| `app/components/**`             | nuevas                       | `[Confirmed]` |
| `.gitignore`                    | agrega `.playwright-mcp/`    | `[Confirmed]` |

---

## Contracts and interfaces

| Contract         | Type        | Input                | Output                                    | Errors |
| ---------------- | ----------- | -------------------- | ----------------------------------------- | ------ |
| `useFeedData()`  | module      | none                 | `{ currentTeacher, feedMeta, feedPosts }` | none   |
| `<FeedSidebar>`  | prop-driven | none                 | renders sidebar estático                  | none   |
| `<FeedPostCard>` | prop-driven | `post: FeedPost`     | renders una card                          | none   |
| `<PostBadge>`    | prop-driven | `type: FeedPostType` | pill según tipo                           | none   |
| `<BaseAvatar>`   | prop-driven | `initials, size?`    | avatar circular                           | none   |
| `<LucideIcon>`   | library     | `size`, `strokeWidth` | ícono SVG de `@lucide/vue`, coloreable     | none   |

No hay breaking changes: es el primer comercio real de `app/pages/`, `app/components/`, `app/data/`, `app/types/`.

---

## Data model changes

| Entity / field      | Change | Compatibility       |
| ------------------- | ------ | ------------------- |
| `FeedPost`          | add    | new file            |
| `FeedUser`          | add    | new file            |
| `FeedMeta`          | add    | new file            |
| `PublicacionesMock` | add    | new file (estático) |
| NFR tokens CSS      | add    | nuevo `main.css`    |

---

## Migration strategy

_(not applicable: no hay DB ni datos previos; el starter no tiene migraciones ni versionado de esquema)_

---

## Validation and security

- Sin inputs funcionales ni endpoints: la superficie de inyección/XSS/CSRF es nula en este alcance.
- Único recurso remoto es Google Fonts (solo CSS/link); sin secretos ni cookies.
- Se replican los colores y controles del diseño; sin HTML dinámico del usuario (mock estático), por lo que no hay XSS Sinks en esta iteración.
- `nohtml` process: contenidos mock son literales del diseño (spec AC-5), no entradas del usuario.

---

## Rollback and compatibility

- La feature vive en una rama nueva `spec-001-feed-home`; revertir = `git revert` o abandonar la rama; el starter anterior (`<NuxtWelcome />`) queda intacto en `main`.
- `@tailwindcss/vite` es plugin de build: al des-instalar no hay data residual.
- `@lucide/vue` es una dependencia de runtime sin estado: al des-instalarla solo desaparecen los iconos (sin datos residuales).
- No hay campos persistidos.

---

## Observability

- No hay backend ni APIs patrocinadas; observabilidad se limita a consola del navegador (NFR-1: sin errores ni warnings).
- Durante `/spec-impl` se usará el log de Vite/Nuxt (`npx npx nuxt dev` de terminal) para confirmar build limpio tras incorporar el plugin de Tailwind.
- En `spec-verifier` se captura la consola vía Playwright MCP y screenshots en 1440×900 y 390×844.

---

## Technical risks

| ID     | Risk                                                                                                   | Impact | Probability | Mitigation                                                                                                                                                                           |
| ------ | ------------------------------------------------------------------------------------------------------ | ------ | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| TR-001 | Deriva visual al migrar estilos inline → Tailwind                                                      | M      | M           | Dependencia de tokens `@theme` 1:1 del HTML; comparación por captura en `/spec-impl` y `spec-verifier`.                                                                              |
| TR-002 | El plugin `@tailwindcss/vite` + `nuxt.config.vite.plugins` podría chocar con el pipeline de Nuxt 4.6.2 | M      | L           | `[To-verify]` en la primera tarea: smoke de `npm run dev` tras el paso 1; si falla, se probará registrar el plugin vía `vite.plugins` de `nuxt.config` y/o `modules` del ecosistema. |
| TR-003 | Textos/colores desalineados respecto al HTML de la referencia                                          | M      | L           | Fuente única: `pantallas/feed.dc.html`; mock y tokens derivados desde ahí.                                                                                                           |
| TR-004 | Breakpoint móvil no pareja el comportamiento esperado                                                  | L      | L           | `sm` default de Tailwind (640px) coincide con la spec; ver en 390×844.                                                                                                               |
| TR-005 | Los íconos Lucide no coinciden exactamente con los paths de la referencia (p. ej. `House` vs casa del diseño) | L | M | Ajustar `size`/`strokeWidth` por icono y validar con captura comparativa contra `pantallas/feed.dc.html` en TASK-007. |

---

## Alternatives considered

| Alternative                              | Why rejected                                                                                                |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `@nuxtjs/tailwindcss` módulo comunidad   | Duplica la integración con el plugin oficial de Vite y agrega config extra.                                 |
| Copiar CSS inline del HTML de referencia | Pierde la descomposición pedida y deja estilos monolíticos difícilmente reutilizables en pantallas futuras. |
| Tailwind v3 con `tailwind.config.ts`     | El repo/AGENTS desaconsejan `tailwind.config.ts`; la decisión es v4 y CSS-first.                            |
| Nuxt UI / shadcn-vue                     | Introduciría un design system ajeno que chocaría con la réplica visual exacta.                              |
| Componentes SVG propios para los iconos  | Duplican lo que Lucide ya resuelve, con mantenimiento propio y sin tree-shaking.                          |
| `lucide-vue-next` (paquete viejo)        | El paquete oficial actual para Vue es `@lucide/vue`; `lucide-vue-next` quedó congelado en 1.0.0.            |

---

## Trade-offs

| Decision                                 | Gained                                               | Cost / given up                                                           |
| ---------------------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------- |
| Tailwind v4 CSS-first                    | Tokens declarativos sin config extra                 | Poca flexibilidad de variantes SI migran hacia v3 en el futuro            |
| Mock TS en lugar de seed/backend         | Simple, sin DB, y listo para `useFetch` más adelante | Los datos no se pueden mutar en runtime; adaptarlos pasaría por otra spec |
| Iconos de `@lucide/vue`                  | Tree-shaking, props de tamaño/trazo, sin mantenimiento | Los paths no son idénticos a la referencia: hay que ajustar `size`/`strokeWidth` por icono |
| Verificación con Playwright MCP no en CI | Confiable y barato en dev                            | No es sustituto de tests automatizados (out de scope)                     |

---

## Implementation strategy

1. Instalar `tailwindcss` + `@tailwindcss/vite` (deps exactas quedarán en `package.json`).
2. Registrar plugin + `@import "tailwindcss"` / `@theme` en `app/assets/css/main.css` y arrancar `npm run dev` como smoke test.
3. Crear `app/types/feed.ts` y `app/data/PublicacionesMock.ts` (mock fiel a la referencia).
4. Instalar `@lucide/vue` y usar sus iconos (imports tree-shakeable) en lugar de SVG propios; crear `ui/BaseAvatar.vue`.
5. Componer sidebar (`AppSidebar`, `NavItems`, `SidebarProfile`).
6. Componer feed (`FeedHeader`, `CreatePostPrompt`, `PostsDivider`, `PostCard`, `PostBadge`, `PhotoPlaceholder`, `PostFooter`).
7. Wire `app/app.vue` → `NuxtPage` y crear `app/pages/index.vue`.
8. Verificación visual y de consola con Playwright (1440×900 y 390×844), comparando contra `pantallas/feed.dc.html` y `screenshots/feed.png`.

Cada paso es commiteable y deja la app renderizable (1–2 no rompen nada previo; 5–7 agregan piezas sin runtime dinámico).

---

## Test strategy

| Level                              | What it covers                                                          | Requirement IDs         |
| ---------------------------------- | ----------------------------------------------------------------------- | ----------------------- |
| Manual/e2e visual (Playwright MCP) | Layout desktop 1440×900 vs `pantallas/feed.dc.html`; cards/orden/badges | `R-1..R-9, AC-1..AC-10` |
| Manual/e2e en móvil (390×844)      | Sidebar oculto, feed fluido, sin scroll horizontal                      | `AC-11`                 |
| Console check                      | Sin errores/warnings al cargar `/` con `npm run dev`                    | `NFR-1, AC-8`           |
| Fonts fallback                     | Render sin fallo ante fonts bloqueadas                                  | `NFR-2, AC-9`           |

---

## Technical closure criteria

- [ ] `/` renderiza el feed completo sin errores de consola (`npm run dev`).
- [ ] Captura 1440×900 visualmente equivalente al diseño de referencia.
- [ ] Captura 390×844 muestra sidebar oculto y feed fluido (sin scroll horizontal).
- [ ] `@theme` menciona los tokens couleurs/typography 1:1 con `pantallas/feed.dc.html`.
- [ ] No hay estilos inline ad-hoc fuera de tokens/Tailwind (solo el placeholder de foto si el diseño lo requiere).
- [ ] Migration: not applicable-verified / Rollback-documentado / sin findings de seguridad en el alcance.
