// Unidad de temperatura soportada por la app (se envía a OpenMeteo como temperature_unit).
export type Unit = "celsius" | "fahrenheit";

// Clima actual devuelto por el pronóstico: temperatura en la unidad pedida y código WMO del estado del cielo.
export interface WeatherResult {
  temperature: number;
  weatherCode: number;
  unit: Unit;
}
