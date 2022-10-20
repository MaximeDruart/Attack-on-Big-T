import { enemyData } from "../enemyData"
import { ranges } from "../constants"
const { RANGED } = ranges
import { Bullet } from "./bullet"
import randomAudio from "../randomAudio.js"

class Enemy extends Phaser.Physics.Arcade.Sprite {
  // voir avec maxime si enemy = chaser ou si autre classe EnemyChaser qui extend Enemy
  constructor(scene, x, y, name) {
    super(scene, x, y, name)

    this.stats = enemyData.find((enemy) => enemy.name === name)
    this.statsBackUp = structuredClone(this.stats)
    if (this.stats.range === RANGED) this.play("e1000-fly")

    this.targetPosition = null

    this.hp = this.stats.hp

    if (this.stats.range === RANGED) {
      this.bullets = scene.physics.add.group({ classType: Bullet, maxSize: 100, runChildUpdate: true })
      this.shootInterval = setInterval(
        this.rangeAttack.bind(this),
        this.stats.attackDelay * Phaser.Math.Between(900, 1100)
      )
    }
  }

  setTargetPosition(base) {
    this.targetPosition = { x: base.x, y: base.y }
    const direction = new Phaser.Math.Vector2().setFromObject(this.targetPosition).subtract(this)
    if (direction.x > 0) this.flipX = true
  }

  update(time, delta) {
    this.goTowardsBase()
  }

  goTowardsBase() {
    const direction = new Phaser.Math.Vector2().setFromObject(this.targetPosition).subtract(this)

    let speed = this.stats.speed
    if (this.stats.range === RANGED && direction.length() < 800) {
      speed *= 0.3
    }
    direction.normalize().scale(speed)

    this.body.setVelocity(direction.x, direction.y)
  }

  registerHit(hitDamage = 1) {
    // sprite flash
    this.scene.tweens.addCounter({
      from: 255,
      to: 0,
      duration: 100,
      yoyo: true,
      onUpdate: (tween) => {
        const value = Math.floor(tween.getValue())
        this.setTint(Phaser.Display.Color.GetColor(value, value, 255))
      },
    })
    // registering damage and not allowing values under 0
    this.hp -= hitDamage
    this.hp = Math.max(this.hp, 0)
  }

  kill() {
    //const kill =
    window.dispatchEvent(new Event("kill"))
    randomAudio(this.scene, ["explosion_two", "explosion_three"], 0.3)
    if (this.stats.range === RANGED) {
      clearInterval(this.shootInterval)
      this.bullets.clear(true, true)
    }
    this.setActive(false)
    this.setVisible(false)
    this.body.stop()
  }

  rangeAttack() {
    const bullet = this.bullets.get()
    if (bullet) {
      let bulletDirection = new Phaser.Math.Vector2().setFromObject(this.targetPosition).subtract(this).normalize()
      bullet.fire({ x: this.x, y: this.y }, bulletDirection, this.stats.attackSpeed)
    }
  }
}

export { Enemy }
