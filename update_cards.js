import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

const oldSectoresCard = "`snap-center p-6 md:p-10 rounded-3xl border-2 transition-all duration-500 cursor-pointer group relative ${activeSector === sector.id ? 'ring-4 ring-brand-orange/20 bg-[#112240]/80 backdrop-blur-md border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.7)] -translate-y-2 border-brand-orange/40' : 'bg-slate-50/50 border-white/10 hover:bg-[#112240]/80 backdrop-blur-md border border-white/10 hover:shadow-[0_20px_50px_rgba(0,0,0,0.6)] hover:border-brand-blue/20 hover:-translate-y-2'}`";
const newSectoresCard = "`snap-center p-6 md:p-10 rounded-3xl border-2 transition-all duration-500 cursor-pointer group relative overflow-hidden flex flex-col justify-between ${activeSector === sector.id ? 'ring-4 ring-[#22d3ee]/20 bg-gradient-to-br from-[#112240] to-[#0a192f] border border-[#22d3ee]/50 shadow-[0_30px_60px_rgba(0,75,135,0.4)] -translate-y-2' : 'bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-gradient-to-br hover:from-[#112240] hover:to-[#004b87]/60 hover:shadow-[0_30px_60px_rgba(0,242,255,0.2)] hover:border-[#22d3ee]/40 hover:-translate-y-2'}`";

content = content.replace(oldSectoresCard, newSectoresCard);

// Let's also check STRENGTHS.intro or anything related to "Soluciones"
// Check for group hover text-brand-orange to text-[#22d3ee]
content = content.replace(/"text-sm text-white drop-shadow-sm leading-relaxed font-medium"/g, '"text-[13px] text-[#a5f3fc] drop-shadow-md leading-relaxed font-bold tracking-wide"');

content = content.replace("text-white drop-shadow-sm group-hover:text-brand-blue", "text-white drop-shadow-[0_2px_10px_rgba(34,211,238,0.5)] group-hover:text-[#22d3ee]");

// Update Soluciones/Servicios section background / text
// find: bg-slate-900 rounded-2xl md:rounded-3xl
const oldSolucionesCard = "group relative w-full max-w-lg bg-slate-900 rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.7)] hover:shadow-brand-orange/20 transition-all duration-500";
const newSolucionesCard = "group relative w-full max-w-lg bg-gradient-to-br from-[#112240] to-[#0a192f] border-2 border-white/5 hover:border-[#22d3ee]/40 rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.7)] hover:shadow-[0_20px_50px_rgba(0,242,255,0.3)] transition-all duration-500";
content = content.replace(oldSolucionesCard, newSolucionesCard);


// Let's replace any final bg-white/10 when it applies to standard cards
const oldSolStep = "className={`bg-gradient-to-br ${item.theme} backdrop-blur-md border rounded-3xl p-6 md:p-8 lg:p-10 flex flex-col items-center md:items-start gap-4 md:gap-6 lg:gap-8 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.6)] transition-all duration-500 relative overflow-hidden group`}";
const newSolStep = "className={`bg-gradient-to-br ${item.theme} backdrop-blur-md border border-[#22d3ee]/20 hover:border-[#22d3ee]/60 rounded-3xl p-6 md:p-8 lg:p-10 flex flex-col items-center md:items-start gap-4 md:gap-6 lg:gap-8 shadow-[0_4px_20px_rgba(0,10,30,0.5)] hover:shadow-[0_20px_50px_rgba(0,242,255,0.2)] transition-all duration-500 relative overflow-hidden group`}";
content = content.replace(oldSolStep, newSolStep);

fs.writeFileSync('src/App.tsx', content);
console.log("Updated Sectores and Soluciones cards colors");
