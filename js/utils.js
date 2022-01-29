'use strict';

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

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
var interval;
//Define vars to hold time values
var displaySeconds = 0;

//Define var to hold stopwatch status
var status = "stopped";

//Stopwatch function (logic to determine when to increment next value, etc.)
function stopWatch() {

  gGame.secPassed++;

  //If millisec/seconds/minutes are only one digit, add a leading 0 to the value
  if (gGame.secPassed < 10) {
    displaySeconds = "00" + gGame.secPassed.toString();
  } else if (gGame.secPassed < 100) {
    displaySeconds = "0" + gGame.secPassed.toString();
  } else if(gGame.secPassed<1000) {
    displaySeconds = gGame.secPassed;
  }else stopTimer()

  //Display updated time values to user
  document.getElementById("display").innerHTML = displaySeconds;

}

// start and stop the timer
function startTimer() {
  //Start the stopwatch (by calling the setInterval() function)
  status = "started";
  interval = window.setInterval(stopWatch, 1000);
}

function stopTimer() {
  window.clearInterval(interval);
  status = "stopped";
}

//Function to reset the stopwatch
function resetTimer() {
  window.clearInterval(interval);
  gGame.secPassed = 0;
  document.getElementById("display").innerHTML = "000";
}


function contains(number, digit) {
  if (number < 0) { // make sure negatives are dealt with properly, alternatively replace this if statement with number = Math.abs(number)
      number *= -1;
  }
  if (number == digit) { // this is to deal with the number=0, digit=0 edge case
      return true;
  }
  while (number != 0) { // stop once all digits are cut off
      if (number % 10 === digit) { // check if the last digit matches
          return true;
      }
      number = Math.floor(number / 10); // cut off the last digit
  }
  return false;
}

function indexOfObject(array, value) {
  for (var i = 0; i < array.length; i++) {
      if (array[i].i === value.i && array[i].j === value.j) return i;
  }
  return -1;
}





