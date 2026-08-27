import { Link } from "react-router-dom";
import { Image } from "@/components/ui/image";
import { ArrowRight } from "lucide-react";
import doughHands from "@/assets/images/dough-hands.png";


export default function Tradition() {
  return (
    <section className="grid md:grid-cols-2">
      {/* left: graphic block */}
      <div className="relative bg-[#7a2a1f] text-[#f2ead3] overflow-hidden min-h-[690px] flex items-center justify-center p-10 md:p-12">
        <span className="display absolute inset-0 flex items-center justify-center text-[22vw] md:text-[13rem] text-[#f2ead3]/10 leading-none select-none">
          TRADITION
        </span>
        <div className="group relative rotate-[-3deg] w-80 md:w-[26rem] transition-all duration-500 ease-out hover:rotate-0 hover:scale-105">
          <Image
            src={doughHands}
            alt="Hands shaping pizza dough"
            className="w-full aspect-[3/4] object-cover rounded shadow-2xl transition-shadow duration-500 group-hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]"
            fittingType="fill"
          />
        </div>
      </div>

      {/* right: text block */}
      <div className="bg-background text-foreground p-16 md:p-20 flex flex-col justify-center">
        <p className="font-script text-secondary text-2xl mb-2">la tradizione napoletana</p>
        <h2 className="display text-5xl md:text-7xl text-primary">
          A real oven.<br />A real story.
        </h2>
        <p className="mt-5 max-w-md text-foreground/75 leading-relaxed">
          For two decades we've fired the same wood oven-stretching dough by hand, sourcing San Marzano tomatoes and Buffalo mozzarella, and cooking everything to order. No shortcuts, no frozen bases. Just the way it's done in Naples.
        </p>
        <Link to="/story" className="group mt-8 inline-flex items-center gap-2 self-start bg-secondary text-secondary-foreground display text-lg px-6 py-3 rounded hover:bg-[#b13a22] transition-colors">
          Read our story <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}