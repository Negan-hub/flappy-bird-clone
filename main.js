const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Make canvas full screen
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Bird setup
let bird = {
  x: 150,
  y: 250,
  width: 30,
  height: 30,
  gravity: 0.3,
  velocity: 0,
  lift: -6
};

let pipes = [];
let pipeGap = 180;
let pipeWidth = 60;
let pipeSpeed = 1.2;
let frame = 0;
let score = 0;
let gameOver = false;

// Optional sound
const flapSound = new Audio("flap.wav");

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && !gameOver) {
    bird.velocity = bird.lift;
    flapSound.currentTime = 0;
    flapSound.play();
  } else if (e.code === "Space" && gameOver) {
    resetGame();
  }
});

function drawBird() {
  ctx.fillStyle = "yellow";
  ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
  ctx.fillStyle = "green";
  for (let p of pipes) {
    ctx.fillRect(p.x, 0, pipeWidth, p.top);
    ctx.fillRect(p.x, p.bottom, pipeWidth, canvas.height - p.bottom);
  }
}

function updatePipes() {
  if (frame % 120 === 0) {
    let top = Math.random() * (canvas.height - pipeGap - 200) + 20;
    let bottom = top + pipeGap;
    pipes.push({ x: canvas.width, top, bottom });
  }

  for (let i = pipes.length - 1; i >= 0; i--) {
    pipes[i].x -= pipeSpeed;

    // Collision detection
    if (
      bird.x < pipes[i].x + pipeWidth &&
      bird.x + bird.width > pipes[i].x &&
      (bird.y < pipes[i].top || bird.y + bird.height > pipes[i].bottom)
    ) {
      gameOver = true;
    }

    // Increase score
    if (pipes[i].x + pipeWidth === bird.x) {
      score++;
    }

    // Remove off-screen pipes
    if (pipes[i].x + pipeWidth < 0) {
      pipes.splice(i, 1);
    }
  }
}

function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "24px sans-serif";
  ctx.fillText("Score: " + score, 20, 40);
}

function update() {
  if (gameOver) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "36px sans-serif";
    ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2 - 20);
    ctx.font = "24px sans-serif";
    ctx.fillText("Press Space to Restart", canvas.width / 2 - 130, canvas.height / 2 + 20);
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Apply gravity
  bird.velocity += bird.gravity;
  if (bird.velocity > 5) bird.velocity = 5;
  bird.y += bird.velocity;

  // Check boundaries
  if (bird.y + bird.height > canvas.height || bird.y < 0) {
    gameOver = true;
  }

  drawBird();
  updatePipes();
  drawPipes();
  drawScore();

  frame++;
  requestAnimationFrame(update);
}

function resetGame() {
  bird.y = canvas.height / 2;
  bird.velocity = 0;
  pipes = [];
  score = 0;
  frame = 0;
  gameOver = false;
  update();
}

update();
