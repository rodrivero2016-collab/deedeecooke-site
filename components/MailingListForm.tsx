"use client";

import { useState } from "react";

export default function MailingListForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/mailing-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <p className="text-gold-light">You&rsquo;re on the list. Thank you for being part of this journey.</p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <label htmlFor="mailing-email" className="sr-only">
        Email address
      </label>
      <input
        id="mailing-email"
        type="email"
        required
        placeholder="Your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded-full border border-cream/30 bg-transparent px-5 py-3 text-cream placeholder:text-cream/50 focus:border-gold-light focus:outline-none sm:max-w-xs"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-full bg-gold px-6 py-3 font-medium text-wine-deep transition hover:bg-gold-light disabled:opacity-60"
      >
        {status === "loading" ? "Signing up..." : "Sign up"}
      </button>
      {status === "error" && (
        <p className="text-sm text-red-300 sm:ml-2">Something went wrong. Try again.</p>
      )}
    </form>
  );
}
