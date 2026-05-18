const fs = require('fs');

// Fix App.tsx
let appStr = fs.readFileSync('src/App.tsx', 'utf8');
appStr = appStr.replace(/import\s+\{\s*BEFORE_AFTER_B64\s*\}\s*from\s*\'\.\/data\/imagesBase64\'\s*;\n/, '');
appStr = appStr.replace(/''\+BEFORE_AFTER_B64\['([^']+)'\]\+''/g, "'/before-after/$1'");
fs.writeFileSync('src/App.tsx', appStr);

// Fix ProjectGallery.tsx
let galStr = fs.readFileSync('src/components/ProjectGallery.tsx', 'utf8');
galStr = galStr.replace(/import\s+\{\s*PROJECT_B64\s*\}\s*from\s*\'\.\.\/data\/imagesBase64\'\s*;\n/, '');
galStr = galStr.replace(/''\+PROJECT_B64\['([^']+)'\]\+''/g, "'/projects/$1'");
fs.writeFileSync('src/components/ProjectGallery.tsx', galStr);

// Delete the b64 file generated
if (fs.existsSync('src/data/imagesBase64.ts')) {
    fs.unlinkSync('src/data/imagesBase64.ts');
}

console.log('Reverted to normal URLs!');
