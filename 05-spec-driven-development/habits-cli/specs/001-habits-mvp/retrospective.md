# Retrospectiva — Spec 001 habits-mvp

Fecha: 2026-10-17
Estado final: Implemented (13/13 tareas)

## Resultado

- `bun test`: 55 pruebas, 0 fallos, 95 aserciones (3 archivos).
- `tsc --noEmit` (strict): sin errores.
- Ciclo manual verificado: crear → hecho → desmarcar → renombrar → eliminar → listar.
- Repositorio limpio, sin dependencias externas.

## Bugs detectados durante la implementación

- **T-12 (eliminación, EOF)**: `readline.question` no resolvía al cerrarse la entrada
  y el proceso terminaba sin cancelar. Se corrigió con `Promise.race` contra los
  eventos `end`/`close` de `stdin`; el caso ya estaba previsto como caso límite en la spec.
- **T-07 (JSON corrupto)**: se filtraba el error crudo de `JSON.parse` en lugar del
  mensaje `formato inválido` exigido por la spec. Se envolvió el parseo en `try/catch`.
- **Tipado estricto (T-09/T-13)**: funciones anotadas `void` que retornaban `boolean`
  y uso de `Response.text` fuera de `lib`. Se corrigió con bloques de cuerpo y
  `Bun.readableStreamToText`.
- **Formato (T-03/T-05)**: ediciones imprecisas unieron líneas en `core.ts` y
  `core.test.ts`. Se normalizó con Prettier efímero (`bunx prettier`).

## Decisiones que el plan no anticipaba y cómo se resolvieron

- La validación de `createdOn`/`today` no se resolvió en el núcleo, sino en la
  carga (T-07) y en la CLI (T-09), tal como fijaba el plan; así se evitó duplicar
  validación en el core.
- El mensaje exacto de error de datos inválidos se decidió en T-07 y la CLI lo
  reutiliza; el plan ya definía el contrato de errores.
- El cambio de formato de fecha a `DD-MM-AAAA` (Cambio 2) llegó durante el ciclo y
  se registró como cambio de spec con su historia, sin reescribir el texto previo.

## Aprendizaje para specs futuras

- Los criterios de aceptación en EARS de la spec resultaron directamente
  verificables: cada RF acabó en pruebas concretas sin ambigüedad.
- El QA iterativo de la spec (revisión de ambigüedades, contradicciones, casos
  límite y conflictos con la constitución) afloró los casos valiosos **antes** de
  escribir código, como el EOF de la confirmación.
- Las tareas de 20–30 minutos se ejecutaron sin desbordarse; la única excepción
  previsible fue T-12, por el caso límite del EOF ya contemplado en la spec.
- Respetar la constitución (cero dependencias) obligó a usar herramientas de forma
  efímera (`bunx prettier`, `bunx tsc`), dejando el repositorio limpio.

## Deuda y mejoras registradas para el siguiente incremento

- Los comandos de marcar/desmarcar solo actúan sobre hoy; ampliar a fechas pasadas
  requeriría nueva spec.
- No hay detección de terminal de color configurable (solo `isTTY`).
