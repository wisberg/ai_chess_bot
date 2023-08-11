const boardCanvas = document.getElementById("board");
boardCanvas.width = 500;
boardCanvas.height = 500;

const ctx = boardCanvas.getContext("2d");

const board = new Board(boardCanvas);
board.drawBoard(ctx);
