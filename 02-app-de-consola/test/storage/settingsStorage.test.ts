// Tests del módulo de dominio de ajustes: unidad de temperatura y ciudad default, sobre un config temporal.
import { afterEach, beforeEach, expect, test } from "bun:test";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { getDefaultCityName, getUnit, setDefaultCity, setUnit } from "../../src/storage/settingsStorage.ts";

let dir: string;
let path: string;

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), "clima-test-"));
  path = join(dir, "config.json");
});

afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
});

test("valores por defecto: Celsius y sin default", async () => {
  expect(await getUnit(path)).toBe("celsius");
  expect(await getDefaultCityName(path)).toBeNull();
});

test("setUnit y setDefaultCity persisten y se pueden limpiar", async () => {
  await setUnit("fahrenheit", path);
  await setDefaultCity("Ottawa", path);
  expect(await getUnit(path)).toBe("fahrenheit");
  expect(await getDefaultCityName(path)).toBe("Ottawa");

  await setDefaultCity(null, path);
  expect(await getDefaultCityName(path)).toBeNull();
});
