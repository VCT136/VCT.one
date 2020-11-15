//Stellar Transporter
//developed by VCT
//Groningen, 2020
//special thanks to photonstorm, WenTeS-Asım, KingCosmic and samme for helping to resolve, or inspring solutions for a few code issues and for creating the "Phaser" JavaScript framework.
//VCT.one

var volume = 1;

var ui = {
    key: "ui",
    create: function () {
        
        gameLogo = this.add.image(10, 10, "logo").setOrigin(0).setScale(0.4);

        infoText = this.add.text(10, 55, "Stellar Transporter");

        //net worth
        net_worth = 0;

        settings_text = this.add.text(10, 930, "Settings:");

        //volume control
        volume = 1;
        volume_speaker = this.add.sprite(28, 971, "speaker3");
        volume_speaker.setInteractive();
        volume_speaker.on("pointerdown", () => {
            if (volume == 1) {
                volume = 0.67;
                volume_speaker.setTexture("speaker2");
            }
            else if (volume == 0.67) {
                volume = 0.33;
                volume_speaker.setTexture("speaker1");
            }
            else if (volume == 0.33) {
                volume = 0;
                volume_speaker.setTexture("speaker0");
            }
            else if (volume == 0) {
                volume = 1;
                volume_speaker.setTexture("speaker3");
            }
            ship_ambience.setVolume(volume * 0.1);
            jazz_loop.setVolume(volume * music_volume);
        });

        //music
        music_volume = 0;
        music_button = this.add.sprite(75, 971, "music_off");
        music_button.setInteractive();
        music_button.on("pointerdown", () => {
            if (music_button.texture.key == "music_off") {
                music_button.setTexture("music");
            }
            else {
                music_button.setTexture("music_off");
            }
        })
        jazz_loop = this.sound.add("jazz_loop");
        jazz_loop.play({volume: music_volume, loop: true});

        //camera mode
        camera_mode = "mouse";
        camera_mode_button = this.add.sprite(122, 971, "mouse_mode");
        camera_mode_button.setInteractive();
        camera_mode_button.on("pointerdown", () => {
            if (camera_mode == "touch") {
                camera_mode = "mouse";
                camera_mode_button.setTexture("mouse_mode");
            }
            else {
                camera_mode = "touch";
                camera_mode_button.setTexture("touch_mode");
            }
        });

        //manual
        help_button = this.add.sprite(975, 971, "help");
        manual = this.add.sprite(500, 500, "manual");
        manual.depth = 50;
        manual.setVisible(false);
        help_button.setInteractive();
        help_button.on("pointerdown", () => {
            if (manual.visible) {
                manual.setVisible(false);
            }
            else {
                manual.setVisible(true);
                market_background.setVisible(false);
                in_station_market = false;
                selection_button.setVisible(true);
                updateMarketInterface();
                market_button.setTexture("access_station_market");
            }
            updateMarketInterface();
        });

        //selection button
        selection_button = this.add.sprite(928, 925, "selected_engine");
        selection_button.setInteractive();
        selection_button.on("pointerdown", () => {
            if (selected_element == "engine") {
                selected_element = null;
                selection_button.setTexture("selected_engine");
            }
            else {
                selected_element = "engine";
                selection_button.setTexture("selected_cannon");
                ship_main.setFrictionAir(0);
                ship_engine_emitter_left.setLifespan(600);
                ship_engine_emitter_right.setLifespan(600);
                ship_engine_emitter_left.setQuantity(3);
                ship_engine_emitter_right.setQuantity(3);
                ship_engine_start.stop();
                ship_engine_start.play({volume: volume * 0.2});
                ship_engine_emitter_left.start();
                ship_engine_emitter_right.start();
                ship_docked = false;
                market_button.setVisible(false);
            }
        });
        selection_button.setVisible(false);

        //market
        player_money = 100;
        in_station_market = false;
        select_sound = this.sound.add("select");
        access_sound = this.sound.add("access");
        sell_sound = this.sound.add("sell");
        market_background = this.add.sprite(500, 500, "station_market");
        market_background.setVisible(false);
        market_button = this.add.sprite(500, 750, "access_station_market");
        market_button.setInteractive();
        market_button.on("pointerover", function () {
            select_sound.play({volume: 0.4 * volume});
        });
        market_button.on("pointerdown", function () {
            access_sound.play({volume: 0.1 * volume, detune: 600});
            if (in_station_market) {
                market_background.setVisible(false);
                in_station_market = false;
                selection_button.setVisible(true);
                updateMarketInterface();
                market_button.setTexture("access_station_market");
            }
            else {
                market_background.setVisible(true);
                in_station_market = true;
                selection_button.setVisible(false);
                updateMarketInterface();
                selected_element = null;
                selection_button.setTexture("selected_engine");
                market_button.setTexture("close_station_market");
            }
        });
        cargo_names = [
            this.add.text(255, 255, "c"),
            this.add.text(380, 255, "c"),
            this.add.text(505, 255, "c"),
            this.add.text(630, 255, "c"),
            this.add.text(255, 370, "c"),
            this.add.text(380, 370, "c"),
            this.add.text(505, 370, "c"),
            this.add.text(630, 370, "c"),
            this.add.text(255, 485, "c"),
            this.add.text(380, 485, "c"),
            this.add.text(505, 485, "c"),
            this.add.text(630, 485, "c")
        ];
        sell_buttons = [
            this.add.text(255, 285, "s", {color: "#00ff00"}),
            this.add.text(380, 285, "s", {color: "#00ff00"}),
            this.add.text(505, 285, "s", {color: "#00ff00"}),
            this.add.text(630, 285, "s", {color: "#00ff00"}),
            this.add.text(255, 400, "s", {color: "#00ff00"}),
            this.add.text(380, 400, "s", {color: "#00ff00"}),
            this.add.text(505, 400, "s", {color: "#00ff00"}),
            this.add.text(630, 400, "s", {color: "#00ff00"}),
            this.add.text(255, 515, "s", {color: "#00ff00"}),
            this.add.text(380, 515, "s", {color: "#00ff00"}),
            this.add.text(505, 515, "s", {color: "#00ff00"}),
            this.add.text(630, 515, "s", {color: "#00ff00"})
        ];
        sell_all_button = this.add.text(255, 600, "Sell all containers: ¤" + (net_worth - player_money));
        offer_buttons = [
            this.add.text(255, 635, "o"),
            this.add.text(505, 635, "o"),
            this.add.text(255, 670, "o"),
            this.add.text(505, 670, "o")
        ];
        tune_engine_button = this.add.text(255, 705, "Tune Engine: ¤");
        paint_cost = 1;
        paint_button = this.add.text(505, 705, "Get random paintjob: ¤" + paint_cost * 50);
        cargo_names.forEach(name => {
            name.setVisible(false);
            name.cargo_id = cargo_names.indexOf(name);
        });
        sell_buttons.forEach(name => {
            name.setInteractive();
            name.cargo_id = sell_buttons.indexOf(name);
            name.on("pointerdown", function () {
                if (containers[name.cargo_id].attached) {
                    sellContainer(name.cargo_id);
                }
            });
            name.on("pointerover", function () {
                if (containers[name.cargo_id].attached) {
                    select_sound.play({volume: 0.4 * volume});
                }
            });
        });
        sell_all_button.setInteractive();
        sell_all_button.on("pointerdown", () => {
            for (container of containers) {
                if (container.attached) {
                    sellContainer(containers.indexOf(container));
                }
            }
        });
        sell_all_button.on("pointerover", function () {
            if (net_worth - player_money > 0) {
                select_sound.play({volume: 0.4 * volume});
            }
        });
        offer_buttons.forEach(name => {
            name.setInteractive();
            name.cargo_id = Phaser.Math.Between(1, goods.length - 1);
            name.on("pointerdown", function () {
                if (attached_containers < 12 && player_money >= name.offer_price) {
                    //buy offered container
                    for (container of containers) {
                        if (!container.attached) {
                            cargo_load_sound.play({volume: 0.5 * volume});
                            container.cargo_good = name.cargo_id;
                            container.depth = 9;
                            container.sale_price = Math.round(0.9 * name.offer_price);
                            container.cargo_emitter.stop();
                            container.tint_color = Phaser.Display.Color.RandomRGB(50, 220).color;
                            container.setTint(container.tint_color);
                            container.cargo_emitter.setTint(container.tint_color);
                            container.attached = true;
                            attached_containers++;
                            container.setTexture("container");
                            container.setVisible(true);
                            container.setCollisionGroup(2);
                            container.setCollisionCategory(collides_with_containers);
                            container.setCollidesWith(collides_with_containers);
                            container.purchase_price = name.offer_price;
                            player_money -= name.offer_price;
                            updateMarketInterface();
                            break
                        }
                    }
                }
            });
            name.on("pointerover", function () {
                if (attached_containers < 12 && player_money >= name.offer_price) {
                    select_sound.play({volume: 0.4 * volume});
                }
            });
        });
        tune_engine_button.setInteractive();
        tune_engine_button.on("pointerdown", function () {
            if (player_money >= Math.round(70 * ship_high_speed)) {
                speed_bonus = 0.25 * (3 - ship_high_speed);
                ship_normal_speed += speed_bonus;
                ship_high_speed += speed_bonus;
                player_money -= Math.round(70 * ship_high_speed);
                updateMarketInterface();
            }
        });
        tune_engine_button.on("pointerover", function () {
            if (player_money >= Math.round(70 * ship_high_speed)) {
                select_sound.play({volume: 0.4 * volume});
            }
        });
        paint_button.setInteractive();
        paint_button.on("pointerdown", function () {
            if (player_money >= paint_cost * 50) {
                ship_color = Phaser.Display.Color.RandomRGB(50, 255).color;
                ship_main.setTint(ship_color);
                ship_body.setTint(ship_color);
                ship_cannon.setTint(ship_color);
                ship_engine.setTint(ship_color);
                paint_cost++;
                player_money -= paint_cost * 50;
                updateMarketInterface();
            }
        });
        paint_button.on("pointerover", function () {
            if (player_money >= paint_cost * 50) {
                select_sound.play({volume: 0.4 * volume});
            }
        });
        updateMarketPrices();
        updateMarketInterface();

    },
    update: function () {

        updateNetWorth();

        //info text
        infoText.setText(
            "You have: \n" +
            "Money: ¤" + player_money + "\n" +
            "Containers: " + attached_containers + "/12\n" +
            "Net Worth: ¤" + net_worth + "\n" +
            "Engine max speed: " + Math.round(ship_high_speed * 10) + " ly/t\n\n" +
            "Travel information: \n" +
            "Distance to Destination: " + Math.round(Math.sqrt(Math.pow(ship_main.x - destination_station.x, 2) + Math.pow(ship_main.y - destination_station.y, 2))/10) + " ly\n" +
            "Speed: " + Math.round(ship_main.body.speed * 10) + " ly/t\n\n" +
            "Enemies present: " + enemies.length
        );

        //music volume
        if (music_volume < 0.7 && music_button.texture.key == "music") {
            music_volume += 0.001;
            jazz_loop.setVolume(volume * music_volume);
        }
        else if (music_volume > 0 && music_button.texture.key == "music_off") {
            music_volume -= 0.001;
            jazz_loop.setVolume(volume * music_volume);
        }
    }
}

var game_world = {
    key: "game_world",
    preload: function() {

        this.load.image("logo", "graphics/stellar_transporter_logo.png");

        //market
        this.load.image("access_station_market", "graphics/access_station_market.png");
        this.load.image("close_station_market", "graphics/close_station_market.png");
        this.load.image("station_market", "graphics/station_market.png");
        this.load.audio("select", "sound/select.mp3");
        this.load.audio("access", "sound/access.wav");
        this.load.audio("sell", "sound/sell.ogg");

        //volume control
        this.load.image("speaker0", "graphics/speaker0.png");
        this.load.image("speaker1", "graphics/speaker1.png");
        this.load.image("speaker2", "graphics/speaker2.png");
        this.load.image("speaker3", "graphics/speaker3.png");

        //music
        this.load.image("music", "graphics/music.png");
        this.load.image("music_off", "graphics/music_off.png");
        this.load.audio("jazz_loop", "sound/jazz_loop.wav");

        //camera settings
        this.load.image("mouse_mode", "graphics/mouse_mode.png");
        this.load.image("touch_mode", "graphics/touch_mode.png");

        //manual
        this.load.image("help", "graphics/help_icon.png");
        this.load.image("manual", "graphics/manual.png");

        //selection button
        this.load.image("selected_cannon", "graphics/selected_cannon.png");
        this.load.image("selected_engine", "graphics/selected_engine.png");

        //cargo
        this.load.image("container", "graphics/container.png");
        this.load.image("container_damaged", "graphics/container_damaged.png");
        this.load.image("plate", "graphics/plate.png");
        this.load.audio("cargo_load", "sound/crane_load.ogg");

        //ship
        this.load.image("ship_body", "graphics/ship_body.png");
        this.load.image("ship_engine", "graphics/ship_engine.png");
        this.load.image("ship_engine_selected", "graphics/ship_engine_selected.png");
        this.load.spritesheet("engine_exhaust", "graphics/engine_exhaust.png", {
            "frameHeight": 16,
            "frameWidth": 18
        });
        this.load.image("ship_main", "graphics/ship_main.png");
        this.load.audio("ship_ambience", "sound/airplane_ambience.mp3");
        this.load.audio("ship_engine_start", "sound/ignition.ogg");
        this.load.image("ship_cannon", "graphics/ship_cannon.png");
        this.load.image("ship_cannon_selected", "graphics/ship_cannon_selected.png");
        this.load.audio("dock", "sound/dock.ogg");
        
        //station
        this.load.image("station", "graphics/station.png");
        this.load.image("station_red", "graphics/station_red.png");
        this.load.image("station_yellow", "graphics/station_yellow.png");
        this.load.image("station_green", "graphics/station_green.png");
        this.load.audio("market", "sound/market.ogg");

        //combat
        this.load.image("enemy", "graphics/enemy.png");
        this.load.image("enemy_exhaust", "graphics/enemy_exhaust.png");
        this.load.audio("enemy_ship", "sound/enemy_ship.ogg");
        this.load.spritesheet("ship_projectile", "graphics/projectile.png", {
            "frameHeight": 3,
            "frameWidth": 7
        });
        this.load.audio("bass", "sound/bass.wav");
        this.load.image("enemy_shot", "graphics/enemy_shot.png");
        this.load.audio("enemy_fire", "sound/gunshot.ogg");
        this.load.image("enemy_dead", "graphics/enemy_dead.png");
        this.load.image("enemy_exhaust_dead", "graphics/enemy_exhaust_dead.png");
        this.load.audio("explode", "sound/explode1.wav");
        this.load.image("explosion_particle", "graphics/explosion_particle.png");
        this.load.audio("impact", "sound/bicycle_impact.ogg");
        this.load.audio("projectile_impact", "sound/metalbang.ogg");
        this.load.image("enemy_debris", "graphics/enemy_debris.png");

        //misc
        this.load.image("pixel", "graphics/pixel.png");
        this.load.image("star", "graphics/star.png");

    },
    create: function () {

        //time
        current_time = 0;

        //create animations
        this.anims.create({
            "key": "engine_exhaust_flicker",
            "frames": this.anims.generateFrameNumbers("engine_exhaust", {start: 0, end: 3}),
            "frameRate": 10,
            "repeat": -1
        });
        this.anims.create({
            key: "projectile_rotate",
            frames: this.anims.generateFrameNumbers("ship_projectile", { start: 0, end: 2}),
            repeat: -1
        });

        //add ui scene
        this.scene.launch("ui");

        //collision categories
        collides_with_nothing = this.matter.world.nextCategory(true);
        collides_with_containers = this.matter.world.nextCategory();
        collides_with_enemies = this.matter.world.nextCategory();

        //cargo goods database
        goods = [
            //[good, sale_price_maximum, market value (calculated)] 
            //123456789012 <- max word length
            ["¤100-Box", 100, 0],
            ["Apples", 60, 0],
            ["Bicycles", 240, 0],
            ["Chocolate", 136, 0],
            ["Computers", 70, 0],
            ["Dresses", 340, 0],
            ["Faucets", 45, 0],
            ["Furniture", 20, 0],
            ["Gems", 2600, 0],
            ["Grapes", 40, 0],
            ["Jam", 110, 0],
            ["Jeans", 500, 0],
            ["Paper", 30, 0],
            ["Radar Tech", 1100],
            ["Rover Parts", 50, 0],
            ["Sattelites", 3000, 0],
            ["Sneakers", 460, 0],
            ["Sports Shoes", 350, 0],
            ["Space Suits", 715, 0],
            ["Suits", 540, 0],
            ["Tablets", 170, 0],
            ["Toys", 60, 0],
            ["T-shirts", 225, 0]
        ];

        //create ship
        
        ship_body = this.matter.add.sprite(3, 0, "ship_body");

        //engine
        ship_normal_speed = 1;
        ship_high_speed = 1.5;
        ship_engine = this.matter.add.sprite(-50, 0, "ship_engine");
        ship_engine.setInteractive();
        ship_engine.on("pointerdown", function (pointer) {
            if (pointer.leftButtonDown() && !in_station_market && ship_facing_destination) {
                selected_element = "engine";
                selection_button.setTexture("selected_cannon");
                ship_main.setFrictionAir(0);
                ship_engine_emitter_left.setLifespan(600);
                ship_engine_emitter_right.setLifespan(600);
                ship_engine_emitter_left.setQuantity(3);
                ship_engine_emitter_right.setQuantity(3);
                ship_engine_start.stop();
                ship_engine_start.play({volume: volume * 0.2});
                ship_engine_emitter_left.start();
                ship_engine_emitter_right.start();
                ship_docked = false;
                market_button.setVisible(false);
            }
        });
        ship_engine.on("pointerover", function () {
            if (selected_element != "engine" && !in_station_market && ship_facing_destination) {
                ship_engine.setTexture("ship_engine_selected");
                select_sound.play({volume: 0.4 * volume});
            }
        });
        ship_engine.on("pointerout", function () {
            ship_engine.setTexture("ship_engine");
        });
        ship_engine_active = false;
        ship_engine_particles_left = this.add.particles("engine_exhaust");
        ship_engine_emitter_left = ship_engine_particles_left.createEmitter({
            x: -60,
            y: -16,
            lifespan: 100,
            speed: {min: 100, max: 400},
            radial: true,
            rotate: {min: -180, max: 180},
            angle: {min: 170, max: 190},
            blendMode: "ADD",
            quantity: 2,
            alpha: 0
        });
        ship_engine_particles_right = this.add.particles("engine_exhaust");
        ship_engine_emitter_right = ship_engine_particles_right.createEmitter({
            x: -60,
            y: 16,
            lifespan: 100,
            speed: {min: 100, max: 400},
            radial: true,
            rotate: {min: -180, max: 180},
            angle: {min: 170, max: 190},
            blendMode: "ADD",
            quantity: 2,
            alpha: 0
        });

        //cannon
        ship_cannon = this.matter.add.sprite(65, 0, "ship_cannon");
        ship_cannon.setOrigin(0.3, 0.5);
        ship_cannon.setInteractive();
        ship_cannon_ready_time = 0;
        ship_cannon.on("pointerdown", () => {
            if (!in_station_market && !manual.visible) {
                selected_element = "cannon";
                ship_cannon_ready_time = current_time + 0.3;
                select_sound.play({volume: 0.4 * volume});
            }
        });
        ship_cannon.on("pointerover", () => {
            if (selected_element != "cannon" && !in_station_market) {
                ship_cannon.setTexture("ship_cannon_selected");
                select_sound.play({volume: 0.4 * volume});
            }
        });
        ship_cannon.on("pointerout", () => {
            ship_cannon.setTexture("ship_cannon");
        });
        ship_cannon_sound = this.sound.add("bass");

        ship_projectiles = [];

        ship_main = this.matter.add.sprite(0, 0, "ship_main");
        
        //sound
        ship_engine_start = this.sound.add("ship_engine_start");
        ship_ambience = this.sound.add("ship_ambience");
        ship_ambience.play({
            volume: volume * 0.1,
            rate: 0.5,
            loop: true
        });
        
        ship_docked = true;
        
        //containers
        containers = [];
        for (var i = 0; i < 12; i++) {
            containers.push(this.matter.add.sprite(0, 0, "container"));
        }
        containers[0].setPosition(28, -20);
        containers[1].setPosition(28, -8);
        containers[2].setPosition(28, 8);
        containers[3].setPosition(28, 20);
        containers[4].setPosition(11, -20);
        containers[5].setPosition(11, -8);
        containers[6].setPosition(11, 8);
        containers[7].setPosition(11, 20);
        containers[8].setPosition(-6, -20);
        containers[9].setPosition(-6, -8);
        containers[10].setPosition(-6, 8);
        containers[11].setPosition(-6, 20);
        this.matter.setCollisionGroup(containers, 2);
        this.matter.setCollisionCategory(containers, collides_with_containers);
        this.matter.setCollidesWith(containers, collides_with_containers);
        containers.forEach(container => {
            container.tint_color = Phaser.Display.Color.RandomRGB(50, 220).color;
            container.setTint(container.tint_color);
            container.depth = 9;
            container.setFrictionAir(0);
            container.cargo_particles = this.add.particles("plate");
            container.cargo_emitter = container.cargo_particles.createEmitter({
                x: 0,
                y: 0,
                frequency: 150,
                lifespan: 10000,
                scale: 0.1,
                speed: {min: 0, max: 20},
                radial: true,
                rotate: {min: -180, max: 180},
                angle: {min: 0, max: 359},
                tint: container.tint_color,
                quantity: 2
            });
            container.cargo_emitter.startFollow(container);
            container.cargo_particles.depth = 14;
            container.cargo_emitter.stop();
            container.cargo_good = 0;
            container.sale_price = 100;
            container.purchase_price = 0;
            container.cargo_id = containers.indexOf(container);
            container.attached = true;
            container.setOnCollide(() => {
                container.setCollisionGroup(-1);
                container.setCollisionCategory(collides_with_nothing);
                container.setCollidesWith(collides_with_nothing);
                container.attached = false;
                attached_containers--;
                container.depth = 13;
                container.setTexture("container_damaged");
                container.cargo_emitter.start();
            });
        });
        attached_containers = 12;
        
        //assemble ship
        this.matter.setCollisionGroup([ship_body, ship_engine, ship_main, ship_cannon], -1);
        this.matter.setCollisionCategory([ship_body, ship_engine, ship_main, ship_cannon], collides_with_nothing);
        this.matter.setCollidesWith([ship_body, ship_engine, ship_main, ship_cannon], 0);
        
        //set ship components initial properties
        selected_element = null;
        ship_engine.depth = 6;
        ship_engine_particles_left.depth = 7;
        ship_engine_particles_right.depth = 7;
        ship_body.depth = 8;
        ship_main.depth = 10;
        ship_cannon.depth = 11;

        //cargo load sound effect
        cargo_load_sound = this.sound.add("cargo_load");

        //stations and docking
        docking_sound = this.sound.add("dock");
        home_station = this.matter.add.sprite(0, 0, "station_yellow");
        home_station.setOrigin(0.475, -0.08);
        home_station.depth = 11;
        home_station.setTint(
            Phaser.Display.Color.RandomRGB(30, 200).color
        );
        home_station_rotation_reverse = false;
        if (Phaser.Math.Between(0, 1) == 1) {
            home_station_rotation_reverse = true;
        }
        home_station_market_noise = this.sound.add("market");
        home_station_market_noise.play({
            loop: true
        });
        destination_direction = Phaser.Math.Between(-180, 180);
        destination_distance = Phaser.Math.Between(1700, 2000/*, 10000*/);
        destination_station = this.matter.add.sprite(
            Math.cos(Phaser.Math.DegToRad(destination_direction)) * destination_distance,
            Math.sin(Phaser.Math.DegToRad(destination_direction)) * destination_distance,
            "station_red"
        );
        destination_station.setOrigin(0.475, -0.08);
        destination_station.depth = 11;
        next_station_color = Phaser.Display.Color.RandomRGB(30, 200).color;
        destination_station.setTint(
            next_station_color
        );
        ship_main.setAngle(Phaser.Math.Between(-180, 180));
        ship_facing_destination = false;
        this.matter.setCollisionGroup([home_station, destination_station], -1);
        this.matter.setCollisionCategory([home_station, destination_station], collides_with_nothing);
        this.matter.setCollidesWith([home_station, destination_station], 0);
        
        //stars
        stars = [];
        for (var i = 0; i < 300; i++) {
            stars.push(this.matter.add.sprite(
                Phaser.Math.Between(-1000, 1000),
                Phaser.Math.Between(-1000, 1000),
                "star"
            ))
        }
        for (star of stars) {
            star.depth = 2;
            star.setAngle(Phaser.Math.Between(-180, 180));
            star.setScale(Math.random() + 0.1);
            star.far_awayness = Phaser.Math.Between(1, 10);
        }
        this.matter.setCollisionGroup(stars, -1);
        this.matter.setCollisionCategory(ship_projectiles[ship_projectiles.length - 1], collides_with_nothing);
        this.matter.setCollidesWith(ship_projectiles[ship_projectiles.length - 1], 0);

        //setup camera
        camera = this.cameras.main;
        camera.baseZoom = 2;
        camera.zoomModifier = 1;

        //combat effects
        explosion_particles = this.add.particles("explosion_particle");
        explosion_emitter = explosion_particles.createEmitter({
            x: 0,
            y: 0,
            lifespan: {min: 100, max: 300},
            speed: {min: 100, max: 400},
            radial: true,
            rotate: {min: -180, max: 180},
            angle: {min: 0, max: 359},
            alpha: {start: 100, end: 0, random: true},
            blendMode: "ADD",
            quantity: 5
        });
        explosion_emitter.stop();
        debris_particles = this.add.particles("enemy_debris");
        debris_emitter = debris_particles.createEmitter({
            x: 0,
            y: 0,
            lifespan: 10000,
            speed: {min: 50, max: 200},
            scale: 0.25,
            radial: true,
            rotate: {min: -180, max: 180},
            angle: {min: 0, max: 359},
            alpha: {start: 100, end: 0, random: true},
            blendMode: "SCREEN",
            quantity: 1
        });
        debris_emitter.stop();
        explode_sound = this.sound.add("explode");
        impact_sound = this.sound.add("impact");
        projectile_impact_sound = this.sound.add("projectile_impact");
        enemy_shot_sound = this.sound.add("enemy_fire");

        //space color
        previous_space_color = new Phaser.Display.Color(Phaser.Math.Between(0, 10), Phaser.Math.Between(0, 10), Phaser.Math.Between(0, 10));
        next_space_color = new Phaser.Display.Color(Phaser.Math.Between(0, 10), Phaser.Math.Between(0, 10), Phaser.Math.Between(0, 10));

        //handle mouse buttons generally
        this.input.on("pointerdown", (pointer) => {
            //deselect with right mouse button
            if (pointer.rightButtonDown()) {
                if (selected_element != null) {
                    select_sound.play({volume: 0.4 * volume});
                }
                selected_element = null;
                selection_button.setTexture("selected_engine");
            }
            //shoot with left mouse button
            if (
                pointer.leftButtonDown() &&
                selected_element == "cannon" &&
                current_time > ship_cannon_ready_time
            ) {
                ship_projectiles.push(this.matter.add.sprite(
                    ship_cannon.x, ship_cannon.y,
                    "ship_projectile"
                ));
                ship_projectiles[ship_projectiles.length - 1].anims.play("projectile_rotate");
                ship_projectiles[ship_projectiles.length - 1].setMass(1.5);
                ship_projectiles[ship_projectiles.length - 1].setAngle(Phaser.Math.RadToDeg(ship_cannon.rotation));
                ship_projectiles[ship_projectiles.length - 1].depth = 13;
                this.matter.setCollisionGroup(ship_projectiles[ship_projectiles.length - 1], 1);
                this.matter.setCollisionCategory(ship_projectiles[ship_projectiles.length - 1], collides_with_enemies);
                this.matter.setCollidesWith(ship_projectiles[ship_projectiles.length - 1], collides_with_enemies);
                ship_projectiles[ship_projectiles.length - 1].setFrictionAir(0);
                ship_projectiles[ship_projectiles.length - 1].thrust(0.06);
                ship_projectiles.forEach(projectile => {
                    projectile.setOnCollide(() => {
                        explosion_emitter.emitParticle(50, projectile.x, projectile.y);
                        projectile_impact_sound.play({volume: 0.4 * volume, rate: 2});
                        projectile.destroy();
                        ship_projectiles = ship_projectiles.filter(entry => entry.body != undefined);
                    });
                });
                ship_cannon_ready_time = current_time + 200;
                ship_cannon_sound.play({
                    volume: volume * 0.3,
                    rate: 0.5 + 0.25 * Math.random()
                });
            }
        })
        
        //enemies
        enemies = [];
        last_time_enemies_were_spawned = 0;
        enemy_shots = [];

        //save pointer world coordinates
        old_pointer_worldXY = {x: this.input.activePointer.worldX, y: this.input.activePointer.worldY};
    },
    update: function (time) {
        //time
        current_time = time;

        //camera controls
        updateGameCamera(camera, this);
        
        //keep ship together
        keepShipTogether();

        //default selection to cannon
        if (selected_element == null && !in_station_market && selected_element != "engine") {
            selected_element = "cannon";
            ship_cannon_ready_time = current_time + 0.3;
        }
        
        //rotate ship and stations
        rotateShipAndStations();
        
        //spawn enemies
        if (current_time > last_time_enemies_were_spawned + 30000 && !ship_docked && Phaser.Math.Between(0,300) == 0 && enemies.length == 0) {
            spawnEnemies(Phaser.Math.Between(1, 10), this);
            last_time_enemies_were_spawned = current_time;
        }

        //move enemies and let them do stuff
        makeEnemiesAct(this);
        
        //reposition stars
        repositionStars();
        
        //reposition and adjust engine particles
        repositionShipEngineParticles();

        //ship engine
        if (selected_element == "engine") {
            if (ship_main.body.speed < ship_high_speed) {
                ship_main.setVelocity(
                    ship_main.body.velocity.x + 0.002 * Math.cos(ship_main.rotation),
                    ship_main.body.velocity.y + 0.002 * Math.sin(ship_main.rotation)
                );
            }
            else {
                ship_main.setVelocity(
                    ship_main.body.velocity.x + -0.002 * Math.cos(ship_main.rotation),
                    ship_main.body.velocity.y + -0.002 * Math.sin(ship_main.rotation)
                );
            }
            if (camera.zoomModifier > 0.5) {
                camera.zoomModifier -= 0.01;
            }
            else {
                camera.zoomModifier = 0.5;
            }
            if (ship_ambience.rate < 1.5) {
                ship_ambience.setRate(ship_ambience.rate + 0.001);
            }
            else {
                ship_ambience.rate < 1.5;
            }
        }
        else {
            //stop engine / throttle down
            if (ship_docked) {
                ship_main.setVelocity(0);
                if (ship_ambience.rate > 0.5) {
                    ship_ambience.setRate(ship_ambience.rate - 0.001);
                }
                else {
                    ship_ambience.rate = 0.5;
                }
            }
            //engine moderately
            else {
                if (ship_main.body.speed < ship_normal_speed) {
                    ship_main.setVelocity(
                        ship_main.body.velocity.x + 0.002 * Math.cos(ship_main.rotation),
                        ship_main.body.velocity.y + 0.002 * Math.sin(ship_main.rotation)
                    );
                }
                else {
                    ship_main.setVelocity(
                        ship_main.body.velocity.x + -0.002 * Math.cos(ship_main.rotation),
                        ship_main.body.velocity.y + -0.002 * Math.sin(ship_main.rotation)
                    );
                }
                if (ship_ambience.rate > 1) {
                    ship_ambience.setRate(ship_ambience.rate - 0.001);
                }
                else {
                    if (ship_ambience.rate < 1) {
                        ship_ambience.setRate(ship_ambience.rate + 0.001);
                    }
                    ship_ambience.rate = 1;
                }
            }

            if (camera.zoomModifier > 1.025) {
                camera.zoomModifier -= 0.01;
            }
            else if (camera.zoomModifier < 0.975) {
                camera.zoomModifier += 0.01;
            }
            else {
                camera.zoomModifier = 1;
            }
        }

        //ship cannon
        if (selected_element == "cannon" && !(this.input.activePointer.worldX == old_pointer_worldXY.x && this.input.activePointer.worldY == old_pointer_worldXY.y)) {
            ship_cannon.setAngle(Phaser.Math.RadToDeg(Phaser.Math.Angle.Between(ship_cannon.x, ship_cannon.y, this.input.activePointer.worldX, this.input.activePointer.worldY)));
            old_pointer_worldXY = {x: this.input.activePointer.worldX, y: this.input.activePointer.worldY};
        }

        //projectile cleanup
        for (projectile of ship_projectiles) {
            if (Math.sqrt(Math.pow(ship_cannon.x - projectile.x, 2) + Math.pow(ship_cannon.y - projectile.y, 2)) > 1500) {
                projectile.destroy();
                ship_projectiles = ship_projectiles.filter(entry => entry.body != undefined);
            }
        }
        for (shot of enemy_shots) {
            if (Math.sqrt(Math.pow(ship_cannon.x - shot.x, 2) + Math.pow(ship_cannon.y - shot.y, 2)) > 1500) {
                shot.destroy();
                enemy_shots = enemy_shots.filter(entry => entry.body != undefined);
            }
        }

        //docking at target station
        if (Math.sqrt(Math.pow(ship_main.x - destination_station.x, 2) + Math.pow(ship_main.y - destination_station.y, 2)) < 50 && !ship_docked) {
            //stop and dock ship
            ship_main.setPosition(
                destination_station.x,
                destination_station.y
            );
            ship_main.setVelocity(0);
            if (selected_element == "engine") {
                selected_element = null;
                selection_button.setTexture("selected_engine");
            }
            ship_docked = true;
            docking_sound.play({volume: 0.5 * volume});
            selection_button.setVisible(false);
            //exchange stations
            home_station.setTexture("station_yellow");
            home_station.setTint(next_station_color);
            home_station.setPosition(destination_station.x, destination_station.y);
            if (Phaser.Math.Between(0, 1) == 1) {
                home_station_rotation_reverse = true;
            }
            destination_direction = Phaser.Math.Between(-180, 180);
            destination_distance = Phaser.Math.Between(1700, 10000);
            destination_station.setPosition(
                home_station.x + Math.cos(Phaser.Math.DegToRad(destination_direction)) * destination_distance,
                home_station.y + Math.sin(Phaser.Math.DegToRad(destination_direction)) * destination_distance
            );
            next_station_color = Phaser.Display.Color.RandomRGB(30, 200).color;
            destination_station.setTint(
                next_station_color
            );
            ship_facing_destination = false;
            //update space color stuff
            previous_space_color = next_space_color;
            next_space_color = new Phaser.Display.Color(Phaser.Math.Between(0, 10), Phaser.Math.Between(0, 10), Phaser.Math.Between(0, 10));
        }

        //station market audio
        updateStationMarketAudio();

        //set space color
        space_color = Phaser.Display.Color.Interpolate.ColorWithColor(
            previous_space_color,
            next_space_color,
            100 * Math.abs(home_station.x - destination_station.x),
            100 * Math.abs(home_station.x - ship_main.x));
        camera.setBackgroundColor(space_color);
    }
}

var game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: "main",
    width: 1000,
    height: 1000,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'matter',
        matter: {
            debug: false,
            gravity: false
        },
    },
    render: {
        pixelArt: true
    },
    disableContextMenu: true,
    scene: [game_world, ui]
});

function countCargo() {
    attached_containers = 0;
    containers.forEach(container => {
        if (container.attached) {
            attached_containers++;
        }
    });
}

function keepShipTogether() {
    ship_body.setPosition(
        ship_main.x + 3 * Math.cos(ship_main.rotation),
        ship_main.y + 3 * Math.sin(ship_main.rotation)
    );
    ship_body.setAngle(Phaser.Math.RadToDeg(ship_main.rotation));

    ship_engine.setPosition(
        ship_main.x + -50 * Math.cos(ship_main.rotation),
        ship_main.y + -50 * Math.sin(ship_main.rotation)
    );
    ship_engine.setAngle(Phaser.Math.RadToDeg(ship_main.rotation));

    ship_cannon.setPosition(
        ship_main.x + 65 * Math.cos(ship_main.rotation),
        ship_main.y + 65 * Math.sin(ship_main.rotation)
    );
    if (selected_element != "cannon") {
        ship_cannon.setAngle(Phaser.Math.RadToDeg(ship_main.rotation));
    }

    if (containers[0].attached) {
        containers[0].setPosition(
            ship_main.x + 35 * Math.cos(ship_main.rotation + Phaser.Math.DegToRad(-36)),
            ship_main.y + 35 * Math.sin(ship_main.rotation + Phaser.Math.DegToRad(-36))
        );
    }
    if (containers[1].attached) {
        containers[1].setPosition(
            ship_main.x + 29 * Math.cos(ship_main.rotation + Phaser.Math.DegToRad(-16)),
            ship_main.y + 29 * Math.sin(ship_main.rotation + Phaser.Math.DegToRad(-16))
        );
    }
    if (containers[2].attached) {
        containers[2].setPosition(
            ship_main.x + 29 * Math.cos(ship_main.rotation + Phaser.Math.DegToRad(16)),
            ship_main.y + 29 * Math.sin(ship_main.rotation + Phaser.Math.DegToRad(16))
        );
    }
    if (containers[3].attached) {
        containers[3].setPosition(
            ship_main.x + 35 * Math.cos(ship_main.rotation + Phaser.Math.DegToRad(36)),
            ship_main.y + 35 * Math.sin(ship_main.rotation + Phaser.Math.DegToRad(36))
        );
    }
    if (containers[4].attached) {
        containers[4].setPosition(
            ship_main.x + 23 * Math.cos(ship_main.rotation + Phaser.Math.DegToRad(-60)),
            ship_main.y + 23 * Math.sin(ship_main.rotation + Phaser.Math.DegToRad(-60))
        );
    }
    if (containers[5].attached) {
        containers[5].setPosition(
            ship_main.x + 14 * Math.cos(ship_main.rotation + Phaser.Math.DegToRad(-35)),
            ship_main.y + 14 * Math.sin(ship_main.rotation + Phaser.Math.DegToRad(-35))
        );
    }
    if (containers[6].attached) {
        containers[6].setPosition(
            ship_main.x + 14 * Math.cos(ship_main.rotation + Phaser.Math.DegToRad(35)),
            ship_main.y + 14 * Math.sin(ship_main.rotation + Phaser.Math.DegToRad(35))
        );
    }
    if (containers[7].attached) {
        containers[7].setPosition(
            ship_main.x + 23 * Math.cos(ship_main.rotation + Phaser.Math.DegToRad(60)),
            ship_main.y + 23 * Math.sin(ship_main.rotation + Phaser.Math.DegToRad(60))
        );
    }
    if (containers[8].attached) {
        containers[8].setPosition(
            ship_main.x + 21 * Math.cos(ship_main.rotation + Phaser.Math.DegToRad(-106)),
            ship_main.y + 21 * Math.sin(ship_main.rotation + Phaser.Math.DegToRad(-106))
        );
    }
    if (containers[9].attached) {
        containers[9].setPosition(
            ship_main.x + 11 * Math.cos(ship_main.rotation + Phaser.Math.DegToRad(-128)),
            ship_main.y + 11 * Math.sin(ship_main.rotation + Phaser.Math.DegToRad(-128))
        );
    }
    if (containers[10].attached) {
        containers[10].setPosition(
            ship_main.x + 11 * Math.cos(ship_main.rotation + Phaser.Math.DegToRad(128)),
            ship_main.y + 11 * Math.sin(ship_main.rotation + Phaser.Math.DegToRad(128))
        );
    }
    if (containers[11].attached) {
        containers[11].setPosition(
            ship_main.x + 21 * Math.cos(ship_main.rotation + Phaser.Math.DegToRad(106)),
            ship_main.y + 21 * Math.sin(ship_main.rotation + Phaser.Math.DegToRad(106))
        );
    }

    for (container of containers) {
        if(container.attached) {
            container.setAngle(Phaser.Math.RadToDeg(ship_main.rotation));
        }
    }
}

function makeEnemiesAct(context) {
    for (enemy of enemies) {
        //fly ahead
        if (enemy.alive) {
            enemy.setVelocity(
                Math.cos(enemy.rotation) * 1.25 + ship_main.body.velocity.x,
                Math.sin(enemy.rotation) * 1.25 + ship_main.body.velocity.y
            );
        }
        else {
            enemy.setVelocity(
                Math.cos(enemy.rotation) * 1.25,
                Math.sin(enemy.rotation) * 1.25
            );
        }
        //lose control if dead
        if (!enemy.alive) {
            enemy.approaching = false;
            enemy.setAngle(Phaser.Math.RadToDeg(enemy.rotation) + Phaser.Math.Between(-3, 3));
        }
        //adjust exhaust particles
        enemy.exhaust_emitter.setAngle(Phaser.Math.Between(-180, 180));
        if (enemy.exhaust_particle_angle > 20) {
            enemy.exhaust_particle_angle_increasing = false;
        }
        else if (enemy.exhaust_particle_angle < -20) {
            enemy.exhaust_particle_angle_increasing = true;
        }
        if (enemy.exhaust_particle_angle_increasing) {
            enemy.exhaust_particle_angle += 2;
        }
        else {
            enemy.exhaust_particle_angle += -1;
        }
        enemy.exhaust_emitter.setAngle({
            min: 170 + enemy.exhaust_particle_angle + Phaser.Math.RadToDeg(enemy.rotation),
            max: 190 + enemy.exhaust_particle_angle + Phaser.Math.RadToDeg(enemy.rotation)
        });
        //adjust sound
        if (Math.sqrt(Math.pow(ship_main.x - enemy.x, 2) + Math.pow(ship_main.y - enemy.y, 2)) < 1000) {
            enemy.sound.setVolume(volume * (-0.3 + 0.0003 * Math.sqrt(Math.pow(ship_main.x - enemy.x, 2) + Math.pow(ship_main.y - enemy.y, 2))));
        }
        else {
            enemy.sound.setVolume(0);
        }
        if (enemy.approaching && enemy.sound.rate < 1.5) {
            enemy.sound.setRate(enemy.sound.rate + 0.001);
        }
        else if (!enemy.approaching && enemy.sound.rate > 0.75) {
            enemy.sound.setRate(enemy.sound.rate - 0.001);
        }
        //approach ship
        if (enemy.approaching) {
            enemy.setAngle(180 + Math.atan2(enemy.y - ship_main.y, enemy.x - ship_main.x) * 180 / Math.PI);
            if (enemy.approaching && Math.sqrt(Math.pow(ship_main.x - enemy.x, 2) + Math.pow(ship_main.y - enemy.y, 2)) < 50) {
                enemy.approaching = false;
                enemy.taking_distance = Phaser.Math.Between(300, 1000);
            }
        }
        //flip if alive and far away and not bored
        if (enemy.alive && !enemy.approaching && Math.sqrt(Math.pow(ship_main.x - enemy.x, 2) + Math.pow(ship_main.y - enemy.y, 2)) > enemy.taking_distance && attached_containers > 0) {
            enemy.approaching = true;
        }
        //shoot
        if (enemy.alive && Math.sqrt(Math.pow(ship_main.x - enemy.x, 2) + Math.pow(ship_main.y - enemy.y, 2)) < 500 && current_time > enemy.last_fired_at + 500 && Phaser.Math.Between(0, 300) == 0) {
            enemy_shot_sound.play({volume: 0.3 * volume});
            enemy_shots.push(context.matter.add.sprite(enemy.x, enemy.y, "enemy_shot"));
            enemy.setAngle(180 + Math.atan2(enemy.y - ship_main.y, enemy.x - ship_main.x) * 180 / Math.PI);
            enemy_shots[enemy_shots.length - 1].setAngle(
                Phaser.Math.RadToDeg(enemy.rotation) + Phaser.Math.Between(-30, 30)
            );
            enemy_shots[enemy_shots.length - 1].setFrictionAir(0);
            enemy_shots[enemy_shots.length - 1].depth = 13;
            context.matter.setCollisionGroup(enemy_shots[enemy_shots.length - 1], 2);
            context.matter.setCollisionCategory(enemy_shots[enemy_shots.length - 1], collides_with_containers);
            context.matter.setCollidesWith(enemy_shots[enemy_shots.length - 1], collides_with_containers);
            enemy_shots.forEach(shot => {
                shot.setOnCollide(() => {
                    shot.destroy();
                    enemy_shots = enemy_shots.filter(entry => entry.body != undefined);
                });
            });
            enemy_shots[enemy_shots.length - 1].thrust(0.001);
        }
        //emit debris if dead
        if (!enemy.alive) {
            debris_emitter.setAngle({min: 180 + enemy.angle - 20, max: 180 + enemy.angle + 20});
            debris_emitter.emitParticle(1, enemy.x, enemy.y);
        }
        //disappear if bored and far away
        if (Math.sqrt(Math.pow(ship_main.x - enemy.x, 2) + Math.pow(ship_main.y - enemy.y, 2)) > 1500 && attached_containers <= 0) {
            enemy.sound.destroy();
            enemy.exhaust_emitter.stop();
            enemy.exhaust_emitter.remove();
            enemy.destroy();
            enemies = enemies.filter(entry => entry.body != undefined);
            if (enemies.length == 0 && ship_docked && ship_facing_destination && !manual.visible) {
                market_button.setVisible(true);
            }
            break
        }
        //disappear if not alive and far away
        if (Math.sqrt(Math.pow(ship_main.x - enemy.x, 2) + Math.pow(ship_main.y - enemy.y, 2)) > 1500 && !enemy.alive) {
            enemy.sound.destroy();
            enemy.exhaust_emitter.stop();
            enemy.exhaust_emitter.remove();
            enemy.destroy();
            enemies = enemies.filter(entry => entry.body != undefined);
            if (enemies.length == 0 && ship_docked && ship_facing_destination && !manual.visible) {
                market_button.setVisible(true);
            }
            break
        }
        //explode and disappear if not alive for a seconds
        if  (!enemy.alive &&  current_time > enemy.time_died + 1000) {
            explosion_emitter.emitParticle(100, enemy.x, enemy.y);
            debris_emitter.setAngle({min: enemy.angle - 20, max: enemy.angle + 20});
            debris_emitter.emitParticle(150, enemy.x, enemy.y);
            explode_sound.play({rate: 1.2, volume: volume});
            enemy.sound.destroy();
            enemy.exhaust_emitter.stop();
            enemy.exhaust_emitter.remove();
            enemy.destroy();
            enemies = enemies.filter(entry => entry.body != undefined);
            if (enemies.length == 0 && ship_docked && ship_facing_destination && !manual.visible) {
                market_button.setVisible(true);
            }
            break
        }
    }
}

function repositionShipEngineParticles() {
    ship_engine_emitter_left.setAngle({
        min: 170 + Phaser.Math.RadToDeg(ship_main.rotation),
        max: 190 + Phaser.Math.RadToDeg(ship_main.rotation)
    });
    ship_engine_emitter_right.setAngle({
        min: 170 + Phaser.Math.RadToDeg(ship_main.rotation),
        max: 190 + Phaser.Math.RadToDeg(ship_main.rotation)
    });
    ship_engine_left_coords = new Phaser.Geom.Point(ship_main.x + -60, ship_main.y + -16);
    Phaser.Math.RotateAround(
        ship_engine_left_coords,
        ship_main.x, ship_main.y,
        ship_main.rotation
    );
    ship_engine_emitter_left.setPosition(
        ship_engine_left_coords.x,
        ship_engine_left_coords.y
    );
    ship_engine_right_coords = new Phaser.Geom.Point(ship_main.x + -60, ship_main.y + 16);
    Phaser.Math.RotateAround(
        ship_engine_right_coords,
        ship_main.x, ship_main.y,
        ship_main.rotation
    );
    ship_engine_emitter_right.setPosition(
        ship_engine_right_coords.x,
        ship_engine_right_coords.y
    );
    
    if (ship_engine_emitter_left.lifespan.propertyValue < 100 + 250 * ship_main.body.speed) {
        ship_engine_emitter_left.setLifespan(ship_engine_emitter_left.lifespan.propertyValue + 1);
        ship_engine_emitter_right.setLifespan(ship_engine_emitter_left.lifespan.propertyValue);
    }
    else if(ship_engine_emitter_left.lifespan.propertyValue > 100 + 250 * ship_main.body.speed) {
        ship_engine_emitter_left.setLifespan(ship_engine_emitter_left.lifespan.propertyValue - 1);
        ship_engine_emitter_right.setLifespan(ship_engine_emitter_left.lifespan.propertyValue);
    }
    if (ship_engine_emitter_left.alpha.propertyValue < 0.5 && ship_main.body.speed > 0) {
        ship_engine_emitter_left.setAlpha(ship_engine_emitter_left.alpha.propertyValue + 0.01);
        ship_engine_emitter_right.setAlpha(ship_engine_emitter_left.alpha.propertyValue);
    }
    else if (ship_main.body.speed == 0) {
        if (ship_engine_emitter_left.alpha.propertyValue > 0.05) {
            ship_engine_emitter_left.setAlpha(ship_engine_emitter_left.alpha.propertyValue - 0.01);
        }
        else {
            ship_engine_emitter_left.setAlpha(ship_engine_emitter_left.alpha.propertyValue + 0.01);
        }
        ship_engine_emitter_right.setAlpha(ship_engine_emitter_left.alpha.propertyValue);
    }
}

function repositionStars() {
    for (star of stars) {
        if (star.x > ship_main.x + 1000) {
            star.x = ship_main.x - 1000;
            star.y = Phaser.Math.Between(ship_main.y - 1000, ship_main.y + 1000);
            star.setAngle(Phaser.Math.Between(-180, 180));
            star.setScale(Math.random() + 0.1);
            star.far_awayness = Phaser.Math.Between(1, 10);
        }
        else if (star.x < ship_main.x - 1000) {
            star.x = ship_main.x + 1000;
            star.y = Phaser.Math.Between(ship_main.y - 1000, ship_main.y + 1000);
            star.setAngle(Phaser.Math.Between(-180, 180));
            star.setScale(Math.random() + 0.1);
            star.far_awayness = Phaser.Math.Between(1, 10);
        }
        else if (star.y > ship_main.y + 1000) {
            star.x = Phaser.Math.Between(ship_main.x - 1000, ship_main.x + 1000);
            star.y = ship_main.y - 1000;
            star.setAngle(Phaser.Math.Between(-180, 180));
            star.setScale(Math.random() + 0.1);
            star.far_awayness = Phaser.Math.Between(1, 10);
        }
        else if (star.y < ship_main.y - 1000) {
            star.x = Phaser.Math.Between(ship_main.x - 1000, ship_main.x + 1000);
            star.y = ship_main.y + 1000;
            star.setAngle(Phaser.Math.Between(-180, 180));
            star.setScale(Math.random() + 0.1);
            star.far_awayness = Phaser.Math.Between(1, 10);
        }
        star.setVelocity(
            -0.05 * star.far_awayness * ship_main.body.velocity.x,
            -0.05 * star.far_awayness * ship_main.body.velocity.y
        );
    }
}

function rotateShipAndStations() {
    if (ship_docked && !ship_facing_destination) {
        if (home_station_rotation_reverse) {
            ship_main.setAngularVelocity(0.01);
        }
        else {
            ship_main.setAngularVelocity(-0.01);
        }
        if (ship_main.angle < destination_direction + 3 && ship_main.angle > destination_direction - 3) {
            ship_facing_destination = true;
            selection_button.setVisible(true);
            ship_main.setAngle(destination_direction);
            ship_main.setAngularVelocity(0);
            home_station.setTexture("station_green");
            //update market
            updateMarketPrices();
            if (enemies.length == 0 && !manual.visible) {
                market_button.setVisible(true);
            }
        }
    }
    else {
        ship_main.setAngularVelocity(0);
    }
    home_station.setAngle(ship_main.angle);
    destination_station.setAngle(ship_main.angle);
}

function sellContainer(container_id) {
    if (containers[container_id].attached) {
        container.setCollisionGroup(-1);
        container.setCollisionCategory(collides_with_nothing);
        container.setCollidesWith(collides_with_nothing);
        containers[container_id].attached = false;
        attached_containers--;
        containers[container_id].setVisible(false);
        containers[container_id].cargo_emitter.stop();
        player_money += containers[container_id].sale_price;
        sell_sound.play({volume: volume});
        updateMarketInterface();
    }
    countCargo();
}

function spawnEnemies(amount, context) {
    for (var i = 0; i < amount; i++) {
        enemy_location = new Phaser.Math.Vector2(1, 0);
        enemy_angle = Phaser.Math.Between(-180, 180);
        enemy_location.setAngle(Phaser.Math.DegToRad(enemy_angle));
        enemy_location.setLength(Phaser.Math.Between(1300, 3000));
        enemies[enemies.length] = context.matter.add.sprite(ship_main.x + enemy_location.x, ship_main.y + enemy_location.y, "enemy");
        enemies[enemies.length - 1].setAngle(180 + enemy_angle);
    }
    enemies.forEach(enemy => {
        enemy.depth = 13;
        enemy.time_died = 0;
        enemy.alive = true;
        enemy.approaching = true;
        enemy.last_fired_at = current_time;
        enemy.exhaust_particles = context.add.particles("enemy_exhaust");
        enemy.exhaust_emitter = enemy.exhaust_particles.createEmitter({
            x: 0,
            y: 0,
            lifespan: 400,
            speed: {min: 150, max: 300},
            radial: true,
            rotate: {min: -180, max: 180},
            angle: {min: 170, max: 190},
            blendMode: "ADD",
            quantity: 1
        });
        enemy.exhaust_particles.depth = 12;
        enemy.exhaust_emitter.startFollow(enemy);
        enemy.exhaust_particle_angle = Phaser.Math.Between(-20, 20);
        if (Phaser.Math.Between(0, 1) == 0) {
            enemy.exhaust_particle_angle_increasing = false;
        }
        else {
            enemy.exhaust_particle_angle_increasing = true;
        }
        enemy.sound = context.sound.add("enemy_ship");
        enemy.sound.play({volume: 0.3 * volume, loop: true});
        enemy.setInteractive();
        enemy.setOnCollide(() => {
            explosion_emitter.emitParticle(50, enemy.x, enemy.y);
            impact_sound.play({volume: 0.5 * volume, detune: -100});
            enemy.setTexture("enemy_dead");
            enemy.setCollisionGroup(-1);
            enemy.setCollisionCategory(collides_with_nothing);
            enemy.setCollidesWith(0);
            enemy.exhaust_particles.setTexture("enemy_exhaust_dead");
            enemy.exhaust_particles.depth = 5;
            enemy.depth = 6;
            enemy.exhaust_emitter.setBlendMode("SCREEN");
            enemy.exhaust_emitter.setFrequency(10);
            enemy.alive = false;
            enemy.time_died = current_time;
        });
    });
    context.matter.setCollisionGroup(enemies, 1);
    context.matter.setCollisionCategory(enemies, collides_with_enemies);
    context.matter.setCollidesWith(enemies, collides_with_enemies);
}

function updateGameCamera(camera, context) {
    if (camera_mode == "touch") {
        camera.setZoom(camera.zoomModifier * (camera.baseZoom - 0.001 * 150));

        camera.setScroll(
            ship_main.x - 500,
            ship_main.y - 500
        );
    }
    else {
        camera.setZoom(camera.zoomModifier * (camera.baseZoom - 0.001 * Math.sqrt(Math.pow((camera.width / 2 - context.input.activePointer.x), 2) + Math.pow((camera.height / 2 - context.input.mousePointer.y), 2))));

        camera.setScroll(
            ship_main.x - 500 + 0.5 * (-500 + context.input.activePointer.x),
            ship_main.y - 500 + 0.5 * (-500 + context.input.activePointer.y)
        );
    }
}

function updateMarketInterface() {
    countCargo();
    if (ship_docked && ship_facing_destination && !manual.visible && enemies.length == 0) {
        market_button.setVisible(true);
    }
    else {
        market_button.setVisible(false);
        in_station_market = false;
    }
    cargo_names.forEach(name => {
        if (in_station_market && containers[name.cargo_id].attached) {
            name.setText(
                goods[containers[name.cargo_id].cargo_good][0] + "\n\n\n\n" +
                "Bought for: \n¤" + containers[name.cargo_id].purchase_price
            );
        }
        else {
            name.setText("Empty Slot");
        }
        name.setVisible(in_station_market);
    });
    sell_buttons.forEach(name => {
        name.setVisible(in_station_market);
        if (in_station_market && containers[name.cargo_id].attached) {
            if (containers[name.cargo_id].sale_price >= containers[name.cargo_id].purchase_price) {
                name.setColor("#00ff00");
            }
            else {
                name.setColor("#ff7f00");
            }
            name.setText("Sell: ¤" + containers[name.cargo_id].sale_price);
        }
        else {
            name.setVisible(false);
        }
    });
    sell_all_button.setText("Sell all containers: ¤" + (net_worth - player_money));
    sell_all_button.setVisible(in_station_market);
    offer_buttons.forEach(name => {
        if (attached_containers < 12) {
            name.setText("Buy " + goods[name.cargo_id][0] + " for ¤" + name.offer_price);
            if (name.offer_price < 0.67 * goods[name.cargo_id][1]) {
                name.setColor("#00ff00");
            }
            else {
                name.setColor("#ffff00");
            }
        }
        else {
            name.setText("Cargo capacity reached.");
            name.setColor("#ffffff");
        }
        name.setVisible(in_station_market);
    });
    tune_engine_button.setText(
        "Tune Engine: ¤" + Math.round(70 * ship_high_speed) + "\n" +
        "(to " + Math.round(10 * (ship_high_speed + 0.25 * (3 - ship_high_speed))) + " ly/t max)"
    );
    tune_engine_button.setVisible(in_station_market);
    paint_button.setText("Get random paintjob: ¤" + paint_cost * 50);
    paint_button.setVisible(in_station_market);
}

function updateMarketPrices() {
    countCargo();
    //the station has 4 goods it produces, which are cheap there
    station_goods = [Phaser.Math.Between(1, goods.length - 1), Phaser.Math.Between(1, goods.length - 1), Phaser.Math.Between(1, goods.length - 1), Phaser.Math.Between(1, goods.length - 1)];
    //calculate market values
    for (good of goods) {
        if (station_goods.includes(goods.indexOf(good))) {
            good[2] = Math.round(good[1] * (0.25 + Math.random() / 2));
        }
        else {
            good[2] = Math.round(good[1] * (0.5 + Math.random() / 2));
        }
        if (goods.indexOf(good) == 0) {
            good[2] = 100;
        }
    }
    //set prices to market values
    containers.forEach(container => {
        container.sale_price = goods[container.cargo_good][2];
    });
    offer_buttons.forEach(name => {
        name.cargo_id = station_goods[offer_buttons.indexOf(name)];
        name.offer_price = goods[name.cargo_id][2];
    });
    paint_cost = 1;
    updateMarketInterface();
}

function updateNetWorth() {
    net_worth = player_money;
    for (container of containers) {
        if (container.attached) {
            net_worth += container.sale_price;
        }
    }
}

function updateStationMarketAudio() {
    if (ship_docked) {
        if (home_station_market_noise.volume < volume * 0.3) {
            home_station_market_noise.setVolume(home_station_market_noise.volume + 0.002);
        }
        else {
            home_station_market_noise.setVolume(volume * 0.3);
        }
    }
    else {
        if (home_station_market_noise.volume > 0.01) {
            home_station_market_noise.setVolume(home_station_market_noise.volume - 0.003);
        }
        else {
            home_station_market_noise.setVolume(0.01);
        }
    }
}