# Spec 001 — habits-mvp

## Contexto y objetivo

`habits-cli` permite registrar hábitos de estudio y medir la constancia localmente. El MVP permite crear, marcar o desmarcar hoy, renombrar, eliminar y listar hábitos con métricas y una tabla de texto con color.

## Usuarios

- Persona estudiante que usa una terminal en su propia máquina, sin cuentas ni servicios externos.

## Historias de usuario

- **HU-1**: Crear un hábito para registrarlo.
- **HU-2**: Marcar o desmarcar un hábito hoy para corregir su registro.
- **HU-3**: Renombrar o eliminar hábitos para mantener la lista al día.
- **HU-4**: Consultar rachas y cumplimiento para conocer la constancia.

## Requisitos funcionales

### RF-1 — Crear un hábito
- El sistema deberá eliminar los espacios iniciales y finales del nombre.
- Cuando se proporcione un nombre válido y no existente, el sistema deberá crear y conservar el hábito con métricas a cero.
- Si el nombre está vacío o solo contiene espacios, entonces el sistema deberá rechazarlo sin modificar los datos.
- Si existe un nombre igual sin distinguir mayúsculas/minúsculas, entonces el sistema deberá rechazarlo sin modificar los datos.
- Un nombre válido deberá contener al menos un carácter no blanco tras eliminar sus espacios iniciales y finales, y no deberá contener saltos de línea.
- Los espacios internos deberán conservarse y ser significativos.

### RF-2 — Marcar y desmarcar hoy
- El sistema deberá usar la fecha local del equipo como hoy.
- Cuando se marque o desmarque un hábito existente, el sistema deberá añadir o quitar respectivamente el registro de hoy.
- Mientras el estado solicitado ya esté aplicado, el sistema deberá completar la operación sin duplicar registros ni producir error.
- Si el hábito no existe, entonces el sistema deberá avisar y no modificar los datos.
- El sistema solo deberá permitir actuar sobre hoy, no sobre otras fechas.

### RF-3 — Métricas
- El sistema deberá calcular la racha actual como días consecutivos que terminan hoy, o ayer si hoy no está marcado.
- El sistema deberá calcular la racha más larga como la mayor secuencia consecutiva del historial.
- El sistema deberá calcular el total como todos los días marcados.
- El sistema deberá calcular el porcentaje como días marcados entre días de calendario locales desde la creación hasta hoy, ambos inclusive, redondeado al entero.
- Si hoy y ayer no están marcados, entonces el sistema deberá mostrar una racha actual de cero.
- El porcentaje deberá estar entre 0% y 100%; los valores con decimal `.5` se redondearán hacia arriba.
- Los registros deberán corresponder a días de calendario locales en formato `DD-MM-AAAA`, sin fechas anteriores a la creación ni posteriores a hoy.
- Las comparaciones y los cálculos internos de orden y consecutividad se realizarán sobre una representación normalizada (año, mes, día), de forma que sean independientes del formato de visualización.

### RF-4 — Listar hábitos
- Cuando se solicite el listado, el sistema deberá mostrar nombre, racha actual, hecho hoy, total, racha máxima y porcentaje por hábito en una tabla de texto.
- El sistema deberá mostrar el porcentaje con una barra de longitud fija y color cuando la salida sea una terminal interactiva.
- Cuando no haya hábitos, el sistema deberá mostrar un mensaje informativo.
- Cuando la salida no sea una terminal interactiva, el sistema deberá omitir códigos de color.
- La tabla deberá incluir las columnas `Hábito`, `Racha`, `Hoy`, `Días`, `Máx` y `%`.
- La barra deberá tener 10 posiciones: `█` para la parte completada y `░` para la restante. El número de bloques llenos deberá ser el porcentaje redondeado a la posición más cercana sobre 10.
- El color será solo una mejora visual: los textos y valores deberán ser comprensibles sin interpretarlo.
- La salida se considerará interactiva cuando la salida estándar esté conectada a una terminal.

### RF-5 — Renombrar y eliminar
- Cuando se renombre un hábito con un nombre válido y disponible, el sistema deberá conservar sus registros.
- Si el nuevo nombre está vacío o pertenece a otro hábito, entonces el sistema deberá rechazar el cambio sin modificar datos.
- Cuando el nuevo nombre sea equivalente al actual, el sistema deberá completar la operación sin cambios.
- Cuando se solicite eliminar un hábito existente, el sistema deberá pedir confirmación explícita.
- Cuando se confirme la eliminación, el sistema deberá borrar el hábito y sus registros; si no se confirma, no deberá modificar los datos.
- El sistema deberá considerar confirmada la eliminación únicamente con la respuesta `s` o `sí`, sin distinguir mayúsculas/minúsculas ni espacios exteriores.
- Cualquier otra respuesta, respuesta vacía o fin de entrada deberá cancelar la eliminación sin modificar los datos.
- Antes de pedir confirmación, el sistema deberá indicar el nombre del hábito y que también se eliminará su historial.

### RF-6 — Errores de uso
- Si el comando no se reconoce o faltan argumentos, entonces el sistema deberá mostrar el uso y no modificar datos.
- La CLI deberá aceptar los comandos `crear`, `hecho`, `desmarcar`, `listar`, `renombrar` y `eliminar`.
- Los nombres podrán contener espacios cuando se proporcionen como un único argumento entre comillas.
- Los comandos `crear`, `hecho`, `desmarcar` y `eliminar` requerirán un nombre; `renombrar` requerirá un nombre actual y un nombre nuevo.
- Si un comando recibe argumentos sobrantes, entonces el sistema deberá mostrar el uso y no modificar los datos.

## Requisitos no funcionales

- Los datos deberán persistir entre ejecuciones y los errores no deberán corromperlos.
- Las métricas deberán ser deterministas para el mismo estado y fecha.
- Los mensajes para la persona usuaria deberán estar en español, ser claros y comunicar éxito o error.
- Los datos deberán persistir en un único archivo JSON local y legible por una persona.
- Si los datos persistidos no pueden leerse o no son válidos, entonces el sistema deberá informar del error sin modificar ni reemplazar el archivo.
- Si una operación de persistencia falla, entonces el sistema deberá informar del error sin dejar datos parcialmente actualizados.

## Casos límite

- Los nombres que difieren solo por espacios o mayúsculas se consideran duplicados.
- Marcar o desmarcar dos veces hoy es idempotente.
- Un hábito creado hoy y marcado hoy tiene 100%; si no está marcado, tiene 0%.
- Un hueco completo corta la racha actual pero no la racha máxima.
- Cancelar una eliminación conserva el hábito y sus registros.
- Los argumentos sobrantes muestran el uso y no modifican datos.
- Una confirmación de eliminación vacía, no válida o terminada por fin de entrada conserva los datos.
- Un archivo de datos inexistente se interpreta como una lista vacía; un archivo JSON inválido informa un error y se conserva sin cambios.
- Una racha máxima puede tener varias secuencias empatadas.
- Los nombres con espacios internos, comillas o caracteres Unicode se conservan; los que incluyen saltos de línea se rechazan.

## Fuera de alcance

- Marcar o desmarcar fechas pasadas o futuras.
- Recordatorios, red, sincronización, cuentas y multiusuario.

## Criterios de finalización

- Todos los requisitos y casos límite tienen pruebas automatizadas.
- `bun test` termina en verde.
- El ciclo crear, marcar, desmarcar, renombrar, eliminar y listar funciona manualmente.

## Registro de cambios

### Cambio 1 — Ampliación del ciclo de gestión
- Estado: Implemented
- Depende de: —
- Fecha: 2026-10-17
- Fecha de implementación: 2026-10-17
- Evidencia: 13/13 tareas completadas; `bun test` 55 pass / 0 fail; ciclo manual verificado de principio a fin.
- Objetivo: Ampliar el ciclo inicial de 3 comandos (crear, marcar hoy, listar)
  a 6 comandos, añadiendo desmarcar hoy, renombrar y eliminar con confirmación,
  y enriquecer el listado con métricas: racha actual, racha más larga, total de
  días, porcentaje de cumplimiento, barra de texto de 10 posiciones y color
  opcional en terminal interactiva.

### Cambio 2 — Formato de fecha DD-MM-AAAA
- Estado: Implemented
- Depende de: —
- Fecha: 2026-10-17
- Fecha de implementación: 2026-10-17
- Evidencia: fechas persistidas en `dd-mm-aaaa`; comparaciones y consecutividad sobre ordinales internos.
- Objetivo: Sustituir el formato de fecha AAAA-MM-DD por DD-MM-AAAA en todos
  los registros persistidos y en las salidas, manteniendo comparaciones y
  cálculos de racha sobre una representación interna normalizada.
