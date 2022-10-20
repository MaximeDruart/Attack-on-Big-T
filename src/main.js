import Phaser from "phaser"

import "./axis"

import "./style.css"
import baseImg from "/assets/img/base.png"
import baseShieldImg from "/assets/img/shield.png"
import bulletImg from "/assets/img/pellet.png"

import chaserImg from "/assets/img/chaser.png"
import e1000Img from "/assets/img/e1000.png"
import ratImg from "/assets/img/rat.png"
import explosionImg from "/assets/img/explosions.png"

import bgImg from "/assets/img/bg.png"
import playerImg from "/assets/img/player.png"
import turretImg from "/assets/img/turret.png"
import laserImg from "/assets/img/laser.png"
import bonusImg from "/assets/img/bonus.png"
import ropeTileImg from "/assets/img/ropeTile.png"
import ropeGrabImg from "/assets/img/ropeGrab.png"

import laserIconImg from "/assets/ui/laserIcon.png"
import shieldIconImg from "/assets/ui/shieldIcon.png"
import buttonsImg from "/assets/ui/buttons.png"

import laser_one from "/assets/audios/laser_one.mp3"
import laser_two from "/assets/audios/laser_two.mp3"
import explosion_two from "/assets/audios/explosion_two.mp3"
import explosion_three from "/assets/audios/explosion_three.mp3"

import { Player } from "./classes/player"
import { Base } from "./classes/base"
import { Enemy } from "./classes/enemy"
import { Bonus } from "./classes/bonus"

import GrayScalePipeline from "./pipelines/grayScale"

import { gamepadEmulator, player1axis, player2axis } from "./axis"
import { resolutionMultiplicator, center, bonusesStats, bonusesStatsKey } from "./constants"
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
    this.load.image("chaser", chaserImg)
    this.load.image("rat", ratImg)
    this.load.image("bullet", bulletImg)

    this.load.image("laser", laserImg)
    this.load.image("bonus", bonusImg)
    this.load.image("laserIcon", laserIconImg)
    this.load.image("shieldIcon", shieldIconImg)
    this.load.image("ropeTile", ropeTileImg)
    this.load.image("ropeGrab", ropeGrabImg)

    this.load.spritesheet("e1000", e1000Img, { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet("base-shield", baseShieldImg, { frameWidth: 196, frameHeight: 98 })
    this.load.spritesheet("explosion", explosionImg,{ frameWidth: 32, frameHeight: 32 } )
    this.load.spritesheet("buttons", buttonsImg, { frameWidth: 64, frameHeight: 64 })
    // this.load.spritesheet("button-x-1", buttonsImg, { frameWidth: 64, frameHeight: 64, startFrame: 4, endFrame: 7 })
    // this.load.spritesheet("buttons-i-1", buttonsImg, { frameWidth: 64, frameHeight: 64, startFrame: 8, endFrame: 11 })
    // this.load.spritesheet("buttons-s-1", buttonsImg, { frameWidth: 64, frameHeight: 64, startFrame: 12, endFrame: 15 })

    // this.load.spritesheet("button-a-2", buttonsImg, { frameWidth: 64, frameHeight: 64, startFrame: 16, endFrame: 19 })
    // this.load.spritesheet("button-x-2", buttonsImg, { frameWidth: 64, frameHeight: 64, startFrame: 20, endFrame: 23 })
    // this.load.spritesheet("buttons-i-2", buttonsImg, { frameWidth: 64, frameHeight: 64, startFrame: 24, endFrame: 27 })
    // this.load.spritesheet("buttons-s-2", buttonsImg, { frameWidth: 64, frameHeight: 64, startFrame: 28, endFrame: 31 })

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

  invertControlsMalus() {
    console.log(this.players)
    this.players.children.entries[0].invertedControls = true
    this.players.children.entries[1].invertedControls = true

    setTimeout(() => {
      this.players.children.entries[0].invertedControls = false
      this.players.children.entries[1].invertedControls = false
    }, 10000)
  }

  increaseTearDelayMalus() {
    let kills = 0
    console.log(this.players)
    this.players.children.entries[0].cannonStats.fireDelay = 250
    this.players.children.entries[0].cannonStats.fireDelay = 250

    window.addEventListener("kill", () => {
      kills++
      if (
        this.players.children.entries[0].cannonStats.fireDelay !== 150 &&
        this.players.children.entries[0].cannonStats.fireDelay !== 150
      ) {
        this.players.children.entries[0].cannonStats.fireDelay -= 10
        this.players.children.entries[0].cannonStats.fireDelay -= 10
      }
    })
  }

  qteMalus() {
    this.sequence = [
      { key: "a", player: "1" },
      { key: "x", player: "2" },
      { key: "i", player: "1" },
      { key: "s", player: "2" },
    ]
    this.isListeningQTE = true
    this.validatedPresses = []
    this.createQTEVisuals()
  }

  createQTEVisuals() {
    this.visuals = this.add.group()
    this.visuals.create(150 + 70 * 1, center.y, "buttons")
    this.visuals.create(150 + 70 * 2, center.y, "buttons", 16 + 4)
    this.visuals.create(150 + 70 * 3, center.y, "buttons", 8)
    this.visuals.create(150 + 70 * 4, center.y, "buttons", 16 + 12)
  }

  qteValidate(pressKey) {
    if (pressKey == this.sequence[this.validatedPresses.length].key) {
      this.visuals.children.entries[this.validatedPresses.length].play()
      this.validatedPresses.push(pressKey)
    } else {
      this.onQTEFail()
    }
  }

  onQTEFail() {
    this.isListeningQTE = false
    this.validatedPresses = []
    this.base.takeDamage(3)
  }

  createWave() {
    this.waveKills = 0
    this.waveIsCompleted = false

    this.malusProbability = 0.3 + 0.03 * this.waveNumber
    const triggerMalus = Math.random() < 0.5

    // if (triggerMalus) {
    //   const ranIndex = Math.floor(Math.random() * 3)
    //   if (ranIndex === 0) this.invertControlsMalus()
    //   if (ranIndex === 1) this.increaseTearDelayMalus()
    //   if (ranIndex === 2) this.qteMalus()
    // }
    // this.qteMalus()

    const enemies = this.getEnemiesForWave(this.waveNumber)

    this.waveEnemyCount = enemies.length

    const radius = 400
    const distanceRandomness = 140

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

    this.updateScore(100 + this.waveNumber * 0.3 * 30)

    const t = this.time.delayedCall(3000, this.createWave, [], this)
  }

  createAnims() {
    this.anims.create({
      key: "e1000-fly",
      frameRate: 4,
      frames: this.anims.generateFrameNumbers("e1000", { start: 0, end: 3 }),
      repeat: -1,
      yoyo: true,
      showOnStart: true,
    })
    this.anims.create({
      key: "explosion-anim",
      frameRate: 10,
      frames: this.anims.generateFrameNumbers("explosion", { start: 0, end: 7 }),
      repeat: 0,
    })
    this.anims.create({
      key: "base-shield-anim",
      frameRate: 10,
      frames: this.anims.generateFrameNumbers("base-shield", { start: 0, end: 6 }),
      repeat: 1,
    })
    const buttons = ["a", "x", "i", "s"]
    for (let i = 0; i < 4; i++) {
      this.anims.create({
        key: `button-${buttons[i]}-1-anim`,
        frameRate: 4,
        frames: this.anims.generateFrameNumbers(`buttons`, { start: 4 * i, end: 4 * i + 3 }),
        repeat: 0,
      })
    }
    for (let i = 0; i < 4; i++) {
      this.anims.create({
        key: `button-${buttons[i]}-2-anim`,
        frameRate: 4,
        frames: this.anims.generateFrameNumbers(`buttons`, { start: 16 + 4 * i, end: 16 + 4 * i + 3 }),
        repeat: 0,
      })
    }
  }

  create() {
    this.createAnims()
    this.add.image(0, 0, "bg").setOrigin(0, 0)

    this.base = new Base(this, center.x, center.y)

    this.waveNumber = 0
    this.waveKills = 0
    this.totalKills = 0

    this.score = 0

    this.createPlayers()

    this.enemies = this.physics.add.group({ classType: Enemy, runChildUpdate: true })
    this.waveIsCompleted = false
    this.createWave()

    this.initBonuses()
    this.addHookBonusOverlapCheck()

    this.cursors = this.input.keyboard.createCursorKeys()
    this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E)
    this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)

    this.addAxisControls()
    this.addEnemyBulletOverlapCheck()
    this.createUI()
  }

  initBonuses() {
    this.bonuses = this.physics.add.group({ classType: Bonus, runChildUpdate: true })
    // 1 is 100%
    this.bonusDropChance = 0.1
  }

  createBonus(x, y) {
    this.bonuses.create(x, y, bonusesStatsKey[Math.floor(Math.random() * bonusesStatsKey.length)])
  }

  updateScore(inc) {
    this.score += inc
    this.scoreText.setText(`score: ${this.score}`)
  }

  createUI() {
    this.shieldCDText = this.add.text(0, 0, "shield cd: 0", { font: "15px Courier", fill: "#00ff00" })
    this.laserCDText = this.add.text(0, 30, "laser cd: 0", { font: "15px Courier", fill: "#00ff00" })
    this.scoreText = this.add.text(500, 0, "score: 0", { font: "15px Courier", fill: "#00ff00" })
    this.hpText = this.add.text(500, 30, `hp: ${this.base.hp}`, { font: "15px Courier", fill: "#00ff00" })

    const color = 0x000000 // mult
    const alpha = 0.2

    this.grayscalePipelineShield = this.renderer.pipelines.get("Gray1")
    this.grayscalePipelineShield.gray = 0

    this.shieldIcon = this.add.sprite(50, 250, "shieldIcon").setPipeline(this.grayscalePipelineShield)
    this.shieldIconGraphics = this.add.graphics({ x: this.shieldIcon.x, y: this.shieldIcon.y })

    this.shieldIconGraphics.fillStyle(color, alpha)
    this.shieldIconGraphics.fillRect(
      -this.shieldIcon.width / 2,
      -this.shieldIcon.height / 2,
      this.shieldIcon.width,
      this.shieldIcon.height * 0
    )

    this.shieldIconGraphics.setBlendMode(Phaser.BlendModes.DIFFERENCE)

    this.grayscalePipelineLaser = this.renderer.pipelines.get("Gray2")
    this.grayscalePipelineLaser.gray = 0

    this.laserIcon = this.add.sprite(150, 250, "laserIcon").setPipeline(this.grayscalePipelineLaser)
    this.laserIconGraphics = this.add.graphics({ x: this.laserIcon.x, y: this.laserIcon.y })

    this.laserIconGraphics.fillStyle(color, alpha)
    this.laserIconGraphics.fillRect(
      -this.laserIcon.width / 2,
      -this.laserIcon.height / 2,
      this.laserIcon.width,
      this.laserIcon.height * 0
    )

    this.laserIconGraphics.setBlendMode(Phaser.BlendModes.DIFFERENCE)
  }

  updateUI() {
    // shield icon UI update
    if (this.shieldRemainingCooldown > 0) {
      if (this.grayscalePipelineShield.gray === 0) {
        this.grayscalePipelineShield.gray = 0.01
        this.tweens.add({
          targets: this.grayscalePipelineShield,
          duration: 200,
          gray: 1,
        })
      }

      const percentage = this.shieldRemainingCooldown / this.shieldCooldown
      this.shieldIconGraphics.clear()
      this.shieldIconGraphics.fillRect(
        -this.shieldIcon.width / 2,
        -this.shieldIcon.height / 2,
        this.shieldIcon.width,
        this.shieldIcon.height * percentage
      )
    }
    if (this.shieldRemainingCooldown === 0 && this.grayscalePipelineShield.gray !== 0) {
      this.tweens.add({
        targets: this.grayscalePipelineShield,
        duration: 250,
        gray: 0,
      })
      this.shieldIconGraphics.clear()
      this.shieldIconGraphics.fillRect(
        -this.shieldIcon.width / 2,
        -this.shieldIcon.height / 2,
        this.shieldIcon.width,
        0
      )
    }

    // laser icon UI update
    if (this.laserRemainingCooldown > 0) {
      if (this.grayscalePipelineLaser.gray === 0) {
        this.grayscalePipelineLaser.gray = 0.01
        this.tweens.add({
          targets: this.grayscalePipelineLaser,
          duration: 200,
          gray: 1,
        })
      }

      const percentage = this.laserRemainingCooldown / this.laserCooldown
      this.laserIconGraphics.clear()
      this.laserIconGraphics.fillRect(
        -this.laserIcon.width / 2,
        -this.laserIcon.height / 2,
        this.laserIcon.width,
        this.laserIcon.height * percentage
      )
    }
    if (this.laserRemainingCooldown === 0 && this.grayscalePipelineLaser.gray !== 0) {
      this.tweens.add({
        targets: this.grayscalePipelineLaser,
        duration: 250,
        gray: 0,
      })
      this.laserIconGraphics.clear()
      this.laserIconGraphics.fillRect(-this.laserIcon.width / 2, -this.laserIcon.height / 2, this.laserIcon.width, 0)
    }
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

  addHookBonusOverlapCheck() {
    this.physics.add.overlap(
      this.players.children.entries[0].hook,
      this.bonuses,
      this.handleHookBonusHit,
      this.checkHookVsBonus,
      this
    )
    this.physics.add.overlap(
      this.players.children.entries[1].hook,
      this.bonuses,
      this.handleHookBonusHit,
      this.checkHookVsBonus,
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
    this.isShootingHook = {
      1: false,
      2: false,
    }

    // value in seconds

    // min time between shield
    this.shieldCooldown = 2
    // time available for user to press shield button simultaneously
    this.shieldSyncWindow = 1
    // shield duration
    this.shieldDuration = 1

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
    this.joystickX["1"] = this.players.children.entries[0].invertedControls ? -e.position.x : e.position.x
  }
  player2JoystickMoveHandler(e) {
    this.joystickX["2"] = this.players.children.entries[1].invertedControls ? -e.position.x : e.position.x
  }

  keyDownHandler(e, playerNumber) {
    if (e.key === "a") this.isShooting[playerNumber] = true
    if (e.key === "x") {
      if (this.shieldRemainingCooldown === 0) {
        this.isShielding[playerNumber] = true
      }
    }
    if (e.key === "w") {
      if (this.laserRemainingCooldown === 0) {
        this.isLasering[playerNumber] = true
      }
      if (this.laserRemainingCooldown > 0) {
        this.laserRemainingCooldown -= 0.04
        this.laserRemainingCooldown = Math.max(this.laserRemainingCooldown, 0)
      }
    }
    if (e.key == "i") this.isShootingHook[playerNumber] = true
  }

  keyUpHandler(e, playerNumber) {
    if (e.key === "a") this.isShooting[playerNumber] = false

    if (e.key == "i") this.isShootingHook[playerNumber] = false
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
    if (this.isShootingHook[player.playerNumber]) {
      player.shootHook()
    } else {
      player.stopHook()
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
    if(!enemy.isDead) return bullet.active && enemy.active
    return false
  }
  checkLaserVsEnemy(laser, enemy) {
    return laser.active && enemy.active
  }
  checkHookVsBonus(hook, bonus) {
    return hook.active && bonus.active
  }

  handleEnemyHit(bullet, enemy) {
    bullet.kill()
    enemy.registerHit()
    if (enemy.hp <= 0) {
      this.onEnemyKill(enemy)
    }
  }
  handleEnemyLaserHit(laser, enemy) {
    enemy.registerHit(laser.damage)
    if (enemy.hp <= 0) {
      this.onEnemyKill(enemy)
    }
  }
  handleHookBonusHit(hook, bonus) {
    bonus.pickUpBonus()
    bonus.kill()
  }

  onEnemyKill(enemy) {
    this.totalKills++
    this.waveKills++
    this.updateScore(enemy.stats.hp * 5)
    if (Math.random() < this.bonusDropChance) {
      this.createBonus(enemy.x, enemy.y)
    }
    enemy.kill()
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

    this.updateUI()
  }
}

const config = {
  type: Phaser.AUTO,
  parent: "content",
  width: 640,
  height: 360,
  zoom: 4,
  fps: {
    target: 60,
  },
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      fps: 60,
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: [BootScene, WorldScene],
  pipeline: { Gray1: GrayScalePipeline, Gray2: GrayScalePipeline },
}

const game = new Phaser.Game(config)
