import { leaderboard } from "../axis"

class HighscoreScene extends Phaser.Scene {
  constructor() {
    super({ key: "HighscoreScene" })
    // console.log(leaderboard)
    // console.log(this.score)
  }

  fetchData() {}

  preload() {}

  create() {
    leaderboard.getScores().then((data) => {
      console.log(data)
      this.scoreData = data
    })

    // this.add.text(100, 260, "Button", { fontFamily: "Retrograde" }).setTint(0xff0000)

    //  Do this, otherwise this Scene will steal all keyboard input
    this.input.keyboard.enabled = false
  }
}

export default HighscoreScene
