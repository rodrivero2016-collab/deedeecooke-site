"use client";

import { useEffect, useState } from "react";
import type { QueueItem, QueueStatus } from "@/lib/types";

const STATUSES: QueueStatus[] = ["Needs Review", "Approved", "Needs Changes", "Posted"];

const STATUS_COLORS: Record<QueueStatus, string> = {
  "Needs Review": "bg-amber-100 text-amber-800 border-amber-300",
  Approved: "bg-green-100 text-green-800 border-green-300",
  "Needs Changes": "bg-red-100 text-red-800 border-red-300",
  Posted: "bg-gray-100 text-gray-600 border-gray-300",
};

export default function QueueView({ refreshKey }: { refreshKey: number }) {
  const [items, setItems] = useState<QueueItem[]>([]);
  const [filter, setFilter] = useState<QueueStatus | "All">("Needs Review");
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/queue");
    const data = await res.json();
    setItems(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  async function updateStatus(id: string, status: QueueStatus) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, status } : it)));
    await fetch(`/api/queue/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  async function updateNotes(id: string, notes: string) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, notes } : it)));
    await fetch(`/api/queue/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes }),
    });
  }

  async function remove(id: string) {
    setItems((prev) => prev.filter((it) => it.id !== id));
    await fetch(`/api/queue/${id}`, { method: "DELETE" });
  }

  const visible = filter === "All" ? items : items.filter((it) => it.status === filter);

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {(["All", ...STATUSES] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full border px-4 py-1.5 text-sm transition ${
              filter === s
                ? "border-wine bg-wine text-cream"
                : "border-wine/20 text-wine-deep/60 hover:border-wine/40"
            }`}
          >
            {s}
            {s !== "All" && (
              <span className="ml-1 opacity-60">({items.filter((it) => it.status === s).length})</span>
            )}
          </button>
        ))}
      </div>

      {loading && <p className="text-wine-deep/50">Loading...</p>}
      {!loading && visible.length === 0 && (
        <p className="rounded-xl border border-dashed border-wine/20 p-8 text-center text-wine-deep/50">
          Nothing here yet.
        </p>
      )}

      <div className="flex flex-col gap-3">
        {visible.map((item) => (
          <div key={item.id} className="rounded-xl border border-wine/10 bg-white p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium text-wine-deep">{item.name}</p>
                <p className="mt-1 flex flex-wrap gap-2 text-xs text-wine-deep/50">
                  <span>{item.platform}</span>
                  <span>&middot;</span>
                  <span>{item.content_type}</span>
                  <span>&middot;</span>
                  <span>{item.source}</span>
                  {item.song && (
                    <>
                      <span>&middot;</span>
                      <span>{item.song}</span>
                    </>
                  )}
                </p>
              </div>
              <span
                className={`rounded-full border px-3 py-1 text-xs font-medium ${STATUS_COLORS[item.status]}`}
              >
                {item.status}
              </span>
            </div>

            <button
              onClick={() => setExpanded(expanded === item.id ? null : item.id)}
              className="mt-3 text-sm text-wine underline underline-offset-2"
            >
              {expanded === item.id ? "Hide" : "View post"}
            </button>

            {expanded === item.id && (
              <div className="mt-3 flex flex-col gap-3">
                <p className="whitespace-pre-wrap rounded-lg bg-cream p-3 text-sm text-wine-deep/90">
                  {item.body}
                </p>
                {item.image_data && (
                  <img
                    src={item.image_data}
                    alt="Generated visual for this post"
                    className="w-full max-w-sm rounded-lg border border-wine/10"
                  />
                )}
                {item.why_this_angle && (
                  <p className="text-xs italic text-wine-deep/50">Why: {item.why_this_angle}</p>
                )}
                {item.her_best_line && (
                  <p className="text-xs italic text-wine-deep/50">
                    Best line: &ldquo;{item.her_best_line}&rdquo;
                  </p>
                )}
                {item.needs_from_dee_dee && (
                  <p className="text-xs text-red-600">Needs from Dee Dee: {item.needs_from_dee_dee}</p>
                )}

                <div className="flex flex-wrap items-center gap-2">
                  <label className="text-xs font-medium text-wine-deep/60">Status:</label>
                  <select
                    value={item.status}
                    onChange={(e) => updateStatus(item.id, e.target.value as QueueStatus)}
                    className="rounded-lg border border-wine/20 px-3 py-1.5 text-sm"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => remove(item.id)}
                    className="ml-auto rounded-full border border-red-200 px-3 py-1 text-xs text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-wine-deep/60">
                    Dee Dee&rsquo;s notes
                  </label>
                  <textarea
                    defaultValue={item.notes || ""}
                    onBlur={(e) => updateNotes(item.id, e.target.value)}
                    rows={2}
                    placeholder="If this needs changes, what's off?"
                    className="w-full rounded-lg border border-wine/15 bg-white px-3 py-2 text-sm focus:border-gold focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
