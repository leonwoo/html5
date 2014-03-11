// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function () {
    "use strict";
    var canvas = document.querySelector("#stage"),
        surface = canvas.getContext("2d"),
        tileSet = new Image(),
        info = document.querySelector("#info"),
        i = 0,
        hitCount = 0,
        hitsToWin = 10,
        updateInterval = 120,
        gameDurationSeconds = 10,
        refreshTimer,
        endGameTimer,
        endGameSecondCount = gameDurationSeconds,
        monsterNum = 12,
        monsters = [],
        monster = {
            maxHideTick: 60,
            hideTick: 0,
            frameIndex: 0,
            forward: true,
            blowTickCount: 0,
            blowDurationTicks: 10,

            reset: function () {
                this.frameIndex = 0;
                this.forward = true;
                this.hideTick = Math.ceil(Math.random() * this.maxHideTick);
            },

            hit: function () {
                this.frameIndex = 6;
                this.blowTickCount = this.blowDurationTicks;
            },

            isJumping: function () {
                return this.frameIndex !== 0 && this.frameIndex !== 6;
            },

            play: function () {
                if (this.hideTick === 0) {
                    // The monster was hit
                    if (this.blowTickCount > 0) {
                        // Blow animation ends, reset state
                        if (--this.blowTickCount === 0) {
                            this.reset();
                        }

                    } else {
                        console.assert(!this.blowTickCount, "blowTickCount < 0");
                        if (this.forward) {
                            this.frameIndex += 1;
                            if (this.frameIndex === 5) {
                                this.forward = false;
                            }
                        } else {
                            this.frameIndex -= 1;
                            if (this.frameIndex === 0) {
                                this.reset();
                            }
                        }
                    }
                } else {
                    this.hideTick -= 1;
                }
            },

            width: 128,
            height: 128,

            srcX: function () {
                return this.frameIndex % 3 * this.width;
            },

            srcY: function () {
                return Math.floor(this.frameIndex / 3) * this.height;
            },

            dstX: 0,
            dstY: 0,
            src: "images/monsterTileSheet.png"
        },

        updateDisplay = function () {
            surface.clearRect(0, 0, canvas.width, canvas.height);
            for (i = 0; i < monsterNum; i += 1) {
                monster = monsters[i];
                surface.drawImage(tileSet, monster.srcX(), monster.srcY(), monster.width, monster.height, monster.dstX, monster.dstY, monster.width, monster.height);
            }

            info.innerHTML = "Hits: " + hitCount + "  Left: " + endGameSecondCount + "(s)";
        },        
        endGame = function (success) {
            updateDisplay();
            canvas.removeEventListener("mousedown", onMouseDown, false);
            window.clearInterval(refreshTimer);
            window.clearInterval(endGameTimer);
            if (success) {
                info.innerHTML = "You won";
            } else {
                info.innerHTML = "You lost";
            }
        },
        onMouseDown = function (event) {
            var x = Math.floor(event.clientX / monster.width),
                y = Math.floor(event.clientY / monster.height);
            if (monsters[y * 4 + x].isJumping()) {
                monsters[y * 4 + x].hit();
                if (++hitCount > hitsToWin) {
                    endGame(true);
                }
            }
        },

        onLoadTile = function () {
            for (i = 0; i < monsterNum; i += 1) {
                monsters[i].reset();
            }
            updateDisplay();
        },

        onInterval = function () {
            for (i = 0; i < monsterNum; i += 1) {
                monsters[i].play();
            }
            updateDisplay();
        },

        onTimeout = function () {
            if (--endGameSecondCount === 0) {
                endGame(false);
            }
        },
        newMonster;

    for (i = 0; i < monsterNum; i += 1) {
        newMonster = Object.create(monster);
        newMonster.dstX = newMonster.width * (i % 4);
        newMonster.dstY = newMonster.height * Math.floor(i / 4);
        monsters.push(newMonster);
    }
    canvas.addEventListener("mousedown", onMouseDown, false);
    tileSet.addEventListener("load", onLoadTile, false);
    tileSet.src = monster.src;
    refreshTimer = window.setInterval(onInterval, updateInterval);
    endGameTimer = window.setInterval(onTimeout, 1000);
}());
