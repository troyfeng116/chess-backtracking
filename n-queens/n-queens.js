var dimReader = document.getElementById("dimReader");
var submitButton = document.getElementById("submitButton");

var board = document.getElementById("board");

var resetButton = document.getElementById("resetButton");

var backtrackButton = document.getElementById("backtrackButton");

var queensUsedOutput = document.getElementById("output1");
var solutionsOutput = document.getElementById("output2");

var N;
/* Moves holds the sequnece of (i,j) taken by user. */
var moves;
/* rowHasQueen[i] is true if i'th row of board has queen. */
var rowHasQueen;
/* myBoard will be a NxN array of ints. myBoard[i][j] = 0 if no queens attacking (i,j), 1 if at
least 1 queen attacking (i,j), and 2 if queen is on (i,j). */
var myBoard;

const directions = [[1,1],[1,0],[1,-1],[0,1],[0,-1],[-1,1],[-1,0],[-1,-1]];

submitButton.onclick = function() {
	N = dimReader.value;
	if (isNaN(N) || N < 1 || N > 10 || N%1 != 0) {
		alert("N must be between 1 and 10");
		return;
	}
	generateBoard();
	moves=[];
	rowHasQueen=[];
	myBoard=[];
	for (var i = 0; i < N; i++) {
		var row = [];
		for (var j = 0; j < N; j++) {
			row.push(0);
		}
		myBoard.push(row);
	} 
	updateOutput();
}

resetButton.onclick = function() {
	for (var i = 0; i < N; i++) {
		for (var j = 0; j < N; j++) {
			resetSquare(i,j);
		}
		myBoard[i].fill(0);
	}
	moves = [];
	rowHasQueen=[];
	updateOutput();
}

backtrackButton.onclick = function() {
	var pos = moves.pop();
	if (!pos) return;
	removeQueen(pos[0],pos[1]);
	updateOutput();
}

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
			square.id=i+""+j;
			board.appendChild(square);
		}
	}
	setSquareClicks();
}

function setSquareClicks() {
	for (var i = 0; i < N; i++) {
		for (var j = 0; j < N; j++) {
			let x = i, y = j;
			document.getElementById(x+""+y).onclick = function() {
				placeQueen(x,y);
				updateOutput();
			}
		}
	}
}

function resetSquare(row,col) {
	var square = document.getElementById(row+""+col);
	square.className = (row+col)%2==0 ? "whiteSquares" : "blackSquares";
	square.innerHTML = "";
	myBoard[row][col] = 0;
	rowHasQueen[row] = false;
}

function placeQueen(row,col) {
	if (myBoard[row][col] > 0) return;
	var square = document.getElementById(row+""+col);
	square.innerHTML = "Q";
	myBoard[row][col] = 2;
	rowHasQueen[row] = true;
	for (var dist = 1; dist < N; dist++) {
		for (var d = 0; d < 8; d++) {
			var i = row + dist*(directions[d][0]);
			var j = col + dist*(directions[d][1]);
			if (i>=0 && i<N && j>=0 && j<N && myBoard[i][j] == 0) {
				document.getElementById(i+""+j).className+=" unavailable";
				myBoard[i][j] = 1;
			}
		}
	}
	moves.push([row,col]);
}

function removeQueen(row,col) {
	resetSquare(row,col);
	rowHasQueen[row] = false;
	for (var dist = 1; dist < N; dist++) {
		for (var d = 0; d < 8; d++) {
			var i = row + dist*(directions[d][0]);
			var j = col + dist*(directions[d][1]);
			if (i>=0 && i<N && j>=0 && j<N && isSafe(i,j)) resetSquare(i,j);
		}
	}
}

/* Return true if no queen is on or attacking (row,col). */
function isSafe(row,col) {
	if (myBoard[row][col] == 2) return false;
	for (var dist = 1; dist < N; dist++) {
		for (var d = 0; d < 8; d++) {
			var i = row + dist*(directions[d][0]);
			var j = col + dist*(directions[d][1]);
			if (i>=0 && i<N && j>=0 && j<N && myBoard[i][j] == 2) return false;
		}
	}
	return true;
}

function updateOutput() {
	queensUsedOutput.innerHTML = "QUEENS USED: "+moves.length+"/"+N;
	solutionsOutput.innerHTML = "POSSIBLE SOLUTIONS: "+numSolutionsLeft();
}

/* Return number of ways to complete board using myBoard. */
function numSolutionsLeft() {
	return 0;
}
