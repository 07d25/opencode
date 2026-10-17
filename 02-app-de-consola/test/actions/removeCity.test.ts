// Test del flujo de la opción 4 (removeCity): eliminar una ciudad y limpiar la default si era la eliminada.
import { afterEach, expect, test } from "bun:test";
import { removeCityAction } from "../../src/actions/removeCity.ts";
import { addCity } from "../../src/storage/citiesStorage.ts";
import { loadConfig } from "../../src/storage/configFile.ts";
import { setDefaultCity } from "../../src/storage/settingsStorage.ts";
import { asuncion, ottawa } from "../helpers/fixtures.ts";
import { setupTest, type TestContext } from "../helpers/mocks.ts";

let ctx: TestContext | undefined;
afterEach(() => ctx?.cleanup());

test("elimina la ciudad elegida y limpia la default", async () => {
  ctx = setupTest([], ["1"]); // elegir la ciudad 1 (Ottawa) para eliminar
  await addCity(ottawa);
  await addCity(asuncion);
  await setDefaultCity("Ottawa");

  await removeCityAction();

  const config = await loadConfig();
  expect(config.cities.map((c) => c.name)).toEqual(["Asunción"]);
  expect(config.defaultCity).toBeNull(); // la default eliminada se limpia
  expect(ctx.logs.join("\n")).toContain("Ottawa eliminada.");
});
