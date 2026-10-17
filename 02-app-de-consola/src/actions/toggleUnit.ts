// Opción 8: alternar la unidad de temperatura entre °C y °F y guardar la preferencia.
import { printSuccess } from "../presentation/output.ts";
import { getUnit, setUnit } from "../storage/settingsStorage.ts";
import { unitSymbol } from "../utils/format.ts";

export async function toggleUnitAction(): Promise<void> {
  const next = (await getUnit()) === "celsius" ? "fahrenheit" : "celsius";
  await setUnit(next);
  printSuccess(`Unidad de temperatura: ${unitSymbol(next)}`);
}
