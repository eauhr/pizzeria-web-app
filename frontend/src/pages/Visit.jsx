import { useState } from "react";
import { MapPin, Phone, Clock, Bike, Navigation } from "lucide-react";

export default function Visit() {
  const [form, setForm] = useState({ name: "", phone: "", date: "", guests: "2", note: "" });
  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: "", phone: "", date: "", guests: "2", note: "" });
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <>
      <section className="bg-primary text-primary-foreground py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8 text-center">
          <p className="font-script text-secondary text-2xl">vieni a trovarci</p>
          <h1 className="display text-5xl md:text-7xl">Visit & reserve</h1>
          <p className="mt-4 max-w-xl mx-auto text-primary-foreground/80">
            No reservation needed — but for groups or a quiet table, give us a call or send a request below.
          </p>
        </div>
      </section>

      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8 grid lg:grid-cols-2 gap-10">
          {/* info */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded p-6">
              <h2 className="display text-3xl text-primary mb-4">Find us</h2>
              <div className="flex items-start gap-3 mb-3">
                <MapPin className="w-5 h-5 mt-0.5 text-secondary shrink-0" />
                <p className="text-foreground/80">ul. "Doughty" 67, Plovdiv<br />Stonemarrow 1 district, Bulgaria</p>
              </div>
              <div className="flex items-start gap-3 mb-3">
                <Phone className="w-5 h-5 mt-0.5 text-secondary shrink-0" />
                <a href="tel:+359326000000" className="text-foreground/80 hover:text-secondary">+359 32 60 00 00</a>
              </div>
              <a
                href="https://maps.google.com/?q=ul.+Rodopi+67+Plovdiv+Bulgaria"
                target="_blank" rel="noreferrer"
                className="mt-2 inline-flex items-center gap-2 bg-secondary text-secondary-foreground display text-base px-5 py-2.5 rounded hover:bg-[#b13a22] transition-colors"
              >
                <Navigation className="w-4 h-4" /> Open in Maps
              </a>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded p-6">
                <Clock className="w-6 h-6 text-secondary mb-3" />
                <h3 className="display text-xl text-primary">Dine-in hours</h3>
                <p className="text-sm text-foreground/70 mt-1">Mon – Sun<br />11:00 – 23:00</p>
                <p className="text-xs font-semibold text-secondary mt-2">Open 7 days a week</p>
              </div>
              <div className="bg-card border border-border rounded p-6">
                <Bike className="w-6 h-6 text-secondary mb-3" />
                <h3 className="display text-xl text-primary">Delivery</h3>
                <p className="text-sm text-foreground/70 mt-1">Mon – Sun<br />11:00 – 22:30</p>
                <p className="text-xs font-semibold text-secondary mt-2">Central Plovdiv</p>
              </div>
            </div>

            <div className="bg-secondary text-secondary-foreground rounded p-6">
              <h3 className="display text-2xl">Parking & access</h3>
              <p className="text-sm mt-1 opacity-90">Street parking on Doughty. Wheelchair-accessible entrance. No reservation required for walk-ins.</p>
            </div>
          </div>

          {/* reservation form */}
          <div className="bg-primary text-primary-foreground rounded p-7 md:p-9">
            <h2 className="display text-3xl text-secondary">Request a table</h2>
            <p className="text-sm text-primary-foreground/70 mt-1 mb-6">We'll confirm by phone. For same-day, please call us directly.</p>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5">Name</label>
                <input
                  value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full bg-primary-foreground/5 border border-primary-foreground/20 rounded px-4 py-3 text-sm outline-none focus:border-secondary"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5">Phone</label>
                  <input
                    value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    required
                    className="w-full bg-primary-foreground/5 border border-primary-foreground/20 rounded px-4 py-3 text-sm outline-none focus:border-secondary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5">Guests</label>
                  <select
                    value={form.guests} onChange={(e) => setForm({ ...form, guests: e.target.value })}
                    className="w-full bg-primary-foreground/5 border border-primary-foreground/20 rounded px-4 py-3 text-sm outline-none focus:border-secondary"
                  >
                    {["1","2","3","4","5","6","7","8+"].map((n) => <option key={n} className="text-primary">{n}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5">Date & time</label>
                <input
                  type="datetime-local"
                  value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                  required
                  className="w-full bg-primary-foreground/5 border border-primary-foreground/20 rounded px-4 py-3 text-sm outline-none focus:border-secondary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5">Note (optional)</label>
                <textarea
                  value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })}
                  rows={2}
                  className="w-full bg-primary-foreground/5 border border-primary-foreground/20 rounded px-4 py-3 text-sm outline-none focus:border-secondary resize-none"
                />
              </div>
              <button type="submit" className="w-full bg-secondary text-secondary-foreground display text-lg py-3.5 rounded hover:bg-[#b13a22] transition-colors">
                {sent ? "Grazie! We'll call you." : "Send request"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}