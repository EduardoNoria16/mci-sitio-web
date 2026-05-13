import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Global Background - Slate / Steel Blue theme
content = content.replace(/bg-\[#f0f4f8\]/g, 'bg-slate-900'); 
content = content.replace(/from-\[#004b87\]\/10 via-\[#3b82f6\]\/10 to-\[#f58220\]\/10/g, 'from-slate-800 via-brand-blue/20 to-slate-900');

// Adjusting light mode glassmorphism to dark mode glassmorphism
content = content.replace(/bg-white\/40/g, 'bg-white/5 border border-white/10');
content = content.replace(/bg-white\/60/g, 'bg-white/10 border border-white/10');
content = content.replace(/bg-white\/80/g, 'bg-white/10 border border-white/10');

// Fix specific gradients that were explicitly for white backgrounds
content = content.replace(/from-white\/80 via-white\/60 to-white\/20/g, 'from-white/10 via-white/5 to-transparent');
content = content.replace(/from-white\/95 via-white\/80 to-white\/60/g, 'from-white/10 via-white/5 to-transparent');

// Text colors inverted for dark mode
content = content.replace(/text-slate-900/g, 'text-white');
content = content.replace(/text-slate-800/g, 'text-slate-200');
content = content.replace(/text-slate-700/g, 'text-slate-300');
content = content.replace(/text-slate-600/g, 'text-slate-400');
content = content.replace(/text-slate-500/g, 'text-slate-400');
content = content.replace(/text-slate-400/g, 'text-slate-500');

// Solid backgrounds converted to glassmorphism or darker tones
content = content.replace(/bg-white(?![A-Za-z0-9_/-])/g, 'bg-white/5 backdrop-blur-xl border border-white/10');
content = content.replace(/bg-slate-50(?![A-Za-z0-9_/-])/g, 'bg-white/5 backdrop-blur-md border border-white/5');
content = content.replace(/bg-slate-100(?![A-Za-z0-9_/-])/g, 'bg-white/10');

// Card Borders
content = content.replace(/border-slate-100/g, 'border-white/10');
content = content.replace(/border-slate-200/g, 'border-white/10');

// Shadows (enhance for dark mode)
content = content.replace(/shadow-sm/g, 'shadow-[0_4px_20px_rgba(0,0,0,0.3)]');
// Do not blindly replace shadow-md entirely as it might broke other custom shadows if not careful, but there are only a few.
content = content.replace(/shadow-md(?![A-Za-z0-9_/-])/g, 'shadow-[0_8px_30px_rgba(0,0,0,0.4)]');

// Hovers
content = content.replace(/hover:bg-white(?![A-Za-z0-9_/-])/g, 'hover:bg-white/10');
content = content.replace(/hover:bg-slate-50(?![A-Za-z0-9_/-])/g, 'hover:bg-white/5');

// Navigation bar
content = content.replace(/bg-white\/95/g, 'bg-slate-900/80 border-b border-white/10');

fs.writeFileSync('src/App.tsx', content);
console.log("Replacements complete.");
