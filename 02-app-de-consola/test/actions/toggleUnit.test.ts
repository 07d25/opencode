// Test del flujo de la opción 8 (toggleUnit): alternar la unidad de temperatura y persistirla.
import { afterEach, expect, test } from "bun:test";
import { toggleUnitAction } from "../../src/actions/toggleUnit.ts";
import { getUnit } from "../../src/storage/settingsStorage.ts";
import { setupTest, type TestContext } from "../helpers/mocks.ts";

let ctx: TestContext | undefined;
afterEach(() => ctx?.cleanup());

test("alterna de Celsius a Fahrenheit y persiste", async () => {
  ctx = setupTest();
  expect(await getUnit()).toBe("celsius");
  await toggleUnitAction();
  expect(await getUnit()).toBe("fahrenheit");
  expect(ctx.logs.join("\n")).toContain("°F");
});

test("alterna dos veces y vuelve a Celsius", async () => {
  ctx = setupTest();
  await toggleUnitAction(); // → fahrenheit
  await toggleUnitAction(); // → celsius
  expect(await getUnit()).toBe("celsius");
});
