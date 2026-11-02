# SEO and AI-visibility report: Sunrise Tech Origin

**Date:** 2026-10-18
**Branch:** `seo/technical-seo-and-ai-visibility`
**Live:** deployed to production at https://sunrisetechorigin.com (Vercel deployment `sunrise-g54zhorax`)
**For:** the owner and whoever maintains the site. The original findings are in `SEO-AUDIT.md`; the content roadmap is in `SEO-CONTENT-PLAN.md`.

> ⚠️ **Action needed: push this branch to GitHub and merge it into `main`.**
> These changes were deployed from this machine with the Vercel CLI, because this machine can't push to GitHub ("repository not found": the credentials here don't have access). If Vercel later deploys `main` from GitHub without this branch, **the live site will lose every change below.** Push `seo/technical-seo-and-ai-visibility` from a machine with access and merge it into `main`.

---

## 1. Executive summary

The site was already fast to crawl: static pages, correct redirects and identical HTML for every bot. What held it back was the **content and the signals around it**, and that's what this work fixes. Key numbers:

| Metric | Before | After |
|---|---|---|
| URLs in the sitemap | 5 (home, 3 legal pages, feedback) | **24**, all with real content dates |
| FAQ answers in the HTML | 1 of 9 on home, 1 of 7 on `/faq` | **All of them**, with markup matching the visible content |
| Pages for the core services | 0 | **11** dedicated, answer-first service pages, each with Service, FAQPage and breadcrumb markup and its own social card |
| Inner pages with their own social preview | 0 (every share showed the homepage) | **All of them** |

Other changes:

- **Unverified social profiles** (`crazy.studio2026`) are removed from the site and its structured data.
- **Placeholder testimonials and statistics** no longer show.
- **One official description** of the company (from your brief) is now used by every page, the structured data, `llms.txt` and the website assistant.
- **AI search engines are explicitly welcomed** in `robots.txt`.
- **`/llms.txt` and `/llms-full.txt`** now exist.
- **AI-crawler visits and AI-assistant referrals are logged.**
- **Preview and staging deployments can no longer be indexed.**
- **Mobile performance improved** (section 4). Every page keeps Lighthouse SEO 100 and Accessibility 100.

**Expected impact:**

- Google and Bing can now discover and rank pages for the services you most want to be found for (AI development, integration, automation, chatbots, agents, websites in Nagpur, ERP/CRM/HRMS, SaaS, local SEO).
- AI assistants (ChatGPT, Claude, Perplexity, Gemini) can read, quote and correctly attribute your services, prices and answers.

Rankings take weeks to months, and real proof such as case studies, reviews and a Google Business Profile (section 7) will matter as much as these technical fixes.

---

## 2. Decisions made on your behalf

You asked me to proceed without answering the open questions, so I used the recommended defaults. Each can be reversed:

| Decision | Applied | How to change it |
|---|---|---|
| Unverified social links | Removed from footer, menu and schema; WhatsApp kept as a contact channel | Add real profiles to `sameAs` (and `socials` for icons) in `frontend/config/site.ts` |
| Placeholder testimonials and stats | Hidden | Add real entries and set `isPlaceholder: false` / `statsArePlaceholders = false` |
| AI training crawlers (GPTBot, ClaudeBot, Google-Extended, Applebot-Extended, CCBot) | **Allowed** | Move them to a `disallow: "/"` group in `frontend/app/robots.ts` |
| Analytics | Vercel Web Analytics added but **switched off** | Enable Web Analytics in Vercel → Project → Analytics, set `NEXT_PUBLIC_VERCEL_ANALYTICS=on`, then redeploy. The cookie and privacy policies update automatically. |
| Hindi | Deferred | See the content plan |
| `/register`, `/feedback` | `noindex, follow`, not in the sitemap | `index` in `frontend/config/pages.ts` |
| `/design` | 404 in production | Set `NEXT_PUBLIC_DESIGN_LAB=on` |
| `/cart` | Permanent 308 redirect to `/services` | `redirects()` in `frontend/next.config.ts` |
| New service URLs | `/services/<slug>` | `frontend/data/service-pages.ts` |
| Brand description | Your brief's sentence, verbatim | `description` in `frontend/config/site.ts` |
| Contact details (Gmail, phone, Chitnis Nagar) | Left as they were already published; **not** marked up as a LocalBusiness | Confirm them or replace them in `config/site.ts` (see TODOs) |
| Guarantee-style claims | Softened "round-the-clock monitoring", "guaranteed asset ownership" and "deliver positive ROAS" | Restore them in the division pages only if you can substantiate them |

---

## 3. Every change

All paths are under `frontend/` unless noted.

### Crawling and indexing

| File | What | Why |
|---|---|---|
| `app/robots.ts` | Explicit groups for Googlebot, Bingbot, OAI-SearchBot, ChatGPT-User, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User and the training crawlers; `/api/` and `/admin` disallowed; disallow-all outside production | A clear policy for AI search; previews never indexed |
| `config/site.ts` (`isIndexable`), `next.config.ts` | `X-Robots-Tag: noindex` on every non-production deployment and on `/admin` | Verified on a Vercel preview: robots disallows all and pages send noindex |
| `next.config.ts` | `/cart` → `/services` as a permanent 308 (was a temporary 307); `htmlLimitedBots` includes AI fetchers | Correct redirect signal; metadata stays in `<head>` for AI bots on any future dynamic page |
| `app/design/page.tsx` | 404 in production unless `NEXT_PUBLIC_DESIGN_LAB=on` | An internal tool was public |
| `app/layout.tsx` | Removed the root `canonical: "/"` | Every page without its own canonical was pointing at the homepage |
| `config/site.ts` | Previews fall back to the production domain for canonical URLs | Preview canonicals pointed at `localhost` |

### Metadata

| File | What | Why |
|---|---|---|
| `config/pages.ts` (new) | Registry of every public page: title, description, breadcrumb label, last-updated date, `llms.txt` summary, indexability | One source for metadata, sitemap, breadcrumbs, schema and `llms.txt`, so nothing drifts |
| `lib/seo.ts` → `pageMetadata()` | Per-page title (`%s \| Sunrise Tech Origin`), description, canonical, Open Graph (url, title, description, image) and Twitter | Each page previously inherited the homepage's social tags |
| All `app/**/page.tsx` | Use `pageMetadata()`; titles 50–60 characters with the topic first; descriptions 140–160 characters | Unique, descriptive titles and snippets |
| `lib/server/og-image.tsx`, `app/opengraph-image.tsx`, `app/services/[slug]/opengraph-image.tsx` | Shared social-card renderer; one generated card per service page | Per-page social previews |
| `app/manifest.ts` | Adds a 1080 px raster icon; uses the meta description | Better install and preview icons |

### Sitemaps and indexing signals

| File | What | Why |
|---|---|---|
| `app/sitemap.ts` | 24 URLs from the registry, `lastmod` = date the content last changed | It had 5 URLs and build-time dates |
| `public/81e6fda66e776fa29c728ee540595940.txt`, `scripts/indexnow.mjs`, `npm run indexnow` | IndexNow key and submit script; 24 URLs submitted today (202 Accepted) | Faster discovery in Bing and other IndexNow engines |

### Structured data

| File | What | Why |
|---|---|---|
| `components/seo/json-ld.tsx` | Typed (`schema-dts`) `<JsonLd>` and `<PageSchema>` emitting one `@graph` per page | Type-safe, escaped, connected |
| `lib/seo.ts` | Organization (PNG logo, contact, address locality, area served, no unverified `sameAs`), WebSite, WebPage/AboutPage/ContactPage/CollectionPage with `dateModified`, BreadcrumbList, Service with INR Offers, ItemList for the catalog, FAQPage. All linked by `@id`. | A single entity graph; only describes visible content |

### Content and on-page

| File | What | Why |
|---|---|---|
| `data/service-pages.ts`, `app/services/[slug]/page.tsx` (new) | 11 service pages: AI development, AI integration, AI workflow automation, AI agents, AI chatbots, WhatsApp automation, website development, custom software and apps, ERP/CRM/HRMS, SaaS, local SEO. Each has: an answer-first summary; "What is …?"; what's covered; examples (labelled); price or how it's quoted; process; limitations and data considerations; FAQs; related services. | The main target keywords had no pages |
| `data/faq.ts`, `components/faq/faq-list.tsx`, `app/faq/page.tsx` | One FAQ source (28 questions in 6 topics) on native `<details>` with every answer in the HTML; `/faq` grouped with h2 > h3 | Answers were invisible to crawlers; schema and page disagreed; heading skip |
| `components/products/product-showcase.tsx` | All 7 tab descriptions in the HTML | Only 1 was |
| `components/testimonials/*`, `components/about/metrics-band.tsx` | Placeholders are never rendered | Fake-looking proof on the live site |
| `components/hero/hero.tsx`, `components/ui/page-hero.tsx`, all pages | Descriptive H1s (e.g. "Websites, AI automation and digital marketing in Nagpur"); breadcrumbs from the registry; "Last updated" dates | H1s were slogans only |
| `app/about/page.tsx` | "At a glance" facts: who, what, for whom, where, how you work, contact; links to all services | Entity clarity for search and AI |
| `components/services/service-links.tsx`, `/services`, division pages | Hub → service-page links | New pages are reachable, not orphaned |
| `components/services/services-catalog-client.tsx` | Link text now includes the service name | 17 links said only "Inquire" |
| `config/site.ts`, `lib/server/chat/knowledge.ts`, `data/contact.ts` (deleted) | One official description; the assistant uses it and the ₹ price list instead of US$ budget ranges | Consistent facts everywhere |
| `app/web-technology`, `app/digital-growth` | Softened guarantee-style claims | Your brief rules out unsubstantiated guarantees |

### AI visibility

| File | What | Why |
|---|---|---|
| `lib/llms.ts`, `app/llms.txt/route.ts`, `app/llms-full.txt/route.ts` | `/llms.txt` (index of the site) and `/llms-full.txt` (services, prices, process and FAQs as clean text), static, built from the same data | Low-cost, low-certainty signal (see the note in section 8) |
| `proxy.ts` | One JSON log line per AI crawler hit or AI-assistant referral, by referrer or `utm_source` (chatgpt.com, claude.ai, perplexity.ai, gemini.google.com, copilot.microsoft.com); never changes the response | Monitor AI crawling and AI-sent visitors. Verified in Vercel production logs. |
| `app/layout.tsx`, `config/site.ts`, cookie and privacy pages | Vercel Web Analytics behind `NEXT_PUBLIC_VERCEL_ANALYTICS` (cookieless); policies switch wording with it | Referrer and visit tracking without a consent banner |

### Performance

| File | What | Why |
|---|---|---|
| `components/providers/motion-provider.tsx` + 3 components, `app/layout.tsx` | The motion library loads only where something animates | Shared JavaScript fell about 24 KiB on interior pages |
| `components/ui/accordion.tsx` (deleted) | FAQ uses native HTML | Less client JavaScript |

### Tooling and documents

| File | What | Why |
|---|---|---|
| `scripts/seo-check.mjs` (`npm run seo:check`) | Crawls the sitemap as a browser, search bots and AI bots. Fails on: cloaking, non-200 responses, missing or duplicate titles and descriptions, wrong canonical or `og:url`, H1 ≠ 1, invalid JSON-LD, FAQ markup not visible on the page, broken links, broken OG images. | Repeatable check after every deploy |
| `.env.example` | Documents `SITE_ENV`, `NEXT_PUBLIC_VERCEL_ANALYTICS` and `NEXT_PUBLIC_DESIGN_LAB` | Operations |
| `SEO-AUDIT.md`, `SEO-CONTENT-PLAN.md`, `SEO-REPORT.md` (repo root) | Audit, roadmap, this report | |

---

## 4. Before and after metrics

### Lighthouse 13.5 (mobile, simulated throttling) on the live site

Median of repeated runs per page. "Before" is the old deployment, measured this morning; "after" is the new one.

| Page | Performance | Accessibility | SEO | Best practices | LCP | TBT | CLS | JS transferred |
|---|---|---|---|---|---|---|---|---|
| Home | 73 → **79** | 100 → 100 | 100 → 100 | 100 → 100 | 3.8 → 3.7 s | 447 → 314 ms | 0 → 0 | 296 → 288 KiB |
| Services | 87 → **88** | 100 → 100 | 100 → 100 | 100 → 100 | 3.4 → 3.2 s | 196 → 157 ms | 0 → 0 | 296 → 273 KiB |
| About | 88 → **90** | 100 → 100 | 100 → 100 | 100 → 100 | 3.3 → 3.2 s | 175 → 124 ms | 0 → 0 | 287 → 265 KiB |
| FAQ | 91 → 90 | 98 → **100** | 100 → 100 | 100 → 100 | 2.9 → 3.1 s | 181 → 148 ms | 0.058 → **0** | 293 → 264 KiB |
| Web & Technology | 87 → **89** | 100 → 100 | 100 → 100 | 100 → 100 | 3.3 → 3.2 s | 198 → 176 ms | 0 → 0 | 296 → 273 KiB |
| Contact | 93 → 83 ⚠️ | 100 → 100 | 100 → 100 | 100 → 100 | 2.9 → 3.2 s | 160 → 309 ms | 0 → 0 | 293 → 270 KiB |

Number of runs: 3 for every "before" page. For "after": 3 for Home, Services and About; 8 for FAQ and Web & Technology; 7 for Contact.

**How to read this:**

- **The size-based measures can be relied on:**
  - **JavaScript:** down 3–10% on every page.
  - **CLS:** FAQ now 0.
  - **Accessibility:** FAQ now 100.
  - **SEO and Best Practices:** 100 everywhere.
- **The time-based scores (Performance, LCP, TBT) depend on this laptop's CPU at the moment of each run, and moved more than the code did:**
  - Identical code (the Turbopack runtime) took a median of 116 ms to execute in the before session and 279 ms in some after runs.
  - Single runs of an unchanged page ranged from 69 to 90.
  - Contact changed least of all (only its heading, metadata and schema) yet shows the largest drop. That points to measurement noise, not a regression.
  - Confirm with PageSpeed Insights (https://pagespeed.web.dev; today's free API quota was used up) and with real-user data from Search Console's Core Web Vitals report.
- The FAQ page now carries all 28 answers in its HTML (395 → 699 DOM elements), compared with 7 questions and one visible answer before.

Notes:

- Lab numbers on this laptop vary by ±10 points between runs, so medians are shown.
- Field data matters more. Google's Core Web Vitals report in Search Console needs a few weeks of traffic.
- **Vercel firewall note:** after about 1,000 test requests from one IP (many using search- and AI-bot user agents), Vercel's firewall began answering that IP with a "Security Checkpoint" challenge (`403`, `X-Vercel-Mitigated: challenge`). This is Vercel's automatic protection against a single source that behaves like a bot, and it should clear on its own. Every measurement above was taken before it started, except one run, which errored and was excluded. Please check Vercel → Project → Firewall and confirm that Attack Challenge Mode is off and that the Bot Protection / AI Bots managed rules are not set to block or challenge. Real search and AI crawlers come from their own published IP ranges, so a challenge on this one IP doesn't affect them.
- **LCP is still above the 2.5 s target in the lab.** The largest remaining cost is painting the full-page "grain" texture and decorative effects on low-power devices. An experiment that removed the grain cut `/about`'s first paint from 1.4 s to 0.3 s in one run, but results were inconsistent, so **the design was left unchanged**. Revisit with real-user data (enable Vercel Speed Insights) before changing the look.

### Crawl and content checks (`npm run seo:check` against production)

24 sitemap pages × 8 user agents (browser, Googlebot, Bingbot, OAI-SearchBot, ChatGPT-User, Claude-SearchBot, Claude-User, PerplexityBot), 70 internal links and 13 OG images: **0 errors, 0 warnings.**

That covers:

- every page returns 200 with identical text for every user agent (no cloaking)
- one H1 per page
- unique titles and descriptions
- canonical and `og:url` equal to the page URL
- every FAQ in the markup is visible on the page

### Structured data

A local validator checked every page against Google's required properties per type (Organization, WebSite, WebPage, BreadcrumbList, Service/Offer, ItemList, FAQPage) and confirmed that every `@id` reference resolves. **Result: 0 errors.**

- Google's Rich Results Test and the Schema.org validator need a browser. Run them on 3–4 URLs as a final check (section 7).
- FAQ rich results are only shown for limited site types; the markup still helps machines read the page.

### Other verifications

- **Mobile layout:** no horizontal overflow on any of the 24 pages at 390 px; desktop screenshots reviewed.
- **Preview deployment:** robots.txt disallows everything, and pages send `X-Robots-Tag: noindex` and a noindex meta tag.
- **Production:** indexable, with no `X-Robots-Tag`.
- **Redirects:**
  - `http://` → `https://` (308)
  - `www` → apex domain (308)
  - trailing slash removed (308)
  - `/cart` → `/services` (308)
- **404s:** `/design` and unknown service slugs return 404.
- **Build checks:** build passes, `tsc` is clean, ESLint shows 0 errors (9 pre-existing unused-import warnings in files not touched).

---

## 5. TODO(owner): facts only you can provide

Nothing below has been invented. Each item is marked `TODO(owner)` in the code or noted in the content plan.

1. **Contact details** (`config/site.ts`)
   - Confirm `kkumarai753@gmail.com`, `+91 87668 03990` and "Chitnis Nagar, Nagpur" as the official public details.
   - Add the street address and PIN.
   - Switch to a domain email (e.g. `hello@sunrisetechorigin.com`).
   - With a confirmed address that clients can visit, LocalBusiness markup can be added.
2. **Social profiles:** once created, add them to `sameAs` (structured data) and `socials` (icons).
3. **Founder and company:**
   - Founder's public name, title, bio, photo and LinkedIn
   - Founding year
   - Registered entity name and type
   - These enable the founder Person schema, `foundingDate` and the About page "Founded" and "Leadership" rows.
4. **Services:** confirm each of the 11 service pages describes something you deliver today. Add real tools and platforms, typical timelines and starting prices for AI services (`data/service-pages.ts`).
5. **Proof:** real case studies, testimonials (with written permission) and verifiable statistics.
6. **FAQ:** validate the 28 questions against real sales conversations (`data/faq.ts`).
7. **Legal:** have the privacy, terms and cookie policies reviewed, then remove the "Template content" notice.
8. **Service area:** confirm whether to mention international clients.

---

## 6. How to operate it

| Task | How |
|---|---|
| Edit a page's title or description | `frontend/config/pages.ts` (service pages: `frontend/data/service-pages.ts`), then update its `updated` date |
| Change a price | `frontend/data/services-catalog.ts` only. The FAQ, service pages, schema, `llms.txt` and assistant all follow. |
| Add an FAQ | `frontend/data/faq.ts` |
| Add a service page | Append to `frontend/data/service-pages.ts`; the route, sitemap, schema, OG image and `llms.txt` are generated |
| After each deploy | `npm run seo:check -- https://sunrisetechorigin.com` from `frontend/` |
| After content changes | `npm run indexnow` from `frontend/` (all URLs) or `npm run indexnow -- /services/seo` |
| See AI crawler and referral activity | Vercel → Project → Logs, search `ai-traffic` (`kind: crawler` or `referral`). Running `seo:check` adds entries of its own; real bots can be confirmed by their published IP ranges. |

---

## 7. Off-site checklist (Phase 9: for you; can't be done from code)

**Search engines**

- [ ] **Google Search Console:**
  1. Add a *Domain* property for `sunrisetechorigin.com`.
  2. Verify with the DNS TXT record (add it at your DNS provider, or in Vercel → Domains if Vercel hosts DNS).
  3. Submit `https://sunrisetechorigin.com/sitemap.xml` under Sitemaps.
  4. Use URL Inspection → Request indexing on `/`, `/services`, `/about` and 3–4 service pages.
- [ ] **Bing Webmaster Tools:** import the site from Search Console (one click), or verify with DNS. Submit the same sitemap. IndexNow submissions will appear there.
- [ ] **Final structured-data check:** run Google's Rich Results Test (https://search.google.com/test/rich-results) and the Schema Markup Validator (https://validator.schema.org) on `/`, `/faq`, `/services/ai-chatbots` and `/services/website-development`.

**Local presence**

- [ ] **Google Business Profile** (if you serve clients at or from a Nagpur address). Use exactly the same name, address and phone as the website ("Sunrise Tech Origin", the confirmed address, +91 87668 03990). Choose accurate categories, add services, photos and hours (Mon–Sat 9:00–19:00), and link the website. Ask real clients for reviews; never buy or write them.

**Profiles and directories**

- [ ] **Consistent profiles** with the same name, description and website link: LinkedIn company page first, then Instagram, Facebook, YouTube and X as you create them. Add a Crunchbase profile, and GitHub if you publish code. Add relevant directories (Clutch, GoodFirms, Justdial, IndiaMART) only where they fit. Then add every profile URL to `sameAs`.

**Earned mentions** (helpful, never spam)

- [ ] Guest articles on AI and automation for Indian SMBs
- [ ] Podcast and YouTube appearances
- [ ] Genuinely helpful answers on Reddit and Quora that disclose who you are
- [ ] Local news and PR
- [ ] Partner and client pages that link to you (with permission)

**Monthly AI visibility check**

- [ ] With web search switched on, ask ChatGPT, Claude, Perplexity and Gemini the 20 most important questions from your brief (for example "best AI automation company in Nagpur", "who builds WhatsApp chatbots in India", "Sunrise Tech Origin services").
- [ ] Log in a sheet whether you're mentioned, whether you're cited (with which URL), and which competitors appear.
- [ ] Compare with the `ai-traffic` logs and the Vercel Analytics referrers.

**Measurement**

- [ ] Enable Vercel Web Analytics (and Speed Insights), then set `NEXT_PUBLIC_VERCEL_ANALYTICS=on`.
- [ ] Track enquiries per source.

---

## 8. What to monitor

| When | Check | Healthy looks like |
|---|---|---|
| **Days 1–30** | Search Console → Pages (indexing), Sitemaps, URL inspection of the service pages; Bing Webmaster IndexNow report; `ai-traffic` logs | Most of the 24 URLs indexed; no "Duplicate without canonical" or "Crawled – not indexed" for service pages; OAI-SearchBot / Claude-SearchBot / PerplexityBot visits appearing |
| **Days 31–60** | Search Console → Performance: impressions and queries per page; Core Web Vitals (field) | Impressions for service queries (e.g. "AI chatbot development", "website development Nagpur"); CWV "Good" or "Needs improvement" with no regressions |
| **Days 61–90** | Clicks, enquiries and qualified leads by landing page and source (including chatgpt.com, perplexity.ai); monthly AI visibility log | Service pages generating enquiries; brand cited in at least some AI answers; decide which content-plan pages to write next |
| **Ongoing** | `npm run seo:check` after every deploy; refresh schedule in `SEO-CONTENT-PLAN.md` | 0 errors |

**About `llms.txt`:** it is a community proposal. Major assistants have not confirmed that they use it, so treat it as a low-cost, low-certainty addition. What reliably drives AI visibility is crawlable, factual pages (now in place) and mentions on other trusted sites.
