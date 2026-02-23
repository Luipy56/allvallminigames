const reiniciarBtn = document.getElementById("reiniciar");
const canvas = document.getElementById("canvas_cara");
const ctx = canvas.getContext("2d");

//botons
const pinzell_petit = document.getElementById("pinzell_petit");
const pinzell_mitja = document.getElementById("pinzell_mitja");
const pinzell_gran = document.getElementById("pinzell_gran");

let pintant = false;
let colorActual = "#FF4444";
let midaPinzell = 20;

/* ---------- INICI ---------- */
document.addEventListener("DOMContentLoaded", function() {
    dibuixarCara();
    activarPintar();
    activarColors();
    activarMides();
    activarBotons();
});

/* ---------- CARA BASE ---------- */
function dibuixarCara() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //cara groga
    ctx.beginPath();
    ctx.arc(300, 300, 250, 0, Math.PI * 2);
    ctx.fillStyle = "#FFEAA7";
    ctx.fill();
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 8;
    ctx.stroke();
}

/* ---------- PINTAR ---------- */
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

/* ---------- COLORS ---------- */
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

    //treure selecció de tots els colors
    var tots = document.querySelectorAll(".color_boto");
    for (var i = 0; i < tots.length; i++) {
        tots[i].classList.remove("seleccionat");
    }
    element.classList.add("seleccionat");

    //actualitzar exemple pinzell (la part que posa la mida)
    document.getElementById("pinzell_exemple").style.background = colorActual;
}

/* ---------- MIDA PINZELL ---------- */
function activarMides() {
    pinzell_petit.addEventListener("click", function() {
        midaPinzell = 10;
        pinzell_petit.classList.add("seleccionat");
        pinzell_mitja.classList.remove("seleccionat");
        pinzell_gran.classList.remove("seleccionat");
        document.getElementById("pinzell_exemple").style.width = "20px";
        document.getElementById("pinzell_exemple").style.height = "20px";
    });

    pinzell_mitja.addEventListener("click", function() {
        midaPinzell = 20;
        pinzell_petit.classList.remove("seleccionat");
        pinzell_mitja.classList.add("seleccionat");
        pinzell_gran.classList.remove("seleccionat");
        document.getElementById("pinzell_exemple").style.width = "40px";
        document.getElementById("pinzell_exemple").style.height = "40px";
    });

    pinzell_gran.addEventListener("click", function() {
        midaPinzell = 40;
        pinzell_petit.classList.remove("seleccionat");
        pinzell_mitja.classList.remove("seleccionat");
        pinzell_gran.classList.add("seleccionat");
        document.getElementById("pinzell_exemple").style.width = "80px";
        document.getElementById("pinzell_exemple").style.height = "80px";
    });
}

/* ---------- BOTONS ---------- */
function activarBotons() {
    document.getElementById("netejar_canvas").addEventListener("click", dibuixarCara);
    document.getElementById("reiniciar_cara").addEventListener("click", dibuixarCara);
}
reiniciarBtn.addEventListener("click", function() {
    location.reload();
});