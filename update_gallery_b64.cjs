const fs = require('fs');

let t = fs.readFileSync('src/components/ProjectGallery.tsx', 'utf8');

if(!t.includes('PROJECT_B64')) {
    t = "import { PROJECT_B64 } from '../data/imagesBase64';\n" + t;
}

// Previously we replaced the local projects URLs with postimg links!
// Let me just replace the postimg links with B64 lookups!
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
    t = t.replace(p.url, `'+PROJECT_B64['${p.fn}']+'`);
}

fs.writeFileSync('src/components/ProjectGallery.tsx', t);
console.log('ProjectGallery.tsx updated');
