document.addEventListener("DOMContentLoaded", () => {
    function applyStyles(element, styles) {
        Object.entries(styles).forEach(([property, value]) => {
            element.style[property] = value;
        });
    }

    function clearStyles(element, properties) {
        properties.forEach((property) => {
            element.style[property] = "";
        });
    }

    function shuffle(items) {
        let copy = [...items];
        for (let i = copy.length - 1; i > 0; i--) {
            let randomIndex = Math.floor(Math.random() * (i + 1));
            let tmpValue = copy[i];
            copy[i] = copy[randomIndex];
            copy[randomIndex] = tmpValue;
        }
        return copy;
    }

    function isPieceInCorrectSquare(piece) {
        let parentSquare = piece.parentElement ? piece.parentElement.closest(".square-container") : null;
        return parentSquare && parentSquare.dataset.id === piece.dataset.id;
    }

    function lockPieceIfCorrect(piece) {
        if (isPieceInCorrectSquare(piece)) {
            piece.draggable = false;
        }
    }

    function applyCurrentPuzzleImage() {
        let currentImageUrl = puzzleImages[currentPuzzleIndex];
        document.documentElement.style.setProperty("--puzzle-image", `url("${currentImageUrl}")`);
    }

    function updatePuzzleNavigationButtons() {
        prevPuzzleButton.disabled = currentPuzzleIndex === 0;
        nextPuzzleButton.disabled = currentPuzzleIndex >= puzzleImages.length - 1;
    }

    function goToPuzzle(index) {
        if (index >= 0 && index < puzzleImages.length) {
            currentPuzzleIndex = index;
            startGame();
            updatePuzzleNavigationButtons();
        }
    }

    function goToPreviousPuzzle() {
        goToPuzzle(currentPuzzleIndex - 1);
    }

    function goToNextPuzzle() {
        goToPuzzle(currentPuzzleIndex + 1);
    }

    function beginTouchDrag(piece, touch) {
        let rect = piece.getBoundingClientRect();
        activeTouchPiece = piece;
        touchOriginParent = piece.parentElement;
        touchOriginNextSibling = piece.nextSibling;
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;

        applyStyles(piece, {
            width: `${rect.width}px`,
            height: `${rect.height}px`,
            position: "fixed",
            left: `${rect.left}px`,
            top: `${rect.top}px`,
            transform: "translate3d(0px, 0px, 0px)",
            willChange: "transform",
            zIndex: "3",
            pointerEvents: "none"
        });

        document.body.appendChild(piece);
    }

    function clearTouchDragStyles(piece) {
        clearStyles(piece, dragStyleProperties);
    }

    function resetTouchDragState() {
        activeTouchPiece = null;
        touchOriginParent = null;
        touchOriginNextSibling = null;
        touchStartX = 0;
        touchStartY = 0;
    }

    function restoreDraggedPiece() {
        if (activeTouchPiece) {
            let draggedPiece = activeTouchPiece;
            clearTouchDragStyles(draggedPiece);
            if (touchOriginParent) {
                touchOriginParent.insertBefore(draggedPiece, touchOriginNextSibling);
            }
            resetTouchDragState();
        }
    }

    function placeDraggedPiece(targetSquare) {
        if (activeTouchPiece) {
            let draggedPiece = activeTouchPiece;
            clearTouchDragStyles(draggedPiece);
            targetSquare.appendChild(draggedPiece);
            lockPieceIfCorrect(draggedPiece);
            resetTouchDragState();
            checkWin();
        }
    }

    function onTouchMove(event) {
        if (activeTouchPiece && event.touches.length > 0) {
            event.preventDefault();
            let touch = event.touches[0];
            let deltaX = touch.clientX - touchStartX;
            let deltaY = touch.clientY - touchStartY;
            activeTouchPiece.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0px)`;
        }
    }

    function onTouchEnd(event) {
        if (activeTouchPiece && event.changedTouches.length > 0) {
            event.preventDefault();
            let touch = event.changedTouches[0];
            let targetElement = document.elementFromPoint(touch.clientX, touch.clientY);
            let targetSquare = targetElement ? targetElement.closest(".square-container") : null;

            if (
                targetSquare &&
                targetSquare.children.length === 0 &&
                activeTouchPiece.dataset.id === targetSquare.dataset.id
            ) {
                placeDraggedPiece(targetSquare);
            } else {
                restoreDraggedPiece();
            }
        }
    }

    function onTouchCancel() {
        restoreDraggedPiece();
    }

    function generateBackground() {
        dropZone.innerHTML = "";
        for (let i = 0; i < totalPieces; i++) {
            let squareDiv = document.createElement("div");
            squareDiv.classList.add("square-container");
            squareDiv.dataset.id = i;

            squareDiv.addEventListener("dragover", (event) => {
                event.preventDefault();
            });

            squareDiv.addEventListener("drop", (event) => {
                event.preventDefault();
                let pieceId = event.dataTransfer.getData("id");
                if (pieceId != null && pieceId.trim() !== "") {
                    let movedPiece = document.querySelector(`.piece[data-id="${pieceId}"]`);
                    if (squareDiv.children.length === 0 && pieceId === squareDiv.dataset.id) {
                        squareDiv.appendChild(movedPiece);
                        lockPieceIfCorrect(movedPiece);
                        checkWin();
                    }
                }
            });

            dropZone.appendChild(squareDiv);
        }
    }

    function generatePieces() {
        piecesContainer.innerHTML = "";
        for (let i = 0; i < totalPieces; i++) {
            let newPiece = document.createElement("div");
            newPiece.classList.add("piece");
            newPiece.dataset.id = i;
            newPiece.setAttribute("draggable", true);

            let row = Math.floor(i / rowSize);
            let column = i % rowSize;
            newPiece.style.backgroundPosition = `${(column * 100) / (rowSize - 1)}% ${(row * 100) / (rowSize - 1)}%`;

            newPiece.addEventListener("dragstart", (event) => {
                if (newPiece.draggable && !isPuzzleTransitioning) {
                    event.dataTransfer.setData("id", newPiece.dataset.id);
                } else {
                    event.preventDefault();
                }
            });

            newPiece.addEventListener("touchstart", (event) => {
                if (event.touches.length > 0 && !isPieceInCorrectSquare(newPiece) && !isPuzzleTransitioning) {
                    event.preventDefault();
                    beginTouchDrag(newPiece, event.touches[0]);
                }
            }, { passive: false });

            piecesContainer.appendChild(newPiece);
        }
    }

    function shufflePieces() {
        let pieces = Array.from(piecesContainer.children);

        for (let i = pieces.length - 1; i > 0; i--) {
            let randomIndex = Math.floor(Math.random() * (i + 1));
            let tmpPiece = pieces[i];
            pieces[i] = pieces[randomIndex];
            pieces[randomIndex] = tmpPiece;
            piecesContainer.innerHTML = "";
            pieces.forEach((piece) => {
                piecesContainer.appendChild(piece);
            });
        }
    }

    function checkWin() {
        let win = true;
        let allSquaresContainers = document.querySelectorAll(".square-container");
        allSquaresContainers.forEach((squareContainer) => {
            if (squareContainer.children.length === 0) {
                win = false;
            } else if (squareContainer.children[0].dataset.id !== squareContainer.dataset.id) {
                win = false;
            }
        });

        if (win) {
            handlePuzzleWin();
        }
    }

    function handlePuzzleWin() {
        if (!isPuzzleTransitioning) {
            isPuzzleTransitioning = true;
            showWinIndicator();
            clearTimeout(autoAdvancePuzzleTimeoutId);
            autoAdvancePuzzleTimeoutId = setTimeout(() => {
                isPuzzleTransitioning = false;
                if (currentPuzzleIndex < puzzleImages.length - 1) {
                    goToNextPuzzle();
                }
            }, winAnimationDuration);
        }
    }

    function showWinIndicator() {
        clearTimeout(winIndicatorTimeoutId);
        winIndicator.style.display = "flex";
        winIndicator.classList.remove("animate");
        winIndicator.classList.add("animate");
        winIndicatorTimeoutId = setTimeout(() => {
            winIndicator.classList.remove("animate");
            winIndicator.style.display = "none";
        }, winAnimationDuration);
    }

    function resetWinState() {
        clearTimeout(winIndicatorTimeoutId);
        clearTimeout(autoAdvancePuzzleTimeoutId);
        winIndicator.classList.remove("animate");
        winIndicator.style.display = "none";
        isPuzzleTransitioning = false;
    }

    function startGame() {
        restoreDraggedPiece();
        applyCurrentPuzzleImage();
        generateBackground();
        generatePieces();
        shufflePieces();
        resetWinState();
    }

    let rowSize = 3;
    let totalPieces = rowSize * rowSize;
    let dropZone = document.getElementById("result-container");
    let piecesContainer = document.getElementById("pieces-container");
    let restartButton = document.getElementById("restart");
    let prevPuzzleButton = document.getElementById("prev-puzzle");
    let nextPuzzleButton = document.getElementById("next-puzzle");
    let winIndicator = document.getElementById("win-indicator");
    const puzzleImageCandidates = ["../img/puzzle1.png", "../img/puzzle2.png", "../img/puzzle3.png", "../img/puzzle4.png", "../img/puzzle5.png", "../img/puzzle6.png"];

    const puzzleImages = shuffle(puzzleImageCandidates);
    const winAnimationDuration = 2000;
    const dragStyleProperties = ["position", "left", "top", "transform", "willChange", "width", "height", "zIndex", "pointerEvents"];

    let currentPuzzleIndex = 0;
    let activeTouchPiece = null;
    let touchOriginParent = null;
    let touchOriginNextSibling = null;
    let touchStartX = 0;
    let touchStartY = 0;
    let isPuzzleTransitioning = false;
    let winIndicatorTimeoutId = null;
    let autoAdvancePuzzleTimeoutId = null;

    document.addEventListener("touchmove", onTouchMove, { passive: false });
    document.addEventListener("touchend", onTouchEnd, { passive: false });
    document.addEventListener("touchcancel", onTouchCancel);

    restartButton.addEventListener("click", () => {
        startGame();
    });

    prevPuzzleButton.addEventListener("click", () => {
        goToPreviousPuzzle();
    });

    nextPuzzleButton.addEventListener("click", () => {
        goToNextPuzzle();
    });

    currentPuzzleIndex = 0;
    updatePuzzleNavigationButtons();
    startGame();
});
