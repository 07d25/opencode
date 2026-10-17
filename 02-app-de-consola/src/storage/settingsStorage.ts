// API de dominio sobre los ajustes (unidad de temperatura y ciudad default); delega el IO del archivo en configFile.
import type { Unit } from "../types/Weather.ts";
import { loadConfig, saveConfig } from "./configFile.ts";
import { configPath } from "./paths.ts";

// Devuelve la unidad de temperatura guardada (por defecto Celsius).
export async function getUnit(path: string = configPath()): Promise<Unit> {
  return (await loadConfig(path)).unit;
}

// Guarda la unidad de temperatura.
export async function setUnit(unit: Unit, path: string = configPath()): Promise<void> {
  const config = await loadConfig(path);
  config.unit = unit;
  await saveConfig(config, path);
}

// Devuelve el nombre de la ciudad default, o null si no hay ninguna establecida.
export async function getDefaultCityName(path: string = configPath()): Promise<string | null> {
  return (await loadConfig(path)).defaultCity;
}

// Establece la ciudad default (o la limpia pasando null).
export async function setDefaultCity(name: string | null, path: string = configPath()): Promise<void> {
  const config = await loadConfig(path);
  config.defaultCity = name;
  await saveConfig(config, path);
}
