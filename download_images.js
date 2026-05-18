import https from 'https';
import fs from 'fs';
import path from 'path';

const imgbox_urls = [
  'https://images2.imgbox.com/af/5e/wsIEHA08_o.jpg',
  'https://images2.imgbox.com/8c/e2/dancwYF1_o.jpg',
  'https://images2.imgbox.com/e2/b1/jFHrF04P_o.jpg',
  'https://images2.imgbox.com/dc/78/Vdt4qzQ3_o.jpg',
  'https://images2.imgbox.com/40/7c/VIDPBh84_o.jpg',
  'https://images2.imgbox.com/7d/5d/Ewf4uEcE_o.jpg',
  'https://images2.imgbox.com/e4/b6/fjT1RFET_o.jpg',
  'https://images2.imgbox.com/fc/04/Z4NXVOoQ_o.jpg',
  'https://images2.imgbox.com/39/54/Id0Pii6t_o.jpg',
  'https://images2.imgbox.com/ff/2b/2toaJPpW_o.jpg',
  'https://images2.imgbox.com/8e/bc/6xiopQMz_o.jpeg',
  'https://images2.imgbox.com/37/1e/QP6E8I7q_o.jpeg',
  'https://images2.imgbox.com/a3/7e/kf0mogLt_o.jpeg',
  'https://images2.imgbox.com/2f/5b/Q0GbGWpl_o.jpeg',
  'https://images2.imgbox.com/4d/f6/M6Qrnsfl_o.jpeg',
  'https://images2.imgbox.com/50/29/3D2Zh5mJ_o.jpg',
  'https://images2.imgbox.com/e9/db/BjTHRJDu_o.jpeg',
  'https://images2.imgbox.com/31/ec/jJ2i1pBZ_o.jpeg',
  'https://images2.imgbox.com/fa/7d/TDea6Iwx_o.jpeg',
  'https://images2.imgbox.com/fa/e6/FBvq9fDK_o.jpeg',
  'https://images2.imgbox.com/14/64/JH5fSihJ_o.jpeg',
  'https://images2.imgbox.com/62/aa/FvTTrvLo_o.jpeg',
  'https://images2.imgbox.com/e1/ce/mJMEDX1z_o.jpeg',
  'https://images2.imgbox.com/07/92/bbEi5xTg_o.jpeg',
  'https://images2.imgbox.com/31/da/J2vpLZYD_o.jpeg',
  'https://images2.imgbox.com/b8/b0/JfWJnP14_o.jpeg',
  'https://images2.imgbox.com/8a/ca/fAv1c6kg_o.jpeg',
  'https://images2.imgbox.com/d4/86/zKFPhqMi_o.jpeg',
  'https://images2.imgbox.com/7d/6d/qB1LdmEE_o.jpeg',
  'https://images2.imgbox.com/a1/4f/iPc1dSbL_o.jpeg',
  'https://images2.imgbox.com/e0/c8/WzvkrASE_o.jpeg',
  'https://images2.imgbox.com/03/79/1zmZdpVx_o.jpeg',
  'https://images2.imgbox.com/5a/d4/TPmWyNy6_o.jpeg'
];

if (!fs.existsSync('public/before-after')) {
  fs.mkdirSync('public/before-after', { recursive: true });
}

async function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://imgbox.com/' } }, (res) => {
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
  for (const url of imgbox_urls) {
    const filename = path.basename(url);
    await download(url, path.join('public/before-after', filename));
    console.log(`Downloaded ${filename}`);
  }
})();
