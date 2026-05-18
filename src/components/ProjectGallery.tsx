import { PROJECT_IMAGES } from '../data/images';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2 } from 'lucide-react';

const GALLERY_IMAGES = [
  { id: 1, url: '/projects/IMG-20260515-WA0004.jpg', category: 'Instalación', title: 'Piso Industrial' },
  { id: 2, url: '/projects/IMG-20260515-WA0005.jpg', category: 'Acabados', title: 'Acabado Resistente' },
  { id: 3, url: '/projects/IMG-20260515-WA0006.jpg', category: 'Instalación', title: 'Piso de Alta Durabilidad' },
  { id: 4, url: '/projects/IMG-20260515-WA0007.jpg', category: 'Mantenimiento', title: 'Restauración' },
  { id: 5, url: '/projects/IMG-20260515-WA0008.jpg', category: 'Acabados', title: 'Mantenimiento Industrial' },
  { id: 6, url: '/projects/IMG-20260515-WA0009.jpg', category: 'Instalación', title: 'Sistema Epóxico' },
  { id: 7, url: '/projects/IMG-20260515-WA0010.jpg', category: 'Mantenimiento', title: 'Nivelación' },
  { id: 8, url: '/projects/IMG-20260515-WA0011.jpg', category: 'Instalación', title: 'Piso Sanitario' },
  { id: 9, url: '/projects/IMG-20260515-WA0012.jpg', category: 'Acabados', title: 'Mantenimiento' },
  { id: 10, url: '/projects/IMG-20260515-WA0013.jpg', category: 'Instalación', title: 'Área de Producción' },
  { id: 11, url: '/projects/IMG-20260515-WA0014.jpg', category: 'Mantenimiento', title: 'Tráfico Pesado' },
  { id: 12, url: '/projects/IMG-20260515-WA0015.jpg', category: 'Acabados', title: 'Almacén' },
  { id: 13, url: '/projects/IMG-20260515-WA0016.jpg', category: 'Instalación', title: 'Cuarto Limpio' },
  { id: 14, url: '/projects/IMG-20260515-WA0017.jpg', category: 'Mantenimiento', title: 'Poliuretano' },
  { id: 15, url: '/projects/IMG-20260515-WA0018.jpg', category: 'Instalación', title: 'Impermeabilización' },
  { id: 16, url: '/projects/IMG-20260515-WA0019.jpg', category: 'Acabados', title: 'Protección' }
];

const CATEGORIES = ['Todos', 'Instalación', 'Mantenimiento', 'Acabados'];

interface ProjectGalleryProps {
  onImageSelect: (imageUrl: string) => void;
}

export function ProjectGallery({ onImageSelect }: ProjectGalleryProps) {
  const [activeCategory, setActiveCategory] = useState('Todos');

  const filteredImages = activeCategory === 'Todos' 
    ? GALLERY_IMAGES 
    : GALLERY_IMAGES.filter(img => img.category === activeCategory);

  return (
    <section id="galeria" className="relative z-10 py-20 md:py-32 bg-[#0a192f]">
      <div className="max-w-7xl mx-auto px-5 md:px-10 lg:px-12">
        <div className="text-center mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "200px" }}
            className="inline-flex items-center gap-2 mb-4"
          >
            <div className="w-8 h-px bg-brand-orange" />
            <span className="text-brand-orange font-black text-[10px] md:text-sm tracking-[0.3em] uppercase">Nuestra Excelencia</span>
            <div className="w-8 h-px bg-brand-orange" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "200px" }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-white mb-6 drop-shadow-lg"
          >
            Galería de <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-[#f58220]">Proyectos</span>
          </motion.h2>
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

        {/* Categories / Filter */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 mb-12">
          {CATEGORIES.map((category, idx) => (
            <motion.button
              key={category}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "200px" }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2 md:px-8 md:py-3 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-brand-orange text-white shadow-[0_0_20px_rgba(245,130,32,0.4)]'
                  : 'bg-[#112240] text-white/60 hover:bg-[#1a365d] hover:text-white border border-white/5'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
          <AnimatePresence mode="popLayout">
            {filteredImages.map((image) => (
              <motion.div
                key={image.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.25 }}
                className="group relative aspect-square rounded-xl md:rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl hover:shadow-[#22d3ee]/20 will-change-transform bg-[#0a192f]"
                onClick={() => onImageSelect(image.url)}
              >
                <div className="w-full h-full relative">
                  <img
                    src={image.url}
                    alt={`Proyecto de ${image.category}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    style={{ imageRendering: 'high-quality' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  
                  {/* Category Tag */}
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md border border-white/20 px-2 py-1 md:px-3 md:py-1.5 rounded-full text-[8px] md:text-[10px] text-white/90 font-black uppercase tracking-widest translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-75 pointer-events-none">
                    {image.category}
                  </div>

                  {/* Expand Icon */}
                  <div className="absolute bottom-3 left-3 md:bottom-5 md:left-5 text-white translate-y-[10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-100 pointer-events-none">
                     <span className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-brand-orange shadow-[0_4px_15px_rgba(245,130,32,0.5)] text-white">
                       <Maximize2 className="w-4 h-4 md:w-5 md:h-5" />
                     </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
