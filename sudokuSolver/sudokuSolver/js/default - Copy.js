﻿(function () {
    //"use strict";

    var cells = document.querySelectorAll("input");
    console.log(cells);
    var nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    var grids = [];
    for (var i = 0; i < cells.length; i++) {
        if (i % 9 === 0) {
            grids.push([]);
        }
        var cell = cells[i].value;
        var value = parseInt(cell);
        var y = Math.floor(i / 9);

        if (!isNaN(value) && value >= 0 && value <= 9) {
            grids[y].push(value);
        }
        else {
            //! @todo: error handler
            grids[y].push(0);
        }
    }

    var route = [];
    playGame();
    function playGame()
    {
        // Try to figure out as much as possible result in the 1st round
        for (; ;) {
            var candidatesAll = getCandidatesAll();
            var blankCellNum = candidatesAll.blankCellNum;
            var candidatesArr = candidatesAll.candidatesArr;
            if (blankCellNum == 0) {
                showGrid();
                return;
            }

            var deadEnd = _.find(candidatesArr, function(n) { return n.c.length == 0; });
            if (deadEnd)
            {
                console.log("no solution");
                return;
            }

            var count = 0;
            for (var i = 0; i < candidatesArr.length; i++) {
                var candidate = candidatesArr[i];
                if (candidate.c.length == 1) {
                    count++;
                    grids[candidate.y][candidate.x] = candidate.c[0];
                }
            }
            if (count == 0)
            {
                // no more solid candidate, jump out
                break;
            }
        }


        for (; ;)
        {
            var candidatesAll = getCandidatesAll();
            var blankCellNum = candidatesAll.blankCellNum;
            var candidatesArr = candidatesAll.candidatesArr;
            var deadEnd = _.find(candidatesArr, function (n) { return n.c.length == 0; });
            console.assert(blankCellNum != 0 && !deadEnd, "logic error #1");

            var candidate = candidatesArr[0];
            grids[candidate.y][candidate.x] = candidate.c.pop();
            if (candidate.c.length != 0) {
                route.push(candidate);
            }
            else {
                console.assert(false, "logic error #2")
            }

            //candidatesAll = getCandidatesAll();
            //blankCellNum = candidatesAll.blankCellNum;
            //candidatesArr = candidatesAll.candidatesArr;

            if (blankCellNum == 0) {
                showGrid();
                return;
            }
            deadEnd = _.find(candidatesArr, function (n) { return n.c.length == 0; });
            if (deadEnd) {
                // Back 1 step
                if (route.length == 0) {
                    console.log("no solution");
                    return;
                }
                else {
                    var lastPt = route[route.length - 1][0];
                    console.assert(lastPt.c.length != 0);
                    grids[lastPt.y, lastPt.x] = lastPt.c.pop();
                    if (lastPt.c.length == 0) {
                        route.slice(0, route.length - 1);
                        if (route.length == 0) {
                            console.log("no solution");
                            return;
                        }
                    }
                }
            }
        }
    }

    function getCandidatesAll() {
        var candidatesArr = [];
        var blankCellNum = 0;
        for (var y = 0; y < grids.length; y++) {
            for (var x = 0; x < grids.length; x++) {
                if (grids[y][x] == 0) {
                    blankCellNum++;
                    candidatesArr.push({ x: x, y: y, c: getCandiates(x, y) });
                }
            }
        }
        candidatesArr = _.sortBy(candidatesArr, function (n) { return n.c.length; });
        return { candidatesArr: candidatesArr, blankCellNum: blankCellNum };
    }
    function showGrid() {
        for (var i = 0; i < cells.length; i++) {
            var cell = cells[i];
            var x = i % 9;
            var y = Math.floor(i / 9);
            cell.value = "" + grids[y][x];
            console.log(cell.innerHTML);
        }
    }

    function getCandiates(x, y) {
        var row = [];
        for (var i = 0; i < 9; i++) {
            if (grids[y][i] != 0)
            {
                row.push(grids[y][i]);
            }            
        }

        var result = _.difference(nums, row);
        var col = [];
        for (var i = 0; i < 9; i++) {
            if (grids[i][x] != 0)
            {
                col.push(grids[i][x]);
            }
        }
        result = _.difference(result, col);

        var box3X3 = [];
        var boxX = Math.floor(x / 3) * 3;
        var boxY = Math.floor(y / 3) * 3;

        for (var i = boxY; i < boxY + 3; i++) {
            for (var j = boxX; j < boxX + 3; j++) {
                if (grids[i][j] != 0) {
                    box3X3.push(grids[i][j]);
                }
            }
        }
        return _.difference(result, box3X3);
    }


})();