let score = 0;
const total = 4;

const scoreText = document.getElementById("score");
const arrows = document.getElementById("arrows");

const container = document.querySelector(".objects");
const boxes = document.querySelectorAll(".box");

const dragHint = document.querySelector(".drag-hint");
const victory = document.getElementById("victory");

const NS = "http://www.w3.org/2000/svg";

window.addEventListener("DOMContentLoaded", mezclarObjetos);

function mezclarObjetos() {
    if (!container) return;

    const objetos = Array.from(container.children);
    objetos.sort(() => Math.random() - 0.5);

    container.innerHTML = "";
    objetos.forEach(obj => container.appendChild(obj));
    bindItems();
}

function svgOffset(clientX, clientY) {
    const sr = arrows.getBoundingClientRect();
    return { x: clientX - sr.left, y: clientY - sr.top };
}

function lineFromItemToPoint(item, clientX, clientY) {
    const ir = item.getBoundingClientRect();
    const sr = arrows.getBoundingClientRect();
    const end = svgOffset(clientX, clientY);
    return {
        x1: ir.right - sr.left,
        y1: ir.top + ir.height / 2 - sr.top,
        x2: end.x,
        y2: end.y
    };
}

function drawArrow(from, to) {
    const ir = from.getBoundingClientRect();
    const br = to.getBoundingClientRect();
    const sr = arrows.getBoundingClientRect();

    const line = document.createElementNS(NS, "line");
    line.setAttribute("x1", String(ir.right - sr.left));
    line.setAttribute("y1", String(ir.top + ir.height / 2 - sr.top));
    line.setAttribute("x2", String(br.left - sr.left));
    line.setAttribute("y2", String(br.top + br.height / 2 - sr.top));
    line.setAttribute("stroke", "black");
    line.setAttribute("stroke-width", "3");
    line.setAttribute("pointer-events", "none");
    arrows.appendChild(line);
}

let linkState = null;
let previewLine = null;

function removePreviewLine() {
    if (previewLine && previewLine.parentNode) {
        previewLine.parentNode.removeChild(previewLine);
    }
    previewLine = null;
}

function findBoxAt(clientX, clientY) {
    const stack = document.elementsFromPoint(clientX, clientY);
    return stack.find(el => el.classList && el.classList.contains("box")) || null;
}

function bindItems() {
    document.querySelectorAll(".item").forEach(setupItem);
}

function setupItem(item) {
    item.draggable = false;

    item.addEventListener("pointerdown", (e) => {
        if (e.button !== 0) return;
        if (item.dataset.matched === "1") return;
        e.preventDefault();
        try {
            item.setPointerCapture(e.pointerId);
        } catch (_) {}

        if (dragHint) dragHint.style.display = "none";

        removePreviewLine();
        linkState = { item, pointerId: e.pointerId };

        previewLine = document.createElementNS(NS, "line");
        previewLine.setAttribute("stroke", "#222");
        previewLine.setAttribute("stroke-width", "3");
        previewLine.setAttribute("stroke-dasharray", "8 6");
        previewLine.setAttribute("stroke-linecap", "round");
        previewLine.setAttribute("pointer-events", "none");

        const seg = lineFromItemToPoint(item, e.clientX, e.clientY);
        previewLine.setAttribute("x1", String(seg.x1));
        previewLine.setAttribute("y1", String(seg.y1));
        previewLine.setAttribute("x2", String(seg.x2));
        previewLine.setAttribute("y2", String(seg.y2));
        arrows.appendChild(previewLine);
    });

    item.addEventListener("pointermove", (e) => {
        if (!linkState || linkState.item !== item || linkState.pointerId !== e.pointerId) return;
        if (!previewLine) return;
        e.preventDefault();
        const seg = lineFromItemToPoint(item, e.clientX, e.clientY);
        previewLine.setAttribute("x1", String(seg.x1));
        previewLine.setAttribute("y1", String(seg.y1));
        previewLine.setAttribute("x2", String(seg.x2));
        previewLine.setAttribute("y2", String(seg.y2));
    });

    function endLink(e) {
        if (!linkState || linkState.item !== item || linkState.pointerId !== e.pointerId) return;
        e.preventDefault();
        if (item.hasPointerCapture(e.pointerId)) {
            item.releasePointerCapture(e.pointerId);
        }

        removePreviewLine();

        const itemColor = item.dataset.color;
        const box = findBoxAt(e.clientX, e.clientY);
        const boxColor = box && box.dataset.color;

        if (box && itemColor === boxColor) {
            drawArrow(item, box);
            item.dataset.matched = "1";
            score++;
            if (scoreText) scoreText.textContent = String(score);

            if (score === total) {
                setTimeout(() => {
                    if (victory) victory.style.display = "flex";
                }, 300);
            }
        }

        linkState = null;
    }

    item.addEventListener("pointerup", endLink);
    item.addEventListener("pointercancel", endLink);
}

boxes.forEach(box => {
    box.addEventListener("dragover", e => e.preventDefault());
    box.addEventListener("drop", e => e.preventDefault());
});

if (victory) {
    victory.addEventListener("click", () => {
        victory.style.display = "none";
    });
}

