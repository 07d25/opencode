// Tests del módulo de dominio de ciudades: agregar (con duplicados), eliminar y listar, sobre un config temporal.
import { afterEach, beforeEach, expect, test } from "bun:test";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { City } from "../../src/types/City.ts";
import { addCity, getCities, removeCityAt } from "../../src/storage/citiesStorage.ts";
import { loadConfig } from "../../src/storage/configFile.ts";
import { setDefaultCity } from "../../src/storage/settingsStorage.ts";

let dir: string;
let path: string;
const ottawa: City = { name: "Ottawa", country: "Canadá", latitude: 45.41117, longitude: -75.69812 };

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), "clima-test-"));
  path = join(dir, "config.json");
});

afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
});

test("getCities devuelve vacío si no hay config", async () => {
  expect(await getCities(path)).toEqual([]);
});

test("addCity agrega y persiste; detecta duplicados por nombre y coordenadas", async () => {
  expect(await addCity(ottawa, path)).toBe(true);
  expect(await addCity(ottawa, path)).toBe(false); // el mismo se considera duplicado
  expect(await getCities(path)).toEqual([ottawa]);
});

test("removeCityAt elimina por índice y devuelve la ciudad", async () => {
  await addCity(ottawa, path);
  expect(await removeCityAt(0, path)).toEqual(ottawa);
  expect(await getCities(path)).toEqual([]);
  expect(await removeCityAt(0, path)).toBeNull(); // índice fuera de rango
});

test("removeCityAt limpia la ciudad default si la elimina", async () => {
  await addCity(ottawa, path);
  await setDefaultCity("Ottawa", path);
  await removeCityAt(0, path);
  expect((await loadConfig(path)).defaultCity).toBeNull();
});
