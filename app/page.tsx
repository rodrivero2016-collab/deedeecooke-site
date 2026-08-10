import type { Metadata } from "next";
import Link from "next/link";
import MailingListForm from "@/components/MailingListForm";
import TrackList from "@/components/TrackList";

const ALBUM_COVER =
  "https://images.zoogletools.com/s:bzglfiles/u/1320697/44f41a4a8e74f89072e75b042c80609fde92663e/original/unapologetically-me-album-cover.png/!!/b%3AW1sicmVzaXplIixbNjAwLG51bGwseyJ3aXRob3V0RW5sYXJnZW1lbnQiOnRydWUsImZpdCI6Im91dHNpZGUifV1dXQ%3D%3D/meta%3AeyJzcmNCdWNrZXQiOiJiemdsZmlsZXMifQ%3D%3D.png";

export const metadata: Metadata = {
  title: "Dee Dee Cooke | Soul, R&B & Southern Soul Artist",
  description:
    "Official site of Dee Dee Cooke, an Atlanta-based Soul, R&B and Southern Soul singer-songwriter. Listen to UnApologetically Me, pre-order the album, and book Dee Dee for your next show.",
};

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-wine-deep text-cream">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(201,151,63,0.18),transparent_45%),radial-gradient(circle_at_80%_60%,rgba(201,151,63,0.12),transparent_45%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:py-24 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-gold-light">
              Singer &middot; Songwriter &middot; Storyteller
            </p>
            <h1 className="font-display text-4xl leading-tight text-balance sm:text-5xl md:text-6xl">
              Every song has a story.
              <br />
              <span className="italic text-gold-light">Every story has a soul.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-cream/80">
              Dee Dee Cooke blends Soul, Southern Soul, R&amp;B, Reggae, Country Soul and Funk
              into honest, feel-good music rooted in real life. Her debut album,{" "}
              <em className="text-gold-light not-italic font-medium">UnApologetically Me</em>,
              releases August 21, 2026.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#music"
                className="rounded-full bg-gold px-7 py-3 font-medium text-wine-deep transition hover:bg-gold-light"
              >
                Pre-order the Album
              </a>
              <Link
                href="/booking"
                className="rounded-full border border-cream/40 px-7 py-3 font-medium text-cream transition hover:border-gold-light hover:text-gold-light"
              >
                Book Dee Dee
              </Link>
            </div>
          </div>
          <div className="justify-self-center">
            <img
              src={ALBUM_COVER}
              alt="UnApologetically Me — album cover by Dee Dee Cooke"
              width={420}
              height={420}
              className="w-72 rounded-2xl shadow-2xl shadow-black/40 ring-1 ring-gold/30 sm:w-96"
            />
          </div>
        </div>
      </section>

      {/* BIO */}
      <section id="bio" className="mx-auto max-w-3xl px-5 py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
          Singer &middot; Songwriter &middot; Storyteller
        </p>
        <h2 className="mt-3 font-display text-3xl text-wine-deep sm:text-4xl">Bio</h2>
        <div className="mt-6 space-y-5 text-[1.05rem] leading-relaxed text-wine-deep/90">
          <p>
            Born in Miami and now based in the Atlanta area, Dee Dee found her voice in the
            church and won her first talent competition at eleven. She developed her craft
            through school choirs and ensembles and later toured the East Coast with the
            Bethune-Cookman Concert Chorale. Along the way, she performed alongside Lou Rawls
            and Ray Charles and sang with the United Negro College Fund Choir under the
            direction of Cissy Houston.
          </p>
          <p>
            After years of performing, recording background vocals, and collaborating with
            artists across Atlanta, Dee Dee is stepping forward with her debut project,{" "}
            <em>UnApologetically Me</em>. The album brings together love, resilience, humor,
            family, heartbreak, getting older, and the freedom to dance &mdash; all delivered
            with the warmth, soul, and personality that define her sound.
          </p>
          <p className="font-display text-xl italic text-wine">
            Every song has a story. Every story has a soul.
          </p>
        </div>
      </section>

      {/* ALBUM / MUSIC */}
      <section id="music" className="bg-white/60 py-20">
        <div className="mx-auto grid max-w-5xl gap-12 px-5 md:grid-cols-[0.8fr_1.2fr]">
          <div>
            <img
              src={ALBUM_COVER}
              alt="UnApologetically Me album cover"
              width={400}
              height={400}
              className="w-full max-w-xs rounded-2xl shadow-lg"
            />
            <div className="mt-6">
              <h3 className="font-display text-2xl text-wine-deep">UnApologetically Me</h3>
              <p className="mt-1 text-wine-deep/60">Dee Dee Cooke &middot; Expected release: August 21, 2026</p>
              <p className="mt-4 text-wine-deep/80">
                A bold blend of R&amp;B, &ldquo;All the Souls&rdquo; (Country, Neo, Southern),
                reggae, a touch of Funk, and feel-good music. From confidence and love to
                heartbreak, family, and getting older, every song tells a real story with
                honesty, humor, and attitude.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <span className="font-display text-2xl text-wine-deep">$12.99</span>
                <span className="text-sm text-wine-deep/60">Pre-order download: $10.99</span>
              </div>
              <a
                href="#mailing-list"
                className="mt-6 inline-block rounded-full bg-wine px-7 py-3 font-medium text-cream transition hover:bg-wine-deep"
              >
                Pre-order Now
              </a>
            </div>
          </div>
          <div>
            <h4 className="mb-4 font-display text-xl text-wine-deep">Tracklist</h4>
            <TrackList />
          </div>
        </div>
      </section>

      {/* SUPPORT */}
      <section className="mx-auto max-w-3xl px-5 py-20 text-center">
        <h3 className="font-display text-2xl text-wine-deep sm:text-3xl">
          Want to Support the Journey?
        </h3>
        <p className="mx-auto mt-4 max-w-xl text-wine-deep/80">
          If you&rsquo;d like to support independent music, every tip helps me create new songs,
          record music, produce videos, and bring more original music to life. Thank you for
          being part of this journey. <span aria-hidden>❤️</span>
        </p>
        <button
          type="button"
          title="Payment processing not connected in this prototype — wire up Stripe or PayPal here for production."
          className="mt-6 rounded-full bg-gold px-8 py-3 font-medium text-wine-deep transition hover:bg-gold-light"
        >
          Tip Me
        </button>
      </section>

      {/* MAILING LIST */}
      <section id="mailing-list" className="bg-wine-deep py-16 text-cream">
        <div className="mx-auto max-w-2xl px-5 text-center">
          <h3 className="font-display text-2xl sm:text-3xl">Join the mailing list</h3>
          <p className="mt-3 text-cream/70">Get the latest news straight from Dee Dee.</p>
          <div className="mt-6 flex justify-center">
            <MailingListForm />
          </div>
        </div>
      </section>
    </>
  );
}
