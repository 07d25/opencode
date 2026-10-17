export interface Habit {
  name: string;
  createdOn: string;
  completions: string[];
}

export interface HabitMetrics {
  currentStreak: number;
  longestStreak: number;
  totalDays: number;
  completionPercent: number;
  doneToday: boolean;
}

export type HabitError =
  | "empty-name"
  | "invalid-name"
  | "duplicate"
  | "not-found"
  | "invalid-date"
  | "future-date"
  | "today-not-allowed"
  | "before-creation";

export type HabitResult =
  | { ok: true; habits: Habit[]; changed: boolean }
  | { ok: false; error: HabitError };

export interface CalendarDate {
  year: number;
  month: number;
  day: number;
}

const DATE_PATTERN: RegExp = /^(\d{2})-(\d{2})-(\d{4})$/;
const MILLISECONDS_PER_DAY: number = 86_400_000;

export function parseDate(value: string): CalendarDate | null {
  const match: RegExpExecArray | null = DATE_PATTERN.exec(value);
  if (match === null) return null;
  const day: number = Number(match[1]);
  const month: number = Number(match[2]);
  const year: number = Number(match[3]);
  const date: Date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  )
    return null;
  return { year, month, day };
}

export function toOrdinal(value: string): number {
  const parsed: CalendarDate | null = parseDate(value);
  if (parsed === null) throw new Error(`Fecha inválida: ${value}`);
  return Math.floor(
    Date.UTC(parsed.year, parsed.month - 1, parsed.day) / MILLISECONDS_PER_DAY,
  );
}

export function fromOrdinal(ordinal: number): string {
  const date: Date = new Date(ordinal * MILLISECONDS_PER_DAY);
  const day: string = String(date.getUTCDate()).padStart(2, "0");
  const month: string = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year: string = String(date.getUTCFullYear()).padStart(4, "0");
  return `${day}-${month}-${year}`;
}

function streakEndingOn(ordinals: Set<number>, end: number): number {
  let streak: number = 0;
  let cursor: number = end;
  while (ordinals.has(cursor)) {
    streak += 1;
    cursor -= 1;
  }
  return streak;
}

export function calculateMetrics(habit: Habit, today: string): HabitMetrics {
  const createdOrdinal: number = toOrdinal(habit.createdOn);
  const todayOrdinal: number = toOrdinal(today);
  const ordinals: number[] = [
    ...new Set(
      habit.completions.map((date: string): number => toOrdinal(date)),
    ),
  ]
    .filter(
      (ordinal: number): boolean =>
        ordinal >= createdOrdinal && ordinal <= todayOrdinal,
    )
    .sort((a: number, b: number): number => a - b);
  const completionSet: Set<number> = new Set(ordinals);
  const doneToday: boolean = completionSet.has(todayOrdinal);
  const currentStreak: number = streakEndingOn(
    completionSet,
    doneToday ? todayOrdinal : todayOrdinal - 1,
  );
  let longestStreak: number = 0;
  for (const ordinal of ordinals)
    longestStreak = Math.max(
      longestStreak,
      streakEndingOn(completionSet, ordinal),
    );
  const elapsedDays: number = Math.max(1, todayOrdinal - createdOrdinal + 1);
  const completionPercent: number = Math.min(
    100,
    Math.max(0, Math.round((ordinals.length / elapsedDays) * 100)),
  );
  return {
    currentStreak,
    longestStreak,
    totalDays: ordinals.length,
    completionPercent,
    doneToday,
  };
}

function normalizeName(name: string): string {
  return name.trim();
}

function validateName(name: string): "empty-name" | "invalid-name" | null {
  if (normalizeName(name).length === 0) return "empty-name";
  if (/\r|\n/.test(name)) return "invalid-name";
  return null;
}

function nameKey(name: string): string {
  return normalizeName(name).toLocaleLowerCase("es-ES");
}

function findHabitIndex(habits: Habit[], name: string): number {
  return habits.findIndex(
    (habit: Habit): boolean => nameKey(habit.name) === nameKey(name),
  );
}

function cloneHabits(habits: Habit[]): Habit[] {
  return habits.map((habit: Habit): Habit => ({
    ...habit,
    completions: [...habit.completions],
  }));
}

export function createHabit(
  habits: Habit[],
  name: string,
  today: string,
): HabitResult {
  const nameError: "empty-name" | "invalid-name" | null = validateName(name);
  if (nameError !== null) return { ok: false, error: nameError };
  const normalizedName: string = normalizeName(name);
  if (findHabitIndex(habits, normalizedName) !== -1)
    return { ok: false, error: "duplicate" };
  const created: Habit = {
    name: normalizedName,
    createdOn: today,
    completions: [],
  };
  return { ok: true, changed: true, habits: [...cloneHabits(habits), created] };
}

export function setDoneToday(
  habits: Habit[],
  name: string,
  today: string,
  done: boolean,
): HabitResult {
  const index: number = findHabitIndex(habits, name);
  if (index === -1) return { ok: false, error: "not-found" };
  const target: Habit | undefined = habits[index];
  if (target === undefined) return { ok: false, error: "not-found" };
  const alreadyDone: boolean = target.completions.includes(today);
  if (alreadyDone === done)
    return { ok: true, changed: false, habits: cloneHabits(habits) };
  const updated: Habit = {
    ...target,
    completions: done
      ? [...target.completions, today]
      : target.completions.filter((date: string): boolean => date !== today),
  };
  const next: Habit[] = habits.map((habit: Habit, habitIndex: number): Habit =>
    habitIndex === index
      ? updated
      : { ...habit, completions: [...habit.completions] },
  );
  return { ok: true, changed: true, habits: next };
}

export function setDoneOn(
  habits: Habit[],
  name: string,
  date: string,
  today: string,
  done: boolean,
): HabitResult {
  const index: number = findHabitIndex(habits, name);
  if (index === -1) return { ok: false, error: "not-found" };
  const target: Habit | undefined = habits[index];
  if (target === undefined) return { ok: false, error: "not-found" };
  if (parseDate(date) === null) return { ok: false, error: "invalid-date" };
  const dateOrdinal: number = toOrdinal(date);
  const todayOrdinal: number = toOrdinal(today);
  const createdOrdinal: number = toOrdinal(target.createdOn);
  if (dateOrdinal > todayOrdinal) return { ok: false, error: "future-date" };
  if (dateOrdinal === todayOrdinal)
    return { ok: false, error: "today-not-allowed" };
  if (dateOrdinal < createdOrdinal)
    return { ok: false, error: "before-creation" };
  const alreadyDone: boolean = target.completions.includes(date);
  if (alreadyDone === done)
    return { ok: true, changed: false, habits: cloneHabits(habits) };
  const updated: Habit = {
    ...target,
    completions: done
      ? [...target.completions, date]
      : target.completions.filter((entry: string): boolean => entry !== date),
  };
  const next: Habit[] = habits.map((habit: Habit, habitIndex: number): Habit =>
    habitIndex === index
      ? updated
      : { ...habit, completions: [...habit.completions] },
  );
  return { ok: true, changed: true, habits: next };
}

export function renameHabit(
  habits: Habit[],
  oldName: string,
  newName: string,
): HabitResult {
  const index: number = findHabitIndex(habits, oldName);
  if (index === -1) return { ok: false, error: "not-found" };
  const target: Habit | undefined = habits[index];
  if (target === undefined) return { ok: false, error: "not-found" };
  const nameError: "empty-name" | "invalid-name" | null = validateName(newName);
  if (nameError !== null) return { ok: false, error: nameError };
  const normalizedName: string = normalizeName(newName);
  const duplicateIndex: number = findHabitIndex(habits, normalizedName);
  if (duplicateIndex !== -1 && duplicateIndex !== index)
    return { ok: false, error: "duplicate" };
  if (nameKey(normalizedName) === nameKey(target.name)) {
    return { ok: true, changed: false, habits: cloneHabits(habits) };
  }
  const updated: Habit = {
    ...target,
    name: normalizedName,
    completions: [...target.completions],
  };
  const next: Habit[] = habits.map((habit: Habit, habitIndex: number): Habit =>
    habitIndex === index
      ? updated
      : { ...habit, completions: [...habit.completions] },
  );
  return { ok: true, changed: true, habits: next };
}

export function deleteHabit(habits: Habit[], name: string): HabitResult {
  const index: number = findHabitIndex(habits, name);
  if (index === -1) return { ok: false, error: "not-found" };
  const next: Habit[] = habits
    .filter(
      (_habit: Habit, habitIndex: number): boolean => habitIndex !== index,
    )
    .map((habit: Habit): Habit => ({
      ...habit,
      completions: [...habit.completions],
    }));
  return { ok: true, changed: true, habits: next };
}
