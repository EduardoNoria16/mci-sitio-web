import * as fflate from 'fflate';
import fs from 'fs';
import path from 'path';

const file = fs.readFileSync('public/codigo-polycovers.zip');
const unzipped = fflate.unzipSync(file);

const files = Object.keys(unzipped);
console.log('Files in zip:', files);

for (const [filename, data] of Object.entries(unzipped)) {
  if (data.length === 0) {
    fs.mkdirSync(path.join('public/projects', filename), { recursive: true });
  } else {
    fs.mkdirSync(path.dirname(path.join('public/projects', filename)), { recursive: true });
    fs.writeFileSync(path.join('public/projects', filename), data);
  }
}
console.log('Extracted successfully!');
