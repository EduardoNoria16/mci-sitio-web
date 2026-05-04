import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Loader2, Sparkles } from 'lucide-react';

interface PhotoPair {
  id: string;
  before: string;
  after: string;
  title: string;
  description?: string;
}

interface BeforeAfterGalleryProps {
  pairs: PhotoPair[];
  className?: string;
}

export default function BeforeAfterGallery({
  pairs,
  className = "",
}: BeforeAfterGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAfter, setShowAfter] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  const currentPair = pairs[currentIndex];

  // Transición Mágica: alternar automáticamente cada 4.5 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setShowAfter(prev => !prev);
    }, 4500);

    return () => clearInterval(timer);
  }, [currentIndex]); // Se reinicia el temporizador si el usuario cambia de slide

  // Reiniciar estado siempre al "Antes" cuando cambia la imagen principal
  useEffect(() => {
    setShowAfter(false);
  }, [currentIndex]);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % pairs.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + pairs.length) % pairs.length);
  };

  if (!currentPair) return null;

  const isBeforeLoaded = loadedImages[currentPair.before];
  const isAfterLoaded = loadedImages[currentPair.after];

  return (
    <div 
      className={`relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] min-h-[400px] max-h-[800px] overflow-hidden rounded-[2rem] md:rounded-[3rem] select-none border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-black group ${className}`}
    >
      <div className="absolute inset-0">
        
        {/* BASE LAYER - BEFORE IMAGE */}
        <img 
          src={currentPair.before} 
          alt={`Antes - ${currentPair.title}`} 
          className="absolute inset-0 w-full h-full object-contain z-0 pointer-events-none"
          draggable={false}
          style={{ display: 'block', visibility: 'visible', opacity: 1 }}
          onLoad={() => setLoadedImages(prev => ({ ...prev, [currentPair.before]: true }))}
        />

        {/* TOP LAYER - AFTER IMAGE (FADES IN) */}
        <img 
          src={currentPair.after} 
          alt={`Después - ${currentPair.title}`} 
          className={`absolute inset-0 w-full h-full object-contain z-20 pointer-events-none transition-opacity duration-[2000ms] ease-in-out ${showAfter ? 'opacity-100' : 'opacity-0'}`}
          draggable={false}
          style={{ display: 'block', visibility: 'visible' }}
          onLoad={() => setLoadedImages(prev => ({ ...prev, [currentPair.after]: true }))}
        />

        {/* INDICADOR DE CARGA (Para imágenes pesadas) */}
        {(!isBeforeLoaded || !isAfterLoaded) && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm pointer-events-none transition-opacity duration-300">
            <Loader2 className="w-12 h-12 text-brand-orange animate-spin mb-4" />
            <div className="text-white/90 font-bold uppercase tracking-widest animate-pulse">
              Descargando Imágenes...
            </div>
            <div className="text-white/50 text-xs mt-2 text-center max-w-xs px-4">
              Las fotos originales son pesadas. Por favor espera un momento.
            </div>
          </div>
        )}

        {/* GRADIENTS FOR TEXT READABILITY */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 md:from-black/90 via-black/30 to-transparent z-40 pointer-events-none" />

        {/* VISUAL STATUS BADGE */}
        <div className="absolute inset-x-4 sm:inset-x-8 top-4 sm:top-8 z-50 flex justify-between items-start pointer-events-none">
          {/* ANTES BADGE */}
          <div 
            className="px-4 py-2 rounded-full backdrop-blur-md border border-white/20 text-white/90 text-xs font-bold uppercase tracking-widest shadow-lg flex items-center gap-2 transition-all duration-[1000ms]"
            style={{ 
              backgroundColor: !showAfter ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.3)',
              opacity: !showAfter ? 1 : 0.4,
              transform: !showAfter ? 'scale(1.05)' : 'scale(1)'
            }}
          >
            Antes
          </div>
          
          {/* DESPUÉS BADGE */}
          <div 
            className="px-4 py-2 rounded-full backdrop-blur-md border border-white/20 text-white/90 text-xs font-bold uppercase tracking-widest shadow-lg flex items-center gap-2 transition-all duration-[1000ms]"
            style={{ 
              backgroundColor: showAfter ? 'rgba(245,130,32,0.9)' : 'rgba(0,0,0,0.3)',
              opacity: showAfter ? 1 : 0.4,
              transform: showAfter ? 'scale(1.05)' : 'scale(1)'
            }}
          >
             {showAfter && <Sparkles className="w-4 h-4 text-white" />}
            Después
          </div>
        </div>

        {/* CONTENT & DETAILS */}
        <div className="absolute inset-x-0 bottom-0 z-40 p-6 sm:p-10 flex flex-col items-start gap-2 pointer-events-none">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white/90 text-[10px] font-bold uppercase tracking-widest">
            Caso {currentIndex + 1} de {pairs.length}
          </div>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white drop-shadow-md leading-tight uppercase tracking-tight">
            {currentPair.title}
          </h3>
          {currentPair.description && (
            <p className="text-slate-300 text-sm sm:text-base font-medium drop-shadow leading-relaxed hidden sm:block max-w-3xl">
              {currentPair.description}
            </p>
          )}
        </div>
      </div>

      {/* Navigation Arrows */}
      {pairs.length > 1 && (
        <>
          <button 
            onClick={handlePrev}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-[60] p-3 sm:p-4 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md border border-white/20 text-white opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 pointer-events-auto shadow-xl"
            aria-label="Caso anterior"
          >
            <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
          <button 
            onClick={handleNext}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-[60] p-3 sm:p-4 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md border border-white/20 text-white opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 pointer-events-auto shadow-[0_0_20px_rgba(245,130,32,0.3)]"
            aria-label="Siguiente caso"
          >
            <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 text-brand-orange" />
          </button>
        </>
      )}

      {/* Pagination Dots */}
      {pairs.length > 1 && (
        <div className="absolute top-4 sm:top-8 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-black/60 backdrop-blur-md border border-white/20 pointer-events-auto shadow-xl">
          {pairs.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
              className={`transition-all duration-500 rounded-full ${idx === currentIndex ? 'w-10 sm:w-12 h-3 sm:h-3.5 bg-brand-orange shadow-[0_0_15px_rgba(245,130,32,0.8)]' : 'w-3 sm:w-3.5 h-3 sm:h-3.5 bg-white/40 hover:bg-white/80'}`}
              aria-label={`Ir al caso ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
