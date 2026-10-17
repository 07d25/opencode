// API de dominio sobre el slice de ciudades de la configuración; delega el IO del archivo en configFile.
// Cada operación hace un read-modify-write completo del config.json (en un CLI los accesos son secuenciales).
import type { City } from "../types/City.ts";
import { loadConfig, saveConfig } from "./configFile.ts";
import { configPath } from "./paths.ts";

// Devuelve todas las ciudades guardadas.
export async function getCities(path: string = configPath()): Promise<City[]> {
  return (await loadConfig(path)).cities;
}

// Agrega una ciudad si no está duplicada (mismo nombre y coordenadas); devuelve true si se agregó.
export async function addCity(city: City, path: string = configPath()): Promise<boolean> {
  const config = await loadConfig(path);
  const duplicate = config.cities.some(
    (c) => c.name === city.name && c.latitude === city.latitude && c.longitude === city.longitude,
  );
  if (duplicate) return false;
  config.cities.push(city);
  await saveConfig(config, path);
  return true;
}

// Elimina la ciudad en el índice dado (base 0); devuelve la eliminada o null si el índice no es válido.
export async function removeCityAt(index: number, path: string = configPath()): Promise<City | null> {
  const config = await loadConfig(path);
  const [removed] = config.cities.splice(index, 1);
  if (!removed) return null;
  // Si era la default, queda sin default para no apuntar a una ciudad inexistente.
  if (removed.name === config.defaultCity) config.defaultCity = null;
  await saveConfig(config, path);
  return removed;
}
