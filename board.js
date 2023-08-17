class Board {
  constructor(board, ctx) {
    this.width = board.width;
    this.height = board.height;
    this.spaces = [];
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.selectedPiece = null;
    this.createBoard();
    this.pieceToMove = "white";
    this.canvas.addEventListener("click", (event) => this.handleClick(event));
  }

  resetBoard() {
    this.selectedPiece = null;
    this.setupInitialBoardState();
    this.pieceToMove = "white";
  }

  handleClick(event) {
    const clickedSpace = this.getSpaceByLocation(event.clientX, event.clientY);
    if (!this.selectedPiece) {
      if (clickedSpace && clickedSpace.piece) {
        this.selectedPiece = clickedSpace.piece;
        this.selectedPiece.isActive = true;
        this.reDrawBoard();
        this.selectedPiece.isActive = false;
      }
    } else {
      if (this.selectedPiece.color !== this.pieceToMove) {
        this.selectedPiece.isActive = false;
        this.selectedPiece = null;
        this.reDrawBoard();
      } else {
        if (clickedSpace) {
          //If you click on the same space twice, deactivate the piece
          const oldSpace = this.getSpaceByPiece(this.selectedPiece);
          if (clickedSpace.piece) {
            if (
              clickedSpace === oldSpace ||
              clickedSpace.piece.color === this.selectedPiece.color
            ) {
              this.selectedPiece.isActive = false;
              this.selectedPiece = null;
              this.reDrawBoard();
            } else {
              if (this.selectedPiece.availableSpaces.includes(clickedSpace)) {
                this.selectedPiece.pieceMove(clickedSpace, oldSpace);
                this.selectedPiece.hasMoved = true;
                this.switchPieceToMove();
                this.selectedPiece = null;
                this.reDrawBoard();
              }
              this.selectedPiece = null;
            }
          } else {
            if (this.selectedPiece.availableSpaces.includes(clickedSpace)) {
              this.switchPieceToMove();
              this.selectedPiece.pieceMove(clickedSpace, oldSpace);
              if (this.selectedPiece.type === "king") {
                if (clickedSpace.j === oldSpace.j + 2) {
                  this.selectedPiece.hasCastled = true;
                  let rookSpace = this.getSpaceByIJ(oldSpace.i, oldSpace.j + 3);
                  let rook = rookSpace.piece;
                  let targetRookSpace = this.getSpaceByIJ(
                    oldSpace.i,
                    oldSpace.j + 1
                  );
                  rook.pieceMove(targetRookSpace, rookSpace);
                  this.selectedPiece = rook;
                  this.reDrawBoard();
                }
                if (clickedSpace.j === oldSpace.j - 2) {
                  //Logic for queenside castling
                  this.selectedPiece.hasCastled = true;
                  let rookSpace = this.getSpaceByIJ(oldSpace.i, oldSpace.j - 4);
                  let rook = rookSpace.piece;
                  let targetRookSpace = this.getSpaceByIJ(
                    oldSpace.i,
                    oldSpace.j - 1
                  );
                  rook.pieceMove(targetRookSpace, rookSpace);
                  this.selectedPiece = rook;
                  this.reDrawBoard();
                }
              }
              this.selectedPiece.hasMoved = true;
              this.selectedPiece = null;
              this.reDrawBoard();
            } else {
              this.selectedPiece = null;
              this.reDrawBoard();
            }
          }
        }
      }
    }
  }

  switchPieceToMove() {
    if (this.pieceToMove === "white") {
      this.pieceToMove = "black";
    } else {
      this.pieceToMove = "white";
    }
  }

  showAvailableSpaces() {
    const selectedSpace = this.getSpaceByPiece(this.selectedPiece);
    let availableOffsets = [];
    let diagonalOffsets = [];
    let straightOffsets = [];
    if (this.selectedPiece) {
      switch (this.selectedPiece.type) {
        case "pawn":
          const forwardOffset = [];
          const captureOffsets = [];

          if (this.selectedPiece.color === "white") {
            forwardOffset.push({ i: -1, j: 0 });
            if (this.selectedPiece.i === 7) {
              forwardOffset.push({ i: -2, j: 0 });
            }
            captureOffsets.push({ i: -1, j: -1 });
            captureOffsets.push({ i: -1, j: 1 });
          } else {
            // Black pawn
            forwardOffset.push({ i: 1, j: 0 });
            if (this.selectedPiece.i === 2) {
              forwardOffset.push({ i: 2, j: 0 });
            }
            captureOffsets.push({ i: 1, j: -1 });
            captureOffsets.push({ i: 1, j: 1 });
          }

          const initialSpace = this.getSpaceByPiece(this.selectedPiece);

          // Check forward movement
          for (const offset of forwardOffset) {
            const targetI = initialSpace.i + offset.i;
            const targetJ = initialSpace.j + offset.j;

            const targetSpace = this.getSpaceByIJ(targetI, targetJ);

            if (targetSpace && !targetSpace.piece) {
              this.selectedPiece.availableSpaces.push(targetSpace);
              this.ctx.fillStyle = "rgba(0, 255, 0, 0.2)";
              this.ctx.fillRect(
                (targetSpace.j - 1) * targetSpace.width,
                (targetSpace.i - 1) * targetSpace.height,
                targetSpace.width,
                targetSpace.height
              );
            }
          }

          // Check for capturing diagonally
          for (const captureOffset of captureOffsets) {
            const targetI = initialSpace.i + captureOffset.i;
            const targetJ = initialSpace.j + captureOffset.j;

            const targetSpace = this.getSpaceByIJ(targetI, targetJ);

            if (
              targetSpace &&
              targetSpace.piece &&
              targetSpace.piece.color !== this.selectedPiece.color
            ) {
              this.selectedPiece.availableSpaces.push(targetSpace);
              this.ctx.fillStyle = "rgba(0, 255, 0, 0.2)";
              this.ctx.fillRect(
                (targetSpace.j - 1) * targetSpace.width,
                (targetSpace.i - 1) * targetSpace.height,
                targetSpace.width,
                targetSpace.height
              );
            }
          }
          break;

        case "knight":
          //Movement Logic for a knight
          availableOffsets = [
            { i: -2, j: -1 },
            { i: -2, j: 1 },
            { i: -1, j: -2 },
            { i: -1, j: 2 },
            { i: 1, j: -2 },
            { i: 1, j: 2 },
            { i: 2, j: -1 },
            { i: 2, j: 1 },
          ];
          for (const offset of availableOffsets) {
            const targetI = selectedSpace.i + offset.i;
            const targetJ = selectedSpace.j + offset.j;

            const targetSpace = this.getSpaceByIJ(targetI, targetJ);

            if (targetSpace) {
              if (targetSpace.piece !== null) {
                if (targetSpace.piece.color !== this.selectedPiece.color) {
                  this.selectedPiece.availableSpaces.push(targetSpace);
                  // Add a green glow to the available spaces
                  //this.selectedPiece.availableSpaces.push(targetSpace);
                  this.ctx.fillStyle = "rgba(0, 255, 0, 0.2)";
                  this.ctx.fillRect(
                    (targetSpace.j - 1) * targetSpace.width,
                    (targetSpace.i - 1) * targetSpace.height,
                    targetSpace.width,
                    targetSpace.height
                  );
                }
              } else {
                // Add a green glow to the available spaces
                this.selectedPiece.availableSpaces.push(targetSpace);
                this.ctx.fillStyle = "rgba(0, 255, 0, 0.2)";
                this.ctx.fillRect(
                  (targetSpace.j - 1) * targetSpace.width,
                  (targetSpace.i - 1) * targetSpace.height,
                  targetSpace.width,
                  targetSpace.height
                );
              }
            }
          }
          break;
        case "bishop":
          // Movement Logic for a bishop (diagonal movement)
          diagonalOffsets = [
            { i: -1, j: -1 }, // Up-left
            { i: -1, j: 1 }, // Up-right
            { i: 1, j: -1 }, // Down-left
            { i: 1, j: 1 }, // Down-right
          ];

          for (const offset of diagonalOffsets) {
            let targetI = selectedSpace.i + offset.i;
            let targetJ = selectedSpace.j + offset.j;

            while (
              targetI >= 1 &&
              targetI <= 8 &&
              targetJ >= 0 &&
              targetJ <= 8
            ) {
              const targetSpace = this.getSpaceByIJ(targetI, targetJ);

              if (targetSpace) {
                if (!targetSpace.piece) {
                  this.selectedPiece.availableSpaces.push(targetSpace);
                  this.ctx.fillStyle = "rgba(0, 255, 0, 0.2)";
                  this.ctx.fillRect(
                    (targetSpace.j - 1) * targetSpace.width,
                    (targetSpace.i - 1) * targetSpace.height,
                    targetSpace.width,
                    targetSpace.height
                  );
                } else if (
                  targetSpace.piece.color !== this.selectedPiece.color
                ) {
                  this.selectedPiece.availableSpaces.push(targetSpace);
                  this.ctx.fillStyle = "rgba(0, 255, 0, 0.2)";
                  this.ctx.fillRect(
                    (targetSpace.j - 1) * targetSpace.width,
                    (targetSpace.i - 1) * targetSpace.height,
                    targetSpace.width,
                    targetSpace.height
                  );
                  break; // Stop if capturing an opponent's piece
                } else {
                  break; // Stop if blocking by own piece
                }
              }

              targetI += offset.i;
              targetJ += offset.j;
            }
          }
          break;
        case "queen":
          // Movement Logic for a queen (combining rook and bishop logic)
          diagonalOffsets = [
            { i: -1, j: -1 },
            { i: -1, j: 1 },
            { i: 1, j: -1 },
            { i: 1, j: 1 },
          ];

          straightOffsets = [
            { i: -1, j: 0 },
            { i: 1, j: 0 },
            { i: 0, j: -1 },
            { i: 0, j: 1 },
          ];

          // Diagonal movement
          for (const offset of diagonalOffsets) {
            let targetI = selectedSpace.i + offset.i;
            let targetJ = selectedSpace.j + offset.j;

            while (
              targetI >= 1 &&
              targetI <= 8 &&
              targetJ >= 0 &&
              targetJ <= 8
            ) {
              const targetSpace = this.getSpaceByIJ(targetI, targetJ);
              if (targetSpace) {
                if (!targetSpace.piece) {
                  this.selectedPiece.availableSpaces.push(targetSpace);
                  this.ctx.fillStyle = "rgba(0, 255, 0, 0.2)";
                  this.ctx.fillRect(
                    (targetSpace.j - 1) * targetSpace.width,
                    (targetSpace.i - 1) * targetSpace.height,
                    targetSpace.width,
                    targetSpace.height
                  );
                } else if (
                  targetSpace.piece.color !== this.selectedPiece.color
                ) {
                  this.selectedPiece.availableSpaces.push(targetSpace);
                  this.ctx.fillStyle = "rgba(0, 255, 0, 0.2)";
                  this.ctx.fillRect(
                    (targetSpace.j - 1) * targetSpace.width,
                    (targetSpace.i - 1) * targetSpace.height,
                    targetSpace.width,
                    targetSpace.height
                  );
                  break; // Stop checking in this direction after encountering an opposing piece
                } else {
                  break; // Stop checking in this direction if blocked by own piece
                }
              }

              targetI += offset.i;
              targetJ += offset.j;
            }
          }

          // Straight movement
          for (const offset of straightOffsets) {
            let targetI = selectedSpace.i + offset.i;
            let targetJ = selectedSpace.j + offset.j;

            while (
              targetI >= 1 &&
              targetI <= 8 &&
              targetJ >= 0 &&
              targetJ <= 8
            ) {
              const targetSpace = this.getSpaceByIJ(targetI, targetJ);
              if (targetSpace) {
                if (!targetSpace.piece) {
                  this.selectedPiece.availableSpaces.push(targetSpace);
                  this.ctx.fillStyle = "rgba(0, 255, 0, 0.2)";
                  this.ctx.fillRect(
                    (targetSpace.j - 1) * targetSpace.width,
                    (targetSpace.i - 1) * targetSpace.height,
                    targetSpace.width,
                    targetSpace.height
                  );
                } else if (
                  targetSpace.piece.color !== this.selectedPiece.color
                ) {
                  this.selectedPiece.availableSpaces.push(targetSpace);
                  this.ctx.fillStyle = "rgba(0, 255, 0, 0.2)";
                  this.ctx.fillRect(
                    (targetSpace.j - 1) * targetSpace.width,
                    (targetSpace.i - 1) * targetSpace.height,
                    targetSpace.width,
                    targetSpace.height
                  );
                  break; // Stop checking in this direction after encountering an opposing piece
                } else {
                  break; // Stop checking in this direction if blocked by own piece
                }
              }

              targetI += offset.i;
              targetJ += offset.j;
            }
          }

          break;

        case "rook":
          // Straight movement
          straightOffsets = [
            { i: -1, j: 0 },
            { i: 1, j: 0 },
            { i: 0, j: -1 },
            { i: 0, j: 1 },
          ];
          for (const offset of straightOffsets) {
            let targetI = selectedSpace.i + offset.i;
            let targetJ = selectedSpace.j + offset.j;

            while (
              targetI >= 1 &&
              targetI <= 8 &&
              targetJ >= 0 &&
              targetJ <= 8
            ) {
              const targetSpace = this.getSpaceByIJ(targetI, targetJ);
              if (targetSpace) {
                if (!targetSpace.piece) {
                  this.selectedPiece.availableSpaces.push(targetSpace);
                  this.ctx.fillStyle = "rgba(0, 255, 0, 0.2)";
                  this.ctx.fillRect(
                    (targetSpace.j - 1) * targetSpace.width,
                    (targetSpace.i - 1) * targetSpace.height,
                    targetSpace.width,
                    targetSpace.height
                  );
                } else if (
                  targetSpace.piece.color !== this.selectedPiece.color
                ) {
                  this.selectedPiece.availableSpaces.push(targetSpace);
                  this.ctx.fillStyle = "rgba(0, 255, 0, 0.2)";
                  this.ctx.fillRect(
                    (targetSpace.j - 1) * targetSpace.width,
                    (targetSpace.i - 1) * targetSpace.height,
                    targetSpace.width,
                    targetSpace.height
                  );
                  break; // Stop checking in this direction after encountering an opposing piece
                } else {
                  break; // Stop checking in this direction if blocked by own piece
                }
              }

              targetI += offset.i;
              targetJ += offset.j;
            }
          }

          break;

        case "king":
          // Movement Logic for a king
          availableOffsets = [
            { i: -1, j: -1 },
            { i: -1, j: 1 },
            { i: 1, j: -1 },
            { i: 1, j: 1 },
            { i: 1, j: 0 },
            { i: 0, j: 1 },
            { i: -1, j: 0 },
            { i: 0, j: -1 },
          ];

          for (const offset of availableOffsets) {
            const targetI = selectedSpace.i + offset.i;
            const targetJ = selectedSpace.j + offset.j;

            const targetSpace = this.getSpaceByIJ(targetI, targetJ);

            if (targetSpace) {
              if (targetSpace.piece !== null) {
                if (targetSpace.piece.color !== this.selectedPiece.color) {
                  this.selectedPiece.availableSpaces.push(targetSpace);
                  this.ctx.fillStyle = "rgba(0, 255, 0, 0.2)";
                  this.ctx.fillRect(
                    (targetSpace.j - 1) * targetSpace.width,
                    (targetSpace.i - 1) * targetSpace.height,
                    targetSpace.width,
                    targetSpace.height
                  );
                }
              } else {
                this.selectedPiece.availableSpaces.push(targetSpace);
                this.ctx.fillStyle = "rgba(0, 255, 0, 0.2)";
                this.ctx.fillRect(
                  (targetSpace.j - 1) * targetSpace.width,
                  (targetSpace.i - 1) * targetSpace.height,
                  targetSpace.width,
                  targetSpace.height
                );
              }
            }
          }
          // KingSide Castling Logic
          // Simple for now, if no pieces in between, and king and rook have not moved,
          // Light up i + 2 square, if clicked, move rook to i, king to i + 1
          if (this.selectedPiece.hasCastled === false) {
            let rookSpace = this.getSpaceByIJ(
              selectedSpace.i,
              selectedSpace.j + 3
            );

            if (
              this.selectedPiece.hasMoved === false &&
              rookSpace.piece !== null &&
              rookSpace.piece.type === "rook" &&
              rookSpace.piece.color === this.selectedPiece.color &&
              rookSpace.piece.hasMoved === false
            ) {
              let emptySpaces = true;
              for (let i = selectedSpace.j + 1; i <= selectedSpace.j + 2; i++) {
                const space = this.getSpaceByIJ(selectedSpace.i, i);
                if (space.piece !== null) {
                  emptySpaces = false;
                  break;
                }
              }

              if (emptySpaces) {
                // Light up the space for castling
                const castleSpace = this.getSpaceByIJ(
                  selectedSpace.i,
                  selectedSpace.j + 2
                );
                this.selectedPiece.availableSpaces.push(castleSpace);
                this.ctx.fillStyle = "rgba(0, 255, 0, 0.2)";
                this.ctx.fillRect(
                  (castleSpace.j - 1) * castleSpace.width,
                  (castleSpace.i - 1) * castleSpace.height,
                  castleSpace.width,
                  castleSpace.height
                );
              }
            }
          }

          // QueenSide Castling Logic
          if (this.selectedPiece.hasCastled === false) {
            let rookSpace = this.getSpaceByIJ(
              selectedSpace.i,
              selectedSpace.j - 4
            );

            console.log(rookSpace);

            if (
              this.selectedPiece.hasMoved === false &&
              rookSpace.piece !== null &&
              rookSpace.piece.type === "rook" &&
              rookSpace.piece.color === this.selectedPiece.color &&
              rookSpace.piece.hasMoved === false
            ) {
              let emptySpaces = true;
              for (let i = selectedSpace.j - 1; i >= selectedSpace.j - 3; i--) {
                const space = this.getSpaceByIJ(selectedSpace.i, i);
                if (space.piece !== null) {
                  emptySpaces = false;
                  break;
                }
              }

              if (emptySpaces) {
                // Light up the space for castling
                const castleSpace = this.getSpaceByIJ(
                  selectedSpace.i,
                  selectedSpace.j - 2
                );
                this.selectedPiece.availableSpaces.push(castleSpace);
                this.ctx.fillStyle = "rgba(0, 255, 0, 0.2)";
                this.ctx.fillRect(
                  (castleSpace.j - 1) * castleSpace.width,
                  (castleSpace.i - 1) * castleSpace.height,
                  castleSpace.width,
                  castleSpace.height
                );
              }
            }
          }

          break;
      }
    }
  }

  getSpaceByLocation(x, y) {
    // Calculate the offset of the click relative to the canvas position
    const canvasRect = this.canvas.getBoundingClientRect();
    const offsetX = x - canvasRect.left;
    const offsetY = y - canvasRect.top;

    // Calculate the row (i) and column (j) based on the offset
    const i = Math.floor(offsetY / (this.height / 8)) + 1;
    const j = Math.floor(offsetX / (this.width / 8)) + 1;

    // Find and return the space associated with the calculated coordinates
    for (const space of this.spaces) {
      if (space.i === i && space.j === j) {
        return space;
      }
    }
    // Return null if no space is found
    return null;
  }

  createBoard() {
    for (let i = 1; i <= 8; i++) {
      for (let j = 1; j <= 8; j++) {
        let color =
          (i + j) % 2 === 0 ? "rgb(220,190,130)" : "rgb(150, 100, 50)"; //light dark
        const space = new Space(
          color,
          this.width / 8,
          this.height / 8,
          i,
          j,
          ctx,
          ""
        );
        this.spaces.push(space);
      }
    }
  }
  setupInitialBoardState() {
    for (let i = 0; i < this.spaces.length; i++) {
      let color = "";
      let pieceType = "";
      if (i < 16) {
        color = "black";
      } else {
        color = "white";
      }
      if (i < 16 || i > 47) {
        if (i > 7 && i < 16) {
          pieceType = "pawn";
        }
        if (i > 47 && i < 56) {
          pieceType = "pawn";
        }
        if (i === 4 || i === 60) {
          pieceType = "king";
        }
        if (i === 0 || i === 7 || i === 56 || i === 63) {
          pieceType = "rook";
        }
        if (i === 1 || i === 6 || i === 57 || i === 62) {
          pieceType = "knight";
        }
        if (i === 2 || i === 5 || i === 58 || i === 61) {
          pieceType = "bishop";
        }
        if (i === 3 || i === 59) {
          pieceType = "queen";
        }

        const space = this.spaces[i];

        const piece = new Piece(
          pieceType,
          this.ctx,
          0,
          0,
          color,
          space.width / 2
        );
        space.associatePiece(piece);
        const x = (space.j - 0.5) * space.width; // Adjusted x calculation
        const y = (space.i - 0.5) * space.height; // Adjusted y calculation
        piece.updatePosition(x, y);
        piece.draw(); // Draw the piece after updating its position
      }
    }
  }

  getSpaceByPiece(piece) {
    for (const space of this.spaces) {
      if (space.piece === piece) {
        return space;
      }
    }
    return null;
  }

  getSpaceByIJ(i, j) {
    for (const space of this.spaces) {
      if (space.i === i && space.j === j) {
        return space;
      }
    }
    // Return null if no space is found
    return null;
  }

  drawBoard() {
    for (const space of this.spaces) {
      this.ctx.fillStyle = space.color;
      this.ctx.fillRect(
        (space.j - 1) * space.width,
        (space.i - 1) * space.height,
        space.width,
        space.height
      );
    }
  }
  reDrawBoard() {
    for (const space of this.spaces) {
      this.ctx.fillStyle = space.color;
      this.ctx.fillRect(
        (space.j - 1) * space.width,
        (space.i - 1) * space.height,
        space.width,
        space.height
      );
    }

    for (const space of this.spaces) {
      if (space.piece) {
        space.piece.draw();
      }
    }
    this.showAvailableSpaces();
  }

  // Check if a specific space is under attack by any opponent's piece
  isUnderAttack(space) {
    for (const opponentSpace of this.spaces) {
      const opponentPiece = opponentSpace.piece;
      if (
        opponentPiece &&
        opponentPiece.color !== this.pieceToMove && // Opponent's color
        opponentPiece.type !== "king" // Exclude the king as we don't want to consider it
      ) {
        this.selectedPiece = opponentPiece;
        this.showAvailableSpaces(); // Show available spaces for the opponent's piece
        if (opponentPiece.availableSpaces.includes(space)) {
          this.selectedPiece = null;
          return true; // The space is under attack
        }
      }
    }
    this.selectedPiece = null;
    return false; // The space is not under attack
  }

  // Check if the current player's king is in check
  isInCheck() {
    // Find the current player's king
    for (const space of this.spaces) {
      const piece = space.piece;
      if (piece && piece.type === "king" && piece.color === this.pieceToMove) {
        this.selectedPiece = piece;
        this.showAvailableSpaces(); // Show available spaces for the king
        const kingSpace = this.getSpaceByPiece(piece);

        // Check if the king's space is under attack
        const isCheck = this.isUnderAttack(kingSpace);
        this.selectedPiece = null;
        return isCheck;
      }
    }
    return false; // The king is not found (shouldn't happen in a valid chess position)
  }
}
