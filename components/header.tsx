import { site } from "@/content/config";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-3 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] md:px-8 md:pt-6">
      <a
        href="#top"
        className="display pointer-events-auto text-base tracking-tight text-cream mix-blend-difference md:text-xl"
        aria-label={`${site.name} — back to top`}
      >
        Kohmunity
      </a>
      <div className="pointer-events-auto flex items-center gap-2">
        <ThemeToggle />
        <a href={site.bookingUrl} className="cta !min-h-11 !px-4 !text-xs" data-magnetic>
          Book
        </a>
      </div>
    </header>
  );
}
