"use client";

import { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", eventDetails: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-2xl border border-wine/10 bg-white/70 p-8 text-center">
        <p className="font-display text-xl text-wine-deep">Message sent.</p>
        <p className="mt-2 text-wine-deep/70">Thank you for reaching out. I&rsquo;ll be in touch soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-wine-deep">
            Name
          </label>
          <input
            id="name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-lg border border-wine/15 bg-white px-4 py-3 focus:border-gold focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-wine-deep">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-lg border border-wine/15 bg-white px-4 py-3 focus:border-gold focus:outline-none"
          />
        </div>
      </div>
      <div>
        <label htmlFor="eventDetails" className="mb-1 block text-sm font-medium text-wine-deep">
          Event details <span className="font-normal text-wine-deep/50">(date, venue, city — optional)</span>
        </label>
        <input
          id="eventDetails"
          value={form.eventDetails}
          onChange={(e) => setForm({ ...form, eventDetails: e.target.value })}
          className="w-full rounded-lg border border-wine/15 bg-white px-4 py-3 focus:border-gold focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="message" className="mb-1 block text-sm font-medium text-wine-deep">
          Message
        </label>
        <textarea
          id="message"
          required
          rows={5}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full rounded-lg border border-wine/15 bg-white px-4 py-3 focus:border-gold focus:outline-none"
        />
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-fit rounded-full bg-wine px-8 py-3 font-medium text-cream transition hover:bg-wine-deep disabled:opacity-60"
      >
        {status === "loading" ? "Sending..." : "Send message"}
      </button>
      {status === "error" && <p className="text-sm text-red-600">Something went wrong. Try again.</p>}
    </form>
  );
}
