import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Video, 
  Music, 
  Terminal, 
  Zap, 
  Share2, 
  Image as ImageIcon, 
  Download, 
  RefreshCw, 
  Copy, 
  Check, 
  AlertTriangle, 
  FileText,
  Clock,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { SubtitleChunk, AppStatus, ProcessingOptions, UILanguage, AkkasProject } from '../types';
import SubtitleList from './SubtitleList';
import { transcribeAudio } from '../services/geminiService';
import { downloadFile, generateSRT } from '../utils/helpers';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface StudioProps {
  initialFile: File | null;
  onReset: () => void;
  options: ProcessingOptions;
  uiLang: UILanguage;
}

const Studio: React.FC<StudioProps> = ({ initialFile, onReset, options, uiLang }) => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [project, setProject] = useState<AkkasProject | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'timeline' | 'strategy' | 'assets' | 'social'>('timeline');
  const [srtVerbatim, setSrtVerbatim] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [isMediaVideo, setIsMediaVideo] = useState(false);

  const isArUI = uiLang === 'ar';
  
  const t = {
    loading: isArUI ? 'جاري التحليل لغوياً عبر iraqi AI...' : 'Analyzing Dialects via iraqi AI...',
    loadingSub: isArUI ? 'هندسة اللهجة، توليد الخطافات، وتصميم الأصول البصرية' : 'Engineering dialect, generating hooks, and designing visual assets',
    tabTimeline: isArUI ? 'المخطط الزمني' : 'Timeline',
    tabStrategy: isArUI ? 'إستراتيجية المحتوى' : 'Strategy',
    tabSocial: isArUI ? 'عدة السوشال ميديا' : 'Social Kit',
    tabAssets: isArUI ? 'الأصول البصرية (PNG)' : 'Visual Assets',
    downloadProject: isArUI ? 'تصدير المشروع' : 'Export Project',
    downloadSRT: isArUI ? 'تحميل ملف SRT' : 'Download SRT',
    srtModeVerbatim: isArUI ? 'نصياً (SRT)' : 'Verbatim SRT',
    srtModeDialect: isArUI ? 'باللهجة (SRT)' : 'Dialect SRT',
    newProject: isArUI ? 'فيديو جديد' : 'New Video',
    retry: isArUI ? 'إعادة المحاولة' : 'Retry',
    quotaExceeded: isArUI ? 'عذراً، تم بلوغ الحد المسموح به لطلبات الذكاء الاصطناعي (الخطة المجانية). يرجى الانتظار قليلاً أو المحاولة غداً.' : 'Sorry, the AI request quota has been reached (Free Tier). Please wait a moment or try again tomorrow.',
    hooksTitle: isArUI ? 'الخطافات الفتاكة (Virality)' : 'Viral Hooks',
    engineTitle: isArUI ? 'محرك التوليد البصري (PNG)' : 'AI Asset Engine',
    copyPrompt: isArUI ? 'نسخ البرومبت' : 'Copy Prompt',
    visualDirection: isArUI ? 'التوجه البصري' : 'Visual Direction',
    assetsReadySub: isArUI ? 'جاهز للتوليد بخلفية شفافة' : 'Ready for transparency-enabled generators',
    atTime: isArUI ? 'في التوقيت' : 'AT',
  };

  useEffect(() => {
    if (initialFile) {
      const url = URL.createObjectURL(initialFile);
      setMediaUrl(url);
      setIsMediaVideo(initialFile.type.startsWith('video/'));
      handleProcessFile(initialFile);
    }
    return () => { if (mediaUrl) URL.revokeObjectURL(mediaUrl); };
  }, [initialFile]);

  const handleProcessFile = async (file: File) => {
    try {
      setStatus(AppStatus.PROCESSING);
      setError(null);
      const result = await transcribeAudio(file, options);
      setProject(result);
      setStatus(AppStatus.EDITING);
    } catch (err: any) {
      setError(err.message || (isArUI ? "فشل التحليل." : "Failed."));
      setStatus(AppStatus.ERROR);
    }
  };

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLMediaElement>) => setCurrentTime(e.currentTarget.currentTime);
  const activeChunk = project?.timeline_layers.find(c => currentTime >= c.start_time && currentTime <= c.end_time);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className={cn("max-w-7xl mx-auto px-4 py-8 h-full flex flex-col md:flex-row gap-8 overflow-hidden", isArUI && "font-arabic")}>
      {/* Preview Column */}
      <div className="w-full md:w-5/12 lg:w-4/12 flex flex-col space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative aspect-[9/16] bg-slate-950 rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/5 mx-auto w-full max-w-[320px] md:max-w-none ring-1 ring-slate-800"
        >
          {mediaUrl && (isMediaVideo ? (
            <video ref={videoRef} src={mediaUrl} onTimeUpdate={handleTimeUpdate} controls className="w-full h-full object-contain" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900">
                <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center animate-pulse mb-6 ring-1 ring-indigo-500/20">
                   <Music className="w-10 h-10 text-indigo-400" />
                </div>
                <audio ref={audioRef} src={mediaUrl} onTimeUpdate={handleTimeUpdate} controls className="w-4/5" />
            </div>
          ))}
          <div className="absolute inset-x-0 bottom-24 flex justify-center pointer-events-none px-6">
            <AnimatePresence mode="wait">
              {activeChunk && (
                <motion.div 
                  key={activeChunk.layer_id}
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -10 }}
                  className="bg-white/95 text-slate-950 px-5 py-3 rounded-2xl shadow-2xl text-center border border-white/20 backdrop-blur-md"
                >
                  <p className={cn("text-sm md:text-md font-black", isArUI && "font-arabic leading-tight")}>
                    {srtVerbatim ? activeChunk.original_text : activeChunk.localized_text}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <div className="flex flex-col gap-3">
          <button 
            onClick={() => project && downloadFile(JSON.stringify(project), "subfy_project.json", "application/json")}
            className="group bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl text-xs font-black transition-all shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            {t.downloadProject}
          </button>
          
          <div className="flex border border-white/5 rounded-2xl overflow-hidden bg-slate-900/50 p-1">
            <button 
              onClick={() => setSrtVerbatim(true)}
              className={cn(
                "flex-1 py-2 text-[9px] font-black uppercase transition-all rounded-xl",
                srtVerbatim ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'
              )}
            >
              {t.srtModeVerbatim}
            </button>
            <button 
              onClick={() => setSrtVerbatim(false)}
              className={cn(
                "flex-1 py-2 text-[9px] font-black uppercase transition-all rounded-xl",
                !srtVerbatim ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'
              )}
            >
              {t.srtModeDialect}
            </button>
          </div>

          <button 
            onClick={() => project && downloadFile(generateSRT(project.timeline_layers, srtVerbatim), "subtitles.srt", "text/plain")}
            className="group bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-2xl text-xs font-black transition-all shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2"
          >
            <FileText className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            {t.downloadSRT}
          </button>
          <button onClick={onReset} className="flex items-center justify-center gap-2 text-slate-500 hover:text-white py-2 font-black text-[10px] uppercase tracking-[0.3em] transition-colors">
            <RefreshCw className="w-3 h-3" />
            {t.newProject}
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="w-full md:w-7/12 lg:w-8/12 flex flex-col min-h-0">
        <div className="glass-card flex flex-col h-[700px] shadow-2xl overflow-hidden ring-1 ring-white/5">
          {/* Tabs */}
          <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-slate-900/40">
             <div className="flex bg-slate-950/50 p-1.5 rounded-2xl border border-white/5">
                {[
                  { id: 'timeline', label: t.tabTimeline, icon: Terminal },
                  { id: 'strategy', label: t.tabStrategy, icon: Zap },
                  { id: 'social', label: t.tabSocial, icon: Share2 },
                  { id: 'assets', label: t.tabAssets, icon: ImageIcon }
                ].map((tab) => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all",
                      activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
                    )}
                  >
                    <tab.icon className="w-3 h-3" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
             </div>
             {project && (
               <div className="hidden sm:flex items-center gap-2 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase">{project.dialect_applied}</span>
               </div>
             )}
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 md:p-8 scrollbar-hide">
            <AnimatePresence mode="wait">
              {status === AppStatus.PROCESSING && (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center h-full space-y-8"
                >
                  <div className="relative">
                    <div className="w-20 h-20 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                       <Sparkles className="w-8 h-8 text-indigo-400 animate-pulse" />
                    </div>
                  </div>
                  <div className="text-center">
                    <h2 className="text-white text-2xl font-black">{t.loading}</h2>
                    <p className="text-slate-500 text-sm mt-3 max-w-[320px] mx-auto leading-relaxed">{t.loadingSub}</p>
                  </div>
                </motion.div>
              )}

              {error && (
                <motion.div 
                  key="error"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center p-8 text-center"
                >
                  <div className="w-16 h-16 bg-red-500/10 rounded-[2rem] flex items-center justify-center mb-6 border border-red-500/20">
                    <AlertTriangle className="w-8 h-8 text-red-500" />
                  </div>
                  <h3 className="text-white font-black text-lg mb-4">
                    {error === "QUOTA_EXCEEDED" ? t.quotaExceeded : error}
                  </h3>
                  <button 
                    onClick={() => initialFile && handleProcessFile(initialFile)} 
                    className="flex items-center gap-2 bg-red-500 hover:bg-red-400 text-white px-8 py-3 rounded-2xl font-black transition-all shadow-lg shadow-red-500/20"
                  >
                    <RefreshCw className="w-4 h-4" />
                    {t.retry}
                  </button>
                </motion.div>
              )}

              {status === AppStatus.EDITING && activeTab === 'timeline' && project && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="timeline">
                  <SubtitleList 
                    chunks={project.timeline_layers} 
                    currentTime={currentTime}
                    uiLang={uiLang}
                  />
                </motion.div>
              )}

              {status === AppStatus.EDITING && activeTab === 'strategy' && project && (
                <motion.div 
                  key="strategy"
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-10"
                >
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <Zap className="w-4 h-4 text-rose-500" />
                      <h3 className="text-xs font-black text-rose-500 uppercase tracking-[0.4em]">{t.hooksTitle}</h3>
                    </div>
                    <div className="space-y-4">
                      {project.strategy.viral_hooks.map((hook, i) => (
                        <motion.div 
                          key={i} 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="group relative bg-slate-900/50 border border-white/5 p-6 rounded-[2rem] hover:border-rose-500/30 transition-all duration-300"
                        >
                          <div className="flex items-center gap-4">
                            <span className="w-10 h-10 bg-rose-500/10 text-rose-400 rounded-2xl flex items-center justify-center font-black border border-rose-500/10 group-hover:bg-rose-500 group-hover:text-white transition-all">
                              {i+1}
                            </span>
                            <p className="text-white text-lg font-bold leading-relaxed">{hook}</p>
                          </div>
                          <button 
                            onClick={() => copyToClipboard(hook, `hook-${i}`)}
                            className="absolute top-4 right-4 p-2 hover:bg-white/5 rounded-xl transition-all"
                          >
                            {copiedId === `hook-${i}` ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-500" />}
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Video className="w-4 h-4 text-slate-500" />
                      <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">{t.visualDirection}</h3>
                    </div>
                    <div className="bg-slate-900/60 p-8 rounded-[2.5rem] border border-white/5 text-slate-300 text-sm leading-relaxed italic font-medium">
                       {project.strategy.overall_visual_concept}
                    </div>
                  </div>
                </motion.div>
              )}

              {status === AppStatus.EDITING && activeTab === 'social' && project && (
                <motion.div 
                  key="social"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-indigo-400 uppercase tracking-[0.4em] flex items-center gap-2">
                       <Sparkles className="w-3 h-3" />
                       {isArUI ? 'عناوين مقترحة (Viral Titles)' : 'Viral Titles'}
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                      {project.social_media_kit.viral_titles.map((title, i) => (
                        <div key={i} className="group flex items-center justify-between bg-slate-900/50 border border-white/5 p-5 rounded-2xl hover:border-indigo-500/30 transition-all">
                          <span className="text-white font-bold">{title}</span>
                          <button onClick={() => copyToClipboard(title, `title-${i}`)} className="p-2 hover:bg-white/5 rounded-xl transition-all">
                             {copiedId === `title-${i}` ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-500" />}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-emerald-400 uppercase tracking-[0.4em] flex items-center gap-2">
                       <FileText className="w-3 h-3" />
                       {isArUI ? 'وصف الفيديو (Description)' : 'Description'}
                    </h3>
                    <div className="group relative bg-slate-900/50 border border-white/5 p-6 rounded-[2rem] hover:border-emerald-500/30 transition-all">
                      <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{project.social_media_kit.video_description}</p>
                      <button onClick={() => copyToClipboard(project.social_media_kit.video_description, 'desc')} className="absolute top-4 right-4 p-2 hover:bg-white/5 rounded-xl transition-all">
                        {copiedId === 'desc' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-500" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-amber-500 uppercase tracking-[0.4em] flex items-center gap-2">
                       <Zap className="w-3 h-3" />
                       {isArUI ? 'هاشتاجات مقترحة' : 'Suggested Hashtags'}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {project.social_media_kit.suggested_hashtags.map((tag, i) => (
                        <span key={i} className="bg-amber-500/10 text-amber-400 px-4 py-2 rounded-full text-xs font-black border border-amber-500/20">
                          {tag.startsWith('#') ? tag : `#${tag}`}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {status === AppStatus.EDITING && activeTab === 'assets' && project && (
                <motion.div 
                  key="assets"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-black text-indigo-400 uppercase tracking-[0.4em]">{t.engineTitle}</h3>
                      <p className="text-[10px] text-slate-500 font-bold uppercase mt-1 tracking-wider">{t.assetsReadySub}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    {project.ai_generated_assets.transparent_png_images.map((asset, i) => (
                      <div key={i} className="group bg-slate-900/50 border border-white/5 p-6 rounded-[2.5rem] hover:border-indigo-500/30 transition-all duration-300">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-xl text-[10px] font-black border border-indigo-500/10 flex items-center gap-1.5">
                               <Clock className="w-3 h-3" />
                               {t.atTime} {asset.timestamp}
                            </div>
                            <h4 className="text-white font-bold text-md">{asset.asset_idea}</h4>
                          </div>
                           <button 
                             onClick={() => copyToClipboard(asset.image_generation_prompt, `asset-${i}`)}
                             className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all shadow-lg"
                           >
                             {copiedId === `asset-${i}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                             {t.copyPrompt}
                           </button>
                        </div>
                        <div className="bg-slate-950 p-5 rounded-2xl border border-white/5 ring-1 ring-inset ring-white/5">
                          <code className="text-[11px] text-slate-400 font-mono leading-relaxed block break-words">
                            {asset.image_generation_prompt}
                          </code>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Studio;
