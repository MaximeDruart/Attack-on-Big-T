import menuBg from '/assets/img/MainMenu.png'

class MenuScene extends Phaser.Scene {
    constructor() {
        super({key: 'MenuScene'})
    }

    preload() {
        this.load.spritesheet('menuBg', menuBg, { frameWidth: 640, frameHeight: 360 })
    }

    create() {

        this.anims.create({
            key: "menu-bg",
            frameRate: 1,
            frames: this.anims.generateFrameNumbers("menuBg", { start: 0, end: 1 }),
            repeat: -1,
        })

        let background = this.add.sprite(0, 0, 'menuBg')
        background.setOrigin(0, 0)
        let scaleX = this.cameras.main.width / background.width
        let scaleY = this.cameras.main.height / background.height
        let scale = Math.max(scaleX, scaleY)
        background.setScale(scale).setScrollFactor(0)
        // this.add.image(this.game.renderer.width / 2, this.game.renderer.height * 0.20, "logo")
        // let playButton = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2, "startBtn")

        // // let titleText = this.add.text(100, 100, "BIG T INVADER")
        // // titleText.setScale(scale).setScrollFactor(0)

        // playButton.setInteractive(); 
        // playButton.on('pointerup', () => {
        //     this.scene.start('WorldScene')
        //     this.sound.stopAll('introTheme')
        // })

        // A ajouter quand passage sur borne

        this.cursors = this.input.keyboard.createCursorKeys()
        this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E)
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
        background.setInteractive(); 

        background.on('pointerup', () => {
            this.scene.start('WorldScene')
            // this.sound.stopAll('introTheme')>
        })
    }
}

export default MenuScene; 