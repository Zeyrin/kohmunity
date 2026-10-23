import Link from "next/link";
import { site } from "@/content/config";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-3 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] md:px-8 md:pt-6">
      <Link
        href="/"
        className="display pointer-events-auto flex h-11 items-center rounded-full border border-line bg-bg-2/80 px-4 text-sm tracking-tight text-ink backdrop-blur-md md:text-base"
        aria-label={`${site.name} — home`}
      >
        Kohmunity
      </Link>
      <div className="pointer-events-auto flex items-center gap-2">
        <ThemeToggle />
        <a href={site.bookingUrl} className="cta !min-h-11 !px-4 !text-xs" data-magnetic>
          Book
        </a>
      </div>
    </header>
  );
}
