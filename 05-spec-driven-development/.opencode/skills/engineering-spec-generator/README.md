# Engineering Spec Generator — Guía de uso (paso a paso)

Sistema de ingeniería guiado por especificaciones (Spec-Driven Development).
Convierte una idea, un bug o una mejora en cuatro artefactos separados y
trazables: `spec.md` (WHAT & WHY), `plan.md` (HOW), `tasks.md` (EXECUTION) y
`retrospective.md` (LEARNINGS), con **compuertas de revisión (review gates)** y
rigor proporcional al riesgo.

> Los principios aplicados son públicos y ampliamente reconocidos (ingeniería de
> software, sistemas, producto y calidad). No se reproduce ninguna metodología
> interna propietaria de ninguna empresa.

---

## 1. Qué necesitás antes de empezar

- Un repositorio (nuevo o existente) donde crear la carpeta `specs/`.
- OpenCode con esta skill instalada (ver sección 2).
- Nada más: la skill no instala dependencias ni toca código durante `spec` y
  `plan`.

---

## 2. Cómo se activa

La skill se descubre automáticamente porque su `description` declara cuándo
usarla. Dos formas de invocarla:

1. **Automática**: pedile algo como *"definamos una spec para la exportación de
   reportes"* y el agente carga la skill.
2. **Manual**: mencionala con `@engineering-spec-generator` en tu prompt.

Ubicación (este repositorio):

```text
.opencode/skills/engineering-spec-generator/
├── SKILL.md
├── README.md
└── references/
```

Si en tu proyecto la skill no aparece, revisá la sección 9 (solución de
problemas).

---

## 3. Flujo completo, paso a paso

El flujo tiene compuertas: **no se avanza a la etapa siguiente sin aprobar la
anterior** (salvo que lo autorices explícitamente).

```text
IDEA / REQUISITO
      |
      v
  DISCOVERY ----> SPEC.md ----[REVIEW GATE]----> PLAN.md ----[REVIEW GATE]----> TASKS.md ----[REVIEW GATE]----> IMPLEMENTACIÓN ----> VERIFICACIÓN ----> RETROSPECTIVE.md ----[CLOSURE GATE]----> CIERRE
```

### Paso 0 — Discovery (`spec init`)
1. Describí la necesidad con tus palabras (idea, bug o mejora).
2. El agente te hará **una pregunta a la vez** (máximo ~6) para resolver
   ambigüedades y clasificará el riesgo (`LIGHT` / `STANDARD` / `CRITICAL`).
3. Al terminar, se crea la carpeta `specs/<nombre-feature>/`.

### Paso 1 — SPEC (`spec generate`)
1. El agente redacta `spec.md` con: contexto, problema, usuarios, objetivos,
   hipótesis, métricas de éxito, alcance incluido/excluido, historias, `FR/NFR/BR`,
   casos límite, restricciones, dependencias, criterios de aceptación (`AC`),
   riesgos y preguntas abiertas.
2. Los requisitos usan EARS cuando aporta claridad (ver
   `references/ears-requirements.md`).
3. **GATE SPEC** (`spec review`): se audita la spec. Debe dar `PASS` para
   continuar. Si da `FAIL`, se corrigen los hallazgos puntuales sin regenerar todo.

### Paso 2 — PLAN (`plan generate`)
1. Con la spec aprobada, el agente **inspecciona el repositorio** (arquitectura,
   stack, convenciones, módulos, persistencia, auth, seguridad, tests,
   dependencias, infra, límites) y registra lo que efectivamente vio.
2. Redacta `plan.md`: resumen técnico, estado actual, arquitectura propuesta,
   componentes, archivos afectados, contratos, cambios de datos, migración,
   validaciones y seguridad, riesgos, alternativas, trade-offs, estrategia de
   implementación y de pruebas, rollback y criterios de cierre.
3. Cada afirmación técnica se etiqueta: `[Confirmed]`, `[Inferred]`,
   `[Proposed]` o `[To-verify]`.
4. Las decisiones importantes se registran como **ADR simplificado**.
5. **GATE PLAN** (`plan review`).

### Paso 3 — TASKS (`tasks generate`)
1. El agente descompone la solución en tareas pequeñas (`TASK-nnn`) ordenadas por
   dependencia, cada una con objetivo, requisitos, pasos, pruebas, criterios de
   aceptación y "Done when".
2. Estados permitidos: `TODO`, `IN_PROGRESS`, `BLOCKED`, `DONE`.
3. Se construye la **matriz de trazabilidad** `Requisito → AC → Tarea → Test`.
4. **GATE TASKS** (`tasks review`): ningún requisito sin tarea, ningún `AC` sin
   test.
5. Para saber por dónde seguir: `tasks next` → devuelve la primera tarea
   desbloqueada y no `DONE`.

### Paso 4 — Implementación y verificación
1. Implementás (humano o agente) siguiendo `tasks.md`.
2. Cada tarea pasa a `DONE` **solo con evidencia** (comando, test, archivo).
3. Si aparece un impedimento, se registra como `BLOCKED` (no se inventa una
   solución).
4. **GATE IMPLEMENTATION**: código consistente con el plan, pruebas ejecutadas,
   sin regresiones sin documentar, seguridad validada según perfil.

### Paso 5 — Retrospectiva y cierre (`retrospective generate`)
1. Se documenta `retrospective.md`: objetivo, alcance real, tareas hechas y
   pendientes, decisiones, desviaciones, problemas, causa raíz, soluciones,
   pruebas ejecutadas, resultados, riesgos residuales, deuda técnica,
   aprendizajes, mejoras y estado final.
2. Estado final: `COMPLETED`, `PARTIALLY_COMPLETED`, `BLOCKED` o `FAILED`.
3. **GATE CLOSURE**: evidencias registradas, retrospectiva terminada, riesgos
   residuales documentados y repositorio en estado conocido.

---

## 4. Modos de operación (frases que los activan)

| Modo | Frase típica | Resultado |
| ---- | ------------ | --------- |
| `spec init` | "Empecemos a definir X" | Carpeta `specs/<x>/` + preguntas de discovery |
| `spec generate` | "Generá la spec" | `spec.md` |
| `spec review` | "Revisá/auditá la spec" | Veredicto del SPEC Gate |
| `plan generate` | "Generá el plan" | `plan.md` |
| `plan review` | "Revisá el plan" | Veredicto del PLAN Gate |
| `tasks generate` | "Generá las tasks" | `tasks.md` |
| `tasks review` | "Revisá las tasks" | Veredicto del TASKS Gate |
| `tasks next` | "¿Cuál es la próxima task?" | Primera tarea desbloqueada |
| `retrospective generate` | "Cerremos la fase" | `retrospective.md` |
| `phase audit` | "¿Dónde estamos?" | Veredicto de cada gate + pendientes |

Los nombres son etiquetas de intención, no una CLI real.

---

## 5. Perfiles de riesgo (rigor proporcional)

Se clasifican según impacto, reversibilidad, superficie afectada y probabilidad
de falla (ver `references/risk-assessment.md`):

- **LIGHT**: arreglos pequeños y aislados. Spec de una página, gates recortados.
- **STANDARD**: funcionalidades nuevas, cambios de módulos. Flujo completo.
- **CRITICAL**: auth, pagos, datos sensibles, migraciones destructivas, infra.
  Todo lo anterior + plan de rollback y sección de verificación vs validación.

No conviertas un cambio pequeño en un procedimiento aeroespacial.

---

## 6. Dónde quedan los artefactos

```text
specs/
  <nombre-feature>/
    spec.md
    plan.md
    tasks.md
    retrospective.md
```

El cuerpo de los artefactos va en tu idioma (por defecto español); los
identificadores y el código quedan en inglés.

---

## 7. Reglas que la skill respeta siempre

- Inspecciona antes de proponer; no supone archivos ni APIs.
- No inventa resultados de tests, métricas, commits ni despliegues.
- No amplía el alcance en silencio.
- No modifica código ni instala dependencias en `spec`/`plan`.
- No hace commit, push ni deploy sin autorización explícita.
- Prefiere reutilizar y simplificar; evita sobreingeniería.
- Nunca declara `PASS` con verificaciones pendientes.

---

## 8. Validar que la skill funciona

1. **Aparece en la lista**: pedile al agente "¿qué skills tenés disponibles?" o
   mencioná `@engineering-spec-generator`.
2. **Prueba de humo**: sobre una spec existente, pedí "revisá la spec" y verificá
   que devuelve un veredicto con hallazgos concretos.
3. **Auditoría propia**: pedí "auditá la skill engineering-spec-generator"; se
   ejecuta `references/skill-checklist.md` y devuelve `PASS/FAIL` por bloque.

---

## 9. Solución de problemas

| Síntoma | Causa probable | Solución |
| ------- | -------------- | -------- |
| La skill no aparece | Falta `description` o `autoinvoke: false` | Revisar frontmatter de `SKILL.md` |
| Aparece otra versión | Otro origen con el mismo ID tiene más precedencia | Verificar duplicados en `.claude/skills`, `.agents/skills`, `~/.config/opencode/skills` |
| No carga al pedirla | Permisos `skill` | Revisar reglas `permissions` con `action: "skill"` |
| El ID no coincide | El ID deriva de la ruta, no del `name` | Usar `engineering-spec-generator` (carpeta) |
| El agente escribe código antes de tiempo | Se saltó un gate | Recordar que `spec`/`plan` no tocan código |

---

## 10. Archivos de la skill

- `SKILL.md` — instrucciones principales (se cargan al activar la skill).
- `README.md` — esta guía.
- `references/spec-template.md` — plantilla de `spec.md`.
- `references/plan-template.md` — plantilla de `plan.md`.
- `references/tasks-template.md` — plantilla de `tasks.md`.
- `references/retrospective-template.md` — plantilla de `retrospective.md`.
- `references/ears-requirements.md` — patrones EARS y anti-patrones.
- `references/quality-gates.md` — compuertas y veredictos.
- `references/risk-assessment.md` — perfiles y registro de riesgos.
- `references/example-search-filter.md` — ejemplo completo de una feature pequeña.
- `references/skill-checklist.md` — autovalidación de la skill.
