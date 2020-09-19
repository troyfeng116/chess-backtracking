var dimReader = document.getElementById("dimReader");
var submitButton = document.getElementById("submitButton");

var board = document.getElementById("board");

var resetButton = document.getElementById("resetButton");

var backtrackButton = document.getElementById("backtrackButton");

var completeContainer = document.getElementById("completeContainer");
var completeButton = document.getElementById("completeButton");

var speedSlider = document.getElementById("speedSlider");
var speedOutput = document.getElementById("speedOutput");
var stopButton = document.getElementById("stopButton");

var outputContainer = document.getElementById("outputContainer");
var knightsUsedOutput = document.getElementById("output1");
var solutionsOutput = document.getElementById("output2");

var N;
var squareDim;
/* userMoves holds the sequnece of (i,j) taken by user. */
var userMoves;
/* fullMoves holds a sequence of (i,j) starting with userMoves, finishing the tour. */
var fullMoves;
/* Store the step speed, in ms. */
var stepSpeed = 1000;
/* If stop, then we stop the delayed knight placement in complete board feature. */
let stop = true;
var myBoard;

const directions = [[2,1],[1,2],[-1,2],[-2,1],[-2,-1],[-1,-2],[1,-2],[2,-1]];

submitButton.onclick = function() {
	stop = true;
	N = dimReader.value;
	if (isNaN(N) || N < 1 || N > 13 || N%1 != 0) {
		alert("N must be between 1 and 13");
		return;
	}
	generateBoard();
	userMoves=[];
	fullMoves=[];
	myBoard=[];
	for (var i = 0; i < N; i++) {
		var row = [];
		for (var j = 0; j < N; j++) {
			row.push(false);
		}
		myBoard.push(row);
	}
	updateOutput();
	board.style.visibility = "visible";
	resetButton.style.visibility = "visible";
	backtrackButton.style.visibility = "visible";
	completeContainer.style.visibility = "visible";
	outputContainer.style.visibility = "visible";
}

backtrackButton.onclick = function() {
	stop = true;
	if (isNaN(N)) return;
	var lastMove = userMoves.pop();
	if (!lastMove) return;
	removeKnight(lastMove[0],lastMove[1]);
	updateOutput();
}

resetButton.onclick = function() {
	stop = true;
	if (isNaN(N)) return;
	for (var i = 0; i < N; i++) {
		for (var j = 0; j < N; j++) {
			var square = document.getElementById(i+','+j);
			square.className = (i+j)%2==0 ? "whiteSquares" : "blackSquares";
			square.innerHTML = "";
			square.style.borderColor="white";
		}
		myBoard[i].fill(false);
	}
	userMoves = [];
	updateOutput();
}

speedSlider.oninput = function() {
	speedOutput.innerHTML = "SPEED: " + this.value/1000 + "s";
	stepSpeed = this.value;
}

completeButton.onclick = function() {
	stop = false;
	if (isNaN(N)) return;
	if (fullMoves.length != N*N) {
		updateOutput();
		return;
	}
	var start = Math.max(userMoves.length+1,1);
	counter = start;
	delayCompleteTour();
}

/* Loop through fullMoves and place knights, with delay. */
var counter;
function delayCompleteTour() {
	setTimeout(function() {
		if (stop) return;
		placeKnight(fullMoves[counter-1][0],fullMoves[counter-1][1]);
		counter++;
		if (counter <= N*N) {
			delayCompleteTour();
		}
	}, stepSpeed);
}

stopButton.onclick = function() {
	stop = true;
}

/* Generate NxN chessboard. */
function generateBoard() {
	while (board.firstChild) {
		board.removeChild(board.firstChild);
	}
	squareDim = N<=6? 100 : (600/N);
	board.style.width = squareDim*N+"px";
	board.style.height = squareDim*N+"px";
	board.style.gridTemplateRows = "repeat("+N+", 1fr)";
	board.style.gridTemplateColumns = "repeat("+N+", 1fr)";
	for (var i = 0; i < N; i++) {
		for (var j = 0; j < N; j++) {
			var square = document.createElement("div");
			square.className = (i+j)%2==0 ? "whiteSquares" : "blackSquares";
			square.style.lineHeight = squareDim-2+"px";
			square.style.fontSize=squareDim*.50+"px";
			square.id=i+','+j;
			board.appendChild(square);
		}
	}
	setSquareClicks();
}

/* Set onclick attributes of each square on the board. */
function setSquareClicks() {
	for (var i = 0; i < N; i++) {
		for (var j = 0; j < N; j++) {
			let x = i, y = j;
			document.getElementById(x+','+y).onclick = function() {
				stop = true;
				placeKnight(x,y);
				updateOutput();
			}
		}
	}
}

function placeKnight(r,c) {
	if (!reachable(r,c)) return;
	if (userMoves.length != 0) {
		var previousMove = userMoves[userMoves.length-1];
		for (var i = 0; i < 8; i++) {
			var r2 = previousMove[0]+directions[i][0];
			var c2 = previousMove[1]+directions[i][1];
			if (reachable(r2,c2)) {
				document.getElementById(r2+','+c2).className = (r2+c2)%2==0? "whiteSquares" : "blackSquares";
			}
		}
	}
	var square = document.getElementById(r+','+c);
	myBoard[r][c] = true;
	userMoves.push([r,c]);
	addKnightImg(r,c);
	square.style.borderColor = "red";
	for (var i = 0; i < 8; i++) {
		var r2 = r+directions[i][0];
		var c2 = c+directions[i][1];
		if (reachable(r2,c2)) {
			document.getElementById(r2+','+c2).className += " reachable";
		}
	}
	if (userMoves.length > 1) {
		var secondLastMove = userMoves[userMoves.length-2];
		var lastSquare = document.getElementById(secondLastMove[0]+','+secondLastMove[1]);
		lastSquare.style.borderColor = "white";
		lastSquare.innerHTML = userMoves.length-1;
	}
	updateOutput();
}

/* Given that there is a knight on (r,c), remove it (backtrack). */
function removeKnight(r,c) {
	/* Temporarily place a knight at (r,c) and add (r,c) to userMoves for reachable function. */
	myBoard[r][c] = true;
	userMoves.push([r,c]);
	for (var i = 0; i < 8; i++) {
		var r2 = r+directions[i][0];
		var c2 = c+directions[i][1];
		if (reachable(r2,c2)) {
			document.getElementById(r2+','+c2).className = (r2+c2)%2==0? "whiteSquares" : "blackSquares";
		}
	}
	myBoard[r][c] = false;
	userMoves.pop();
	document.getElementById(r+','+c).innerHTML = "";
	document.getElementById(r+','+c).style.borderColor = "white";
	if (userMoves.length != 0) {
		var previousMove = userMoves[userMoves.length-1];
		for (var i = 0; i < 8; i++) {
			var r2 = previousMove[0]+directions[i][0];
			var c2 = previousMove[1]+directions[i][1];
			if (reachable(r2,c2)) {
				document.getElementById(r2+','+c2).className += " reachable";
			}
		}
		document.getElementById(previousMove[0]+','+previousMove[1]).style.borderColor = "red";
		document.getElementById(previousMove[0]+','+previousMove[1]).innerHTML="";
		addKnightImg(previousMove[0],previousMove[1]);
	}
}

/* Return true if (r,c) is reachable from last user move. */
function reachable(r,c) {
	if (r < 0 || r >= N || c < 0 || c >= N) return false;
	if (userMoves.length == 0) return true;
	if (myBoard[r][c]) return false;
	var lastMove = userMoves[userMoves.length-1];
	for (var i = 0; i < 8; i++) {
		if (r+directions[i][0] == lastMove[0] && c+directions[i][1] == lastMove[1]) {
			return true;
		}
	}
	return false;
}

/* Append knight image to square (r,c). */
function addKnightImg(r,c) {
	var img = document.createElement("i");
	img.className="fas fa-chess-knight";
	img.id=userMoves.length;
	document.getElementById(r+','+c).appendChild(img);
}

/* -------- ! --------
All functions below this point are used to find a full Knight's Tour from the user's moves so far
to display whether there is a Knight's Tour in real time.
*/

function isSafe(cBoard,r,c) {
	return r >= 0 && r < N && c >= 0 && c < N && !cBoard[r][c];
}

/* Display number of knights used so far (userMoves length) and calculate full tour based on
userMoves. */
function updateOutput() {
	var soFar = userMoves.length;
	knightsUsedOutput.innerHTML = soFar+"/"+N*N;
	if (soFar == N*N || !stop) {
		return;
	}
	solutionsOutput.innerHTML = findFullTour()? "YES" : "NO";
}

function findFullTour() {
	fullMoves = userMoves.slice(0);
	var tries = 0;
	while (!warnsdorff() && tries < 20) {
		tries++;
		fullMoves = userMoves.slice(0);
	}
	return tries < 20;
}

/* Return number of available moves from (r,c). */
function getDegree(cBoard,r,c) {
	var count = 0;
	for (var i = 0; i < 8; i++) {
		var r2 = r+directions[i][0];
		var c2 = c+directions[i][1];
		if (isSafe(cBoard,r2,c2)) count++;
	}
	return count;
}

function warnsdorff() {
	var boardCopy = [];
	for (var i = 0; i < N; i++) {
		var row = [];
		for (var j = 0; j < N; j++) {
			row.push(myBoard[i][j]);
		}
		boardCopy.push(row);
	}
	if (fullMoves.length == 0) {
		var startR = Math.floor(Math.random()*N);
		var startC = Math.floor(Math.random()*parseInt(N));
		fullMoves.push([startR,startC]);
		boardCopy[startR][startC] = true;
	}
	var r = fullMoves[fullMoves.length-1][0];
	var c = fullMoves[fullMoves.length-1][1];
	for (var i = fullMoves.length; i < N*N; i++) {
		if (!search(boardCopy,r,c)) return false;
		r = fullMoves[fullMoves.length-1][0];
		c = fullMoves[fullMoves.length-1][1];
	}
	return true;
}

function search(cBoard, r,c) {
	var minDir = -1;
	var minDegree = 9;
	var start = Math.floor(Math.random()*(9));
	for (var i = start; i < start+8; i++) {
		var r2 = r+directions[i%8][0];
		var c2 = c+directions[i%8][1];
		if (isSafe(cBoard, r2, c2)) {
			if (fullMoves.length == N*N-1) {
				fullMoves.push([r2,c2]);
				cBoard[r2][c2] = true;
				return true;
			}
			var deg = getDegree(cBoard, r2,c2);
			if (deg > 0 && deg < minDegree) {
				minDegree = deg;
				minDir = i%8;
			}
		}
	}
	if (minDir == -1) return false;
	var rMin = r+directions[minDir][0];
	var cMin = c+directions[minDir][1]
	fullMoves.push([rMin,cMin]);
	cBoard[rMin][cMin] = true;
	return true;
}

