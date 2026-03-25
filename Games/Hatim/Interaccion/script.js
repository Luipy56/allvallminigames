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

  
  animal.style.position = "relative";
  animal.style.left = "0px";
  animal.style.top = "0px";
  animal.style.width = "200px"; 
  animal.style.height = "auto";

  
  document.querySelector(".zona-animal").appendChild(animal);
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

    const errorGif = document.getElementById("error");

    if (habitat.dataset.habitat === respuestaCorrecta) {
      // Correcto: animal dentro del hábitat
      habitat.appendChild(animal);
      animal.style.position = "absolute";
      animal.style.left = "0";
      animal.style.top = "0";
      animal.style.width = "100%";
      animal.style.height = "100%";
      animal.style.objectFit = "cover";

      victoria.classList.remove("hidden");

      
      setTimeout(() => {
        nivelActual++;
        if (nivelActual >= animales.length) {
          pantallaJuego.classList.add("hidden");
          pantallaInicio.classList.remove("hidden");
        } else {
          cargarNivel();
        }
      }, 4000);
    } else {
      
      errorGif.classList.remove("hidden");

      
      setTimeout(() => {
        errorGif.classList.add("hidden");
      }, 2000);
    }
  });
});