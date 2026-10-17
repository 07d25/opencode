// Tests de la capa de clima: parseo del pronóstico y traducción de códigos WMO.
import { expect, test } from "bun:test";
import { describeWeatherCode, parseWeatherResponse } from "../../src/api/weather.ts";

test("extrae la temperatura y el código de clima de current", () => {
  const weather = parseWeatherResponse({ current: { temperature_2m: 21.3, weather_code: 0 } }, "celsius");
  expect(weather).toEqual({ temperature: 21.3, weatherCode: 0, unit: "celsius" });
});

test("propaga la unidad solicitada", () => {
  const weather = parseWeatherResponse({ current: { temperature_2m: 70.3, weather_code: 1 } }, "fahrenheit");
  expect(weather.unit).toBe("fahrenheit");
});

test("lanza error si falta la sección current", () => {
  expect(() => parseWeatherResponse({}, "celsius")).toThrow();
  expect(() => parseWeatherResponse({ current: { temperature_2m: 21.3 } }, "celsius")).toThrow();
});

test("traduce los códigos WMO conocidos", () => {
  expect(describeWeatherCode(0)).toBe("Despejado");
  expect(describeWeatherCode(63)).toBe("Lluvia moderada");
  expect(describeWeatherCode(95)).toBe("Tormenta eléctrica");
});

test("devuelve texto genérico para códigos desconocidos", () => {
  expect(describeWeatherCode(1234)).toBe("Clima desconocido");
});
