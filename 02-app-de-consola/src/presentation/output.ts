// Salida y feedback al usuario: mensajes de éxito/error/pista y estado de carga (spinner).
// Solo hace console I/O; no llama a la red (eso vive en las acciones).
import { colors } from "../utils/colors.ts";
import { SPINNER_FRAMES } from "../utils/constants.ts";

// Muestra un error en rojo (fallos de red, ciudades no encontradas, etc.).
export function printError(message: string): void {
  console.log(colors.red(`  ${message}`));
}

// Muestra un éxito en verde (ciudades agregadas/eliminadas, default establecida, cambio de unidad).
export function printSuccess(message: string): void {
  console.log(colors.green(`  ${message}`));
}

// Muestra una pista o aviso en amarillo (orientación al usuario, sin ser error ni éxito).
export function printHint(message: string): void {
  console.log(colors.yellow(`  ${message}`));
}

// Ejecuta una promesa mostrando feedback mientras tanto: en TTY anima un spinner; en salida no interactiva solo imprime el texto.
// El spinner se dibuja con \r para sobreescribir la línea y se borra al terminar, dejando la salida limpia en ambos modos.
export async function withLoading<T>(text: string, task: Promise<T>): Promise<T> {
  // Sin terminal (pipes, tests) no hay spinner: solo anunciamos la operación y esperamos.
  if (!process.stdout.isTTY) {
    console.log(`  ${text}`);
    return task;
  }

  let frame = 0;
  // \r devuelve el cursor al inicio de la línea para sobreescribir el frame anterior.
  const timer = setInterval(() => {
    process.stdout.write(`\r  ${colors.cyan(SPINNER_FRAMES[frame % SPINNER_FRAMES.length]!)} ${text}`);
    frame += 1;
  }, 80);

  try {
    return await task;
  } finally {
    clearInterval(timer);
    // Borra la línea del spinner para que no se mezcle con el resultado.
    process.stdout.write("\r\u001b[2K");
  }
}
