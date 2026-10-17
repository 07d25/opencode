// Captura y validación de la entrada del usuario (prompt, números, confirmaciones).

// Lee una línea del usuario con el prompt dado; si stdin se cierra (EOF), termina el proceso limpiamente.
export function readLine(text: string): string {
  const answer = prompt(text);
  if (answer === null) {
    console.log("\n¡Hasta luego!");
    process.exit(0);
  }
  return answer.trim();
}

// Pide al usuario un número que cumpla `isValid`; repite hasta obtener uno válido. Devuelve null si escribe "c" (cancelar).
// `invalidMessage` permite dar una pista más específica cuando la respuesta no es válida: puede ser un string fijo
// o una función que reciba el texto escrito (por ejemplo, para detectar si escribió una ciudad en vez de una opción).
export function askNumber(
  text: string,
  isValid: (value: number) => boolean,
  invalidMessage: string | ((raw: string) => string) = "  Valor no válido, intenta de nuevo.",
): number | null {
  while (true) {
    const raw = readLine(text);
    if (raw.toLowerCase() === "c") return null;
    const value = Number.parseInt(raw, 10);
    if (Number.isNaN(value) || !isValid(value)) {
      console.log(typeof invalidMessage === "function" ? invalidMessage(raw) : invalidMessage);
      continue;
    }
    return value;
  }
}

// Pide una confirmación s/n al usuario, repitiendo la pregunta si la respuesta no es reconocida.
export function askYesNo(text: string): boolean {
  while (true) {
    const raw = readLine(text).toLowerCase();
    if (raw === "s" || raw === "si" || raw === "sí") return true;
    if (raw === "n" || raw === "no") return false;
    console.log("  Responde s (sí) o n (no).");
  }
}
