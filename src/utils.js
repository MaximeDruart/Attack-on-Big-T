const mapRange = (input, in_min, in_max, out_min, out_max) =>
  ((input - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min

export { mapRange }
