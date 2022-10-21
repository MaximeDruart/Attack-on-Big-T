import menuBg from "/assets/img/MainMenu.png"
import buttons from "/assets/img/buttons-screens.png"
import menuSprite from "/assets/img/spritesheetMenu.png"
import { center } from "../constants"
import { gamepadEmulator, player1axis, player2axis } from "../axis"

class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: "MenuScene" })
  }

  preload() {
    this.load.spritesheet("menuBg", menuBg, { frameWidth: 640, frameHeight: 360 })
    this.load.spritesheet("menu-button-start", buttons, { frameWidth: 132, frameHeight: 64 })
    this.load.spritesheet("menu-button-score", buttons, { frameWidth: 132, frameHeight: 64 })
    this.load.spritesheet("menuSprite", menuSprite, { frameWidth: 640, frameHeight: 360 })
  }

  create() {
    this.anims.create({
      key: "button-start-press",
      frameRate: 30,
      frames: this.anims.generateFrameNumbers("menu-button-start", { start: 0, end: 3 }),
    })

    this.anims.create({
      key: "button-score-press",
      frameRate: 30,
      frames: this.anims.generateFrameNumbers("menu-button-score", { start: 4, end: 7 }),
    })

    this.anims.create({
      key: "menu-bg",
      frameRate: 1,
      frames: this.anims.generateFrameNumbers("menuBg", { start: 0, end: 1 }),
      repeat: -1,
    })
    this.anims.create({
      key: "menuSpriteAnim",
      frameRate: 8,
      frames: this.anims.generateFrameNumbers("menuSprite"),
      repeat: -1,
    })

    let background = this.add.sprite(0, 0, "menuBg")
    background.setOrigin(0, 0)
    let scaleX = this.cameras.main.width / background.width
    let scaleY = this.cameras.main.height / background.height
    let scale = Math.max(scaleX, scaleY)
    background.setScale(scale).setScrollFactor(0)

    this.startBtn = this.add.sprite(center.x - center.x / 4, center.y + center.y / 1.5, "menu-button-start")
    this.scoreBtn = this.add.sprite(center.x + center.x / 4, center.y + center.y / 1.5, "menu-button-score", 4)

    const keyDownHandler = this.keyDownHandler.bind(this)
    this.keyDownFn1 = (e) => keyDownHandler(e, 1)
    this.keyDownFn2 = (e) => keyDownHandler(e, 2)
    player1axis.addEventListener("keydown", this.keyDownFn1)
    player2axis.addEventListener("keydown", this.keyDownFn2)

    background.play("menuSpriteAnim")
  }

  keyDownHandler(e, playerNumber) {
    if (e.key === "a") {
      this.startBtn.play("button-start-press")
      setTimeout(() => {
        this.input.keyboard.enabled = false
        player1axis.removeEventListener("keydown", this.keyDownFn1)
        player2axis.removeEventListener("keydown", this.keyDownFn2)
        this.scene.start("WorldScene")
      }, 500)
    }
    if (e.key === "x") {
      this.scoreBtn.play("button-score-press")
      setTimeout(() => {
        this.input.keyboard.enabled = false
        player1axis.removeEventListener("keydown", this.keyDownFn1)
        player2axis.removeEventListener("keydown", this.keyDownFn2)
        this.scene.start("ScoreScene")
      }, 500)
    }
  }

  update() {
    gamepadEmulator.update()
  }
}

export default MenuScene
