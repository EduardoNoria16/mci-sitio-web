import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';
import { getProxiedImageUrl } from '../utils/image';

const CATEGORIES = [
  { id: 'pisos-comerciales', title: 'Pisos para uso comercial e industrial' },
  { id: 'pisos-epoxicos', title: 'Pisos Epóxicos' },
  { id: 'acabados-alta-gama', title: 'Acabados industriales de Alta Gama' },
  { id: 'reparacion-concreto', title: 'Reparación y mantenimiento de concreto' },
  { id: 'impermeabilizacion', title: 'Impermeabilización' },
  { id: 'pinturas-especiales', title: 'Pinturas especiales' },
  { id: 'sistema-cortafuegos', title: 'Sistema Cortafuegos' },
  { id: 'aislamiento', title: 'Aislamiento Térmico y Acústico' },
];

const CATEGORY_IMAGES: Record<string, string[]> = {
  'pisos-comerciales': [
    'https://i.ibb.co/k2kd5Tq3/1.webp',
    'https://i.ibb.co/MyCd48Rp/2.webp',
    'https://i.ibb.co/Y7DtBMpK/3.webp',
    'https://i.ibb.co/YgyNNbX/4.webp',
    'https://i.ibb.co/9H2ptfZb/5.webp',
    'https://i.ibb.co/TBP4QnHn/6.webp',
    'https://i.ibb.co/xS9xFkL3/7.webp',
    'https://i.ibb.co/tPvYRmHJ/8.webp',
    'https://i.ibb.co/Z1LJFY1H/9.webp',
    'https://i.ibb.co/bM9vVFZ5/10.webp',
    'https://i.ibb.co/8D8q7wPB/11.webp',
    'https://i.ibb.co/R4hW8rc6/12.webp',
    'https://i.ibb.co/9HbJ56vW/13.webp',
    'https://i.ibb.co/FbX3LMcy/14.webp',
    'https://i.ibb.co/n8Pjkcx2/15.webp',
    'https://i.ibb.co/NghF8cwG/16.webp',
    'https://i.ibb.co/FbH1yg1s/17.webp',
    'https://i.ibb.co/RTs1j4RB/18.webp',
    'https://i.ibb.co/CsHMjMXD/19.webp',
    'https://i.ibb.co/FbKpdtpK/20.webp',
    'https://i.ibb.co/TDPsyt5x/21.webp',
    'https://i.ibb.co/Kzc2RG1K/22.webp',
    'https://i.ibb.co/p6GSWHBp/23.webp',
    'https://i.ibb.co/NdGkCC4t/24.webp',
    'https://i.ibb.co/cKL202G3/25.webp',
    'https://i.ibb.co/9kVrm9gm/26.webp',
    'https://i.ibb.co/jP0pZtvc/27.webp',
  ],
  'pisos-epoxicos': [
    'https://i.ibb.co/TBbvFzP5/IMG-20260608-115239.webp',
    'https://i.ibb.co/0RsswmcM/IMG-20260608-114931.webp',
    'https://i.ibb.co/0Rdc2ry9/IMG-20260608-115330.webp',
    'https://i.ibb.co/bg0K4g5h/IMG-20260608-115257.webp',
    'https://i.ibb.co/xtnmmPbD/IMG-20260608-115351.webp',
    'https://i.ibb.co/Q7TvTbCx/IMG-20260608-115415.webp',
    'https://i.ibb.co/TDYzzXVN/IMG-20260608-115434.webp',
    'https://i.ibb.co/6722wkYP/IMG-20260608-115511.webp',
    'https://i.ibb.co/SXWddC4j/IMG-20260608-115532.webp',
    'https://i.ibb.co/bRN7mBJK/IMG-20260608-115551.webp',
    'https://i.ibb.co/39Dk7yFQ/IMG-20260608-115616.webp',
    'https://i.ibb.co/WW4mx3gb/IMG-20260608-115648.webp',
    'https://i.ibb.co/nMD6VxpR/IMG-20260608-115707.webp',
    'https://i.ibb.co/zhg4zr8t/6.webp',
    'https://i.ibb.co/YBj0GvHp/5.webp',
    'https://i.ibb.co/hx4cKyX0/4.webp',
    'https://i.ibb.co/9kH5VbXJ/3.webp',
    'https://i.ibb.co/Jh6n3x7/2.webp',
    'https://i.ibb.co/ZRs1DR8j/1.webp',
  ],
  'acabados-alta-gama': [
    'https://i.ibb.co/gL2DGHpQ/1.webp',
    'https://i.ibb.co/mFbHwxFm/2.webp',
    'https://i.ibb.co/8LCHLwmd/3.webp',
    'https://i.ibb.co/1JBxjHyD/4.webp',
    'https://i.ibb.co/KcJDDSZV/5.webp',
    'https://i.ibb.co/DDfP4Q1w/6.webp',
    'https://i.ibb.co/twc09Bjm/7.webp',
    'https://i.ibb.co/tM8qgScG/8.webp',
    'https://i.ibb.co/Kx25KY5y/9.webp',
    'https://i.ibb.co/RT9qYZm3/10.webp',
    'https://i.ibb.co/GQGXp9cZ/11.webp',
    'https://i.ibb.co/Xrp563Hs/12.webp',
    'https://i.ibb.co/XrnnVtW6/13.webp',
    'https://i.ibb.co/WpPbJRjN/14.webp',
    'https://i.ibb.co/MyGGRF9k/15.webp',
    'https://i.ibb.co/0VGDprny/16.webp',
    'https://i.ibb.co/CKSFp1GF/17.webp',
    'https://i.ibb.co/7tFyBWfd/18.webp',
    'https://i.ibb.co/Z6Js1Xwn/19.webp',
    'https://i.ibb.co/0VC65bkt/20.webp',
    'https://i.ibb.co/KpqTs6w0/21.webp',
    'https://i.ibb.co/KxLw7J3h/22.webp',
    'https://i.ibb.co/5CFc54d/23.webp',
    'https://i.ibb.co/rGv96jGW/24.webp',
    'https://i.ibb.co/p60rB0jV/IMG-20260608-131711.webp',
    'https://i.ibb.co/PGPmGv7M/IMG-20260608-131818.webp',
    'https://i.ibb.co/Cp1trKxY/IMG-20260608-131837.webp',
  ],
  'reparacion-concreto': [
    'https://i.ibb.co/fGVGy4b9/1.webp',
    'https://i.ibb.co/zVnx0W0Z/2.webp',
    'https://i.ibb.co/67SQKvF7/3.webp',
    'https://i.ibb.co/zhHKhZVg/4.webp',
    'https://i.ibb.co/k2kyYdz7/5.webp',
    'https://i.ibb.co/1Jqf9TT1/6.webp',
  ],
  'impermeabilizacion': [
    'https://i.ibb.co/0RNmfQns/9.webp',
    'https://i.ibb.co/pvp2trW3/8.webp',
    'https://i.ibb.co/35Rq2ScH/7.webp',
    'https://i.ibb.co/CpRF4Rd6/6.webp',
    'https://i.ibb.co/7JZHz93R/5.webp',
    'https://i.ibb.co/0yKJGZCt/4.webp',
    'https://i.ibb.co/6cS8swG4/3.webp',
    'https://i.ibb.co/jpP5Zm5/2.webp',
    'https://i.ibb.co/MkFXfB5n/1.webp',
    'https://i.ibb.co/27PXM0mQ/IMG-20260608-125912.webp',
    'https://i.ibb.co/b5GVpjBN/IMG-20260608-130020.webp',
    'https://i.ibb.co/RwK5fDx/IMG-20260608-130042.webp',
    'https://i.ibb.co/9m6vn4PM/IMG-20260608-130100.webp',
    'https://i.ibb.co/cSq5y0cQ/IMG-20260608-130118.webp',
    'https://i.ibb.co/nNWtKx6g/IMG-20260608-130137.webp',
    'https://i.ibb.co/CpXWpcnW/IMG-20260608-130156.webp',
    'https://i.ibb.co/xqTjk7sj/IMG-20260608-130215.webp',
  ],
  'pinturas-especiales': [
    'https://i.ibb.co/VcGSBzLj/1.webp',
    'https://i.ibb.co/Qv9dKtp1/2.webp',
    'https://i.ibb.co/gLfLtCFb/3.webp',
    'https://i.ibb.co/9HqQbm4V/4.webp',
    'https://i.ibb.co/NgWfLQ7v/5.webp',
    'https://i.ibb.co/27RKHT9b/6.webp',
    'https://i.ibb.co/zVfBkPLY/7.webp',
    'https://i.ibb.co/pv30rdk5/8.webp',
    'https://i.ibb.co/kVWFfkLB/9.webp',
    'https://i.ibb.co/Swj96xSR/10.webp',
    'https://i.ibb.co/XZstj9X8/11.webp',
    'https://i.ibb.co/9kjSVR1J/12.webp',
    'https://i.ibb.co/VYfYvYnH/13.webp',
    'https://i.ibb.co/NnsPVdcc/14.webp',
    'https://i.ibb.co/pj9m3BvP/15.webp',
    'https://i.ibb.co/dwhRr1N1/16.webp',
    'https://i.ibb.co/Nnb2FwX5/17.webp',
  ],
  'sistema-cortafuegos': [
    'https://i.ibb.co/PzCspYpW/1.webp',
    'https://i.ibb.co/WNW00vZ9/2.webp',
    'https://i.ibb.co/mFPQYt2P/3.webp',
    'https://i.ibb.co/jZ670wHK/4.webp',
    'https://i.ibb.co/SwtYMjky/5.webp',
    'https://i.ibb.co/WWJHncw8/6.webp',
    'https://i.ibb.co/RkLvP9hp/7.webp',
    'https://i.ibb.co/bgqhqCDr/8.webp',
    'https://i.ibb.co/NgD5M7Px/9.webp',
    'https://i.ibb.co/twZ1XRmr/10.webp',
    'https://i.ibb.co/svHxtQbK/11.webp',
    'https://i.ibb.co/8479DTzV/12.webp',
  ],
  'aislamiento': [
    'https://i.ibb.co/Mk2kr7Vp/1.webp',
  ],
};

const PISOS_COMERCIALES_TITLES = [
  "Cementicio nivelante en comedor 1.jpg",
  "Cementicio nivelante en comedor 2.jpg",
  "Cementicio nivelante en comedor asociados Sams 1.jpg",
  "Cementicio nivelante en comedor asociados Sams 2.jpg",
  "Cementicio nivelante en comedor asociados Sams 3.jpg",
  "Cementicio nivelante en comedor asociados Sams 4.jpg",
  "DPA 1.jpg",
  "DPA 2.jpg",
  "DPA 3",
  "DPA 4.jpg",
  "DPA 5.jpg",
  "Epóxico con requerimientos sanitarios 1.jpeg",
  "Epóxico con requerimientos sanitarios 2.jpeg",
  "Epóxico con requerimientos sanitarios 3.jpeg",
  "Epóxico con requerimientos sanitarios 4.jpeg",
  "Epóxico con requerimientos sanitarios 5.jpeg",
  "Epóxico con requerimientos sanitarios 6.png",
  "Epóxico con requerimientos sanitarios 7.jpeg",
  "Epóxico en área de producción 1.jpg",
  "Epóxico en área de producción 2.jpg",
  "Epóxico en área de producción 3.jpg",
  "Epóxico en área de producción 4.jpg",
  "Piso CEDIS.png",
  "Piso de concreto 1.jpg",
  "Piso de Concreto 3",
  "Piso de Concreto 4",
  "Piso en espacio comercial.jpg",
  "Sello de juntas"
];

const ALL_IMAGES = CATEGORIES.flatMap(cat => {
  const catImages = CATEGORY_IMAGES[cat.id] || [];
  return catImages.map((url, i) => {
    let specificTitle;
    if (cat.id === 'pisos-comerciales') {
      specificTitle = PISOS_COMERCIALES_TITLES[i];
    }
    const finalTitle = specificTitle || `${cat.title} - Proyecto ${i + 1}`;
    
    return {
      id: `${cat.id}-${i + 1}`,
      categoryId: cat.id,
      categoryTitle: cat.title,
      url: url,
      title: finalTitle,
    };
  });
});

interface ProjectGalleryProps {
  onImageSelect: (imageUrl: string) => void;
}

export function ProjectGallery({ onImageSelect }: ProjectGalleryProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isInteracting = useRef(false);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = current.clientWidth * 0.8;
      current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const filteredImages = activeCategory === 'all' 
    ? ALL_IMAGES 
    : ALL_IMAGES.filter(img => img.categoryId === activeCategory);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let animationId: number;

    const scroll = () => {
      if (!isInteracting.current && container) {
        container.scrollLeft += 1.5; 
        
        if (container.scrollLeft >= container.scrollWidth / 2) {
          container.scrollLeft -= container.scrollWidth / 2;
        }
      }
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

    const handleScroll = () => {
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
  }, [filteredImages]);

  return (
    <section id="galeria" className="relative z-10 py-16 md:py-24 bg-[#0a192f] flex flex-col justify-center overflow-hidden">
      <div className="w-full max-w-[1600px] mx-auto px-5 md:px-10 lg:px-12">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tighter drop-shadow-sm mb-4">
            Galería de <span className="text-brand-orange">Proyectos</span>
          </h2>
          <div className="w-24 md:w-32 h-1.5 md:h-2 bg-brand-orange mx-auto rounded-full shadow-[0_0_20px_rgba(245,130,32,0.3)] mb-8" />
          
          {/* Categorías (Botones) */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 max-w-5xl mx-auto">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs md:text-sm font-bold tracking-wide transition-all duration-300 uppercase ${
                activeCategory === 'all'
                  ? 'bg-brand-orange text-white shadow-[0_4px_15px_rgba(245,130,32,0.4)]'
                  : 'bg-white/10 text-white hover:bg-white/20 hover:text-brand-orange'
              }`}
            >
              Todos
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs md:text-sm font-bold tracking-wide transition-all duration-300 uppercase ${
                  activeCategory === cat.id
                    ? 'bg-brand-orange text-white shadow-[0_4px_15px_rgba(245,130,32,0.4)]'
                    : 'bg-white/10 text-white hover:bg-white/20 hover:text-brand-orange'
                }`}
              >
                {cat.title}
              </button>
            ))}
          </div>
        </div>

        <div className="relative group/gallery">
            <button 
              onClick={() => scroll('left')}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-14 md:h-14 rounded-full bg-black/60 backdrop-blur-xl border border-white/20 text-white flex items-center justify-center opacity-0 group-hover/gallery:opacity-100 transition-all duration-300 disabled:opacity-0 hover:bg-brand-orange hover:border-brand-orange shadow-[0_0_20px_transparent] hover:shadow-[0_0_30px_rgba(245,130,32,0.6)] hover:scale-110"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-5 h-5 md:w-7 md:h-7 ml-[-2px]" />
            </button>
            
            <button 
              onClick={() => scroll('right')}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-14 md:h-14 rounded-full bg-black/60 backdrop-blur-xl border border-white/20 text-white flex items-center justify-center opacity-0 group-hover/gallery:opacity-100 transition-all duration-300 disabled:opacity-0 hover:bg-brand-orange hover:border-brand-orange shadow-[0_0_20px_transparent] hover:shadow-[0_0_30px_rgba(245,130,32,0.6)] hover:scale-110"
              aria-label="Siguiente"
            >
              <ChevronRight className="w-5 h-5 md:w-7 md:h-7 mr-[-2px]" />
            </button>

            {/* Horizontal scroll layout */}
            <div 
              ref={scrollContainerRef}
              className="flex overflow-x-auto select-none pt-2 pb-6 mt-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] cursor-grab active:cursor-grabbing -mx-5 px-5 md:-mx-10 md:px-10 lg:-mx-12 lg:px-12"
              onPointerEnter={() => isInteracting.current = true}
              onPointerLeave={() => isInteracting.current = false}
              onTouchStart={() => isInteracting.current = true}
              onTouchEnd={() => {
                setTimeout(() => { isInteracting.current = false; }, 1000);
              }}
            >
              <div className="flex shrink-0">
                {[...Array(3)].map((_, groupIndex) => (
                  <div key={`group-${groupIndex}`} className="flex shrink-0 gap-4 md:gap-6 pr-4 md:pr-6">
                    <AnimatePresence mode='popLayout'>
                      {filteredImages.map((image, idx) => (
                        <motion.div
                          layout
                          key={`${image.id}-${groupIndex}`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.4 }}
                          className="group relative flex-none w-[75vw] sm:w-[45vw] md:w-[30vw] lg:w-[22vw] aspect-[4/3] sm:aspect-square rounded-2xl md:rounded-[2rem] overflow-hidden cursor-pointer shadow-sm border-[1.5px] border-brand-orange/20 transition-all duration-500 hover:shadow-[0_10px_40px_rgba(245,130,32,0.2)] hover:-translate-y-2 will-change-transform bg-black/40 p-2 sm:p-3"
                          onClick={() => onImageSelect(image.url)}
                        >
                          <div className="w-full h-full relative rounded-xl sm:rounded-[1.5rem] overflow-hidden bg-black/50">
                            <img
                              src={getProxiedImageUrl(image.url)}
                              alt={image.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 pointer-events-none"
                              loading="lazy"
                              decoding="async"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                if (!target.src.includes('placehold.co')) {
                                  target.src = 'https://placehold.co/600x400/1a1a1a/f58220?text=Error+Cargando';
                                }
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f]/90 via-[#0a192f]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                            {/* Info & Expand Icon */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 pointer-events-none">
                              <p className="text-white font-bold text-sm tracking-wide mix-blend-plus-lighter">{image.categoryTitle}</p>
                            </div>

                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
                               <span className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-brand-orange/90 backdrop-blur-md shadow-[0_4px_30px_rgba(245,130,32,0.8)] text-white">
                                 <Maximize2 className="w-6 h-6 md:w-8 md:h-8" />
                               </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
        </div>
      </div>
    </section>
  );
}
