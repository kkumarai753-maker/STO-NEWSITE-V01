/**
 * Testimonials.
 *
 * IMPORTANT: these are PLACEHOLDERS, not real people or quotes. Replace them
 * with verified testimonials (with the client's written permission) and set
 * `isPlaceholder: false`. `photo` accepts a path in /public; when omitted an
 * initials avatar is rendered.
 */
export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  company: string;
  photo?: string;
  isPlaceholder: boolean;
};

export const testimonials: Testimonial[] = [
  {
    id: "placeholder-1",
    quote:
      "Placeholder testimonial. Replace with a verified quote describing the business problem, how the team approached it and the outcome the client experienced.",
    name: "Client Name",
    role: "Founder & CEO",
    company: "Company Name",
    isPlaceholder: true,
  },
  {
    id: "placeholder-2",
    quote:
      "Placeholder testimonial. A strong quote mentions a specific system that was built, an automation, an AI integration or a platform, and why it mattered.",
    name: "Client Name",
    role: "Head of Operations",
    company: "Company Name",
    isPlaceholder: true,
  },
  {
    id: "placeholder-3",
    quote:
      "Placeholder testimonial. Ask clients what it was like to work with the team: communication, transparency, delivery quality and long-term support.",
    name: "Client Name",
    role: "CTO",
    company: "Company Name",
    isPlaceholder: true,
  },
];
