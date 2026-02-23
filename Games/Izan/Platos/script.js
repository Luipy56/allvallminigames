const lienzo = document.getElementById('gameCanvas');
const contexto = lienzo.getContext('2d');
const botonIniciar = document.getElementById('startBtn');
const textoPuntaje = document.getElementById('score');
const victoriaDiv = document.getElementById('victory');

let platosLimpios = 0;
const MAX_PLATOS = 4;
let platoActual = null;
let estaLimpiando = false;


const imagenPlato = new Image();
imagenPlato.src = 'plato.png'; 

const volverBtn = document.getElementById("volverMenu");

volverBtn.addEventListener("click", function() {
    window.location.href = "menu.html";
});

botonIniciar.addEventListener('click', iniciarJuego);
lienzo.addEventListener('mousedown', () => estaLimpiando = true);
lienzo.addEventListener('mouseup', () => estaLimpiando = false);
lienzo.addEventListener('mouseleave', () => estaLimpiando = false);
lienzo.addEventListener('mousemove', limpiar);

const RADIO_PLATO = 80;
const CANTIDAD_SUCIEDAD = 40;

function iniciarJuego() {
    platosLimpios = 0;
    textoPuntaje.textContent = platosLimpios;
    botonIniciar.disabled = true;
    victoriaDiv.style.display = 'none';
    siguientePlato();
}

function siguientePlato() {
    const margen = RADIO_PLATO + 10;
    const x = margen + Math.random() * (lienzo.width - 2 * margen);
    const y = margen + Math.random() * (lienzo.height - 2 * margen);

    platoActual = {
        x: x,
        y: y,
        radio: RADIO_PLATO,
        suciedad: []
    };

    for (let i = 0; i < CANTIDAD_SUCIEDAD; i++) {
        platoActual.suciedad.push({
            x: Math.random() * RADIO_PLATO * 2 - RADIO_PLATO,
            y: Math.random() * RADIO_PLATO * 2 - RADIO_PLATO,
            radio: 5 + Math.random() * 7,
            limpio: false
        });
    }

    dibujarPlato();
}

function dibujarPlato() {
    contexto.clearRect(0, 0, lienzo.width, lienzo.height);
    if (!platoActual) return;

    contexto.drawImage(imagenPlato, platoActual.x - RADIO_PLATO, platoActual.y - RADIO_PLATO, RADIO_PLATO * 2, RADIO_PLATO * 2);

    platoActual.suciedad.forEach(s => {
        if (!s.limpio) {
            contexto.fillStyle = '#8B4513';
            contexto.beginPath();
            contexto.arc(platoActual.x + s.x, platoActual.y + s.y, s.radio, 0, Math.PI * 2);
            contexto.fill();
        }
    });
}

function limpiar(e) {
    if (!estaLimpiando || !platoActual) return;

    const rect = lienzo.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    platoActual.suciedad.forEach(s => {
        const dx = mx - (platoActual.x + s.x);
        const dy = my - (platoActual.y + s.y);
        if (!s.limpio && Math.sqrt(dx*dx + dy*dy) < s.radio + 10) {
            s.limpio = true;
        }
    });

    dibujarPlato();

    if (platoActual.suciedad.every(s => s.limpio)) {
        platosLimpios++;
        textoPuntaje.textContent = platosLimpios;
        platoActual = null;

        if (platosLimpios >= MAX_PLATOS) {
            setTimeout(() => {
                victoriaDiv.style.display = 'block';
                botonIniciar.disabled = false;
            }, 100);
        } else {
            setTimeout(siguientePlato, 300);
        }
    }
}