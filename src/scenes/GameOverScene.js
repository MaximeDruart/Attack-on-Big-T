import GameOverBg from '/assets/img/GameOver.png'

class GameOverScene extends Phaser.Scene {
    constructor() {
        super({key: 'GameOverScene'})
    }

    preload() {
        this.load.spritesheet('gameOverBg', GameOverBg, { frameWidth: 640, frameHeight: 360 })

        
    }

    create() {
        this.anims.create({
            key: "menu-bg",
            frameRate: 1,
            frames: this.anims.generateFrameNumbers("GameOverBg", { start: 0, end: 1 }),
            repeat: -1,
        })

        let background = this.add.sprite(0, 0, 'GameOverBg')
        background.setOrigin(0, 0)
        let scaleX = this.cameras.main.width / background.width
        let scaleY = this.cameras.main.height / background.height
        let scale = Math.max(scaleX, scaleY)
        background.setScale(scale).setScrollFactor(0)
    }
}

export default GameOverScene; 