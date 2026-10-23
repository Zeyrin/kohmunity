import type { ReactNode } from "react";

/** Consistent "zine" section opener: numbered mono label, giant display line, serif aside. */
export function SectionHeading({
  index,
  label,
  id,
  children,
  aside,
}: {
  index: string;
  label: string;
  id: string;
  children: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <header className="px-4 md:px-12">
      <p className="label flex items-center gap-3 text-ink-dim">
        <span className="text-accent">{index}</span>
        <span className="h-px w-10 bg-line" aria-hidden="true" />
        {label}
      </p>
      <h2 id={id} className="display mt-4 text-[15vw] text-ink md:text-[8.5vw]">
        {children}
      </h2>
      {aside ? <p className="serif-accent mt-2 text-2xl text-accent md:text-4xl">{aside}</p> : null}
    </header>
  );
}
