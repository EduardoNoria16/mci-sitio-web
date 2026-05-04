import React, { useState, useEffect, useRef } from 'react';
import { Camera, ShieldCheck, ChevronLeft, ChevronRight, GripVertical } from 'lucide-react';

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
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentPair = pairs[currentIndex];

  const updateSliderPosition = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    // Only handle primary pointer (usually left click or first touch)
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    setIsDragging(true);
    updateSliderPosition(e.clientX);
  };

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      updateSliderPosition(e.clientX);
    };

    const handlePointerUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      window.addEventListener('pointercancel', handlePointerUp);
    }

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [isDragging]);

  // Reset slider position when changing slides
  useEffect(() => {
    setSliderPosition(50);
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

  return (
    <div 
      className={`relative w-full aspect-[4/3] sm:aspect-video lg:aspect-[21/9] overflow-hidden rounded-[2rem] md:rounded-[3rem] select-none border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-slate-900 group ${className}`}
      ref={containerRef}
      onPointerDown={handlePointerDown}
      style={{ touchAction: 'pan-y' }} // Prevent touch scrolling while interacting horizontally
    >
      <div className="absolute inset-0">
        
        {/* BASE LAYER - BEFORE IMAGE (LEFT SIDE VISIBLE ALWAYS, BUT WE SHOW ENTIRE THING AND OVERLAY AFTER) */}
        <img 
          src={currentPair.before} 
          alt={`Antes - ${currentPair.title}`} 
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
          draggable={false}
        />

        {/* TOP LAYER - AFTER IMAGE (RIGHT SIDE) */}
        <div 
          className="absolute inset-0 z-20 pointer-events-none"
          style={{
            clipPath: `polygon(${sliderPosition}% 0, 100% 0, 100% 100%, ${sliderPosition}% 100%)`,
            // Add a smooth transition only when NOT dragging
            transition: isDragging ? 'none' : 'clip-path 0.5s cubic-bezier(0.25, 1, 0.5, 1)'
          }}
        >
          <img 
            src={currentPair.after} 
            alt={`Después - ${currentPair.title}`} 
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            draggable={false}
          />
        </div>

        {/* GRADIENTS FOR TEXT READABILITY */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 md:from-black/90 via-black/20 to-transparent z-30 pointer-events-none" />

        {/* DRAGGABLE DIVIDER LINE */}
        <div 
          className="absolute top-0 bottom-0 z-40 w-1 bg-brand-orange/90 shadow-[0_0_10px_rgba(245,130,32,0.8)] -translate-x-1/2 flex items-center justify-center cursor-ew-resize"
          style={{ 
            left: `${sliderPosition}%`,
            transition: isDragging ? 'none' : 'left 0.5s cubic-bezier(0.25, 1, 0.5, 1)'
          }}
        >
          {/* HANDLE */}
          <div className="w-10 h-10 -ml-0.5 rounded-full bg-brand-orange border-2 border-white shadow-xl flex items-center justify-center pointer-events-auto hover:bg-brand-orange/90 hover:scale-110 active:scale-95 transition-transform">
            <GripVertical className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* VISUAL BADGES ON EACH SIDE */}
        <div className="absolute inset-x-8 top-8 z-30 flex justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div 
            className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white/90 text-xs font-bold uppercase tracking-widest shadow-lg"
            style={{ 
              opacity: sliderPosition > 15 ? 1 : 0, 
              transition: 'opacity 0.2s' 
            }}
          >
            Antes
          </div>
          <div 
            className="px-3 py-1.5 rounded-full bg-brand-orange/90 backdrop-blur-md border border-white/20 text-white/90 text-xs font-bold uppercase tracking-widest shadow-lg"
            style={{ 
              opacity: sliderPosition < 85 ? 1 : 0, 
              transition: 'opacity 0.2s' 
            }}
          >
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
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-black/40 hover:bg-black/80 backdrop-blur-md border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 pointer-events-auto"
            aria-label="Caso anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-black/40 hover:bg-black/80 backdrop-blur-md border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-[0_0_15px_rgba(245,130,32,0.2)] pointer-events-auto"
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
              onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
              className={`transition-all duration-500 rounded-full ${idx === currentIndex ? 'w-8 h-2.5 bg-brand-orange shadow-[0_0_10px_rgba(245,130,32,0.6)]' : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'}`}
              aria-label={`Ir al caso ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
