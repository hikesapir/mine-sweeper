'use strict';

// Those are global variables, they stay alive and reflect the state of the game
const EMPTY = ' ';
const MINE = '💣'
const MARK = '🚩'
const GAMEON = '🙂'
const WIN = '😎';
const LOSE = '🤯'

var gLevel = {
    size: 4,
    mines: 2,
    lives: 1
}

// This is a constant that we dont change during the game (we mark those with CAPITAL letters)
var gBoard;
var gGame = {
    isOn: false,
    isNormalMode: true,
    isUserMode: false,
    is7BoomMode: false,
    unShownCount: 0,
    markedCount: 0,
    secPassed: 0,
    livesCount: 1,
    hints: 3,
    ishelp: false,
    helpCount: 3,
}
var firstClick = true;
var gCorrect = 0;
var gUndoMemory = [];
var gMinesLocation = [];
var bestTimeLevel1 = Infinity
var bestTimeLevel2 = Infinity
var bestTimeLevel3 = Infinity


function init() {

    if (gGame.isNormalMode) {
        gBoard = buildBoard(gLevel.size)
    } else if (gGame.isUserMode) {
        if (gMinesLocation.length < gLevel.mines) {
            alert('you need to place more mines');
            return
        }
        document.querySelector('.next').innerText = 'next'
        document.querySelector('.next').setAttribute("onClick", "locateInstructions()");
        setMineNegsCount();
        console.log(gBoard);
        gGame.is7BoomMode = false;
    }

    document.querySelector('.next').style.display = 'none'
    renderBoard();
    resetTimer();
    removeLife();
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
            var tdClass = (gGame.isShown) ? 'shown' : 'unshown'

            strHTML += `\t<td onmousedown="cellClicked(this, event, ${i}, ${j})"
                           id="${tdId}" class="${tdClass}" >
                            
                         </td>\n`
        }
        strHTML += `</tr>\n`
    }

    var elCells = document.querySelector('.cells');
    elCells.innerHTML = strHTML;
    var elHIntBtn = document.querySelector('.hint-btn')
    elHIntBtn.innerText = '💡' + gGame.hints;
}

function cellClicked(elCell, ev, i, j) {
    if (!gGame.isOn || (gGame.isUserMode && !gGame.isOn)) return
    var currCell = gBoard[i][j]

    if (gGame.ishelp) {
        showCells(i, j);
        gGame.ishelp = false;
        setTimeout(() => {
            showCells(i, j)
        }, 1000)
        return
    }


    if (firstClick && !ev.button) {
        firstClick = false;
        startTimer();
        if (gGame.isNormalMode) {
            currCell.isShown = true;
            setRandomMines(gBoard, gLevel.mines);
            currCell.isShown = false;
            setMineNegsCount();
            console.log(gBoard);
            renderBoard();
        }

    }

    addToHistory();

    var elCell = document.getElementById(elCell.id);
    currCell = gBoard[i][j];
    if (currCell.isShown) return;

    // update the MODEL
    if (!ev.button) {
        if (currCell.isMarked) return;
        currCell.isShown = true;
        if (!currCell.isMine) gGame.unShownCount--
        if (!currCell.minesAroundCount && !currCell.isMine) {
            expandShown(gBoard, i, j);
        }
        // update the DOM
        elCell.innerHTML = (currCell.isMine) ? MINE : currCell.minesAroundCount
        elCell.classList.add('shown');
        elCell.classList.remove('unshown')
        if (currCell.isMine) {
            gGame.livesCount--
            removeLife()
        }

    } else {
        cellMarked(elCell, i, j)
    }

    if (checkGameOver()) {
        if (!gGame.isNormalMode) {
            gGame.isNormalMode = true;
            gGame.isUserMode = false;
            gGame.is7BoomMode = false;
        }
        gGame.isOn = false
        gameOver(currCell, ev,elCell);
    }


}

function checkGameOver() {
    if ((gGame.unShownCount === gLevel.mines) || gGame.livesCount <= 0) {
        return true
    }
    return false
}

function removeLife() {
    var str = '';
    for (var i = 0; i < gGame.livesCount; i++) {
        str += '💗'
    }
    var elHart = document.querySelector(`.lives`);
    elHart.innerHTML = str
}

function resetData(size = gLevel.size, mines = gLevel.mines, lives = gLevel.lives) {
    if ((gGame.isOn && !gGame.isNormalMode)) {
        alert('to start a new game, press normal mode button');
        return;
    }
    gGame = {
        isOn: false,
        isNormalMode: gGame.isNormalMode,
        is7BoomMode: gGame.is7BoomMode,
        isUserMode: gGame.isUserMode,
        unShownCount: 0,
        markedCount: 0,
        secPassed: 0,
        livesCount: lives,
        hints: 3,
        ishelp: false,
        helpCount: 3,

    }

    gLevel.size = size;
    gLevel.mines = mines;
    gLevel.lives = lives;

    gCorrect = 0
    gMinesLocation = [];
    gUndoMemory = [];

    firstClick = true
    document.querySelector('.dashboard span').innerHTML = GAMEON

    removeLife()



    var changeRecord = document.querySelector('.best-time');
    if (gGame.isNormalMode) {
        changeRecord.style.display = 'block'
        if (localStorage.getItem('bestTimelevel' + gLevel.lives) > 0) {
            changeRecord.innerText = `your best time for this level is: ${localStorage.getItem('bestTimelevel' + gLevel.lives)} sec`;
        } else {
            changeRecord.style.display = 'none'
        }
    }
    if (!gGame.isNormalMode) {
        changeRecord.style.display = 'none'
        return
    }

    init();
}

function gameOver(currCell, ev,elCell) {

    stopTimer();
    revealMines();

    if (currCell.isMine && !ev.button) {
        gMinesLocation = [];
        document.querySelector('.dashboard span').innerHTML = LOSE
        alert('game over')
        elCell.classList.add('lost')
    } else {
        document.querySelector('.dashboard span').innerHTML = WIN
        alert('victorios')


        if (gGame.isNormalMode) {

            if (gLevel.size === 4) {
                if (gGame.secPassed < bestTimeLevel1) {
                    localStorage.setItem('bestTimelevel1', gGame.secPassed);
                    bestTimeLevel1 = localStorage.getItem('bestTimelevel1');
                }
            } else if (gLevel.size === 8) {
                if (gGame.secPassed < bestTimeLevel2) {
                    localStorage.setItem('bestTimelevel2', gGame.secPassed);
                    bestTimeLevel2 = localStorage.getItem('bestTimelevel2');
                }
            } else {
                if (gGame.secPassed < bestTimeLevel3) {
                    localStorage.setItem('bestTimelevel3', gGame.secPassed);
                    bestTimeLevel3 = localStorage.getItem('bestTimelevel3');
                }
            }
        }

    }
    gGame.isOn = false;
}

function addToHistory() {
    var currStep = {
        board: JSON.parse(JSON.stringify(gBoard)),
        boardRender: document.querySelector('.cells').innerHTML,
        correctFlag: gCorrect,
        markedCount: gGame.markedCount,
        unShownCount: gGame.unShownCount
    }
    gUndoMemory.push(currStep);

}

function undo() {
    if (!gGame.isOn) return
    if (!gUndoMemory.length) return;
    var pervStep = gUndoMemory.pop();
    gBoard = pervStep.board
    document.querySelector('.cells').innerHTML = pervStep.boardRender;
    gCorrect = pervStep.correctFlag;
    gGame.markedCount = pervStep.markedCount;
    gGame.unShownCount = pervStep.unShownCount;

}

function setNormalMode() {
    gGame.isNormalMode = true;
    gGame.isUserMode = false;
    gGame.is7BoomMode = false;

    resetData();
    init();

}
