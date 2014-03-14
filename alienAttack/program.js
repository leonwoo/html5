(function () {
    var stage = document.querySelector("#stage"),
        surface = stage.getContext("2d"),
        tile = new Image(),
        sprite = {
            srcX: 0,
            srcY: 0,
            dstX: 0,
            dstY: 0,
            width: 0,
            height: 0,
        },
        background = Object.create(sprite),
        cannon = Object.create(sprite),
        sprites = [],
        missles = [],
        aliens = [],
        KEY_SPACE = 32,
        KEY_LEFT = 37,
        KEY_RIGHT = 39,
        cannon_step = 4,
        refresh_interval = 120,
        refresh_timer,
        missile_timer,
        missile_v_ticks = 2,
        missle_step = 16,
        refresh_tick_count = 0,
        alien_enter_ticks = 20,

        generateAlien = function () {
            var alien = Object.create(sprite);
            alien.srcX = 32;
            alien.srcY = 0;
            alien.width = 32;
            alien.height = 32;
            alien.dstX = Math.floor(Math.floor(stage.width / cannon_step) * Math.random());
            alien.dstY = 0;

            aliens.push(alien);
            sprites.push(alien);
        },

        remove = function (arr, item) {
            var i;
            for (i = arr.length - 1; i >= 0; i--) {
                if (arr[i] === item) {
                    arr.splice(i, 1);
                }
            }
        },

        drawSprite = function (s) {
            surface.drawImage(tile, s.srcX, s.srcY, s.width, s.height, s.dstX, s.dstY, s.width, s.height);
        },
        render = function () {
            surface.clearRect(0, 0, stage.width, stage.height);
            var i;
            for (i = 0; i < sprites.length; i++) {
                drawSprite(sprites[i]);
            }
        },

        fire = function () {
            var missle = Object.create(sprite);
            missle.srcX = 3 * 32;
            missle.srcY = 0;
            missle.dstX = cannon.dstX;
            missle.dstY = cannon.dstY;
            missle.width = 16;
            missle.height = 16;

            sprites.push(missle);
            missles.push(missle);
        },

        onKeyDown = function (event) {
            var x;
            switch (event.keyCode) {
            case KEY_LEFT:
                x = cannon.dstX - cannon_step;
                break;
            case KEY_RIGHT:
                x = cannon.dstX + cannon_step;
                break;
            case KEY_SPACE:
                fire();
                break;
            }

            if (x >= 0 && x <= stage.width - cannon.width) {
                cannon.dstX = x;
            }
        },

        detectCollision = function (a, b) {
            
        },
        onUpdateDisplay = function () {
            var i;
            if (++refresh_tick_count % missile_v_ticks === 0) {
                for (i = missles.length - 1; i >= 0; i--) {
                    missles[i].dstY -= missle_step;
                    // Out of boundry
                    if (missles[i].dstY < 0) {
                        remove(sprites, missles[i]);
                        missles.splice(i, 1);
                    }
                }

                for (i = aliens.length - 1; i >= 0; i--) {
                    aliens[i].dstY += missle_step;
                    // Out of boundry
                    if (aliens[i].dstY > stage.height - aliens[i].height) {
                        remove(sprites, aliens[i]);
                        aliens.splice(i, 1);
                    }
                }
            }

            if (refresh_tick_count % alien_enter_ticks === 0) {
                generateAlien();
            }

            //console.log("Missles: " + missles.length);
            render();
        },

        onTileLoaded = function () {
            // Init sprite
            background.srcX = 0;
            background.srcY = 32;
            background.width = stage.width;
            background.height = stage.height;
            sprites.push(background);

            // Init cannon
            cannon.srcX = 0;
            cannon.srcY = 0;
            cannon.width = 32;
            cannon.height = 32;
            cannon.dstX = Math.floor((stage.width - cannon.width) / 2);
            cannon.dstY = stage.height - cannon.height;
            sprites.push(cannon);

            // Add keydown listener
            window.addEventListener("keydown", onKeyDown, false);

            // Add update display timer
            refresh_timer = window.setInterval(onUpdateDisplay, refresh_interval);

            render();
        };

    tile.addEventListener("load", onTileLoaded, false);    
    tile.src = "alienArmada.png";

}());