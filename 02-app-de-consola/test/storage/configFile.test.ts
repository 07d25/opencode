// Tests de la primitiva de archivo de configuración: round-trip, corrupción, ciudades inválidas y la ruta por defecto.
import { afterEach, beforeEach, expect, test } from "bun:test";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { Config } from "../../src/types/Config.ts";
import { DEFAULT_CONFIG, loadConfig, saveConfig } from "../../src/storage/configFile.ts";
import { configPath } from "../../src/storage/paths.ts";

let dir: string;
let path: string;

beforeEach(() => {
  // Cada test trabaja en su propio directorio temporal para no tocar la config real del usuario.
  dir = mkdtempSync(join(tmpdir(), "clima-test-"));
  path = join(dir, "nested", "config.json");
});

afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
});

test("configPath termina en .config/clima/config.json (ítem 5)", () => {
  // Fija el contrato de la ruta por defecto: el binario guarda en ~/.config/clima/config.json.
  expect(configPath().endsWith(join(".config", "clima", "config.json"))).toBe(true);
});

test("devuelve la configuración por defecto si el archivo no existe", async () => {
  expect(await loadConfig(path)).toEqual({ ...DEFAULT_CONFIG, cities: [] });
});

test("guarda y recupera la configuración (creando directorios anidados)", async () => {
  const config: Config = {
    unit: "fahrenheit",
    defaultCity: "Ottawa",
    cities: [{ name: "Ottawa", country: "Canadá", latitude: 45.41117, longitude: -75.69812 }],
  };
  await saveConfig(config, path);
  expect(await loadConfig(path)).toEqual(config);
});

test("devuelve valores por defecto si el archivo está corrupto", async () => {
  await Bun.write(path, "no soy json {{{");
  expect(await loadConfig(path)).toEqual({ ...DEFAULT_CONFIG, cities: [] });
});

test("descarta ciudades inválidas al cargar pero conserva las válidas", async () => {
  const validCity = { name: "Ottawa", country: "Canadá", latitude: 45.41117, longitude: -75.69812 };
  await Bun.write(
    path,
    JSON.stringify({ unit: "celsius", defaultCity: null, cities: [validCity, { name: 42 }, null] }),
  );
  const config = await loadConfig(path);
  expect(config.cities).toEqual([validCity]);
});
