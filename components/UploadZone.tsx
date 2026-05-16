import React, { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  Settings, 
  Check, 
  ChevronRight, 
  Shield, 
  FileVideo, 
  Sparkles,
  MousePointer2,
  AlertCircle
} from 'lucide-react';
import { EnglishFormat, NumberFormat, UILanguage } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  wordCount: number;
  setWordCount: (val: number) => void;
  dialect: string;
  setDialect: (val: string) => void;
  uiLang: UILanguage;
}

const DIALECTS = [
  { id: 'عراقي قح', name: 'عراقي قح (Iraqi Pure)' },
  { id: 'مصرية', name: 'مصرية (Egyptian)' },
  { id: 'سعودية', name: 'سعودية (Saudi)' },
  { id: 'مغربية', name: 'مغربية (Moroccan)' },
  { id: 'standard', name: 'فصحى (Modern Standard)' },
];

const UploadZone: React.FC<UploadZoneProps> = ({ 
  onFileSelect, 
  wordCount, 
  setWordCount, 
  dialect,
  setDialect,
  uiLang
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const isArUI = uiLang === 'ar';

  const t = {
    title: isArUI ? 'محرك Subfy الذكي' : 'Subfy AI Engine',
    subtitle: isArUI ? 'المهندس الأول لإعادة صياغة الفيديوهات وتوليد الأصول الإبداعية' : 'The premier engine for video re-phrasing and creative asset generation',
    uploadTitle: isArUI ? 'ارفع الفيديو هنا' : 'Upload Video Here',
    uploadSub: isArUI ? 'تحليل لغوي وبصري شامل (MP4, MOV, MP3)' : 'Comprehensive linguistic and visual analysis',
    selectBtn: isArUI ? 'تحميل الملف' : 'Select File',
    settingsTitle: isArUI ? 'بروتوكولات المعالجة' : 'Processing Protocols',
    dialectLabel: isArUI ? 'هندسة اللهجة (Routing)' : 'Dialect Routing',
    segmentsLabel: isArUI ? 'كثافة الكلام' : 'Speech Density',
    tip: isArUI ? '* Subfy AI يضمن تحويل الكلام بأمانة ثقافية وصوتية للهجة المختارة.' : '* Subfy AI ensures cultural and phonetic faithfulness to the chosen locale.',
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setIsDragging(e.type === 'dragenter' || e.type === 'dragover');
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) onFileSelect(e.dataTransfer.files[0]);
  }, [onFileSelect]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "max-w-5xl mx-auto px-6 py-10 md:py-16 text-center overflow-y-auto max-h-full scrollbar-hide",
        isArUI && "font-arabic"
      )}
    >
      <div className="mb-14">
        <motion.div 
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 text-indigo-400 text-[10px] font-black rounded-full mb-6 border border-indigo-500/20 uppercase tracking-[0.3em]"
        >
          <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
          Subfy AI v2.0 Global
        </motion.div>
        <h2 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter italic leading-none">
          SUBFY <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500">AI</span>
        </h2>
        <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-medium">
          {t.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10 items-start">
        {/* Left: Protocols */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-8 text-left space-y-8 shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
             <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-indigo-400" />
                <h3 className="text-xs font-black text-indigo-400 uppercase tracking-[0.4em]">{t.settingsTitle}</h3>
             </div>
             <Shield className="w-5 h-5 text-slate-700" />
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase mb-3 block tracking-wider">{t.dialectLabel}</label>
              <div className="grid grid-cols-1 gap-2">
                {DIALECTS.map(d => (
                  <button 
                    key={d.id}
                    onClick={() => setDialect(d.id)}
                    className={cn(
                      "flex items-center justify-between px-5 py-3.5 rounded-2xl border transition-all",
                      dialect === d.id 
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-xl' 
                        : 'bg-slate-800/40 border-slate-700/50 text-slate-400 hover:border-slate-500'
                    )}
                  >
                    <span className="text-sm font-bold">{d.name}</span>
                    {dialect === d.id && <Check className="w-4 h-4" />}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-500 mt-4 leading-relaxed flex items-start gap-2 italic">
                <AlertCircle className="w-3 h-3 mt-0.5" />
                {t.tip}
              </p>
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase mb-3 block tracking-wider">{t.segmentsLabel}</label>
              <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-white/5 shadow-inner">
                {[1, 2, 3, 4, 5].map(num => (
                  <button 
                    key={num} 
                    onClick={() => setWordCount(num)} 
                    className={cn(
                      "flex-1 py-2 rounded-xl text-xs font-black transition-all",
                      wordCount === num ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
                    )}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right: Upload Zone */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
          className={cn(
            "relative group cursor-pointer border-2 border-dashed rounded-[3rem] p-12 transition-all duration-500 flex flex-col items-center justify-center min-h-[450px] shadow-2xl",
            isDragging ? 'border-indigo-500 bg-indigo-500/10 scale-[0.98]' : 'border-slate-800 hover:border-indigo-500/50 bg-slate-900/40 hover:bg-slate-900/60'
          )}
        >
          <input type="file" id="file-upload" className="hidden" accept="audio/*,video/*" onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])} />
          <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center w-full h-full justify-center">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-28 h-28 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-[3rem] flex items-center justify-center mb-8 shadow-2xl shadow-indigo-600/40 border border-white/10 relative overflow-hidden"
            >
               <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
               <Upload className="w-12 h-12 text-white" />
            </motion.div>
            <p className="text-3xl font-black text-white mb-3 tracking-tighter flex items-center gap-3">
              <MousePointer2 className="w-6 h-6 text-indigo-400" />
              {t.uploadTitle}
            </p>
            <p className="text-slate-500 text-sm mb-10 max-w-[250px] leading-relaxed font-medium">
              <FileVideo className="w-4 h-4 inline mr-2 opacity-50" />
              {t.uploadSub}
            </p>
            <div className="group/btn relative bg-white text-slate-950 px-12 py-4 rounded-3xl font-black text-sm transition-all hover:scale-105 active:scale-95 shadow-2xl flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              {t.selectBtn}
              <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </div>
          </label>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default UploadZone;

