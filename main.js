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

// INITIALIZE HANGMAN
document.addEventListener("DOMContentLoaded", async () => {
  const game = await initializeHangman();
  createWordDisplay(game);
  createLetterSelections(game);
});

async function initializeHangman() {
  const game = new Game();
  await game.init();

  return game;
}

// WORD DISPLAY
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

// LETTER BUTTONS
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
      }
      handleGameComplete(game);
    });
    return btn;
  });

  selections.append(...letterBtns);
}

function handleGameComplete(game) {
  const hasLost = game.hasLost();
  const hasWon = game.hasWon();

  if (hasLost || hasWon) {
    game.complete = true;

    let message = hasWon ? "YOU HAVE WON!" : "YOU HAVE LOST!";

    const tryAgain = alert(message);

    if (tryAgain) {
    }
  }
}
