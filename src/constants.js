const HOME_RESOLUTION = "1920"
const ARCADE_RESOLUTION = "640"
const currentResolution = HOME_RESOLUTION

const resolutionMultiplicator = currentResolution / ARCADE_RESOLUTION

const center = { x: 640 / 2, y: 360 / 2 }

const ranges = {
  RANGED: "RANGED",
  MELEE: "MELEE",
}

// by much how the stats will be changed on bonus pickup
const bonusesStats = {
  fireDelay: -10,
  fireSpeed: 20,
  CDBonus: 0.08,
  bulletScale: 0.1,
}
const bonusesStatsKey = Object.keys(bonusesStats)

export { resolutionMultiplicator, center, ranges, bonusesStats, bonusesStatsKey }
