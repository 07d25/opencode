# AGENTS.md

## Project

Weather CLI app (console app, not a web server). Goal per `README.md` (in Spanish):
prompt for a city, keep a default city + a list of saved cities, show current
temperature, and ship as a compiled executable binary.

Stack: Bun + [OpenMeteo](https://open-meteo.com) only — no API key needed.

API flow (both requests are required, in order):
1. Geocode the city name: `https://geocoding-api.open-meteo.com/v1/search?name=<city>&count=5&language=es&format=json` → latitude/longitude (count=5 so the user can disambiguate homonyms)
2. Forecast: `https://api.open-meteo.com/v1/forecast?latitude=<lat>&longitude=<lon>&current=temperature_2m`

## Commands

Scripts en `package.json`:

- Run: `bun run start` (o `bun run src/index.ts`; entrypoint is `src/index.ts`)
- Dev with reload: `bun run dev`
- Tests: `bun run test` / `bun run test:watch` (Bun's built-in runner; import from `bun:test`)
- Typecheck: `bunx tsc --noEmit` (`tsconfig.json` is strict, including `noUncheckedIndexedAccess`)
- Release binary: `bun run build` (runs tests first, then `bun build --compile src/index.ts --outfile clima`)

## Conventions

- Follow `bun-instructions.md` for all API choices: use `Bun.file`/`fetch`,
  `bun:sqlite` (or a JSON file) for local persistence, never Node equivalents,
  never add `dotenv` (Bun loads `.env` automatically).
- User-facing CLI text and `--language` parameters are **Spanish** (see the sample
  menu in `README.md`); keep new UI strings in Spanish to match.
- Code, identifiers, and file names are **English**; code comments are **Spanish**
  and explain what each function/block does.
- App state (saved cities, default city, °C/°F unit) is persisted in
  `~/.config/clima/config.json`; load/save goes through `src/storage/configFile.ts`
  (the only layer that touches the JSON — see Architecture).
- Keep the menu structure from `README.md` (options 1–5, 8, 9 — including the
  jump to 8) when extending the CLI.
- Colors go through `src/utils/colors.ts` (`colors.cyan/yellow/green/red`): cyan for
  menu/banner/spinner, yellow for temperature/hints, green for success, red for
  errors. They auto-disable on non-TTY or when `NO_COLOR` is set — never print
  raw ANSI escapes.
- Async work that hits the network (search, forecast) is wrapped in
  `withLoading` from `src/presentation/output.ts` so the user sees a spinner on
  TTY and a plain message on pipes.

## Architecture

Code is split by concern under `src/` (see `structure.md` for the intended layout):

- `index.ts` — entrypoint: menu loop + explicit `switch` that dispatches each
  option to an action. The explicit switch is intentional (no option registry).
- `actions/` — one file per user action (`getWeather`, `listCities`, `addCity`,
  `removeCity`, `setDefaultCity`, `toggleUnit`). Actions orchestrate api + storage +
  presentation and are self-contained async functions (no shared in-memory config;
  they read/write via the storage modules).
- `presentation/` — console I/O only, no network: `menu.ts` (banner/menu/list
  rendering), `input.ts` (readLine/askNumber/askYesNo), `output.ts`
  (printError/printSuccess/printHint/withLoading).
- `storage/` — `configFile.ts` is the ONLY layer that reads/writes
  `~/.config/clima/config.json`. `citiesStorage.ts` and `settingsStorage.ts` are
  domain facades over it (each op does a full read-modify-write; a CLI is
  sequential so this is safe). `paths.ts` resolves the config path.
- `api/` — OpenMeteo integration: `geocoding.ts`, `weather.ts`, and `http.ts`
  (shared `fetchJson` that turns network/HTTP failures into Spanish errors).
- `types/` — shared TS types (`City`, `WeatherResult`/`Unit`, `Config`, `MenuOption`).
- `utils/` — pure helpers: `format.ts` (formatWeather/unitSymbol/errorMessage),
  `constants.ts` (MENU_OPTIONS, SPINNER_FRAMES), `colors.ts`.

Tests live in `test/` at the repo root (NOT co-located), mirroring `src/`
(`test/api/`, `test/storage/`, `test/utils/`, `test/presentation/`, `test/actions/`).
`bun test` discovers `test/**/*.test.ts` automatically. Action tests mock the
network (`fetch`), stdin (`prompt`), and isolate storage via `XDG_CONFIG_HOME`
(see `test/helpers/mocks.ts`) — they never hit the network or the real config.

Note: `configPath()` respects `XDG_CONFIG_HOME` (falls back to `~/.config/clima`),
which is what keeps tests hermetic and lets packagers relocate config.

## Extending the app

To add a new menu option (e.g. option 6 "X"):

1. Create `src/actions/x.ts` exporting an async `xAction()` that orchestrates
   storage + api + presentation.
2. Add `{ value: 6, label: "…" }` to `MENU_OPTIONS` in `src/utils/constants.ts`
   (drives the menu rendering and option validation).
3. Add a `case 6:` to the `switch` in `src/index.ts` that calls `xAction()`.
4. If it needs new state, add accessors to the relevant `storage/` module (keep
   `configFile.ts` as the only file that touches the JSON).

The menu renders dynamic bits by special-casing values (2 shows city count, 8 shows
the unit) — follow that pattern in `printMenu` if your option needs live text.
