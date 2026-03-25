const canvas = document.getElementById('meuCanvas');
const ctx = canvas.getContext('2d');

const spanPunts = document.querySelector('#puntuacio span');
const restart= document.getElementById('restart');

let punts = 0;
const animals = ["🐶", "🐱", "🦁", "🐯", "🐷", "🐸", "🐵", "🦄"];
let animalActual = "🦁";

// posicio inicial
let x = canvas.width / 2;
let y = canvas.height / 2;

restart.addEventListener('mousedown', reiniciarJoc);

canvas.addEventListener('mousedown', (e) => {
    
    const rect = canvas.getBoundingClientRect();
    const clicX = e.clientX - rect.left;
    const clicY = e.clientY - rect.top;

    // detectar si el clic es a prop de l'animal
    const distancia = Math.sqrt((clicX - x)**2 + (clicY - y)**2);

    if (distancia < 50) {
        punts++;
        spanPunts.innerText = punts;

        animalActual = animals[Math.floor(Math.random() * animals.length)];

        // nova posicio
        x = Math.random() * (canvas.width - 100) + 50;
        y = Math.random() * (canvas.height - 100) + 50;
        
        dibuixar();
    }
    comprovaVictoria();
    
});

function dibuixar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // dibuixar animal
    ctx.font = "70px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(animalActual, x, y);
}

function comprovaVictoria() {
    if (punts>29) {
        const popup = document.getElementById('popup-victoria');
        popup.classList.add('mostrar');
    }
}
function reiniciarJoc() {
    location.reload(); 
}

dibuixar();