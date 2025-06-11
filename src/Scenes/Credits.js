class CreditsScene extends Phaser.Scene {
    constructor() {
        super("creditsScene");
    }

    create() {
        this.sound.stopAll();
        const centerX = this.cameras.main.centerX;
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Title
        this.add.text(centerX, 80, "CREDITS", {
            fontFamily: "Georgia",
            fontSize: "48px",
            color: "#ffffff"
        }).setOrigin(0.5);

        // Credit lines
        const creditsText = [
            "Game Design: Ethan Akiyama",
            "Programming: Ethan Akiyama, Joseph Coulson, Humza Saulat",
            "Art: Kenny.nl (kenney.nl)",
            "Music & Sound: Ethan Akiyama",
            "Made with Phaser 3",
            "",
            "Thank you for playing!"
        ];

        creditsText.forEach((line, index) => {
            this.add.text(centerX, 160 + index * 30, line, {
                fontFamily: "Arial",
                fontSize: "20px",
                color: "#dddddd"
            }).setOrigin(0.5);
        });

        // Return instruction
        this.add.text(centerX, height - 50, "Press ESC to return", {
            fontFamily: "Arial",
            fontSize: "18px",
            color: "#aaaaaa"
        }).setOrigin(0.5);

        // Input
        this.input.keyboard.once("keydown-ESC", () => {
            this.scene.start("titleScene");
        });
    }
}