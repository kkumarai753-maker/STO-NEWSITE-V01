import Link from "next/link";
import { getImageProps } from "next/image";

export function Hero() {
  const shared = {
    alt: "Sunrise Tech Origin — From Idea to Successful Business. We help founders and business owners start, build, promote and grow their business. Setup, Promote, Automate, Grow. Get Started Today.",
    sizes: "100vw",
    quality: 90,
    loading: "eager" as const,
    fetchPriority: "high" as const,
  };
  const { props: desktop } = getImageProps({
    ...shared,
    src: "/banners/sunrise-hero-desktop.png",
    width: 1939,
    height: 811,
  });
  const { props: mobile } = getImageProps({
    ...shared,
    src: "/banners/sunrise-hero-mobile.png",
    width: 1086,
    height: 1448,
  });
  return (
    <section
      aria-labelledby="hero-title"
      className="bg-[#eef5ff]"
    >
      <h1 id="hero-title" className="sr-only">
        From Idea to Successful Business — Sunrise Tech Origin
      </h1>
      <Link
        href="/inquiry"
        aria-label="Get started with Sunrise Tech Origin: tell us about your project"
        className="group block outline-offset-[-4px] focus-visible:outline-4 focus-visible:outline-primary"
      >
        <picture>
          <source
            media="(min-width: 768px)"
            srcSet={desktop.srcSet}
            sizes="100vw"
            width={1939}
            height={811}
          />
          <img
            {...mobile}
            alt={shared.alt}
            className="block h-auto w-full"
            style={{ width: "100%", height: "auto" }}
          />
        </picture>
        <span className="sr-only">Open project enquiry</span>
      </Link>
    </section>
  );
}
