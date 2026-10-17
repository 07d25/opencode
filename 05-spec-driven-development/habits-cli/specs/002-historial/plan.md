# Plan 002 — historial (marcar días pasados)

Referencias: `specs/002-historial/spec.md`, `docs/constitution.md` y la spec 001 ya
implementada (`specs/001-habits-mvp/`).
Identificadores en inglés; mensajes al usuario en español (principio 6).

## 1. Estructura de módulos (cambios sobre lo existente)

| Módulo | Cambio | Cobertura |
|---|---|---|
| `src/core.ts` | Ampliar `HabitError` con `invalid-date`, `future-date`, `today-not-allowed`, `before-creation`. Nueva función pura `setDoneOn(habits, name, date, today, done)` con las validaciones de fecha. Se conservan `setDoneToday`, `createHabit`, `renameHabit`, `deleteHabit` y `calculateMetrics` sin cambios. | RF-1, RF-2, RF-3, RF-4 |
| `src/cli.ts` | Parseo de `--fecha` en `hecho`/`desmarcar`; nuevos mensajes; mapa `ERROR_MESSAGES` ampliado. El resto de comandos no cambia. | RF-1, RF-2, RF-3 |
| `src/storage.ts` | Sin cambios: ya valida fechas `dd-mm-aaaa` reales y el rango `[createdOn, hoy]`. | RNF persistencia |
| `test/core.test.ts` | Nuevas pruebas de `setDoneOn`. | RF-1..RF-4 |
| `test/cli.test.ts` | Nuevas pruebas de integración con `--fecha`. | RF-1..RF-3 |

No se rompe ningún RF de la spec 001: `setDoneToday` y el comportamiento sin
`--fecha` permanecen intactos.

## 2. Modelo de datos JSON (sin cambios de formato)

```json
[
  {
    "name": "Leer",
    "createdOn": "10-10-2026",
    "completions": ["08-10-2026", "14-10-2026", "15-10-2026"]
  }
]
```

- `completions` puede contener días pasados (incluido el día de creación); nunca
  fechas futuras ni anteriores a `createdOn` (RF-2 y validación de carga de 001).
- Formato `DD-MM-AAAA`; comparaciones por ordinal interno (spec 001, Cambio 2).

## 3. Algoritmo: elegibilidad de la fecha (pseudocódigo)

```
# Validación previa a aplicar el cambio (RF-2), en el core
función set_done_on(hábitos, nombre, fecha, hoy, hecho) -> resultado:
    índice ← buscar_hábito(hábitos, nombre)          # case-insensitive
    si índice = -1: devolver error "not-found"        # RF-2
    si parseDate(fecha) = nulo: devolver error "invalid-date"        # RF-1
    f ← ordinal(fecha) ; t ← ordinal(hoy) ; c ← ordinal(createdOn)
    si f > t:  devolver error "future-date"            # RF-2
    si f = t:  devolver error "today-not-allowed"      # RF-2
    si f < c:  devolver error "before-creation"        # RF-2
    ya ← completions contiene fecha
    si ya = hecho: devolver { changed: false }         # RF-3 idempotente
    si hecho: añadir fecha ; si no: quitar fecha
    devolver { changed: true }

# Las métricas NO cambian de algoritmo: calculateMetrics ya recalcula
# desde el historial completo (racha, más larga, total y porcentaje).  # RF-4
```

Nota: el denominador del porcentaje (`hoy − createdOn + 1`) no depende de los
registros, por lo que marcar días pasados solo aumenta el numerador (RF-4).

## 4. Contrato de la CLI (ampliación)

| Comando | Argumentos | Salida en éxito | Código |
|---|---|---|---|
| `hecho "<n>" --fecha <f>` | nombre + `--fecha` | `Hábito "<n>" marcado como hecho en <f>.` | 0 |
| `hecho "<n>" --fecha <f>` (ya marcado) | nombre + `--fecha` | `Hábito "<n>" ya estaba marcado ese día.` | 0 |
| `desmarcar "<n>" --fecha <f>` | nombre + `--fecha` | `Hábito "<n>" desmarcado para <f>.` | 0 |
| `desmarcar "<n>" --fecha <f>` (no marcado) | nombre + `--fecha` | `Hábito "<n>" no estaba marcado ese día.` | 0 |
| `hecho` / `desmarcar` sin `--fecha` | nombre | igual que la spec 001 (HOY) | 0 |

`--fecha` se acepta como `--fecha <valor>` y como `--fecha=<valor>`. El nombre
puede llevar espacios si va entre comillas y debe ser exactamente un argumento;
`--fecha` nunca forma parte del nombre (caso límite de la spec).

Errores nuevos (código 1, datos intactos) — RF-1, RF-2:

```
Uso: habits-cli <crear|hecho|desmarcar|listar|renombrar|eliminar> ...   # --fecha sin valor o args sobrantes
Error: la fecha "<f>" no es válida. Usa el formato DD-MM-AAAA.
Error: la fecha de hoy se registra con "hecho <nombre>" sin --fecha.
Error: no se puede registrar una fecha futura.
Error: la fecha es anterior a la creación del hábito.
```

## 5. Decisiones técnicas (justificadas)

| Decisión | Alternativa descartada | Justificación |
|---|---|---|
| Función nueva `setDoneOn` separada de `setDoneToday` | Parametrizar `setDoneToday` con una fecha opcional | Mantiene intacto el camino de HOY y sus pruebas de la spec 001; cada función valida solo lo suyo |
| Reutilizar `HabitResult` e inferir el mensaje idempotente desde `done` + `changed` | Añadir un campo `outcome` a `HabitResult` | `HabitResult` es comparado con `toEqual` en la spec 001; añadir campos rompería esas pruebas. La CLI ya conoce `done`, así que `changed=false` basta para elegir el mensaje |
| Validación de fecha en el core (pura) | Validar en la CLI | El core es 100% testeable sin I/O (principio 3) y concentra las reglas de negocio (RF-2) |
| Reutilizar `parseDate`/`toOrdinal` | Parsear la fecha de nuevo en otro módulo | Evita duplicar la validación de formato y de calendario real ya probada en 001 |
| `--fecha` aceptado en forma `--fecha <v>` y `--fecha=<v>` | Solo una de las dos formas | Es habitual en CLI y no añade complejidad; ambas se cubren con pruebas |
| No detectar errores de fecha en `storage` | Añadir reglas nuevas de carga | La carga de 001 ya rechaza fechas fuera de `[createdOn, hoy]`; no hace falta tocarla |
| Mensajes nuevos en `ERROR_MESSAGES` | Mensajes sueltos en el flujo | Centraliza el texto exacto exigido por RF-1/RF-2 y evita divergencias |

## 6. Estrategia de tests

**Core (`test/core.test.ts`), sin I/O — `setDoneOn`:**
- Añade un día pasado no marcado y quita uno marcado (RF-1, RF-3).
- Marcar/desmarcar dos veces el mismo día pasado es idempotente (`changed: false`) (RF-3).
- `invalid-date`: `31-02-2026`, `2026-10-15`, `15/10/2026` (RF-1).
- `today-not-allowed`: fecha igual a hoy (RF-2).
- `future-date`: un día después de hoy (RF-2).
- `before-creation`: un día anterior a `createdOn` (RF-2).
- Fecha igual a `createdOn` → permitida (RF-2).
- `not-found`: hábito inexistente (RF-2).
- No muta la lista original.
- RF-4: tras marcar un día pasado que rellena el hueco de ayer, `calculateMetrics`
  mantiene o aumenta la racha actual; el denominador del porcentaje no cambia.

**CLI (`test/cli.test.ts`), con `Bun.spawn` y `HABITS_FILE` temporal:**
- `hecho "<n>" --fecha <ayer>` muestra el mensaje y persiste el registro (RF-1, RF-3).
- Repetir el mismo `--fecha` muestra "ya estaba marcado ese día" y código 0 (RF-3).
- `desmarcar --fecha` quita el registro y muestra el mensaje; repetir → "no estaba marcado" (RF-3).
- `--fecha` con hoy → error y código 1; futura → error; anterior a creación → error (RF-2).
- `--fecha` sin valor / args sobrantes → mensaje de uso y código 1 (RF-1).
- `hecho "Nombre con espacios" --fecha <f>` funciona; `--fecha` no se toma como nombre.
- Sin `--fecha`, el comportamiento de la spec 001 sigue igual.
- Tras corregir el historial, `listar` refleja las métricas recalculadas (RF-4).

**Puerta:** cada tarea termina con `bun test` en verde (principio 4); se conservan
en verde las pruebas de la spec 001.
