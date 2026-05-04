/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react';
import { logoBase64 } from './logoBase64';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useInView, animate } from 'motion/react';
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
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
  ArrowLeftRight
} from 'lucide-react';
import BeforeAfterGallery from './components/BeforeAfterGallery';

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

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
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
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (videoRef.current.duration) {
        setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
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
      videoRef.current.currentTime = (videoRef.current.duration / 100) * val;
      setProgress(val);
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
        className={`w-full h-full object-contain ${!isPlaying && !hasInteracted ? 'opacity-80' : 'opacity-100'} transition-opacity duration-500`}
        preload="metadata"
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Initial Clean Play Button (Disappears after first interaction) */}
      {!hasInteracted && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-20 h-20 bg-brand-orange/90 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm group-hover:bg-brand-orange transition-colors duration-300">
            <Play className="w-10 h-10 text-white fill-current ml-1" />
          </div>
        </div>
      )}

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
  intro: string;
  items: (string | { label: string; subItems: string[] })[];
  image: string;
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
    icon: <Layers className="w-5 h-5" />,
    intro: 'Donde la eficiencia del proceso comienza desde la base, con pisos de altos niveles de calidad, seguridad y estética.',
    keywords: ['Instalación de concreto para pisos', 'tratamientos químicos', '(DPA)', 'concretos oxidados', 'sello de juntas', 'sobre pisos', 'concretos aligerados', 'acabados decorativos'],
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
    items: [
      'Instalación de concreto para pisos con altos estándares de precisión and acabado',
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
    title: 'PISOS EPÓXICOS DE VALOR',
    icon: <Zap className="w-5 h-5" />,
    intro: 'Donde se puede jugar con ideas de decoración vanguardistas e innovadoras en una amplia gama de colores y texturas con diseños originales, creativos y personalizados.',
    keywords: ['Epóxico autonivelante', 'mate', 'marmoleado', 'hojuelas', 'cuarzo multicolor', 'brillante o satinado'],
    image: 'https://images.unsplash.com/photo-1454165833267-028a0513904d?auto=format&fit=crop&w=1200&q=80',
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
    title: 'ACABADOS DE ALTA GAMA',
    icon: <ShieldCheck className="w-5 h-5" />,
    intro: 'Verdadera ingeniería aplicada en materiales poliméricos con altas prestaciones y gran nivel de seguridad.',
    keywords: ['químico-resistentes', 'inmersión contínua', 'reforzados', 'ladrillos y losetas', 'Recubrimientos ahulados', 'resistencia térmica', 'En húmedo', 'En seco', 'resistencia mecánica', 'abuso físico', 'dieléctricas', 'Conductivos', 'Antiestáticos', 'requerimientos sanitarios', '(FDA)', '(USDA)', '(COFEPRIS)', '(SENESICA)', '(NSF)'],
    image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
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
    title: 'REPARACIÓN DE CONCRETO',
    icon: <Wrench className="w-5 h-5" />,
    intro: 'Donde las condiciones de operación están cimentadas en elementos de concreto siempre sano y resistente.',
    keywords: ['Bacheos', 'cortos tiempos de paro', 'Renivelar', 'planicidad', 'reparación', 'juntas', 'cámaras de refrigeración', 'Inyección', 'grietas', 'Resanador', 'Estabilizar losas', 'Reforzar', 'estructural', 'fibra de carbón', 'Obturadores', 'filtraciones'],
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&w=1200&q=80',
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
    icon: <Droplets className="w-5 h-5" />,
    intro: 'Donde existe flujo de agua a través de elementos de concreto con agrietamientos, segregación de cargas, juntas o porosidad en la superficie.',
    keywords: ['poliurea', 'Sistemas vehiculares', 'para estacionamientos', 'cisternas de agua potable', 'Obturadores', 'filtraciones', 'Prefabricados'],
    image: 'https://images.unsplash.com/photo-1534398079543-7ae6d016b86a?auto=format&fit=crop&w=1200&q=80',
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
    icon: <Paintbrush className="w-5 h-5" />,
    intro: 'Impacto positivo en clientes y visitantes a través del cuidado, conservación, limpieza y seguridad de sus áreas operativas.',
    keywords: ['epóxi-poliuretano', 'Acabados sanitarios', 'muros y plafones', 'Curvas sanitarias', 'fotoluminiscentes', 'Pintura sobre equipos oxidados', 'Pintura de maquinaria', 'tubería y estructuras', 'Acabados antiadherentes'],
    image: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=1200&q=80',
    items: [
      'Sistemas epóxi-poliuretano como acabado en pisos para servicios ligeros',
      'Acabados sanitarios lisos, continuos, sin bordes, y antibacteriales en muros y plataformas',
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
    title: 'SISTEMAS CORTAFUEGO DE PROTECCIÓN PASIVA',
    icon: <Flame className="w-5 h-5" />,
    intro: 'Como elemento de seguridad adicional para proteger vidas y salvaguardar instalaciones porque el fuego no se controla, se contiene y se limita.',
    keywords: ['(intumescentes)', 'Sellado de pasos de instalaciones', 'Sello de juntas'],
    image: 'https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&w=1200&q=80',
    items: [
      'Instalación de retardantes de fuego (intumescentes)',
      'Sellado de pasos de instalaciones (tubería, líneas de cableado) a través de muros y juntas de construcción',
      'Sello de juntas en el remate de muros y techos metálicos'
    ]
  },
  {
    id: 'pa8',
    title: 'ESPECIALIDADES COMPLEMENTARIAS',
    icon: <HardHat className="w-5 h-5" />,
    intro: 'Materiales de especialidad que requieren instalación profesional para su buen desempeño',
    keywords: ['Espuma de poliuretano', 'aislante térmico', 'ruido', 'Juntas de expansión en puentes', 'WABO', 'Grouts de precisión', 'Asentamiento', 'maquinaria', 'Fabricación de equipos de acero', 'equipos especiales', 'Limpieza', 'Química y mecánica', 'Linnings', 'usando lámina de acero'],
    image: 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=1200&q=80',
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
    before: './antes_1.jpg',
    after: './antes_2.jpg'
  },
  {
    id: 'case2',
    title: 'Caso de Éxito 2',
    description: 'Nivelación y acabado resistente de alto desempeño.',
    before: './antes_3.jpg',
    after: './antes_4.jpg'
  },
  {
    id: 'case3',
    title: 'Caso de Éxito 3',
    description: 'Restauración profunda y recubrimiento protector.',
    before: './antes_5.jpg',
    after: './antes_6.jpg'
  },
  {
    id: 'case4',
    title: 'Caso de Éxito 4',
    description: 'Soluciones duraderas para áreas de tráfico severo.',
    before: './antes_7.jpg',
    after: './antes_8.jpg'
  },
  {
    id: 'case5',
    title: 'Caso de Éxito 5',
    description: 'Aplicación de sistemas de protección y acabados de alta calidad.',
    before: './antes_9.jpg',
    after: './antes_10.jpg'
  }
];

const GALLERY_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80', title: 'Piso Industrial de Alta Precisión' },
  { url: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=800&q=80', title: 'Acabados Químico-Resistentes' },
  { url: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=800&q=80', title: 'Laboratorio con Piso Epóxico' },
  { url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80', title: 'Mantenimiento de Superficies' },
  { url: 'https://images.unsplash.com/photo-1534398079543-7ae6d016b86a?auto=format&fit=crop&w=800&q=80', title: 'Instalación de Recubrimientos' },
  { url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80', title: 'Personal Altamente Capacitado' },
  { url: 'https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&w=800&q=80', title: 'Infraestructura Industrial' },
  { url: 'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&w=800&q=80', title: 'Proyectos de Gran Escala' },
  { url: 'https://images.unsplash.com/photo-1503387762-592dee582a2b?auto=format&fit=crop&w=800&q=80', title: 'Estructuras Metálicas' },
  { url: 'https://images.unsplash.com/photo-1531834685032-c34bf0d84c77?auto=format&fit=crop&w=800&q=80', title: 'Control de Corrosión' },
  { url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80', title: 'Ingeniería de Detalle' },
  { url: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80', title: 'Mantenimiento Preventivo' },
  { url: 'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&w=800&q=80', title: 'Sistemas de Protección' },
  { url: 'https://images.unsplash.com/photo-1563200155-22442f49d32d?auto=format&fit=crop&w=800&q=80', title: 'Procesos Industriales' },
  { url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80', title: 'Almacenamiento Logístico' },
  { url: 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=800&q=80', title: 'Tecnología Polimérica' }
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
    description: 'Sistemas sanitarios de alto desempeño en cumplimiento regulatorio estricto.',
    icon: <Droplets className="w-6 h-6" />,
    details: {
      intro: 'Materiales en cumplimiento con regulaciones de la FDA, USDA (EEUU), y COFEPRIS, SENASICA (Méx).',
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
          items: ['Instalación de pisos de concreto', 'Reparación de concreto', 'Sello de juntas', 'Acabados decorativos', 'Impermeabilización', 'Acabados de alta gama']
        }
      ]
    }
  },
  {
    id: 's3',
    title: 'Instalaciones Comerciales y Recreación',
    description: 'Donde se busca que la imagen de la empresa impacte positivamente.',
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
    description: 'Protección de activos de producción para garantizar una rápida rotación.',
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
const SYSTEM_INSTRUCTION = `Eres el Ingeniero Senior de Proyectos de MCI Soluciones Poliméricas. Tu personalidad es la de un consultor técnico experto, con más de 30 años de experiencia en campo. 

Tu tono es:
- Altamente técnico y profesional (usas términos como "carbonatación", "resistencia a la compresión", "curado químico", "anclaje mecánico").
- Directo y enfocado en la solución definitiva (no recomiendas "parches", sino sistemas de ingeniería).
- Preventivo: Siempre adviertes sobre los riesgos de no tratar un problema a tiempo (contaminación, riesgos de seguridad, paros de planta).

Nuevas Capacidades Críticas:
1. ANÁLISIS DE IMÁGENES: Si el usuario sube una foto, analízala detalladamente. Busca grietas, desprendimientos, manchas de humedad, o desgaste por químicos. Da un pre-diagnóstico técnico basado en lo que ves y sugiere el sistema de MCI Soluciones Poliméricas adecuado (ej. "Veo una falla por presión osmótica, recomiendo nuestro sistema de barrera de vapor...").
2. REPORTE TÉCNICO: Si el usuario describe un problema o tras un análisis de imagen, ofrece generar un "Reporte de Diagnóstico Preliminar". Estructúralo con: [Situación Detectada], [Riesgo Operativo], [Solución Técnica Recomendada] y [Siguiente Paso].
3. CONOCIMIENTO EXPANDIDO: No te limites solo a lo que dice la página. Usa tu conocimiento general de ingeniería civil y química de polímeros para explicar el "por qué" de las fallas. Habla de normas ASTM, ISO y regulaciones mexicanas.

Información Clave de la Empresa:
- Nombre: MCI Soluciones Poliméricas.
- Cobertura: Todo México.
- Respuesta: Capacitados para atender emergencias industriales.

Reglas de Oro:
- Nunca des precios exactos (indica que se requiere visita técnica).
- Si el problema es crítico (ej. riesgo de colapso o contaminación masiva), urge al usuario a contactar al CEO por WhatsApp inmediatamente.
- Usa un lenguaje que inspire confianza técnica absoluta.`;

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// --- Main App Component ---

export default function App() {
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
    { type: 'bot', text: '¡Hola! Soy tu asistente técnico de Polycovers. ¿En qué puedo asesorarte hoy sobre tu proyecto industrial?' }
  ]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const strengthSheetRef = useRef<HTMLDivElement>(null);
  const strengthNavRef = useRef<HTMLDivElement>(null);

  // Click outside to close technical sheet
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // If clicking inside the sheet or inside the navigation grid, don't close
      if (strengthSheetRef.current && strengthSheetRef.current.contains(event.target as Node)) {
        return;
      }
      if (strengthNavRef.current && strengthNavRef.current.contains(event.target as Node)) {
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
  const readSectionsRef = useRef<Set<string>>(new Set());

  const extractSectionText = useCallback((el: HTMLElement): string => {
    const elements = el.querySelectorAll('h1, h2, h3, h4, p, li');
    let textParts: string[] = [];
    
    elements.forEach(subEl => {
      const htmlEl = subEl as HTMLElement;
      const content = htmlEl.innerText?.trim();
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

    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const mxVoice = voices.find(v => v.lang === 'es-MX' && v.name.includes('Google')) || 
                    voices.find(v => v.lang === 'es-MX') ||
                    voices.find(v => v.lang.includes('es-MX')) ||
                    voices.find(v => v.lang.includes('es'));
    
    if (mxVoice) utterance.voice = mxVoice;
    utterance.lang = 'es-MX';
    utterance.rate = 0.95;
    
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
  }, []);

  const toggleSpeech = useCallback(() => {
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
      window.speechSynthesis.cancel();
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
      const parts: any[] = [];
      if (userMsg) parts.push({ text: userMsg });
      if (currentFile) {
        parts.push(await fileToGenerativePart(currentFile));
      }

      // Usar streaming para no bloquear y mejorar UX
      const stream = await ai.models.generateContentStream({ 
        model: "gemini-1.5-flash",
        contents: [{ role: 'user', parts }],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION + "\n\nIMPORTANTE: Responde de manera concisa y directa."
        }
      });

      let botText = "";
      // Agregar mensaje vacío del bot para ir actualizando
      setChatMessages(prev => [...prev, { type: 'bot', text: '' }]);

      for await (const chunk of stream) {
        const chunkText = chunk.candidates?.[0]?.content?.parts?.[0]?.text;
        if (chunkText) {
          botText += chunkText;
          setChatMessages(prev => {
            const newMsg = [...prev];
            newMsg[newMsg.length - 1].text = botText;
            return newMsg;
          });
        }
      }
      
      setBotExpression('happy');
      setTimeout(() => setBotExpression('idle'), 3000);
    } catch (error) {
      console.error("AI Error Details:", error);
      setChatMessages(prev => [...prev, { type: 'bot', text: "Hubo un error al conectar con el asistente. Por favor, intenta de nuevo o contáctanos por WhatsApp." }]);
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

  // Global Smooth Scroll interception for ALL anchor links
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (!anchor) return;
      
      const href = anchor.getAttribute('href');
      if (href && href.startsWith('#') && href !== '#') {
        e.preventDefault();
        playClickSound();
        
        if (href === '#inicio') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          const element = document.querySelector(href);
          if (element) {
            const headerOffset = window.scrollY > 50 ? 80 : 110;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - headerOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }
        
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, []);

  // Inline smooth scroll handler fallback
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, href: string) => {
    e.preventDefault();
    // The actual scrolling is now handled globally by the handleGlobalClick listener
  };

  const navLinks = useMemo(() => [
    { name: 'Inicio', href: '#inicio' },
    { name: 'Sectores', href: '#sectores' },
    { name: 'Fortalezas', href: '#fortalezas' },
    { name: 'Galería', href: '#galeria' },
    { name: 'Contacto', href: '#contacto-footer' }
  ], []);

  return (
    <div className="min-h-screen w-full bg-surface text-on-surface transition-colors duration-500 overflow-x-hidden relative">
      
      {/* Header / Navigation */}
      <header 
        className={`fixed top-0 left-0 right-0 z-[10000] transition-all duration-500 border-b ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-xl py-2 sm:py-3 shadow-[0_10px_40px_-15px_rgba(34,211,238,0.2)] border-[#22d3ee]/20' 
            : 'bg-white/40 backdrop-blur-md py-4 sm:py-5 border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-6 flex items-center justify-between">
          <a 
            href="#inicio" 
            className="flex items-center gap-3 sm:gap-4 group flex-shrink-0 cursor-pointer min-w-0"
            onClick={(e) => handleSmoothScroll(e, '#inicio')}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 flex items-center justify-center transition-transform duration-500 group-hover:scale-105 flex-shrink-0 drop-shadow-md">
              <img 
                src={logoBase64} 
                alt="Logo MCI" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col notranslate min-w-0 justify-center" translate="no">
              <span className="text-lg sm:text-2xl md:text-3xl font-black tracking-tight leading-none flex flex-wrap gap-x-1.5 items-baseline lg:whitespace-nowrap">
                <span className="text-brand-orange">MCI</span>
                <span className="text-slate-900 transition-colors drop-shadow-sm">Soluciones</span>
              </span>
              <span className="text-[0.6rem] sm:text-[0.7rem] md:text-[0.8rem] font-bold uppercase tracking-[0.1em] sm:tracking-[0.2em] md:tracking-[0.25em] text-slate-600 mt-1 transition-colors leading-tight lg:whitespace-nowrap">Poliméricas</span>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6 lg:gap-10">
            {navLinks.map((link) => (
              <a 
                key={link.name}
                href={link.href}
                className="text-xs font-black uppercase tracking-[0.25em] text-on-surface/90 hover:text-brand-orange transition-all relative group/nav"
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

      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-brand-blue/15 blur-[120px] rounded-full will-change-transform" />
        <div className="absolute top-[40%] -right-[10%] w-[50%] h-[50%] bg-brand-orange/15 blur-[120px] rounded-full will-change-transform" />
      </div>

      {/* Hero Section */}
      <section id="inicio" className="relative pt-32 md:pt-40 pb-20 md:pb-28 lg:pb-32 w-full flex-grow overflow-hidden bg-slate-50">
        
        {/* Fondo fotográfico alineado a la derecha para evitar zoom/recortes y permitir que el casco se vea */}
        <div className="absolute inset-y-0 right-0 w-full md:w-[75%] lg:w-[65%] z-0">
          <img 
            src="https://i.postimg.cc/3wK1P8Yb/imagen-hero.png" 
            alt="MCI Soluciones Fotografía Oficial"
            className="absolute inset-0 w-full h-full object-cover object-[center_top] opacity-100"
            crossOrigin="anonymous"
          />
          {/* Degradado para fundir el borde izquierdo de la foto suavemente con el fondo claro */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-slate-50/70 to-transparent z-10 w-full md:w-[50%]" />
        </div>
        
        {/* Degradado superpuesto intenso a la izquierda para el texto general del hero */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-slate-50/95 via-[30%] to-transparent z-10 pointer-events-none" />
        
        <div className="relative z-20 max-w-7xl mx-auto px-5 sm:px-6 md:px-10 lg:px-12 py-8 md:py-16 md:mt-0">
          <div className="flex flex-col gap-12 lg:gap-16 items-start w-full">
            
            {/* 1. ¿Quiénes Somos? Text */}
            <div className="flex flex-col items-center md:items-start space-y-6 w-full max-w-3xl">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3 max-w-full flex flex-col items-center md:items-start"
              >
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight uppercase leading-[1.1] md:leading-tight text-slate-900 text-center md:text-left transition-all duration-300 drop-shadow-sm px-2 md:px-0">
                  <span>¿Quiénes</span>{' '}
                  <span className="text-brand-orange">Somos</span>
                  <span>?</span>
                </h1>
                <div className="h-1 w-16 sm:w-20 bg-brand-orange rounded-full shadow-[0_2px_8px_rgba(245,130,32,0.6)]" />
              </motion.div>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-base md:text-lg lg:text-xl text-slate-800 leading-relaxed font-bold max-w-2xl lg:max-w-3xl text-center md:text-left px-4 md:px-0 transition-all duration-300 drop-shadow-sm"
                style={{ overflowWrap: 'break-word' }}
              >
                Empresa con más de <span className="hl font-black text-brand-orange drop-shadow-sm">30 años</span> de consolidación en los sectores <span className="hl font-black text-brand-blue">Industrial</span> y de la <span className="hl font-black text-brand-blue">Construcción</span> en <span className="hl font-black text-brand-blue">México</span> con el único objetivo de ofrecer <span className="hl font-black text-brand-orange">soluciones duraderas</span> con <span className="hl font-black text-slate-900">ingeniería</span> en <span className="hl font-black text-slate-900">materiales poliméricos</span> de <span className="hl font-black text-brand-orange">alta gama</span> para <span className="hl font-black text-brand-blue">restaurar</span>, <span className="hl font-black text-brand-blue">mejorar</span> y <span className="hl font-black text-brand-blue">proteger</span> instalaciones expuestas a <span className="hl font-black text-slate-900">daños físicos</span> o <span className="hl font-black text-slate-900">químicos</span>, maximizando su vida útil para <span className="hl font-black text-brand-orange">preservar</span> el valor de tu <span className="hl font-black text-brand-orange">inversión</span>.
              </motion.p>
            </div>

            {/* 2. Video Player - "Modo Cine" size between text and cards */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-full max-w-5xl mx-auto"
            >
              <CustomVideoPlayer />
            </motion.div>

            {/* 3. Misión/Visión/Propuesta Cards */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1 }
                }
              }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full max-w-lg md:max-w-none mx-auto"
            >
              {[
                { 
                  label: 'Misión', 
                  icon: <Target className="w-5 h-5" />, 
                  content: 'Soluciones poliméricas que protegen superficies en condiciones extremas.' 
                },
                { 
                  label: 'Visión', 
                  icon: <Eye className="w-5 h-5" />, 
                  content: 'Líder en protección industrial y sistemas de alta exigencia técnica.' 
                },
                { 
                  label: 'Propuesta de Valor', 
                  icon: <ShieldCheck className="w-5 h-5" />, 
                  list: [
                    'Más de 30 años de experiencia',
                    'Respuesta inmediata 24/7',
                    'Rigor técnico',
                    'Soluciones integrales a la medida',
                    'Calidad total demostrada',
                    'Responsabilidad operativa',
                    'Protección a largo plazo'
                  ] 
                }
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className={`p-5 md:p-6 rounded-3xl border-2 transition-all duration-500 group flex flex-col items-center text-center gap-4 cursor-pointer relative overflow-hidden w-full max-w-[240px] md:max-w-[300px] mx-auto ${activeHeroAcc === i ? 'ring-2 ring-brand-orange/50 bg-white shadow-2xl md:-translate-y-2 border-transparent' : 'bg-white/80 backdrop-blur-xl border-brand-blue/10 hover:bg-white hover:shadow-xl hover:border-brand-orange/30'}`}
                  onMouseEnter={() => { if (window.innerWidth > 768) setActiveHeroAcc(i); }}
                  onMouseLeave={() => { if (window.innerWidth > 768) setActiveHeroAcc(null); }}
                  onClick={() => { if (window.innerWidth <= 768) setActiveHeroAcc(activeHeroAcc === i ? null : i); }}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-sm border border-slate-100 ${activeHeroAcc === i ? 'bg-brand-orange text-white shadow-[0_5px_15px_rgba(245,130,32,0.4)]' : 'bg-slate-50 text-slate-700 group-hover:bg-brand-orange group-hover:text-white group-hover:border-transparent'}`}>
                    {React.cloneElement(item.icon as React.ReactElement, { className: 'w-5 h-5 text-brand-orange group-hover:text-white transition-colors duration-300' })}
                  </div>
                  <div className="flex-1 w-full">
                    <h3 className={`text-xs md:text-sm font-black uppercase tracking-[0.15em] transition-colors ${activeHeroAcc === i ? 'text-brand-orange' : 'text-slate-900 group-hover:text-brand-orange'}`}>
                      {item.label}
                    </h3>
                    
                    <AnimatePresence>
                      {(activeHeroAcc === i || (typeof window !== 'undefined' && window.innerWidth > 768 && activeHeroAcc === i)) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden mt-3"
                        >
                          {item.content ? (
                            <p className="text-[10px] md:text-xs text-slate-600 leading-snug font-medium text-left">
                              {item.content}
                            </p>
                          ) : (
                            <div className="flex flex-col items-start space-y-2 mt-2 px-1">
                              {item.list?.map((li, idx) => (
                                <div key={idx} className="flex items-start gap-2 text-[10px] md:text-xs text-slate-600 font-bold text-left leading-tight">
                                  <div className="w-1 h-1 bg-brand-orange rounded-full mt-1.5 flex-shrink-0" />
                                  {li}
                                </div>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Hint for mobile */}
                    {activeHeroAcc !== i && (
                      <div className="md:hidden mt-2 opacity-40">
                         <span className="text-[8px] font-black uppercase tracking-widest text-brand-orange">+ detalles</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Infinite Horizontal Marquee Section */}
        <div className="mt-8 md:mt-16 overflow-hidden w-full relative z-10 border-t border-brand-blue/10 pt-10">
          <div className="text-center mb-8 md:mb-12 px-4">
            <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-on-surface mb-4 leading-tight drop-shadow-sm">
              Así Garantizamos <span className="text-gradient transition-colors">Resultados</span>
            </h2>
            <div className="w-20 md:w-32 h-1.5 md:h-2 bg-brand-orange mx-auto rounded-full shadow-[0_0_20px_rgba(245,130,32,0.3)]" />
          </div>
          <div className="marquee-container overflow-x-auto overflow-y-hidden hide-scrollbar cursor-grab active:cursor-grabbing touch-pan-x">
            <div className="marquee-content w-max">
              {/* Original Items */}
              {[
                { num: '01', title: 'Diagnóstico', text: 'Visita al sitio para identificar variables críticas.' },
                { num: '02', title: 'Propuesta', text: 'Definimos la solución técnica más viable.' },
                { num: '03', title: 'Ejecución', text: 'Control y supervisión permanente.' },
                { num: '04', title: 'Sustentabilidad', text: 'Protocolos amigables al entorno.' },
                { num: '05', title: 'Atención Post-Venta', text: 'Compromiso con nuestros clientes.' }
              ].map((step, i) => (
                <div key={i} className="marquee-card">
                  <div className="marquee-num">{step.num}</div>
                  <h4 className="marquee-title">{step.title}</h4>
                  <p className="marquee-desc">{step.text}</p>
                </div>
              ))}
              {/* Duplicated Items for Seamless Loop */}
              {[
                { num: '01', title: 'Diagnóstico', text: 'Visita al sitio para identificar variables críticas.' },
                { num: '02', title: 'Propuesta', text: 'Definimos la solución técnica más viable.' },
                { num: '03', title: 'Ejecución', text: 'Control y supervisión permanente.' },
                { num: '04', title: 'Sustentabilidad', text: 'Protocolos amigables al entorno.' },
                { num: '05', title: 'Atención Post-Venta', text: 'Compromiso con nuestros clientes.' }
              ].map((step, i) => (
                <div key={`dup-${i}`} className="marquee-card">
                  <div className="marquee-num">{step.num}</div>
                  <h4 className="marquee-title">{step.title}</h4>
                  <p className="marquee-desc">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

          {/* Stats Section */}
          <section className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 py-8 md:py-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {[
                { label: 'Años de Experiencia', value: 30, suffix: '+', icon: <Clock className="w-5 h-5" /> },
                { label: 'Calidad Total', value: 100, suffix: '%', icon: <ShieldCheck className="w-5 h-5" /> },
                { label: 'Disponibilidad', value: '24/7', suffix: '', icon: <Zap className="w-5 h-5" /> }
              ].map((stat, i) => (
                <div key={i} className="p-6 md:p-10 rounded-3xl text-center space-y-2 border-2 bg-[#22d3ee]/15 backdrop-blur-xl border-[#22d3ee]/30 hover:bg-white hover:shadow-2xl hover:border-transparent shadow-xl transition-all group will-change-transform hover:-translate-y-2">
                  <div className="mx-auto w-12 h-12 bg-[#22d3ee] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] transition-all shadow-[0_8px_16px_rgba(34,211,238,0.3)] border border-white/20">
                    {React.cloneElement(stat.icon as React.ReactElement, { className: 'w-5 h-5 text-brand-orange group-hover:text-white transition-colors duration-300' })}
                  </div>
              <div className="text-2xl sm:text-4xl md:text-6xl font-black text-on-surface tracking-tighter transition-colors">
                {typeof stat.value === 'number' ? <Counter target={stat.value} /> : stat.value}
                <span className="text-brand-orange">{stat.suffix}</span>
              </div>
              <div className="text-[10px] md:text-sm font-bold text-on-surface-subtle uppercase tracking-[0.3em] transition-colors">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Sectors Section */}
      <section id="sectores" className="relative z-10 max-w-7xl mx-auto px-5 md:px-6 py-8 md:py-16 will-change-transform">
        <div className="text-center mb-12 md:mb-20 space-y-4 md:space-y-6">
          <h2 className="text-2xl sm:text-4xl md:text-6xl font-black uppercase tracking-tighter text-on-surface drop-shadow-sm transition-all duration-300">
            Sectores que <span className="text-gradient transition-colors">Atendemos</span>
          </h2>
          <div className="w-24 md:w-32 h-1.5 md:h-2 bg-brand-orange mx-auto rounded-full shadow-[0_0_20px_rgba(245,130,32,0.3)]" />
          <p className="text-on-surface max-w-3xl mx-auto text-base md:text-xl font-bold leading-relaxed transition-all duration-300 px-4">
            Soluciones especializadas para cada entorno de alta exigencia, garantizando durabilidad y cumplimiento normativo.
          </p>
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
          className="flex md:grid overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 pb-6 md:pb-0 hide-scrollbar -mx-5 px-5 md:mx-0 md:px-0"
        >
          {SECTORS.map((sector) => (
            <motion.div 
              key={sector.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              className={`shrink-0 w-[85vw] sm:w-auto snap-center p-6 md:p-8 rounded-2xl md:rounded-3xl border-2 transition-all duration-500 cursor-pointer group relative ${activeSector === sector.id ? 'ring-2 ring-brand-orange/50 bg-white shadow-2xl translate-y--2 border-transparent' : 'bg-[#22d3ee]/15 backdrop-blur-xl border-[#22d3ee]/30 hover:bg-white hover:shadow-lg hover:border-transparent hover:-translate-y-1'}`}
              onClick={() => {
                playClickSound();
                setActiveSector(activeSector === sector.id ? null : sector.id);
              }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-2xl border transition-all duration-500 group-hover:scale-110 ${activeSector === sector.id ? 'bg-brand-blue text-white shadow-[0_0_20px_rgba(0,75,135,0.3)] border-transparent' : 'bg-[#22d3ee] shadow-[0_5px_15px_rgba(34,211,238,0.2)] border-white/20'}`}>
                  {React.cloneElement(sector.icon as React.ReactElement, { className: 'w-5 h-5 text-brand-orange transition-colors duration-300' })}
                </div>
                <h3 className={`text-sm sm:text-base md:text-lg font-black uppercase tracking-[0.1em] md:tracking-[0.2em] leading-tight transition-colors duration-300 whitespace-normal break-words ${activeSector === sector.id ? 'text-brand-orange' : 'text-on-surface'}`}>{sector.title}</h3>
              </div>
              <p className="text-sm text-on-surface-subtle leading-relaxed mb-4 font-medium tracking-wide whitespace-normal break-words">{sector.description}</p>
              
              <AnimatePresence mode="popLayout">
                {activeSector === sector.id && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="pt-6 border-t border-glass-border space-y-5"
                  >
                    {sector.details?.intro && (
                      <p className="text-sm text-brand-orange font-bold italic tracking-wide bg-brand-orange/5 p-2 rounded-lg">{sector.details.intro}</p>
                    )}
                    {sector.details?.groups.map((group, i) => (
                      <div key={i} className="space-y-3">
                        <h4 className="text-sm font-black text-on-surface uppercase tracking-[0.2em] flex items-center gap-2">
                          <div className="w-1 h-1 bg-brand-orange rounded-full" />
                          {group.title}
                        </h4>
                        <ul className="grid grid-cols-1 gap-2.5">
                          {group.items.map((item, j) => (
                            <li key={j} className="flex items-start gap-3 text-sm text-on-surface-subtle font-medium leading-relaxed">
                              <ArrowRight className="w-2.5 h-2.5 text-brand-orange/40 mt-0.5 flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="absolute bottom-6 right-8 text-brand-orange opacity-20 group-hover:opacity-100 transition-all duration-500">
                <ChevronDown className={`w-5 h-5 transition-transform duration-500 ${activeSector === sector.id ? 'rotate-180' : ''}`} />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Strengths Section */}
      <section id="fortalezas" className="relative z-10 py-16 md:py-24 overflow-hidden">
        {/* Background Texture for Strengths */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-slate-50/90 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1532187875956-c7306286c6a1?auto=format&fit=crop&w=1920&q=80" 
            alt="Polymer Engineering Abstract"
            className="w-full h-full object-cover opacity-20 grayscale brightness-125"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-6 will-change-transform">
          <div className="text-center mb-12 md:mb-20 space-y-4 md:space-y-6">
          <h2 className="text-2xl sm:text-4xl md:text-6xl font-black uppercase tracking-tighter text-on-surface drop-shadow-sm transition-all duration-300">
            Nuestras <span className="text-gradient transition-colors">Fortalezas</span>
          </h2>
          <div className="w-24 md:w-32 h-1.5 md:h-2 bg-brand-orange mx-auto rounded-full shadow-[0_0_20px_rgba(245,130,32,0.3)]" />
          <p className="text-base md:text-xl text-on-surface max-w-4xl mx-auto leading-relaxed font-bold px-4 transition-all duration-300">
            Selecciona una especialidad para ver su ficha técnica detallada y conocer por qué somos líderes en el mercado.
          </p>
        </div>

        {/* Strengths List with Modal Technical Sheets */}
        <div className="max-w-5xl mx-auto">
          <div className="flex md:grid overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-6 md:pb-0 hide-scrollbar -mx-5 px-5 md:mx-0 md:px-0">
            {STRENGTHS.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  playClickSound();
                  setActiveStrength(s);
                  setIsStrengthHovered(true);
                }}
                className="shrink-0 w-[75vw] sm:w-[45vw] md:w-auto snap-center group relative p-4 md:p-6 rounded-xl md:rounded-2xl border-2 bg-[#22d3ee]/15 backdrop-blur-xl border-[#22d3ee]/30 transition-all duration-500 flex flex-col sm:flex-row lg:flex-col items-center gap-3 md:gap-5 text-center sm:text-left lg:text-center hover:bg-white hover:shadow-2xl hover:border-transparent hover:-translate-y-1.5"
              >
                <div className="p-3 rounded-xl bg-[#22d3ee] group-hover:bg-brand-orange transition-all duration-500 shadow-[0_5px_15px_rgba(34,211,238,0.2)] group-hover:shadow-[0_0_25px_rgba(245,130,32,0.4)] border border-white/20">
                  {React.cloneElement(s.icon as React.ReactElement, { className: 'w-6 h-6 text-brand-orange group-hover:text-white transition-colors duration-300' })}
                </div>
                <div className="flex-1">
                  <h3 className="text-sm md:text-base font-black text-on-surface uppercase tracking-widest leading-tight group-hover:text-brand-orange transition-colors">
                    {s.title}
                  </h3>
                </div>
                <div className="w-8 h-8 rounded-full border border-glass-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-2 group-hover:translate-x-0">
                  <ArrowRight className="w-4 h-4 text-brand-orange" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>

      {/* Gallery Section */}
      <section id="galeria" className="relative z-10 py-8 md:py-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-16">
          <div className="text-center space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border-brand-orange/30 text-brand-orange text-xs font-bold uppercase tracking-widest shadow-sm"
            >
              <Paintbrush className="w-3 h-3" />
              Portafolio Visual en Movimiento
            </motion.div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-on-surface uppercase tracking-tighter drop-shadow-sm">
            Nuestra <span className="text-gradient">Galería</span>
          </h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-on-surface max-w-2xl mx-auto font-bold text-base md:text-xl transition-all duration-300 px-4"
            >
              Explora nuestra trayectoria a través de este recorrido visual automático. Haz clic en cualquier imagen para ampliarla.
            </motion.p>
          </div>
        </div>

        {/* Infinite Marquee Slideshow - Touch Pan Optimized */}
        <div className="relative flex overflow-hidden group">
          <motion.div 
            className="flex gap-4 py-4 cursor-grab active:cursor-grabbing"
            drag="x"
            dragConstraints={{ right: 0, left: -2000 }}
            animate={{
              x: ["0%", "-50%"],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 40,
                ease: "linear",
              },
            }}
            whileHover={{ animationPlayState: 'paused' }}
            whileTap={{ animationPlayState: 'paused' }}
            style={{ width: "fit-content" }}
          >
            {[...GALLERY_IMAGES, ...GALLERY_IMAGES].map((img, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05, zIndex: 10 }}
                onClick={() => setSelectedImage(img.url)}
                className="relative w-[220px] sm:w-[280px] md:w-[380px] aspect-video flex-shrink-0 rounded-2xl overflow-hidden glass border-glass-border cursor-pointer shadow-2xl will-change-transform"
              >
                <img
                  src={img.url}
                  alt={img.title}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="w-full h-full object-cover grayscale-[0.3] hover:grayscale-0 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#083344]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                  <p className="text-white font-black text-xs uppercase tracking-widest">{img.title}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Second row moving in opposite direction */}
        <div className="relative flex overflow-hidden group mt-4">
          <motion.div 
            className="flex gap-4 py-4 cursor-grab active:cursor-grabbing"
            drag="x"
            dragConstraints={{ right: 0, left: -2000 }}
            animate={{
              x: ["-50%", "0%"],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 50,
                ease: "linear",
              },
            }}
            whileHover={{ animationPlayState: 'paused' }}
            whileTap={{ animationPlayState: 'paused' }}
            style={{ width: "fit-content" }}
          >
            {[...GALLERY_IMAGES, ...GALLERY_IMAGES].reverse().map((img, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05, zIndex: 10 }}
                onClick={() => setSelectedImage(img.url)}
                className="relative w-[180px] sm:w-[240px] md:w-[320px] aspect-video flex-shrink-0 rounded-2xl overflow-hidden glass border-glass-border cursor-pointer shadow-2xl will-change-transform"
              >
                <img
                  src={img.url}
                  alt={img.title}
                  width="320"
                  height="180"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="w-full h-full object-cover grayscale-[0.3] hover:grayscale-0 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#083344]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                  <p className="text-white font-black text-xs uppercase tracking-widest">{img.title}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Transformación Industrial Section */}
      <section id="transformacion" className="relative z-10 max-w-7xl mx-auto px-5 md:px-6 py-12 md:py-24">
        <div className="flex flex-col gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6 text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border-brand-orange/30 text-brand-orange text-xs font-bold uppercase tracking-widest mx-auto">
              <ArrowLeftRight className="w-3 h-3" />
              Ingeniería en Resultados
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-on-surface drop-shadow-sm leading-tight">
              Transformación <span className="text-gradient">Industrial</span>
            </h2>
            <div className="w-20 md:w-24 h-1.5 md:h-2 bg-brand-orange rounded-full shadow-[0_0_20px_rgba(245,130,32,0.3)] mx-auto" />
            <div className="space-y-4">
              <p className="text-on-surface/80 text-base md:text-xl font-medium leading-relaxed font-bold">
                Nuestra tecnología en <strong className="text-on-surface font-black">polímeros de alta gama</strong> no solo corrige desperfectos estructurales, sino que otorga una vida útil extendida a sus instalaciones.
              </p>
              <p className="text-on-surface/80 text-base md:text-xl font-medium leading-relaxed font-bold">
                Observe cómo recuperamos la <strong className="text-brand-orange">integridad técnica</strong> y estética de superficies severamente degradadas.
              </p>
            </div>
            <div className="mt-8">
              <p className="text-sm font-bold text-brand-orange/80 italic">
                * Ejemplos ilustrativos de restauración.
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
            <BeforeAfterGallery pairs={BEFORE_AFTER_PAIRS} />
          </motion.div>
        </div>
      </section>

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
          <h2 className="text-2xl sm:text-4xl md:text-6xl font-black text-on-surface uppercase tracking-tighter drop-shadow-sm">
            Clientes <span className="text-gradient">Satisfechos</span>
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



      {/* Lightbox Modal */}
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
                src={selectedImage}
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

      {/* Technical Sheet Modal */}
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
              className="absolute inset-0 bg-cyan-100/90 backdrop-blur-sm"
              onClick={() => setIsStrengthHovered(false)}
            />
            
            <motion.div
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
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  {/* Image Side */}
                  <div className="relative h-64 lg:h-auto min-h-[300px] overflow-hidden">
                    <img 
                      src={activeStrength.image} 
                      alt={activeStrength.title}
                      className="absolute inset-0 w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-50 via-transparent to-transparent hidden lg:block" />
                    <div className="absolute inset-0 bg-gradient-to-t from-cyan-50 via-transparent to-transparent lg:hidden" />
                    
                    <div className="absolute top-8 left-8 glass px-6 py-2 rounded-full border-white/20 flex items-center gap-3">
                      <div className="w-2 h-2 bg-brand-orange rounded-full animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-white">Especificaciones Técnicas</span>
                    </div>
                  </div>

                  {/* Content Side */}
                  <div className="p-8 md:p-12 space-y-8">
                    <div className="space-y-4">
                      <div className="inline-block px-3 py-1 rounded-lg bg-brand-orange/10 border border-brand-orange/20">
                        <span className="text-[10px] font-black text-brand-orange uppercase tracking-widest">Fortaleza MCI</span>
                      </div>
                      <h3 className="text-2xl md:text-4xl font-black text-on-surface uppercase tracking-tighter leading-tight">
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
                        href="https://wa.me/525512979217" 
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



      {/* FAQ Section */}
      <section className="relative z-10 max-w-4xl mx-auto px-5 md:px-6 py-8 md:py-12">
        <div className="text-center mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border-brand-orange/30 text-brand-orange text-xs font-bold uppercase tracking-widest"
          >
            <Wrench className="w-3 h-3" />
            Resolviendo Dudas Técnicas
          </motion.div>
          <h2 className="text-2xl sm:text-4xl md:text-6xl font-black text-on-surface uppercase tracking-tighter drop-shadow-sm">
            Preguntas <span className="text-gradient">Frecuentes</span>
          </h2>
        </div>

        <div className="space-y-3 md:space-y-4">
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
              className={`glass p-5 md:p-6 rounded-2xl border-glass-border hover:border-brand-orange/50 transition-all group cursor-pointer ${activeFaq === i ? 'bg-white border-brand-orange shadow-2xl scale-[1.02]' : 'hover:bg-white hover:shadow-md'}`}
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-on-surface font-bold text-sm md:text-lg group-hover:text-brand-orange transition-colors flex items-start gap-3">
                  <span className="text-brand-orange/40 text-[10px] md:text-xs font-black mt-1 md:mt-1.5 whitespace-nowrap">0{i+1}</span>
                  {faq.q}
                </h3>
                <ChevronDown className={`w-5 h-5 text-brand-orange transition-transform duration-300 flex-shrink-0 ${activeFaq === i ? 'rotate-180' : ''}`} />
              </div>
              <AnimatePresence>
                {activeFaq === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="text-on-surface-subtle font-medium text-xs md:text-sm leading-relaxed pl-6 md:pl-8 border-l-2 border-brand-orange/20">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer Section */}
      <footer id="contacto-footer" className="relative z-10 bg-surface/50 backdrop-blur-3xl border-t border-glass-border mt-8 md:mt-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 md:px-6 py-12 md:py-20">
          <div className="text-center mb-16 md:mb-20 space-y-4">
            <h2 className="text-2xl sm:text-4xl md:text-6xl font-black text-on-surface uppercase tracking-tighter drop-shadow-sm">
              Da el primer paso hacia la <span className="text-gradient">Calidad Total</span>
            </h2>
            <p className="text-base md:text-lg text-on-surface font-bold transition-all duration-300">Ponte en contacto con nuestros ingenieros y cotiza tu proyecto.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-4 space-y-12">
              <div className="space-y-6">
                <h3 className="text-brand-blue font-black uppercase tracking-[0.3em] text-xs">Contacto Directo</h3>
                <div className="space-y-4">
                  {[
                    { icon: <Phone className="w-4 h-4" />, text: '55 1297 9217', href: 'tel:5512979217' },
                    { icon: <Mail className="w-4 h-4" />, text: 'mci.spolimericas@polycovers.mx', href: 'mailto:mci.spolimericas@polycovers.mx' },
                    { icon: <MapPin className="w-4 h-4" />, text: 'Ciudad de México, México', href: 'https://maps.google.com/?q=Ciudad+de+Mexico' }
                  ].map((item, i) => (
                    <a 
                      key={i} 
                      href={item.href}
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="flex items-center gap-4 group cursor-pointer"
                    >
                      <div className="p-3 glass rounded-xl border-glass-border group-hover:border-brand-orange/50 group-hover:bg-brand-orange/10 transition-all duration-300 text-brand-orange">
                        {item.icon}
                      </div>
                      <span className="text-on-surface group-hover:text-brand-orange transition-colors text-sm font-black tracking-wide">{item.text}</span>
                    </a>
                  ))}
                </div>
              </div>

              <a 
                href="https://wa.me/525512979217?text=Hola+MCI+Soluciones+Polim%C3%A9ricas%2C+me+gustar%C3%ADa+cotizar+un+proyecto." 
                target="_blank"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-[#25D366] to-[#1EBE55] text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs shadow-[0_10px_20px_rgba(37,211,102,0.3)] hover:shadow-[0_15px_30px_rgba(37,211,102,0.5)] transition-all duration-300 hover:-translate-y-1"
              >
                <MessageCircle className="w-4 h-4" />
                Chat por WhatsApp
              </a>
            </div>

            <div className="lg:col-span-8">
              <div className="bg-[#fcfdfe] p-6 md:p-12 rounded-[2rem] md:rounded-[2.5rem] border-2 border-slate-300 relative overflow-hidden h-full flex flex-col justify-center shadow-[0_30px_70px_-15px_rgba(0,0,0,0.15)]">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/5 blur-[100px] rounded-full -mr-32 -mt-32" />
                
                {isFormSubmitted ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative z-10 text-center py-12 md:py-20 space-y-6"
                  >
                    <div className="w-20 h-20 bg-brand-orange/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-brand-orange/30">
                      <CheckCircle2 className="w-10 h-10 text-brand-orange" />
                    </div>
                    <h3 className="text-3xl md:text-4xl font-black text-on-surface uppercase tracking-tighter">¡Gracias por contactarnos!</h3>
                    <p className="text-on-surface-subtle text-lg md:text-xl font-medium max-w-md mx-auto leading-relaxed">
                      Hemos recibido tu solicitud y un ingeniero especializado se pondrá en contacto pronto para asesorarte en tu proyecto.
                    </p>
                    <button 
                      onClick={() => setIsFormSubmitted(false)}
                      className="mt-8 text-brand-orange font-black uppercase tracking-[0.2em] text-xs hover:text-brand-blue transition-colors flex items-center gap-2 mx-auto group"
                    >
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform rotate-180" />
                      Enviar otro mensaje
                    </button>
                  </motion.div>
                ) : (
                  <form className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6" onSubmit={handleFormSubmit}>
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
                      <div className="md:col-span-1 space-y-1.5 md:space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-on-surface-subtle/50 ml-4 flex items-center gap-1">Cargo</label>
                        <input 
                          type="text" 
                          name="cargo"
                          value={formData.cargo}
                          onChange={handleFieldChange}
                          onBlur={handleFieldBlur}
                          className="w-full min-h-[48px] bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl px-5 md:px-6 py-3 md:py-4 text-sm md:text-base text-on-surface focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all placeholder:text-on-surface-subtle/40" 
                          placeholder="Ej. Ing." 
                        />
                      </div>
                      <div className="md:col-span-3 space-y-1.5 md:space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-on-surface-subtle/50 ml-4 flex items-center gap-1">
                          Nombre Completo <span className="text-brand-orange">*</span>
                        </label>
                        <input 
                          type="text" 
                          name="nombre"
                          value={formData.nombre}
                          onChange={handleFieldChange}
                          onBlur={handleFieldBlur}
                          className={`w-full min-h-[48px] bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl px-5 md:px-6 py-3 md:py-4 text-sm md:text-base text-on-surface focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all placeholder:text-on-surface-subtle/40 ${formErrors.nombre ? 'border-red-500/50 bg-red-500/5' : ''}`} 
                          placeholder="Ej. Roberto Silva" 
                        />
                        {formErrors.nombre && <p className="text-[10px] text-red-500 ml-4 font-bold uppercase tracking-widest flex items-center gap-1 animate-pulse">
                          {formErrors.nombre}
                        </p>}
                      </div>
                    </div>
                    <div className="space-y-1.5 md:space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-on-surface-subtle/50 ml-4 flex items-center gap-1">
                        Empresa / Planta <span className="text-brand-orange">*</span>
                      </label>
                      <input 
                        type="text" 
                        name="empresa"
                        value={formData.empresa}
                        onChange={handleFieldChange}
                        onBlur={handleFieldBlur}
                        className={`w-full min-h-[48px] bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl px-5 md:px-6 py-3 md:py-4 text-sm md:text-base text-on-surface focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all placeholder:text-on-surface-subtle/40 ${formErrors.empresa ? 'border-red-500/50 bg-red-500/5' : ''}`} 
                        placeholder="Ej. Planta Industrial Norte" 
                      />
                      {formErrors.empresa && <p className="text-[10px] text-red-500 ml-4 font-bold uppercase tracking-widest flex items-center gap-1 animate-pulse">
                        {formErrors.empresa}
                      </p>}
                    </div>
                    <div className="space-y-1.5 md:space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-on-surface-subtle/50 ml-4 flex items-center gap-1">
                        Correo Corporativo <span className="text-brand-orange">*</span>
                      </label>
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleFieldChange}
                        onBlur={handleFieldBlur}
                        className={`w-full min-h-[48px] bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl px-5 md:px-6 py-3 md:py-4 text-sm md:text-base text-on-surface focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all placeholder:text-on-surface-subtle/40 ${formErrors.email ? 'border-red-500/50 bg-red-500/5' : ''}`} 
                        placeholder="rsilva@empresa.com" 
                      />
                      {formErrors.email && <p className="text-[10px] text-red-500 ml-4 font-bold uppercase tracking-widest flex items-center gap-1 animate-pulse">
                        {formErrors.email}
                      </p>}
                    </div>
                    <div className="space-y-1.5 md:space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-on-surface-subtle/50 ml-4 flex items-center gap-1">
                        Teléfono de Contacto <span className="text-brand-orange">*</span>
                      </label>
                      <input 
                        type="tel" 
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleFieldChange}
                        onBlur={handleFieldBlur}
                        className={`w-full min-h-[48px] bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl px-5 md:px-6 py-3 md:py-4 text-sm md:text-base text-on-surface focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all placeholder:text-on-surface-subtle/40 ${formErrors.telefono ? 'border-red-500/50 bg-red-500/5' : ''}`} 
                        placeholder="55 0000 0000" 
                      />
                      {formErrors.telefono && <p className="text-[10px] text-red-500 ml-4 font-bold uppercase tracking-widest flex items-center gap-1 animate-pulse">
                        {formErrors.telefono}
                      </p>}
                    </div>
                    <div className="md:col-span-2 space-y-1.5 md:space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-on-surface-subtle/50 ml-4 flex items-center gap-1">
                        Detalles del Proyecto <span className="text-brand-orange">*</span>
                      </label>
                      <textarea 
                        rows={4} 
                        name="detalles"
                        value={formData.detalles}
                        onChange={handleFieldChange}
                        onBlur={handleFieldBlur}
                        className={`w-full min-h-[100px] bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl px-5 md:px-6 py-3 md:py-4 text-sm md:text-base text-on-surface focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all resize-none placeholder:text-on-surface-subtle/40 ${formErrors.detalles ? 'border-red-500/50 bg-red-500/5' : ''}`} 
                        placeholder="Describa brevemente el área a intervenir y las condiciones de operación..."
                      ></textarea>
                      {formErrors.detalles && <p className="text-[10px] text-red-500 ml-4 font-bold uppercase tracking-widest flex items-center gap-1 animate-pulse">
                        {formErrors.detalles}
                      </p>}
                    </div>
                    <div className="md:col-span-2 pt-2 md:pt-4">
                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full py-5 bg-brand-blue text-white font-black uppercase tracking-[0.2em] text-xs md:text-sm rounded-xl md:rounded-2xl shadow-[0_20px_40px_rgba(0,75,135,0.2)] hover:shadow-[0_25px_50px_rgba(0,75,135,0.4)] transition-all hover:-translate-y-1 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Enviando...' : 'Solicitar una Cotización'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>

          <div className="mt-20 pt-8 border-t border-glass-border/30 text-center px-4">
            <p className="text-on-surface-subtle/30 text-[0.625rem] md:text-xs uppercase tracking-wider md:tracking-[0.4em] font-bold transition-colors animate-fade-in break-words">© 2026 MCI Soluciones Poliméricas - Ingeniería de Alta Gama </p>
          </div>
        </div>
      </footer>

      {/* Floating Chat Widget */}
      <div className="fixed bottom-4 left-4 md:bottom-8 md:left-8 z-[100000] scale-[0.8] origin-bottom-left md:scale-100" ref={chatContainerRef}>
        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="relative w-16 h-16 flex items-center justify-center group"
        >
          {/* Cyber-Bot Body/Head */}
          <motion.div 
            className="absolute inset-0 bg-slate-900 rounded-[1.25rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-b-4 border-slate-950 border-r-2 border-l-2 overflow-hidden ring-1 ring-white/10"
            animate={{ 
              y: [0, -6, 0],
              rotate: isChatOpen ? 0 : [0, -1, 1, 0]
            }}
            transition={{ 
              y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 5, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            {/* Dark Tech Texture */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            
            {/* Visor - Cyber Style */}
            <div className="absolute top-1/4 left-1.5 right-1.5 h-[45%] bg-black rounded-xl flex items-center justify-center gap-2 overflow-hidden border border-brand-orange/20 shadow-[inset_0_0_15px_rgba(245,130,32,0.1)]">
              <AnimatePresence mode="wait">
                {isChatOpen ? (
                  <motion.div 
                    key="open"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="text-brand-orange font-black text-2xl"
                  >
                    ×
                  </motion.div>
                ) : (
                  <motion.div 
                    key="closed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex gap-2.5"
                  >
                    {/* Glowing Eyes */}
                    <motion.div 
                      className="w-3 h-3 bg-[#00f2ff] rounded-full shadow-[0_0_12px_#00f2ff]"
                      animate={
                        botExpression === 'happy' ? { scaleY: [1, 0.5, 1], borderRadius: ["50%", "50% 50% 0 0", "50%"] } :
                        botExpression === 'thinking' ? { x: [-2, 2, -2] } :
                        { scaleY: [1, 0.1, 1] }
                      }
                      transition={
                        botExpression === 'thinking' ? { duration: 1, repeat: Infinity } :
                        { duration: 4, repeat: Infinity, times: [0, 0.05, 0.1] }
                      }
                    />
                    <motion.div 
                      className="w-3 h-3 bg-[#00f2ff] rounded-full shadow-[0_0_12px_#00f2ff]"
                      animate={
                        botExpression === 'happy' ? { scaleY: [1, 0.5, 1], borderRadius: ["50%", "50% 50% 0 0", "50%"] } :
                        botExpression === 'thinking' ? { x: [-2, 2, -2] } :
                        { scaleY: [1, 0.1, 1] }
                      }
                      transition={
                        botExpression === 'thinking' ? { duration: 1, repeat: Infinity } :
                        { duration: 4, repeat: Infinity, times: [0, 0.05, 0.1] }
                      }
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              {/* Internal HUD Scanning Grid */}
              <motion.div 
                className="absolute inset-0 bg-[linear-gradient(rgba(0,242,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,242,255,0.05)_1px,transparent_1px)] bg-[size:10px_10px]"
                animate={{ backgroundPositionY: ['0px', '20px'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
              <motion.div 
                className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00f2ff]/20 to-transparent h-[1px] w-full"
                animate={{ top: ['0%', '100%'] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
              />
            </div>
            {/* Orange Power Indicator */}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-brand-orange rounded-full blur-[1px] shadow-[0_0_5px_rgba(245,130,32,0.8)] animate-pulse" />
          </motion.div>

          {/* Floating Ring */}
          <div className="absolute -inset-6 border border-dashed border-brand-orange/30 rounded-full animate-[spin_20s_linear_infinite] pointer-events-none" />
          
          {/* Neon Green Online Indicator */}
          <div className="absolute -top-1 -right-1 flex items-center justify-center z-10">
            <span className="absolute w-5 h-5 bg-[#39ff14] rounded-full animate-ping opacity-40" />
            <span className="relative w-3.5 h-3.5 bg-[#39ff14] rounded-full border-2 border-[#0f172a] shadow-[0_0_10px_#39ff14]" />
          </div>
        </button>

        <AnimatePresence>
          {isChatOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: 'bottom left' }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="absolute bottom-24 left-0 w-[22.5rem] max-w-[calc(100vw-60px)] h-[37.5rem] max-h-[calc(100vh-120px)] bg-white rounded-2xl border border-glass-border shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="bg-slate-900 border-b border-white/5 p-4 flex justify-between items-center relative shrink-0">
                <div className="flex items-center gap-3 relative z-10 font-sans">
                  <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center relative overflow-hidden shadow-lg border border-white/10 ring-1 ring-white/5">
                    <div className="absolute inset-0.5 bg-slate-900 rounded-lg flex items-center justify-center gap-1 shadow-inner">
                      <AnimatePresence mode="wait">
                        <motion.div 
                          key={botExpression}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex gap-0.5"
                        >
                          <motion.div 
                            className="w-1 h-1 bg-[#00f2ff] rounded-full shadow-[0_0_3px_#00f2ff]"
                            animate={
                              botExpression === 'happy' ? { scaleY: [1, 0.5, 1] } :
                              botExpression === 'thinking' ? { x: [-1, 1, -1] } :
                              { scaleY: [1, 0.1, 1] }
                            }
                            transition={{ duration: 3, repeat: Infinity }}
                          />
                          <motion.div 
                            className="w-1 h-1 bg-[#00f2ff] rounded-full shadow-[0_0_3px_#00f2ff]"
                            animate={
                              botExpression === 'happy' ? { scaleY: [1, 0.5, 1] } :
                              botExpression === 'thinking' ? { x: [-1, 1, -1] } :
                              { scaleY: [1, 0.1, 1] }
                            }
                            transition={{ duration: 3, repeat: Infinity }}
                          />
                        </motion.div>
                      </AnimatePresence>
                    </div>
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#39ff14] border border-black rounded-full shadow-sm" />
                  </div>
                  <div>
                    <h4 className="text-white font-black uppercase tracking-widest text-[10px]">MCI Tech Assistant</h4>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-[#39ff14] rounded-full animate-pulse" />
                      <p className="text-white/60 text-[9px] font-black uppercase tracking-tighter">Status: Active</p>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    playClickSound();
                    setIsChatOpen(false);
                  }}
                  className="p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-all cursor-pointer active:scale-95 border border-transparent hover:border-white/10"
                  aria-label="Cerrar chat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 p-4 overflow-y-auto space-y-3 custom-scrollbar bg-gray-50/5">
                {chatMessages.map((msg, i) => {
                  
                  // Formateador para inyectar botón de whatsapp directamente en texto plano
                  const formatChatMessage = (text: string) => {
                    let formatted = text.replace(/\n/g, '<br/>');
                    // Solo reemplazamos 'whatsapp' si no está ya dentro de una etiqueta HTML
                    if (msg.type === 'bot' && !formatted.includes('href="https://wa.me')) {
                      const waButton = `<a href="https://wa.me/525512979217" target="_blank" class="inline-flex items-center gap-1.5 bg-[#25D366] text-white px-2 py-0.5 rounded-md font-bold text-xs mx-1 hover:bg-[#20bd5a] transition-all shadow-sm active:scale-95 no-underline whitespace-nowrap"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" height="14px" width="14px" xmlns="http://www.w3.org/2000/svg"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zM223.9 413.6c-33.1 0-65.5-8.9-94-25.8l-6.7-4-69.8 18.3L72 334.1l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"></path></svg> WhatsApp</a>`;
                      formatted = formatted.replace(/\bwhatsapp\b/gi, waButton);
                    }
                    return formatted;
                  };

                  return (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-2"
                  >
                    <div className={`max-w-[85%] p-3.5 rounded-2xl text-[13px] leading-relaxed relative ${msg.type === 'bot' ? 'bg-slate-50 text-slate-700 self-start rounded-tl-none shadow-sm border border-slate-200' : 'bg-slate-900 text-white font-medium self-end rounded-tr-none shadow-xl ml-auto border border-white/5'}`}>
                      {msg.image && (
                        <img src={msg.image} alt="User upload" className="w-full h-40 object-cover rounded-xl mb-3 border border-white/10 shadow-lg" />
                      )}
                      <div dangerouslySetInnerHTML={{ __html: formatChatMessage(msg.text) }} />
                    </div>
                    
                    {i === 0 && chatMessages.length === 1 && (
                      <div className="flex flex-col gap-2 self-start w-[85%]">
                        {[
                          { q: 'Cobertura Polycovers', a: 'Tenemos <strong>capacidad de instalación en todo México</strong>.' },
                          { q: 'Normas y Certificaciones', a: 'Cumplimos normas internacionales, incluyendo <strong>FDA y USDA</strong>.' },
                          { q: 'Asistencia por WhatsApp', a: 'Puedes solicitar asistencia personalizada para dudas técnicas: <a href="https://wa.me/525512979217" target="_blank" class="inline-block mt-2 bg-brand-orange text-white px-4 py-2 rounded-lg font-bold">Quiero asistencia personalizada</a>' }
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
                      <img src={URL.createObjectURL(selectedFile)} className="w-full h-full object-cover" />
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
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-400 transition-all"
                  />
                  <button 
                    type="submit"
                    disabled={isTyping || (!userInput.trim() && !selectedFile)}
                    onClick={() => playClickSound()}
                    className="p-2.5 bg-slate-900 text-white rounded-xl disabled:opacity-30 hover:bg-slate-800 transition-all shadow-lg active:scale-95 border border-white/5"
                  >
                    <Send className="w-5 h-5" />
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
                    <img src={logoBase64} alt="MCI Logo" className="w-full h-full object-contain" />
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
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-100 shadow-sm space-y-5">
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-brand-orange/70">Atención Directa</p>
                    
                    <div className="space-y-4">
                      <a 
                        href="tel:5512979217" 
                        className="flex items-center gap-4 group"
                      >
                        <div className="w-9 h-9 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-brand-orange group-hover:border-brand-orange/30 group-hover:shadow-md transition-all">
                          <Phone className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col leading-tight">
                          <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Teléfono</span>
                          <span className="text-xs font-bold text-slate-700 tracking-wide">55 1297 9217</span>
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
    </div>
  );
}
