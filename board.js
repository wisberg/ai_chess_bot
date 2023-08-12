class Board {
  constructor(board) {
    this.width = board.width;
    this.height = board.height;
    this.spaces = [];
    this.createBoard();
  }

  createBoard() {
    for (let i = 1; i <= 8; i++) {
      for (let j = 1; j <= 8; j++) {
        let color = (i + j) % 2 === 0 ? "black" : "rgb(162, 122, 68)";
        const space = new Space(color, this.width / 8, this.height / 8, i, j);
        this.spaces.push(space);
      }
    }
  }

  drawBoard(ctx) {
    for (const space of this.spaces) {
      ctx.fillStyle = space.color;
      ctx.fillRect(
        (space.j - 1) * space.width,
        (space.i - 1) * space.height,
        space.width,
        space.height
      );
    }
  }
}
