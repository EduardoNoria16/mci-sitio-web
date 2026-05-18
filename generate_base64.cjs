const fs = require('fs');
const path = require('path');

let out = `// Generated base64 images\n\n`;

function toBase64(filePath) {
  const data = fs.readFileSync(filePath);
  const ext = path.extname(filePath).toLowerCase();
  let mime = 'image/jpeg';
  if (ext === '.png') mime = 'image/png';
  if (ext === '.webp') mime = 'image/webp';
  return `data:${mime};base64,${data.toString('base64')}`;
}

out += `export const BEFORE_AFTER_B64: Record<string, string> = {\n`;
const baFiles = fs.readdirSync('public/before-after').filter(f => f.match(/\.(jpe?g|png|webp)$/i));
for(const f of baFiles) {
  out += `  '${f}': '${toBase64(path.join('public/before-after', f))}',\n`;
}
out += `};\n\n`;

out += `export const PROJECT_B64: Record<string, string> = {\n`;
const prFiles = fs.readdirSync('public/projects').filter(f => f.match(/\.(jpe?g|png|webp)$/i));
for(const f of prFiles) {
  out += `  '${f}': '${toBase64(path.join('public/projects', f))}',\n`;
}
out += `};\n`;

fs.writeFileSync('src/data/imagesBase64.ts', out);
console.log('done writing src/data/imagesBase64.ts, size:', fs.statSync('src/data/imagesBase64.ts').size);
