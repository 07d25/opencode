# SPEC 003 — Vincular padre (invitación a un familiar)

> **Status:** Draft
> **Depends on:** SPEC 002
> **Date:** 2026-10-21
> **Objective:** Permitir que el staff invite a un familiar a seguir el día de un niño, desde un modal sobre el perfil del niño.

---

## Why

SPEC 002 dejó "Vincular otro padre" como acción placeholder. La pantalla de referencia (`pantallas/vincular-padre.dc.html`) ya define el flujo completo: completar los datos del familiar, mostrar el código de invitación que se le enviará por correo y disparar la invitación. Esta spec cierra ese circuito para que el staff pueda invitar a un segundo progenitor sin salir del perfil del niño.

---

## Scope

**In:**

- Modal "Vincular padre" superpuesto sobre el perfil del niño (`/kids/[slug]`), abierto desde la acción "Vincular otro padre" del panel "PADRES VINCULADOS".
- Encabezado del modal: título "Vincular padre", bajada "a {nombre del niño}" y botón de cierre (X) que vuelve al perfil.
- Aviso informativo azul: "Le enviaremos un correo con un código para que active su cuenta. Solo verá el feed de {niño}."
- Formulario con tres campos: "NOMBRE DEL PADRE/MADRE" (placeholder "Ej. Diego Fernández"), "EMAIL" (placeholder "correo@ejemplo.com") y "PARENTESCO" con tres botones excluyentes: Mamá, Papá, Tutor/a.
- Bloque "CÓDIGO DE INVITACIÓN" con el código `7K4P9` y la leyenda "Vence en 7 días".
- Acción "Enviar invitación" con validación en cliente de nombre, email y parentesco.
- Estado de confirmación tras enviar, con el email destinatario y el código enviado y una acción para volver al perfil del niño.
- Overlay con fondo oscurecido y cierre por botón X, por click fuera del modal y por tecla Escape.
- Adaptación móvil del modal a 390×844 sin scroll horizontal.

**Out of scope (for future specs):**

- Backend, endpoints, envío real de correo y persistencia de las invitaciones.
- Agregar el familiar invitado a la lista "PADRES VINCULADOS" con estado PENDIENTE.
- Generación aleatoria del código de invitación y vencimiento real de 7 días.
- Editar, desvincular o reenviar invitaciones; lista de invitaciones enviadas.
- Vincular más de un familiar a la vez o seleccionar varios niños para la misma invitación.
- Verificación del código de invitación por parte de la familia (pantalla "activar cuenta" ya implementada, con su propia spec pendiente).

---

## Requirements

| ID    | Requirement                                                                                                                                                                                                                          | Priority |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| R-1   | La acción "Vincular otro padre" del panel "PADRES VINCULADOS" abre el modal "Vincular padre" sobre el perfil del niño.                                                                                                                | Must     |
| R-2   | El modal se presenta sobre el perfil del niño, con fondo oscurecido, y el contenido del perfil permanece legible detrás.                                                                                                              | Must     |
| R-3   | El encabezado del modal muestra el título "Vincular padre" y la bajada "a {nombre completo del niño}".                                                                                                                                  | Must     |
| R-4   | El modal se cierra con el botón X del encabezado y el usuario vuelve al perfil del niño.                                                                                                                                              | Must     |
| R-5   | El aviso informativo azul indica que se enviará un correo con un código para que el familiar active su cuenta y que solo verá el feed del niño.                                                                                        | Must     |
| R-6   | El formulario tiene los campos "NOMBRE DEL PADRE/MADRE" y "EMAIL" con los placeholders "Ej. Diego Fernández" y "correo@ejemplo.com".                                                                                                  | Must     |
| R-7   | El campo "PARENTESCO" ofrece tres botones excluyentes (Mamá, Papá, Tutor/a); "Mamá" aparece seleccionado al abrir el modal y solo uno puede estar activo a la vez.                                                                      | Must     |
| R-8   | El bloque "CÓDIGO DE INVITACIÓN" muestra el código `7K4P9` y la leyenda "Vence en 7 días".                                                                                                                                             | Must     |
| R-9   | "Enviar invitación" valida en cliente que el nombre no esté vacío, que el email tenga formato válido y que el parentesco esté elegido; si algo falla, muestra el mensaje en español bajo el formulario y no envía.          | Must     |
| R-10  | Con el formulario válido, "Enviar invitación" cambia el contenido del modal a un estado de confirmación que indica el email destinatario y el código enviado, con una acción para volver al perfil del niño.                    | Must     |
| R-11  | El modal se cierra con la tecla Escape y con un click fuera de la tarjeta del modal.                                                                                                                                                 | Must     |
| R-12  | El modal replica `pantallas/vincular-padre.dc.html`: tarjeta de 480px, bordes redondeados, aviso azul, bloque del código con borde punteado y CTA con gradiente terracota.                                                                   | Must     |
| R-13  | El modal se abre y se cierra sin recargar la página y sin perder el estado del perfil del niño.                                                                                                                                      | Must     |
| R-14  | El modal puede abrirse también desde la ruta `/kids/[slug]/parents/add`, que deja de ser un placeholder.                                                                                                                            | Must     |
| R-15  | Todos los archivos, componentes, props, funciones y variables están en inglés; el copy visible en español.                                                                                                                           | Must     |
| NFR-1 | Las pantallas `/kids/[slug]` y `/kids/[slug]/parents/add` cargan sin errores ni warnings en la consola del navegador.                                                                                                                    | Must     |
| NFR-2 | A 390×844 el modal ocupa el ancho disponible, los botones de parentesco siguen siendo legibles y no hay scroll horizontal.                                                                                                            | Must     |
| NFR-3 | Si el CDN de Google Fonts falla, el modal renderiza con fuentes del sistema sin romper el layout.                                                                                                                                    | Should   |
| BR-1  | La invitación es un dato de diseño: no se envía correo, no se persiste y el código `7K4P9` es fijo.                                                                                                                                  | Must     |
| BR-2  | Un familiar solo podrá ver el feed del niño al que fue invitado; la interfaz no ofrece la opción de vincularlo a más de un niño.                                                                                                     | Must     |

---

## Security and non-functional requirements

- **Autorización:** (not applicable: no hay autenticación, sesiones ni endpoints en esta spec; el modal se abre desde el perfil del niño en el shell del staff).
- **Validación de entrada:** la validación del formulario ocurre en el cliente y no alcanza ningún servidor; nombre y email se escapan por el binding de Vue y no se interpolan como HTML.
- **Secretos:** (not applicable: no hay credenciales; el código de invitación es un dato de diseño público).
- **PII / datos personales:** nombre y email de un familiar de un menor son datos personales sensibles. En esta spec son ficticios y no salen del navegador. En una integración real, la invitación requiere verificación del destinatario, cifrado en tránsito y en reposo y una retención definida para el código.
- **Rate limiting / abuso:** (not applicable: no hay envío de correo ni escritura; el control de abuso del código de invitación corresponde a la spec de activación de cuenta).
- **Audit trail:** (not applicable: el mock no registra la acción de invitar).
- **Rendimiento:** el modal no hace requests ni carga assets; solo cambio de estado en el cliente.
- **Disponibilidad:** degradación elegante si fallan las fuentes (NFR-3) y sin dependencia de red para abrir, validar y enviar.

---

## Data model

```ts
// app/types/child.ts (extensión)
export type ParentRelationship = "mother" | "father" | "guardian";
```

```ts
// Estado local del formulario, solo en memoria
export interface LinkParentForm {
  name: string;
  email: string;
  relationship: ParentRelationship;
}
```

El código de invitación (`7K4P9`) y el texto "Vence en 7 días" son constantes de diseño, no datos calculados. La familia invitada no se agrega a `Child.parents` en esta spec.

---

## Contracts and interfaces

| Interface                       | Direction | Input                    | Output                                         | Errors                                  |
| ------------------------------- | --------- | ------------------------ | ---------------------------------------------- | --------------------------------------- |
| `<KidsLinkParentModal>`         | in        | `child: Child`, `open`   | modal con formulario, aviso y bloque del código | ninguno                                 |
| `<KidsLinkParentModal>`         | out       | evento `close`            | cierra el modal y devuelve el control al perfil | ninguno                                 |
| `<KidsLinkParentModal>`         | out       | evento `sent`             | estado de confirmación con email y código      | ninguno                                 |
| Acción "Vincular otro padre"   | in        | `child.slug`              | abre el modal                                   | ninguno                                 |
| Ruta `/kids/[slug]/parents/add` | in        | `route.params.slug`       | perfil del niño con el modal abierto            | slug inexistente: perfil "no encontrado" |

No hay APIs, ni eventos globales, ni cambios incompatibles: la ruta existente `/kids/[slug]/parents/add` pasa de placeholder a modal real.

---

## Failure modes and degradation

- **Nombre vacío o email inválido:** se muestra un mensaje en español bajo el formulario y no se envía la invitación.
- **Parentesco no elegido:** la validación exige una relación seleccionada; "Mamá" viene preseleccionada.
- **Doble clic en "Enviar invitación":** el estado de confirmación se muestra una sola vez; el envío es puramente visual y no hay escritura.
- **Click fuera del modal, X o Escape:** el modal se cierra y el perfil del niño queda intacto.
- **Slug inexistente:** el modal no se abre y se muestra el estado "No encontramos ese niño" ya existente en `/kids/[slug]`.
- **Fallo del CDN de fuentes:** fallback a fuentes del sistema, sin romper el layout.

---

## Acceptance criteria

- [ ] AC-1 (R-1): al hacer clic en "Vincular otro padre" en `/kids/mateo-fernandez` se abre el modal "Vincular padre" sobre el perfil del niño.
- [ ] AC-2 (R-2): el modal se renderiza sobre un fondo oscurecido y el contenido del perfil se ve detrás.
- [ ] AC-3 (R-3): el encabezado muestra "Vincular padre" y, debajo, "a Mateo Fernández".
- [ ] AC-4 (R-4): el botón X del encabezado cierra el modal y el perfil del niño sigue en `/kids/mateo-fernandez`.
- [ ] AC-5 (R-5): el aviso azul muestra "Le enviaremos un correo con un código para que active su cuenta. Solo verá el feed de Mateo.".
- [ ] AC-6 (R-6): los campos "NOMBRE DEL PADRE/MADRE" y "EMAIL" muestran los placeholders "Ej. Diego Fernández" y "correo@ejemplo.com".
- [ ] AC-7 (R-7): al abrir el modal "Mamá" está activo; al pulsar "Papá" queda activo "Papá" y "Mamá" pierde el estado activo; los tres son excluyentes.
- [ ] AC-8 (R-8): el bloque del código muestra "CÓDIGO DE INVITACIÓN", el código `7K4P9` y "Vence en 7 días".
- [ ] AC-9 (R-9): con el nombre vacío o con el email "no-es-mail" se muestra un mensaje en español y el modal no pasa al estado de confirmación.
- [ ] AC-10 (R-10): con nombre "Diego Fernández", email "diego.fernandez@gmail.com" y parentesco "Papá", al pulsar "Enviar invitación" el modal muestra un estado de confirmación con el email destinatario y el código, y una acción para volver al perfil.
- [ ] AC-11 (R-11): la tecla Escape y el click fuera de la tarjeta cierran el modal; con un click dentro del modal no se cierra.
- [ ] AC-12 (R-12): el modal replica `pantallas/vincular-padre.dc.html` en colores, tipografías, radios y spacing (tarjeta de 480px, aviso azul, bloque punteado del código, CTA con gradiente terracota).
- [ ] AC-13 (R-13): abrir y cerrar el modal no recarga la página ni pierde el estado del perfil.
- [ ] AC-14 (R-14): `/kids/mateo-fernandez/parents/add` muestra el perfil del niño con el modal abierto, en lugar de la pantalla "Próximamente".
- [ ] AC-15 (R-15): los nombres de archivos, componentes y variables están en inglés y todo el copy visible está en español.
- [ ] AC-16 (NFR-1): la consola del navegador no muestra errores ni warnings al cargar `/kids/[slug]`, abrir y cerrar el modal y enviar la invitación.
- [ ] AC-17 (NFR-2): a 390×844 el modal entra dentro del ancho de la pantalla y no hay scroll horizontal.
- [ ] AC-18 (NFR-3): con las fuentes bloqueadas, el modal mantiene su estructura sin desbordes.
- [ ] AC-19 (BR-1): no existe ningún endpoint, llamada de red ni almacenamiento: la invitación solo produce feedback visual.
- [ ] AC-20 (BR-2): el modal no ofrece la posibilidad de elegir más de un niño ni de vincular a más de un familiar a la vez.
- [ ] AC-21: la captura a 1440×900 del modal abierto es visualmente equivalente a `pantallas/vincular-padre.dc.html` en colores (`#FBF4EC`, `#ECE0D0`, `#E3ECFB`, `#FBF1D6`), tipografías (Fredoka/Nunito) y spacing.

---

## Assumptions and open questions

- **Supuesto:** la medida de fidelidad es la captura desktop a 1440×900 de `pantallas/vincular-padre.dc.html`, adaptando la tarjeta a un modal sobre el perfil.
- **Supuesto:** el modal es invocable desde dos entradas: el click en "Vincular otro padre" y la ruta `/kids/[slug]/parents/add` (deep link).
- **Pregunta abierta:** ¿el código de invitación debería generarse por invitación en el backend y mostrarse en pantalla, o enviarse solo por correo? Se resuelve en la spec de backend.
- **Pregunta abierta:** ¿el familiar invitado debería aparecer en "PADRES VINCULADOS" con estado PENDIENTE al instante de la invitación, o solo después de que active la cuenta? Se resuelve cuando exista backend.

---

## Decisions

- **Sí:** modal sobre el perfil del niño, en lugar de una página independiente. El diseño de referencia no tiene sidebar y el flujo real es una tarea dentro del perfil; el modal conserva el contexto del niño.
- **Sí:** la ruta `/kids/[slug]/parents/add` se mantiene y abre el modal con el perfil detrás, para no perder el deep link ya existente ni obligar a cambiar los enlaces actuales.
- **Sí:** código `7K4P9` y "Vence en 7 días" fijos, como en la referencia; la generación y el vencimiento reales son de otra spec.
- **Sí:** sin persistencia. El envío produce un estado de confirmación en memoria y el perfil del niño no cambia.
- **Sí:** los botones de parentesco son seleccionables y "Mamá" viene preseleccionado, como en la referencia.
- **Sí:** validación en cliente con mensajes en español, coherente con el resto de la app sin backend.
- **No:** convertir la pantalla de referencia en una ruta de página completa con su propio fondo y encabezado.
- **No:** agregar el familiar a `Child.parents` con estado PENDIENTE; eso requiere un modelo de invitaciones.
- **No:** abrir el modal en el primer render del perfil sin que el usuario lo pida.

---

## Risks

| Risk                                                              | Impact | Mitigation                                                                    |
| ----------------------------------------------------------------- | ------ | ----------------------------------------------------------------------------- |
| El modal tapa el perfil y el usuario pierde el contexto del niño  | Medium | El encabezado nombra al niño y el fondo oscurecido deja leer el perfil detrás. |
| Deriva visual respecto de la referencia                            | Medium | Comparación por captura a 1440×900 contra `pantallas/vincular-padre.dc.html`.  |
| Un modal sin URL propia se vuelve inaccesible por teclado         | Low    | Escape cierra el modal y la ruta `/kids/[slug]/parents/add` sirve de deep link.  |
| Confundir el código fijo con un código real y válido              | Medium | Se documenta como BR-1 y no se envía nada; el copy evita prometer un envío real. |
| El formulario de ejemplo se confunde con datos capturados reales | Low    | Placeholders visibles y mock de diseño, sin valores precargados en los campos.  |

---

## What is **not** in this spec

- Backend, endpoints, envío real de correo y persistencia de invitaciones.
- Listado, reenvío, edición o revocación de invitaciones.
- Ingreso del familiar a "PADRES VINCULADOS" con estado PENDIENTE.
- Generación aleatoria del código, vencimiento real y verificación del código por la familia.
- Vincular varios niños o varios familiares en una misma acción.
- Tests automatizados: el repo no tiene runner; la verificación es visual con Playwright.
