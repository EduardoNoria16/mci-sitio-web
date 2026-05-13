import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Global Background: Deep Navy / Tech Blue
content = content.replace(/bg-\[#f0f4f8\]/g, 'bg-[#0a192f]'); 

// Global Text Colors
content = content.replace(/text-slate-900/g, 'text-slate-100');
content = content.replace(/text-slate-800/g, 'text-slate-200');
content = content.replace(/text-slate-700/g, 'text-slate-300');
content = content.replace(/text-slate-600/g, 'text-slate-400');
content = content.replace(/text-slate-500/g, 'text-slate-400');
content = content.replace(/text-slate-400/g, 'text-slate-500');

// Backgrounds & Borders for cards
content = content.replace(/bg-white(?![A-Za-z0-9_/-])/g, 'bg-[#112240]/80 backdrop-blur-md border border-white/10');
content = content.replace(/bg-slate-50(?![A-Za-z0-9_/-])/g, 'bg-[#112240]/60 backdrop-blur-sm border border-white/5');
content = content.replace(/bg-slate-100(?![A-Za-z0-9_/-])/g, 'bg-white/10');
content = content.replace(/border-slate-100/g, 'border-white/10');
content = content.replace(/border-slate-200/g, 'border-white/10');

// Glass overlays that were white-based
content = content.replace(/bg-white\/40/g, 'bg-[#112240]/40 border border-white/5');
content = content.replace(/bg-white\/60/g, 'bg-[#112240]/60 border border-white/10');
content = content.replace(/bg-white\/80/g, 'bg-[#112240]/80 border border-white/10');
content = content.replace(/bg-white\/95/g, 'bg-[#0a192f]/90 border border-white/10');

// Shadows (enhancing contrast for dark mode)
content = content.replace(/shadow-sm/g, 'shadow-[0_4px_20px_rgba(0,0,0,0.3)]');
content = content.replace(/shadow-md(?![A-Za-z0-9_/-])/g, 'shadow-[0_8px_30px_rgba(0,0,0,0.4)]');
content = content.replace(/shadow-lg(?![A-Za-z0-9_/-])/g, 'shadow-[0_15px_40px_rgba(0,0,0,0.5)]');
content = content.replace(/shadow-xl(?![A-Za-z0-9_/-])/g, 'shadow-[0_20px_50px_rgba(0,0,0,0.6)]');
content = content.replace(/shadow-2xl(?![A-Za-z0-9_/-])/g, 'shadow-[0_30px_60px_rgba(0,0,0,0.7)]');

// Hover adjustments
content = content.replace(/hover:bg-white(?![A-Za-z0-9_/-])/g, 'hover:bg-white/10');
content = content.replace(/hover:bg-slate-50(?![A-Za-z0-9_/-])/g, 'hover:bg-white/5');

// Navigation specific
content = content.replace(/bg-\[#0a192f\]\/90 border border-white\/10 backdrop-blur-xl/g, 'bg-[#0a192f]/80 backdrop-blur-xl border-b border-white/10');

// Clean up any double borders or messy backdrop blurs
content = content.replace(/bg-\[#112240\]\/80 backdrop-blur-md border border-white\/10\/[0-9]+/g, 'bg-white/10');
content = content.replace(/border border-white\/5 border border-white\/10/g, 'border border-white/10');
content = content.replace(/border border-white\/10 border border-white\/10/g, 'border border-white/10');

// Make text over the hero gradient visible using drop shadows
content = content.replace(/drop-shadow-md/g, 'drop-shadow-[0_8px_8px_rgba(0,0,0,0.8)]');

fs.writeFileSync('src/App.tsx', content);
console.log("Deep Tech Blue Replacements complete.");
