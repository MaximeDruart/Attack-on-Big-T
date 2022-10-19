import menuBg from "../assets/img/menuBg.png"
import startBtn from "../assets/img/buttonstart.png"
class GameOverScene extends Phaser.Scene {
    constructor() {
        super({key: 'GameOverScene'})
    }

    preload() {
        // this.load.image('logo', logo)
        this.load.image('startBtn', startBtn)
        this.load.image('menuBg', menuBg)
        // this.load.audio('introTheme', introTheme)
    }

    create() {
        this.sound.play('introTheme', {
            loop: true
        })
        let background = this.add.sprite(0, 0, 'menuBg')
        background.setOrigin(0, 0)
        let scaleX = this.cameras.main.width / background.width
        let scaleY = this.cameras.main.height / background.height
        let scale = Math.max(scaleX, scaleY)
        background.setScale(scale).setScrollFactor(0)
        this.add.image(this.game.renderer.width / 2, this.game.renderer.height * 0.20, "logo")
        let restartButton = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2, "startBtn")

        // let titleText = this.add.text(100, 100, "BIG T INVADER")
        // titleText.setScale(scale).setScrollFactor(0)

        restartButton.setInteractive(); 
        restartButton.on('pointerup', () => {
            this.scene.start('MenuScene')
        })
    }
}

export default GameOverScene; 