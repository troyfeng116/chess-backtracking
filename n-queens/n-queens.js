var dimReader = document.getElementById("dimReader");
var submitButton = document.getElementById("submitButton");

var board = document.getElementById("board");

var N;
var squares;

submitButton.onclick = function() {
	N = dimReader.value;
	if (isNaN(N) || N < 1 || N > 10 || N%1 != 0) {
		alert("N must be between 1 and 10");
		return;
	}
	generateBoard();
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
			if ((i+j)%2 == 0) square.className="whiteSquares";
			else square.className="blackSquares";
			square.id=i+""+j;
			board.appendChild(square);
		}
	}
	setSquareFunctions();
}

function setSquareFunctions() {
	for (var i = 0; i < N; i++) {
		for (var j = 0; j < N; j++) {
			let x = i, y = j;
			document.getElementById(x+""+y).onclick = function() {
				squareClicked(x,y);
			}
		}
	}
}

function squareClicked(row,col) {
	var square = document.getElementById(row+""+col);
	if (square.className.search("unavailable") >= 0) return;
	square.innerHTML = "Q";
	for (var i = 0; i < N; i++) {
		if (i != row) document.getElementById(i+""+col).className+=" unavailable";
		if (i != col) document.getElementById(row+""+i).className+=" unavailable";
	}
	for (var i = 1; i < N; i++) {
		if (row+i < N) {
			if (col+i < N) document.getElementById((row+i)+""+(col+i)).className+=" unavailable";
			if (col-i >= 0) document.getElementById((row+i)+""+(col-i)).className+=" unavailable";
		}
		if (row-i >= 0) {
			if (col+i < N) document.getElementById((row-i)+""+(col+i)).className+=" unavailable";
			if (col-i >= 0) document.getElementById((row-i)+""+(col-i)).className+=" unavailable";
		}
	}
}

