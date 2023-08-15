class Space {
  constructor(color, width, height, i, j, ctx) {
    this.color = color;
    this.width = width;
    this.height = height;
    this.i = i;
    this.j = j;
    this.ctx = ctx;
    this.piece = null;
  }

  associatePiece(piece) {
    this.piece = piece;
    piece.associateSpace(this.i, this.j);
  }
}
