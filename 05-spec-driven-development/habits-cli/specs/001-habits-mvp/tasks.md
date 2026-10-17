# Tasks 001 — habits-mvp

Cada tarea dura máx. 20–30 min y termina con `bun test` en verde (principio 4 de la constitución). Referencias: `spec.md`, `plan.md`.

## Fase 1 — Tipos y utilidades de fechas

- [x] **T-01 — Tipos del dominio en `src/core.ts`**
  Crear `Habit`, `HabitMetrics`, `HabitResult` (unión discriminada con códigos de error) según el plan, sección 1 y 2. Sin lógica aún.
  *RF: (base de RF-1, RF-2, RF-3, RF-5)*
  **Hecho cuando:** `bun test` compila con `tsc --strict` sin errores y `bun test` en verde (0 archivos de test aún).

- [x] **T-02 — Utilidades de fecha `dd-mm-aaaa` en `src/core.ts`**
  `parseDate` (valida formato y calendario real), `toOrdinal`, `fromOrdinal`, sin I/O.
  *RF: RF-3 (representación normalizada, Cambio 2)*
  **Hecho cuando:** las utilidades pasan una prueba que verifica `31-01-2026` → siguiente día `01-02-2026` y `31-12-2026` → `01-01-2027`.

## Fase 2 — Core puro

- [x] **T-03 — Cálculo de métricas `calculateMetrics`**
  Implementar racha actual (hoy o ayer), racha máxima, total, porcentaje con redondeo half-up y acotado 0–100, filtrando fechas fuera de `[createdOn, today]`, según pseudocódigo del plan.
  *RF: RF-3* · **Hecho cuando:** `test/core.test.ts` cubre: racha hasta hoy, hasta ayer, 0 si hoy y ayer vacíos, hueco que corta la actual pero no la máxima, empates, `createdOn=hoy` → 0%/100%, filtrado fuera de rango y todos estos `expect` pasan en verde.

- [x] **T-04 — Crear y validar nombre `createHabit`**
  Normalizar espacios exteriores, conservar internos, rechazar vacío/solo espacios y saltos de línea, rechazar duplicado sin distinguir mayúsculas (`toLocaleLowerCase("es-ES")`).
  *RF: RF-1* · **Hecho cuando:** `test/core.test.ts` cubre normalización, rechazo de vacío, `invalid-name`, duplicado case-insensitive y conservación de espacios internos, con expect verdes.

- [x] **T-05 — Marcar / desmarcar hoy `setDoneToday`**
  Añadir o quitar `today`, idempotente (`changed: false`), no agrega duplicados, rechaza hábito inexistente.
  *RF: RF-2* · **Hecho cuando:** los casos del plan (añade, quita, idempotente, inexistente) pasan en `test/core.test.ts` con `bun test` verde.

- [x] **T-06 — Renombrar y eliminar `renameHabit` / `deleteHabit`**
  Renombrar conserva `completions`, rechaza vacío/saltos de línea y nombre de otro hábito, equivalente case-insensitive sin cambios; eliminar borra solo el hábito buscado.
  *RF: RF-5 (lógica)* · **Hecho cuando:** los escenarios de renombrar y eliminar del plan pasan en `test/core.test.ts` sin fallos.

## Fase 3 — Persistencia

- [x] **T-07 — Carga y validación `loadHabits`**
  `src/storage.ts` con `node:fs` nativo: archivo inexistente → lista vacía; JSON inválido, tipos incorrectos, fechas fuera de rango, duplicadas o nombres repetidos → error **sin reemplazar el archivo** (validación con `unknown` + guards, sin `any`).
  *RF: RF-3 (fechas válidas), RNF persistencia* · **Hecho cuando:** `test/storage.test.ts` verifica lista vacía para inexistente y error + archivo intacto para cada caso inválido, en verde.

- [x] **T-08 — Guardado atómico `saveHabits`**
  Escribir a `<archivo>.tmp` y `rename`; JSON legible con `JSON.stringify` indentado; fechas en `dd-mm-aaaa`.
  *RF: RNF (atómico, legible)* · **Hecho cuando:** guardar → recargar devuelve los mismos datos y el contenido del archivo se puede parsear como JSON en el test.

## Fase 4 — Capa CLI

- [x] **T-09 — Parseo de comandos y mensajes de uso**
  `src/cli.ts` acepta `crear|hecho|desmarcar|listar|renombrar|eliminar` con número exacto de argumentos del plan (1/1/1/0/2/1); argumentos de menos o de más o comando desconocido → mensaje de uso y código de salida 1.
  *RF: RF-6* · **Hecho cuando:** un test de integración con `Bun.spawn` y `HABITS_FILE` temporal verifica código 1 y el mensaje de uso para comando desconocido y para argumentos sobrantes.

- [x] **T-10 — Comandos de escritura conectar core + storage**
  `crear`, `hecho`, `desmarcar`, `renombrar` cargan, aplican, guardan si hubo cambio y muestran el mensaje de éxito del contrato CLI; errores del core → mensaje exacto del plan y código 1 con datos intactos.
  *RF: RF-1, RF-2, RF-5 (por CLI)* · **Hecho cuando:** con `HABITS_FILE` temporal, crear → archivo contiene el hábito con `createdOn` de hoy en `dd-mm-aaaa`; marcar → `completions` incluye hoy; desmarcar → lo quita; renombrar → cambia `name` conservando `completions`.

- [x] **T-11 — `listar`: tabla, barra y color condicional**
  Tabla `Hábito / Racha / Hoy / Días / Máx / %` con barra `█░` de 10 posiciones; `sí`/`no` en "Hoy"; color ANSI solo si `process.stdout.isTTY`; sin hábitos → `No hay hábitos registrados.` (no error).
  *RF: RF-4* · **Hecho cuando:** con salida noTTY (spawn capturado) el resultado no contiene códigos ANSI, y el mensaje de lista vacía aparece cuando el archivo no tiene hábitos.

- [x] **T-12 — `eliminar` con confirmación**
  Pregunta `¿Eliminar el hábito "<nombre>" y todo su historial? (s/N):`; solo `s`/`sí` (trim, case-insensitive) confirma y persiste el borrado; otra respuesta vacía/EOF/inválida → `Eliminación cancelada.` sin modificar datos; inexistente → error y código 1.
  *RF: RF-5* · **Hecho cuando:** un test con `Bun.spawn` y stdin simulado verifica: `s` borra, `n` no borra, stdin cerrado no borra, y hábito inexistente devuelve código 1.

## Fase 5 — Cierre

- [x] **T-13 — Ciclo de finalización manual + revisión de constitución**
  Ejecutar a mano el ciclo completo `crear` → `hecho` → `desmarcar` → `renombrar` → `eliminar` → `listar` en el orden del criterio de finalización, verificando salidas y códigos; repasar sin `any`, sin dependencias nuevas, core sin I/O.
  *RF: todos (verificación de finalización)* · **Hecho cuando:** la sesión manual queda documentada en la respuesta de la tarea y `bun test` pasa en verde.
