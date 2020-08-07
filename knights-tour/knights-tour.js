var dimReader = document.getElementById("dimReader");
var submitButton = document.getElementById("submitButton");

var board = document.getElementById("board");

var resetButton = document.getElementById("resetButton");

var backtrackButton = document.getElementById("backtrackButton");

var completeButton = document.getElementById("completeButton");

var knightsUsedOutput = document.getElementById("output1");
var solutionsOutput = document.getElementById("output2");

var N;
/* userMoves holds the sequnece of (i,j) taken by user. */
var userMoves;
/* fullMoves holds a sequence of (i,j) starting with userMoves, finishing the tour. */
var fullMoves;
var myBoard;

const directions = [[2,1],[1,2],[-1,2],[-2,1],[-2,-1],[-1,-2],[1,-2],[2,-1]];

submitButton.onclick = function() {
	N = dimReader.value;
	if (isNaN(N) || N < 1 || N > 13 || N%1 != 0) {
		alert("N must be between 1 and 13");
		return;
	}
	generateBoard();
	userMoves=[];
	myBoard=[];
	for (var i = 0; i < N; i++) {
		var row = [];
		for (var j = 0; j < N; j++) {
			row.push(false);
		}
		myBoard.push(row);
	}
	updateOutput();
}

backtrackButton.onclick = function() {
	var lastMove = userMoves.pop();
	if (!lastMove) return;
	removeKnight(lastMove[0],lastMove[1]);
	updateOutput();
}

resetButton.onclick = function() {
	for (var i = 0; i < N; i++) {
		for (var j = 0; j < N; j++) {
			var square = document.getElementById(i+','+j);
			square.className = (i+j)%2==0 ? "whiteSquares" : "blackSquares";
			square.innerHTML = "";
			square.style.borderColor="black";
		}
		myBoard[i].fill(false);
	}
	userMoves = [];
	updateOutput();
}

completeButton.onclick = function() {
	var soFar = userMoves.length;
	var tries = 0;
	while (!warnsdorff() && tries < 10) {
		submitButton.innerHTML += tries;
		tries++;
		userMoves = userMoves.slice(0,soFar+1);
	}
	for (var x = 1; x <= N*N; x++) {
		var r = userMoves[x-1][0];
		var c = userMoves[x-1][1];
		document.getElementById(r+','+c).innerHTML = x;
	}
	updateOutput();
}

/* Generate NxN chessboard. */
function generateBoard() {
	while (board.firstChild) {
		board.removeChild(board.firstChild);
	}
	var scale = N<=6? 100 : (600/N);
	board.style.width = scale*N+"px";
	board.style.height = scale*N+"px";
	board.style.gridTemplateRows = "repeat("+N+", 1fr)";
	board.style.gridTemplateColumns = "repeat("+N+", 1fr)";
	for (var i = 0; i < N; i++) {
		for (var j = 0; j < N; j++) {
			var square = document.createElement("div");
			square.className = (i+j)%2==0 ? "whiteSquares" : "blackSquares";
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
	square.innerHTML = userMoves.length;
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
		lastSquare.style.borderColor = "black";
	}
}

/* Given that there is a knight on (r,c), remove it. */
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
	document.getElementById(r+','+c).style.borderColor = "black";
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
	}
}

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

/* -------- ! --------
All functions below this point are used to find a full Knight's Tour after "complete tour" button
is clicked.
*/

function isSafe(cBoard,r,c) {
	return r >= 0 && r < N && c >= 0 && c < N && !cBoard[r][c];
}

function updateOutput() {
	knightsUsedOutput.innerHTML = "KNIGHTS USED: "+userMoves.length+"/"+N*N;
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
	if (userMoves.length == 0) {
		var startR = Math.floor(Math.random()*N);
		var startC = Math.floor(Math.random()*parseInt(N));
		submitButton.innerHTML+=(startR+" "+startC+" "+N);
		userMoves.push([startR,startC]);
		boardCopy[startR][startC] = true;
	}
	var r = userMoves[userMoves.length-1][0];
	var c = userMoves[userMoves.length-1][1];
	for (var i = userMoves.length; i < N*N; i++) {
		if (!search(boardCopy,r,c)) return false;
		r = userMoves[userMoves.length-1][0];
		c = userMoves[userMoves.length-1][1];
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
			if (userMoves.length == N*N-1) {
				userMoves.push([r2,c2]);
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
	userMoves.push([rMin,cMin]);
	cBoard[rMin][cMin] = true;
	return true;
}

