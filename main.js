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
    if (!this.word.includes(letter)) {
      this.incorrect += 1;
    } else {
      this.lettersUsed.push(letter);
      this.word.split("").forEach((w, i) => {
        if (w === letter) {
          this.progress[i] = letter;
          const letterDisplay = document.getElementById(`idx-${i}`);
          letterDisplay.innerText = w;
        }
      });
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
  const game = new Game();
  await game.init();

  const wordDisplay = document.getElementById("word");
  wordDisplay.append(...createWordDisplay(game));

  const selections = document.getElementById("selections");
  selections.append(...createLetterSelections(game));
});

// WORD DISPLAY
/**
 *
 * Going to need a way to tag these elements so they can be dynamically updated
 */
function createWordDisplay(game) {
  const word = game.word;

  return word.split("").map((w, i) => {
    const letterDisplay = document.createElement("span");
    letterDisplay.id = `idx-${i}`;
    letterDisplay.className = "letter-display";
    letterDisplay.innerText = "_";

    return letterDisplay;
  });
}

// LETTER BUTTONS
function createLetterSelections(game) {
  const alphabet = [...Array(26)]
    .map((_, y) => String.fromCharCode(y + 65))
    .join("");

  return alphabet.split("").map((letter) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "letter-select";
    btn.innerText = letter;
    btn.addEventListener("click", () => {
      game.guess(letter);
      btn.disabled = true;
    });
    return btn;
  });
}
