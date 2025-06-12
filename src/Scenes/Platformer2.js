//THIS IS ACTUALLY LEVEL 3 PSYCHE

class Platformer2 extends Phaser.Scene {
    constructor() {
        super("platformerScene2");
    }

    init() {
        // variables and settings
        this.ACCELERATION = 600;
        this.physics.world.gravity.y = 1500;
        this.JUMP_VELOCITY = -500;
        this.PARTICLE_VELOCITY = 10;
        this.SCALE = 2.0;
        this.note1collected = false;
        this.note2collected = false;
        this.note3collected = false;
        this.isPaused = false;
        this.pauseMenu = null;
    }


    preload(){
        // LOAD AUDIO FOR LEVEL
        this.load.audio("note1Soundl3", "assets/note1l3.mp3");
        this.load.audio("note2Soundl3", "assets/note2l3.mp3");
        this.load.audio("note3Soundl3", "assets/note3l3.mp3");
        this.load.audio("chordSound", "assets/chord.mp3");
        this.load.audio("backgroundl3", "assets/backl3.mp3");
        this.load.audio("walking", "assets/walking.mp3");
        this.load.audio("jump", "assets/jump.mp3");
    }


    create() {
        // LOAD AUDIO INTO SOUND MANAGER
        this.sound.stopAll();
        this.note1Sound = this.sound.add("note1Soundl3");
        this.note2Sound = this.sound.add("note2Soundl3");
        this.note3Sound = this.sound.add("note3Soundl3");
        this.chordSound = this.sound.add("chordSound");
        this.backgroundMusic = this.sound.add("backgroundl3");
        this.walkingSound = this.sound.add("walking");
        this.jumpSound = this.sound.add("jump");
        this.backgroundMusic.play({
            loop: true,
            volume: 0.5
        });
        this.note1Sound.play({
            loop: true,
            volume: 0,
            detune: 0
        });
        this.note2Sound.play({
            loop: true,
            volume: 0
        });
        this.note3Sound.play({
            loop: true,
            volume: 0
        });


        // MAP SETUP
        // Create a new tilemap game object 
        this.map = this.add.tilemap("platformer-level-2", 18, 18, 200, 80); 
        // Add a tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.tileset = this.map.addTilesetImage("kenny_tilemap_packed", "tilemap_tiles");
        this.tileset2 = this.map.addTilesetImage("ethantiles", "tilemap_tiles_ethan");
        // Create a layer
        this.groundLayer = this.map.createLayer("Ground-n-Platforms", [this.tileset, this.tileset2], 0, 0);
        // Make it collidable
        this.groundLayer.setCollisionByProperty({
            collides: true
        });
        // add danger collidables
        this.groundLayer.setCollisionByProperty({
            danger: true
        });
        //create spawn point
        let spawnX = 0;
        let spawnY = 0;
        this.groundLayer.forEachTile(tile => {
            if (tile.properties.spawn === true) {
                spawnX = tile.getCenterX();
                spawnY = tile.getCenterY();
            }
        });


        // Create note and finishline objects from Tiled Object Layer
        const tilesets = this.map.tilesets;

        this.note1group = this.physics.add.staticGroup();
        this.note2group = this.physics.add.staticGroup();
        this.note3group = this.physics.add.staticGroup();
        this.endgroup = this.physics.add.staticGroup();

        this.map.getObjectLayer("Notes").objects.forEach(obj => {
            if (!obj.gid) return;

            // Find the tileset this gid belongs to
            const tileset = tilesets.find(ts => obj.gid >= ts.firstgid && obj.gid < ts.firstgid + ts.total);
            if (!tileset) return;

            const frame = obj.gid - tileset.firstgid;
            const tilesetKey = tileset.name === "ethantiles" ? "tilemap_tiles_ethan" : "tilemap_sheet"; // adjust if you use other tilesets

            // Correct position (Tiled's y is bottom-left; Phaser's is top-left)
            const x = obj.x;
            const y = obj.y - obj.height;

            let group;
            if (obj.name === "note1") group = this.note1group;
            else if (obj.name === "note2") group = this.note2group;
            else if (obj.name === "note3") group = this.note3group;
            else if (obj.name === "finish") group = this.endgroup;

            if (group) {
                const sprite = group.create(x, y, tilesetKey, frame);
                sprite.setOrigin(0, 0); // Set origin to bottom-left to match Tiled
                sprite.refreshBody();
            }
        });


        // PLAYER SETUP
        my.sprite.player = this.physics.add.sprite(spawnX, spawnY, "platformer_characters", "tile_0000.png");
        //my.sprite.player.setCollideWorldBounds(true);
        my.sprite.player.setDragX(1000);
        my.sprite.player.setMaxVelocity(200,500);

/*         //water effects
        this.waterTiles = this.groundLayer.filterTiles(tile => {
            return tile.properties.water == true;
        });

        my.vfx.bubbles = this.add.particles(0,0, "kenny-particles", {
            frame: ["circle_01.png", "circle_02.png"],
            randomFrame: true,
            scale: { start: 0.01, end: 0.03 },
            lifespan: 250,
            gravityY: -500,
            alpha: { start: 1, end: 0.1 },
            //quantity: 8,
            emitting: false
        }); */

        // VFX FOR NOTES
        my.vfx.note = this.add.particles(0,0, "kenny-particles", {
            frame: ["star_01.png", "star_02.png"],
            randomFrame: true,
            scale: { start: 0.03, end: 0.1 },
            lifespan: 350,
            gravityY: -400,
            alpha: { start: 1, end: 0.1 },
            //quantity: 8,
            emitting: false
        });

        // VFX FOR WALKING
        my.vfx.walking = this.add.particles(0, 0, "kenny-particles", {
            frame: ['dirt_01.png', 'dirt_02.png'],
            random: true,
            scale: {start: 0.01, end: 0.02},
            //maxAliveParticles: 8,
            lifespan: 250,
            gravityY: -100,
            alpha: {start: 1, end: 0.1}, 
            emitting: false
        });

        // VFX FOR JUMPING
        my.vfx.jump = this.add.particles(0,0, "kenny-particles", {
            frame: "slash_04.png",
            lifespan: 500,
            scale: .08,
            alpha: { start: 1, end: 0 },
            gravityY: 200,
            emitting: false
        });


        // NOTE AND FINISH AND DANGER COLLISION HANDLERS:
        this.physics.add.overlap(my.sprite.player, this.note1group, (player, note) => {
            this.note1Sound.setVolume(.5);
            my.vfx.note.emitParticleAt(note.x, note.y);
            this.note1collected = true
            note.destroy();
        });

        this.physics.add.overlap(my.sprite.player, this.note2group, (player, note) => {
            this.note2Sound.setVolume(.5);
            my.vfx.note.emitParticleAt(note.x, note.y);
            this.note2collected = true;
            note.destroy();
        }, null, this);

        this.physics.add.overlap(my.sprite.player, this.note3group, (player, note) => {
            this.note3Sound.setVolume(.5);
            my.vfx.note.emitParticleAt(note.x, note.y);
            this.note3collected = true;
            note.destroy();
        }, null, this);

        this.physics.add.overlap(my.sprite.player, this.endgroup, (player, note) => {
            if (this.note1collected && this.note2collected && this.note3collected) {
                this.sound.stopAll();
                this.chordSound.play();
                this.walkingSound.stop();
                this.scene.start("creditsScene");
            }
        }, null, this);

        this.physics.add.collider(my.sprite.player, this.groundLayer, (player, tile) => {
            if (tile.properties.danger) {
                this.scene.restart();
            }
        });


        // INPUT SETUP 
        cursors = this.input.keyboard.createCursorKeys();
        this.rKey = this.input.keyboard.addKey('R');
        this.escKey = this.input.keyboard.addKey('ESC');

        
        // CAMERA
        this.cameras.main.setBackgroundColor('#87CEEB');
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.player, true, 0.9, 0.9);
        this.cameras.main.setZoom(this.SCALE);
        //this.cameras.main.setZoom(.4);
    }

    update() {
        // DEBUGGING HELP:
        //console.log('x: ' + my.sprite.player.x);
        //console.log('y: ' + my.sprite.player.y);
        // Handle ESC key for pause menu
        if (Phaser.Input.Keyboard.JustDown(this.escKey)) {
            if (this.isPaused) {
                this.closePauseMenu();
            } else {
                this.createPauseMenu();
            }
            return; // Don't process other inputs when toggling pause
        }

        // Don't process game updates if paused
        if (this.isPaused) {
            return;
        }
        // PLAYER MOVEMENT & INPUT
        if (cursors.left.isDown || cursors.right.isDown) {
            my.sprite.player.setAccelerationX(cursors.left.isDown ? -this.ACCELERATION : this.ACCELERATION);
            this.previousDirection = 1;
            my.sprite.player.setFlip(cursors.right.isDown, false);
            my.sprite.player.anims.play('walk', true);
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2, false);
            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            my.vfx.walking.start();
            if (!this.walkingSound.isPlaying) {
                this.walkingSound.play({ loop: true, volume: 0.3, rate: 4 });
            }
        } else {
            my.sprite.player.setAccelerationX(0);
            if (this.previousDirection !== 0) {
                let vx = my.sprite.player.body.velocity.x;
                my.sprite.player.setVelocityX(vx * 0.2);
                this.previousDirection = 0;
            }
            my.sprite.player.anims.play('idle');
            my.vfx.walking.stop();
            if (this.walkingSound.isPlaying) {
                this.walkingSound.stop();
            }
        }



        if (!my.sprite.player.body.blocked.down) {
            this.walkingSound.stop();
            my.vfx.walking.stop();
        }
        // player jump
        // note that we need body.blocked rather than body.touching b/c the former applies to tilemap tiles and the latter to the "ground"
        if(!my.sprite.player.body.blocked.down) {
            my.sprite.player.anims.play('jump');
        }
        if(my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.up)) {
            my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
            this.jumpSound.play({volume:.1});
            my.vfx.jump.emitParticleAt(my.sprite.player.x,my.sprite.player.y +20);
        }

        if(Phaser.Input.Keyboard.JustDown(this.rKey)) {
            this.scene.restart();
        }

        if (!my.sprite.player.body.onFloor()) {
            my.sprite.player.setDragX(300);
        }

/*         this.waterTiles.forEach(tile => {
            let emit = Math.floor(Math.random() * 100) + 1;
            let x = tile.getCenterX();
            let minx = x-5;
            let maxx = x+5;
            let y = tile.getCenterY();
            let miny = y-5;
            let maxy = y+5
            let randomx = Math.floor(Math.random() * (maxx - minx + 1)) + minx;
            let randomy = Math.floor(Math.random() * (maxy - miny + 1)) + miny;
            if (emit == 2) my.vfx.bubbles.emitParticleAt(randomx,randomy);
        }); */
    }

    createPauseMenu() {
        // Pause the physics and sounds
        this.physics.pause();
        this.sound.pauseAll();
        
        // Create semi-transparent overlay
        this.pauseOverlay = this.add.rectangle(
            this.cameras.main.scrollX + this.cameras.main.width / 2,
            this.cameras.main.scrollY + this.cameras.main.height / 2,
            this.cameras.main.width / this.SCALE,
            this.cameras.main.height / this.SCALE,
            0x000000,
            0.5
        ).setScale(this.SCALE).setDepth(1000);

        // Create pause menu container
        this.pauseMenu = this.add.container(
            this.cameras.main.scrollX + this.cameras.main.width / 2,
            this.cameras.main.scrollY + this.cameras.main.height / 2
        ).setDepth(1001);

        // Create graphics object for rounded rectangles
        const graphics = this.add.graphics().setDepth(1001);

        // Back button (top left of menu) - rounded rectangle
        const backButtonGraphics = this.add.graphics().setDepth(1002);
        backButtonGraphics.fillStyle(0xcccccc, 0.9);
        backButtonGraphics.lineStyle(2, 0x666666, 1);
        backButtonGraphics.fillRoundedRect(-62.5, -140, 120, 40, 10);
        backButtonGraphics.strokeRoundedRect(-62.5, -140, 120, 40, 10);

        // Create invisible interactive area for back button
        const backButton = this.add.rectangle(0, -120, 120, 40, 0x000000, 0);
        const backText = this.add.text(0, -120, 'Back (ESC)', {
            fontSize: `${16 * this.SCALE}px`,
            fill: '#000000',
            fontFamily: 'Arial',
            resolution: 2
        }).setOrigin(0.5).setScale(1 / this.SCALE);

        // Back to Title button - rounded rectangle
        const titleButtonGraphics = this.add.graphics().setDepth(1002);
        titleButtonGraphics.fillStyle(0xFF7074, 0.9);
        titleButtonGraphics.lineStyle(2, 0x666666, 1);
        titleButtonGraphics.fillRoundedRect(-100, -5, 200, 50, 10);
        titleButtonGraphics.strokeRoundedRect(-100, -5, 200, 50, 10);

        // Create invisible interactive area for title button
        const titleButton = this.add.rectangle(0, 20, 200, 50, 0x000000, 0);
        const titleText = this.add.text(0, 20, 'Back to Title', {
            fontSize: `${18 * this.SCALE}px`,
            fill: '#000000',
            fontFamily: 'Arial',
            resolution: 2
        }).setOrigin(0.5).setScale(1 / this.SCALE);

        // Add interactive functionality
        backButton.setInteractive({ cursor: 'pointer' });
        titleButton.setInteractive({ cursor: 'pointer' });

        // Hover effects
        backButton.on('pointerover', () => {
            backButtonGraphics.clear();
            backButtonGraphics.fillStyle(0xe0e0e0, 0.9);
            backButtonGraphics.lineStyle(2, 0x666666, 1);
            backButtonGraphics.fillRoundedRect(-62.5, -140, 120, 40, 10);
            backButtonGraphics.strokeRoundedRect(-62.5, -140, 120, 40, 10);
        });
        backButton.on('pointerout', () => {
            backButtonGraphics.clear();
            backButtonGraphics.fillStyle(0xcccccc, 0.9);
            backButtonGraphics.lineStyle(2, 0x666666, 1);
            backButtonGraphics.fillRoundedRect(-62.5, -140, 120, 40, 10);
            backButtonGraphics.strokeRoundedRect(-62.5, -140, 120, 40, 10);
        });

        titleButton.on('pointerover', () => {
            titleButtonGraphics.clear();
            titleButtonGraphics.fillStyle(0xFF8488, 0.9);
            titleButtonGraphics.lineStyle(2, 0x666666, 1);
            titleButtonGraphics.fillRoundedRect(-100, -5, 200, 50, 10);
            titleButtonGraphics.strokeRoundedRect(-100, -5, 200, 50, 10);
        });
        titleButton.on('pointerout', () => {
            titleButtonGraphics.clear();
            titleButtonGraphics.fillStyle(0xFF7074, 0.9);
            titleButtonGraphics.lineStyle(2, 0x666666, 1);
            titleButtonGraphics.fillRoundedRect(-100, -5, 200, 50, 10);
            titleButtonGraphics.strokeRoundedRect(-100, -5, 200, 50, 10);
        });

        // Click handlers
        backButton.on('pointerdown', () => {
            this.closePauseMenu();
        });

        titleButton.on('pointerdown', () => {
            this.sound.stopAll();
            // Change this to your actual title scene name
            this.scene.start('titleScene'); // or whatever your title scene is called
        });

        // Add all elements to container
        this.pauseMenu.add([graphics, backButtonGraphics, backButton, backText, titleButtonGraphics, titleButton, titleText]);

        this.isPaused = true;
    }

    closePauseMenu() {
        if (this.pauseMenu) {
            // Resume physics and sounds
            this.physics.resume();
            this.sound.resumeAll();
            
            // Destroy menu elements
            this.pauseOverlay.destroy();
            this.pauseMenu.destroy();
            this.pauseMenu = null;
            
            this.isPaused = false;
        }
    }
}