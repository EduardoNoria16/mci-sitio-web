const fs = require('fs');
const fd = fs.openSync('public/codigo-polycovers.zip', 'r');
const buffer = Buffer.alloc(4);
fs.readSync(fd, buffer, 0, 4, 0);
console.log('Signature:', buffer.toString('hex'));
fs.closeSync(fd);
