import { Hero } from "@/components/hero/hero";
import { Marquee } from "@/components/marquee";
import { Rooms } from "@/components/rooms/rooms";
import { Tribe } from "@/components/tribe/tribe";
import { Events } from "@/components/events/events";
import { Reviews } from "@/components/reviews/reviews";
import { Footer } from "@/components/footer/footer";

export default function Home() {
  return (
    <>
      <main id="main">
        <Hero />
        <Marquee />
        <Rooms />
        <Tribe />
        <Events />
        <Reviews />
      </main>
      <Footer />
    </>
  );
}
