import { ranges } from "./constants"
const { MELEE, RANGED } = ranges

export const enemyData = [
  {
    name: "chaser",
    hp: 1,
    speed: 105,
    range: MELEE,
    attackDelay: 0,
    attackSpeed: 0,
    damage: 1,
    wave: {
      // what wave does this kind of enemy start appearing
      startWave: 0,
      startCount: 10,
      // how many enemies are added to the startCount for each successive wave
      waveGrowth: 2,
    },
  },
  {
    name: "e1000",
    hp: 3,
    speed: 60,
    range: RANGED,
    attackDelay: 5,
    attackSpeed: 120,
    damage: 1,
    wave: {
      startWave: 0,
      startCount: 3,
      waveGrowth: 1,
    },
  },
  {
    name: "rat",
    hp: 1,
    speed: 160,
    range: "MELEE",
    attackDelay: 0,
    attackSpeed: 0,
    damage: 1,
    wave: {
      startWave: 5,
      startCount: 16,
      waveGrowth: 10,
    },
  },
  {
    name: "chaser",
    hp: 10,
    speed: 20,
    range: "MELEE",
    attackDelay: 0,
    attackSpeed: 0,
    damage: 3,
    wave: {
      startWave: 2,
      startCount: 1,
      waveGrowth: 0.334,
    },
  },
]
