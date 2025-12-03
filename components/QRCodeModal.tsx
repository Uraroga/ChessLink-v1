import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { X } from 'lucide-react';

interface QRCodeModalProps {
  url: string;
  onClose: () => void;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({ url, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, url, {
        width: 256,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      }, (error) => {
        if (error) console.error(error);
      });
    }
  }, [url]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm relative animate-fade-in">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 transition-colors"
        >
          <X size={24} />
        </button>
        
        <h3 className="text-xl font-bold text-slate-900 mb-2 text-center">Codice QR Partita</h3>
        <p className="text-sm text-slate-500 text-center mb-6">
          Scansiona per aprire questa posizione su un altro dispositivo.
        </p>

        <div className="flex justify-center mb-6">
          <canvas ref={canvasRef} className="rounded-lg shadow-inner border border-slate-200"></canvas>
        </div>

        <div className="text-center">
             <button
              onClick={onClose}
              className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors w-full"
            >
              Chiudi
            </button>
        </div>
      </div>
    </div>
  );
};

export default QRCodeModal;
