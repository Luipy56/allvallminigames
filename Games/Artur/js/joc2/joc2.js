const canvas = document.getElementById('meuCanvas');
const ctx = canvas.getContext('2d');

const spanPunts = document.querySelector('#puntuacio span');
const restart = document.getElementById('restart');

let punts = 0;
const animals = ["🐶", "🐱", "🦁", "🐯", "🐷", "🐸", "🐵", "🦄"];
let animalActual = "🦁";

let x = canvas.width / 2;
let y = canvas.height / 2;

restart.addEventListener('click', reiniciarJoc);

function canvasClientToLogical(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
    };
}

function intentarEncert(clientX, clientY) {
    const { x: clicX, y: clicY } = canvasClientToLogical(clientX, clientY);
    const distancia = Math.sqrt((clicX - x) ** 2 + (clicY - y) ** 2);

    if (distancia < 50) {
        punts++;
        spanPunts.innerText = punts;

        animalActual = animals[Math.floor(Math.random() * animals.length)];

        x = Math.random() * (canvas.width - 100) + 50;
        y = Math.random() * (canvas.height - 100) + 50;

        dibuixar();
    }
    comprovaVictoria();
}

canvas.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    try {
        canvas.setPointerCapture(e.pointerId);
    } catch (_) {}
    intentarEncert(e.clientX, e.clientY);
});

canvas.addEventListener('pointerup', (e) => {
    if (canvas.hasPointerCapture(e.pointerId)) {
        canvas.releasePointerCapture(e.pointerId);
    }
});

canvas.addEventListener('pointercancel', (e) => {
    if (canvas.hasPointerCapture(e.pointerId)) {
        canvas.releasePointerCapture(e.pointerId);
    }
});

function dibuixar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.font = "70px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(animalActual, x, y);
}

function comprovaVictoria() {
    if (punts > 29) {
        const popup = document.getElementById('popup-victoria');
        popup.classList.add('mostrar');
    }
}

function reiniciarJoc() {
    location.reload();
}

dibuixar();
