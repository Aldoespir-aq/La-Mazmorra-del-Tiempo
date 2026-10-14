import level1 from "./levels/level-1.js";
import level2 from "./levels/level-2.js";
import level3 from "./levels/level-3.js";
import { Game } from "./game.js";

const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");
const game = new Game([level1, level2, level3]);
const WIDTH = canvas.width;
const HEIGHT = canvas.height;
let previousFrame = 0;

const colors = {
  ink: "#171927",
  stone: "#343342",
  stoneLight: "#59515a",
  gold: "#e2a254",
  cream: "#f7edcf",
  muted: "#aaa5a7",
  red: "#e36c59",
  teal: "#71c0ae"
};

function roundedRect(x, y, width, height, radius, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, radius);
  ctx.fill();
}

function drawBackground(cameraX, levelIndex) {
  const gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  gradient.addColorStop(0, levelIndex === 2 ? "#25233a" : "#202336");
  gradient.addColorStop(1, "#151724");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.save();
  ctx.translate(-cameraX * 0.2, 0);
  for (let i = 0; i < 9; i += 1) {
    const x = i * 190 - 25;
    ctx.fillStyle = i % 2 ? "#282739" : "#242637";
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + 55, 0);
    ctx.lineTo(x + 88, 420);
    ctx.lineTo(x - 27, 420);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "rgba(226,162,84,.07)";
    ctx.fillRect(x + 29, 70, 3, 170);
  }
  ctx.restore();

  const glow = ctx.createRadialGradient(760, 92, 3, 760, 92, 260);
  glow.addColorStop(0, "rgba(233,157,82,.12)");
  glow.addColorStop(1, "rgba(233,157,82,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(450, 0, 510, 360);
}

function drawLevel() {
  const level = game.level;
  drawBackground(game.cameraX, game.levelIndex);
  ctx.save();
  ctx.translate(-game.cameraX, 0);

  for (const platform of level.platforms) {
    ctx.fillStyle = colors.stone;
    ctx.fillRect(platform.x, platform.y, platform.w, platform.h);
    ctx.fillStyle = colors.stoneLight;
    ctx.fillRect(platform.x, platform.y, platform.w, 5);
    ctx.fillStyle = "rgba(12,13,20,.38)";
    for (let x = platform.x + 18; x < platform.x + platform.w - 8; x += 54) {
      ctx.fillRect(x, platform.y + 18, 24, 2);
    }
  }

  for (const spike of level.spikes) {
    const count = Math.max(2, Math.floor(spike.w / 17));
    const toothWidth = spike.w / count;
    ctx.fillStyle = colors.red;
    for (let i = 0; i < count; i += 1) {
      ctx.beginPath();
      ctx.moveTo(spike.x + i * toothWidth, spike.y + spike.h);
      ctx.lineTo(spike.x + (i + .5) * toothWidth, spike.y + 2);
      ctx.lineTo(spike.x + (i + 1) * toothWidth, spike.y + spike.h);
      ctx.fill();
    }
  }

  drawExit(level.exit);
  drawPlayer();
  ctx.restore();
  drawHud(level);
}

function drawExit(exit) {
  ctx.fillStyle = "rgba(226,162,84,.14)";
  ctx.fillRect(exit.x - 10, exit.y - 10, exit.w + 20, exit.h + 10);
  roundedRect(exit.x, exit.y, exit.w, exit.h, 18, colors.gold);
  roundedRect(exit.x + 7, exit.y + 8, exit.w - 14, exit.h - 8, 13, "#49333c");
  ctx.fillStyle = colors.gold;
  ctx.beginPath();
  ctx.arc(exit.x + exit.w - 12, exit.y + 44, 2, 0, Math.PI * 2);
  ctx.fill();
}

function drawPlayer() {
  const p = game.player;
  const x = p.x;
  const y = p.y;
  ctx.fillStyle = "rgba(7,8,14,.25)";
  ctx.beginPath();
  ctx.ellipse(x + p.w / 2, y + p.h + 3, 17, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  roundedRect(x + 6, y + 14, 17, 27, 5, "#e9c68e");
  roundedRect(x + 5, y + 4, 19, 17, 7, "#d69b69");
  ctx.fillStyle = "#302535";
  ctx.fillRect(x + (p.facing > 0 ? 18 : 8), y + 11, 3, 3);
  ctx.fillStyle = "#eee2c6";
  ctx.fillRect(x + 3, y + 39, 11, 3);
  ctx.fillRect(x + 16, y + 39, 11, 3);
  ctx.fillStyle = colors.red;
  ctx.fillRect(x + 4, y + 22, 21, 4);
  ctx.fillStyle = colors.gold;
  ctx.fillRect(x + (p.facing > 0 ? 0 : 24), y + 27, 5, 12);
}

function drawHud(level) {
  roundedRect(22, 20, 916, 62, 9, "rgba(14,15,24,.76)");
  ctx.fillStyle = colors.gold;
  ctx.font = "500 11px 'DM Mono', monospace";
  ctx.fillText(`NIVEL 0${game.levelIndex + 1} / 03`, 42, 44);
  ctx.fillStyle = colors.cream;
  ctx.font = "600 17px 'Space Grotesk', sans-serif";
  ctx.fillText(level.name, 42, 66);
  ctx.fillStyle = colors.muted;
  ctx.font = "12px 'DM Mono', monospace";
  ctx.fillText(`VIDAS  ${"♥ ".repeat(game.lives).trim()}`, 682, 45);
  ctx.fillText(`PUNTOS  ${game.score}`, 682, 66);
  ctx.textAlign = "right";
  ctx.fillText(`${Math.floor(game.elapsed)} s`, 915, 45);
  ctx.textAlign = "left";
}

function drawPanel(title, subtitle, action, details = "") {
  ctx.fillStyle = "rgba(10,11,18,.7)";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  roundedRect(185, 112, 590, 320, 16, "#20212d");
  ctx.strokeStyle = "rgba(226,162,84,.45)";
  ctx.lineWidth = 1;
  ctx.strokeRect(186, 113, 588, 318);
  ctx.textAlign = "center";
  ctx.fillStyle = colors.gold;
  ctx.font = "500 11px 'DM Mono', monospace";
  ctx.fillText("LA MAZMORRA DEL TIEMPO", WIDTH / 2, 163);
  ctx.fillStyle = colors.cream;
  ctx.font = "600 36px 'Space Grotesk', sans-serif";
  ctx.fillText(title, WIDTH / 2, 220);
  ctx.fillStyle = colors.muted;
  ctx.font = "15px 'Space Grotesk', sans-serif";
  ctx.fillText(subtitle, WIDTH / 2, 253);
  if (details) {
    ctx.fillStyle = colors.gold;
    ctx.font = "13px 'DM Mono', monospace";
    ctx.fillText(details, WIDTH / 2, 288);
  }
  roundedRect(355, 323, 250, 54, 8, colors.gold);
  ctx.fillStyle = "#211b20";
  ctx.font = "600 15px 'Space Grotesk', sans-serif";
  ctx.fillText(action, WIDTH / 2, 356);
  ctx.fillStyle = "#c4bdba";
  ctx.font = "12px 'DM Mono', monospace";
  ctx.fillText("o pulsa ENTER", WIDTH / 2, 404);
  ctx.textAlign = "left";
}

function render() {
  if (game.state === "title") {
    drawBackground(0, 0);
    drawPanel("Cruza el umbral", "Tres salas. Una oportunidad para escapar.", "COMENZAR", `MEJOR PUNTUACIÓN  ${game.bestScore}`);
  } else if (game.state === "gameover") {
    drawLevel();
    drawPanel("Fin de la partida", `Llegaste al nivel ${game.levelIndex + 1}.`, "INTENTAR DE NUEVO", `PUNTUACIÓN  ${game.score}`);
  } else if (game.state === "won") {
    drawLevel();
    drawPanel("¡Has escapado!", "El tiempo vuelve a correr a tu favor.", "JUGAR DE NUEVO", `PUNTOS  ${game.score}     RÉCORD  ${game.bestScore}`);
  } else {
    drawLevel();
    ctx.fillStyle = "rgba(247,237,207,.64)";
    ctx.font = "12px 'DM Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillText(game.level.subtitle, WIDTH / 2, 111);
    ctx.textAlign = "left";
  }
}

function frame(timestamp) {
  const dt = Math.min((timestamp - previousFrame) / 1000, 1 / 30);
  previousFrame = timestamp;
  game.update(dt);
  render();
  requestAnimationFrame(frame);
}

function activate() {
  if (game.state !== "playing") game.start();
}

const keyMap = {
  ArrowLeft: "ArrowLeft", ArrowRight: "ArrowRight",
  ArrowUp: "ArrowUp", Space: "Space",
  KeyA: "KeyA", KeyD: "KeyD", KeyW: "KeyW"
};

window.addEventListener("keydown", event => {
  if (keyMap[event.code]) {
    event.preventDefault();
    if (!game.keys.has(event.code) &&
        ["Space", "ArrowUp", "KeyW"].includes(event.code)) {
      game.jumpQueued = true;
    }
    game.keys.add(event.code);
  }
  if (event.code === "Enter" && game.state !== "playing") activate();
  if (event.code === "KeyR") game.restartLevel();
});

window.addEventListener("keyup", event => game.keys.delete(event.code));
window.addEventListener("blur", () => game.keys.clear());
canvas.addEventListener("click", activate);
requestAnimationFrame(frame);
