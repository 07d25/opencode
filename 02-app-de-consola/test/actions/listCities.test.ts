// Test del flujo de la opción 2 (listCities): mostrar el clima de todas las ciudades guardadas.
import { afterEach, expect, test } from "bun:test";
import { listCitiesAction } from "../../src/actions/listCities.ts";
import { addCity } from "../../src/storage/citiesStorage.ts";
import { asuncion, ottawa } from "../helpers/fixtures.ts";
import { setupTest, type TestContext } from "../helpers/mocks.ts";

let ctx: TestContext | undefined;
afterEach(() => ctx?.cleanup());

test("muestra el clima de cada ciudad guardada", async () => {
  ctx = setupTest([{ match: "v1/forecast", data: { current: { temperature_2m: 20, weather_code: 0 } } }]);
  await addCity(ottawa);
  await addCity(asuncion);

  await listCitiesAction();

  const out = ctx.logs.join("\n");
  expect(out).toContain("Ottawa, Canadá");
  expect(out).toContain("Asunción, Paraguay");
  expect(out).toContain("Despejado"); // código WMO 0
});

test("sin ciudades guardadas, sugiere usar la opción 3", async () => {
  ctx = setupTest();
  await listCitiesAction();
  expect(ctx.logs.join("\n")).toContain("No hay ciudades guardadas");
});
