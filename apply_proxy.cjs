const fs = require('fs');

// Fix App.tsx
let appStr = fs.readFileSync('src/App.tsx.backup', 'utf8');
appStr = appStr.replace(/https:\/\/images2\.imgbox\.com\/([a-zA-Z0-9_\-\.\/]+)/g, "https://wsrv.nl/?url=images2.imgbox.com/$1");
fs.writeFileSync('src/App.tsx', appStr);

// Fix ProjectGallery.tsx
// wait, ProjectGallery was never backed up so we must read its current content and replace projects URLs back.
// actually let's reconstruct it.
const gallery_orig = `import { PROJECT_B64 } from '../data/imagesBase64';\nexport const GALLERY_IMAGES = []`;
// wait, the easiest is to just use npx node to match and replace the `url: '/projects/IMG...'` with proxy.

let pGalStr = fs.readFileSync('src/components/ProjectGallery.tsx', 'utf8');
// remove the PROJECT_B64 import if it has it
pGalStr = pGalStr.replace(/import\s+\{\s*PROJECT_B64\s*\}\s*from\s*\'\.\.\/data\/imagesBase64\'\s*;\n/, '');

// The postimg URLs:
const postimg_files = [
  { url: 'https://i.postimg.cc/q6XH5ShJ/IMG-20260515-WA0004.jpg', fn: 'IMG-20260515-WA0004.jpg' },
  { url: 'https://i.postimg.cc/QKkZyw9M/IMG-20260515-WA0005.jpg', fn: 'IMG-20260515-WA0005.jpg' },
  { url: 'https://i.postimg.cc/2LFNKMbm/IMG-20260515-WA0006.jpg', fn: 'IMG-20260515-WA0006.jpg' },
  { url: 'https://i.postimg.cc/q6XH5Stw/IMG-20260515-WA0007.jpg', fn: 'IMG-20260515-WA0007.jpg' },
  { url: 'https://i.postimg.cc/1Vc1j2nR/IMG-20260515-WA0008.jpg', fn: 'IMG-20260515-WA0008.jpg' },
  { url: 'https://i.postimg.cc/p5YM6490/IMG-20260515-WA0009.jpg', fn: 'IMG-20260515-WA0009.jpg' },
  { url: 'https://i.postimg.cc/PvznR9LK/IMG-20260515-WA0010.jpg', fn: 'IMG-20260515-WA0010.jpg' },
  { url: 'https://i.postimg.cc/wRddFgBG/IMG-20260515-WA0011.jpg', fn: 'IMG-20260515-WA0011.jpg' },
  { url: 'https://i.postimg.cc/V0cc4mN9/IMG-20260515-WA0012.jpg', fn: 'IMG-20260515-WA0012.jpg' },
  { url: 'https://i.postimg.cc/4HTTws37/IMG-20260515-WA0013.jpg', fn: 'IMG-20260515-WA0013.jpg' },
  { url: 'https://i.postimg.cc/CnVVJSKR/IMG-20260515-WA0014.jpg', fn: 'IMG-20260515-WA0014.jpg' },
  { url: 'https://i.postimg.cc/vgnsWcG5/IMG-20260515-WA0015.jpg', fn: 'IMG-20260515-WA0015.jpg' },
  { url: 'https://i.postimg.cc/7Gzkgfq4/IMG-20260515-WA0016.jpg', fn: 'IMG-20260515-WA0016.jpg' },
  { url: 'https://i.postimg.cc/Vrt8jdzc/IMG-20260515-WA0017.jpg', fn: 'IMG-20260515-WA0017.jpg' },
  { url: 'https://i.postimg.cc/R6tBcNvv/IMG-20260515-WA0018.jpg', fn: 'IMG-20260515-WA0018.jpg' },
  { url: 'https://i.postimg.cc/gXhWvnGW/IMG-20260515-WA0019.jpg', fn: 'IMG-20260515-WA0019.jpg' }
];

for(const p of postimg_files) {
    pGalStr = pGalStr.replace("'/projects/" + p.fn + "'", "'https://wsrv.nl/?url=" + p.url.replace('https://', '') + "'");
    // Also if the project has the normal URL still for some reason, replace it
    pGalStr = pGalStr.replace("'" + p.url + "'", "'https://wsrv.nl/?url=" + p.url.replace('https://', '') + "'");
}

fs.writeFileSync('src/components/ProjectGallery.tsx', pGalStr);

console.log('App.tsx and ProjectGallery.tsx updated with wsrv.nl CDN urls!');
