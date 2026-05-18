import https from 'https';
import fs from 'fs';
import path from 'path';

const postimg_urls = [
  'https://i.postimg.cc/q6XH5ShJ/IMG-20260515-WA0004.jpg',
  'https://i.postimg.cc/QKkZyw9M/IMG-20260515-WA0005.jpg',
  'https://i.postimg.cc/2LFNKMbm/IMG-20260515-WA0006.jpg',
  'https://i.postimg.cc/q6XH5Stw/IMG-20260515-WA0007.jpg',
  'https://i.postimg.cc/1Vc1j2nR/IMG-20260515-WA0008.jpg',
  'https://i.postimg.cc/p5YM6490/IMG-20260515-WA0009.jpg',
  'https://i.postimg.cc/PvznR9LK/IMG-20260515-WA0010.jpg',
  'https://i.postimg.cc/wRddFgBG/IMG-20260515-WA0011.jpg',
  'https://i.postimg.cc/V0cc4mN9/IMG-20260515-WA0012.jpg',
  'https://i.postimg.cc/4HTTws37/IMG-20260515-WA0013.jpg',
  'https://i.postimg.cc/CnVVJSKR/IMG-20260515-WA0014.jpg',
  'https://i.postimg.cc/vgnsWcG5/IMG-20260515-WA0015.jpg',
  'https://i.postimg.cc/7Gzkgfq4/IMG-20260515-WA0016.jpg',
  'https://i.postimg.cc/Vrt8jdzc/IMG-20260515-WA0017.jpg',
  'https://i.postimg.cc/R6tBcNvv/IMG-20260515-WA0018.jpg',
  'https://i.postimg.cc/gXhWvnGW/IMG-20260515-WA0019.jpg'
];

if (!fs.existsSync('public/projects')) {
  fs.mkdirSync('public/projects', { recursive: true });
}

async function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode !== 200) {
        console.error(`Failed: ${url} - ${res.statusCode}`);
        reject();
        return;
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

(async () => {
  for (const url of postimg_urls) {
    const filename = path.basename(url);
    await download(url, path.join('public/projects', filename));
    console.log(`Downloaded ${filename}`);
  }
})();
