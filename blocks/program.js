(function () {
    var stage = document.querySelector("#stage"),
        surface = stage.getContext("2d"),
        tile = new Image(),
        cell = {
            width: 30,
            height: 30
        },
        grid = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ],

        blocks = {
            square: [[1, 1], [1, 1]],
            stick: [1, 1, 1, 1], 
        },

        blockTypes = ["square", "stick"],

        sprite = {
            c: 0,
            r: 0,
            type: "square"
        },
        dropIntervalTick = 10,
        updateTickCount = 0,
        updateInterval = 120,
        updateTimer,
        drawMap = function () {
            var c, r, x, y;
            for (r = 0; r < grid.length; r++) {
                for (c = 0; c < grid[r].length; c++) {
                    if (grid[r][c] !== 0) {
                        x = r * cell.width;
                        y = c * cell.height;
                        surface.drawImage(tile, 0, 0, cell.width, cell.height, x, y, cell.width, cell.height);
                    }
                }
            }
        },
        drawSprite = function () {
            var c, r, x, y, m;
            m = blocks[sprite.type];
            for (r = 0; r < m.length; r++) {
                for (c = 0; c < m[r].length; c++) {
                    x = (sprite.c + c) * cell.width;
                    y = (sprite.r + r) * cell.height;
                    surface.drawImage(tile, 0, 0, cell.width, cell.height, x, y, cell.width, cell.height);
                }
            }
        },
        render = function () {
            surface.clearRect(0, 0, stage.width, stage.height);
            drawMap();
            drawSprite();
        },

        canGo = function (r, c) {
            var m, rGrid, cGrid, x, y;
            m = blocks[sprite.type];
            // First check the boundary
            if (r >= 0 && r + m.length <= grid.length && c >= 0 && c + m[0].length <= grid[0].length) {
                for (y = 0; y < m.length; y++) {
                    for (x = 0; x < m[0].length; x++) {
                        rGrid = y + sprite.r;
                        cGrid = x + sprite.c;
                        if (grid[rGrid][cGrid] !== 0 && m[y][x] !== 0) {
                            return false;
                        }
                    }
                }
                return true;
            }
            return false;
        },

        onUpdate = function () {
            var r;
            if (updateTickCount % dropIntervalTick === 0) {
                r = sprite.r;
                r += 1;
                if (canGo(r, sprite.c)) {
                    sprite.r = r;
                }
            }
            render();
        },
        onLoadTile = function () {
            updateTimer = window.setInterval(onUpdate, updateInterval);
        },
        UP = 38,
        RIGHT = 39,
        DOWN = 40,
        LEFT = 37,
        onKeyDown = function (event) {
            var r, c;
            r = sprite.r;
            c = sprite.c;
            switch (event.keyCode) {
            case UP:
                r -= 1;
                break;
            case RIGHT:
                c += 1;
                break;
            case DOWN:
                r += 1;
                break;
            case LEFT:
                c -= 1;
                break;
            }

            if (canGo(r, c)) {
                sprite.r = r;
                sprite.c = c;
            }
        };

    tile.addEventListener("load", onLoadTile, false);
    window.addEventListener("keydown", onKeyDown, false);
    tile.src = "block.png";


}());