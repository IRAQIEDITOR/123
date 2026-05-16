import express, { Request, Response, NextFunction } from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
});

const SYSTEM_INSTRUCTION = `You are the hyper-intelligent engine "iraqi AI" - the world's premier engineer dedicated to video re-phrasing, linguistic content analysis, and the generation of creative assets and transparent AI PNG images with a sharp, professional Iraqi identity.

Your mission is to receive a video or text and analyze it mechanically using these strict protocols:

### 1. Transcription & Dialect Routing Protocol:
* Speech Density: Each Layer/Chunk MUST NOT exceed 3 words maximum to ensure reading speed and visual impact.
* Timing (Precise Timing Alignment): You must balance words with timing with millisecond precision. Timing is the most critical element; the text must start the moment the first character is spoken and end exactly as the last character finishes.
* Transcription: The 'original_text' MUST be verbatim and extremely accurate, exactly as spoken without any omission or addition.

### 2. Viral Hooks & Video Concept Protocol:
* Generate 3 high-impact "Viral Hooks" designed to hijack the viewer's attention in the first 3 seconds.
* Provide a mechanical directing and editing plan for each layer/sentence.

### 3. AI PNG Generation Engine Protocol:
* Innovate and formulate custom "Image Generation Prompts" to produce assets in PNG format with a completely transparent background matching the content context.
* Link each generated image to a precise timestamp in the video to appear to the user as a ready-to-use creative asset.

### 4. Social Media Kit Engine Protocol:
* Generate catchy Viral Titles.
* Write a professional Video Description that encourages engagement.
* Extract trending Suggested Hashtags based on the video context.

Use your full thinking budget to ensure absolute precision in timing and words, that hooks are lethal, and dialect conversion feels authentic as if written by a native.

Return ONLY valid JSON. No preamble.`;

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Logging middleware
  app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
  });

  // Body parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Middleware to handle JSON syntax errors in request body
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof SyntaxError && 'status' in err && err.status === 400 && 'body' in err) {
      return res.status(400).json({ error: "Invalid JSON payload" });
    }
    next();
  });

  // API routes
  app.get("/api/health", (req: Request, res: Response) => {
    res.json({ status: "ok" });
  });

  app.post("/api/process", upload.single('file'), async (req: Request, res: Response) => {
    try {
      console.log("Starting /api/process request...");
      const file = req.file;
      let options = {};
      try {
        options = JSON.parse(req.body.options || '{}');
      } catch (e) {
        console.error("Failed to parse options:", req.body.options);
      }
      
      console.log("Options received:", options);

      if (!file) {
        return res.status(400).json({ error: "No file uploaded or file too large" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not configured" });
      }

      console.log("Initializing Gemini with model: gemini-3-flash-preview");
      const ai = new GoogleGenAI({ 
        apiKey: apiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });
      
      const targetDialect = (options as any).dialect || 'عراقي قح';
      const wordCount = 3; // Enforced strict density

      const prompt = `TASK: Process the provided video/audio using iraqi AI protocols.
      
      CRITICAL REQUIREMENTS:
      1. SPEECH DENSITY: Maximum 3 words per subtitle chunk (VERY IMPORTANT). Break down long sentences.
      2. EXACT TRANSCRIPTION: Write the subtitles VERBATIM (نصاً وبكل دقة حرفياً) in 'original_text'.
      3. LOCALIZATION: Provide the localized text for [${targetDialect}] in 'localized_text'.
      4. TIMING PRECISION: Each start_time and end_time MUST be extremely precise (milliseconds) and perfectly synchronized with the audio speech for that segment. No overlapping and no gaps if speech is continuous.
      5. SOCIAL MEDIA KIT: Generate viral titles, description, and hashtags.
      6. VIRAL STRATEGY: Generate 3 high-impact viral hooks.
      7. ASSETS: Design AI PNG generation prompts matching the content context.
      8. ARABIC INSTRUCTIONS: The 'editing_instruction' and 'overall_visual_concept' MUST be written in Arabic (باللغة العربية) so the user can understand them perfectly.`;

      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            role: "user",
            parts: [
              { inlineData: { data: file.buffer.toString('base64'), mimeType: file.mimetype } },
              { text: prompt }
            ]
          }
        ],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              project_name: { type: Type.STRING },
              dialect_applied: { type: Type.STRING },
              strategy: {
                type: Type.OBJECT,
                properties: {
                  viral_hooks: { type: Type.ARRAY, items: { type: Type.STRING } },
                  overall_visual_concept: { type: Type.STRING }
                },
                required: ["viral_hooks", "overall_visual_concept"]
              },
              social_media_kit: {
                type: Type.OBJECT,
                properties: {
                  viral_titles: { type: Type.ARRAY, items: { type: Type.STRING } },
                  video_description: { type: Type.STRING },
                  suggested_hashtags: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["viral_titles", "video_description", "suggested_hashtags"]
              },
              timeline_layers: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    layer_id: { type: Type.NUMBER },
                    start_time: { type: Type.NUMBER },
                    end_time: { type: Type.NUMBER },
                    original_text: { type: Type.STRING },
                    localized_text: { type: Type.STRING },
                    editing_instruction: { type: Type.STRING }
                  },
                  required: ["layer_id", "start_time", "end_time", "original_text", "localized_text", "editing_instruction"]
                }
              },
              ai_generated_assets: {
                type: Type.OBJECT,
                properties: {
                  transparent_png_images: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        timestamp: { type: Type.STRING },
                        asset_idea: { type: Type.STRING },
                        image_generation_prompt: { type: Type.STRING }
                      },
                      required: ["timestamp", "asset_idea", "image_generation_prompt"]
                    }
                  }
                },
                required: ["transparent_png_images"]
              }
            },
            required: ["project_name", "dialect_applied", "strategy", "social_media_kit", "timeline_layers", "ai_generated_assets"]
          },
        }
      });

      let text = "";
      if (typeof (result as any).text === "string") {
        text = (result as any).text;
      } else if (typeof (result as any).response?.text === "function") {
        text = (result as any).response.text();
      } else if (typeof (result as any).response?.text === "string") {
        text = (result as any).response.text;
      }
      
      if (!text) {
        throw new Error("Empty response from AI");
      }
      
      // Clean up potentially malformed JSON by stripping markdown if present
      text = text.replace(/```json\n?/, "").replace(/\n?```/, "").trim();

      console.log("AI processing complete.");
      res.json(JSON.parse(text));
    } catch (error: any) {
      console.error("Gemini processing error details:", error);
      
      let status = 500;
      let errorMessage = error.message || "Internal Server Error";
      
      // Specifically handle 429 Resource Exhausted (Rate Limit)
      if (error.message?.includes("429") || error.status === 429 || error.code === 429) {
        status = 429;
        errorMessage = "QUOTA_EXCEEDED";
      }

      res.status(status).json({ 
        error: errorMessage,
        details: process.env.NODE_ENV !== "production" ? error.stack : undefined
      });
    }
  });

  // Handle all other API calls with 404 JSON
  app.all("/api/*", (req: Request, res: Response) => {
    res.status(404).json({ error: `API route ${req.method} ${req.url} not found` });
  });

  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Final catch-all error handler
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("UNHANDLED ERROR:", err);
    res.status(err.status || 500).json({
      error: err.message || "Internal Server Error",
      details: process.env.NODE_ENV !== "production" ? err.stack : undefined
    });
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
