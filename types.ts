
export interface AIAsset {
  timestamp: string;
  asset_idea: string;
  image_generation_prompt: string;
}

export interface SubtitleChunk {
  layer_id: number;
  start_time: number;
  end_time: number;
  original_text: string;
  localized_text: string;
  editing_instruction: string;
}

export interface SocialMediaKit {
  viral_titles: string[];
  video_description: string;
  suggested_hashtags: string[];
}

export interface AkkasProject {
  project_name: string;
  dialect_applied: string;
  strategy: {
    viral_hooks: string[];
    overall_visual_concept: string;
  };
  social_media_kit: SocialMediaKit;
  timeline_layers: SubtitleChunk[];
  ai_generated_assets: {
    transparent_png_images: AIAsset[];
  };
}

export enum AppStatus {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  PROCESSING = 'PROCESSING',
  EDITING = 'EDITING',
  ERROR = 'ERROR'
}

export type EnglishFormat = 'english' | 'phonetic_arabic';
export type NumberFormat = 'digits' | 'words';
export type UILanguage = 'ar' | 'en';

export interface ProcessingOptions {
  wordCount: number;
  targetLanguage: string;
  dialect?: string;
  englishFormat: EnglishFormat;
  numberFormat: NumberFormat;
}

