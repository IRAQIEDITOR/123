
import { SubtitleChunk } from "../types";

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const formatTimestamp = (seconds: number): string => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);

  const h = hrs.toString().padStart(2, '0');
  const m = mins.toString().padStart(2, '0');
  const s = secs.toString().padStart(2, '0');
  const msStr = ms.toString().padStart(3, '0');

  return `${h}:${m}:${s},${msStr}`;
};

export const generateSRT = (chunks: SubtitleChunk[], useVerbatim: boolean = false): string => {
  return chunks
    .map((chunk, index) => {
      const text = useVerbatim ? chunk.original_text : chunk.localized_text;
      return `${index + 1}\n${formatTimestamp(chunk.start_time)} --> ${formatTimestamp(chunk.end_time)}\n${text}\n`;
    })
    .join('\n');
};

export const downloadFile = (content: string, filename: string, contentType: string) => {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};
