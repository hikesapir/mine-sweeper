'use strict';

const EMPTY = ' ';
const MINE = '💣'
const MARK = '🚩'

var gBoard;
var gGame = {
    isOn: false,
    unShownCount: 0,
    markedCount: 0,
    secPassed: 0
}
var gLevel = {
    size: 4,
    mines: 2
}
var firstClick;
var gMinesLocation = [];


function init(size = 4, mines = 2) {
    resetTimer()
    gLevel.size = size;
    gLevel.mines = mines;
    gGame.markedCount = 0;
    gGame.isOn = true
    firstClick = true

    gBoard = buildBoard(gLevel.size)
    console.log(gBoard);

    renderBoard()
}


function buildBoard(size) {
    var board = [];
    for (var i = 0; i < size; i++) {
        board[i] = [];
        for (var j = 0; j < size; j++) {
            var cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
            board[i][j] = cell
        }
    }

    gGame.unShownCount = size ** 2;

    return board;
}


function renderBoard() {
    // setRandomMines(gBoard, 2);
    // setMineNegsCount()

    var strHTML = '';
    for (var i = 0; i < gBoard.length; i++) {
        strHTML += `<tr class="row" >\n`
        for (var j = 0; j < gBoard[0].length; j++) {

            var tdId = `cell-${i}-${j}`

            strHTML += `\t<td onmousedown="cellClicked(this, event, ${i}, ${j})"
                           id="'${tdId}'" >
                            sapir
                         </td>\n`
        }
        strHTML += `</tr>\n`
    }
    // console.log(strHTML)

    var elCells = document.querySelector('.cells');
    elCells.innerHTML = strHTML;
}

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

function cellClicked(cell, ev, i, j) {

if (firstClick) {
    if (!ev.button) {
        firstClick = false;
        gBoard[i][j].isShown;
        setRandomMines(gBoard, 2);
        setMineNegsCount()
        renderBoard();
        startTimer();
        var cell = document.getElementById(cell.id)
    } else return
}

    
    var currCell = gBoard[i][j]
    if (currCell.isShown) return

    // update the MODEL
    if (!ev.button) {
        currCell.isShown = true;

        // update the DOM
        cell.innerHTML = (currCell.isMine) ? MINE : currCell.minesAroundCount
        gGame.unShownCount--

    } else {
        cellMarked(cell)
        gGame.markedCount++
    }

    if (checkGameOver(2, currCell)) {
        stopTimer();
        if (currCell.isMine) {
            revealMines()
            removeLife()
        }
        setTimeout(() => {
            alert('game over')
        }, 1000);
    }
}

function setRandomMines(board, amount) {
    var emptyCells = getEmptyCellsLocation(board);

    for (var i = 0; i < amount; i++) {
        var idx = getRandomInt(0, emptyCells.length);
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

function cellMarked(elCell) {
    // update the DOM
    elCell.innerHTML = MARK
}

function checkGameOver(amountMines, currCell) {
    if ((amountMines === gGame.markedCount && gGame.unShownCount === amountMines) || (currCell.isMine && currCell.isShown)) {
        return true
    }
    return false
}

function revealMines() {
    for (var k = 0; k < gMinesLocation.length; k++) {
        var locaI = gMinesLocation[k].i
        var locaJ = gMinesLocation[k].j
        var elCell = document.getElementById(`'cell-${locaI}-${locaJ}'`)

        elCell.innerHTML = MINE;
    }

}

function removeLife(){
    var elHart = document.querySelector(`.lives 1`);
    console.log(elHart);

}