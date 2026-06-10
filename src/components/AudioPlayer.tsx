import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause } from 'lucide-react';
import { motion } from 'framer-motion';

interface AudioPlayerProps {
  src: string;
  startTime?: number; // In seconds
  fadeInDuration?: number; // In seconds
  label?: string; // Keeping prop to avoid breaking other files, but ignoring it in UI
  className?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ 
  src, 
  startTime = 0, 
  fadeInDuration = 0, 
  className = ''
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Initialize audio element
    audioRef.current = new Audio(src);
    audioRef.current.loop = true;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
    };
  }, [src]);

  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      // Logic for pausing
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // Logic for playing
      if (audioRef.current.currentTime === 0 || audioRef.current.currentTime === startTime) {
          audioRef.current.currentTime = startTime;
      }
      
      if (fadeInDuration > 0) {
        audioRef.current.volume = 0;
        audioRef.current.play().then(() => {
          setIsPlaying(true);
          let currentVolume = 0;
          const steps = 20; // Number of volume increments
          const intervalTime = (fadeInDuration * 1000) / steps;
          const volumeIncrement = 1 / steps;

          if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);

          fadeIntervalRef.current = setInterval(() => {
            currentVolume += volumeIncrement;
            if (currentVolume >= 1) {
              if (audioRef.current) audioRef.current.volume = 1;
              if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
            } else {
              if (audioRef.current) audioRef.current.volume = currentVolume;
            }
          }, intervalTime);
        }).catch(err => {
          console.error("No se pudo reproducir el audio:", err);
          setIsPlaying(false);
          alert("El archivo no se pudo reproducir debido a restricciones del navegador. Por favor intenta de nuevo, o ábrelo en otra pestaña si usas Google Drive.");
        });
      } else {
        audioRef.current.volume = 1;
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(err => {
          console.error("No se pudo reproducir el audio:", err);
          setIsPlaying(false);
          alert("El archivo no se pudo reproducir debido a restricciones del navegador. Por favor intenta de nuevo.");
        });
      }
    }
  };

  return (
    <motion.button 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handlePlayPause}
      className={`group relative flex items-center gap-3 px-5 py-3 rounded-full bg-[#0a192f]/90 backdrop-blur-md border border-brand-orange/30 shadow-[0_0_20px_rgba(245,130,32,0.15)] hover:shadow-[0_0_25px_rgba(245,130,32,0.3)] hover:border-brand-orange/60 z-[100] ${className} transition-all duration-300 cursor-pointer overflow-hidden`}
    >
      {/* Background Pulse Effect when playing */}
      {isPlaying && (
        <span className="absolute inset-0 w-full h-full bg-brand-orange/5 animate-pulse" />
      )}
      
      <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-brand-orange text-white shadow-md">
        {isPlaying ? (
          <div className="flex gap-1 items-center justify-center">
            {/* Animated EQ bars */}
            <motion.div animate={{ height: [6, 12, 6] }} transition={{ repeat: Infinity, duration: 0.5, ease: "easeInOut" }} className="w-1 bg-white rounded-full h-3" />
            <motion.div animate={{ height: [10, 16, 10] }} transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut", delay: 0.1 }} className="w-1 bg-white rounded-full h-4" />
            <motion.div animate={{ height: [6, 12, 6] }} transition={{ repeat: Infinity, duration: 0.7, ease: "easeInOut", delay: 0.2 }} className="w-1 bg-white rounded-full h-3" />
          </div>
        ) : (
          <Play className="w-4 h-4 ml-0.5 fill-white" />
        )}
      </div>

      <div className="relative z-10 flex flex-col items-start">
        <span className="text-[10px] sm:text-xs text-white/70 uppercase tracking-widest font-mono font-medium leading-none mb-1">
          Ambientación
        </span>
        <span className="text-xs sm:text-sm text-white font-bold leading-none tracking-wide">
          {isPlaying ? 'Reproduciendo...' : 'Escuchar Música'}
        </span>
      </div>
      
    </motion.button>
  );
};

export default AudioPlayer;
