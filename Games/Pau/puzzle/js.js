const pieces = document.querySelectorAll(".pieza");

for (let i = 0; i < pieces.length; i++) {
    const el = pieces[i];
    el.draggable = true;
    el.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("id", e.target.id);
    });
}

const dropTargets = document.querySelectorAll(".colocar");

for (let i = 0; i < dropTargets.length; i++) {
    const el = dropTargets[i];
    el.addEventListener("dragover", (e) => {
        e.preventDefault();
    });
    el.addEventListener("drop", (e) => {
        const data = e.dataTransfer.getData("id");
        const piece = document.getElementById(data);
        const target = e.target.closest(".colocar") || e.target;
        if (piece && piece.classList.contains(target.id)) {
            target.appendChild(piece);
            checkComplete();
        }
    });
}

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
