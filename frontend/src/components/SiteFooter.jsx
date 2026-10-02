import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Instagram, Facebook, MapPin, Phone } from "lucide-react";

export default function SiteFooter() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const sentTimer = useRef(null);

  useEffect(() => () => window.clearTimeout(sentTimer.current), []);

  const subscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSent(true);
    setEmail("");
    window.clearTimeout(sentTimer.current);
    sentTimer.current = window.setTimeout(() => setSent(false), 3500);
  };

  return (
    <footer className="bg-[#9a2b25] text-[#f2ead3]">
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <span className="display text-3xl">PICANTINO</span>
            <p className="mt-4 text-sm leading-relaxed opacity-90 max-w-xs">
              Wood-fired Italian cooking in the heart of Plovdiv since 2005. Pizza, pasta, seafood & wine  dine in or delivered.
            </p>
            <div className="mt-5 flex items-center gap-4">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="opacity-80 hover:opacity-100">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="opacity-80 hover:opacity-100">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="display text-lg mb-4 text-[#f2ead3]/70">VIENS NOUS VOIR</h3>
            <p className="text-sm leading-relaxed opacity-90">
              ul. "Doughty" 67<br />
              Plovdiv, Stonemarrow 1<br />
              Bulgaria
            </p>
            <p className="mt-3 text-sm font-semibold">Open 7 days / 7</p>
            <p className="text-xs opacity-75 mt-1">No reservation needed</p>
          </div>

          <div>
            <h3 className="display text-lg mb-4 text-[#f2ead3]/70">CONTACT</h3>
            <a href="tel:+359326000000" className="flex items-center gap-2 text-sm hover:text-white">
              <Phone className="w-4 h-4" /> +359 32 60 00 00
            </a>
            <a href="mailto:ciao@picantino.bg" className="block mt-2 text-sm hover:text-white">ciao@picantino.bg</a>
            <Link to="/visit" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#f2ead3] hover:text-white">
              <MapPin className="w-4 h-4" /> Get directions
            </Link>
          </div>

          <div>
            <h3 className="display text-lg mb-4 text-[#f2ead3]/70">NEWSLETTER</h3>
            <p className="text-xs opacity-80 mb-3">News, seasonal menus & the life of the famiglia.</p>
            <form onSubmit={subscribe} className="flex flex-col gap-2">
              <label htmlFor="newsletter-email" className="sr-only">Email address</label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your e-mail"
                required
                className="bg-white/95 text-[#241710] text-sm px-3 py-2.5 rounded outline-none placeholder:text-[#241710]/50"
              />
              <button type="submit" className="bg-[#d93822] text-white text-xs font-bold uppercase tracking-widest py-2.5 rounded hover:bg-[#c02e1c] transition-colors">
                {sent ? "Grazie!" : "Sign me up"}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#f2ead3]/20 flex flex-col md:flex-row items-center justify-between gap-3 text-xs opacity-70">
          <p>© 2026 Picantino — Portfolio concept.</p>
          <div className="flex items-center gap-5">
            <Link to="/visit" className="hover:opacity-100">Legal notice</Link>
            <span className="font-script text-base text-[#f2ead3]">fatto con amore a Plovdiv</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
