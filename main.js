import Phaser from "phaser"
import "./style.css"
import baseImg from "./assets/img/base.png"
import bgImg from "./assets/img/bg.png"
import playerImg from "./assets/img/player.png"
import turretImg from "./assets/img/turret.png"

const HOME_RESOLUTION = "1920"
const ARCADE_RESOLUTION = "2560"
const currentResolution = HOME_RESOLUTION

const resolutionMultiplicator = currentResolution / ARCADE_RESOLUTION

const center = { x: 2560 / 2, y: 1440 / 2 }

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
    },
  },
  scene: [BootScene, WorldScene],
}
var game = new Phaser.Game(config)

var BootScene = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function BootScene() {
    Phaser.Scene.call(this, { key: "BootScene" })
  },
  preload: function () {
    // load the resources here
  },
  create: function () {
    this.scene.start("WorldScene")
  },
})

var WorldScene = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function WorldScene() {
    Phaser.Scene.call(this, { key: "WorldScene" })
  },
  preload: function () {},
  create: function () {
    // create your world here
  },
})

function preload() {
  this.load.image("base", baseImg)
  this.load.image("bg", bgImg)
  this.load.image("player", playerImg)
  this.load.image("turret", turretImg)
}

let base

function create() {
  this.add.image(2560 * resolutionMultiplicator, 1440 * resolutionMultiplicator, "bg").setOrigin(0, 0)

  base = this.physics.add.staticGroup()
  base
    .create(center.x * resolutionMultiplicator, center.y * resolutionMultiplicator, "base")
    .setScale(0.8)
    .refreshBody()

  this.cursors = this.input.keyboard.createCursorKeys()

  this.player = this.physics.add.sprite(50, 100, "player", 6)
}

function update(time, delta) {
  this.player.body.setVelocity(0)
  // Horizontal movement
  if (this.cursors.left.isDown) {
    this.player.body.setVelocityX(-80)
  } else if (this.cursors.right.isDown) {
    this.player.body.setVelocityX(80)
  }
  // Vertical movement
  if (this.cursors.up.isDown) {
    this.player.body.setVelocityY(-80)
  } else if (this.cursors.down.isDown) {
    this.player.body.setVelocityY(80)
  }
}
