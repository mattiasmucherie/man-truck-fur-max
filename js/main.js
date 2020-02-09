const canvas = document.getElementById("leinwand");
const playground = canvas.getContext("2d");

let x = 0;
let y = 0;
const truckWidth = 60;
let rightPressed = false;
let leftPressed = false;
let downPressed = false;
let score;
let tact;
let gameOver = false;

let gameSpeed = 5;
let gameSpeedIncrement = 0.5;
let minEnemySpeed = -2;
let maxEnemySpeed = 2;
let highScore = 0;

// Generates a random number between minValue and maxValue
// And it makes it so that you can define a value you are not allowed to stay on
// I used it for the movement since we don't want 0 movement.
// But that argument is optional,  you can call the function with randomNumber(0,1)
// if you so desire.
var modal = document.getElementById("gameover");

const randomNumber = (minValue, maxValue, notAllowed) => {
  const value = Math.floor(
    Math.floor(Math.random() * (maxValue - minValue) + minValue)
  );
  if (notAllowed || value === notAllowed) {
    return randomNumber(minValue, maxValue, notAllowed);
  }
  return value;
};

let targetY = canvas.height - truckWidth;
let targetX = randomNumber(0, canvas.width - truckWidth);
let enemyPosition = [1, 10, 60, 150, 600];
const enemyMovement = [0, 0, 0, 0, 0];

const firstEnemy = 335;
const distEnemy = 65;
const audio = new Audio("./assets/loewengebruell_IAA2016.mp3");

const startGame = () => {
  clearInterval(tact);
  gameOver = false;
  for (let i = 0; i < 5; i -= -1) {
    enemyMovement[i] = randomNumber(
      minEnemySpeed - gameSpeed,
      maxEnemySpeed + gameSpeed,
      0
    );
  }
  score = 0;
  y = 0;
  tact = setInterval(draw, 20);
  highScore = localStorage.getItem("highscore");
};

startGame();

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = true;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = true;
  } else if (e.key === "Down" || e.key === "ArrowDown") {
    downPressed = true;
  } else if (e.key === "Space" || gameOver === true) {
    clearInterval(tact);
    startGame();
    modal.style.display = "none";
  }
}
function keyUpHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = false;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
  } else if (e.key == "Down" || e.key == "ArrowDown") {
    downPressed = false;
  }
}

const drawTarget = () => {
  const image = new Image();
  image.src = "./assets/images/MAN_Loewe.png";
  playground.drawImage(image, targetX, targetY);
};

const targetCollision = () => {
  if (
    x < targetX + truckWidth &&
    x + truckWidth > targetX &&
    y <= targetY + truckWidth &&
    y + truckWidth >= targetY
  ) {
    audio.play();
    targetX = randomNumber(0, canvas.width - truckWidth);
    score++;

    y = 0;
    gameSpeed += gameSpeedIncrement;
    for (let i = 0; i < 5; i -= -1) {
      enemyMovement[i] = randomNumber(
        minEnemySpeed - gameSpeed,
        maxEnemySpeed + gameSpeed,
        0
      );
    }
  }
};

const checkEnemyCollision = () => {
  for (i = 0; i < enemyPosition.length; i++) {
    var enemy = firstEnemy - i * distEnemy;
    if (
      x < enemyPosition[i] + truckWidth &&
      x + truckWidth > enemyPosition[i] &&
      y < enemy + truckWidth &&
      y + truckWidth > enemy
    ) {
      enemyCollision();
    }
  }
};
const enemyCollision = () => {
  clearInterval(tact);
  modal.style.display = "block";
  gameOver = true;
  const spanHighscore = document.getElementById("highscore");
  if (score > highScore) {
    spanHighscore.textContent = score;
    localStorage.setItem("highscore", score);
  } else {
    spanHighscore.textContent = highScore;
  }
};

const drawEnemy = () => {
  for (i = 0; i < enemyPosition.length; i++) {
    enemyPosition[i] += enemyMovement[i];
    if (enemyPosition[i] + truckWidth >= canvas.width) {
      enemyMovement[i] = -Math.abs(enemyMovement[i]);
    }
    if (enemyPosition[i] <= 0) {
      enemyMovement[i] = Math.abs(enemyMovement[i]);
    }
    createEnemy(enemyPosition[i], firstEnemy - i * distEnemy);
  }
};
const createEnemy = (fx, fy) => {
  const image = new Image();
  image.src = "./assets/images/feind.png";
  playground.drawImage(image, fx, fy);
};

const drawPlayer = () => {
  const image = new Image();
  if (score < 5) {
    image.src = "./assets/images/truck.png";
  } else if (score < 10) {
    image.src = "./assets/images/newPlayer.png";
  } else {
    image.src = "./assets/images/bestPlayer.png";
  }

  playground.drawImage(image, x, y);
};

function draw() {
  playground.clearRect(0, 0, canvas.width, canvas.height);
  playground.globalAlpha = 0.05;
  const backgroundImage = new Image();
  backgroundImage.src = "./assets/images/man-logo.png";
  playground.drawImage(backgroundImage, 0, 15, 780, 432);
  playground.globalAlpha = 0.5;
  playground.font = "30px Roboto";
  playground.fillText(`Score: ${score}`, 650, 30);
  playground.globalAlpha = 1;

  drawPlayer();
  drawTarget();
  drawEnemy();
  checkEnemyCollision();
  targetCollision();
  if (rightPressed) {
    if (x + truckWidth < canvas.width) {
      x += 5;
    }
  }
  if (leftPressed) {
    if (x > 0) {
      x -= 5;
    }
  }
  if (downPressed) {
    if (y + truckWidth < canvas.height) {
      y += 5;
    }
  }
}
