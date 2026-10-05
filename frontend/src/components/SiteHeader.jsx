import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu as MenuIcon, X, Phone } from "lucide-react";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Menu", to: "/menu" },
  { label: "Our Story", to: "/story" },
  { label: "Visit", to: "/visit" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { count } = useCart();
  const { user } = useAuth();
  const visibleNavLinks = user?.role === "Admin"
    ? [...navLinks, { label: "Admin", to: "/admin" }]
    : navLinks;

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="h-16 flex items-center justify-between">
          {/* left: order CTA */}
          <Link
            to="/visit"
            className="hidden md:inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest border border-primary-foreground/30 rounded-full px-4 py-1.5 hover:bg-secondary hover:border-secondary transition-colors"
          >
            <Phone className="w-3.5 h-3.5" /> Order / Reserve
          </Link>
          <a href="tel:+359326000000" className="md:hidden inline-flex items-center gap-1.5 text-sm font-semibold">
            <Phone className="w-4 h-4" />
          </a>

          {/* center: logo */}
          <Link to="/" className="absolute left-1/2 -translate-x-1/2">
            <span className="display text-2xl md:text-3xl tracking-wide">PICANTINO</span>
          </Link>

          {/* right: nav / hamburger */}
          <nav className="hidden md:flex items-center gap-7">
            <Link to="/cart" aria-label={count ? `Shopping cart, ${count} items` : "Shopping cart"} className="relative flex items-center">
                <ShoppingBag className="w-5 h-5" />
                  {count > 0 && (
                  <span className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {count}
            </span>
               )}
                 </Link>
            {visibleNavLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`text-xs font-semibold uppercase tracking-widest hover:text-secondary transition-colors ${pathname === l.to ? "text-secondary" : ""}`}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden p-1"
            aria-label="Toggle menu"
            aria-expanded={open}
            aria-controls="mobile-navigation"
          >
            {open ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* mobile panel */}
      {open && (
        <div id="mobile-navigation" className="md:hidden bg-primary border-t border-primary-foreground/10">
          <nav className="px-6 py-4 flex flex-col">
            {visibleNavLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`display text-2xl py-3 border-b border-primary-foreground/10 ${pathname === l.to ? "text-secondary" : ""}`}
              >
                {l.label}
              </Link>
            ))}
            <Link to="/cart" aria-label={count ? `Shopping cart, ${count} items` : "Shopping cart"} className="display text-2xl py-3 border-b border-primary-foreground/10">
              Cart {count > 0 && `(${count})`}
            </Link>
            <Link to="/visit" className="mt-4 inline-flex items-center justify-center gap-2 bg-secondary text-secondary-foreground display text-lg py-3 rounded">
              <Phone className="w-4 h-4" /> Order / Reserve
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
