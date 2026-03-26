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
const zonaAnimal = document.querySelector(".zona-animal");
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
  animal.style.pointerEvents = "auto";
  animal.draggable = false;

  zonaAnimal.appendChild(animal);
}

function clearAnimalDragStyles() {
  animal.style.position = "";
  animal.style.left = "";
  animal.style.top = "";
  animal.style.width = "";
  animal.style.height = "";
  animal.style.zIndex = "";
  animal.style.touchAction = "";
  animal.style.objectFit = "";
}

function elementUnderPoint(clientX, clientY, dragEl) {
  const prev = dragEl.style.pointerEvents;
  dragEl.style.pointerEvents = "none";
  const under = document.elementFromPoint(clientX, clientY);
  dragEl.style.pointerEvents = prev;
  return under;
}

let dragAnimal = null;

animal.addEventListener("pointerdown", (e) => {
  if (e.button !== 0) return;
  e.preventDefault();
  try {
    animal.setPointerCapture(e.pointerId);
  } catch (_) {}

  const r = animal.getBoundingClientRect();
  dragAnimal = {
    pointerId: e.pointerId,
    offsetX: e.clientX - r.left,
    offsetY: e.clientY - r.top,
    parent: animal.parentNode,
    next: animal.nextSibling,
  };

  animal.style.position = "fixed";
  animal.style.left = r.left + "px";
  animal.style.top = r.top + "px";
  animal.style.width = r.width + "px";
  animal.style.height = r.height + "px";
  animal.style.zIndex = "10000";
  animal.style.touchAction = "none";
  animal.style.objectFit = "contain";
});

animal.addEventListener("pointermove", (e) => {
  if (!dragAnimal || dragAnimal.pointerId !== e.pointerId) return;
  e.preventDefault();
  animal.style.left = e.clientX - dragAnimal.offsetX + "px";
  animal.style.top = e.clientY - dragAnimal.offsetY + "px";
});

function finishAnimalDrag(e) {
  if (!dragAnimal || dragAnimal.pointerId !== e.pointerId) return;
  e.preventDefault();
  if (animal.hasPointerCapture(e.pointerId)) {
    animal.releasePointerCapture(e.pointerId);
  }

  const errorGif = document.getElementById("error");
  const under = elementUnderPoint(e.clientX, e.clientY, animal);
  const habitat = under && under.closest(".habitat");

  if (habitat && habitat.dataset.habitat === respuestaCorrecta) {
    habitat.appendChild(animal);
    animal.style.position = "absolute";
    animal.style.left = "0";
    animal.style.top = "0";
    animal.style.width = "100%";
    animal.style.height = "100%";
    animal.style.objectFit = "cover";
    animal.style.zIndex = "";
    animal.style.touchAction = "none";
    animal.style.pointerEvents = "none";

    victoria.classList.remove("hidden");

    setTimeout(() => {
      nivelActual++;
      animal.style.pointerEvents = "auto";
      if (nivelActual >= animales.length) {
        pantallaJuego.classList.add("hidden");
        pantallaInicio.classList.remove("hidden");
      } else {
        cargarNivel();
      }
    }, 4000);
  } else if (habitat) {
    errorGif.classList.remove("hidden");
    dragAnimal.parent.insertBefore(animal, dragAnimal.next);
    clearAnimalDragStyles();
    animal.style.position = "relative";
    animal.style.width = "200px";
    animal.style.height = "auto";
    setTimeout(() => {
      errorGif.classList.add("hidden");
    }, 2000);
  } else {
    dragAnimal.parent.insertBefore(animal, dragAnimal.next);
    clearAnimalDragStyles();
    animal.style.position = "relative";
    animal.style.width = "200px";
    animal.style.height = "auto";
  }

  dragAnimal = null;
}

animal.addEventListener("pointerup", finishAnimalDrag);
animal.addEventListener("pointercancel", finishAnimalDrag);

habitats.forEach(habitat => {
  habitat.addEventListener("dragover", (e) => e.preventDefault());
  habitat.addEventListener("drop", (e) => e.preventDefault());
});
