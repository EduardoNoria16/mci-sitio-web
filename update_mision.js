import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Change card background to a nice dark gradient
const oldTheme = "theme: 'from-blue-50/70 to-white/70 hover:from-blue-100/80 hover:to-white/90 border-white/20/60'";
const newTheme = "theme: 'from-[#112240]/80 to-[#0a192f]/80 hover:from-[#112240] hover:to-[#004b87]/40 border-[#22d3ee]/20'";
content = content.replace(new RegExp(oldTheme, 'g'), newTheme);

// Change iconBg to fit dark mode
const oldIconBg = "iconBg: 'bg-blue-100/50 border-white/20 shadow-[0_0_15px_rgba(37,99,235,0.15)]'";
const newIconBg = "iconBg: 'bg-[#22d3ee]/10 border border-[#22d3ee]/30 shadow-[0_0_15px_rgba(34,211,238,0.2)]'";
content = content.replace(new RegExp(oldIconBg, 'g'), newIconBg);

// Remove the weird border-white/20 from titleColor
content = content.replace(/'text-white drop-shadow-md border-white\/20'/g, "'text-[#22d3ee] drop-shadow-[0_2px_10px_rgba(34,211,238,0.4)]'");

// Also change the checkmark list for "Propuesta de Valor"
content = content.replace(/bg-white\/10 border border-white\/10 p-3 rounded-xl border border-orange-100/g, 'bg-[#112240] border border-[#22d3ee]/20 p-3 rounded-xl');

// Fix text-white appearing on light backgrounds if there are any other hardcoded light backgrounds
content = content.replace(/bg-slate-50\/50/g, 'bg-white/5');
content = content.replace(/bg-[#f0f4f8]/g, 'bg-[#0a192f]');

fs.writeFileSync('src/App.tsx', content);
console.log("Updated Mision/Vision/Propuesta cards to dark mode");
