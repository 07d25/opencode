// Formateadores puros de datos para la CLI (no imprimen, devuelven strings).
import { describeWeatherCode } from "../api/weather.ts";
import type { City } from "../types/City.ts";
import type { Unit } from "../types/Weather.ts";

// Símbolo de la unidad de temperatura para mostrar (°C o °F).
export function unitSymbol(unit: Unit): string {
  return unit === "celsius" ? "°C" : "°F";
}

// Da una ciudad del clima en una línea legible: "Ottawa, Canadá: 21.3 °C — Despejado".
export function formatWeather(city: City, temperature: number, weatherCode: number, unit: Unit): string {
  const country = city.country ? `, ${city.country}` : "";
  return `  ${city.name}${country}: ${temperature.toFixed(1)} ${unitSymbol(unit)} — ${describeWeatherCode(weatherCode)}`;
}

// Obtiene el mensaje legible de un error, para mostrarlo al usuario.
export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
