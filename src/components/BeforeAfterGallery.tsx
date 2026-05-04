import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, ShieldCheck, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

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
  const [isHovered, setIsHovered] = useState(false);
  
  // Track loaded state of ALL images to prevent loading spinners hanging
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  const currentPair = pairs[currentIndex];

  useEffect(() => {
    if (isHovered) return;
    
    // Auto-toggle between before and after
    const toggleInterval = setInterval(() => {
      setShowAfter(prev => !prev);
    }, 3500);

    return () => clearInterval(toggleInterval);
  }, [isHovered, currentIndex]); // Removed dependency on currentPair to make it stable

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowAfter(false);
    setCurrentIndex((prev) => (prev + 1) % pairs.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowAfter(false);
    setCurrentIndex((prev) => (prev - 1 + pairs.length) % pairs.length);
  };

  // Preload current pair images to ensure fast display
  useEffect(() => {
    if (currentPair) {
      const imgBefore = new Image();
      imgBefore.src = currentPair.before;
      imgBefore.onload = () => setLoadedImages(prev => ({ ...prev, [currentPair.before]: true }));

      const imgAfter = new Image();
      imgAfter.src = currentPair.after;
      imgAfter.onload = () => setLoadedImages(prev => ({ ...prev, [currentPair.after]: true }));
    }
  }, [currentPair]);

  if (!currentPair) return null;

  const isBeforeLoaded = loadedImages[currentPair.before];
  const isAfterLoaded = loadedImages[currentPair.after];

  return (
    <div 
      className={`relative w-full aspect-[4/3] sm:aspect-video lg:aspect-[21/9] overflow-hidden rounded-[2rem] md:rounded-[3rem] select-none border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-slate-900 group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 
        Bulletproof wrapper: 
        We use standard CSS transitions for the main container to avoid Framer Motion Hydration bugs 
      */}
      <div className="absolute inset-0 transition-opacity duration-500 ease-in-out opacity-100">
        
        {/* BASE LAYER - ALWAYS BEFORE IMAGE */}
        <img 
          src={currentPair.before} 
          alt={`Antes - ${currentPair.title}`} 
          className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-1000 ${isBeforeLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setLoadedImages(prev => ({ ...prev, [currentPair.before]: true }))}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 md:from-black/90 via-black/20 to-transparent z-10 pointer-events-none" />

        {/* TOP LAYER - AFTER IMAGE (FADES IN/OUT) */}
        <div 
          className={`absolute inset-0 z-20 transition-opacity duration-700 ease-in-out ${showAfter ? 'opacity-100' : 'opacity-0'}`}
        >
          <img 
            src={currentPair.after} 
            alt={`Después - ${currentPair.title}`} 
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${isAfterLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setLoadedImages(prev => ({ ...prev, [currentPair.after]: true }))}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 md:from-black/90 via-black/20 to-transparent pointer-events-none" />
        </div>

        {/* LOADER - Shown only when the image that CURRENTLY should be visible hasn't loaded */}
        {(!isBeforeLoaded || (showAfter && !isAfterLoaded)) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 z-30 backdrop-blur-sm transition-opacity duration-300">
             <Loader2 className="w-12 h-12 text-brand-orange animate-spin mb-4" />
             <div className="text-white/80 text-sm font-semibold uppercase tracking-widest animate-pulse">
               Cargando Imagen...
             </div>
             <div className="text-white/40 text-xs mt-2 text-center max-w-xs">
               Estas imágenes de alta resolución pueden tardar un momento.
             </div>
          </div>
        )}

        {/* CONTENT & DETAILS */}
        <div className="absolute inset-x-0 bottom-0 z-40 p-6 sm:p-10 flex flex-col md:flex-row items-end md:items-center justify-between gap-6 pointer-events-none">
          
          {/* Title & Description */}
          <div className="flex-1 max-w-2xl text-left pointer-events-none">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white/90 text-[10px] font-bold uppercase tracking-widest">
              Caso {currentIndex + 1} de {pairs.length}
            </div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white drop-shadow-md leading-tight mb-2 uppercase tracking-tight">
              {currentPair.title}
            </h3>
            {currentPair.description && (
              <p className="text-slate-300 text-sm sm:text-base font-medium drop-shadow leading-relaxed hidden sm:block">
                {currentPair.description}
              </p>
            )}
          </div>

          {/* Labels Indicator */}
          <div className="flex items-center gap-3 bg-black/60 backdrop-blur-md p-1.5 rounded-full border border-white/10 shrink-0 pointer-events-auto">
            <button 
              onClick={() => setShowAfter(false)}
              className={`relative px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-black uppercase tracking-widest transition-all duration-500 flex items-center gap-2 ${!showAfter ? 'bg-white/20 text-white shadow-lg' : 'text-white/50 hover:text-white/80'}`}
            >
              <Camera className="w-4 h-4 hidden sm:block" />
              Antes
            </button>
            <button 
              onClick={() => setShowAfter(true)}
              className={`relative px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-black uppercase tracking-widest transition-all duration-500 flex items-center gap-2 ${showAfter ? 'bg-brand-orange text-white shadow-[0_0_20px_rgba(245,130,32,0.4)]' : 'text-white/50 hover:text-white/80'}`}
            >
              <ShieldCheck className="w-4 h-4 hidden sm:block" />
              Después
            </button>
          </div>

        </div>
      </div>

      {/* Navigation Arrows */}
      {pairs.length > 1 && (
        <>
          <button 
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-black/40 hover:bg-black/80 backdrop-blur-md border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
            aria-label="Caso anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-black/40 hover:bg-black/80 backdrop-blur-md border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-[0_0_15px_rgba(245,130,32,0.2)]"
            aria-label="Siguiente caso"
          >
            <ChevronRight className="w-6 h-6 text-brand-orange" />
          </button>
        </>
      )}

      {/* Pagination Dots */}
      {pairs.length > 1 && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 pointer-events-auto">
          {pairs.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); setShowAfter(false); }}
              className={`transition-all duration-500 rounded-full ${idx === currentIndex ? 'w-8 h-2.5 bg-brand-orange shadow-[0_0_10px_rgba(245,130,32,0.6)]' : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'}`}
              aria-label={`Ir al caso ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
