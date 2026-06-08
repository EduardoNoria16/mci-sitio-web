const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Update formData state
content = content.replace(
  /const \[formData, setFormData\] = useState\(\{[\s\S]*?detalles: ''\n  \}\);/,
  `const [formData, setFormData] = useState({
    profesion: '',
    profesionOtro: '',
    nombre: '',
    razonSocial: '',
    email: '',
    movil: '',
    fijo: '',
    ext: '',
    naturaleza: [] as string[],
    naturalezaOtro: '',
    ubicacion: ''
  });`
);

// Update validateField
content = content.replace(
  /const validateField = \(name: string, value: string\) => \{[\s\S]*?return error;\n  \};/,
  `const validateField = (name: string, value: any) => {
    let error = '';
    if (typeof value === 'string') {
      switch (name) {
        case 'nombre':
          if (!value.trim()) error = 'El nombre es obligatorio';
          break;
        case 'email':
          if (!value.trim()) error = 'El correo es obligatorio';
          else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$/i.test(value)) error = 'Correo inválido';
          break;
        case 'movil':
          if (!value.trim()) error = 'El móvil es obligatorio';
          break;
        case 'razonSocial':
          if (!value.trim()) error = 'La razón social es obligatoria';
          break;
      }
    }
    return error;
  };`
);

// We need a custom handleChange for checkboxes
content = content.replace(
  /const handleFieldChange = \(e: React.ChangeEvent<HTMLInputElement \| HTMLTextAreaElement>\) => \{[\s\S]*?\}\);\n    \}\n  \};/,
  `const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
  };`
);

// Update FocusEvent type
content = content.replace(
  /const handleFieldBlur = \(e: React.FocusEvent<HTMLInputElement \| HTMLTextAreaElement>\) => {/g,
  `const handleFieldBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {`
);

fs.writeFileSync('src/App.tsx', content);
