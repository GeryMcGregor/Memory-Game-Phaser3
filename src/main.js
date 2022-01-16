import Phaser from 'phaser'
import MemoryGameScene from '../src/scenes/MemoryGameScene';

const config = {
	type: Phaser.AUTO,
	width: 720,
	height: 680,
	scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 }
		}
	},
	scene: [MemoryGameScene]
}

export default new Phaser.Game(config)
