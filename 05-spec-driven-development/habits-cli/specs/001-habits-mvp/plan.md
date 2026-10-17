# Plan 001 — habits-mvp

Referencias: spec `specs/001-habits-mvp/spec.md`, constitución `docs/constitution.md`.
Identificadores en inglés; mensajes al usuario en español (principio 6).

## 1. Estructura de módulos

| Módulo | Responsabilidad | Cobertura |
|---|---|---|
| `src/core.ts` | Núcleo puro sin I/O: tipos `Habit`, `HabitMetrics`, `HabitResult`; funciones `createHabit`, `setDoneToday`, `renameHabit`, `deleteHabit`, `calculateMetrics`. Estado inmutable; `today` llega como parámetro. | RF-1, RF-2, RF-3, RF-5 (lógica) |
| `src/storage.ts` | Persistencia en un único archivo JSON con `node:fs` nativo: `loadHabits` (valida; inexistente = lista vacía; inválido = error sin reemplazar) y `saveHabits` (escritura atómica temp + rename). | RNF persistencia; casos límite de datos inválidos |
| `src/cli.ts` | Capa fina: parseo de args, mensajes en español, colores ANSI, confirmación con `node:readline/promises`, entrada `run()`. | RF-4, RF-5 (confirmación), RF-6 |
| `test/core.test.ts`, `test/storage.test.ts` | Pruebas con `bun test`. | Todos los RF y casos límite |

Principio 3 de la constitución: el core no imprime ni lee entradas; solo la CLI toca consola, stdin y disco.

## 2. Modelo de datos JSON (ejemplo)

```json
[
  {
    "name": "Leer",
    "createdOn": "10-10-2026",
    "completions": ["14-10-2026", "15-10-2026", "16-10-2026", "17-10-2026"]
  }
]
```

- `name`: normalizado (sin espacios exteriores); espacios internos conservados; sin saltos de línea (RF-1).
- `createdOn` y `completions`: fechas locales `DD-MM-AAAA` (RF-3, Cambio 2).
- Unicidad de nombres sin distinguir mayúsculas/minúsculas (RF-1); `completions` sin duplicados (RF-2).

## 3. Algoritmo de cálculo de racha (pseudocódigo)

```
# Normalización de fechas (RF-3, Cambio 2)
función normalizar(fecha "DD-MM-AAAA") -> (año, mes, día)
función a_ordinal(fecha) -> entero           # días desde época; para comparar y sumar
función a_fecha(ordinal) -> "DD-MM-AAAA"

# Racha que termina en un día dado (RF-3)
función racha_hasta(fechas: conjunto de ordinales, fin: entero) -> entero:
    racha ← 0 ; cursor ← fin
    mientras fechas contiene cursor:
        racha ← racha + 1 ; cursor ← cursor - 1
    devolver racha

# Métricas completas (RF-3)
función calcular_métricas(hábito, hoy) -> métricas:
    fechas ← ordinales de completions filtradas en [createdOn, hoy] sin duplicados
    hecho_hoy ← fechas contiene hoy
    si hecho_hoy:  racha_actual ← racha_hasta(fechas, hoy)
    si no:         racha_actual ← racha_hasta(fechas, hoy - 1)
    racha_máx ← máximo de racha_hasta(fechas, f) para cada f en fechas
    días_transcurridos ← máx(1, hoy − createdOn + 1)
    porcentaje ← acotar(0, 100, redondeo_half_up(fechas.tamaño / días_transcurridos × 100))
    devolver {racha_actual, racha_máx, total: fechas.tamaño, porcentaje, hecho_hoy}
```

Con ordinales, la consecutividad es resta de enteros: no depende del formato `DD-MM-AAAA`, que queda solo para almacenar y mostrar.

## 4. Contrato de la CLI

| Comando | Argumentos | Salida en éxito | Código |
|---|---|---|---|
| `crear <nombre>` | exactamente 1 | `Hábito "<nombre>" creado.` | 0 |
| `hecho <nombre>` | exactamente 1 | `Hábito "<nombre>" marcado como hecho hoy.` | 0 |
| `desmarcar <nombre>` | exactamente 1 | `Hábito "<nombre>" desmarcado para hoy.` | 0 |
| `listar` | 0 | tabla `Hábito / Racha / Hoy / Días / Máx / %` con barra `█░` de 10 posiciones; sin hábitos: `No hay hábitos registrados.` | 0 |
| `renombrar <actual> <nuevo>` | exactamente 2 | `Hábito "<actual>" renombrado a "<nuevo>".` | 0 |
| `eliminar <nombre>` | exactamente 1 | `¿Eliminar el hábito "<nombre>" y todo su historial? (s/N):` → solo `s`/`sí` (trim, sin mayúsculas) confirma: `Hábito "<nombre>" eliminado.`; otro caso o EOF: `Eliminación cancelada.` | 0 |

Errores (código 1, datos intactos) — RF-6, RNF:

```
Error: el nombre del hábito no puede estar vacío.
Error: el nombre del hábito no puede contener saltos de línea.
Error: ya existe un hábito llamado "<nombre>".
Error: no existe un hábito llamado "<nombre>".
Uso: habits-cli <crear|hecho|desmarcar|listar|renombrar|eliminar> ...
Error: El archivo de hábitos tiene un formato inválido.   # datos corruptos; archivo sin cambios
```

Reglas: comando desconocido, argumentos de menos o de más → mensaje de uso y código 1 (RF-6). Colores solo si la salida estándar es una terminal interactiva (`isTTY`) (RF-4).

## 5. Decisiones técnicas (justificadas)

| Decisión | Alternativa descartada | Justificación |
|---|---|---|
| Fechas persistidas en `DD-MM-AAAA`; internamente se convierten a ordinales (entero de días) para comparar, ordenar y calcular rachas | Usar `DD-MM-AAAA` también para comparar con manipulación de cadenas o parseo ad hoc | `DD-MM-AAAA` no es ordenable lexicográficamente; un ordinal hace la consecutividad trivial y determinista, y cumple el RF-3 (representación normalizada) sin depender del formato de visualización |
| `today` se pasa como parámetro al core | Que el core consulte el reloj del sistema | Core puro y determinista (principio 3; RNF determinismo); la CLI aporta la fecha local |
| Fecha local con `Date` + `getTimezoneOffset` | `toISOString()` directo (UTC) | La spec exige fecha **local**; UTC puede cambiar el día según el huso |
| Unión discriminada `HabitResult` (`ok: true/false` + código de error) | Lanzar excepciones desde el core | Obliga a tratar cada error en la CLI y mantiene el core sin efectos laterales (RF-6) |
| Escritura atómica: `writeFile` a `<archivo>.tmp` + `rename` | Sobrescribir el JSON directamente | Un fallo a mitad de escritura deja el original intacto: “sin datos parcialmente actualizados” y “sin reemplazar el archivo” (RNF) |
| Validación estricta al cargar: tipos con `unknown` + guards, formato `DD-MM-AAAA` real (calendario), rango `[createdOn, hoy]`, sin duplicados de fechas ni de nombres | Confiar en el JSON sin validar | RF-3 (fechas válidas, sin futuras ni previas a creación) y RNF (informar error sin modificar el archivo) |
| Comparación de nombres: `trim()` + `toLocaleLowerCase("es-ES")` | `toLowerCase()` sin locale o comparación exacta | Cumple RF-1 y hace el resultado independiente del locale del sistema |
| Estado inmutable en el core: cada operación devuelve una nueva lista (clonado profundo de `completions`) | Mutar el array recibido | Tests aislados y sin efectos laterales (principio 3) |
| Barra `█░` de 10 posiciones + colores ANSI puros, activados solo con `process.stdout.isTTY` | Librería externa (chalk, etc.) o barra configurable | Cero dependencias (principio 1); `isTTY` implementa el RNF de omitir color fuera de terminal |
| Confirmación de borrado con `node:readline/promises`, solo `s`/`sí` confirma; EOF o cualquier otra respuesta cancela | Flag `--force` o leer stdin a mano | `readline/promises` es API nativa y permite esperar la respuesta; cumple RF-5 al pie de la letra |

## 6. Estrategia de tests

**Core (`test/core.test.ts`), sin I/O:**
- RF-1: normaliza espacios exteriores; rechaza vacío, solo espacios y saltos de línea (`invalid-name`); conserva espacios internos; duplicado sin distinguir mayúsculas.
- RF-2: `hecho` añade hoy; `desmarcar` lo quita; idempotentes (`changed: false`); inexistente → `not-found`.
- RF-3: racha que termina hoy; racha hasta ayer; racha 0 si hoy y ayer vacíos; hueco corta la racha actual pero no la máxima; empates de racha máxima; `createdOn` = hoy → 0% o 100%; filtrado de fechas fuera de `[createdOn, hoy]`; redondeo half-up; **fechas en `DD-MM-AAAA` con cruce de mes y de año** (p. ej. `31-01-2026` → `01-02-2026`, `31-12-2026` → `01-01-2027`) para validar la normalización.
- RF-5 (lógica): renombrar conserva `completions`; rechaza vacío, saltos de línea y nombre de otro hábito; equivalente case-insensitive → sin cambios; `deleteHabit` elimina solo el buscado.

**Storage (`test/storage.test.ts`), con archivos temporales en `/tmp/opencode`:**
- Inexistente → lista vacía; guardado → JSON legible y re-cargable con fechas `DD-MM-AAAA`.
- JSON inválido → error y archivo intacto; fechas futuras, previas a la creación, duplicadas o de formato inválido → error; nombres duplicados → error.

**Integración de CLI (opcional, `Bun.spawn` + `HABITS_FILE` temporal):**
- Ciclo completo `crear` → `hecho` → `listar` verifica la tabla; `eliminar` con stdin vacío cancela y conserva datos; comando desconocido → código 1 (cubre el criterio de finalización del ciclo manual).

**Puerta:** cada tarea termina con `bun test` en verde (principio 4).
