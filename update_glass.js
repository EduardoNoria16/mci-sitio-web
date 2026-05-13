import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');
content = content.replace(/className="relative w-full max-w-5xl glass rounded-\[2.5rem\] border border-white\/10 overflow-hidden shadow-\[0_30px_60px_rgba\(0,0,0,0.7\)\] z-10 max-h-\[90vh\] flex flex-col will-change-transform"/, 'className="relative w-full max-w-5xl bg-gradient-to-br from-[#112240] to-[#0a192f] border border-[#22d3ee]/30 rounded-[2.5rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.7)] z-10 max-h-[90vh] flex flex-col will-change-transform"');

content = content.replace(/className="glass p-6 md:p-8 rounded-3xl md:rounded-\[2.5rem\] border-white\/5 flex flex-col justify-between group hover:border-brand-orange\/30 transition-all duration-500"/g, 'className="bg-[#112240]/80 backdrop-blur-md border border-white/10 p-6 md:p-8 rounded-3xl md:rounded-[2.5rem] border-white/5 flex flex-col justify-between group hover:border-brand-orange/30 transition-all duration-500"');

content = content.replace(/glass px-6 py-2 rounded-full border-glass-border/g, 'bg-[#112240]/80 backdrop-blur-md border border-white/10 px-6 py-2 rounded-full');

content = content.replace(/rounded-full glass border-white\/10/g, 'rounded-full bg-[#112240]/80 backdrop-blur-md border border-white/10');

content = content.replace(/glass border-brand-orange\/30/g, 'bg-[#112240]/80 backdrop-blur-md border border-brand-orange/30');

// Fix border-glass-border
content = content.replace(/border-glass-border/g, 'border-white/10');

fs.writeFileSync('src/App.tsx', content);
console.log("updated glass");
