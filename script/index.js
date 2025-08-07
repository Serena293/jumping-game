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
  setInterval(() => {
    let playerTop = parseInt(window.getComputedStyle(player).getPropertyValue("top"));
    let playerLeft = parseInt(window.getComputedStyle(player).getPropertyValue("left"));
    let objectLeft = parseInt(window.getComputedStyle(object).getPropertyValue("left"));
    
    
 if (objectLeft < 200 && objectLeft > 0) {
      // Only game over if player is not jumping (top position is at ground level)
      if (playerTop >= 350 && !player.classList.contains("jump")) {
        alert("game over");
      }
    }
  }, 50);
};

isAlive();
