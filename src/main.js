import Phaser from "phaser"

import "./axis"

import "./style.css"
import baseImg from "./assets/img/base.png"
import bgImg from "./assets/img/bg.png"
import playerImg from "./assets/img/player.png"
import turretImg from "./assets/img/turret.png"
import { Player } from "./classes/player"
import { Base } from "./classes/base"
import { gamepadEmulator, player1axis, player2axis } from "./axis"

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

  startWorldScene() {
    this.scene.start("WorldScene")
  }
}

class Enemy extends Phaser.Physics.Arcade.Image { // voir avec maxime si enemy = chaser ou si autre classe EnemyChaser qui extend Enemy
  constructor(scene, x, y) {
    super(scene, x, y, "turret")
    this.targetPosition = null
  }

  setTargetPosition(base) {
    this.targetPosition = { x: base.x, y: base.y }
  }

  update() {
    // go to base center continuously
    // bump into base
    // if colliding with base, deal damage
    //    this.cameras.main.shake(50, 0.01)

    // With this code, chaser enemies will move down the screen. 
    // However, as soon as it is within 320 pixels (arbitrary, edit TARGET_CHASING_DISTANCE with wished distancer) to the player, it will start chasing the player

    // if (!this.getData("isDead") && this.scene.player) {
      // if (Phaser.Math.Distance.Between(
      //   this.x,
      //   this.y,
      //   this.scene.player.x, // remplacer par target position 
      //   this.scene.player.y // 
      // ) < this.TARGET_CHASING_DISTANCE) {

      // }
      // this.state = this.states.CHASE;

      // if (this.state == this.states.CHASE) {
        var dx = this.targetPosition.x - this.x; // remplacer par target position 
        var dy = this.targetPosition.y - this.y;

        var angle = Math.atan2(dy, dx);

        var speed = 100;
        this.body.setVelocity(
          Math.cos(angle) * speed,
          Math.sin(angle) * speed
        );
      // }
    // }
  }

  kill() {
    this.setActive(false)
    this.setVisible(false)
    this.body.stop()
  }
}

class RangeEnemy extends Phaser.Physics.Arcade.Image { // Draft Range enemy 
  constructor(scene, x, y) {
    super(scene, x, y, "turret")
    console.log(this.body);
    this.body.velocity.y = Phaser.Math.Between(50, 100); // TODO: Problem this.body is null in console 
    // this.targetPosition = null
    
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
  createEnemies() {

    this.baseNumberOfEnemy = 50;
    this.totalCountOfEnemy = this.baseNumberOfEnemy + this.waveNumber * 5;

    this.enemies = this.physics.add.group({ classType: Enemy, runChildUpdate: true })
    // this.enemies = this.add.group();
    // this.enemies.create(300, 300)
    // this.enemies.create(600, 300)
    // this.enemies.create(100, 800);
    // this.enemies.create(160, 800);
    // this.enemies.create(100, 860);
    // this.enemies.create(160, 860);


    // this.enemies.create(1700, 800);
    // this.enemies.create(1760, 800);
    // this.enemies.create(1700, 860);
    // this.enemies.create(1760, 860);
    

    // Creer vagues prédisposées = Création d'un WaveManager ? voir avec maxime 
    // Avoir une variable pour accelerer vitesse enemis 
    // faire boucler les vagues en changeant vitesse 
    // En gros 2-3 vagues avec 2 types enemies (Range / Chaser) qui accelerent 


    const radius = 500


    // Wave exemple
    for (let i = 0; i < this.totalCountOfEnemy; i++) {
      const angle = Phaser.Math.DegToRad(Phaser.Math.Between(10, 170)+180)
      let pos = new Phaser.Math.Vector2(0,0)
      pos = pos.setToPolar(angle, radius + Phaser.Math.Between(0, 700))

      this.enemies.create(pos.x + this.base.pos.x, pos.y + this.base.pos.y + this.base.height / 2);
    }

    this.enemies.children.each((enemy) => {
      enemy.setTargetPosition(this.base.pos)
    })   


  }

  create() {
    // add background
    this.add.image(center.x, center.y, "bg").setScale(resolutionMultiplicator)

    this.base = new Base(this, center.x, center.y)
  
    this.waveNumber = 0

    this.createPlayers()
    this.createEnemies()

    this.cursors = this.input.keyboard.createCursorKeys()
    this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E)
    this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)

    this.addAxisControls()
    this.addEnemyBulletOverlapCheck()
    this.addEnemyBaseOverlapCheck()
    this.createUI()
  }

  createUI() {
    this.shieldCDText = this.add.text(0, 0, "shield cd: 0", { font: "25px Courier", fill: "#00ff00" })
  }

  addEnemyBaseOverlapCheck() {
    console.log(this.enemies, this.base)
    // this.physics.add.overlap(this.base, this.enemies, (base, enemy) => {
    //   console.log("overlap !!")
    //   base.takeDamage(1)
    //   enemy.kill()
    // })





    
  }

  addEnemyBulletOverlapCheck() {
    this.physics.add.overlap(
      this.players.children.entries[0].bullets,
      this.enemies,
      this.handleEnemyKills,
      this.checkBulletVsEnemy,
      this
    )
    this.physics.add.overlap(
      this.players.children.entries[1].bullets,
      this.enemies,
      this.handleEnemyKills,
      this.checkBulletVsEnemy,
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

    // value in seconds

    // min time between shield
    this.shieldCooldown = 2
    // time available for user to press shield button simultaneously
    this.shieldSyncWindow = 1
    // shield duration
    this.shieldDuration = 2

    this.hasStartedSyncWindow = false
    this.shieldSyncRemainingTime = this.shieldSyncWindow
    this.shieldRemainingCooldown = 0

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
        console.log("set shielding true")
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

  handleEnemyKills(bullet, enemy) {
    bullet.kill()
    enemy.kill()
  }

  enemyIsCollidingWithBase(enemy) {
    if (!enemy.active) return false;
    const {x, y} = enemy



    const base = this.base
    return x > base.pos.x - base.width / 2 && x < base.pos.x + base.width / 2 && y > base.pos.y - base.height / 2 && y < base.pos.y + base.height / 2
  }

  update(time, delta) {
    this.handleInputs(time, delta)


    // check for enemy hit
    this.enemies.children.each((enemy) => {
      if (this.enemyIsCollidingWithBase(enemy)) {
        enemy.kill()
        this.cameras.main.shake(10, 0.01)
  
        this.base.takeDamage(1)
      }
    })

    // shield timer handling
    const reset = () => {
      this.shieldSyncRemainingTime = 0
      this.hasStartedSyncWindow = false
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
      if (!!(this.isShielding["1"] ^ this.isShielding["2"]) && !this.hasStartedSyncWindow) {
        console.log("start !")
        this.shieldSyncRemainingTime = 1
        this.hasStartedSyncWindow = true
      }

      if (this.hasStartedSyncWindow) {
        // sync window countdown
        if (this.shieldSyncRemainingTime > 0) {
          this.shieldSyncRemainingTime -= delta / (this.shieldSyncWindow * 1000)
          // console.log(this.shieldSyncRemainingTime)
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
