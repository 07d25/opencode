# Revisión Weather CLI

[x] Colores: cyan (menú/bordes/spinner), amarillo (temperatura/hints), verde (éxito), rojo (error). Respetan NO_COLOR y salida no-TTY (vía `src/utils/colors.ts`).
[x] AGENTS.md: actualizado — refleja la estructura por capas (actions/presentation/storage/api/types/utils), entrypoint en `src/index.ts` y comandos con scripts.
[x] Ciudades: el geocoding usa count=5 y muestra una lista de desambiguación para nombres ambiguos.
[x] Tests: co-located en `src/**/*.test.ts` (geocoding, weather, storage con path temporal, colors). `bun run test`.
[x] Binario: compila (`bun run build` → `clima`); guarda datos en `~/.config/clima/config.json` (verificado con HOME temporal: persiste entre reinicios; test de `configPath` fija la ruta).
[x] Escalabilidad: arquitectura por capas ya extensible; sección "Extending the app" en AGENTS.md documenta cómo añadir una opción. Registry de menú considerado y descartado (switch explícito intencional).
[x] Carga: hay spinner/estado de carga en las tareas asíncronas (búsqueda y clima) vía `withLoading`; en no-TTY imprime solo el texto.
