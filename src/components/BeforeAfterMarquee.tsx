import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
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

const BeforeAfterCard: React.FC<{ pair: PhotoPair; index: number; onClick: () => void }> = ({ pair, index, onClick }) => {
  const isEven = index % 2 === 0;

  return (
    <div 
      className={`relative flex flex-col w-[65vw] sm:w-[280px] md:w-[320px] lg:w-[360px] shrink-0 rounded-[1.5rem] p-3 sm:p-4 backdrop-blur-xl border-2 shadow-xl transition-all duration-500 cursor-pointer group hover:-translate-y-2 ${
        isEven 
        ? 'bg-gradient-to-br from-surface/80 to-[#22d3ee]/10 border-[#22d3ee]/20 hover:border-[#22d3ee]/50 hover:shadow-[0_20px_50px_rgba(34,211,238,0.2)]' 
        : 'bg-gradient-to-bl from-surface/80 to-brand-orange/10 border-brand-orange/20 hover:border-brand-orange/50 hover:shadow-[0_20px_50px_rgba(245,130,32,0.2)]'
      }`}
      onClick={onClick}
    >
      {/* Decorative header */}
      <div className="flex items-center gap-2 mb-3 px-2">
        <div className={`w-2 h-2 rounded-full shadow-sm ${isEven ? 'bg-slate-800' : 'bg-brand-orange'}`} />
        <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${isEven ? 'text-slate-800' : 'text-brand-orange drop-shadow-sm'}`}>
          CASOS DE ÉXITO MCI
        </span>
      </div>

      {/* Image container */}
      <div className="relative flex flex-row w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-inner border border-white/10 group-hover:shadow-2xl transition-shadow duration-500">
        {/* Mitad Antes */}
        <div className="relative w-1/2 h-full overflow-hidden">
          <img src={pair.before} alt="Antes" className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-110 group-hover:rotate-1" draggable={false} referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-black/10 transition-colors duration-500" />
          <div className="absolute top-2 left-2 sm:top-4 sm:left-4 px-2 py-1 sm:px-4 sm:py-1.5 bg-black/70 backdrop-blur-md text-white border-white/20 text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg border z-10 transition-transform duration-300 group-hover:-translate-y-0.5">
            Condición inicial
          </div>
        </div>
        
        {/* Divisor Grueso */}
        <div className="absolute inset-y-0 left-1/2 w-0.5 sm:w-1 bg-white z-20 -translate-x-1/2 shadow-[0_0_15px_rgba(255,255,255,0.8)] opacity-90 group-hover:bg-brand-orange group-hover:shadow-[0_0_15px_rgba(245,130,32,0.8)] transition-colors duration-300" />
        
        {/* Mitad Después */}
        <div className="relative w-1/2 h-full overflow-hidden">
          <img src={pair.after} alt="Después" className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-110 group-hover:-rotate-1" draggable={false} referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-black/5 transition-colors duration-500 group-hover:bg-transparent" />
          <div className="absolute top-2 right-2 sm:top-4 sm:right-4 px-2 py-1 sm:px-4 sm:py-1.5 bg-brand-orange/90 backdrop-blur-md text-white border-white/20 text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-[0_0_20px_rgba(245,130,32,0.5)] border z-10 transition-transform duration-300 group-hover:-translate-y-0.5">
            Solución MCI
          </div>
        </div>

        {/* Hover Overlay Expansion Icon */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-30">
          <div className="bg-black/70 p-3 sm:p-4 rounded-full backdrop-blur-sm border border-white/20 shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)">
            <Maximize2 className="w-6 h-6 sm:w-8 sm:h-8 text-brand-orange" />
          </div>
        </div>

        {/* Gradient Bottom for Title */}
        <div className="absolute inset-x-0 bottom-0 p-3 sm:p-5 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-20 flex flex-col justify-end translate-y-2 group-hover:translate-y-0">
          <h4 className="text-white font-black text-xs sm:text-sm leading-tight uppercase tracking-wider drop-shadow-lg">{pair.title}</h4>
        </div>
      </div>
    </div>
  );
};

export default function BeforeAfterMarquee({ pairs, className = '' }: Props) {
  const [selectedPair, setSelectedPair] = useState<PhotoPair | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isInteracting = useRef(false);

  // Auto-scroll logic
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let animationId: number;

    const scroll = () => {
      if (!isInteracting.current && container) {
        container.scrollLeft += 2.5; // Velocidad incrementada
        
        // Loop hacia adelante
        if (container.scrollLeft >= container.scrollWidth / 2) {
          container.scrollLeft -= container.scrollWidth / 2;
        }
      }
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

    const handleScroll = () => {
      // Loop hacia atrás si el usuario scrollea hacia la izquierda
      if (container.scrollLeft <= 0) {
        container.scrollLeft += container.scrollWidth / 2;
      } else if (container.scrollLeft >= container.scrollWidth / 2) {
        container.scrollLeft -= container.scrollWidth / 2;
      }
    };
    
    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      cancelAnimationFrame(animationId);
      container.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Esc key and Scroll lock effect
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedPair(null);
    };

    if (selectedPair) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedPair]);

  // Usamos todas las fotos para una sola fila
  const allPairs = [...pairs];

  // Bloque renderizable para la cinta (con gaps incluidos)
  const renderCardBlock = (prefix: string, items: PhotoPair[], startIndex: number = 0) => (
    <div className="flex shrink-0 gap-3 sm:gap-4 lg:gap-6 pr-3 sm:pr-4 lg:pr-6">
      {items.map((pair, idx) => (
        <BeforeAfterCard key={`${prefix}-${idx}`} index={startIndex + idx} pair={pair} onClick={() => setSelectedPair(pair)} />
      ))}
    </div>
  );

  return (
    <div className={`relative w-full overflow-hidden flex flex-col gap-4 sm:gap-6 lg:gap-8 ${className}`}>
      
      {/* Cinta Única - Movimiento Izquierda */}
      <div 
        className="flex w-full overflow-x-auto select-none py-4 sm:py-6 lg:py-8 mt-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] cursor-grab active:cursor-grabbing"
        ref={scrollRef}
        onPointerEnter={() => isInteracting.current = true}
        onPointerLeave={() => isInteracting.current = false}
        onTouchStart={() => isInteracting.current = true}
        onTouchEnd={() => {
          // Pequena pausa antes de reanudar
          setTimeout(() => { isInteracting.current = false; }, 1000);
        }}
      >
        <div className="flex shrink-0">
          {renderCardBlock('c1', allPairs, 0)}
          {renderCardBlock('c2', allPairs, allPairs.length)}
          {renderCardBlock('c3', allPairs, allPairs.length * 2)}
          {renderCardBlock('c4', allPairs, allPairs.length * 3)}
        </div>
      </div>

      {/* Lightbox expansivo de pantalla completa */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {selectedPair && (
            <motion.div 
              key="lightbox"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 sm:p-6 md:p-12 overscroll-none"
              onClick={() => setSelectedPair(null)}
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
            >
              <button 
                className="absolute top-4 right-4 sm:top-8 sm:right-8 z-[110] p-3 sm:p-4 rounded-full bg-white/10 hover:bg-white/20 hover:scale-110 active:scale-95 text-white backdrop-blur-md transition-all duration-300 border border-white/10"
                onClick={() => setSelectedPair(null)}
              >
                <X className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>
              
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="relative w-[95vw] sm:w-[90vw] md:w-[80vw] max-w-5xl max-h-[85vh] sm:max-h-[90vh] flex flex-col md:flex-row bg-slate-900 rounded-2xl sm:rounded-[2rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/10 my-auto group/lightbox"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Titles on top inside absolute container */}
                <div className="absolute top-0 inset-x-0 p-4 sm:p-6 md:p-8 z-[60] bg-gradient-to-b from-black/90 via-black/60 to-transparent pointer-events-none opacity-0 group-hover/lightbox:opacity-100 transition-opacity duration-500">
                  <h3 className="text-lg sm:text-xl md:text-3xl font-black text-white uppercase tracking-tight drop-shadow-lg">{selectedPair.title}</h3>
                  <p className="text-white/80 font-medium text-xs sm:text-sm md:text-base mt-1 sm:mt-2 max-w-2xl drop-shadow">{selectedPair.description}</p>
                </div>

                {/* Antes Side */}
                <div className="w-full md:w-1/2 relative h-[35vh] md:h-[65vh] group pt-16 md:pt-0">
                  <img src={selectedPair.before} alt="Antes" className="w-full h-full object-contain bg-black/80" referrerPolicy="no-referrer" />
                  <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 px-4 py-1.5 sm:px-6 sm:py-3 bg-black/80 backdrop-blur-md text-white font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] rounded-full shadow-2xl border border-white/20 z-50">
                    Condición inicial
                  </div>
                </div>

                {/* Divisor Desktop / Mobile */}
                <div className="w-full h-1 md:w-1 md:h-full bg-brand-orange shadow-[0_0_20px_rgba(245,130,32,0.8)] z-[55] relative shrink-0" />

                {/* Después Side */}
                <div className="w-full md:w-1/2 relative h-[35vh] md:h-[65vh] group">
                  <img src={selectedPair.after} alt="Después" className="w-full h-full object-contain bg-black/80" referrerPolicy="no-referrer" />
                  <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 px-4 py-1.5 sm:px-6 sm:py-3 bg-brand-orange/90 backdrop-blur-md text-white font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] rounded-full shadow-[0_0_30px_rgba(245,130,32,0.6)] border border-white/20 z-50">
                    Solución MCI
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
