const HOME_RESOLUTION = "1920"
const ARCADE_RESOLUTION = "2560"
const currentResolution = HOME_RESOLUTION

const resolutionMultiplicator = currentResolution / ARCADE_RESOLUTION

const center = { x: (2560 * resolutionMultiplicator) / 2, y: (1440 * resolutionMultiplicator) / 2 }

export { resolutionMultiplicator, center }
