# SEO and AI-visibility content plan: Sunrise Tech Origin

**Prepared:** 2026-10-18
**For:** the owner, plus whoever writes or approves website content

This plan covers what to publish next and how to improve existing pages. **It contains no invented facts.** Wherever a page needs a fact only you have (a price, a project, a person or a result), it says so. Search volumes and difficulty are not included; they need a keyword tool (Google Keyword Planner, Ahrefs, Semrush) and Search Console data once the site has been indexed for a few weeks.

How pages are wired, so new ones are consistent:

- **New pages** are added to `frontend/config/pages.ts`. That one entry feeds the title, description, canonical, sitemap, breadcrumbs, structured data and `llms.txt`.
- **New services** are added to `frontend/data/service-pages.ts`. The template at `/services/<slug>` renders them.
- **New FAQs** go in `frontend/data/faq.ts`. They then appear on `/faq`, on service pages, in FAQPage markup and in the website assistant.
- **When you edit a page's copy**, update its `updated` date in the registry. The visible "Last updated" line, the sitemap and the structured data all read it.

---

## 1. Topic clusters

Each cluster has one **pillar** page (broad topic) and **cluster** pages (specific questions), linked both ways. Intent abbreviations: **C** = commercial (comparing providers), **T** = transactional (ready to enquire), **I** = informational (learning).

Question numbers (Q1–Q25) refer to the 25 customer questions in your brief.

### Cluster A: AI development and integration

- **Pillar:** `/services/ai-development` ✅ live
- **Cluster pages:** `/services/ai-integration` ✅ live; planned guides 4, 9 and 10 (section 3)

| Target keywords | Intent | Questions answered |
|---|---|---|
| AI development company India; AI development services Nagpur; custom AI solutions for businesses | C/T | Q2, Q3 |
| AI integration services; AI application development company; business AI implementation | C/T | Q4, Q9, Q21 |
| Generative AI development services; AI-powered software development; AI solutions for small businesses | C/I | Q3, Q9 |

### Cluster B: AI workflow automation and agents

- **Pillar:** `/services/ai-workflow-automation` ✅ live
- **Cluster pages:** `/services/ai-agents`, `/services/ai-chatbots` and `/services/whatsapp-automation` ✅ live; planned guides 2, 5, 6, 7, 8 and 13

| Target keywords | Intent | Questions answered |
|---|---|---|
| AI workflow automation services; AI automation company India; AI automation services Nagpur | C/T | Q5, Q8 |
| Business process automation using AI; intelligent process automation; repetitive task automation | C/I | Q5, Q8, Q21 |
| AI agents development services | C | Q7 |
| AI chatbot development services; AI customer support automation | C/T | Q6 |
| AI lead qualification and automation; AI sales automation | C/I | Q14 |
| AI-powered WhatsApp automation; CRM workflow automation | C/T | Q13, Q12 |

### Cluster C: business software

- **Pillar:** `/services/erp-crm-hrms` ✅ live
- **Cluster pages:** `/services/saas-development` and `/services/custom-software-development` ✅ live; planned guide 6

| Target keywords | Intent | Questions answered |
|---|---|---|
| ERP software solutions India; CRM implementation services; CRM setup services; HRMS software solutions | C/T | Q16, Q12 |
| SaaS development company India | C/T | Q17 |
| AI integration with CRM and ERP | C/I | Q12 |
| Software development company Nagpur; application development services | C/T | Q15 |

### Cluster D: websites

- **Pillar:** `/services/website-development` ✅ live
- **Hub:** `/web-technology` ✅ live
- **Cluster pages:** planned guide 12

| Target keywords | Intent | Questions answered |
|---|---|---|
| Website development company Nagpur; web development services Nagpur; custom website development company | C/T | Q15, Q23 |
| Website redesign; website and AI integration for businesses | C/I | Q4 |

### Cluster E: digital marketing, SEO and lead generation

- **Pillar:** `/digital-growth` ✅ live
- **Cluster pages:** `/services/seo` ✅ live; planned pages 15–18

| Target keywords | Intent | Questions answered |
|---|---|---|
| Digital marketing agency Nagpur; digital marketing services for startups | C/T | Q18 |
| SEO services Nagpur; SEO services for small businesses | C/T | Q18 |
| Social media management services; Google Ads / Meta Ads management; performance marketing services India | C/T | Q18 |
| Lead generation services India; sales funnel development services | C/T | Q19 |
| Business branding services | C/T | none |

### Cluster F: brand and trust

- **Pages:** `/about`, `/how-we-work`, `/faq`, `/services` (pricing) ✅ live; planned 1, 3, 11 and author pages

| Target keywords | Intent | Questions answered |
|---|---|---|
| Sunrise Tech Origin (+ services / AI services / AI automation / technology solutions) | navigational | Q1 |
| Pricing, process, ownership, support, service area | C | Q10, Q11, Q20, Q22, Q23, Q24, Q25 |

---

## 2. Existing pages: target query, current gap, recommended next step

### Home `/`
- **Target query:** Sunrise Tech Origin; website, AI automation and digital marketing company in Nagpur
- **Gap:** There's no proof (real projects, testimonials and stats are hidden until verified). The "Automation & software" list links to the contact form rather than to the new service pages.
- **Next step:**
  - Add 2–3 real project summaries when available.
  - Give each row in the "Automation & software" list a secondary link to its service page.

### `/services`
- **Target query:** services and prices; AI services pricing
- **Gap:** AI services have no starting prices.
- **Next step:** Add AI starting prices (or price ranges) once decided, and a short "which service do I need?" table.

### `/web-technology`, `/digital-growth`
- **Target query:** web development services Nagpur; digital marketing agency Nagpur
- **Gap:** Thin (about 250–350 words of unique copy).
- **Next step:** Add a 2–3 sentence summary at the top that answers "what does this division do?", 3 FAQs each, and real project examples.

### `/about`
- **Target query:** who is Sunrise Tech Origin
- **Gap:** No founder, founding year, team or photos.
- **Next step:** Add founder name, title and bio (with LinkedIn), founding year, registered entity, team size, an office photo and the Google Business Profile link. **Needs owner facts.**

### `/why-us`
- **Target query:** why choose Sunrise Tech Origin; agency vs freelancer
- **Gap:** The comparison table describes all agencies and freelancers in negative general terms.
- **Next step:** Rephrase as neutral trade-offs (for example "Agencies: often separate teams for tech and marketing") and add proof points.

### `/how-we-work`
- **Target query:** how a project works; milestone payments
- **Gap:** Timelines are generic.
- **Next step:** Add typical timelines per project type once confirmed.

### `/faq`
- **Target query:** all 25 buyer questions
- **Gap:** The questions are proposed, not validated.
- **Next step:** Check them against real sales calls and Search Console queries every quarter; add the questions people actually ask.

### `/contact`
- **Target query:** contact Sunrise Tech Origin Nagpur
- **Gap:** No street address or map, and the email is Gmail.
- **Next step:** Add the street address and map once confirmed, a domain email, and the Google Business Profile link.

### The 11 `/services/*` pages
- **Target query:** see section 1
- **Gap:** No real projects, tools or timelines yet.
- **Next step:** For each page add the real tools and platforms used, typical timeline, one real example and a starting price where possible. Ask "what would a buyer need to see before calling?"

### Legal pages
- **Target query:** none (trust)
- **Gap:** Marked "Template content".
- **Next step:** Legal review, then remove the notice and update the dates.

---

## 3. New pages to create (priority order)

URLs are suggestions. Guides would live under `/guides/` (a new section). Each page should:

- open with a 2–3 sentence direct answer
- use question-style H2s
- show a visible "Last updated" date
- link to its pillar service page

| # | Page | Target question | H2 outline | Internal links | Owner facts needed |
|---|---|---|---|---|---|
| 1 | **Our work / case studies** `/work` + one page per project | "Have you done this before?" | The problem · What we built · Tools used · Result (only verified numbers) · Client quote (with permission) | Related service pages, `/about` | **Yes:** real projects, permissions, results |
| 2 | **What to automate first with AI** `/guides/ai-automation-small-business` | How AI automation helps small businesses | Which tasks are good candidates · Which are not · How to estimate time saved · Keeping a person in the loop · Next steps | AI workflow automation, AI chatbots, FAQ | No |
| 3 | **AI automation and development cost in India** `/guides/ai-automation-cost` | How much does AI development cost? | What drives cost · Typical project types and ranges · Ongoing costs (model usage, hosting, WhatsApp fees) · How to get a quote | `/services`, AI pages, `/inquiry` | **Yes:** your real price ranges |
| 4 | **AI integration vs custom AI development** `/guides/ai-integration-vs-custom-ai` | Which one do I need? | Definitions · Comparison table · When each is right · Examples · Questions to ask | AI integration, AI development | No |
| 5 | **AI chatbot vs AI agent** `/guides/ai-chatbot-vs-ai-agent` | What's the difference? | Definitions · Comparison table · Risks and controls · Which to start with | AI chatbots, AI agents | No |
| 6 | **How to connect AI to your CRM** `/guides/ai-crm-integration` | How to integrate AI with CRM software | What AI can do in a CRM · Data you need · Integration options · Privacy · Steps | ERP/CRM/HRMS, AI integration | No (add your tools if you like) |
| 7 | **WhatsApp Business automation guide (India)** `/guides/whatsapp-business-automation` | How to automate WhatsApp business workflows | WhatsApp Business app vs Platform · Opt-in rules · Message fees · Common workflows · Setup steps | WhatsApp automation, AI chatbots | No (verify current Meta pricing at the time of writing) |
| 8 | **AI lead qualification explained** `/guides/ai-lead-qualification` | Can AI qualify leads and follow up? | How it works · Criteria to define · Hand-off to sales · Measuring it | AI workflow automation, CRM | No |
| 9 | **AI data privacy and security checklist** `/guides/ai-data-privacy-checklist` | How do you handle data privacy and AI security? | What data AI sees · Third-party providers and retention · Access control · Human review · India's DPDP Act 2023 basics (have it reviewed) | Privacy policy, all AI pages | **Yes:** your actual practices |
| 10 | **How to choose an AI development company** `/guides/choose-ai-development-company` | How to choose an AI development company | Questions to ask · Red flags · Ownership and handover · Pricing models | AI development, How we work | No |
| 11 | **AI glossary for business owners** `/glossary` | What is an AI agent / LLM / RAG / API / CRM / ERP? | One H2 per term: a 2–3 sentence definition and a link | Every service page | No |
| 12 | **Website development cost in India** `/guides/website-cost` | How much does a website cost? | What affects price · Our starting prices (from the catalog) · Ongoing costs · Ownership | Website development, `/services` | No (prices come from the catalog) |
| 13 | **Generative AI use cases for small businesses** `/guides/generative-ai-use-cases` | What can generative AI do for my business? | Use cases by department · Limits · Getting started | AI development | No |
| 14 | **AI customer support: examples and limits** `/guides/ai-customer-support` | How do AI chatbots improve customer support? | What to automate · Hand-off design · Measuring quality · Limits | AI chatbots | No |
| 15 | **Performance marketing (Meta and Google Ads)** `/services/performance-marketing` | Do you run Meta and Google Ads? | Answer-first summary · What's included · Price (₹8,000/month starting) · How campaigns are reported · FAQs | Digital growth, SEO, lead generation | Reporting process |
| 16 | **Social media management** `/services/social-media-management` | Do you manage social media? | Summary · Platforms · Content and reels · Price (₹10,000 / ₹15,000 per month) · FAQs | Digital growth, branding | Platforms covered |
| 17 | **Branding and logo design** `/services/branding` | Do you do logo and branding? | Summary · Packages (₹500 / ₹800 / ₹15,000) · Process · FAQs | Digital growth | Samples of real work |
| 18 | **Lead generation and sales funnels** `/services/lead-generation` | Can you generate qualified leads? | Summary · Funnel components · Price (₹8,000 setup) · What results depend on · FAQs | Digital growth, AI lead qualification | No |
| 19 | **Sales and operations consulting** `/services/sales-operations-consulting` | Do you help with sales processes? | Summary · What's covered · How engagements work | CRM, automation | **Yes:** confirm the service exists and its scope |
| 20 | **Industry pages** (for example `/industries/clinics`) | AI automation for {industry} | Common workflows · Examples · Compliance notes | Relevant services | **Yes:** only where you have real experience (otherwise these are doorway pages, so skip them) |

**Also, once facts are confirmed:**
- Founder and author pages (`/team/<name>`) with a Person schema
- A Hindi version of the top 5 pages, with professionally reviewed translations
- `[Brand] vs [Competitor]` pages only for named competitors you're comfortable comparing honestly

---

## 4. Refresh schedule

| What | How often | What to check |
|---|---|---|
| `/services` and the prices on every service page | Monthly, and whenever prices change | Prices are edited only in `data/services-catalog.ts`; the FAQ, service pages and assistant update automatically |
| FAQ (`data/faq.ts`) | Quarterly | New questions from sales calls and Search Console queries |
| AI service pages and AI guides | Quarterly (AI tools change fast) | Accuracy of the model and provider descriptions, WhatsApp/Meta policies and fees |
| Case studies | When a project ships | Add it, link it from its service page |
| About, contact, NAP | When anything changes | Keep them identical to the Google Business Profile |
| Legal pages | Yearly, or when practices change | Legal review |
| `llms.txt`, sitemap | Automatic on every deploy | Run `npm run seo:check` after deploying and `npm run indexnow` after content changes |

Each time a page changes, update its `updated` date in `config/pages.ts` (or `data/service-pages.ts`).
