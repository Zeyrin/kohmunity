import Link from "next/link";
import { site } from "@/content/config";
import { MoonSvg } from "../hero/moon";
import { FooterMotion } from "./footer-motion";

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}
function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" fill="currentColor" aria-hidden="true">
      <path d="M16.6 3c.4 2.2 1.9 3.8 4.1 4v3.2c-1.5 0-2.9-.4-4.1-1.2v6.3a5.8 5.8 0 1 1-5.8-5.8c.3 0 .6 0 .9.1v3.3a2.6 2.6 0 1 0 1.8 2.4V3h3.1Z" />
    </svg>
  );
}

export function Footer() {
  const lines = ["See you", "under", "the moon"];
  return (
    <footer id="footer" aria-labelledby="footer-title" className="relative overflow-hidden pb-10 pt-24 md:pt-36">
      {/* UV horizon glow */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[80%]"
        style={{ background: "radial-gradient(120% 70% at 50% 100%, rgb(139 92 255 / .35), rgb(255 47 179 / .12) 45%, transparent 70%)" }}
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute right-[-12vw] top-10 w-[46vw] opacity-90 md:right-[6vw] md:top-16 md:w-[22vw]" aria-hidden="true">
        <MoonSvg fraction={1} pathId="footer-moon" />
      </div>

      <h2 id="footer-title" className="display relative px-3 text-[19vw] leading-[0.8] text-ink md:px-10 md:text-[15.5vw]">
        {lines.map((l, i) => (
          <span key={l} data-footer-line className={`block ${i === 1 ? "serif-accent pl-[8vw] text-accent" : ""} ${i === 2 ? "glow" : ""}`}>
            {l}
          </span>
        ))}
      </h2>

      <div className="relative mt-14 grid gap-12 px-4 md:mt-20 md:grid-cols-3 md:gap-10 md:px-12">
        {/* book */}
        <div>
          <p className="label text-ink-dim">Book direct</p>
          <ul className="mt-4 space-y-2 font-mono text-sm text-ink">
            {site.bookDirectPerks.map((perk) => (
              <li key={perk} className="flex gap-2">
                <span className="text-accent" aria-hidden="true">✺</span>
                {perk}
              </li>
            ))}
          </ul>
          <a href={site.bookingUrl} className="cta mt-6 text-base" data-magnetic>
            Grab a bed <span aria-hidden="true">→</span>
          </a>
        </div>

        {/* find us */}
        <div>
          <p className="label text-ink-dim">Find us</p>
          <address className="mt-4 font-mono text-sm not-italic leading-relaxed text-ink">
            {site.legalName}
            <br />
            {site.location.area}, Thailand
          </address>
          {/* route diagram instead of a heavy map embed */}
          <ol className="mt-5 flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-wider text-ink-dim" aria-label="Distances">
            <li>Pier</li>
            <li aria-hidden="true" className="h-px flex-1 border-t border-dashed border-line" />
            <li className="text-accent">5 min</li>
            <li aria-hidden="true" className="h-px flex-1 border-t border-dashed border-line" />
            <li className="display rounded-full bg-accent px-2 py-1 text-[0.6rem] text-on-accent">Us</li>
            <li aria-hidden="true" className="h-px flex-1 border-t border-dashed border-line" />
            <li className="text-accent">100 m</li>
            <li aria-hidden="true" className="h-px flex-1 border-t border-dashed border-line" />
            <li>Beach</li>
          </ol>
          <ul className="mt-4 space-y-1 font-mono text-xs text-ink-dim">
            {site.location.facts.map((f) => (
              <li key={f}>— {f}</li>
            ))}
          </ul>
          <a
            href={site.location.mapsUrl}
            target="_blank"
            rel="noopener"
            className="label mt-5 inline-flex min-h-11 items-center gap-2 border-b border-accent pb-1 text-ink hover:text-accent"
          >
            Open in Google Maps ↗
          </a>
        </div>

        {/* follow */}
        <div>
          <p className="label text-ink-dim">Stalk us first</p>
          <ul className="mt-4 space-y-3">
            {[
              { ...site.socials.instagram, name: "Instagram", Icon: InstagramIcon },
              { ...site.socials.tiktok, name: "TikTok", Icon: TikTokIcon },
            ].map(({ url, handle, name, Icon }) => (
              <li key={name}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener"
                  className="group flex min-h-11 items-center gap-3 text-ink"
                  aria-label={`${name} ${handle}`}
                  data-magnetic
                >
                  <span className="grid size-12 place-items-center rounded-full border border-line transition-colors group-hover:border-accent group-hover:text-accent">
                    <Icon />
                  </span>
                  <span className="display text-lg group-hover:text-accent">{handle}</span>
                </a>
              </li>
            ))}
          </ul>
          <Link href="/full-moon-party-dates" className="label mt-6 inline-flex min-h-11 items-center gap-2 border-b border-accent pb-1 text-ink hover:text-accent">
            Every Full Moon Party date →
          </Link>
        </div>
      </div>

      <div className="relative mt-16 flex flex-col gap-2 border-t border-line px-4 pt-6 font-mono text-[0.7rem] text-ink-dim md:flex-row md:justify-between md:px-12">
        <p>
          © {site.legalName} · Ages {site.policies.ages} · Check-in {site.policies.checkIn}
        </p>
        <p>Made on an island with questionable Wi-Fi 🌴</p>
      </div>
      <FooterMotion />
    </footer>
  );
}
