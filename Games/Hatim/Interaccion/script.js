const animales = [
  { imagen: "img/leon.png", habitat: "selva" },
  { imagen: "img/delfin.png", habitat: "mar" },
  { imagen: "img/oso.png", habitat: "bosque" }
];

let nivelActual = 0;
let respuestaCorrecta = "";

const pantallaInicio = document.getElementById("pantallaInicio");
const pantallaJuego = document.getElementById("pantallaJuego");
const btnEmpezar = document.getElementById("btnEmpezar");
const btnSiguiente = document.getElementById("btnSiguiente");
const animal = document.getElementById("animal");
const habitats = document.querySelectorAll(".habitat");
const victoria = document.getElementById("victoria");


btnEmpezar.addEventListener("click", () => {
  pantallaInicio.classList.add("hidden");
  pantallaJuego.classList.remove("hidden");
  nivelActual = 0; 
  cargarNivel();
});


function cargarNivel() {
  animal.src = animales[nivelActual].imagen;
  respuestaCorrecta = animales[nivelActual].habitat;
  victoria.classList.add("hidden");
}


animal.addEventListener("dragstart", (e) => {
  e.dataTransfer.setData("text", e.target.id);
});


habitats.forEach(habitat => {

  habitat.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  habitat.addEventListener("drop", (e) => {
    e.preventDefault();

    if (habitat.dataset.habitat === respuestaCorrecta) {
      mostrarVictoria();
    } else {

      animal.style.left = "50px";
      animal.style.top = "150px";
    }
  });

});


function mostrarVictoria() {
  victoria.classList.remove("hidden");
}


btnSiguiente.addEventListener("click", () => {
  nivelActual++;

  if (nivelActual >= animales.length) {
    pantallaJuego.classList.add("hidden");
    pantallaInicio.classList.remove("hidden");
    return; 
  }

  cargarNivel();
});
