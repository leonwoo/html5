(function () {
    var stage = document.querySelector("#stage"),
        info = document.querySelector("#info"),
        surface = stage.getContext("2d"),
        tile = new Image(),
        sprite = {
            srcX: 0,
            srcY: 0,
            dstX: 0,
            dstY: 0,
            width: 0,
            height: 0,
            dstCenterX: function () {
                return this.dstX + Math.floor(this.width / 2);
            },
            dstCenterY: function () {
                return this.dstY + Math.floor(this.height / 2);
            },
            dstB : function () {
                return this.dstY + this.height;
            },
            dstR : function () {
                return this.dstX + this.width;
            }
        },
        background = Object.create(sprite),
        cannon = Object.create(sprite),
        blasts = [],
        beamBase = Object.create(sprite),
        beams = [],
        missileBase = Object.create(sprite),
        missiles = [],
        alienBase = Object.create(sprite),
        aliens = [],
        blastBase = Object.create(sprite),
        KEY_SPACE = 32,
        KEY_LEFT = 37,
        KEY_RIGHT = 39,
        refreshInterval = 120,
        refreshTimer,
        refreshTickCount = 0,
        alienEnterTicks = 20,
        score = 0,

        remove = function (arr, item) {
            var i;
            for (i = arr.length - 1; i >= 0; i--) {
                if (arr[i] === item) {
                    arr.splice(i, 1);
                }
            }
        },

        generateAlien = function () {
            var alien = Object.create(alienBase);
            alien.dstX = Math.floor((stage.width - alien.width) * Math.random());
            aliens.push(alien);
        },

        drawSprite = function (s) {
            surface.drawImage(tile, s.srcX, s.srcY, s.width, s.height, s.dstX, s.dstY, s.width, s.height);
        },
        render = function () {
            var i;
            surface.clearRect(0, 0, stage.width, stage.height);
            drawSprite(background);

            info.innerHTML = "Score: " + score;

            drawSprite(cannon);

            for (i = 0; i < blasts.length; i++) {
                drawSprite(blasts[i]);
            }

            for (i = 0; i < aliens.length; i++) {
                drawSprite(aliens[i]);
            }

            for (i = 0; i < missiles.length; i++) {
                drawSprite(missiles[i]);
            }

            for (i = 0; i < beams.length; i++) {
                drawSprite(beams[i]);
            }
        },

        fire = function () {
            var missile = Object.create(missileBase);
            missile.dstX = cannon.dstX + Math.floor(cannon.width) / 2 - Math.floor(missile.width / 2);
            missile.dstY = cannon.dstY - missile.height;

            // Use unshift instead of push to keep the early missle at the end of the array, since we normally do the backward search for removing
            missiles.unshift(missile);
        },

        onKeyDown = function (event) {
            var x;
            switch (event.keyCode) {
            case KEY_LEFT:
                x = cannon.dstX - cannon.step;
                break;
            case KEY_RIGHT:
                x = cannon.dstX + cannon.step;
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
            return !(a.dstX > b.dstR() || a.dstR() < b.dstX || a.dstY > b.dstB() || a.dstB() < b.dstY);
        },

        hitAlien = function (alien) {
            var blast = Object.create(blastBase);
            blast.dstX = alien.dstX;
            blast.dstY = alien.dstY;
            blasts.push(blast);
        },

        endGame = function () {
            window.removeEventListener("keydown", onKeyDown, false);
            window.clearInterval(refreshTimer);
            info.innerHTML = "End Game";
        },

        onUpdateDisplay = function () {
            var i, j;
            if (refreshTickCount % alienEnterTicks === 0) {
                generateAlien();
            }

            refreshTickCount += 1;
            for (i = 0; i < blasts.length; i++) {
                blasts[i].onTick();
            }

            for (i = 0; i < aliens.length; i++) {
                aliens[i].onTick();
            }

            for (i = 0; i < missiles.length; i++) {
                missiles[i].onTick();
            }

            for (i = 0; i < beams.length; i++) {
                beams[i].onTick();
            }

            for (i = missiles.length - 1; i >= 0; i--) {
                for (j = aliens.length - 1; j >= 0; j--) {
                    if (detectCollision(missiles[i], aliens[j])) {
                        score += 1;
                        hitAlien(aliens[j]);
                        aliens.splice(j, 1);
                        missiles.splice(i, 1);
                        break;
                    }
                }
            }

            for (i = 0; i < aliens.length; i++) {
                if (detectCollision(aliens[i], cannon)) {            
                    endGame();
                }
            }

            for (i = 0; i < beams.length; i++) {
                if (detectCollision(beams[i], cannon)) {
                    endGame();
                }
            }

            render();
        },

        onTileLoaded = function () {
            // Init sprite
            background.srcX = 0;
            background.srcY = 32;
            background.width = stage.width;
            background.height = stage.height;

            // Init cannon
            cannon.srcX = 0;
            cannon.srcY = 0;
            cannon.width = 32;
            cannon.height = 32;
            cannon.dstX = Math.floor((stage.width - cannon.width) / 2);
            cannon.dstY = stage.height - cannon.height;
            cannon.step = 16;

            // Add keydown listener
            window.addEventListener("keydown", onKeyDown, false);

            // Add update display timer
            refreshTimer = window.setInterval(onUpdateDisplay, refreshInterval);

            render();
        };

    // Setup missile base object
    missileBase.srcX = 3 * 32;
    missileBase.srcY = 0;
    missileBase.width = 16;
    missileBase.height = 16;
    missileBase.onTick = function () {
        var vTicks = 2, step = 16;
        if (refreshTickCount % vTicks === 0) {
            this.dstY -= step;
            // Out of boundry                    
            if (this.dstY < 0) {
                remove(missiles, this);
            }
        }
    };

    alienBase.srcX = 32;
    alienBase.srcY = 0;
    alienBase.width = 32;
    alienBase.height = 32;
    alienBase.dstY = 0;
    alienBase.attack = function () {
        var beam = Object.create(beamBase);
        beam.dstX = this.dstX + Math.floor(this.width / 2) - Math.floor(beam.width / 2);
        beam.dstY = this.dstY + this.height;
        beam.angle = Math.atan2(cannon.dstCenterY() - beam.dstCenterY(), cannon.dstCenterX() - beam.dstCenterX());
        beams.push(beam);
    };

    alienBase.onTick = function () {
        var step = 8, vTicks = 2, attackTick = 24;
        if (refreshTickCount % vTicks === 0) {
            this.dstY += step;
            // Out of boundry
            if (this.dstY > stage.height) {
                remove(aliens, this);
            }
        }

        if (refreshTickCount % attackTick === 0) {
            this.attack();
        }
    };

    blastBase.srcX = 2 * 32;
    blastBase.srcY = 0;
    blastBase.width = 32;
    blastBase.height = 32;
    blastBase.showTicks = 5;
    blastBase.onTick = function () {
        if (--this.showTicks === 0) {
            remove(blasts, this);
        }
    };

    beamBase.srcX = 3 * 32;
    beamBase.srcY = 16;
    beamBase.width = 16;
    beamBase.height = 16;
    beamBase.angle = Math.PI / 2;
    beamBase.onTick = function () {
        var step = 8, vTicks = 1, x, y;
        if (refreshTickCount % vTicks === 0) {
            x = this.dstX + Math.floor(step * Math.cos(this.angle));
            y = this.dstY + Math.floor(step * Math.sin(this.angle));
            // Out of boundry
            if (x + this.width < 0 || x > stage.width || y + this.height < 0 || y > stage.height) {
                remove(beams, this);
                return;
            }
            this.dstX = x;
            this.dstY = y;
        }
    };

    tile.addEventListener("load", onTileLoaded, false);
    tile.src = "alienArmada.png";

}());