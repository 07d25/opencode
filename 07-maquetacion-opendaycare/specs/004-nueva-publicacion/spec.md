# SPEC 004 — Nueva publicación

> **Status:** Implemented
> **Depends on:** SPEC 001, SPEC 002
> **Date:** 2026-10-22
> **Objective:** Permitir que el staff cree una publicación en el feed desde una tarjeta centrada, con destinatario, tipo, descripción y fotos, y que la publicación aparezca en el feed.

---

## Why

SPEC 001 dejó el prompt "Compartí un momento…" y el botón "Nueva publicación" del sidebar como inertes. La pantalla de referencia (`pantallas/crear-publicacion.dc.html`) define el flujo completo: elegir a quién va dirigida, qué tipo de momento es, escribir la descripción y adjuntar fotos. Esta spec cierra ese circuito para que el staff pueda publicar un momento del día y verlo reflejado en el feed.

---

## Scope

**In:**

- Página `/posts/new` con tarjeta de 580px centrada sobre el fondo cálido, sin sidebar, tal como la referencia.
- Encabezado de la tarjeta: "Cancelar" (vuelve al feed), título "Nueva publicación" y "Publicar" (acción de enviar).
- Sección "PARA" con chips de destinatario: los niños de la sala (Mateo, Sofía, Benjamín) y "Toda la sala", selección única.
- Sección "TIPO" con chips de tipo (Comida, Siesta, Actividad, Logro, Ánimo, Foto, Anuncio), selección única con "Actividad" por defecto.
- Sección "DESCRIPCIÓN" con textarea (placeholder "Contá cómo le fue hoy…") con texto inicial de ejemplo precargado como en la referencia.
- Sección "FOTOS" con una miniatura de vista previa (placeholder) y un botón "Agregar" que abre el selector de archivos del navegador y muestra miniaturas de las fotos elegidas, sin subirlas.
- Validación en cliente: el destinatario y el tipo son obligatorios y la descripción no puede estar vacía.
- Al publicar, se crea una publicación mock nueva en memoria y el usuario vuelve al feed, donde la publicación aparece al tope.
- El botón "Nueva publicación" del sidebar y el prompt "Compartí un momento…" del feed abren/navegan a `/posts/new`.
- Adaptación móvil a 390×844 sin scroll horizontal.

**Out of scope (for future specs):**

- Backend, endpoints, persistencia y envío real de la publicación.
- Subida real de fotos a un servidor o almacenamiento.
- Edición o eliminación de publicaciones ya publicadas.
- Selección múltiple de destinatarios.
- Publicación con tipo opcional (sin tipo).
- Menciones, etiquetas o ubicación en la publicación.
- Notificaciones a las familias.
- Publicar en nombre de otro docente.

---

## Requirements

| ID    | Requirement                                                                                                                                                | Priority |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| R-1   | La ruta `/posts/new` muestra la tarjeta de nueva publicación de 580px centrada sobre el fondo cálido, sin sidebar.                                         | Must     |
| R-2   | El encabezado de la tarjeta muestra "Cancelar", "Nueva publicación" y "Publicar".                                                                          | Must     |
| R-3   | "Cancelar" vuelve al feed (`/`) sin crear ninguna publicación.                                                                                             | Must     |
| R-4   | La sección "PARA" muestra los chips "Mateo", "Sofía", "Benjamín" y "Toda la sala", con el avatar de 26px del niño en los tres primeros.                    | Must     |
| R-5   | La selección de destinatario es única y exclusiva; el chip activo se resalta con fondo oscuro y texto blanco.                                              | Must     |
| R-6   | La sección "TIPO" muestra los siete chips (Comida, Siesta, Actividad, Logro, Ánimo, Foto, Anuncio) con los colores de la referencia.                       | Must     |
| R-7   | La selección de tipo es única y exclusiva; "Actividad" aparece seleccionado por defecto al abrir la pantalla.                                              | Must     |
| R-8   | La sección "DESCRIPCIÓN" muestra un textarea con el placeholder "Contá cómo le fue hoy…" y el texto de ejemplo precargado de la referencia.                | Must     |
| R-9   | La sección "FOTOS" muestra una miniatura placeholder y un botón "Agregar" con borde punteado que abre el selector de archivos del navegador.               | Must     |
| R-10  | Al seleccionar archivos, se muestran miniaturas de vista previa de las fotos elegidas, sin subirlas a ningún servidor.                                     | Must     |
| R-11  | "Publicar" valida en cliente que haya destinatario, tipo y descripción; si falta algo, muestra un mensaje en español y no publica.                         | Must     |
| R-12  | Al publicar con datos válidos se crea una publicación mock nueva en memoria y el usuario vuelve al feed, donde la publicación aparece al tope de la lista. | Must     |
| R-13  | La publicación creada incluye el tipo elegido (badge), el destinatario, el texto, la hora actual y, si se eligieron fotos, una miniatura de la primera.    | Must     |
| R-14  | El botón "Nueva publicación" del sidebar navega a `/posts/new`.                                                                                            | Must     |
| R-15  | El prompt "Compartí un momento…" del feed navega a `/posts/new`.                                                                                           | Must     |
| R-16  | La pantalla replica `pantallas/crear-publicacion.dc.html` en colores, tipografías, radios y spacing.                                                       | Must     |
| R-17  | Todos los archivos, componentes, props, funciones y variables están en inglés; el copy visible en español.                                                 | Must     |
| NFR-1 | La pantalla `/posts/new` y el feed `/` cargan sin errores ni warnings en la consola del navegador.                                                         | Must     |
| NFR-2 | A 390×844 la tarjeta ocupa el ancho disponible, los chips se envuelven y no hay scroll horizontal.                                                         | Must     |
| NFR-3 | Si el CDN de Google Fonts falla, la pantalla renderiza con fuentes del sistema sin romper el layout.                                                       | Should   |
| BR-1  | La publicación es un dato de diseño: no se envía a ningún servidor ni se persiste; al recargar la página la lista vuelve al mock original.                 | Must     |
| BR-2  | Una publicación nueva siempre se publica "por vos" (la docente actual) y no puede publicarse en nombre de otro.                                            | Must     |

---

## Security and non-functional requirements

- **Autorización:** (not applicable: no hay autenticación, sesiones ni endpoints en esta spec; la pantalla se abre desde el shell del staff).
- **Validación de entrada:** la validación del formulario ocurre en el cliente y no alcanza ningún servidor; el texto se escapa por el binding de Vue y no se interpola como HTML.
- **Secretos:** (not applicable: no hay credenciales).
- **PII / datos personales:** la descripción y las fotos pueden incluir datos de menores. En esta spec son mock de diseño y no salen del navegador. En una integración real, las fotos requieren autorización previa de la familia (ya registrada en la spec de activación de cuenta).
- **Rate limiting / abuso:** (not applicable: no hay envío real ni escritura).
- **Audit trail:** (not applicable: el mock no registra la acción de publicar).
- **Rendimiento:** la pantalla no hace requests ni carga assets; solo cambio de estado en el cliente. Las miniaturas de vista previa se generan con `URL.createObjectURL`.
- **Disponibilidad:** degradación elegante si fallan las fuentes (NFR-3) y sin dependencia de red para publicar.

---

## Data model

```ts
// app/types/feed.ts (extensión)
export type PostRecipient =
  | { kind: "child"; slug: string; name: string }
  | { kind: "room" };

export type PostType =
  | "food"
  | "nap"
  | "activity"
  | "achievement"
  | "mood"
  | "photo"
  | "announcement";
```

El tipo `FeedPostType` existente (`'achievement' | 'activity' | 'announcement'`) se amplía para cubrir los siete tipos del diseño (`food`, `nap`, `activity`, `achievement`, `mood`, `photo`, `announcement`), manteniendo los alias usados por el feed.

El código, el título (nombre del niño o "Anuncio general"), el destinatario (`recipient`), las iniciales del avatar y el badge se derivan del destinatario y del tipo elegidos. La hora se toma del reloj del navegador en formato `HH:MM`. Las fotos se guardan como URLs de objeto (`URL.createObjectURL`) en memoria.

---

## Contracts and interfaces

| Interface                     | Direction | Input                               | Output                                          | Errors                      |
| ----------------------------- | --------- | ----------------------------------- | ----------------------------------------------- | --------------------------- |
| Ruta `/posts/new`             | in        | ninguna                             | tarjeta de nueva publicación                    | ninguno                     |
| `<PostTypeChip>`              | in        | `type`, `label`, `tone`, `selected` | chip seleccionable con color propio             | ninguno                     |
| `<RecipientChip>`             | in        | `recipient`, `selected`             | chip con avatar de 26px o texto "Toda la sala"  | ninguno                     |
| Acción "Publicar"             | in        | estado del formulario               | publicación agregada al feed y navegación a `/` | validación fallida: mensaje |
| Acción "Agregar" (fotos)      | in        | selección de archivos               | miniaturas de vista previa                      | ninguno                     |
| Botón "Nueva publicación"     | in        | click                               | navegación a `/posts/new`                       | ninguno                     |
| Prompt "Compartí un momento…" | in        | click                               | navegación a `/posts/new`                       | ninguno                     |

No hay APIs, ni eventos globales, ni cambios incompatibles: se agrega una ruta nueva y el prompt y el botón del sidebar pasan de inertes a navegables.

---

## Failure modes and degradation

- **Destinatario no seleccionado:** "Publicar" muestra un mensaje en español y no publica.
- **Tipo no seleccionado:** "Publicar" muestra un mensaje en español y no publica.
- **Descripción vacía:** "Publicar" muestra un mensaje en español y no publica.
- **Selección de archivos no soportados:** se ignoran los archivos que no sean imagen; el resto se previsualiza.
- **Doble clic en "Publicar":** el envío es puramente visual y no hay escritura; no hay estado duplicado.
- **Click en "Cancelar":** no se crea ninguna publicación y el feed queda intacto.
- **Fallo del CDN de fuentes:** fallback a fuentes del sistema, sin romper el layout.
- **Recarga de la página:** la lista vuelve al mock original; las publicaciones nuevas no persisten.

---

## Acceptance criteria

- [x] AC-1 (R-1): `/posts/new` muestra la tarjeta de 580px centrada sobre el fondo cálido, sin sidebar.
- [x] AC-2 (R-2): el encabezado muestra "Cancelar", "Nueva publicación" y "Publicar".
- [x] AC-3 (R-3): "Cancelar" vuelve a `/` sin agregar ninguna publicación al feed.
- [x] AC-4 (R-4): la sección "PARA" muestra los chips "Mateo", "Sofía", "Benjamín" y "Toda la sala", con avatar de 26px en los tres niños.
- [x] AC-5 (R-5): al hacer clic en "Sofía", "Mateo" deja de estar activo y "Sofía" queda activo con fondo oscuro y texto blanco; los cuatro son excluyentes.
- [x] AC-6 (R-6): la sección "TIPO" muestra los siete chips con los colores de la referencia (Comida amarillo, Siesta violeta, Actividad azul, Logro verde, Ánimo rosa, Foto coral, Anuncio azul royal).
- [x] AC-7 (R-7): al abrir la pantalla "Actividad" está activo; al pulsar "Comida" queda activo "Comida" y "Actividad" pierde el estado activo.
- [x] AC-8 (R-8): el textarea muestra el placeholder "Contá cómo le fue hoy…" y el texto de ejemplo precargado.
- [x] AC-9 (R-9): el botón "Agregar" en "FOTOS" abre el selector de archivos del navegador.
- [x] AC-10 (R-10): al seleccionar una imagen, aparece una miniatura de vista previa junto al botón "Agregar".
- [x] AC-11 (R-11): con la descripción vacía, "Publicar" muestra un mensaje en español y no agrega ninguna publicación.
- [x] AC-12 (R-12): con destinatario "Mateo", tipo "Actividad" y la descripción del ejemplo, al pulsar "Publicar" el usuario vuelve a `/` y la nueva publicación aparece al tope del feed.
- [x] AC-13 (R-13): la publicación creada muestra el badge del tipo elegido, el destinatario "familia de Mateo", el texto ingresado y la hora actual.
- [x] AC-14 (R-14): el botón "Nueva publicación" del sidebar navega a `/posts/new`.
- [x] AC-15 (R-15): al hacer clic en el prompt "Compartí un momento…" del feed se navega a `/posts/new`.
- [x] AC-16 (R-16): la pantalla replica `pantallas/crear-publicacion.dc.html` en colores, tipografías, radios y spacing.
- [x] AC-17 (R-17): los nombres de archivos, componentes y variables están en inglés y todo el copy visible está en español.
- [x] AC-18 (NFR-1): la consola del navegador no muestra errores ni warnings al cargar `/posts/new`, publicar y volver al feed.
- [x] AC-19 (NFR-2): a 390×844 la tarjeta entra dentro del ancho de la pantalla, los chips se envuelven y no hay scroll horizontal.
- [x] AC-20 (NFR-3): con las fuentes bloqueadas, la pantalla mantiene su estructura sin desbordes.
- [x] AC-21 (BR-1): no existe ningún endpoint, llamada de red ni almacenamiento: la publicación solo vive en memoria y al recargar la página el feed vuelve al mock original.
- [x] AC-22 (BR-2): la publicación nueva se atribuye siempre a la docente actual ("publicado por vos") y no puede cambiarse desde el formulario.
- [x] AC-23: la captura a 1440×900 de `/posts/new` es visualmente equivalente a `pantallas/crear-publicacion.dc.html` en colores (`#FBF4EC`, `#ECE0D0`, `#EADFD0`, `#F4ECE1`), tipografías (Fredoka/Nunito) y spacing.

---

## Assumptions and open questions

- **Supuesto:** la medida de fidelidad es la captura desktop a 1440×900 de `pantallas/crear-publicacion.dc.html`.
- **Supuesto:** la publicación nueva se inserta al tope de la lista del feed en memoria y no persiste al recargar.
- **Supuesto:** el texto de ejemplo precargado en el textarea es editable y se puede borrar por completo.
- **Supuesto:** el destinatario arranca en "Mateo", como en la referencia, donde ese chip aparece seleccionado.
- **Pregunta abierta:** ¿las fotos elegidas deben persistir junto a la publicación o descartarse al recargar? Se resuelve cuando exista backend.
- **Pregunta abierta:** ¿el tipo "Anuncio" debe poder tener un destinatario distinto de "Toda la sala"? Se resuelve en una spec posterior.

---

## Decisions

- **Sí:** tarjeta a pantalla completa sin sidebar, como en la referencia, en lugar de un modal sobre el feed.
- **Sí:** selección única de destinatario y de tipo, como en la referencia.
- **Sí:** "Actividad" seleccionado por defecto, porque es el tipo más común y la referencia lo muestra en primer lugar entre los tipos.
- **Sí:** el textarea arranca con el texto de ejemplo precargado, como en la referencia.
- **Sí:** vista previa real de las fotos elegidas con `URL.createObjectURL`, sin subirlas.
- **Sí:** sin persistencia; la publicación vive en memoria y el feed vuelve al mock al recargar.
- **Sí:** el prompt del feed y el botón del sidebar navegan a `/posts/new` con `<NuxtLink>`.
- **Sí:** "Mateo" queda como destinatario inicial, igual que en la referencia; el tipo inicial es "Actividad".
- **No:** convertir la pantalla en un modal sobre el feed.
- **No:** permitir seleccionar varios destinatarios o varios tipos a la vez.
- **No:** publicar en nombre de otro docente.

---

## Risks

| Risk                                                    | Impact | Mitigation                                                                       |
| ------------------------------------------------------- | ------ | -------------------------------------------------------------------------------- |
| Deriva visual respecto de la referencia                 | Medium | Comparación por captura a 1440×900 contra `pantallas/crear-publicacion.dc.html`. |
| Las URLs de objeto de las fotos no se liberan           | Low    | Se revocan al desmontar la pantalla o al volver al feed.                         |
| El feed no refleja la publicación nueva por reactividad | Medium | La lista del feed se mantiene en un estado reactivo compartido.                  |
| Confundir el mock precargado con una publicación real   | Low    | El copy evita prometer envío y BR-1 lo documenta.                                |

---

## What is **not** in this spec

- Backend, endpoints, persistencia y envío real de la publicación.
- Subida real de fotos a un servidor o almacenamiento.
- Edición o eliminación de publicaciones ya publicadas.
- Selección múltiple de destinatarios o de tipos.
- Publicación con tipo opcional.
- Menciones, etiquetas o ubicación en la publicación.
- Notificaciones a las familias.
- Tests automatizados: el repo no tiene runner; la verificación es visual con Playwright.
