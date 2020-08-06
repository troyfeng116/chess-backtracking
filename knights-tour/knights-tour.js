var dimReader = document.getElementById("dimReader");
var submitButton = document.getElementById("submitButton");

var board = document.getElementById("board");

var resetButton = document.getElementById("resetButton");

var backtrackButton = document.getElementById("backtrackButton");

var knightsUsedOutput = document.getElementById("output1");
var solutionsOutput = document.getElementById("output2");

var N;
/* Moves holds the sequnece of (i,j) taken by user. */
var moves;
var myBoard;

const directions = [[2,1],[2,-1],[1,2],[1,-2],[-1,2],[-1,-2],[-2,1],[-2,-1]];

submitButton.onclick = function() {
	N = dimReader.value;
	if (isNaN(N) || N < 1 || N > 13 || N%1 != 0) {
		alert("N must be between 1 and 13");
		return;
	}
	generateBoard();
	moves=[];
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
	var lastMove = moves.pop();
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
		}
		myBoard[i].fill(false);
	}
	moves = [];
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
	if (moves.length != 0) {
		var previousMove = moves[moves.length-1];
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
	moves.push([r,c]);
	square.innerHTML = "K";
	for (var i = 0; i < 8; i++) {
		var r2 = r+directions[i][0];
		var c2 = c+directions[i][1];
		if (reachable(r2,c2)) {
			document.getElementById(r2+','+c2).className += " reachable";
		}
	}
}

/* Given that there is a knight on (r,c), remove it. */
function removeKnight(r,c) {
	/* Temporarily place a knight at (r,c) and add (r,c) to moves for reachable function. */
	myBoard[r][c] = true;
	moves.push([r,c]);
	for (var i = 0; i < 8; i++) {
		var r2 = r+directions[i][0];
		var c2 = c+directions[i][1];
		if (reachable(r2,c2)) {
			document.getElementById(r2+','+c2).className = (r2+c2)%2==0? "whiteSquares" : "blackSquares";
		}
	}
	myBoard[r][c] = false;
	moves.pop();
	document.getElementById(r+','+c).innerHTML = "";
	if (moves.length != 0) {
		var previousMove = moves[moves.length-1];
		for (var i = 0; i < 8; i++) {
			var r2 = previousMove[0]+directions[i][0];
			var c2 = previousMove[1]+directions[i][1];
			if (reachable(r2,c2)) {
				document.getElementById(r2+','+c2).className += " reachable";
			}
		}
	}
}

function reachable(r,c) {
	if (r < 0 || r >= N || c < 0 || c >= N) return false;
	if (moves.length == 0) return true;
	if (myBoard[r][c]) return false;
	var lastMove = moves[moves.length-1];
	for (var i = 0; i < 8; i++) {
		if (r+directions[i][0] == lastMove[0] && c+directions[i][1] == lastMove[1]) {
			return true;
		}
	}
	return false;
}

function updateOutput() {
	knightsUsedOutput.innerHTML = "KNIGHTS USED: "+moves.length+"/"+N*N;
}
