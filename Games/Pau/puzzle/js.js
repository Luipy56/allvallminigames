const pieces = document.querySelectorAll(".pieza");
const dropTargets = document.querySelectorAll(".colocar");

function checkComplete() {
    let win = true;
    dropTargets.forEach((slot) => {
        if (slot.children.length === 0) {
            win = false;
        }
    });
    if (win) {
        const overlay = document.createElement("div");

        overlay.style.position = "fixed";
        overlay.style.top = "50%";
        overlay.style.left = "50%";
        overlay.style.transform = "translate(-50%, -50%)";
        overlay.style.zIndex = "9999";
        overlay.style.padding = "10px";
        overlay.style.borderRadius = "8px";

        const img = document.createElement("img");
        img.src = "img/ganar.gif";
        img.style.maxWidth = "90vw";
        img.style.maxHeight = "90vh";

        overlay.appendChild(img);
        document.body.appendChild(overlay);
    }
}

function clearDragStyles(el) {
    el.style.position = "";
    el.style.left = "";
    el.style.top = "";
    el.style.width = "";
    el.style.height = "";
    el.style.zIndex = "";
    el.style.margin = "";
    el.style.touchAction = "";
}

function elementUnderPoint(clientX, clientY, dragEl) {
    const prev = dragEl.style.pointerEvents;
    dragEl.style.pointerEvents = "none";
    const under = document.elementFromPoint(clientX, clientY);
    dragEl.style.pointerEvents = prev;
    return under;
}

let drag = null;

pieces.forEach((el) => {
    el.draggable = false;

    el.addEventListener("pointerdown", (e) => {
        if (e.button !== 0) return;
        e.preventDefault();
        try {
            el.setPointerCapture(e.pointerId);
        } catch (_) {}

        const r = el.getBoundingClientRect();
        drag = {
            el,
            pointerId: e.pointerId,
            offsetX: e.clientX - r.left,
            offsetY: e.clientY - r.top,
            parent: el.parentNode,
            next: el.nextSibling,
        };

        el.style.position = "fixed";
        el.style.left = r.left + "px";
        el.style.top = r.top + "px";
        el.style.width = r.width + "px";
        el.style.height = r.height + "px";
        el.style.zIndex = "10000";
        el.style.margin = "0";
        el.style.touchAction = "none";
    });

    el.addEventListener("pointermove", (e) => {
        if (!drag || drag.el !== el || drag.pointerId !== e.pointerId) return;
        e.preventDefault();
        el.style.left = e.clientX - drag.offsetX + "px";
        el.style.top = e.clientY - drag.offsetY + "px";
    });

    function endDrag(e) {
        if (!drag || drag.el !== el || drag.pointerId !== e.pointerId) return;
        e.preventDefault();
        if (el.hasPointerCapture(e.pointerId)) {
            el.releasePointerCapture(e.pointerId);
        }

        const under = elementUnderPoint(e.clientX, e.clientY, el);
        const target = under && under.closest(".colocar");
        let ok = false;
        if (target && el.classList.contains(target.id)) {
            target.appendChild(el);
            ok = true;
        }

        if (!ok) {
            drag.parent.insertBefore(el, drag.next);
        }
        clearDragStyles(el);
        drag = null;
        if (ok) checkComplete();
    }

    el.addEventListener("pointerup", endDrag);
    el.addEventListener("pointercancel", endDrag);
});
