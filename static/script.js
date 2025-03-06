const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
let snake = [{ x: 10 * box, y: 10 * box }];
let direction = "RIGHT";
let food = {
  x: Math.floor(Math.random() * 20) * box,
  y: Math.floor(Math.random() * 20) * box,
};
let score = 0;

// Update direction on key press
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  else if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  else if (event.key === "ArrowLeft" && direction !== "RIGHT")
    direction = "LEFT";
  else if (event.key === "ArrowRight" && direction !== "LEFT")
    direction = "RIGHT";
});

// Game loop
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw food
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  // Move snake
  let newHead = { ...snake[0] };
  if (direction === "UP") newHead.y -= box;
  if (direction === "DOWN") newHead.y += box;
  if (direction === "LEFT") newHead.x -= box;
  if (direction === "RIGHT") newHead.x += box;

  // Check for collision (wall or itself)
  if (
    newHead.x < 0 ||
    newHead.x >= canvas.width ||
    newHead.y < 0 ||
    newHead.y >= canvas.height ||
    snake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)
  ) {
    alert("Game Over! Your score: " + score);
    score = 0;
    snake = [{ x: 10 * box, y: 10 * box }];
    direction = "RIGHT";
    updateHighScore();
    return;
  }

  // Eat food
  if (newHead.x === food.x && newHead.y === food.y) {
    score++;
    food = {
      x: Math.floor(Math.random() * 20) * box,
      y: Math.floor(Math.random() * 20) * box,
    };
  } else {
    snake.pop(); // Remove tail
  }

  snake.unshift(newHead); // Add new head

  // Draw snake
  ctx.fillStyle = "green";
  snake.forEach((segment) => ctx.fillRect(segment.x, segment.y, box, box));

  // Update score
  document.getElementById("score").textContent = score;
}

setInterval(draw, 100);

// Update high score via Flask
function updateHighScore() {
  fetch("/update_score", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ score }),
  })
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("highScore").textContent = data.high_score;
    });
}
