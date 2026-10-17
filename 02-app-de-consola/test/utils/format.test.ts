// Tests de los formateadores puros: unitSymbol, formatWeather (con/sin país, redondeo) y errorMessage.
import { expect, test } from "bun:test";
import { errorMessage, formatWeather, unitSymbol } from "../../src/utils/format.ts";
import type { City } from "../../src/types/City.ts";

const ottawa: City = { name: "Ottawa", country: "Canadá", latitude: 45.41117, longitude: -75.69812 };

test("unitSymbol devuelve el símbolo correcto", () => {
  expect(unitSymbol("celsius")).toBe("°C");
  expect(unitSymbol("fahrenheit")).toBe("°F");
});

test("formatWeather incluye nombre, país, temperatura y estado del cielo", () => {
  const line = formatWeather(ottawa, 21.34, 0, "celsius");
  expect(line).toContain("Ottawa, Canadá");
  expect(line).toContain("21.3 °C");
  expect(line).toContain("Despejado"); // código WMO 0
});

test("formatWeather omite el país si está vacío", () => {
  const line = formatWeather({ ...ottawa, country: "" }, 21.34, 0, "celsius");
  expect(line).toContain("Ottawa:");
  expect(line).not.toContain("Ottawa,");
});

test("formatWeather redondea la temperatura a un decimal", () => {
  expect(formatWeather(ottawa, 21.34, 0, "celsius")).toContain("21.3 °C");
  expect(formatWeather(ottawa, 21.36, 0, "celsius")).toContain("21.4 °C");
});

test("errorMessage extrae el mensaje de un Error y convierte otros valores", () => {
  expect(errorMessage(new Error("fallo de red"))).toBe("fallo de red");
  expect(errorMessage("texto plano")).toBe("texto plano");
});
