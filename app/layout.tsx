import type { Metadata } from "next";
import { SiteNav, SiteFooter } from "@/components/SiteChrome";
import "./globals.css";

// Using system font stacks (defined in globals.css) rather than next/font/google.
// This keeps the build fully offline-capable (no fetch to fonts.googleapis.com
// required) and loads instantly with zero layout shift. If you'd rather use
// Fraunces/Inter from Google Fonts, next/font/google works great here too —
// just make sure the build environment has outbound internet access.

const SITE_URL = "https://deedeecooke.com";
const SITE_DESCRIPTION =
  "Official site of Dee Dee Cooke, an Atlanta-based Soul, R&B and Southern Soul singer-songwriter. Listen to UnApologetically Me, pre-order the album, and book Dee Dee for your next show.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Dee Dee Cooke | Soul, R&B & Southern Soul Artist",
    template: "%s | Dee Dee Cooke",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Dee Dee Cooke",
    "Southern Soul artist",
    "Soul singer Atlanta",
    "R&B singer songwriter",
    "UnApologetically Me album",
    "Atlanta soul music",
    "Southern soul music 2026",
    "independent soul artist",
  ],
  openGraph: {
    title: "Dee Dee Cooke | Soul, R&B & Southern Soul Artist",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: "Dee Dee Cooke",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dee Dee Cooke | Soul, R&B & Southern Soul Artist",
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: SITE_URL,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MusicGroup",
  name: "Dee Dee Cooke",
  genre: ["Soul", "R&B", "Southern Soul", "Reggae", "Funk"],
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Atlanta",
    addressRegion: "GA",
    addressCountry: "US",
  },
  album: {
    "@type": "MusicAlbum",
    name: "UnApologetically Me",
    datePublished: "2026-08-21",
    byArtist: "Dee Dee Cooke",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-cream text-foreground">
        <SiteNav />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
