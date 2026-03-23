document.addEventListener("DOMContentLoaded", () => {
    // Se establecen las dimensiones del canvas
    function resizeCanvas() {
        // Se obtiene los nuevos tamaÃ±os
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    // Se limpian las lineas de todo el canvas
    function clearLines() {
        canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Funcion que dibuja las lineas
    function drawLine(x, y) {
        canvasContext.lineWidth = 20;
        canvasContext.lineCap = "butt";
        canvasContext.strokeStyle = "#3aa85b";
        const headLength = 65;
        const dx = x - origin.x;
        const dy = y - origin.y;
        const angle = Math.atan2(dy, dx);

        // El cuerpo termina justo en la base de la punta
        const headBaseDistance = headLength * Math.cos(Math.PI / 6);
        const shaftEndX = x - headBaseDistance * Math.cos(angle);
        const shaftEndY = y - headBaseDistance * Math.sin(angle);

        canvasContext.beginPath();
        canvasContext.moveTo(origin.x, origin.y);
        canvasContext.lineTo(shaftEndX, shaftEndY);
        canvasContext.stroke();

        // Flecha
        canvasContext.beginPath();
        canvasContext.moveTo(x, y);
        canvasContext.lineTo(x - headLength * Math.cos(angle - Math.PI / 6), y - headLength * Math.sin(angle - Math.PI / 6));
        canvasContext.lineTo(x - headLength * Math.cos(angle + Math.PI / 6), y - headLength * Math.sin(angle + Math.PI / 6));
        canvasContext.closePath();
        canvasContext.fillStyle = "#3aa85b";
        canvasContext.fill();
    }

    function getCenterElement(element) {
        let elementRect = element.getBoundingClientRect();
        return {x: (elementRect.left + elementRect.width / 2), y: (elementRect.top + elementRect.height / 2) };
    }

    function onPointerDown(e) {
        if (!isTransitioning) {
            // Se establece que se esta dibujando
            drawing = true;
            // Para que no se arrastre la imagen
            e.preventDefault();
            // Para que se detecten los eventos de fuera de la imagen
            activeOption = e.currentTarget;
            activePointerId = e.pointerId;
            activeOption.setPointerCapture(e.pointerId);
            // Se obtiene el centro de la imagen presionada
            origin = getCenterElement(e.target);
        }
    }

    // Funcion que dibuja una linea en direccion el raton
    function onPointerMove(e) {
        if (drawing && !isTransitioning) {
            clearLines();
            // Se dibuja la linea
            drawLine(e.clientX, e.clientY);
        }
    }

    function onPointerUp(e) {
        // Se comprueba si se ha ganado
        let win = checkWin(e);
        // Se reinician las variables y se elimina la linea
        drawing = false;
        if (activeOption && activePointerId !== null && activeOption.hasPointerCapture(activePointerId)) {
            activeOption.releasePointerCapture(activePointerId);
        }
        activeOption = null;
        activePointerId = null;
        if (!win) {
            clearLines();
        }
    }

    // Se cancela el arrastre actual
    function cancelCurrentDrag() {
        if (activeOption && activePointerId !== null && activeOption.hasPointerCapture(activePointerId)) {
            activeOption.releasePointerCapture(activePointerId);
        }
        drawing = false;
        activeOption = null;
        activePointerId = null;
        clearLines();
    }

    // Se comprueba si se ha arrastrado hasta la sombra
    function checkWin(e) {
        let shadowData = shadowContainer.getBoundingClientRect();
        let isOverShadow = (e.clientX >= shadowData.left && e.clientX <= shadowData.right && e.clientY <= shadowData.bottom && e.clientY >= shadowData.top);
        let win = (isOverShadow && activeOption && activeOption.dataset.correct == "true");
        if (win) {
            if (!isTransitioning) {
                isTransitioning = true;
                winGif.style.display = "flex";
                winGif.classList.remove("show");
                void winGif.offsetWidth;
                winGif.classList.add("show");
                if (nextLevelTimeoutId) {
                    clearTimeout(nextLevelTimeoutId);
                }
                // Se espera 3 segundos antes de pasar de nivel
                nextLevelTimeoutId = setTimeout(() => {
                    nextLevel();
                }, 3000);
            }
        } else {
            // Solo muestra error si se ha soltado dentro del contenedor de sombra y es incorrecta
            if (isOverShadow) {
                loseGif.style.display = "flex";
                loseGif.classList.remove("show");
                void loseGif.offsetWidth;
                loseGif.classList.add("show");
                setTimeout(() => {
                    loseGif.style.display = "none";
                    loseGif.classList.remove("show");
                }, 1500);
            } else {
                // Si se suelta fuera de la sombra, la sombra palpita
                shadowContainer.classList.remove("pulse-target");
                void shadowContainer.offsetWidth;
                shadowContainer.classList.add("pulse-target");
            }
        }
        return win;
    }
    function nextLevel() {
        // Se limpian las lineas y los elementos
        if (nextLevelTimeoutId) {
            clearTimeout(nextLevelTimeoutId);
            nextLevelTimeoutId = null;
        }
        clearLines();
        winGif.style.display = "none";
        winGif.classList.remove("show");
        loseGif.style.display = "none";
        loseGif.classList.remove("show");
        isTransitioning = false;
        // Se aumenta de nivel y al terminar vuelve al primero
        actualLevelIndex = (actualLevelIndex + 1) % levels.length;
        mountLevel();
    }

    // Se obtienen los niveles
    function getLevels() {
        const totalLevelsRaw = document.body.dataset.totalLevels;
        const totalLevels = Number.parseInt(totalLevelsRaw, 10);
        let detectedLevels = [];

        if (Number.isInteger(totalLevels) && totalLevels > 0) {
            detectedLevels = Array.from({ length: totalLevels }, (_, index) => index + 1);
        }

        return detectedLevels;
    }

    function mountLevel() {
        shadowImage.src = `img/sombra${levels[actualLevelIndex]}.png`;
        shadowImage.alt = `sombra${levels[actualLevelIndex]}`;

        let newOptions = [{ src: `img/correcto${levels[actualLevelIndex]}.png`, correct: true,  alt: `correcto${levels[actualLevelIndex]}` },{ src: `img/alternativa${levels[actualLevelIndex]}.png`, correct: false, alt: `alternativa${levels[actualLevelIndex]}` }];

        // Se invierten las imagenes
        if (Math.random() < 0.5) {
            newOptions.reverse();
        }
        // Se modifican las imagenes con clase image-options
        options[0].src = newOptions[0].src;
        options[0].alt = newOptions[0].alt;
        options[0].dataset.correct = String(newOptions[0].correct);
        options[1].src = newOptions[1].src;
        options[1].alt = newOptions[1].alt;
        options[1].dataset.correct = String(newOptions[1].correct);
    }

    // MAIN
    let container = document.querySelector(".container");
    let shadowContainer = document.querySelector(".shadow-container");
    let shadowImage = document.querySelector(".shadow-image");
    let options = Array.from(document.querySelectorAll(".image-option"));

    const canvas = document.getElementById("draw-canvas");
    const canvasContext = canvas.getContext("2d");

    let winGif = document.getElementById("win-gif");
    let loseGif = document.getElementById("lose-gif");

    // Variables relacionadas con el canvas
    let origin = {x: 0, y: 0};
    let drawing = false;
    let activeOption = null;
    let activePointerId = null;
    let isTransitioning = false;
    let nextLevelTimeoutId = null;

    // Indice que se usa para acceder a el numero del nivel
    let actualLevelIndex = -1;
    let levels = [];

    // Se obtienen los niveles
    levels = getLevels();
    if (levels.length !== 0) {
        resizeCanvas();
        nextLevel();
    }

    // Se añaden los events listeners
    options.forEach(image => {
        image.addEventListener("pointerdown", onPointerDown);
        image.addEventListener("pointermove", onPointerMove);
        image.addEventListener("pointerup", onPointerUp);
        image.addEventListener("pointercancel",onPointerUp);
    });
    // Si se modifica el tamaño de la ventana se modifica tambien el del canvas
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("blur", cancelCurrentDrag);
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            cancelCurrentDrag();
        }
    });
});







