const zona = document.getElementById("zona-osset");
const missatge = document.getElementById("missatge");
const items = document.querySelectorAll(".item");
const ossetBase = document.getElementById("osset-base");
const reiniciarBtn = document.getElementById("reiniciar");

let estat = { gorra: false, samarreta: false, ulleres: false };

//drag dels items
items.forEach(item => {
    item.addEventListener("dragstart", function(e) {
        e.dataTransfer.setData("text", this.dataset.peça);
    });
});

// Drop a la zona
zona.addEventListener("dragover", function(e) { e.preventDefault(); });
zona.addEventListener("drop", function(e) {
    e.preventDefault();
    const peça = e.dataTransfer.getData("text");

    estat[peça] = true;

    if (peça === "samarreta") {
        ossetBase.src = "img/samarreta_posada.png";
    } else {
        document.getElementById(peça).style.display = "block";
    }

    //treure item de la llista
    document.querySelector(`[data-peça="${peça}"]`).remove();

    missatge.textContent = "Molt bé!";
    missatge.style.background = "#c8f7c5";

    //comprovar si esta complet
    if (estat.gorra && estat.samarreta && estat.ulleres) {
        missatge.textContent = "Perfecte! L'osset està vestit!";
        zona.style.transform = "scale(1.03)";
    }
});

//reiniciar
reiniciarBtn.addEventListener("click", function() {
    location.reload();
});