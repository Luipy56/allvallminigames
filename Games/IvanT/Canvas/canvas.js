const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const W = 800, H = 500;
let dibujando = false;

const fondoCanvas = document.createElement('canvas');
fondoCanvas.width = W;
fondoCanvas.height = H;
const fondoCtx = fondoCanvas.getContext('2d');

const arenaCanvas = document.createElement('canvas');
arenaCanvas.width = W;
arenaCanvas.height = H;
const arenaCtx = arenaCanvas.getContext('2d');

let objeto = { x: 0, y: 0, r: 30 };

function crearTexturaArena(ctx, ancho, alto) {
    ctx.fillStyle = '#c4a484';
    ctx.fillRect(0, 0, ancho, alto);

    const imageData = ctx.getImageData(0, 0, ancho, alto);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        if (Math.random() < 0.15) {
            data[i] = 80;     // R
            data[i+1] = 60;    // G
            data[i+2] = 40;    // B
        } else {
            data[i] += Math.random() * 20 - 10;
            data[i+1] += Math.random() * 20 - 10;
            data[i+2] += Math.random() * 20 - 10;
        }
    }
    ctx.putImageData(imageData, 0, 0);
}

function iniciar() {
    fondoCtx.fillStyle = '#b5926a'; 
    fondoCtx.fillRect(0, 0, W, H);

    objeto.x = 200 + Math.random() * 400;
    objeto.y = 150 + Math.random() * 200;
    objeto.r = 30;

    fondoCtx.beginPath();
    fondoCtx.arc(objeto.x, objeto.y, objeto.r, 0, Math.PI * 2);
    fondoCtx.fillStyle = '#f7d44a';
    fondoCtx.fill();
    // Un pequeño brillo
    fondoCtx.beginPath();
    fondoCtx.arc(objeto.x - 6, objeto.y - 6, 8, 0, Math.PI * 2);
    fondoCtx.fillStyle = '#fff9e0';
    fondoCtx.fill();

    crearTexturaArena(arenaCtx, W, H);
    dibujar();
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

function comprobarObjeto(x, y) {
    const dx = x - objeto.x;
    const dy = y - objeto.y;
    const dist = Math.sqrt(dx*dx + dy*dy);
    if (dist <= objeto.r) {
        const imgData = arenaCtx.getImageData(Math.floor(x), Math.floor(y), 1, 1);
        if (imgData.data[3] === 0) {
            alert('¡¡Has encontrado la pelota!!');
        }
    }
}

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

iniciar();