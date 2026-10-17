# AGENTS.md — habits-cli (Bun + TS)

## Proyecto

CLI en TypeScript ejecutado con Bun para registrar hábitos de estudio y calcular
rachas de días consecutivos. Núcleo puro (`src/core.ts`) + capa CLI (`src/cli.ts`).
Persistencia en JSON local (`src/storage.ts`).

## Comandos

- Ejecutar: `bun run src/cli.ts <comando>`
- Tests: `bun test`

## Estilo

- TypeScript estricto, tipos explícitos en todas las funciones públicas.
- **Prohibido el uso de `any`**. En su lugar, usa tipos estrictos (`interface`/`type`), genéricos (`<T>`) o `unknown` con validaciones de tipo manuales.
- Solo la API nativa de Bun y Node.js (cero dependencias externas en `package.json`).
- Identificadores en inglés; mensajes de usuario en español.

## Reglas

- Lee `docs/constitution.md` y la spec activa en `specs/` antes de tocar código.
- No añadas dependencias ni cambies el formato del JSON sin actualizar antes la spec.
- No modifiques archivos dentro de `specs/` salvo petición explícita.

## Al terminar cualquier tarea

- Ejecuta `bun test` y confirma en tu respuesta que todas las pruebas pasan correctamente.
