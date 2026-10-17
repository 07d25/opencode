import { describe, expect, test } from "bun:test";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { loadHabits, saveHabits } from "../src/storage";
import type { Habit } from "../src/core";

const today: string = "17-10-2026";

async function temporaryFile(): Promise<string> {
  const directory: string = await mkdtemp(join("/tmp/opencode", "habits-"));
  return join(directory, "habits.json");
}

function validHabit(): Habit {
  return {
    name: "Leer",
    createdOn: "10-10-2026",
    completions: ["14-10-2026", "15-10-2026"],
  };
}

describe("loadHabits", (): void => {
  test("un archivo inexistente devuelve una lista vacía", async (): Promise<void> => {
    const path: string = await temporaryFile();
    expect(await loadHabits(path, today)).toEqual([]);
  });

  test("carga un archivo válido", async (): Promise<void> => {
    const path: string = await temporaryFile();
    await writeFile(path, JSON.stringify([validHabit()]), "utf8");
    expect(await loadHabits(path, today)).toEqual([validHabit()]);
  });

  test("un JSON inválido lanza y conserva el archivo intacto", async (): Promise<void> => {
    const path: string = await temporaryFile();
    const content: string = "{ no es JSON";
    await writeFile(path, content, "utf8");
    await expect(loadHabits(path, today)).rejects.toThrow();
    expect(await readFile(path, "utf8")).toBe(content);
  });

  test("rechaza un contenido que no es una lista de hábitos", async (): Promise<void> => {
    const path: string = await temporaryFile();
    await writeFile(path, JSON.stringify({ name: "Leer" }), "utf8");
    await expect(loadHabits(path, today)).rejects.toThrow("formato inválido");
  });

  test("rechaza nombres vacíos, con salto de línea o duplicados", async (): Promise<void> => {
    const path: string = await temporaryFile();
    await writeFile(
      path,
      JSON.stringify([{ ...validHabit(), name: "  " }]),
      "utf8",
    );
    await expect(loadHabits(path, today)).rejects.toThrow("formato inválido");
    await writeFile(
      path,
      JSON.stringify([{ ...validHabit(), name: "Leer\nlibro" }]),
      "utf8",
    );
    await expect(loadHabits(path, today)).rejects.toThrow("formato inválido");
    await writeFile(
      path,
      JSON.stringify([validHabit(), { ...validHabit(), name: "leer" }]),
      "utf8",
    );
    await expect(loadHabits(path, today)).rejects.toThrow("formato inválido");
  });

  test("rechaza createdOn inválido o futuro", async (): Promise<void> => {
    const path: string = await temporaryFile();
    await writeFile(
      path,
      JSON.stringify([{ ...validHabit(), createdOn: "31-02-2026" }]),
      "utf8",
    );
    await expect(loadHabits(path, today)).rejects.toThrow("formato inválido");
    await writeFile(
      path,
      JSON.stringify([{ ...validHabit(), createdOn: "18-10-2026" }]),
      "utf8",
    );
    await expect(loadHabits(path, today)).rejects.toThrow("formato inválido");
  });

  test("rechaza registros fuera de rango o duplicados", async (): Promise<void> => {
    const path: string = await temporaryFile();
    await writeFile(
      path,
      JSON.stringify([{ ...validHabit(), completions: ["09-10-2026"] }]),
      "utf8",
    );
    await expect(loadHabits(path, today)).rejects.toThrow("formato inválido");
    await writeFile(
      path,
      JSON.stringify([{ ...validHabit(), completions: ["18-10-2026"] }]),
      "utf8",
    );
    await expect(loadHabits(path, today)).rejects.toThrow("formato inválido");
    await writeFile(
      path,
      JSON.stringify([
        { ...validHabit(), completions: ["14-10-2026", "14-10-2026"] },
      ]),
      "utf8",
    );
    await expect(loadHabits(path, today)).rejects.toThrow("formato inválido");
  });
});

describe("saveHabits", (): void => {
  test("guarda JSON legible que se puede volver a cargar", async (): Promise<void> => {
    const path: string = await temporaryFile();
    const habits: Habit[] = [validHabit()];
    await saveHabits(path, habits);
    expect(await loadHabits(path, today)).toEqual(habits);
    const raw: string = await readFile(path, "utf8");
    expect(JSON.parse(raw)).toEqual(habits);
    expect(raw).toContain("\n");
    await rm(path, { force: true });
  });
});
