// Obtención del clima actual vía la API de pronóstico de OpenMeteo (sin API key).
import type { City } from "../types/City.ts";
import type { Unit, WeatherResult } from "../types/Weather.ts";
import { fetchJson } from "./http.ts";

// URL base del servicio de pronóstico.
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

// Traducción de los códigos de clima WMO a textos en español para mostrar al usuario.
const WEATHER_CODES: Record<number, string> = {
  0: "Despejado",
  1: "Mayormente despejado",
  2: "Parcialmente nublado",
  3: "Nublado",
  45: "Niebla",
  48: "Niebla con escarcha",
  51: "Llovizna ligera",
  53: "Llovizna moderada",
  55: "Llovizna intensa",
  56: "Llovizna congelante ligera",
  57: "Llovizna congelante intensa",
  61: "Lluvia ligera",
  63: "Lluvia moderada",
  65: "Lluvia intensa",
  66: "Lluvia congelante ligera",
  67: "Lluvia congelante intensa",
  71: "Nieve ligera",
  73: "Nieve moderada",
  75: "Nieve intensa",
  77: "Granos de nieve",
  80: "Chubascos ligeros",
  81: "Chubascos moderados",
  82: "Chubascos intensos",
  85: "Chubascos de nieve ligeros",
  86: "Chubascos de nieve intensos",
  95: "Tormenta eléctrica",
  96: "Tormenta con granizo ligera",
  99: "Tormenta con granizo intensa",
};

// Devuelve el texto en español de un código WMO, o un texto genérico si no lo conocemos.
export function describeWeatherCode(code: number): string {
  return WEATHER_CODES[code] ?? "Clima desconocido";
}

// Extrae temperatura y código de clima de la sección "current" del pronóstico; lanza error si la respuesta no la trae.
export function parseWeatherResponse(data: unknown, unit: Unit): WeatherResult {
  const current = (data as { current?: { temperature_2m?: unknown; weather_code?: unknown } } | null)?.current;
  const temperature = current?.temperature_2m;
  const weatherCode = current?.weather_code;
  if (typeof temperature !== "number" || typeof weatherCode !== "number") {
    throw new Error("El servicio del clima devolvió una respuesta inválida.");
  }
  return { temperature, weatherCode, unit };
}

// Obtiene el clima actual (temperatura y estado del cielo) para las coordenadas de una ciudad, en la unidad indicada.
export async function getWeather(city: City, unit: Unit): Promise<WeatherResult> {
  const params = new URLSearchParams({
    latitude: String(city.latitude),
    longitude: String(city.longitude),
    current: "temperature_2m,weather_code",
    temperature_unit: unit,
  });
  return parseWeatherResponse(await fetchJson(`${FORECAST_URL}?${params}`), unit);
}
