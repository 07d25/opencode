// Test del flujo de la opción 1 (getWeather): mostrar el clima de la ciudad default, y el caso sin ciudades.
import { afterEach, expect, test } from "bun:test";
import { getWeatherAction } from "../../src/actions/getWeather.ts";
import { addCity } from "../../src/storage/citiesStorage.ts";
import { setDefaultCity } from "../../src/storage/settingsStorage.ts";
import { asuncion } from "../helpers/fixtures.ts";
import { setupTest, type TestContext } from "../helpers/mocks.ts";

let ctx: TestContext | undefined;
afterEach(() => ctx?.cleanup());

test("muestra el clima de la ciudad default", async () => {
  ctx = setupTest(
    [{ match: "v1/forecast", data: { current: { temperature_2m: 25.5, weather_code: 61 } } }],
    [], // no necesita input: ya hay una default
  );
  await addCity(asuncion);
  await setDefaultCity("Asunción");

  await getWeatherAction();

  const out = ctx.logs.join("\n");
  expect(out).toContain("Asunción, Paraguay");
  expect(out).toContain("25.5 °C");
  expect(out).toContain("Lluvia ligera"); // código WMO 61
});

test("sin ciudades guardadas, sugiere usar la opción 3", async () => {
  ctx = setupTest([], []);
  await getWeatherAction();
  expect(ctx.logs.join("\n")).toContain("No hay ciudades guardadas");
});
