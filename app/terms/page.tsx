import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/content/config";
import { terms, termsUpdated } from "@/content/terms";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: `Booking terms, cancellation policy and house rules at ${site.legalName}, ${site.location.area}.`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <main id="main" className="px-4 pb-24 pt-28 md:px-12 md:pt-36">
      <nav aria-label="Breadcrumb" className="label text-ink-dim">
        <Link href="/" className="hover:text-accent">
          {site.name}
        </Link>{" "}
        / Terms &amp; Conditions
      </nav>

      <h1 className="display mt-6 text-[13vw] text-ink md:text-[7vw]">
        Terms &amp; <span className="text-accent glow">conditions</span>
      </h1>
      <p className="serif-accent mt-3 text-2xl text-accent-2 md:text-4xl">The boring bit. Read it anyway.</p>
      <p className="label mt-4 text-ink-dim">Last updated {termsUpdated}</p>

      <div className="mt-12 max-w-3xl space-y-12">
        {terms.map((section, i) => (
          <section key={section.title} aria-labelledby={`terms-${i}`}>
            <h2 id={`terms-${i}`} className="display text-2xl text-ink md:text-4xl">
              <span className="text-accent">{String(i + 1).padStart(2, "0")}</span> {section.title}
            </h2>
            <ul className="mt-4 space-y-2 font-mono text-sm leading-relaxed text-ink-dim md:text-base">
              {section.points.map((point) => (
                <li key={point} className="flex gap-3">
                  <span className="text-accent" aria-hidden="true">✺</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <p className="mt-16 max-w-3xl font-mono text-sm leading-relaxed text-ink-dim">
        Questions? Ask reception or{" "}
        <a href={site.socials.instagram.url} target="_blank" rel="noopener" className="text-ink underline hover:text-accent">
          DM us on Instagram
        </a>
        .
      </p>
    </main>
  );
}
