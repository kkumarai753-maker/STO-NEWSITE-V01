import { pages, type PageEntry } from "@/config/pages";
import { absoluteUrl, siteConfig } from "@/config/site";
import { faqs, faqTopics } from "@/data/faq";
import { projectSteps } from "@/data/process";
import { servicePages } from "@/data/service-pages";
import { SERVICES } from "@/data/services-catalog";

/**
 * llms.txt (https://llmstxt.org): a Markdown index of the site for AI
 * assistants, plus llms-full.txt with the key facts as clean text. Both are
 * generated from the same config and data as the pages, so they never drift.
 */

const url = (path: string) => (path === "/" ? siteConfig.url : absoluteUrl(path));
const link = (p: PageEntry) => `- [${p.label}](${url(p.path)}): ${p.summary}`;
const indexed = pages.filter((p) => p.index !== false);
const group = (g: PageEntry["group"]) => indexed.filter((p) => p.group === g).map(link).join("\n");

const facts = () =>
  [
    `- Based in: ${siteConfig.contact.location}`,
    `- Serves: businesses across ${siteConfig.areaServed}`,
    `- Who it is for: ${siteConfig.audience}`,
    `- Quotes: every project is quoted in writing after a free consultation`,
    `- Payments: 10% to book, 50% to start production, 40% at final handover`,
    `- Ownership: domain, hosting, code and accounts stay registered to the client`,
    `- Contact: ${siteConfig.contact.email}, ${siteConfig.contact.phone} (call or WhatsApp), ${siteConfig.contact.hours}`,
  ].join("\n");

export function llmsTxt() {
  return `# ${siteConfig.name}

> ${siteConfig.description}

${facts()}

## Main pages
${group("main")}

## Services
${group("services")}

## Company
${group("company")}

## Contact
${group("contact")}

## Optional
${group("legal")}
- [Full text for AI assistants](${url("/llms-full.txt")}): services, process and FAQs as plain text.
`;
}

export function llmsFullTxt() {
  const services = servicePages
    .map((s) => {
      return `## ${s.name}

URL: ${url(`/services/${s.slug}`)}
Last updated: ${s.updated}

${s.answer}

### ${s.explainer.heading}

${s.explainer.body.join("\n\n")}

### ${s.offerings.heading}

${s.offerings.items.map((i) => `- ${i.title}: ${i.desc}`).join("\n")}

### ${s.considerations.heading}

${s.considerations.items.map((i) => `- ${i.title}: ${i.desc}`).join("\n")}`;
    })
    .join("\n\n");

  const catalog = (["web", "growth"] as const)
    .map(
      (g) =>
        `### ${g === "web" ? "Web & Technology" : "Digital Marketing & Growth"}\n\n` +
        SERVICES.filter((s) => s.group === g)
          .map((s) => `- ${s.name}: ${s.desc}`)
          .join("\n"),
    )
    .join("\n\n");

  const faq = faqTopics
    .map((t) => {
      const items = faqs.filter((f) => f.topic === t.id);
      return `### ${t.title}\n\n${items.map((f) => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n")}`;
    })
    .join("\n\n");

  return `# ${siteConfig.name}: full text

> ${siteConfig.description}

Source: ${url("/")}. Generated from the same content as the website.

## Key facts

${facts()}

## Services

${catalog}

## How a project works

${projectSteps.map((s) => `${s.num}. ${s.title} (${s.timeline}): ${s.desc} Deliverable: ${s.deliverable}.`).join("\n")}

${services}

## Frequently asked questions

${faq}
`;
}
