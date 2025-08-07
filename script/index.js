const player = document.getElementById("player");
const object = document.getElementById("object");
const displayScore = document.getElementById("score"); // This should be the <span> with "0"

let score = 0;
let scored = false;

const jump = () => {
  if (!player.classList.contains("jump")) {
    player.classList.add("jump");
    setTimeout(() => {
      player.classList.remove("jump");
    }, 400);
  }
};

document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    event.preventDefault();
    jump();
  }
});

const isAlive = () => {
  const interval = setInterval(() => {
    const playerRect = player.getBoundingClientRect();
    const objectRect = object.getBoundingClientRect();

    const buffer = 10;

   
    if (
      playerRect.right > objectRect.left + buffer &&
      playerRect.left < objectRect.right - buffer &&
      playerRect.bottom > objectRect.top + buffer &&
      playerRect.top < objectRect.bottom - buffer
    ) {
      alert(`Game over. Score: ${score}` );
      clearInterval(interval);
    }

 
    if (objectRect.right < playerRect.left && !scored) {
      score += 10;
      displayScore.textContent = score;
      scored = true;
    }

    
    if (objectRect.left > window.innerWidth) {
      scored = false;
    }
  }, 50);
};

isAlive();
