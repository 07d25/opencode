// Opción 2: mostrar el clima de todas las ciudades guardadas, una por línea.
import { printError } from "../presentation/output.ts";
import { getCities } from "../storage/citiesStorage.ts";
import { getUnit } from "../storage/settingsStorage.ts";
import { printCityWeather } from "./getWeather.ts";

export async function listCitiesAction(): Promise<void> {
  const cities = await getCities();
  if (cities.length === 0) {
    printError("No hay ciudades guardadas. Usa la opción 3 para agregar una.");
    return;
  }
  const unit = await getUnit();
  for (const city of cities) {
    await printCityWeather(city, unit);
  }
}
