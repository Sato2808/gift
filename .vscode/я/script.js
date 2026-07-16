const canvas = document.getElementById('sceneCanvas');
const ctx = canvas.getContext('2d');
const music = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
const restartButton = document.getElementById('restartButton');
const sceneMessage = document.getElementById('sceneMessage');

const DPR = Math.min(window.devicePixelRatio || 1, 2);
let width = 0;
let height = 0;
let pointer = { x: 0, y: 0, active: false };
let animationFrameId = null;
let isPlaying = true;
let currentScene = 0;
let sceneTimer = 0;
let sceneDuration = 0;
let transitionAlpha = 0;
let introStarted = false;
let musicReady = false;
let musicStarted = false;

const state = {
  particles: [],
  hearts: [],
  sakura: [],
  stars: [],
  butterflies: [],
  sparkles: [],
  fireflies: [],
  heartCore: []
};

const palette = {
  pink1: '#ff4f81',
  pink2: '#ff7eb3',
  pink3: '#ff9ecf',
  pink4: '#ffd6e7',
  white: '#ffffff',
  cream: '#ffe8f3',
  gold: '#ffd166'
};

const sceneTexts = [
  'Для самой прекрасной девушки...',
  'С Днем Рождения, Назель!',
  'Пусть',
  'каждый',
  'твой',
  'день',
  'будет',
  'наполнен',
  'улыбками',
  'любовью',
  'теплом',
  'и',
  'счастьем'
];

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
  state.particles = [];
  state.hearts = [];
  state.sakura = [];
  state.stars = [];
  state.butterflies = [];
  state.sparkles = [];
  state.fireflies = [];
  state.heartCore = [];

  for (let i = 0; i < 220; i += 1) {
    state.stars.push(createStar(i));
  }
  for (let i = 0; i < 120; i += 1) {
    state.fireflies.push(createFirefly(i));
  }
  for (let i = 0; i < 110; i += 1) {
    state.particles.push(createParticle(i));
  }
  for (let i = 0; i < 90; i += 1) {
    state.hearts.push(createHeart(i));
  }
  for (let i = 0; i < 110; i += 1) {
    state.sakura.push(createSakura(i));
  }
  for (let i = 0; i < 140; i += 1) {
    state.sparkles.push(createSparkle(i));
  }
  for (let i = 0; i < 50; i += 1) {
    state.butterflies.push(createButterfly(i));
  }
  for (let i = 0; i < 2200; i += 1) {
    state.heartCore.push(createHeartCore(i));
  }

  currentScene = 0;
  sceneTimer = 0;
  sceneDuration = 0;
  transitionAlpha = 0;
  introStarted = false;
  sceneMessage.classList.remove('visible');
}

function createStar(index) {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 2.2 + 0.8,
    speed: Math.random() * 0.25 + 0.08,
    alpha: Math.random() * 0.7 + 0.15,
    twinkle: Math.random() * Math.PI * 2,
    drift: Math.random() * 0.7 + 0.2,
    hue: Math.random() > 0.5 ? palette.gold : palette.white
  };
}

function createFirefly(index) {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 3 + 1.2,
    speedX: (Math.random() - 0.5) * 1.1,
    speedY: (Math.random() - 0.5) * 1.1,
    phase: Math.random() * Math.PI * 2,
    alpha: Math.random() * 0.55 + 0.25,
    glow: Math.random() * 0.8 + 0.2
  };
}

function createParticle(index) {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 2.8 + 0.7,
    speedX: (Math.random() - 0.5) * 2.4,
    speedY: (Math.random() - 0.5) * 2.4,
    alpha: Math.random() * 0.8 + 0.15,
    color: [palette.pink1, palette.pink2, palette.pink3, palette.cream][Math.floor(Math.random() * 4)]
  };
}

function createHeart(index) {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 20 + 8,
    vx: (Math.random() - 0.5) * 1.8,
    vy: Math.random() * 0.7 + 0.4,
    alpha: Math.random() * 0.6 + 0.2,
    rotation: Math.random() * Math.PI * 2,
    pulse: Math.random() * Math.PI * 2,
    glow: Math.random() * 0.5 + 0.3,
    color: [palette.pink1, palette.pink2, palette.gold, palette.white][Math.floor(Math.random() * 4)]
  };
}

function createSakura(index) {
  return {
    x: Math.random() * width,
    y: Math.random() * height - height,
    size: Math.random() * 12 + 7,
    rotation: Math.random() * Math.PI * 2,
    speedX: (Math.random() - 0.5) * 0.8,
    speedY: Math.random() * 1.7 + 0.8,
    spin: (Math.random() - 0.5) * 0.03,
    alpha: Math.random() * 0.8 + 0.2,
    sway: Math.random() * 0.01 + 0.005,
    drift: Math.random() * 0.8 + 0.2
  };
}

function createSparkle(index) {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 4 + 1.5,
    speedY: Math.random() * 1.2 + 0.4,
    alpha: Math.random() * 0.7 + 0.15,
    phase: Math.random() * Math.PI * 2,
    color: [palette.gold, palette.pink2, palette.white, palette.cream][Math.floor(Math.random() * 4)]
  };
}

function createButterfly(index) {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 20 + 10,
    speedX: Math.random() * 1.2 + 0.4,
    speedY: Math.random() * 1.0 + 0.3,
    wobble: Math.random() * 0.08 + 0.02,
    phase: Math.random() * Math.PI * 2,
    alpha: Math.random() * 0.6 + 0.25,
    color: [palette.pink2, palette.pink3, palette.white][Math.floor(Math.random() * 3)]
  };
}

function createHeartCore(index) {
  return {
    x: width / 2 + (Math.random() - 0.5) * 320,
    y: height / 2 + (Math.random() - 0.5) * 240,
    size: Math.random() * 3 + 1,
    vx: (Math.random() - 0.5) * 2.3,
    vy: (Math.random() - 0.5) * 2.3,
    alpha: Math.random() * 0.75 + 0.2,
    color: [palette.pink1, palette.pink2, palette.gold, palette.white][Math.floor(Math.random() * 4)]
  };
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function elasticOut(t) {
  const c4 = (2 * Math.PI) / 3;
  return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
}

function setSceneMessage(text) {
  sceneMessage.textContent = text;
  sceneMessage.classList.add('visible');
}

function hideSceneMessage() {
  sceneMessage.classList.remove('visible');
}

function updateSceneTiming(delta) {
  sceneTimer += delta;
  sceneDuration += delta;

  if (sceneTimer > 3.2) {
    if (currentScene < 9) {
      currentScene += 1;
      sceneTimer = 0;
      transitionAlpha = 0;
      hideSceneMessage();
    }
  }
}

function updateScene(delta) {
  const t = sceneTimer;
  const progress = Math.min(t / 3.2, 1);

  switch (currentScene) {
    case 0:
      updateScene0(delta, progress);
      if (t < 1.2) setSceneMessage('');
      if (t > 0.8 && t < 2.4) setSceneMessage(sceneTexts[0]);
      break;
    case 1:
      updateScene1(delta, progress);
      break;
    case 2:
      updateScene2(delta, progress);
      break;
    case 3:
      updateScene3(delta, progress);
      break;
    case 4:
      updateScene4(delta, progress);
      break;
    case 5:
      updateScene5(delta, progress);
      break;
    case 6:
      updateScene6(delta, progress);
      break;
    case 7:
      updateScene7(delta, progress);
      break;
    case 8:
      updateScene8(delta, progress);
      break;
    default:
      updateFinalScene(delta, progress);
      break;
  }
}

function updateScene0(delta, progress) {
  const sky = 0.08 + progress * 0.3;
  document.body.style.background = `radial-gradient(circle at center, rgba(255,255,255,${0.04 + progress * 0.07}) 0%, rgba(40,12,60,${sky}) 45%, rgba(0,0,0,0.94) 100%)`;
  state.stars.forEach((star) => {
    star.y -= star.speed * delta * 60;
    if (star.y < -10) star.y = height + 10;
    star.twinkle += delta * 1.3;
  });
  state.fireflies.forEach((firefly) => {
    firefly.x += firefly.speedX * delta * 60;
    firefly.y += firefly.speedY * delta * 60;
    firefly.phase += delta * 0.8;
    if (firefly.x < -20 || firefly.x > width + 20) firefly.x = width * Math.random();
    if (firefly.y < -20 || firefly.y > height + 20) firefly.y = height * Math.random();
  });
}

function updateScene1(delta, progress) {
  const purple = 0.18 + progress * 0.35;
  document.body.style.background = `linear-gradient(135deg, rgba(53,13,76,${purple}) 0%, rgba(21,10,55,${0.75 + progress * 0.1}) 45%, rgba(4,2,7,0.95) 100%)`;
  state.hearts.forEach((heart) => {
    heart.x += heart.vx * delta * 60;
    heart.y -= heart.vy * delta * 60;
    heart.rotation += delta * 0.6;
    heart.pulse += delta * 1.5;
    if (heart.y < -40) {
      heart.y = height + 40;
      heart.x = Math.random() * width;
    }
    if (heart.x < -40 || heart.x > width + 40) {
      heart.x = Math.random() * width;
    }
  });
}

function updateScene2(delta, progress) {
  const grow = elasticOut(Math.min(progress, 1));
  const scale = 0.8 + grow * 0.55;
  state.particles.forEach((particle) => {
    particle.x += particle.speedX * delta * 60;
    particle.y += particle.speedY * delta * 60;
    if (particle.x < -20 || particle.x > width + 20) particle.x = width * Math.random();
    if (particle.y < -20 || particle.y > height + 20) particle.y = height * Math.random();
  });
  state.sparkles.forEach((sparkle) => {
    sparkle.y += sparkle.speedY * delta * 60 * (0.6 + progress * 0.7);
    sparkle.phase += delta * 1.2;
    if (sparkle.y > height + 10) {
      sparkle.y = -10;
      sparkle.x = Math.random() * width;
    }
  });
  document.body.style.background = `radial-gradient(circle at center, rgba(255, 255, 255, ${0.05 + progress * 0.04}) 0%, rgba(255,79,129,${0.22 + progress * 0.05}) 40%, rgba(7,3,10,1) 100%)`;
  if (progress > 0.1) setSceneMessage(sceneTexts[1]);
}

function updateScene3(delta, progress) {
  state.sparkles.forEach((sparkle) => {
    sparkle.y += sparkle.speedY * delta * 60;
    if (sparkle.y > height + 10) {
      sparkle.y = -10;
      sparkle.x = Math.random() * width;
    }
  });
  state.particles.forEach((particle) => {
    particle.x += Math.sin(particle.y * 0.003) * 0.3;
    particle.y -= 0.4;
  });
  if (progress > 0.3) setSceneMessage('');
}

function updateScene4(delta, progress) {
  state.particles.forEach((particle) => {
    particle.x += particle.speedX * delta * 60 * 1.3;
    particle.y += particle.speedY * delta * 60 * 1.3;
    if (particle.y < -30 || particle.y > height + 30) {
      particle.x = Math.random() * width;
      particle.y = Math.random() * height;
    }
  });
  state.sparkles.forEach((sparkle) => {
    sparkle.y += sparkle.speedY * delta * 75;
    sparkle.alpha = 0.2 + Math.sin(sparkle.phase * 0.6 + progress * 3) * 0.4;
  });
  if (progress > 0.2) setSceneMessage('');
}

function updateScene5(delta, progress) {
  state.sakura.forEach((petal) => {
    petal.x += petal.speedX * delta * 60;
    petal.y += petal.speedY * delta * 60 * (0.7 + progress * 0.5);
    petal.rotation += petal.spin * delta * 60;
    if (petal.y > height + 20) {
      petal.y = -20;
      petal.x = Math.random() * width;
    }
  });
  if (progress > 0.1) setSceneMessage('');
}

function updateScene6(delta, progress) {
  const words = sceneTexts.slice(2, 13);
  const index = Math.min(Math.floor(progress * words.length), words.length - 1);
  setSceneMessage(words[index]);
  state.butterflies.forEach((butterfly) => {
    butterfly.x += Math.sin((butterfly.phase + progress * 3)) * 0.18;
    butterfly.y += butterfly.speedY * delta * 30;
    butterfly.phase += delta * 0.8;
  });
}

function updateScene7(delta, progress) {
  state.butterflies.forEach((butterfly) => {
    butterfly.x += Math.cos(butterfly.phase) * 0.3;
    butterfly.y -= 0.7;
    butterfly.phase += delta * 0.8;
  });
  state.sparkles.forEach((sparkle) => {
    sparkle.y -= 0.4;
    sparkle.phase += delta * 1.4;
  });
  if (progress > 0.2) setSceneMessage('');
}

function updateScene8(delta, progress) {
  state.heartCore.forEach((point) => {
    const dx = width / 2 - point.x;
    const dy = height / 2 - point.y;
    const dist = Math.max(1, Math.sqrt(dx * dx + dy * dy));
    point.vx += (dx / dist) * 0.0008;
    point.vy += (dy / dist) * 0.0008;
    point.x += point.vx * delta * 60;
    point.y += point.vy * delta * 60;
    point.vx *= 0.94;
    point.vy *= 0.94;
    if (pointer.active) {
      const px = pointer.x - point.x;
      const py = pointer.y - point.y;
      const d = Math.sqrt(px * px + py * py);
      if (d < 180) {
        point.x -= px * 0.0018;
        point.y -= py * 0.0018;
      }
    }
  });
  if (progress > 0.1) setSceneMessage('');
}

function updateFinalScene(delta, progress) {
  state.heartCore.forEach((point) => {
    point.x += Math.sin((progress + point.alpha) * 2.5) * 0.45;
    point.y += Math.cos((progress + point.alpha) * 2.0) * 0.45;
  });
  state.sakura.forEach((petal) => {
    petal.x += petal.speedX * delta * 100;
    petal.y += petal.speedY * delta * 55;
  });
  state.sparkles.forEach((sparkle) => {
    sparkle.y -= 0.6;
  });
}

function drawBackground() {
  ctx.clearRect(0, 0, width, height);
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, '#0a0314');
  gradient.addColorStop(0.5, '#17061e');
  gradient.addColorStop(1, '#020103');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

function drawStars() {
  state.stars.forEach((star) => {
    const flare = 0.45 + Math.sin(star.twinkle) * 0.35;
    ctx.save();
    ctx.globalAlpha = star.alpha * flare;
    ctx.fillStyle = star.hue;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size * (0.8 + flare), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}

function drawFireflies() {
  state.fireflies.forEach((firefly) => {
    const pulse = 0.4 + Math.sin(firefly.phase) * 0.3;
    ctx.save();
    ctx.globalAlpha = firefly.alpha * pulse;
    const gradient = ctx.createRadialGradient(firefly.x, firefly.y, 0, firefly.x, firefly.y, firefly.radius * 4);
    gradient.addColorStop(0, '#fff7c2');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(firefly.x, firefly.y, firefly.radius * 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}

function drawHearts() {
  state.hearts.forEach((heart) => {
    const pulse = 0.6 + Math.sin(heart.pulse) * 0.25;
    ctx.save();
    ctx.translate(heart.x, heart.y);
    ctx.rotate(heart.rotation);
    ctx.scale(pulse, pulse);
    ctx.globalAlpha = heart.alpha;
    ctx.shadowBlur = 18;
    ctx.shadowColor = heart.color;
    ctx.fillStyle = heart.color;
    drawHeartShape(heart.size);
    ctx.fill();
    ctx.restore();
  });
}

function drawHeartShape(size) {
  ctx.beginPath();
  ctx.moveTo(0, size * 0.35);
  ctx.bezierCurveTo(-size * 0.36, -size * 0.12, -size * 0.46, -size * 0.6, 0, -size * 0.8);
  ctx.bezierCurveTo(size * 0.46, -size * 0.6, size * 0.36, -size * 0.12, 0, size * 0.35);
  ctx.bezierCurveTo(size * 0.14, size * 0.56, size * 0.16, size * 0.82, 0, size * 1.02);
  ctx.bezierCurveTo(-size * 0.16, size * 0.82, -size * 0.14, size * 0.56, 0, size * 0.35);
  ctx.closePath();
}

function drawParticles() {
  state.particles.forEach((particle) => {
    ctx.save();
    ctx.globalAlpha = particle.alpha;
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}

function drawSakura() {
  state.sakura.forEach((petal) => {
    ctx.save();
    ctx.translate(petal.x, petal.y);
    ctx.rotate(petal.rotation);
    ctx.globalAlpha = petal.alpha;
    ctx.fillStyle = '#ffe8f3';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(4, -petal.size * 0.5, 12, -petal.size * 0.8, 0, -petal.size);
    ctx.bezierCurveTo(-12, -petal.size * 0.8, -4, -petal.size * 0.5, 0, 0);
    ctx.fill();
    ctx.restore();
  });
}

function drawSparkles() {
  state.sparkles.forEach((sparkle) => {
    const pulse = 0.4 + Math.sin(sparkle.phase) * 0.25;
    ctx.save();
    ctx.globalAlpha = sparkle.alpha * pulse;
    ctx.strokeStyle = sparkle.color;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(sparkle.x - sparkle.size, sparkle.y);
    ctx.lineTo(sparkle.x + sparkle.size, sparkle.y);
    ctx.moveTo(sparkle.x, sparkle.y - sparkle.size);
    ctx.lineTo(sparkle.x, sparkle.y + sparkle.size);
    ctx.stroke();
    ctx.restore();
  });
}

function drawButterflies() {
  state.butterflies.forEach((butterfly) => {
    const pulse = 0.5 + Math.sin(butterfly.phase) * 0.2;
    ctx.save();
    ctx.translate(butterfly.x, butterfly.y);
    ctx.scale(1 + pulse * 0.02, 1 + pulse * 0.02);
    ctx.globalAlpha = butterfly.alpha;
    ctx.strokeStyle = butterfly.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(-6, 0, 6, Math.PI * 0.2, Math.PI * 0.8);
    ctx.arc(6, 0, 6, Math.PI * 1.2, Math.PI * 1.8);
    ctx.stroke();
    ctx.restore();
  });
}

function drawHeartCore() {
  const cx = width / 2;
  const cy = height / 2;
  if (currentScene >= 8) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(1.02 + Math.sin(sceneDuration * 0.9) * 0.04, 1.02 + Math.sin(sceneDuration * 0.9) * 0.04);
    ctx.globalAlpha = 0.9;
    ctx.shadowBlur = 45;
    ctx.shadowColor = '#ff7eb3';
    ctx.strokeStyle = '#ffd6e7';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 90);
    ctx.bezierCurveTo(-80, -10, -140, -120, 0, -200);
    ctx.bezierCurveTo(140, -120, 80, -10, 0, 90);
    ctx.stroke();
    ctx.restore();
  }
  state.heartCore.forEach((point) => {
    ctx.save();
    ctx.globalAlpha = point.alpha;
    ctx.fillStyle = point.color;
    ctx.beginPath();
    ctx.arc(point.x, point.y, point.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}

function drawTitle() {
  const phase = sceneTimer;
  const fade = Math.min(1, phase / 1.2);
  if (currentScene === 2 || currentScene === 3 || currentScene === 4 || currentScene === 5 || currentScene === 6 || currentScene === 7 || currentScene === 8) {
    ctx.save();
    ctx.globalAlpha = Math.min(1, fade);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `700 ${Math.max(48, width * 0.07)}px 'Playfair Display'`;
    ctx.fillStyle = '#ffe8f3';
    ctx.shadowBlur = 30;
    ctx.shadowColor = '#ff4f81';
    const message = '✨ С Днем Рождения, Назель! ✨';
    ctx.fillText(message, width / 2, height / 2 - 70);
    ctx.restore();
  }
}

function drawFinalMessage() {
  if (currentScene >= 9) {
    const textFade = Math.min(1, sceneTimer / 1.2);
    ctx.save();
    ctx.globalAlpha = textFade;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `700 ${Math.max(56, width * 0.075)}px 'Great Vibes'`;
    ctx.fillStyle = '#fff7fb';
    ctx.shadowBlur = 24;
    ctx.shadowColor = '#ff4f81';
    ctx.fillText('С Днем Рождения,\nНазель ❤️', width / 2, height / 2 - 180);
    ctx.font = `400 ${Math.max(18, width * 0.026)}px 'Poppins'`;
    ctx.fillStyle = '#ffe8f3';
    ctx.fillText('Спасибо,\nчто однажды появилась в моей жизни.\n\nПусть каждый твой день\nбудет наполнен счастьем,\nулыбками,\nлюбовью,\nисполнением мечт\nи самыми прекрасными моментами.\n\nТы заслуживаешь всего самого лучшего.\n\nС праздником ❤️', width / 2, height / 2 + 80);
    ctx.restore();
  }
}

function drawScene() {
  drawBackground();
  drawStars();
  drawFireflies();
  drawParticles();
  drawHearts();
  drawSakura();
  drawSparkles();
  drawButterflies();
  drawHeartCore();
  drawTitle();
  drawFinalMessage();
}

function loop(now = performance.now()) {
  const delta = Math.min(0.032, (now - (loop.lastTime || now)) / 1000);
  loop.lastTime = now;
  updateSceneTiming(delta);
  updateScene(delta);
  drawScene();
  animationFrameId = requestAnimationFrame(loop);
}

function start() {
  resize();
  if (!introStarted) {
    introStarted = true;
    setSceneMessage('');
    animationFrameId = requestAnimationFrame(loop);
  }
}

function toggleMusic() {
  if (!musicReady) {
    music.src = 'https://cdn.pixabay.com/audio/2022/03/15/audio_9f0c4ec8b2.mp3';
    music.load();
    musicReady = true;
  }
  if (music.paused) {
    music.play().then(() => {
      musicStarted = true;
      musicToggle.textContent = '♫ Музыка включена';
      isPlaying = true;
    }).catch(() => {
      musicToggle.textContent = '♪ Музыка';
      isPlaying = false;
    });
  } else {
    music.pause();
    musicToggle.textContent = '♪ Музыка';
    isPlaying = false;
  }
}

function restartExperience() {
  resetScene();
  sceneMessage.classList.remove('visible');
  if (!musicStarted) {
    musicToggle.textContent = '♪ Музыка';
  }
}

window.addEventListener('resize', resize);
window.addEventListener('mousemove', (event) => {
  pointer.x = event.clientX;
  pointer.y = event.clientY;
  pointer.active = true;
});
window.addEventListener('touchmove', (event) => {
  const touch = event.touches[0];
  if (touch) {
    pointer.x = touch.clientX;
    pointer.y = touch.clientY;
    pointer.active = true;
  }
}, { passive: true });
window.addEventListener('mouseleave', () => {
  pointer.active = false;
});
window.addEventListener('touchend', () => {
  pointer.active = false;
});

musicToggle.addEventListener('click', toggleMusic);
restartButton.addEventListener('click', restartExperience);

start();
