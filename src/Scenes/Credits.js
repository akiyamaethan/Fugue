class CreditsScene extends Phaser.Scene {
    constructor() {
        super("creditsScene");
    }

    create() {
        // Set background color to match the design
        this.cameras.main.setBackgroundColor('#1a1a2e');

        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

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

        // Calculate content height for just title and credits (not including button)
        const titleHeight = 64;
        const creditsHeight = creditsText.length * 30;
        const spacing = 40; // Space between title and credits
        const contentHeight = titleHeight + spacing + creditsHeight;

        // Calculate starting Y position to center title and credits
        const startY = centerY - (contentHeight / 2);

        // Create title
        const title = this.add.text(centerX, startY + (titleHeight / 2), 'CREDITS', {
            fontSize: '64px',
            fontFamily: 'Georgia, serif',
            color: '#ffffff',
            backgroundColor: 'transparent',
            padding: { x: 20, y: 12 },
        }).setOrigin(0.5);

        // Add credits text
        const creditsStartY = startY + titleHeight + spacing;
        creditsText.forEach((line, index) => {
            this.add.text(centerX, creditsStartY + index * 30, line, {
                fontFamily: "Arial",
                fontSize: "20px",
                color: "#dddddd"
            }).setOrigin(0.5);
        });

        // Button styling configuration
        const buttonStyle = {
            fontSize: '20px',
            fontFamily: 'Arial, sans-serif',
            color: '#333333',
            backgroundColor: 'transparent',
            padding: { x: 20, y: 12 },
            fixedWidth: 300,
            fixedHeight: 50,
            align: 'center'
        };

        // Create Back button - back in original position (top left area)
        const backButton = this.add.text(240, 80, 'Back (ESC)', buttonStyle)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.scene.start("titleScene"))
            .on('pointerover', () => this.hoverButton(backButton))
            .on('pointerout', () => this.unhoverButton(backButton));

        this.sound.stopAll();

        // Create button background
        const bounds = backButton.getBounds();
        const bg = this.add.graphics();
        bg.fillStyle(0xd4d4d4);
        bg.fillRoundedRect(bounds.x - 5, bounds.y - 2, bounds.width + 10, bounds.height + 4, 12);
        bg.setDepth(-1);
        backButton.bg = bg;

        // Input
        this.input.keyboard.once("keydown-ESC", () => {
            this.scene.start("titleScene");
        });
    }
    
    hoverButton(button) {
        if (button.bg) {
            button.bg.clear();
            button.bg.fillStyle(0xc4c4c4);
            const bounds = button.getBounds();
            button.bg.fillRoundedRect(bounds.x - 5, bounds.y - 2, bounds.width + 10, bounds.height + 4, 12);
        }
    }

    unhoverButton(button) {
        if (button.bg) {
            button.bg.clear();
            button.bg.fillStyle(0xd4d4d4);
            const bounds = button.getBounds();
            button.bg.fillRoundedRect(bounds.x - 5, bounds.y - 2, bounds.width + 10, bounds.height + 4, 12);
        }
    }
}