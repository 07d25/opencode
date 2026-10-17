import { describe, expect, test } from "bun:test";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { Habit } from "../src/core";
import { fromOrdinal, toOrdinal } from "../src/core";
import { todayLocal } from "../src/cli";

const cliPath: string = join(import.meta.dir, "..", "src", "cli.ts");

function shiftDays(date: string, days: number): string {
  return fromOrdinal(toOrdinal(date) + days);
}

async function writeHabits(filePath: string, habits: Habit[]): Promise<void> {
  await writeFile(filePath, JSON.stringify(habits), "utf8");
}

async function temporaryFile(): Promise<string> {
  const directory: string = await mkdtemp(join("/tmp/opencode", "habits-cli-"));
  return join(directory, "habits.json");
}

interface CliResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

async function runCli(
  filePath: string,
  args: string[],
  input?: string,
): Promise<CliResult> {
  const process_ = Bun.spawn({
    cmd: ["bun", cliPath, ...args],
    env: { ...process.env, HABITS_FILE: filePath },
    stdin: "pipe",
    stdout: "pipe",
    stderr: "pipe",
  });
  if (input !== undefined) process_.stdin.write(input);
  process_.stdin.end();
  const stdout: string = await Bun.readableStreamToText(process_.stdout);
  const stderr: string = await Bun.readableStreamToText(process_.stderr);
  const exitCode: number = await process_.exited;
  return { stdout, stderr, exitCode };
}

async function readHabits(filePath: string): Promise<Habit[]> {
  const parsed: unknown = JSON.parse(await readFile(filePath, "utf8"));
  return parsed as Habit[];
}

describe("T-09 uso y argumentos", (): void => {
  test("un comando desconocido muestra el uso y sale con código 1", async (): Promise<void> => {
    const result: CliResult = await runCli(await temporaryFile(), ["bailar"]);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("Uso: habits-cli");
  });

  test("argumentos sobrantes muestran el uso y salen con código 1", async (): Promise<void> => {
    const result: CliResult = await runCli(await temporaryFile(), [
      "crear",
      "Leer",
      "extra",
    ]);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("Uso: habits-cli");
  });

  test("listar con argumentos muestra el uso y sale con código 1", async (): Promise<void> => {
    const result: CliResult = await runCli(await temporaryFile(), [
      "listar",
      "x",
    ]);
    expect(result.exitCode).toBe(1);
  });
});

describe("T-10 comandos de escritura", (): void => {
  test("crear guarda el hábito con la fecha de hoy en dd-mm-aaaa", async (): Promise<void> => {
    const filePath: string = await temporaryFile();
    const result: CliResult = await runCli(filePath, ["crear", "Leer"]);
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('Hábito "Leer" creado.');
    expect(await readHabits(filePath)).toEqual([
      { name: "Leer", createdOn: todayLocal(), completions: [] },
    ]);
  });

  test("hecho marca hoy y desmarcar lo quita", async (): Promise<void> => {
    const filePath: string = await temporaryFile();
    await runCli(filePath, ["crear", "Leer"]);
    const marked: CliResult = await runCli(filePath, ["hecho", "Leer"]);
    expect(marked.exitCode).toBe(0);
    expect(marked.stdout).toContain('Hábito "Leer" marcado como hecho hoy.');
    expect((await readHabits(filePath))[0]?.completions).toEqual([
      todayLocal(),
    ]);
    const unmarked: CliResult = await runCli(filePath, ["desmarcar", "Leer"]);
    expect(unmarked.exitCode).toBe(0);
    expect((await readHabits(filePath))[0]?.completions).toEqual([]);
  });

  test("renombrar cambia el nombre y conserva los registros", async (): Promise<void> => {
    const filePath: string = await temporaryFile();
    await runCli(filePath, ["crear", "Leer"]);
    await runCli(filePath, ["hecho", "Leer"]);
    const result: CliResult = await runCli(filePath, [
      "renombrar",
      "Leer",
      "Estudiar",
    ]);
    expect(result.exitCode).toBe(0);
    expect((await readHabits(filePath))[0]).toEqual({
      name: "Estudiar",
      createdOn: todayLocal(),
      completions: [todayLocal()],
    });
  });

  test("un error del core informa y sale con código 1 sin escribir", async (): Promise<void> => {
    const filePath: string = await temporaryFile();
    const result: CliResult = await runCli(filePath, ["hecho", "Fantasma"]);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain('no existe un hábito llamado "Fantasma"');
  });
});

describe("T-11 listar", (): void => {
  test("sin hábitos muestra un mensaje informativo", async (): Promise<void> => {
    const result: CliResult = await runCli(await temporaryFile(), ["listar"]);
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("No hay hábitos registrados.");
  });

  test("muestra la tabla sin códigos ANSI fuera de una terminal", async (): Promise<void> => {
    const filePath: string = await temporaryFile();
    await runCli(filePath, ["crear", "Leer"]);
    const result: CliResult = await runCli(filePath, ["listar"]);
    expect(result.stdout).toContain("Hábito");
    expect(result.stdout).toContain("Racha");
    expect(result.stdout).not.toContain("\u001b");
  });
});

describe("T-12 eliminar con confirmación", (): void => {
  test("confirmar con 's' borra el hábito", async (): Promise<void> => {
    const filePath: string = await temporaryFile();
    await runCli(filePath, ["crear", "Leer"]);
    const result: CliResult = await runCli(
      filePath,
      ["eliminar", "Leer"],
      "s\n",
    );
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('Hábito "Leer" eliminado.');
    expect(await readHabits(filePath)).toEqual([]);
  });

  test("responder 'n' cancela y conserva los datos", async (): Promise<void> => {
    const filePath: string = await temporaryFile();
    await runCli(filePath, ["crear", "Leer"]);
    const result: CliResult = await runCli(
      filePath,
      ["eliminar", "Leer"],
      "n\n",
    );
    expect(result.stdout).toContain("Eliminación cancelada.");
    expect((await readHabits(filePath)).length).toBe(1);
  });

  test("stdin cerrado cancela la eliminación", async (): Promise<void> => {
    const filePath: string = await temporaryFile();
    await runCli(filePath, ["crear", "Leer"]);
    const result: CliResult = await runCli(filePath, ["eliminar", "Leer"]);
    expect(result.stdout).toContain("Eliminación cancelada.");
    expect((await readHabits(filePath)).length).toBe(1);
  });

  test("un hábito inexistente devuelve código 1", async (): Promise<void> => {
    const result: CliResult = await runCli(
      await temporaryFile(),
      ["eliminar", "Fantasma"],
      "s\n",
    );
    expect(result.exitCode).toBe(1);
  });
});

describe("spec 002 --fecha", (): void => {
  const today: string = todayLocal();
  const created: string = shiftDays(today, -5);
  const yesterday: string = shiftDays(today, -1);
  const tomorrow: string = shiftDays(today, 1);
  const beforeCreation: string = shiftDays(today, -6);

  test("hecho con --fecha marca un día pasado y lo persiste", async (): Promise<void> => {
    const filePath: string = await temporaryFile();
    await writeHabits(filePath, [
      { name: "Leer", createdOn: created, completions: [] },
    ]);
    const result: CliResult = await runCli(filePath, [
      "hecho",
      "Leer",
      "--fecha",
      yesterday,
    ]);
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain(
      `Hábito "Leer" marcado como hecho en ${yesterday}.`,
    );
    expect((await readHabits(filePath))[0]?.completions).toEqual([yesterday]);
  });

  test("repetir el marcado del mismo día es idempotente con código 0", async (): Promise<void> => {
    const filePath: string = await temporaryFile();
    await writeHabits(filePath, [
      { name: "Leer", createdOn: created, completions: [yesterday] },
    ]);
    const result: CliResult = await runCli(filePath, [
      "hecho",
      "Leer",
      "--fecha",
      yesterday,
    ]);
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("ya estaba marcado ese día");
    expect((await readHabits(filePath))[0]?.completions).toEqual([yesterday]);
  });

  test("desmarcar con --fecha quita el registro y repetir es idempotente", async (): Promise<void> => {
    const filePath: string = await temporaryFile();
    await writeHabits(filePath, [
      { name: "Leer", createdOn: created, completions: [yesterday] },
    ]);
    const removed: CliResult = await runCli(filePath, [
      "desmarcar",
      "Leer",
      "--fecha",
      yesterday,
    ]);
    expect(removed.exitCode).toBe(0);
    expect(removed.stdout).toContain(`desmarcado para ${yesterday}`);
    expect((await readHabits(filePath))[0]?.completions).toEqual([]);
    const again: CliResult = await runCli(filePath, [
      "desmarcar",
      "Leer",
      "--fecha",
      yesterday,
    ]);
    expect(again.exitCode).toBe(0);
    expect(again.stdout).toContain("no estaba marcado ese día");
  });

  test("acepta la forma --fecha=<valor>", async (): Promise<void> => {
    const filePath: string = await temporaryFile();
    await writeHabits(filePath, [
      { name: "Leer", createdOn: created, completions: [] },
    ]);
    const result: CliResult = await runCli(filePath, [
      "hecho",
      "Leer",
      `--fecha=${yesterday}`,
    ]);
    expect(result.exitCode).toBe(0);
    expect((await readHabits(filePath))[0]?.completions).toEqual([yesterday]);
  });

  test("funciona con un nombre que contiene espacios", async (): Promise<void> => {
    const filePath: string = await temporaryFile();
    await writeHabits(filePath, [
      { name: "Leer libro", createdOn: created, completions: [] },
    ]);
    const result: CliResult = await runCli(filePath, [
      "hecho",
      "Leer libro",
      "--fecha",
      yesterday,
    ]);
    expect(result.exitCode).toBe(0);
    expect((await readHabits(filePath))[0]?.completions).toEqual([yesterday]);
  });

  test("la fecha de hoy con --fecha informa un error", async (): Promise<void> => {
    const filePath: string = await temporaryFile();
    await writeHabits(filePath, [
      { name: "Leer", createdOn: created, completions: [] },
    ]);
    const result: CliResult = await runCli(filePath, [
      "hecho",
      "Leer",
      "--fecha",
      today,
    ]);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("sin --fecha");
  });

  test("una fecha futura informa un error sin escribir", async (): Promise<void> => {
    const filePath: string = await temporaryFile();
    await writeHabits(filePath, [
      { name: "Leer", createdOn: created, completions: [] },
    ]);
    const result: CliResult = await runCli(filePath, [
      "hecho",
      "Leer",
      "--fecha",
      tomorrow,
    ]);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("fecha futura");
    expect((await readHabits(filePath))[0]?.completions).toEqual([]);
  });

  test("una fecha anterior a la creación informa un error", async (): Promise<void> => {
    const filePath: string = await temporaryFile();
    await writeHabits(filePath, [
      { name: "Leer", createdOn: created, completions: [] },
    ]);
    const result: CliResult = await runCli(filePath, [
      "hecho",
      "Leer",
      "--fecha",
      beforeCreation,
    ]);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("anterior a la creación");
  });

  test("un formato de fecha inválido informa un error", async (): Promise<void> => {
    const filePath: string = await temporaryFile();
    await writeHabits(filePath, [
      { name: "Leer", createdOn: created, completions: [] },
    ]);
    const result: CliResult = await runCli(filePath, [
      "hecho",
      "Leer",
      "--fecha",
      "31-02-2026",
    ]);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("no es válida");
  });

  test("--fecha sin valor muestra el uso y sale con código 1", async (): Promise<void> => {
    const result: CliResult = await runCli(await temporaryFile(), [
      "hecho",
      "Leer",
      "--fecha",
    ]);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("Uso: habits-cli");
  });

  test("listar refleja la racha recalculada tras marcar un día pasado", async (): Promise<void> => {
    const filePath: string = await temporaryFile();
    await writeHabits(filePath, [
      { name: "Leer", createdOn: shiftDays(today, -2), completions: [today] },
    ]);
    await runCli(filePath, ["hecho", "Leer", "--fecha", yesterday]);
    const result: CliResult = await runCli(filePath, ["listar"]);
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toMatch(/Leer\s+2\b/);
  });
});

describe("datos inválidos", (): void => {
  test("un archivo corrupto informa un error y sale con código 1", async (): Promise<void> => {
    const filePath: string = await temporaryFile();
    await writeFile(filePath, "{ roto", "utf8");
    const result: CliResult = await runCli(filePath, ["listar"]);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("formato inválido");
    await rm(filePath, { force: true });
  });
});
