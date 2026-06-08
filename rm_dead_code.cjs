const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /\/\/ --- AI Configuration ---[\s\S]*?const SYSTEM_INSTRUCTION = `[\s\S]*?`;\n\n/m;
content = content.replace(regex, '');

fs.writeFileSync('src/App.tsx', content);
