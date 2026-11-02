import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Bot, Layers3, Megaphone, TrendingUp } from "lucide-react";

const pillars = [
  { name: "Setup", icon: Layers3 },
  { name: "Promote", icon: Megaphone },
  { name: "Automate", icon: Bot },
  { name: "Grow", icon: TrendingUp },
];

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="sunrise-tech-hero relative isolate overflow-hidden bg-[#eaf3ff]">
      <Image
        src="/banners/sunrise-tech-hero.png"
        alt=""
        fill
        priority
        sizes="100vw"
        quality={90}
        className="sunrise-tech-hero-image object-cover"
      />
      <div className="sunrise-tech-hero-wash absolute inset-0" aria-hidden />
      <div className="container-page relative z-10">
        <div className="sunrise-tech-hero-copy">
          <p className="preview-kicker">Technology solutions. Digital growth.</p>
          <h1 id="hero-title" className="sunrise-tech-hero-title mt-5 font-semibold text-[#09244e]">
            From Idea to<br />
            <span>Successful Business</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-[#27496c] sm:text-lg">
            We help founders and business owners start, build, promote and grow their business.
          </p>
          <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-3 text-xs font-medium text-[#173e70] sm:gap-x-7 sm:text-sm" aria-label="How we support your business">
            {pillars.map(({ name, icon: Icon }) => <li key={name} className="flex items-center gap-2"><Icon className="size-4" aria-hidden />{name}</li>)}
          </ul>
          <Link href="/inquiry" className="sunrise-tech-hero-cta mt-8 inline-flex min-h-13 items-center gap-6 rounded-full px-7 py-4 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-reduce:transform-none">
            Get Started Today <ArrowRight className="size-5" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
