// Primitiva única de lectura/escritura del archivo de configuración; los módulos de dominio pasan por aquí.
// Esta es la única capa que toca el JSON en disco, para mantener un solo formato de datos (~/.config/clima/config.json).
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import type { City } from "../types/City.ts";
import type { Config } from "../types/Config.ts";
import { configPath } from "./paths.ts";

// Valores por defecto: Celsius, sin default y sin ciudades guardadas.
export const DEFAULT_CONFIG: Config = { unit: "celsius", defaultCity: null, cities: [] };

// Valida que un valor del JSON tenga la forma mínima de una ciudad.
function isValidCity(value: unknown): value is City {
  if (typeof value !== "object" || value === null) return false;
  const city = value as Partial<City>;
  return (
    typeof city.name === "string" &&
    typeof city.latitude === "number" &&
    typeof city.longitude === "number"
  );
}

// Carga la configuración desde disco; si el archivo no existe o está corrupto, devuelve los valores por defecto.
export async function loadConfig(path: string = configPath()): Promise<Config> {
  try {
    const file = Bun.file(path);
    if (!(await file.exists())) return { ...DEFAULT_CONFIG, cities: [] };
    const data = (await file.json()) as Partial<Config>;
    return {
      unit: data.unit === "fahrenheit" ? "fahrenheit" : "celsius",
      defaultCity: typeof data.defaultCity === "string" ? data.defaultCity : null,
      cities: Array.isArray(data.cities) ? data.cities.filter(isValidCity) : [],
    };
  } catch {
    return { ...DEFAULT_CONFIG, cities: [] };
  }
}

// Guarda la configuración en disco, creando el directorio padre si hace falta.
export async function saveConfig(config: Config, path: string = configPath()): Promise<void> {
  mkdirSync(dirname(path), { recursive: true });
  await Bun.write(path, JSON.stringify(config, null, 2));
}
