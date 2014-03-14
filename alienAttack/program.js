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
            visible: false,
            show: function () {
                this.visible = true;
            },
            hide: function () {
                this.visible = false;
            },
        },
        background = Object.create(sprite),
        cannon = Object.create(sprite),
        sprites = [],
        missles = [],
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
        drawSprite = function (s) {
            surface.drawImage(tile, s.srcX, s.srcY, s.width, s.height, s.dstX, s.dstY, s.width, s.height);
        },
        render = function () {
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

        onUpdateDisplay = function () {
            var i;
            if (++refresh_tick_count % missile_v_ticks === 0) {
                for (i = missles.length - 1; i >= 0; i--) {
                    missles[i].dstY -= missle_step;
                    // Out of boundry
                    if (missles[i].dstY < 0) {
                        missles.splice(i, 1);
                    }
                }
            }
            console.log("Missles: " + missles.length);
            render();
        },

        onTileLoaded = function () {
            // Init sprite
            background.srcX = 0;
            background.srcY = 32;
            background.width = stage.width;
            background.height = stage.height;
            background.visible = true;
            sprites.push(background);

            // Init cannon
            cannon.srcX = 0;
            cannon.srcY = 0;
            cannon.width = 32;
            cannon.height = 32;
            cannon.dstX = Math.floor((stage.width - cannon.width) / 2);
            cannon.dstY = stage.height - cannon.height;
            cannon.visible = false;
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