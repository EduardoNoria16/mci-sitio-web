import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';
import { getProxiedImageUrl } from '../utils/image';

const GALLERY_IMAGES = [
  { id: 1, url: 'https://images2.imgbox.com/9e/ee/4iPPOcUe_o.jpg', category: 'Instalación', title: 'Piso Industrial' },
  { id: 2, url: 'https://images2.imgbox.com/57/31/zRTvlmqq_o.jpg', category: 'Acabados', title: 'Acabado Resistente' },
  { id: 3, url: 'https://images2.imgbox.com/53/a1/RMPmtN1P_o.jpg', category: 'Instalación', title: 'Piso de Alta Durabilidad' },
  { id: 4, url: 'https://images2.imgbox.com/e8/ec/sJejxSW5_o.jpg', category: 'Mantenimiento', title: 'Restauración' },
  { id: 5, url: 'https://images2.imgbox.com/88/de/y2XVBg7H_o.jpg', category: 'Acabados', title: 'Mantenimiento Industrial' },
  { id: 6, url: 'https://images2.imgbox.com/43/c5/5xCpEHj0_o.jpg', category: 'Instalación', title: 'Sistema Epóxico' },
  { id: 7, url: 'https://images2.imgbox.com/ba/df/VL6MMCsD_o.jpg', category: 'Mantenimiento', title: 'Nivelación' },
  { id: 8, url: 'https://images2.imgbox.com/6d/28/f6Ghki6p_o.jpg', category: 'Instalación', title: 'Piso Sanitario' },
  { id: 9, url: 'https://images2.imgbox.com/ac/2c/Bgjcj7Yd_o.jpg', category: 'Acabados', title: 'Mantenimiento' },
  { id: 10, url: 'https://images2.imgbox.com/6d/12/5PxQSgc3_o.jpg', category: 'Instalación', title: 'Área de Producción' },
  { id: 11, url: 'https://images2.imgbox.com/71/e0/HMfjCcGl_o.jpg', category: 'Mantenimiento', title: 'Tráfico Pesado' },
  { id: 12, url: 'https://images2.imgbox.com/f0/2f/Mk6k1VFh_o.jpg', category: 'Acabados', title: 'Almacén' },
  { id: 13, url: 'https://images2.imgbox.com/e7/17/leo7KCru_o.jpg', category: 'Instalación', title: 'Cuarto Limpio' },
  { id: 14, url: 'https://images2.imgbox.com/0d/85/a47FYWFE_o.jpg', category: 'Mantenimiento', title: 'Poliuretano' },
  { id: 15, url: 'https://images2.imgbox.com/51/5e/BrUBERDR_o.jpg', category: 'Instalación', title: 'Impermeabilización' },
  { id: 16, url: 'https://images2.imgbox.com/c0/73/kTgHn9uN_o.jpg', category: 'Acabados', title: 'Protección' }
];

interface ProjectGalleryProps {
  onImageSelect: (imageUrl: string) => void;
}

export function ProjectGallery({ onImageSelect }: ProjectGalleryProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  return (
    <section id="galeria" className="relative z-10 py-20 md:py-32 bg-[#0a192f] flex flex-col justify-center overflow-hidden">
      <div className="w-full max-w-[1600px] mx-auto px-5 md:px-10 lg:px-12">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold uppercase tracking-tighter text-white drop-shadow-sm transition-all duration-300">
            Galería&nbsp;&nbsp;de&nbsp;&nbsp;<span className="text-gradient transition-colors">Proyectos</span>
          </h2>
          <div className="w-24 md:w-32 h-1.5 md:h-2 bg-brand-orange mx-auto rounded-full shadow-[0_0_20px_rgba(245,130,32,0.3)] mt-4 mb-6" />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "200px" }}
            transition={{ delay: 0.2 }}
            className="text-white/70 max-w-2xl mx-auto text-sm md:text-base font-bold tracking-wide"
          >
            Explora la calidad de nuestros acabados y soluciones poliméricas a través de nuestro portafolio.
          </motion.p>
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
              className="flex overflow-x-auto snap-x snap-mandatory gap-4 md:gap-6 pb-6 pt-2 hide-scrollbar -mx-5 px-5 md:-mx-10 md:px-10 lg:-mx-12 lg:px-12"
              style={{ 
                scrollbarWidth: 'none', 
                msOverflowStyle: 'none' 
              }}
            >
              {GALLERY_IMAGES.map((image, idx) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "100px" }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="group relative flex-none w-[75vw] sm:w-[45vw] md:w-[30vw] lg:w-[22vw] aspect-square snap-center rounded-2xl md:rounded-[2rem] overflow-hidden cursor-pointer shadow-sm border-[1.5px] border-blue-200/60 transition-all duration-500 hover:shadow-xl hover:-translate-y-2 will-change-transform bg-gradient-to-br from-blue-50/70 to-white/70 hover:from-blue-100/80 hover:to-white/90 p-3 sm:p-4"
                  onClick={() => onImageSelect(getProxiedImageUrl(image.url))}
                >
                  <div className="w-full h-full relative rounded-xl sm:rounded-2xl overflow-hidden shadow-inner border border-black/5">
                    <img
                      src={getProxiedImageUrl(image.url)}
                      alt={image.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f]/90 via-[#0a192f]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    {/* Expand Icon */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
                       <span className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-brand-orange/90 backdrop-blur-md shadow-[0_4px_30px_rgba(245,130,32,0.8)] text-white">
                         <Maximize2 className="w-6 h-6 md:w-8 md:h-8" />
                       </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
        </div>
      </div>
    </section>
  );
}
