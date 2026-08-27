import { Link } from "react-router-dom";
import { Bike, Clock, Percent } from "lucide-react";

export default function Delivery() {
  return (
    <section className="bg-secondary text-secondary-foreground py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <p className="font-script text-[#f2ead3] text-2xl mb-2">a casa tua</p>
          <h2 className="display text-5xl md:text-7xl leading-[0.9]">
            Hungry?<br />We deliver.
          </h2>
          <p className="mt-5 max-w-md text-secondary-foreground/90 leading-relaxed">
            Order from home or the office around central Plovdiv. Hot, fresh and fast - the same pizza, packed with care.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/visit" className="bg-primary text-primary-foreground display text-lg px-7 py-3.5 rounded hover:bg-[#15392f] transition-colors">
              Order delivery
            </Link>
            <div className="inline-flex items-center gap-2 bg-[#f2ead3] text-[#241710] display text-lg px-5 py-3.5 rounded">
              <Percent className="w-5 h-5" /> 20% off pickup
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="flex items-start gap-4 bg-secondary-foreground/10 rounded p-5">
            <Clock className="w-6 h-6 mt-1 shrink-0" />
            <div>
              <p className="display text-xl">Delivery hours</p>
              <p className="text-sm opacity-90">Mon–Sun · 11:00 – 22:30</p>
            </div>
          </div>
          <div className="flex items-start gap-4 bg-secondary-foreground/10 rounded p-5">
            <Bike className="w-6 h-6 mt-1 shrink-0" />
            <div>
              <p className="display text-xl">Area</p>
              <p className="text-sm opacity-90">Central Plovdiv and surroundings</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}