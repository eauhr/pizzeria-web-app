import { Star } from "lucide-react";

const reviews = [
  { text: "Been coming here for fifteen years. The margherita is still the best in town.", who: "Long-time regular" },
  { text: "Cosy place, great wine list, and the seafood pasta was genuinely fresh.", who: "Visitor from Sofia" },
  { text: "Ordered delivery for the office - fast, hot, and the cannelloni arrived perfect. Our team's new go-to.", who: "Office lunch" },
];

export default function Reviews() {
  return (
    <section className="bg-background py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="font-script text-secondary text-2xl">dicono di noi</p>
            <h2 className="display text-5xl md:text-7xl text-primary">989 reviews can't lie</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-6 h-6 ${i < 4 ? "fill-secondary text-secondary" : "fill-secondary/30 text-secondary"}`} />
              ))}
            </div>
            <p className="display text-3xl text-primary">4.40<span className="text-base text-foreground/50">/5</span></p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <blockquote key={r.who} className="bg-card border border-border rounded p-6 flex flex-col">
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
                ))}
              </div>
              <p className="text-foreground/80 leading-relaxed flex-1">"{r.text}"</p>
              <footer className="mt-4 text-xs font-semibold uppercase tracking-widest text-secondary">— {r.who}</footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}