import React from 'react';

export type Language = 'es' | 'en';

export interface TranslationDict {
  nav: {
    inicio: string;
    sectores: string;
    fortalezas: string;
    contacto: string;
  };
  hero: {
    whoWeAre: string;
    descPart1: string;
    descPart2: string;
    learnMore: string;
    requestQuote: string;
  };
  evaluation: {
    title: string;
    subtitle: string;
    step1Question: string;
    step1Option1: string;
    step1Option2: string;
    step2Question: string;
    step2Option1: string;
    step2Option2: string;
    step2Option3: string;
    step3Title: string;
    step3Desc: string;
    step3Btn: string;
  };
  strengths: {
    title: string;
    subtitle: string;
    readSection: string;
    listening: string;
    close: string;
    keywords: string;
    requirements: string;
  };
  sectors: {
    title: string;
    subtitle: string;
    clickToSee: string;
  };
  gallery: {
    title: string;
    subtitle: string;
    successStories: string;
    initialCondition: string;
    solution: string;
    errorLoading: string;
  };
  testimonials: {
    title: string;
    subtitle: string;
    showMore: string;
    showLess: string;
  };
  contact: {
    title: string;
    subtitle: string;
    formTitle: string;
    name: string;
    email: string;
    phone: string;
    company: string;
    description: string;
    nature: string;
    natureOptions: {
      comercial: string;
      industrial: string;
      residencial: string;
      infraestructura: string;
    };
    submit: string;
    submitting: string;
    success: string;
    error: string;
    address: string;
    addressDetail: string;
    emailLabel: string;
    phoneLabel: string;
    officeHours: string;
    officeHoursDetail: string;
  };
  chat: {
    welcome: string;
    placeholder: string;
    reset: string;
    assistantTitle: string;
    assistantStatus: string;
  };
  about: {
    guaranteeResults: string;
    missionTitle: string;
    missionText: string;
    visionTitle: string;
    visionText: string;
    propTitle: string;
    propText: string;
    diffTitle: string;
    diffs: string[];
    moreInfo: string;
    inviteKnow: string;
    discoverMore: string;
    regresar: string;
  };
}

export const translations: Record<Language, TranslationDict> = {
  es: {
    nav: {
      inicio: 'Inicio',
      sectores: 'Sectores',
      fortalezas: 'Fortalezas',
      contacto: 'Contacto'
    },
    hero: {
      whoWeAre: '¿Quiénes Somos?',
      descPart1: 'MCI Soluciones Poliméricas es una empresa de ingeniería aplicada y atención integral. Contamos con más de 30 años de consolidación en los sectores Industrial y de la Construcción en México siendo nuestra especialidad el diseño e implementación de soluciones con sistemas poliméricos de alta gama para restaurar, mejorar y proteger instalaciones expuestas a riesgos físicos o químicos y maximizar así su vida útil, preservando el valor de la inversión de los activos.',
      descPart2: 'No fabricamos materiales, ofrecemos criterio técnico, diagnóstico, especificación correcta y ejecución especializada.',
      learnMore: 'Saber Más',
      requestQuote: 'Solicitar Cotización'
    },
    evaluation: {
      title: 'Evaluación Rápida',
      subtitle: 'Diagnóstico de Superficie',
      step1Question: '¿Qué tipo de instalación requiere?',
      step1Option1: 'Piso Industrial',
      step1Option2: 'Uso Comercial',
      step2Question: 'Estado actual de la superficie:',
      step2Option1: 'Concreto Nuevo',
      step2Option2: 'Baches / Grietas',
      step2Option3: 'Tiene Recubrimiento',
      step3Title: '¡Análisis completado!',
      step3Desc: 'Basado en sus respuestas, requieren una visita técnica.',
      step3Btn: 'Detallar Proyecto'
    },
    strengths: {
      title: 'NUESTRAS FORTALEZAS',
      subtitle: 'Ingeniería aplicada para la protección y restauración de su infraestructura',
      readSection: 'Leer sección',
      listening: 'Escuchando...',
      close: 'Cerrar',
      keywords: 'Palabras clave',
      requirements: 'Requerimientos'
    },
    sectors: {
      title: 'SECTORES DE ATENCIÓN',
      subtitle: 'Ofrecemos soluciones personalizadas para cada tipo de industria y comercio',
      clickToSee: 'Haz clic en un sector para ver los detalles'
    },
    gallery: {
      title: 'NUESTROS TRABAJOS Y GALERÍA',
      subtitle: 'Proyectos ejecutados con el mayor estándar de calidad',
      successStories: 'CASOS DE ÉXITO MCI',
      initialCondition: 'Condición inicial',
      solution: 'Solución MCI',
      errorLoading: 'Error Cargando'
    },
    testimonials: {
      title: 'TESTIMONIOS DE CLIENTES',
      subtitle: 'Opiniones reales de quienes confían en nuestra experiencia',
      showMore: 'Ver más testimonios',
      showLess: 'Ver menos testimonios'
    },
    contact: {
      title: 'INICIEMOS SU PROYECTO',
      subtitle: 'Solicite una cotización, asesoría técnica o visítenos en nuestras oficinas',
      formTitle: 'Formulario de Contacto',
      name: 'Nombre Completo',
      email: 'Correo Electrónico',
      phone: 'Teléfono',
      company: 'Empresa / Organización',
      description: 'Detalles del Proyecto',
      nature: 'Naturaleza del Proyecto (Opcional)',
      natureOptions: {
        comercial: 'Comercial',
        industrial: 'Industrial',
        residencial: 'Residencial',
        infraestructura: 'Infraestructura'
      },
      submit: 'Enviar Mensaje',
      submitting: 'Enviando...',
      success: '¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.',
      error: 'Hubo un error al enviar el mensaje. Por favor, inténtelo de nuevo.',
      address: 'Dirección de Oficina',
      addressDetail: 'Av. Industria No. 45, Col. Industrial, Ciudad de México, México',
      emailLabel: 'Correo Electrónico',
      phoneLabel: 'Teléfono',
      officeHours: 'Horario de Oficina',
      officeHoursDetail: 'Lunes a Viernes: 9:00 AM - 6:00 PM'
    },
    chat: {
      welcome: 'Hola. Soy el Asistente Virtual de MCI. ¿Cómo puedo ayudarte?',
      placeholder: 'Escribe tu mensaje...',
      reset: 'Reiniciar Chat',
      assistantTitle: 'Asistente MCI',
      assistantStatus: 'En línea'
    },
    about: {
      guaranteeResults: 'Así Garantizamos Resultados',
      missionTitle: 'Misión',
      missionText: 'Contribuir con nuestros clientes en la preservación de sus activos de producción mediante el uso de ingeniería aplicada en sistemas poliméricos que garanticen desempeño y continuidad en la operación de sus procesos.',
      visionTitle: 'Visión',
      visionText: 'Convertirnos en el socio técnico de referencia para empresas que no pueden permitirse fallas o paros operativos imprevistos ocasionadas por daños físicos o químicos a los activos de producción.',
      propTitle: 'Propuesta de Valor',
      propText: 'MCI no vende materiales, ofrece soluciones a partir del análisis de las condiciones reales de trabajo. Identificamos riesgos críticos que pueden comprometer la seguridad y la operación, y diseñamos soluciones que, ejecutadas bajo un control estricto, garanticen continuidad operativa, máxima durabilidad y la protección real de la inversión del cliente.',
      diffTitle: 'Nuestros Diferenciadores:',
      diffs: [
        'Más de 30 años de experiencia',
        'Respuesta inmediata 24/7',
        'Rigor técnico',
        'Soluciones integrales a la medida',
        'Calidad total demostrada',
        'Responsabilidad operativa',
        'Protección a largo plazo',
        'Sustentabilidad',
        'Atención post-venta'
      ],
      moreInfo: 'PARA MÁS INFORMACIÓN',
      inviteKnow: 'TE INVITAMOS A CONOCERNOS',
      discoverMore: 'Descubre nuestra metodología, sectores de atención y casos de éxito que nos consolidan como líderes.',
      regresar: 'Regresar'
    }
  },
  en: {
    nav: {
      inicio: 'Home',
      sectores: 'Sectors',
      fortalezas: 'Strengths',
      contacto: 'Contact'
    },
    hero: {
      whoWeAre: 'Who We Are',
      descPart1: 'MCI Soluciones Poliméricas is an applied engineering and comprehensive service company. We have more than 30 years of consolidation in the Industrial and Construction sectors in Mexico, our specialty being the design and implementation of high-end polymeric system solutions to restore, improve and protect facilities exposed to physical or chemical risks, thus maximizing their lifespan and preserving the investment value of assets.',
      descPart2: 'We do not manufacture materials, we offer technical criteria, diagnosis, correct specification, and specialized execution.',
      learnMore: 'Learn More',
      requestQuote: 'Request Quote'
    },
    evaluation: {
      title: 'Quick Evaluation',
      subtitle: 'Surface Diagnosis',
      step1Question: 'What type of installation do you require?',
      step1Option1: 'Industrial Floor',
      step1Option2: 'Commercial Use',
      step2Question: 'Current surface condition:',
      step2Option1: 'New Concrete',
      step2Option2: 'Potholes / Cracks',
      step2Option3: 'Has Coating',
      step3Title: 'Analysis completed!',
      step3Desc: 'Based on your answers, you require a technical visit.',
      step3Btn: 'Detail Project'
    },
    strengths: {
      title: 'OUR STRENGTHS',
      subtitle: 'Applied engineering for the protection and restoration of your infrastructure',
      readSection: 'Read section',
      listening: 'Listening...',
      close: 'Close',
      keywords: 'Keywords',
      requirements: 'Requirements'
    },
    sectors: {
      title: 'SECTORS OF ATTENTION',
      subtitle: 'We offer customized solutions for each type of industry and commerce',
      clickToSee: 'Click on a sector to see the details'
    },
    gallery: {
      title: 'OUR WORK & GALLERY',
      subtitle: 'Projects executed with the highest quality standards',
      successStories: 'MCI SUCCESS STORIES',
      initialCondition: 'Initial condition',
      solution: 'MCI Solution',
      errorLoading: 'Error Loading'
    },
    testimonials: {
      title: 'CLIENT TESTIMONIALS',
      subtitle: 'Real reviews from those who trust our experience',
      showMore: 'Show more testimonials',
      showLess: 'Show less testimonials'
    },
    contact: {
      title: 'LET\'S START YOUR PROJECT',
      subtitle: 'Request a quote, technical advice, or visit us at our offices',
      formTitle: 'Contact Form',
      name: 'Full Name',
      email: 'Email Address',
      phone: 'Phone Number',
      company: 'Company / Organization',
      description: 'Project Details',
      nature: 'Project Nature (Optional)',
      natureOptions: {
        comercial: 'Commercial',
        industrial: 'Industrial',
        residencial: 'Residential',
        infraestructura: 'Infrastructure'
      },
      submit: 'Send Message',
      submitting: 'Sending...',
      success: 'Message sent successfully! We will get in touch with you soon.',
      error: 'There was an error sending the message. Please try again.',
      address: 'Office Address',
      addressDetail: 'Av. Industria No. 45, Col. Industrial, Mexico City, Mexico',
      emailLabel: 'Email Address',
      phoneLabel: 'Phone',
      officeHours: 'Office Hours',
      officeHoursDetail: 'Monday to Friday: 9:00 AM - 6:00 PM'
    },
    chat: {
      welcome: 'Hello. I am the MCI Virtual Assistant. How can I help you?',
      placeholder: 'Type your message...',
      reset: 'Reset Chat',
      assistantTitle: 'MCI Assistant',
      assistantStatus: 'Online'
    },
    about: {
      guaranteeResults: 'How We Guarantee Results',
      missionTitle: 'Mission',
      missionText: 'To support our clients in preserving their production assets through the use of applied engineering in polymeric systems that guarantee performance and continuous process operation.',
      visionTitle: 'Vision',
      visionText: 'To become the benchmark technical partner for companies that cannot afford unforeseen failures or operational downtime caused by physical or chemical damage to production assets.',
      propTitle: 'Value Proposition',
      propText: 'MCI does not sell materials; we offer solutions based on the analysis of real working conditions. We identify critical risks that can compromise safety and operations, and design solutions that, executed under strict control, guarantee operational continuity, maximum durability, and real protection of the client’s investment.',
      diffTitle: 'Our Key Differentiators:',
      diffs: [
        'Over 30 years of experience',
        'Immediate 24/7 response',
        'Technical rigor',
        'Comprehensive custom solutions',
        'Proven total quality',
        'Operational responsibility',
        'Long-term protection',
        'Sustainability',
        'After-sales service'
      ],
      moreInfo: 'FOR MORE INFORMATION',
      inviteKnow: 'WE INVITE YOU TO KNOW US',
      discoverMore: 'Discover our methodology, sectors of attention, and success stories that establish us as leaders.',
      regresar: 'Go Back'
    }
  }
};

export interface Strength {
  id: string;
  title: string;
  description: string;
  items: (string | { label: string; subItems: string[] })[];
  image?: string;
  collage?: string[];
  keywords: string[];
}

export const getStrengths = (lang: Language): Strength[] => {
  if (lang === 'en') {
    return [
      {
        id: 'pa1',
        title: 'Flooring for Commercial and Industrial Use',
        description: 'Where process efficiency begins at the base, with high-quality, safe, and aesthetic flooring.',
        keywords: ['Concrete floor installation', 'chemical treatments', 'DPA', 'stained concrete', 'joint sealing', 'toppings', 'lightweight concrete', 'decorative finishes'],
        items: [
          'Concrete floor installation with high standards of precision and finish',
          'Chemical treatments. Surface curing and densification.',
          'Grinding, polishing and burnishing (DPA) up to mirror finish with salt & pepper look',
          'Chemical finishes, acid-stained concrete in a variety of colors and designs',
          {
            label: 'Joint Sealing',
            subItems: [
              'With flexible polyurethane resistant to weathering and UV rays',
              'With semi-rigid epoxies for stable slabs',
              'With fast-curing polyurea for interiors',
              'With chemical-resistant polysulfide'
            ]
          },
          'Surface leveling with toppings to receive engineered wood, laminate, vinyl, solid wood or deck finishes.',
          'Fast-setting lightweight concrete for toppings in buildings',
          'Decorative finishes based on resins and multicolored aggregates'
        ]
      },
      {
        id: 'pa2',
        title: 'HIGH-VALUE EPOXY FLOORS',
        description: 'Where you can play with avant-garde and innovative decoration ideas in a wide range of colors and textures with original, creative and personalized designs.',
        keywords: ['Self-leveling epoxy', 'matte', 'marbled', 'flakes', 'multicolor quartz', 'glossy or satin'],
        items: [
          'Self-leveling epoxy. Easy to clean, completely smooth, in matte tone that hides slab imperfections, ideal for showrooms, hospitals, offices.',
          'Marbled liquid porcelain. With metallic pigment veins to create a marble effect, clouds or depth (3D). Target market is high-end residential.',
          'With plastic or metallic flake aggregates in color blends with smooth or slip-resistant texture frequently applied in spas or other recreational facilities. Perfect balance of aesthetics and functionality.',
          'With multicolored quartz aggregates. High resistance with smooth or slip-resistant texture frequently found in commercial installations.',
          'Glossy or satin self-leveling epoxy. Uniform color and simple clean look, used in industries, warehouses or indoor parking lots.'
        ]
      },
      {
        id: 'pa3',
        title: 'HIGH-END INDUSTRIAL FINISHES',
        description: 'True engineering applied to polymeric materials with high performance and great safety levels.',
        keywords: ['chemical-resistant', 'continuous immersion', 'reinforced', 'bricks and tiles', 'rubberized coatings', 'thermal resistance', 'wet service', 'dry service', 'mechanical resistance', 'physical abuse', 'dielectric', 'conductive', 'anti-static', 'sanitary requirements', 'FDA', 'USDA', 'COFEPRIS', 'SENESICA', 'NSF'],
        items: [
          {
            label: 'Corrosion, as old as civilization.',
            subItems: [
              'From thin coatings for splashes or occasional spills to robust systems for continuous immersion.',
              'Fiberglass reinforced linings, saturated with epoxy, polyester, vinylester, novolac, or hybrid resin.',
              'For extreme chemical and thermal services using anti-acid bricks and tiles set and jointed with chemical-resistant mortar.',
              'Rubberized coatings for trucks, storage tanks, reactors, interconnecting piping and other equipment with services involving simultaneous abrasion, vibration, temperature and chemical environment.'
            ]
          },
          {
            label: 'Finishes with thermal resistance and physical fatigue',
            subItems: [
              'Wet: from freezing temperatures of -40°C to hot spills, including saturated steam cleaning.',
              'Dry: by radial temperature from nearby heat sources under boilers or ovens'
            ]
          },
          {
            label: 'With mechanical resistance',
            subItems: [
              'High-performance coatings on floors exposed to physical abuse by abrasion, dragging, or impact.'
            ]
          },
          {
            label: 'Floor finishes with dielectric properties',
            subItems: [
              'Conductive or dissipative of electrical charges to grounding systems',
              'Anti-static that prevents the accumulation of static electricity.'
            ]
          },
          {
            label: 'With sanitary coatings and easy cleaning',
            subItems: [
              'Coatings that comply with US regulations such as:',
              'Food and Drug Administration (FDA)',
              'Department of Agriculture (USDA)',
              'Mexican entities like:',
              'Federal Commission for the Protection against Sanitary Risks (COFEPRIS)',
              'National Service for Health, Safety and Quality of Agro-Food (SENESICA)',
              'Global independent organizations such as:',
              'National Science Foundation (NSF) dedicated to health, public safety, and environment, specializing in certification, audits, and risk management of materials and products in direct or indirect contact with food and beverages for human consumption.'
            ]
          }
        ]
      },
      {
        id: 'pa4',
        title: 'REPAIR AND MAINTENANCE OF CONCRETE',
        description: 'Where operating conditions are cimented on concrete elements that are always sound and resistant.',
        keywords: ['Patching', 'short shutdown times', 'Re-leveling', 'flatness', 'repair', 'joints', 'cold storage rooms', 'Injection', 'cracks', 'Patching compound', 'Slab stabilization', 'Reinforce', 'structural', 'carbon fiber', 'Plugs', 'leaks'],
        items: [
          'Patching in corridors or critical roadways with short shutdown times',
          'Re-leveling areas with thin overlays using concrete formulated for fast setting of up to 500 kg/cm²',
          'Recovering flatness in floors with cementitious self-levelers',
          'Epoxy mortars for repairing edges in joint cuts between slabs',
          'Regenerating floors of cold storage rooms',
          'Pressurized injection of epoxy adhesive in cracks of floors, walls and structural elements',
          'Epoxy or cementitious patching compound in highly porous or voided concrete',
          'Stabilizing slabs with movement at the passage of forklifts due to base soil failures by injecting fluid mortar as controlled expansion filling',
          'Reinforcing structural concrete using polymers and carbon fiber meshes (silos, bridges, beams and load-bearing columns)',
          'Fast-setting plugs for leaks or active water outputs in cisterns, either by hydrostatic load or by water table level.'
        ]
      },
      {
        id: 'pa5',
        title: 'WATERPROOFING',
        description: 'Where water flow exists through concrete elements with cracking, load segregation, joints, or surface porosity.',
        keywords: ['polyurea', 'Vehicle systems', 'for parking lots', 'potable water cisterns', 'Plugs', 'leaks', 'Prefabricated'],
        items: [
          'Application of polyurea by projection',
          'Vehicle systems on exterior decks (even under cracking conditions) for commercial and institutional parking lots',
          'Crystalline cementitious waterproofing for the interior of potable water cisterns or other concrete and immersion elements',
          'Fast-setting plugs for sealing active water leaks by hydrostatic load or by water table level',
          'Prefabricated, acrylic, thermal (cool roofs) coatings for decks and walls'
        ]
      },
      {
        id: 'pa6',
        title: 'PAINTS AND SPECIAL FINISHES',
        description: 'Positive impact on clients and visitors through care, conservation, cleaning, and safety of their operational areas.',
        keywords: ['epoxy-polyurethane', 'Sanitary finishes', 'walls and ceilings', 'Sanitary coves', 'photoluminescent', 'Paint on rusted equipment', 'Machinery painting', 'piping and structures', 'Non-stick finishes'],
        items: [
          'Epoxy-polyurethane systems as a finish on floors for light services',
          'Smooth, continuous, seamless, and antibacterial sanitary finishes on walls and ceilings',
          'Sanitary coves in junctions between floors, walls, and ceilings for always clean spaces',
          'Photoluminescent signaling for special sites',
          'Paint on rusted equipment even with difficulty for previous cleaning and preparation',
          'Painting machinery with surface contamination by lubricating oils',
          'Painting on piping and structures exposed to vapors',
          'Non-stick finishes with nanotechnology, easy to clean, moisture-repellent, oil-repellent, dirt-accumulation resistant, and anti-mold on walls and elements exposed to weather'
        ]
      },
      {
        id: 'pa7',
        title: 'FIRESTOP SYSTEMS AND PASSIVE PROTECTION',
        description: 'As an additional safety element to protect lives and safeguard facilities because fire is not controlled, it is contained and limited.',
        keywords: ['(intumescent)', 'Sealing of utility penetrations', 'Joint seal'],
        items: [
          'Installation of fire retardants (intumescent)',
          'Sealing of utility penetrations (pipes, cabling lines) through walls and construction joints',
          'Joint sealing at the top of walls and metal roofs'
        ]
      },
      {
        id: 'pa8',
        title: 'Thermal and Acoustic Insulation',
        description: 'As a solution for the control of low temperatures and the improvement of acoustic comfort in commercial and industrial spaces',
        keywords: ['Polyurethane foam', 'thermal insulator', 'noise', 'Bridge expansion joints', 'WABO', 'Precision grouts', 'Settlement', 'machinery', 'Steel equipment manufacturing', 'special equipment', 'Cleaning', 'Chemical and mechanical', 'Linings', 'using steel sheet'],
        items: [
          {
            label: 'Polyurethane foam in various thicknesses',
            subItems: [
              'Lightweight coating (32kg/m³) as a thermal insulator and noise reducer. Applicable on sheet metal covers of roofs or walls of refrigeration rooms.'
            ]
          }
        ]
      }
    ];
  } else {
    // Retornamos las fortalezas originales en español
    return [
      {
        id: 'pa1',
        title: 'Pisos para uso comercial e industrial',
        description: 'Donde la eficiencia del proceso comienza desde la base, con pisos de altos niveles de calidad, seguridad y estética.',
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
        description: 'Donde se puede jugar con ideas de decoración vanguardistas e innovadoras en una amplia gama de colores y texturas con diseños originales, creativos y personalizados.',
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
        description: 'Verdadera ingeniería aplicada en materiales poliméricos con altas prestaciones y gran nivel de seguridad.',
        keywords: ['químico-resistentes', 'inmersión contínua', 'reforzados', 'ladrillos y losetas', 'Recubrimientos ahulados', 'resistencia térmica', 'En húmedo', 'En seco', 'resistencia mecánica', 'abuso físico', 'dieléctricas', 'Conductivos', 'Antiestáticos', 'requerimientos sanitarios', '(FDA)', '(USDA)', '(COFEPRIS)', '(SENESICA)', '(NSF)'],
        items: [
          {
            label: 'Corrosión, tan antigua como la civilización.',
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
              'Recubrimientos que cumplen con regulaciones estadounidense como la:',
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
        description: 'Donde las condiciones de operación están cimentadas en elementos de concreto siempre sano y resistente.',
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
        description: 'Donde existe flujo de agua a través de elementos de concreto con agrietamientos, segregación de cargas, juntas o porosidad en la superficie.',
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
        description: 'Impacto positivo en clientes y visitantes a través del cuidado, conservación, limpieza y seguridad de sus áreas operativas.',
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
        description: 'Como elemento de seguridad adicional para proteger vidas y salvaguardar instalaciones porque el fuego no se controla, se contiene y se limita.',
        keywords: ['(intumescentes)', 'Sellado de pasos de instalaciones', 'Sello de juntas'],
        items: [
          'Instalación de retardantes de fuego (intumescentes)',
          'Sellado de pasos de instalaciones (tubería, líneas de cableado) a través de muros y juntas de construcción',
          'Sello de juntas en el remate de muros y techos metálicos'
        ]
      },
      {
        id: 'pa8',
        title: 'Aislamiento Térmico y Acústico',
        description: 'Cómo solución para el control de bajas temperaturas y el mejoramiento del confort acústico en espacios comerciales e industriales',
        keywords: ['Espuma de poliuretano', 'aislante térmico', 'ruido', 'Juntas de expansión en puentes', 'WABO', 'Grouts de precisión', 'Asentamiento', 'maquinaria', 'Fabricación de equipos de acero', 'equipos especiales', 'Limpieza', 'Química y mecánica', 'Linnings', 'usando lámina de acero'],
        items: [
          {
            label: 'Espuma de poliuretano en diversos espesores',
            subItems: [
              'Recubrimiento ligero (32kg/m³) como aislante térmico y como reductor de ruido. Aplicable en cubiertas de lámina de techumbres o bien, para muros de cuartos de refrigeración.'
            ]
          }
        ]
      }
    ];
  }
};

export interface Sector {
  id: string;
  title: string;
  description: string;
  details?: {
    groups: { title: string; items: string[] }[];
  };
}

export const getSectors = (lang: Language): Sector[] => {
  if (lang === 'en') {
    return [
      {
        id: 's1',
        title: 'Food Industry & Healthcare Sector',
        description: 'Materials in compliance with FDA, USDA (US), COFEPRIS, and SENASICA (Mexico) regulations.',
        details: {
          groups: [
            {
              title: 'Food industry',
              items: ['Meat & poultry', 'Vegetable packing', 'Fruit packaging', 'Oil production', 'Dairy & derivatives', 'Baking & pastry', 'Sweets & chocolates', 'Sugar mills', 'Alcoholic beverages', 'Soft drinks, water & juices', 'Coffee industry']
            },
            {
              title: 'Healthcare industry',
              items: ['Clinics & hospitals', 'Clinical laboratories', 'Pharmaceutical industry', 'Cosmetics & personal care', 'Industrial biotechnology', 'Surgical materials & accessories']
            }
          ]
        }
      },
      {
        id: 's2',
        title: 'Construction Industry',
        description: 'Infrastructure works with installation of specialized equipment.',
        details: {
          groups: [
            {
              title: 'Services',
              items: ['Concrete floor installation', 'Concrete repair & maintenance', 'Joint sealing', 'Decorative finishes', 'Waterproofing', 'High-end industrial finishes']
            }
          ]
        }
      },
      {
        id: 's3',
        title: 'Commercial Facilities & Recreation',
        description: 'Where the brand image is designed to positively impact clients and visitors.',
        details: {
          groups: [
            {
              title: 'Recreation & leisure',
              items: ['Hotels & Spas', 'Restaurants', 'Bars, cafes', 'Cinemas & theaters', 'Theme parks', 'Casinos', 'Spas & pools', 'Sports clubs']
            },
            {
              title: 'Retail Business',
              items: ['Department stores', 'Supermarkets', 'Distribution centers', 'Warehouses', 'Wholesale markets', 'Courier & shipping', 'Specialty stores']
            }
          ]
        }
      },
      {
        id: 's4',
        title: 'Consumer Goods Industry',
        description: 'Production asset protection to guarantee high inventory turnover.',
        details: {
          groups: [
            {
              title: 'Sectors',
              items: ['Plastic & recycling industry', 'Automotive & suppliers', 'IT, software & telecom', 'Electrical & electronic equipment', 'Home appliances', 'Textiles, leather & footwear', 'Graphic arts', 'Cleaning products', 'Gas stations & workshops', 'Paper industry', 'Food & beverages']
            }
          ]
        }
      },
      {
        id: 's5',
        title: 'Heavy Industry',
        description: 'Operational protection with high-end polymers for severe wear.',
        details: {
          groups: [
            {
              title: 'Sectors',
              items: ['Mining', 'Chemicals', 'Petrochemicals', 'Cement industry', 'Metalworking', 'Power generation', 'Metal recovery & refining']
            }
          ]
        }
      },
      {
        id: 's6',
        title: 'Storage & Logistics',
        description: 'Efficiency from the ground up with high safety and quality floors.',
        details: {
          groups: [
            {
              title: 'Infrastructure',
              items: ['Distribution centers', 'Product handling warehouses', 'Perishable goods storage', 'Static charge-free facilities', 'Medicine storage']
            }
          ]
        }
      }
    ];
  } else {
    return [
      {
        id: 's1',
        title: 'Industria Alimenticia y Sector Salud',
        description: 'Materiales en cumplimiento con regulaciones de la FDA, USDA (EEUU), y COFEPRIS, SENASICA (Méx).',
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
  }
};

export const getProjectCategories = (lang: Language) => {
  if (lang === 'en') {
    return [
      { id: 'pisos-comerciales', title: 'Flooring for Commercial & Industrial Use' },
      { id: 'pisos-epoxicos', title: 'Epoxy Floors' },
      { id: 'acabados-alta-gama', title: 'High-end Industrial Finishes' },
      { id: 'reparacion-concreto', title: 'Concrete Repair & Maintenance' },
      { id: 'impermeabilizacion', title: 'Waterproofing' },
      { id: 'pinturas-especiales', title: 'Special Paints' },
      { id: 'sistema-cortafuegos', title: 'Firestop Systems' },
      { id: 'aislamiento', title: 'Thermal & Acoustic Insulation' }
    ];
  } else {
    return [
      { id: 'pisos-comerciales', title: 'Pisos para uso comercial e industrial' },
      { id: 'pisos-epoxicos', title: 'Pisos Epóxicos' },
      { id: 'acabados-alta-gama', title: 'Acabados industriales de Alta Gama' },
      { id: 'reparacion-concreto', title: 'Reparación y mantenimiento de concreto' },
      { id: 'impermeabilizacion', title: 'Impermeabilización' },
      { id: 'pinturas-especiales', title: 'Pinturas especiales' },
      { id: 'sistema-cortafuegos', title: 'Sistema Cortafuegos' },
      { id: 'aislamiento', title: 'Aislamiento Térmico y Acústico' }
    ];
  }
};

export const getTestimonials = (lang: Language) => {
  if (lang === 'en') {
    return [
      {
        name: "Ing. Juan Ramón Ríos Serratos",
        cargo: "Superintendent of Works",
        company: "Trena SA de CV",
        giro: "Construction",
        text: "We frequently rely on them for the application of floor coatings in food areas at Walmart chain stores, joint sealing, water storage tanks, or waterproofing. They have also helped us out of tight spots with complex concrete repairs. They are highly reliable.",
        rating: 5
      },
      {
        name: "Ing. Manuel Marín",
        cargo: "Execution Manager",
        company: "Tensa Construcciones SA de CV",
        giro: "Construction",
        text: "We make a great team with these guys. They attend from the very beginning of the project, providing suggestions and ideas that favor the smooth development of the construction work.",
        rating: 5
      },
      {
        name: "Ing. Octavio Montiel Padrón",
        cargo: "Project Manager",
        company: "Integra, Instalación y Construcción SAPI de CV",
        giro: "Construction",
        text: "MCI is a company we have known for years. They are always available whenever required.",
        rating: 5
      },
      {
        name: "Ing. Maximiliano Plata Monroy",
        cargo: "Maintenance Manager",
        company: "Pepsico de México SA de CV",
        giro: "Food & Beverage",
        text: "For years they served us with high-performance materials in areas with special requirements, production areas, filling areas, and in the warehouse. Although the plant's usage has now changed, they continue to support us with floor maintenance.",
        rating: 5
      },
      {
        name: "Ing. Juan Carlos Delgado González",
        cargo: "General Superintendent of Operations",
        company: "Cobre de Pastejé SA de CV",
        giro: "Chemical Industry",
        text: "Due to our operation, there are constant runoffs of sulfuric acid electrolyte to the plant's basement. Occasionally, operators drop the steel crowbars used to remove the copper starting sheet. This damages the coatings, so they must be repaired immediately. They took the responsibility of permanently monitoring and repairing as needed. With our company's growth, they supported us with the installation of chemical spill containment systems. They completely took away our worries and helped ensure the smooth operation of our plant.",
        rating: 5
      },
      {
        name: "Ing. Luis Segundo Eligio",
        cargo: "Maintenance Chief",
        company: "Clevite de México SA de CV",
        giro: "Automotive Parts Manufacturing",
        text: "Our operation requires continuity. Scheduled shutdowns are only a matter of hours. With MCI, we found prompt turnaround in the maintenance of tanks and facilities requiring chemical protection.",
        rating: 5
      },
      {
        name: "Ing. Alfonso Alvarado",
        cargo: "Project Chief",
        company: "Embotelladora de Toluca SA de CV",
        giro: "Food & Beverage",
        text: "They helped us solve flooring issues in our plant using specialized materials.",
        rating: 5
      },
      {
        name: "Ing. Ricardo Flores",
        cargo: "Project Chief",
        company: "Sepromexsa",
        giro: "Industrial Maintenance & Construction",
        text: "A long-time collaborator of ours for many years on new projects and remodeling works across the Grupo IUSA companies.",
        rating: 5
      },
      {
        name: "Lic. Yazmin Nieto Tapia",
        cargo: "Purchasing Chief",
        company: "Names IT Solutions SA de CV",
        giro: "Electronics",
        text: "We turn to them whenever our clients request special high-aesthetic finishes for floors where our equipment will be installed, such as antistatic finishes or conductive floors.",
        rating: 5
      },
      {
        name: "Ing. Enrique Ramos Narváez",
        cargo: "General Manager",
        company: "Reprotek Ram SA de CV",
        giro: "Industrial Services",
        text: "Experienced team with whom we collaborate on product installations in new areas, primarily in the Bajío region. Companies like Procter & Gamble, Kimberly-Clark, or DeACERO are our main joint projects.",
        rating: 5
      },
      {
        name: "Lic. Juan Carlos Balmaceda",
        cargo: "Director",
        company: "Cajaplax SA de CV",
        giro: "Plastic Packaging Manufacturing",
        text: "We are beginning operations with this company to set up a controlled environment cleanroom. The service is cordial, direct, and backed by strong technical support.",
        rating: 5
      },
      {
        name: "Ing. Enrique Sobrevilla",
        cargo: "Plant Manager",
        company: "Cobre de Pastejé SA de CV",
        giro: "Chemical Industry",
        text: "\"Saint Esiquio\"—that's what we call our MCI contact, because he graduated from ESIQIE-IPN like us, and because he always rescues us when we have plant issues.",
        rating: 5
      }
    ];
  } else {
    return [
      {
        name: "Ing. Juan Ramón Ríos Serratos",
        cargo: "Superintendente de Obra",
        company: "Trena SA de CV",
        giro: "Construcción",
        text: "Nos apoyamos frecuentemente con ellos en lo que respecta a la aplicación de recubrimientos en pisos de las áreas de alimentos en tiendas de la cadena WalMart, sello de juntas, tanques de almacenamiento de agua o impermeabilizaciones. También nos han sacado de apuros con reparaciones de concreto complicadas. Son muy confiables.",
        rating: 5
      },
      {
        name: "Ing. Manuel Marín",
        cargo: "Gerente de Ejecuciones",
        company: "Tensa Construcciones SA de CV",
        giro: "Construcción",
        text: "Se hace un gran equipo con estos muchachos. Atienden desde el inicio del proyecto aportando sugerencias e ideas que favorecerán en su momento en el buen desarrollo de la obra.",
        rating: 5
      },
      {
        name: "Ing. Octavio Montiel Padrón",
        cargo: "Gerente de Proyectos",
        company: "Integra, Instalación y Construcción SAPI de CV",
        giro: "Construcción",
        text: "MCI es una empresa que conocemos de años. Siempre disponible cuando se requiere.",
        rating: 5
      },
      {
        name: "Ing. Maximiliano Plata Monroy",
        cargo: "Gerente de Mantenimiento",
        company: "Pepsico de México SA de CV",
        giro: "Alimenticio",
        text: "Durante años nos dieron servicio con materiales de buenas características en áreas con requerimientos especiales, áreas de producción, de llenado y en el almacén. Ahora la planta ha cambiado de uso pero continúan con nosotros en el mantenimiento de los pisos.",
        rating: 5
      },
      {
        name: "Ing. Juan Carlos Delgado González",
        cargo: "Superintendente General de Operaciones",
        company: "Cobre de Pastejé SA de CV",
        giro: "Industria Química",
        text: "Por la operación que tenemos, existen escurrimientos constantes de electrolíto de ácido sulfúrico hacia el sótano de la planta. En ocasiones a los operadores se les caen las barretas de acero con las que se retira la hoja iniciadora de cobre. Esto daña los recubrimientos por lo que hay que atender de inmediato. Ellos tomaron la responsabilidad de estar permanentemente vigilando y reparando cuando se necesitara. Con el crecimiento de la empresa, nos atendieron con la instalación de materiales para derrames químicos. Vinieron a quitarnos preocupaciones y coadyuvaron en el buen funcionamiento de la planta.",
        rating: 5
      },
      {
        name: "Ing. Luis Segundo Eligio",
        cargo: "Jefe de Mantenimiento",
        company: "Clevite de México SA de CV",
        giro: "Fabricación de piezas automotrices",
        text: "Nuestra operación requiere continuidad. Los paros programados son apenas de horas. Con MCI encontramos prontitud en el mantenimiento de las tinas e instalaciones que requieren protección química.",
        rating: 5
      },
      {
        name: "Ing. Alfonso Alvarado",
        cargo: "Jefe de Proyectos",
        company: "Embotelladora de Toluca SA de CV",
        giro: "Alimenticio",
        text: "Nos ayudaron a resolver problemas en los pisos de la planta con materiales especiales.",
        rating: 5
      },
      {
        name: "Ing. Ricardo Flores",
        cargo: "Jefe de Proyectos",
        company: "Sepromexsa",
        giro: "Mantenimiento y Construcciones Industriales",
        text: "Por muchos años colaborador nuestro en proyectos nuevos y de remodelación de las empresas de Grupo IUSA.",
        rating: 5
      },
      {
        name: "Lic. Yazmin Nieto Tapia",
        cargo: "Jefe de Compras",
        company: "Names IT Solutions SA de CV",
        giro: "Electrónica",
        text: "Recurrimos a estas personas cuando nuestros clientes solicitan acabados especiales, con buena imagen, en los pisos donde van a instalar nuestros equipos como pueden ser acabados antiestáticos o pisos conductivos.",
        rating: 5
      },
      {
        name: "Ing. Enrique Ramos Narváez",
        cargo: "Gerente General",
        company: "Reprotek Ram SA de CV",
        giro: "Servicios Industriales",
        text: "Gente experimentada con la cual colaboramos en proyectos de instalación de productos en áreas nuevas básicamente en la región bajío. Empresas como Procter and Gamble, Kimberly Clark o De´Acero nuestras principales participaciones.",
        rating: 5
      },
      {
        name: "Lic. Juan Carlos Balmaceda",
        cargo: "Director",
        company: "Cajaplax SA de CV",
        giro: "Fabricación de envases de plástico",
        text: "Estamos iniciando actividades con esta empresa con la habilitación de un cuarto de ambiente controlado. El trato es cordial, directo y con buen apoyo técnico.",
        rating: 5
      },
      {
        name: "Ing. Enrique Sobrevilla",
        cargo: "Gerente de Planta",
        company: "Cobre de Pastejé SA de CV",
        giro: "Industria Química",
        text: "San Esiquio; así le decimos a nuestro contacto de MCI, porque es egresado de la ESIQIE del IPN como nosotros y porque siempre nos ayuda con los problemas de la planta.",
        rating: 5
      }
    ];
  }
};
