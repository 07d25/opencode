// Utilidades de color para la CLI: códigos ANSI con soporte para NO_COLOR y salida no interactiva (pipes).
// Cuando la salida no es una terminal (o el usuario define NO_COLOR), los helpers devuelven el texto sin modificar,
// de modo que los pipes y las pruebas reciben texto plano sin escapes ANSI.

// Paleta de colores usada en la app: cyan (menú), amarillo (temperatura/pistas), verde (éxito), rojo (error).
interface Colors {
  cyan: (text: string) => string;
  yellow: (text: string) => string;
  green: (text: string) => string;
  red: (text: string) => string;
}

// Envuelve el texto con el código ANSI dado; cada color tiene su código de apertura y cierre (reset).
function wrap(open: number, text: string): string {
  return `\u001b[${open}m${text}\u001b[0m`;
}

// Crea el conjunto de colores; si `enabled` es falso, todos los helpers devuelven el texto tal cual.
export function createColors(enabled: boolean): Colors {
  const passthrough = (text: string) => text;
  if (!enabled) {
    return { cyan: passthrough, yellow: passthrough, green: passthrough, red: passthrough };
  }
  return {
    cyan: (text) => wrap(36, text),
    yellow: (text) => wrap(33, text),
    green: (text) => wrap(32, text),
    red: (text) => wrap(31, text),
  };
}

// Colores activos según el entorno: solo en terminales interactivas y sin la variable NO_COLOR.
export const colors = createColors(process.stdout.isTTY === true && !process.env["NO_COLOR"]);
