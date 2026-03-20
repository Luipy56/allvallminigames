const emojis = document.querySelectorAll('.emoji');
const palabras = document.querySelectorAll('.palabra');
const mensaje = document.getElementById('mensaje');
const modalVictoria = document.getElementById('modal-victoria');

let aciertos = 0;
const total = emojis.length;
let timeoutReinicio = null;

var audioAplausos = new Audio('../../../Ruben/mapapirata/sounds/claps.mp3');
audioAplausos.volume = 0.3;

function reiniciarNivel() {
    emojis.forEach(el => el.classList.remove('oculto'));
    palabras.forEach(el => el.classList.remove('oculto'));
    aciertos = 0;
    mensaje.textContent = '';
    modalVictoria.classList.remove('visible');
    modalVictoria.setAttribute('aria-hidden', 'true');
    if (timeoutReinicio) {
        clearTimeout(timeoutReinicio);
        timeoutReinicio = null;
    }
}

function mostrarModalVictoria() {
    modalVictoria.classList.add('visible');
    modalVictoria.setAttribute('aria-hidden', 'false');
    audioAplausos.currentTime = 0;
    audioAplausos.play().catch(function() {});
    timeoutReinicio = setTimeout(reiniciarNivel, 5000);
}

// Hacer que los emojis sean arrastrables
emojis.forEach(emoji => {
    emoji.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', emoji.dataset.palabra);
        e.dataTransfer.effectAllowed = 'move';
    });
});

// Prevenir el comportamiento por defecto en las palabras
palabras.forEach(palabra => {
    palabra.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        palabra.classList.add('resaltado');
    });

    palabra.addEventListener('dragleave', () => {
        palabra.classList.remove('resaltado');
    });

    palabra.addEventListener('drop', (e) => {
        e.preventDefault();
        palabra.classList.remove('resaltado');

        const palabraArrastrada = e.dataTransfer.getData('text/plain');
        const palabraZona = palabra.dataset.palabra;

        if (palabraArrastrada === palabraZona) {
            // Buscar el emoji correspondiente que aún no esté oculto
            const emojiCorrecto = Array.from(emojis).find(
                e => e.dataset.palabra === palabraArrastrada && !e.classList.contains('oculto')
            );

            if (emojiCorrecto) {
                emojiCorrecto.classList.add('oculto');
                palabra.classList.add('oculto');
                aciertos++;
                mensaje.textContent = '¡Bien! Sigue así.';

                if (aciertos === total) {
                    mensaje.textContent = '';
                    mostrarModalVictoria();
                }
            }
        } else {
            mensaje.textContent = '❌ No corresponde. Intenta de nuevo.';
        }
    });
});