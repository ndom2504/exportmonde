import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Reveal, EASE } from "./Reveal";
import { useLang } from "@/lib/lang";

export default function Faq({ items }) {
  const [openIdx, setOpenIdx] = useState(0);
  const { t } = useLang();
  return (
    <div className="mx-auto max-w-3xl">
      {items.map((item, i) => {
        const open = openIdx === i;
        return (
          <Reveal key={i} delay={i * 0.05}>
            <div className={`border-b border-line ${i === 0 ? "border-t" : ""}`}>
              <button
                data-testid={`faq-item-${i}`}
                aria-expanded={open}
                onClick={() => setOpenIdx(open ? -1 : i)}
                className="flex w-full items-center justify-between gap-6 py-6 text-left"
              >
                <span className={`font-display text-lg md:text-xl transition-colors ${open ? "text-electric" : "text-navy-800"}`}>{t(item.q)}</span>
                <motion.span animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.35, ease: EASE }} className={`shrink-0 ${open ? "text-electric" : "text-steel"}`}>
                  <Plus size={22} />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="overflow-hidden"
                  >
                    <p className="pb-7 pr-10 text-[15px] leading-relaxed text-graphite">{t(item.a)}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
