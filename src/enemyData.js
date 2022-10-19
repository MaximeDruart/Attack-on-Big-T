import { ranges } from "./constants"
const { MELEE, RANGED } = ranges

export const enemyData = [
  {
    name: "mini-tardiveau",
    hp: 1,
    // speed: 50,
    speed: 300,
    range: MELEE,
    damage: 1,
    wave: {
      // what wave does this kind of enemy start appearing
      startWave: 0,
      startCount: 50,
      // how many enemies are added to the startCount for each successive wave
      waveGrowth: 10,
    },
  },
  {
    name: "E-1000",
    hp: 3,
    speed: 20,
    range: RANGED,
    damage: 1,
    wave: {
      startWave: 3,
      startCount: 3,
      waveGrowth: 1,
    },
  },
  {
    name: "tardi-rat",
    hp: 1,
    speed: 200,
    range: "MELEE",
    damage: 1,
    wave: {
      startWave: 5,
      startCount: 30,
      waveGrowth: 15,
    },
  },
  {
    name: "vigile",
    hp: 10,
    speed: 20,
    range: "MELEE",
    damage: 3,
    wave: {
      startWave: 2,
      startCount: 1,
      waveGrowth: 0.334,
    },
  },
]
