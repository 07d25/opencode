// Tests de withLoading en modo no-TTY (el entorno de test): anuncia la operación, devuelve el valor y propaga errores.
import { afterEach, beforeEach, expect, test } from "bun:test";
import { withLoading } from "../../src/presentation/output.ts";

let logs: string[];
let originalLog: typeof console.log;

beforeEach(() => {
  logs = [];
  originalLog = console.log;
  // Captura console.log para asertar la salida del modo no-TTY.
  console.log = (...args: unknown[]) => {
    logs.push(args.map(String).join(" "));
  };
});

afterEach(() => {
  console.log = originalLog;
});

test("withLoading devuelve el valor resuelto de la promesa", async () => {
  const value = await withLoading("Cargando…", Promise.resolve(42));
  expect(value).toBe(42);
});

test("withLoading anuncia la operación en modo no-TTY (sin spinner)", async () => {
  // En el entorno de test stdout no es TTY, así que se imprime el texto y no se anima.
  await withLoading("Buscando ciudad…", Promise.resolve());
  expect(logs.join("\n")).toContain("Buscando ciudad…");
});

test("withLoading propaga los errores de la promesa", async () => {
  await expect(withLoading("Fallo…", Promise.reject(new Error("boom")))).rejects.toThrow("boom");
});
