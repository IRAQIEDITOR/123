
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, Type, Sparkles, Clock, Layers } from 'lucide-react';
import { SubtitleChunk, UILanguage } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SubtitleListProps {
  chunks: SubtitleChunk[];
  currentTime: number;
  uiLang: UILanguage;
}

const SubtitleList: React.FC<SubtitleListProps> = ({ chunks, currentTime, uiLang }) => {
  const isAr = uiLang === 'ar';

  return (
    <div className="space-y-4 pb-24">
      {chunks.map((chunk, index) => {
        const isActive = currentTime >= chunk.start_time && currentTime <= chunk.end_time;
        
        return (
          <motion.div 
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={cn(
              "group p-5 rounded-3xl border transition-all duration-500 relative flex flex-col gap-3",
              isActive 
                ? 'bg-indigo-600/10 border-indigo-500/50 shadow-xl shadow-indigo-500/10 scale-[1.01]' 
                : 'bg-slate-800/40 border-slate-700/50 hover:border-slate-500/50'
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-slate-900 border border-slate-700/50 px-3 py-1 rounded-full text-[10px] font-bold text-slate-400 font-mono flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  {chunk.start_time.toFixed(2)}s — {chunk.end_time.toFixed(2)}s
                </div>
                {isActive && (
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                  </span>
                )}
              </div>
              <div className="text-[10px] font-black uppercase tracking-tighter text-indigo-400/50 flex items-center gap-1.5">
                <Layers className="w-3 h-3" />
                Layer #{chunk.layer_id}
              </div>
            </div>

            <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-4", isAr && 'font-arabic')}>
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                  <Type className="w-3 h-3" />
                  {isAr ? 'النص الأصلي (Verbatim)' : 'Original Text'}
                </span>
                <p className="text-slate-400 text-sm italic opacity-70 leading-relaxed">{chunk.original_text}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  {isAr ? 'تحويل عراقي AI (اللهجة)' : 'iraqi Locale'}
                </span>
                <p className="text-white text-md font-bold leading-relaxed">{chunk.localized_text}</p>
              </div>
            </div>

            <div className="mt-2 pt-3 border-t border-white/5">
              <div className="flex items-start gap-4 bg-slate-950/40 p-4 rounded-2xl border border-indigo-500/10">
                <div className="text-indigo-400 mt-0.5">
                  <Video className="w-5 h-5 opacity-80" />
                </div>
                <div className="flex-1">
                  <span className="text-[8px] font-black text-indigo-400/70 uppercase tracking-[0.2em] block mb-1">
                    {isAr ? 'تعليمات المونتاج' : 'Editing Instruction'}
                  </span>
                  <p className="text-slate-300 text-[11px] leading-relaxed font-medium">
                    {chunk.editing_instruction}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default SubtitleList;

