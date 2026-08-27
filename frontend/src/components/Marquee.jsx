export default function Marquee({ text, reverse = false, className = "", bg = "bg-secondary", fg = "text-secondary-foreground" }) {
  const items = Array.from({ length: 6 });
  return (
    <div className={`overflow-hidden ${bg} ${fg} py-3 select-none ${className}`}>
      <div className={`marquee-track ${reverse ? "reverse" : ""}`}>
        {items.map((_, i) => (
          <span key={i} className="display text-2xl md:text-3xl px-6 inline-flex items-center gap-6">
            {text}
            <span className="text-2xl">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}