import { resolutionMultiplicator, center } from "../constants"
import GameOverScene  from "../scenes/gameOver"

class Base extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y, setGameOver) {
    super(scene, x, y, "base")
    // this.sceneRef = scene
    // base image handling
    this.baseScale = 1
    this.width = 654 * this.baseScale
    this.height = this.width / 2
    this.setGameOver = setGameOver

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
    this.hp -= damage
    if (this.hp <= 0) {
      // lose
      console.log(this.setGameOver);
      this.setGameOver()
      // this.sceneRef.start('GameOverScene') 
    }
  }

  update() {}
}

export { Base }
