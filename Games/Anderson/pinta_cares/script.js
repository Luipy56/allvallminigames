const canvas = document.getElementById("canvas_cara");
const ctx = canvas.getContext("2d");

let pintant = false;
let colorActual = "#FF4444";
let midaPinzell = 10;

document.addEventListener("DOMContentLoaded", function() {
    dibuixarCara();
    activarPintar();
    activarColors();
    activarBotons();
});

function dibuixarCara() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.arc(150, 75, 70, 0, Math.PI * 2);
    ctx.fillStyle = "#FFEAA7";
    ctx.fill();
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 8;
    ctx.stroke();
}

function activarPintar() {
    canvas.addEventListener("pointerdown", function(e) {
        pintant = true;
        dibuixar(e);
    });
    canvas.addEventListener("pointermove", function(e) {
        if (pintant) dibuixar(e);
    });
    canvas.addEventListener("pointerup", function() { pintant = false; });
    canvas.addEventListener("pointerleave", function() { pintant = false; });
}

function dibuixar(e) {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    ctx.beginPath();
    ctx.arc(x, y, midaPinzell / 2, 0, Math.PI * 2);
    ctx.fillStyle = colorActual;
    ctx.fill();
}

function activarColors() {
    document.getElementById("color_vermell").addEventListener("click", function() {
        canviarColor("#FF4444", this);
    });

    document.getElementById("color_blau").addEventListener("click", function() {
        canviarColor("#4444FF", this);
    });

    document.getElementById("color_groc").addEventListener("click", function() {
        canviarColor("#FFFF44", this);
    });

    document.getElementById("color_verd").addEventListener("click", function() {
        canviarColor("#44FF44", this);
    });

    document.getElementById("color_taronja").addEventListener("click", function() {
        canviarColor("#FF8844", this);
    });

    document.getElementById("color_lila").addEventListener("click", function() {
        canviarColor("#AA44FF", this);
    });

    document.getElementById("color_blanc").addEventListener("click", function() {
        canviarColor("#FFFFFF", this);
    });

    document.getElementById("color_negre").addEventListener("click", function() {
        canviarColor("#333333", this);
    });
}

function canviarColor(color, element) {
    colorActual = color;

    var tots = document.querySelectorAll(".color_boto");
    for (var i = 0; i < tots.length; i++) {
        tots[i].classList.remove("seleccionat");
    }
    element.classList.add("seleccionat");
}

function activarBotons() {
    document.getElementById("netejar_canvas").addEventListener("click", dibuixarCara);
}
