import React from 'react';
import { PieceColor, PieceType } from '../types';

interface ChessPieceProps {
  type: PieceType;
  color: PieceColor;
  className?: string;
}

const ChessPiece: React.FC<ChessPieceProps> = ({ type, color, className = '' }) => {
  const isWhite = color === 'w';
  const fill = isWhite ? '#f8fafc' : '#1e293b'; // slate-50 and slate-800
  const stroke = isWhite ? '#1e293b' : '#f8fafc';

  // SVG Paths for pieces
  const getPiecePath = () => {
    switch (type) {
      case 'p': // Pawn
        return (
          <g transform="translate(9, 9) scale(0.6)">
             <path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" stroke={stroke} fill={fill} strokeWidth="2"/>
          </g>
        );
      case 'r': // Rook
        return (
          <g transform="translate(9, 9) scale(0.6)">
            <path d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5" stroke={stroke} fill={fill} strokeWidth="2" strokeLinecap="round"/>
            <path d="M34 14l-3 3H14l-3-3" stroke={stroke} fill={fill} strokeWidth="2" strokeLinecap="round"/> 
            <path d="M31 17v12.5H14V17" stroke={stroke} fill={fill} strokeWidth="2" strokeLinecap="round"/>
            <path d="M31 29.5l1.5 2.5h-20l1.5-2.5" stroke={stroke} fill={fill} strokeWidth="2" strokeLinecap="round"/>
            <path d="M11 14h23" stroke={stroke} fill="none" strokeWidth="2" strokeLinecap="round"/>
          </g>
        );
      case 'n': // Knight
        return (
          <g transform="translate(9, 9) scale(0.6)">
             <path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" stroke={stroke} fill={fill} strokeWidth="2"/>
             <path d="M24 18c.38 2.32-2.41 2.97-2.97 2.97H21c1.92 1.25 5.86 2.44 6 7" stroke={stroke} fill={fill} strokeWidth="2" strokeLinecap="round"/>
             <path d="M9.5 19c-1.7-1.3-4-2.8-4-6.3C5.5 6 15 1.5 19 1.5V6l-3.5 1" stroke={stroke} fill={fill} strokeWidth="2" strokeLinecap="round"/>
          </g>
        );
      case 'b': // Bishop
        return (
           <g transform="translate(9, 9) scale(0.6)">
             <g fill={fill} stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" />
                <path d="M22 14c-1.2 0-2.3.8-2.7 1.9"/>
                <path d="M25 18l-5-5"/>
             </g>
           </g>
        );
      case 'q': // Queen
        return (
            <g transform="translate(9, 9) scale(0.6)">
                <path d="M8 12l5.5 8 5-7 4.5 7 5-7 5.5 8h-25" stroke={stroke} fill={fill} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 26c8.5-1.5 21-1.5 27 0l2 12H7l2-12z" stroke={stroke} fill={fill} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 26c0 0 1.5-4 2.5-4 1 0 1.5 2 2.5 4 1-2 2-4 3-4s2 2 3 4c1-2 2-4 3-4s1.5 4 2.5 4" stroke={stroke} fill="none" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="6" cy="12" r="2" fill={fill} stroke={stroke} strokeWidth="2"/>
                <circle cx="13" cy="9" r="2" fill={fill} stroke={stroke} strokeWidth="2"/>
                <circle cx="22.5" cy="8" r="2" fill={fill} stroke={stroke} strokeWidth="2"/>
                <circle cx="32" cy="9" r="2" fill={fill} stroke={stroke} strokeWidth="2"/>
                <circle cx="39" cy="12" r="2" fill={fill} stroke={stroke} strokeWidth="2"/>
            </g>
        );
      case 'k': // King
        return (
           <g transform="translate(9, 9) scale(0.6)">
              <path d="M22.5 11.63V6M20 8h5" stroke={stroke} fill="none" strokeWidth="2" strokeLinecap="round"/>
              <path d="M22.5 25s4.5-7.5 3-10c-1.5-2.5-6-2.5-6 0-1.5 2.5 3 10 3 10" stroke={stroke} fill={fill} strokeWidth="2" strokeLinecap="round"/>
              <path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-8-12.5-5.5-16.5-1 .5-4.5-8.5-7-12.5 1-3 6 6 10.5 6 10.5v7z" stroke={stroke} fill={fill} strokeWidth="2" strokeLinecap="round"/>
              <path d="M11.5 30c5.5-3 15.5-3 21 0M11.5 33.5c5.5-3 15.5-3 21 0M11.5 37c5.5-3 15.5-3 21 0" stroke={stroke} fill="none" strokeWidth="2" strokeLinecap="round"/>
           </g>
        );
      default:
        return null;
    }
  };

  return (
    <svg viewBox="0 0 45 45" className={`w-full h-full drop-shadow-lg ${className}`}>
      {getPiecePath()}
    </svg>
  );
};

export default ChessPiece;
