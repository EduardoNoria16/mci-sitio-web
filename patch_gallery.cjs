const fs = require('fs');
let content = fs.readFileSync('src/components/ProjectGallery.tsx', 'utf8');

const PISOS_COMERCIALES_TITLES = [
  'Cementicio nivelante en comedor 1.jpg',
  'Cementicio nivelante en comedor 2.jpg',
  'Cementicio nivelante en comedor asociados Sams 1.jpg',
  'Cementicio nivelante en comedor asociados Sams 2.jpg',
  'Cementicio nivelante en comedor asociados Sams 3.jpg',
  'Cementicio nivelante en comedor asociados Sams 4.jpg',
  'DPA 1.jpg',
  'DPA 2.jpg',
  'DPA 3',
  'DPA 4.jpg',
  'DPA 5.jpg',
  'Epóxico con requerimientos sanitarios 1.jpeg',
  'Epóxico con requerimientos sanitarios 2.jpeg',
  'Epóxico con requerimientos sanitarios 3.jpeg',
  'Epóxico con requerimientos sanitarios 4.jpeg',
  'Epóxico con requerimientos sanitarios 5.jpeg',
  'Epóxico con requerimientos sanitarios 6.png',
  'Epóxico con requerimientos sanitarios 7.jpeg',
  'Epóxico en área de producción 1.jpg',
  'Epóxico en área de producción 2.jpg',
  'Epóxico en área de producción 3.jpg',
  'Epóxico en área de producción 4.jpg',
  'Piso CEDIS.png',
  'Piso de concreto 1.jpg',
  'Piso de Concreto 3',
  'Piso de Concreto 4',
  'Piso en espacio comercial.jpg',
  'Sello de juntas'
];

content = content.replace(
  /const ALL_IMAGES = CATEGORIES\.flatMap\(cat => \{([\s\S]*?)return catImages\.map\(\(url, i\) => \(\{\s*id: `\$\{cat\.id\}-\$\{i \+ 1\}`,\s*categoryId: cat\.id,\s*categoryTitle: cat\.title,\s*url: url,\s*title: `\$\{cat\.title\} - Proyecto \$\{i \+ 1\}`,\s*\}\)\);\s*\}\);/,
  `const PISOS_COMERCIALES_TITLES = ${JSON.stringify(PISOS_COMERCIALES_TITLES, null, 2)};\n\nconst ALL_IMAGES = CATEGORIES.flatMap(cat => {
  const catImages = CATEGORY_IMAGES[cat.id] || [];
  return catImages.map((url, i) => {
    let specificTitle;
    if (cat.id === 'pisos-comerciales') {
      specificTitle = PISOS_COMERCIALES_TITLES[i];
    }
    const finalTitle = specificTitle || \`\${cat.title} - Proyecto \${i + 1}\`;
    
    return {
      id: \`\${cat.id}-\${i + 1}\`,
      categoryId: cat.id,
      categoryTitle: cat.title,
      url: url,
      title: finalTitle,
    };
  });
});`
);

fs.writeFileSync('src/components/ProjectGallery.tsx', content);
