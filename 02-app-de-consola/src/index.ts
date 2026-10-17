// Punto de entrada: muestra el menú en un loop y despacha la opción elegida a su acción.
import { addCityAction } from "./actions/addCity.ts";
import { getWeatherAction } from "./actions/getWeather.ts";
import { listCitiesAction } from "./actions/listCities.ts";
import { removeCityAction } from "./actions/removeCity.ts";
import { setDefaultCityAction } from "./actions/setDefaultCity.ts";
import { toggleUnitAction } from "./actions/toggleUnit.ts";
import { askNumber } from "./presentation/input.ts";
import { printBanner, printMenu } from "./presentation/menu.ts";
import { printSuccess } from "./presentation/output.ts";
import { getCities } from "./storage/citiesStorage.ts";
import { getUnit } from "./storage/settingsStorage.ts";
import { colors } from "./utils/colors.ts";
import { MENU_OPTIONS } from "./utils/constants.ts";

// Valida que el número elegido corresponda a una opción del menú.
function isValidOption(value: number): boolean {
  return MENU_OPTIONS.some((o) => o.value === value);
}

// Pista para una entrada inválida (en amarillo): si escribió algo que no es número (p. ej. una ciudad), guiarlo a la opción 3.
function invalidOptionHint(raw: string): string {
  if (Number.isNaN(Number.parseInt(raw, 10))) {
    return colors.yellow(`  Para buscar la ciudad "${raw}", elige la opción 3 (Buscar y agregar ciudad).`);
  }
  return colors.yellow("  Opción no válida. Elige un número del menú.");
}

// Función principal: carga el estado, muestra el menú y despacha cada opción hasta que el usuario sale.
async function main(): Promise<void> {
  printBanner();

  while (true) {
    // El menú refleja siempre el estado actual (cantidad de ciudades y unidad).
    const cityCount = (await getCities()).length;
    printMenu(cityCount, await getUnit());

    const option = askNumber("  Selecciona una opción: ", isValidOption, (raw) => invalidOptionHint(raw));
    if (option === null) continue;

    switch (option) {
      case 1:
        await getWeatherAction();
        break;
      case 2:
        await listCitiesAction();
        break;
      case 3:
        await addCityAction();
        break;
      case 4:
        await removeCityAction();
        break;
      case 5:
        await setDefaultCityAction();
        break;
      case 8:
        await toggleUnitAction();
        break;
      case 9:
        printSuccess("¡Hasta luego!");
        return;
    }
  }
}

await main();
