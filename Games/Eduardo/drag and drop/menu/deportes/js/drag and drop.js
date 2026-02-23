const sports = [
    "Futbol",
    "Bàsquet",
    "Tennis",
    "Natació",
    "Atletisme",
    "Ciclisme",
    "Boxa",
    "Golf",
    "Handbol",
    "Beisbol",
    "Hoquei",
    "Esquí",
    "Rugby",
    "Pàdel",
    "Petanca"
];

let currentIndex = 0;

const sportImage = document.getElementById("sportImage");
const namesContainer = document.getElementById("namesContainer");
const message = document.getElementById("message");
const finalScreen = document.getElementById("finalScreen");

function loadSport() {
    if (currentIndex >= sports.length) {
        document.querySelector(".game-container").classList.add("hidden");
        finalScreen.classList.remove("hidden");
        return;
    }

    const sportName = sports[currentIndex];
    const fileName = sportName.toLowerCase()
        .replace(/ /g, "")
        .replace(/à/g,"a")
        .replace(/è/g,"e")
        .replace(/é/g,"e")
        .replace(/í/g,"i")
        .replace(/ò/g,"o")
        .replace(/ó/g,"o")
        .replace(/ú/g,"u")
        .replace(/ç/g,"c");

    sportImage.src = "img/" + fileName + ".jpg";

    generateOptions(sportName);
}

function generateOptions(correctName) {
    namesContainer.innerHTML = "";
    message.textContent = "";

    let options = [correctName];

    while (options.length < 4) {
        let randomName = sports[Math.floor(Math.random() * sports.length)];
        if (!options.includes(randomName)) {
            options.push(randomName);
        }
    }

    options.sort(() => Math.random() - 0.5);

    options.forEach(name => {
        const div = document.createElement("div");
        div.classList.add("name");
        div.textContent = name;
        div.draggable = true;

        div.addEventListener("dragstart", dragStart);

        namesContainer.appendChild(div);
    });
}

sportImage.addEventListener("dragover", (e) => e.preventDefault());
sportImage.addEventListener("drop", drop);

function dragStart(e) {
    e.dataTransfer.setData("text", e.target.textContent);
}

function drop(e) {
    const draggedName = e.dataTransfer.getData("text");
    const correctName = sports[currentIndex];

    if (draggedName === correctName) {
        message.textContent = "Correcte!";
        message.className = "correct";
        currentIndex++;
        setTimeout(loadSport, 1000);
    } else {
        message.textContent = "No és correcte. Torna-ho a intentar.";
        message.className = "incorrect";
    }
}

function restartGame() {
    currentIndex = 0;
    finalScreen.classList.add("hidden");
    document.querySelector(".game-container").classList.remove("hidden");
    loadSport();
}

loadSport();