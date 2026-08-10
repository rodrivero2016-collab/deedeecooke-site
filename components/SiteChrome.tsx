import Link from "next/link";

export function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-gold/20 bg-wine-deep/95 backdrop-blur supports-[backdrop-filter]:bg-wine-deep/90">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 text-cream">
        <Link href="/" className="font-display text-lg tracking-wide text-gold-light">
          Dee Dee Cooke
        </Link>
        <div className="flex items-center gap-6 text-sm">
          <Link href="/#bio" className="hover:text-gold-light transition-colors hidden sm:inline">
            Bio
          </Link>
          <Link href="/#music" className="hover:text-gold-light transition-colors hidden sm:inline">
            Music
          </Link>
          <Link href="/booking" className="hover:text-gold-light transition-colors">
            Booking &amp; Contact
          </Link>
          <Link href="/studio/login" className="hover:text-gold-light transition-colors">
            Studio
          </Link>
        </div>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-gold/20 bg-wine-deep text-cream/70">
      <div className="mx-auto max-w-6xl px-5 py-10 text-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display text-gold-light text-base">Dee Dee Cooke</p>
          <p>Atlanta, Georgia &middot; Soul &middot; R&amp;B &middot; Southern Soul</p>
        </div>
        <p className="mt-6 text-xs text-cream/50">
          &copy; {new Date().getFullYear()} Dee Dee Cooke. All rights reserved. Site prototype
          built by Apto Strategic Consulting.
        </p>
      </div>
    </footer>
  );
}
