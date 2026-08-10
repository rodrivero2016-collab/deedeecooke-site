"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function StudioLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/studio-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Incorrect password");
        setLoading(false);
        return;
      }
      router.push("/studio");
      router.refresh();
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-5 py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Private</p>
      <h1 className="mt-3 font-display text-3xl text-wine-deep">Content Studio</h1>
      <p className="mt-2 text-sm text-wine-deep/60">
        This area is not linked from the public site and is blocked from search engines.
      </p>
      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <input
          type="password"
          required
          autoFocus
          placeholder="Studio password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-wine/15 bg-white px-4 py-3 focus:border-gold focus:outline-none"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-wine px-6 py-3 font-medium text-cream transition hover:bg-wine-deep disabled:opacity-60"
        >
          {loading ? "Checking..." : "Enter"}
        </button>
      </form>
    </div>
  );
}
