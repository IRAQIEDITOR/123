import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, User, ExternalLink } from 'lucide-react';
import { UILanguage } from '../types';

interface HeaderProps {
  uiLang: UILanguage;
}

const Header: React.FC<HeaderProps> = ({ uiLang }) => {
  const isAr = uiLang === 'ar';

  return (
    <header className="border-b border-white/5 bg-slate-900/80 backdrop-blur-xl sticky top-0 z-50 px-4 md:px-8 py-3 flex items-center justify-between">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center space-x-3"
      >
        <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 rotate-3 hover:rotate-0 transition-transform cursor-pointer overflow-hidden relative group">
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div className={isAr ? 'mr-3' : ''}>
          <h1 className="text-xl font-black tracking-tighter text-white leading-none">
            SUBFY <span className="text-indigo-400 italic">AI</span>
          </h1>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1 hidden sm:block">AI Social Engineer</p>
        </div>
      </motion.div>

      <div className="flex items-center space-x-4 md:space-x-8">
        {/* Developer Info */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`hidden lg:flex items-center gap-3 bg-white/5 px-4 py-2 rounded-2xl border border-white/5 ${isAr ? 'flex-row-reverse' : ''}`}
        >
          <div className="w-8 h-8 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20">
            <User className="w-4 h-4 text-indigo-400" />
          </div>
          <div className={`flex flex-col ${isAr ? 'items-end' : 'items-start'}`}>
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{isAr ? 'إنشاء' : 'Created by'}</span>
            <span className="text-[11px] font-black text-indigo-400">محمد فؤاد</span>
          </div>
        </motion.div>

        {/* Social Links */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center"
        >
          <a 
            href="https://www.tiktok.com/@lr.y7_?is_from_webapp=1&sender_device=pc" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all text-white group"
            title="TikTok"
          >
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">TikTok</span>
             <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400" />
          </a>
        </motion.div>
      </div>
    </header>
  );
};

export default Header;

