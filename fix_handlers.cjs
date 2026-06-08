const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /const handleFieldChange = \(e: React\.ChangeEvent<HTMLInputElement \| HTMLTextAreaElement>\) => \{[\s\S]*?const handleFieldBlur = /;

const replacement = `const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (touchedFields[name]) {
      const error = validateField(name, value);
      setFormErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleCheckboxChange = (option: string) => {
    setFormData(prev => {
      const isSelected = prev.naturaleza.includes(option);
      const newNaturaleza = isSelected 
        ? prev.naturaleza.filter(item => item !== option)
        : [...prev.naturaleza, option];
      return { ...prev, naturaleza: newNaturaleza };
    });
  };

  const handleFieldBlur = `;

content = content.replace(regex, replacement);

fs.writeFileSync('src/App.tsx', content);
