var dimReader = document.getElementById("dimReader");
var submitButton = document.getElementById("submitButton");

var board = document.getElementById("board");

var resetButton = document.getElementById("resetButton");

var backtrackButton = document.getElementById("backtrackButton");

var N;
var moves;
/* myBoard will be a NxN array of ints. myBoard[i][j] = 0 if no queens attacking (i,j), 1 if at
least 1 queen attacking (i,j), and 2 if queen is on (i,j). */
var myBoard;

submitButton.onclick = function() {
	N = dimReader.value;
	if (isNaN(N) || N < 1 || N > 10 || N%1 != 0) {
		alert("N must be between 1 and 10");
		return;
	}
	generateBoard();
	moves=[];
	myBoard=[];
	for (var i = 0; i < N; i++) {
		var row = [];
		for (var j = 0; j < N; j++) {
			row.push(0);
		}
		myBoard.push(row);
	}
}

resetButton.onclick = function() {
	for (var i = 0; i < N; i++) {
		for (var j = 0; j < N; j++) {
			resetSquare(i,j);
		}
		myBoard[i].fill(0);
	}
}

backtrackButton.onclick = function() {
	var pos = moves.pop();
	if (!pos) return;
	removeQueen(pos[0],pos[1]);
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
			}
		}
	}
}

function resetSquare(row,col) {
	var square = document.getElementById(row+""+col);
	square.className = (row+col)%2==0 ? "whiteSquares" : "blackSquares";
	square.innerHTML = "";
	myBoard[row][col] = 0;
}

function placeQueen(row,col) {
	if (myBoard[row][col] > 0) return;
	var square = document.getElementById(row+""+col);
	square.innerHTML = "Q";
	myBoard[row][col] = 2;
	for (var i = 0; i < N; i++) {
		if (i != row && myBoard[i][col] == 0) {
			document.getElementById(i+""+col).className+=" unavailable";
			myBoard[i][col] = 1;
		}
		if (i != col && myBoard[row][i] == 0) {
			document.getElementById(row+""+i).className+=" unavailable";
			myBoard[row][i] = 1;
		}
	}
	for (var i = 1; i < N; i++) {
		if (row+i < N) {
			if (col+i < N && myBoard[row+i][col+i] == 0) {
				document.getElementById((row+i)+""+(col+i)).className+=" unavailable";
				myBoard[row+i][col+i] = 1;
			}
			if (col-i >= 0 && myBoard[row+i][col-i] == 0) {
				document.getElementById((row+i)+""+(col-i)).className+=" unavailable";
				myBoard[row+i][col-i] = 1;
			}
		}
		if (row-i >= 0) {
			if (col+i < N && myBoard[row-i][col+i] == 0) {
				document.getElementById((row-i)+""+(col+i)).className+=" unavailable";
				myBoard[row-i][col+i] = 1;
			}
			if (col-i >= 0 && myBoard[row-i][col-i] == 0) {
				document.getElementById((row-i)+""+(col-i)).className+=" unavailable";
				myBoard[row-i][col-i] = 1;
			}
		}
	}
	moves.push([row,col]);
}

function removeQueen(row,col) {
	resetSquare(row,col);
	for (var i = 0; i < N; i++) {
		if (i != row && isSafe(i,col)) resetSquare(i,col);
		if (i != col && isSafe(row,i)) resetSquare(row,i);
	}
	for (var i = 1; i < N; i++) {
		if (row+i < N) {
			if (col+i < N && isSafe(row+i,col+i)) resetSquare(row+i,col+i);
			if (col-i >= 0 && isSafe(row+i,col-i)) resetSquare(row+i,col-i);
		}
		if (row-i >= 0) {
			if (col+i < N && isSafe(row-i,col+i)) resetSquare(row-i,col+i);
			if (col-i >= 0 && isSafe(row-i,col-i)) resetSquare(row-i,col-i);
		}
	}
}

/* Return true if no queen is on or attacking (row,col). */
function isSafe(row,col) {
	if (myBoard[row][col] == 2) return false;
	for (var i = 0; i < N; i++) {
		if (i != row && myBoard[i][col] == 2) return false;
		if (i != col && myBoard[row][i] == 2) return false;
	}
	for (var i = 1; i < N; i++) {
		if (row+i < N) {
			if (col+i < N && myBoard[row+i][col+i] == 2) return false;
			if (col-i >= 0 && myBoard[row+i][col-i] == 2) return false;
		}
		if (row-i >= 0) {
			if (col+i < N && myBoard[row-i][col+i] == 2) return false;
			if (col-i >= 0 && myBoard[row-i][col-i] == 2) return false;
		}
	}
	return true;
}

