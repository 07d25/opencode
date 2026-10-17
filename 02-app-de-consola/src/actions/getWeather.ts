// Opción 1: obtener y mostrar el clima de la ciudad default (y el helper compartido para mostrar el clima de una ciudad).
import { getWeather } from "../api/weather.ts";
import { pickCityIndex } from "../presentation/menu.ts";
import { printError, printHint, printSuccess, withLoading } from "../presentation/output.ts";
import { getCities } from "../storage/citiesStorage.ts";
import { getDefaultCityName, getUnit, setDefaultCity } from "../storage/settingsStorage.ts";
import type { City } from "../types/City.ts";
import type { Unit } from "../types/Weather.ts";
import { errorMessage, formatWeather } from "../utils/format.ts";

// Resuelve la ciudad default (por nombre) dentro de las ciudades guardadas; null si no existe o no está registrada.
async function resolveDefaultCity(): Promise<City | null> {
  const name = await getDefaultCityName();
  if (!name) return null;
  const cities = await getCities();
  return cities.find((c) => c.name === name) ?? null;
}

// Obtiene el clima de una ciudad y lo muestra; un fallo individual se reporta en rojo sin detener la app. Spinner mientras carga.
// Compartido por la opción 1 (ciudad default) y la opción 2 (todas las ciudades).
export async function printCityWeather(city: City, unit: Unit): Promise<void> {
  try {
    const weather = await withLoading(`Obteniendo clima de ${city.name}…`, getWeather(city, unit));
    console.log(formatWeather(city, weather.temperature, weather.weatherCode, unit));
  } catch (error) {
    printError(`No se pudo obtener el clima de ${city.name}: ${errorMessage(error)}`);
  }
}

// Opción 1: muestra el clima de la ciudad default; si no hay, ayuda a establecer una.
export async function getWeatherAction(): Promise<void> {
  const unit = await getUnit();
  const city = await resolveDefaultCity();
  if (city) {
    await printCityWeather(city, unit);
    return;
  }

  const cities = await getCities();
  if (cities.length === 0) {
    printError("No hay ciudades guardadas. Usa la opción 3 para agregar una.");
    return;
  }

  printHint("Aún no hay ciudad default. Elige una para establecerla:");
  const index = pickCityIndex(cities, "establecer como default", null);
  if (index === null) return;
  const chosen = cities[index]!;
  await setDefaultCity(chosen.name);
  printSuccess(`${chosen.name} ahora es la ciudad default.`);
}
