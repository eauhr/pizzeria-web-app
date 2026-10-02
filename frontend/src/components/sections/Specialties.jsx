import { Link } from "react-router-dom";
import { Image } from "@/components/ui/image";
import { specialties } from "@/data/menu";
import { formatPrice } from "@/lib/formatPrice";

export default function Specialties() {
  return (
    <section className="bg-background py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <p className="font-script text-secondary text-2xl">i nostri piatti</p>
            <h2 className="display text-5xl md:text-7xl text-primary">From the kitchen</h2>
          </div>
          <Link to="/menu" className="text-sm font-semibold uppercase tracking-widest text-primary hover:text-secondary transition-colors">
            See full menu →
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {specialties.map((s, i) => (
            <article key={s.name} className="group">
              <div className={`relative ${i % 2 ? "rotate-[1.5deg]" : "rotate-[-1.5deg]"} group-hover:rotate-0 transition-transform duration-300`}>
                <Image
                  src={s.img}
                  alt={s.name}
                  className="w-full aspect-[4/3] object-cover rounded shadow-lg"
                  fittingType="fill"
                />
                <span className="absolute top-3 right-3 bg-secondary text-secondary-foreground display text-base px-3 py-1.5 rounded">
                  {formatPrice(s.price)}
                </span>
              </div>
              <h3 className="display text-2xl mt-4 text-foreground">{s.name}</h3>
              <p className="text-sm text-foreground/70 mt-1">{s.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
