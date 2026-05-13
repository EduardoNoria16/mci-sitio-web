import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

const regexModal = /id="strength-modal-content"[\s\S]*?\{\/\* CTA in Modal \*\/\}/;

const match = content.match(regexModal);
if (match) {
  let modalContent = match[0];
  // Replace text styles inside the modal
  modalContent = modalContent.replace(/text-\[\#e0e7ff\] drop-shadow-md/g, 'text-slate-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-semibold');
  modalContent = modalContent.replace(/bg-brand-blue\/5/g, 'bg-black/20');

  content = content.replace(regexModal, modalContent);
}

// Also update HighlightText component
content = content.replace(/className="text-brand-orange font-bold"/g, 'className="text-[#f58220] font-black drop-shadow-md"');

fs.writeFileSync('src/App.tsx', content);
console.log('Fixed modal contrast again');
