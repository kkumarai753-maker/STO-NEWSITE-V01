import { SectionHeading } from "@/components/ui/section-heading";
import { AutomationDemo } from "./automation-demo";

/** AI Automation showcase, server shell; the interactive run is a client island. */
export function AutomationSection() {
  return (
    <section id="automation" aria-labelledby="automation-title" className="section-y relative">
      <div className="container-page">
        <SectionHeading
          id="automation-title"
          eyebrow="AI Automation"
          title={
            <>
              Turn Manual Work Into <span className="text-heading-soft">Intelligent Systems.</span>
            </>
          }
          description="Let AI handle the repetitive work, while your team stays in control of the important decisions."
        />
        <AutomationDemo />
      </div>
    </section>
  );
}
