// Tests de la capa de geocoding: parseo defensivo de la respuesta del servicio.
import { expect, test } from "bun:test";
import { parseGeocodingResponse } from "../../src/api/geocoding.ts";

test("convierte los resultados en ciudades", () => {
  const cities = parseGeocodingResponse({
    results: [{ name: "Ottawa", country: "Canadá", latitude: 45.41117, longitude: -75.69812 }],
  });
  expect(cities).toEqual([{ name: "Ottawa", country: "Canadá", latitude: 45.41117, longitude: -75.69812 }]);
});

test("devuelve lista vacía cuando no hay resultados", () => {
  // OpenMeteo omite "results" por completo cuando no hay coincidencias.
  expect(parseGeocodingResponse({})).toEqual([]);
  expect(parseGeocodingResponse({ results: [] })).toEqual([]);
});

test("ignora entradas malformadas y completa el país vacío", () => {
  const cities = parseGeocodingResponse({
    results: [{ name: "Ottawa", latitude: 1, longitude: 2 }, { name: 42 }, null, "junk"],
  });
  expect(cities).toEqual([{ name: "Ottawa", country: "", latitude: 1, longitude: 2 }]);
});

test("devuelve lista vacía si la respuesta no es un objeto", () => {
  expect(parseGeocodingResponse(null)).toEqual([]);
  expect(parseGeocodingResponse("hola")).toEqual([]);
});
