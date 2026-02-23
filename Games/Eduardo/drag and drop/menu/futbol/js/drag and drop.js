const players = [
    "Pelé",
    "Diego Maradona",
    "Lionel Messi",
    "Cristiano Ronaldo",
    "Gerard Piqué",
    "Iker Casillas",
    "Andrés Iniesta",
    "Carles Puyol",
    "Johan Cruyff",
    "Romário",
    "Rivaldo",
    "Alfredo Di Stéfano",
    "László Kubala",
    "Franz Beckenbauer",
    "Ronaldinho",
    "Gianluigi Buffon",
    "Ronaldo Nazário",
    "Zinedine Zidane",
    "Xavi Hernández",
    "Michel Platini"
];

let currentIndex = 0;

const playerImage = document.getElementById("playerImage");
const namesContainer = document.getElementById("namesContainer");
const message = document.getElementById("message");
const finalScreen = document.getElementById("finalScreen");

function loadPlayer() {
    if (currentIndex >= players.length) {
        document.querySelector(".game-container").classList.add("hidden");
        finalScreen.classList.remove("hidden");
        return;
    }

    const playerName = players[currentIndex];
    const fileName = playerName.toLowerCase()
        .replace(/ /g, "")
        .replace(/á/g,"a")
        .replace(/é/g,"e")
        .replace(/í/g,"i")
        .replace(/ó/g,"o")
        .replace(/ú/g,"u")
        .replace(/ñ/g,"n");

    playerImage.src = "img/" + fileName + ".jpg";

    generateOptions(playerName);
}

function generateOptions(correctName) {
    namesContainer.innerHTML = "";
    message.textContent = "";

    let options = [correctName];

    while (options.length < 4) {
        let randomName = players[Math.floor(Math.random() * players.length)];
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

playerImage.addEventListener("dragover", (e) => e.preventDefault());

playerImage.addEventListener("drop", drop);

function dragStart(e) {
    e.dataTransfer.setData("text", e.target.textContent);
}

function drop(e) {
    const draggedName = e.dataTransfer.getData("text");
    const correctName = players[currentIndex];

    if (draggedName === correctName) {
        message.textContent = "Correcte!";
        message.className = "correct";
        currentIndex++;
        setTimeout(loadPlayer, 1000);
    } else {
        message.textContent = "No és correcte. Torna-ho a intentar.";
        message.className = "incorrect";
    }
}

function restartGame() {
    currentIndex = 0;
    finalScreen.classList.add("hidden");
    document.querySelector(".game-container").classList.remove("hidden");
    loadPlayer();
}

loadPlayer();