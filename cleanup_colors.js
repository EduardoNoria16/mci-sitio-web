import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Fix double borders
content = content.replace(/border border-white\/5 border border-white\/10/g, 'border border-white/10');
content = content.replace(/bg-white\/5 border border-white\/10 backdrop-blur-md/g, 'bg-white/5 backdrop-blur-md border border-white/10');
content = content.replace(/bg-white\/5 backdrop-blur-xl border border-white\/10 border border-white\/10/g, 'bg-white/5 backdrop-blur-xl border border-white/10');
content = content.replace(/border border-white\/10 border border-white\/10/g, 'border border-white/10');

// Additional aesthetic tweaks
content = content.replace(/text-slate-900/g, 'text-white');

fs.writeFileSync('src/App.tsx', content);
console.log("Cleanup complete.");
