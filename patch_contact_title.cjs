const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const regexH2 = /<h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tighter drop-shadow-sm mb-4">[\s\S]*?<\/h2>/;
const newH2 = `<h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tighter drop-shadow-sm mb-4">
            Permítenos <span className="text-brand-orange">Mostrarte</span>
          </h2>`;

const regexP = /<p className="text-slate-300 max-w-2xl mx-auto text-lg md:text-xl font-medium tracking-tight">[\s\S]*?<\/p>/;
const newP = `<p className="text-slate-300 max-w-2xl mx-auto text-lg md:text-xl font-medium tracking-tight">
            Por qué somos la mejor opción. Esperamos contar pronto con una oportunidad para servirte.
          </p>`;

content = content.replace(regexH2, newH2);
content = content.replace(regexP, newP);

fs.writeFileSync('src/App.tsx', content);
