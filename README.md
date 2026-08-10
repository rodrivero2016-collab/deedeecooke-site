# Dee Dee Cooke — Website Prototype

A prototype website for Dee Dee Cooke that mirrors the content and warmth of her live site
(deedeecooke.com) and adds a private, password-protected **Content Studio** where the two
AI agents from the Apto pilot (Voice & Caption Agent and Song Story Agent) run directly on
the site's own backend — no Notion, no Make.com, no third-party automation tools.

Built with Next.js (App Router, TypeScript, Tailwind CSS v4), a SQLite content queue, and
the Anthropic API.

**Status: this is a demo/prototype to show Dee Dee, not a live replacement for
deedeecooke.com.** It is not wired to real payment processing (album sales, tips) —
see "Going to production" below for what that would take.

---

## What's included

**Public site**
- `/` — Hero, bio, album showcase with tracklist, support/tip section, mailing list signup
- `/booking` — Booking & contact form
- SEO: per-page metadata, Open Graph/Twitter cards, `MusicGroup`/`MusicAlbum` JSON-LD
  structured data, sitemap.xml, robots.txt (private studio excluded from indexing)

**Private Content Studio** (`/studio`, password-protected)
- **Voice & Caption Agent** — turn one idea into finished Facebook/Instagram/TikTok/Email posts
- **Song Story Agent** — turn a rambling voice memo or note about one song into a full
  story set (three story versions, three hooks, a to-camera script, lyric graphic copy,
  and an audience question)
- **Content Queue** — replaces the old Notion database entirely. Save any generated post,
  filter by status (Needs Review / Approved / Needs Changes / Posted), add notes, delete.

**Backend**
- `app/api/agent/voice-caption`, `app/api/agent/song-story` — call Claude with the two
  system prompts (`lib/agents.ts`, sourced from the shared voice profile in `lib/voice-profile.ts`)
- `app/api/queue` — the content queue (SQLite via `better-sqlite3`, see `lib/db.ts`)
- `app/api/mailing-list`, `app/api/contact` — capture form submissions
- `app/api/studio-login` — password auth for `/studio`, signed session cookie
  (`lib/auth.ts`, `middleware.ts`)

---

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment variables** — copy the example file and fill in real values:

   ```bash
   cp .env.local.example .env.local
   ```

   | Variable | What it's for |
   |---|---|
   | `ANTHROPIC_API_KEY` | Powers both agents. Get one at [console.anthropic.com](https://console.anthropic.com/) |
   | `STUDIO_PASSWORD` | The password to log into `/studio` |
   | `SESSION_SECRET` | Any long random string, used to sign the login cookie |

3. **Run it locally**

   ```bash
   npm run dev
   ```

   Visit `http://localhost:3000` for the public site, `http://localhost:3000/studio` for
   the Content Studio.

4. **Build for production**

   ```bash
   npm run build
   npm start
   ```

---

## Deploying

The easiest path is **Vercel** (same company that makes Next.js, free tier is enough for a demo):

1. Push this project to a GitHub repo.
2. Import it at [vercel.com/new](https://vercel.com/new).
3. Add the three environment variables from `.env.local` in Vercel's project settings.
4. Deploy.

**One important limitation on Vercel:** the Content Queue uses a local SQLite file
(`data/content-queue.db`). Vercel's serverless functions have a read-only, ephemeral
filesystem, so queue data **will not persist** between requests once deployed there.
For the demo/pitch, this is usually fine — you can run it locally or on a host with a
persistent disk (Render, Railway, Fly.io, a basic VPS) to keep data between sessions.
For real production use, swap `lib/db.ts` for a hosted database — Supabase or Neon
(Postgres, both have free tiers) are the least amount of rework since the queries are
already simple and centralized in that one file.

---

## Going to production (replacing deedeecooke.com for real)

This prototype intentionally leaves a few things unconnected so it could be built and
verified quickly. To become the real site:

- **Payments:** the "Tip Me" button and album pre-order are currently non-functional
  placeholders. Wire up Stripe or PayPal.
- **Mailing list:** currently just saves emails to the local database. Connect a real
  ESP (Mailchimp, ConvertKit, Flodesk) in `app/api/mailing-list/route.ts`.
- **Contact form:** currently just saves to the local database. Add a real email
  notification (Resend, SendGrid, Postmark) in `app/api/contact/route.ts` so messages
  don't get missed.
- **Audio:** the tracklist is a visual placeholder (`components/TrackList.tsx`) — no
  audio files are included. Add real preview clips as `<audio>` sources once masters
  are available.
- **Photos:** the hero/album images currently link directly to the album cover already
  hosted on Dee Dee's live site. Replace with self-hosted, optimized images before launch.
- **Database:** see the Vercel note above — move off local SQLite for anything long-lived.
- **Domain:** point deedeecooke.com's DNS at the new deployment once everyone's ready
  to cut over, and export/migrate the mailing list and any content from Bandzoogle first.

---

## Project structure

```
app/
  page.tsx                Home page
  booking/page.tsx         Booking & Contact
  studio/                  Private Content Studio (auth-gated)
  api/
    agent/voice-caption/    Voice & Caption Agent endpoint
    agent/song-story/       Song Story Agent endpoint
    queue/                  Content Queue CRUD
    mailing-list/           Mailing list capture
    contact/                Contact form capture
    studio-login/           Studio auth
components/
  SiteChrome.tsx           Nav + footer
  MailingListForm.tsx, ContactForm.tsx, TrackList.tsx
  studio/                  Content Studio UI (forms + queue view)
lib/
  agents.ts                Both agent system prompts + Claude API calls
  voice-profile.ts         Shared voice profile (source of truth for both agents)
  db.ts                    SQLite schema and connection
  auth.ts                  Studio session auth (Edge-Runtime-safe)
  types.ts                 Shared TypeScript types
middleware.ts               Protects /studio and the agent/queue APIs
```

To update how the agents write in Dee Dee's voice, edit `lib/voice-profile.ts` — both
agents read from it, so you only need to update it in one place.
