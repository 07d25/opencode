// Test del flujo de la opción 5 (setDefaultCity): establecer una de las ciudades guardadas como default.
import { afterEach, expect, test } from "bun:test";
import { setDefaultCityAction } from "../../src/actions/setDefaultCity.ts";
import { addCity } from "../../src/storage/citiesStorage.ts";
import { getDefaultCityName } from "../../src/storage/settingsStorage.ts";
import { asuncion, ottawa } from "../helpers/fixtures.ts";
import { setupTest, type TestContext } from "../helpers/mocks.ts";

let ctx: TestContext | undefined;
afterEach(() => ctx?.cleanup());

test("establece la ciudad elegida como default", async () => {
  ctx = setupTest([], ["2"]); // elegir la ciudad 2 (Asunción)
  await addCity(ottawa);
  await addCity(asuncion);

  await setDefaultCityAction();

  expect(await getDefaultCityName()).toBe("Asunción");
  expect(ctx.logs.join("\n")).toContain("Asunción ahora es la ciudad default.");
});
