// Opción 3: buscar una ciudad por nombre vía geocoding, dejar que el usuario elija y agregarla a la lista guardada.
import { searchCity } from "../api/geocoding.ts";
import { askNumber, askYesNo, readLine } from "../presentation/input.ts";
import { printError, printSuccess, withLoading } from "../presentation/output.ts";
import { addCity } from "../storage/citiesStorage.ts";
import { getDefaultCityName, setDefaultCity } from "../storage/settingsStorage.ts";
import type { City } from "../types/City.ts";
import { errorMessage } from "../utils/format.ts";

export async function addCityAction(): Promise<void> {
  const name = readLine("  Nombre de la ciudad (c para cancelar): ");
  if (!name || name.toLowerCase() === "c") return;

  let results: City[];
  try {
    results = await withLoading(`Buscando "${name}"…`, searchCity(name));
  } catch (error) {
    printError(`No se pudo buscar la ciudad: ${errorMessage(error)}`);
    return;
  }

  if (results.length === 0) {
    printError(`No se encontró ninguna ciudad llamada "${name}".`);
    return;
  }

  console.log("  Coincidencias:");
  results.forEach((city, index) => {
    const country = city.country ? `, ${city.country}` : "";
    console.log(`  ${index + 1}. ${city.name}${country}`);
  });

  const choice = askNumber("  ¿Cuál agregar? (número, c para cancelar): ", (n) => n >= 1 && n <= results.length);
  if (choice === null) return;
  const city = results[choice - 1]!;

  const added = await addCity(city);
  if (added) {
    printSuccess(`${city.name} agregada.`);
  } else {
    console.log(`  ${city.name} ya está en la lista.`);
  }

  // Si todavía no hay ciudad default, ofrecemos usar esta recién agregada.
  if ((await getDefaultCityName()) === null && askYesNo("  ¿Establecer como ciudad default? (s/n): ")) {
    await setDefaultCity(city.name);
    printSuccess(`${city.name} ahora es la ciudad default.`);
  }
}
