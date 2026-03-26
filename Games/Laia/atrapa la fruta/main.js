const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const scoreText = document.getElementById("score")
const reloadBtn = document.getElementById("home")

document.addEventListener("click", () => {
})

let score = 0;

const player = {
  x: 300,
  y: 575,
  size: 75,
};

let items = [];
const emojisArray = Array.from("🍇🍎🍌🍉🥪🍔🌭🍫🍟🧀🥩🥕🌽🥐🧁🍭🥑🍋🍋‍🟩🍓🌯");
let spawnTimer = 0;

function updatePlayerFromClientX(clientX) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const x = (clientX - rect.left) * scaleX - player.size / 2;
  player.x = Math.max(0, Math.min(canvas.width - player.size, x));
}

canvas.addEventListener("pointermove", (e) => {
  updatePlayerFromClientX(e.clientX);
});

canvas.addEventListener("pointerdown", (e) => {
  try {
    canvas.setPointerCapture(e.pointerId);
  } catch (_) {}
  updatePlayerFromClientX(e.clientX);
});

canvas.addEventListener("pointerup", (e) => {
  if (canvas.hasPointerCapture(e.pointerId)) {
    canvas.releasePointerCapture(e.pointerId);
  }
});

canvas.addEventListener("pointercancel", (e) => {
  if (canvas.hasPointerCapture(e.pointerId)) {
    canvas.releasePointerCapture(e.pointerId);
  }
});

function spawnItem() {
  items.push({
    x: Math.random() * (canvas.width - 40),
    y: -40,
    size: 40,
    speed: 1,
    char: emojisArray[Math.floor(Math.random() * emojisArray.length)],
  });
}

function checkCollision(player, item) {
  return (
    player.x < item.x + item.size &&
    player.x + player.size > item.x &&
    player.y < item.y + item.size &&
    player.y + player.size > item.y
  );
}

function update() {
  spawnTimer++;

  if (spawnTimer > 50) {
    spawnItem();
    spawnTimer = 0;
  }

  items.forEach((item) => {
    item.y += item.speed;

    if (checkCollision(player, item)) {
      score++;
      item.collected = true;
    }
  });

  items = items.filter((item) => !item.collected);
}

function drawPlayer() {
  ctx.font = "100px arial";
  ctx.fillText("🛒", player.x, player.y);
}

function drawItems() {
  items.forEach((item) => {
    ctx.font = `60px Arial`;
    ctx.fillText(item.char || "?", item.x, item.y);
  });
}

function drawScore() {
  scoreText.innerText = score
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawPlayer();
  drawItems();
  drawScore();
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
