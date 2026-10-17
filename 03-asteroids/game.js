'use strict';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const W = 800;
const H = 600;

// ── Input ─────────────────────────────────────────────────────────────────────
const keys = {};
const justPressed = {};

window.addEventListener('keydown', e => {
  justPressed[e.code] = !keys[e.code];
  keys[e.code] = true;
  if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code))
    e.preventDefault();
});
window.addEventListener('keyup', e => { keys[e.code] = false; });

function pressed(code) {
  const val = justPressed[code];
  justPressed[code] = false;
  return val;
}

// ── Utils ─────────────────────────────────────────────────────────────────────
const wrap  = (v, max) => ((v % max) + max) % max;
const dist  = (a, b)   => Math.hypot(a.x - b.x, a.y - b.y);
const rand  = (min, max) => min + Math.random() * (max - min);
const randInt = (min, max) => Math.floor(rand(min, max + 1));

// ── Bullet ────────────────────────────────────────────────────────────────────
class Bullet {
  constructor(x, y, angle) {
    this.x = x;
    this.y = y;
    const SPEED = 520;
    this.vx = Math.cos(angle) * SPEED;
    this.vy = Math.sin(angle) * SPEED;
    this.ttl  = 1.1;
    this.radius = 2;
    this.dead = false;
  }

  update(dt) {
    this.x = wrap(this.x + this.vx * dt, W);
    this.y = wrap(this.y + this.vy * dt, H);
    this.ttl -= dt;
    if (this.ttl <= 0) this.dead = true;
  }

  draw() {
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ── Asteroid ──────────────────────────────────────────────────────────────────
const RADII  = [0, 16, 30, 50];   // por tamaño 1, 2, 3
const SPEEDS = [0, 85, 55, 32];   // velocidad base por tamaño
const POINTS = [0, 100, 50, 20];  // puntos por tamaño

// Estrella fugaz: asteroide especial, más rápido, temporal y sin fragmentación
const STAR_CHANCE     = 0.15; // probabilidad de que un asteroide del nivel sea estrella
const STAR_SPEED_MULT = 2.5;  // multiplicador de velocidad
const STAR_TTL        = 6;    // segundos de vida
const STAR_POINTS     = 200;  // bonus fijo al destruirla

class Asteroid {
  constructor(x, y, size = 3, star = false) {
    this.x    = x;
    this.y    = y;
    this.size = size;
    this.star = star;
    this.radius = RADII[size];
    this.dead = false;

    const angle = rand(0, Math.PI * 2);
    const base  = SPEEDS[size] + rand(-15, 15);
    const speed = star ? base * STAR_SPEED_MULT : base;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.rotSpeed = rand(-1.2, 1.2);
    this.rot = rand(0, Math.PI * 2);
    this.ttl   = star ? STAR_TTL : Infinity;  // la estrella fugaz se apaga con el tiempo
    this.trail = [];                          // rastro de la estrella

    // Polígono irregular
    const n = randInt(8, 13);
    this.verts = [];
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      const r = this.radius * rand(0.6, 1.0);
      this.verts.push([Math.cos(a) * r, Math.sin(a) * r]);
    }
  }

  update(dt) {
    this.x   = wrap(this.x + this.vx * dt, W);
    this.y   = wrap(this.y + this.vy * dt, H);
    this.rot += this.rotSpeed * dt;

    if (this.star) {
      // Rastro: guarda las últimas posiciones
      this.trail.unshift({ x: this.x, y: this.y });
      if (this.trail.length > 10) this.trail.pop();
      // La estrella fugaz desaparece al agotarse su tiempo
      this.ttl -= dt;
      if (this.ttl <= 0) this.dead = true;
    }
  }

  split() {
    if (this.star || this.size <= 1) return [];
    return [
      new Asteroid(this.x, this.y, this.size - 1),
      new Asteroid(this.x, this.y, this.size - 1),
    ];
  }

  draw() {
    if (this.star) {
      // Parpadea cuando está por apagarse
      if (this.ttl < 1.5 && Math.floor(this.ttl * 8) % 2 === 0) return;
      this.drawTrail();
    }

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rot);
    ctx.strokeStyle = this.star ? '#ffd34d' : '#fff';
    ctx.lineWidth   = 1.5;
    ctx.lineJoin    = 'round';
    ctx.beginPath();
    ctx.moveTo(this.verts[0][0], this.verts[0][1]);
    for (let i = 1; i < this.verts.length; i++)
      ctx.lineTo(this.verts[i][0], this.verts[i][1]);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }

  drawTrail() {
    ctx.save();
    ctx.lineWidth = 1.5;
    for (let i = 0; i < this.trail.length - 1; i++) {
      const alpha = 1 - i / this.trail.length;
      ctx.strokeStyle = `rgba(255, 211, 77, ${(alpha * 0.6).toFixed(2)})`;
      ctx.beginPath();
      ctx.moveTo(this.trail[i].x, this.trail[i].y);
      ctx.lineTo(this.trail[i + 1].x, this.trail[i + 1].y);
      ctx.stroke();
    }
    ctx.restore();
  }
}

// ── Skins de la nave ──────────────────────────────────────────────────────────
// Cada skin define su color, dónde arranca la llama (tail) y el trazado de la
// silueta en coordenadas locales (nariz hacia +x). Todas caben en el mismo
// tamaño para no alterar la jugabilidad.
const SKINS = [
  {
    nombre: 'CLÁSICA', color: '#fff', tail: -8,
    trazo(ctx) {
      ctx.moveTo( 20,  0);
      ctx.lineTo(-12, -9);
      ctx.lineTo( -7,  0);
      ctx.lineTo(-12,  9);
    },
  },
  {
    nombre: 'CAZA', color: '#5cf', tail: -10,
    trazo(ctx) {
      ctx.moveTo( 22,  0);
      ctx.lineTo(-10, -8);
      ctx.lineTo( -4, -3);
      ctx.lineTo(-14,  0);
      ctx.lineTo( -4,  3);
      ctx.lineTo(-10,  8);
    },
  },
  {
    nombre: 'INTERCEPTOR', color: '#f6a', tail: -9,
    trazo(ctx) {
      ctx.moveTo( 18,  0);
      ctx.lineTo(  0, -3);
      ctx.lineTo(  0, -11);
      ctx.lineTo(-16, -11);
      ctx.lineTo( -9,  0);
      ctx.lineTo(-16, 11);
      ctx.lineTo(  0, 11);
      ctx.lineTo(  0,  3);
    },
  },
  {
    nombre: 'FANTASMA', color: '#8f8', tail: -10,
    trazo(ctx) {
      ctx.moveTo( 20,  0);
      ctx.quadraticCurveTo(  2, -16, -12, -10);
      ctx.quadraticCurveTo( -4,  -5, -10,   0);
      ctx.quadraticCurveTo( -4,   5, -12,  10);
      ctx.quadraticCurveTo(  2,  16,  20,   0);
    },
  },
];

let currentSkin = 0;      // índice de la skin activa (sobrevive a reset y respawn)
let skinToast   = 0;      // temporizador del aviso "SKIN: ..." al cambiar

// Restaurar la skin guardada entre sesiones
try {
  const saved = parseInt(localStorage.getItem('asteroids.skin'), 10);
  if (Number.isInteger(saved) && saved >= 0 && saved < SKINS.length) currentSkin = saved;
} catch (e) { /* localStorage no disponible */ }

// ── Ship ──────────────────────────────────────────────────────────────────────
class Ship {
  constructor() { this.reset(); }

  reset() {
    this.x      = W / 2;
    this.y      = H / 2;
    this.angle  = -Math.PI / 2;
    this.vx     = 0;
    this.vy     = 0;
    this.radius = 12;
    this.thrusting     = false;
    this.invincible    = 3;
    this.shootCooldown = 0;
    this.speedBoost    = 0;
    this.tripleShot    = 0;
    this.shield        = false;
    this.dead          = false;
  }

  update(dt) {
    if (this.dead) return;
    if (this.invincible    > 0) this.invincible    -= dt;
    if (this.shootCooldown > 0) this.shootCooldown -= dt;
    if (this.speedBoost    > 0) this.speedBoost    -= dt;
    if (this.tripleShot    > 0) this.tripleShot    -= dt;

    const ROT    = 3.5;   // rad/s
    const THRUST = 260;   // px/s²
    const DRAG   = 0.987;
    const boost  = this.speedBoost > 0 ? 2 : 1;  // power-up "Velocidad"

    if (keys['ArrowLeft'])  this.angle -= ROT * dt;
    if (keys['ArrowRight']) this.angle += ROT * dt;

    this.thrusting = !!keys['ArrowUp'];
    if (this.thrusting) {
      this.vx += Math.cos(this.angle) * THRUST * boost * dt;
      this.vy += Math.sin(this.angle) * THRUST * boost * dt;
    }

    this.vx *= DRAG;
    this.vy *= DRAG;
    this.x = wrap(this.x + this.vx * dt, W);
    this.y = wrap(this.y + this.vy * dt, H);
  }

  tryShoot() {
    if (this.shootCooldown > 0 || this.dead) return [];
    this.shootCooldown = 0.2;
    const NOSE = 21;
    const ox = this.x + Math.cos(this.angle) * NOSE;
    const oy = this.y + Math.sin(this.angle) * NOSE;

    // Power-up "Triple shot": ráfaga de 3 balas en abanico
    if (this.tripleShot > 0) {
      const SPREAD = Math.PI / 15; // ±12°
      return [
        new Bullet(ox, oy, this.angle - SPREAD),
        new Bullet(ox, oy, this.angle),
        new Bullet(ox, oy, this.angle + SPREAD),
      ];
    }

    return [new Bullet(ox, oy, this.angle)];
  }

  draw() {
    if (this.dead) return;
    // Parpadeo durante invencibilidad de reaparición
    if (this.invincible > 0 && Math.floor(this.invincible * 8) % 2 === 0) return;

    const skin = SKINS[currentSkin];

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.strokeStyle = skin.color;
    ctx.lineWidth   = 1.5;
    ctx.lineJoin    = 'round';

    // Escudo: anillo pulsante que protege de un impacto
    if (this.shield) {
      const pulse = 0.55 + 0.45 * Math.sin(performance.now() / 150);
      ctx.strokeStyle = `rgba(102, 255, 102, ${pulse.toFixed(2)})`;
      ctx.lineWidth   = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 18, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = skin.color;
      ctx.lineWidth   = 1.5;
    }

    // Silueta de la skin activa
    ctx.beginPath();
    skin.trazo(ctx);
    ctx.closePath();
    ctx.stroke();

    // Llama del propulsor
    if (this.thrusting && Math.random() > 0.35) {
      const t = skin.tail;
      ctx.beginPath();
      ctx.moveTo(t, -4);
      ctx.lineTo(t - rand(6, 14), 0);
      ctx.lineTo(t,  4);
      ctx.strokeStyle = 'rgba(255, 130, 0, 0.85)';
      ctx.stroke();
    }

    ctx.restore();
  }
}

// ── Partículas (explosión) ────────────────────────────────────────────────────
class Particle {
  constructor(x, y) {
    this.x  = x;
    this.y  = y;
    const angle = rand(0, Math.PI * 2);
    const speed = rand(30, 130);
    this.vx   = Math.cos(angle) * speed;
    this.vy   = Math.sin(angle) * speed;
    this.life = rand(0.4, 1.1);
    this.ttl  = this.life;
    this.dead = false;
  }

  update(dt) {
    this.x  += this.vx * dt;
    this.y  += this.vy * dt;
    this.ttl -= dt;
    if (this.ttl <= 0) this.dead = true;
  }

  draw() {
    const alpha = this.ttl / this.life;
    ctx.strokeStyle = `rgba(255,255,255,${alpha.toFixed(2)})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x - this.vx * 0.05, this.y - this.vy * 0.05);
    ctx.stroke();
  }
}

// ── Power-up ──────────────────────────────────────────────────────────────────
const POWERUP_TTL    = 12;   // segundos que permanece en pantalla
const POWERUP_BOOST  = 5;    // duración del efecto "Velocidad" (s)
const POWERUP_TRIPLE = 5;    // duración del efecto "Triple shot" (s)
const POWERUP_DROP   = 0.18; // probabilidad de drop al destruir un asteroide
const POWERUP_MAX    = 2;    // máximo de power-ups simultáneos

// Tipos de power-up con sus probabilidades relativas al soltar uno
const POWERUP_TYPES = [
  { type: 'speed',  weight: 0.4 },
  { type: 'triple', weight: 0.3 },
  { type: 'shield', weight: 0.3 },
];

function randomPowerUpType() {
  let r = Math.random();
  for (const t of POWERUP_TYPES) if ((r -= t.weight) < 0) return t.type;
  return 'speed';
}

class PowerUp {
  constructor(x, y, type = 'speed') {
    this.x      = x;
    this.y      = y;
    this.type   = type;
    this.radius = 11;
    this.ttl    = POWERUP_TTL;
    this.rot    = 0;
    this.dead   = false;
  }

  update(dt) {
    this.rot += dt * 2;
    this.ttl -= dt;
    if (this.ttl <= 0) this.dead = true;
  }

  draw() {
    // Parpadea cuando está por expirar
    if (this.ttl < 3 && Math.floor(this.ttl * 8) % 2 === 0) return;

    const color = this.type === 'triple' ? '#ff8c1a'
                : this.type === 'shield' ? '#6f6'
                : '#3ff';

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rot);
    ctx.lineJoin  = 'round';
    ctx.lineWidth = 1.5;

    // Anillo exterior
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.stroke();

    // Icono según el tipo
    ctx.beginPath();
    if (this.type === 'triple') {
      // Tres trazos paralelos
      for (const dx of [-4, 0, 4]) {
        ctx.moveTo(dx, -7);
        ctx.lineTo(dx,  7);
      }
    } else if (this.type === 'shield') {
      // Escudo (blasón)
      ctx.moveTo( 0, -7);
      ctx.lineTo( 6, -4);
      ctx.lineTo( 6,  2);
      ctx.lineTo( 0,  7);
      ctx.lineTo(-6,  2);
      ctx.lineTo(-6, -4);
    } else {
      // Rayo
      ctx.moveTo( 2, -7);
      ctx.lineTo(-4,  1);
      ctx.lineTo( 0,  1);
      ctx.lineTo(-2,  7);
      ctx.lineTo( 4, -1);
      ctx.lineTo( 0, -1);
    }
    ctx.closePath();
    ctx.stroke();

    ctx.restore();
  }
}

// ── Estado del juego ──────────────────────────────────────────────────────────
let ship, bullets, asteroids, particles, powerups;
let score, lives, level;
let state;      // 'playing' | 'dead' | 'gameover'
let deadTimer;

function spawnAsteroids(count) {
  const SAFE_DIST = 130;
  let starSpawned = false;
  for (let i = 0; i < count; i++) {
    let x, y;
    do {
      x = rand(0, W);
      y = rand(0, H);
    } while (Math.hypot(x - W / 2, y - H / 2) < SAFE_DIST);
    // Como máximo una estrella fugaz por nivel
    const star = !starSpawned && Math.random() < STAR_CHANCE;
    if (star) starSpawned = true;
    asteroids.push(new Asteroid(x, y, 3, star));
  }
}

function initGame() {
  ship          = new Ship();
  bullets   = [];
  asteroids = [];
  particles = [];
  powerups  = [];
  score  = 0;
  lives  = 3;
  level  = 1;
  state  = 'playing';
  spawnAsteroids(4);
}

function nextLevel() {
  level++;
  bullets   = [];
  particles = [];
  powerups  = [];
  ship.reset();
  spawnAsteroids(3 + level);
}

function explode(x, y, count = 8) {
  for (let i = 0; i < count; i++) particles.push(new Particle(x, y));
}

function killShip() {
  explode(ship.x, ship.y, 14);
  ship.dead = true;
  ship.speedBoost = 0;
  ship.tripleShot = 0;
  ship.shield     = false;
  lives--;
  if (lives <= 0) {
    state = 'gameover';
  } else {
    state     = 'dead';
    deadTimer = 2;
  }
}

// ── Update ────────────────────────────────────────────────────────────────────
function update(dt) {
  // Cambio de skin: disponible en cualquier estado
  if (pressed('KeyC')) {
    currentSkin = (currentSkin + 1) % SKINS.length;
    skinToast   = 1.8;
    try { localStorage.setItem('asteroids.skin', String(currentSkin)); } catch (e) {}
  }
  if (skinToast > 0) skinToast -= dt;

  if (state === 'gameover') {
    if (pressed('Space')) initGame();
    particles.forEach(p => p.update(dt));
    particles = particles.filter(p => !p.dead);
    powerups.forEach(p => p.update(dt));
    powerups = powerups.filter(p => !p.dead);
    return;
  }

  if (state === 'dead') {
    deadTimer -= dt;
    particles.forEach(p => p.update(dt));
    particles = particles.filter(p => !p.dead);
    asteroids.forEach(a => a.update(dt));
    powerups.forEach(p => p.update(dt));
    powerups = powerups.filter(p => !p.dead);
    if (deadTimer <= 0) { state = 'playing'; ship.reset(); }
    return;
  }

  // Disparar
  if (pressed('Space')) {
    bullets.push(...ship.tryShoot());
  }

  ship.update(dt);
  bullets.forEach(b => b.update(dt));
  asteroids.forEach(a => a.update(dt));
  particles.forEach(p => p.update(dt));
  powerups.forEach(p => p.update(dt));

  bullets   = bullets.filter(b => !b.dead);
  particles = particles.filter(p => !p.dead);

  // Bala vs asteroide
  const newAsteroids = [];
  for (const b of bullets) {
    for (const a of asteroids) {
      if (!a.dead && !b.dead && dist(b, a) < a.radius) {
        b.dead = true;
        a.dead = true;
        score += a.star ? STAR_POINTS : POINTS[a.size];
        explode(a.x, a.y, a.size * 5);
        if (Math.random() < POWERUP_DROP && powerups.length < POWERUP_MAX)
          powerups.push(new PowerUp(a.x, a.y, randomPowerUpType()));
        newAsteroids.push(...a.split());
      }
    }
  }
  asteroids = asteroids.filter(a => !a.dead).concat(newAsteroids);
  bullets   = bullets.filter(b => !b.dead);

  // Nave vs asteroide
  if (ship.invincible <= 0) {
    for (const a of asteroids) {
      if (dist(ship, a) < ship.radius + a.radius * 0.82) {
        if (ship.shield) {
          // El escudo absorbe el impacto: se consume y la nave queda a salvo
          ship.shield    = false;
          ship.invincible = 1.5;  // gracia para no morir por los fragmentos
          a.dead  = true;
          score  += a.star ? STAR_POINTS : POINTS[a.size];
          explode(a.x, a.y, a.size * 5);
        } else {
          killShip();
        }
        break;
      }
    }
    asteroids = asteroids.filter(a => !a.dead);
  }

  // Nave vs power-up
  for (const p of powerups) {
    if (!p.dead && dist(ship, p) < ship.radius + p.radius) {
      p.dead = true;
      if (p.type === 'speed')  ship.speedBoost = POWERUP_BOOST;
      if (p.type === 'triple') ship.tripleShot = POWERUP_TRIPLE;
      if (p.type === 'shield') ship.shield     = true;
      explode(p.x, p.y, 6);
    }
  }
  powerups = powerups.filter(p => !p.dead);

  // Nivel completado
  if (asteroids.length === 0) nextLevel();
}

// ── Draw ──────────────────────────────────────────────────────────────────────
function drawLifeIcon(x, y) {
  const skin = SKINS[currentSkin];
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-Math.PI / 2);
  ctx.scale(0.45, 0.45);
  ctx.strokeStyle = skin.color;
  ctx.lineWidth   = 1.2 / 0.45;   // compensa el escalado
  ctx.lineJoin    = 'round';
  ctx.beginPath();
  skin.trazo(ctx);
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
}

function drawHUD() {
  ctx.fillStyle = '#fff';
  ctx.font = '15px monospace';

  ctx.textAlign = 'left';
  ctx.fillText(`SCORE  ${score}`, 14, 26);

  let y = 46;

  // Skin activa
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.fillText(`SKIN  ${SKINS[currentSkin].nombre}`, 14, y);
  y += 20;

  // Indicador del power-up "Velocidad"
  if (ship.speedBoost > 0) {
    ctx.fillStyle = '#3ff';
    ctx.fillText(`VELOCIDAD ${ship.speedBoost.toFixed(1)}s`, 14, y);
    y += 20;
  }

  // Indicador del power-up "Triple shot"
  if (ship.tripleShot > 0) {
    ctx.fillStyle = '#ff8c1a';
    ctx.fillText(`TRIPLE SHOT ${ship.tripleShot.toFixed(1)}s`, 14, y);
    y += 20;
  }

  // Indicador del escudo
  if (ship.shield) {
    ctx.fillStyle = '#6f6';
    ctx.fillText('ESCUDO', 14, y);
    y += 20;
  }

  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.fillText(`NIVEL ${level}`, W / 2, 26);

  for (let i = 0; i < lives; i++)
    drawLifeIcon(W - 16 - i * 22, 18);

  // Aviso al cambiar de skin (se desvanece al final)
  if (skinToast > 0) {
    const alpha = Math.min(1, skinToast / 0.5);
    ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(2)})`;
    ctx.fillText(`SKIN: ${SKINS[currentSkin].nombre}`, W / 2, H - 24);
  }
}

function drawOverlay(title, sub) {
  ctx.textAlign   = 'center';
  ctx.fillStyle   = '#fff';
  ctx.font        = 'bold 46px monospace';
  ctx.fillText(title, W / 2, H / 2 - 18);
  ctx.font        = '18px monospace';
  ctx.fillStyle   = 'rgba(255,255,255,0.65)';
  ctx.fillText(sub, W / 2, H / 2 + 22);
}

function draw() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, W, H);

  particles.forEach(p => p.draw());
  asteroids.forEach(a => a.draw());
  bullets.forEach(b => b.draw());
  powerups.forEach(p => p.draw());
  ship.draw();

  drawHUD();

  if (state === 'gameover') {
    drawOverlay('GAME OVER', `PUNTAJE: ${score}   —   ESPACIO PARA REINICIAR`);
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    ctx.font = '15px monospace';
    ctx.fillText('C  ·  CAMBIAR SKIN', W / 2, H / 2 + 56);
  }
}

// ── Loop principal ────────────────────────────────────────────────────────────
let lastTime = null;

function loop(ts) {
  const dt = lastTime === null ? 0 : Math.min((ts - lastTime) / 1000, 0.05);
  lastTime = ts;
  update(dt);
  draw();
  requestAnimationFrame(loop);
}

initGame();
requestAnimationFrame(loop);