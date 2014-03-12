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
            stick: [[1, 1, 1, 1]]
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
                        x = c * cell.width;
                        y = r * cell.height;
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
                    for (x = 0; x < m[y].length; x++) {
                        rGrid = y + r;
                        cGrid = x + c;
                        if (grid[rGrid][cGrid] !== 0 && m[y][x] !== 0) {
                            return false;
                        }
                    }
                }
                return true;
            }
            return false;
        },
        generateBlock = function () {
            var index = Math.floor(Math.random() * blockTypes.length);
            sprite.type = blockTypes[index];
            sprite.r = 0;
            sprite.c = grid[0].length / 2;
        },
        removeFullRow = function () {
            var r, c, full, rowRemoved, result = [], newRow;
            for (r = 0; r < grid.length; r++) {
                full = true;
                for (c = 0; c < grid[r].length; c++) {
                    full = full && grid[r][c];
                    if (!full) {
                        break;
                    }
                }
                if (!full) {
                    newRow = [];
                    for (c = 0; c < grid[r].length; c++) {
                        newRow[c] = grid[r][c];
                    }
                    result.push(newRow);
                }
            }
            rowRemoved = grid.length - result.length;
            console.log(rowRemoved);
            if (rowRemoved > 0) {
                for (r = 0; r < rowRemoved; r++) {
                    result.unshift(Array.apply(null, new Array(grid[0].length)).map(Number.prototype.valueOf, 0));    
                }                
                grid = result;
            }

            return rowRemoved;
        },

        onUpdate = function () {
            var r, m, c, cGrid, rGrid;
            if (++updateTickCount % dropIntervalTick === 0) {
                r = sprite.r;
                r += 1;
                if (canGo(r, sprite.c)) {
                    sprite.r = r;
                } else {
                    // Reach ground, become part of grid and generate a new block
                    m = blocks[sprite.type];
                    for (r = 0; r < m.length; r++) {
                        for (c = 0; c < m[r].length; c++) {
                            rGrid = r + sprite.r;
                            cGrid = c + sprite.c;
                            if (m[r][c] !== 0) {
                                grid[rGrid][cGrid] = m[r][c];
                            }
                        }
                    }

                    removeFullRow();

                    generateBlock();
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

    generateBlock();
    tile.addEventListener("load", onLoadTile, false);
    window.addEventListener("keydown", onKeyDown, false);
    tile.src = "block.png";


}());