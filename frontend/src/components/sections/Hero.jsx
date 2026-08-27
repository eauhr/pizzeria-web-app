import { Link } from "react-router-dom";
import { Image } from "@/components/ui/image";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import heroOven from "@/assets/images/home-pizza.png";

export default function Hero() {
  return (
    <section className="relative bg-primary text-primary-foreground overflow-hidden">
      {/* Oversized background type */}
      <span className="display pointer-events-none absolute -top-4 -left-2 text-[22vw] leading-none text-primary-foreground/5 select-none hidden md:block">
        PIZZA
      </span>

      <div className="mx-auto max-w-7xl px-4 md:px-8 py-16 md:py-24 grid md:grid-cols-12 gap-8 items-center relative">
        {/* Left Content Column */}
        <motion.div 
          className="md:col-span-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", bounce: 0, duration: 0.5 }}
        >
          <p className="font-script text-secondary text-2xl md:text-3xl mb-3">
            fatto a Plovdiv, con amore
          </p>

          <h1 className="display text-[15vw] md:text-[7.5rem] leading-[0.85]">
            Wood-fired<br />
            Italian,<br />
            <span className="text-secondary">since 2005.</span>
          </h1>

          <p className="mt-6 max-w-md text-base md:text-lg text-primary-foreground/80 leading-relaxed">
            Real Neapolitan pizza from a wood-fired oven, fresh pasta, seafood and a cellar of Italian wine - in the heart of Plovdiv. Dine in, or let us bring it to your door.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
              <Link 
                to="/menu" 
                className="group inline-flex items-center gap-2 bg-secondary text-secondary-foreground display text-lg px-7 py-3.5 rounded hover:bg-[#b13a22] transition-colors"
              >
                See the menu <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
              <Link 
                to="/visit" 
                className="inline-flex items-center gap-2 border border-primary-foreground/40 display text-lg px-7 py-3.5 rounded hover:bg-primary-foreground/10 transition-colors"
              >
                Reserve a table
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Image Column */}
        <motion.div 
          className="md:col-span-6 relative"
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", bounce: 0.1, duration: 0.6, delay: 0.1 }}
        >
          {/* Subtle hover lift on the image container */}
          <motion.div 
            className="relative rotate-[2deg]"
            whileHover={{ scale: 1.02, rotate: 1 }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
          >
            <Image
              src={heroOven}
              alt="Wood-fired oven with fresh pizza"
              className="w-full aspect-[4/3] object-cover rounded shadow-2xl"
              fittingType="fill"
            />
          </motion.div>

          {/* Paper tape element floating in */}
          <motion.div 
            className="paper-tape absolute -bottom-5 -left-4 md:-left-8 rotate-[-6deg] px-5 py-2.5 rounded-sm"
            initial={{ opacity: 0, y: 10, rotate: -10 }}
            animate={{ opacity: 1, y: 0, rotate: -6 }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.5, delay: 0.3 }}
          >
            <p className="font-script text-[#241710] text-xl leading-none">20 years</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#241710]/70">of firing the oven</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}