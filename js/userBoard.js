var gUserMines = 0;

function makeBoard() {
    gUserMines=0
    alert('plaese select baord size\n by click on one of the buttons (beginner/medium/expert)\n press next when you done ');
    document.querySelector('.next').style.display = 'block'
    
    gGame.isNormalMode = false;
    gGame.isUserMode = true;
    gGame.is7BoomMode = false;
}

function locateInstructions() {
    //reset
    gBoard = buildBoard(gLevel.size);
    renderEmptyUserBoard();
    gMinesLocation = [];

    //Instructions to next step
    alert(`plaese locate ${gLevel.mines} mines,\n for delete use right click`);
    document.querySelector('.next').innerText = 'start'
    document.querySelector('.next').setAttribute("onClick", "init()");


}


function setMinesUser(i, j, event, elCell) {

    if (gUserMines === gLevel.mines && !event.button) {
        alert('you can\'t put more mines')
        return
    }
    var currCell = gBoard[i][j];

    if (!event.button && !currCell.isMine) {
        currCell.isMine = true;
        gUserMines++;
        elCell.innerHTML = MINE
        if (gUserMines === gLevel.mines) {
            alert('to start select start button');
        }
        gMinesLocation.push({ i, j });
        return;

    } else if (event.button && currCell.isMine) {
        currCell.isMine = false;
        gUserMines--;
        elCell.innerHTML = ''
        var idxDeleteMine = indexOfObject(gMinesLocation, { i, j })
        gMinesLocation.splice(idxDeleteMine, 1);

        return;
    }
    alert('something wrong happened\n you didn\'t add or removed nime')

}

function renderEmptyUserBoard() {

    var strHTML = '';
    for (var i = 0; i < gBoard.length; i++) {
        strHTML += `<tr class="row" >\n`
        for (var j = 0; j < gBoard[0].length; j++) {

            var tdId = `cell-${i}-${j}`

            strHTML += `\t<td onmousedown="setMinesUser(${i}, ${j}, event,this)"
                           id="${tdId}" class=unshown >
                            
                         </td>\n`
        }
        strHTML += `</tr>\n`
    }

    var elCells = document.querySelector('.cells');
    elCells.innerHTML = strHTML;
}


