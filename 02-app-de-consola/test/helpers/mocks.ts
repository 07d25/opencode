// Helpers de test para las acciones: mock de la red (fetch), del stdin (prompt) y del almacenamiento (XDG temporal).
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

// Una ruta de red simulada: si la URL contiene `match`, se responde con `data` como JSON.
export interface FetchRoute {
  match: string;
  data: unknown;
}

// Contexto de test con estado limpio: XDG temporal, console capturada y mocks instalados.
export interface TestContext {
  dir: string;
  logs: string[];
  cleanup: () => void;
}

// Instala los mocks para un test de acción y devuelve el contexto con `logs` (salida capturada) y `cleanup`.
// - fetch se enruta por `routes`; cualquier URL no registrada lanza error (falla ruidosamente si algo intenta salir a la red).
// - prompt devuelve las respuestas de `input` en orden; si se acaban, devuelve "9" (salir) para no colgar el test.
// - XDG_CONFIG_HOME apunta a un dir temporal, así que configPath() resuelve ahí y la config real del usuario no se toca.
export function setupTest(routes: FetchRoute[] = [], input: string[] = []): TestContext {
  const originalFetch = globalThis.fetch;
  const originalPrompt = globalThis.prompt;
  const originalLog = console.log;
  const originalXdg = process.env["XDG_CONFIG_HOME"];

  const dir = mkdtempSync(join(tmpdir(), "clima-action-"));
  // Igual que el layout real: <dir>/.config/clima/config.json.
  process.env["XDG_CONFIG_HOME"] = join(dir, ".config");

  const logs: string[] = [];
  console.log = (...args: unknown[]) => {
    logs.push(args.map(String).join(" "));
  };

  globalThis.fetch = (async (inputUrl: unknown) => {
    const url = String(inputUrl);
    const route = routes.find((r) => url.includes(r.match));
    if (!route) throw new Error(`URL no mockeada en el test: ${url}`);
    return new Response(JSON.stringify(route.data), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }) as typeof fetch;

  const queue = [...input];
  globalThis.prompt = (() => queue.shift() ?? "9") as typeof prompt;

  return {
    dir,
    logs,
    cleanup: () => {
      globalThis.fetch = originalFetch;
      globalThis.prompt = originalPrompt;
      console.log = originalLog;
      if (originalXdg === undefined) delete process.env["XDG_CONFIG_HOME"];
      else process.env["XDG_CONFIG_HOME"] = originalXdg;
      rmSync(dir, { recursive: true, force: true });
    },
  };
}
