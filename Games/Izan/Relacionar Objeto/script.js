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

function clearDragStyles(el) {
    el.style.position = "";
    el.style.left = "";
    el.style.top = "";
    el.style.width = "";
    el.style.height = "";
    el.style.zIndex = "";
    el.style.touchAction = "";
}

function elementUnderPoint(clientX, clientY, dragEl) {
    const prev = dragEl.style.pointerEvents;
    dragEl.style.pointerEvents = "none";
    const under = document.elementFromPoint(clientX, clientY);
    dragEl.style.pointerEvents = prev;
    return under;
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

let drag = null;

items.forEach(item => {
    item.draggable = false;

    item.addEventListener("pointerdown", (e) => {
        if (e.button !== 0) return;
        if (item.dataset.matched === "1") return;
        e.preventDefault();
        try {
            item.setPointerCapture(e.pointerId);
        } catch (_) {}

        if (dragHint) dragHint.style.display = "none";

        const r = item.getBoundingClientRect();
        drag = {
            el: item,
            pointerId: e.pointerId,
            offsetX: e.clientX - r.left,
            offsetY: e.clientY - r.top,
            parent: item.parentNode,
            next: item.nextSibling,
        };

        item.style.position = "fixed";
        item.style.left = r.left + "px";
        item.style.top = r.top + "px";
        item.style.width = r.width + "px";
        item.style.height = r.height + "px";
        item.style.zIndex = "10000";
        item.style.touchAction = "none";
    });

    item.addEventListener("pointermove", (e) => {
        if (!drag || drag.el !== item || drag.pointerId !== e.pointerId) return;
        e.preventDefault();
        item.style.left = e.clientX - drag.offsetX + "px";
        item.style.top = e.clientY - drag.offsetY + "px";
    });

    function endDrag(e) {
        if (!drag || drag.el !== item || drag.pointerId !== e.pointerId) return;
        e.preventDefault();
        if (item.hasPointerCapture(e.pointerId)) {
            item.releasePointerCapture(e.pointerId);
        }

        const itemColor = item.dataset.color;
        const under = elementUnderPoint(e.clientX, e.clientY, item);
        const box = under && under.closest(".box");
        const boxColor = box && box.dataset.color;

        let matched = false;
        if (box && itemColor === boxColor) {
            matched = true;
            drawArrow(item, box);
            item.dataset.matched = "1";
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

        drag.parent.insertBefore(item, drag.next);
        clearDragStyles(item);
        drag = null;
    }

    item.addEventListener("pointerup", endDrag);
    item.addEventListener("pointercancel", endDrag);
});

boxes.forEach(box => {
    box.addEventListener("dragover", e => e.preventDefault());
    box.addEventListener("drop", e => e.preventDefault());
});

if (victory) {
    victory.addEventListener("click", () => {
        victory.style.display = "none";
    });
}
