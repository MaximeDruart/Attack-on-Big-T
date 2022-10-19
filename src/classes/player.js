import { mapRange } from "../utils"
import { Bullet } from "./bullet"
import randomAudio from "../randomAudio.js";

class Player extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y, playerNumber, linearPosition) {
    super(scene, x, y, "turret")

    this.playerNumber = playerNumber
    this.speed = 0.005

    scene.add.existing(this)
    scene.physics.add.existing(this)
    this.setCollideWorldBounds(true)

    this.linearPosition = linearPosition

    this.bullets = scene.physics.add.group({ classType: Bullet, maxSize: 30, runChildUpdate: true })

    // add 10 bullets
    // for (let i = 0; i < 20; i++) {
    //   const bullet = this.bullets.create(0, 0, "turret").setScale(2, 0.3)
    //   bullet.setActive(false)
    //   bullet.setVisible(false)
    // }

    this.cannonRotation = 0

    this.lastFired = 0

    this.cannonStats = {
      fireDelay: 150,
      fireSpeed: 800,
    }
  }

  addedToScene() {
    // this.setPositionFromLinear()
  }

  update(t, dt) {}

  setPositionFromLinear() {
    const az = this.linearPosition * Math.PI - Math.PI
    const radius = this.base.height
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

  movePlayer(dir, otherPlayerLinear) {
    this.tempLinear = this.linearPosition + dir * this.speed

    // would need to be calculated from the actual width of the turret and the total width to get the accurate linear value but hey we got 3 days
    const turretWidthInLinear = 0.03

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
    if (time < this.lastFired) return
    const bullet = this.bullets.get()
    if (bullet) {
      randomAudio(this.scene, ['laser_one', 'laser_two'])
      // up vector, rotate it by the angle of the cannon, the normalize it so speed can be applied and reverse to point outwards
      let bulletDirection = new Phaser.Math.Vector2(0, 1).rotate(this.cannonRotation).normalize().negate()

      bullet.fire({ x: this.x, y: this.y }, bulletDirection, this.cannonStats.fireSpeed)
      this.lastFired = time + this.cannonStats.fireDelay
    }
  }
}

export { Player }
