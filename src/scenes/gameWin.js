import Phaser from "phaser";

export default class gameWin  extends Phaser.Scene{
    constructor() {
        super("game-win");
    }

    preload() {
        this.load.image('gameOverText', '../images/gameover.png');
        this.load.image("bg", "../images/bg.jpg");
    }

    create() {
        const gameHeight = this.scale.height * 0.5;
        const gameWidth = this.scale.width * 0.5; 
        this.add.image(gameWidth, 30, "bg").setScale(4);    
        this.add
        .text(gameHeight, gameWidth, "You Win !", {
          // @ts-ignore
          fontSize: 60,
        })
        .setOrigin(0.5);
    }
}