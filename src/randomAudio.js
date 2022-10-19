export default function (scene, sounds) {
    let audio = Math.floor(Math.random() * sounds.length);
    return scene.sound.play(sounds[audio])
}