import { NextRequest, NextResponse } from "next/server";
import { runSongStoryAgent } from "@/lib/agents";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { song, transcript, notes } = body || {};

    if (!song || typeof song !== "string") {
      return NextResponse.json({ error: "song is required" }, { status: 400 });
    }
    if (!transcript || typeof transcript !== "string") {
      return NextResponse.json({ error: "transcript is required" }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY is not set on the server. Add it to .env.local and restart." },
        { status: 500 }
      );
    }

    const result = await runSongStoryAgent({ song, transcript, notes });
    return NextResponse.json(result);
  } catch (err: any) {
    console.error("song-story agent error", err);
    return NextResponse.json({ error: err?.message || "Agent failed" }, { status: 500 });
  }
}
