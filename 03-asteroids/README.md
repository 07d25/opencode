# Asteroids

Clon del clásico arcade **Asteroids** implementado en canvas HTML5 puro, sin dependencias ni bundler.

## Descripción

Nave espacial en un campo de asteroides con envolvimiento de bordes (el espacio es toroidal). Destruye asteroides para sumar puntos: los grandes se parten en medianos, los medianos en pequeños. Incluye power-ups especiales y tipos de asteroides únicos como la estrella fugaz.

## Tecnologías

- **HTML5 Canvas** — renderizado 2D
- **JavaScript (ES6+)** — lógica del juego en un solo archivo `game.js`
- Sin frameworks, sin bundler, sin dependencias

## Cómo correr

Abre `index.html` directamente en el navegador (doble clic), o usa un servidor local:

```bash
npx serve .
```

Luego visita `http://localhost:3000`.

## Controles

| Tecla     | Acción     |
| --------- | ---------- |
| `←` `→`   | Rotar nave |
| `↑`       | Propulsar  |
| `Espacio` | Disparar   |
| `C`       | Cambiar skin |

## Puntuación

| Asteroide | Puntos |
| --------- | ------ |
| Grande    | 20     |
| Mediano   | 50     |
| Pequeño   | 100    |

## Asteroides especiales

- **Estrella fugaz** — asteroide raro (aparece como máximo uno por nivel) que se mueve mucho más rápido que el resto y deja una estela amarilla. Se apaga solo tras unos 6 segundos y, si lo destruyes, otorga 200 puntos. No se fragmenta al ser destruido.

## Power-ups

- **Velocidad** — al destruir asteroides puede soltarse un rayo cian; recógelo con la nave para moverte al doble de rápido durante 5 segundos. El HUD muestra el tiempo restante.
- **Triple Shot** — al destruir asteroides puede soltarse un icono naranja de tres trazos; recógelo con la nave para disparar una ráfaga de 3 balas en abanico durante 5 segundos.
- **Escudo** — al destruir asteroides puede soltarse un blasón verde; recógelo con la nave para envolverte en un anillo protector. El escudo absorbe **un** impacto de asteroide y desaparece, otorgando unos instantes de invencibilidad.

## Skins

Sistema de skins de la nave. Pulsa `C` para ciclar entre las siluetas disponibles (CLÁSICA, CAZA, INTERCEPTOR, FANTASMA); la elección se guarda en `localStorage` y se conserva entre sesiones. La skin activa también se aplica a los iconos de vidas del HUD.

## Características

- 3 vidas con invencibilidad temporal al reaparecer (parpadeo)
- Asteroides se parten en fragmentos más pequeños al ser destruidos
- Partículas de explosión al destruir asteroides
- Power-ups: Velocidad, Triple Shot y Escudo
- Estrella fugaz como asteroide especial
- Skins de la nave seleccionables con `C`
