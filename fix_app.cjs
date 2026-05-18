const fs = require('fs');

let app = fs.readFileSync('src/App.tsx', 'utf8');

// Replace dark text classes
app = app.replace(/text-slate-700/g, 'text-slate-200');
app = app.replace(/text-slate-600/g, 'text-slate-300');
app = app.replace(/text-slate-500/g, 'text-slate-400');
app = app.replace(/text-blue-600/g, 'text-blue-400');
app = app.replace(/text-green-600/g, 'text-green-400');

// Import ProjectGallery if not exists
if (!app.includes('import ProjectGallery')) {
    app = app.replace(/import BeforeAfterMarquee[^\n]+\n/, "import BeforeAfterMarquee from './components/BeforeAfterMarquee';\nimport ProjectGallery from './components/ProjectGallery';\n");
}

// Add ProjectGallery section
if (!app.includes('<ProjectGallery />')) {
    const pGalleryStr = `</section>\n\n      <ProjectGallery />\n\n      {/* Testimonials Section */}`;
    app = app.replace(/<\/section>\s+\{\/\*\s*Testimonials Section\s*\*\/\}/, pGalleryStr);
}

fs.writeFileSync('src/App.tsx', app);

let pGal = fs.readFileSync('src/components/ProjectGallery.tsx', 'utf8');
pGal = pGal.replace(/text-slate-700/g, 'text-slate-200');
pGal = pGal.replace(/text-slate-600/g, 'text-slate-300');
pGal = pGal.replace(/text-slate-500/g, 'text-slate-400');
fs.writeFileSync('src/components/ProjectGallery.tsx', pGal);

console.log('App fixed');
