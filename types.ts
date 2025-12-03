export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
export type PieceColor = 'w' | 'b';

export interface Piece {
  type: PieceType;
  color: PieceColor;
}

export interface BoardSquare {
  square: string;
  type: PieceType;
  color: PieceColor;
}

// Coordinate system usually handled by chess.js strings (e.g., 'a1', 'h8')
export type Square = string; 
