import { NextRequest, NextResponse } from "next/server";
import { runVoiceCaptionAgent } from "@/lib/agents";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { idea, context, platforms, song } = body || {};

    if (!idea || typeof idea !== "string") {
      return NextResponse.json({ error: "idea is required" }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY is not set on the server. Add it to .env.local and restart." },
        { status: 500 }
      );
    }

    const result = await runVoiceCaptionAgent({ idea, context, platforms, song });
    return NextResponse.json(result);
  } catch (err: any) {
    console.error("voice-caption agent error", err);
    return NextResponse.json({ error: err?.message || "Agent failed" }, { status: 500 });
  }
}
