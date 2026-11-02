import { SectionHeading } from "@/components/ui/section-heading";
import { testimonials } from "@/data/testimonials";
import { AnimatedTestimonials } from "./animated-testimonials";

/** Only verified testimonials are ever shown; placeholders stay in the data file until replaced. */
export function TestimonialsSection() {
  const verified = testimonials.filter((t) => !t.isPlaceholder);
  if (verified.length === 0) return null;
  return (
    <section id="testimonials" aria-labelledby="testimonials-title" className="section-y section-tint relative">
      <div className="container-page">
        <SectionHeading id="testimonials-title" eyebrow="Testimonials" title={<>What clients <em>say.</em></>} />
        <div className="mt-14 lg:mt-20" data-reveal="">
          <AnimatedTestimonials testimonials={verified} />
        </div>
      </div>
    </section>
  );
}
