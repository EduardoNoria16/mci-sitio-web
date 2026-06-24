import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calculator, ArrowRight, CheckCircle2, Factory, Building2, ChevronRight } from 'lucide-react';
import { useLanguage } from '../utils/LanguageContext';

export default function QuickQuoteWidget() {
  const [step, setStep] = useState(1);
  const [surface, setSurface] = useState('');
  const [condition, setCondition] = useState('');
  const { language, t } = useLanguage();
  const evalT = t('evaluation');

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="bg-white/10 backdrop-blur-2xl border border-white/30 shadow-[0_30px_60px_rgba(0,0,0,0.15)] rounded-[2rem] p-6 w-full relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/20 blur-[50px] -z-10 rounded-full" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#22d3ee]/20 blur-[50px] -z-10 rounded-full" />

      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-orange to-brand-orange/80 flex items-center justify-center shadow-lg">
          <Calculator className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-black text-slate-800 tracking-tight text-lg leading-tight drop-shadow-sm">{evalT.title}</h3>
          <p className="text-[10px] text-slate-700 font-bold uppercase tracking-widest">{evalT.subtitle}</p>
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-1 shadow-inner min-h-[180px] flex flex-col justify-between">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4">
              <p className="text-sm font-bold text-slate-800 mb-3">{evalT.step1Question}</p>
              <div className="space-y-2">
                <button onClick={() => { setSurface('industrial'); setStep(2); }} className="w-full text-left px-4 py-3 rounded-xl bg-white border border-slate-200 hover:border-brand-orange hover:shadow-md transition-all group flex justify-between items-center text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-2"><Factory className="w-4 h-4 text-brand-orange/70" /> {evalT.step1Option1}</span>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-brand-orange transition-colors" />
                </button>
                <button onClick={() => { setSurface('comercial'); setStep(2); }} className="w-full text-left px-4 py-3 rounded-xl bg-white border border-slate-200 hover:border-brand-blue hover:shadow-md transition-all group flex justify-between items-center text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-2"><Building2 className="w-4 h-4 text-brand-blue/70" /> {evalT.step1Option2}</span>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-brand-blue transition-colors" />
                </button>
              </div>
            </motion.div>
          )}
          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="p-4">
              <p className="text-sm font-bold text-slate-800 mb-3">{evalT.step2Question}</p>
              <div className="space-y-2">
                <button onClick={() => { setCondition('nuevo'); setStep(3); }} className="w-full text-left px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-green-500 hover:shadow-md transition-all text-xs font-bold text-slate-700">{evalT.step2Option1}</button>
                <button onClick={() => { setCondition('danado'); setStep(3); }} className="w-full text-left px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-red-500 hover:shadow-md transition-all text-xs font-bold text-slate-700">{evalT.step2Option2}</button>
                <button onClick={() => { setCondition('recubrimiento'); setStep(3); }} className="w-full text-left px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-brand-orange hover:shadow-md transition-all text-xs font-bold text-slate-700">{evalT.step2Option3}</button>
              </div>
            </motion.div>
          )}
          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-4 flex flex-col items-center text-center justify-center h-full gap-3 pt-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-1">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-xs font-bold text-slate-800 tracking-wide uppercase">{evalT.step3Title}</p>
              <p className="text-[10px] text-slate-500 leading-tight">{evalT.step3Desc}</p>
              <a href="#contacto-footer" onClick={() => setStep(1)} className="mt-1 bg-slate-900 text-white w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-brand-orange transition-colors shadow-lg">{evalT.step3Btn}</a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {step < 3 && (
        <div className="mt-4 flex justify-center gap-2">
          <div className={`w-8 h-1.5 rounded-full transition-colors ${step === 1 ? 'bg-brand-orange' : 'bg-white/40'}`} />
          <div className={`w-8 h-1.5 rounded-full transition-colors ${step === 2 ? 'bg-brand-orange' : 'bg-white/40'}`} />
        </div>
      )}
    </motion.div>
  );
}
