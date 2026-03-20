const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const W = 800, H = 500;
const FONDO_COLOR = '#b5926a';  // for pixel-based hit detection
const FONDO_RGB = { r: 181, g: 146, b: 106 };

let dibujando = false;
let nivel = 1;
let modalTimeout = null;

const fondoCanvas = document.createElement('canvas');
fondoCanvas.width = W;
fondoCanvas.height = H;
const fondoCtx = fondoCanvas.getContext('2d');

const arenaCanvas = document.createElement('canvas');
arenaCanvas.width = W;
arenaCanvas.height = H;
const arenaCtx = arenaCanvas.getContext('2d');

let objeto = { x: 0, y: 0, tipo: null };

const modalOverlay = document.getElementById('modalOverlay');
const modalTitle = document.getElementById('modalTitle');
const modalText = document.getElementById('modalText');
const modalBtn = document.getElementById('modalBtn');
const instruction = document.getElementById('instruction');
const instructionText = document.getElementById('instructionText');
const instructionIcon = document.getElementById('instructionIcon');

const tipos = [
  {
    nombre: 'la pelota',
    emoji: '🟡',
    draw: function (ctx, x, y) {
      const r = 30;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = '#f7d44a';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x - 6, y - 6, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#fff9e0';
      ctx.fill();
    }
  },
  {
    nombre: 'la estrella',
    emoji: '⭐',
    draw: function (ctx, x, y) {
      const outer = 35, inner = 14;
      const points = 5;
      ctx.beginPath();
      for (let i = 0; i < points * 2; i++) {
        const r = i % 2 === 0 ? outer : inner;
        const a = (Math.PI * 2 * i) / (points * 2) - Math.PI / 2;
        const px = x + r * Math.cos(a);
        const py = y + r * Math.sin(a);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fillStyle = '#e8b923';
      ctx.fill();
    }
  },
  {
    nombre: 'el corazón',
    emoji: '❤️',
    draw: function (ctx, x, y) {
      const s = 22;
      ctx.fillStyle = '#d44';
      ctx.beginPath();
      ctx.moveTo(x, y + s * 0.3);
      ctx.bezierCurveTo(x, y - s * 0.5, x - s * 1.2, y - s * 0.5, x - s * 1.2, y + s * 0.3);
      ctx.bezierCurveTo(x - s * 1.2, y + s * 1.2, x, y + s * 1.5, x, y + s * 1.5);
      ctx.bezierCurveTo(x, y + s * 1.5, x + s * 1.2, y + s * 1.2, x + s * 1.2, y + s * 0.3);
      ctx.bezierCurveTo(x + s * 1.2, y - s * 0.5, x, y - s * 0.5, x, y + s * 0.3);
      ctx.fill();
    }
  },
  {
    nombre: 'el diamante',
    emoji: '💎',
    draw: function (ctx, x, y) {
      const size = 32;
      ctx.beginPath();
      ctx.moveTo(x, y - size);
      ctx.lineTo(x + size, y);
      ctx.lineTo(x, y + size);
      ctx.lineTo(x - size, y);
      ctx.closePath();
      ctx.fillStyle = '#7eb8da';
      ctx.fill();
      ctx.strokeStyle = '#5a9bc4';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  },
  {
    nombre: 'la luna',
    emoji: '🌙',
    draw: function (ctx, x, y) {
      const r = 28;
      ctx.fillStyle = '#e8e4d8';
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x + r * 0.5, y - r * 0.2, r * 0.75, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = FONDO_COLOR;
      ctx.beginPath();
      ctx.arc(x + r * 0.5, y - r * 0.2, r * 0.75 + 1, 0, Math.PI * 2);
      ctx.fill();
    }
  },
  {
    nombre: 'la flor',
    emoji: '🌸',
    draw: function (ctx, x, y) {
      const r = 28;
      ctx.fillStyle = '#f0a0c0';
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI * 2 * i) / 6 - Math.PI / 2;
        const px = x + r * 0.9 * Math.cos(a);
        const py = y + r * 0.9 * Math.sin(a);
        ctx.beginPath();
        ctx.arc(px, py, r * 0.45, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#f7d44a';
      ctx.beginPath();
      ctx.arc(x, y, r * 0.35, 0, Math.PI * 2);
      ctx.fill();
    }
  },
  {
    nombre: 'el sol',
    emoji: '☀️',
    draw: function (ctx, x, y) {
      const r = 26;
      const rays = 12;
      ctx.fillStyle = '#f0c030';
      for (let i = 0; i < rays; i++) {
        const a = (Math.PI * 2 * i) / rays;
        ctx.beginPath();
        ctx.moveTo(x + (r + 12) * Math.cos(a), y + (r + 12) * Math.sin(a));
        ctx.lineTo(x + (r + 6) * Math.cos(a + 0.15), y + (r + 6) * Math.sin(a + 0.15));
        ctx.lineTo(x + r * Math.cos(a), y + r * Math.sin(a));
        ctx.lineTo(x + (r + 6) * Math.cos(a - 0.15), y + (r + 6) * Math.sin(a - 0.15));
        ctx.closePath();
        ctx.fill();
      }
      ctx.fillStyle = '#f7e050';
      ctx.beginPath();
      ctx.arc(x, y, r - 4, 0, Math.PI * 2);
      ctx.fill();
    }
  },
  {
    nombre: 'el cuadrado',
    emoji: '⬜',
    draw: function (ctx, x, y) {
      const size = 32;
      const rad = 8;
      const l = x - size;
      const t = y - size;
      const r = x + size;
      const b = y + size;
      ctx.fillStyle = '#8b7355';
      ctx.beginPath();
      ctx.moveTo(l + rad, t);
      ctx.lineTo(r - rad, t);
      ctx.arcTo(r, t, r, t + rad, rad);
      ctx.lineTo(r, b - rad);
      ctx.arcTo(r, b, r - rad, b, rad);
      ctx.lineTo(l + rad, b);
      ctx.arcTo(l, b, l, b - rad, rad);
      ctx.lineTo(l, t + rad);
      ctx.arcTo(l, t, l + rad, t, rad);
      ctx.fill();
      ctx.strokeStyle = '#6b5344';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  },
  {
    nombre: 'la campana',
    emoji: '🔔',
    draw: function (ctx, x, y) {
      const w = 24;
      const h = 32;
      ctx.fillStyle = '#c9a227';
      ctx.beginPath();
      ctx.moveTo(x, y - h);
      ctx.quadraticCurveTo(x + w * 1.2, y - h, x + w, y);
      ctx.quadraticCurveTo(x + w * 0.5, y + h * 0.4, x, y + h * 0.6);
      ctx.quadraticCurveTo(x - w * 0.5, y + h * 0.4, x - w, y);
      ctx.quadraticCurveTo(x - w * 1.2, y - h, x, y - h);
      ctx.fill();
      ctx.strokeStyle = '#a88220';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }
];

function crearTexturaArena(ctx, ancho, alto) {
  ctx.fillStyle = '#c4a484';
  ctx.fillRect(0, 0, ancho, alto);

  const imageData = ctx.getImageData(0, 0, ancho, alto);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    if (Math.random() < 0.15) {
      data[i] = 80;
      data[i + 1] = 60;
      data[i + 2] = 40;
    } else {
      data[i] += Math.random() * 20 - 10;
      data[i + 1] += Math.random() * 20 - 10;
      data[i + 2] += Math.random() * 20 - 10;
    }
  }
  ctx.putImageData(imageData, 0, 0);
}

function iniciar(level) {
  if (level != null) nivel = level;
  const tipo = tipos[(nivel - 1) % tipos.length];
  objeto.tipo = tipo;
  objeto.x = 200 + Math.random() * 400;
  objeto.y = 150 + Math.random() * 200;

  fondoCtx.fillStyle = FONDO_COLOR;
  fondoCtx.fillRect(0, 0, W, H);
  tipo.draw(fondoCtx, objeto.x, objeto.y);

  crearTexturaArena(arenaCtx, W, H);
  dibujar();

  if (instructionText) instructionText.textContent = 'Encuentra ' + tipo.nombre;
  if (instructionIcon) {
    const iconCtx = instructionIcon.getContext('2d');
    const cx = instructionIcon.width / 2;
    const cy = instructionIcon.height / 2;
    iconCtx.clearRect(0, 0, instructionIcon.width, instructionIcon.height);
    iconCtx.save();
    iconCtx.translate(cx, cy);
    iconCtx.scale(0.4, 0.4);
    tipo.draw(iconCtx, 0, 0);
    iconCtx.restore();
  }
}

function dibujar() {
  ctx.clearRect(0, 0, W, H);
  ctx.drawImage(fondoCanvas, 0, 0);
  ctx.drawImage(arenaCanvas, 0, 0);
}

function limpiar(x, y) {
  const imageData = arenaCtx.getImageData(0, 0, W, H);
  const data = imageData.data;
  const radio = 40;
  const cx = Math.floor(x);
  const cy = Math.floor(y);

  for (let dy = -radio; dy <= radio; dy++) {
    for (let dx = -radio; dx <= radio; dx++) {
      if (dx * dx + dy * dy <= radio * radio) {
        const px = cx + dx;
        const py = cy + dy;
        if (px >= 0 && px < W && py >= 0 && py < H) {
          const idx = (py * W + px) * 4 + 3;
          data[idx] = 0;
        }
      }
    }
  }

  arenaCtx.putImageData(imageData, 0, 0);
  dibujar();
}

function isFondoPixelObject(px, py) {
  if (px < 0 || px >= W || py < 0 || py >= H) return false;
  const img = fondoCtx.getImageData(Math.floor(px), Math.floor(py), 1, 1);
  const r = img.data[0], g = img.data[1], b = img.data[2];
  const tol = 25;
  return Math.abs(r - FONDO_RGB.r) > tol || Math.abs(g - FONDO_RGB.g) > tol || Math.abs(b - FONDO_RGB.b) > tol;
}

function isArenaCleared(px, py) {
  if (px < 0 || px >= W || py < 0 || py >= H) return false;
  const img = arenaCtx.getImageData(Math.floor(px), Math.floor(py), 1, 1);
  return img.data[3] === 0;
}

function comprobarObjeto(x, y) {
  if (!objeto.tipo) return;
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  if (!isArenaCleared(ix, iy)) return;
  const radio = 3;
  for (let dy = -radio; dy <= radio; dy++) {
    for (let dx = -radio; dx <= radio; dx++) {
      if (isFondoPixelObject(ix + dx, iy + dy) && isArenaCleared(ix + dx, iy + dy)) {
        mostrarVictoria();
        return;
      }
    }
  }
}

function mostrarVictoria() {
  const nombre = objeto.tipo.nombre;
  modalTitle.textContent = '¡Encontrado!';
  modalText.textContent = '¡Has encontrado ' + nombre + '!';
  modalOverlay.hidden = false;
  if (modalTimeout) clearTimeout(modalTimeout);
  modalTimeout = setTimeout(irSiguienteNivel, 2000);
}

function irSiguienteNivel() {
  if (modalTimeout) clearTimeout(modalTimeout);
  modalTimeout = null;
  modalOverlay.hidden = true;
  nivel++;
  iniciar(nivel);
}

if (modalBtn) modalBtn.addEventListener('click', irSiguienteNivel);

canvas.addEventListener('mousedown', (e) => {
  dibujando = true;
  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left) * (W / rect.width);
  const y = (e.clientY - rect.top) * (H / rect.height);
  limpiar(x, y);
});

canvas.addEventListener('mousemove', (e) => {
  if (!dibujando) return;
  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left) * (W / rect.width);
  const y = (e.clientY - rect.top) * (H / rect.height);
  limpiar(x, y);
});

canvas.addEventListener('mouseup', (e) => {
  dibujando = false;
  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left) * (W / rect.width);
  const y = (e.clientY - rect.top) * (H / rect.height);
  comprobarObjeto(x, y);
});

canvas.addEventListener('mouseleave', () => dibujando = false);

canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  dibujando = true;
  const rect = canvas.getBoundingClientRect();
  const touch = e.touches[0];
  const x = (touch.clientX - rect.left) * (W / rect.width);
  const y = (touch.clientY - rect.top) * (H / rect.height);
  limpiar(x, y);
});

canvas.addEventListener('touchmove', (e) => {
  e.preventDefault();
  if (!dibujando) return;
  const rect = canvas.getBoundingClientRect();
  const touch = e.touches[0];
  const x = (touch.clientX - rect.left) * (W / rect.width);
  const y = (touch.clientY - rect.top) * (H / rect.height);
  limpiar(x, y);
});

canvas.addEventListener('touchend', (e) => {
  e.preventDefault();
  dibujando = false;
  if (e.changedTouches.length > 0) {
    const rect = canvas.getBoundingClientRect();
    const touch = e.changedTouches[0];
    const x = (touch.clientX - rect.left) * (W / rect.width);
    const y = (touch.clientY - rect.top) * (H / rect.height);
    comprobarObjeto(x, y);
  }
});

iniciar(1);
