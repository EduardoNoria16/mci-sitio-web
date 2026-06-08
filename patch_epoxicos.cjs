const fs = require('fs');
let content = fs.readFileSync('src/components/ProjectGallery.tsx', 'utf8');

const regex = /'pisos-epoxicos': \[\s*([\s\S]*?)\s*\],/m;

const newLinks = [
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

const replacement = "'pisos-epoxicos': [\n    " + newLinks.map(link => `'${link}',`).join('\n    ') + "\n  ],";

content = content.replace(regex, replacement);

fs.writeFileSync('src/components/ProjectGallery.tsx', content);
