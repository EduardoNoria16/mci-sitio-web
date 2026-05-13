import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. the Dynamic Background Elements:
const mobileNavRegex = /\{\/\* Unified Mobile Menu Overlay[\s\S]*?<\/AnimatePresence>/;

content = content.replace(mobileNavRegex, '');

fs.writeFileSync('src/App.tsx', content);
console.log('Fixed mobile nav');
