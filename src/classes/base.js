import { resolutionMultiplicator, center } from "../constants"

class Base extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y) {
    super(scene, x, y, "base")

    // base image handling
    this.baseScale = 1
    this.width = 654 * this.baseScale
    this.height = this.width / 2

    this.pos = { x: center.x, y: 1440 * resolutionMultiplicator - this.height / 2 }
    scene.physics.add.image(center.x, 1440 * resolutionMultiplicator - this.height / 2, "base").setScale(this.baseScale)

    this.hp = 10
    this.isShieldActivated = false
  }

  setShield(duration) {
    this.isShieldActivated = true
    console.log("shield on !")
    setTimeout(() => {
      this.isShieldActivated = false
    }, duration * 1000)
  }

  takeDamage(damage) {
    console.log("taking a hit")
    if (this.isShieldActivated) {
      return
    }
    this.scene.cameras.main.shake(10, 0.01)
    this.hp -= damage
    if (this.hp <= 0) {
      // lose
    }
  }

  update() {}
}

export { Base }
