// Búsqueda de ciudades por nombre en la API de geocoding de OpenMeteo (sin API key).
import type { City } from "../types/City.ts";
import { fetchJson } from "./http.ts";

// URL base del servicio de geocoding.
const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";

// Convierte la respuesta JSON del geocoding en ciudades válidas; descarta entradas malformadas o ausentes.
export function parseGeocodingResponse(data: unknown): City[] {
  if (typeof data !== "object" || data === null) return [];
  const results = (data as { results?: unknown }).results;
  if (!Array.isArray(results)) return [];

  const cities: City[] = [];
  for (const entry of results) {
    if (typeof entry !== "object" || entry === null) continue;
    const result = entry as { name?: unknown; country?: unknown; latitude?: unknown; longitude?: unknown };
    if (typeof result.name !== "string" || typeof result.latitude !== "number" || typeof result.longitude !== "number") {
      continue;
    }
    cities.push({
      name: result.name,
      country: typeof result.country === "string" ? result.country : "",
      latitude: result.latitude,
      longitude: result.longitude,
    });
  }
  return cities;
}

// Busca ciudades por nombre en la API de geocoding (en español) y devuelve hasta 5 coincidencias
// para que el usuario pueda desambiguar nombres iguales.
export async function searchCity(name: string): Promise<City[]> {
  const url = `${GEOCODING_URL}?name=${encodeURIComponent(name)}&count=5&language=es&format=json`;
  return parseGeocodingResponse(await fetchJson(url));
}
