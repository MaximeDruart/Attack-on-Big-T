import { mapRange } from "../utils"
import { Bullet } from "./bullet"
import randomAudio from "../randomAudio.js"
import { Laser } from "./laser"
import { bonusesStats } from "../constants"

class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, playerNumber, linearPosition) {
    const color = playerNumber === 1 ? "blue" : "red"
    const img = playerNumber === 1 ? "blueTurret" : "redTurret"
    super(scene, x, y, img)

    this.playerNumber = playerNumber
    this.speed = 0.018
    this.img = img
    this.color = color

    scene.add.existing(this)
    scene.physics.add.existing(this)
    this.setCollideWorldBounds(true)

    this.linearPosition = linearPosition

    this.bullets = scene.physics.add.group({ classType: Bullet, maxSize: 30, runChildUpdate: true })

    this.cannonRotation = 0

    this.invertedControls = false

    this.lastFired = 0

    this.cannonBaseStats = {
      fireDelay: 150,
      fireSpeed: 800,
      bulletScale: 1,
    }
    this.cannonStats = structuredClone(this.cannonBaseStats)

    this.laser = new Laser(this.scene)
    this.isShootingLaser = false

    this.ropeSpriteWidth = 12
    this.rope = scene.add.tileSprite(100, 100, this.ropeSpriteWidth, 0, "ropeTile")

    this.hook = scene.physics.add.image(0, 0, "ropeGrab")

    this.rope.setActive(true)
    this.rope.setVisible(true)
    this.hook.setActive(false)
    this.hook.setVisible(false)

    this.isShootingHook = false
    this.hookLength = 0
    this.hookSpeed = 0.4
    this.hookRetractionSpeed = 0.7
    this.maxHookLength = 600
  }

  update(time, delta) {
    if (this.isShootingLaser) {
      this.laser.updateLaserPosition(
        this,
        new Phaser.Math.Vector2(0, 1).rotate(this.cannonRotation).normalize().negate()
      )
    }

    if (!this.isShootingHook) {
      if (this.hookLength > 0) {
        this.hookLength -= this.hookRetractionSpeed * delta
        this.hookLength = Math.max(this.hookLength, 0)
        if (this.hookLength === 0) {
          this.hook.setActive(false)
          this.hook.setVisible(false)
          this.rope.setActive(false)
          this.rope.setVisible(false)
        }
      }
    } else {
      this.hookLength += delta * this.hookSpeed
      this.hookLength = Math.min(this.hookLength, this.maxHookLength)
    }
    this.updateHookPosition()
  }

  updateHookPosition() {
    const turretPosition = new Phaser.Math.Vector2(this.x, this.y)
    let bulletDirection = new Phaser.Math.Vector2(0, 1).rotate(this.cannonRotation).normalize().negate()

    this.rope.height = this.hookLength

    const ropePosition = new Phaser.Math.Vector2(this.x, this.y)
    const ropeDir = bulletDirection.clone()
    ropePosition.add(ropeDir.scale(this.rope.height / 2 + this.height / 2))

    this.rope.setPosition(ropePosition.x, ropePosition.y)
    this.rope.setRotation(bulletDirection.angle() + Math.PI / 2)

    const hookPosition = turretPosition.add(bulletDirection.scale(this.hookLength + 30))
    this.hook.setPosition(hookPosition.x, hookPosition.y)
    this.hook.setRotation(bulletDirection.angle() + Math.PI / 2)
  }

  setPositionFromLinear() {
    const az = this.linearPosition * Math.PI - Math.PI
    const radius = this.base.height + 12
    let pos = new Phaser.Math.Vector2(0, 0)
    pos.setToPolar(az, radius)
    pos.add({ x: this.base.pos.x, y: this.base.pos.y + this.base.height / 2 })

    this.setPosition(pos.x, pos.y)

    this.cannonRotation = mapRange(this.linearPosition, 0, 1, -Math.PI / 2, Math.PI / 2)
    this.setRotation(this.cannonRotation)
  }

  setBase(base) {
    this.base = base
  }

  increaseStat(statKey) {
    this.cannonStats[statKey] += bonusesStats[statKey]
  }

  movePlayer(dir, otherPlayerLinear) {
    this.tempLinear = this.linearPosition + dir * this.speed

    // would need to be calculated from the actual width of the turret and the total width to get the accurate linear value but hey we got 3 days
    const turretWidthInLinear = 0.06

    let canMove =
      this.tempLinear + turretWidthInLinear < otherPlayerLinear - turretWidthInLinear ||
      this.tempLinear - turretWidthInLinear > otherPlayerLinear + turretWidthInLinear

    if (canMove) {
      this.linearPosition += this.speed * dir
      this.linearPosition = Phaser.Math.Clamp(this.linearPosition, 0.05, 0.95)
      this.setPositionFromLinear()
    }
  }

  shoot(time) {
    if (this.isShootingLaser) return
    if (time < this.lastFired) return
    const bullet = this.bullets.get()
    if (bullet) {
      randomAudio(this.scene, ["laser_one", "laser_two"], 0.3)
      this.play(this.img + "Anim")

      // up vector, rotate it by the angle of the cannon, the normalize it so speed can be applied and reverse to point outwards
      let bulletDirection = new Phaser.Math.Vector2(0, 1).rotate(this.cannonRotation).normalize().negate()
      bullet.setScale(this.cannonStats.bulletScale)
      bullet.fire({ x: this.x, y: this.y }, bulletDirection, this.cannonStats.fireSpeed)
      this.lastFired = time + this.cannonStats.fireDelay
    }
  }

  shootLaser(duration) {
    this.play(this.color + "LaserAnim")
    let bulletDirection = new Phaser.Math.Vector2(0, 1).rotate(this.cannonRotation).normalize().negate()
    this.laser.fire({ x: this.x, y: this.y }, bulletDirection)
    this.isShootingLaser = true
    this.scene.cameras.main.shake(duration * 1000, 0.007)
    setTimeout(() => {
      this.isShootingLaser = false
      this.laser.kill()
      this.playReverse(this.color + "LaserAnim")
    }, duration * 1000)
  }

  shootHook() {
    if (!this.isShootingHook) {
      this.isShootingHook = true
      this.hook.setActive(true)
      this.hook.setVisible(true)
      this.rope.setActive(true)
      this.rope.setVisible(true)
    }
  }

  stopHook() {
    this.isShootingHook = false
  }
}

export { Player }
