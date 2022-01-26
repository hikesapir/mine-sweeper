'use strict';

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// function renderCell(selector, value) {
//   // Select the elCell and set the value
//   // console.log(selector);
//   // var elCell = document.querySelector(selector);
//   // console.log(elCell);
//   cell.innerHTML = value;
// }

function printMat(mat, selector) {
  var strHTML = '';
  for (var i = 0; i < mat.length; i++) {
    strHTML += `<tr class="row" >\n`
    for (var j = 0; j < mat[0].length; j++) {
      var tdId = `cell-${i}-${j}`
      strHTML += `\t<td onmousedown="cellClicked(this, event, ${i}, ${j})"
      id="'${tdId}'" >
       sapir
    </td>\n`
    }
    strHTML += `</tr>\n`
  }
  strHTML += '</tbody></table>';
  var elContainer = document.querySelector(selector);
  elContainer.innerHTML = strHTML;
}



//Define var to hold setInterval() function
var interval = null;
//Define vars to hold time values
var seconds = 0;
var displaySeconds = 0;

//Define var to hold stopwatch status
var status = "stopped";

//Stopwatch function (logic to determine when to increment next value, etc.)
function stopWatch() {

  seconds++;

  //If millisec/seconds/minutes are only one digit, add a leading 0 to the value
  if (seconds < 10) {
    displaySeconds = "00" + seconds.toString();
  } else if (seconds < 100) {
    displaySeconds = "0" + seconds.toString();
  } else {
    displaySeconds = seconds;
  }

  //Display updated time values to user
  document.getElementById("display").innerHTML = displaySeconds;

}

// start and stop the timer
function startTimer() {
  //Start the stopwatch (by calling the setInterval() function)
  interval = window.setInterval(stopWatch, 1000);
  status = "started";
}

function stopTimer() {
  window.clearInterval(interval);
  status = "stopped";
}

//Function to reset the stopwatch
function resetTimer() {
  window.clearInterval(interval);
  seconds = 0;
  document.getElementById("display").innerHTML = "000";
}