const fs = require('fs');

let t = fs.readFileSync('src/App.tsx', 'utf8');

t = t.replace(/https:\/\/images2\.imgbox\.com\/[^\/]+\/[^\/]+\/([^\']+)/g, "'+BEFORE_AFTER_B64['$1']+'");

fs.writeFileSync('src/App.tsx', t);
console.log('App.tsx updated');
