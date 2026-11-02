import { SectionHeading } from "@/components/ui/section-heading";
import { caseStudies, type CaseStudyVisual } from "@/data/case-studies";
import { CaseStudyCarousel } from "./case-study-carousel";
import { CaseVisual } from "./case-visuals";

export function CaseStudiesSection() {
  const kinds = [...new Set(caseStudies.map((c) => c.visual))];
  const visuals = Object.fromEntries(
    kinds.map((kind) => [kind, <CaseVisual key={kind} kind={kind} />]),
  ) as Record<CaseStudyVisual, React.ReactNode>;

  return (
    <section id="work" aria-labelledby="work-title" className="section-y relative overflow-hidden">
      <div className="container-page">
        <SectionHeading
          id="work-title"
          eyebrow="Work"
          align="left"
          title={
            <>
              Systems Built for <span className="text-heading-soft">Real Outcomes.</span>
            </>
          }
        />
      </div>
      <CaseStudyCarousel studies={caseStudies} visuals={visuals} />
    </section>
  );
}
