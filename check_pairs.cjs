const fs = require('fs');
const files = fs.readdirSync('public/before-after');
const app = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /before: '(.+?)',\s*after: '(.+?)'/g;
let match;
const used = new Set();
let duplicates = [];
let missing = [];

while ((match = regex.exec(app)) !== null) {
  let [_, before, after] = match;
  before = before.replace('/before-after/', '');
  after = after.replace('/before-after/', '');
  
  if (!files.includes(before)) missing.push(before);
  if (!files.includes(after)) missing.push(after);
  
  const pairId = `${before}-${after}`;
  if (used.has(pairId)) {
    duplicates.push(pairId);
  }
  used.add(pairId);
}
console.log('Missing:', missing);
console.log('Duplicates:', duplicates);
