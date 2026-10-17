// Test del flujo de la opción 3 (addCity): buscar, elegir y agregar una ciudad; también el caso de duplicado.
import { afterEach, expect, test } from "bun:test";
import { addCityAction } from "../../src/actions/addCity.ts";
import { addCity } from "../../src/storage/citiesStorage.ts";
import { loadConfig } from "../../src/storage/configFile.ts";
import { asuncion } from "../helpers/fixtures.ts";
import { setupTest, type TestContext } from "../helpers/mocks.ts";

let ctx: TestContext | undefined;
afterEach(() => ctx?.cleanup());

test("agrega la ciudad elegida y la establece como default", async () => {
  ctx = setupTest(
    // El geocoding devuelve 2 coincidencias para forzar la desambiguación.
    [{ match: "geocoding-api", data: { results: [asuncion, { ...asuncion, country: "México" }] } }],
    ["Asunción", "1", "s"], // buscar "Asunción", elegir la 1, sí a default
  );
  await addCityAction();

  const config = await loadConfig();
  expect(config.cities).toHaveLength(1);
  expect(config.cities[0]!.name).toBe("Asunción");
  expect(config.cities[0]!.country).toBe("Paraguay");
  expect(config.defaultCity).toBe("Asunción");
  expect(ctx.logs.join("\n")).toContain("Asunción agregada.");
});

test("no agrega una ciudad que ya está en la lista", async () => {
  ctx = setupTest([{ match: "geocoding-api", data: { results: [asuncion] } }], ["Asunción", "1", "s"]);
  await addCity(asuncion); // sembrar la misma ciudad vía storage
  await addCityAction();

  const config = await loadConfig();
  expect(config.cities).toHaveLength(1);
  expect(ctx.logs.join("\n")).toContain("ya está en la lista");
});

test("sin coincidencias, informa que no encontró la ciudad", async () => {
  ctx = setupTest([{ match: "geocoding-api", data: {} }], ["Inexistente"]);
  await addCityAction();
  expect(ctx.logs.join("\n")).toContain("No se encontró ninguna ciudad");
});
