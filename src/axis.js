import Axis from "axis-api"

const gamepadEmulator = Axis.createGamepadEmulator(0) // 0 is gamepad index, often represents the first gamepad connected to your computer

// Map Keyboard Keys to Axis Machine Buttons from group 1
Axis.registerKeys("a", "a", 1) // keyboard key "q" to button "a" from group 1
Axis.registerKeys("z", "x", 1) // keyboard key "d" to button "x" from group 1
Axis.registerKeys("e", "i", 1) // keyboard key "z" to button "i" from group 1
Axis.registerKeys("r", "s", 1) // keyboard key "s" to button "s" from group 1
Axis.registerKeys("t", "w", 1) // keyboard key Space to button "w" from group 1

// Map Keyboard Keys to Axis Machine Buttons from group 2
Axis.registerKeys("q", "a", 2) // keyboard key "ArrowLeft" to button "a" from group 2
Axis.registerKeys("s", "x", 2) // keyboard key "ArrowRight" to button "x" from group 2
Axis.registerKeys("d", "i", 2) // keyboard key "ArrowUp" to button "i" from group 2
Axis.registerKeys("f", "s", 2) // keyboard key "ArrowDown" to button "s" from group 2
Axis.registerKeys("g", "w", 2) // keyboard key "Enter" to button "w" from group 2

Axis.joystick1.setGamepadEmulatorJoystick(gamepadEmulator, 0) // 0 is the joystick index of the gamepad, often the one on the left side
Axis.joystick2.setGamepadEmulatorJoystick(gamepadEmulator, 1) // 1 is the joystick index of the gamepad, often the one on the right side

Axis.registerGamepadEmulatorKeys(gamepadEmulator, 0, "a", 1) // Gamepad button index 0 (PS4 X) to button "a" from group 1
Axis.registerGamepadEmulatorKeys(gamepadEmulator, 1, "x", 1) // Gamepad button index 1 (PS4 Square) to button "x" from group 1
Axis.registerGamepadEmulatorKeys(gamepadEmulator, 2, "i", 1) // Gamepad button index 2 (PS4 Circle) to button "i" from group 1
Axis.registerGamepadEmulatorKeys(gamepadEmulator, 3, "s", 1) // Gamepad button index 3 (PS4 Triangle) to button "s" from group 1

Axis.registerGamepadEmulatorKeys(gamepadEmulator, 4, "a", 2) // Gamepad button index 0 (PS4 X) to button "a" from group 1
Axis.registerGamepadEmulatorKeys(gamepadEmulator, 5, "x", 2) // Gamepad button index 1 (PS4 Square) to button "x" from group 1
Axis.registerGamepadEmulatorKeys(gamepadEmulator, 6, "i", 2) // Gamepad button index 2 (PS4 Circle) to button "i" from group 1
Axis.registerGamepadEmulatorKeys(gamepadEmulator, 7, "s", 2) // Gamepad button index 3 (PS4 Triangle) to button "s" from group 1

const player1axis = Axis.createPlayer({
  id: 1,
  joysticks: Axis.joystick1,
  // Can also be an array of both joysticks...
  // joysticks: [Axis.joystick1, Axis.joystick2],
  buttons: Axis.buttonManager.getButtonsById(1), // Give player 1 all buttons from group 1
})

const player2axis = Axis.createPlayer({
  id: 2,
  joysticks: Axis.joystick2,
  buttons: Axis.buttonManager.getButtonsById(2), // Give player 1 all buttons from group 2
})

const leaderboard = Axis.createLeaderboard({
  id: "BIG-T-7a05ef32-f5a1-41d4-89f2-dd34238b00d5",
})

export { gamepadEmulator, player1axis, player2axis, leaderboard }
