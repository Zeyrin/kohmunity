import { Hero } from "@/components/hero/hero";
import { Marquee } from "@/components/marquee";
import { Rooms } from "@/components/rooms/rooms";
import { Tribe } from "@/components/tribe/tribe";

export default function Home() {
  return (
    <main id="main">
      <Hero />
      <Marquee />
      <Rooms />
      <Tribe />
      <div className="h-[100vh]" />
    </main>
  );
}
