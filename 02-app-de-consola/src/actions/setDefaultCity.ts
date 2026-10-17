// Opción 5: establecer una de las ciudades guardadas como la ciudad default.
import { pickCityIndex } from "../presentation/menu.ts";
import { printError, printSuccess } from "../presentation/output.ts";
import { getCities } from "../storage/citiesStorage.ts";
import { getDefaultCityName, setDefaultCity } from "../storage/settingsStorage.ts";

export async function setDefaultCityAction(): Promise<void> {
  const cities = await getCities();
  if (cities.length === 0) {
    printError("No hay ciudades guardadas. Usa la opción 3 para agregar una.");
    return;
  }
  const index = pickCityIndex(cities, "establecer como default", await getDefaultCityName());
  if (index === null) return;
  const city = cities[index]!;
  await setDefaultCity(city.name);
  printSuccess(`${city.name} ahora es la ciudad default.`);
}
