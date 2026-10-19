# Retrospective — SPEC 002 Gestión de niños (listado y perfil)

> **Spec:** `specs/002-kids-management/spec.md` (Approved)  
> **Plan:** `specs/002-kids-management/plan.md` (Approved)  
> **Tasks:** `specs/002-kids-management/tasks.md` (9/9 DONE)  
> **Veredicto de cierre:** ✅ TODOS LOS CRITERIOS PASAN (AC-1..AC-18)  
> **Fecha:** Mon Oct 19 2026  
> **Entorno:** Nuxt 4 + Vue 3 + Tailwind v4, dev server `localhost:3000` (reutilizado, no se levantó segundo proceso).

---

## 1. Alcance entregado

Se implementaron y verificaron las pantallas de gestión de niños del staff:

- Ruta `/kids` (listado de 8 niños con buscador por nombre y alertas, estado vacío, grilla 2 columnas desktop / 1 columna móvil).
- Ruta `/kids/[slug]` (perfil dinámico para los 8 niños: identidad, alertas condicionales, ficha de datos, padres vinculados).
- 4 rutas placeholder "Próximamente": `/kids/add`, `/kids/[slug]/edit`, `/kids/[slug]/daily-summary`, `/kids/[slug]/parents/add`.
- Sidebar compartido con `<NuxtLink>` y estado activo por ruta ("Niños" activo también en subrutas de `/kids`; "Feed" activo en `/`).
- Mock estático en `app/data/KidsMock.ts` y tipos en `app/types/child.ts`.
- Tokens de diseño de niños en `app/assets/css/main.css` y extensión de `BaseAvatar` (48px/84px, tonos pink/mint/yellow/violet).

**No entregado (out of scope):** backend, auth, persistencia, formularios reales, pantallas de Avisos/Mi cuenta, modo oscuro, tablet, persistencia de búsqueda en URL.

---

## 2. Evidencia por Acceptance Criterion

| AC | Req | Veredicto | Evidencia observada |
|---|-----|-----------|---------------------|
| AC-1 | R-1 | ✅ PASS | `/kids` renderiza "GESTIÓN" / "Niños", "Agregar niño", buscador placeholder "Buscar niño…", "SALA SOLES · 8 niños" y 8 cards (código `app/pages/kids/index.vue` + render 1440×900). |
| AC-2 | R-2 | ✅ PASS | Avatares 48px (`size="xl"` → `size-12` 48px), iniciales, nombre, "edad · N padres vinculados", indicadores MANÍ/LACTOSA/VINCULAR/chevron con colores de referencia. |
| AC-3 | R-3 | ✅ PASS | Clic en card de Mateo → `http://localhost:3000/kids/mateo-fernandez` (Playwright click + URL verificada). |
| AC-4 | R-4 | ✅ PASS | "maní" → solo Mateo; "lactosa" → solo Tomás; nombre reduce grilla; vacío → 9 links (8 niños + Agregar niño). |
| AC-5 | R-5 | ✅ PASS | "zzz" → estado vacío "No encontramos niños con ese nombre." + "Limpiar búsqueda"; limpiar → vuelven los 8. |
| AC-6 | R-6 | ✅ PASS | `/kids/mateo-fernandez`: "Volver a Niños", avatar 84px (`size="2xl"`), "Mateo Fernández", "3 años · Sala Soles", "Editar", panel alergias, tabla fecha/sala/ingreso, columna "Resumen del día" + "PADRES VINCULADOS". |
| AC-7 | R-7 | ✅ PASS | "12 mar 2022", "Soles", "feb 2025", texto de alergias de la referencia. |
| AC-8 | R-8 | ✅ PASS | Sofía (sin alertas): no renderiza bloque "Alergias y notas"; layout se mantiene. |
| AC-9 | R-9 | ✅ PASS | Lucía Fernández (ACTIVA) + Diego Fernández (PENDIENTE) con avatar, rol, estado y acción "Vincular otro padre". |
| AC-10 | R-10 | ✅ PASS | 4 placeholders responden 200 con "PRÓXIMAMENTE" y título propio; sin errores de consola. |
| AC-11 | R-11 | ✅ PASS | `/` → "Feed" activo; `/kids` y `/kids/mateo-fernandez` → "Niños" activo (subruta). `href` Feed=`/`, Niños=`/kids`. |
| AC-12 | R-12 | ✅ PASS | "Volver a Niños" → `/kids`. |
| AC-13 | R-13 | ✅ PASS | 8 perfiles renderizan sus propios datos (Mateo, Sofía, Benjamín, Valentina, Tomás, Emma, Lucas, Olivia) verificados por URL. |
| AC-14 | NFR-1 | ✅ PASS | Consola: 0 errores y 0 warnings de la app en `/`, `/kids`, `/kids/[slug]`, placeholders. Solo 2 `ERR_FAILED` de Google Fonts (entorno, no de la app). |
| AC-15 | NFR-2 | ✅ PASS | 390×844: sidebar `hidden sm:flex` (oculto), listado 1 columna, perfil apilado, `scrollWidth===clientWidth===380` (sin scroll horizontal). |
| AC-16 | NFR-3 | ✅ PASS | Con fuentes bloqueadas, `/kids` y `/kids/[slug]` mantienen estructura sin desbordes (solo error de red de fuentes). |
| AC-17 | BR-1 | ✅ PASS | Red: solo 2 peticiones internas `_nuxt/.../dev.json`; sin endpoints, tablas ni llamadas de red a la app; mock estático. |
| AC-18 | — | ✅ PASS | Desktop 1440×900 visualmente equivalente a `screenshots/ninos.png` y `pantallas/perfil-nino.dc.html`: colores `#F6ECDF`/`#FFFDF9`/`#ECE0D0`, Fredoka/Nunito, spacing. Captura comparada por visión. |

**Total: 18/18 PASS. 0 FAIL. 0 BLOCKED.**

---

## 3. Desviaciones registradas (verificadas, no repetidas sin comprobar)

| ID | Desviación | Alcance | Estado en verificación |
|---|------------|---------|------------------------|
| (a) | Iconos de `@lucide/vue` en vez de SVG inline de la referencia | Todos los iconos (Search, Plus, ChevronRight, ChevronLeft, TriangleAlert, Sun, Users, House, Bell, UserRound, Clock) | **Comprobada**: visualmente equivalentes (mismo trazo Lucide); no afecta AC. |
| (b) | Gradientes `bg-linear-* from/to` en vez de variables CSS | Botón "Agregar niño", CTA sidebar, badges | **Comprobada**: render idéntico a la referencia; no afecta AC. |
| (c) | Referencia no define móvil: sidebar oculto <640px, listado 1 columna, perfil apilado | `app/pages/kids/index.vue`, `app/pages/kids/[slug]/index.vue` | **Comprobada**: AC-15 pasa en 390×844. |
| (d) | 7 perfiles sin diseño usan mock ficticio coherente; solo Mateo diseñado | `app/data/KidsMock.ts` | **Comprobada**: AC-13 pasa; decisión registrada en spec como decisión del spec. |

Ninguna desvíanción afecta el veredicto.

---

## 4. Deuda técnica

1. **Datos ficticios no señalados visualmente**: los 7 perfiles no diseñados usan mock inventado sin un distintivo claro de "dato de diseño". Riesgo bajo (datos ficticios, sin backend), pero conviene documentar el origen mock (ya está en comentario de `KidsMock.ts`).
2. **Slug inexistente sin 404 real**: `/kids/no-existe` renderiza un estado "No encontramos ese niño" contenido, sin lanzar excepción. Es el comportamiento deseado por la spec, pero no es un HTTP 404.
3. **Sin typecheck configurado**: el proyecto usa TS en `nuxt.config.ts` y `.vue` con `lang="ts"` pero no tiene `typescript`/`vue-tsc` instalado. La verificación de tipos no se ejecutó.
4. **Sin runner de tests**: toda la verificación es visual/manual con Playwright; no hay tests automatizados repetibles.

---

## 5. Riesgos residuales

| Riesgo | Impacto | Mitigación / nota |
|--------|---------|-------------------|
| Deriva visual futura vs referencias | Medio | Capturas curadas en `screenshots/`; comparación por visión en este veredicto. |
| Datos ficticios leídos como reales | Bajo | Mock estático sin backend; se revisará al conectar datos reales (spec futura de auth/datos). |
| Búsqueda por alertas expone etiquetas de salud | Bajo (mock) | Acotado a BR-2; requiere spec de autorización en integración real. |
| Rutas placeholder confundidas como funcionales | Bajo | Copia explícita "PRÓXIMAMENTE" sin formularios habilitados. |
| Colisión `/kids/add` vs `/kids/:slug` | Bajo (verificado) | Vue Router resuelve correctamente; `/kids/add` no cae en `[slug]`. |

---

## 6. Tests realizados

- Navegación e interacción en navegador real (Playwright, Chromium) a 1440×900 y 390×844.
- Búsqueda por nombre y por alertas; estado vacío y acción limpiar.
- Clic en las 8 cards → perfiles; "Volver a Niños" → `/kids`; 4 placeholders.
- Estado activo del sidebar en `/`, `/kids`, `/kids/mateo-fernandez`.
- Consola: 0 errores/warnings de la app en todas las rutas nuevas.
- Red: solo peticiones internas de Nuxt; sin API/BD.
- Fuentes bloqueadas: estructura intacta, sin overflow.
- Slug inexistente: estado seguro sin excepción.
- Capturas de escritorio comparadas por visión contra `screenshots/ninos.png` y `pantallas/perfil-nino.dc.html`.

---

## 7. Aprendizajes

- Las rutas anidadas (`kids.vue` y `kids/[slug].vue` como layouts con `<NuxtPage/>`) son la forma correcta de mantener el sidebar activo en subrutas y evitar duplicación.
- El estado activo de Vue Router por *route record* (`match: 'prefix'` para Niños) resuelve AC-11 sin lógica adicional.
- El filtro de búsqueda con normalización de acentos (`normalize('NFD')`) es esencial para coincidir con "maní" vs "mani".

---

## 8. Veredicto de cierre

**✅ CERRADO — TODOS LOS CRITERIOS DE ACEPTACIÓN PASAN (18/18).**

La implementación de SPEC 002 cumple con el alcance aprobado: listado filtrable en `/kids`, perfil dinámico en `/kids/[slug]`, 4 placeholders "Próximamente", navegación interna con `<NuxtLink>`, sidebar activo en subrutas, mock estático, adaptación móvil y consola limpia. No hay criterios FAIL ni BLOCKED. No se implementó funcionalidad nueva durante la verificación; solo se corrigió el marcado de las casillas en `spec.md`.

**Artefactos generados durante la verificación:** capturas en `.playwright-mcp/` y `screenshots/` (curadas previamente), esta `retrospective.md`. Los archivos temporales `ac18-*.png` se eliminaron al finalizar.
