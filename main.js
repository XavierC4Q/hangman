class Game {
  constructor(props) {
    this.incorrect = 0;
    this.lettersUsed = [];
    this.complete = false;
  }

  async init() {
    try {
      const res = await fetch("https://random-words-api.vercel.app/word");
      const data = await res.json();
      const word = data[0].word.toUpperCase();

      this.word = word;
      this.progress = word.split("").map(() => null);
    } catch (e) {
      return console.log(e);
    }
  }

  guess(letter) {
    this.lettersUsed.push(letter);

    if (!this.word.includes(letter)) {
      this.incorrect += 1;
      return false;
    } else {
      this.word.split("").forEach((w, i) => {
        if (w === letter) {
          this.progress[i] = letter;
          const letterDisplay = document.getElementById(`idx-${i}`);
          letterDisplay.innerText = w;
        }
      });
      return true;
    }
  }

  hasLost() {
    return this.incorrect === 6;
  }

  hasWon() {
    return this.progress.every((w) => w !== null);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const game = await initializeHangman();
  createWordDisplay(game);
  createLetterSelections(game);
});

async function initializeHangman() {
  const game = new Game();
  await game.init();
  drawGallows();
  return game;
}

function drawGallows() {
  const canvas = document.getElementById("hangman");
  const c = canvas.getContext("2d");

  c.clearRect(0, 0, canvas.width, canvas.height);
  c.strokeStyle = "#030303";
  c.lineWidth = 10;
  c.beginPath();
  c.moveTo(175, 225);
  c.lineTo(5, 225);
  c.moveTo(25, 225);
  c.lineTo(25, 5);
  c.lineTo(125, 5);
  c.lineTo(125, 25);
  c.stroke();
}

function createWordDisplay(game) {
  const word = game.word;
  const wordDisplay = document.getElementById("word");

  const wordFillers = word.split("").map((_, i) => {
    const letterDisplay = document.createElement("span");
    letterDisplay.id = `idx-${i}`;
    letterDisplay.className = "letter-display";
    letterDisplay.innerText = "_";

    return letterDisplay;
  });

  wordDisplay.append(...wordFillers);
}

function createLetterSelections(game) {
  const selections = document.getElementById("selections");
  const alphabet = [...Array(26)]
    .map((_, y) => String.fromCharCode(y + 65))
    .join("");

  const letterBtns = alphabet.split("").map((letter) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "letter-select";
    btn.innerText = letter;
    btn.addEventListener("click", () => {
      const guessResult = game.guess(letter);
      btn.disabled = true;
      if (guessResult) {
        btn.className += " correct";
      } else {
        btn.className += " incorrect";
        drawHangman(game.incorrect);
      }
      handleGameComplete(game);
    });
    return btn;
  });

  selections.append(...letterBtns);
}

function drawHangman(incorrectCount) {
  const canvas = document.getElementById("hangman");
  const context = canvas.getContext("2d");

  const draws = ["head", "body", "rightArm", "leftArm", "rightLeg", "leftLeg"];

  const bodyPart = draws[incorrectCount - 1];

  switch (bodyPart) {
    case "head":
      context.lineWidth = 5;
      context.beginPath();
      context.arc(125, 50, 25, 0, Math.PI * 2, true);
      context.closePath();
      context.stroke();
      break;

    case "body":
      context.beginPath();
      context.moveTo(125, 75);
      context.lineTo(125, 140);
      context.stroke();
      break;

    case "rightArm":
      context.beginPath();
      context.moveTo(125, 85);
      context.lineTo(60, 100);
      context.stroke();
      break;

    case "leftArm":
      context.beginPath();
      context.moveTo(125, 85);
      context.lineTo(185, 100);
      context.stroke();
      break;

    case "rightLeg":
      context.beginPath();
      context.moveTo(125, 140);
      context.lineTo(105, 190);
      context.stroke();
      break;

    case "leftLeg":
      context.beginPath();
      context.moveTo(125, 140);
      context.lineTo(150, 190);
      context.stroke();
      break;
  }
}

function handleGameComplete(game) {
  const hasLost = game.hasLost();
  const hasWon = game.hasWon();

  if (hasLost || hasWon) {
    game.complete = true;

    let message = hasWon ? "YOU HAVE WON!" : "YOU HAVE LOST!";

    setTimeout(async () => {
      const tryAgain = confirm(message);

      if (tryAgain) {
        const newGame = await initializeHangman();
        const wordDisplay = document.getElementById("word");
        const selections = document.getElementById("selections");

        while (wordDisplay.hasChildNodes()) {
          wordDisplay.removeChild(wordDisplay.firstChild);
        }

        while (selections.hasChildNodes()) {
          selections.removeChild(selections.firstChild);
        }
        createWordDisplay(newGame);
        createLetterSelections(newGame);
      }
    }, 500);
  }
}
