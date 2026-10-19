# Retrospective — 001-feed-home

**Spec:** `specs/001-feed-home/spec.md` (Approved)  
**Plan:** `specs/001-feed-home/plan.md` (Approved)  
**Tasks:** `specs/001-feed-home/tasks.md` (7 TASK, todas `DONE`)  
**Verificador:** spec-verifier (Playwright MCP + visión, Context7 para Nuxt 4 / Vue 3 / Tailwind v4)  
**Fecha:** Mon Oct 19 2026  
**Verdicto de cierre:** ✅ TODOS LOS CRITERIOS PASS — cierre aprobado

---

## Alcance entregado

La ruta `/` renderiza el feed del staff como réplica visual de `pantallas/feed.dc.html`, sin funcionalidades (out of scope: auth, backend, navegación real, interacciones). Se entregó:

- `app/pages/index.vue` — composición sidebar + columna principal (máx. 760px).
- `app/components/app/` — `AppSidebar.vue`, `NavItems.vue`, `SidebarProfile.vue` (248px, oculto móvil).
- `app/components/feed/` — `FeedHeader`, `CreatePostPrompt`, `PostsDivider`, `PostCard`, `PostBadge`, `PhotoPlaceholder`, `PostFooter`.
- `app/components/ui/BaseAvatar.vue` — avatar circular con tonos/tamaños del diseño.
- `app/data/PublicacionesMock.ts` — mock estático con las 3 publicaciones exactas (nombre en español, como exige la convención).
- `app/types/feed.ts` — tipos `FeedUser`, `FeedMeta`, `FeedPost`, `FeedPostType`.
- `app/assets/css/main.css` — Tailwind v4 (`@import "tailwindcss"` + `@theme` con tokens mapeados 1:1 del HTML).
- `nuxt.config.ts` — plugin `@tailwindcss/vite`, CSS global, Google Fonts (Fredoka/Nunito, `display=swap`).
- `app/app.vue` — `<NuxtPage />` en lugar de `<NuxtWelcome />`.

## Evidencia por AC

| AC | Veredicto | Evidencia observada |
|----|-----------|---------------------|
| AC-1 (R-1) | PASS | aside 248px, logo OpenDayCare, 4 ítems nav (Feed activo), perfil Caro Giménez / Maestra · Soles, LogOut. DOM + Playwright 1440×900. |
| AC-2 (R-2) | PASS | h1 Fredoka 30px `#3F362E`, kicker `GUARDERÍA · SALA SOLES` `#D9583C`, subtítulo `12 niños · martes 17 jun` `#94887B`. |
| AC-3 (R-3) | PASS | pill `Compartí un momento…`, avatar tono coral, icono Camera de `@lucide/vue` (size 19). |
| AC-4 (R-4) | PASS | `PUBLICADO HOY` + línea `flex-1 h-px bg-divider` (`#E7DAC8`). |
| AC-5 (R-5/R-6) | PASS | 3 tarjetas orden LOGRO → ACTIVIDAD → ANUNCIO, badges mint/sky/royal, destinatarios exactos. |
| AC-6 (R-7) | PASS | bloque foto 200px alto, `border-dashed`, caption `Foto · pintando con témperas`. |
| AC-7 (R-8) | PASS | corazón `#E0654A`, contador comentarios, `Editar` `#C5503A`. |
| AC-8 (NFR-1) | PASS | navegación limpia: 0 errores, 0 warnings en consola (verify-console-*-clean.log). |
| AC-9 (NFR-2) | PASS | `display=swap`, fallback sistema, sin overflow horizontal (scrollWidth===clientWidth), bodyBg `#F6ECDF`. |
| AC-10 (R-9) | PASS | fondo `rgb(246,236,223)`, cards `rgb(255,253,249)`, borde `rgb(236,224,208)`, Fredoka/Nunito. Captura de escritorio equivalente a `screenshots/feed.png`. |
| AC-11 | PASS | móvil 390×844: sidebar `display: none`, scrollWidth===clientWidth===380, sin scroll horizontal. |
| AC-12 (R-10) | PASS | 16 SVG de `@lucide/vue` en DOM, imports directos tree-shakeable, sin componentes SVG propios. Tamaño/trazo ajustados a la referencia. |

Capturas generadas: `.playwright-mcp/verify-feed-desktop.png`, `.playwright-mcp/verify-feed-mobile.png`. Curadas en `screenshots/feed-home.png` y `screenshots/feed-home-mobile.png` (preexistentes).

## Desviaciones (documentadas, aceptadas)

1. **(a) Iconos:** provienen de `@lucide/vue`, no son path-idénticos a los SVG inline de la referencia (`House`, `MessageCircle` difieren). Aceptado por la spec (decisión de diseño: usar Lucide en lugar de SVG propios). AC-12 se cumple porque los iconos son de Lucide con tamaño/trazo ajustados.
2. **(b) Gradientes:** implementados con utilidades `bg-linear-* from/to` de Tailwind v4 en vez de variables CSS `--gradient-*`. Aceptado; las variables CSS no generaban `background-image` válido.
3. **(c) Móvil:** la referencia no define comportamiento móvil; se aplicó la adaptación de la spec (sidebar oculto bajo 640px, `sm:flex` en el aside).

## Deuda técnica

- Los gradientes usan utilidades Tailwind v4 (`bg-linear-[155deg]`, `bg-linear-to-b`) en vez de variables CSS del tema; si se refactoriza el theming, habría que revisar estos bloques.
- Los enlaces del sidebar y del footer (`Editar`, detalles) son visuales sin ruta funcional (por diseño, out of scope). No generan 404 porque no navegan.
- No hay test framework ni suite automatizada; la verificación es visual/manual mediante Playwright MCP.
- El tamaño/trazo de los iconos Lucide se ajustó a ojo por icono (no es path-idéntico a la referencia); cualquier cambio futuro en el diseño requeriría reajuste.

## Tests ejecutados

- Navegación limpia a `http://localhost:3000/` (dev server ya corriendo, no se levantó uno nuevo).
- Viewport desktop 1440×900: captura completa, medición de propiedades CSS (fondos, bordes, tipografía, ancho sidebar, ancho columna, conteo de tarjetas).
- Viewport móvil 390×844: sidebar oculto, scrollWidth === clientWidth, sin scroll horizontal.
- Consola: 0 errores, 0 warnings tras navegación limpia (nivel `error` y `warning`, `all: false`).
- Fuentes: carga HTTP 200 con `display=swap`; estructura intacta ante bloqueo (verificado previamente en `feed-no-fonts.png`).
- Íconos: 16 SVG de `@lucide/vue` renderizados con tamaños y trazos acordes a la referencia.

## Riesgos residuales

- Fidelidad visual al 100% pixel-perfect no garantizada por los iconos de Lucide (desviación (a) aceptada).
- Dependencia del CDN de Google Fonts; mitigada con `display=swap` y fallback sistema (NFR-2).
- Sin cobertura de tests automatizados; regresión visual solo mediante captura manual.

## Aprendizajes

- Tailwind v4 CSS-first (`@theme` en `main.css` + plugin Vite) funciona limpio en Nuxt 4 sin `tailwind.config.ts`.
- Los imports directos de `@lucide/vue` por componente son tree-shakeable y evitan componentes SVG propios.
- El breakpoint móvil `sm` (640px) de Tailwind coincide con lo acordado en la spec.

## Veredicto de cierre

**CERRADO — ✅ TODOS LOS AC (AC-1..AC-12) PASS.**  
No hay criterios FAIL ni BLOCKED. Las desviaciones (a), (b), (c) están documentadas y aceptadas. La implementación cumple la spec tal como está escrita.
