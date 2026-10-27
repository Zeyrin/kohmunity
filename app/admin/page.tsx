import type { Metadata } from "next";
import { photoFiles, type PhotoSlug } from "@/content/photos.generated";
import { AdminApp } from "./admin-app";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

/** Static shell — login state and data load in the browser via the server actions in ./actions. */
export default function AdminPage() {
  const photos = (Object.keys(photoFiles) as PhotoSlug[]).map((slug) => ({ slug, src: photoFiles[slug].src }));
  return (
    <main id="main" className="mx-auto max-w-xl px-4 pb-32 pt-28">
      <p className="label text-ink-dim">Kohmunity · admin</p>
      <h1 className="display mt-3 text-5xl text-ink">
        The <span className="text-accent-2">line</span>&#8209;up
      </h1>
      <AdminApp photos={photos} />
    </main>
  );
}
