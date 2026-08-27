import { useState } from "react";
import { menuCategories } from "@/data/menu";
import { Link } from "react-router-dom";
import { Phone } from "lucide-react";

export default function Menu() {
  const [active, setActive] = useState(menuCategories[0].id);
  const cat = menuCategories.find((c) => c.id === active);

  return (
    <>
      <section className="bg-primary text-primary-foreground py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8 text-center">
          <p className="font-script text-secondary text-2xl">il menù</p>
          <h1 className="display text-6xl md:text-8xl">The Menu</h1>
          <p className="mt-4 max-w-xl mx-auto text-primary-foreground/80">
            Cooked fresh, to order. Ask your server about today's specials and the wine list.
          </p>
        </div>
      </section>

      <section className="bg-background py-14 md:py-20">
        <div className="mx-auto max-w-5xl px-4 md:px-8">
          {/* category tabs */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-12">
            {menuCategories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                className={`display text-base md:text-lg px-5 py-2.5 rounded transition-colors ${
                  active === c.id
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-card text-foreground/70 hover:text-foreground border border-border"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* category header */}
          <div key={cat.id} className="mb-8">
            <h2 className="display text-4xl md:text-5xl text-primary">{cat.name}</h2>
            <p className="font-script text-secondary text-xl mt-1">{cat.tagline}</p>
          </div>

          {/* items */}
          <div className="divide-y divide-border">
            {cat.items.map((item) => (
              <div key={item.name} className="flex items-baseline gap-4 py-5">
                <div className="flex-1">
                  <h3 className="display text-xl md:text-2xl text-foreground">{item.name}</h3>
                  <p className="text-sm text-foreground/65 mt-0.5">{item.desc}</p>
                </div>
                <span className="text-foreground/30 flex-1 border-b border-dashed border-border translate-y-[-4px] hidden sm:block" />
                <span className="display text-xl md:text-2xl text-secondary whitespace-nowrap">€{item.price}</span>
              </div>
            ))}
          </div>

          <div className="mt-14 text-center bg-card border border-border rounded p-8">
            <h3 className="display text-3xl text-primary">Ready to order?</h3>
            <p className="mt-2 text-foreground/70">Call us for delivery or to reserve a table.</p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <a href="tel:+359326000000" className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground display text-lg px-6 py-3 rounded hover:bg-[#b13a22] transition-colors">
                <Phone className="w-4 h-4" /> +359 32 60 00 00
              </a>
              <Link to="/visit" className="inline-flex items-center gap-2 border border-primary display text-lg px-6 py-3 rounded hover:bg-primary hover:text-primary-foreground transition-colors">
                Visit & reserve
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}