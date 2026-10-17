// Constantes generales de la app: opciones del menú y frames del spinner de carga.
import type { MenuOption } from "../types/MenuOption.ts";

// Opciones del menú principal (conserva la numeración del README, incluido el salto al 8 y el 9).
export const MENU_OPTIONS: MenuOption[] = [
  { value: 1, label: "Clima de ciudad default" },
  { value: 2, label: "Clima de todas las ciudades" },
  { value: 3, label: "Buscar y agregar ciudad" },
  { value: 4, label: "Eliminar ciudad" },
  { value: 5, label: "Establecer ciudad default" },
  { value: 8, label: "Ajustes" },
  { value: 9, label: "Salir" },
];

// Frames del spinner de carga (braille), que se muestran mientras una tarea asíncrona termina.
export const SPINNER_FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
