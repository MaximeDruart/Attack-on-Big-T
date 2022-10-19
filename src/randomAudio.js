export default function (scene, sounds) {
    let audioIndex = Math.floor(Math.random() * sounds.length);
    return scene.sound.play(sounds[audioIndex])
}