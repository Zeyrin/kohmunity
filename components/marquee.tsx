/**
 * Two counter-rotating tape strips. Pure CSS animation on a duplicated track (translate −50%),
 * so it's compositor-only and keeps running even if JS never loads. Reduced motion → static.
 */
const lineA = ["Come alone", "Free yoga every morning", "Family dinner Wednesdays", "100 m to the beach", "Music off at midnight. The island isn’t"];
const lineB = ["Full Moon pre-party", "Beer pong champions", "Sunset pool party", "18–40 only", "Your new group chat"];

function Tape({ items, reverse, className }: { items: string[]; reverse?: boolean; className: string }) {
  const row = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((t) => (
        <span key={t} className="display flex items-center whitespace-nowrap px-5 text-2xl md:text-4xl">
          {t}
          <span className="pl-10 text-[0.8em]" aria-hidden="true">
            ✺
          </span>
        </span>
      ))}
    </div>
  );
  return (
    <div className={`overflow-hidden py-3 ${className}`}>
      <div
        className="marquee-track flex w-max"
        style={{ animationDirection: reverse ? "reverse" : "normal", ["--marquee-duration" as string]: "40s" }}
      >
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}

export function Marquee() {
  return (
    <div className="relative z-10 -my-6 overflow-hidden py-10" role="presentation">
      <Tape items={lineA} className="-rotate-3 bg-accent text-on-accent" />
      <Tape items={lineB} reverse className="-mt-4 rotate-2 bg-accent-2 text-night" />
    </div>
  );
}
