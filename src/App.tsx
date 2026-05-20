/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react';
import { useLocation, useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import { logoBase64 } from './logoBase64';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useInView, animate } from 'motion/react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  ChevronDown, 
  ChevronRight, 
  ShieldCheck, 
  Zap, 
  Factory, 
  Building2, 
  ShoppingBag, 
  Truck, 
  HardHat, 
  Droplets, 
  Flame, 
  Paintbrush, 
  Wrench, 
  Layers, 
  MessageCircle,
  X,
  Menu,
  ArrowRight,
  ArrowLeft,
  ArrowDown,
  Clock,
  Send,
  Volume2,
  VolumeX,
  Star,
  Loader2,
  Quote,
  Headphones,
  Camera,
  Play,
  Pause,
  Maximize,
  Minimize2 as Minimize,
  CheckCircle2,
  Target,
  Eye,
  Award,
  ArrowLeftRight,
  QrCode,
  RotateCcw
} from 'lucide-react';
import BeforeAfterMarquee from './components/BeforeAfterMarquee';
import { ProjectGallery } from './components/ProjectGallery';
import QRCodeModal from './components/QRCodeModal';
import { getProxiedImageUrl } from './utils/image';

// --- Sound Effects ---
const playClickSound = () => {
  const audio = new Audio('https://assets.mixkit.io/active_storage/sfx/2571/2571-preview.mp3');
  audio.volume = 0.1;
  audio.play().catch(() => {});
};

const formatTime = (time: number) => {
  if (isNaN(time) || !isFinite(time)) return "0:00";
  const m = Math.floor(time / 60);
  const s = Math.floor(time % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const CustomVideoPlayer = memo(() => {
  const videoUrl = "https://i.imgur.com/LoeTAM6.mp4";
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  const togglePlay = (e?: React.SyntheticEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (!hasInteracted) setHasInteracted(true);
    
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleFullscreen = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      if (!document.fullscreenElement) {
        if (containerRef.current?.requestFullscreen) {
          await containerRef.current.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch (err) {
      console.error("Fullscreen API error", err);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const val = parseFloat(e.target.value);
    setVolume(val);
    const mutedStatus = val === 0;
    if (videoRef.current) {
      videoRef.current.volume = 0; // Mute video original sound to prefer custom audio
      videoRef.current.muted = true;
    }
    if (audioRef.current) {
      audioRef.current.volume = val;
      audioRef.current.muted = mutedStatus;
    }
    setIsMuted(mutedStatus);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (videoRef.current.duration) {
        setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
      }
      // Audio sync (starts at 2:30 = 150s offset)
      if (audioRef.current && Math.abs(audioRef.current.currentTime - (videoRef.current.currentTime + 150)) > 0.5) {
        audioRef.current.currentTime = videoRef.current.currentTime + 150;
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const val = parseFloat(e.target.value);
    if (videoRef.current) {
      const newTime = (videoRef.current.duration / 100) * val;
      videoRef.current.currentTime = newTime;
      setProgress(val);
      if (audioRef.current) {
        audioRef.current.currentTime = newTime + 150;
      }
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 2500);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === " " && document.activeElement === containerRef.current) {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying]);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full bg-black group flex flex-col justify-center overflow-hidden outline-none mx-auto shadow-2xl ${isFullscreen ? 'h-full rounded-none' : 'aspect-video rounded-[2rem]'}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      onClick={togglePlay}
      tabIndex={0}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        className={`w-full h-full object-contain ${!isPlaying && !hasInteracted ? 'opacity-80' : 'opacity-100'} transition-opacity duration-500 cursor-pointer`}
        preload="metadata"
        playsInline
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => {
          setIsPlaying(false);
          if (audioRef.current) audioRef.current.pause();
        }}
        onPlay={() => {
          setIsPlaying(true);
          if (audioRef.current) {
            audioRef.current.currentTime = (videoRef.current?.currentTime || 0) + 150;
            audioRef.current.play().catch(() => {});
          }
        }}
        onPause={() => {
          setIsPlaying(false);
          if (audioRef.current) audioRef.current.pause();
        }}
      />
      <audio 
        ref={audioRef}
        src="/cancion.mp3"
        preload="auto"
        muted={isMuted}
      />

      {/* Floating Action Button for Play/Pause - Modern Design (Centered) */}
      <AnimatePresence>
        {!isPlaying && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
          >
            <button 
              onClick={togglePlay}
              onTouchEnd={togglePlay}
              className="pointer-events-auto w-20 h-20 md:w-24 md:h-24 bg-white/20 backdrop-blur-md border border-white/40 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(0,0,0,0.3)] hover:bg-white/30 hover:scale-105 active:scale-95 text-white transition-all duration-300"
            >
              <Play className="w-8 h-8 md:w-10 md:h-10 ml-1.5 md:ml-2 fill-current" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* YouTube Style Controls Bar */}
      <div 
        className={`absolute bottom-0 left-0 right-0 px-4 pt-16 pb-3 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300 ${(!isPlaying || showControls) ? 'opacity-100' : 'opacity-0'} flex flex-col gap-1`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Exact YT Style Progress Line */}
        <div className="w-full relative flex items-center group/scrub h-4 cursor-pointer -mt-2">
          <input 
            type="range" 
            min="0" 
            max="100" 
            step="0.1"
            value={progress || 0} 
            onChange={handleSeek}
            className="w-full appearance-none bg-transparent h-[3px] group-hover/scrub:h-[5px] cursor-pointer transition-all duration-150 absolute z-10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-0 [&::-webkit-slider-thumb]:h-0 group-hover/scrub:[&::-webkit-slider-thumb]:w-3 group-hover/scrub:[&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-brand-orange [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:transition-all [&::-moz-range-thumb]:w-0 [&::-moz-range-thumb]:h-0 group-hover/scrub:[&::-moz-range-thumb]:w-3 group-hover/scrub:[&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:bg-brand-orange [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:rounded-full"
            style={{
              background: `linear-gradient(to right, #f58220 ${progress}%, rgba(255, 255, 255, 0.3) ${progress}%, rgba(255, 255, 255, 0.3) 100%)`
            }}
          />
        </div>

        {/* Bottom Controls row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={togglePlay} className="text-white hover:text-brand-orange transition-colors p-1" title={isPlaying ? "Pausar" : "Reproducir"}>
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>
            
            <div className="flex items-center gap-2 group/vol">
              <button onClick={toggleMute} className="text-white hover:text-brand-orange transition-colors p-1" title={isMuted ? "Activar sonido" : "Silenciar"}>
                {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-0 opacity-0 group-hover/vol:w-16 group-hover/vol:opacity-100 h-1 bg-white/30 rounded-full appearance-none flex cursor-pointer accent-white transition-all duration-300 origin-left"
                style={{
                  background: `linear-gradient(to right, white ${(isMuted ? 0 : volume) * 100}%, rgba(255, 255, 255, 0.3) ${(isMuted ? 0 : volume) * 100}%)`
                }}
              />
            </div>

            <div className="text-white/90 text-xs font-medium tracking-wide ml-2 select-none font-mono">
              {formatTime(currentTime)} <span className="text-white/40 mx-1 font-sans">/</span> {formatTime(duration)}
            </div>
          </div>

          <div className="flex items-center gap-3 pr-2">
             <button onClick={toggleFullscreen} className="text-white hover:text-brand-orange transition-colors p-1" title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}>
               {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
});

// --- Types ---
interface Strength {
  id: string;
  title: string;
  description: string;
  intro: string;
  items: (string | { label: string; subItems: string[] })[];
  image?: string;
  collage?: string[];
  keywords: string[];
  icon: React.ReactNode;
}

interface Sector {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  details?: {
    intro?: string;
    groups: { title: string; items: string[] }[];
  };
}

// --- Data ---
const STRENGTHS: Strength[] = [
  {
    id: 'pa1',
    title: 'Pisos para uso comercial e industrial',
    description: 'Ingeniería aplicada para durabilidad y estética superior.',
    icon: <Layers className="w-5 h-5" />,
    intro: 'Donde la eficiencia del proceso comienza desde la base, con pisos de altos niveles de calidad, seguridad y estética.',
    keywords: ['Instalación de concreto para pisos', 'tratamientos químicos', '(DPA)', 'concretos oxidados', 'sello de juntas', 'sobre pisos', 'concretos aligerados', 'acabados decorativos'],
    items: [
      'Instalación de concreto para pisos con altos estándares de precisión y acabado',
      'Tratamientos químicos. Curado y densificado superficial.',
      'Desbaste, pulido y abrillantado (DPA) hasta acabado espejo con apariencia sal y pimienta',
      'Acabados químicos, concretos oxidados en variedad de colores y diseños',
      {
        label: 'Sello de juntas',
        subItems: [
          'Con poliuretano flexible resistentes a intemperie y a los rayos UV',
          'Con epóxicos semirigidos para losas estables',
          'Con poliurea de curado rápido para interiores',
          'Con polisulfuro químico-resistente'
        ]
      },
      'Nivelación de superficies con sobre pisos para recibir acabados de madera de ingeniería, laminados, vinílicos, de madera sólida o deck.',
      'Concretos aligerados de fraguado rápido para sobre pisos en edificaciones',
      'Acabados decorativos a base de resinas y agregados multicolor'
    ]
  },
  {
    id: 'pa2',
    title: 'PISOS EPÓXICOS DE ALTO VALOR',
    description: 'Diseños vanguardistas con resinas de alta calidad.',
    icon: <Zap className="w-5 h-5" />,
    intro: 'Donde se puede jugar con ideas de decoración vanguardistas e innovadoras en una amplia gama de colores y texturas con diseños originales, creativos y personalizados.',
    keywords: ['Epóxico autonivelante', 'mate', 'marmoleado', 'hojuelas', 'cuarzo multicolor', 'brillante o satinado'],
    items: [
      'Epóxico autonivelante. Fácil de limpiar, totalmente liso, en tono mate que oculta imperfecciones del firme ideal para showrooms, hospitales, oficinas.',
      'Porcelanato líquido marmoleado. Con vetas de pigmentos metalizados para crear un efecto mármol, nubes o dar profundidad (3D). Su mercado es el residencial de alto nivel.',
      'Con agregados de hojuelas plásticas o metálicas en mezclas de colores con textura lisa o antiderrapante aplicados frecuentemente en balnearios u otras instalaciones de esparcimiento. Balance perfecto entre estética y funcionalidad.',
      'Con agregados de cuarzo multicolor. Son de alta resistencia con textura lisa o antiderrapante frecuentemente encontrados en instalaciones comerciales.',
      'Nivelante epóxico brillante o satinado. Color uniforme y de apariencia simple limpia, utilizados en industrias, almacenes o estacionamientos interiores.'
    ]
  },
  {
    id: 'pa3',
    title: 'ACABADOS INDUSTRIALES DE ALTA GAMA',
    description: 'Protección crítica para entornos químicos exigentes.',
    icon: <ShieldCheck className="w-5 h-5" />,
    intro: 'Verdadera ingeniería aplicada en materiales poliméricos con altas prestaciones y gran nivel de seguridad.',
    keywords: ['químico-resistentes', 'inmersión contínua', 'reforzados', 'ladrillos y losetas', 'Recubrimientos ahulados', 'resistencia térmica', 'En húmedo', 'En seco', 'resistencia mecánica', 'abuso físico', 'dieléctricas', 'Conductivos', 'Antiestáticos', 'requerimientos sanitarios', '(FDA)', '(USDA)', '(COFEPRIS)', '(SENESICA)', '(NSF)'],
    items: [
      {
        label: 'Recubrimientos químico-resistentes para el control de la corrosión.',
        subItems: [
          'Desde recubrimientos delgados para salpicaduras o derrames ocasionales hasta sistemas robustos para inmersión contínua.',
          'Revestimientos reforzados con fibra de vidrio, saturada con resina epóxica, poliéster, viniliéster, novolac, o híbrida.',
          'Para servicios químicos y térmicos extremos usando ladrillos y losetas antiácidas asentados y emboquillados con mortero químico-resistente.',
          'Recubrimientos ahulados para pipas, tanques de almacenamiento, reactores, tubería de interconexión y otros equipos con servicios que impliquen simultaneamente abrasión, vibración, temperatura y ambiente químico.'
        ]
      },
      {
        label: 'Acabados con resistencia térmica y fatiga física',
        subItems: [
          'En húmedo: desde temperaturas de congelación de -40°C hasta derrames calientes, incluso limpieza con vapor saturado.',
          'En seco: por temperatura radial de fuentes de calor cercanas debajo de calderas u hornos'
        ]
      },
      {
        label: 'Con resistencia mecánica',
        subItems: [
          'Recubrimientos con gran desempeño en pisos expuestos al abuso físico por abrasión, arrastres o impactos.'
        ]
      },
      {
        label: 'Acabados para pisos con propiedades dieléctricas',
        subItems: [
          'Conductivos o disipativos de cargas eléctricas hacia tierras físicas',
          'Antiestáticos que previenen la acumulación de electricidad estática.'
        ]
      },
      {
        label: 'Con recubrimientos sanitarios y facilidad de limpieza',
        subItems: [
          'Recubrimientos que cumplen con regulaciones estadounidences como la:',
          'Administración de Alimentos y Medicamentos (FDA)',
          'Departamento de Agricultura (USDA)',
          'Entidades mexicanas como la:',
          'Comisión Federal para la Protección contra Riesgos Sanitarios (COFEPRIS)',
          'Servicio Nacional de Sanidad, Inocuidad y Calidad Agroalimentaria (SENESICA)',
          'Organizaciones independientes globales como la:',
          'National Science Foundation (NSF) dedicada a la salud, seguridad pública y medio ambiente, especializada en la certificación, auditorías y gestión de riesgos de materiales y productos que estarán en contacto directo o indirecto con alimentos y bebidas de consumo humano.'
        ]
      }
    ]
  },
  {
    id: 'pa4',
    title: 'REPARACIÓN Y MANTENIMIENTO DE CONCRETO',
    description: 'Restauración técnica y mantenimiento estructural.',
    icon: <Wrench className="w-5 h-5" />,
    intro: 'Donde las condiciones de operación están cimentadas en elementos de concreto siempre sano y resistente.',
    keywords: ['Bacheos', 'cortos tiempos de paro', 'Renivelar', 'planicidad', 'reparación', 'juntas', 'cámaras de refrigeración', 'Inyección', 'grietas', 'Resanador', 'Estabilizar losas', 'Reforzar', 'estructural', 'fibra de carbón', 'Obturadores', 'filtraciones'],
    items: [
      'Bacheos en pasillos o vialidades críticas con cortos tiempos de paro',
      'Renivelar áreas con sobre pisos delgados usando concretos formulados para fraguado rápido de hasta 500 kg/cm²',
      'Recuperar planicidad en pisos con nivelantes cementicios',
      'Morteros epóxicos para reparación de aristas en cortes de juntas entre losas',
      'Regenerar pisos de cámaras de refrigeración',
      'Inyección presurizada de adhesivo epóxico en grietas de pisos, muros y elementos estructurales',
      'Resanador époxico o cementicio en concretos muy porosos o con oquedades',
      'Estabilizar losas con movimiento al paso de montacargas por fallas en la terracería inyectando mortero fluido como relleno de expansión controlada,',
      'Reforzar concreto estructural usando polímeros y mallas de fibra de carbón (silos, puentes, trabes y columnas de carga).',
      'Obturadores de fraguado rápido para filtraciones o salidas activas de agua en cisternas, ya sea por carga hidrostática o por nivel freático.'
    ]
  },
  {
    id: 'pa5',
    title: 'IMPERMEABILIZACIÓN',
    description: 'Sistemas avanzados contra filtraciones y humedad.',
    icon: <Droplets className="w-5 h-5" />,
    intro: 'Donde existe flujo de agua a través de elementos de concreto con agrietamientos, segregación de cargas, juntas o porosidad en la superficie.',
    keywords: ['poliurea', 'Sistemas vehiculares', 'para estacionamientos', 'cisternas de agua potable', 'Obturadores', 'filtraciones', 'Prefabricados'],
    items: [
      'Aplicación de poliurea por proyección',
      'Sistemas vehiculares en cubiertas exteriores (aún en condiciones de agrietamiento) para estacionamientos comerciales e institucionales',
      'Impermeabilizantes cementícios por cristalización para interior de cisternas de agua potable u otros elementos de concreto e inmersión',
      'Obturadores de fraguado rápido para sello de filtraciones activas de agua por carga hidrostática o por nivel freático',
      'Prefabricados, acrílicos, térmicos (techos frescos) para cubiertas y muros'
    ]
  },
  {
    id: 'pa6',
    title: 'PINTURAS Y ACABADOS ESPECIALES',
    description: 'Protección estética y funcional de alta durabilidad.',
    icon: <Paintbrush className="w-5 h-5" />,
    intro: 'Impacto positivo en clientes y visitantes a través del cuidado, conservación, limpieza y seguridad de sus áreas operativas.',
    keywords: ['epóxi-poliuretano', 'Acabados sanitarios', 'muros y plafones', 'Curvas sanitarias', 'fotoluminiscentes', 'Pintura sobre equipos oxidados', 'Pintura de maquinaria', 'tubería y estructuras', 'Acabados antiadherentes'],
    items: [
      'Sistemas epóxi-poliuretano como acabado en pisos para servicios ligeros',
      'Acabados sanitarios lisos, continuos, sin bordes, y antibacteriales en muros y plafond',
      'Curvas sanitarias en uniones entre pisos, muros y plafond para espacios siempre limpios',
      'Señalizaciones fotoluminiscentes para sitios especiales',
      'Pintura sobre equipos oxidados aún con dificultad para limpieza y preparación previa',
      'Pintura de maquinaria con contaminación superficial por aceites lubricantes',
      'Pintura en tubería y estructuras expuestas a vapores',
      'Acabados antiadherentes con nanotecnología, fáciles de limpiar, repulsivos a la humedad, a los aceites, a la acumulación de suciedad, y a la formulación de hongos en muros y elementos expuestos a la intemperie'
    ]
  },
  {
    id: 'pa7',
    title: 'SISTEMAS CORTAFUEGO Y PROTECCIÓN PASIVA',
    description: 'Contención y limitación de riesgos críticos de incendio.',
    icon: <Flame className="w-5 h-5" />,
    intro: 'Como elemento de seguridad adicional para proteger vidas y salvaguardar instalaciones porque el fuego no se controla, se contiene y se limita.',
    keywords: ['(intumescentes)', 'Sellado de pasos de instalaciones', 'Sello de juntas'],
    items: [
      'Instalación de retardantes de fuego (intumescentes)',
      'Sellado de pasos de instalaciones (tubería, líneas de cableado) a través de muros y juntas de construcción',
      'Sello de juntas en el remate de muros y techos metálicos'
    ]
  },
  {
    id: 'pa8',
    title: 'ESPECIALIDADES COMPLEMENTARIAS',
    description: 'Intervenciones técnicas de precisión para equipos especiales.',
    icon: <HardHat className="w-5 h-5" />,
    intro: 'Materiales de especialidad que requieren instalación profesional para su buen desempeño',
    keywords: ['Espuma de poliuretano', 'aislante térmico', 'ruido', 'Juntas de expansión en puentes', 'WABO', 'Grouts de precisión', 'Asentamiento', 'maquinaria', 'Fabricación de equipos de acero', 'equipos especiales', 'Limpieza', 'Química y mecánica', 'Linnings', 'usando lámina de acero'],
    items: [
      {
        label: 'Espuma de poliuretano en diversos espesores',
        subItems: [
          'Recubrimiento ligero (32kg/m³) como aislante térmico y como reductor de ruido. Aplicable en cubiertas de lámina de techumbres o bien, para muros de cuartos de refrigeración.'
        ]
      },
      {
        label: 'Juntas de expansión en puentes',
        subItems: [
          'Instalación de juntas WABO (Watson Bowman Acme): Elastoflex Bridge para movimientos ligeros o Modular para movimientos severos en el control de la expansión de puentes.'
        ]
      },
      {
        label: 'Grouts de precisión',
        subItems: [
          'Asentamiento especializado de maquinaria y equipo (rotativo o vibratorio) usando grouts, libres de contracciones al curado'
        ]
      },
      {
        label: 'Fabricación de equipo de acero',
        subItems: [
          'Tanques, equipos especiales, tubería y accesorios en fibra de vidrio, acero inoxidable y acero al carbón recubierto.'
        ]
      },
      {
        label: 'Limpieza de equipo de acero',
        subItems: [
          'Química y mecánica: Sand blast a metal blanco y metal comercial, hidroblast, pasivado, decapado, desincrustación química y barrido de tubería'
        ]
      },
      {
        label: 'Linnings para encapsular y proteger instalaciones de concreto',
        subItems: [
          'Para fosas, diques, trincheras usando lámina de acero inoxidable en diversos calibres , o bien, hojas de poliestireno aportando resistencia mecánica y estabilidad ante agentes químicos.'
        ]
      }
    ]
  }
];

const BEFORE_AFTER_PAIRS = [
  {
    id: 'case1',
    title: 'Caso de Éxito 1',
    description: 'Transformación y recuperación de superficies industriales.',
    before: 'https://images2.imgbox.com/af/5e/wsIEHA08_o.jpg',
    after: 'https://images2.imgbox.com/8c/e2/dancwYF1_o.jpg'
  },
  {
    id: 'case2',
    title: 'Caso de Éxito 2',
    description: 'Nivelación y acabado resistente de alto desempeño.',
    before: 'https://images2.imgbox.com/e2/b1/jFHrF04P_o.jpg',
    after: 'https://images2.imgbox.com/dc/78/Vdt4qzQ3_o.jpg'
  },
  {
    id: 'case3',
    title: 'Caso de Éxito 3',
    description: 'Restauración profunda y recubrimiento protector.',
    before: 'https://images2.imgbox.com/40/7c/VIDPBh84_o.jpg',
    after: 'https://images2.imgbox.com/7d/5d/Ewf4uEcE_o.jpg'
  },
  {
    id: 'case4',
    title: 'Caso de Éxito 4',
    description: 'Soluciones duraderas para áreas de tráfico severo.',
    before: 'https://images2.imgbox.com/e4/b6/fjT1RFET_o.jpg',
    after: 'https://images2.imgbox.com/fc/04/Z4NXVOoQ_o.jpg'
  },
  {
    id: 'case5',
    title: 'Caso de Éxito 5',
    description: 'Aplicación de sistemas de protección y acabados de alta calidad.',
    before: 'https://images2.imgbox.com/39/54/Id0Pii6t_o.jpg',
    after: 'https://images2.imgbox.com/ff/2b/2toaJPpW_o.jpg'
  },
  {
    id: 'case6',
    title: 'Caso de Éxito 6',
    description: 'Renovación de instalaciones con acabado estético impecable.',
    before: 'https://images2.imgbox.com/8e/bc/6xiopQMz_o.jpeg',
    after: 'https://images2.imgbox.com/37/1e/QP6E8I7q_o.jpeg'
  },
  {
    id: 'case7',
    title: 'Caso de Éxito 7',
    description: 'Mantenimiento integral y durabilidad prolongada.',
    before: 'https://images2.imgbox.com/a3/7e/kf0mogLt_o.jpeg',
    after: 'https://images2.imgbox.com/2f/5b/Q0GbGWpl_o.jpeg'
  },
  {
    id: 'case8',
    title: 'Caso de Éxito 8',
    description: 'Recuperación de brillo y resistencia de superficies degradadas.',
    before: 'https://images2.imgbox.com/4d/f6/M6Qrnsfl_o.jpeg',
    after: 'https://images2.imgbox.com/50/29/3D2Zh5mJ_o.jpg'
  },
  {
    id: 'case9',
    title: 'Caso de Éxito 9',
    description: 'Protección anticorrosiva para entornos exigentes.',
    before: 'https://images2.imgbox.com/e9/db/BjTHRJDu_o.jpeg',
    after: 'https://images2.imgbox.com/31/ec/jJ2i1pBZ_o.jpeg'
  },
  {
    id: 'case10',
    title: 'Caso de Éxito 10',
    description: 'Eliminación de daños estructurales mediante recubrimientos avanzados.',
    before: 'https://images2.imgbox.com/fa/7d/TDea6Iwx_o.jpeg',
    after: 'https://images2.imgbox.com/fa/e6/FBvq9fDK_o.jpeg'
  },
  {
    id: 'case11',
    title: 'Caso de Éxito 11',
    description: 'Tratamiento sellante y nivelador permanente.',
    before: 'https://images2.imgbox.com/14/64/JH5fSihJ_o.jpeg',
    after: 'https://images2.imgbox.com/62/aa/FvTTrvLo_o.jpeg'
  },
  {
    id: 'case12',
    title: 'Caso de Éxito 12',
    description: 'Recuperación de estética y funcionalidad total.',
    before: 'https://images2.imgbox.com/e1/ce/mJMEDX1z_o.jpeg',
    after: 'https://images2.imgbox.com/07/92/bbEi5xTg_o.jpeg'
  },
  {
    id: 'case13',
    title: 'Caso de Éxito 13',
    description: 'Transformación y recuperación de superficies.',
    before: 'https://images2.imgbox.com/31/da/J2vpLZYD_o.jpeg',
    after: 'https://images2.imgbox.com/b8/b0/JfWJnP14_o.jpeg'
  },
  {
    id: 'case14',
    title: 'Caso de Éxito 14',
    description: 'Nivelación y protección duradera.',
    before: 'https://images2.imgbox.com/8a/ca/fAv1c6kg_o.jpeg',
    after: 'https://images2.imgbox.com/d4/86/zKFPhqMi_o.jpeg'
  },
  {
    id: 'case15',
    title: 'Caso de Éxito 15',
    description: 'Mantenimiento integral correctivo.',
    before: 'https://images2.imgbox.com/7d/6d/qB1LdmEE_o.jpeg',
    after: 'https://images2.imgbox.com/a1/4f/iPc1dSbL_o.jpeg'
  },
  {
    id: 'case16',
    title: 'Caso de Éxito 16',
    description: 'Soluciones especiales para control de calidad.',
    before: 'https://images2.imgbox.com/e0/c8/WzvkrASE_o.jpeg',
    after: 'https://images2.imgbox.com/03/79/1zmZdpVx_o.jpeg'
  }
];

const GALLERY_IMAGES = [
  { url: 'https://images2.imgbox.com/af/5e/wsIEHA08_o.jpg', title: 'Piso Industrial de Alta Precisión' },
  { url: 'https://images2.imgbox.com/8c/e2/dancwYF1_o.jpg', title: 'Piso Industrial de Alta Precisión' },
  { url: 'https://images2.imgbox.com/e2/b1/jFHrF04P_o.jpg', title: 'Acabados Químico-Resistentes' },
  { url: 'https://images2.imgbox.com/dc/78/Vdt4qzQ3_o.jpg', title: 'Acabados Químico-Resistentes' },
  { url: 'https://images2.imgbox.com/40/7c/VIDPBh84_o.jpg', title: 'Laboratorio con Piso Epóxico' },
  { url: 'https://images2.imgbox.com/7d/5d/Ewf4uEcE_o.jpg', title: 'Laboratorio con Piso Epóxico' },
  { url: 'https://images2.imgbox.com/e4/b6/fjT1RFET_o.jpg', title: 'Mantenimiento de Superficies' },
  { url: 'https://images2.imgbox.com/fc/04/Z4NXVOoQ_o.jpg', title: 'Mantenimiento de Superficies' },
  { url: 'https://images2.imgbox.com/39/54/Id0Pii6t_o.jpg', title: 'Instalación de Recubrimientos' },
  { url: 'https://images2.imgbox.com/ff/2b/2toaJPpW_o.jpg', title: 'Instalación de Recubrimientos' },
  { url: 'https://images2.imgbox.com/8e/bc/6xiopQMz_o.jpeg', title: 'Personal Altamente Capacitado' },
  { url: 'https://images2.imgbox.com/37/1e/QP6E8I7q_o.jpeg', title: 'Personal Altamente Capacitado' },
  { url: 'https://images2.imgbox.com/a3/7e/kf0mogLt_o.jpeg', title: 'Infraestructura Industrial' },
  { url: 'https://images2.imgbox.com/2f/5b/Q0GbGWpl_o.jpeg', title: 'Infraestructura Industrial' },
  { url: 'https://images2.imgbox.com/4d/f6/M6Qrnsfl_o.jpeg', title: 'Proyectos de Gran Escala' },
  { url: 'https://images2.imgbox.com/5a/d4/TPmWyNy6_o.jpeg', title: 'Proyectos de Gran Escala' },
  { url: 'https://images2.imgbox.com/e9/db/BjTHRJDu_o.jpeg', title: 'Estructuras Metálicas' },
  { url: 'https://images2.imgbox.com/31/ec/jJ2i1pBZ_o.jpeg', title: 'Estructuras Metálicas' },
  { url: 'https://images2.imgbox.com/fa/7d/TDea6Iwx_o.jpeg', title: 'Control de Corrosión' },
  { url: 'https://images2.imgbox.com/fa/e6/FBvq9fDK_o.jpeg', title: 'Control de Corrosión' },
  { url: 'https://images2.imgbox.com/14/64/JH5fSihJ_o.jpeg', title: 'Ingeniería de Detalle' },
  { url: 'https://images2.imgbox.com/62/aa/FvTTrvLo_o.jpeg', title: 'Ingeniería de Detalle' },
  { url: 'https://images2.imgbox.com/e1/ce/mJMEDX1z_o.jpeg', title: 'Mantenimiento Preventivo' },
  { url: 'https://images2.imgbox.com/07/92/bbEi5xTg_o.jpeg', title: 'Mantenimiento Preventivo' },
  { url: 'https://images2.imgbox.com/31/da/J2vpLZYD_o.jpeg', title: 'Procesos Industriales' },
  { url: 'https://images2.imgbox.com/b8/b0/JfWJnP14_o.jpeg', title: 'Procesos Industriales' },
  { url: 'https://images2.imgbox.com/8a/ca/fAv1c6kg_o.jpeg', title: 'Almacenamiento Logístico' },
  { url: 'https://images2.imgbox.com/d4/86/zKFPhqMi_o.jpeg', title: 'Almacenamiento Logístico' },
  { url: 'https://images2.imgbox.com/7d/6d/qB1LdmEE_o.jpeg', title: 'Tecnología Polimérica' },
  { url: 'https://images2.imgbox.com/a1/4f/iPc1dSbL_o.jpeg', title: 'Tecnología Polimérica' },
  { url: 'https://images2.imgbox.com/e0/c8/WzvkrASE_o.jpeg', title: 'Infraestructura de Datos' },
  { url: 'https://images2.imgbox.com/03/79/1zmZdpVx_o.jpeg', title: 'Infraestructura de Datos' }
];

const TESTIMONIALS = [
  {
    name: "Ing. Ricardo Méndez",
    company: "Planta Automotriz Bajío",
    text: "Teníamos un problema serio de desprendimiento en los pasillos de carga. Polycovers no solo reparó el concreto, sino que nos dio una solución que ha aguantado el tráfico pesado por más de 2 años sin un solo bache. Se nota que saben lo que hacen.",
    rating: 5
  },
  {
    name: "Dra. Elena Vargas",
    company: "Laboratorios BioTech",
    text: "Lo que más valoro es la limpieza y el orden con el que trabajaron. En un entorno de laboratorio, el polvo es nuestro enemigo. Polycovers instaló el piso epóxico con un control de contaminación increíble. ¡Altamente recomendados!",
    rating: 5
  },
  {
    name: "Arq. Carlos Ruiz",
    company: "Constructora Global MX",
    text: "He trabajado con muchos contratistas, pero pocos tienen el nivel de respuesta de Polycovers. Si surge un detalle en obra a las 10 de la noche, el CEO te contesta y te resuelve. Esa tranquilidad no tiene precio.",
    rating: 5
  },
  {
    name: "Lic. Martha Solís",
    company: "Almacenes Logis-Mex",
    text: "Nuestros pisos estaban 'llorando' humedad y nada pegaba. Polycovers hizo un diagnóstico profundo, aplicó una barrera de vapor y el acabado final quedó perfecto. Nos ahorraron miles de pesos en retrabajos.",
    rating: 5
  },
  {
    name: "Ing. Javier Torres",
    company: "Refinería del Norte",
    text: "La aplicación de poliurea en nuestros diques de contención fue un éxito. El equipo de Polycovers está muy bien capacitado y cumplen con todas las normas de seguridad industrial que exigimos.",
    rating: 5
  }
];

const SECTORS: Sector[] = [
  {
    id: 's1',
    title: 'Industria Alimenticia y Sector Salud',
    description: 'Materiales en cumplimiento con regulaciones de la FDA, USDA (EEUU), y COFEPRIS, SENASICA (Méx).',
    icon: <Droplets className="w-6 h-6" />,
    details: {
      groups: [
        {
          title: 'Industria alimenticia',
          items: ['Cárnica y avícola', 'Empacadora de vegetales', 'Envasado de frutas', 'Producción de aceite', 'Leche y derivados', 'Panificación y repostería', 'Dulces y chocolates', 'Ingenios', 'Bebidas alcohólicas', 'Refresquera, aguas y jugos', 'Industria del café']
        },
        {
          title: 'Industria de la salud',
          items: ['Clínicas y hospitales', 'Laboratorios clínicos', 'Industria farmacéutica', 'Cosméticos y cuidado personal', 'Biotecnología industrial', 'Accesorios y materiales quirúrgicos']
        }
      ]
    }
  },
  {
    id: 's2',
    title: 'Industria de la Construcción',
    description: 'Obras de infraestructura con instalación de equipamiento especializado.',
    icon: <Building2 className="w-6 h-6" />,
    details: {
      groups: [
        {
          title: 'Servicios',
          items: ['Instalación de pisos de concreto', 'Reparación y mantenimiento de concreto', 'Sello de juntas', 'Acabados decorativos', 'Impermeabilización', 'Acabados industriales de alta gama']
        }
      ]
    }
  },
  {
    id: 's3',
    title: 'Instalaciones Comerciales y Recreación',
    description: 'Donde se busca que la imagen de la empresa impacte positivamente a clientes y visitantes.',
    icon: <ShoppingBag className="w-6 h-6" />,
    details: {
      groups: [
        {
          title: 'Recreación y esparcimiento',
          items: ['Hoteles & Spa', 'Restaurantes', 'Bares, cafeterías', 'Salas de cine y teatro', 'Parques temáticos', 'Casinos', 'Balnearios', 'Clubes deportivos']
        },
        {
          title: 'Empresas de Comercio',
          items: ['Tiendas departamentales', 'Supermercados', 'Centros de distribución', 'Almacenes y bodegas', 'Centrales de abasto', 'Paquetería y envíos', 'Tiendas especializadas']
        }
      ]
    }
  },
  {
    id: 's4',
    title: 'Industria de Bienes de Consumo',
    description: 'Protección de activos de producción para garantizar una rápida rotación de inventarios.',
    icon: <Truck className="w-6 h-6" />,
    details: {
      groups: [
        {
          title: 'Sectores',
          items: ['Industria del plástico y reciclado', 'Automotriz y proveedores', 'TI, software y telecomunicaciones', 'Aparatos eléctricos y electrónicos', 'Electrodomésticos', 'Textil, cuero y calzado', 'Artes gráficas', 'Productos de limpieza', 'Gasolineras y talleres', 'Papeles', 'Alimentos y bebidas']
        }
      ]
    }
  },
  {
    id: 's5',
    title: 'Industria Pesada',
    description: 'Protección de la operación con polímeros de alta gama para desgaste severo.',
    icon: <Factory className="w-6 h-6" />,
    details: {
      groups: [
        {
          title: 'Sectores',
          items: ['Minería', 'Química', 'Petroquímica', 'Cementera', 'Metal-mecánica', 'Generación de electricidad', 'Recuperación y refinación de metales']
        }
      ]
    }
  },
  {
    id: 's6',
    title: 'Almacenamiento y Logística',
    description: 'Eficiencia desde la base con pisos de altos niveles de seguridad y calidad.',
    icon: <Layers className="w-6 h-6" />,
    details: {
      groups: [
        {
          title: 'Infraestructura',
          items: ['Centros de distribución', 'Almacenes de manejo de productos', 'Resguardo de bienes perecederos', 'Instalaciones libres de cargas estáticas', 'Resguardo de medicamentos']
        }
      ]
    }
  }
];

// --- Helper Components ---

const HighlightText = memo(({ text, keywords, isIntro = false }: { text: string; keywords: string[]; isIntro?: boolean }) => {
  if (isIntro) {
    return <span className="text-brand-orange font-bold">{text}</span>;
  }

  let parts = [text];
  keywords.forEach(keyword => {
    const newParts: string[] = [];
    parts.forEach(part => {
      if (typeof part !== 'string') {
        newParts.push(part);
        return;
      }
      const regex = new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      const split = part.split(regex);
      newParts.push(...split);
    });
    parts = newParts;
  });

  return (
    <>
      {parts.map((part, i) => {
        const isKeyword = keywords.some(k => k.toLowerCase() === part.toLowerCase());
        return isKeyword ? (
          <span key={i} className="text-brand-orange font-bold">{part}</span>
        ) : (
          <span key={i}>{part}</span>
        );
      })}
    </>
  );
});

const Counter = memo(({ target }: { target: number }) => {
  const [count, setCount] = useState(0);
  const nodeRef = useRef(null);
  const isInView = useInView(nodeRef, { once: true, amount: 0.5 });

  useEffect(() => {
    if (isInView) {
      const controls = animate(0, target, {
        duration: 2,
        ease: "easeOut",
        onUpdate: (value) => setCount(Math.floor(value)),
      });
      return () => controls.stop();
    }
  }, [isInView, target]);

  return <span ref={nodeRef}>{count}</span>;
});

// --- AI Configuration ---
const SYSTEM_INSTRUCTION = `Eres el asistente amigable de MCI Soluciones Poliméricas. Tu personalidad es cálida, cercana y dispuesta a ayudar.

Tu tono es:
- Amigable y entusiasta, pero manteniendo el profesionalismo.
- Sencillo de entender (evita tecnicismos innecesarios a menos que te los pidan).
- Cálido: Saluda siempre con amabilidad y disposición.

Nuevas Capacidades Críticas:
1. ANÁLISIS DE IMÁGENES: Si el usuario sube una foto, analízala brevemente y da un pre-diagnóstico sencillo y amigable. Sugiere cómo podemos ayudar.
2. ASESORÍA RÁPIDA: Si el usuario describe un problema, ofrece una solución general corta e invítalo a contactarnos para más detalles.

Información Clave de la Empresa:
- Nombre: MCI Soluciones Poliméricas.
- Cobertura: Todo México.

Reglas de Oro:
- NUNCA uses formato markdown (NO uses **asteriscos** para negritas, ni formatos complejos). Solo texto plano normal claro y amigable.
- TUS RESPUESTAS DEBEN SER MUY CORTAS Y CONCISAS. Máximo 2 o 3 oraciones breves por respuesta. Ve directo al grano.
- NUNCA des precios exactos (indica que se requiere visita técnica).
- Si el problema es crítico, invítalo a contactarnos por WhatsApp.
- Usa lenguaje sencillo que cualquier persona pueda entender fácilmente.`;

// --- Main App Component ---

const BotAvatar = ({ isHappy, isThinking, className = "w-full h-full" }: { isHappy: boolean, isThinking: boolean, className?: string }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 100 100" className="w-[85%] h-[85%]">
        {/* Antenna */}
        <path d="M50 25 L50 12" stroke="#f8fafc" strokeWidth="4" strokeLinecap="round" />
        <motion.circle cx="50" cy="12" r="5" fill="#f58220" 
          animate={{ filter: ['brightness(1)', 'brightness(1.5)', 'brightness(1)'] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        
        {/* Head */}
        <path d="M 20 40 Q 20 30, 40 30 L 60 30 Q 80 30, 80 40 L 80 75 Q 80 85, 70 85 L 30 85 Q 20 85, 20 75 Z" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />
        
        {/* Ears */}
        <path d="M 20 45 L 14 45 Q 10 45, 10 50 L 10 60 Q 10 65, 14 65 L 20 65" fill="#cbd5e1" />
        <path d="M 80 45 L 86 45 Q 90 45, 90 50 L 90 60 Q 90 65, 86 65 L 80 65" fill="#cbd5e1" />
        
        {/* Screen / Visor */}
        <rect x="28" y="40" width="44" height="28" rx="8" fill="#0f172a" />
        
        {/* Eyes */}
        <motion.ellipse 
          cx="38" cy="54" rx="4" ry="5" fill="#00f2ff" 
          animate={
            isHappy ? { ry: [5, 1.5, 5], cy: [54, 52, 54] } :
            isThinking ? { cx: [36, 40, 36], rx: 4 } :
            { ry: [5, 1, 5] }
          }
          transition={
            isHappy ? { duration: 0.8, ease: "easeInOut" } :
            isThinking ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" } :
            { duration: 4, repeat: Infinity, times: [0, 0.05, 0.1], ease: "easeInOut" }
          }
        />
        <motion.ellipse 
          cx="62" cy="54" rx="4" ry="5" fill="#00f2ff" 
          animate={
            isHappy ? { ry: [5, 1.5, 5], cy: [54, 52, 54] } :
            isThinking ? { cx: [60, 64, 60], rx: 4 } :
            { ry: [5, 1, 5] }
          }
          transition={
            isHappy ? { duration: 0.8, ease: "easeInOut" } :
            isThinking ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" } :
            { duration: 4, repeat: Infinity, times: [0, 0.05, 0.1], ease: "easeInOut" }
          }
        />

        {/* Blush */}
        <circle cx="32" cy="62" r="3.5" fill="#f58220" opacity="0.6" filter="blur(1px)" />
        <circle cx="68" cy="62" r="3.5" fill="#f58220" opacity="0.6" filter="blur(1px)" />

        {/* Mouth/Smile line */}
        <motion.path 
          d="M 45 76 Q 50 80, 55 76" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round"
          animate={
            isHappy ? { d: "M 42 74 Q 50 84, 58 74" } :
            isThinking ? { d: "M 48 77 L 52 77" } :
            { d: "M 45 76 Q 50 80, 55 76" }
          }
        />
      </svg>
    </div>
  );
};

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Route-based smooth scrolling
  useEffect(() => {
    const currentPath = location.pathname;
    if (currentPath && currentPath.length > 1) {
      // e.g. "/sectores" -> "sectores"
      const targetId = currentPath.substring(1);
      
      const scrollToTarget = () => {
        if (targetId === 'inicio') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          const element = document.getElementById(targetId) || (targetId === 'contacto' ? document.getElementById('contacto-footer') : null);
          if (element) {
            const headerOffset = window.innerWidth < 768 ? 70 : 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - headerOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }
      };
      
      requestAnimationFrame(() => {
        setTimeout(scrollToTarget, 50);
      });
    }
  }, [location.pathname]);

  const [showMoreInfo, setShowMoreInfo] = useState(false);

  // Reiniciar scroll al inicio en cada actualización
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  const [activeStrength, setActiveStrength] = useState<Strength>(STRENGTHS[0]);
  const [isStrengthHovered, setIsStrengthHovered] = useState(false);
  const [activeSector, setActiveSector] = useState<string | null>(null);
  const [activeHeroAcc, setActiveHeroAcc] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [userInput, setUserInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [botExpression, setBotExpression] = useState<'idle' | 'happy' | 'thinking'>('idle');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Click outside to close chat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatContainerRef.current && !chatContainerRef.current.contains(event.target as Node)) {
        setIsChatOpen(false);
      }
    };
    if (isChatOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isChatOpen]);
  const [isResultsOpen, setIsResultsOpen] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    cargo: '',
    nombre: '',
    empresa: '',
    email: '',
    telefono: '',
    detalles: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (name: string, value: string) => {
    let error = '';
    switch (name) {
      case 'nombre':
        if (!value.trim()) error = 'El nombre es obligatorio';
        break;
      case 'email':
        if (!value.trim()) error = 'El correo es obligatorio';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Correo inválido';
        break;
      case 'telefono':
        if (!value.trim()) error = 'El teléfono es obligatorio';
        else if (!/^\d{10}$/.test(value.replace(/\D/g, ''))) error = 'Debe ser de 10 dígitos';
        break;
      case 'empresa':
        if (!value.trim()) error = 'La empresa es obligatoria';
        break;
      case 'detalles':
        if (!value.trim()) error = 'Los detalles son obligatorios';
        break;
    }
    return error;
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (touchedFields[name]) {
      const error = validateField(name, value);
      setFormErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleFieldBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouchedFields(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setFormErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    const newTouched: Record<string, boolean> = {};
    
    Object.keys(formData).forEach(key => {
      newTouched[key] = true;
      const error = validateField(key, formData[key as keyof typeof formData]);
      if (error) errors[key] = error;
    });
    
    setTouchedFields(newTouched);
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    // Simular envío
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsFormSubmitted(true);
    
    setFormData({
      cargo: '',
      nombre: '',
      empresa: '',
      email: '',
      telefono: '',
      detalles: ''
    });
  };

  const [chatMessages, setChatMessages] = useState<{type: 'bot' | 'user', text: string, image?: string}[]>([
    { type: 'bot', text: 'Hola. Soy el Asistente Virtual de MCI. ¿Cómo puedo ayudarte?' }
  ]);
  const handleResetChat = useCallback(() => {
    setChatMessages([
      { type: 'bot', text: 'Hola. Soy el Asistente Virtual de MCI. ¿Cómo puedo ayudarte?' }
    ]);
  }, []);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const strengthSheetRef = useRef<HTMLDivElement>(null);
  const strengthNavRef = useRef<HTMLDivElement>(null);

  // Click outside to close technical sheet
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // If clicking inside the sheet or inside the navigation grid, don't close
      const modal = document.getElementById('strength-modal-content');
      if (modal && modal.contains(event.target as Node)) {
        return;
      }
      setIsStrengthHovered(false);
    };
    if (isStrengthHovered) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isStrengthHovered]);

  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, scrollToBottom]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  }, []);

  const fileToGenerativePart = useCallback(async (file: File) => {
    const base64EncodedDataPromise = new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
      reader.readAsDataURL(file);
    });
    return {
      inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
  }, []);

  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentReadingId, setCurrentReadingId] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const readSectionsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const loadVoices = () => {
      setAvailableVoices(window.speechSynthesis.getVoices());
    };
    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const extractSectionText = useCallback((el: HTMLElement): string => {
    const elements = el.querySelectorAll('h1, h2, h3, h4, p, li');
    let textParts: string[] = [];
    
    elements.forEach(subEl => {
      const htmlEl = subEl as HTMLElement;
      // remove multiple spaces and non-standard characters
      const content = htmlEl.innerText?.trim().replace(/\s+/g, ' ').replace(/[-\/]/g, ' ');
      if (content && 
          content.length >= 3 && 
          !htmlEl.closest('button') && 
          !htmlEl.closest('nav') && 
          !htmlEl.closest('form')) {
        textParts.push(content);
      }
    });

    return textParts.join(". ");
  }, []);

  const speakText = useCallback((text: string, id: string) => {
    if (!text || readSectionsRef.current.has(id)) return;
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    
    // Replace known acronyms to sound natural
    const sanitizedText = text
      .replace(/\bMCI\b/g, " Eme Ce I ")
      .replace(/\s+/g, ' ');

    const utterance = new SpeechSynthesisUtterance(sanitizedText);
    const voices = availableVoices.length > 0 ? availableVoices : window.speechSynthesis.getVoices();
    // Prioritize natural sounding mexican or latam voices
    const mxVoice = voices.find(v => v.lang === 'es-MX' && v.name.includes('Google')) || 
                    voices.find(v => v.lang === 'es-MX') ||
                    voices.find(v => (v.name.includes('Luciana') || v.name.includes('Jorge')) && v.lang.includes('es')) ||
                    voices.find(v => v.lang.includes('es-US')) ||
                    voices.find(v => v.lang.includes('es'));
    
    if (mxVoice) utterance.voice = mxVoice;
    utterance.lang = 'es-MX';
    utterance.rate = 1.05; // Slightly faster to sound natural
    utterance.pitch = 1.0;
    
    utterance.onstart = () => {
      setCurrentReadingId(id);
      readSectionsRef.current.add(id);
    };

    utterance.onend = () => {
      setCurrentReadingId(null);
    };

    utterance.onerror = () => {
      setCurrentReadingId(null);
    };

    window.speechSynthesis.speak(utterance);
  }, [availableVoices]);

  const toggleSpeech = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setCurrentReadingId(null);
      readSectionsRef.current.clear();
    } else {
      setIsSpeaking(true);
      readSectionsRef.current.clear();
      
      // Leer lo que está visible actualmente primero
      const sections = document.querySelectorAll('section, header, footer');
      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          const text = extractSectionText(section as HTMLElement);
          const id = section.id || (section as HTMLElement).innerText.substring(0, 20);
          speakText(text, id);
          break;
        }
      }
    }
  }, [isSpeaking, speakText, extractSectionText]);

  // Observer para lectura adaptativa mientras se navega
  useEffect(() => {
    if (!isSpeaking) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
          const section = entry.target as HTMLElement;
          const sectionId = section.id || section.innerText.substring(0, 20);
          
          if (!readSectionsRef.current.has(sectionId)) {
            const text = extractSectionText(section);
            if (text.length > 20) {
              speakText(text, sectionId);
            }
          }
        }
      });
    }, { threshold: 0.4 });

    const sections = document.querySelectorAll('section, footer');
    sections.forEach(s => observer.observe(s));

    return () => {
      observer.disconnect();
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSpeaking, speakText, extractSectionText]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Efecto visual para resaltar la sección narrada
  useEffect(() => {
    if (currentReadingId) {
      const el = document.getElementById(currentReadingId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('reading-active');
        return () => el.classList.remove('reading-active');
      }
    }
  }, [currentReadingId]);

  const handleSendMessage = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!userInput.trim() && !selectedFile) || isTyping) return;

    const userMsg = userInput.trim();
    const currentFile = selectedFile;
    
    setUserInput('');
    setSelectedFile(null);
    
    let imageUrl = '';
    if (currentFile) {
      imageUrl = URL.createObjectURL(currentFile);
    }

    setChatMessages(prev => [...prev, { 
      type: 'user', 
      text: userMsg || (currentFile ? 'Analiza esta imagen, por favor.' : ''), 
      image: imageUrl 
    }]);
    
    setIsTyping(true);
    setBotExpression('thinking');

    try {
      let imagePart = null;
      if (currentFile) {
        imagePart = await fileToGenerativePart(currentFile);
      }

      const response = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userMsg, imagePart })
      });
      
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to fetch');
      }

      const data = await response.json();
      setChatMessages(prev => [...prev, { type: 'bot', text: data.text }]);
      
      setBotExpression('happy');
      setTimeout(() => setBotExpression('idle'), 3000);
    } catch (error: any) {
      console.error("AI Error Details:", error);
      const errorMsg = error?.message || "Error desconocido";
      setChatMessages(prev => [...prev, { type: 'bot', text: `Hubo un error al conectar con el asistente: ${errorMsg}. Por favor, intenta de nuevo.` }]);
    } finally {
      setIsTyping(false);
    }
  }, [userInput, selectedFile, isTyping, fileToGenerativePart]);

  const handleChatOption = useCallback((option: string, response: string) => {
    setChatMessages(prev => [...prev, { type: 'user', text: option }]);
    setIsTyping(true);
    setBotExpression('thinking');
    setTimeout(() => {
      setIsTyping(false);
      setChatMessages(prev => [...prev, { type: 'bot', text: response }]);
      setBotExpression('happy');
      setTimeout(() => setBotExpression('idle'), 3000);
    }, 1000);
  }, []);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isMenuOpen || selectedImage || isStrengthHovered) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = 'var(--removed-body-scroll-bar-size, 0px)';
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isMenuOpen, selectedImage, isStrengthHovered]);

  // Click outside to close mobile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Si el click es en el botón de menú, dejar que el onClick del botón lo maneje
      if (menuButtonRef.current && menuButtonRef.current.contains(event.target as Node)) {
        return;
      }
      
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const [pendingScrollId, setPendingScrollId] = useState<string | null>(null);

  // Keyboard controls for accessibility (Escape to close everything)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
        setIsStrengthHovered(false);
        setSelectedImage(null);
        setIsChatOpen(false);
        setIsQRModalOpen(false);
        setActiveSector(null);
        setActiveFaq(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Inline smooth scroll handler
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, href: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    setIsStrengthHovered(false);
    playClickSound();
    
    const targetId = href.startsWith('/') ? href.substring(1) : href.replace('#', '');
    
    // Logic for part-based section visibility
    const part1Ids = ['inicio', 'fortalezas', 'video-fortalezas'];
    const part2Ids = ['sectores', 'transformacion', 'galeria', 'testimonios', 'contacto', 'inicio-part2'];
    
    if (part1Ids.includes(targetId) && showMoreInfo) {
      setShowMoreInfo(false);
      setPendingScrollId(targetId);
      return;
    }
    
    if (part2Ids.includes(targetId) && !showMoreInfo) {
      setShowMoreInfo(true);
      setPendingScrollId(targetId);
      return;
    }

    const actualId = targetId === 'fortalezas' ? 'video-fortalezas' : targetId;
    const element = document.getElementById(actualId) || (actualId === 'contacto' ? document.getElementById('contacto-footer') : null);
    
    if (element) {
      const headerOffset = window.innerWidth < 768 ? 70 : 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    navigate(`/${targetId}`);
  };

  // Effect to handle pending scroll after Section 2 is revealed
  useEffect(() => {
    if (pendingScrollId) {
      const scrollToTarget = () => {
        const actualId = pendingScrollId === 'fortalezas' ? 'video-fortalezas' : pendingScrollId;
        const element = document.getElementById(actualId) || (actualId === 'contacto' ? document.getElementById('contacto-footer') : null);
        if (element) {
          const headerOffset = window.innerWidth < 768 ? 70 : 100;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
          navigate(`/${pendingScrollId}`);
        }
        setPendingScrollId(null);
      };
      
      const timer = setTimeout(scrollToTarget, 400);
      return () => clearTimeout(timer);
    }
  }, [showMoreInfo, pendingScrollId]);

  const navLinks = useMemo(() => [
    { name: 'Inicio', href: '/inicio' },
    { name: 'Sectores', href: '/sectores' },
    { name: 'Fortalezas', href: '/fortalezas' },
    { name: 'Contacto', href: '/contacto' }
  ], []);

  return (
    <div className="min-h-screen w-full bg-[#0a192f] text-white transition-colors duration-500 overflow-x-hidden relative font-sans">
      
      {/* Dynamic Background Elements for more vibrant feel */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 inset-x-0 h-full bg-gradient-to-br from-[#004b87]/30 via-[#3b82f6]/20 to-[#f58220]/10 mix-blend-overlay" />
        <div className="absolute -top-[20%] -left-[20%] w-[100vw] h-[100vw] rounded-full bg-[radial-gradient(circle,rgba(0,242,255,0.15)_0%,transparent_70%)] opacity-80 md:animate-blob mix-blend-multiply" />
        <div className="hidden md:block absolute top-[10%] -right-[20%] w-[80vw] h-[80vw] rounded-full bg-[radial-gradient(circle,rgba(0,75,135,0.15)_0%,transparent_70%)] opacity-80 animate-blob animation-delay-2000 mix-blend-multiply" />
        <div className="absolute -bottom-[20%] left-1/4 w-[100vw] h-[100vw] rounded-full bg-[radial-gradient(circle,rgba(245,130,32,0.1)_0%,transparent_70%)] opacity-80 md:animate-blob animation-delay-4000 mix-blend-multiply" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />
      </div>
      
      {/* Header / Navigation */}
      <header 
        className={`fixed top-0 left-0 right-0 z-[10000] transition-all duration-500 border-b ${
          isScrolled 
            ? 'bg-[#0a192f]/95 backdrop-blur-xl py-2 sm:py-3 shadow-[0_10px_40px_-15px_rgba(34,211,238,0.2)] border-[#22d3ee]/20' 
            : 'bg-[#0a192f]/40 backdrop-blur-md py-4 sm:py-5 border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-6 flex items-center justify-between">
          <a 
            href="#inicio" 
            className="flex items-center gap-3 sm:gap-4 group flex-shrink-0 cursor-pointer min-w-0"
            onClick={(e) => {
              setShowMoreInfo(false);
              handleSmoothScroll(e, '#inicio');
            }}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 flex items-center justify-center transition-transform duration-500 group-hover:scale-105 flex-shrink-0 drop-shadow-md">
              <img 
                src={logoBase64} 
                alt="Logo MCI" 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col notranslate min-w-0 justify-center" translate="no">
              <span className="text-base sm:text-lg md:text-2xl font-black tracking-tight leading-none flex flex-wrap gap-x-1.5 items-baseline lg:whitespace-nowrap">
                <span className="text-brand-orange">MCI</span>
                <span className="text-white transition-colors drop-shadow-sm">Soluciones</span>
              </span>
              <span className="text-[0.6rem] sm:text-[0.7rem] md:text-[0.8rem] font-bold uppercase tracking-[0.1em] sm:tracking-[0.2em] md:tracking-[0.25em] text-slate-300 mt-1 transition-colors leading-tight lg:whitespace-nowrap">Poliméricas</span>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6 lg:gap-10">
            {navLinks.map((link) => (
              <a 
                key={link.name}
                href={link.href}
                className="text-xs font-black uppercase tracking-[0.25em] text-slate-200 hover:text-brand-orange transition-all relative group/nav"
                onClick={(e) => handleSmoothScroll(e, link.href)}
              >
                {link.name}
                <span className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-brand-orange transition-all duration-300 group-hover/nav:w-full shadow-[0_0_8px_rgba(245,130,32,0.6)]" />
              </a>
            ))}
          </nav>

          <button 
            ref={menuButtonRef}
            className="lg:hidden relative z-[10001] text-brand-orange hover:text-brand-blue transition-all flex items-center justify-center w-12 h-12 lg:w-14 lg:h-14 active:scale-90 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              playClickSound();
              setIsMenuOpen(prev => !prev);
            }}
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            <AnimatePresence>
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                  className="text-brand-blue-bright pointer-events-none"
                >
                  <X className="w-7 h-7" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                  animate={{ 
                    rotate: 0, 
                    opacity: 1,
                    scale: [1, 1.15, 1],
                  }}
                  exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                  transition={{ 
                    scale: {
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    },
                    default: { duration: 0.2 }
                  }}
                  className="pointer-events-none"
                >
                  <Menu className="w-7 h-7" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </header>
      
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-orange via-brand-orange to-brand-blue z-[10001] origin-left"
        style={{ scaleX }}
      />

      {/* Primary Landing Content */}
      {!showMoreInfo && (
        <div className="animate-fade-in pb-12">
          {/* Hero Section */}
          <section id="inicio" className="relative pt-32 md:pt-40 pb-20 md:pb-28 lg:pb-32 w-full flex-grow overflow-hidden flex flex-col justify-center min-h-[90vh]">
            
            {/* Fondo fotográfico with improved depth */}
            <div className="absolute inset-0 z-0">
              <img 
                src="/hero.jpg" 
                alt="MCI Soluciones Fotografía Oficial"
                className="absolute inset-0 w-full h-full object-cover object-[center_top] opacity-50 scale-105"
                referrerPolicy="no-referrer"
              />
          {/* Enhanced glass overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a192f]/95 via-[#0a192f]/70 to-[#0a192f]/30 md:backdrop-blur-[2px] z-10 pointer-events-none" />
          <div className="hidden md:block absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[radial-gradient(circle,rgba(245,130,32,0.15)_0%,transparent_70%)] rounded-full z-10 pointer-events-none animate-pulse" />
        </div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-5 sm:px-6 md:px-10 lg:px-12 flex flex-col items-center w-full">
          <div className="flex flex-col gap-12 lg:gap-16 items-center w-full">
            {/* 1. ¿Quiénes Somos? Text */}
            <div className="w-full max-w-5xl mx-auto relative">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="relative w-full flex flex-col items-center justify-center space-y-6 md:space-y-8 py-10 md:py-16 text-center"
              >
                {/* Dynamic Decorative Elements */}
                <motion.div 
                  animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-0 right-0 md:right-10 w-48 h-48 md:w-64 md:h-64 bg-[radial-gradient(circle,rgba(245,130,32,0.15)_0%,transparent_70%)] rounded-full pointer-events-none" 
                />
                <motion.div 
                  animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute bottom-0 left-0 md:left-10 w-56 h-56 md:w-72 md:h-72 bg-[radial-gradient(circle,rgba(0,75,135,0.15)_0%,transparent_70%)] rounded-full pointer-events-none" 
                />
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8, type: "spring", bounce: 0.4 }}
                  className="space-y-4 flex flex-col items-center relative z-10"
                >
                  <h1 
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter uppercase leading-none text-white flex flex-wrap items-center justify-center gap-3 md:gap-4 drop-shadow-sm"
                    style={{ textShadow: '0 4px 20px rgba(0,0,0,0.6)' }}
                  >
                    <motion.span
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >¿Quiénes</motion.span>
                    <motion.span 
                      className="text-brand-orange underline decoration-[8px] md:decoration-[12px] decoration-brand-orange/20 underline-offset-4"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                    >Somos</motion.span>
                    <motion.span
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                    >?</motion.span>
                  </h1>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
                    className="flex justify-center"
                  >
                    <div className="h-1 md:h-2 w-20 md:w-32 bg-brand-orange rounded-full shadow-[0_4px_15px_rgba(245,130,32,0.4)]" />
                  </motion.div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="mt-6 text-sm md:text-base lg:text-lg xl:text-xl text-slate-200 leading-relaxed md:leading-loose font-medium relative z-10 max-w-4xl flex flex-col gap-6"
                  style={{ overflowWrap: 'break-word', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
                >
                  <p>
                    <span className="font-extrabold text-brand-orange">MCI Soluciones Poliméricas</span> es una empresa de ingeniería aplicada y <span className="font-extrabold text-brand-orange">atención integral</span>. Contamos con más de 30 años de consolidación en los sectores Industrial y de la Construcción en México siendo nuestra especialidad el diseño e implementación de soluciones con sistemas poliméricos de alta gama <span className="font-extrabold text-brand-orange">para restaurar, mejorar y proteger instalaciones</span> expuestas a riesgos físicos o químicos y maximizar así su vida útil, preservando <span className="font-extrabold text-brand-orange">el valor de la inversión de los activos</span>
                  </p>
                  <p className="font-black text-brand-orange text-base md:text-xl lg:text-2xl leading-snug drop-shadow-md" style={{ textShadow: '1px 2px 4px rgba(0,0,0,0.3)' }}>
                    No fabricamos materiales, ofrecemos criterio técnico, diagnóstico, especificación correcta y ejecución especializada
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* --- NUEVA ESTRUCTURA (FORTALEZAS) --- */}
      <section id="video-fortalezas" className="relative z-10 py-12 md:py-16 overflow-hidden">
        {/* Strengths Section (Improved Grid Layout) */}
        <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-6 will-change-transform mt-8">
          <div className="text-center mb-12 md:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4 flex flex-col items-center"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase leading-none text-white flex flex-wrap items-center justify-center gap-3 md:gap-4">
                <span>Nuestras</span>
                <span className="text-brand-orange underline decoration-[4px] md:decoration-[8px] decoration-brand-orange/20 underline-offset-4">Fortalezas</span>
              </h2>
              <div className="h-1 md:h-2 w-20 md:w-32 bg-brand-orange rounded-full shadow-[0_4px_20px_rgba(245,130,32,0.4)]" />
            </motion.div>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {STRENGTHS.map((s, idx) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5, type: "spring" }}
                  onClick={() => {
                    playClickSound();
                    setActiveStrength(s);
                    setIsStrengthHovered(true);
                  }}
                  className="group relative p-8 rounded-[2rem] border-[1.5px] border-blue-200/60 bg-gradient-to-br from-blue-50/70 to-white/70 shadow-sm hover:shadow-xl hover:from-blue-100/80 hover:to-white/90 transition-all duration-500 flex flex-col items-center text-center gap-6 cursor-pointer"
                >
                  <div className="w-20 h-20 rounded-2xl bg-blue-100/50 flex items-center justify-center text-blue-600 transition-all duration-500 shadow-[0_0_15px_rgba(37,99,235,0.15)] border border-blue-200 group-hover:bg-blue-600 group-hover:text-white group-hover:rotate-6 relative z-10">
                    {React.cloneElement(s.icon as React.ReactElement, { className: 'w-10 h-10 transition-transform duration-500' })}
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-xl font-black text-blue-950 uppercase tracking-tight leading-tight group-hover:text-blue-700 transition-colors relative z-10">
                      {s.title}
                    </h3>
                    <p className="text-xs text-slate-800 font-bold leading-relaxed uppercase tracking-widest px-4 relative z-10">
                      {s.description || 'Excelencia Operativa'}
                    </p>
                  </div>

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      playClickSound();
                      setActiveStrength(s);
                      setIsStrengthHovered(true);
                    }}
                    className="mt-2 flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] hover:tracking-[0.3em] transition-all relative z-10"
                  >
                    Detalles <ArrowRight className="w-3 h-3" />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="flex justify-center mt-12 mb-24 relative z-20 px-5">
        <motion.button 
          initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  playClickSound();
                  setShowMoreInfo(true);
                  // Scroll to the next section slightly
                  setTimeout(() => {
                    const el = document.getElementById('inicio-part2');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }} 
                className="group relative w-full max-w-lg bg-gradient-to-br from-blue-50/70 to-white/70 border border-blue-200/60 rounded-2xl md:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
              >
                {/* Visual Engineering Background */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5" />
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400 animate-pulse" />
                
                <div className="relative z-10 px-4 py-8 md:px-8 md:py-10 flex flex-col items-center gap-3 text-center">
                  <h3 className="text-lg md:text-2xl lg:text-3xl font-black uppercase tracking-tight md:tracking-tighter leading-tight">
                    <span className="text-blue-950">PARA MÁS INFORMACIÓN</span> <br />
                    <span className="text-blue-600 group-hover:text-blue-700 transition-colors duration-500 text-base md:text-xl">TE INVITAMOS A CONOCERNOS</span>
                  </h3>
                  
                  <p className="text-slate-700 text-[10px] md:text-xs font-bold uppercase tracking-widest max-w-sm mt-1">
                    Descubre nuestra metodología, sectores de atención y casos de éxito que nos consolidan como líderes.
                  </p>

                  <div className="mt-3 flex items-center justify-center w-10 h-10 md:w-14 md:h-14 rounded-full border-2 border-white/10 group-hover:border-brand-orange group-hover:bg-brand-orange transition-all duration-500">
                    <ArrowDown className="w-4 h-4 md:w-6 md:h-6 text-brand-orange group-hover:text-white animate-bounce" />
                  </div>
                </div>

                {/* Animated Shine */}
                <div className="absolute top-0 h-full w-1/3 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shine pointer-events-none" />
              </motion.button>
        </div>
      </div>
      )}

      {/* Part 2 Sections */}
      {showMoreInfo && (
        <div className="animate-fade-in pt-12 md:pt-16">
          {/* Back Button */}
          <div className="max-w-7xl mx-auto px-5 md:px-6 mt-8 md:mt-12 mb-4 flex justify-center md:justify-start">
            <button
              onClick={() => {
                playClickSound();
                setShowMoreInfo(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group flex flex-col items-center gap-2 text-[10px] md:text-xs font-black text-slate-400 hover:text-brand-orange transition-all uppercase tracking-[0.2em]"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-slate-200 group-hover:border-brand-orange flex items-center justify-center bg-white shadow-sm group-hover:shadow-md transition-all">
                <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform" />
              </div>
              Regresar
            </button>
          </div>

          <section id="inicio-part2" className="relative z-10 max-w-7xl mx-auto px-5 md:px-6 py-4">
            {/* 2. Misión/Visión/Propuesta Vertical Stack */}
            <motion.div
               initial="hidden"
               whileInView="visible"
               viewport={{ once: true }}
               variants={{
                 hidden: { opacity: 0, scale: 0.95 },
                 visible: { opacity: 1, scale: 1, transition: { delay: 0.2, type: "spring", stiffness: 100 } }
               }}
               className="mt-8 md:mt-12 px-4 w-full flex flex-col items-center relative z-20"
             >
                <div className="text-center mb-8 md:mb-12">
                   <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold uppercase tracking-tighter text-on-surface mb-4 leading-tight drop-shadow-sm max-w-4xl mx-auto">
                    Así&nbsp;&nbsp;Garantizamos&nbsp;&nbsp;<span className="text-gradient transition-colors">Resultados</span>
                   </h2>
                   <div className="w-20 md:w-32 h-1.5 md:h-2 bg-brand-orange mx-auto rounded-full shadow-[0_0_20px_rgba(245,130,32,0.3)]" />
                 </div>

                 <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 md:gap-8">
                   {[
                     {
                       title: 'Misión',
                       icon: <Target className="w-8 h-8 text-blue-600" />,
                       text: 'Contribuir con nuestros clientes en la preservación de sus activos de producción mediante el uso de ingeniería aplicada en sistemas poliméricos que garanticen desempeño y continuidad en la operación de sus procesos.',
                       theme: 'from-blue-50/70 to-white/70 hover:from-blue-100/80 hover:to-white/90 border-blue-200/60',
                       iconBg: 'bg-blue-100/50 border-blue-200 shadow-[0_0_15px_rgba(37,99,235,0.15)]',
                       textColor: 'text-sm md:text-base lg:text-lg text-slate-800 leading-relaxed font-bold',
                       titleColor: 'text-blue-950 border-blue-200'
                     },
                     {
                       title: 'Visión',
                       icon: <Eye className="w-8 h-8 text-blue-600" />,
                       text: 'Convertirnos en el socio técnico de referencia para empresas que no pueden permitirse fallas o paros operativos imprevistos ocasionadas por daños físicos o químicos a los activos de producción.',
                       theme: 'from-blue-50/70 to-white/70 hover:from-blue-100/80 hover:to-white/90 border-blue-200/60',
                       iconBg: 'bg-blue-100/50 border-blue-200 shadow-[0_0_15px_rgba(37,99,235,0.15)]',
                       textColor: 'text-sm md:text-base lg:text-lg text-slate-800 leading-relaxed font-bold',
                       titleColor: 'text-blue-950 border-blue-200'
                     },
                     {
                       title: 'Propuesta de Valor',
                       icon: <ShieldCheck className="w-8 h-8 text-blue-600" />,
                       text: <><span className="font-extrabold text-brand-orange">MCI</span> no vende materiales, ofrece soluciones a partir del análisis de las condiciones reales de trabajo. Identificamos riesgos críticos que pueden comprometer la seguridad y la operación, y diseñamos soluciones que, ejecutadas bajo un control estricto, garanticen continuidad operativa, máxima durabilidad y la protección real de la inversión del cliente.</>,
                       theme: 'from-blue-50/70 to-white/70 hover:from-blue-100/80 hover:to-white/90 border-blue-200/60',
                       iconBg: 'bg-blue-100/50 border-blue-200 shadow-[0_0_15px_rgba(37,99,235,0.15)]',
                       textColor: 'text-sm md:text-base lg:text-lg text-slate-800 leading-relaxed font-bold',
                       titleColor: 'text-blue-950 border-blue-200',
                       differentiators: [
                         'Más de 30 años de experiencia',
                         'Respuesta inmediata 24/7',
                         'Rigor técnico',
                         'Soluciones integrales a la medida',
                         'Calidad total demostrada',
                         'Responsabilidad operativa',
                         'Protección a largo plazo',
                         'Sustentabilidad',
                         'Atención post-venta'
                       ]
                     }
                   ].map((item, idx) => (
                     <motion.div 
                       key={idx}
                       variants={{
                          hidden: { opacity: 0, y: 30 },
                          visible: { opacity: 1, y: 0 }
                       }}
                       className={`bg-gradient-to-br ${item.theme} backdrop-blur-md border rounded-3xl p-6 md:p-8 lg:p-10 flex flex-col items-center md:items-start gap-4 md:gap-6 lg:gap-8 shadow-sm hover:shadow-xl transition-all duration-500 relative overflow-hidden group`}
                     >
                        {/* Subtle premium glass reflection */}
                        <div className="absolute inset-0 bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 lg:gap-8 w-full">
                          <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl ${item.iconBg} flex items-center justify-center shrink-0 border transition-transform duration-500 group-hover:scale-110 relative z-10`}>
                             {item.icon}
                          </div>
                          <div className="flex-1 flex flex-col text-center md:text-left gap-2 md:gap-3 w-full relative z-10 mt-2 md:mt-0">
                             <h3 className={`text-lg md:text-xl font-black uppercase tracking-widest ${item.titleColor} border-b-2 pb-2 md:border-none md:pb-0 inline-block w-fit mx-auto md:mx-0 transition-colors`}>
                               {item.title}
                             </h3>
                             <p className={`${item.textColor || 'text-slate-700'} text-sm md:text-base font-medium leading-relaxed mt-2 md:mt-0`}>
                               {item.text}
                             </p>
                          </div>
                        </div>

                        {item.differentiators && (
                          <div className="w-full mt-4 flex flex-col items-center md:items-start relative z-10">
                            <h4 className="text-sm md:text-base font-black text-brand-orange uppercase tracking-widest mb-4">
                              Nuestros Diferenciadores:
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 w-full">
                              {item.differentiators.map((diff, i) => (
                                <div key={i} className="flex items-center gap-2 bg-white/60 p-3 rounded-xl border border-orange-100 shadow-sm hover:bg-white transition-colors duration-300">
                                  <div className="w-1.5 h-1.5 rounded-full bg-brand-orange shrink-0" />
                                  <span className="text-xs md:text-sm font-semibold text-slate-800">{diff}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                     </motion.div>
                   ))}
                 </div>
             </motion.div>
      </section>

      {/* Sectors Section */}
      <section id="sectores" className="relative z-10 max-w-7xl mx-auto px-5 md:px-6 py-8 md:py-16 will-change-transform">
        <div className="text-center mb-12 md:mb-20 space-y-4 md:space-y-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold uppercase tracking-tighter text-on-surface drop-shadow-sm transition-all duration-300">
            Sectores&nbsp;&nbsp;que&nbsp;&nbsp;<span className="text-gradient transition-colors">Atendemos</span>
          </h2>
          <div className="w-24 md:w-32 h-1.5 md:h-2 bg-brand-orange mx-auto rounded-full shadow-[0_0_20px_rgba(245,130,32,0.3)]" />
        </div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {SECTORS.map((sector) => (
            <motion.div 
              key={sector.id}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 }
              }}
              className={`snap-center p-6 md:p-10 rounded-[2rem] border-[1.5px] transition-all duration-500 cursor-pointer group relative overflow-hidden ${activeSector === sector.id ? 'bg-gradient-to-br from-blue-100/80 to-white shadow-2xl -translate-y-2 border-blue-300 ring-4 ring-blue-400/20' : 'bg-gradient-to-br from-blue-50/70 to-white/70 border-blue-200/60 shadow-sm hover:shadow-xl hover:from-blue-100/80 hover:to-white/90 hover:-translate-y-2'}`}
              onClick={() => {
                playClickSound();
                setActiveSector(activeSector === sector.id ? null : sector.id);
              }}
            >
              <div className="flex flex-col gap-6 w-full relative z-10">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${activeSector === sector.id ? 'bg-blue-600 text-white shadow-xl' : 'bg-blue-100/50 text-blue-600 border border-blue-200 shadow-[0_0_15px_rgba(37,99,235,0.15)] group-hover:bg-blue-600 group-hover:text-white'}`}>
                  {React.cloneElement(sector.icon as React.ReactElement, { className: 'w-8 h-8 transition-colors duration-300' })}
                </div>
                <div className="space-y-3">
                  <h3 className={`text-xl font-black uppercase tracking-tight leading-tight transition-colors duration-300 ${activeSector === sector.id ? 'text-blue-900' : 'text-blue-950 group-hover:text-blue-700'}`}>
                    {sector.title}
                  </h3>
                  <p className={`text-sm leading-relaxed font-semibold transition-colors duration-300 ${activeSector === sector.id ? 'text-slate-800' : 'text-slate-700 group-hover:text-slate-800'}`}>
                    {sector.description}
                  </p>
                </div>
              </div>
              
              <AnimatePresence mode="popLayout">
                {activeSector === sector.id && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="pt-6 border-t border-blue-200/40 space-y-5"
                  >
                    {sector.details?.groups.map((group, i) => (
                      <div key={i} className="space-y-3 relative z-10">
                        <h4 className="text-sm font-black text-blue-950 uppercase tracking-[0.2em] flex items-center gap-2">
                          <div className="w-1 h-1 bg-blue-500 rounded-full" />
                          {group.title}
                        </h4>
                        <ul className="grid grid-cols-1 gap-2.5">
                          {group.items.map((item, j) => (
                            <li key={j} className="flex items-start gap-3 text-sm text-slate-800 font-medium leading-relaxed">
                              <ArrowRight className="w-2.5 h-2.5 text-blue-500/60 mt-0.5 flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="absolute bottom-6 right-8 text-blue-400 opacity-20 group-hover:opacity-100 transition-all duration-500">
                <ChevronDown className={`w-5 h-5 transition-transform duration-500 ${activeSector === sector.id ? 'rotate-180' : ''}`} />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Antes / Después Section */}
      <section id="transformacion" className="relative z-10 max-w-7xl mx-auto px-5 md:px-6 py-12 md:py-24">
        <div className="flex flex-col gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6 text-center max-w-3xl mx-auto"
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold uppercase tracking-tighter text-white drop-shadow-sm leading-tight">
              Antes&nbsp;&nbsp;/&nbsp;&nbsp;<span className="text-gradient">Después</span>
            </h2>
            <div className="w-20 md:w-24 h-1.5 md:h-2 bg-brand-orange rounded-full shadow-[0_0_20px_rgba(245,130,32,0.3)] mx-auto" />
            <div className="space-y-4">
              <p className="text-white/90 text-2xl md:text-4xl lg:text-5xl font-black leading-tight text-center mx-auto max-w-4xl tracking-tight">
                Transformación <span className="text-brand-orange">real</span>, recuperación <span className="text-[#22d3ee]">operativa</span>.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative w-full"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-brand-orange/20 to-brand-blue/20 blur-3xl opacity-50 rounded-[3rem] -z-10" />
            <BeforeAfterMarquee pairs={BEFORE_AFTER_PAIRS} />
          </motion.div>
        </div>
      </section>

      <ProjectGallery onImageSelect={setSelectedImage} />

      {/* Testimonials Section */}
      <section id="testimonios" className="relative z-10 max-w-7xl mx-auto px-5 md:px-6 py-8 md:py-12">
        <div className="text-center mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border-brand-orange/30 text-brand-orange text-xs font-bold uppercase tracking-widest"
          >
            <Star className="w-3 h-3" />
            Casos de Éxito
          </motion.div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-on-surface uppercase tracking-tighter drop-shadow-sm">
            Clientes&nbsp;&nbsp;<span className="text-gradient">Satisfechos</span>
          </h2>
          <p className="text-on-surface max-w-2xl mx-auto font-bold text-lg md:text-xl transition-all duration-300 px-4">
            La confianza de nuestros clientes es el mejor respaldo de nuestra ingeniería.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass p-6 md:p-8 rounded-3xl md:rounded-[2.5rem] border-white/5 flex flex-col justify-between group hover:border-brand-orange/30 transition-all duration-500"
            >
              <div className="space-y-6">
                <div className="flex gap-1">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-brand-orange text-brand-orange" />
                  ))}
                </div>
                <div className="relative">
                  <Quote className="absolute -top-4 -left-4 w-8 h-8 text-brand-orange/10" />
                  <p className="text-on-surface/80 text-sm leading-relaxed font-medium italic relative z-10">
                    "{t.text}"
                  </p>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-glass-border">
                <p className="text-on-surface font-black text-xs uppercase tracking-widest">{t.name}</p>
                <p className="text-brand-blue text-xs font-bold uppercase tracking-widest mt-1 transition-colors">{t.company}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>






      {/* Contact Section explicitly inside Part 2 */}
      <section id="contacto" className="relative z-10 max-w-7xl mx-auto px-5 md:px-6 py-20 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-10">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-orange/10 border border-brand-orange/20 rounded-full text-brand-orange text-xs font-black uppercase tracking-widest">
                <Mail className="w-3" />
                Ingeniería de Ventas
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">
                ¿TIENES UN <br />
                <span className="text-brand-orange">PROYECTO EN MENTE?</span>
              </h2>
              <p className="text-white/70 text-lg md:text-xl font-medium leading-relaxed max-w-xl">
                Nuestro departamento técnico está listo para brindarte el diagnóstico y la asesoría que tu planta requiere.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { icon: <Phone className="w-5 h-5" />, text: '55 6150 0317', href: 'tel:+525561500317' },
                { icon: <Mail className="w-5 h-5" />, text: 'mci.spolimericas@polycovers.mx', href: 'mailto:mci.spolimericas@polycovers.mx' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-all">
                    {item.icon}
                  </div>
                  <a href={item.href} className="text-sm font-black text-white hover:text-brand-orange transition-colors">
                    {item.text}
                  </a>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="https://wa.me/525561500317" 
                target="_blank"
                className="flex items-center justify-center gap-3 bg-[#25D366] text-white px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl hover:shadow-[0_20px_40px_rgba(37,211,102,0.3)] transition-all hover:-translate-y-1"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp Directo
              </a>
              <button 
                onClick={() => setIsQRModalOpen(true)}
                className="flex items-center justify-center gap-3 bg-slate-900 text-white px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all shadow-lg"
              >
                <QrCode className="w-5 h-5" />
                Ver Tarjeta Digital
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 bg-gradient-to-tr from-brand-orange/20 via-transparent to-brand-blue/20 blur-3xl opacity-50 rounded-[3rem] -z-10" />
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-200 shadow-2xl relative overflow-hidden">
               {isFormSubmitted ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-10 space-y-6"
                  >
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-600 border border-green-100 shadow-inner">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase">¡Mensaje Enviado!</h3>
                    <p className="text-slate-600 font-medium">Un experto te contactará en breve.</p>
                    <button onClick={() => setIsFormSubmitted(false)} className="text-brand-orange font-black text-xs uppercase tracking-widest border-b-2 border-brand-orange/20 hover:border-brand-orange transition-all">Enviar otro mensaje</button>
                  </motion.div>
               ) : (
                  <form className="space-y-6" onSubmit={handleFormSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="md:col-span-1">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2 mb-2 block">Cargo</label>
                        <input type="text" name="cargo" value={formData.cargo} onChange={handleFieldChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 placeholder:text-slate-300 text-sm focus:ring-2 focus:ring-brand-blue/20 outline-none" placeholder="Ing." />
                      </div>
                      <div className="md:col-span-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2 mb-2 block">Nombre Completo *</label>
                        <input type="text" name="nombre" value={formData.nombre} onChange={handleFieldChange} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 placeholder:text-slate-300 text-sm focus:ring-2 focus:ring-brand-blue/20 outline-none" placeholder="Roberto Silva" />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2 mb-2 block">Empresa / Planta *</label>
                      <input type="text" name="empresa" value={formData.empresa} onChange={handleFieldChange} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 placeholder:text-slate-300 text-sm focus:ring-2 focus:ring-brand-blue/20 outline-none" placeholder="Planta Industrial Norte" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2 mb-2 block">Email *</label>
                        <input type="email" name="email" value={formData.email} onChange={handleFieldChange} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 placeholder:text-slate-300 text-sm focus:ring-2 focus:ring-brand-blue/20 outline-none" placeholder="rsilva@empresa.com" />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2 mb-2 block">Teléfono *</label>
                        <input type="tel" name="telefono" value={formData.telefono} onChange={handleFieldChange} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 placeholder:text-slate-300 text-sm focus:ring-2 focus:ring-brand-blue/20 outline-none" placeholder="55 0000 0000" />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2 mb-2 block">Detalles del Proyecto *</label>
                      <textarea name="detalles" rows={3} value={formData.detalles} onChange={handleFieldChange} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 placeholder:text-slate-300 text-sm focus:ring-2 focus:ring-brand-blue/20 outline-none resize-none" placeholder="Describa el área a intervenir..." />
                    </div>
                    <button type="submit" disabled={isSubmitting} className="w-full py-5 bg-brand-blue text-white font-black uppercase tracking-[0.3em] text-[10px] rounded-xl hover:bg-brand-blue/90 shadow-xl transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50">
                      {isSubmitting ? 'ENVIANDO...' : 'SOLICITAR ASESORÍA TÉCNICA'}
                    </button>
                  </form>
               )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative z-10 max-w-4xl mx-auto px-5 md:px-6 py-8 md:py-12">
        <div className="text-center mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/30 text-brand-orange text-xs font-bold uppercase tracking-widest"
          >
            <Wrench className="w-3 h-3" />
            Resolviendo Dudas Técnicas
          </motion.div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white uppercase tracking-tighter">
            Preguntas&nbsp;&nbsp;<span className="text-brand-orange">Frecuentes</span>
          </h2>
        </div>

        <div className="space-y-4">
          {[
            { q: '¿Cuánto tiempo tarda en secar un piso epóxico?', a: 'Dependiendo del sistema, el tráfico peatonal puede permitirse en 24 horas y el tráfico pesado en 48-72 horas.' },
            { q: '¿Tienen cobertura fuera de la CDMX?', a: 'Sí, contamos con infraestructura logística para ejecutar proyectos en cualquier estado de la República Mexicana.' },
            { q: '¿Sus materiales cumplen con normas sanitarias?', a: 'Absolutamente. Nuestros sistemas para la industria alimentaria cumplen con normativas FDA y USDA.' },
            { q: '¿Ofrecen garantía por escrito?', a: 'Sí, todos nuestros proyectos incluyen una póliza de garantía que cubre tanto materiales como mano de obra.' }
          ].map((faq, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              onClick={() => {
                playClickSound();
                setActiveFaq(activeFaq === i ? null : i);
              }}
              className={`p-5 md:p-6 rounded-2xl border-[1.5px] transition-all duration-500 cursor-pointer group hover:-translate-y-1 ${activeFaq === i ? 'bg-gradient-to-br from-blue-100/80 to-white shadow-xl scale-[1.02] border-blue-300 ring-4 ring-blue-400/20' : 'bg-gradient-to-br from-blue-50/70 to-white/70 border-blue-200/60 shadow-sm hover:shadow-lg hover:from-blue-100/80 hover:to-white/90'}`}
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className={`font-bold text-sm md:text-lg transition-colors flex items-start gap-3 ${activeFaq === i ? 'text-blue-900' : 'text-blue-950 group-hover:text-blue-700'}`}>
                  <span className="text-blue-400 text-[10px] md:text-xs font-black mt-1 md:mt-1.5 whitespace-nowrap">0{i+1}</span>
                  {faq.q}
                </h3>
                <ChevronDown className={`w-5 h-5 text-blue-500 transition-transform duration-500 flex-shrink-0 ${activeFaq === i ? 'rotate-180' : ''}`} />
              </div>
              <AnimatePresence>
                {activeFaq === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="mt-4 text-slate-800 text-sm md:text-base leading-relaxed pl-8">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer Section (Minimal and Professional) */}
      <footer id="contacto-footer" className="relative z-10 bg-slate-900 pt-20 pb-10 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-5 md:px-6 relative z-10">
          <div className="flex flex-col items-center justify-center gap-12">
            <div className="flex items-center justify-center gap-4">
              <img src={logoBase64} alt="MCI Soluciones" className="h-10 md:h-12 w-auto brightness-0 invert" referrerPolicy="no-referrer" />
              <div className="h-10 w-px bg-white/20" />
              <div className="text-white text-left">
                <p className="text-sm font-black tracking-widest">MCI SOLUCIONES</p>
                <p className="text-[10px] font-black tracking-[0.2em] text-brand-orange">POLIMÉRICAS</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
        </div>
      )}

      {/* Floating Chat Widget */}
      <div className="fixed bottom-4 left-4 md:bottom-8 md:left-8 z-[100000]" ref={chatContainerRef}>
        <AnimatePresence>
          {!isChatOpen && (
            <motion.div 
              initial={{ opacity: 0, x: -20, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: 2, duration: 0.5, type: "spring" }}
              className="absolute bottom-full left-0 mb-4 ml-2 w-[11rem] bg-white/95 backdrop-blur-md text-brand-blue-bright text-xs font-bold leading-tight px-4 py-3 rounded-2xl rounded-bl-sm shadow-[0_10px_20px_rgba(0,0,0,0.15)] border border-brand-blue/10 flex items-center gap-2 pointer-events-none"
            >
               <motion.span 
                 animate={{ rotate: [0, 15, -10, 15, -10, 0] }}
                 transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
                 className="text-lg origin-bottom-right inline-block shrink-0"
               >
                 👋
               </motion.span>
               <span>¡Hey! ¿En qué puedo ayudarte?</span>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="relative inline-block group">
          <button 
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="relative w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-tr from-brand-blue to-[#1a365d] shadow-[0_12px_25px_rgba(0,0,0,0.3)] flex items-center justify-center outline-none overflow-hidden border-2 border-white/20 hover:scale-[1.03] active:scale-95 transition-all will-change-transform"
          >
            {/* Integrated LED Indicator that looks like a real hardware light */}
            {!isChatOpen && (
              <div className="absolute top-[8%] right-[15%] w-2.5 h-2.5 bg-[#111] rounded-full border border-black/40 shadow-inner flex items-center justify-center z-20">
                <div className="w-1.5 h-1.5 bg-[#39ff14] rounded-full shadow-[0_0_8px_2px_#39ff14,0_0_12px_#39ff14] animate-pulse" />
              </div>
            )}
            
            {isChatOpen ? (
              <motion.div 
                 initial={{ opacity: 0, rotate: -90 }}
                 animate={{ opacity: 1, rotate: 0 }}
                 exit={{ opacity: 0, rotate: 90 }}
                 className="text-white text-3xl font-black drop-shadow-md"
              >
                ×
              </motion.div>
            ) : (
              <motion.div 
                className="relative w-full h-full flex items-center justify-center pointer-events-none origin-bottom"
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <BotAvatar isHappy={botExpression === 'happy'} isThinking={botExpression === 'thinking'} />
              </motion.div>
            )}
          </button>
        </div>

        <AnimatePresence>
          {isChatOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              style={{ transformOrigin: 'bottom left' }}
              className="absolute bottom-[calc(100%+8px)] sm:bottom-[calc(100%+12px)] left-0 w-[calc(100vw-32px)] sm:w-[22rem] md:w-[24rem] h-[460px] xs:h-[480px] sm:h-[500px] md:h-[540px] max-h-[calc(100dvh-120px)] bg-white rounded-2xl border border-glass-border shadow-2xl flex flex-col overflow-hidden will-change-transform"
            >
              <div className="bg-slate-900 border-b border-white/5 p-4 flex justify-between items-center relative shrink-0">
                <div className="flex items-center gap-3 relative z-10 font-sans">
                  <div className="w-10 h-10 bg-[#1a365d] rounded-xl flex items-center justify-center relative overflow-hidden shadow-lg border border-white/10 ring-1 ring-white/5">
                    <BotAvatar isHappy={botExpression === 'happy'} isThinking={botExpression === 'thinking'} />
                  </div>
                  <div>
                    <h4 className="text-white font-black uppercase tracking-widest text-[10px]">MCI Tech Assistant</h4>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-[#39ff14] rounded-full animate-pulse shadow-[0_0_5px_#39ff14]" />
                      <p className="text-white/60 text-[9px] font-black uppercase tracking-tighter">Status: Active</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      playClickSound();
                      handleResetChat();
                    }}
                    className="p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-all cursor-pointer active:scale-95 border border-transparent hover:border-white/10"
                    aria-label="Reiniciar chat"
                    title="Regresar al inicio"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      playClickSound();
                      setIsChatOpen(false);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all cursor-pointer active:scale-95 border border-white/10 text-[10px] uppercase font-bold tracking-wider"
                    aria-label="Minimizar chat"
                  >
                    <Minimize className="w-3 h-3" />
                    Regresar
                  </button>
                </div>
              </div>

              <div className="flex-1 p-4 overflow-y-auto space-y-3 custom-scrollbar bg-gray-50/5">
                {chatMessages.map((msg, i) => {
                  
                  // Formateador para inyectar botón de whatsapp directamente en texto plano
                  const formatChatMessage = (text: string) => {
                    let formatted = text.replace(/\n/g, '<br/>');
                    // Solo reemplazamos 'whatsapp' si no está ya dentro de una etiqueta HTML
                    if (msg.type === 'bot' && !formatted.includes('href="https://wa.me')) {
                      const waButton = `<a href="https://wa.me/525561500317" target="_blank" class="inline-flex items-center gap-1.5 bg-[#25D366] text-white px-2 py-0.5 rounded-md font-bold text-xs mx-1 hover:bg-[#20bd5a] transition-all shadow-sm active:scale-95 no-underline whitespace-nowrap"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" height="14px" width="14px" xmlns="http://www.w3.org/2000/svg"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zM223.9 413.6c-33.1 0-65.5-8.9-94-25.8l-6.7-4-69.8 18.3L72 334.1l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"></path></svg> WhatsApp</a>`;
                      formatted = formatted.replace(/\bwhatsapp\b/gi, waButton);
                    }
                    return formatted;
                  };

                  return (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-2 ${msg.type === 'bot' ? 'flex-row' : 'flex-row-reverse'}`}
                  >
                    {msg.type === 'bot' && (
                      <div className="w-8 h-8 rounded-full bg-[#1a365d] flex-shrink-0 flex items-center justify-center overflow-hidden border border-white/10 shadow-sm mt-auto mb-1">
                        <BotAvatar isHappy={i === chatMessages.length - 1 ? botExpression === 'happy' : false} isThinking={false} />
                      </div>
                    )}
                    <div className={`flex flex-col gap-2 ${msg.type === 'user' ? 'items-end' : 'items-start'} max-w-[80%]`}>
                      <div className={`p-3.5 rounded-2xl text-[13px] leading-relaxed relative ${msg.type === 'bot' ? 'bg-white text-slate-700 rounded-bl-sm shadow-sm border border-slate-200' : 'bg-brand-blue text-white font-medium rounded-br-sm shadow-md border border-white/5'}`}>
                        {msg.image && (
                          <img src={msg.image} alt="User upload" className="w-full h-40 object-cover rounded-xl mb-3 border border-white/10 shadow-lg" referrerPolicy="no-referrer" />
                        )}
                        <div dangerouslySetInnerHTML={{ __html: formatChatMessage(msg.text) }} />
                      </div>
                    
                    {i === 0 && chatMessages.length === 1 && (
                      <div className="flex flex-col gap-2 self-start w-full">
                        {[
                          { 
                            q: 'Comunícate con nosotros', 
                            a: 'Elige el medio de contacto de tu preferencia:<br/><div class="flex flex-col gap-2 mt-3"><a href="https://wa.me/525561500317" target="_blank" class="bg-[#25D366] text-white px-4 py-3 rounded-xl font-bold text-center flex items-center justify-center gap-2"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766 0 1.015.265 2.008.768 2.88l-1.01 3.687 3.774-.99a5.727 5.727 0 002.236.457c3.18 0 5.767-2.586 5.768-5.766 0-3.18-2.587-5.766-5.768-5.766h-.002zM12.031 16.59c-.846 0-1.67-.227-2.392-.656l-.17-.1-1.78.467.476-1.737-.11-.176a4.423 4.423 0 01-.676-2.356c0-2.453 1.996-4.448 4.449-4.448 2.452 0 4.449 1.995 4.449 4.448 0 2.453-1.996 4.448-4.448 4.448zm2.443-3.344c-.134-.067-.793-.392-.916-.436-.123-.044-.212-.067-.301.067-.09.134-.346.437-.425.526-.078.09-.156.101-.29.034-.134-.067-.566-.208-1.077-.665-.398-.356-.667-.796-.745-.93-.078-.134-.008-.207.059-.274.06-.06.134-.157.201-.235.067-.078.09-.134.134-.224.045-.09.022-.168-.011-.235-.034-.067-.301-.727-.413-1.006-.109-.271-.22-.234-.301-.238-.078-.004-.167-.004-.257-.004-.09 0-.234.034-.357.168-.123.134-.47.459-.47 1.119 0 .66.48 1.298.548 1.388.067.09.945 1.442 2.29 2.006.32.134.568.214.762.274.321.101.614.086.845.052.261-.038.793-.324.905-.638.112-.313.112-.58.078-.638-.033-.057-.122-.09-.256-.157z"/></svg> Vía WhatsApp</a><a href="mailto:mci.spolimericas@polycovers.mx" class="bg-brand-blue text-white px-4 py-3 rounded-xl font-bold text-center flex items-center justify-center gap-2"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg> Vía Correo</a><a href="tel:+525561500317" class="bg-brand-orange text-white px-4 py-3 rounded-xl font-bold text-center flex items-center justify-center gap-2"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg> Llamada Telefónica</a></div>' 
                          }
                        ].map((opt, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleChatOption(opt.q, opt.a)}
                            className="text-left p-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-bold text-brand-orange transition-all shadow-sm flex justify-between items-center group"
                          >
                            {opt.q}
                            <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                        ))}
                      </div>
                    )}
                    </div>
                  </motion.div>
                );
                })}
                {isTyping && (
                  <div className="bg-slate-900/[0.05] p-4 rounded-2xl rounded-bl-none border border-slate-200 self-start flex gap-1.5 shadow-md">
                    <motion.div className="w-1.5 h-1.5 bg-slate-900 rounded-full" animate={{ y: [0, -3, 0] }} transition={{ duration: 0.6, repeat: Infinity }} />
                    <motion.div className="w-1.5 h-1.5 bg-slate-900 rounded-full" animate={{ y: [0, -3, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} />
                    <motion.div className="w-1.5 h-1.5 bg-slate-900 rounded-full" animate={{ y: [0, -3, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} />
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-100 space-y-3 shrink-0">
                {selectedFile && (
                  <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                      <img src={URL.createObjectURL(selectedFile)} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-slate-600 font-bold truncate">{selectedFile.name}</p>
                    </div>
                    <button type="button" onClick={() => setSelectedFile(null)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <div className="flex gap-2">
                  <input 
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                  <button 
                    type="button"
                    onClick={() => {
                      playClickSound();
                      fileInputRef.current?.click();
                    }}
                    className="p-2.5 text-slate-400 hover:text-brand-orange transition-all active:scale-95 border border-transparent hover:border-slate-100 rounded-xl"
                  >
                    <Camera className="w-5 h-5" />
                  </button>
                  <input 
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Escriba su consulta técnica..."
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-400 transition-all min-w-0"
                  />
                  <button 
                    type="submit"
                    disabled={isTyping || (!userInput.trim() && !selectedFile)}
                    onClick={() => playClickSound()}
                    className="bg-slate-900 text-white rounded-xl disabled:opacity-30 hover:bg-slate-800 transition-all shadow-lg active:scale-95 border border-white/5 flex flex-shrink-0 items-center justify-center w-[44px] h-[44px]"
                  >
                    <Send className="w-5 h-5 ml-1" />
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Accessibility Widget (TTS) */}
      <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[9999] flex flex-col gap-4 pointer-events-none scale-[0.85] origin-bottom-right md:scale-100">
        <AnimatePresence>
          {showBackToTop && (
            <motion.button 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              onClick={(e) => {
                e.stopPropagation();
                handleSmoothScroll(e as any, '#inicio');
              }}
              className="hidden md:flex w-14 h-14 bg-[#22d3ee]/15 backdrop-blur-xl border-2 border-[#22d3ee]/30 text-on-surface-subtle/80 rounded-full items-center justify-center shadow-2xl hover:scale-110 hover:bg-white hover:text-brand-blue hover:border-transparent transition-all group pointer-events-auto"
            >
              <div className="absolute -top-10 right-0 bg-[#22d3ee]/20 backdrop-blur-md border border-[#22d3ee]/30 text-on-surface px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                Ir arriba
              </div>
              <ChevronDown className="w-6 h-6 rotate-180" />
            </motion.button>
          )}
        </AnimatePresence>

        <button 
          onClick={(e) => {
            e.stopPropagation();
            playClickSound();
            toggleSpeech();
          }}
          className={`relative w-14 h-14 backdrop-blur-xl border-2 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 hover:bg-white hover:border-transparent transition-all group pointer-events-auto ${isSpeaking ? 'bg-brand-orange/20 border-brand-orange ring-4 ring-brand-orange/20' : 'bg-[#22d3ee]/15 border-[#22d3ee]/30 text-brand-orange'}`}
          aria-label={isSpeaking ? 'Detener lectura' : 'Escuchar página'}
        >
          <div className="absolute -top-10 right-0 bg-[#22d3ee]/20 backdrop-blur-md border border-[#22d3ee]/30 text-brand-orange px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            {isSpeaking ? 'Detener lectura' : 'Escuchar página'}
          </div>
          {isSpeaking ? (
            <div className="relative flex items-center justify-center">
              <VolumeX className="w-6 h-6" />
              <motion.div 
                className="absolute inset-0 border-2 border-brand-orange rounded-full"
                animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </div>
          ) : (
            <Headphones className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Unified Mobile Menu Overlay (Premium Cyan Glass Redesign) */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Subtle light immersive backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/10 backdrop-blur-sm z-[100001] lg:hidden touch-none"
              onClick={() => setIsMenuOpen(false)}
            />
            
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: "spring", damping: 45, stiffness: 400, mass: 1 }}
              className="lg:hidden fixed top-0 right-0 bottom-0 w-[80%] sm:w-[380px] bg-white/80 backdrop-blur-3xl border-l border-[#22d3ee]/40 overflow-y-auto z-[100002] shadow-[-15px_0_50px_rgba(34,211,238,0.1)] flex flex-col"
              ref={menuRef}
            >
              {/* Internal Header */}
              <div className="px-8 pt-10 pb-8 flex items-center justify-between border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 border border-[#22d3ee]/20 rounded-xl flex items-center justify-center p-1.5 bg-white shadow-sm">
                    <img src={logoBase64} alt="MCI Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex flex-col leading-none">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-orange">MCI Soluciones</span>
                    <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-slate-400">Poliméricas</span>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    playClickSound();
                    setIsMenuOpen(false);
                  }}
                  className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:text-brand-orange hover:border-brand-orange/30 transition-all active:scale-95 bg-white shadow-sm"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 flex flex-col px-8 py-10">
                <div className="flex flex-col gap-1">
                  <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-300 mb-4 px-1 leading-none">Menú Principal</p>
                  {navLinks.map((link, index) => (
                    <motion.a 
                      key={link.name}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.04 }}
                      href={link.href}
                      className="group flex items-center justify-between py-4 px-1 rounded-xl transition-all relative"
                      onClick={(e) => {
                        playClickSound();
                        handleSmoothScroll(e, link.href);
                      }}
                    >
                      <span className="text-sm font-black uppercase tracking-[0.25em] text-slate-600 group-hover:text-brand-orange transition-colors duration-300 flex items-center gap-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-100 group-hover:bg-brand-orange transition-colors" />
                        {link.name}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-200 group-hover:text-brand-orange group-hover:translate-x-1 transition-all duration-300" />
                      
                      <div className="absolute inset-0 bg-slate-50 opacity-0 group-hover:opacity-100 -z-10 rounded-xl transition-opacity" />
                    </motion.a>
                  ))}
                </div>
                
                {/* Refined Contact Section */}
                <div className="mt-auto pt-8 border-t border-slate-100">
                  <div className="p-6 rounded-2xl bg-white/40 backdrop-blur-md border border-white/60 shadow-sm space-y-5">
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-brand-orange/70">Atención Directa</p>
                    
                    <div className="space-y-4">
                      <a 
                        href="tel:+525561500317" 
                        className="flex items-center gap-4 group"
                      >
                        <div className="w-9 h-9 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-brand-orange group-hover:border-brand-orange/30 group-hover:shadow-md transition-all">
                          <Phone className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col leading-tight">
                          <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Teléfono</span>
                          <span className="text-xs font-bold text-slate-700 tracking-wide">55 6150 0317</span>
                        </div>
                      </a>

                      <a 
                        href="mailto:mci.spolimericas@polycovers.mx" 
                        className="flex items-center gap-4 group"
                      >
                        <div className="w-9 h-9 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-brand-blue-bright group-hover:border-brand-blue-bright/30 group-hover:shadow-md transition-all">
                          <Mail className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col leading-tight min-w-0">
                          <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Email Corporativo</span>
                          <span className="text-[10px] font-bold text-slate-700 truncate tracking-tight">mci.spolimericas@polycovers.mx</span>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4 md:p-12 bg-[#0a192f]/95 backdrop-blur-3xl cursor-zoom-out"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 40 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={getProxiedImageUrl(selectedImage)}
                alt="Selected Gallery"
                referrerPolicy="no-referrer"
                className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-[0_0_100px_rgba(59,130,246,0.3)] border border-glass-border"
              />
              
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 md:-right-12 p-3 text-brand-blue-bright hover:text-white transition-all hover:rotate-90 bg-white/5 rounded-full backdrop-blur-md border border-white/10"
              >
                <X className="w-8 h-8" />
              </button>

              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 glass px-6 py-2 rounded-full border-glass-border text-on-surface-subtle text-xs font-bold uppercase tracking-widest whitespace-nowrap">
                Haz clic fuera para cerrar
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {isStrengthHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[10001] flex items-center justify-center p-4 md:p-8"
          >
            <div 
              className="absolute inset-0 bg-[#0a192f]/90 backdrop-blur-sm"
              onClick={() => setIsStrengthHovered(false)}
            />
            
            <motion.div
              id="strength-modal-content"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-5xl glass rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl z-10 max-h-[90vh] flex flex-col will-change-transform"
            >
              {/* Close Button */}
              <button 
                onClick={() => setIsStrengthHovered(false)}
                className="absolute top-6 right-6 z-50 p-3 rounded-full glass border-white/10 text-brand-blue-bright hover:text-white hover:bg-white/10 transition-all duration-300 hover:rotate-90 group/close"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="flex flex-col">
                  {/* Content Side */}
                  <div className="p-8 md:p-12 space-y-8">
                    <div className="space-y-4">
                      <div className="inline-block px-3 py-1 rounded-lg bg-brand-orange/10 border border-brand-orange/20">
                        <span className="text-[10px] font-black text-brand-orange uppercase tracking-widest">Fortaleza MCI</span>
                      </div>
                      <h3 className="text-xl md:text-2xl font-extrabold text-on-surface uppercase tracking-tighter leading-tight">
                        {activeStrength.title}
                      </h3>
                      <div className="w-20 h-1.5 bg-brand-orange rounded-full" />
                    </div>

                    <p className="text-base md:text-lg leading-relaxed text-on-surface-subtle font-normal italic border-l-4 border-brand-blue pl-6">
                      <HighlightText text={activeStrength.intro} keywords={activeStrength.keywords} isIntro />
                    </p>

                    <div className="space-y-5">
                      {activeStrength.items.map((item, i) => (
                        <div key={i} className="group/item">
                          {typeof item === 'string' ? (
                            <div className="flex gap-4">
                              <div className="mt-1.5 w-2 h-2 rounded-full bg-brand-orange flex-shrink-0 shadow-[0_0_10px_rgba(245,130,32,0.5)]" />
                              <p className="text-on-surface text-sm md:text-lg leading-relaxed">
                                <HighlightText text={item} keywords={activeStrength.keywords} />
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-4 bg-brand-blue/5 p-6 rounded-2xl border border-glass-border">
                              <div className="flex items-center gap-3">
                                <div className="w-1.5 h-6 bg-brand-orange rounded-full" />
                                <p className="text-brand-orange font-black text-sm uppercase tracking-widest">
                                  {item.label}
                                </p>
                              </div>
                              <ul className="grid grid-cols-1 gap-3 pl-4">
                                {item.subItems.map((sub, j) => (
                                  <li key={j} className="flex gap-3 items-start text-sm text-on-surface-subtle leading-relaxed">
                                    <div className="w-1 h-1 bg-brand-orange/40 rounded-full mt-1.5 flex-shrink-0" />
                                    {sub}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* CTA in Modal */}
                    <div className="pt-8 border-t border-white/10">
                      <a 
                        href="https://wa.me/525561500317" 
                        target="_blank"
                        className="inline-flex items-center gap-3 bg-brand-orange text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-brand-orange transition-all hover:scale-105 shadow-xl"
                      >
                        Solicitar Cotización
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <QRCodeModal isOpen={isQRModalOpen} onClose={() => setIsQRModalOpen(false)} url={window.location.href} />
    </div>
  );
}
