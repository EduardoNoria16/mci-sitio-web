import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

const replacement = `          {/* WhatsApp CTA Header */}
          <a
            href="https://wa.me/525561500317"
            target="_blank"
            className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20b858] text-white px-4 md:px-6 py-2 md:py-2.5 rounded-full font-black uppercase tracking-widest text-[9px] md:text-[11px] transition-all hover:scale-105 shadow-[0_4px_15px_rgba(37,211,102,0.4)]"
          >
            <span>WhatsApp</span>
          </a>`;

content = content.replace(/\{\/\* Desktop Nav \*\/\}[\s\S]*?<\/div>\s*<\/header>/, replacement + '\n        </div>\n      </header>');

fs.writeFileSync('src/App.tsx', content);
console.log('Added header CTA');
