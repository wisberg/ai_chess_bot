const boardCanvas = document.getElementById("board");
boardCanvas.width = 500;
boardCanvas.height = 500;

const ctx = boardCanvas.getContext("2d");

const board = new Board(boardCanvas);
board.drawBoard(ctx);

const pawn = new Piece("pawn", 10, 10, "white", ctx);
pawn.draw();
