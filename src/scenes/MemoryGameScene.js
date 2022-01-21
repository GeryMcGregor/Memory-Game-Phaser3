import Phaser from "phaser";

/*  ToDo: 
    /* Challange hal 86
    /* Kalo player ke atas dia ilang (mungkin ada kaitannya dengan background)
    /* Uncomment this.handleBearSelected();
    /* Uncomment this.checkForMatch();
*/

const level = [
  [1, 0, 3],
  [2, 4, 1],
  [3, 4, 2],
];

export default class MemoryGameScene extends Phaser.Scene {
  constructor() {
    super("memory-game-scene");
  }

  init() {
    this.halfWidth = this.scale.width / 2;
    this.halfHeight = this.scale.height / 2;
    this.boxGroup = undefined;
    this.player = undefined;
    this.cursors = this.input.keyboard.createCursorKeys();
    this.activeBox = undefined;
    this.itemsGroup = undefined;
    this.selectedBoxes = [];
    this.matchesCount = 0;
    this.timerLabel = undefined;
    this.countdownTimer = 40;
    this.timedEvent = undefined;
    // this.keyboard = this.input.keyboard.addKeys('W,A,S,D');
  }

  preload() {
    this.load.image("bg", "../images/bg.jpg");
    this.load.spritesheet("tilesheet", "../images/sokoban_tilesheet.png", {
      frameHeight: 64,
      frameWidth: 64,
    });
    this.load.image("chicken", "../images/chicken.png");
    this.load.image("duck", "../images/duck.png");
    this.load.image("bear", "../images/bear.png");
    this.load.image("parrot", "../images/parrot.png");
    this.load.image("penguin", "../images/penguin.png");
    this.load.image("play", "../images/play.png");
  }

  create() {
    this.add.image(this.halfWidth, 30, "bg").setScale(4);
    this.boxGroup = this.physics.add.staticGroup();

    this.createBoxes();
    this.player = this.createPlayer();

    this.physics.add.collider(
      this.player,
      this.boxGroup,
      this.handlePlayerBoxCollide,
      undefined,
      this
    );

    this.itemsGroup = this.add.group();
    this.timerLabel = this.add.text(
      this.halfWidth,
      this.halfHeight + 220,
      null
    );

    this.timedEvent = this.time.addEvent({
      delay: 1000,
      callback: this.gameOver,
      callbackScope: this,
      loop: true,
    });
  }

  update() {
    this.movePlayer(this.player);

    this.children.each((c) => {
      /** @type {Phaser.Physics.Arcade.Sprite} */
      // @ts-ignore
      const child = c;

      if (child.getData("sorted")) {
        return;
      }

      child.setDepth(child.y);
    });

    this.updateActiveBox();

    this.timerLabel
      .setStyle({
        fontSize: "24px",
        fill: "#ffffff",
        fontStyle: "bold",
        align: "center",
      })
      .setText(this.countdownTimer);
  }

  createBoxes() {
    const width = this.scale.width;
    let xPer = 0.25;
    let y = 150;

    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        this.boxGroup
          .get(width * xPer, y, "tilesheet", 8)
          .setData("itemType", level[row][col])
          .setSize(64, 32)
          .setOffset(0, 32);
        xPer += 0.25;
      }

      xPer = 0.25;
      y += 150;
    }
  }

  createPlayer() {
    const player = this.physics.add
      .sprite(this.halfWidth, this.halfHeight + 30, "tilesheet")
      .setSize(40, 16)
      .setOffset(12, 38);

    player.setCollideWorldBounds(true);
    this.anims.create({
      key: "standby",
      frames: [{ key: "tilesheet", frame: 52 }],
    });

    this.anims.create({
      key: "down",
      frames: this.anims.generateFrameNumbers("tilesheet", {
        start: 52,
        end: 54,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "up",
      frames: this.anims.generateFrameNumbers("tilesheet", {
        start: 55,
        end: 57,
      }),
      frameRate: 10,
    });
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("tilesheet", {
        start: 81,
        end: 83,
      }),
      frameRate: 10,
    });
    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("tilesheet", {
        start: 78,
        end: 80,
      }),
      frameRate: 10,
    });

    return player;
  }

  movePlayer(player) {
    if (!this.player.active) {
      return;
    }
    const speed = 200;

    if (this.cursors.left.isDown) {
      this.player.setVelocity(-speed, 0);
      this.player.anims.play("left", true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocity(speed, 0);
      this.player.anims.play("right", true);
    } else if (this.cursors.up.isDown) {
      this.player.setVelocity(0, -speed);
      this.player.anims.play("up", true);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocity(0, speed);
      this.player.anims.play("down", true);
    } else {
      this.player.setVelocity(0, 0);
      this.player.anims.play("standby", true);
    }

    const spaceJustPressed = Phaser.Input.Keyboard.JustUp(this.cursors.space);
    if (spaceJustPressed && this.activeBox) {
      this.openBox(this.activeBox);
      this.activeBox.setFrame(8);
      this.activeBox = undefined;
    }
  }

  handlePlayerBoxCollide(player, box) {
    if (this.activeBox) {
      return;
    }
    this.activeBox = box;
    this.activeBox.setFrame(6);

    const opened = box.getData("opened");
    if (opened) {
      return;
    }
  }

  updateActiveBox() {
    if (!this.activeBox) {
      return;
    }

    const distance = Phaser.Math.Distance.Between(
      this.player.x,
      this.player.y,
      this.activeBox.x,
      this.activeBox.y
    );

    if (distance < 64) {
      return;
    }
    this.activeBox.setFrame(8);
    this.activeBox = undefined;
  }

  handleBearSelected() {
    const { box, item } = this.selectedBoxes.pop();
    item.setTint(0xff0000);
    item.setFrame(20);

    this.player.active = false;
    this.player.setVelocity(0, 0);

    this.time.delayedCall(3000, () => {
      item.setTint(0xffffff);
      box.setFrame(8); //setFrame(7) untuk box biru
      box.setData("opened", false);

      this.tweens.add({
        targets: item,
        y: "+=50",
        alpha: 0,
        scale: 0,
        duration: 300,
        onComplete: () => {
          this.player.active = true;
        },
      });
    });
  }

  checkForMatch() {
    const second = this.selectedBoxes.pop();
    const first = this.selectedBoxes.pop();

    if (first.item.texture !== second.item.texture) {
      this.tweens.add({
        targets: [first.item, second.item],
        y: "+=50",
        alpha: 0,
        scale: 0,
        duration: 300,
        delay: 1000,
        onComplete: () => {
          this.itemsGroup.killAndHide(first.item);
          this.itemsGroup.killAndHide(second.item);

          first.box.setData("opened", false);
          second.box.setData("opened", false);
        },
      });
      return;
    }

    ++this.matchesCount;

    this.time.delayedCall(1000, () => {
      first.box.setFrame(7); //awalnya setFrame(8)
      second.box.setFrame(7); //awalnya setFrame(8)

      if (this.matchesCount >= 4) {
        this.player.active = false;
        this.player.setVelocity(0, 0);

        // this.add
        //   .text(this.halfWidth, this.halfHeight + 250, "You Win !", {
        //     // @ts-ignore
        //     fontSize: 60,
        //   })
        //   .setOrigin(0.5);
        this.countdownTimer = undefined;

        this.scene.start("game-win");
      }
    });
  }

  openBox(box) {
    if (!box) {
      return;
    }

    const itemType = box.getData("itemType");
    let item;

    switch (itemType) {
      case 0:
        item = this.itemsGroup.get(box.x, box.y);
        item.setTexture("bear");
        break;

      case 1:
        item = this.itemsGroup.get(box.x, box.y);
        item.setTexture("chicken");
        break;

      case 2:
        item = this.itemsGroup.get(box.x, box.y);
        item.setTexture("duck");
        break;

      case 3:
        item = this.itemsGroup.get(box.x, box.y);
        item.setTexture("parrot");
        break;

      case 4:
        item = this.itemsGroup.get(box.x, box.y);
        item.setTexture("penguin");
        break;

      // default:
      //     break;
    }

    if (!item) {
      return;
    }
    box.setData("opened", true);

    item.setData("sorted", true);
    item.setDepth(2000);
    item.setActive(true);
    item.setVisible(true);

    item.scale = 0;
    item.alpha = 0;

    this.selectedBoxes.push({ box, item });

    this.tweens.add({
      targets: item,
      y: "-=50",
      alpha: 1,
      scale: 1,
      duration: 500,
      onComplete: () => {
        if (itemType === 0) {
          this.handleBearSelected();
          return;
        }
        if (this.selectedBoxes.length < 2) {
          return;
        }
        this.checkForMatch();
      },
    });
  }

  gameOver() {
    this.countdownTimer = parseInt(this.countdownTimer);
    this.countdownTimer -= 1;
    if (this.countdownTimer == 0) {
      // @ts-ignore
      this.add
        .text(this.halfWidth, this.halfHeight + 250, "You Lose !", {
          // @ts-ignore
          fontSize: 60,
        })
        .setOrigin(0.5);
      this.countdownTimer = undefined;
      this.player.active = false;
      this.player.setVelocity(0, 0);

      this.scene.start("game-over");
    }
  }
}
