import { Link } from "react-router-dom";
import { MapPin, Phone, Clock } from "lucide-react";

export default function VisitCta() {
  return (
    <section className="bg-[#1E433D] text-[#f2ead3] py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-8 grid md:grid-cols-3 gap-8 items-center">
        <div className="md:col-span-2">
          <p className="font-script text-secondary text-2xl mb-2">vieni a trovarci</p>
          <h2 className="display text-5xl md:text-6xl leading-[0.9]">Find us on Doughty</h2>
          <div className="mt-6 grid sm:grid-cols-2 gap-5 max-w-xl">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 mt-0.5 text-secondary shrink-0" />
              <p className="text-sm leading-relaxed">ul. "Doughty" 67<br />Plovdiv, Stonemarrow 1<br />Bulgaria</p>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 mt-0.5 text-secondary shrink-0" />
              <p className="text-sm leading-relaxed">Dine-in: 11–23h<br />Delivery: 11–22:30<br />Open 7 days a week</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <a href="tel:+359326000000" className="inline-flex items-center justify-center gap-2 bg-secondary text-secondary-foreground display text-xl px-6 py-4 rounded hover:bg-[#b13a22] transition-colors">
            <Phone className="w-5 h-5" /> Call to reserve
          </a>
          <Link to="/visit" className="inline-flex items-center justify-center gap-2 border border-[#f2ead3]/40 display text-xl px-6 py-4 rounded hover:bg-[#f2ead3]/10 transition-colors">
            Visit page
          </Link>
        </div>
      </div>
    </section>
  );
}