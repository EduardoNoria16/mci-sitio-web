import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Give life to the "Fortalezas" cards
// From: group relative p-8 rounded-[2rem] border-2 border-white/10 bg-[#112240]/80 backdrop-blur-md border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.7)] hover:border-brand-orange/40 transition-all duration-500 flex flex-col items-center text-center gap-6 cursor-pointer
// To: group relative p-8 rounded-[2rem] border-2 border-[#22d3ee]/20 bg-gradient-to-br from-[#112240] to-[#0a192f] hover:from-[#112240] hover:to-[#004b87]/40 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_20px_50px_rgba(34,211,238,0.2)] hover:border-[#22d3ee]/60 transition-all duration-500 flex flex-col items-center text-center gap-6 cursor-pointer overflow-hidden

const oldFortalezasCard = 'group relative p-8 rounded-[2rem] border-2 border-white/10 bg-[#112240]/80 backdrop-blur-md border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.7)] hover:border-brand-orange/40 transition-all duration-500 flex flex-col items-center text-center gap-6 cursor-pointer';
const newFortalezasCard = 'group relative p-8 rounded-[2rem] border-2 border-[#22d3ee]/20 bg-gradient-to-br from-[#112240] to-[#0a192f] hover:from-[#112240] hover:to-[#004b87]/40 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_20px_50px_rgba(0,75,135,0.4)] hover:border-[#22d3ee]/60 transition-all duration-500 flex flex-col items-center text-center gap-6 cursor-pointer overflow-hidden';

content = content.replace(oldFortalezasCard, newFortalezasCard);

// 2. Also inject a decorative glowing orb inside the card logic
// Let's find the map loop for STRENGTHS
// <div className="w-20 h-20 rounded-2xl bg-[#112240]/60 backdrop-blur-sm border border-white/5 flex items-center justify-center text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.6)] group-hover:rotate-6">

const oldIconWrap = '<div className="w-20 h-20 rounded-2xl bg-[#112240]/60 backdrop-blur-sm border border-white/5 flex items-center justify-center text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.6)] group-hover:rotate-6">';

const newIconWrap = `<div className="absolute -top-20 -right-20 w-40 h-40 bg-[#22d3ee] rounded-full blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none" />
                  <div className="relative z-10 w-20 h-20 rounded-2xl bg-gradient-to-br from-[#22d3ee]/10 to-[#004b87]/30 border border-[#22d3ee]/30 flex items-center justify-center text-[#22d3ee] group-hover:bg-gradient-to-br group-hover:from-brand-orange group-hover:to-brand-orange/80 group-hover:text-white group-hover:border-brand-orange transition-all duration-500 shadow-[0_10px_30px_rgba(0,0,0,0.5)] group-hover:shadow-[0_10px_40px_rgba(245,130,32,0.4)] group-hover:rotate-6">`;

content = content.replace(oldIconWrap, newIconWrap);


// 3. Make text-xl title cooler
const oldH3 = '<h3 className="text-xl font-black text-slate-100 uppercase tracking-tight leading-tight group-hover:text-brand-orange transition-colors">';
const newH3 = '<h3 className="relative z-10 text-xl font-black text-white drop-shadow-[0_2px_10px_rgba(34,211,238,0.5)] uppercase tracking-tight leading-tight group-hover:text-brand-orange transition-colors">';
content = content.replace(oldH3, newH3);

// 4. Make description text more visible and blue-tinted
const oldP = '<p className="text-xs text-slate-100 font-bold leading-relaxed uppercase tracking-widest px-4">';
const newP = '<p className="relative z-10 text-xs text-[#a5f3fc] font-bold leading-relaxed uppercase tracking-widest px-4 drop-shadow-md group-hover:text-white transition-colors">';
content = content.replace(oldP, newP);

// Also replace STRENGTH.intro texts that may be dull
// They might be using text-slate-100 currently

// Let's generally upgrade all text-slate-100 to text-[#e0e7ff] (a very light blueish white) or plain text-white
content = content.replace(/text-slate-100/g, 'text-white drop-shadow-sm');

// Replace any placeholder text that's still dull
content = content.replace(/placeholder:text-slate-300/g, 'placeholder:text-[#8ba3c7]');

fs.writeFileSync('src/App.tsx', content);
console.log("Updated Fortalezas and contrast");
