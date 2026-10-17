// Configuración completa de la app, tal como se serializa en el archivo JSON (~/.config/clima/config.json).
import type { City } from "./City.ts";
import type { Unit } from "./Weather.ts";

export interface Config {
  unit: Unit;
  defaultCity: string | null;
  cities: City[];
}
