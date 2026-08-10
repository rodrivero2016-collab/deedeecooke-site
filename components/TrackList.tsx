const TRACKS: { title: string; slug: string; duration: string }[] = [
  { title: "Take Flight", slug: "take-flight", duration: "0:45" },
  { title: "Thick Girl", slug: "thick-girl", duration: "0:44" },
  { title: "Let It Whip", slug: "let-it-whip", duration: "0:44" },
  { title: "How Ya Doin'", slug: "how-ya-doin", duration: "0:44" },
  { title: "Bossy Man", slug: "bossy-man", duration: "0:44" },
  { title: "Y It Take Me Leavin'", slug: "y-it-take-me-leavin", duration: "0:44" },
  { title: "Heated, Sexy, Crazy", slug: "heated-sexy-crazy", duration: "0:45" },
  { title: "We Outside", slug: "we-outside", duration: "0:44" },
  { title: "Mama's Song", slug: "mamas-song", duration: "0:44" },
  { title: "Ain't Fun Gettin' Old", slug: "aint-fun-gettin-old", duration: "0:43" },
];

// Visual tracklist. Wire real audio previews into <audio> elements here once
// master files are available — this component is a placeholder for that,
// matching the track order and titles from the album.
export default function TrackList() {
  return (
    <ol className="divide-y divide-wine/10 overflow-hidden rounded-2xl border border-wine/10 bg-white/60">
      {TRACKS.map((track, i) => (
        <li key={track.slug} className="flex items-center gap-4 px-5 py-4">
          <span className="w-6 shrink-0 font-display text-wine/50">{i + 1}</span>
          <span className="flex-1 font-medium text-wine-deep">{track.title}</span>
          <span className="text-sm text-wine-deep/50">{track.duration}</span>
        </li>
      ))}
    </ol>
  );
}
