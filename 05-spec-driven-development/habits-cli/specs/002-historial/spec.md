# Spec 002 — historial (marcar días pasados)

## Contexto y objetivo

Extender `habits-cli` para registrar un día olvidado: marcar o desmarcar un día
**pasado** de un hábito indicando una fecha explícita, sin perder la racha por un
descuido. Esta spec amplía la spec 001 (habits-mvp), que sigue implementada y
activa; no la sustituye.

## Usuarios

- Persona estudiante que usa la terminal en su propia máquina, sin cuentas ni
  servicios externos.

## Historias de usuario

- **HU-1**: Como estudiante, quiero marcar un día pasado que olvidé registrar para
  que mi racha y mi porcentaje reflejen lo que realmente hice.
- **HU-2**: Como estudiante, quiero desmarcar un día pasado por un error cometido,
  para corregir el historial.
- **HU-3**: Como estudiante, quiero ver mis métricas recalculadas tras corregir el
  historial, para confiar en ellas.

## Requisitos funcionales (criterios de aceptación en EARS)

### RF-1 — Extensión de `hecho` y `desmarcar` con `--fecha`
- El sistema deberá aceptar `hecho "<nombre>" --fecha DD-MM-AAAA` y
  `desmarcar "<nombre>" --fecha DD-MM-AAAA`.
- Cuando no se proporcione `--fecha`, el sistema deberá mantener el comportamiento
  de la spec 001 (actuar sobre HOY).
- Si se usa `--fecha` sin valor o con un formato de fecha inválido, entonces el
  sistema deberá mostrar un error con código de salida 1 y no modificar los datos.

### RF-2 — Fechas permitidas
- El sistema deberá permitir marcar o desmarcar fechas `DD-MM-AAAA` reales del
  calendario, desde la fecha de creación del hábito hasta ayer, ambas inclusive.
- Si la fecha indicada es el día de hoy, entonces el sistema deberá mostrar un
  error indicando que ese día se registra con el comando sin `--fecha` (código 1,
  sin modificar los datos).
- Si la fecha indicada es futura (posterior a hoy), entonces el sistema deberá
  rechazarla con error (código 1, sin modificar los datos).
- Si la fecha indicada es anterior a la creación del hábito, entonces el sistema
  deberá rechazarla con error (código 1, sin modificar los datos).
- Si el hábito no existe, entonces el sistema deberá rechazar la operación con
  error (código 1, sin modificar los datos).

### RF-3 — Idempotencia y mensajes del día pasado
- Cuando el día indicado no esté marcado y se pida marcarlo, el sistema deberá
  añadir el registro y mostrar `Hábito "<nombre>" marcado como hecho en <fecha>.`
- Cuando el día indicado ya esté marcado y se pida marcarlo, el sistema deberá
  completar la operación sin cambios y mostrar
  `Hábito "<nombre>" ya estaba marcado ese día.`
- Cuando el día indicado esté marcado y se pida desmarcarlo, el sistema deberá
  quitar el registro y mostrar `Hábito "<nombre>" desmarcado para <fecha>.`
- Cuando el día indicado no esté marcado y se pida desmarcarlo, el sistema deberá
  completar la operación sin cambios y mostrar
  `Hábito "<nombre>" no estaba marcado ese día.`
- En los casos idempotentes, el sistema deberá devolver código de salida 0.

### RF-4 — Recálculo de métricas
- Tras cualquier operación sobre el historial, el sistema deberá recalcular racha
  actual, racha más larga, total de días y porcentaje a partir del historial completo.
- Cuando se marque el día de ayer que faltaba, el sistema deberá mantener o
  aumentar la racha actual, nunca romperla.
- El sistema deberá mantener el denominador del porcentaje (días de calendario
  desde la creación hasta hoy, ambos inclusive); al marcar días anteriores solo
  aumenta el numerador.
- El sistema deberá conservar el formato de fecha `DD-MM-AAAA` y la representación
  interna normalizada ya usados en la spec 001.

## Requisitos no funcionales

- Los datos deberán seguir persistiendo en un único archivo JSON local y legible.
- Un error de validación (formato, hoy, futuro, anterior a creación o inexistente)
  nunca deberá modificar ni corromper los datos.
- El recálculo de métricas deberá ser determinista para el mismo estado y la misma
  fecha de hoy.
- Los mensajes al usuario deberán estar en español y comunicar éxito o error.

## Casos límite

- `--fecha` sin valor → error de uso, código 1.
- `--fecha 31-02-2026` (fecha inexistente) → error de formato, código 1.
- `--fecha` con formato distinto de `DD-MM-AAAA` (por ejemplo `2026-10-15`,
  `15/10/2026`) → error de formato, código 1.
- `--fecha` igual a hoy → error indicando que se use el comando sin `--fecha`.
- `--fecha` futura → error, código 1.
- `--fecha` igual a la fecha de creación → permitida (marcar el primer día).
- `--fecha` anterior a la creación → error, código 1.
- Marcar un día pasado ya marcado → idempotente, mensaje de "ya estaba marcado".
- Desmarcar un día pasado no marcado → idempotente, mensaje de "no estaba marcado".
- Marcar ayer cuando ayer faltaba y hoy está marcado → la racha actual aumenta.
- Marcar un día pasado que rellena un hueco → la racha actual puede aumentar y la
  más larga se recalcula.
- Desmarcar un día intermedio de una cadena → la racha actual se recalcula y puede
  romperse.
- `--fecha` sobre un hábito inexistente → error, código 1.
- El nombre puede contener espacios si se pasa entre comillas; `--fecha` no debe
  interpretarse como parte del nombre.

## Fuera de alcance

- Marcar o desmarcar fechas futuras.
- Recordatorios, red, sincronización, cuentas y multiusuario (heredado de la spec 001).
- Importar un lote de días en una sola invocación: cada marca o desmarca afecta a
  un único día.
- Comando de historial día a día de un hábito (solo se mantiene el listado con
  métricas agregadas).
- Editar la fecha de creación de un hábito: `createdOn` es inmutable una vez creado.

## Criterios de finalización

- Todos los RF y casos límite tienen al menos una prueba automatizada que los verifica.
- `bun test` termina con todas las pruebas en verde.
- El ciclo `hecho "<nombre>" --fecha <día pasado>` y
  `desmarcar "<nombre>" --fecha <día pasado>` funciona de principio a fin de forma manual.
- El comportamiento cumple `docs/constitution.md` y no rompe los RF de la spec 001.

## Registro de cambios

### Cambio 1 — Marcar y desmarcar días pasados con `--fecha`
- Estado: Implemented
- Depende de: spec 001 (habits-mvp)
- Fecha: 2026-10-17
- Fecha de implementación: 2026-10-17
- Evidencia: 5/5 tareas completadas (T2-01..T2-05); `bun test` 82 pass / 0 fail;
  `tsc --noEmit` sin errores; ciclo manual `hecho/desmarcar --fecha` → `listar`
  verificado de principio a fin.
- Objetivo: Extender `hecho` y `desmarcar` con un argumento `--fecha DD-MM-AAAA`
  para registrar o corregir días pasados (desde la creación hasta ayer),
  recalculando racha actual, racha más larga, total de días y porcentaje; con
  rechazo de hoy, fechas futuras, anteriores a la creación y formatos inválidos.

