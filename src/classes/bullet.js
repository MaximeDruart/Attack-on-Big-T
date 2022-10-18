class Bullet extends Phaser.Physics.Arcade.Image {
  constructor(scene) {
    super(scene, 0, 0, "turret")
    this.speed = 200

    // this.setCollideWorldBounds(true)
    // this.body.onWorldBounds = true

    // this.body.world.on("worldbounds", function (body) {
    //   // Check if the body's game object is the sprite you are listening for
    //   if (body.gameObject === this) {
    //     // Stop physics and render updates for this object
    //     this.setActive(false)
    //     this.setVisible(false)
    //   }
    // })
  }

  fire(origin, dir) {
    this.setActive(true)
    this.setVisible(true)
    this.setPosition(origin.x, origin.y)
    this.setVelocity(dir.x * this.speed, dir.y * this.speed)
    this.setRotation(dir.angle())
  }

  update(time, delta) {
    // console.log(this.x)
  }
}

export { Bullet }
