var dimReader = document.getElementById("dimReader");
var submitButton = document.getElementById("submitButton");

var board = document.getElementById("board");

var resetButton = document.getElementById("resetButton");

var backtrackButton = document.getElementById("backtrackButton");

var queensUsedOutput = document.getElementById("output1");
var solutionsOutput = document.getElementById("output2");

var N;
var squareDim;
/* Moves holds the sequnece of (i,j) taken by user. */
var moves;
/* rowHasQueen[i] is true if i'th row of board has queen. */
var rowHasQueen;
/* myBoard will be a NxN array of ints. myBoard[i][j] = 0 if no queens attacking (i,j), 1 if at
least 1 queen attacking (i,j), and 2 if queen is on (i,j). */
var myBoard;

const directions = [[1,1],[1,0],[1,-1],[0,1],[0,-1],[-1,1],[-1,0],[-1,-1]];
/* Precalculated solutions to N queens problem for 1 <= N <= 13 (to allow for larger inputs without
significant lag) */
const precalculated = [0,0,0,0,2,10,4,40,92,352,724,2680,14200,73712];

submitButton.onclick = function() {
	N = dimReader.value;
	if (isNaN(N) || N < 1 || N > 13 || N%1 != 0) {
		alert("N must be between 1 and 13");
		return;
	}
	generateBoard();
	moves=[];
	rowHasQueen=[];
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

resetButton.onclick = function() {
	for (var i = 0; i < N; i++) {
		for (var j = 0; j < N; j++) {
			resetSquare(i,j);
		}
		myBoard[i].fill(false);
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
				if (!isSafe(x,y)) return;
				placeQueen(x,y);
				updateOutput();
			}
		}
	}
}

/* Completely reset square. Only happens if this square is now safe. */
function resetSquare(row,col) {
	var square = document.getElementById(row+','+col);
	square.className = (row+col)%2==0 ? "whiteSquares" : "blackSquares";
	square.innerHTML = "";
	myBoard[row][col] = false;
	rowHasQueen[row] = false;
}

/* Given that it's safe to do so, place queen at (row,col). */
function placeQueen(row,col) {
	var square = document.getElementById(row+','+col);
	var img = document.createElement("i");
	img.className="fas fa-chess-queen";
	img.style.fontSize=squareDim*.50+"px";
	img.style.lineHeight=squareDim*.9+"px";
	square.appendChild(img);
	myBoard[row][col] = true;
	rowHasQueen[row] = true;
	for (var dist = 1; dist < N; dist++) {
		for (var d = 0; d < 8; d++) {
			var i = row + dist*(directions[d][0]);
			var j = col + dist*(directions[d][1]);
			if (i>=0 && i<N && j>=0 && j<N && !myBoard[i][j]) {
				document.getElementById(i+','+j).className+=" unavailable";
			}
		}
	}
	moves.push([row,col]);
}

/* Given that there is a queen at (row,col), remove it. */
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

/* Update output container with #queens used and #solutions left. */
function updateOutput() {
	queensUsedOutput.innerHTML = "QUEENS USED: "+moves.length+"/"+N;
	solutionsOutput.innerHTML = "POSSIBLE SOLUTIONS: "+numSolutionsLeft();
}

/* Return true if no queen is on or attacking (row,col). */
function isSafe(row,col) {
	if (myBoard[row][col]) return false;
	for (var dist = 1; dist < N; dist++) {
		for (var d = 0; d < 8; d++) {
			var i = row + dist*(directions[d][0]);
			var j = col + dist*(directions[d][1]);
			if (i>=0 && i<N && j>=0 && j<N && myBoard[i][j]) return false;
		}
	}
	return true;
}

/* Return number of ways to complete current board. Use precalculated values if board empty (i.e.
original N queens problem). */
function numSolutionsLeft() {
	if (moves.length == 0) return precalculated[N];
	return backtrack(0);
}

/* Auxiliary backtracking function: for each safe spot in row, place queen, recurse, and backtrack. */
function backtrack(row) {
	if (row == N) return 1;
	if (rowHasQueen[row]) return backtrack(row+1);
	var ans = 0;
	for (var col = 0; col < N; col++) {
		if (isSafe(row,col)) {
			rowHasQueen[row] = true;
			myBoard[row][col] = true;
			ans += backtrack(row+1);
			rowHasQueen[row] = false;
			myBoard[row][col] = false;
		}
	}
	return ans;
}
