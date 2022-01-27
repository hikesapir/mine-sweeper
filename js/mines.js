'use strict';


function setRandomMines(board, amount) {
    var emptyCells = getEmptyCellsLocation(board);

    for (var i = 0; i < amount; i++) {
        var idx = getRandomInt(0, emptyCells.length - 1);
        var currLoction = emptyCells[idx];
        gMinesLocation.push(currLoction);
        var currCell = board[currLoction.i][currLoction.j]
        emptyCells.splice(idx, 1);
        currCell.isMine = true;
    }

}


function getEmptyCellsLocation(board) {
    var res = [];
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            var currCell = board[i][j];
            if (!currCell.isMine && !currCell.isShown) {
                res.push({ i, j });
            }
        }
    }

    return res;
}



function revealMines() {
    console.log(gMinesLocation);
    for (var k = 0; k < gMinesLocation.length; k++) {
        var locaI = gMinesLocation[k].i
        var locaJ = gMinesLocation[k].j
        var elCell = document.getElementById(`cell-${locaI}-${locaJ}`)

        elCell.innerHTML = MINE;
    }

}