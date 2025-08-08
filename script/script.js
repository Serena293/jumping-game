const player = document.getElementById("player");
const rock1 = document.getElementById("rock1");
const rock2 = document.getElementById("rock2");
const displayScore = document.getElementById("score");
const modal = document.getElementById("gameModal");
const modalTitle = document.getElementById("modalTitle");
const modalMessage = document.getElementById("modalMessage");
const modalBtn = document.getElementById("modalBtn");
const stopBtn = document.getElementById("stopBtn");
const gameContainer = document.querySelector(".game");
const timePhases = ["morning", "afternoon", "evening", "night"];

const sun = document.getElementById("sun");
const moon = document.getElementById("moon");
const stars = document.getElementById("stars");

let currentPhase = Math.floor(Math.random() * timePhases.length);

let score = 0;
let scored = false;

let isJumping = false;
let canDoubleJump = false;

let rockSpawnInterval;

let isAlive;

const changeTimeOfDay = () => {
  gameContainer.classList.remove(...timePhases);
  gameContainer.classList.add(timePhases[currentPhase]);

  sun.style.opacity = 0;
  moon.style.opacity = 0;
  stars.style.opacity = 0;

  switch (timePhases[currentPhase]) {
    case "morning":
    case "afternoon":
      sun.style.opacity = 1;
      break;
    case "evening":
      moon.style.opacity = 1;
      break;
    case "night":
      moon.style.opacity = 1;
      stars.style.opacity = 1;
      break;
  }
  currentPhase = (currentPhase + 1) % timePhases.length;
};

setInterval(changeTimeOfDay, 10000);

const jump = () => {
  if (!isJumping) {
    isJumping = true;
    canDoubleJump = true;

    player.classList.add("jump");

    setTimeout(() => {
      player.classList.remove("jump");
      player.classList.add("jumping");
      if (!player.classList.contains("jump2")) {
        isJumping = false;
      }
    }, 750);
  } else if (canDoubleJump && !player.classList.contains("jump2")) {
    jump2();
  }
};

const jump2 = () => {
  canDoubleJump = false;
  player.classList.remove("jump");
  player.classList.add("jump2");

  setTimeout(() => {
    player.classList.remove("jump2");
    isJumping = false;
  }, 300);
};

document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    player.classList.remove("jumping");
    jump();
  }
});

const restartAnimation = (element) => {
  element.style.display = "none";
  element.style.animation = "none";
  element.offsetHeight;
  element.style.display = "block";
  element.style.animation = "object-animation linear 2s";
};

const spawnRock = () => {
  rock1.style.display = "none";
  rock2.style.display = "none";

  const random = Math.random() < 0.5 ? rock1 : rock2;
  restartAnimation(random);

  rockSpawnInterval = setTimeout(spawnRock, 2200);
};

const startGame = () => {
  score = 0;
  displayScore.textContent = score;
  player.style.top = "570px";

  if (isAlive) clearInterval(isAlive);
  if (rockSpawnInterval) clearInterval(rockSpawnInterval);

  rock1.style.animation = "none";
  rock2.style.animation = "none";

  const countdownEl = document.getElementById("countdown");
  countdownEl.style.display = "block";

  let countdownValue = 3;
  countdownEl.textContent = countdownValue;

  const countdownInterval = setInterval(() => {
    countdownValue--;
    if (countdownValue > 0) {
      countdownEl.textContent = countdownValue;
    } else {
      clearInterval(countdownInterval);
      countdownEl.textContent = "GO!";
      setTimeout(() => {
        countdownEl.style.display = "none";

        spawnRock();

        isAlive = setInterval(() => {
          const playerTop = parseInt(
            window.getComputedStyle(player).getPropertyValue("top")
          );
          const rock1Left = parseInt(
            window.getComputedStyle(rock1).getPropertyValue("left")
          );
          const rock2Left = parseInt(
            window.getComputedStyle(rock2).getPropertyValue("left")
          );

          const isCollisionDetected =
            (rock1Left < 155 && rock1Left > 55 && playerTop >= 520) ||
            (rock2Left < 155 && rock2Left > 55 && playerTop >= 500);

          if (!isCollisionDetected) {
            score += 1;
            displayScore.textContent = score;
          } else {
            clearInterval(isAlive);
            clearTimeout(rockSpawnInterval);
            setTimeout(() => {
              showModal(
                "Game Over",
                `Nice try!\nYou've scored ${score} points.`,
                "Play Again",
                startGame
              );
            }, 100);
          }
        }, 50);
      }, 1000);
    }
  }, 1000);
};

const showModal = (title, message, buttonText, callback) => {
  modalTitle.textContent = title;
  modalMessage.textContent = message;
  modalBtn.textContent = buttonText;
  modal.classList.add("show");

  modalBtn.onclick = () => {
    modal.classList.remove("show");
    if (callback) callback();
  };
};

stopBtn.addEventListener("click", () => {
  clearInterval(isAlive);
  clearTimeout(rockSpawnInterval);
  showModal("Game ended", `Your score: ${score}`, "Play Again", startGame);
});

window.addEventListener("load", () => {
  showModal(
    "Welcome",
    'In game controls:\n- Press "Space" to jump\n- Press "Space" again in the air to rotate\n\nTip: Jump early to avoid collisions.',
    "Start",
    () => {
      startGame();
      changeTimeOfDay();
    }
  );
});
