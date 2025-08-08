const player = document.getElementById("player");
const rock1 = document.getElementById("rock1");
const rock2 = document.getElementById("rock2");
const displayScore = document.getElementById("score"); // This should be the <span> with "0"

const gameContainer = document.querySelector('.game');
const timePhases = ['morning', 'afternoon', 'evening', 'night'];

const sun = document.getElementById('sun');
const moon = document.getElementById('moon');
const stars = document.getElementById('stars');

let currentPhase = Math.floor(Math.random() * timePhases.length);

let score = 0;
let scored = false;

let isJumping = false;
let canDoubleJump = false;

let rockSpawnInterval;

let isAlive

const changeTimeOfDay = () => {
  gameContainer.classList.remove(...timePhases);
  gameContainer.classList.add(timePhases[currentPhase]);

  sun.style.opacity = 0;
  moon.style.opacity = 0;
  stars.style.opacity = 0;

  switch (timePhases[currentPhase]) {
    case 'morning':
    case 'afternoon':
      sun.style.opacity = 1;
      break;
    case 'evening':
      moon.style.opacity = 1;
      break;
    case 'night':
      moon.style.opacity = 1;
      stars.style.opacity = 1;
      break;
  }
  // Update index for next phase
  currentPhase = (currentPhase + 1) % timePhases.length;
};

// Change every 30 seconds
setInterval(changeTimeOfDay, 10000);

const jump = () => {
  if (!isJumping) {
    isJumping = true;
    canDoubleJump = true;

    player.classList.add("jump");

    setTimeout(() => {
      player.classList.remove("jump");
      player.classList.add("jumping")
      // Allow jump2 only during jump, not after landing
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
  player.classList.remove("jump"); // cancel base jump animation if needed
  player.classList.add("jump2");

  setTimeout(() => {
    player.classList.remove("jump2");
    isJumping = false;
  }, 300);
};

document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    player.classList.remove("jumping")
    jump();
  }
});

function restartAnimation(element) {
  element.style.display = "none";               // Hide blocks when game starts
  element.style.animation = "none";             // Reseting animation
  element.offsetHeight;                         // Force reflow
  element.style.display = "block"               // Show blocks
  element.style.animation = "object-animation linear 2s"; // Restart animation (not infinite)
}

//Random rock spam logic
function spawnRock() {
  // Hide both rocks first
  rock1.style.display = "none";
  rock2.style.display = "none";

  const random = Math.random() < 0.5 ? rock1 : rock2;
  restartAnimation(random);

  // Wait for animation to finish (2s), then call again
  rockSpawnInterval = setTimeout(spawnRock, 2200);
}

function startGame() {
  score = 0
  displayScore.textContent = score
  player.style.top = "570px"

  if (isAlive) clearInterval(isAlive);
  if (rockSpawnInterval) clearInterval(rockSpawnInterval);

  // Stop rock animations during countdown
  rock1.style.animation = "none";
  rock2.style.animation = "none";

  // Show countdown
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

        // Start game logic
        isAlive = setInterval(() => {
          const playerTop = parseInt(window.getComputedStyle(player).getPropertyValue("top"));
          const rock1Left = parseInt(window.getComputedStyle(rock1).getPropertyValue("left"));
          const rock2Left = parseInt(window.getComputedStyle(rock2).getPropertyValue("left"));

          const isCollisionDetected = (
            (rock1Left < 155 && rock1Left > 55 && playerTop >= 520) ||
            (rock2Left < 155 && rock2Left > 55 && playerTop >= 500)
          );

          if (!isCollisionDetected) {
            score += 1;
            displayScore.textContent = score;
          } else {
            clearInterval(isAlive);
            clearTimeout(rockSpawnInterval)
            setTimeout(() => {
              alert(`Game Over! Nice try\nYou've scored ${score} points.`);
              startGame(); // restart
            }, 100);
          }
        }, 50);
      }, 1000); // delay hiding "GO!" for 1 second
    }
  }, 1000);
}

alert('Welcome, click "OK" to begin');
alert('In game controls:\n -Use "space" button to jump\n -While in the air press "space" button again to perform rotation in the air\n\nGame advice:\nJump a bit in advance to avoid collisions.')
startGame();
changeTimeOfDay();