const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const introOverlay = document.getElementById('introOverlay');
const videoContainer = document.getElementById('videoContainer');
const videoPlayer = document.getElementById('videoPlayer');
const videoIframe = document.getElementById('videoIframe');
const explosionOverlay = document.getElementById('explosionOverlay');
const uiArea = document.getElementById('uiArea');
const music = document.getElementById('music');
const musicButton = document.getElementById('musicButton');
const restartButton = document.getElementById('restartButton');
const wordGrid = document.getElementById('wordGrid');

const DPR = Math.min(window.devicePixelRatio || 1, 2);
let width = 0;
let height = 0;
let rafId = null;
let lastFrameTime = 0;
let animationTime = 0;
let sceneTime = 0;
let phase = 'intro';
let videoTimer = null;
const MUSIC_PATH = 'media/music/background.mp3';
const VIDEO_PATH = 'media/video/intro.mp4';
const YOUTUBE_EMBED = 'https://www.youtube.com/embed/mPLCBsr_HM8?start=45&autoplay=1&mute=1&controls=0&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3';

const words = ['Пусть', 'каждый', 'твой', 'день', 'будет', 'наполнен', 'улыбками', 'любовью', 'теплом', 'и', 'счастьем'];

const state = {
  rays: [],
  stars: [],
  glows: [],
  petals: [],
  heartDots: [],
  burstRays: []
};

const palette = {
  rose: '#ff7ea4',
  blush: '#ffc8df',
  soft: '#f8eef5',
  gold: '#ffd97f',
  dark: '#0b0510'
};

function resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width * DPR;
  canvas.height = height * DPR;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  initParticles();
}

function initParticles() {
  state.rays = Array.from({ length: 16 }, createRay);
  state.stars = Array.from({ length: 100 }, createStar);
  state.glows = Array.from({ length: 24 }, createGlow);
  state.petals = Array.from({ length: 72 }, createPetal);
  state.heartDots = Array.from({ length: 260 }, createHeartDot);
  state.burstRays = Array.from({ length: 18 }, createBurstRay);
}

function createRay() {
  return {
    angle: Math.random() * Math.PI * 2,
    length: 0.3 + Math.random() * 0.15,
    width: 1.1 + Math.random() * 1.5,
    alpha: 0.08 + Math.random() * 0.12,
    phase: Math.random() * Math.PI * 2
  };
}

function createStar() {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 1.8 + 0.7,
    alpha: 0.18 + Math.random() * 0.42,
    twinkle: Math.random() * Math.PI * 2,
    color: Math.random() > 0.5 ? palette.blush : palette.soft
  };
}

function createGlow() {
  return {
    x: width * 0.45 + (Math.random() - 0.5) * width * 0.38,
    y: height * 0.45 + (Math.random() - 0.5) * height * 0.38,
    size: Math.random() * 90 + 80,
    alpha: 0.08 + Math.random() * 0.1
  };
}

function createPetal() {
  return {
    x: Math.random() * width,
    y: Math.random() * height + height,
    size: Math.random() * 14 + 8,
    drift: (Math.random() - 0.5) * 0.35,
    speed: 0.8 + Math.random() * 1.1,
    rotation: Math.random() * Math.PI * 2,
    alpha: 0.24 + Math.random() * 0.26
  };
}

function createHeartDot() {
  const angle = Math.random() * Math.PI * 2;
  const radiusFactor = Math.random() * 0.5 + 0.18;
  return {
    x: width / 2 + Math.sin(angle) * radiusFactor * width * 0.14,
    y: height / 2 - (Math.cos(angle) * 0.78 + (Math.sin(angle) ** 2) * 0.18) * height * 0.13,
    radius: 0.8 + Math.random() * 1.6,
    alpha: 0.35 + Math.random() * 0.4,
    offset: Math.random() * Math.PI * 2,
    speed: 0.05 + Math.random() * 0.08,
    color: Math.random() > 0.6 ? palette.rose : palette.blush
  };
}

function createBurstRay() {
  return {
    angle: Math.random() * Math.PI * 2,
    length: Math.random() * 260 + 180,
    width: 2.2 + Math.random() * 3.6,
    alpha: 0.08 + Math.random() * 0.18
  };
}

function easeOut(t) {
  return 1 - Math.pow(1 - t, 3);
}

function easeInOut(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function setOverlay(overlay, visible) {
  if (visible) overlay.classList.add('active');
  else overlay.classList.remove('active');
}

function showIntro() {
  phase = 'intro';
  setOverlay(introOverlay, true);
  setOverlay(videoContainer, false);
  setOverlay(explosionOverlay, false);
  uiArea.classList.add('hidden');
  videoIframe.src = '';
  videoPlayer.src = '';
  clearTimeout(videoTimer);
}

function startVideo() {
  phase = 'video';
  setOverlay(introOverlay, false);
  setOverlay(videoContainer, true);
  videoIframe.classList.add('hidden-element');
  videoPlayer.classList.remove('hidden-element');

  videoPlayer.muted = false;
  videoPlayer.src = VIDEO_PATH;

  videoPlayer.onloadedmetadata = () => {
    if (videoPlayer.duration > 45) {
      videoPlayer.currentTime = 45;
    }
  };

  videoPlayer.onerror = () => {
    fallbackToYouTube();
  };

  videoPlayer.play().then(() => {
    videoTimer = setTimeout(finishVideo, 41000);
  }).catch(() => {
    fallbackToYouTube();
  });
}

function finishVideo() {
  phase = 'transition';
  setOverlay(videoContainer, false);
  setOverlay(explosionOverlay, true);
  uiArea.classList.remove('hidden');
  videoPlayer.pause();
  videoPlayer.src = '';
  videoIframe.src = '';
  tryPlayMusic();
  resetScene();
  startAnimation();
  setTimeout(() => setOverlay(explosionOverlay, false), 1000);
}

function fallbackToYouTube() {
  videoPlayer.pause();
  videoPlayer.src = '';
  videoPlayer.classList.add('hidden-element');
  videoIframe.classList.remove('hidden-element');
  videoIframe.src = YOUTUBE_EMBED;
  videoTimer = setTimeout(finishVideo, 41000);
}

function tryPlayMusic() {
  if (!music.src) {
    music.src = MUSIC_PATH;
    music.loop = true;
  }
  music.play().catch(() => {});
}

function resetScene() {
  initParticles();
  animationTime = 0;
  sceneTime = 0;
  lastFrameTime = performance.now();
  wordGrid.innerHTML = '';
}

function drawBackground() {
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, '#1d0a1f');
  gradient.addColorStop(0.42, '#1a081f');
  gradient.addColorStop(1, '#07030a');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

function drawStars(dt) {
  state.stars.forEach((star) => {
    star.twinkle += dt * 2.2;
    const alpha = star.alpha + Math.sin(star.twinkle) * 0.18;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = star.color;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}

function drawRays(dt) {
  ctx.save();
  ctx.translate(width / 2, height / 2);
  state.rays.forEach((ray) => {
    const wave = 0.9 + Math.sin(animationTime * 0.7 + ray.phase) * 0.04;
    const length = Math.max(width, height) * (ray.length + 0.15) * wave;
    const angle = ray.angle + Math.sin(animationTime * 0.35 + ray.phase) * 0.06;
    const x = Math.cos(angle) * length;
    const y = Math.sin(angle) * length;

    ctx.save();
    ctx.strokeStyle = `rgba(255, 143, 185, ${ray.alpha})`;
    ctx.lineWidth = ray.width;
    ctx.shadowBlur = 28;
    ctx.shadowColor = 'rgba(255, 170, 205, 0.28)';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.restore();
  });
  ctx.restore();
}

function drawGlow() {
  state.glows.forEach((glow) => {
    ctx.save();
    ctx.globalAlpha = glow.alpha * (0.86 + Math.sin(animationTime * 0.9) * 0.12);
    const gradient = ctx.createRadialGradient(glow.x, glow.y, 0, glow.x, glow.y, glow.size);
    gradient.addColorStop(0, 'rgba(255, 192, 223, 0.2)');
    gradient.addColorStop(1, 'rgba(255, 192, 223, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(glow.x, glow.y, glow.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}

function drawHeartDots(dt) {
  const cx = width / 2;
  const cy = height / 2;
  state.heartDots.forEach((dot) => {
    const targetX = cx + Math.sin(dot.offset + animationTime * 0.7) * width * 0.04;
    const targetY = cy + Math.cos(dot.offset + animationTime * 0.5) * height * 0.03;
    dot.x += (targetX - dot.x) * dot.speed * dt * 24;
    dot.y += (targetY - dot.y) * dot.speed * dt * 24;
    const alpha = dot.alpha * (0.72 + Math.sin(animationTime * 2 + dot.offset) * 0.1);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = dot.color;
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
    ctx.globalAlpha = petal.alpha * 0.82;
    ctx.fillStyle = 'rgba(255, 183, 215, 0.64)';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(petal.size * 0.4, -petal.size * 0.42, petal.size, -petal.size * 0.18, petal.size * 0.44, petal.size * 0.82);
    ctx.bezierCurveTo(petal.size * 0.12, petal.size * 1.12, -petal.size * 0.22, petal.size * 0.9, -petal.size * 0.5, petal.size * 0.82);
    ctx.bezierCurveTo(-petal.size, -petal.size * 0.12, -petal.size * 0.4, -petal.size * 0.4, 0, 0);
    ctx.fill();
    ctx.restore();
  });
}

function drawBurst() {
  const centerX = width / 2;
  const centerY = height / 2;
  state.burstRays.forEach((ray) => {
    const progress = Math.min(1, sceneTime / 0.45);
    const length = ray.length * progress;
    const alpha = ray.alpha * (0.9 - progress * 0.8);
    const x = centerX + Math.cos(ray.angle) * length;
    const y = centerY + Math.sin(ray.angle) * length;
    ctx.save();
    ctx.strokeStyle = `rgba(255, 159, 201, ${alpha})`;
    ctx.lineWidth = ray.width;
    ctx.shadowBlur = 42;
    ctx.shadowColor = 'rgba(255, 172, 210, 0.4)';
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.restore();
  });
}

function drawFinalGlow() {
  const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.max(width, height) * 0.45);
  gradient.addColorStop(0, 'rgba(255, 139, 189, 0.16)');
  gradient.addColorStop(1, 'rgba(9, 4, 12, 0)');
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

function updateWordGrid() {
  const revealStart = 6.4;
  if (sceneTime < revealStart) return;
  const revealIndex = Math.min(words.length, Math.floor((sceneTime - revealStart) / 1.0) + 1);
  if (wordGrid.childNodes.length === revealIndex) {
    return;
  }
  wordGrid.innerHTML = '';
  for (let i = 0; i < revealIndex; i += 1) {
    const element = document.createElement('span');
    element.className = 'word';
    element.textContent = words[i];
    element.style.animationDelay = `${i * 0.06}s`;
    wordGrid.appendChild(element);
  }
}

function animate(timestamp) {
  if (!lastFrameTime) lastFrameTime = timestamp;
  const dt = Math.min((timestamp - lastFrameTime) / 1000, 0.033);
  lastFrameTime = timestamp;
  animationTime += dt;
  sceneTime += dt;

  drawBackground();
  if (sceneTime < 1) drawBurst();
  drawGlow();
  drawRays(dt);
  drawStars(dt);
  drawHeartDots(dt);
  drawPetals(dt);
  drawFinalGlow();
  updateWordGrid();

  rafId = requestAnimationFrame(animate);
}

function startAnimation() {
  lastFrameTime = 0;
  sceneTime = 0;
  animationTime = 0;
  if (rafId) cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(animate);
}

function toggleMusic() {
  if (!music.src) {
    music.src = MUSIC_PATH;
    music.loop = true;
  }
  if (music.paused) {
    music.play().catch(() => {});
    musicButton.textContent = '♫ Музыка включена';
  } else {
    music.pause();
    musicButton.textContent = '♪ Музыка';
  }
}

function restart() {
  setOverlay(introOverlay, false);
  setOverlay(videoContainer, false);
  setOverlay(explosionOverlay, false);
  uiArea.classList.add('hidden');
  wordGrid.innerHTML = '';
  videoIframe.src = '';
  videoPlayer.pause();
  videoPlayer.src = '';
  if (rafId) cancelAnimationFrame(rafId);
  showIntro();
}

window.addEventListener('resize', resize);
window.addEventListener('load', () => {
  resize();
  showIntro();
});

introOverlay.addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();
  if (phase === 'intro') {
    console.log('Starting video from intro click');
    startVideo();
  }
});

introOverlay.addEventListener('touchend', (e) => {
  e.preventDefault();
  e.stopPropagation();
  if (phase === 'intro') {
    console.log('Starting video from intro touch');
    startVideo();
  }
});

musicButton.addEventListener('click', toggleMusic);
restartButton.addEventListener('click', restart);
