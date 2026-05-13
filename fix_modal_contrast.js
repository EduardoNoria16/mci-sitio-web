import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

const regexModal = /id="strength-modal-content"[\s\S]*?\{/\* CTA in Modal \*\//;

const match = content.match(regexModal);
if (match) {
  let modalContent = match[0];
  // Replace text styles inside the modal
  modalContent = modalContent.replace(/text-\[\#e0e7ff\] drop-shadow-md/g, 'text-slate-100 font-medium');
  modalContent = modalContent.replace(/text-brand-orange font-bold/g, 'text-brand-orange-light font-black drop-shadow-sm'); // Need to check if brand-orange-light exists, if not, use #f58220
  modalContent = modalContent.replace(/bg-brand-blue\/5/g, 'bg-[#000000]/20'); // Darken the sub-item backgrounds so white text stands out MORE

  content = content.replace(regexModal, modalContent);
}

fs.writeFileSync('src/App.tsx', content);
console.log('Fixed modal contrast');
