class HighscoreScene extends Phaser.Scene {
    constructor() {
        super({ key: 'HighscoreScene', active: true })

        this.playerText
    }

    preload() {
    
    }

    create() {
        scene.add.text(100, 260, 'Button', { fontFamily: 'Retrograde' }).setTint(0xff0000);

        //  Do this, otherwise this Scene will steal all keyboard input
        this.input.keyboard.enabled = false;



    }


}

export default HighscoreScene; 