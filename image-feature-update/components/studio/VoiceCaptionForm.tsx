"use client";

import { useState } from "react";
import type { VoiceCaptionResult } from "@/lib/types";

const PLATFORM_OPTIONS = ["Facebook", "Instagram", "TikTok Hook", "Email"];

type ImageState = { loading: boolean; dataUrl?: string; error?: string };

export default function VoiceCaptionForm({ onSaved }: { onSaved: () => void }) {
  const [idea, setIdea] = useState("");
  const [context, setContext] = useState("");
  const [song, setSong] = useState("");
  const [platforms, setPlatforms] = useState<string[]>(PLATFORM_OPTIONS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<VoiceCaptionResult | null>(null);
  const [savedIndexes, setSavedIndexes] = useState<number[]>([]);
  const [images, setImages] = useState<Record<number, ImageState>>({});

  function togglePlatform(p: string) {
    setPlatforms((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));
  }

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    setSavedIndexes([]);
    setImages({});
    try {
      const res = await fetch("/api/agent/voice-caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea, context, song, platforms }),
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
    setImages((prev) => ({ ...prev, [index]: { loading: true } }));
    try {
      const res = await fetch("/api/agent/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "post-image", text: item.content }),
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
        name: `${result.idea_summary} — ${item.platform}`,
        platform: item.platform,
        content_type: "Caption",
        source: "Voice & Caption Agent",
        song: song || null,
        body: item.content,
        why_this_angle: item.why,
        needs_from_dee_dee: result.needs_from_dee_dee || null,
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
          <label className="mb-1 block text-sm font-medium text-wine-deep">Idea</label>
          <textarea
            required
            rows={3}
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="What did she tell you? e.g. she wants to talk about the pre-order going live"
            className="w-full rounded-lg border border-wine/15 bg-white px-4 py-3 focus:border-gold focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-wine-deep">
            Context <span className="font-normal text-wine-deep/50">(optional)</span>
          </label>
          <input
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Mood, occasion, timing..."
            className="w-full rounded-lg border border-wine/15 bg-white px-4 py-3 focus:border-gold focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-wine-deep">
            Song <span className="font-normal text-wine-deep/50">(optional)</span>
          </label>
          <input
            value={song}
            onChange={(e) => setSong(e.target.value)}
            placeholder="e.g. We Outside"
            className="w-full rounded-lg border border-wine/15 bg-white px-4 py-3 focus:border-gold focus:outline-none"
          />
        </div>
        <div>
          <span className="mb-2 block text-sm font-medium text-wine-deep">Platforms</span>
          <div className="flex flex-wrap gap-2">
            {PLATFORM_OPTIONS.map((p) => (
              <button
                type="button"
                key={p}
                onClick={() => togglePlatform(p)}
                className={`rounded-full border px-4 py-1.5 text-sm transition ${
                  platforms.includes(p)
                    ? "border-wine bg-wine text-cream"
                    : "border-wine/20 text-wine-deep/60 hover:border-wine/40"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <button
          type="submit"
          disabled={loading || platforms.length === 0}
          className="mt-2 w-fit rounded-full bg-wine px-7 py-3 font-medium text-cream transition hover:bg-wine-deep disabled:opacity-60"
        >
          {loading ? "Writing..." : "Generate posts"}
        </button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>

      <div>
        {!result && !loading && (
          <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-wine/20 p-8 text-center text-wine-deep/50">
            Generated posts will appear here.
          </div>
        )}
        {loading && (
          <div className="flex h-full items-center justify-center rounded-2xl border border-wine/10 bg-white/60 p-8 text-center text-wine-deep/60">
            Writing in her voice...
          </div>
        )}
        {result && (
          <div className="flex flex-col gap-4">
            <div className="rounded-xl border border-gold/30 bg-gold/10 px-4 py-3 text-sm text-wine-deep">
              <p>
                <strong>{result.idea_summary}</strong> &middot; Register {result.register_used}
              </p>
              {result.needs_from_dee_dee && (
                <p className="mt-1 text-wine-deep/70">Needs from Dee Dee: {result.needs_from_dee_dee}</p>
              )}
            </div>
            {result.items.map((item, i) => {
              const imgState = images[i];
              return (
                <div key={i} className="rounded-xl border border-wine/10 bg-white p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-wine-deep px-3 py-1 text-xs font-medium text-cream">
                      {item.platform}
                    </span>
                    <div className="flex gap-2">
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
                        {savedIndexes.includes(i) ? "Saved to queue" : "Save to queue"}
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
                      alt="Generated visual for this post"
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
