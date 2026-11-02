import { getImageProps } from "next/image";
import { homeSlides } from "@/data/home-slides";
import { ServiceSlider, type SliderSlide } from "./service-slider";

/**
 * The designed service banners, shown in the home hero right under the
 * headline (Server Component). Image URLs are prepared here with
 * getImageProps (art direction: a separately composed portrait file below
 * 768px), so the client island only handles motion and controls.
 */
const QUALITY = 90; // the artwork carries text; keep it crisp
const DESKTOP_SIZES = "(min-width: 82rem) 80rem, 100vw";

export function HomeSlider({ className }: { className?: string }) {
  const slides: SliderSlide[] = homeSlides.map((slide) => {
    const {
      props: { srcSet: desktopSrcSet },
    } = getImageProps({ src: slide.desktop, alt: "", width: 1920, height: 807, quality: QUALITY, sizes: DESKTOP_SIZES });
    const {
      props: { srcSet: mobileSrcSet },
    } = getImageProps({ src: slide.mobile, alt: "", width: 1080, height: 1350, quality: QUALITY, sizes: "100vw" });
    const { props: img } = getImageProps({
      src: slide.desktop,
      alt: slide.alt,
      width: 1920,
      height: 807,
      quality: QUALITY,
      sizes: DESKTOP_SIZES,
    });
    return {
      id: slide.id,
      label: slide.label,
      title: slide.title,
      links: slide.links,
      desktopSrcSet: desktopSrcSet ?? img.src,
      mobileSrcSet: mobileSrcSet ?? slide.mobile,
      img: { src: img.src, srcSet: img.srcSet, sizes: img.sizes, alt: slide.alt, width: 1920, height: 807 },
    };
  });

  return (
    <div className={className}>
      <ServiceSlider slides={slides} priority />
    </div>
  );
}
