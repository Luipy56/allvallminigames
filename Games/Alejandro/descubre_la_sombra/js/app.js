document.addEventListener("DOMContentLoaded", () => {
    // Se establecen las dimensiones del canvas
    function resizeCanvas() {
        // Se obtiene los nuevos tamaños
        let containerData = container.getBoundingClientRect();
        canvas.width = containerData.width;
        canvas.height = containerData.height;
    }

    // Se limpian las lineas de todo el canvas
    function clearLines() {
        let containerData = container.getBoundingClientRect();
        canvasContext.clearRect(0, 0, containerData.width, containerData.height);
    }

    // Funcion que dibuja las lineas
    function drawLine(x, y) {
        canvasContext.lineWidth = 20;
        canvasContext.lineCap = "round";
        canvasContext.strokeStyle = "white";

        canvasContext.beginPath();
        canvasContext.moveTo(origin.x,origin.y);
        canvasContext.lineTo(x, y);
        canvasContext.stroke();
    }

    function getCenterElement(element) {
        let elementRect = element.getBoundingClientRect();
        let containerData = container.getBoundingClientRect();
        return {x: (elementRect.left + elementRect.width / 2) - containerData.left, y: (elementRect.top + elementRect.height / 2) - containerData.top };
    }

    function onPointerDown(e) {
        // Se establece que se esta dibujando
        drawing = true;
        // Para que no se arrastre la imagen
        e.preventDefault();
        // Para que se detecten los eventos de fuera de la imagen
        activeOption = e.currentTarget;
        activeOption.setPointerCapture(e.pointerId);
        // Se obtiene el centro de la imagen presionada
        origin = getCenterElement(e.target);
    }

    // Funcion que dibuja una linea en direccion el raton
    function onPointerMove(e) {
        if (drawing) {
            let containerData = container.getBoundingClientRect();
            clearLines();
            // Se dibuja la linea
            drawLine((e.clientX - containerData.left), (e.clientY - containerData.top));
        }
    }

    function onPointerUp(e) {
        // Se comprueba si se ha ganado
        let win = checkWin(e);
        // Se reinician las variables y se elimina la linea
        drawing = false;
        activeOption = null;
        if (!win) {
            clearLines();
        }
    }

    // Se comprueba si se ha arrastrado hasta la sombra
    function checkWin(e) {
        let shadowData = shadowContainer.getBoundingClientRect();
        let win = (e.clientX >= shadowData.left && e.clientX <= shadowData.right && e.clientY <= shadowData.bottom && e.clientY >= shadowData.top && activeOption && activeOption.dataset.correct == "true");
        if (win) {
            winGif.style.display = "block";
            // Se añade una animacion al ganar si es que no se han terminado los niveles
            if (actualLevelIndex + 1 >= levels.length) {
                restartButton.style.display = "block";
                nextLevelButton.style.display = "none";
            } else {
                nextLevelButton.style.display = "flex"
            }
        } else {
            loseGif.style.display = "block"
            setTimeout(() => {
            loseGif.style.display = "none"
            }, 1500);
        }
        return win;
    }
    function nextLevel() {
        // Se limpian las lineas y los elementos
        clearLines();
        nextLevelButton.style.display = "none";
        winGif.style.display = "none";
        // Se aumenta de nivel
        actualLevelIndex += 1;
        if (actualLevelIndex <= levels.length) {
            mountLevel();
        }
    }

    // Se comprueba si existen las imagenes
    function imageExists(src) {
        return new Promise((resolve) => {
            let img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = src;
        });
    }

    // Se detectan los niveles basandose en los archivos
    async function getLevels() {
        let detectedLevels = [];
        let level = 1;
        let searching = true;

        while (searching) {
            let sombra = `img/sombra${level}.png`;
            let correcto = `img/correcto${level}.png`;
            let alternativa = `img/alternativa${level}.png`;

            let hasSombra = await imageExists(sombra);
            let hasCorrecto = await imageExists(correcto);
            let hasAlternativa = await imageExists(alternativa);

            if (hasSombra && hasCorrecto && hasAlternativa) {
                detectedLevels.push(level);
                level++;
            } else {
                searching = false;
            }
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

    let nextLevelButton = document.getElementById("next-level-button");
    let restartButton = document.getElementById("restart-button");
    let winGif = document.getElementById("win-gif");
    let loseGif = document.getElementById("lose-gif");

    // Variables relacionadas con el canvas
    let origin = {x: 0, y: 0};
    let drawing = false;
    let activeOption = null;

    // Indice que se usa para acceder a el numero del nivel
    let actualLevelIndex = -1;
    let levels = [];

    // Se obtienen los niveles
    getLevels().then((data) => {
        levels = data;
        if (levels.length != 0) {
            resizeCanvas();
            nextLevel();
        }
        }).catch((error) => {
            console.log("Error al cargar los datos", error);
    });

    // Se añaden los events listeners
    options.forEach(image => {
        image.addEventListener("pointerdown", onPointerDown);
        image.addEventListener("pointermove", onPointerMove);
        image.addEventListener("pointerup", onPointerUp);
        image.addEventListener("pointercancel",onPointerUp);
    });
    nextLevelButton.addEventListener("click", () => {
        nextLevel();
    });
    restartButton.addEventListener("click", () => {
        actualLevelIndex = -1;
        restartButton.style.display = "none"
        nextLevel();
    })
    // Si se modifica el tamaño de la ventana se modifica tambien el del canvas
    window.addEventListener("resize", resizeCanvas);
});