'use strict';


function setMineNegsCount() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++)
            gBoard[i][j].minesAroundCount = countNegs(i, j, gBoard)
    }
}

function countNegs(cellI, cellJ, mat) {
    var mineCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= mat[i].length) continue;
            if (i === cellI && j === cellJ) continue;
            if (mat[i][j].isMine) mineCount++;
        }
    }
    return mineCount;
}

function cellMarked(elCell, i, j) {
    if (gBoard[i][j].isMarked){
        gGame.markedCount--;

        if (gBoard[i][j].isMine) {
            gCorrect--;
        }
        // update the MODEL
        gBoard[i][j].isMarked = false;
        console.log(gBoard);
        // update the DOM
        elCell.innerHTML = '';

    }else{
        gGame.markedCount++;

        if (gBoard[i][j].isMine) {
            gCorrect++;
        }
        // update the MODEL
        gBoard[i][j].isMarked = true;
        console.log(gBoard);
        // update the DOM
        elCell.innerHTML = MARK;
    }
}

function getHint(elBtn) {
    if (gGame.hints) {
        gGame.hints--
        elBtn.innerText = '💡' + gGame.hints;
        var emptyCells = getEmptyCellsLocation(gBoard);
        var idx = getRandomInt(0, emptyCells.length - 1);
        var currLoction = emptyCells[idx];
        // update the dom
        var elCell = document.getElementById(`cell-${currLoction.i}-${currLoction.j}`)
        elCell.classList.add('hint')
        return
    }
    alert('you waste all your hints')
}

function showCells(cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue;
            var elCell = document.getElementById(`cell-${i}-${j}`)
            var currCell = gBoard[i][j]
            if (gGame.ishelp) {
                elCell.innerHTML = (currCell.isMine) ? MINE : currCell.minesAroundCount
            } else if(!currCell.isShown) {
                elCell.innerHTML = '';
            }
        }
    }
}

function showCellsOמ() {
    if (firstClick || !gGame.helpCount) {
        alert('you can\'t use it..');
        return;
    }
    gGame.helpCount--;
    alert(`you have ${gGame.helpCount} more left`);
    gGame.ishelp = true;
}

function expandShown(board, idxi, idxj) {
    for (var i = idxi - 1; i <= idxi + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = idxj - 1; j <= idxj + 1; j++) {
            if (j < 0 || j >= board[i].length) continue;
            if (i === idxi && j === idxj) continue;
            if (board[i][j].isShown) continue;
            document.getElementById(`cell-${i}-${j}`).innerHTML = board[i][j].minesAroundCount
            board[i][j].isShown = true;
            gGame.unShownCount--
            document.getElementById(`cell-${i}-${j}`).classList.add('.shown')

            if (!board[i][j].minesAroundCount) return expandShown(gBoard, i, j)

        }
    }
}
