const fs = require('fs');
let content = fs.readFileSync('src/components/ProjectGallery.tsx', 'utf8');

const impermeabilizacionOld = [
    'https://i.ibb.co/0RNmfQns/9.webp',
    'https://i.ibb.co/pvp2trW3/8.webp',
    'https://i.ibb.co/35Rq2ScH/7.webp',
    'https://i.ibb.co/CpRF4Rd6/6.webp',
    'https://i.ibb.co/7JZHz93R/5.webp',
    'https://i.ibb.co/0yKJGZCt/4.webp',
    'https://i.ibb.co/6cS8swG4/3.webp',
    'https://i.ibb.co/jpP5Zm5/2.webp',
    'https://i.ibb.co/MkFXfB5n/1.webp',
];

const impermeabilizacionNew = [
  'https://i.ibb.co/27PXM0mQ/IMG-20260608-125912.webp',
  'https://i.ibb.co/b5GVpjBN/IMG-20260608-130020.webp',
  'https://i.ibb.co/RwK5fDx/IMG-20260608-130042.webp',
  'https://i.ibb.co/9m6vn4PM/IMG-20260608-130100.webp',
  'https://i.ibb.co/cSq5y0cQ/IMG-20260608-130118.webp',
  'https://i.ibb.co/nNWtKx6g/IMG-20260608-130137.webp',
  'https://i.ibb.co/CpXWpcnW/IMG-20260608-130156.webp',
  'https://i.ibb.co/xqTjk7sj/IMG-20260608-130215.webp'
];

const epoxicosOld = [
    'https://i.ibb.co/1GC1X7dw/1.webp',
    'https://i.ibb.co/NdSJ4jQ2/2.webp',
    'https://i.ibb.co/KprXnzG6/3.webp',
    'https://i.ibb.co/k6D5Y3Ff/4.webp',
    'https://i.ibb.co/VWZ1r2mL/5.webp',
    'https://i.ibb.co/8LWgjfq5/6.webp',
    'https://i.ibb.co/xLM65c71/10.webp',
    'https://i.ibb.co/wNXx0jCq/11.webp',
    'https://i.ibb.co/QFG1L8k5/12.webp',
    'https://i.ibb.co/FkV66PTr/13.webp',
    'https://i.ibb.co/4n1Bktf7/14.webp',
    'https://i.ibb.co/jPnZ21XQ/15.webp',
    'https://i.ibb.co/PztkVQ09/16.webp',
    'https://i.ibb.co/S4JtG4ZJ/17.webp',
    'https://i.ibb.co/RkT2j2n2/18.webp',
    'https://i.ibb.co/CsHMjMXD/19.webp',
    'https://i.ibb.co/FbKpdtpK/20.webp',
    'https://i.ibb.co/TDPsyt5x/21.webp',
    'https://i.ibb.co/Kzc2RG1K/22.webp',
    'https://i.ibb.co/p6GSWHBp/23.webp',
    'https://i.ibb.co/NdGkCC4t/24.webp',
    'https://i.ibb.co/cKL202G3/25.webp',
    'https://i.ibb.co/9kVrm9gm/26.webp',
    'https://i.ibb.co/jP0pZtvc/27.webp',
];

const epoxicosNew = [
  'https://i.ibb.co/0RsswmcM/IMG-20260608-114931.webp',
  'https://i.ibb.co/TBbvFzP5/IMG-20260608-115239.webp',
  'https://i.ibb.co/bg0K4g5h/IMG-20260608-115257.webp',
  'https://i.ibb.co/0Rdc2ry9/IMG-20260608-115330.webp',
  'https://i.ibb.co/xtnmmPbD/IMG-20260608-115351.webp',
  'https://i.ibb.co/Q7TvTbCx/IMG-20260608-115415.webp',
  'https://i.ibb.co/TDYzzXVN/IMG-20260608-115434.webp',
  'https://i.ibb.co/6722wkYP/IMG-20260608-115511.webp',
  'https://i.ibb.co/SXWddC4j/IMG-20260608-115532.webp',
  'https://i.ibb.co/bRN7mBJK/IMG-20260608-115551.webp',
  'https://i.ibb.co/39Dk7yFQ/IMG-20260608-115616.webp',
  'https://i.ibb.co/WW4mx3gb/IMG-20260608-115648.webp',
  'https://i.ibb.co/nMD6VxpR/IMG-20260608-115707.webp'
];

const altaGamaOld = [
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
];

const altaGamaNew = [
  'https://i.ibb.co/p60rB0jV/IMG-20260608-131711.webp',
  'https://i.ibb.co/PGPmGv7M/IMG-20260608-131818.webp',
  'https://i.ibb.co/Cp1trKxY/IMG-20260608-131837.webp',
];

const impermeabilizacionCombined = [...impermeabilizacionOld, ...impermeabilizacionNew];
const epoxicosCombined = [...epoxicosOld, ...epoxicosNew];
const altaGamaCombined = [...altaGamaOld, ...altaGamaNew];

const regexImp = /'impermeabilizacion': \[\s*([\s\S]*?)\s*\],/m;
const regexEpo = /'pisos-epoxicos': \[\s*([\s\S]*?)\s*\],/m;
const regexAlta = /'acabados-alta-gama': \[\s*([\s\S]*?)\s*\],/m;

content = content.replace(regexImp, "'impermeabilizacion': [\n    " + impermeabilizacionCombined.map(link => `'${link}',`).join('\n    ') + "\n  ],");
content = content.replace(regexEpo, "'pisos-epoxicos': [\n    " + epoxicosCombined.map(link => `'${link}',`).join('\n    ') + "\n  ],");
content = content.replace(regexAlta, "'acabados-alta-gama': [\n    " + altaGamaCombined.map(link => `'${link}',`).join('\n    ') + "\n  ],");

fs.writeFileSync('src/components/ProjectGallery.tsx', content);
