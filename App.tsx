import React, { useState } from 'react';
import Header from './components/Header';
import UploadZone from './components/UploadZone';
import Studio from './components/Studio';
import { UILanguage, ProcessingOptions } from './types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const uiLang: UILanguage = 'ar';
  const isArUI = uiLang === 'ar';
  const [options, setOptions] = useState<ProcessingOptions>({
    wordCount: 3,
    targetLanguage: 'ar',
    dialect: 'عراقي قح',
    englishFormat: 'english',
    numberFormat: 'digits'
  });

  const handleFileSelect = (file: File) => setSelectedFile(file);
  const handleReset = () => setSelectedFile(null);

  return (
    <div className="min-h-screen flex flex-col selection:bg-indigo-500/30 selection:text-white overflow-hidden bg-[#0f172a]">
      {/* Dynamic Background Glow */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      <Header uiLang={uiLang} />
      
      <main className="flex-1 overflow-hidden relative z-10">
        {!selectedFile ? (
          <UploadZone 
            onFileSelect={handleFileSelect} 
            wordCount={options.wordCount} 
            setWordCount={(v) => setOptions({...options, wordCount: v})}
            dialect={options.dialect || 'عراقي قح'}
            setDialect={(v) => setOptions({...options, dialect: v})}
            uiLang={uiLang}
          />
        ) : (
          <Studio 
            initialFile={selectedFile} 
            onReset={handleReset} 
            options={options}
            uiLang={uiLang}
          />
        )}
      </main>

      <footer className={cn(
        "py-6 px-8 border-t border-white/5 text-[10px] text-slate-500 font-bold flex flex-col md:flex-row items-center justify-between gap-4 uppercase tracking-[0.2em] relative z-10 bg-slate-900/20",
        isArUI && "font-arabic"
      )}>
        <p>© 2026 Subfy AI Studio. Professional Social Media Engineering (Engine v2.0).</p>
        <div className="flex space-x-6">
          <a href="#" className="hover:text-indigo-400 transition-colors">Privacy</a>
          <a href="#" className="hover:text-indigo-400 transition-colors">Terms</a>
        </div>
      </footer>
    </div>
  );
};

export default App;
