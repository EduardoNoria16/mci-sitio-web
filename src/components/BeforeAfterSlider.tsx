import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, ShieldCheck } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}

export default function BeforeAfterSlider({ 
  beforeImage, 
  afterImage, 
  beforeLabel = "Antes",
  afterLabel = "Después",
  className = ""
}: BeforeAfterSliderProps) {
  const [showAfter, setShowAfter] = useState(false);

  useEffect(() => {
    // Elegant slow toggle every 4 seconds
    const interval = setInterval(() => {
      setShowAfter(prev => !prev);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`relative w-full aspect-[4/3] sm:aspect-video lg:aspect-[21/9] overflow-hidden rounded-2xl md:rounded-[2.5rem] select-none border-2 border-white/10 shadow-2xl bg-slate-900 ${className}`}>
      
      {/* BASE LAYER - ALWAYS BEFORE IMAGE */}
      <div className="absolute inset-0 bg-slate-800 flex items-center justify-center text-slate-500 text-xs">
        Cargando piso dañado...
      </div>
      <img 
        src={beforeImage} 
        alt={beforeLabel} 
        className="absolute inset-0 w-full h-full object-cover filter grayscale contrast-125 sepia-[0.3] brightness-75 text-transparent z-0"
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
      
      {/* TOP LAYER - AFTER IMAGE (FADES IN/OUT) */}
      <AnimatePresence>
        {showAfter && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 z-20"
          >
            <div className="absolute inset-0 bg-slate-800 flex items-center justify-center text-slate-500 text-xs">
              Cargando solución MCI...
            </div>
            <img 
              src={afterImage} 
              alt={afterLabel} 
              className="absolute inset-0 w-full h-full object-cover text-transparent"
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* LABELS (ABSOLUTE TOP Z-INDEX) */}
      <div className="absolute inset-x-6 bottom-6 sm:bottom-8 z-30 flex justify-between items-end">
        {/* Before Label */}
        <div className={`transition-all duration-1000 ${showAfter ? 'opacity-40 scale-95' : 'opacity-100 scale-100'}`}>
          <div className="bg-black/60 backdrop-blur-md border border-white/20 text-white/90 px-4 py-2 sm:px-6 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] shadow-lg flex items-center gap-2">
            <Camera className="w-4 h-4" />
            <span className="hidden sm:inline">{beforeLabel}</span>
            <span className="sm:hidden">Antes</span>
          </div>
        </div>

        {/* Indicator Line */}
        <div className="flex-1 hidden sm:flex items-center px-4 opacity-30">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-white to-transparent" />
        </div>

        {/* After Label */}
        <div className={`transition-all duration-1000 ${showAfter ? 'opacity-100 scale-110 shadow-[0_0_30px_rgba(245,130,32,0.4)]' : 'opacity-40 scale-95'}`}>
          <div className="bg-brand-orange/90 backdrop-blur-md border border-white/20 text-white px-4 py-2 sm:px-6 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span className="hidden sm:inline">{afterLabel}</span>
            <span className="sm:hidden">Después</span>
          </div>
        </div>
      </div>
    </div>
  );
}
