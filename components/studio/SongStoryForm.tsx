"use client";

import { useState } from "react";
import type { SongStoryResult } from "@/lib/types";

type ImageState = { loading: boolean; dataUrl?: string; error?: string };

export default function SongStoryForm({ onSaved }: { onSaved: () => void }) {
  const [song, setSong] = useState("");
  const [transcript, setTranscript] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<SongStoryResult | null>(null);
  const [savedIndexes, setSavedIndexes] = useState<number[]>([]);
  const [images, setImages] = useState<Record<number, ImageState>>({});

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    setSavedIndexes([]);
    setImages({});
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

  async function generateImageFor(index: number) {
    if (!result) return;
    const item = result.items[index];
    const isLyricGraphic = item.content_type === "Lyric Graphic";
    setImages((prev) => ({ ...prev, [index]: { loading: true } }));
    try {
      const res = await fetch("/api/agent/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: isLyricGraphic ? "lyric-graphic" : "post-image",
          text: item.content,
          song: result.song,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Image generation failed");
      setImages((prev) => ({ ...prev, [index]: { loading: false, dataUrl: data.dataUrl } }));
    } catch (err: any) {
      setImages((prev) => ({ ...prev, [index]: { loading: false, error: err.message } }));
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
        image_data: images[index]?.dataUrl || null,
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
            {result.items.map((item, i) => {
              const imgState = images[i];
              return (
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
                    <div className="flex shrink-0 gap-2">
                      <button
                        onClick={() => generateImageFor(i)}
                        disabled={imgState?.loading}
                        className="rounded-full border border-wine/20 px-3 py-1 text-xs font-medium text-wine-deep transition hover:border-wine disabled:opacity-50"
                      >
                        {imgState?.loading ? "Generating image..." : imgState?.dataUrl ? "Regenerate image" : "Generate image"}
                      </button>
                      <button
                        onClick={() => saveItem(i)}
                        disabled={savedIndexes.includes(i)}
                        className="rounded-full border border-wine/20 px-3 py-1 text-xs font-medium text-wine-deep transition hover:border-wine disabled:opacity-50"
                      >
                        {savedIndexes.includes(i) ? "Saved" : "Save to queue"}
                      </button>
                    </div>
                  </div>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-wine-deep/90">
                    {item.content}
                  </p>
                  <p className="mt-2 text-xs italic text-wine-deep/50">{item.why}</p>
                  {imgState?.error && <p className="mt-2 text-xs text-red-600">{imgState.error}</p>}
                  {imgState?.dataUrl && (
                    <img
                      src={imgState.dataUrl}
                      alt={item.content_type === "Lyric Graphic" ? "Generated lyric graphic" : "Generated visual for this post"}
                      className="mt-3 w-full max-w-sm rounded-lg border border-wine/10"
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
