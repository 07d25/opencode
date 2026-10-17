// Resolución de las rutas de configuración dentro del directorio del usuario.
// Respeta XDG_CONFIG_HOME si está definido (permite a los tests aislar la config en un dir temporal);
// en caso contrario usa ~/.config/clima, igual que siempre.
import { homedir } from "node:os";
import { join } from "node:path";

// Directorio base de configuración: XDG_CONFIG_HOME si existe, o ~/.config.
function baseConfigDir(): string {
  const xdg = process.env["XDG_CONFIG_HOME"];
  return xdg && xdg.length > 0 ? xdg : join(homedir(), ".config");
}

// Directorio de configuración de la app (~/.config/clima, o $XDG_CONFIG_HOME/clima).
export function configDir(): string {
  return join(baseConfigDir(), "clima");
}

// Ruta del archivo de configuración (ciudades, default y unidad en un solo JSON).
export function configPath(): string {
  return join(configDir(), "config.json");
}
