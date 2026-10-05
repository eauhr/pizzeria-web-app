import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, X, ShoppingBag, Loader2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import apiClient from "@/lib/apiClient";
import { formatPrice } from "@/lib/formatPrice";

export default function Cart() {
  const { items, updateQty, removeItem, subtotal, clear } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleCheckout = async () => {
    setError("");
    if (!user) {
      navigate("/login?returnTo=" + encodeURIComponent("/cart"));
      return;
    }
    setPlacing(true);
    try {
      await apiClient.post("/orders", {
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      });
      clear();
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Could not place order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  if (success) {
    return (
      <section className="bg-background py-24">
        <div className="mx-auto max-w-md px-4 text-center">
          <h1 className="display text-4xl text-primary mb-3">Grazie!</h1>
          <p className="text-foreground/70 mb-6">{import.meta.env.VITE_DEMO_MODE === "true" ? "Your demo checkout was simulated. No order or payment was sent." : "Your order has been placed. We'll start firing up the oven."}</p>
          <Link to="/menu" className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground display text-lg px-6 py-3 rounded hover:bg-[#b13a22] transition-colors">
            Back to the menu
          </Link>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="bg-background py-24">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <ShoppingBag className="w-12 h-12 mx-auto text-foreground/30 mb-4" />
          <h1 className="display text-4xl text-primary mb-2">Your cart is empty</h1>
          <p className="text-foreground/60 mb-6">Add something delicious from the menu.</p>
          <Link to="/menu" className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground display text-lg px-6 py-3 rounded hover:bg-[#b13a22] transition-colors">
            View the menu
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-background py-14 md:py-20">
      <div className="mx-auto max-w-4xl px-4 md:px-8">
        <h1 className="display text-5xl md:text-6xl text-primary mb-10">Cart</h1>

        <div className="divide-y divide-border border-t border-border">
          {items.map((item) => (
            <div key={item.productId} className="flex items-center gap-5 py-6">
              <div className="w-20 h-20 shrink-0 bg-card border border-border rounded overflow-hidden">
                {item.image && <img src={item.image} alt={item.name} loading="lazy" width="80" height="80" className="w-full h-full object-contain" />}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="display text-lg text-foreground truncate">{item.name}</h3>
              </div>

              <div className="flex items-center gap-3 border border-border rounded px-2 py-1">
                <button onClick={() => updateQty(item.productId, item.quantity - 1)} className="p-1 hover:text-secondary" aria-label="Decrease quantity">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-5 text-center text-sm">{item.quantity}</span>
                <button onClick={() => updateQty(item.productId, item.quantity + 1)} className="p-1 hover:text-secondary" aria-label="Increase quantity">
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <p className="display text-lg text-secondary w-20 text-right">{formatPrice(item.price * item.quantity)}</p>

              <button onClick={() => removeItem(item.productId)} className="text-foreground/40 hover:text-destructive" aria-label="Remove item">
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-end items-center gap-6 mt-8">
          <p className="text-foreground/70">Subtotal</p>
          <p className="display text-3xl text-primary">{formatPrice(subtotal)}</p>
        </div>

        {error && <div className="mt-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm text-right">{error}</div>}

        <div className="flex justify-end mt-6">
          <button
            onClick={handleCheckout}
            disabled={placing}
            className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground display text-lg px-8 py-3.5 rounded hover:bg-[#b13a22] transition-colors disabled:opacity-50"
          >
            {placing && <Loader2 className="w-4 h-4 animate-spin" />}
            {placing ? "Placing order..." : import.meta.env.VITE_DEMO_MODE === "true" ? "Simulate checkout" : "Checkout"}
          </button>
        </div>
      </div>
    </section>
  );
}
