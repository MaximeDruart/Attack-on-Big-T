import Phaser from "phaser"

import "./axis"

import "./style.css"
import baseImg from "./assets/img/base.png"
import bgImg from "./assets/img/bg.png"
import playerImg from "./assets/img/player.png"
import turretImg from "./assets/img/turret.png"
import bulletImg from "./assets/img/bullet.png"
import laser_one from "./assets/audios/laser_one.mp3"
import laser_two from "./assets/audios/laser_two.mp3"
import explosion_two from "./assets/audios/explosion_two.mp3"
import explosion_three from "./assets/audios/explosion_three.mp3"
import laserImg from "./assets/img/laser.png"
import { Player } from "./classes/player"
import { Base } from "./classes/base"
import { Enemy } from "./classes/enemy"
import { gamepadEmulator, player1axis, player2axis } from "./axis"

import { resolutionMultiplicator, center } from "./constants"
import { enemyData } from "./enemyData"

class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene")
  }

  preload() {
    this.load.image("base", baseImg)
    this.load.image("bg", bgImg)
    this.load.image("player", playerImg)
    this.load.image("turret", turretImg)
    this.load.image("bullet", bulletImg)
    this.load.image("laser", laserImg)

    this.load.audio("laser_one", laser_one)
    this.load.audio("laser_two", laser_two)
    this.load.audio("explosion_two", explosion_two)
    this.load.audio("explosion_three", explosion_three)
  }
  create() {
    this.scene.start("WorldScene")
  }

  startWorldScene() {
    this.scene.start("WorldScene")
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

  getEnemiesForWave(currentWave) {
    let enemies = []
    enemyData.map((enemy) => {
      const { startWave, startCount, waveGrowth } = enemy.wave
      if (startWave > currentWave) return
      enemies = [
        ...enemies,
        ...new Array(startCount + Math.floor(waveGrowth * (currentWave - startWave))).fill(enemy.name),
      ]
    })
    return enemies
  }

  createWave() {
    this.waveKills = 0
    this.waveIsCompleted = false

    const enemies = this.getEnemiesForWave(this.waveNumber)

    this.waveEnemyCount = enemies.length

    const radius = 1100
    const distanceRandomness = 400

    enemies.forEach((enemy) => {
      const angle = Phaser.Math.DegToRad(Phaser.Math.Between(10, 170) + 180)
      let pos = new Phaser.Math.Vector2(0, 0)
      pos = pos.setToPolar(angle, radius + Phaser.Math.Between(0, distanceRandomness))
      pos = {
        x: pos.x + this.base.pos.x,
        y: pos.y + this.base.pos.y + this.base.height / 2,
      }

      this.enemies.create(pos.x, pos.y, enemy)
    })

    this.enemies.children.each((enemy) => {
      enemy.setTargetPosition(this.base.pos)
    })
  }

  setWaveComplete() {
    this.waveNumber++
    this.enemies.clear(true, true)
    this.waveIsCompleted = true

    console.log("set wave complete")

    const t = this.time.delayedCall(3000, this.createWave, [], this)
  }

  create() {
    // add background
    this.add.image(center.x, center.y, "bg").setScale(resolutionMultiplicator)

    this.base = new Base(this, center.x, center.y)

    this.waveNumber = 0
    this.waveKills = 0
    this.totalKills = 0

    this.createPlayers()

    this.enemies = this.physics.add.group({ classType: Enemy, runChildUpdate: true })
    this.waveIsCompleted = false
    this.createWave()

    this.cursors = this.input.keyboard.createCursorKeys()
    this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E)
    this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)

    this.addAxisControls()
    this.addEnemyBulletOverlapCheck()

    this.createUI()
  }

  createUI() {
    this.shieldCDText = this.add.text(0, 0, "shield cd: 0", { font: "25px Courier", fill: "#00ff00" })
    this.laserCDText = this.add.text(0, 30, "laser cd: 0", { font: "25px Courier", fill: "#00ff00" })
  }

  addEnemyBulletOverlapCheck() {
    this.physics.add.overlap(
      this.players.children.entries[0].bullets,
      this.enemies,
      this.handleEnemyHit,
      this.checkBulletVsEnemy,
      this
    )
    this.physics.add.overlap(
      this.players.children.entries[1].bullets,
      this.enemies,
      this.handleEnemyHit,
      this.checkBulletVsEnemy,
      this
    )
    this.physics.add.overlap(
      this.players.children.entries[0].laser,
      this.enemies,
      this.handleEnemyLaserHit,
      this.checkLaserVsEnemy,
      this
    )
    this.physics.add.overlap(
      this.players.children.entries[1].laser,
      this.enemies,
      this.handleEnemyLaserHit,
      this.checkLaserVsEnemy,
      this
    )
  }

  addAxisControls() {
    this.joystickX = {
      1: 0,
      2: 0,
    }
    this.isShooting = {
      1: false,
      2: false,
    }

    this.isShielding = {
      1: false,
      2: false,
    }
    this.isLasering = {
      1: false,
      2: false,
    }

    // value in seconds

    // min time between shield
    this.shieldCooldown = 2
    // time available for user to press shield button simultaneously
    this.shieldSyncWindow = 1
    // shield duration
    this.shieldDuration = 2

    this.hasStartedShieldSyncWindow = false
    this.shieldSyncRemainingTime = this.shieldSyncWindow
    this.shieldRemainingCooldown = 0

    // min time between laser
    this.laserCooldown = 5
    // time available for user to press laser button simultaneously
    this.laserSyncWindow = 1
    // laser duration
    this.laserDuration = 2

    this.hasStartedLaserSyncWindow = false
    this.laserSyncRemainingTime = this.laserSyncWindow
    this.laserRemainingCooldown = 0

    player1axis.addEventListener("joystick:move", this.player1JoystickMoveHandler.bind(this))
    player2axis.addEventListener("joystick:move", this.player2JoystickMoveHandler.bind(this))

    const keyDownHandler = this.keyDownHandler.bind(this)
    player1axis.addEventListener("keydown", (e) => keyDownHandler(e, 1))
    player2axis.addEventListener("keydown", (e) => keyDownHandler(e, 2))

    const keyUpHandler = this.keyUpHandler.bind(this)
    player1axis.addEventListener("keyup", (e) => keyUpHandler(e, 1))
    player2axis.addEventListener("keyup", (e) => keyUpHandler(e, 2))
  }

  player1JoystickMoveHandler(e) {
    this.joystickX["1"] = e.position.x
  }
  player2JoystickMoveHandler(e) {
    this.joystickX["2"] = e.position.x
  }

  keyDownHandler(e, playerNumber) {
    if (e.key === "a") this.isShooting[playerNumber] = true
    if (e.key === "x") {
      if (this.shieldRemainingCooldown === 0) {
        this.isShielding[playerNumber] = true
      }
    }
    if (e.key === "w") {
      console.log("pressing w")
      if (this.laserRemainingCooldown === 0) {
        this.isLasering[playerNumber] = true
      }
      if (this.laserRemainingCooldown > 0) {
        this.laserRemainingCooldown -= 0.04
        this.laserRemainingCooldown = Math.max(this.laserRemainingCooldown, 0)
      }
    }
  }

  keyUpHandler(e, playerNumber) {
    if (e.key === "a") this.isShooting[playerNumber] = false
  }

  handleControls(player, time) {
    const otherPlayerLinear = this.players.children.entries.filter((p) => p.playerNumber !== player.playerNumber)[0]
      .linearPosition

    // controller / axis controls
    if (this.joystickX[player.playerNumber] !== 0) {
      player.movePlayer(this.joystickX[player.playerNumber], otherPlayerLinear)
    }

    if (this.isShooting[player.playerNumber]) {
      player.shoot(time)
    }

    // keyboard controls
    if (this.cursors.left.isDown) {
      player.movePlayer(-1, otherPlayerLinear)
    } else if (this.cursors.right.isDown) {
      player.movePlayer(1, otherPlayerLinear)
    }
    if (this.spaceBar.isDown) player.shoot(time)
  }

  handleInputs(time, delta) {
    gamepadEmulator.update()

    this.players.children.each((player) => {
      this.handleControls(player, time)
    })
  }

  checkBulletVsEnemy(bullet, enemy) {
    return bullet.active && enemy.active
  }
  checkLaserVsEnemy(laser, enemy) {
    return laser.active && enemy.active
  }

  handleEnemyHit(bullet, enemy) {
    bullet.kill()
    enemy.registerHit()
    if (enemy.hp <= 0) {
      enemy.kill()
      this.totalKills++
      this.waveKills++
    }
  }
  handleEnemyLaserHit(laser, enemy) {
    console.log("hit !!")
    enemy.registerHit(100000)
    if (enemy.hp <= 0) {
      enemy.kill()
      this.totalKills++
      this.waveKills++
    }
  }

  objectIsCollidingWithBase(object) {
    if (!object.active) return false
    const { x, y } = object

    const distance = Phaser.Math.Distance.Between(x, y, this.base.pos.x, this.base.pos.y + this.base.height / 2)

    return distance < this.base.height
  }

  handleShield(time, delta) {
    // shield timer handling
    const reset = () => {
      this.shieldSyncRemainingTime = 0
      this.hasStartedShieldSyncWindow = false
      this.isShielding = {
        1: false,
        2: false,
      }
      this.shieldRemainingCooldown = this.shieldCooldown
    }

    if (this.shieldRemainingCooldown > 0) {
      this.shieldRemainingCooldown -= delta / (this.shieldCooldown * 1000)

      this.shieldCDText.setText(`shield cd: ${this.shieldRemainingCooldown.toFixed(2)}`)
      this.shieldRemainingCooldown = Math.max(this.shieldRemainingCooldown, 0)
    }

    if (!this.base.isShieldActivated || this.shieldRemainingCooldown > 0) {
      // sync window trigger
      if (!!(this.isShielding["1"] ^ this.isShielding["2"]) && !this.hasStartedShieldSyncWindow) {
        this.shieldSyncRemainingTime = 1
        this.hasStartedShieldSyncWindow = true
      }

      if (this.hasStartedShieldSyncWindow) {
        // sync window countdown
        if (this.shieldSyncRemainingTime > 0) {
          this.shieldSyncRemainingTime -= delta / (this.shieldSyncWindow * 1000)
          this.shieldSyncRemainingTime = Math.max(this.shieldSyncRemainingTime, 0)
        }

        // failed sync
        if (this.shieldSyncRemainingTime <= 0) {
          reset()
        }

        // successful sync
        if (this.isShielding["1"] && this.isShielding["2"]) {
          this.base.setShield(this.shieldDuration)
          reset()
        }
      }
    }
  }

  handleLaser(time, delta) {
    // laser timer handling
    const resetLaser = () => {
      this.laserSyncRemainingTime = 0
      this.hasStartedLaserSyncWindow = false
      this.isLasering = {
        1: false,
        2: false,
      }
      this.laserRemainingCooldown = this.laserCooldown
    }

    if (this.laserRemainingCooldown > 0) {
      this.laserRemainingCooldown -= delta / (this.laserCooldown * 1000)

      this.laserCDText.setText(`laser cd: ${this.laserRemainingCooldown.toFixed(2)}`)
      this.laserRemainingCooldown = Math.max(this.laserRemainingCooldown, 0)
    }

    if (!this.base.isLaserActivated || this.laserRemainingCooldown > 0) {
      // sync window trigger
      if (!!(this.isLasering["1"] ^ this.isLasering["2"]) && !this.hasStartedLaserSyncWindow) {
        this.laserSyncRemainingTime = 1
        this.hasStartedLaserSyncWindow = true
      }

      if (this.hasStartedLaserSyncWindow) {
        // sync window countdown
        if (this.laserSyncRemainingTime > 0) {
          this.laserSyncRemainingTime -= delta / (this.laserSyncWindow * 1000)
          this.laserSyncRemainingTime = Math.max(this.laserSyncRemainingTime, 0)
        }

        // failed sync
        if (this.laserSyncRemainingTime <= 0) {
          resetLaser()
        }

        // successful sync
        if (this.isLasering["1"] && this.isLasering["2"]) {
          // on successful
          this.players.children.iterate((player) => player.shootLaser(this.laserDuration))
          resetLaser()
        }
      }
    }
  }

  update(time, delta) {
    this.handleInputs(time, delta)

    // check for enemy hit
    this.enemies.children.each((enemy) => {
      if (this.objectIsCollidingWithBase(enemy)) {
        this.base.takeDamage(enemy.stats.damage)
        enemy.kill()
      }
      if (!!enemy.bullets) {
        enemy.bullets.children.each((bullet) => {
          if (this.objectIsCollidingWithBase(bullet)) {
            this.base.takeDamage(enemy.stats.damage)
            bullet.kill()
          }
        })
      }
    })

    // if there is no active enemy
    if (!this.enemies.children.get("active", true) && !this.waveIsCompleted) this.setWaveComplete()

    this.handleShield(time, delta)
    this.handleLaser(time, delta)
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
      debug: false,
    },
  },
  scene: [BootScene, WorldScene],
}

const game = new Phaser.Game(config)
