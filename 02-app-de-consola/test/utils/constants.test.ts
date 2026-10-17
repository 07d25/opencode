// Tests de las constantes: integridad del menú (numeración del README, valores únicos) y frames del spinner.
import { expect, test } from "bun:test";
import { MENU_OPTIONS, SPINNER_FRAMES } from "../../src/utils/constants.ts";

test("MENU_OPTIONS conserva la numeración del README (1-5, 8, 9)", () => {
  expect(MENU_OPTIONS.map((o) => o.value)).toEqual([1, 2, 3, 4, 5, 8, 9]);
});

test("MENU_OPTIONS define cada valor una sola vez", () => {
  const values = MENU_OPTIONS.map((o) => o.value);
  expect(new Set(values).size).toBe(values.length);
});

test("toda opción tiene un label no vacío", () => {
  for (const option of MENU_OPTIONS) {
    expect(option.label.length).toBeGreaterThan(0);
  }
});

test("SPINNER_FRAMES contiene frames para animar", () => {
  expect(SPINNER_FRAMES.length).toBeGreaterThan(0);
});
