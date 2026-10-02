const euroFormatter = new Intl.NumberFormat("bg-BG", {
  style: "currency",
  currency: "EUR",
});

export function formatPrice(value) {
  const amount = Number(value);
  return Number.isFinite(amount) ? euroFormatter.format(amount) : "—";
}
