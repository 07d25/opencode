# SPEC 002 — Gestión de niños (listado y perfil)

> **Status:** Implemented
> **Depends on:** SPEC 001
> **Date:** 2026-10-19
> **Objective:** Implementar la gestión de niños del staff con un listado filtrable en `/kids` y un perfil por niño en `/kids/[slug]`, replicando `pantallas/ninos.dc.html` y `pantallas/perfil-nino.dc.html`.

---

## Why

La primera pantalla (SPEC 001) validó el lenguaje visual del producto sobre el feed, el sidebar con navegación real y con las pantallas de gestión. Esta spec completa el circuito principal del staff: desde el feed se llega al listado de niños y de ahí al perfil de cada niño.

---

## Scope

**In:**

- Ruta `/kids` con el listado de los 8 niños, siguiendo `pantallas/ninos.dc.html`.
- Ruta `/kids/[slug]` con el perfil del niño, siguiendo `pantallas/perfil-nino.dc.html`, disponible para los 8.
- Buscador funcional por nombre y por alertas, con estado vacío.
- Navegación interna con `<NuxtLink>`: sidebar, cards, "Volver a Niños" y acciones auxiliares.
- Rutas placeholder "Próximamente" para agregar, editar, resumen del día y vincular familiar.
- Datos mock estáticos de los 8 niños, sus familiares, alertas y fechas de ingreso.
- Adaptación móvil: sidebar oculto, listado a una columna y perfil apilado.

**Out of scope (for future specs):**

- Backend, base de datos, seed y endpoints; no hay `server/api/`.
- Autenticación, sesión, roles y autorización.
- Formularios reales de alta, edición, resumen o vinculación (son placeholders).
- Pantallas de Avisos y Mi cuenta (siguen visuales en el sidebar).
- Resumen del día real, notificaciones, mensajes a familias o carga de fotos.
- Persistencia de la búsqueda (no hay URL query param en esta spec).
- Modo oscuro, tablet y tamaños intermedios.

---

## Requirements

| ID    | Requirement                                                                                                                                                                                                                           | Priority |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| R-1   | `/kids` replica la pantalla de `pantallas/ninos.dc.html`: encabezado "GESTIÓN" / "Niños", botón "Agregar niño", buscador, fila "SALA SOLES · 8 niños" y grilla de 8 cards.                                                            | Must     |
| R-2   | Cada card muestra avatar de 48px con iniciales, nombre completo, línea "edad · N padres vinculados" y el indicador de la derecha: etiqueta de alerta (MANÍ, LACTOSA), etiqueta VINCULAR o chevron.                                    | Must     |
| R-3   | Las 8 cards navegan a `/kids/[slug]` mediante `<NuxtLink>`.                                                                                                                                                                           | Must     |
| R-4   | El buscador filtra en cliente por nombre y por alertas; con texto vacío se muestran los 8 niños.                                                                                                                                      | Must     |
| R-5   | Cuando el filtro no encuentra coincidencias se muestra el estado vacío con el mensaje en español y una acción para limpiar la búsqueda.                                                                                               | Must     |
| R-6   | `/kids/[slug]` replica `pantallas/perfil-nino.dc.html`: link "Volver a Niños", avatar de 84px, nombre, "edad · Sala", botón "Editar", panel de alertas, tabla de datos y columna lateral con "Resumen del día" y "PADRES VINCULADOS". | Must     |
| R-7   | El perfil muestra los datos del niño de la ruta: nombre, edad, sala, fecha de nacimiento, ingreso, alertas y familiares vinculados.                                                                                                   | Must     |
| R-8   | Las alertas se muestran con el bloque de advertencia del diseño solo cuando el niño tiene alguna; los demás omiten ese bloque.                                                                                                        | Must     |
| R-9   | El panel de familiares lista los familiares con avatar, nombre, rol, estado (ACTIVA / PENDIENTE) y la acción "Vincular otro padre".                                                                                                   | Must     |
| R-10  | Las acciones "Agregar niño", "Editar", "Resumen del día" y "Vincular otro padre" navegan a rutas placeholder que muestran una pantalla "Próximamente".                                                                                | Must     |
| R-11  | El item "Niños" del sidebar navega a `/kids` y el item "Feed" a `/`; el estado activo refleja la ruta actual, y "Niños" queda activo en `/kids` y sus subrutas.                                                                       | Must     |
| R-12  | "Volver a Niños" del perfil navega a `/kids`.                                                                                                                                                                                         | Must     |
| R-13  | Todas las rutas, archivos, componentes, tipos, props, funciones y variables están en inglés; los comentarios de código en español; el copy visible en español.                                                                        | Must     |
| NFR-1 | Las páginas cargan sin errores ni warnings en la consola del navegador.                                                                                                                                                               | Must     |
| NFR-2 | Bajo 640px el sidebar se oculta, el listado pasa a una columna, el perfil apila sus bloques y no hay scroll horizontal.                                                                                                               | Must     |
| NFR-3 | Si el CDN de Google Fonts falla, la página renderiza con fuentes del sistema sin romper el layout.                                                                                                                                    | Should   |
| BR-1  | Los datos de niños, familiares, alertas y fechas son mock estático de diseño: no hay datos reales, ni API, ni persistencia.                                                                                                           | Must     |
| BR-2  | La búsqueda por alertas se limita al conjunto mock del cliente y no expone información fuera de la pantalla de gestión.                                                                                                               | Must     |

---

## Security and non-functional requirements

- **Autorización:** (not applicable: no hay auth, sesiones ni endpoints en esta spec; todas las rutas son públicas y de solo lectura sobre datos mock).
- **Validación de entrada:** el buscador es un input de texto del cliente que solo filtra el mock en memoria; no se envía a ningún servidor ni se interpola en HTML.
- **Secretos:** (not applicable: no hay credenciales; la única dependencia externa es el CDN de Google Fonts).
- **PII / datos personales:** nombres de menores, familiares, alergias y fechas son ficticios y de diseño, presentes en el bundle. En una integración real, las alergias y los familiares de menores son datos sensibles que requieren autorización por rol, cifrado y retención definida.
- **Rate limiting / abuso:** (not applicable: no hay endpoints ni escritura).
- **Audit trail:** (not applicable: el mock no registra acciones).
- **Rendimiento:** filtrado sobre 8 elementos en memoria; sin impacto de red. Sin imágenes pesadas ni dependencias de datos.
- **Disponibilidad:** degradación elegante si fallan las fuentes (NFR-3) y sin dependencia de red en la carga de datos.

---

## Data model

```ts
// app/types/child.ts
export type ChildAlertKind = "allergy" | "diet" | "medical";
export type ParentStatus = "active" | "pending";

export interface ChildAlert {
  kind: ChildAlertKind;
  label: string; // "MANÍ" | "LACTOSA"
  title: string; // "Alergias y notas"
  notes: string; // texto del panel de advertencia
  tone: "danger"; // color del bloque de alerta
}

export interface ChildParent {
  name: string;
  initials: string;
  role: string; // "Mamá" | "Papá"
  statusLabel: string; // "activa" | "invitación enviada"
  status: ParentStatus;
}

export interface Child {
  id: string;
  slug: string; // "mateo-fernandez"
  fullName: string;
  initials: string;
  age: string; // "3 años"
  room: string; // "Soles"
  avatarTone: "sky" | "pink" | "mint" | "yellow" | "violet";
  linkedParentsLabel: string; // "2 padres vinculados" | "1 padre vinculado" | "sin padres vinculados"
  alerts: ChildAlert[];
  badge: { type: "alert" | "link" | "none"; label?: string };
  birthDate: string; // "12 mar 2022"
  enrolledAt: string; // "feb 2025"
  parents: ChildParent[];
}
```

```ts
// app/data/KidsMock.ts
export const kids: Child[] = [
  /* los 8 niños de la referencia */
];
export const kidsRoomLabel = "SALA SOLES";
export const kidsCountLabel = "8 niños";
```

Los valores visibles son copia literal de `pantallas/ninos.dc.html` y `pantallas/perfil-nino.dc.html`. Para los 7 niños sin perfil diseñado se agregan datos ficticios coherentes (cumpleaños, ingreso, alertas y familiares) manteniendo el mismo layout.

---

## Contracts and interfaces

| Interface           | Direction | Input                               | Output                                       | Errors  |
| ------------------- | --------- | ----------------------------------- | -------------------------------------------- | ------- |
| `<KidsSearchInput>` | in        | `modelValue` (texto), `placeholder` | texto emitido por `update:modelValue`        | ninguno |
| `<ChildCard>`       | in        | `child: Child`                      | card renderizada con enlace a `/kids/[slug]` | ninguno |
| `<ChildProfile>`    | in        | `child: Child`                      | perfil renderizado                           | ninguno |
| `<KidsEmptyState>`  | in        | `query: string`                     | mensaje y acción de limpiar                  | ninguno |
| `<ComingSoonPage>`  | in        | `title`, `description`              | pantalla "Próximamente"                      | ninguno |
| Sidebar `NavItems`  | in        | rutas de los items                  | enlaces `<NuxtLink>` con estado activo       | ninguno |

No hay APIs ni eventos globales. No hay cambios incompatibles: se agregan rutas nuevas y el sidebar pasa de enlaces visuales a enlaces navegables.

---

## Failure modes and degradation

- **Slug inexistente** (`/kids/no-existe`): la página muestra el estado "Próximamente"/no encontrado sin error de consola y sin datos inventados.
- **Búsqueda sin coincidencias:** estado vacío con mensaje y acción para limpiar.
- **Fallo del CDN de fuentes:** fallback a fuentes del sistema, sin romper el layout.
- **Sin dependencias de red:** los datos son estáticos; no hay estados de carga ni errores de fetch que gestionar.

---

## Acceptance criteria

- [x] AC-1 (R-1): `/kids` muestra encabezado "GESTIÓN" y "Niños", botón "Agregar niño", buscador con placeholder "Buscar niño…", fila "SALA SOLES · 8 niños" y grilla con 8 cards.
- [x] AC-2 (R-2): las 8 cards muestran avatar de 48px con iniciales, nombre, línea "edad · N padres vinculados" y el indicador derecho correcto (MANÍ, LACTOSA, VINCULAR o chevron) con sus colores.
- [x] AC-3 (R-3): al hacer clic en cada una de las 8 cards se navega a `/kids/[slug]` del niño correspondiente.
- [x] AC-4 (R-4): escribir "maní" en el buscador deja solo a Mateo; escribir "lactosa" deja solo a Tomás; escribir un nombre reduce la grilla; con el campo vacío se muestran los 8.
- [x] AC-5 (R-5): una búsqueda sin coincidencias muestra el mensaje en español y la acción de limpiar, y al limpiarse vuelven a verse los 8 niños.
- [x] AC-6 (R-6): `/kids/mateo-fernandez` muestra "Volver a Niños", avatar de 84px, "Mateo Fernández", "3 años · Sala Soles", botón "Editar", panel de alergias, tabla con fecha de nacimiento, sala e ingreso, y la columna lateral con "Resumen del día" y "PADRES VINCULADOS".
- [x] AC-7 (R-7): `/kids/mateo-fernandez` muestra "12 mar 2022", "Soles", "feb 2025" y el panel de alergias con el texto de la referencia.
- [x] AC-8 (R-8): un niño sin alertas no renderiza el bloque de advertencia y el perfil mantiene el resto del layout alineado.
- [x] AC-9 (R-9): el panel de familiares lista a Lucía Fernández (ACTIVA) y Diego Fernández (PENDIENTE) con avatar, rol y estado, más la acción "Vincular otro padre".
- [x] AC-10 (R-10): "Agregar niño", "Editar", "Resumen del día" y "Vincular otro padre" navegan a sus rutas y muestran una pantalla "Próximamente" en español, sin error de consola.
- [x] AC-11 (R-11): en `/` el item "Feed" del sidebar queda activo; en `/kids` y en `/kids/mateo-fernandez` queda activo "Niños"; "Feed" navega a `/` y "Niños" a `/kids`.
- [x] AC-12 (R-12): "Volver a Niños" del perfil navega a `/kids`.
- [x] AC-13 (R-13): en `/kids/[slug]` el nombre, la edad, la sala, el avatar y los colores coinciden con los del niño de la ruta; cada uno de los 8 perfiles renderiza sus propios datos.
- [x] AC-14 (NFR-1): la consola del navegador no muestra errores ni warnings al cargar `/kids`, `/kids/[slug]` ni los placeholders.
- [x] AC-15 (NFR-2): a 390×844 el sidebar está oculto, el listado muestra una sola columna, el perfil apila sus bloques y no hay scroll horizontal.
- [x] AC-16 (NFR-3): con las fuentes bloqueadas, `/kids` y `/kids/[slug]` mantienen la estructura sin desbordes.
- [x] AC-17 (BR-1): no existe ningún endpoint, tabla ni llamada de red; todo el contenido proviene del mock estático.
- [x] AC-18: las capturas a 1440×900 de `/kids` y `/kids/[slug]` son visualmente equivalentes a `screenshots/ninos.png` y a `pantallas/perfil-nino.dc.html` en colores (`#F6ECDF`, `#FFFDF9`, `#ECE0D0`), tipografías (Fredoka/Nunito) y spacing.

---

## Assumptions and open questions

- **Supuesto:** la medida de fidelidad es la captura desktop a 1440×900 de `pantallas/ninos.dc.html` y `pantallas/perfil-nino.dc.html`.
- **Supuesto:** el hover de las cards (borde `#F2A78E` y desplazamiento de 2px) se replica, aunque la referencia no lo muestre en captura estática.
- **Supuesto:** el placeholder "Próximamente" reutiliza el shell del producto (sidebar + fondo cálido) para no parecer una página rota.
- **Pregunta abierta:** ¿el conteo "8 niños" debe recalcularse si una futura integración agrega o saca niños? En esta spec es texto fijo del mock.

---

## Decisions

- **Sí:** rutas en inglés (`/kids`, `/kids/[slug]`, `/kids/add`, `/kids/[slug]/edit`, `/kids/[slug]/daily-summary`, `/kids/[slug]/parents/add`), coherente con la convención de código en inglés del proyecto.
- **Sí:** navegación interna exclusivamente con `<NuxtLink>`; se evita `<a href>` manual para no recargar la página ni perder prefetch.
- **Sí:** el item "Niños" del sidebar apunta a `/kids` y "Feed" a `/`; el estado activo se deriva de la ruta.
- **Sí:** perfil dinámico único `/kids/[slug]` para los 8 niños, en lugar de 8 archivos.
- **Sí:** la búsqueda filtra por nombre y por alertas, con estado vacío en español.
- **Sí:** datos mock coherentes para los 7 perfiles no diseñados; el layout es idéntico al de Mateo.
- **Sí:** las acciones auxiliares navegan a placeholders "Próximamente" en lugar de ser inertes, para que ningún control parezca roto.
- **No:** `agregar-nino.dc.html`, `resumen-dia.dc.html` y `vincular-padre.dc.html` como pantallas completas; son otra spec.
- **No:** persistir el término de búsqueda en la URL; se mantiene local al componente.
- **No:** backend, auth o datos reales; el mock sigue siendo estático como en SPEC 001.

---

## Risks

| Risk                                                         | Impact | Mitigation                                                                                        |
| ------------------------------------------------------------ | ------ | ------------------------------------------------------------------------------------------------- |
| Deriva visual respecto de las dos referencias                | Medium | Comparación por captura a 1440×900 contra `pantallas/*.dc.html` en implementación y verificación. |
| Datos ficticios de los 7 perfiles que contradicen el listado | Low    | Derivar de la misma fuente mock y verificar coherencia nombre/edad/alertas/listado vs perfil.     |
| El perfil de Mateo define bloques que otros niños no tienen  | Low    | Ocultar el bloque de alertas cuando no hay, sin alterar el resto del layout.                      |
| La búsqueda por alertas expone información médica            | Low    | Datos mock; la decisión queda registrada como BR-2 y se revisa al conectar datos reales.          |
| Rutas placeholder confusas como funcionalidad real           | Low    | Copie explícito "Próximamente" y sin formularios ni acciones habilitadas.                         |

---

## What is **not** in this spec

- Backend, base de datos, seed, `server/api/` y cualquier llamada de red.
- Autenticación, sesión, roles y autorización.
- Formularios de alta, edición, resumen o vinculación.
- Pantallas de Avisos y Mi cuenta.
- Carga de fotos, notifications, mensajería con familias y reportes reales.
- Tests automatizados: el repo no tiene runner; la verificación es visual con Playwright.
- Modo oscuro, tablet y persistencia de la búsqueda.
