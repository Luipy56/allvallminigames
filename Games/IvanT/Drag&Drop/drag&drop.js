const emojis = document.querySelectorAll('.emoji');
const palabras = document.querySelectorAll('.palabra');
const mensaje = document.getElementById('mensaje');

let aciertos = 0;
const total = emojis.length;

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
                aciertos++;
                mensaje.textContent = '¡Bien! Sigue así.';

                if (aciertos === total) {
                    mensaje.textContent = '🎉 ¡Completaste todos! 🎉';
                }
            }
        } else {
            mensaje.textContent = '❌ No corresponde. Intenta de nuevo.';
        }
    });
});