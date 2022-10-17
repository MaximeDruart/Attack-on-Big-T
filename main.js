import Phaser from "phaser"

import "./axis"

import "./style.css"
import baseImg from "./assets/img/base.png"
import bgImg from "./assets/img/bg.png"
import playerImg from "./assets/img/player.png"
import turretImg from "./assets/img/turret.png"

const HOME_RESOLUTION = "1920"
const ARCADE_RESOLUTION = "2560"
const currentResolution = HOME_RESOLUTION

const resolutionMultiplicator = currentResolution / ARCADE_RESOLUTION

const center = { x: (2560 * resolutionMultiplicator) / 2, y: (1440 * resolutionMultiplicator) / 2 }

var BootScene = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function BootScene() {
    Phaser.Scene.call(this, { key: "BootScene" })
  },
  preload: function () {
    this.load.image("base", baseImg)
    this.load.image("bg", bgImg)
    this.load.image("player", playerImg)
    this.load.image("turret", turretImg)
  },
  create: function () {
    this.scene.start("WorldScene")
  },
})

class Ffgazf extends Phaser.Scene {
  setIndex(index) {
    this.index = index
    this.turrets = this.add.group({ classType: Turret, runChildUpdate: true })

    this.turrets.create(0, 0, "turret")
    this.turrets.create(0, 0, "turret")
    this.turrets.create(0, 0, "turret")
    this.turrets.create(0, 0, "turret")

    // this.turrets.children.eac
  }

  update(t, dt) {}
}
class Ffgazf2 extends Phaser.GameObjects.Image {
  setIndex(index) {
    this.index = index
    this.turrets = this.add.group({ classType: Turret, runChildUpdate: true })

    this.turrets.create(0, 0, "turret")
    this.turrets.create(0, 0, "turret")
    this.turrets.create(0, 0, "turret")
    this.turrets.create(0, 0, "turret")

    this.turrets.children.eac
  }

  addedToScene() {
    console.log(this)
  }

  update(t, dt) {}
}

class Player extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y, playerNumber) {
    super(scene, x, y, "player")

    this.activeTurretIndex = null
    this.playerNumber = playerNumber
    this.speed = 400

    scene.add.existing(this)
    scene.physics.add.existing(this)
    this.setCollideWorldBounds(true)
  }

  update(t, dt) {}
}
class Turret extends Phaser.GameObjects.Image {
  constructor(scene, x, y, turretIndex) {
    super(scene, x, y, "turret")
    this.index = turretIndex

    this.speed = 4

    this.angleToCenter = null
    this.currentPlayer = null
    this.isHorizontal = undefined
  }

  setAngleToCenter(base) {
    this.angleToCenter = Phaser.Math.Angle.BetweenPoints(this, base)
    this.isHorizontal = !Number.isInteger(this.angleToCenter / Math.PI)
  }

  shootProjectile() {}
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
    this.baseScale = 0.6
    this.size = 654 * this.baseScale
    scene.add.image(center.x, center.y, "base").setScale(this.baseScale)
  }
}

var WorldScene = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function WorldScene() {
    Phaser.Scene.call(this, { key: "WorldScene" })
  },

  createTurrets() {
    this.turrets = this.physics.add.group({ classType: Turret, runChildUpdate: true })

    this.turrets.create(center.x - this.base.size / 2, center.y, 0)
    this.turrets.create(center.x, center.y - this.base.size / 2, 1)
    this.turrets.create(center.x + this.base.size / 2, center.y, 2)
    this.turrets.create(center.x, center.y + this.base.size / 2, 3)

    this.turrets.children.iterate((turret) => {
      turret.setAngleToCenter(this.base)
    })
  },

  createPlayers() {
    this.players = this.add.group({ classType: Player, runChildUpdate: true })

    this.players.create(center.x - this.base.size / 5, center.y, 1).setScale(0.5)
    this.players.create(center.x + this.base.size / 5, center.y, 2).setScale(0.5)
  },

  preload: function () {},
  create: function () {
    // add background
    this.add.image(center.x, center.y, "bg").setScale(resolutionMultiplicator)

    this.base = new Base(this, center.x, center.y)

    this.createTurrets()
    this.createPlayers()

    this.physics.add.overlap(this.players.children.entries, this.turrets.children.entries, (player, turret) => {
      if (player.activeTurretIndex === null && turret.currentPlayer == null) this.enterTurret(player, turret)
    })

    this.cursors = this.input.keyboard.createCursorKeys()
    this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E)
  },

  enterTurret: function (player, turret) {
    player.activeTurretIndex = turret.index
    turret.currentPlayer = player.playerNumber

    player.setPosition(turret.x, turret.y)
    player.setRotation(turret.angleToCenter - Math.PI / 2)
  },

  leaveTurret: function (player) {
    const turret = this.turrets.children.entries[player.activeTurretIndex]

    player.activeTurretIndex = null
    turret.currentPlayer = null

    const vectorToCenter = new Phaser.Math.Vector2(center.x - player.x, center.y - player.y)
    const unitVector = vectorToCenter.normalize()

    const leaveDistance = 70

    player.setPosition(turret.x + unitVector.x * leaveDistance, turret.y + unitVector.y * leaveDistance)
    player.setRotation(0)
  },

  handlePlayerControls: function (player) {
    // Horizontal movement
    if (this.cursors.left.isDown) {
      player.body.setVelocityX(-player.speed)
    } else if (this.cursors.right.isDown) {
      player.body.setVelocityX(player.speed)
    }
    // Vertical movement
    if (this.cursors.up.isDown) {
      player.body.setVelocityY(-player.speed)
    } else if (this.cursors.down.isDown) {
      player.body.setVelocityY(player.speed)
    }
  },

  handleTurretControls: function (player) {
    const turret = this.turrets.children.entries[player.activeTurretIndex]

    if (turret.isHorizontal) {
      if (this.cursors.left.isDown) {
        turret.x -= turret.speed
      } else if (this.cursors.right.isDown) {
        turret.x += turret.speed
      }
    } else {
      if (this.cursors.up.isDown) {
        turret.y -= turret.speed
      } else if (this.cursors.down.isDown) {
        turret.y += turret.speed
      }
    }

    turret.x = Phaser.Math.Clamp(turret.x, this.base.x - this.base.size / 2, this.base.x + this.base.size / 2)
    turret.y = Phaser.Math.Clamp(turret.y, this.base.y - this.base.size / 2, this.base.y + this.base.size / 2)

    player.x = turret.x
    player.y = turret.y
  },

  handleInputs: function () {
    this.players.children.each((player) => {
      player.body.setVelocity(0)
      if (player.playerNumber === 2) return

      if (player.activeTurretIndex !== null) {
        this.handleTurretControls(player)
        if (this.spaceBar.isDown) this.leaveTurret(player)
      } else {
        this.handlePlayerControls(player)
      }
    })
  },

  update: function () {
    this.handleInputs()
  },
})

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
