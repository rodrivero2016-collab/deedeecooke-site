"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import VoiceCaptionForm from "./VoiceCaptionForm";
import SongStoryForm from "./SongStoryForm";
import QueueView from "./QueueView";

type Tab = "voice-caption" | "song-story" | "queue";

export default function StudioApp() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("queue");
  const [refreshKey, setRefreshKey] = useState(0);

  async function handleLogout() {
    await fetch("/api/studio-login", { method: "DELETE" });
    router.push("/studio/login");
    router.refresh();
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "queue", label: "Content Queue" },
    { id: "voice-caption", label: "Voice & Caption Agent" },
    { id: "song-story", label: "Song Story Agent" },
  ];

  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Private</p>
          <h1 className="mt-1 font-display text-3xl text-wine-deep">Content Studio</h1>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-full border border-wine/20 px-4 py-2 text-sm text-wine-deep/70 hover:border-wine/40"
        >
          Log out
        </button>
      </div>

      <div className="mt-8 flex flex-wrap gap-2 border-b border-wine/10 pb-4">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              tab === t.id
                ? "bg-wine-deep text-cream"
                : "text-wine-deep/60 hover:bg-wine-deep/5"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === "queue" && <QueueView refreshKey={refreshKey} />}
        {tab === "voice-caption" && (
          <VoiceCaptionForm onSaved={() => setRefreshKey((k) => k + 1)} />
        )}
        {tab === "song-story" && <SongStoryForm onSaved={() => setRefreshKey((k) => k + 1)} />}
      </div>
    </div>
  );
}
