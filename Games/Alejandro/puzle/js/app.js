document.addEventListener("DOMContentLoaded", () => {
    function generateBackground() {
        dropZone.innerHTML = "";
        for (let i = 0; i < totalPieces; i++) {
            let squareDiv = document.createElement("div");
            squareDiv.classList.add("square-container");
            squareDiv.dataset.id = i;
            // Se añaden event listeners
            squareDiv.addEventListener("dragover", (event) => {
                event.preventDefault();
            });
            squareDiv.addEventListener("drop", (event) => {
                event.preventDefault();
                // Se obtiene la pieza que se acaba de moverç
                let pieceId = event.dataTransfer.getData("id");
                if (pieceId != null && pieceId.trim() != "" ) {
                    let movedPiece = document.querySelector(`.piece[data-id="${pieceId}"]`);
                    // Se añade como hijo la pieza al contenedor si es que no tiene alguna pieza dentro
                    if (squareDiv.children.length == 0 && pieceId == squareDiv.dataset.id) {
                        squareDiv.appendChild(movedPiece);
                        checkWin();
                    }
                }
            } );
            // Version movil
            squareDiv.addEventListener("click", () => {
                if (selectedPiece && squareDiv.children.length == 0 && selectedPiece.dataset.id == squareDiv.dataset.id) {
                    squareDiv.appendChild(selectedPiece);
                    selectedPiece = null;
                    checkWin();
                }
            });
            // Se añade el div generado como hijo del contenedor dropZone
            dropZone.appendChild(squareDiv);
        }
    }

    function generatePieces() {
        piecesContainer.innerHTML = "";
        for (let i = 0; i < totalPieces; i++) {
            let newPiece = document.createElement("div");
            // Atributos de las piezas
            newPiece.classList.add("piece");
            newPiece.dataset.id = i;
            newPiece.setAttribute("draggable", true);

            // Recortar fondo de las piezas
            let row = Math.floor(i / rowSize);
            let column = i % rowSize;
            newPiece.style.backgroundPosition = `${(column * 100) / (rowSize - 1)}%  ${(row * 100) / (rowSize - 1)}%`

            newPiece.addEventListener("dragstart", (event) => {
                event.dataTransfer.setData("id", newPiece.dataset.id);
            });
            // Version movil
            newPiece.addEventListener("click", () => {
                selectedPiece = newPiece;
            });

            // Se añade la pieza como hijo del contenedor de piezas
            piecesContainer.appendChild(newPiece);
        }
    }

    // Funcion que se encarga de mezclar las piezas
    function shufflePieces() {
        let pieces = Array.from(piecesContainer.children);

        for (let i = pieces.length - 1; i > 0; i--) {
            let randomIndex = Math.floor(Math.random() * (i + 1));
            // Se mueven de forma aleatoria las piezas
            let tmpPiece = pieces[i];
            pieces[i] = pieces[randomIndex]
            pieces[randomIndex] = tmpPiece;
            // Se añaden las piezas mezcladas
            piecesContainer.innerHTML = "";
            pieces.forEach(piece => {
                piecesContainer.appendChild(piece);
            });
            
        }
        
    }
    function checkWin() {
        let win = true;
        let allSquaresContainers = document.querySelectorAll(".square-container");
        allSquaresContainers.forEach(squareContainer => {
            // Cada squareContainer tiene como mucho 1 hijo entonces siempre es 0
            if (squareContainer.children.length == 0) {
                win = false;
            } else {
                if (squareContainer.children[0].dataset.id != squareContainer.dataset.id) {
                    win = false;
                }
            }
        });
        if (win) {
            winGif.style.display = "flex"
        }
    }
    function startGame() {
        generateBackground();
        generatePieces();
        shufflePieces();
        winGif.style.display = "none";
    }

    let rowSize = 3;
    let totalPieces = rowSize * rowSize;
    let dropZone = document.getElementById("result-container");
    let piecesContainer = document.getElementById("pieces-container");
    let restartButton = document.getElementById("restart");
    let winGif = document.getElementById("win-gif");
    let selectedPiece = null;
    restartButton.addEventListener("click", () => {
        startGame();
    })
    startGame();


});