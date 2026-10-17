# AGENTS.md

## Project

Single-page static site (`index.html`) for learning OpenCode. No framework, no build step, no dependencies.

## Commands

- Run: open `index.html` directly in a browser, or serve statically (e.g. `python3 -m http.server`).
- There is no install, build, test, lint, or typecheck step. Don't introduce tooling unless asked.

## Conventions

- Tailwind is loaded via the Play CDN script tag (`cdn.tailwindcss.com`) — arbitrary-value classes like `bg-[#d8b4e2]` work with no config. Do not add a Tailwind build pipeline.
- User-facing content (README, page text) is in Spanish; match the language of the surrounding content.
- Only two files matter: `index.html` (the page) and `README.md`.
