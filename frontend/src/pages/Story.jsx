import { Image } from "@/components/ui/image";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import diningRoom from "@/assets/images/dining-room.webp";

const values = [
  { title: "Fresco", desc: "Produce sourced daily, never frozen." },
  { title: "Forno a legna", desc: "A real wood-fired oven, fired every morning." },
  { title: "Fatto in casa", desc: "Dough, sauces and pasta made by hand." },
  { title: "Locale", desc: "We support local growers and artisans." },
  { title: "Di stagione", desc: "The menu shifts with the seasons." },
  { title: "Saper fare", desc: "Two decades of Neapolitan craft." },
];

export default function Story() {
  return (
    <>
      <section className="bg-secondary text-secondary-foreground py-16 md:py-20 relative overflow-hidden">
        <span className="display absolute inset-0 flex items-center justify-center text-[20vw] text-secondary-foreground/10 select-none">
          STORIA
        </span>
        <div className="mx-auto max-w-7xl px-4 md:px-8 text-center relative">
          <p className="font-script text-[#f2ead3] text-2xl">chi è la famiglia?</p>
          <h1 className="display text-5xl md:text-7xl">Who is the famiglia?</h1>
          <p className="mt-4 max-w-xl mx-auto opacity-90">Are they really Italian? Well - the oven is, the dough is, and so is the heart.</p>
        </div>
      </section>

      {/* story body */}
      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 md:px-8 grid md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-5">
            <div className="group rotate-[-2deg] transition-all duration-500 ease-out hover:rotate-0 hover:scale-105">
              <Image
                src={diningRoom}
                alt="Picantino dining room"
                className="w-full aspect-[4/3] object-cover rounded shadow-xl transition-shadow duration-500 group-hover:shadow-2xl"
                fittingType="fill"
              />
            </div>
            <p className="font-script text-secondary text-xl mt-3 text-center">our corner of Plovdiv</p>
          </div>
          <div className="md:col-span-7 space-y-4 text-foreground/80 leading-relaxed">
            <h2 className="display text-4xl md:text-5xl text-primary">Twenty years, one oven.</h2>
            <p>
              It started in 2005 with a single wood-fired oven and a stubborn belief that pizza should be made the Neapolitan way - by hand, with fire, and with patience. Two decades later, the oven is still the first thing lit each morning.
            </p>
            <p>
              Over the years Picantino grew into something bigger than a pizzeria: a full Italian kitchen turning out fresh pasta, seafood from the grill, risotto and a wine cellar that travels from Tuscany to Puglia. Two dining rooms - one casual, one a little more intimate - mean there's a corner for every occasion.
            </p>
            <p>
              We're a neighbourhood place. Regulars who first came as students now bring their own kids. That's the whole point. We cook like we're cooking for people we'll see again next week - because we will.
            </p>
            <Link to="/visit" className="group inline-flex items-center gap-2 mt-4 bg-primary text-primary-foreground display text-lg px-6 py-3 rounded hover:bg-[#15392f] transition-colors">
              Come visit <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* values */}
      <section className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="text-center mb-12">
            <p className="font-script text-secondary text-2xl">i nostri valori</p>
            <h2 className="display text-5xl md:text-7xl text-secondary">Our values</h2>
            <p className="mt-4 max-w-xl mx-auto text-primary-foreground/80">
              We wanted to build the restaurant of our dreams - honest, fresh, delicious, and open to everyone.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v) => (
              <div key={v.title} className="border border-primary-foreground/15 rounded p-6 hover:border-secondary transition-colors">
                <h3 className="display text-2xl text-secondary">{v.title}</h3>
                <p className="mt-2 text-sm text-primary-foreground/75 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
