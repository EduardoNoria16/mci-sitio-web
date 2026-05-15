const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Find section "inicio-part2" and extract its children exactly
const part2Match = code.match(/<div className="animate-fade-in pt-12 md:pt-16">\s*<section id="inicio-part2"[^>]*>([\s\S]*?)<\/section>\s*<\/div>/);
if (!part2Match) {
  console.log("Could not find part2");
  process.exit(1);
}

const misionVisionContent = part2Match[1]; // The content inside section

// Remove part2 from code
code = code.replace(/<div className="hidden">\s*<\/div>\s*<div className="animate-fade-in pt-12 md:pt-16">\s*<section id="inicio-part2"[^>]*>[\s\S]*?<\/section>\s*<\/div>/, '');

// 2. Change the layout of "#inicio"
code = code.replace(
  '<div className="relative z-20 max-w-7xl mx-auto px-5 sm:px-6 md:px-10 lg:px-12 flex flex-col items-center w-full">',
  '<div className="relative z-20 max-w-[90rem] mx-auto px-5 sm:px-6 md:px-10 lg:px-12 flex flex-col items-center w-full h-full justify-center">'
);

code = code.replace(
  '<div className="flex flex-col gap-12 lg:gap-16 items-center w-full">',
  '<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-stretch w-full mb-12">'
);

// We need to inject the MisionVision content right after the "Quiénes somos" div (the first col).
// 1. ¿Quiénes Somos? Text is wrapped in a div. 
// Finding the end of the div of "Quiénes Somos"
const endOfQuienesSomos = `
                    <p className="font-black text-brand-orange text-base md:text-xl lg:text-2xl leading-snug drop-shadow-[0_8px_30px_rgba(0,0,0,0.4)]" style={{ textShadow: '1px 2px 4px rgba(0,0,0,0.3)' }}>
                      No fabricamos materiales, ofrecemos criterio técnico, diagnóstico, especificación correcta y ejecución especializada
                    </p>
                  </motion.div>
                </motion.div>
              </div>`;

code = code.replace(endOfQuienesSomos, endOfQuienesSomos + '\n\n              {/* Right Column: Misión, Visión, Propuesta */}\n              <div className="w-full flex flex-col justify-center">' + misionVisionContent + '</div>');

// Let's modify the navLinks from "#inicio-part2" to "#inicio" or just remove "Nosotros"
code = code.replace("{ name: 'Nosotros', href: '#inicio-part2' },", "{ name: 'Nosotros', href: '#inicio' },");

fs.writeFileSync('src/App.tsx', code);
console.log("done");
