# Retrospectiva — Spec 002 historial

Fecha: 2026-10-17
Estado final: Implemented (5/5 tareas)

## Resultado

- `bun test`: 82 pruebas, 0 fallos, 146 aserciones (3 archivos); las 55 de la spec 001 intactas.
- `tsc --noEmit` (strict): sin errores; sin `any`; sin dependencias externas.
- Ciclo manual verificado: `hecho --fecha 16-10-2026` → idempotente → `listar`
  (Racha 1) → `desmarcar --fecha` → `listar` (Racha 0) → error con fecha futura
  (código 1).
- Repositorio limpio tras el tooling efímero (`node_modules`/`bun.lock` eliminados).

## Bugs detectados durante la implementación

- **Symlinks de tipado efímeros**: el primer intento con `mkdir node_modules/bun-types`
  + `ln -sfn` dejó el symlink *dentro* del directorio en vez de reemplazarlo (`ln`
  sobre un directorio existente entra en él y crea el enlace con el basename del
  origen). `tsc` falló con `TS2688 Cannot find type definition file for 'bun-types'`.
  Se corrigió eliminando `node_modules` y creando los symlinks sobre un `node_modules`
  limpio.
- **Sin fallos en el primer `bun test`**: los 27 tests nuevos pasaron a la primera;
  el único bug fue de tooling, no de código.

## Decisiones que el plan no anticipaba y cómo se resolvieron

- El mensaje de `today-not-allowed` (`Error: la fecha de hoy se registra con el comando
  sin --fecha.`) se redactó de forma neutra en lugar del literal `"hecho <nombre>"` del
  plan, porque la regla aplica igual a `desmarcar`. Desviación menor documentada en la
  entrega.
- La CLI no reutilizó `applyResult` para el camino con fecha: necesita elegir mensaje
  según `done` + `changed` (aplicado vs. idempotente) y pasar `date` u `name` según el
  error, así que se resolvió en línea dentro del bloque `hecho/desmarcar`.
- `crear` se separó del bloque compartido para que `crear Leer --fecha x` siga dando
  "uso" (la fecha solo aplica a `hecho`/`desmarcar`).
- Los tests de integración no pueden usar `crear` para sembrar un hábito con día pasado
  disponible (la creación fija `createdOn = hoy`), así que se siembra el JSON
  directamente con `writeFile`.

## Aprendizaje para specs futuras

- Reutilizar el tipo `HabitResult` existente e inferir la idempotencia desde `done` +
  `changed` evitó romper las 55 pruebas exactas (`toEqual`) de la spec 001: pensar el
  contrato del core **antes** de extenderlo fue la decisión de mayor valor del plan.
- Los RF en EARS se tradujeron 1:1 a pruebas otra vez; los casos límite de la spec
  cubrían los errores (`invalid-date`, `future-date`, `today-not-allowed`,
  `before-creation`) sin ambigüedad.
- El patrón "tests primero" volvió a funcionar: los 27 tests nuevos pasaron con la
  implementación sin sorpresas.

## Deuda y mejoras registradas para el siguiente incremento

- `export HABITS_FILE` sigue siendo la única forma de apuntar a otro archivo (sin flag
  global `--file`).
- Sin validación de duplicados/orden en `completions` al guardar (la carga las detecta;
  el salvado confía en el core).
- El mensaje de `today-not-allowed` no distingue `hecho` de `desmarcar`.
- Fuera de alcance confirmado: lote de fechas, historial por día y editar `createdOn`
  (quedan como candidatos para una spec 003).
