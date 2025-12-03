import React from 'react';
import { Trophy, AlertCircle, RotateCcw } from 'lucide-react';

interface GameOverModalProps {
  winner: 'w' | 'b' | 'draw' | null;
  reason: string;
  onRestart: () => void;
}

const GameOverModal: React.FC<GameOverModalProps> = ({ winner, reason, onRestart }) => {
  const isDraw = winner === 'draw';
  const winnerText = winner === 'w' ? 'Il Bianco' : 'Il Nero';
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-8 w-full max-w-sm text-center transform scale-100 transition-all">
        
        <div className="flex justify-center mb-6">
          {isDraw ? (
            <div className="p-4 bg-slate-800 rounded-full">
              <AlertCircle size={48} className="text-slate-400" />
            </div>
          ) : (
            <div className="p-4 bg-amber-500/20 rounded-full relative">
              <Trophy size={48} className="text-amber-400" />
              <div className="absolute -top-1 -right-1 text-2xl animate-bounce">👑</div>
            </div>
          )}
        </div>

        <h2 className="text-3xl font-bold text-white mb-2">
          {isDraw ? 'Partita Patta!' : 'Vittoria!'}
        </h2>
        
        <p className="text-lg text-slate-300 mb-6">
          {isDraw ? reason : `${winnerText} vince per ${reason.toLowerCase()}`}
        </p>

        <button
          onClick={onRestart}
          className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-emerald-900/30"
        >
          <RotateCcw size={20} />
          Nuova Partita
        </button>
      </div>
    </div>
  );
};

export default GameOverModal;