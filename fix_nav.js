import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Remove Desktop Nav
content = content.replace(/<nav className="hidden lg:flex items-center gap-6 lg:gap-10">[\s\S]*?<\/nav>/, '');

// 2. Remove Mobile Toggle Button
content = content.replace(/<button\s+ref=\{menuButtonRef\}[\s\S]*?aria-label=\{isMenuOpen \? "Cerrar menú" : "Abrir menú"\}[\s\S]*?<\/button>/, '');

// 3. Remove Mobile menu overlay
content = content.replace(/<AnimatePresence>[\s]*?\{isMenuOpen && \([\s\S]*?key="mobile-nav"[\s\S]*?<\/motion\.div>[\s]*?\)\[\s\S]*?<\/AnimatePresence>/, '');

// Alternate way to remove the mobile dropdown:
// Let's replace anything from <AnimatePresence> down to the end of the header
const headerRegex = /(<header[^>]*>[\s\S]*?)<AnimatePresence>[\s\S]*?<\/header>/;
const match = content.match(headerRegex);
if (match) {
  // we want to preserve the header start up to the desktop nav replacement, then end the header.
  // actually a simpler regex:
  content = content.replace(/\{isMenuOpen && \([\s\S]*?<\/motion\.div>\s*\)\}/, '');
}

fs.writeFileSync('src/App.tsx', content);
console.log('Done script 1');
