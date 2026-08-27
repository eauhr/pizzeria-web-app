import Hero from "@/components/sections/Hero";
import Tradition from "@/components/sections/Tradition";
import Specialties from "@/components/sections/Specialties";
import Gallery from "@/components/sections/Gallery";
import Delivery from "@/components/sections/Delivery";
import Reviews from "@/components/sections/Reviews";
import VisitCta from "@/components/sections/VisitCta";

export default function Home() {
  return (
    <>
      <Hero />
      <Tradition />
      <Specialties />
      <Gallery />
      <Delivery />
      <Reviews />
      <VisitCta />
    </>
  );
}