// Tests de la capa de colores: modo desactivado (texto plano, sin escapes) y modo activo (envuelve con ANSI).
import { expect, test } from "bun:test";
import { createColors } from "../../src/utils/colors.ts";

test("en modo desactivado devuelve el texto sin modificar", () => {
  const colors = createColors(false);
  expect(colors.cyan("menú")).toBe("menú");
  expect(colors.yellow("21.3 °C")).toBe("21.3 °C");
  expect(colors.green("agregada")).toBe("agregada");
  expect(colors.red("error")).toBe("error");
});

test("en modo activo envuelve cada color con su código ANSI", () => {
  const colors = createColors(true);
  // 36 = cyan, 33 = amarillo, 32 = verde, 31 = rojo; \u001b[0m cierra el color.
  expect(colors.cyan("x")).toBe("\u001b[36mx\u001b[0m");
  expect(colors.yellow("x")).toBe("\u001b[33mx\u001b[0m");
  expect(colors.green("x")).toBe("\u001b[32mx\u001b[0m");
  expect(colors.red("x")).toBe("\u001b[31mx\u001b[0m");
});

test("el texto coloreado conserva el contenido original", () => {
  const colors = createColors(true);
  expect(colors.green("Ottawa agregada.")).toContain("Ottawa agregada.");
});
