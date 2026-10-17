import { createInterface } from "node:readline/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import {
  calculateMetrics,
  createHabit,
  deleteHabit,
  renameHabit,
  setDoneOn,
  setDoneToday,
  type Habit,
  type HabitError,
  type HabitMetrics,
  type HabitResult,
} from "./core";
import { loadHabits, saveHabits } from "./storage";

const USAGE: string =
  "Uso: habits-cli <crear|hecho|desmarcar|listar|renombrar|eliminar> ...";

const ERROR_MESSAGES: Record<HabitError, (value: string) => string> = {
  "empty-name": (): string =>
    "Error: el nombre del hábito no puede estar vacío.",
  "invalid-name": (): string =>
    "Error: el nombre del hábito no puede contener saltos de línea.",
  duplicate: (value: string): string =>
    `Error: ya existe un hábito llamado "${value.trim()}".`,
  "not-found": (value: string): string =>
    `Error: no existe un hábito llamado "${value.trim()}".`,
  "invalid-date": (value: string): string =>
    `Error: la fecha "${value}" no es válida. Usa el formato DD-MM-AAAA.`,
  "future-date": (): string => "Error: no se puede registrar una fecha futura.",
  "today-not-allowed": (): string =>
    "Error: la fecha de hoy se registra con el comando sin --fecha.",
  "before-creation": (): string =>
    "Error: la fecha es anterior a la creación del hábito.",
};

const DATE_ERRORS: readonly HabitError[] = [
  "invalid-date",
  "future-date",
  "today-not-allowed",
  "before-creation",
];

function isDateError(error: HabitError): boolean {
  return DATE_ERRORS.includes(error);
}

interface DatedArgs {
  name: string;
  date: string | null;
}

function parseDatedArgs(args: string[]): DatedArgs | null {
  const rest: string[] = [];
  let date: string | null = null;
  for (let index = 0; index < args.length; index += 1) {
    const arg: string = args[index] ?? "";
    if (arg === "--fecha") {
      const value: string | undefined = args[index + 1];
      if (value === undefined || date !== null || value === "") return null;
      date = value;
      index += 1;
    } else if (arg.startsWith("--fecha=")) {
      const value: string = arg.slice("--fecha=".length);
      if (date !== null || value === "") return null;
      date = value;
    } else {
      rest.push(arg);
    }
  }
  if (rest.length !== 1) return null;
  return { name: rest[0] ?? "", date };
}

export function todayLocal(): string {
  const now: Date = new Date();
  const day: string = String(now.getDate()).padStart(2, "0");
  const month: string = String(now.getMonth() + 1).padStart(2, "0");
  const year: string = String(now.getFullYear());
  return `${day}-${month}-${year}`;
}

function color(text: string, code: number, enabled: boolean): string {
  return enabled ? `\u001b[${code}m${text}\u001b[0m` : text;
}

export function formatHabitTable(
  habits: Habit[],
  today: string,
  useColor: boolean,
): string {
  if (habits.length === 0) return "No hay hábitos registrados.";
  const rows: string[][] = habits.map((habit: Habit): string[] => {
    const metrics: HabitMetrics = calculateMetrics(habit, today);
    const filled: number = Math.round(metrics.completionPercent / 10);
    const bar: string = `${"█".repeat(filled)}${"░".repeat(10 - filled)}`;
    return [
      habit.name,
      String(metrics.currentStreak),
      metrics.doneToday ? "sí" : "no",
      String(metrics.totalDays),
      String(metrics.longestStreak),
      `${metrics.completionPercent}% ${bar}`,
    ];
  });
  const headers: string[] = ["Hábito", "Racha", "Hoy", "Días", "Máx", "%"];
  const widths: number[] = headers.map(
    (header: string, index: number): number =>
      Math.max(
        header.length,
        ...rows.map((row: string[]): number => (row[index] ?? "").length),
      ),
  );
  const formatRow = (
    row: string[],
    codes: Array<number | undefined> = [],
  ): string =>
    row
      .map((cell: string, index: number): string => {
        const padded: string = cell.padEnd(widths[index] ?? 0);
        const code: number | undefined = codes[index];
        return code === undefined ? padded : color(padded, code, useColor);
      })
      .join("  ");
  const separator: string = formatRow(
    headers.map((_header: string, index: number): string =>
      "-".repeat(widths[index] ?? 0),
    ),
  );
  const body: string[] = rows.map((row: string[]): string =>
    formatRow(row, [
      undefined,
      36,
      row[2] === "sí" ? 32 : 33,
      undefined,
      undefined,
      35,
    ]),
  );
  return [formatRow(headers), separator, ...body].join("\n");
}

async function confirmDeletion(name: string): Promise<boolean> {
  if (process.stdin.readableEnded) return false;
  const reader = createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const closed: Promise<string> = new Promise<string>((resolve) => {
    process.stdin.once("end", () => resolve(""));
    process.stdin.once("close", () => resolve(""));
  });
  try {
    const answer: string = await Promise.race([
      reader.question(
        `¿Eliminar el hábito "${name}" y todo su historial? (s/N): `,
      ),
      closed,
    ]);
    const normalized: string = answer.trim().toLocaleLowerCase("es-ES");
    return normalized === "s" || normalized === "sí";
  } catch {
    return false;
  } finally {
    reader.close();
  }
}

export interface CliIO {
  stdout: (text: string) => void;
  stderr: (text: string) => void;
  isTTY: boolean;
  confirm: (name: string) => Promise<boolean>;
}

async function applyResult(
  result: HabitResult,
  name: string,
  success: string,
  filePath: string,
  io: CliIO,
): Promise<number> {
  if (!result.ok) {
    io.stderr(ERROR_MESSAGES[result.error](name));
    return 1;
  }
  if (result.changed) await saveHabits(filePath, result.habits);
  io.stdout(success);
  return 0;
}

export async function run(argv: string[], io: CliIO): Promise<number> {
  const [command, ...args] = argv;
  const today: string = todayLocal();
  const filePath: string =
    process.env.HABITS_FILE ?? join(homedir(), ".habits-cli.json");

  if (command === "listar") {
    if (args.length !== 0) {
      io.stderr(USAGE);
      return 1;
    }
    const habits: Habit[] = await loadHabits(filePath, today);
    io.stdout(formatHabitTable(habits, today, io.isTTY));
    return 0;
  }

  if (command === "crear") {
    if (args.length !== 1) {
      io.stderr(USAGE);
      return 1;
    }
    const name: string = args[0] ?? "";
    const habits: Habit[] = await loadHabits(filePath, today);
    return applyResult(
      createHabit(habits, name, today),
      name,
      `Hábito "${name.trim()}" creado.`,
      filePath,
      io,
    );
  }

  if (command === "hecho" || command === "desmarcar") {
    const parsed: DatedArgs | null = parseDatedArgs(args);
    if (parsed === null) {
      io.stderr(USAGE);
      return 1;
    }
    const name: string = parsed.name;
    const habits: Habit[] = await loadHabits(filePath, today);
    const done: boolean = command === "hecho";
    if (parsed.date === null) {
      return applyResult(
        setDoneToday(habits, name, today, done),
        name,
        done
          ? `Hábito "${name.trim()}" marcado como hecho hoy.`
          : `Hábito "${name.trim()}" desmarcado para hoy.`,
        filePath,
        io,
      );
    }
    const date: string = parsed.date;
    const result: HabitResult = setDoneOn(habits, name, date, today, done);
    if (!result.ok) {
      io.stderr(
        ERROR_MESSAGES[result.error](isDateError(result.error) ? date : name),
      );
      return 1;
    }
    if (result.changed) await saveHabits(filePath, result.habits);
    const trimmed: string = name.trim();
    if (result.changed) {
      io.stdout(
        done
          ? `Hábito "${trimmed}" marcado como hecho en ${date}.`
          : `Hábito "${trimmed}" desmarcado para ${date}.`,
      );
    } else {
      io.stdout(
        done
          ? `Hábito "${trimmed}" ya estaba marcado ese día.`
          : `Hábito "${trimmed}" no estaba marcado ese día.`,
      );
    }
    return 0;
  }

  if (command === "renombrar") {
    if (args.length !== 2) {
      io.stderr(USAGE);
      return 1;
    }
    const oldName: string = args[0] ?? "";
    const newName: string = args[1] ?? "";
    const habits: Habit[] = await loadHabits(filePath, today);
    return applyResult(
      renameHabit(habits, oldName, newName),
      newName,
      `Hábito "${oldName.trim()}" renombrado a "${newName.trim()}".`,
      filePath,
      io,
    );
  }

  if (command === "eliminar") {
    if (args.length !== 1) {
      io.stderr(USAGE);
      return 1;
    }
    const name: string = args[0] ?? "";
    const habits: Habit[] = await loadHabits(filePath, today);
    const result: HabitResult = deleteHabit(habits, name);
    if (!result.ok) {
      io.stderr(ERROR_MESSAGES[result.error](name));
      return 1;
    }
    const confirmed: boolean = await io.confirm(name.trim());
    if (!confirmed) {
      io.stdout("Eliminación cancelada.");
      return 0;
    }
    await saveHabits(filePath, result.habits);
    io.stdout(`Hábito "${name.trim()}" eliminado.`);
    return 0;
  }

  io.stderr(USAGE);
  return 1;
}

if (import.meta.main) {
  const io: CliIO = {
    stdout: (text: string): void => {
      process.stdout.write(`${text}\n`);
    },
    stderr: (text: string): void => {
      process.stderr.write(`${text}\n`);
    },
    isTTY: Boolean(process.stdout.isTTY),
    confirm: confirmDeletion,
  };
  run(Bun.argv.slice(2), io)
    .then((code: number): void => {
      process.exitCode = code;
    })
    .catch((error: unknown): void => {
      const message: string =
        error instanceof Error ? error.message : "Error inesperado.";
      process.stderr.write(`Error: ${message}\n`);
      process.exitCode = 1;
    });
}
