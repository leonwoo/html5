(function () {
    var stage = document.querySelector("#stage"),
        panel = document.querySelector("#panel"),
        panelSurface = panel.getContext("2d"),
        status = document.querySelector("#status"),
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
            square:
                [
                    [
                        [1, 1], [1, 1]
                    ]
                ],
            stick:
                [
                    [
                        [2, 2, 2, 2]
                    ],
                    [
                        [2],
                        [2],
                        [2],
                        [2]
                    ]
                ],
            capitalL:
                [
                    [
                        [0, 0, 3],
                        [3, 3, 3]
                    ],
                    [
                        [3, 0],
                        [3, 0],
                        [3, 3],
                    ],
                    [
                        [3, 3, 3],
                        [3, 0, 0]
                    ],
                    [
                        [3, 3],
                        [0, 3],
                        [0, 3],
                    ],
                ],
            capitalJ:
                [
                    [
                        [4, 4, 4],
                        [0, 0, 4]
                    ],
                    [
                        [0, 4],
                        [0, 4],
                        [4, 4],
                    ],
                    [
                        [4, 0, 0],
                        [4, 4, 4]
                    ],
                    [
                        [4, 4],
                        [4, 0],
                        [4, 0],
                    ],
                ],
            rStarter:
                [
                    [
                        [0, 5, 5],
                        [5, 5, 0]
                    ],
                    [
                        [5, 0],
                        [5, 5],
                        [0, 5],
                    ],
                ],
            lStarter:
                [
                    [
                        [6, 6, 0],
                        [0, 6, 6]
                    ],
                    [
                        [0, 6],
                        [6, 6],
                        [6, 0],
                    ],
                ],
            capitalT:
                [
                    [
                        [7, 7, 7],
                        [0, 7, 0]
                    ],
                    [
                        [7, 0],
                        [7, 7],
                        [7, 0],
                    ],
                    [
                        [0, 7, 0],
                        [7, 7, 7]
                    ],
                    [
                        [0, 7],
                        [7, 7],
                        [0, 7],
                    ]
                ],
        },

        blockTypes = ["square", "stick", "capitalL", "capitalJ", "lStarter", "rStarter", "capitalT"],
        score = 0,
        sprite = {
            c: 0,
            r: 0,
            z: 0,
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
                        surface.drawImage(tile, grid[r][c] * cell.width - cell.width, 0, cell.width, cell.height, x, y, cell.width, cell.height);
                    }
                }
            }
        },
        drawSprite = function () {
            var c, r, x, y, m;
            m = blocks[sprite.type][sprite.z];
            for (r = 0; r < m.length; r++) {
                for (c = 0; c < m[r].length; c++) {
                    if (m[r][c] !== 0) {
                        x = (sprite.c + c) * cell.width;
                        y = (sprite.r + r) * cell.height;
                        surface.drawImage(tile, m[r][c] * cell.width - cell.width, 0, cell.width, cell.height, x, y, cell.width, cell.height);
                    }
                }
            }
        },
        render = function () {
            surface.clearRect(0, 0, stage.width, stage.height);
            drawMap();
            drawSprite();

            // show status
            status.innerHTML = score;
        },

        canGo = function (r, c, z) {
            var m, rGrid, cGrid, x, y;
            m = blocks[sprite.type][z];
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

        renderPanel = function () {
            var r, c, m, x, y;
            panelSurface.clearRect(0, 0, panel.width, panel.height);
            m = blocks[sprite.type][sprite.z];
            //panelSurface.clearRect(0, 0, panel.width, panel.height);
            for (r = 0; r < m.length; r++) {
                for (c = 0; c < m[r].length; c++) {
                    if (m[r][c] !== 0) {
                        x = c * cell.width;
                        y = r * cell.height;
                        panelSurface.drawImage(tile, m[r][c] * cell.width - cell.width, 0, cell.width, cell.height, x, y, cell.width, cell.height);
                    }
                }
            }
        },
        generateBlock = function () {
            var index = Math.floor(Math.random() * blockTypes.length);
            sprite.type = blockTypes[index];
            sprite.z = Math.floor(Math.random() * blocks[sprite.type].length);
            sprite.r = 0;
            sprite.c = grid[0].length / 2;
            renderPanel();
            return canGo(sprite.r, sprite.c, sprite.z);
        },

        removeFullRows = function () {
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

        endGame = function () {
            window.clearInterval(updateTimer);
            status.innerHTML = "The End!";
        },
        onUpdate = function () {
            var r, m, c, cGrid, rGrid, rowRemoved;
            if (++updateTickCount % dropIntervalTick === 0) {
                r = sprite.r;
                r += 1;
                if (canGo(r, sprite.c, sprite.z)) {
                    sprite.r = r;
                } else {
                    // Reach ground, become part of grid and generate a new block
                    m = blocks[sprite.type][sprite.z];
                    for (r = 0; r < m.length; r++) {
                        for (c = 0; c < m[r].length; c++) {
                            rGrid = r + sprite.r;
                            cGrid = c + sprite.c;
                            if (m[r][c] !== 0) {
                                grid[rGrid][cGrid] = m[r][c];
                            }
                        }
                    }

                    rowRemoved = removeFullRows();
                    if (rowRemoved > 0) {
                        score += Math.pow(2, rowRemoved - 1);
                    }
                    if (!generateBlock()) {
                        endGame();
                        return;
                    }
                }
            }
            render();
        },
        onLoadTile = function () {
            generateBlock();
            updateTimer = window.setInterval(onUpdate, updateInterval);
        },
        UP = 38,
        RIGHT = 39,
        DOWN = 40,
        LEFT = 37,
        onKeyDown = function (event) {
            var r, c, z;
            r = sprite.r;
            c = sprite.c;
            z = sprite.z;
            switch (event.keyCode) {
            case UP:
                z = (z + 1) % blocks[sprite.type].length;
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

            if (canGo(r, c, z)) {
                sprite.r = r;
                sprite.c = c;
                sprite.z = z;
            }
        };

    tile.addEventListener("load", onLoadTile, false);
    window.addEventListener("keydown", onKeyDown, false);
    tile.src = "block.png";


}());