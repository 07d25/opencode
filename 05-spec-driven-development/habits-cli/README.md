# Proyecto: `habits-cli`

Una app de terminal en Bun + TypeScript para registrar hábitos de estudio y ver tu racha de días consecutivos.

## Comandos

```
habits-cli crear "estudiar python"      → crea un hábito
habits-cli hecho "estudiar python"      → marca el hábito como hecho HOY
habits-cli desmarcar "estudiar python"  → quita la marca de HOY
habits-cli listar                       → lista hábitos con sus métricas
habits-cli renombrar <actual> <nuevo>   → renombra un hábito
habits-cli eliminar "estudiar python"   → elimina un hábito (pide confirmación)
```

## Estructura del proyecto

```
habits-cli/
├── AGENTS.md
├── README.md
├── docs/
│   └── constitution.md             # 6 principios innegociables
├── specs/
│   └── 001-habits-mvp/
│       ├── spec.md                 # RF-1..RF-6 en EARS (Implemented)
│       ├── plan.md                 # módulos, datos, contrato CLI
│       ├── tasks.md                # T-01..T-13 (todas [x])
│       └── retrospective.md        # lecciones + bugs del ciclo
├── src/
│   ├── core.ts                     # núcleo puro, sin I/O
│   ├── cli.ts                      # capa fina de presentación
│   └── storage.ts                  # JSON atómico y validado
├── test/
│   ├── core.test.ts
│   ├── storage.test.ts
│   └── cli.test.ts
└── tsconfig.json
```

## Uso

```bash
bun run src/cli.ts crear "Estudiar Python"    # crea el hábito
bun run src/cli.ts hecho "Estudiar Python"    # lo marca como hecho HOY (idempotente)
bun run src/cli.ts desmarcar "Estudiar Python"
bun run src/cli.ts listar                     # tabla: Racha / Hoy / Días / Máx / % con barra
bun run src/cli.ts renombrar "Leer" "Estudiar"
bun run src/cli.ts eliminar "Estudiar"        # pide confirmación (s/sí)
```

Los datos se guardan en un único JSON legible: `~/.habits-cli.json`
(sobrescribible por tarea con la variable de entorno `HABITS_FILE`; el archivo no
vive en el repo: son datos personales).
Fechas en `dd-mm-aaaa`. Salidas: `0` si todo va bien, `1` ante cualquier error
(nombre vacío, duplicado, hábito inexistente o archivo corrupto). **Un archivo
corrupto nunca se sobrescribe.**

## Desarrollo

```bash
bun test            # suite completa (55 pruebas en 3 archivos)
```

Herramientas de tipado y formato se usan de forma efímera (respetando la
constitución, sin dependencias):
`bunx tsc --noEmit` y `bunx prettier --write src test`.

## Prompts SDD (el flujo que seguimos, en orden)

### 1. Setup, constitución

```text
Vamos a crear la constitución de un proyecto nuevo: una CLI en Bun + TS para
registrar hábitos de estudio y calcular rachas. Es un proyecto educativo que
debe poder mantener un desarrollador junior. Proponme un docs/constitution.md
con 6 principios innegociables, cortos y verificables... Máximo 15 líneas.
Espera mi aprobación.
```

### 2. Especificación

```text
NO escribas código en ningún momento. Vamos a redactar la especificación de
la primera funcionalidad de habits-cli. Lee docs/constitution.md. Idea inicial:
tres comandos (crear, marcar como hecho hoy, listar con racha).
1) Hazme preguntas de UNA en UNA para eliminar ambigüedades (máx. 6).
2) Genera specs/001-habits-mvp/spec.md con: contexto, usuarios, historias,
   RF-x con criterios EARS, RNF, casos límite, fuera de alcance, criterios de
   finalización y dudas abiertas [NECESITA ACLARACIÓN].
3) El QUÉ y el POR QUÉ; nada de stack ni nombres de archivos.
```

### 3. QA de la spec

```text
Revisa specs/001-habits-mvp/spec.md como si fueras un QA muy profesional.
Lista: (1) ambigüedades restantes, (2) contradicciones entre requisitos,
(3) casos límite no cubiertos, (4) conflictos con docs/constitution.md.
No propongas soluciones todavía: solo detecta. Formato: lista numerada.
```

### 4. Planificación

```text
Lee docs/constitution.md y specs/001-habits-mvp/spec.md. NO escribas código.
Genera specs/001-habits-mvp/plan.md con: estructura de módulos, modelo de
datos JSON con ejemplo, algoritmo de racha en pseudocódigo, contrato de la
CLI (comandos, salidas, códigos de salida), decisiones técnicas justificadas
(con su alternativa descartada), y estrategia de tests. Marca qué RF cubre cada parte.
```

### 5. Tareas

```text
A partir de spec.md y plan.md, genera specs/001-habits-mvp/tasks.md:
tareas pequeñas (máx. 20-30 min), en orden de dependencia, con RF cubiertos
y una línea "Hecho cuando:" verificable. Usa checkboxes.
```

### 6. Implementación tarea a tarea

```text
Implementa SOLO la tarea T2 de specs/001-habits-mvp/tasks.md, siguiendo
plan.md y la constitución. Escribe primero los tests, luego el código.
Ejecuta bun test y muéstrame el resultado. Al terminar: marca T2 en tasks.md,
indica qué RF cubre y PÁRATE. No empieces T3.
```

### 7. Validación final

```text
Recorre specs/001-habits-mvp/spec.md requisito por requisito (RF-1 a RF-6).
Para cada uno indica: qué test lo cubre y el resultado de ejecutarlo.
Si algún RF no está cubierto o falla, dilo claramente. Después comprueba los
criterios de finalización y dame un veredicto: ¿la spec está cumplida?
```

### 8. Cierre de la spec

```text
Aplica las buenas prácticas de SDD para cerrar: cambia el Registro de cambios
a Implemented con evidencia y crea specs/001-habits-mvp/retrospective.md
(bugs, decisiones no anticipadas, aprendizajes). Verifica bun test, tsc y repo limpio.
```

*(pasos ya ejecutados: spec 001 está en `Implemented` con retrospectiva escrita)*

## Estado actual

✅ **Spec 001 completada e implementada**: 13/13 tareas, 55 pruebas en verde,
ciclo manual verificado y retrospectiva registrada.

## Próximo paso — Spec 002

Siguiente requisito propuesto (estaba Fuera de alcance en el MVP):

> **Marcar días pasados**: registrar como hecho un día anterior que se olvidó,
> con `hecho "<nombre>" --fecha DD-MM-AAAA` (y su desmarcar), para no perder la
> racha por un descuido.

Prompt para arrancar la siguiente spec con el mismo flujo:

```text
NO toques código ni specs existentes. Nuevo requisito para habits-cli:
marcar como hecho un día pasado con un argumento de fecha explícita
(kebab-case del comando a definir en la spec). Empieza specs/002-historial/
con spec.md nueva, siguiendo el mismo flujo: preguntas UNA a UNA (máx. 6),
EARS en español, casos límite (¿y si el día ya estaba marcado? ¿afecta a la
racha actual y al porcentaje?), fuera de alcance y criterios de finalización.
Espera mi aprobación antes de cualquier otra cosa.
```
