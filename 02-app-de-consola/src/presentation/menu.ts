// Renderizado del menú principal y de la lista de ciudades para elegir una opción.
import type { City } from "../types/City.ts";
import type { Unit } from "../types/Weather.ts";
import { colors } from "../utils/colors.ts";
import { MENU_OPTIONS } from "../utils/constants.ts";
import { unitSymbol } from "../utils/format.ts";
import { askNumber } from "./input.ts";

// Imprime el banner decorativo de la app, en cyan.
export function printBanner(): void {
  console.log(colors.cyan("════════════════════════════════════════"));
  console.log(colors.cyan("           WEATHER CLI"));
  console.log(colors.cyan("════════════════════════════════════════"));
}

// Imprime el menú principal; refleja la cantidad de ciudades guardadas y la unidad de temperatura actual. Bordes en cyan.
export function printMenu(cityCount: number, unit: Unit): void {
  console.log(colors.cyan("════════════════════════════════════════"));
  for (const option of MENU_OPTIONS) {
    let label = option.label;
    // La opción 2 muestra cuántas ciudades hay; la 8, la unidad actual.
    if (option.value === 2) label += ` (${cityCount})`;
    if (option.value === 8) label += ` (${unitSymbol(unit)})`;
    console.log(`  ${option.value}. ${label}`);
  }
  console.log(colors.cyan("════════════════════════════════════════"));
}

// Muestra la lista de ciudades numerada (marcando la default) y devuelve el índice de arreglo elegido (base 0),
// o null si el usuario cancela con "c".
export function pickCityIndex(cities: City[], action: string, defaultName: string | null): number | null {
  cities.forEach((city, index) => {
    const country = city.country ? `, ${city.country}` : "";
    const marker = city.name === defaultName ? " (default)" : "";
    console.log(`  ${index + 1}. ${city.name}${country}${marker}`);
  });
  const choice = askNumber(`  ¿Cuál ${action}? (número, c para cancelar): `, (n) => n >= 1 && n <= cities.length);
  return choice === null ? null : choice - 1;
}
