let piezas = document.querySelectorAll(".pieza")

console.log(piezas)

for (let i = 0; i < piezas.length; i++) {
    const element = piezas[i];
    element.draggable = true
    element.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("id", e.target.id);
    })
}

let casillas = document.querySelectorAll(".colocar")

for (let i = 0; i < casillas.length; i++) {
    const element = casillas[i];
    element.addEventListener("dragover", (e)=>{
        e.preventDefault();
    })
    element.addEventListener("drop", (e) => {
        const data = e.dataTransfer.getData("id");
        let foto = document.getElementById(data)
        console.log(e.target)
        console.log(foto.classList.contains(e.target.id))
        console.log(foto.classList)
        if (foto.classList.contains(e.target.id)){
            e.target.appendChild(foto)
            ganar()
        }
    })
}

function ganar(){
    let win = true
    casillas.forEach(element => {
        if(element.children.length == 0){
            win = false
        }
    });
    if (win){
        const overlay = document.createElement("div");

        overlay.style.position = "fixed";
        overlay.style.top = "50%";
        overlay.style.left = "50%";
        overlay.style.transform = "translate(-50%, -50%)";
        overlay.style.zIndex = "9999";
        overlay.style.padding = "10px";
        overlay.style.borderRadius = "8px";

        // Crear la imagen
        const img = document.createElement("img");
        img.src = "img/ganar.gif";
        img.style.maxWidth = "90vw";
        img.style.maxHeight = "90vh";

        // Añadir la imagen al div
        overlay.appendChild(img);

        // Añadir el div al body
        document.body.appendChild(overlay);
    }
}