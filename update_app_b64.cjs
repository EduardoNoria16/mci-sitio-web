const fs = require('fs');

let t = fs.readFileSync('src/App.tsx', 'utf8');

if(!t.includes('BEFORE_AFTER_B64')) {
    t = "import { BEFORE_AFTER_B64 } from './data/imagesBase64';\n" + t;
}

t = t.replace(/\/before-after\/([a-zA-Z0-9_\-]+\.(jpg|jpeg))/g, "'+BEFORE_AFTER_B64['$1']+'");

// Fixed quotation logic for objects
// before: '/before-after/wsIEHA08_o.jpg' -> before: ''+BEFORE_AFTER_B64['wsIEHA08_o.jpg']+'',
// wait, the regex above will replace `/before-after/wsIEHA08_o.jpg` inside the string literal
// So `'...'` becomes `''+BEFORE_AFTER_B64['wsIEHA08_o.jpg']+''`
// which is valid JS: `''+BEFORE_AFTER_B64[...]` ? No, `before: ''+BEFORE_AFTER_B64['...']+''` is technically string concatenation, but `'' + ... + ''` works!

fs.writeFileSync('src/App.tsx', t);
console.log('App.tsx updated');
