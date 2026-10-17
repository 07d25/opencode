// Cliente HTTP compartido para las APIs de OpenMeteo: convierte fallos de red y HTTP en errores con mensaje en español.

// Mensaje genérico cuando falla la conexión con OpenMeteo.
const NETWORK_ERROR = "No se pudo conectar con OpenMeteo. Revisa tu conexión a internet.";

// Ejecuta una petición GET y devuelve el JSON; lanza errores con mensaje en español si algo falla.
export async function fetchJson(url: string): Promise<unknown> {
  let response: Response;
  try {
    response = await fetch(url);
  } catch {
    throw new Error(NETWORK_ERROR);
  }
  if (!response.ok) {
    throw new Error("El servicio de OpenMeteo no respondió correctamente. Intenta de nuevo más tarde.");
  }
  return response.json();
}
