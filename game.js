const WIDTH = 960;
const HEIGHT = 540;
const PLAYER_WIDTH = 28;
const PLAYER_HEIGHT = 42;
const GRAVITY = 1700;
const MOVE_SPEED = 260;
const JUMP_SPEED = 610;
const TOTAL_LEVELS = 3;

const intersects = (a, b) =>
  a.x < b.x + b.w && a.x + a.w > b.x &&
  a.y < b.y + b.h && a.y + a.h > b.y;

export class Game {
  constructor(levels) {
    this.levels = levels;
    this.bestScore = Number(localStorage.getItem("mazmorra-best-score")) || 0;
    this.state = "title";
    this.levelIndex = 0;
    this.lives = 3;
    this.score = 0;
    this.elapsed = 0;
    this.cameraX = 0;
    this.keys = new Set();
    this.jumpQueued = false;
    this.player = this.createPlayer(levels[0].spawn);
  }

  get level() {
    return this.levels[this.levelIndex];
  }

  createPlayer(spawn) {
    return {
      x: spawn.x,
      y: spawn.y,
      w: PLAYER_WIDTH,
      h: PLAYER_HEIGHT,
      vx: 0,
      vy: 0,
      grounded: false,
      facing: 1
    };
  }

  start() {
    this.state = "playing";
    this.levelIndex = 0;
    this.lives = 3;
    this.score = 0;
    this.elapsed = 0;
    this.cameraX = 0;
    this.player = this.createPlayer(this.level.spawn);
  }

  restartLevel() {
    if (this.state === "playing") {
      this.player = this.createPlayer(this.level.spawn);
      this.cameraX = Math.max(0, Math.min(
        this.level.width - WIDTH,
        this.player.x - WIDTH * 0.35
      ));
    }
  }

  update(dt) {
    if (this.state !== "playing") return;
    this.elapsed += dt;

    const player = this.player;
    const direction = Number(this.keys.has("ArrowRight") || this.keys.has("KeyD")) -
      Number(this.keys.has("ArrowLeft") || this.keys.has("KeyA"));
    player.vx = direction * MOVE_SPEED;
    if (direction) player.facing = direction;
    player.vy = Math.min(player.vy + GRAVITY * dt, 900);

    player.x += player.vx * dt;
    player.x = Math.max(0, Math.min(this.level.width - player.w, player.x));
    this.resolveHorizontal(player);

    const previousBottom = player.y + player.h;
    player.y += player.vy * dt;
    player.grounded = false;
    for (const platform of this.level.platforms) {
      if (!intersects(player, platform)) continue;
      if (player.vy >= 0 && previousBottom <= platform.y + 8) {
        player.y = platform.y - player.h;
        player.vy = 0;
        player.grounded = true;
      } else if (player.vy < 0) {
        player.y = platform.y + platform.h;
        player.vy = 0;
      }
    }

    if (this.jumpQueued && player.grounded) {
      player.vy = -JUMP_SPEED;
      player.grounded = false;
    }
    this.jumpQueued = false;

    if (player.y > HEIGHT + 80 || this.level.spikes.some(spike => intersects(player, spike))) {
      this.loseLife();
      return;
    }
    if (intersects(player, this.level.exit)) {
      this.completeLevel();
      if (this.state !== "playing") return;
    }
    this.cameraX = Math.max(0, Math.min(
      this.level.width - WIDTH,
      player.x + player.w / 2 - WIDTH * 0.42
    ));
  }

  resolveHorizontal(player) {
    for (const platform of this.level.platforms) {
      if (!intersects(player, platform)) continue;
      if (player.vx > 0) player.x = platform.x - player.w;
      else if (player.vx < 0) player.x = platform.x + platform.w;
    }
  }

  loseLife() {
    this.lives -= 1;
    if (this.lives <= 0) {
      this.state = "gameover";
      return;
    }
    this.player = this.createPlayer(this.level.spawn);
    this.cameraX = 0;
  }

  completeLevel() {
    this.score += Math.max(100, 1000 - Math.floor(this.elapsed) * 8);
    this.elapsed = 0;
    this.levelIndex += 1;
    if (this.levelIndex === TOTAL_LEVELS) {
      this.state = "won";
      this.bestScore = Math.max(this.bestScore, this.score);
      localStorage.setItem("mazmorra-best-score", String(this.bestScore));
      return;
    }
    this.player = this.createPlayer(this.level.spawn);
    this.cameraX = 0;
  }
}
