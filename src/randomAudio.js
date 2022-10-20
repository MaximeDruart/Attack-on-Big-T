export default function (scene, sounds, volume) {
    let audioIndex = Math.floor(Math.random() * sounds.length);
    let sound = scene.sound.add(sounds[audioIndex])
    if(volume) sound.setVolume(volume)
    return sound.play()
}