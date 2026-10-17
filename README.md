# opencode

Repositorio de aprendizaje. Cada proyecto vive como carpeta en `main`:

- **`01-OpenCode101/`** — Página web de introducción a OpenCode.
- **`02-app-de-consola/`** — Weather CLI con arquitectura por capas y suite de tests (TypeScript + Bun).
- **`03-asteroids/`** — Clon de Asteroids en canvas HTML5; incluye los power-ups Triple Shot, Skins y Shields.
- **`04-mis-skills/`** — Miscelánea de skills.
- **`05-spec-driven-development-open-pacman/`** — Clon de Pac-Man (Spec Driven Development).

---

## Spec Driven Development (SDD)

Enfoque en el que **primero se define una especificación (spec)** y luego se implementa contra ella. La spec es el contrato que guía la ejecución: si es vaga, el código improvisa. Por eso la fase de definición es deliberadamente lenta y la de escritura, rápida.

### Qué se necesita

- Un agente de código compatible (Claude Code, Codex, Gemini CLI, OpenCode, etc.) con soporte de **skills**.
- La carpeta `.agents/skills/` con dos skills:
  - `spec/` — diseña la spec (pregunta, clarifica, escribe sección por sección).
  - `spec-impl/` — implementa una spec ya **aprobada**.
- Una carpeta `specs/` donde se guardan las specs numeradas (`01-...md`, `02-...md`).
- Archivo opcional `specs/.spec-config.yml` (auto-creado) con `AutoCreateBranch` (por defecto `true`).
- Memoria del proyecto: `CLAUDE.md`, `AGENTS.md`, `GEMINI.md` o `README.md` (el skill lee el primero que exista).

### Paso a paso para construir

1. **Contexto (Phase 1).** El skill lee la memoria del proyecto y las specs existentes para adaptarse a convenciones y lenguaje.
2. **Clarificar (Phase 2).** Se hacen preguntas en bloques de 3–5 sobre alcance, datos, integración, persistencia, UX/estados, riesgos y decisiones cerradas. Se para cuando se puede responder: qué archivos cambian, cuál es el primer y último paso, y cómo se verifica el fin.
3. **Escribir la spec (Phase 3).** Si hay toda la info, se escribe completa y se guarda; si falta, se va sección por sección. Estructura: header (estado, dependencias, fecha, objetivo en una frase) → alcance (dentro/fuera) → modelo de datos → plan de implementación (pasos atómicos) → criterios de aceptación (checklist booleano) → decisiones tomadas/descartadas → riesgos → qué NO entra.
4. **Guardar (Phase 4).** Numeración secuencial, slug kebab-case, estado `Draft`. Se crea `specs/.spec-config.yml` si no existe. No se marca como `Approved` automáticamente.
5. **Aprobar.** El humano relee y cambia el estado a `Approved` (o equivalente).
6. **Implementar (`/spec-impl NN-slug`).** Valida que el estado sea "Approved", crea la rama `spec-NN-slug`, muestra resumen (objetivo, alcance, plan, criterios) y ejecuta paso a paso con pausas para revisar diffs. Nunca commitea automáticamente.
7. **Cerrar.** Verificar criterios de aceptación, actualizar estado a "Implemented" y hacer el commit/merge.

### Qué hace `.agents/`

La carpeta `.agents/` (en `05-spec-driven-development-open-pacman/.agents/`) contiene las **skills** que automatizan el flujo SDD:

- `.agents/skills/spec/SKILL.md` — skill `/spec`: diseña la spec (preguntas + escritura + guardado).
- `.agents/skills/spec/template.md` — plantilla de referencia para la estructura de una spec.
- `.agents/skills/spec-impl/SKILL.md` — skill `/spec-impl`: valida estado "Approved", crea rama e implementa paso a paso.

En resumen: `.agents/` es la configuración del agente que define cómo se diseña e implementa cada spec del proyecto.

### Reglas duras del flujo

- No se escribe código durante `/spec`, solo el archivo `.md`.
- No se asumen decisiones no confirmadas por el usuario.
- Si algo queda fuera del alcance, se anota para otra spec, no se implementa "de paso".
- Cada paso del plan debe dejar el sistema funcional y ser commiteable por sí solo.
