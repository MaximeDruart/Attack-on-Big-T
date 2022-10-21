import Phaser from "phaser"

import Axis from "axis-api"

import "./style.css"
import baseImg from "/assets/img/base.png"
import baseShieldImg from "/assets/img/shield.png"
import bulletImg from "/assets/img/pellet.png"

import chaserImg from "/assets/img/chaser.png"
import tardiTrailImg from "/assets/img/tarditrail.png"
import e1000Img from "/assets/img/e1000.png"
import ratImg from "/assets/img/rat.png"
import explosionImg from "/assets/img/explosions.png"

import bgImg from "/assets/img/backgroundSheet.png"
import turretImg from "/assets/img/turret.png"
import redTurretImg from "/assets/img/redGun.png"
import blueTurretImg from "/assets/img/blueGun.png"
import laserImg from "/assets/img/laser.png"
import bonusImg from "/assets/img/bonus.png"
import ropeTileImg from "/assets/img/ropeTile.png"
import ropeGrabImg from "/assets/img/ropeGrab.png"
import bigT from "/assets/img/boss.png"

import laserIconImg from "/assets/ui/laserIcon.png"
import shieldIconImg from "/assets/ui/shieldIcon.png"
import buttonsImg from "/assets/ui/buttons.png"

import cadenceBonusImg from "/assets/img/CadenceSheet.png"
import cdBonusImg from "/assets/img/CDSheet.png"
import speedBonusImg from "/assets/img/SpeedSheet.png"
import bulletSizeBonusImg from "/assets/img/LargeSheet.png"

import slowTextImg from "/assets/img/SlowSheet.png"
import reverseTextImg from "/assets/img/ReverseSheet.png"
import boomTextImg from "/assets/img/BoomSheet.png"
import slowTextAudio from "/assets/audios/boomText.mp3"
import reverseTextAudio from "/assets/audios/reverseText.mp3"
import boomTextAudio from "/assets/audios/boomText.mp3"

import inGameAudio from "/assets/audios/inGameAudio.mp3"

import laser_one from "/assets/audios/laser_one.mp3"
import laser_two from "/assets/audios/laser_two.mp3"
import explosion_two from "/assets/audios/explosion_two.mp3"
import explosion_three from "/assets/audios/explosion_three.mp3"
import big_laser from "/assets/audios/big_laser.mp3"
import fireSpeed from "/assets/audios/fireSpeed.mp3"
import fireDelay from "/assets/audios/fireDelay.mp3"
import bulletScale from "/assets/audios/bulletScale.mp3"
import note_1 from "/assets/audios/qte_notes/note_1.mp3"
import note_2 from "/assets/audios/qte_notes/note_2.mp3"
import note_3 from "/assets/audios/qte_notes/note_3.mp3"
import note_4 from "/assets/audios/qte_notes/note_4.mp3"

import { Player } from "./classes/player"
import { Base } from "./classes/base"
import { Enemy } from "./classes/enemy"
import { Bonus } from "./classes/bonus"

import MenuScene from "./scenes/MenuScene"
import GameOverScene from "./scenes/GameOverScene"
import ScoreScene from "./scenes/ScoreScene"

import GrayScalePipeline from "./pipelines/grayScale"

import { gamepadEmulator, player1axis, player2axis, leaderboard } from "./axis"
import { center, bonusesStatsKey } from "./constants"
import { enemyData } from "./enemyData"
import { mapRange } from "./utils"

class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene")
  }

  preload() {
    this.load.image("base", baseImg)
    this.load.spritesheet("bg", bgImg, { frameWidth: 640, frameHeight: 360 })
    this.load.image("turret", turretImg)
    this.load.spritesheet("blueTurret", blueTurretImg, { frameWidth: 48, frameHeight: 48 })
    this.load.spritesheet("redTurret", redTurretImg, { frameWidth: 48, frameHeight: 48 })
    this.load.image("chaser", chaserImg)
    this.load.spritesheet("tardiTrail", tardiTrailImg, { frameWidth: 16, frameHeight: 16 })
    this.load.image("rat", ratImg)
    this.load.image("bullet", bulletImg)

    this.load.image("laser", laserImg)
    this.load.image("bonus", bonusImg)
    this.load.image("laserIcon", laserIconImg)
    this.load.image("shieldIcon", shieldIconImg)
    this.load.image("ropeTile", ropeTileImg)
    this.load.image("ropeGrab", ropeGrabImg)
    this.load.spritesheet("bigT", bigT, { frameWidth: 512, frameHeight: 288 })

    this.load.spritesheet("fireDelaySprite", cadenceBonusImg, { frameWidth: 36, frameHeight: 32 })
    this.load.spritesheet("CDBonusSprite", cdBonusImg, { frameWidth: 36, frameHeight: 32 })
    this.load.spritesheet("fireSpeedSprite", speedBonusImg, { frameWidth: 36, frameHeight: 32 })
    this.load.spritesheet("bulletScaleSprite", bulletSizeBonusImg, { frameWidth: 36, frameHeight: 32 })

    this.load.spritesheet("slowTextImg", slowTextImg, { frameWidth: 2560 / 4, frameHeight: 1440 / 4 })
    this.load.spritesheet("reverseTextImg", reverseTextImg, { frameWidth: 2560 / 4, frameHeight: 1440 / 4 })
    this.load.spritesheet("boomTextImg", boomTextImg, { frameWidth: 2560 / 4, frameHeight: 1440 / 4 })
    this.load.audio("slowTextImgAudio", slowTextAudio)
    this.load.audio("reverseTextImgAudio", reverseTextAudio)
    this.load.audio("boomTextImgAudio", boomTextAudio)

    this.load.spritesheet("e1000", e1000Img, { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet("base-shield", baseShieldImg, { frameWidth: 196, frameHeight: 98 })
    this.load.spritesheet("explosion", explosionImg, { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet("buttons", buttonsImg, { frameWidth: 64, frameHeight: 64 })

    this.load.audio("in-game-music", inGameAudio)

    this.load.audio("laser_one", laser_one)
    this.load.audio("laser_two", laser_two)
    this.load.audio("explosion_two", explosion_two)
    this.load.audio("explosion_three", explosion_three)
    this.load.audio("big_laser", big_laser)
    this.load.audio("fireDelay", fireDelay)
    this.load.audio("fireSpeed", fireSpeed)
    this.load.audio("bulletScale", bulletScale)

    this.load.audio("note_1", note_1)
    this.load.audio("note_2", note_2)
    this.load.audio("note_3", note_3)
    this.load.audio("note_4", note_4)
  }

  createAnims() {
    this.anims.create({
      key: "bg",
      frameRate: 10,
      frames: this.anims.generateFrameNumbers("bg"),
      repeat: -1,
      yoyo: true,
    })
    this.anims.create({
      key: "blueTurretAnim",
      frameRate: 20,
      frames: this.anims.generateFrameNumbers("blueTurret"),
    })
    this.anims.create({
      key: "redTurretAnim",
      frameRate: 20,
      frames: this.anims.generateFrameNumbers("redTurret"),
    })
    this.anims.create({
      key: "e1000-fly",
      frameRate: 4,
      frames: this.anims.generateFrameNumbers("e1000", { start: 0, end: 3 }),
      repeat: -1,
      yoyo: true,
      showOnStart: true,
    })
    this.anims.create({
      key: "tardiTrailAnim",
      frameRate: 8,
      frames: this.anims.generateFrameNumbers("tardiTrail"),
      repeat: -1,
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
        frameRate: 18,
        frames: this.anims.generateFrameNumbers(`buttons`, { start: 4 * i, end: 4 * i + 3 }),
        repeat: 0,
      })
    }
    for (let i = 0; i < 4; i++) {
      this.anims.create({
        key: `button-${buttons[i]}-2-anim`,
        frameRate: 18,
        frames: this.anims.generateFrameNumbers(`buttons`, { start: 16 + 4 * i, end: 16 + 4 * i + 3 }),
        repeat: 0,
      })
    }

    this.anims.create({
      key: "fireDelaySpriteAnim",
      frameRate: 4,
      frames: this.anims.generateFrameNumbers("fireDelaySprite", { start: 0, end: 3 }),
      repeat: -1,
      yoyo: true,
      showOnStart: true,
    })
    this.anims.create({
      key: "CDBonusSpriteAnim",
      frameRate: 4,
      frames: this.anims.generateFrameNumbers("CDBonusSprite", { start: 0, end: 3 }),
      repeat: -1,
      yoyo: true,
      showOnStart: true,
    })
    this.anims.create({
      key: "fireSpeedSpriteAnim",
      frameRate: 4,
      frames: this.anims.generateFrameNumbers("fireSpeedSprite", { start: 0, end: 3 }),
      repeat: -1,
      yoyo: true,
      showOnStart: true,
    })
    this.anims.create({
      key: "bulletScaleSpriteAnim",
      frameRate: 4,
      frames: this.anims.generateFrameNumbers("bulletScaleSprite", { start: 0, end: 3 }),
      repeat: -1,
      yoyo: true,
      showOnStart: true,
    })
    this.anims.create({
      key: "slowTextImgAnim",
      frameRate: 15,
      frames: this.anims.generateFrameNumbers("slowTextImg", { start: 0, end: 15 }),
    })
    this.anims.create({
      key: "reverseTextImgAnim",
      frameRate: 15,
      frames: this.anims.generateFrameNumbers("reverseTextImg", { start: 0, end: 15 }),
    })
    this.anims.create({
      key: "boomTextImgAnim",
      frameRate: 15,
      frames: this.anims.generateFrameNumbers("boomTextImg", { start: 0, end: 15 }),
    })
    this.anims.create({
      key: "explosion-anim",
      frameRate: 10,
      frames: this.anims.generateFrameNumbers("explosion", { start: 0, end: 7 }),
      repeat: 0,
    })

    this.anims.create({
      key: "boss-idle",
      frameRate: 1,
      frames: this.anims.generateFrameNumbers("bigT", { start: 0, end: 1 }),
      repeat: -1,
    })

    this.anims.create({
      key: "boss-laugh",
      frameRate: 1,
      frames: this.anims.generateFrameNumbers("bigT", { start: 2, end: 3 }),
      // repeat: -1
    })

    this.anims.create({
      key: "boss-angry",
      frameRate: 1,
      frames: this.anims.generateFrameNumbers("bigT", { start: 4, end: 5 }),
      repeat: -1,
    })

    this.anims.create({
      key: "boss-strange",
      frameRate: 1,
      frames: this.anims.generateFrameNumbers("bigT", { start: 5, end: 6 }),
      repeat: -1,
    })
  }

  startMusic() {
    let music = this.sound.add("in-game-music", {
      volume: 0.5,
      loop: true,
    })
    music.play()
  }

  create() {
    this.createAnims()
    this.scene.start("MenuScene")
    // this.scene.start("WorldScene")
    this.startMusic()
  }
}

class WorldScene extends Phaser.Scene {
  constructor() {
    super("WorldScene")
  }

  setGameOver() {
    this.scene.start("GameOverScene", { score: this.score })
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
    this.spawnText("reverseTextImg")
    this.players.children.entries[0].invertedControls = true
    this.players.children.entries[1].invertedControls = true

    setTimeout(() => {
      this.players.children.entries[0].invertedControls = false
      this.players.children.entries[1].invertedControls = false
    }, 10000)
  }

  increaseTearDelayMalus() {
    this.spawnText("slowTextImg")
    this.isRunningTearDelayMalus = true
    this.tdMalusCurrentStat = this.players.children.entries[0].cannonStats.fireDelay
    this.tdMalusNerfedStat = 250

    this.tdTargetKills = 8

    this.players.children.entries[0].cannonStats.fireDelay = this.tdMalusNerfedStat
    this.players.children.entries[1].cannonStats.fireDelay = this.tdMalusNerfedStat
  }

  updateTearDelayMalus() {
    if (this.waveKills >= this.tdTargetKills) {
      this.players.children.entries[0].cannonStats.fireDelay = this.tdMalusCurrentStat
      this.players.children.entries[1].cannonStats.fireDelay = this.tdMalusCurrentStat
      this.isRunningTearDelayMalus = false
      return
    }

    this.players.children.entries[0].cannonStats.fireDelay = mapRange(
      this.waveKills,
      0,
      this.tdTargetKills,
      this.tdMalusNerfedStat,
      this.tdMalusCurrentStat
    )

    this.players.children.entries[1].cannonStats.fireDelay = mapRange(
      this.waveKills,
      0,
      this.tdTargetKills,
      this.tdMalusNerfedStat,
      this.tdMalusCurrentStat
    )
  }

  qteMalus() {
    const qteTimerDuration = 7
    // slow time
    this.enemies.children.each((enemy) => {
      enemy.stats.speed = 7
      enemy.stats.attackSpeed = 15
    })

    const randomKeyIndex = () => Math.floor(Math.random() * 4)
    const randomKeyIndexes = new Array(4).fill("").map(() => randomKeyIndex())
    const chars = ["a", "x", "i", "s"]
    this.sequence = [
      { key: chars[randomKeyIndexes[0]], keyIndex: randomKeyIndexes[0], player: 1 },
      { key: chars[randomKeyIndexes[1]], keyIndex: randomKeyIndexes[1], player: 2 },
      { key: chars[randomKeyIndexes[2]], keyIndex: randomKeyIndexes[2], player: 1 },
      { key: chars[randomKeyIndexes[3]], keyIndex: randomKeyIndexes[3], player: 2 },
    ]
    this.isListeningQTE = true
    this.validatedPresses = []
    this.createQTEVisuals()
    this.qteTimer = setTimeout(() => {
      this.onQTEFail()
    }, qteTimerDuration * 1000)
  }

  createQTEVisuals() {
    this.visuals = this.add.group()
    for (let i = 0; i < 4; i++) {
      let frameStartIndex = this.sequence[i].player === 1 ? 0 : 16
      frameStartIndex += 4 * this.sequence[i].keyIndex
      this.visuals.create(150 + 70 * (i + 1), center.y, "buttons", frameStartIndex)
    }
  }

  qteValidate(pressKey, playerNumber) {
    if (
      pressKey == this.sequence[this.validatedPresses.length].key &&
      playerNumber == this.sequence[this.validatedPresses.length].player
    ) {
      this.visuals.children.entries[this.validatedPresses.length].play(`button-${pressKey}-${playerNumber}-anim`)
      this.validatedPresses.push(pressKey)
      let sound = this.sound.add(`note_${this.validatedPresses.length}`)
      sound.setVolume(0.3)
      sound.play()
      if (this.validatedPresses.length === this.sequence.length) {
        this.validateQTE()
      }
    } else {
      this.onQTEFail()
    }
  }

  validateQTE() {
    this.enemies.children.each((enemy) => {
      enemy.stats.speed = enemy.statsBackUp.speed
      enemy.stats.attackSpeed = enemy.statsBackUp.attackSpeed
    })
    clearTimeout(this.qteTimer)
    this.isListeningQTE = false
    this.validatedPresses = []
    this.visuals.clear(true, true)
  }

  onQTEFail() {
    this.enemies.children.each((enemy) => {
      enemy.stats.speed = enemy.statsBackUp.speed
      enemy.stats.attackSpeed = enemy.statsBackUp.attackSpeed
    })
    clearTimeout(this.qteTimer)
    this.isListeningQTE = false
    this.validatedPresses = []
    this.visuals.clear(true, true)

    this.spawnText("boomTextImg")
    this.base.takeDamage(3)
  }

  spawnText(option) {
    // slowTextImg reverseTextImg boomTextImg
    if (this.fullScreenText?.active) {
      this.fullScreenText.setActive(false)
      this.fullScreenText.setVisible(false)
    }
    this.fullScreenText = this.add.sprite(center.x, center.y, option).setOrigin()
    this.fullScreenText.alpha = 0.6
    this.fullScreenText.play(`${option}Anim`)

    let sound = this.sound.add(`${option}Audio`)
    sound.setVolume(0.3)
    sound.play()

    this.fullScreenText.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      this.fullScreenText.setActive(false)
      this.fullScreenText.setVisible(false)
    })
  }

  createWave() {
    this.waveKills = 0
    this.waveIsCompleted = false

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

      const enemyTemp = this.enemies.create(pos.x, pos.y, enemy)
      enemyTemp.setTargetPosition(this.base.pos)
    })

    this.isRunningTearDelayMalus = false

    this.malusProbability = 0.3 + 0.03 * this.waveNumber
    const triggerMalus = Math.random() < this.malusProbability

    if (triggerMalus && this.waveNumber !== 0) {
      const ranIndex = Math.floor(Math.random() * 3)
      if (ranIndex === 0) this.invertControlsMalus()
      if (ranIndex === 1) this.increaseTearDelayMalus()
      if (ranIndex === 2) this.qteMalus()
    }

    // big t
    if (triggerMalus) this.bigT.play("boss-laugh")
    setTimeout(() => {
      this.bigT.play("boss-idle")
    }, 3000)
  }

  setWaveComplete() {
    this.waveNumber++
    this.enemies.clear(true, true)
    this.waveIsCompleted = true
    this.bigT.play("boss-angry")
    this.updateScore(100 + this.waveNumber * 0.3 * 30)

    const t = this.time.delayedCall(3000, this.createWave, [], this)
  }

  create() {
    this.bg = this.add.sprite(0, 0, "bg").setOrigin(0, 0)
    this.bg.play("bg")
    this.bigT = this.add.sprite(center.x, center.y, "bigT")
    this.bigT.alpha = 0.8
    this.bigT.play("boss-idle")
    this.base = new Base(this, center.x, center.y, this.setGameOver.bind(this))

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
    if (this.scoreText) {
      this.scoreText.setText(this.score.toString().padStart(6, "0"))
    }
  }

  createUI() {
    // idk but it works
    document.fonts.ready.then(() => {
      this.scoreTextNull = this.add.text(500, 0, "000000", { fontFamily: "retrograde, Courier", fill: "#ffffff" })
      this.scoreTextNull.alpha = 0
    })

    document.fonts.onloadingdone = (fontFaceSetEvent) => {
      this.scoreText = this.add
        .text(630, 0, "000000", { fontFamily: "retrograde, Courier", fill: "#ffffff" })
        .setOrigin(1, 0)
    }

    this.hpText = this.add.text(5, 5, `hp: ${this.base.hp}`, { font: "15px Courier", fill: "#00ff00" }).setOrigin(0, 0)

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
    if (this.isListeningQTE) return

    this.joystickX["1"] = this.players.children.entries[0].invertedControls ? -e.position.x : e.position.x
  }
  player2JoystickMoveHandler(e) {
    if (this.isListeningQTE) return
    this.joystickX["2"] = this.players.children.entries[1].invertedControls ? -e.position.x : e.position.x
  }

  keyDownHandler(e, playerNumber) {
    if (this.isListeningQTE) {
      this.qteValidate(e.key, playerNumber)
      return
    }

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
    if (!enemy.isDead) return bullet.active && enemy.active
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
    if (this.isRunningTearDelayMalus) this.updateTearDelayMalus()
    this.updateScore(enemy.stats.hp * 5)
    if (Math.random() < this.bonusDropChance) {
      this.createBonus(enemy.x, enemy.y)
    }
    enemy.kill()
  }

  objectIsCollidingWithBase(object) {
    if (!object.active || object.isDead) return false
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
  scene: [BootScene, WorldScene, MenuScene, GameOverScene, ScoreScene],
  pipeline: { Gray1: GrayScalePipeline, Gray2: GrayScalePipeline },
}

const game = new Phaser.Game(config)
