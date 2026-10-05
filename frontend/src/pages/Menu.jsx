import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Phone, Plus, Loader2 } from "lucide-react";
import Marquee from "@/components/Marquee";
import placeholderImg from "@/assets/menu/placeholder.webp";
import apiClient from "@/lib/apiClient";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/formatPrice";
import { menuCategories } from "@/data/menu";

function StackedName({ text, tone }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden select-none pointer-events-none">
      {Array.from({ length: 3 }).map((_, i) => (
        <span key={i} className={`display leading-[0.75] text-[17vw] sm:text-[3.4rem] whitespace-nowrap ${tone === "primary" ? "text-primary/80" : "text-secondary/80"}`}>
          {text}
        </span>
      ))}
    </div>
  );
}

function ProductCard({ item, tone }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const addedTimer = useRef(null);

  useEffect(() => () => window.clearTimeout(addedTimer.current), []);

  const handleAdd = () => {
    addItem({ id: item.id, name: item.name, price: item.price, imageUrl: item.imageUrl || placeholderImg }, 1);
    setAdded(true);
    window.clearTimeout(addedTimer.current);
    addedTimer.current = window.setTimeout(() => setAdded(false), 1200);
  };

  return (
    <article className="group">
      <div className="relative aspect-square bg-card border border-border rounded overflow-hidden">
        <StackedName text={item.name} tone={tone} />
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <img
            src={item.imageUrl || placeholderImg}
            alt={item.name}
            loading="lazy"
            width="220"
            height="220"
            className="w-[75%] max-w-[220px] object-contain drop-shadow-2xl -rotate-2 group-hover:rotate-0 transition-transform duration-300"
          />
        </div>
        <button
          onClick={handleAdd}
          className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 bg-secondary text-secondary-foreground text-xs font-semibold uppercase tracking-widest px-3 py-2 rounded-full hover:bg-[#b13a22] transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> {added ? "Added" : "Add"}
        </button>
      </div>
      <div className="mt-4 text-center">
        <h3 className="display text-lg md:text-xl text-primary">{item.name}</h3>
        <p className="text-xs text-foreground/60 mt-1">{item.description}</p>
        <p className="display text-xl text-secondary mt-2">{formatPrice(item.price)}</p>
      </div>
    </article>
  );
}

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState(null);

  const { data: apiCategories = [], isError: categoriesFailed } = useQuery({
    queryKey: ["categories"],
    queryFn: () => apiClient.get("/categories"),
  });

  const usingSampleMenu = apiCategories.length === 0;
  const categories = usingSampleMenu
    ? menuCategories.map(({ id, name }) => ({ id, name }))
    : apiCategories;
  const currentCategoryId = activeCategory ?? categories[0]?.id;

  const { data: apiProducts = [], isLoading } = useQuery({
    queryKey: ["products", currentCategoryId],
    queryFn: () => apiClient.get(`/products?categoryId=${currentCategoryId}`),
    enabled: !!currentCategoryId && !usingSampleMenu,
  });

  const tone = categories.find((c) => c.id === currentCategoryId)?.name === "Pasta" ? "primary" : "secondary";
  const sampleCategory = menuCategories.find((category) => category.id === currentCategoryId);
  const products = usingSampleMenu
    ? (sampleCategory?.items ?? []).map((item, index) => ({
        id: `${currentCategoryId}-${index}`,
        name: item.name,
        description: item.desc,
        price: Number(item.price),
        imageUrl: "",
      }))
    : apiProducts;

  return (
    <>
      <section className="bg-primary text-primary-foreground py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8 text-center">
          <p className="font-script text-secondary text-2xl">la selezione della casa</p>
          <h1 className="display text-6xl md:text-8xl">The Menu</h1>
          <p className="mt-4 max-w-xl mx-auto text-primary-foreground/80">
            A small, honest selection - three pizzas, three pastas, our house wines.
          </p>
        </div>
      </section>

      <Marquee text="SELEZIONE DELLA CASA" bg="bg-secondary" fg="text-secondary-foreground" />

      <section className="bg-background py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          {usingSampleMenu && (
            <p className="mb-6 text-center text-sm text-foreground/70" role="status">
              {categoriesFailed
                ? "The live menu is unavailable, so this sample menu is shown."
                : "Showing the sample menu while the live catalog is empty."}
            </p>
          )}

          <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-14">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={`display text-base md:text-lg px-5 py-2.5 rounded transition-colors ${
                  currentCategoryId === c.id ? "bg-secondary text-secondary-foreground" : "bg-card text-foreground/70 hover:text-foreground border border-border"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-secondary" />
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12">
              {products.map((item) => (
                <ProductCard key={item.id} item={item} tone={tone} />
              ))}
            </div>
          )}

          <div className="mt-16 text-center bg-card border border-border rounded p-8">
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
