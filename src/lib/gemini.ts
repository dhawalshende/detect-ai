import type { Defect } from "./demo-data";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-1.5-flash";

const GEMINI_PROMPT = `You are an industrial quality inspection AI. Analyze this product image for defects.
Respond ONLY with a valid JSON object, no markdown, no explanation, just JSON:
{
  "defects": [
    {
      "type": "defect name",
      "confidence": 0.00,
      "severity": "critical|major|minor",
      "explanation": "short explanation",
      "bbox": { "x": 10, "y": 10, "width": 30, "height": 20 }
    }
  ],
  "finalDecision": "ACCEPT|REVIEW|REJECT",
  "score": 0,
  "summary": "one line summary"
}

Rules:
- confidence between 0.00 and 1.00
- score between 0 and 100 (higher = better quality)
- ACCEPT if score > 75, REVIEW if 40-75, REJECT if below 40
- bbox values are percentages of image dimensions
- If no defects found, return empty defects array and ACCEPT with score 90+
- Detect: cracks, scratches, corrosion, missing components, deformation, burns, contamination`;

export interface GeminiDefect {
  type: string;
  confidence: number;
  severity: "critical" | "major" | "minor";
  explanation: string;
  bbox: { x: number; y: number; width: number; height: number };
}

export interface GeminiResult {
  defects: GeminiDefect[];
  finalDecision: "ACCEPT" | "REVIEW" | "REJECT";
  score: number;
  summary: string;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function analyzeImage(
  imageBase64: string,
  mimeType: string = "image/jpeg",
): Promise<GeminiResult> {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  // Strip data URL prefix if present
  const base64Data = imageBase64.includes(",") ? imageBase64.split(",")[1] : imageBase64;

  const maxRetries = 3;
  let lastError: any = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: GEMINI_PROMPT },
                { inlineData: { mimeType, data: base64Data } },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.1,
            topK: 1,
            topP: 1,
            maxOutputTokens: 2048,
          },
        }),
      });

      if (!response.ok) {
        const errText = await response.text().catch(() => response.statusText);
        
        // Retry on 503/429
        if ((response.status === 503 || response.status === 429) && attempt < maxRetries) {
          const waitTime = attempt * 2000;
          console.warn(`Gemini busy (Attempt ${attempt}/${maxRetries}). Retrying in ${waitTime}ms...`);
          await delay(waitTime);
          continue;
        }
        throw new Error(`Gemini API error ${response.status}: ${errText}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error("No response content from Gemini API");

      // Strip markdown fences
      const clean = text
        .replace(/```json\s*/gi, "")
        .replace(/```\s*/g, "")
        .trim();
      
      return JSON.parse(clean) as GeminiResult;
    } catch (err: any) {
      lastError = err;
      // If it's a structural error or manual throw, rethrow if out of attempts
      if (attempt === maxRetries) throw err;
      
      // For network errors or unexpected failures, wait and retry
      const waitTime = attempt * 1000;
      await delay(waitTime);
    }
  }

  throw lastError || new Error("Analysis failed after multiple attempts");
}

/** Maps Gemini bbox (width/height) → app Defect bbox (w/h) */
export function mapToDefects(result: GeminiResult): Defect[] {
  return result.defects.map((d, i) => ({
    id: `d${i + 1}`,
    type: d.type,
    confidence: Math.min(1, Math.max(0, d.confidence)),
    severity: d.severity,
    explanation: d.explanation,
    bbox: { x: d.bbox.x, y: d.bbox.y, w: d.bbox.width, h: d.bbox.height },
  }));
}
