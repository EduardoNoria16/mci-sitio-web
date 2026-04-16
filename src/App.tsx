/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react';
import { logoBase64 } from './logoBase64';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useInView, animate } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
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
  Quote,
  Camera,
  Play,
  Pause,
  Maximize2
} from 'lucide-react';

// --- Sound Effects ---
const playClickSound = () => {
  const audio = new Audio('https://assets.mixkit.io/active_storage/sfx/2571/2571-preview.mp3');
  audio.volume = 0.1;
  audio.play().catch(() => {});
};

// --- Custom Video Player Component ---
const CustomVideoPlayer = memo(() => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true); 
  const [progress, setProgress] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const videoUrl = "https://i.imgur.com/LoeTAM6.mp4";
  const ambientMusicUrl = "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73456.mp3?filename=technology-background-106514.mp3";

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.2;
    }
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
      if (isPlaying && !isMuted) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  }, [isMuted, isPlaying]);

  const togglePlay = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const targetVideo = isModalOpen ? modalVideoRef.current : videoRef.current;
    if (targetVideo) {
      if (isPlaying) {
        targetVideo.pause();
      } else {
        targetVideo.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying, isModalOpen]);

  const toggleMute = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsMuted(!isMuted);
    if (videoRef.current) videoRef.current.muted = !isMuted;
    if (modalVideoRef.current) modalVideoRef.current.muted = !isMuted;
  }, [isMuted]);

  const handleTimeUpdate = useCallback((e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    const currentProgress = (video.currentTime / video.duration) * 100;
    setProgress(currentProgress);
  }, []);

  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const targetVideo = isModalOpen ? modalVideoRef.current : videoRef.current;
    if (targetVideo) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const newProgress = (x / rect.width) * 100;
      const newTime = (newProgress / 100) * targetVideo.duration;
      targetVideo.currentTime = newTime;
      setProgress(newProgress);
    }
  }, [isModalOpen]);

  const VideoControls = ({ isModal = false }: { isModal?: boolean }) => (
    <div className={`absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-20 transition-opacity duration-300 ${isModal ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
      <div className="space-y-4">
        {/* Progress Bar */}
        <div 
          className="h-1.5 w-full bg-white/20 rounded-full cursor-pointer relative group/progress overflow-hidden"
          onClick={handleSeek}
        >
          <motion.div 
            className="absolute top-0 left-0 h-full bg-brand-orange shadow-[0_0_10px_rgba(245,130,32,0.8)]"
            style={{ width: `${progress}%` }}
          />
          <div className="absolute top-0 left-0 w-full h-full opacity-0 group-hover/progress:opacity-100 bg-white/10 transition-opacity" />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 md:gap-6">
            <button 
              onClick={togglePlay}
              className="text-white hover:text-brand-orange transition-colors p-1"
            >
              {isPlaying ? <Pause className="w-5 h-5 md:w-6 md:h-6 fill-current" /> : <Play className="w-5 h-5 md:w-6 md:h-6 fill-current" />}
            </button>
            <button 
              onClick={toggleMute}
              className="text-white hover:text-brand-orange transition-colors p-1 flex items-center gap-2"
            >
              {isMuted ? <VolumeX className="w-5 h-5 md:w-6 md:h-6" /> : <Volume2 className="w-5 h-5 md:w-6 md:h-6" />}
              <span className="text-[10px] font-bold uppercase tracking-widest hidden md:block">
                {isMuted ? 'Activar Audio' : 'Silenciar'}
              </span>
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            {!isModal && (
              <button 
                onClick={(e) => { e.stopPropagation(); setIsModalOpen(true); }}
                className="text-white hover:text-brand-orange transition-colors p-1 flex items-center gap-2"
                title="Ver en grande"
              >
                <Maximize2 className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase tracking-widest hidden md:block">Expandir</span>
              </button>
            )}
            <div className="px-3 py-1 rounded-full glass border-white/10">
              <span className="text-[10px] font-black text-white/90 tracking-widest uppercase">HD 4K</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div 
        className="relative w-full h-full overflow-hidden rounded-3xl group"
        onClick={() => setIsModalOpen(true)}
      >
        <video
          ref={videoRef}
          src={videoUrl}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          onTimeUpdate={handleTimeUpdate}
          className="absolute inset-0 w-full h-full object-contain bg-black z-0"
        />

        <audio 
          ref={audioRef}
          src={ambientMusicUrl}
          loop
        />

        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500 z-10" />
        
        <VideoControls />

        {/* Play Overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
            <div className="w-20 h-20 rounded-full glass border-white/20 flex items-center justify-center animate-pulse">
              <Play className="w-8 h-8 text-white fill-current ml-1" />
            </div>
          </div>
        )}
      </div>

      {/* Modal Video Player */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4 md:p-12"
          >
            <div 
              className="absolute inset-0 bg-[#0a192f]/90 backdrop-blur-lg"
              onClick={() => setIsModalOpen(false)}
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-6xl aspect-video glass rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl z-10"
            >
              <video
                ref={modalVideoRef}
                src={videoUrl}
                autoPlay
                loop
                muted={isMuted}
                playsInline
                onTimeUpdate={handleTimeUpdate}
                className="w-full h-full object-contain bg-black"
              />
              
              <VideoControls isModal />

              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 z-30 p-3 rounded-full glass border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300"
              >
                <X className="w-6 h-6" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});

// --- Before/After Slider Component ---
const BeforeAfterSlider = memo(() => {
  const [sliderPos, setSliderPos] = useState(50);
  const [isAuto, setIsAuto] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAuto) return;
    let lastTime = performance.now();
    let frameId: number;

    const animate = (time: number) => {
      const deltaTime = time - lastTime;
      if (deltaTime >= 50) {
        setSliderPos((prev) => {
          const next = prev + 0.5;
          return next > 100 ? 0 : next;
        });
        lastTime = time;
      }
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [isAuto]);

  const handleMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    setIsAuto(false);
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const position = ((x - rect.left) / rect.width) * 100;
    setSliderPos(Math.min(Math.max(position, 0), 100));
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full max-w-5xl mx-auto aspect-[4/3] md:aspect-video lg:aspect-[21/9] rounded-[2rem] overflow-hidden bg-[#0a192f] border-white/10 cursor-col-resize shadow-2xl will-change-transform"
      onMouseMove={handleMove}
      onTouchMove={handleMove}
      onMouseEnter={() => setIsAuto(false)}
      onMouseLeave={() => setIsAuto(true)}
    >
      {/* After Image */}
      <img 
        src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80" 
        alt="Después"
        className="absolute inset-0 w-full h-full object-cover"
        referrerPolicy="no-referrer"
        loading="lazy"
      />
      {/* Before Image */}
      <div 
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{ width: `${sliderPos}%` }}
      >
        <img 
          src="https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&w=1200&q=80" 
          alt="Antes"
          className="absolute inset-0 w-full h-full object-cover grayscale brightness-50"
          style={{ width: `${10000 / sliderPos}%` }}
          referrerPolicy="no-referrer"
          loading="lazy"
        />
      </div>
      {/* Slider Line */}
      <div 
        className="absolute inset-y-0 w-1 bg-white shadow-[0_0_20px_rgba(255,255,255,0.5)] z-10"
        style={{ left: `${sliderPos}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 glass rounded-full flex items-center justify-center border-white/20">
          <div className="flex gap-1">
            <ChevronRight className="w-3 h-3 text-white rotate-180" />
            <ChevronRight className="w-3 h-3 text-white" />
          </div>
        </div>
      </div>
      {/* Labels */}
      <div className="absolute top-6 left-6 glass px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest text-white/80">Antes</div>
      <div className="absolute top-6 right-6 glass px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest text-brand-orange">Después</div>
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
  { url: 'https://images.unsplash.com/photo-1565008576549-57569a49371d?auto=format&fit=crop&w=800&q=80', title: 'Sistemas de Protección' },
  { url: 'https://images.unsplash.com/photo-1563200155-22442f49d32d?auto=format&fit=crop&w=800&q=80', title: 'Procesos Industriales' },
  { url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80', title: 'Almacenamiento Logístico' },
  { url: 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=800&q=80', title: 'Tecnología Polimérica' }
];

const TESTIMONIALS = [
  {
    name: "Ing. Ricardo Méndez",
    company: "Planta Automotriz Bajío",
    text: "Teníamos un problema serio de desprendimiento en los pasillos de carga. MCI no solo reparó el concreto, sino que nos dio una solución que ha aguantado el tráfico pesado por más de 2 años sin un solo bache. Se nota que saben lo que hacen.",
    rating: 5
  },
  {
    name: "Dra. Elena Vargas",
    company: "Laboratorios BioTech",
    text: "Lo que más valoro es la limpieza y el orden con el que trabajaron. En un entorno de laboratorio, el polvo es nuestro enemigo. MCI instaló el piso epóxico con un control de contaminación increíble. ¡Altamente recomendados!",
    rating: 5
  },
  {
    name: "Arq. Carlos Ruiz",
    company: "Constructora Global MX",
    text: "He trabajado con muchos contratistas, pero pocos tienen el nivel de respuesta de MCI. Si surge un detalle en obra a las 10 de la noche, el CEO te contesta y te resuelve. Esa tranquilidad no tiene precio.",
    rating: 5
  },
  {
    name: "Lic. Martha Solís",
    company: "Almacenes Logis-Mex",
    text: "Nuestros pisos estaban 'llorando' humedad y nada pegaba. MCI hizo un diagnóstico profundo, aplicó una barrera de vapor y el acabado final quedó perfecto. Nos ahorraron miles de pesos en retrabajos.",
    rating: 5
  },
  {
    name: "Ing. Javier Torres",
    company: "Refinería del Norte",
    text: "La aplicación de poliurea en nuestros diques de contención fue un éxito. El equipo de MCI está muy bien capacitado y cumplen con todas las normas de seguridad industrial que exigimos.",
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
    title: 'Industria de Bienes y Consumo',
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
1. ANÁLISIS DE IMÁGENES: Si el usuario sube una foto, analízala detalladamente. Busca grietas, desprendimientos, manchas de humedad, o desgaste por químicos. Da un pre-diagnóstico técnico basado en lo que ves y sugiere el sistema MCI adecuado (ej. "Veo una falla por presión osmótica, recomiendo nuestro sistema de barrera de vapor...").
2. REPORTE TÉCNICO: Si el usuario describe un problema o tras un análisis de imagen, ofrece generar un "Reporte de Diagnóstico Preliminar". Estructúralo con: [Situación Detectada], [Riesgo Operativo], [Solución Técnica Recomendada] y [Siguiente Paso].
3. CONOCIMIENTO EXPANDIDO: No te limites solo a lo que dice la página. Usa tu conocimiento general de ingeniería civil y química de polímeros para explicar el "por qué" de las fallas. Habla de normas ASTM, ISO y regulaciones mexicanas.

Información Clave de la Empresa:
- Nombre: MCI Soluciones Poliméricas.
- Cobertura: Todo México.
- Respuesta: 24/7 para emergencias industriales.

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
  const [activeHeroTab, setActiveHeroTab] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
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
  const [chatMessages, setChatMessages] = useState<{type: 'bot' | 'user', text: string, image?: string}[]>([
    { type: 'bot', text: '¡Hola! Soy tu asistente de MCI Soluciones Poliméricas. ¿En qué puedo ayudarte hoy?' }
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
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSpeech = useCallback(() => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      // Función para extraer texto relevante del DOM respetando lo que se ve
      const getPageContent = () => {
        const sections = document.querySelectorAll('section, footer, header');
        let textParts: string[] = [];
        
        sections.forEach((section) => {
          const rect = section.getBoundingClientRect();
          // Detectar si la sección está siendo mostrada al usuario
          const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
          
          if (isVisible) {
            // Extraer encabezados y cuerpos de texto ignorando controles de UI
            const elements = section.querySelectorAll('h1, h2, h3, h4, p, li');
            
            elements.forEach(el => {
              const htmlEl = el as HTMLElement;
              const content = htmlEl.innerText?.trim();
              
              // Evitar duplicados, textos vacíos o controles interactivos
              if (content && 
                  content.length > 3 && 
                  !textParts.includes(content) &&
                  !el.closest('button') && 
                  !el.closest('nav') && 
                  !el.closest('form')) {
                textParts.push(content);
              }
            });
          }
        });
        
        // Unir todo con pausas (puntos)
        const finalContent = textParts.join(". ");
        return finalContent || "MCI Soluciones Poliméricas: Ingeniería en recubrimientos y protección industrial.";
      };

      const textToRead = getPageContent();
      
      const utterance = new SpeechSynthesisUtterance(textToRead);
      const voices = window.speechSynthesis.getVoices();
      const mxVoice = voices.find(v => v.lang === 'es-MX' && v.name.includes('Google')) || 
                      voices.find(v => v.lang === 'es-MX') ||
                      voices.find(v => v.lang.includes('es-MX')) ||
                      voices.find(v => v.lang.includes('es'));
      
      if (mxVoice) utterance.voice = mxVoice;
      utterance.lang = 'es-MX';
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  }, [isSpeaking]);

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

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: { parts },
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.4,
        }
      });

      const botText = response.text || "Lo siento, no pude procesar tu solicitud en este momento.";
      const needsWhatsApp = botText.toLowerCase().includes('whatsapp') || 
                          botText.toLowerCase().includes('ceo') || 
                          botText.toLowerCase().includes('contacto directo');

      setChatMessages(prev => [
        ...prev, 
        { 
          type: 'bot', 
          text: botText + (needsWhatsApp ? '<br/><br/><a href="https://wa.me/525561500317" target="_blank" class="inline-flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded-lg font-bold text-[10px] mt-2">Quiero asistencia personalizada</a>' : '')
        }
      ]);
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

  useEffect(() => {
    if (selectedImage || isStrengthHovered || isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedImage, isStrengthHovered, isMenuOpen]);

  // Scroll listener for sticky header and back to top
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Click outside to close mobile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
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

  const navLinks = useMemo(() => [
    { name: 'Inicio', href: '#inicio' },
    { name: 'Sectores', href: '#sectores' },
    { name: 'Fortalezas', href: '#fortalezas' },
    { name: 'Galería', href: '#galeria' },
    { name: 'Contacto', href: '#contacto-footer' }
  ], []);

  return (
    <div className="min-h-screen">
      
      {/* Header / Navigation */}
      <header 
        className={`fixed top-0 left-0 right-0 z-[10000] transition-all duration-500 ${
          isScrolled 
            ? 'glass border-b border-white/10 py-3 shadow-2xl' 
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-4 group flex-shrink-0 mr-12">
            <div className="w-12 h-12 flex items-center justify-center transition-transform duration-500">
              <img 
                src={logoBase64} 
                alt="Logo MCI" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col notranslate" translate="no">
              <span className="text-xl font-black tracking-tighter text-brand-orange leading-none">MCI</span>
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-brand-blue">Soluciones</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a 
                key={link.name}
                href={link.href}
                className="text-sm font-bold uppercase tracking-[0.2em] text-white/60 hover:text-brand-blue transition-all relative group/nav"
                onClick={playClickSound}
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-blue transition-all duration-300 group-hover/nav:w-full" />
              </a>
            ))}
            <a 
              href="#contacto-footer"
              className="bg-brand-blue text-white px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-[0_10px_20px_rgba(0,75,135,0.2)] hover:shadow-[0_15px_30px_rgba(0,75,135,0.4)] transition-all hover:-translate-y-0.5"
              onClick={playClickSound}
            >
              Cotizar
            </a>
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-white/60 hover:text-white transition-colors"
            onClick={() => {
              playClickSound();
              setIsMenuOpen(!isMenuOpen);
            }}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden absolute top-full left-0 right-0 bg-[#0a192f] border-b border-white/10 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[9999]"
              ref={menuRef}
            >
              <nav className="flex flex-col p-8 gap-2">
                {navLinks.map((link) => (
                  <a 
                    key={link.name}
                    href={link.href}
                    className="flex items-center justify-between group py-4 border-b border-white/5 last:border-0 transition-all"
                    onClick={() => {
                      playClickSound();
                      setIsMenuOpen(false);
                    }}
                  >
                    <span className="text-sm font-black uppercase tracking-[0.2em] text-white group-hover:text-brand-orange transition-colors">
                      {link.name}
                    </span>
                    <ChevronRight className="w-4 h-4 text-brand-orange opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                  </a>
                ))}
                
                <div className="mt-6 pt-6 border-t border-white/10 space-y-6">
                  <div className="flex flex-col gap-4">
                    <a href="tel:5512979217" className="flex items-center gap-4 text-white/70 hover:text-white transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                        <Phone className="w-5 h-5 text-brand-orange" />
                      </div>
                      <span className="text-xs font-bold tracking-wider">55 1297 9217</span>
                    </a>
                    <a href="mailto:mci.spolimericas@polycovers.mx" className="flex items-center gap-4 text-white/70 hover:text-white transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-brand-orange" />
                      </div>
                      <span className="text-xs font-bold tracking-wider">mci.spolimericas@polycovers.mx</span>
                    </a>
                  </div>

                  <a 
                    href="#contacto-footer"
                    className="flex items-center justify-center gap-3 bg-brand-orange text-white px-6 py-5 rounded-2xl text-center text-sm font-black uppercase tracking-[0.2em] shadow-[0_10px_20px_rgba(245,130,32,0.3)]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Zap className="w-4 h-4" />
                    Cotizar Ahora
                  </a>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-orange via-brand-orange to-brand-blue z-[10001] origin-left"
        style={{ scaleX }}
      />

      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-brand-blue/5 blur-[120px] rounded-full will-change-transform" />
        <div className="absolute top-[40%] -right-[10%] w-[50%] h-[50%] bg-[#60a5fa]/5 blur-[120px] rounded-full will-change-transform" />
      </div>

      {/* Hero Section */}
      <section id="inicio" className="relative min-h-screen flex items-center pt-16 md:pt-20 overflow-hidden will-change-transform">
        <motion.div 
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-[#0a192f]/70 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1565008576549-57569a49371d?auto=format&fit=crop&w=1200&q=80" 
            alt="Hero Background"
            width="1920"
            height="1080"
            fetchPriority="high"
            className="w-full h-full object-cover scale-110"
            referrerPolicy="no-referrer"
            loading="eager"
          />
        </motion.div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-8 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <div className="flex items-baseline gap-2 md:gap-4 flex-wrap">
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-brand-orange leading-[0.9] notranslate" translate="no">MCI</h1>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight text-brand-blue uppercase">Soluciones</h2>
              </div>
              <span className="block text-lg md:text-xl font-black tracking-[0.4em] text-white/90 uppercase">Poliméricas</span>
            </motion.div>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl font-medium"
            >
              Empresa con más de <span className="hl">30 años</span> de consolidación en los sectores <span className="hl">Industrial</span> y de la <span className="hl">Construcción</span> en <span className="hl">México</span> ofreciendo <span className="hl">soluciones duraderas</span> para <span className="hl">restaurar</span>, <span className="hl">mejorar</span> y <span className="hl">proteger</span> instalaciones expuestas a daños físicos o químicos.
            </motion.p>

            {/* Misión/Visión/Propuesta Tabs */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.3
                  }
                }
              }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              {[
                { label: 'Misión', content: 'Diseñar e implementar soluciones poliméricas especializadas que protegen y prolongan la vida útil de superficies expuestas a condiciones severas mediante un enfoque técnico, materiales de alto desempeño y ejecución confiable.' },
                { label: 'Visión', content: 'Ser una empresa referente en soluciones de protección industrial, reconocida por la confiabilidad de nuestros sistemas, la solidez técnica y la capacidad de resolver entornos de alta exigencia.' },
                { label: 'Propuesta de Valor', content: 'Ofrecemos soluciones integrales: Rigor técnico, Calidad comprobable, Respuesta inmediata 24/7, Responsabilidad operativa y Protección a largo plazo.' }
              ].map((tab, i) => (
                <motion.div 
                  key={i} 
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className="group relative"
                  onClick={() => {
                    playClickSound();
                    setActiveHeroTab(activeHeroTab === i ? null : i);
                  }}
                  onMouseEnter={() => {
                    if (window.innerWidth > 768) setActiveHeroTab(i);
                  }}
                  onMouseLeave={() => {
                    if (window.innerWidth > 768) setActiveHeroTab(null);
                  }}
                >
                  <div className={`glass p-6 rounded-2xl border-white/5 transition-all duration-500 cursor-pointer h-full text-center flex flex-col items-center justify-center min-h-[100px] ${activeHeroTab === i ? 'border-brand-blue/40 bg-brand-blue/10 -translate-y-2 shadow-[0_10px_30px_rgba(0,75,135,0.1)]' : 'hover:border-white/10'}`}>
                <h3 className={`font-black uppercase tracking-[0.4em] mb-2 text-sm transition-colors duration-300 ${activeHeroTab === i ? 'text-white' : 'text-brand-blue-bright'}`}>{tab.label}</h3>
                    <AnimatePresence mode="wait">
                      {activeHeroTab === i && (
                        <motion.p 
                          initial={{ opacity: 0, height: 0, y: 10 }}
                          animate={{ opacity: 1, height: 'auto', y: 0 }}
                          exit={{ opacity: 0, height: 0, y: 10 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                          className="text-sm text-white/70 leading-relaxed overflow-hidden font-medium tracking-wide mt-2"
                        >
                          {tab.content}
                        </motion.p>
                      )}
                    </AnimatePresence>
                    {!activeHeroTab && activeHeroTab !== 0 && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-1 h-1 bg-brand-blue rounded-full mt-2 animate-pulse"
                      />
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>


          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-4"
          >
            <div className="relative group max-w-md mx-auto lg:mx-0">
              <div className="absolute -inset-1 bg-gradient-to-r from-brand-blue to-brand-blue rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative glass rounded-3xl overflow-hidden border-2 border-white/10 shadow-2xl aspect-video flex items-center justify-center">
                <CustomVideoPlayer />
              </div>
            </div>

            {/* Results Accordion Section */}
            <div className="mt-8">
              <button 
                onClick={() => {
                  playClickSound();
                  setIsResultsOpen(!isResultsOpen);
                }}
                className="w-full group flex items-center justify-between px-8 py-4 bg-gradient-to-r from-brand-blue to-brand-blue text-white font-black uppercase tracking-widest rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Así Garantizamos Resultados
                <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isResultsOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {isResultsOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 space-y-3">
                      {[
                        { num: '01', title: 'Diagnóstico', text: 'Visita al sitio para identificar variables críticas.' },
                        { num: '02', title: 'Propuesta', text: 'Definimos la solución técnica más viable.' },
                        { num: '03', title: 'Ejecución', text: 'Control y supervisión permanente.' },
                        { num: '04', title: 'Sustentabilidad', text: 'Protocolos amigables al entorno.' },
                        { num: '05', title: 'Atención Post-Venta', text: 'Compromiso con nuestros clientes.' }
                      ].map((step, i) => (
                        <div key={i} className="glass p-4 rounded-xl border-white/5 flex items-center gap-4 group hover:border-brand-orange/30 transition-colors">
                          <div className="w-8 h-8 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange font-black text-xs">
                            {step.num}
                          </div>
                          <div>
                            <h4 className="text-white font-bold text-sm uppercase tracking-wider group-hover:text-brand-orange transition-colors">{step.title}</h4>
                            <p className="text-white/80 text-xs leading-relaxed font-semibold">{step.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>

      {/* Stats Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Años de Experiencia', value: 30, suffix: '+', icon: <Clock className="w-5 h-5" /> },
            { label: 'Calidad Total', value: 100, suffix: '%', icon: <ShieldCheck className="w-5 h-5" /> },
            { label: 'Disponibilidad', value: '24/7', suffix: '', icon: <Zap className="w-5 h-5" /> }
          ].map((stat, i) => (
            <div key={i} className="glass p-8 rounded-3xl text-center space-y-2 border-white/5 hover:border-brand-orange/20 transition-colors group will-change-transform">
              <div className="mx-auto w-10 h-10 glass rounded-full flex items-center justify-center text-brand-orange mb-4 group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
              <div className="text-4xl md:text-6xl font-black text-white tracking-tighter">
                {typeof stat.value === 'number' ? <Counter target={stat.value} /> : stat.value}
                <span className="text-brand-orange">{stat.suffix}</span>
              </div>
              <div className="text-sm font-bold text-[#A0AAB2] uppercase tracking-[0.3em]">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Sectors Section */}
      <section id="sectores" className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 will-change-transform">
        <div className="text-center mb-20 space-y-6">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white">
            Sectores que <span className="text-brand-blue">Atendemos</span>
          </h2>
          <div className="w-32 h-2 bg-brand-blue mx-auto rounded-full shadow-[0_0_20px_rgba(0,75,135,0.5)]" />
          <p className="text-[#A0AAB2] max-w-3xl mx-auto text-lg md:text-xl font-normal leading-relaxed">
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {SECTORS.map((sector) => (
            <motion.div 
              key={sector.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              className={`glass p-8 rounded-3xl border-white/5 transition-all duration-500 cursor-pointer group relative overflow-hidden ${activeSector === sector.id ? 'ring-1 ring-brand-orange/30 bg-white/[0.02] shadow-[0_20px_50px_rgba(245,130,32,0.05)]' : 'hover:bg-white/[0.01]'}`}
              onClick={() => {
                playClickSound();
                setActiveSector(activeSector === sector.id ? null : sector.id);
              }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-2xl glass border-white/10 text-brand-blue transition-all duration-500 group-hover:scale-110 ${activeSector === sector.id ? 'bg-brand-blue text-white shadow-[0_0_20px_rgba(0,75,135,0.3)]' : ''}`}>
                  {React.cloneElement(sector.icon as React.ReactElement, { className: 'w-5 h-5' })}
                </div>
                <h3 className={`text-base md:text-lg font-black uppercase tracking-[0.2em] leading-tight transition-colors duration-300 ${activeSector === sector.id ? 'text-brand-blue' : 'text-white'}`}>{sector.title}</h3>
              </div>
              <p className="text-sm text-white/80 leading-relaxed mb-4 font-medium tracking-wide">{sector.description}</p>
              
              <AnimatePresence mode="popLayout">
                {activeSector === sector.id && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="pt-6 border-t border-white/5 space-y-5 max-h-[400px] overflow-y-auto custom-scrollbar pr-2"
                  >
                    {sector.details?.intro && (
                      <p className="text-sm text-brand-orange font-bold italic tracking-wide bg-brand-orange/5 p-2 rounded-lg">{sector.details.intro}</p>
                    )}
                    {sector.details?.groups.map((group, i) => (
                      <div key={i} className="space-y-3">
                        <h4 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                          <div className="w-1 h-1 bg-brand-orange rounded-full" />
                          {group.title}
                        </h4>
                        <ul className="grid grid-cols-1 gap-2.5">
                          {group.items.map((item, j) => (
                            <li key={j} className="flex items-start gap-3 text-sm text-[#A0AAB2] font-medium leading-relaxed">
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
      <section id="fortalezas" className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 will-change-transform">
        <div className="text-center mb-20 space-y-6">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white">
            Nuestras <span className="text-brand-blue">Fortalezas</span>
          </h2>
          <div className="w-32 h-2 bg-brand-blue mx-auto rounded-full shadow-[0_0_20px_rgba(0,75,135,0.5)]" />
          <p className="text-lg md:text-xl text-[#A0AAB2] max-w-4xl mx-auto leading-relaxed font-normal">
            Selecciona una especialidad para ver su ficha técnica detallada y conocer por qué somos líderes en el mercado.
          </p>
        </div>

        {/* Strengths List with Modal Technical Sheets */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {STRENGTHS.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  playClickSound();
                  setActiveStrength(s);
                  setIsStrengthHovered(true);
                }}
                className="group relative glass p-6 rounded-2xl border border-white/5 hover:border-brand-orange/30 transition-all duration-500 flex items-center gap-5 text-left hover:bg-white/[0.02] hover:-translate-y-1"
              >
                <div className="p-3 rounded-xl bg-brand-blue/10 text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-all duration-500 shadow-[0_0_15px_rgba(0,75,135,0.1)] group-hover:shadow-[0_0_25px_rgba(0,75,135,0.4)]">
                  {React.cloneElement(s.icon as React.ReactElement, { className: 'w-6 h-6' })}
                </div>
                <div className="flex-1">
                  <h3 className="text-xs md:text-sm font-black text-white uppercase tracking-widest leading-tight group-hover:text-brand-orange transition-colors">
                    {s.title}
                  </h3>
                </div>
                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-2 group-hover:translate-x-0">
                  <ArrowRight className="w-4 h-4 text-brand-orange" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Before/After Section */}
      <section className="relative z-10 py-8 md:py-12 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border-[#00f2ff]/30 text-[#00f2ff] text-xs font-bold uppercase tracking-widest"
            >
              <Zap className="w-3 h-3" />
              Transformación Radical
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">
              El Poder del <span className="text-gradient">Cambio</span>
            </h2>
            <p className="text-[#A0AAB2] max-w-2xl mx-auto font-medium">
              Desliza para ver la diferencia técnica entre una superficie deteriorada y una intervención profesional de MCI.
            </p>
          </div>
          <BeforeAfterSlider />
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
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border-brand-orange/30 text-brand-orange text-xs font-bold uppercase tracking-widest"
            >
              <Paintbrush className="w-3 h-3" />
              Portafolio Visual en Movimiento
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter"
            >
              Nuestra <span className="text-gradient">Galería</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-[#A0AAB2] max-w-2xl mx-auto font-medium"
            >
              Explora nuestra trayectoria a través de este recorrido visual automático. Haz clic en cualquier imagen para ampliarla.
            </motion.p>
          </div>
        </div>

        {/* Infinite Marquee Slideshow */}
        <div className="relative flex overflow-hidden group">
          <motion.div 
            className="flex gap-4 py-4"
            animate={{
              x: [0, -2000],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 40,
                ease: "linear",
              },
            }}
            style={{ width: "fit-content" }}
          >
            {[...GALLERY_IMAGES, ...GALLERY_IMAGES].map((img, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05, zIndex: 10 }}
                onClick={() => setSelectedImage(img.url)}
                className="relative w-[280px] md:w-[380px] aspect-video flex-shrink-0 rounded-2xl overflow-hidden glass border-white/5 cursor-pointer shadow-2xl will-change-transform"
              >
                <img
                  src={img.url}
                  alt={img.title}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="w-full h-full object-cover grayscale-[0.3] hover:grayscale-0 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                  <p className="text-white font-black text-xs uppercase tracking-widest">{img.title}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Second row moving in opposite direction */}
        <div className="relative flex overflow-hidden group mt-4">
          <motion.div 
            className="flex gap-4 py-4"
            animate={{
              x: [-2000, 0],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 50,
                ease: "linear",
              },
            }}
            style={{ width: "fit-content" }}
          >
            {[...GALLERY_IMAGES, ...GALLERY_IMAGES].reverse().map((img, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05, zIndex: 10 }}
                onClick={() => setSelectedImage(img.url)}
                className="relative w-[240px] md:w-[320px] aspect-video flex-shrink-0 rounded-2xl overflow-hidden glass border-white/5 cursor-pointer shadow-2xl will-change-transform"
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
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                  <p className="text-white font-black text-xs uppercase tracking-widest">{img.title}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonios" className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
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
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter"
          >
            Clientes <span className="text-gradient">Satisfechos</span>
          </motion.h2>
          <p className="text-[#A0AAB2] max-w-2xl mx-auto font-light">
            La confianza de nuestros clientes es el mejor respaldo de nuestra ingeniería.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass p-8 rounded-[2.5rem] border-white/5 flex flex-col justify-between group hover:border-brand-orange/30 transition-all duration-500"
            >
              <div className="space-y-6">
                <div className="flex gap-1">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-brand-orange text-brand-orange" />
                  ))}
                </div>
                <div className="relative">
                  <Quote className="absolute -top-4 -left-4 w-8 h-8 text-brand-orange/10" />
                  <p className="text-white/80 text-sm leading-relaxed font-medium italic relative z-10">
                    "{t.text}"
                  </p>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-white/5">
                <p className="text-white font-black text-xs uppercase tracking-widest">{t.name}</p>
                <p className="text-brand-blue text-xs font-bold uppercase tracking-widest mt-1">{t.company}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Commitment Section */}
      <section className="relative z-10 py-10 md:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-brand-orange/5 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6">
          <div className="glass rounded-[3rem] md:rounded-[4rem] border-white/10 overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-6 md:p-20 space-y-8 md:space-y-10">
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass border-brand-orange/40 text-brand-orange text-xs font-black uppercase tracking-[0.4em] shadow-[0_0_20px_rgba(245,130,32,0.1)]"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Excelencia en Ingeniería
                  </motion.div>
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-[0.95] py-2"
                  >
                    Nosotros nos <br />
                    <span className="text-gradient">encargamos</span>
                  </motion.h2>
                  <div className="h-1.5 w-32 bg-gradient-to-r from-brand-orange to-transparent rounded-full" />
                  <p className="text-xl md:text-2xl text-white/90 font-black uppercase tracking-tighter italic">
                    "Soluciones que trascienden"
                  </p>
                </div>

                <p className="text-[#A0AAB2] text-base md:text-lg font-medium leading-relaxed max-w-xl">
                  Nuestro equipo de ingenieros certificados supervisa cada detalle técnico, asegurando que tu inversión esté protegida con los más altos estándares de la industria. Brindamos confianza a través de la precisión.
                </p>

                <div className="grid grid-cols-2 gap-8 pt-4">
                  <div className="space-y-2">
                    <div className="text-3xl md:text-5xl font-black text-white tracking-tighter">
                      <Counter target={30} />+
                    </div>
                    <p className="text-brand-orange text-xs uppercase tracking-widest font-black">Años de Confianza</p>
                  </div>
                  <div className="space-y-2">
                    <div className="text-3xl md:text-5xl font-black text-white tracking-tighter">
                      <Counter target={500} />+
                    </div>
                    <p className="text-brand-orange text-xs uppercase tracking-widest font-black">Casos de Éxito</p>
                  </div>
                </div>
              </div>

              <div className="relative min-h-[400px] lg:h-[600px] group overflow-hidden rounded-3xl">
                <img 
                  src="https://images.unsplash.com/photo-1565008576549-57569a49371d?auto=format&fit=crop&w=1200&q=80" 
                  alt="MCI Soluciones - Ingeniería Industrial"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a192f] via-transparent to-transparent lg:block hidden" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-transparent to-transparent lg:hidden block" />
                
                {/* Floating Badge */}
                <div className="absolute bottom-6 right-6 md:bottom-12 md:right-12 glass p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border-white/10 backdrop-blur-xl hidden md:block shadow-2xl">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-orange to-brand-blue flex items-center justify-center text-white shadow-[0_0_30px_rgba(245,130,32,0.4)]">
                      <HardHat className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-white font-black text-sm uppercase tracking-[0.2em]">Equipo Certificado</p>
                      <p className="text-brand-orange text-xs font-bold uppercase tracking-widest mt-1">Calidad MCI</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
                className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-[0_0_100px_rgba(59,130,246,0.3)] border border-white/10"
              />
              
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 md:-right-12 p-3 text-white/60 hover:text-white transition-all hover:rotate-90 bg-white/5 rounded-full backdrop-blur-md border border-white/10"
              >
                <X className="w-8 h-8" />
              </button>

              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 glass px-6 py-2 rounded-full border-white/10 text-white/60 text-xs font-bold uppercase tracking-widest whitespace-nowrap">
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
              className="absolute inset-0 bg-[#0a192f]/90 backdrop-blur-sm"
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
                className="absolute top-6 right-6 z-50 p-3 rounded-full glass border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300 hover:rotate-90 group/close"
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
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0a192f] via-transparent to-transparent hidden lg:block" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-transparent to-transparent lg:hidden" />
                    
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
                      <h3 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter leading-tight">
                        {activeStrength.title}
                      </h3>
                      <div className="w-20 h-1.5 bg-brand-orange rounded-full" />
                    </div>

                    <p className="text-base md:text-lg leading-relaxed text-white/80 font-normal italic border-l-4 border-brand-blue pl-6">
                      <HighlightText text={activeStrength.intro} keywords={activeStrength.keywords} isIntro />
                    </p>

                    <div className="space-y-5">
                      {activeStrength.items.map((item, i) => (
                        <div key={i} className="group/item">
                          {typeof item === 'string' ? (
                            <div className="flex gap-4">
                              <div className="mt-1.5 w-2 h-2 rounded-full bg-brand-orange flex-shrink-0 shadow-[0_0_10px_rgba(245,130,32,0.5)]" />
                              <p className="text-white/90 text-sm md:text-base leading-relaxed">
                                <HighlightText text={item} keywords={activeStrength.keywords} />
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-4 bg-white/5 p-6 rounded-2xl border border-white/5">
                              <div className="flex items-center gap-3">
                                <div className="w-1.5 h-6 bg-brand-orange rounded-full" />
                                <p className="text-brand-orange font-black text-xs uppercase tracking-widest">
                                  {item.label}
                                </p>
                              </div>
                              <ul className="grid grid-cols-1 gap-3 pl-4">
                                {item.subItems.map((sub, j) => (
                                  <li key={j} className="flex gap-3 items-start text-xs text-white/80 leading-relaxed">
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

      {/* Coverage Section */}
      <section className="relative z-10 py-8 md:py-12 overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="space-y-12">
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border-[#39ff14]/30 text-[#39ff14] text-xs font-bold uppercase tracking-widest"
              >
                <MapPin className="w-3 h-3" />
                Presencia en Todo México
              </motion.div>
              <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
                Sin <span className="text-gradient">Fronteras</span> <br />
                Técnicas
              </h2>
              <p className="text-[#A0AAB2] text-xl font-medium leading-relaxed max-w-2xl mx-auto">
                Nuestra infraestructura logística nos permite movilizar equipos especializados y materiales de alta gama a cualquier punto de la República Mexicana. No importa la ubicación, la calidad MCI llega a tu planta.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
                {[
                  { label: 'Movilidad', value: 'Total' },
                  { label: 'Soporte', value: '24/7' },
                  { label: 'Garantía', value: 'Nacional' },
                  { label: 'Proyectos', value: 'Integrales' }
                ].map((stat, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="glass p-6 rounded-3xl border-white/5 hover:border-brand-orange/30 transition-all group"
                  >
                    <p className="text-brand-orange text-xs font-black uppercase tracking-widest mb-2">{stat.label}</p>
                    <p className="text-white font-black text-2xl tracking-tighter">{stat.value}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
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
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">
            Preguntas <span className="text-gradient">Frecuentes</span>
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
              className="glass p-6 rounded-2xl border-white/5 hover:border-brand-orange/20 transition-all group"
            >
              <h3 className="text-white font-bold text-lg mb-2 group-hover:text-brand-orange transition-colors flex items-start gap-3">
                <span className="text-brand-orange/40 text-xs font-black mt-1.5 whitespace-nowrap">0{i+1}</span>
                {faq.q}
              </h3>
              <p className="text-white/80 font-medium text-sm leading-relaxed pl-8">{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer Section */}
      <footer id="contacto-footer" className="relative z-10 bg-white/[0.02] backdrop-blur-3xl border-t border-white/10 mt-8 md:mt-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-12">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">
              Da el primer paso hacia la <span className="text-gradient">Calidad Total</span>
            </h2>
            <p className="text-base md:text-lg text-white/80 font-medium">Ponte en contacto con nuestros ingenieros y cotiza tu proyecto.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-4 space-y-12">
              <div className="space-y-6">
                <h3 className="font-black uppercase tracking-[0.3em] text-xs notranslate" translate="no">
                  <span className="text-brand-orange">MCI</span> <span className="text-brand-blue">Soluciones Poliméricas</span>
                </h3>
                <p className="text-white/80 leading-relaxed text-sm font-medium">Ingeniería en recubrimientos industriales y acabados de alta gama. Protegemos tu inversión con tecnología, precisión y durabilidad extrema.</p>
              </div>

              <div className="space-y-6">
                <h3 className="text-brand-blue font-black uppercase tracking-[0.3em] text-xs">Contacto Directo</h3>
                <div className="space-y-4">
                  {[
                    { icon: <Phone className="w-4 h-4" />, text: '55 1297 9217' },
                    { icon: <Mail className="w-4 h-4" />, text: 'mci.spolimericas@polycovers.mx' },
                    { icon: <MapPin className="w-4 h-4" />, text: 'Ciudad de México, México' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 group cursor-pointer">
                      <div className="p-3 glass rounded-xl border-white/5 group-hover:border-brand-orange/50 group-hover:bg-brand-orange/10 transition-all duration-300 text-brand-orange">
                        {item.icon}
                      </div>
                      <span className="text-white/80 group-hover:text-white transition-colors text-sm font-medium tracking-wide">{item.text}</span>
                    </div>
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
              <div className="glass p-6 md:p-12 rounded-[2rem] md:rounded-[2.5rem] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/5 blur-[100px] rounded-full -mr-32 -mt-32" />
                
                <form className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6" onSubmit={(e) => { e.preventDefault(); alert('Solicitud de cotización recibida. Hemos enviado una copia a mci.spolimericas@polycovers.mx y un ingeniero se pondrá en contacto pronto.'); }}>
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
                    <div className="md:col-span-1 space-y-1.5 md:space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-white/40 ml-4">Cargo</label>
                      <input type="text" required className="w-full glass bg-white/5 border-white/10 rounded-xl md:rounded-2xl px-5 md:px-6 py-3 md:py-4 text-sm md:text-base text-white focus:outline-none focus:border-brand-orange/50 transition-all" placeholder="Ej. Ing." />
                    </div>
                    <div className="md:col-span-3 space-y-1.5 md:space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-white/40 ml-4">Nombre Completo</label>
                      <input type="text" required className="w-full glass bg-white/5 border-white/10 rounded-xl md:rounded-2xl px-5 md:px-6 py-3 md:py-4 text-sm md:text-base text-white focus:outline-none focus:border-brand-orange/50 transition-all" placeholder="Ej. Roberto Silva" />
                    </div>
                  </div>
                  <div className="space-y-1.5 md:space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-white/40 ml-4">Empresa / Planta</label>
                    <input type="text" required className="w-full glass bg-white/5 border-white/10 rounded-xl md:rounded-2xl px-5 md:px-6 py-3 md:py-4 text-sm md:text-base text-white focus:outline-none focus:border-brand-orange/50 transition-all" placeholder="Ej. Planta Industrial Norte" />
                  </div>
                  <div className="space-y-1.5 md:space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-white/40 ml-4">Correo Corporativo</label>
                    <input type="email" required className="w-full glass bg-white/5 border-white/10 rounded-xl md:rounded-2xl px-5 md:px-6 py-3 md:py-4 text-sm md:text-base text-white focus:outline-none focus:border-brand-blue/50 transition-all" placeholder="rsilva@empresa.com" />
                  </div>
                  <div className="space-y-1.5 md:space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-white/40 ml-4">Teléfono de Contacto</label>
                    <input type="tel" required className="w-full glass bg-white/5 border-white/10 rounded-xl md:rounded-2xl px-5 md:px-6 py-3 md:py-4 text-sm md:text-base text-white focus:outline-none focus:border-brand-blue/50 transition-all" placeholder="55 0000 0000" />
                  </div>
                  <div className="md:col-span-2 space-y-1.5 md:space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-white/40 ml-4">Detalles del Proyecto</label>
                    <textarea required rows={4} className="w-full glass bg-white/5 border-white/10 rounded-xl md:rounded-2xl px-5 md:px-6 py-3 md:py-4 text-sm md:text-base text-white focus:outline-none focus:border-brand-blue/50 transition-all resize-none" placeholder="Describa brevemente el área a intervenir y las condiciones de operación..."></textarea>
                  </div>
                  <div className="md:col-span-2 pt-2 md:pt-4">
                    <button type="submit" className="w-full py-4 md:py-5 bg-brand-blue text-white font-black uppercase tracking-[0.2em] text-xs md:text-sm rounded-xl md:rounded-2xl shadow-[0_20px_40px_rgba(0,75,135,0.2)] hover:shadow-[0_25px_50px_rgba(0,75,135,0.4)] transition-all hover:-translate-y-1 active:scale-[0.98]">
                      Solicitar una Cotización
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="mt-20 pt-8 border-t border-white/5 text-center">
            <p className="text-white/20 text-xs uppercase tracking-[0.4em] font-medium">© 2026 MCI Soluciones Poliméricas - Ingeniería de Alta Gama </p>
          </div>
        </div>
      </footer>

      {/* Floating Chat Widget */}
      <div className="fixed bottom-8 left-8 z-[100000]" ref={chatContainerRef}>
        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="relative w-16 h-16 flex items-center justify-center group"
        >
          {/* Astrobot Body/Head */}
          <motion.div 
            className="absolute inset-0 bg-white rounded-full shadow-[0_15px_40px_rgba(255,255,255,0.3)] border-b-4 border-gray-200"
            animate={{ 
              y: [0, -6, 0],
              rotate: isChatOpen ? 0 : [0, -2, 2, 0]
            }}
            transition={{ 
              y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 5, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            {/* Visor - Astrobot Style */}
            <div className="absolute top-1/4 left-2 right-2 h-[40%] bg-[#0a192f] rounded-full flex items-center justify-center gap-2 overflow-hidden border border-white/10 shadow-inner">
              <AnimatePresence mode="wait">
                {isChatOpen ? (
                  <motion.div 
                    key="open"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="text-[#00f2ff] font-black text-2xl"
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
                    {/* Eyes with Expressions */}
                    <motion.div 
                      className="w-3 h-3 bg-[#00f2ff] rounded-full shadow-[0_0_10px_#00f2ff]"
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
                      className="w-3 h-3 bg-[#00f2ff] rounded-full shadow-[0_0_10px_#00f2ff]"
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
              {/* Scanning line */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00f2ff]/30 to-transparent h-1/3 w-full"
                animate={{ top: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </div>
            {/* Blue LED Strip */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-[#00f2ff] rounded-full blur-[2px] opacity-60" />
          </motion.div>

          {/* Floating Ring */}
          <div className="absolute -inset-6 border border-dashed border-brand-orange/30 rounded-full animate-[spin_20s_linear_infinite] pointer-events-none" />
          
          {/* Neon Green Online Indicator */}
          <div className="absolute -top-1 -right-1 flex items-center justify-center z-10">
            <span className="absolute w-5 h-5 bg-[#39ff14] rounded-full animate-ping opacity-40" />
            <span className="relative w-3.5 h-3.5 bg-[#39ff14] rounded-full border-2 border-[#0a192f] shadow-[0_0_10px_#39ff14]" />
          </div>
        </button>

        <AnimatePresence>
          {isChatOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: 'bottom left' }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="absolute bottom-24 left-0 w-[360px] max-w-[calc(100vw-40px)] h-[600px] max-h-[calc(100vh-120px)] bg-[#0a192f] rounded-2xl border border-white/10 shadow-2xl flex flex-col overflow-hidden will-change-transform"
            >
              <div className="bg-brand-orange p-4 flex justify-between items-center relative shrink-0">
                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center relative overflow-hidden shadow-lg">
                    <div className="absolute inset-0.5 bg-[#0a192f] rounded-full flex items-center justify-center gap-1 shadow-inner">
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
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#39ff14] border-2 border-[#0a192f] rounded-full shadow-sm" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">MCI Bot</h4>
                    <p className="text-white/80 text-[10px] font-medium">En línea</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsChatOpen(false)}
                  className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 p-4 overflow-y-auto space-y-3 custom-scrollbar bg-gray-50/5">
                {chatMessages.map((msg, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-2"
                  >
                    <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed ${msg.type === 'bot' ? 'bg-white text-gray-800 self-start rounded-tl-none shadow-sm border border-gray-100' : 'bg-brand-orange text-white font-medium self-end rounded-tr-none shadow-sm ml-auto'}`}>
                      {msg.image && (
                        <img src={msg.image} alt="User upload" className="w-full h-48 object-cover rounded-2xl mb-4 border border-white/10 shadow-lg" />
                      )}
                      <div dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br/>') }} />
                    </div>
                    
                    {i === 0 && chatMessages.length === 1 && (
                      <div className="flex flex-col gap-2 self-start w-[85%]">
                        {[
                          { q: 'Cobertura MCI', a: 'Tenemos <strong>capacidad de instalación en todo México</strong>.' },
                          { q: 'Normas y Certificaciones', a: 'Cumplimos normas internacionales, incluyendo <strong>FDA y USDA</strong>.' },
                          { q: 'Asistencia por WhatsApp', a: 'Puedes solicitar asistencia personalizada para dudas técnicas: <a href="https://wa.me/525561500317" target="_blank" class="inline-block mt-2 bg-brand-orange text-white px-4 py-2 rounded-lg font-bold">Quiero asistencia personalizada</a>' }
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
                ))}
                {isTyping && (
                  <div className="bg-white/[0.04] p-5 rounded-3xl rounded-bl-none border border-white/5 self-start flex gap-1.5 shadow-xl">
                    <motion.div className="w-1.5 h-1.5 bg-brand-blue rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity }} />
                    <motion.div className="w-1.5 h-1.5 bg-brand-blue rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} />
                    <motion.div className="w-1.5 h-1.5 bg-brand-blue rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} />
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100 space-y-3 shrink-0">
                {selectedFile && (
                  <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-xl border border-gray-200">
                    <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                      <img src={URL.createObjectURL(selectedFile)} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-gray-600 font-bold truncate">{selectedFile.name}</p>
                    </div>
                    <button type="button" onClick={() => setSelectedFile(null)} className="p-1.5 text-gray-400 hover:text-red-500">
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
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2.5 text-gray-400 hover:text-brand-orange transition-colors"
                  >
                    <Camera className="w-5 h-5" />
                  </button>
                  <input 
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Escribe tu mensaje..."
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-brand-orange transition-all"
                  />
                  <button 
                    type="submit"
                    disabled={isTyping || (!userInput.trim() && !selectedFile)}
                    onClick={() => playClickSound()}
                    className="p-2.5 bg-brand-orange text-white rounded-full disabled:opacity-50 hover:bg-brand-orange/80 transition-all shadow-sm"
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
      <div className="fixed bottom-8 right-8 z-[9999] flex flex-col gap-4 pointer-events-none">
        <AnimatePresence>
          {showBackToTop && (
            <motion.button 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              onClick={(e) => {
                e.stopPropagation();
                playClickSound();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-14 h-14 glass border-white/10 text-white/40 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 hover:text-white transition-all group pointer-events-auto"
            >
              <div className="absolute -top-10 right-0 glass border-white/10 text-white/60 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
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
          className={`relative w-14 h-14 glass border-brand-orange/40 text-brand-orange rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all group pointer-events-auto ${isSpeaking ? 'bg-brand-orange/20 border-brand-orange' : ''}`}
        >
          <div className="absolute -top-10 right-0 glass border-brand-orange/30 text-brand-orange px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            {isSpeaking ? 'Detener lectura' : 'Lectura asistida'}
          </div>
          {isSpeaking ? <VolumeX className="w-6 h-6 animate-pulse" /> : <Volume2 className="w-6 h-6" />}
        </button>
      </div>
    </div>
  );
}
