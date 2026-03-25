const pagina1 = document.querySelector(".pagina1");
const paginaNaturaleza = document.querySelector(".paginaNaturaleza");
const paginaCiudad = document.querySelector(".paginaCiudad");
const videoContainer = document.querySelector(".videoContainer");
const video = document.getElementById("video");
const botonInicio = document.querySelector(".inicio");

const botonesCategoria = document.querySelectorAll("[data-info]");
const botonesVideo = document.querySelectorAll("[data-video]");


function ocultarTodo() {
    pagina1.classList.remove("display");
    pagina1.classList.add("hidden");
    paginaNaturaleza.classList.remove("display");
    paginaNaturaleza.classList.add("hidden");
    paginaCiudad.classList.remove("display");
    paginaCiudad.classList.add("hidden");
    videoContainer.classList.add("hidden");
}


botonesCategoria.forEach(boton => {
    boton.addEventListener("click", () => {
        const info = boton.dataset.info;

        ocultarTodo();

        if (info === "naturaleza") {
            paginaNaturaleza.classList.remove("hidden");
            paginaNaturaleza.classList.add("display");
        }

        if (info === "ciudad") {
            paginaCiudad.classList.remove("hidden");
            paginaCiudad.classList.add("display");
        }

        if (info === "inicio") {
            pagina1.classList.remove("hidden");
            video.src = "";
        }
    });
});


botonesVideo.forEach(boton => {
    boton.addEventListener("click", () => {
        const url = boton.dataset.video;

        ocultarTodo();
        videoContainer.classList.remove("hidden");
        video.src = url;
    });
});