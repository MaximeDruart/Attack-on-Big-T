import Axis from "axis-api"

// Map Keyboard Keys to Axis Machine Buttons from group 1
Axis.registerKeys("q", "a", 1) // keyboard key "q" to button "a" from group 1
Axis.registerKeys("d", "x", 1) // keyboard key "d" to button "x" from group 1
Axis.registerKeys("z", "i", 1) // keyboard key "z" to button "i" from group 1
Axis.registerKeys("s", "s", 1) // keyboard key "s" to button "s" from group 1
Axis.registerKeys(" ", "w", 1) // keyboard key Space to button "w" from group 1

// Map Keyboard Keys to Axis Machine Buttons from group 2
Axis.registerKeys("ArrowLeft", "a", 2) // keyboard key "ArrowLeft" to button "a" from group 2
Axis.registerKeys("ArrowRight", "x", 2) // keyboard key "ArrowRight" to button "x" from group 2
Axis.registerKeys("ArrowUp", "i", 2) // keyboard key "ArrowUp" to button "i" from group 2
Axis.registerKeys("ArrowDown", "s", 2) // keyboard key "ArrowDown" to button "s" from group 2
Axis.registerKeys("Enter", "w", 2) // keyboard key "Enter" to button "w" from group 2
