class Piece {
  constructor(type, ctx, x, y, color, size) {
    this.type = type;
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.color = color;
    this.size = size;
    this.canvas = this.ctx.canvas;
    this.isActive = false;
    //this.availableSpaces = [];
  }

  updatePosition(x, y) {
    this.x = x;
    this.y = y;
    //this.availableSpaces = [];
  }
  associateSpace(i, j) {
    this.i = i;
    this.j = j;
  }

  pieceMove(newSpace, oldSpace) {
    newSpace.piece = null;
    newSpace.piece = this;
    oldSpace.piece = null;
    this.i = newSpace.i;
    this.j = newSpace.j;
    const x = (this.j - 0.5) * newSpace.width; // Adjusted x calculation
    const y = (this.i - 0.5) * newSpace.height; // Adjusted y calculation
    this.updatePosition(x, y);
    this.associateSpace(this.i, this.j);
    this.draw();
  }

  draw() {
    switch (this.type) {
      case "pawn":
        this.drawPawn();
        break;
      case "rook":
        this.drawRook();
        break;
      case "knight":
        this.drawKnight();
        break;
      case "king":
        this.drawKing();
        break;
      case "queen":
        this.drawQueen();
        break;
      case "bishop":
        this.drawBishop();
        break;
    }
  }

  drawPawn() {
    // Draw pawn body (Unicode symbol)
    this.ctx.fillStyle = this.color;
    const pawnSymbol = "\u265F"; // Unicode symbol for pawn (♟️)
    if (this.isActive) {
      this.ctx.font = this.size * 2.2 + "px Arial";
    } else {
      this.ctx.font = this.size * 1.8 + "px Arial";
    }
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(pawnSymbol, this.x, this.y);
  }
  drawKnight() {
    // Set knight color
    this.ctx.fillStyle = this.color;

    // Draw knight body (Unicode symbol)
    const knightSymbol = "\u265E"; // Unicode symbol for knight (♞)
    if (this.isActive) {
      this.ctx.font = this.size * 2.2 + "px Arial";
    } else {
      this.ctx.font = this.size * 1.8 + "px Arial";
    }
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(knightSymbol, this.x, this.y);
  }

  drawQueen() {
    // Set queen color
    this.ctx.fillStyle = this.color;

    // Draw queen body (Unicode symbol)
    const queenSymbol = "\u265B"; // Unicode symbol for queen (♛)
    if (this.isActive) {
      this.ctx.font = this.size * 2.2 + "px Arial";
    } else {
      this.ctx.font = this.size * 1.8 + "px Arial";
    }
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(queenSymbol, this.x, this.y);
  }

  drawKing() {
    // Set king color
    this.ctx.fillStyle = this.color;

    // Draw king body (Unicode symbol)
    const kingSymbol = "\u265A"; // Unicode symbol for king (♚)
    if (this.isActive) {
      this.ctx.font = this.size * 2.5 + "px Arial";
    } else {
      this.ctx.font = this.size * 2.2 + "px Arial";
    }
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(kingSymbol, this.x, this.y);
  }

  drawBishop() {
    // Set bishop color
    this.ctx.fillStyle = this.color;

    // Draw bishop body (Unicode symbol)
    const bishopSymbol = "\u265D"; // Unicode symbol for bishop (♝)
    if (this.isActive) {
      this.ctx.font = this.size * 2.2 + "px Arial";
    } else {
      this.ctx.font = this.size * 1.8 + "px Arial";
    }
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(bishopSymbol, this.x, this.y);
  }

  drawRook() {
    // Set rook color
    this.ctx.fillStyle = this.color;

    // Draw rook body (Unicode symbol)
    const rookSymbol = "\u265C"; // Unicode symbol for rook (♜)
    if (this.isActive) {
      this.ctx.font = this.size * 2 + "px Arial";
    } else {
      this.ctx.font = this.size * 1.5 + "px Arial";
    }
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(rookSymbol, this.x, this.y);
  }
}
