import { existsSync } from "node:fs";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { parseDate, toOrdinal, type Habit } from "./core";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isValidDate(value: string): boolean {
  return parseDate(value) !== null;
}

function isValidName(value: string): boolean {
  return value.trim().length > 0 && !/\r|\n/.test(value);
}

function isHabit(value: unknown, todayOrdinal: number): value is Habit {
  if (!isRecord(value)) return false;
  const name: unknown = value.name;
  const createdOn: unknown = value.createdOn;
  const completions: unknown = value.completions;
  if (typeof name !== "string" || !isValidName(name)) return false;
  if (
    typeof createdOn !== "string" ||
    !isValidDate(createdOn) ||
    toOrdinal(createdOn) > todayOrdinal
  ) {
    return false;
  }
  if (!Array.isArray(completions)) return false;
  const createdOrdinal: number = toOrdinal(createdOn);
  const seen: Set<string> = new Set();
  for (const completion of completions as unknown[]) {
    if (typeof completion !== "string" || !isValidDate(completion))
      return false;
    const ordinal: number = toOrdinal(completion);
    if (ordinal < createdOrdinal || ordinal > todayOrdinal) return false;
    if (seen.has(completion)) return false;
    seen.add(completion);
  }
  return true;
}

export async function loadHabits(
  filePath: string,
  today: string,
): Promise<Habit[]> {
  if (!existsSync(filePath)) return [];
  let parsed: unknown;
  try {
    parsed = JSON.parse(await readFile(filePath, "utf8"));
  } catch {
    throw new Error("El archivo de hábitos tiene un formato inválido.");
  }
  const todayOrdinal: number = toOrdinal(today);
  const isInvalid: boolean =
    !Array.isArray(parsed) ||
    !parsed.every((value: unknown): boolean => isHabit(value, todayOrdinal));
  if (isInvalid) {
    throw new Error("El archivo de hábitos tiene un formato inválido.");
  }
  const habits: Habit[] = parsed as Habit[];
  const names: string[] = habits.map((habit: Habit): string =>
    habit.name.trim().toLocaleLowerCase("es-ES"),
  );
  if (new Set(names).size !== names.length) {
    throw new Error("El archivo de hábitos tiene un formato inválido.");
  }
  return habits;
}

export async function saveHabits(
  filePath: string,
  habits: Habit[],
): Promise<void> {
  await mkdir(dirname(filePath), { recursive: true });
  const temporaryPath: string = `${filePath}.tmp`;
  await writeFile(
    temporaryPath,
    `${JSON.stringify(habits, null, 2)}\n`,
    "utf8",
  );
  await rename(temporaryPath, filePath);
}
