const figuras = [
  {
    name:'Estrella', accent:'#f7c948', fill:'#fef3c7', stroke:'#d4a017', close:true,
    pts: (() => Array.from({length:10}, (_,i) => {
      const cx = 190, cy = 200, ro = 155, ri = 64;
      const angulo = (i*36 - 90) * Math.PI/180;
      const radio = i % 2 ? ri : ro;
      return { x: Math.round(cx + radio * Math.cos(angulo)), y: Math.round(cy + radio * Math.sin(angulo)) };
    }))()
  },
  {
    name:'Casa', accent:'#f87171', fill:'#fee2e2', stroke:'#b91c1c', close:true,
    pts:[
      {x:190,y:28},  {x:348,y:155}, {x:318,y:155},
      {x:318,y:350}, {x:232,y:350}, {x:232,y:252},
      {x:148,y:252}, {x:148,y:350}, {x:62,y:350},
      {x:62,y:155},  {x:32,y:155}
    ]
  },
  {
    name:'Corazón', accent:'#f43f5e', fill:'#ffe4e6', stroke:'#9f1239', close:true,
    pts:[
      {x:190,y:105},{x:234,y:68},{x:284,y:60},{x:326,y:100},
      {x:326,y:162},{x:258,y:230},{x:190,y:340},
      {x:122,y:230},{x:54,y:162},{x:54,y:100},{x:96,y:60},{x:146,y:68}
    ]
  },
  {
    name:'Pez', accent:'#38bdf8', fill:'#e0f2fe', stroke:'#0369a1', close:true,
    pts:[
      {x:318,y:168},{x:255,y:115},{x:175,y:98},{x:100,y:118},
      {x:48,y:188},{x:100,y:258},{x:175,y:278},
      {x:255,y:260},{x:318,y:208},{x:365,y:188}
    ]
  }
];

let figura=0, siguiente=1, lineas=[], arrastrando=false, mx=0, my=0, listo=false;
let todoListo = false;
let autoAdvanceTimer = null;
const AUTO_ADVANCE_MS = 4000;

const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
const PUNTO = 17;
const BASE = 380;

const getEscala = () => canvas.width / BASE;

const getPuntos = (f, escala) => f.pts.map(p => ({ x: Math.round(p.x * escala), y: Math.round(p.y * escala) }));

function clearAutoAdvance() {
  if (autoAdvanceTimer !== null) {
    clearTimeout(autoAdvanceTimer);
    autoAdvanceTimer = null;
  }
}

function aplicarSiguienteTrasVictoria() {
  const indice = figura + 1;
  const siguienteFigura = indice < figuras.length ? figuras[indice] : null;
  if (siguienteFigura) {
    figura = indice; lineas = []; siguiente = 1; listo = false;
    canvas.style.pointerEvents = 'auto';
  } else {
    todoListo = true;
    canvas.style.pointerEvents = 'none';
  }
  clearAutoAdvance();
  buildPicker();
  redraw();
}

function programarAutoAvance() {
  clearAutoAdvance();
  if (!listo || todoListo) return;
  autoAdvanceTimer = setTimeout(() => {
    autoAdvanceTimer = null;
    aplicarSiguienteTrasVictoria();
  }, AUTO_ADVANCE_MS);
}

const buildPicker = () => {
  const el = document.getElementById('picker');
  el.innerHTML = '';

  if (listo && !todoListo) {
    const indice = figura + 1;
    const siguienteFigura = indice < figuras.length ? figuras[indice] : null;
    const boton = document.createElement('button');
    boton.className = 'pill-next';
    boton.style.setProperty('--accent', siguienteFigura ? siguienteFigura.accent : '#aaa');
    boton.textContent = siguienteFigura ? `Siguiente: ${siguienteFigura.name}` : 'Volver a juegos';
    boton.onclick = () => aplicarSiguienteTrasVictoria();
    el.appendChild(boton);
    programarAutoAvance();
  }
};

const redraw = () => {
  const f = figuras[figura];
  const escala = getEscala();
  const puntos = getPuntos(f, escala);
  ctx.clearRect(0,0,canvas.width,canvas.height);

  ctx.fillStyle = '#ebebeb';
  const inicioX = Math.round(20 * escala), pasoX = Math.max(8, Math.round(22 * escala));
  const inicioY = Math.round(20 * escala);
  for(let x = inicioX; x < canvas.width; x += pasoX) for(let y = inicioY; y < canvas.height; y += pasoX){
    ctx.beginPath(); ctx.arc(x,y,Math.max(1.5, 1.5*escala),0,Math.PI*2); ctx.fill();
  }

  if (listo) {
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${Math.round(36 * getEscala())}px 'Fredoka One', cursive`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`¡${figuras[figura].name} completada!`, canvas.width / 2, canvas.height / 2);
  }

  ctx.strokeStyle = f.stroke;
  ctx.lineWidth = Math.max(1, 4 * escala);
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.setLineDash([]);
  lineas.forEach(l => {
    ctx.beginPath(); ctx.moveTo(l.x1,l.y1); ctx.lineTo(l.x2,l.y2); ctx.stroke();
  });
  if (listo && f.close) {
    const ultimo = puntos[puntos.length-1];
    const primero = puntos[0];
    ctx.beginPath(); ctx.moveTo(ultimo.x,ultimo.y); ctx.lineTo(primero.x,primero.y); ctx.stroke();
  }

  if (arrastrando && !listo) {
    const desde = puntos[siguiente-1];
    ctx.setLineDash([7*escala,5*escala]);
    ctx.strokeStyle='#ccc'; ctx.lineWidth=Math.max(1, 3*escala);
    ctx.beginPath(); ctx.moveTo(desde.x,desde.y); ctx.lineTo(mx,my); ctx.stroke();
    ctx.setLineDash([]);
  }

  const tam = PUNTO * escala;
  puntos.forEach((p,i) => {
    const conectado = i < siguiente;
    const esTarget = i === siguiente;

    ctx.shadowColor = 'rgba(0,0,0,0.10)';
    ctx.shadowBlur = 6; ctx.shadowOffsetY = 2;

    ctx.beginPath(); ctx.arc(p.x,p.y,tam,0,Math.PI*2);
    ctx.fillStyle = conectado ? f.accent : '#fff';
    ctx.fill();

    ctx.shadowBlur=0; ctx.shadowOffsetY=0; ctx.shadowColor='transparent';

    ctx.strokeStyle = conectado ? f.stroke : esTarget ? f.accent : '#d0ccc6';
    ctx.lineWidth = esTarget ? Math.max(1, 3*escala) : Math.max(1, 2*escala);
    ctx.stroke();

    ctx.fillStyle = conectado ? '#fff' : esTarget ? f.accent : '#c0bbb5';
    ctx.font = `bold ${Math.max(10, Math.round(12*escala))}px Nunito, sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(i+1, p.x, p.y+1);
  });
};

const toC = (e) => {
  const rect = canvas.getBoundingClientRect();
  const ex = canvas.width / rect.width;
  const ey = canvas.height / rect.height;
  const toque = e.touches ? e.touches[0] : e;
  return { x: (toque.clientX - rect.left) * ex, y: (toque.clientY - rect.top) * ey };
};

const cerca = (px, py, idx) => {
  const escala = getEscala();
  const puntos = getPuntos(figuras[figura], escala);
  const p = puntos[idx];
  return Math.hypot(px-p.x, py-p.y) <= (PUNTO * escala + 12 * escala);
};

canvas.addEventListener('mousedown', e => {
  if (!listo && !todoListo) {
    const { x, y } = toC(e);
    if (cerca(x, y, siguiente - 1)) { arrastrando = true; mx = x; my = y; }
  }
});

canvas.addEventListener('mousemove', e => {
  if (arrastrando) {
    const { x, y } = toC(e); mx = x; my = y; redraw();
  }
});

canvas.addEventListener('mouseup', e => {
  if (arrastrando) {
    arrastrando = false;
    const f = figuras[figura];
    const escala = getEscala();
    if (siguiente < f.pts.length && cerca(mx, my, siguiente)) {
      const pts = getPuntos(f, escala);
      lineas.push({ x1: pts[siguiente-1].x, y1: pts[siguiente-1].y, x2: pts[siguiente].x, y2: pts[siguiente].y });
      siguiente++;
      listo = siguiente >= f.pts.length;
    }
    redraw(); buildPicker();
  }
});

canvas.addEventListener('touchstart', e => {
  e.preventDefault();
  if (!listo && !todoListo) {
    const { x, y } = toC(e);
    if (cerca(x, y, siguiente - 1)) { arrastrando = true; mx = x; my = y; }
  }
}, { passive: false });

canvas.addEventListener('touchmove', e => {
  e.preventDefault();
  if (arrastrando) {
    const { x, y } = toC(e); mx = x; my = y; redraw();
  }
}, { passive: false });

canvas.addEventListener('touchend', e => {
  e.preventDefault();
  if (arrastrando) {
    arrastrando = false;
    const f = figuras[figura];
    const escala = getEscala();
    if (siguiente < f.pts.length && cerca(mx, my, siguiente)) {
      const pts = getPuntos(f, escala);
      lineas.push({ x1: pts[siguiente-1].x, y1: pts[siguiente-1].y, x2: pts[siguiente].x, y2: pts[siguiente].y });
      siguiente++;
      listo = siguiente >= f.pts.length;
    }
    redraw(); buildPicker();
  }
}, { passive: false });

buildPicker();
redraw();