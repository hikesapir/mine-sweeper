'use strict';

const EMPTY = ' ';
const MINE = '💣'
const MARK = '🚩'
const GAMEON = '🙂'
const WIN = '😎';
const LOSE = '🤯'

var bestTime = Infinity

var gBoard;
var gGame = {
    isOn: false,
    unShownCount: 0,
    markedCount: 0,
    secPassed: 0,
    lives: 1,
    hints: 3,
    ishelp: false,
    helpCount: 3
}
var gLevel = {
    size: 4,
    mines: 2
}
var firstClick = true;
var gMinesLocation = [];
var gCorrect = 0;




function init() {
    gBoard = buildBoard(gLevel.size)
    renderBoard()
    removeLife()
    gGame.isOn = true
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

    var strHTML = '';
    for (var i = 0; i < gBoard.length; i++) {
        strHTML += `<tr class="row" >\n`
        for (var j = 0; j < gBoard[0].length; j++) {

            var tdId = `cell-${i}-${j}`

            strHTML += `\t<td onmousedown="cellClicked(this, event, ${i}, ${j})"
                           id="${tdId}" >
                            
                         </td>\n`
        }
        strHTML += `</tr>\n`
    }

    var elCells = document.querySelector('.cells');
    elCells.innerHTML = strHTML;
}

function cellClicked(elCell, ev, i, j) {
    if (!gGame.isOn) return
    var currCell = gBoard[i][j]

    if (gGame.ishelp) {
        showCells(i, j);
        gGame.ishelp = false;
        setTimeout(() => {
            showCells(i, j)
        }, 1000)
        return
    }

    if (firstClick) {
        if (!ev.button) {
            firstClick = false;
            currCell.isShown = true;
            setRandomMines(gBoard, gLevel.mines);
            currCell.isShown = false;
            setMineNegsCount();
            console.log(gBoard);
            renderBoard();
            startTimer();
            var elCell = document.getElementById(elCell.id);
        } else return
    }

    currCell = gBoard[i][j];
    if (currCell.isShown) return;

    // update the MODEL
    if (!ev.button) {
        if(currCell.isMarked)return;
        currCell.isShown = true;
        if (!currCell.minesAroundCount && !currCell.isMine) {
            expandShown(gBoard, i, j);
        }
        // update the DOM
        elCell.innerHTML = (currCell.isMine) ? MINE : currCell.minesAroundCount
        gGame.unShownCount--

        if (currCell.isMine) {
            gGame.lives--
            removeLife()
        }

    } else {
        cellMarked(elCell, i, j)
    }

    if (checkGameOver()) {
        gameOver(currCell, ev);
    }
}

function checkGameOver() {

    if ((gCorrect === gLevel.mines && gGame.markedCount === gCorrect) || (gGame.unShownCount < gLevel.mines) || gGame.lives < 0) {
        return true
    }
    return false
}

function removeLife() {
    var str = '';
    for (var i = 0; i < gGame.lives; i++) {
        str += '💗'
    }
    var elHart = document.querySelector(`.lives`);
    elHart.innerHTML = str
}

function resetData(size = 4, mines = 2, lives = 1) {
    gGame = {
        isOn: true,
        unShownCount: 0,
        markedCount: 0,
        secPassed: 0,
        lives: lives,
        hints: 3,
        ishelp: false,
        helpCount: 3
    }
    gCorrect = 0
    gLevel.size = size;
    gLevel.mines = mines;
    gMinesLocation = [];

    firstClick = true
    document.querySelector('.data span').innerHTML = GAMEON

    var changeRecord = document.querySelector('.best-time');
    changeRecord.innerText = 'your best time is: ' + bestTime + ' sec';

    removeLife()
    resetTimer()
    init()
}

function gameOver(currCell, ev) {

    stopTimer();
    revealMines()

    if (currCell.isMine && !ev.button) {
        gMinesLocation = [];
        document.querySelector('.data span').innerHTML = LOSE
        setTimeout(() => {
            alert('game over')
        }, 1000);

    } else {
        document.querySelector('.data span').innerHTML = WIN
        setTimeout(() => {
            alert('victorios')
        }, 1000);
        if (gGame.secPassed < bestTime) {
            localStorage.setItem('bestTime', gGame.secPassed);
            bestTime = localStorage.getItem('bestTime');
        }
    }
    gGame.isOn = false;
}

