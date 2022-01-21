import Phaser from "phaser";

export default class gameOver extends Phaser.Scene {
  constructor() {
    super("game-over");
  }

  preload() {
    this.load.image("gameOverText", "../images/gameover.png");
    this.load.image("bg", "../images/bg.jpg");
  }

  create() {
    const gameHeight = this.scale.height * 0.5;
    const gameWidth = this.scale.width * 0.5;
    this.add.image(gameWidth, 30, "bg").setScale(4);
    this.add.image(gameWidth, gameHeight, "gameOverText");
    this.add
        .text(gameHeight + 150, gameWidth + 150, "You Lose !", {
          // @ts-ignore
          fontSize: 60,
        })
        .setOrigin(0.5);
  }
}
