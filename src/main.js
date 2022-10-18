import Phaser from "phaser"

import "./axis"

import "./style.css"
import baseImg from "./assets/img/base.png"
import bgImg from "./assets/img/bg.png"
import playerImg from "./assets/img/player.png"
import turretImg from "./assets/img/turret.png"
import { Player } from "./classes/player"

import { resolutionMultiplicator, center } from "./constants"

class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene")
  }

  preload() {
    this.load.image("base", baseImg)
    this.load.image("bg", bgImg)
    this.load.image("player", playerImg)
    this.load.image("turret", turretImg)
  }
  create() {
    this.scene.start("WorldScene")
  }
}

class Enemy extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y, turretIndex) {
    super(scene, x, y, "turret")
    this.speed = 4

    this.targetPosition = null
  }

  setTargetPosition(base) {
    this.targetPosition = { x: base.x, y: base.y }
  }

  update() {
    // go to base center continuously
    // bump into base
    // if colliding with base, deal damage
  }
}

class Base extends Phaser.GameObjects.Image {
  constructor(scene, x, y) {
    super(scene, x, y, "base")

    // add base
    this.baseScale = 1
    this.width = 654 * this.baseScale
    this.height = this.width / 2

    this.pos = { x: center.x, y: 1440 * resolutionMultiplicator - this.height / 2 }

    scene.add.image(center.x, 1440 * resolutionMultiplicator - this.height / 2, "base").setScale(this.baseScale)
  }
}

class WorldScene extends Phaser.Scene {
  constructor() {
    super("WorldScene")
  }

  createPlayers() {
    this.players = this.physics.add.group({ classType: Player, runChildUpdate: true })

    this.players.create(0, 0, 1, 0.3)
    this.players.create(0, 0, 2, 0.8)

    this.players.children.each((player) => {
      player.setBase(this.base)
      player.setPositionFromLinear()
    })
  }

  create() {
    // add background
    this.add.image(center.x, center.y, "bg").setScale(resolutionMultiplicator)

    this.base = new Base(this, center.x, center.y)

    this.createPlayers()

    this.cursors = this.input.keyboard.createCursorKeys()
    this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E)
    this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
  }

  handleControls(player) {
    const otherPlayerLinear = this.players.children.entries.filter((p) => p.playerNumber !== player.playerNumber)[0]
      .linearPosition
    if (this.cursors.left.isDown) {
      player.movePlayer(-1, otherPlayerLinear)
    } else if (this.cursors.right.isDown) {
      player.movePlayer(1, otherPlayerLinear)
    }
  }

  handleInputs(time) {
    this.players.children.each((player) => {
      player.body.setVelocity(0)
      if (player.playerNumber === 2) return

      this.handleControls(player)
      if (this.spaceBar.isDown) player.shoot(time)
      if (this.keyE.isDown) this.leaveTurret(player)
    })
  }
  update(time, delta) {
    this.handleInputs(time)
  }
}

const config = {
  type: Phaser.AUTO,
  parent: "content",
  width: 2560 * resolutionMultiplicator,
  height: 1440 * resolutionMultiplicator,
  // zoom: 2,
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: true,
    },
  },
  scene: [BootScene, WorldScene],
}

const game = new Phaser.Game(config)
