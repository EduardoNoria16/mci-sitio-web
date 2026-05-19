import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download } from 'lucide-react';
import { getProxiedImageUrl } from '../utils/image';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  url: string; // Keep this prop in case it's passed somewhere, or we can ignore it
}

export default function QRCodeModal({ isOpen, onClose }: Props) {
  const qrImageUrl = 'https://images2.imgbox.com/9e/31/2zovlJIh_o.png';

  const downloadQR = async () => {
    try {
      const response = await fetch(getProxiedImageUrl(qrImageUrl));
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      const downloadLink = document.createElement('a');
      downloadLink.href = blobUrl;
      downloadLink.download = 'MCI_Tarjeta_QR.png';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
    } catch (error) {
      console.error("Error downloading image:", error);
      // Fallback
      window.open(qrImageUrl, '_blank');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-slate-900 border border-white/10 rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl flex flex-col items-center gap-6"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center space-y-2 mt-4">
              <h3 className="text-xl font-black text-white">Tarjeta Digital MCI</h3>
              <p className="text-sm text-slate-400">Escanea o descarga este código QR para agregarlo a tus tarjetas de presentación o compartirlo.</p>
            </div>

            <div className="p-4 bg-white rounded-2xl shadow-inner cursor-pointer" onClick={downloadQR}>
              <img 
                src={getProxiedImageUrl(qrImageUrl)} 
                alt="Código QR de MCI" 
                className="w-[220px] h-[220px] object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            <button 
              onClick={downloadQR}
              className="w-full flex items-center justify-center gap-2 py-3 bg-brand-orange hover:bg-[#d97220] text-white font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-brand-orange/20 cursor-pointer"
            >
              <Download className="w-5 h-5" />
              Descargar Código QR
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
