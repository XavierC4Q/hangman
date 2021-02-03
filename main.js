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
      const word = data[0].word.toLowerCase();
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
});
