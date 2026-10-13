import { motion, useReducedMotion } from "framer-motion";

export const EASE = [0.22, 1, 0.36, 1];

export function Reveal({ children, delay = 0, y = 32, className = "", once = true }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.15 }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

export function MaskLines({ lines, className = "", lineClass = "", baseDelay = 0.1 }) {
  const reduce = useReducedMotion();
  return (
    <span className={`block ${className}`}>
      {lines.map((line, i) => (
        <span key={i} className={`block overflow-hidden ${lineClass}`}>
          <motion.span
            className="block will-change-transform"
            initial={reduce ? false : { y: "112%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.95, delay: baseDelay + i * 0.13, ease: EASE }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export function Marquee({ items }) {
  const row = (hidden) => (
    <div aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((item, i) => (
        <span key={i} className="flex items-center whitespace-nowrap">
          <span className="font-display text-lg md:text-xl italic text-white/80 px-6">{item}</span>
          <span className="h-1.5 w-1.5 rounded-full bg-turquoise inline-block" />
        </span>
      ))}
    </div>
  );
  return (
    <div className="relative overflow-hidden border-y border-white/10 bg-navy-950 py-5" data-testid="editorial-marquee">
      <div className="flex w-max animate-marquee">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
