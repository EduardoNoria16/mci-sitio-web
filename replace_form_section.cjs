const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const targetSection = content.substring(
  content.indexOf('{/* Contact Section explicitly inside Part 2 */}'),
  content.indexOf('{/* Footer Section (Minimal and Professional) */}')
);

const newSection = `{/* Contact Section explicitly inside Part 2 */}
      <section id="contacto" className="relative z-10 max-w-7xl mx-auto px-5 md:px-6 py-20 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-10 text-center lg:text-left">
            <div className="space-y-6 flex flex-col items-center lg:items-start text-center">
              <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter leading-tight">
                PERMÍTENOS MOSTRARTE POR QUÉ <span className="text-brand-orange">SOMOS LA MEJOR OPCIÓN.</span>
              </h2>
              <p className="text-white text-2xl md:text-3xl font-medium tracking-tight">
                ESPERAMOS CONTAR PRONTO CON UNA <span className="text-brand-orange">OPORTUNIDAD</span> PARA SERVIRTE.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 place-items-center lg:place-items-start">
              {[
                { icon: <Phone className="w-5 h-5" />, text: '55 6150 0317', href: 'tel:+525561500317' },
                { icon: <Mail className="w-5 h-5" />, text: 'mci.spolimericas@polycovers.mx', href: 'mailto:mci.spolimericas@polycovers.mx' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-all">
                    {item.icon}
                  </div>
                  <a href={item.href} className="text-sm font-black text-white hover:text-brand-orange transition-colors">
                    {item.text}
                  </a>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a 
                href="https://wa.me/525561500317" 
                target="_blank"
                className="flex items-center justify-center gap-3 bg-[#25D366] text-white px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl hover:shadow-[0_20px_40px_rgba(37,211,102,0.3)] transition-all hover:-translate-y-1"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp Directo
              </a>
              <button 
                onClick={() => setIsQRModalOpen(true)}
                className="flex items-center justify-center gap-3 bg-slate-900 text-white px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all shadow-lg"
              >
                <QrCode className="w-5 h-5" />
                Ver Tarjeta Digital
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 bg-gradient-to-tr from-brand-orange/20 via-transparent to-brand-blue/20 blur-3xl opacity-50 rounded-[3rem] -z-10" />
            <div className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-2xl relative overflow-hidden text-left">
               {isFormSubmitted ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-10 space-y-6"
                  >
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-600 border border-green-100 shadow-inner">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase">¡Mensaje Enviado!</h3>
                    <p className="text-slate-600 font-medium">Un experto te contactará en breve.</p>
                    <button onClick={() => setIsFormSubmitted(false)} className="text-brand-orange font-black text-xs uppercase tracking-widest border-b-2 border-brand-orange/20 hover:border-brand-orange transition-all">Enviar otro mensaje</button>
                  </motion.div>
               ) : (
                  <form className="space-y-6" onSubmit={handleFormSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="md:col-span-1">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2 mb-2 block">Profesión</label>
                        <select name="profesion" value={formData.profesion} onChange={handleFieldChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:ring-2 focus:ring-brand-blue/20 outline-none appearance-none">
                          <option value="">Seleccione...</option>
                          <option value="Ing.">Ing.</option>
                          <option value="Arq.">Arq.</option>
                          <option value="Lic.">Lic.</option>
                          <option value="C.P.">C.P.</option>
                          <option value="Dr.">Dr.</option>
                          <option value="Mtro.">Mtro.</option>
                          <option value="Téc.">Téc.</option>
                          <option value="Otro">Otro</option>
                        </select>
                        {formData.profesion === 'Otro' && (
                          <input type="text" name="profesionOtro" value={formData.profesionOtro} onChange={handleFieldChange} className="w-full mt-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 placeholder:text-slate-400 text-slate-900 text-sm focus:ring-2 focus:ring-brand-blue/20 outline-none" placeholder="Especifique..." />
                        )}
                      </div>
                      <div className="md:col-span-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2 mb-2 block">Nombre Completo *</label>
                        <input type="text" name="nombre" value={formData.nombre} onChange={handleFieldChange} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 placeholder:text-slate-400 text-slate-900 text-sm focus:ring-2 focus:ring-brand-blue/20 outline-none" placeholder="Roberto Silva" />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2 mb-2 block">Razón Social *</label>
                      <input type="text" name="razonSocial" value={formData.razonSocial} onChange={handleFieldChange} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 placeholder:text-slate-400 text-slate-900 text-sm focus:ring-2 focus:ring-brand-blue/20 outline-none" placeholder="Empresa / Planta" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2 mb-2 block">Email *</label>
                      <input type="email" name="email" value={formData.email} onChange={handleFieldChange} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 placeholder:text-slate-400 text-slate-900 text-sm focus:ring-2 focus:ring-brand-blue/20 outline-none" placeholder="rsilva@empresa.com" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2 mb-2 block">Teléfono de Contacto *</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <input type="tel" name="movil" value={formData.movil} onChange={handleFieldChange} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 placeholder:text-slate-400 text-slate-900 text-sm focus:ring-2 focus:ring-brand-blue/20 outline-none" placeholder="Móvil" />
                        <input type="tel" name="fijo" value={formData.fijo} onChange={handleFieldChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 placeholder:text-slate-400 text-slate-900 text-sm focus:ring-2 focus:ring-brand-blue/20 outline-none" placeholder="Fijo" />
                        <input type="text" name="ext" value={formData.ext} onChange={handleFieldChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 placeholder:text-slate-400 text-slate-900 text-sm focus:ring-2 focus:ring-brand-blue/20 outline-none" placeholder="Ext." />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2 mb-3 block">Naturaleza del Proyecto *</label>
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        {['Construcción Nueva', 'Remodelación', 'Ampliación', 'Cambio de uso de Área', 'Mtto Preventivo / Correctivo', 'Otro'].map((option) => (
                          <label key={option} className="flex items-center gap-2 cursor-pointer cursor-grab group">
                            <div className={\`w-4 h-4 rounded border flex items-center justify-center transition-colors \${formData.naturaleza.includes(option) ? 'bg-brand-blue border-brand-blue text-white' : 'border-slate-300 group-hover:border-brand-blue/50'}\`}>
                              {formData.naturaleza.includes(option) && <CheckCircle2 className="w-3 h-3" />}
                            </div>
                            <span className="text-sm text-slate-700 select-none group-hover:text-slate-900 transition-colors leading-tight">{option}</span>
                            <input 
                              type="checkbox" 
                              className="hidden" 
                              checked={formData.naturaleza.includes(option)} 
                              onChange={() => handleCheckboxChange(option)} 
                            />
                          </label>
                        ))}
                      </div>
                      {formData.naturaleza.includes('Otro') && (
                        <input type="text" name="naturalezaOtro" value={formData.naturalezaOtro} onChange={handleFieldChange} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 placeholder:text-slate-400 text-slate-900 text-sm focus:ring-2 focus:ring-brand-blue/20 outline-none" placeholder="Describa la naturaleza del proyecto..." />
                      )}
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2 mb-2 block">Ubicación del Proyecto *</label>
                      <input type="text" name="ubicacion" value={formData.ubicacion} onChange={handleFieldChange} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 placeholder:text-slate-400 text-slate-900 text-sm focus:ring-2 focus:ring-brand-blue/20 outline-none" placeholder="Dirección / Estado" />
                    </div>
                    <button type="submit" disabled={isSubmitting} className="w-full py-5 bg-brand-blue text-white font-black uppercase tracking-[0.3em] text-[10px] rounded-xl hover:bg-brand-blue/90 shadow-xl transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50">
                      {isSubmitting ? 'ENVIANDO...' : 'SOLICITAR ASESORÍA TÉCNICA'}
                    </button>
                  </form>
               )}
            </div>
          </div>
        </div>
      </section>

      {/* Thank you and image */}
      <section className="relative z-10 max-w-5xl mx-auto px-5 md:px-6 py-8 md:py-16 text-center">
        <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-8">
          ¡Muchas <span className="text-brand-orange">Gracias!</span>
        </h2>
        <div className="rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-[1.5px] border-white/20 relative aspect-[16/9] md:aspect-[2.35/1] bg-black/50">
          <img 
            src="https://i.ibb.co/DgmjQ1Yg/Equipo-MCI.webp" 
            alt="Equipo MCI" 
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
        </div>
      </section>

      `;

if (targetSection.length > 0) {
  content = content.replace(targetSection, newSection);
  fs.writeFileSync('src/App.tsx', content);
} else {
  console.log('Target section not found');
}
