# PLAN 002 — Gestión de niños (listado y perfil)

> **Spec:** `specs/002-kids-management/spec.md`
> **Status:** Approved
> **Date:** 2026-10-19

---

## Repository check

| Area                      | Finding                                                                                                                          | Evidence (path/command)                     |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| Architecture              | Nuxt 4 con `app/` como raíz; las rutas viven en `app/pages/`, los componentes en `app/components/`                               | `AGENTS.md`, `app/app.vue`                  |
| Stack / versions          | `nuxt ^4.6.2`, `vue ^3.5.44`, `vue-router ^5.4.0`, `@lucide/vue ^1.59.0`, `tailwindcss ^4.3.3`                                   | `package.json`                              |
| Conventions               | Código/identificadores en inglés, comentarios de código en español, copy de UI en español, mock con nombre de archivo en español | `AGENTS.md`, `spec.md` (R-13)               |
| Module structure          | Hoy existe `app/pages/index.vue` (feed), `app/components/{app,feed,ui}`, `app/data/PublicacionesMock.ts`, `app/types/feed.ts`    | `find app`                                  |
| Reusable components       | `AppSidebar`, `NavItems`, `SidebarProfile`, `BaseAvatar` (38/40/44px; tonos coral/sky/royal), componentes del feed               | `app/components/**`                         |
| Persistence / migrations  | Ninguna; no hay `server/` ni base de datos                                                                                       | `find server`                               |
| Auth / authorization      | No aplica en esta spec: rutas públicas de solo lectura sobre datos mock                                                          | `spec.md` (Security)                        |
| Security posture          | Sin secretos ni endpoints; única dependencia externa: CDN de Google Fonts                                                        | `nuxt.config.ts`, `app/assets/css/main.css` |
| Testing setup             | Sin linter, typecheck ni runner de tests; la verificación es visual con Playwright MCP                                           | `AGENTS.md`                                 |
| Dependencies              | Bun lockfile; scripts `dev/build/generate/preview/postinstall`                                                                   | `package.json`, `bun.lock`                  |
| Infrastructure            | Solo dev server local en `localhost:3000`                                                                                        | `ps aux`, `curl localhost:3000`             |
| Configuration             | Tailwind v4 vía `@tailwindcss/vite` + `css: ['~/assets/css/main.css']`; tokens `@theme` con la paleta cálida                     | `nuxt.config.ts`, `app/assets/css/main.css` |
| Performance / cost limits | NFR-1/2/3: consola limpia, responsive sin scroll horizontal, fallback de fuentes                                                 | `spec.md`                                   |
| Repo rules                | Nuxt 4 (cliente en `app/`, server en `server/`), Tailwind sin `tailwind.config.ts`, rutas por convención de la spec              | `AGENTS.md`                                 |

---

## Technical summary

La spec se implementa con el mismo lenguaje visual ya consolidado en SPEC 001: Tailwind v4 con tokens `@theme`, `BaseAvatar` extendido con los tonos y tamaños de la referencia, iconos de `@lucide/vue` y datos mock estáticos. La navegación interna pasa a `<NuxtLink>` con estado activo por *route record* de Vue Router, y las rutas de niños se organizan de forma **anidada** (`app/pages/kids.vue` como layout con el sidebar y `app/pages/kids/[slug].vue` como layout del perfil) para que `/kids` siga activo en todas sus subrutas y el sidebar no se duplique en las seis páginas.

---

## Relevant current state

- `[Confirmed]` `app/pages/index.vue` renderiza el feed con `AppSidebar` y componentes de `app/components/feed/` (`app/pages/index.vue`).
- `[Confirmed]` `app/components/app/NavItems.vue` define los 4 ítems con un booleano `active` hardcodeado y los renderiza como `<a>` sin `href` (inerte) (`app/components/app/NavItems.vue`).
- `[Confirmed]` `app/components/app/AppSidebar.vue` usa `<a>` sin `href` para el logo y el CTA “Nueva publicación”, y repite el layout del sidebar de las referencias (`app/components/app/AppSidebar.vue`).
- `[Confirmed]` `app/data/PublicacionesMock.ts` expone `currentTeacher` y `feedMeta.room`; es la fuente de datos de la docente y la sala (`app/data/PublicacionesMock.ts`).
- `[Confirmed]` `app/components/ui/BaseAvatar.vue` soporta tamaños 38/40/44px y tonos coral/sky/royal; las referencias de niños necesitan 48px y 84px y tonos pink/mint/yellow/violet (`app/components/ui/BaseAvatar.vue`).
- `[Confirmed]` `app/assets/css/main.css` tiene la paleta cálida de SPEC 001 pero no incluye los colores de la referencia de niños: `#F4B8CC`/`#C44A7A`, `#B9DEC4`/`#3E8B62`, `#F4DC8E`/`#9A7B1E`, `#C9B6E8`/`#7B5FC0`, `#FBD8CC`/`#D9684A`, `#F9D2DE`/`#C56486`, `#FBDAD6`/`#F4A8A0`/`#C5413A`/`#B25249`, `#CBB89F`, `#F2A78E` (`pantallas/ninos.dc.html`, `pantallas/perfil-nino.dc.html`).
- `[Assumption]` El dev server sigue en `localhost:3000` y responde el feed; se reutiliza en vez de levantar otro (verificado durante la implementación de SPEC 001).
- `[Assumption]` Los nombres, edades y etiquetas del listado se copian literales de `pantallas/ninos.dc.html`; los 8 perfiles comparten layout y solo difieren en datos.

---

## Proposed architecture

```text
app/
├── pages/
│   ├── index.vue                        # existente (feed) — solo se ajusta el sidebar compartido
│   ├── kids.vue                         # layout de /kids: AppSidebar + <NuxtPage/>
│   └── kids/
│       ├── index.vue                    # /kids                → listado + buscador
│       ├── add.vue                      # /kids/add            → placeholder
│       ├── [slug].vue                   # layout de /kids/:slug → <NuxtPage/>
│       └── [slug]/
│           ├── index.vue                # /kids/:slug          → perfil del niño
│           ├── edit.vue                 # /kids/:slug/edit
│           ├── daily-summary.vue        # /kids/:slug/daily-summary
│           └── parents/add.vue          # /kids/:slug/parents/add
├── components/
│   ├── app/AppSidebar.vue               # logo y CTA con NuxtLink
│   ├── app/NavItems.vue                 # NuxtLink + estado activo por ruta
│   ├── kids/KidsHeader.vue              # "GESTIÓN" + "Niños" + botón "Agregar niño"
│   ├── kids/KidsSearchInput.vue         # input de búsqueda con icono
│   ├── kids/KidsSectionHeader.vue       # "SALA SOLES · 8 niños" + línea
│   ├── kids/ChildCard.vue               # card del niño (enlace al perfil)
│   ├── kids/KidsEmptyState.vue          # estado sin resultados
│   ├── kids/ChildProfileHeader.vue      # avatar 84px + nombre + "Editar"
│   ├── kids/ChildAlertPanel.vue         # bloque de alergias (opcional)
│   ├── kids/ChildDetailsCard.vue        # fecha de nacimiento / sala / ingreso
│   ├── kids/LinkedParentsCard.vue       # "PADRES VINCULADOS"
│   ├── kids/ComingSoonPage.vue          # placeholder reutilizable
│   └── ui/BaseAvatar.vue                # extiende tamaños (48/84) y tonos
├── data/KidsMock.ts                     # mock estático de los 8 niños
└── types/child.ts                       # Child, ChildAlert, ChildParent
```

Flujo: `AppSidebar` (compartido) navega por `NuxtLink`; `/kids` filtra `KidsMock.ts` en cliente y cada `ChildCard` enlaza a `/kids/[slug]`; la página de perfil resuelve el slug con `useRoute()` y busca el niño en el mismo mock; las cuatro acciones auxiliares caen en un `ComingSoonPage` compartido.

---

## Involved components

| Component                           | Role in this change                                  | New / Modified / Reused |
| ----------------------------------- | ---------------------------------------------------- | ----------------------- |
| `app/components/app/NavItems.vue`   | Ítems con `<NuxtLink>` y estado activo por ruta      | Modified                |
| `app/components/app/AppSidebar.vue` | Logo y CTA como enlaces internos                     | Modified                |
| `app/components/ui/BaseAvatar.vue`  | Tamaños 48/84px y tonos pink/mint/yellow/violet      | Modified                |
| `app/assets/css/main.css`           | Tokens de color de la referencia de niños            | Modified                |
| `app/components/kids/**`            | Piezas del listado y del perfil                      | New                     |
| `app/pages/kids/**`                 | Rutas `/kids`, `/kids/[slug]` y placeholders         | New                     |
| `app/data/KidsMock.ts`              | Fuente única de datos de niños, familiares y alertas | New                     |
| `app/types/child.ts`                | Tipos del dominio de niños                           | New                     |
| `app/pages/index.vue`               | Sin cambios salvo el sidebar compartido              | Reused                  |

---

## Potentially affected files and modules

| Path                                      | Change                                    | Evidence tag  |
| ----------------------------------------- | ----------------------------------------- | ------------- |
| `app/pages/kids/index.vue`                | nueva: listado con buscador               | `[Confirmed]` |
| `app/pages/kids/[slug].vue`               | nueva: perfil por niño                    | `[Confirmed]` |
| `app/pages/kids/add.vue`                  | nueva: placeholder                        | `[Confirmed]` |
| `app/pages/kids/[slug]/edit.vue`          | nueva: placeholder                        | `[Confirmed]` |
| `app/pages/kids/[slug]/daily-summary.vue` | nueva: placeholder                        | `[Confirmed]` |
| `app/pages/kids/[slug]/parents/add.vue`   | nueva: placeholder                        | `[Confirmed]` |
| `app/components/kids/**`                  | nuevas                                    | `[Confirmed]` |
| `app/components/app/NavItems.vue`         | `NuxtLink` + estado activo por ruta       | `[Confirmed]` |
| `app/components/app/AppSidebar.vue`       | logo/CTA como `NuxtLink`                  | `[Confirmed]` |
| `app/components/ui/BaseAvatar.vue`        | tamaños 48/84px y tonos adicionales       | `[Confirmed]` |
| `app/assets/css/main.css`                 | tokens de color de la referencia de niños | `[Confirmed]` |
| `app/data/KidsMock.ts`                    | nueva: mock estático                      | `[Confirmed]` |
| `app/types/child.ts`                      | nueva: tipos                              | `[Confirmed]` |

---

## Contracts and interfaces

| Contract            | Type        | Input                                   | Output                                 | Errors                                       |
| ------------------- | ----------- | --------------------------------------- | -------------------------------------- | -------------------------------------------- |
| `<KidsSearchInput>` | prop-driven | `modelValue: string`, `placeholder`     | emite `update:modelValue` con el texto | ninguno                                      |
| `<ChildCard>`       | prop-driven | `child: Child`                          | card con `<NuxtLink>` a `/kids/[slug]` | ninguno                                      |
| `<ChildProfile*>`   | prop-driven | `child: Child`                          | bloques del perfil                     | ninguno                                      |
| `<KidsEmptyState>`  | prop-driven | `query: string`                         | mensaje en español y acción "Limpiar"  | ninguno                                      |
| `<ComingSoonPage>`  | prop-driven | `title: string`, `description?: string` | pantalla "Próximamente"                | ninguno                                      |
| `NavItems`          | prop-driven | items con `to` opcional                 | enlaces `<NuxtLink>` con estado activo | ninguno                                      |
| `getChildBySlug()`  | helper      | `slug: string`                          | `Child \| undefined`                   | slug desconocido → estado vacío en la página |

No hay APIs ni eventos globales. Sin cambios incompatibles: se agregan rutas y el sidebar pasa de enlaces inertes a navegables.

---

## Data model changes

| Entity / field     | Change | Compatibility                                                               |
| ------------------ | ------ | --------------------------------------------------------------------------- |
| `Child`            | add    | nuevo (`app/types/child.ts`)                                                |
| `ChildAlert`       | add    | nuevo (`app/types/child.ts`)                                                |
| `ChildParent`      | add    | nuevo (`app/types/child.ts`)                                                |
| `kids` (mock)      | add    | nuevo (`app/data/KidsMock.ts`)                                              |
| Tokens de color    | add    | solo adiciones en `@theme`, sin renombrar tokens existentes                 |
| `BaseAvatar` props | extend | `size` y `tone` aceptan más valores; los valores previos siguen funcionando |

---

## Migration strategy

_(not applicable: no hay base de datos, API ni datos persistidos; el mock es estático como en SPEC 001)_

---

## Validation and security

- Sin inputs funcionales ni endpoints: el buscador es el único input y opera sobre el mock en memoria, sin requests ni inyección en HTML.
- Recursos externos: solo el CDN de Google Fonts (link CSS), sin secretos ni cookies.
- Los datos de menores, familiares y alergias son ficticios y de diseño (BR-1); el riesgo de exponer PII real queda explícitamente diferido y deberá ser tackled por una spec de datos/autorización.
- La búsqueda por alertas (BR-2) solo expondrá el conjunto mock de la propia pantalla de gestión.

---

## Rollback and compatibility

- La feature vive en una rama nueva `spec-002-kids-management`; revertir = descartar la rama o revertir el commit; el estado anterior (`main` con SPEC 001) queda intacto.
- El refactor del sidebar es el único punto de riesgo de regresión visual sobre `/`; se verifica con captura antes de avanzar.
- No hay datos creados ni transformados: el rollback no deja residuos.

---

## Observability

- Sin backend ni APIs: la observabilidad se limita a la consola del navegador (NFR-1) y a las capturas de Playwright.
- Durante `/spec-impl` se usa el log del dev server de Nuxt para confirmar que las rutas nuevas compilan sin errores.
- En `spec-verifier` se capturan consola, métricas de DOM y screenshots a 1440×900 y 390×844.

---

## Technical risks

| ID     | Risk                                                                              | Impact (H/M/L) | Probability (H/M/L) | Mitigation                                                                                                          |
| ------ | --------------------------------------------------------------------------------- | -------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------- |
| TR-001 | El refactor del sidebar a `<NuxtLink>` altera el layout o el estado activo de `/` | M              | M                   | Verificar `/` con captura y medición de clases activas antes de seguir; el markup del sidebar no cambia.            |
| TR-002 | Colisión entre `/kids/add` y `/kids/:slug`                                        | M              | L                   | `add.vue` cuelga de `kids/` y los placeholders anidados de `kids/[slug]/`; comprobar cada URL explícitamente.       |
| TR-007 | Vue Router activa los enlaces por *route record*: un link a `/kids` no se activa en `/kids/:slug` si ambas rutas son hermanas | M | M | Rutas anidadas: `pages/kids.vue` y `pages/kids/[slug].vue` como layouts con `<NuxtPage/>`, de modo que las subrutas cuelguen del record `/kids`. Verificado en navegador. |
| TR-003 | Los datos ficticios de los 7 perfiles sin diseño pueden leerse como datos reales  | M              | M                   | Marcar el origen mock en el código y en la spec; sin backend ni persistencia; copy de "diseño" en la retrospective. |
| TR-004 | La búsqueda por alertas expone etiquetas médicas en pantalla de gestión           | L (mock)       | M                   | BR-2 lo acota al mock; cualquier integración real exige spec de auth/autorización.                                  |
| TR-005 | Deriva visual respecto de `ninos.dc.html` y `perfil-nino.dc.html`                 | M              | M                   | Tokens derivados 1:1 del HTML de referencia, anchos 880/820px exactos y comparación por captura.                    |
| TR-006 | `BaseAvatar` extendido con tonos/tamaños rompe el uso actual en el feed           | L              | L                   | Los valores previos se conservan; se re-verifica el feed al final.                                                  |

---

## Alternatives considered

| Alternative                                                                                    | Why rejected                                                                          |
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Implementar `agregar-nino.dc.html`, `resumen-dia.dc.html` y `vincular-padre.dc.html` completos | Agrandaba la spec a tres pantallas extra; la spec 002 define placeholders explícitos. |
| Rutas en español (`/ninos`)                                                                    | La spec fija rutas en inglés por convención de código del proyecto.                   |
| 8 archivos de perfil en vez de `[slug]`                                                        | Duplica markup; la ruta dinámica cubre los 8 con un solo archivo.                     |
| Persistir la búsqueda en la URL                                                                | Fuera de alcance según la spec; el término queda local al componente.                 |
| Filtrar también por estado de vinculación                                                      | Se eligió nombre + alertas; el estado no se busca.                                    |
| Buscar en backend                                                                              | No hay backend; el mock es local.                                                     |

---

## Trade-offs

| Decision                       | Gained                                        | Cost / given up                                            |
| ------------------------------ | --------------------------------------------- | ---------------------------------------------------------- |
| Perfil dinámico `/kids/[slug]` | Una sola implementación para los 8 niños      | Obliga a resolver el slug y a manejar el caso inexistente. |
| Placeholders "Próximamente"    | Ningún control queda inerte y hay 404         | Las acciones no son operativas todavía.                    |
| Sidebar con `<NuxtLink>`       | Navegación real y estado activo correcto      | Refactor de un componente ya verificado (riesgo TR-001).   |
| Búsqueda por nombre y alertas  | Cumple lo pedido y es útil en la guardia      | Muestra etiquetas de salud en la búsqueda (BR-2).          |
| Mock estático en `KidsMock.ts` | Consistente con SPEC 001, sin infraestructura | No hay datos reales ni persistencia.                       |
| Extender `BaseAvatar`          | Una sola implementación de avatar             | Crece la API del componente con tonos y tamaños nuevos.    |

---

## Implementation strategy

1. **Fundación:** extender tokens `@theme` con los colores de la referencia de niños y ampliar `BaseAvatar` (48/84px; tonos pink/mint/yellow/violet).
2. **Dominio:** crear `app/types/child.ts` y `app/data/KidsMock.ts` con los 8 niños y los datos de perfil (Mateo literal; los otros 7 coherentes y ficticios).
3. **Navegación compartida:** convertir `NavItems` y el logo/CTA del sidebar en `NuxtLink` con estado activo por ruta; verificar que `/` sigue igual.
4. **Piezas del listado:** `KidsHeader`, `KidsSearchInput`, `KidsSectionHeader`, `ChildCard`, `KidsEmptyState`.
5. **Ruta del listado:** `app/pages/kids/index.vue` con filtro computado por nombre y alertas, estado vacío y enlaces a cada perfil.
6. **Piezas del perfil:** link "Volver a Niños", `ChildProfileHeader`, `ChildAlertPanel` (condicional), `ChildDetailsCard`, `LinkedParentsCard`.
7. **Ruta del perfil:** `app/pages/kids/[slug].vue` con `useRoute()`, resolución por slug y estado seguro para slug inexistente.
8. **Placeholders:** `ComingSoonPage` + las cuatro rutas placeholder.
9. **Verificación:** Playwright a 1440×900 y 390×844, recorrido de navegación y búsqueda, consola limpia, fallback de fuentes y comparación visual contra las referencias.

Cada paso es commiteable y deja la app renderizable (1–3 no rompen nada previo; 5–8 agregan piezas sin estado dinámico compartido).

---

## Test strategy

| Level (unit/integration/e2e) | What it covers                                                                  | Requirement IDs                       |
| ---------------------------- | ------------------------------------------------------------------------------- | ------------------------------------- |
| e2e visual (Playwright MCP)  | Listado desktop 1440×900 vs `pantallas/ninos.dc.html` y `screenshots/ninos.png` | `R-1, R-2, AC-1, AC-2, AC-18`         |
| e2e visual (Playwright MCP)  | Perfil desktop 1440×900 vs `pantallas/perfil-nino.dc.html`                      | `R-6..R-9, AC-6..AC-9, AC-13, AC-18`  |
| e2e interacción              | Búsqueda por nombre y por alerta, estado vacío y acción de limpiar              | `R-4, R-5, AC-4, AC-5`                |
| e2e navegación               | Sidebar Feed/Niños, las 8 cards, "Volver a Niños" y los 4 placeholders          | `R-3, R-10..R-12, AC-3, AC-10..AC-12` |
| e2e responsive               | 390×844: sidebar oculto, una columna, perfil apilado, sin scroll horizontal     | `NFR-2, AC-15`                        |
| consola                      | 0 errores y 0 warnings en `/kids`, `/kids/[slug]` y placeholders                | `NFR-1, AC-14`                        |
| regresión                    | `/` (feed) sigue renderizando igual tras el refactor del sidebar                | `TR-001`                              |
| degradación                  | Bloqueo de Google Fonts: estructura intacta y sin overflow                      | `NFR-3, AC-16`                        |
| estático                     | No hay endpoints, tablas ni llamadas de red                                     | `BR-1, BR-2, AC-17`                   |

---

## Technical closure criteria

- [ ] `/kids` renderiza el listado completo con 8 cards y coincide visualmente con la referencia a 1440×900.
- [ ] `/kids/[slug]` renderiza el perfil del niño de la ruta; el de Mateo coincide con `pantallas/perfil-nino.dc.html`.
- [ ] La búsqueda filtra por nombre y por alertas y el estado vacío ofrece limpiar.
- [ ] Todas las rutas navegables usan `<NuxtLink>`; los cuatro placeholders muestran "Próximamente" sin errores de consola.
- [ ] El estado activo del sidebar es correcto en `/`, `/kids` y `/kids/[slug]`.
- [ ] A 390×844 el sidebar se oculta, el listado es de una columna, el perfil se apila y no hay scroll horizontal.
- [ ] La consola no muestra errores ni warnings al cargar las rutas nuevas.
- [ ] `/` (feed) no presenta regresiones visuales tras el refactor del sidebar.
- [ ] No existe ningún endpoint, tabla ni llamada de red; el contenido proviene del mock estático.
- [ ] Migration: not applicable-verified / Rollback-documentado / sin findings de seguridad abiertos en el alcance.
