# SPEC 001 — Feed del staff como Home (`/`)

> **Status:** Implemented
> **Depends on:** ninguna
> **Date:** 2026-10-19
> **Objective:** Reemplazar la página de bienvenida de Nuxt por una réplica visual del feed del staff de `pantallas/feed.dc.html` en `/`, con Tailwind v4, datos mock y sin funcionalidades.

---

## Alcance

**In:**

- Ruta `/` (Home) que renderiza el feed del staff con aspecto idéntico a `pantallas/feed.dc.html`.
- Contenido idéntico al de la referencia: mismos textos, nombres, fechas, etiquetas, contadores y "Compartí un momento…".
- Descomposición en componentes Vue bajo `app/components/`.
- Datos mock estáticos en `app/data/` que reproducen el contenido de la referencia.
- Tailwind CSS v4 con tokens `@theme` equivalentes a la paleta y tipografías del diseño.
- Fredoka y Nunito desde Google Fonts (preconnect + stylesheet), igual que la referencia.
- Iconografía provista por la librería Lucide (`@lucide/vue`), con imports tree-shakeable.
- Adaptación móvil: sidebar oculto y feed a ancho completo.

**Out of scope (para futuras specs):**

- Autenticación, sesión y login/logout (los enlaces del sidebar quedan solo visuales).
- Backend, base de datos, seed y endpoints (no hay `server/api/`).
- Navegación funcional: ningún enlace cambia de ruta o abre página inexistente.
- Otras pantallas del catálogo (`ninos`, `avisos`, `mi-cuenta`, `crear-publicacion`, `detalle-publicacion`, `foto`, `index`).
- Interacciones reales (crear/editar, likes, comentarios, fotos): solo visuales.
- Tablet y tamaños intermedios por debajo del breakpoint móvil definido.

---

## Requisitos

| ID  | Requisito                                                                                                                                          | Prioridad |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| R-1 | `/` muestra el layout del feed: sidebar izquierdo de 248px, botón "Nueva publicación", nav (Feed/Niños/Avisos/Mi cuenta) y usuario "Caro Giménez". | Must      |
| R-2 | El panel principal muestra "GUARDERÍA · SALA SOLES", "Buenas, Caro" y el subtítulo "12 niños · martes 17 jun".                                     | Must      |
| R-3 | Se muestra el prompt "Compartí un momento…" con avatar "C" e ícono de cámara.                                                                      | Must      |
| R-4 | Se muestra el separador "PUBLICADO HOY" con línea horizontal a su derecha.                                                                         | Must      |
| R-5 | Se listan 3 publicaciones: LOGRO (Mateo 14:20, 3 likes/1 comentario), ACTIVIDAD (Mateo 09:40, 5/2) y ANUNCIO (07:50, 8/0).                         | Must      |
| R-6 | Cada publicación muestra avatar, nombre del niño, hora, "publicado por vos", badge de tipo y destinatario ("familia de Mateo"/"toda la sala").     | Must      |
| R-7 | La publicación ACTIVIDAD incluye el placeholder de foto punteado de 200px con caption "Foto · pintando con témperas".                              | Must      |
| R-8 | El footer de cada publicación muestra like (corazón), contador de comentarios y "Editar" en `#C5503A`.                                             | Must      |
| R-9 | Tipografía idéntica: Fredoka para encabezados/avatares y Nunito para el cuerpo, desde Google Fonts.                                                | Must      |
| R-10 | Los iconos provienen de la librería Lucide (`@lucide/vue`), con el mismo trazo y tamaño que la referencia.                                           | Must      |

---

## Requisitos de seguridad y no funcionales

- **Autorización:** no aplica — no hay auth ni sesiones; la ruta es pública y sin estado.
- **Validación de entrada:** no aplica — no hay inputs funcionales ni endpoints.
- **Secretos:** no aplica — no hay credenciales; dependencia externa solo al CDN de Google Fonts.
- **PII / datos personales:** solo nombres de pila ("Mateo", "Caro Giménez"), estáticos en el bundle.
- **Rate limiting / abuso:** no aplica — no hay endpoints.
- **Audit trail:** no aplica — el mock no registra acciones.
- **Rendimiento (NFR-1):** `/` carga sin errores en consola; fuentes con `display=swap`.
- **Disponibilidad (NFR-2):** si el CDN de fonts falla, se renderiza con fuentes del sistema sin romper el layout.

---

## Modelo de datos

```ts
// app/types/feed.ts
export type FeedPostType = "achievement" | "activity" | "announcement";

export interface FeedUser {
  name: string;
  initials: string;
  role: string;
}

export interface FeedPost {
  id: string;
  type: FeedPostType;
  childName: string | null; // null para el anuncio general
  time: string;
  publisherLabel: string;
  recipient: string;
  content: string;
  photoCaption?: string;
  likes: number;
  comments: number;
}

// app/data/PublicacionesMock.ts — mock estático (sin base de datos ni seed)
export const currentTeacher: FeedUser = {
  name: "Caro Giménez",
  initials: "C",
  role: "Maestra · Soles",
};
export const feedMeta = {
  room: "Sala Soles",
  greeting: "Buenas, Caro",
  subtitle: "12 niños · martes 17 jun",
};
export const feedPosts: FeedPost[] = [
  /* 3 publicaciones exactas de la referencia */
];
```

Fuente única de verdad para textos y colores: `pantallas/feed.dc.html`. El mock copia ese contenido literal, en español.

**Convención de idioma:** código, tipos, componentes, props, funciones y variables en inglés; comentarios de código en español; el nombre del archivo mock va en español (`PublicacionesMock.ts`); el contenido visible es el de la referencia, en español.

---

## Contratos e interfaces

| Contrato | Dirección | Entrada | Salida | Errores |
| -------- | --------- | ------- | ------ | ------- |
| Ninguno  | —         | —       | —      | —       |

No hay APIs, eventos ni comandos nuevos. Props internos de `app/components/` (`post: FeedPost`, etc.).

---

## Modos de falla y degradación

- **CDN de Google Fonts caído:** cae a la fuente del sistema; el layout no se rompe.
- **Error de build de Tailwind:** se detecta en `npm run dev`; sin fallback silencioso.
- **Sin dependencias dinámicas:** no hay fetches ni estado susceptible de inconsistencia.

---

## Criterios de aceptación

- [x] AC-1 (R-1): `/` muestra sidebar de 248px con logo "OpenDayCare", subtítulo "Sala Soles", 4 ítems de nav con "Feed" activo y bloque inferior con avatar "C", "Caro Giménez", "Maestra · Soles" e ícono de salida.
  - Evidencia: asideWidth 248px, asideDisplay flex, textos presentes, icono LogOut renderizado (Lucide). Playwright desktop 1440×900, consola limpia.
- [x] AC-2 (R-2): el header principal muestra "GUARDERÍA · SALA SOLES", "Buenas, Caro" y "12 niños · martes 17 jun" con jerarquía y colores del diseño.
  - Evidencia: h1 font Fredoka 30px, color #3F362E, kicker #D9583C, subtítulo #94887B. Todos los textos presentes en DOM.
- [x] AC-3 (R-3): se ve el pill "Compartí un momento…" con avatar coral y botón de cámara.
  - Evidencia: pill bg #FFFDF9, avatar tono coral, texto presente, icono Camera de @lucide/vue (size 19).
- [x] AC-4 (R-4): la línea "PUBLICADO HOY" tiene separador horizontal que ocupa el resto del ancho.
  - Evidencia: texto "PUBLICADO HOY" presente, línea flex-1 h-px bg-divider (#E7DAC8).
- [x] AC-5 (R-5/R-6): las 3 tarjetas mantienen orden (LOGRO, ACTIVIDAD, ANUNCIO), avatares, badges con su color/borde y destinatarios correctos.
  - Evidencia: cardCount 3, orden LOGRO→ACTIVIDAD→ANUNCIO, badges mint/sky/royal con colores correctos, destinatarios "familia de Mateo"/"toda la sala".
- [x] AC-6 (R-7): la card de actividad muestra el bloque de foto punteado de 200px con su caption literal.
  - Evidencia: photoHeight 200px, bg #F4ECE1, border-dashed, caption "Foto · pintando con témperas".
- [x] AC-7 (R-8): cada footer de card muestra corazón coral `#E0654A`, contador de comentarios y "Editar" en `#C5503A`.
  - Evidencia: heartColor #E0654A, editarColor #C5503A, contadores de likes/comentarios presentes.
- [x] AC-8 (NFR-1): la consola del navegador no muestra errores ni warnings al cargar `/`.
  - Evidencia: navegación limpia, 0 errores, 0 warnings (verify-console-errors-clean.log / warnings-clean.log).
- [x] AC-9 (NFR-2): bloqueando las fuentes, la página mantiene su estructura sin desbordes.
  - Evidencia: `display=swap` en stylesheet de Google Fonts, fallback sistema, sin overflow horizontal (scrollWidth===clientWidth), bodyBg #F6ECDF.
- [x] AC-10 (R-9): captura en 1440×900 visualmente equivalente a la referencia (fondo `#F6ECDF`, cards `#FFFDF9` con borde `#ECE0D0`, Fredoka/Nunito).
  - Evidencia: bodyBg rgb(246,236,223), cardBg rgb(255,253,249), cardBorder rgb(236,224,208), h1Font Fredoka/Nunito. Captura .playwright-mcp/verify-feed-desktop.png equivalente a screenshots/feed.png.
- [x] AC-11: a breakpoint móvil (≤640px) el sidebar desaparece y el feed ocupa todo el ancho sin scroll horizontal.
  - Evidencia: móvil 390×844 asideDisplay none, scrollWidth===clientWidth===380, sin scroll horizontal. Captura .playwright-mcp/verify-feed-mobile.png.
- [x] AC-12 (R-10): todos los iconos de la pantalla provienen de `@lucide/vue` (imports tree-shakeable) y se renderizan con el tamaño y color de la referencia.
  - Evidencia: 16 SVG de Lucide en DOM (Sun, Plus, House, Users, Bell, UserRound, LogOut, Camera, Heart, MessageCircle, Megaphone, Image, etc.), imports directos de `@lucide/vue`, sin componentes SVG propios. Desviación (a) documentada: paths no idénticos a SVG inline de la referencia (aceptado).

---

## Supuestos y preguntas abiertas

- **Supuesto:** la medida de fidelidad desktop es la captura de la referencia en 1440×900; el HTML de `pantallas/feed.dc.html` es la fuente literal de textos y colores.
- **Supuesto:** el ancho máximo del contenido (760px) y sus paddings se replican con utilidades Tailwind, sin CSS ad-hoc fuera de tokens y clases.
- **Pregunta abierta:** ¿se requiere modo oscuro u otras variables de tema? Out de esta spec.

---

## Decisiones tomadas y descartadas

- **Sí:** Tailwind CSS v4 con tema CSS-first (`@theme` en `app/assets/css/main.css`) e integración mediante el plugin oficial de Vite — es la versión pedida y evita `tailwind.config.ts`.
- **No:** `@nuxtjs/tailwindcss` de comunidad para v4 — duplica integración con el plugin oficial de Vite.
- **No:** Nuxt UI — su design system chocaría con la réplica visual.
- **Sí:** mock como módulos TS estáticos en `app/data/PublicacionesMock.ts` — sin DB ni seed; reemplazable por `useFetch` más adelante.
- **No:** seed de base de datos — no existe backend ni DB en este alcance.
- **Sí:** descomposición en componentes (`FeedSidebar`, `FeedHeader`, `CreatePostPrompt`, `PostBack`, etc.).
- **Sí:** convención de idioma acordada: código/identificadores en inglés, comentarios de código en español y nombre del mock en español (`app/data/PublicacionesMock.ts`).
- **No:** motor de theming genérico — el objetivo es fidelidad y claridad.
- **Sí:** verificación con Playwright MCP en 1440×900 comparando contra `pantallas/feed.dc.html`.
- **Sí:** links del sidebar sin rutas funcionales, para no sembrar 404s.
- **Sí:** iconografía desde la librería Lucide (`@lucide/vue`) con imports tree-shakeable — cubre los 12 iconos del diseño y el logo del sol, cuyo path coincide con el ícono `Sun` de Lucide.
- **No:** componentes SVG propios para los iconos — duplica lo que Lucide ya resuelve y multiplica el mantenimiento.

---

## Riesgos

| Riesgo                                           | Impacto | Mitigación                                                                     |
| ------------------------------------------------ | ------- | ------------------------------------------------------------------------------ |
| Deriva visual de spacing/bordes                  | Medio   | Comparación por captura en 1440×900 durante `/spec-impl` y en `spec-verifier`. |
| Token de color mal mapeado                       | Medio   | Tabla de tokens `@theme` derivada 1:1 del HTML; revisión en plan.              |
| Breakpoint móvil definido a ojo                  | Bajo    | Breakpoint explícito (`640px`) acordado en la spec.                            |
| Dependencia del CDN de fonts en entornos sin red | Bajo    | `display=swap` + fallback del sistema; no bloquea la pintura.                  |

---

## Qué **no** entra en esta spec

- Auth/sesión y pantallas de login/logout.
- Backend, DB, seed y `server/api/`.
- Navegación entre pantallas del catálogo.
- Interacciones reales (crear/editar, likes, comentarios, fotos).
- Dark mode, theming adicional, tablet.
- Test suite automatizada (no hay framework de tests; verificación visual con Playwright + consola).

Cada uno de esos puntos, si aterriza, va en su propia spec.
