---
name: pokemon
description: Obtiene información de Pokémon desde la PokeAPI (https://pokeapi.co) cuando el usuario menciona un Pokémon por nombre o ID.
---

# Skill: Pokémon

Esta skill permite consultar información de cualquier Pokémon usando la PokeAPI pública (https://pokeapi.co/api/v2).

## Cuándo usar esta skill

Activa esta habilidad automáticamente cuando el usuario mencione:

- La palabra "pokemon" seguida de un nombre o ID (ej. "pokemon ditto", "pokemon 1", "pokemon #25")
- El nombre de un Pokémon conocido suelto (ej. "ditto", "pikachu", "charizard", "bulbasaur")
- Preguntas sobre estadísticas, tipos, habilidades, peso o altura de un Pokémon

## Cómo obtener la información

Cuando se active la skill, consulta la API de PokeAPI usando la herramienta `webfetch`:

- Por nombre: `https://pokeapi.co/api/v2/pokemon/{nombre}` (ej. `https://pokeapi.co/api/v2/pokemon/ditto`)
- Por ID numérico: `https://pokeapi.co/api/v2/pokemon/{id}` (ej. `https://pokeapi.co/api/v2/pokemon/1`)

El parámetro `{nombre-or-id}` puede ser el nombre del Pokémon en minúsculas o su número de Pokédex.

## Qué información presentar

Extrae y presenta en español los siguientes datos de la respuesta JSON:

- **Nombre**: campo `name` (con la primera letra en mayúscula)
- **Tipo(s)**: lista de `types[].type.name`
- **Habilidad(es)**: lista de `abilities[].ability.name`
- **Estadísticas base**: `stats[]` con `stat.name` y `base_stat` (HP, Ataque, Defensa, Ataque Especial, Defensa Especial, Velocidad)
- **Peso**: campo `weight` (hectogramas)
- **Altura**: campo `height` (decímetros)
- **Imagen**: `sprites.other["official-artwork"].front_default` o `sprites.front_default`

## Manejo de errores

- Si la API devuelve 404, informa al usuario que no se encontró ese Pokémon y sugiere verificar el nombre o ID.
- Si hay un error de red o la API no responde, informa que no se pudo obtener la información en ese momento.

## Ejemplos de interacción

- Usuario: "dime sobre ditto" → consultar `https://pokeapi.co/api/v2/pokemon/ditto`
- Usuario: "pokemon 1" → consultar `https://pokeapi.co/api/v2/pokemon/1`
- Usuario: "estadísticas de pikachu" → consultar `https://pokeapi.co/api/v2/pokemon/pikachu`
- Usuario: "tipo de charizard" → consultar `https://pokeapi.co/api/v2/pokemon/charizard`

## Notas

- Todas las respuestas deben estar en español.
- Esta skill es de nivel proyecto (`.opencode/skills/pokemon/skill.md`), no global.
