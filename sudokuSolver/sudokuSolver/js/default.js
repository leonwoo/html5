﻿(function () {
    //"use strict";

    // Get all cells
    var cells = document.querySelectorAll("#grid td");
    for (var i = 0; i < cells.length; i++) {
        cells[i].addEventListener("click", onCellClicked, false);
    }

    var numBtns = document.querySelectorAll(".Numbertable td");

    for (var i = 0; i < numBtns.length; i++) {
        numBtns[i].addEventListener("click", numBtnClicked, false);
    }


    var unselectNumBtnColor = getStyleRuleValue("borderColor", ".numBtn");
    var selectedNum = "";
    var nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    var grids = [];
    var route = [];
    var NO_SOLUTION = 1;
    var solveButton = document.querySelector("#solve");
    solveButton.addEventListener("click", solveClickedHandler, false);

    function numBtnClicked(event) {
        for (var i = 0; i < numBtns.length; i++) {
            numBtns[i].style.borderColor = unselectNumBtnColor;
        }
        event.target.style.borderColor = "red";
        selectedNum = event.target.innerText;
    }

    function onCellClicked(event) {
        var cell = event.target;
        cell.innerText = selectedNum;
    }

    function solveClickedHandler() {
        // Build the grid
        for (var i = 0; i < cells.length; i++) {
            if (i % 9 === 0) {
                grids.push([]);
            }
            var cell = cells[i].innerText;
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

        playGame();
    }
    
    // Game loop
    function playGame()
    {
        try {
            // Try to figure out as much as possible cells in the 1st round
            for (; ;) {
                var candidatesAll = getCandidatesAll();
                var blankCellNum = candidatesAll.blankCellNum;
                var candidatesArr = candidatesAll.candidatesArr;
                // No blank cell, it's the solution already
                if (blankCellNum == 0) {
                    showGrid();
                    return;
                }

                // Keep feeling the cells with a solid answer
                var count = 0;
                for (var i = 0; i < candidatesArr.length; i++) {
                    var candidate = candidatesArr[i];
                    if (candidate.c.length == 1) {
                        count++;
                        grids[candidate.y][candidate.x] = candidate.c[0];
                    }
                }
                if (count == 0) {
                    // no more solid candidate, jump out
                    break;
                }
            }

            for (; ;) {
                var candidatesAll = getCandidatesAll();
                var blankCellNum = candidatesAll.blankCellNum;
                var candidatesArr = candidatesAll.candidatesArr;
                // No blank cell, we have a result now
                if (blankCellNum == 0) {
                    showGrid();
                    return;
                }

                var deadEnd = _.find(candidatesArr, function (n) { return n.c.length == 0; }) !== undefined;
                if (deadEnd) {
                    // Back to the begin, there is no solution
                    if (route.length == 0) {
                        console.log("no solution");
                        return;
                    }
                    else {
                        // This route can not lead to the result, back 1 step

                        // First purge point without candidates
                        var numPtToRemove = 0;
                        for (var i = route.length - 1; i >= 0; i--) {
                            var pt = route[i];
                            if (pt.c.length == 0) {
                                grids[pt.y][pt.x] = 0;
                                numPtToRemove++;
                            }
                            else {
                                break;
                            }
                        }

                        route = route.slice(0, route.length - numPtToRemove);
                        if (route.length == 0) {
                            console.log("no solution");
                            return;
                        }
                        else {
                            var lastPt = route[route.length - 1];
                            grids[lastPt.y][lastPt.x] = lastPt.c.pop();
                        }
                        continue;
                    }
                }

                var candidate = candidatesArr[0];
                grids[candidate.y][candidate.x] = candidate.c.pop();
                route.push(candidate);
            }
        }
        catch (e) {
            if (e === NO_SOLUTION) {
                alert("No solution");
            }
            else {
                alert("Something wrong, but I don't know the reason.")
            }
        }
    }

    // Get candiates for all empty cells and check the existing cells to detect unsolvable puzzle
    function getCandidatesAll() {
        var candidatesArr = [];
        var blankCellNum = 0;
        for (var y = 0; y < grids.length; y++) {
            for (var x = 0; x < grids.length; x++) {
                if (grids[y][x] == 0) {
                    blankCellNum++;
                    candidatesArr.push({ x: x, y: y, c: getCandiates(x, y) });
                }
                else {
                    if (getCandiates(x, y).indexOf(grids[y][x]) == -1) {
                        throw NO_SOLUTION;
                    }
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
            if (cell.innerText === "") {
                cell.style.color = "blue";
            }
            cell.innerText = "" + grids[y][x];
        }
    }

    // Find out all candiates for a cell
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

    function getStyleRuleValue(style, selector, sheet) {
        var sheets = typeof sheet !== 'undefined' ? [sheet] : document.styleSheets;
        for (var i = 0, l = sheets.length; i < l; i++) {
            var sheet = sheets[i];
            if (!sheet.cssRules) { continue; }
            for (var j = 0, k = sheet.cssRules.length; j < k; j++) {
                var rule = sheet.cssRules[j];
                if (rule.selectorText && rule.selectorText.split(',').indexOf(selector) !== -1) {
                    return rule.style[style];
                }
            }
        }
        return null;
    }

})();
