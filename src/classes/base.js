import { resolutionMultiplicator, center } from "../constants"

class Base extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y, setGameOver) {
    super(scene, x, y, "base")

    // base image handling
    this.baseScale = 1
    this.width = 96 * this.baseScale
    this.height = this.width / 2
    this.setGameOver = setGameOver
    this.pos = { x: center.x, y: 360 - this.height / 2 }
    scene.physics.add.image(this.pos.x, this.pos.y, "base").setScale(this.baseScale)

    this.shieldSprite = scene.add.sprite(this.pos.x, this.pos.y, "base-shield").setScale(0.5)
    this.shieldSprite.alpha = 0

    this.hub = scene.add.image(center.x, 360 - 39 / 2, "hubTop")
    this.hub.setDepth(2)

    this.lives = 3
    this.hp = 10
    this.isShieldActivated = false
  }

  setShield(duration) {
    this.isShieldActivated = true
    this.scene.tweens.add({
      targets: this.shieldSprite,
      alpha: { value: 1, duration: 200, ease: "Power1" },
      onComplete: () => {
        this.shieldSprite.play("base-shield-anim")
      },
    })

    setTimeout(() => {
      this.isShieldActivated = false
      this.scene.tweens.add({
        targets: this.shieldSprite,
        alpha: { value: 0, duration: 200, ease: "Power1" },
      })
    }, duration * 1000)
  }

  takeDamage(damage) {
    if (this.isShieldActivated) {
      return
    }
    this.hp -= damage
    this.scene.hpText.setText(`hp: ${this.hp}`)
    this.scene.cameras.main.shake(50, 0.01)

    this.hp = Math.max(this.hp, 0)

    if (this.hp <= 0) {
      this.hp = 10
      this.lives -= 1
      this.lives = Math.max(this.lives, 0)
      this.scene.livesText.setText(`LIVES: ${this.lives}`)

      if (this.lives <= 0) {
        // game over
        this.setGameOver()
      }
    }
  }

  update() {}
}

export { Base }
