// import GameOverBg from "/assets/img/GameOver.png"
import GameOverBg from "/assets/img/spritesheetOver1.png"
import GameOverBgLoop from "/assets/img/spritesheetOver2.png"
import buttons from "/assets/img/buttons-screen-gameover.png"

import evilLaught from "/assets/audios/evil_laught.mp3"
import { center } from "../constants"
import { gamepadEmulator, player1axis, player2axis } from "../axis"
import Axis from "axis-api"

class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameOverScene" })
  }

  preload() {
    this.load.audio("evilLaught", evilLaught)

    this.load.spritesheet("GameOverBg", GameOverBg, { frameWidth: 640, frameHeight: 360 })
    this.load.spritesheet("GameOverBgLoop", GameOverBgLoop, { frameWidth: 640, frameHeight: 360 })
    this.load.spritesheet("menu-button-start", buttons, { frameWidth: 132, frameHeight: 64 })
    this.load.spritesheet("menu-button-score", buttons, { frameWidth: 132, frameHeight: 64 })
  }

  init(data) {
    this.score = data.score
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
      key: "gameOverStart",
      frameRate: 8,
      frames: this.anims.generateFrameNumbers("GameOverBg"),
    })
    this.anims.create({
      key: "gameOverLoop",
      frameRate: 8,
      frames: this.anims.generateFrameNumbers("GameOverBgLoop"),
      repeat: -1,
    })

    let background = this.add.sprite(0, 0, "GameOverBg")
    background.setOrigin(0, 0)
    let scaleX = this.cameras.main.width / background.width
    let scaleY = this.cameras.main.height / background.height
    let scale = Math.max(scaleX, scaleY)
    background.setScale(scale).setScrollFactor(0)

    this.startBtn = this.add.sprite(center.x - center.x / 4, center.y + center.y / 1.5, "menu-button-start")
    this.scoreBtn = this.add.sprite(center.x + center.x / 4, center.y + center.y / 1.5, "menu-button-score", 4)

    const keyDownHandler = this.keyDownHandler.bind(this)
    player1axis.addEventListener("keydown", (e) => keyDownHandler(e, 1))
    player2axis.addEventListener("keydown", (e) => keyDownHandler(e, 2))

    let music = this.sound.add("evilLaught", {
      volume: 1,
      loop: false,
    })

    music.play()
    background.play("gameOverStart")
    setTimeout(() => {
      background.play("gameOverLoop")
    }, 2000)
  }

  registerScore() {
    Axis.virtualKeyboard.open()
    Axis.virtualKeyboard.addEventListener("validate", (username) => {
      Axis.virtualKeyboard.close()
      leaderboard
        .postScore({
          username: username || "NO_USER",
          value: this.score,
        })
        .then(() => {
          // idk
        })
    })
  }

  keyDownHandler(e, playerNumber) {
    if (e.key === "a") {
      this.startBtn.play("button-start-press")
      setTimeout(() => {
        location.reload()
      }, 500)
    }
    if (e.key === "x") {
      this.scoreBtn.play("button-score-press")
      setTimeout(() => {
        this.scene.start("ScoreScene")
      }, 500)
    }
  }

  update() {
    gamepadEmulator.update()
  }
}

export default GameOverScene
