class Space {
  constructor(color, width, height, i, j, ctx, pieceType = null) {
    this.color = color;
    this.width = width;
    this.height = height;
    this.i = i;
    this.j = j;
    this.ctx = ctx;
    this.pieceType = pieceType;
    this.piece = null;
  }

  associatePiece(piece) {
    this.piece = piece;
  }
}
