# AGENTS.md

## Project

Clon de **Asteroids** en HTML5 Canvas + JS vanilla. Sin dependencias, sin bundler,
sin `package.json`, sin build, sin tests ni linter. El texto de UI/comentarios está
en **español**; mantenlo así.

## Cómo ejecutar / verificar

- Abre `index.html` en el navegador, o sirve la carpeta: `npx serve .` → `http://localhost:3000`.
- No hay suite de tests ni linter: la verificación es manual en el navegador.

## Estructura

- Toda la lógica vive en `game.js` (un solo archivo). Se carga como script clásico
  con `<script src>` en `index.html` — **no son módulos ES**: no hay `import`/`export`
  y las clases (`Bullet`, `Asteroid`, `Ship`, `Particle`) son globales.
- `index.html` fija el canvas en 800x600; `game.js` **duplica** esos valores en las
  constantes `W = 800` / `H = 600`. Si cambias el tamaño, actualiza ambos.
- Estado del juego en variables globales de módulo (`ship`, `bullets`, `asteroids`,
  `particles`, `score`, `lives`, `level`, `state`). El estado `state` es
  `'playing' | 'dead' | 'gameover'`.
- Loop con `requestAnimationFrame`; `dt` se limita a `0.05` s para evitar saltos.
- El campo es toroidal: todo lo que se mueve pasa por `wrap()`.

## Gotchas

- El árbol de trabajo **no coincide con la rama actual** (`02-app-de-consola`): el
  proyecto TypeScript "Weather CLI" completo (`src/`, `test/`, `package.json`,
  `tsconfig.json`, `AGENTS.md`, etc.) aparece como *deleted*, y los archivos del
  juego (`index.html`, `game.js`, `favicon.svg`) como *untracked*. La rama
  `03-asteroids` también contiene el Weather CLI, no este juego. Es el estado
  esperado: **no hagas `git add -A`/commit ni restaures los archivos borrados** sin
  confirmar antes con el usuario.
