import { enemyData } from "../enemyData"

class Enemy extends Phaser.Physics.Arcade.Image {
  // voir avec maxime si enemy = chaser ou si autre classe EnemyChaser qui extend Enemy
  constructor(scene, x, y, name) {
    super(scene, x, y, "turret")
    this.targetPosition = null

    this.stats = enemyData.find((enemy) => enemy.name === name)
  }

  setTargetPosition(base) {
    this.targetPosition = { x: base.x, y: base.y }
  }

  update() {
    this.goTowardsBase()
  }

  goTowardsBase() {
    const dx = this.targetPosition.x - this.x // remplacer par target position
    const dy = this.targetPosition.y - this.y

    const angle = Math.atan2(dy, dx)
    this.body.setVelocity(Math.cos(angle) * this.stats.speed, Math.sin(angle) * this.stats.speed)
  }

  kill() {
    this.setActive(false)
    this.setVisible(false)
    this.body.stop()
  }
}

export { Enemy }
