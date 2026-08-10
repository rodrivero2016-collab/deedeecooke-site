"use client";

import { useState } from "react";
import type { SongStoryResult } from "@/lib/types";

export default function SongStoryForm({ onSaved }: { onSaved: () => void }) {
  const [song, setSong] = useState("");
  const [transcript, setTranscript] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<SongStoryResult | null>(null);
  const [savedIndexes, setSavedIndexes] = useState<number[]>([]);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    setSavedIndexes([]);
    try {
      const res = await fetch("/api/agent/song-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ song, transcript, notes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function saveItem(index: number) {
    if (!result) return;
    const item = result.items[index];
    await fetch("/api/queue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: `${result.song} — ${item.content_type} (${item.platform})`,
        platform: item.platform,
        content_type: item.content_type,
        source: "Song Story Agent",
        song: result.song,
        body: item.content,
        why_this_angle: item.why,
        needs_from_dee_dee: result.needs_from_dee_dee || null,
        her_best_line: result.her_best_line || null,
      }),
    });
    setSavedIndexes((prev) => [...prev, index]);
    onSaved();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form onSubmit={handleGenerate} className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-wine-deep">Song</label>
          <input
            required
            value={song}
            onChange={(e) => setSong(e.target.value)}
            placeholder="e.g. Mama's Song"
            className="w-full rounded-lg border border-wine/15 bg-white px-4 py-3 focus:border-gold focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-wine-deep">
            What Dee Dee said <span className="font-normal text-wine-deep/50">(paste transcript or notes)</span>
          </label>
          <textarea
            required
            rows={8}
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Paste the voice memo transcript or her rambling notes about this song here. The more specific and unpolished, the better."
            className="w-full rounded-lg border border-wine/15 bg-white px-4 py-3 focus:border-gold focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-wine-deep">
            Additional notes <span className="font-normal text-wine-deep/50">(optional)</span>
          </label>
          <input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-lg border border-wine/15 bg-white px-4 py-3 focus:border-gold focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-fit rounded-full bg-wine px-7 py-3 font-medium text-cream transition hover:bg-wine-deep disabled:opacity-60"
        >
          {loading ? "Finding the story..." : "Generate story set"}
        </button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>

      <div>
        {!result && !loading && (
          <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-wine/20 p-8 text-center text-wine-deep/50">
            The full story set (Facebook, Instagram, TikTok, hooks, script, lyric graphic,
            audience question) will appear here.
          </div>
        )}
        {loading && (
          <div className="flex h-full items-center justify-center rounded-2xl border border-wine/10 bg-white/60 p-8 text-center text-wine-deep/60">
            Reading between the lines...
          </div>
        )}
        {result && (
          <div className="flex flex-col gap-4">
            <div className="rounded-xl border border-gold/30 bg-gold/10 px-4 py-3 text-sm text-wine-deep">
              <p>
                <strong>{result.song}</strong> &middot; Register {result.register_used}
              </p>
              <p className="mt-1 text-wine-deep/70">{result.story_summary}</p>
              {result.her_best_line && (
                <p className="mt-1 italic text-wine-deep/70">&ldquo;{result.her_best_line}&rdquo;</p>
              )}
              {result.needs_from_dee_dee && (
                <p className="mt-1 text-wine-deep/70">Needs from Dee Dee: {result.needs_from_dee_dee}</p>
              )}
            </div>
            {result.items.map((item, i) => (
              <div key={i} className="rounded-xl border border-wine/10 bg-white p-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-wine-deep px-3 py-1 text-xs font-medium text-cream">
                      {item.platform}
                    </span>
                    <span className="rounded-full border border-wine/20 px-3 py-1 text-xs text-wine-deep/70">
                      {item.content_type}
                    </span>
                  </div>
                  <button
                    onClick={() => saveItem(i)}
                    disabled={savedIndexes.includes(i)}
                    className="shrink-0 rounded-full border border-wine/20 px-3 py-1 text-xs font-medium text-wine-deep transition hover:border-wine disabled:opacity-50"
                  >
                    {savedIndexes.includes(i) ? "Saved" : "Save to queue"}
                  </button>
                </div>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-wine-deep/90">
                  {item.content}
                </p>
                <p className="mt-2 text-xs italic text-wine-deep/50">{item.why}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
