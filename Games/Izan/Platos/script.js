const lienzo = document.getElementById('gameCanvas');
const contexto = lienzo.getContext('2d');
const victoriaDiv = document.getElementById('victory');
const spongeHint = document.querySelector('.sponge-hint');
const gameShell = document.querySelector('.game-shell');

let platosLimpios = 0;
const MAX_PLATOS = 4;
let platoActual = null;

const imagenPlato = new Image();
imagenPlato.src = 'platillo.png';

const RADIO_PLATO = 80;
const CANTIDAD_SUCIEDAD = 40;

/* Iniciar automáticamente */
window.addEventListener('DOMContentLoaded', iniciarJuego);

function iniciarJuego() {
    platosLimpios = 0;
    victoriaDiv.style.display = 'none';
    if (spongeHint) spongeHint.style.display = 'block'; // esponja inicial visible
    siguientePlato();
}

/* Generar plato */
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

/* Dibujar plato y suciedad */
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

/* Limpiar automáticamente al pasar el ratón + seguir esponja */
lienzo.addEventListener('mousemove', (e) => {
    const rect = lienzo.getBoundingClientRect();
    const scaleX = lienzo.width / rect.width;
    const scaleY = lienzo.height / rect.height;
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top) * scaleY;

    /* Esponja: mismas coordenadas que el cursor, relativas al .game-shell (no al body) */
    if (spongeHint && gameShell) {
        const shell = gameShell.getBoundingClientRect();
        spongeHint.style.left = `${e.clientX - shell.left}px`;
        spongeHint.style.top = `${e.clientY - shell.top}px`;
    }

    if (!platoActual) return;

    let cambio = false;
    platoActual.suciedad.forEach(s => {
        const dx = mx - (platoActual.x + s.x);
        const dy = my - (platoActual.y + s.y);
        if (!s.limpio && Math.sqrt(dx*dx + dy*dy) < s.radio + 20) {
            s.limpio = true;
            cambio = true;
        }
    });

    if (cambio) dibujarPlato();

    if (platoActual.suciedad.every(s => s.limpio)) {
        platosLimpios++;
        platoActual = null;

        if (platosLimpios >= MAX_PLATOS) {
            setTimeout(() => { 
                victoriaDiv.style.display = 'block'; 
                if (spongeHint) spongeHint.style.display = 'none';
            }, 100);
        } else {
            setTimeout(() => {
                siguientePlato();
                if (spongeHint) spongeHint.style.display = 'block';
            }, 300);
        }
    }
});