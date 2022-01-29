'use strict';

function boomMode() {
    gGame.isNormalMode = false;
    console.log('gGame.isNormalMode', gGame.isNormalMode);
    gGame.isUserMode = false;
    console.log('gGame.isUserMode', gGame.isUserMode);
    gGame.is7BoomMode = true;
    console.log('gGame.is7BoomMode', gGame.is7BoomMode);
    resetData();
    gBoard = buildBoard(gLevel.size);
    setBoomMines();
    setMineNegsCount();


}

function getBoardCells() {
    var cells = []
    for (let i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            var cell = {
                board: gBoard[i][j],
                i,
                j
            }
            cells.push(cell);
        }
    }
    console.log(cells);
    return cells;
}

function setBoomMines() {
    var cells = getBoardCells();
    for (var i = 1; i <= cells.length; i++) {
        if (!(i % 7) && i > 0 || contains(i, 7)) {
            var currcell = cells[i - 1].board;
            currcell.isMine = true;
            var location = {
                i: cells[i-1].i,
                j: cells[i-1].j
            }
            console.log(i);
            gMinesLocation.push(location);
            console.log(gMinesLocation);

        }
    }
    console.log(gMinesLocation);
}

