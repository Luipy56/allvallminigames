let score = 0;
const total = 4;

const scoreText = document.getElementById("score");
const arrows = document.getElementById("arrows");

const container = document.querySelector(".objects");
const items = document.querySelectorAll(".item");
const boxes = document.querySelectorAll(".box");

const dragHint = document.querySelector(".drag-hint");
const victory = document.getElementById("victory");

window.addEventListener("DOMContentLoaded", mezclarObjetos);

function mezclarObjetos() {
    if (!container) return;

    const objetos = Array.from(container.children);
    objetos.sort(() => Math.random() - 0.5);

    container.innerHTML = "";
    objetos.forEach(obj => container.appendChild(obj));
}


items.forEach(item => {

    item.addEventListener("dragstart", dragStart);

    
    item.addEventListener("dragstart", () => {
        if (dragHint) dragHint.style.display = "none";
    });
});

boxes.forEach(box => {
    box.addEventListener("dragover", e => e.preventDefault());
    box.addEventListener("drop", dropItem);
});

function dragStart(e) {
    e.dataTransfer.setData("color", e.target.dataset.color);
}

function dropItem(e) {
    e.preventDefault();

    const itemColor = e.dataTransfer.getData("color");
    const boxColor = e.target.dataset.color;

    if (itemColor === boxColor) {

        const item = document.querySelector(`.item[data-color='${itemColor}']`);

        if (!item) return;

        drawArrow(item, e.target);

        item.draggable = false;
        score++;
        scoreText.textContent = score;

        
        if (score === total) {
            setTimeout(() => {
                if (victory) {
                    victory.style.display = "flex";
                }
            }, 300);
        }
    }
}

function drawArrow(from, to) {

    const rect1 = from.getBoundingClientRect();
    const rect2 = to.getBoundingClientRect();

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");

    line.setAttribute("x1", rect1.right);
    line.setAttribute("y1", rect1.top + rect1.height / 2);
    line.setAttribute("x2", rect2.left);
    line.setAttribute("y2", rect2.top + rect2.height / 2);
    line.setAttribute("stroke", "black");
    line.setAttribute("stroke-width", "3");

    arrows.appendChild(line);
}

if (victory) {
    victory.addEventListener("click", () => {
        victory.style.display = "none";
    });
}