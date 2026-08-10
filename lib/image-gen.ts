// Image generation via Google's Gemini API (gemini-2.5-flash-image, aka "Nano
// Banana"). Google's older Imagen model line is being retired, so this is
// built on the current recommended model rather than the deprecated one.
//
// Docs: https://ai.google.dev/gemini-api/docs/imagen
// Requires GOOGLE_API_KEY in the environment (separate from ANTHROPIC_API_KEY —
// get one at https://aistudio.google.com/apikey).

const MODEL = "gemini-2.5-flash-image";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

export type GeneratedImage = {
  mimeType: string;
  base64: string;
  dataUrl: string;
};

export async function generateImage(prompt: string): Promise<GeneratedImage> {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_API_KEY is not set on the server. Add it to .env.local and restart.");
  }

  const res = await fetch(`${ENDPOINT}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseModalities: ["IMAGE"] },
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Gemini image request failed (${res.status}): ${errText.slice(0, 300)}`);
  }

  const json = await res.json();
  const parts = json?.candidates?.[0]?.content?.parts || [];
  const imagePart = parts.find((p: any) => p.inlineData?.data);

  if (!imagePart) {
    throw new Error("Gemini did not return an image. Try a different prompt.");
  }

  const mimeType = imagePart.inlineData.mimeType || "image/png";
  const base64 = imagePart.inlineData.data;
  return { mimeType, base64, dataUrl: `data:${mimeType};base64,${base64}` };
}

// Builds a prompt for a lyric-graphic-style Instagram card: short text,
// on-brand colors, no extra clutter. Note: AI image models render text
// unreliably — treat the output as a starting point, not a finished asset,
// and expect to occasionally regenerate or touch up text by hand.
export function lyricGraphicPrompt(lyricLine: string, song?: string): string {
  return `A minimalist, elegant square Instagram graphic card for an independent soul/R&B artist. Warm color palette of deep wine red (#4a1023), gold (#c9973f), and cream (#faf5ef). Sophisticated, editorial typography. The card displays this short line of text, large and centered: "${lyricLine}"${song ? ` (from the song "${song}")` : ""}. No other text, no logos, no watermarks, no extra graphics. Clean, warm, Southern soul aesthetic. High contrast, legible text.`;
}

// Builds a prompt for a general mood/scene image to accompany a post —
// no text rendered in the image.
export function postImagePrompt(description: string): string {
  return `A warm, soulful photograph-style image capturing this mood or moment: ${description}. Southern soul and R&B aesthetic, warm golden and wine-red tones, Atlanta feel, authentic and real rather than glossy or corporate. No text or words anywhere in the image.`;
}
