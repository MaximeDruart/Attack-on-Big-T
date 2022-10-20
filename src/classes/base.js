import { resolutionMultiplicator, center } from "../constants"

class Base extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y) {
    super(scene, x, y, "base")

    // base image handling
    this.baseScale = 1
    this.width = 96 * this.baseScale
    this.height = this.width / 2

    this.pos = { x: center.x, y: 360 - this.height / 2 }
    scene.physics.add.image(this.pos.x, this.pos.y, "base").setScale(this.baseScale)

    this.shieldSprite = scene.add.sprite(this.pos.x, this.pos.y, "base-shield").setScale(0.5)
    this.shieldSprite.alpha = 0

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
    this.scene.hpText.setText(`hp: ${this.hp}`)
    this.scene.cameras.main.shake(50, 0.01)
    this.hp -= damage
    if (this.hp <= 0) {
      // lose
    }
  }

  update() {}
}

export { Base }
