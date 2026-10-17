import { describe, expect, test } from "bun:test";
import {
  fromOrdinal,
  parseDate,
  toOrdinal,
  calculateMetrics,
  createHabit,
  setDoneToday,
  setDoneOn,
  renameHabit,
  deleteHabit,
  type Habit,
  type HabitResult,
} from "../src/core";

const today: string = "17-10-2026";

function habit(completions: string[], createdOn: string = "10-10-2026"): Habit {
  return { name: "Leer", createdOn, completions };
}

describe("utilidades de fecha", (): void => {
  test("parseDate acepta dd-mm-aaaa y rechaza formatos incorrectos", (): void => {
    expect(parseDate("17-10-2026")).toEqual({ year: 2026, month: 10, day: 17 });
    expect(parseDate("2026-10-17")).toBeNull();
    expect(parseDate("1-1-2026")).toBeNull();
    expect(parseDate("")).toBeNull();
  });

  test("parseDate rechaza fechas inexistentes en el calendario", (): void => {
    expect(parseDate("31-02-2026")).toBeNull();
    expect(parseDate("00-10-2026")).toBeNull();
    expect(parseDate("17-13-2026")).toBeNull();
  });

  test("toOrdinal diferencia días consecutivos cruzando mes y año", (): void => {
    expect(toOrdinal("01-02-2026") - toOrdinal("31-01-2026")).toBe(1);
    expect(fromOrdinal(toOrdinal("31-12-2026") + 1)).toBe("01-01-2027");
    expect(fromOrdinal(toOrdinal("29-02-2028"))).toBe("29-02-2028");
  });
});

describe("calculateMetrics", (): void => {
  test("cuenta la racha actual hasta hoy con todas las métricas", (): void => {
    const metrics = calculateMetrics(
      habit(["14-10-2026", "15-10-2026", "16-10-2026", "17-10-2026"]),
      today,
    );
    expect(metrics).toEqual({
      currentStreak: 4,
      longestStreak: 4,
      totalDays: 4,
      completionPercent: 50,
      doneToday: true,
    });
  });

  test("mantiene la racha hasta ayer cuando hoy no está marcado", (): void => {
    const metrics = calculateMetrics(
      habit(["15-10-2026", "16-10-2026"]),
      today,
    );
    expect(metrics.currentStreak).toBe(2);
    expect(metrics.doneToday).toBe(false);
  });

  test("devuelve racha actual 0 si hoy y ayer no están marcados", (): void => {
    const metrics = calculateMetrics(
      habit(["10-10-2026", "11-10-2026"]),
      today,
    );
    expect(metrics.currentStreak).toBe(0);
    expect(metrics.longestStreak).toBe(2);
  });

  test("corta la racha actual tras un hueco y conserva la máxima", (): void => {
    const metrics = calculateMetrics(
      habit(["10-10-2026", "11-10-2026", "15-10-2026"]),
      today,
    );
    expect(metrics.currentStreak).toBe(0);
    expect(metrics.longestStreak).toBe(2);
  });

  test("conserva la racha máxima cuando hay empate", (): void => {
    const metrics = calculateMetrics(
      habit(["10-10-2026", "11-10-2026", "14-10-2026", "15-10-2026"]),
      today,
    );
    expect(metrics.longestStreak).toBe(2);
  });

  test("ignora los registros fuera del rango [createdOn, hoy]", (): void => {
    const metrics = calculateMetrics(
      habit(["09-10-2026", "11-10-2026", "18-10-2026"]),
      today,
    );
    expect(metrics).toEqual({
      currentStreak: 0,
      longestStreak: 1,
      totalDays: 1,
      completionPercent: 13,
      doneToday: false,
    });
  });

  test("un hábito creado hoy da 0% o 100%", (): void => {
    expect(calculateMetrics(habit([], today), today).completionPercent).toBe(0);
    expect(
      calculateMetrics(habit([today], today), today).completionPercent,
    ).toBe(100);
  });

  test("redondea el porcentaje al entero más próximo hacia arriba en .5", (): void => {
    expect(
      calculateMetrics(habit(["15-10-2026"]), today).completionPercent,
    ).toBe(13);
  });
});

describe("createHabit", (): void => {
  test("crea el hábito normalizando los espacios exteriores", (): void => {
    const result: HabitResult = createHabit([], "  Leer  ", today);
    expect(result).toEqual({
      ok: true,
      changed: true,
      habits: [{ name: "Leer", createdOn: today, completions: [] }],
    });
  });

  test("conserva los espacios internos del nombre", (): void => {
    const result: HabitResult = createHabit([], "Leer  libro", today);
    expect(result).toEqual({
      ok: true,
      changed: true,
      habits: [{ name: "Leer  libro", createdOn: today, completions: [] }],
    });
  });

  test("rechaza nombres vacíos o solo con espacios", (): void => {
    expect(createHabit([], "   ", today)).toEqual({
      ok: false,
      error: "empty-name",
    });
    expect(createHabit([], "", today)).toEqual({
      ok: false,
      error: "empty-name",
    });
  });

  test("rechaza nombres con saltos de línea", (): void => {
    expect(createHabit([], "Leer\nlibro", today)).toEqual({
      ok: false,
      error: "invalid-name",
    });
  });

  test("rechaza duplicados sin distinguir mayúsculas", (): void => {
    expect(createHabit([habit([])], "leer", today)).toEqual({
      ok: false,
      error: "duplicate",
    });
    expect(createHabit([habit([])], "  LEER  ", today)).toEqual({
      ok: false,
      error: "duplicate",
    });
  });

  test("no muta la lista original", (): void => {
    const original: Habit[] = [habit([])];
    createHabit(original, "Meditar", today);
    expect(original).toEqual([habit([])]);
  });
});

describe("setDoneToday", (): void => {
  test("marca hoy añadiendo el registro", (): void => {
    const result: HabitResult = setDoneToday([habit([])], "Leer", today, true);
    expect(result).toEqual({
      ok: true,
      changed: true,
      habits: [habit([today])],
    });
  });

  test("marcar dos veces hoy es idempotente", (): void => {
    const result: HabitResult = setDoneToday(
      [habit([today])],
      "Leer",
      today,
      true,
    );
    expect(result).toEqual({
      ok: true,
      changed: false,
      habits: [habit([today])],
    });
  });

  test("desmarca hoy quitando el registro", (): void => {
    const result: HabitResult = setDoneToday(
      [habit([today, "16-10-2026"])],
      "Leer",
      today,
      false,
    );
    expect(result).toEqual({
      ok: true,
      changed: true,
      habits: [habit(["16-10-2026"])],
    });
  });

  test("desmarcar cuando no estaba marcado es idempotente", (): void => {
    const result: HabitResult = setDoneToday([habit([])], "Leer", today, false);
    expect(result).toEqual({ ok: true, changed: false, habits: [habit([])] });
  });

  test("encuentra el hábito sin distinguir mayúsculas", (): void => {
    const result: HabitResult = setDoneToday([habit([])], "lEeR", today, true);
    expect(result.ok).toBe(true);
  });

  test("informa un hábito inexistente", (): void => {
    expect(setDoneToday([], "Leer", today, true)).toEqual({
      ok: false,
      error: "not-found",
    });
  });

  test("no muta la lista original", (): void => {
    const original: Habit[] = [habit([])];
    setDoneToday(original, "Leer", today, true);
    expect(original).toEqual([habit([])]);
  });
});

describe("setDoneOn (spec 002)", (): void => {
  test("marca un día pasado añadiendo el registro", (): void => {
    const result: HabitResult = setDoneOn(
      [habit([])],
      "Leer",
      "16-10-2026",
      today,
      true,
    );
    expect(result).toEqual({
      ok: true,
      changed: true,
      habits: [habit(["16-10-2026"])],
    });
  });

  test("desmarca un día pasado quitando el registro", (): void => {
    const result: HabitResult = setDoneOn(
      [habit(["15-10-2026", "16-10-2026"])],
      "Leer",
      "15-10-2026",
      today,
      false,
    );
    expect(result).toEqual({
      ok: true,
      changed: true,
      habits: [habit(["16-10-2026"])],
    });
  });

  test("marcar dos veces el mismo día pasado es idempotente", (): void => {
    const result: HabitResult = setDoneOn(
      [habit(["16-10-2026"])],
      "Leer",
      "16-10-2026",
      today,
      true,
    );
    expect(result).toEqual({
      ok: true,
      changed: false,
      habits: [habit(["16-10-2026"])],
    });
  });

  test("desmarcar un día pasado no marcado es idempotente", (): void => {
    const result: HabitResult = setDoneOn(
      [habit([])],
      "Leer",
      "16-10-2026",
      today,
      false,
    );
    expect(result).toEqual({ ok: true, changed: false, habits: [habit([])] });
  });

  test("permite la fecha de creación", (): void => {
    const result: HabitResult = setDoneOn(
      [habit([])],
      "Leer",
      "10-10-2026",
      today,
      true,
    );
    expect(result).toEqual({
      ok: true,
      changed: true,
      habits: [habit(["10-10-2026"])],
    });
  });

  test("encuentra el hábito sin distinguir mayúsculas", (): void => {
    const result: HabitResult = setDoneOn(
      [habit([])],
      "lEeR",
      "16-10-2026",
      today,
      true,
    );
    expect(result.ok).toBe(true);
  });

  test("rechaza un hábito inexistente", (): void => {
    expect(setDoneOn([], "Leer", "16-10-2026", today, true)).toEqual({
      ok: false,
      error: "not-found",
    });
  });

  test("rechaza fechas con formato inválido", (): void => {
    expect(setDoneOn([habit([])], "Leer", "31-02-2026", today, true)).toEqual({
      ok: false,
      error: "invalid-date",
    });
    expect(setDoneOn([habit([])], "Leer", "2026-10-15", today, true)).toEqual({
      ok: false,
      error: "invalid-date",
    });
    expect(setDoneOn([habit([])], "Leer", "15/10/2026", today, true)).toEqual({
      ok: false,
      error: "invalid-date",
    });
  });

  test("rechaza la fecha de hoy", (): void => {
    expect(setDoneOn([habit([])], "Leer", today, today, true)).toEqual({
      ok: false,
      error: "today-not-allowed",
    });
  });

  test("rechaza fechas futuras", (): void => {
    expect(setDoneOn([habit([])], "Leer", "18-10-2026", today, true)).toEqual({
      ok: false,
      error: "future-date",
    });
  });

  test("rechaza fechas anteriores a la creación", (): void => {
    expect(setDoneOn([habit([])], "Leer", "09-10-2026", today, true)).toEqual({
      ok: false,
      error: "before-creation",
    });
  });

  test("no muta la lista original", (): void => {
    const original: Habit[] = [habit(["16-10-2026"])];
    setDoneOn(original, "Leer", "16-10-2026", today, false);
    expect(original).toEqual([habit(["16-10-2026"])]);
  });

  test("RF-4: marcar el hueco de ayer mantiene o aumenta la racha actual", (): void => {
    const before: Habit = habit([today]);
    const result: HabitResult = setDoneOn(
      [before],
      "Leer",
      "16-10-2026",
      today,
      true,
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const updated: Habit | undefined = result.habits[0];
    if (updated === undefined) return;
    expect(calculateMetrics(before, today).currentStreak).toBe(1);
    expect(calculateMetrics(updated, today).currentStreak).toBe(2);
  });

  test("RF-4: marcar un día que rellena un hueco recalcula la racha más larga", (): void => {
    const before: Habit = habit(["10-10-2026", "11-10-2026", "14-10-2026"]);
    expect(calculateMetrics(before, today).longestStreak).toBe(2);
    const result: HabitResult = setDoneOn(
      [before],
      "Leer",
      "12-10-2026",
      today,
      true,
    );
    if (!result.ok || result.habits[0] === undefined)
      throw new Error("esperado");
    expect(calculateMetrics(result.habits[0], today).longestStreak).toBe(3);
  });

  test("RF-4: desmarcar un día intermedio puede romper la racha actual", (): void => {
    const before: Habit = habit(["15-10-2026", "16-10-2026", today]);
    expect(calculateMetrics(before, today).currentStreak).toBe(3);
    const result: HabitResult = setDoneOn(
      [before],
      "Leer",
      "16-10-2026",
      today,
      false,
    );
    if (!result.ok || result.habits[0] === undefined)
      throw new Error("esperado");
    expect(calculateMetrics(result.habits[0], today).currentStreak).toBe(1);
  });

  test("RF-4: el denominador del porcentaje no cambia al marcar días pasados", (): void => {
    const before: Habit = habit([today]);
    const result: HabitResult = setDoneOn(
      [before],
      "Leer",
      "16-10-2026",
      today,
      true,
    );
    if (!result.ok || result.habits[0] === undefined)
      throw new Error("esperado");
    expect(calculateMetrics(before, today).completionPercent).toBe(13);
    expect(calculateMetrics(result.habits[0], today).completionPercent).toBe(
      25,
    );
  });
});

describe("renameHabit", (): void => {
  test("renombra conservando los registros", (): void => {
    const result: HabitResult = renameHabit(
      [habit([today])],
      "Leer",
      "Estudiar",
    );
    expect(result).toEqual({
      ok: true,
      changed: true,
      habits: [
        { name: "Estudiar", createdOn: "10-10-2026", completions: [today] },
      ],
    });
  });

  test("rechaza nombres vacíos y con saltos de línea", (): void => {
    expect(renameHabit([habit([])], "Leer", "  ")).toEqual({
      ok: false,
      error: "empty-name",
    });
    expect(renameHabit([habit([])], "Leer", "Nuevo\nnombre")).toEqual({
      ok: false,
      error: "invalid-name",
    });
  });

  test("rechaza el nombre de otro hábito", (): void => {
    const habits: Habit[] = [habit([]), { ...habit([]), name: "Meditar" }];
    expect(renameHabit(habits, "Leer", "meditar")).toEqual({
      ok: false,
      error: "duplicate",
    });
  });

  test("no cambia si el nombre es equivalente salvo mayúsculas", (): void => {
    const result: HabitResult = renameHabit([habit([])], "Leer", "LEER");
    expect(result).toEqual({ ok: true, changed: false, habits: [habit([])] });
  });

  test("informa un hábito inexistente", (): void => {
    expect(renameHabit([], "Leer", "Estudiar")).toEqual({
      ok: false,
      error: "not-found",
    });
  });

  test("no muta la lista original", (): void => {
    const original: Habit[] = [habit([today])];
    renameHabit(original, "Leer", "Estudiar");
    expect(original).toEqual([habit([today])]);
  });
});

describe("deleteHabit", (): void => {
  test("elimina solo el hábito buscado con sus registros", (): void => {
    const habits: Habit[] = [habit([today]), { ...habit([]), name: "Meditar" }];
    const result: HabitResult = deleteHabit(habits, "leer");
    expect(result).toEqual({
      ok: true,
      changed: true,
      habits: [{ ...habit([]), name: "Meditar" }],
    });
  });

  test("informa un hábito inexistente", (): void => {
    expect(deleteHabit([habit([])], "Inexistente")).toEqual({
      ok: false,
      error: "not-found",
    });
  });

  test("no muta la lista original", (): void => {
    const original: Habit[] = [habit([today])];
    deleteHabit(original, "Leer");
    expect(original).toEqual([habit([today])]);
  });
});
