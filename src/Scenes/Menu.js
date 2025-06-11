class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    init(data){
        this.level = data.level;
    }
    preload() {
        this.load.image('noteRed', 'assets/music note cute red.png');
        this.load.image('noteBlue', 'assets/music note cute.png');
    }

    create() {
        // Set background color to match the design
        
        this.cameras.main.setBackgroundColor('#1a1a2e');

        // Create title
        this.add.text(720, 80, 'LEVEL SELECT', {
            fontSize: '64px',
            fontFamily: 'Georgia, serif',
            color: '#ffffff'
        }).setOrigin(0.5);

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

        // Create Back button
        const backButton = this.add.text(160, 80, 'Back (esc)', buttonStyle)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.handleBackButton())
            .on('pointerover', () => this.hoverButton(backButton))
            .on('pointerout', () => this.unhoverButton(backButton));

        // Create Tutorial button
        const tutorialButton = this.add.text(720, 200, 'Tutorial', buttonStyle)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.handleTutorial())
            .on('pointerover', () => this.hoverButton(tutorialButton))
            .on('pointerout', () => this.unhoverButton(tutorialButton));

        // Create Level 1 button
        const level1Button = this.add.text(720, 280, 'Level 1: Montuno Hop', buttonStyle)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.handleLevel(1))
            .on('pointerover', () => this.hoverButton(level1Button))
            .on('pointerout', () => this.unhoverButton(level1Button));

        // Create Level 2 button
        const level2Button = this.add.text(720, 360, "Level 2: Gettin' Funky", buttonStyle)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.handleLevel(2))
            .on('pointerover', () => this.hoverButton(level2Button))
            .on('pointerout', () => this.unhoverButton(level2Button));

        // Store buttons for easy access
        this.buttons = [backButton, tutorialButton, level1Button, level2Button];

        // Add keyboard support
        this.cursors = this.input.keyboard.createCursorKeys();
        this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        
        // Handle ESC key
        this.escKey.on('down', () => this.handleBackButton());

        // Add rounded rectangle backgrounds behind buttons
        this.buttons.forEach(button => {
            const bounds = button.getBounds();
            const bg = this.add.graphics();
            bg.fillStyle(0xd4d4d4);
            bg.fillRoundedRect(bounds.x - 5, bounds.y - 2, bounds.width + 10, bounds.height + 4, 12);
            bg.setDepth(-1);
            button.bg = bg;
        });

                const sparkleKeys = ['noteRed', 'noteBlue'];

        this.time.addEvent({
            delay: 500,
            loop: true,
            callback: () => {
                const x = Phaser.Math.Between(0, this.scale.width);
                const y = Phaser.Math.Between(0, this.scale.height);
                const selectedKey = Phaser.Math.RND.pick(sparkleKeys);

                const sparkle = this.add.image(x, y, selectedKey)
                    .setAlpha(0)
                    .setScale(0.4);

                this.tweens.add({
                    targets: sparkle,
                    alpha: { from: 0, to: 1 },
                    scale: { from: 0.4, to: 0.6 },
                    duration: 300,
                    ease: 'Sine.easeOut',
                    yoyo: true,
                    onComplete: () => sparkle.destroy()
                });
            }
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

    handleBackButton() {
        console.log('Back button pressed');
        //-1 title
        //0 tutorial
        // 1 level 1
        // 2 level 2
        if (this.level == -1) {
            this.scene.start("titleScene");
        } else if (this.level == 0) {
            this.scene.start("platformerScene");
        } else if (this.level == 1) {
            this.scene.start("platformerScene3")
        } else if (this.level == 2) {
            this.scene.start("platformerScene2")
        }
    }

    handleTutorial() {
        this.scene.start('platformerScene');
    }

    handleLevel(levelNumber) {
        if (levelNumber == 1) {
            this.scene.start('platformerScene3');
        }
        if (levelNumber == 2) {
            this.scene.start('platformerScene2');
        }
    }
}

// Export the scene if using modules
// export default MenuScene;