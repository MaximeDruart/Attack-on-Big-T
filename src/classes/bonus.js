class Bonus extends Phaser.Physics.Arcade.Sprite {
  // voir avec maxime si enemy = chaser ou si autre classe EnemyChaser qui extend Enemy
  constructor(scene, x, y, upgrade) {
    super(scene, x, y, "bonus")

    this.statUpgrade = upgrade
  }

  update(time, delta) {}

  pickUpBonus() {
    this.scene.players.children.each((player) => player.increaseStat(this.statUpgrade))
  }

  kill() {
    this.setActive(false)
    this.setVisible(false)
    this.body.stop()
  }
}

export { Bonus }
