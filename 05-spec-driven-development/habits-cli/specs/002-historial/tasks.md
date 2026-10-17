# Tasks 002 — historial (marcar días pasados)

Referencias: `spec.md` y `plan.md` de `specs/002-historial/`. Cada tarea termina con
`bun test` en verde (principio 4 de la constitución). No se rompen los RF de la spec 001.

## Fase 1 — Core

- [x] **T2-01 — Códigos de error de fecha en core**
  Ampliar `HabitError` en `src/core.ts` con `invalid-date`, `future-date`,
  `today-not-allowed` y `before-creation`, y añadir sus mensajes en el mapa
  `ERROR_MESSAGES` de `src/cli.ts` (el `Record<HabitError, …>` exige las cuatro
  claves en ambos lados).
  *RF: RF-1, RF-2 (base)*
  **Hecho cuando:** `bun test` en verde (las 55 pruebas de 001 intactas) y
  `tsc --noEmit` sin errores.

- [x] **T2-02 — `setDoneOn` en core, tests primero**
  En `test/core.test.ts`, cubrir: añade/quita un día pasado; idempotencia
  (`changed: false`); `not-found`; `invalid-date` (`31-02-2026`, `2026-10-15`,
  `15/10/2026`); `today-not-allowed`; `future-date`; `before-creation`; fecha igual
  a `createdOn` permitida; no muta la lista original. Después, implementar la
  función pura `setDoneOn` siguiendo el pseudocódigo del plan (sección 3).
  *RF: RF-1, RF-2, RF-3*
  **Hecho cuando:** todos los `expect` nuevos pasan en verde y no se rompe ningún
  test de la spec 001.

- [x] **T2-03 — RF-4 recálculo de métricas (tests primero)**
  En `test/core.test.ts`: marcar el hueco de ayer cuando hoy está marcado mantiene o
  aumenta `currentStreak`; marcar un día que rellena un hueco recalcula
  `longestStreak`; desmarcar un día intermedio recalcula y puede romper la racha; el
  denominador del porcentaje no varía al marcar días pasados. No se modifica
  `calculateMetrics`.
  *RF: RF-4*
  **Hecho cuando:** las pruebas nuevas pasan y `calculateMetrics` queda sin cambios.

## Fase 2 — CLI

- [x] **T2-04 — Parseo de `--fecha` en CLI y conexión**
  Parser de `--fecha <valor>` y `--fecha=<valor>`; el nombre debe ser exactamente un
  argumento; `--fecha` nunca forma parte del nombre; `--fecha` sin valor o
  argumentos sobrantes → mensaje de uso y código 1. Conectar `hecho`/`desmarcar` con
  la fecha: mensajes exactos de RF-3 (aplicado e idempotente, elegidos con `done` +
  `changed`), cargando y guardando con el storage existente. Sin `--fecha`, el
  resultado es idéntico al de la spec 001.
  *RF: RF-1, RF-3*
  **Hecho cuando:** las nuevas pruebas de integración (`Bun.spawn` + `HABITS_FILE`
  temporal) pasan: añade, ya marcado, desmarca y no estaba, con código 0 o 1 según
  corresponda.

- [x] **T2-05 — Errores de fecha por CLI y cierre de la spec 002**
  Pruebas de integración y mensajes: hoy vía `--fecha` → error ("se registra con
  ... sin --fecha"); fecha futura; anterior a la creación; nombre con espacios junto
  a `--fecha`; formato de fecha inválido. Ciclo manual: `hecho "<n>" --fecha <día>`
  → `desmarcar "<n>" --fecha <día>` → `listar` reflejando las métricas recalculadas.
  Registrar el cambio de estado de la spec 002 (Draft → Implemented) con su
  evidencia.
  *RF: RF-2, RF-3, RF-4*
  **Hecho cuando:** el ciclo manual queda documentado, `bun test` pasa en verde y
  `tasks.md` tiene todas las casillas en `[x]`.

## Orden de dependencia

T2-01 → T2-02 → T2-03 (paralelizable con T2-02) → T2-04 → T2-05.
