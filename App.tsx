import React, { useState, useEffect } from 'react';
import { Chess, Square as ChessSquare } from 'chess.js';
import { QrCode, Check, Share2, Move as MoveIcon } from 'lucide-react';
import ChessPiece from './components/ChessPiece';
import QRCodeModal from './components/QRCodeModal';
import GameOverModal from './components/GameOverModal';
import { FILES, RANKS } from './constants';
import { PieceType, PieceColor } from './types';

// Helper to get FEN from URL
const getInitialFen = () => {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    return params.get('fen');
  }
  return null;
};

const App: React.FC = () => {
  const [game, setGame] = useState<Chess>(new Chess());
  const [fen, setFen] = useState<string>(game.fen());
  const [draggedPiece, setDraggedPiece] = useState<{ square: string } | null>(null);
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [validMoves, setValidMoves] = useState<string[]>([]);
  const [showQR, setShowQR] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string>('');
  const [copied, setCopied] = useState(false);
  
  // Game Status
  const [isCheck, setIsCheck] = useState(false);
  const [turn, setTurn] = useState<'w' | 'b'>('w');
  const [gameResult, setGameResult] = useState<{ winner: 'w' | 'b' | 'draw' | null, reason: string } | null>(null);

  // Initialize from URL if present
  useEffect(() => {
    const initialFen = getInitialFen();
    if (initialFen) {
      try {
        const newGame = new Chess(initialFen);
        setGame(newGame);
        updateGameState(newGame);
      } catch (e) {
        console.error("Invalid FEN provided", e);
      }
    }
  }, []);

  const updateGameState = (gameInstance: Chess) => {
    setFen(gameInstance.fen());
    setTurn(gameInstance.turn());
    setIsCheck(gameInstance.inCheck());
    
    // Reset selection
    setSelectedSquare(null);
    setValidMoves([]);

    // Check for Game Over
    if (gameInstance.isGameOver()) {
      let winner: 'w' | 'b' | 'draw' | null = null;
      let reason = '';

      if (gameInstance.isCheckmate()) {
        winner = gameInstance.turn() === 'w' ? 'b' : 'w'; // If white is moving and checkmated, black wins
        reason = 'Scacco Matto';
      } else if (gameInstance.isDraw()) {
        winner = 'draw';
        if (gameInstance.isStalemate()) reason = 'Stallo';
        else if (gameInstance.isThreefoldRepetition()) reason = 'Ripetizione';
        else if (gameInstance.isInsufficientMaterial()) reason = 'Materiale insufficiente';
        else reason = 'Patta d\'accordo';
      }

      setGameResult({ winner, reason });
    } else {
      setGameResult(null);
    }
  };

  const handleDragStart = (e: React.DragEvent, square: string) => {
    if (game.isGameOver()) {
      e.preventDefault();
      return;
    }

    // Only allow dragging if it's that color's turn
    const piece = game.get(square as ChessSquare);
    if (!piece || piece.color !== game.turn()) {
      e.preventDefault();
      return;
    }
    setDraggedPiece({ square });
    
    // Highlight valid moves for dragging too
    const moves = game.moves({ square: square as ChessSquare, verbose: true });
    setValidMoves(moves.map(m => m.to));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetSquare: string) => {
    e.preventDefault();
    if (game.isGameOver()) return;

    if (draggedPiece) {
      makeMove(draggedPiece.square, targetSquare);
      setDraggedPiece(null);
    }
  };

  const handleSquareClick = (square: string) => {
    if (game.isGameOver()) return;

    // If clicking the same square, deselect
    if (selectedSquare === square) {
      setSelectedSquare(null);
      setValidMoves([]);
      return;
    }

    // If clicking a valid move square, execute move
    if (selectedSquare && validMoves.includes(square)) {
      makeMove(selectedSquare, square);
      return;
    }

    // Selecting a piece
    const piece = game.get(square as ChessSquare);
    if (piece && piece.color === game.turn()) {
      setSelectedSquare(square);
      const moves = game.moves({ square: square as ChessSquare, verbose: true });
      setValidMoves(moves.map(m => m.to));
    } else {
      setSelectedSquare(null);
      setValidMoves([]);
    }
  };

  const makeMove = (from: string, to: string) => {
    try {
      // Create a copy to attempt move
      const tempGame = new Chess(game.fen());
      const move = tempGame.move({
        from: from as ChessSquare,
        to: to as ChessSquare,
        promotion: 'q', // Always promote to queen for simplicity in this demo
      });

      if (move) {
        // If valid, update real state
        setGame(tempGame);
        updateGameState(tempGame);
        setCopied(false); 
      }
    } catch (error) {
      console.warn("Invalid move", error);
    }
  };

  const generateLink = () => {
    let baseUrl = window.location.href.split('?')[0];
    const url = `${baseUrl}?fen=${encodeURIComponent(fen)}`;
    setGeneratedLink(url);
    return url;
  };

  const handleCopyLink = () => {
    const url = generateLink();
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleShowQR = () => {
    generateLink();
    setShowQR(true);
  };

  const resetGame = (confirmReset = true) => {
    if (confirmReset && !confirm("Sei sicuro di voler ricominciare?")) {
      return;
    }
    
    // 1. Create completely new instance
    const newGame = new Chess();
    
    // 2. Set the game state FIRST
    setGame(newGame);
    
    // 3. Update all derived states using the consistent helper
    updateGameState(newGame);
    
    // 4. Reset UI specific local states
    setDraggedPiece(null);
    setSelectedSquare(null);
    setGeneratedLink('');
    setCopied(false);
    
    // 5. Clear URL params visually and in history
    // Wrapped in try/catch because pushState can fail on file:// protocol in some browsers
    if (typeof window !== 'undefined') {
      try {
        const url = new URL(window.location.href);
        url.search = "";
        window.history.pushState({}, '', url.toString());
      } catch (e) {
        console.warn("Could not update URL history (likely running locally without server):", e);
      }
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen py-8 px-4 max-w-4xl mx-auto">
      
      {/* Header */}
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight flex items-center justify-center gap-2">
           <MoveIcon className="w-8 h-8 text-emerald-400" />
           ChessLink
        </h1>
        <p className="text-slate-400">Gioca in remoto senza server. Condividi il link.</p>
      </header>

      {/* Game Status Bar */}
      <div className="w-full max-w-[480px] bg-slate-800 rounded-xl p-4 mb-6 shadow-xl border border-slate-700 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className={`w-4 h-4 rounded-full ${turn === 'w' ? 'bg-white' : 'bg-black border border-slate-500'}`}></div>
          <span className="font-medium text-slate-200">
             Tocca al {turn === 'w' ? 'Bianco' : 'Nero'}
          </span>
        </div>
        <div>
          {gameResult && <span className="text-red-400 font-bold px-3 py-1 bg-red-900/30 rounded-full text-sm animate-pulse">FINE PARTITA</span>}
          {!gameResult && isCheck && <span className="text-amber-400 font-bold px-3 py-1 bg-amber-900/30 rounded-full text-sm">SCACCO</span>}
        </div>
      </div>

      {/* Chess Board */}
      <div className="relative p-2 bg-slate-700 rounded-lg shadow-2xl mb-8">
        <div className="grid grid-cols-8 border-4 border-slate-600 rounded select-none">
          {RANKS.map((rank, rankIndex) => (
            FILES.map((file, fileIndex) => {
              const square = `${file}${rank}`;
              const isDark = (rankIndex + fileIndex) % 2 !== 0;
              const piece = game.get(square as ChessSquare);
              const isSelected = selectedSquare === square;
              const isLastMove = game.history({ verbose: true }).slice(-1)[0]?.to === square || 
                                 game.history({ verbose: true }).slice(-1)[0]?.from === square;
              const isValidMove = validMoves.includes(square);
              const isKingInCheck = isCheck && piece?.type === 'k' && piece?.color === turn;

              return (
                <div
                  key={square}
                  className={`
                    w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center relative
                    ${isDark ? 'bg-slate-600' : 'bg-slate-300'}
                    ${isSelected ? 'ring-inset ring-4 ring-emerald-500' : ''}
                    ${isLastMove ? 'after:absolute after:inset-0 after:bg-yellow-400/30' : ''}
                    ${isKingInCheck ? 'bg-red-500/50 radial-gradient-red' : ''}
                  `}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, square)}
                  onClick={() => handleSquareClick(square)}
                >
                  {/* Rank/File Notation */}
                  {fileIndex === 0 && (
                    <span className={`absolute top-0.5 left-0.5 text-[10px] font-bold leading-none ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {rank}
                    </span>
                  )}
                  {rankIndex === 7 && (
                    <span className={`absolute bottom-0.5 right-1 text-[10px] font-bold leading-none ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {file}
                    </span>
                  )}

                  {/* Move Highlight Dot */}
                  {isValidMove && !piece && (
                     <div className="w-3 h-3 sm:w-4 sm:h-4 bg-black/20 rounded-full"></div>
                  )}
                  {isValidMove && piece && (
                     <div className="absolute inset-0 ring-inset ring-4 ring-black/10 rounded-full"></div>
                  )}

                  {piece && (
                    <div
                      draggable={!gameResult}
                      onDragStart={(e) => handleDragStart(e, square)}
                      className={`w-full h-full p-0.5 sm:p-1 z-10 ${!gameResult ? 'cursor-grab active:cursor-grabbing hover:scale-105 transition-transform' : 'cursor-default'}`}
                    >
                      <ChessPiece type={piece.type as PieceType} color={piece.color as PieceColor} />
                    </div>
                  )}
                </div>
              );
            })
          ))}
        </div>
        
        {/* Game Over Overlay for Board (optional subtle effect) */}
        {gameResult && (
          <div className="absolute inset-0 bg-slate-900/10 pointer-events-none rounded-lg"></div>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap justify-center gap-4 w-full max-w-[480px]">
        <button
          onClick={handleCopyLink}
          disabled={!!gameResult}
          className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-all shadow-lg 
            ${gameResult 
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
              : 'bg-emerald-600 hover:bg-emerald-500 text-white active:scale-95 shadow-emerald-900/20'}`}
        >
          {copied ? <Check size={20} /> : <Share2 size={20} />}
          {copied ? 'Copiato!' : 'Copia Link'}
        </button>

        <button
          onClick={handleShowQR}
           disabled={!!gameResult}
          className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-all shadow-lg
            ${gameResult 
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-500 text-white active:scale-95 shadow-indigo-900/20'}`}
        >
          <QrCode size={20} />
          Genera QR
        </button>
      </div>

      <div className="mt-8 text-slate-500 text-sm max-w-md text-center">
        <p>Invia il link al tuo avversario. Quando fanno una mossa e ti mandano il nuovo link, aggiorna la pagina.</p>
      </div>

      {showQR && (
        <QRCodeModal url={generatedLink} onClose={() => setShowQR(false)} />
      )}

      {gameResult && (
        <GameOverModal 
          winner={gameResult.winner} 
          reason={gameResult.reason} 
          onRestart={() => resetGame(false)} 
        />
      )}
    </div>
  );
};

export default App;