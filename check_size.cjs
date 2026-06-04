const fs = require('fs');
const stats = fs.statSync('public/codigo-polycovers.zip');
console.log('Size:', stats.size);
