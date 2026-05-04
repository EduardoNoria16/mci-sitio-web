import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Maximize2 } from 'lucide-react';

export interface PhotoPair {
  id: string;
  title: string;
  description: string;
  before: string;
  after: string;
}

interface Props {
  pairs: PhotoPair[];
  className?: string;
}

const BeforeAfterCard = ({ pair, onClick }: { pair: PhotoPair; onClick: () => void }) => (
  <div 
    className="relative w-[75vw] sm:w-[400px] md:w-[450px] lg:w-[500px] aspect-[4/3] flex cursor-pointer group shrink-0 rounded-2xl md:rounded-3xl overflow-hidden shadow-xl hover:shadow-[0_20px_50px_rgba(245,130,32,0.2)] border border-white/10 transition-all duration-500"
    onClick={onClick}
  >
    {/* Mitad Antes */}
    <div className="relative w-1/2 h-full overflow-hidden">
      <img src={pair.before} alt="Antes" className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-110" draggable={false} />
      <div className="absolute inset-0 bg-black/10 transition-colors duration-500" />
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 px-3 py-1.5 sm:px-4 sm:py-2 bg-black/60 backdrop-blur-md text-white/90 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] rounded-full shadow-lg border border-white/10 z-10 transition-transform duration-300 group-hover:-translate-y-1">
        Antes
      </div>
    </div>
    
    {/* Divisor Grueso */}
    <div className="absolute inset-y-0 left-1/2 w-0.5 sm:w-1 bg-brand-orange z-20 -translate-x-1/2 shadow-[0_0_15px_rgba(245,130,32,0.8)]" />
    
    {/* Mitad Después */}
    <div className="relative w-1/2 h-full overflow-hidden">
      <img src={pair.after} alt="Después" className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-110" draggable={false} />
      <div className="absolute inset-0 bg-black/10 transition-colors duration-500" />
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 px-3 py-1.5 sm:px-4 sm:py-2 bg-brand-orange/90 backdrop-blur-md text-white/90 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] rounded-full shadow-[0_0_20px_rgba(245,130,32,0.5)] border border-white/10 z-10 transition-transform duration-300 group-hover:-translate-y-1">
        Después
      </div>
    </div>

    {/* Hover Overlay Expansion */}
    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-30">
      <div className="bg-black/70 p-4 sm:p-5 rounded-full backdrop-blur-sm border border-white/20 shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)">
        <Maximize2 className="w-8 h-8 sm:w-10 sm:h-10 text-brand-orange" />
      </div>
    </div>

    {/* Gradient Bottom for Title */}
    <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-20 flex flex-col justify-end translate-y-4 group-hover:translate-y-0">
      <h4 className="text-white font-black text-sm sm:text-base leading-tight uppercase tracking-wider drop-shadow-lg">{pair.title}</h4>
    </div>
  </div>
);

export default function BeforeAfterMarquee({ pairs, className = '' }: Props) {
  const [selectedPair, setSelectedPair] = useState<PhotoPair | null>(null);

  // Scroll lock effect - robusto para todos los navegadores
  useEffect(() => {
    if (selectedPair) {
      document.body.style.setProperty('overflow', 'hidden', 'important');
      document.documentElement.style.setProperty('overflow', 'hidden', 'important');
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [selectedPair]);

  // Bloque renderizable para la cinta (con gaps incluidos)
  const renderCardBlock = (prefix: string) => (
    <div className="flex shrink-0 gap-4 sm:gap-6 lg:gap-8 pr-4 sm:pr-6 lg:pr-8">
      {pairs.map((pair, idx) => (
        <BeforeAfterCard key={`${prefix}-${idx}`} pair={pair} onClick={() => setSelectedPair(pair)} />
      ))}
    </div>
  );

  return (
    <div className={`relative w-full overflow-hidden flex flex-col gap-4 sm:gap-6 lg:gap-8 ${className}`}>
      
      {/* Cinta Única - Movimiento Izquierda */}
      <div className="flex w-full overflow-hidden select-none py-2 sm:py-3 lg:py-4 mt-4">
        <motion.div 
          className="flex shrink-0"
          animate={{ x: ["0%", "-50%"] }} 
          transition={{ ease: "linear", duration: 120, repeat: Infinity }}
        >
          {renderCardBlock('r1')}
          {renderCardBlock('r2')}
          {renderCardBlock('r3')}
          {renderCardBlock('r4')}
        </motion.div>
      </div>

      {/* Lightbox expansivo de pantalla completa */}
      <AnimatePresence>
        {selectedPair && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-0 sm:p-6 md:p-12"
            onClick={() => setSelectedPair(null)}
          >
            <button 
              className="absolute top-4 right-4 sm:top-8 sm:right-8 z-[110] p-3 sm:p-4 rounded-full bg-white/10 hover:bg-white/20 hover:scale-110 active:scale-95 text-white backdrop-blur-md transition-all duration-300 border border-white/10"
              onClick={() => setSelectedPair(null)}
            >
              <X className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative w-[95vw] sm:w-[90vw] md:w-[80vw] max-w-5xl flex flex-col md:flex-row bg-slate-900 rounded-2xl sm:rounded-[2rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Titles on top inside absolute container */}
              <div className="absolute top-0 inset-x-0 p-4 sm:p-6 md:p-8 z-[60] bg-gradient-to-b from-black/90 via-black/60 to-transparent pointer-events-none">
                <h3 className="text-lg sm:text-xl md:text-3xl font-black text-white uppercase tracking-tight drop-shadow-lg">{selectedPair.title}</h3>
                <p className="text-white/80 font-medium text-xs sm:text-sm md:text-base mt-1 sm:mt-2 max-w-2xl drop-shadow">{selectedPair.description}</p>
              </div>

              {/* Antes Side */}
              <div className="w-full md:w-1/2 relative h-[35vh] md:h-[65vh] group pt-16 md:pt-0">
                <img src={selectedPair.before} alt="Antes" className="w-full h-full object-contain bg-black/80" />
                <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 px-4 py-1.5 sm:px-5 sm:py-2.5 bg-black/80 backdrop-blur-md text-white/90 font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] rounded-full shadow-2xl border border-white/20 z-50">
                  Antes
                </div>
              </div>

              {/* Divisor Desktop / Mobile */}
              <div className="w-full h-1 md:w-1 md:h-full bg-brand-orange shadow-[0_0_20px_rgba(245,130,32,0.8)] z-[55] relative shrink-0" />

              {/* Después Side */}
              <div className="w-full md:w-1/2 relative h-[35vh] md:h-[65vh] group">
                <img src={selectedPair.after} alt="Después" className="w-full h-full object-contain bg-black/80" />
                <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 px-4 py-1.5 sm:px-5 sm:py-2.5 bg-brand-orange/90 backdrop-blur-md text-white/90 font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] rounded-full shadow-[0_0_30px_rgba(245,130,32,0.6)] border border-white/20 z-50">
                  Después
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
