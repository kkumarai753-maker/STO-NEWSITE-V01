import { stats, statsArePlaceholders } from "@/data/stats";
import { NumberTicker } from "./number-ticker";

/** Company metrics from data/stats.ts. Hidden until the figures are verified (statsArePlaceholders = false). */
export function MetricsBand() {
  if (statsArePlaceholders) return null;
  return (
    <div className="mt-14 lg:mt-16" data-reveal="">
      <dl className="glass-card grid grid-cols-2 gap-y-10 rounded-3xl p-7 sm:p-10 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div key={stat.label} className={`flex flex-col gap-3 ${i % 2 === 1 ? "pl-6 sm:pl-10" : ""} ${i === 2 ? "lg:pl-10" : ""} ${i > 0 ? "lg:border-l lg:border-line" : ""} ${i % 2 === 1 ? "border-l border-line" : ""}`}>
            <dt className="order-2 text-sm text-text-muted">{stat.label}</dt>
            <dd className="order-1 font-display text-[clamp(2.5rem,1.8rem+2.8vw,4rem)] leading-[0.95] tracking-[-0.03em] text-primary numeric">
              <NumberTicker value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
