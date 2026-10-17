// Opción 4: eliminar una ciudad de la lista guardada (si era la default, storage se encarga de limpiarla).
import { pickCityIndex } from "../presentation/menu.ts";
import { printError, printSuccess } from "../presentation/output.ts";
import { getCities, removeCityAt } from "../storage/citiesStorage.ts";
import { getDefaultCityName } from "../storage/settingsStorage.ts";

export async function removeCityAction(): Promise<void> {
  const cities = await getCities();
  if (cities.length === 0) {
    printError("No hay ciudades guardadas.");
    return;
  }
  const index = pickCityIndex(cities, "eliminar", await getDefaultCityName());
  if (index === null) return;
  const removed = await removeCityAt(index);
  if (!removed) return;
  printSuccess(`${removed.name} eliminada.`);
}
