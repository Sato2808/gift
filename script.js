const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const music = document.getElementById('music');
const musicButton = document.getElementById('musicButton');
const restartButton = document.getElementById('restartButton');
const wordGrid = document.getElementById('wordGrid');

const DPR = Math.min(window.devicePixelRatio || 1, 2);
let width = 0;
let height = 0;
let raf = null;
let time = 0;
let isPlaying = false;
let startTime = null;
let sceneProgress = 0;

const state = {
  rays: [],
  stars: [],
  glow: [],
  petals: [],
  heart: [],
  pulse: 0
};

const words = ['Пусть', 'каждый', 'твой', 'день', 'будет', 'наполнен', 'улыбками', 'любовью', 'теплом', 'и', 'счастьем'];

const palette = {
  dark: '#100613',
  soft: '#1b0b23',
  rosy: '#ff7ea4',
  blush: '#ffc8df',
  pale: '#f9eef5',
  gold: '#ffd97f'
};

function resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width * DPR;
  canvas.height = height * DPR;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  resetScene();
}

function resetScene() {
  state.rays = Array.from({ length: 18 }, createRay);
  state.stars = Array.from({ length: 90 }, createStar);
  state.glow = Array.from({ length: 24 }, createGlow);
  state.petals = Array.from({ length: 72 }, createPetal);
  state.heart = Array.from({ length: 280 }, createHeartDot);
  state.pulse = 0;
  time = 0;
  startTime = null;
  sceneProgress = 0;
  wordGrid.innerHTML = '';
}

function createRay() {
  return {
    angle: Math.random() * Math.PI * 2,
    extend: 0.05 + Math.random() * 0.18,
    width: 1.2 + Math.random() * 1.6,
    alpha: 0.08 + Math.random() * 0.15,
    phase: Math.random() * Math.PI * 2
  };
}

function createStar() {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 1.8 + 0.7,
    alpha: 0.2 + Math.random() * 0.35,
    twinkle: Math.random() * Math.PI * 2,
    hue: Math.random() > 0.5 ? palette.blush : palette.pale
  };
}

function createGlow() {
  return {
    x: width * 0.5 + (Math.random() - 0.5) * width * 0.35,
    y: height * 0.5 + (Math.random() - 0.5) * height * 0.35,
    size: Math.random() * 120 + 90,
    alpha: 0.08 + Math.random() * 0.08
  };
}

function createPetal() {
  return {
    x: Math.random() * width,
    y: Math.random() * height + height,
    size: Math.random() * 14 + 8,
    drift: (Math.random() - 0.5) * 0.35,
    speed: 0.8 + Math.random() * 1.2,
    rotation: Math.random() * Math.PI * 2,
    alpha: 0.24 + Math.random() * 0.26
  };
}

function createHeartDot() {
  const theta = Math.random() * Math.PI * 2;
  const radius = Math.random() * 0.45 + 0.2;
  return {
    x: width / 2 + Math.sin(theta) * radius * width * 0.16,
    y: height / 2 - (Math.cos(theta) * 0.8 + (Math.sin(theta) ** 2) * 0.2) * height * 0.14,
    tx: width / 2,
    ty: height / 2,
    radius: 1 + Math.random() * 1.8,
    alpha: 0.35 + Math.random() * 0.45,
    offset: Math.random() * Math.PI * 2,
    speed: 0.06 + Math.random() * 0.08,
    hue: Math.random() > 0.6 ? palette.rosy : palette.blush
  };
}

function easeOut(t) {
  return 1 - Math.pow(1 - t, 3);
}

function easeInOut(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function drawBackground() {
  const bg = ctx.createLinearGradient(0, 0, 0, height);
  bg.addColorStop(0, '#1d0a1f');
  bg.addColorStop(0.45, '#1b0b23');
  bg.addColorStop(1, '#08020a');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);
}

function drawStars(dt) {
  state.stars.forEach((star) => {
    star.twinkle += dt * 2.2;
    const brightness = star.alpha + Math.sin(star.twinkle) * 0.18;
    ctx.save();
    ctx.globalAlpha = brightness;
    ctx.fillStyle = star.hue;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}

function drawRays(dt) {
  ctx.save();
  ctx.translate(width / 2, height / 2);
  state.rays.forEach((ray, index) => {
    const length = Math.max(width, height) * (0.28 + ray.extend) * (0.92 + Math.sin(time * 0.8 + index * 0.42) * 0.05);
    const angle = ray.angle + Math.sin(time * 0.4 + ray.phase) * 0.08;
    const x = Math.cos(angle) * length;
    const y = Math.sin(angle) * length;
    ctx.strokeStyle = `rgba(255, 130, 175, ${ray.alpha})`;
    ctx.lineWidth = ray.width;
    ctx.shadowBlur = 26;
    ctx.shadowColor = 'rgba(255, 166, 199, 0.32)';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(x, y);
    ctx.stroke();
  });
  ctx.restore();
}

function drawGlow() {
  state.glow.forEach((spot) => {
    ctx.save();
    ctx.globalAlpha = spot.alpha * (0.9 + Math.sin(time * 0.8) * 0.12);
    const gradient = ctx.createRadialGradient(spot.x, spot.y, 0, spot.x, spot.y, spot.size);
    gradient.addColorStop(0, 'rgba(255, 189, 214, 0.18)');
    gradient.addColorStop(1, 'rgba(255, 189, 214, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(spot.x, spot.y, spot.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}

function drawHeart(dt) {
  const centerX = width / 2;
  const centerY = height / 2;
  state.heart.forEach((dot) => {
    const tx = centerX + Math.sin(dot.offset + time * 0.8) * width * 0.04;
    const ty = centerY + Math.cos(dot.offset + time * 0.6) * height * 0.03;
    dot.x += (tx - dot.x) * dot.speed * dt * 30;
    dot.y += (ty - dot.y) * dot.speed * dt * 30;
    dot.alpha = 0.35 + Math.sin(time * 2 + dot.offset) * 0.12;
    ctx.save();
    ctx.globalAlpha = dot.alpha;
    ctx.fillStyle = dot.hue;
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}

function drawPetals(dt) {
  state.petals.forEach((petal) => {
    petal.y -= petal.speed * dt * 40;
    petal.x += petal.drift * dt * 20;
    petal.rotation += dt * 0.28;
    if (petal.y < -40) {
      petal.y = height + 40;
      petal.x = Math.random() * width;
    }
    ctx.save();
    ctx.translate(petal.x, petal.y);
    ctx.rotate(petal.rotation);
    ctx.globalAlpha = petal.alpha * 0.8;
    ctx.fillStyle = 'rgba(255, 191, 220, 0.62)';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(petal.size * 0.4, -petal.size * 0.4, petal.size, -petal.size * 0.2, petal.size * 0.45, petal.size * 0.8);
    ctx.bezierCurveTo(petal.size * 0.12, petal.size * 1.1, -petal.size * 0.22, petal.size * 0.95, -petal.size * 0.5, petal.size * 0.8);
    ctx.bezierCurveTo(-petal.size, -petal.size * 0.14, -petal.size * 0.4, -petal.size * 0.4, 0, 0);
    ctx.fill();
    ctx.restore();
  });
}

function drawFinalSparkles(dt) {
  if (time < 12) return;
  const sparkleCount = 16;
  for (let i = 0; i < sparkleCount; i += 1) {
    const angle = (Math.PI * 2 * i) / sparkleCount + time * 0.2;
    const radius = Math.min(width, height) * 0.28;
    const x = width / 2 + Math.cos(angle) * radius;
    const y = height / 2 + Math.sin(angle) * radius;
    const alpha = 0.3 + Math.sin(time * 2 + i) * 0.18;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = 'rgba(255, 237, 245, 0.65)';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(x - 4, y);
    ctx.lineTo(x + 4, y);
    ctx.moveTo(x, y - 4);
    ctx.lineTo(x, y + 4);
    ctx.stroke();
    ctx.restore();
  }
}

function drawSoftGlow() {
  const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.max(width, height) * 0.45);
  gradient.addColorStop(0, 'rgba(255, 136, 184, 0.14)');
  gradient.addColorStop(1, 'rgba(9, 4, 12, 0)');
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

function animate(timestamp) {
  if (!startTime) startTime = timestamp;
  const delta = Math.min((timestamp - (time || timestamp)) / 1000, 0.033);
  time = timestamp;
  sceneProgress = (timestamp - startTime) / 1000;

  drawBackground();
  drawGlow();
  drawRays(delta);
  drawStars(delta);
  drawHeart(delta);
  drawPetals(delta);
  drawFinalSparkles(delta);
  drawSoftGlow();

  updateWords(sceneProgress);
  raf = requestAnimationFrame(animate);
}

function updateWords(progress) {
  if (progress < 7) return;
  const revealed = Math.min(words.length, Math.floor((progress - 7) / 1.05) + 1);
  if (wordGrid.childNodes.length === revealed) return;
  wordGrid.innerHTML = '';
  for (let index = 0; index < revealed; index += 1) {
    const span = document.createElement('span');
    span.className = 'word';
    span.textContent = words[index];
    span.style.animationDelay = `${index * 0.06}s`;
    wordGrid.appendChild(span);
  }
}

function playMusic() {
  if (!music.src) {
    music.src = 'audio.mp3';
  }
  musicButton.textContent = '♫ Музыка включена';
  music.play().catch(() => {
    musicButton.textContent = '♪ Включить музыку';
  });
}

function restart() {
  cancelAnimationFrame(raf);
  resetScene();
  start();
}

function start() {
  resize();
  cancelAnimationFrame(raf);
  startTime = null;
  raf = requestAnimationFrame(animate);
}

window.addEventListener('resize', resize);
window.addEventListener('load', () => {
  resetScene();
  start();
});

musicButton.addEventListener('click', playMusic);
restartButton.addEventListener('click', restart);
