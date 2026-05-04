import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';

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
  autoPlayInterval?: number;
}

export default function BeforeAfterGallery({
  pairs,
  className = "",
  autoPlayInterval = 8000 // Time between changing the pair
}: BeforeAfterGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAfter, setShowAfter] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Handle the automatic slow toggle between before and after
  useEffect(() => {
    if (isHovered) return; // Pause transition if user is hovering for closer inspection
    
    // Toggle between before and after every 4 seconds (so 4s before, 4s after = 8s total per pair)
    const toggleInterval = setInterval(() => {
      setShowAfter(prev => !prev);
    }, 4000);

    return () => clearInterval(toggleInterval);
  }, [isHovered]);

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

  const currentPair = pairs[currentIndex];

  if (!currentPair) return null;

  return (
    <div 
      className={`relative w-full aspect-[4/3] sm:aspect-video lg:aspect-[21/9] overflow-hidden rounded-[2rem] md:rounded-[3rem] select-none border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-slate-900 group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPair.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          {/* BASE LAYER - ALWAYS BEFORE IMAGE */}
          <div className="absolute inset-0 bg-slate-800 flex items-center justify-center text-slate-500 text-xs">
            Cargando imagen...
          </div>
          <img 
            src={currentPair.before} 
            alt={`Antes - ${currentPair.title}`} 
            className="absolute inset-0 w-full h-full object-cover filter grayscale contrast-125 sepia-[0.3] brightness-75 text-transparent z-0"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 md:from-black/90 via-black/20 to-transparent z-10" />

          {/* TOP LAYER - AFTER IMAGE (FADES IN/OUT) */}
          <AnimatePresence>
            {showAfter && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                // Slow transition as requested
                transition={{ duration: 2, ease: "easeInOut" }}
                className="absolute inset-0 z-20"
              >
                <div className="absolute inset-0 bg-slate-800 flex items-center justify-center text-slate-500 text-xs">
                  Cargando imagen...
                </div>
                <img 
                  src={currentPair.after} 
                  alt={`Después - ${currentPair.title}`} 
                  className="absolute inset-0 w-full h-full object-cover text-transparent"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 md:from-black/90 via-black/20 to-transparent" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* CONTENT & DETAILS */}
          <div className="absolute inset-x-0 bottom-0 z-30 p-6 sm:p-10 flex flex-col md:flex-row items-end md:items-center justify-between gap-6">
            
            {/* Title & Description */}
            <div className="flex-1 max-w-2xl text-left pointer-events-none">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
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
              </motion.div>
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
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {pairs.length > 1 && (
        <>
          <button 
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-black/40 hover:bg-black/80 backdrop-blur-md border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
            aria-label="Caso anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-black/40 hover:bg-black/80 backdrop-blur-md border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-[0_0_15px_rgba(245,130,32,0.2)]"
            aria-label="Siguiente caso"
          >
            <ChevronRight className="w-6 h-6 text-brand-orange" />
          </button>
        </>
      )}

      {/* Pagination Dots */}
      {pairs.length > 1 && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
          {pairs.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); setShowAfter(false); }}
              className={`transition-all duration-500 rounded-full ${idx === currentIndex ? 'w-6 h-2 bg-brand-orange shadow-[0_0_10px_rgba(245,130,32,0.6)]' : 'w-2 h-2 bg-white/30 hover:bg-white/60'}`}
              aria-label={`Ir al caso ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
