import { bonusesStats } from "../constants"

class Bonus extends Phaser.Physics.Arcade.Sprite {
  // voir avec maxime si enemy = chaser ou si autre classe EnemyChaser qui extend Enemy
  constructor(scene, x, y, upgrade) {
    super(scene, x, y, `${upgrade}Sprite`)
    this.setScale(0.8)

    this.statUpgrade = upgrade
  }

  addedToScene() {
    this.play(`${this.statUpgrade}SpriteAnim`)

    this.to = setTimeout(() => {
      this.scene.tweens.add({
        targets: this,
        alpha: 0,
        duration: 2000,
        onComplete: this.kill.bind(this),
      })
    }, 5000)
  }

  pickUpBonus() {
    if (this.statUpgrade === "CDBonus") {
      this.scene.shieldCooldown -= bonusesStats[this.statUpgrade]
      this.shieldCooldown = Math.max(this.shieldCooldown, 0.5)

      this.scene.laserCooldown -= bonusesStats[this.statUpgrade] * 2
      this.laserCooldown = Math.max(this.laserCooldown, 2.5)
    } else {
      this.playAudio()
      this.scene.players.children.each((player) => player.increaseStat(this.statUpgrade))
    }
  }

  playAudio() {
    let sound = this.scene.sound.add(this.statUpgrade)
    sound.setVolume(3)
    sound.play()
  }

  kill() {
    this.setActive(false)
    this.setVisible(false)
    this.body.stop()
    clearTimeout(this.to)
  }
}

export { Bonus }
