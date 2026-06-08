const fs = require('fs');
let content = fs.readFileSync('src/components/ProjectGallery.tsx', 'utf8');

const regex = /'impermeabilizacion': \[\s*([\s\S]*?)\s*\],/m;

const newLinks = [
  'https://i.ibb.co/27PXM0mQ/IMG-20260608-125912.webp',
  'https://i.ibb.co/b5GVpjBN/IMG-20260608-130020.webp',
  'https://i.ibb.co/RwK5fDx/IMG-20260608-130042.webp',
  'https://i.ibb.co/9m6vn4PM/IMG-20260608-130100.webp',
  'https://i.ibb.co/cSq5y0cQ/IMG-20260608-130118.webp',
  'https://i.ibb.co/nNWtKx6g/IMG-20260608-130137.webp',
  'https://i.ibb.co/CpXWpcnW/IMG-20260608-130156.webp',
  'https://i.ibb.co/xqTjk7sj/IMG-20260608-130215.webp'
];

const replacement = "'impermeabilizacion': [\n    " + newLinks.map(link => `'${link}',`).join('\n    ') + "\n  ],";

content = content.replace(regex, replacement);

fs.writeFileSync('src/components/ProjectGallery.tsx', content);
