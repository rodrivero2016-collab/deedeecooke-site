import { NextRequest, NextResponse } from "next/server";
import { generateImage, lyricGraphicPrompt, postImagePrompt } from "@/lib/image-gen";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mode, text, song } = body || {};

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "text is required" }, { status: 400 });
    }

    if (!process.env.GOOGLE_API_KEY) {
      return NextResponse.json(
        { error: "GOOGLE_API_KEY is not set on the server. Add it to .env.local and restart." },
        { status: 500 }
      );
    }

    const prompt = mode === "lyric-graphic" ? lyricGraphicPrompt(text, song) : postImagePrompt(text);
    const image = await generateImage(prompt);

    return NextResponse.json({ dataUrl: image.dataUrl });
  } catch (err: any) {
    console.error("generate-image error", err);
    return NextResponse.json({ error: err?.message || "Image generation failed" }, { status: 500 });
  }
}
