/** "From Idea to Production", how a project runs, in plain language. */
export type ProcessStep = {
  number: string;
  title: string;
  description: string;
};

export const processSteps: ProcessStep[] = [
  { number: "01", title: "Discovery", description: "We learn about your business, goals and challenges." },
  { number: "02", title: "Strategy", description: "We agree on what to build first and set a clear plan." },
  { number: "03", title: "UX and Architecture", description: "We plan how it will work for users and behind the scenes." },
  { number: "04", title: "UI Design", description: "We design screens that are clean and easy to use." },
  { number: "05", title: "Development", description: "We build it in small steps and show you progress weekly." },
  { number: "06", title: "Testing", description: "We check that everything works, is secure and is fast." },
  { number: "07", title: "Deployment", description: "We launch it safely, without disrupting your business." },
  { number: "08", title: "Optimization", description: "We watch how it is used and keep making it better." },
];

/** The four commercial steps of every project, with milestone payments (How We Work page and service pages). */
export const projectSteps = [
  {
    num: "01",
    title: "Enquiry & discovery",
    desc: "We discuss your specific business goals, target audience, budget boundaries, and desired digital outcomes through our consultation call or WhatsApp.",
    deliverable: "Initial project brief & scope discovery",
    timeline: "Day 1–2",
  },
  {
    num: "02",
    title: "Scope & booking (10% token)",
    desc: "You receive a clear scope document with itemized deliverables, timeline, milestones, and formal quotation. A 10% token payment locks in your project slot.",
    deliverable: "Approved scope agreement & project slot",
    timeline: "Day 3–4",
  },
  {
    num: "03",
    title: "Strategy & production (50% payment)",
    desc: "With 50% payment activated, our engineering and creative team begin full production. You receive structured checkpoints to preview and provide feedback.",
    deliverable: "Active build, staging previews & design iterations",
    timeline: "Week 1–3",
  },
  {
    num: "04",
    title: "Approval & handover (40% final)",
    desc: "Following your final review and sign-off, the remaining 40% is completed. We transfer full account ownership, deployment credentials, and live assets.",
    deliverable: "Live deployment, credentials & training handover",
    timeline: "Final delivery",
  },
];
