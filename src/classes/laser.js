class Laser extends Phaser.Physics.Arcade.Sprite {
  constructor(scene) {
    super(scene, 0, 0, "laser")

    // this.img = scene.physics.add.image(550, 550, "laser")
    scene.add.existing(this)
    scene.physics.add.existing(this)
    this.setActive(false)
    this.setVisible(false)

    this.damage = 10000
  }

  fire(origin, dir) {
    this.setActive(true)
    this.setDepth(1)
    this.setVisible(true)

    this.play("laserAnim")

    this.updateLaserPosition(origin, dir)
    this.playAudio()
  }

  playAudio() {
    let sound = this.scene.sound.add("big_laser")
    sound.setVolume(0.8)
    sound.play()
  }

  updateLaserPosition(origin, dir) {
    const position = {
      x: origin.x + dir.x,
      y: origin.y + dir.y,
    }

    const vec2 = new Phaser.Math.Vector2().setFromObject(position)

    vec2.add(dir.scale(this.height / 2))

    this.setPosition(vec2.x, vec2.y)
    this.setRotation(dir.angle() + Math.PI / 2)
  }

  kill() {
    this.setActive(false)
    this.setVisible(false)
    // this.body.stop()
  }

  update(time, delta) {}
}

export { Laser }
