import { resolutionMultiplicator } from "../constants"

class Bullet extends Phaser.Physics.Arcade.Image {
  constructor(scene) {
    super(scene, 0, 0, "bullet")
  }

  fire(origin, dir, speed) {
    this.setActive(true)
    this.setVisible(true)

    // this.setSize(20,20)

    this.setPosition(origin.x, origin.y)
    this.setRotation(dir.angle() + Math.PI / 2)

    this.setVelocity(dir.x * speed, dir.y * speed)
  }

  kill() {
    this.setActive(false)
    this.setVisible(false)
    this.body.stop()
  }

  update(time, delta) {
    // check for oob and kill
    if (
      this.x < 0 ||
      this.x > 2560 * resolutionMultiplicator ||
      this.y < 0 ||
      this.y > 1440 * resolutionMultiplicator
    ) {
      this.kill()
    }
  }
}

export { Bullet }
