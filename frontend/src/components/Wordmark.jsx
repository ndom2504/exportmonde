export default function Wordmark({ light = false, compact = false }) {
  return (
    <span className="flex items-center gap-3 select-none">
      <span className="flex items-baseline">
        <span className={`font-display font-semibold tracking-tight ${light ? "text-white" : "text-navy-800"} ${compact ? "text-2xl" : "text-[1.7rem] leading-none"}`}>
          EMP
        </span>
        <span className="ml-1.5 h-1.5 w-1.5 rounded-full bg-turquoise mb-0.5" />
      </span>
      <span className={`hidden sm:block leading-tight ${light ? "text-white/70" : "text-graphite"}`}>
        <span className="block text-[10px] font-semibold uppercase tracking-widest2">Export Monde Prestige</span>
        <span className="block text-[9px] uppercase tracking-widest2 text-electric-bright">Inc. — Solutions & Gestion</span>
      </span>
    </span>
  );
}
