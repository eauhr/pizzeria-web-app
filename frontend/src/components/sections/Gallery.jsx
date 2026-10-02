import { Image } from "@/components/ui/image";
import diningRoom from "@/assets/images/dining-room.webp";
import margherita from "@/assets/images/margherita.webp";
import cannelloni from "@/assets/images/cann.webp";

const shots = [
  { src: diningRoom, alt: "Dining room interior", cls: "rotate-[-2deg] col-span-2", note: "two rooms, two moods" },
  { src: margherita, alt: "Margherita pizza", cls: "rotate-[3deg]", note: "the margherita" },
  { src: cannelloni, alt: "Cannelloni al Forno", cls: "rotate-[-1deg]", note: "cannelloni al forno" },
];

export default function Gallery() {
  return (
    <section className="bg-primary text-primary-foreground py-12 md:py-16 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="text-center mb-8">
          <p className="font-script text-secondary text-2xl">la famiglia</p>
          <h2 className="display text-5xl md:text-7xl">Come take a seat</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
          {shots.map((s) => (
            <figure key={s.alt} className={`relative ${s.cls}`}>
              <div className="bg-[#f2ead3] p-2 pb-10 rotate-[-1deg] shadow-xl transition-transform duration-300 hover:scale-105 cursor-pointer">
                <Image
                  src={s.src}
                  alt={s.alt}
                  className="w-full aspect-[4/3] object-cover"
                  fittingType="fill"
                />
                <figcaption className="font-script text-[#241710] text-xl text-center pt-2">{s.note}</figcaption>
              </div>
            </figure>
          ))}
          <div className="col-span-2 md:col-span-4 flex items-center justify-center">
            <p className="font-script text-3xl md:text-5xl text-[#f2ead3]/80 text-center px-4 leading-tight">
              warm light, wood & iron, a sewing machine in the corner.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
