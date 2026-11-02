# SEO and AI-visibility audit: Sunrise Tech Origin

- **Audited:** 2026-10-18, commit `4c8f63b` (branch `abhishek-changes`), plus the live site at https://sunrisetechorigin.com
- **Scope:** `frontend/` (the public website). The FastAPI `backend/` serves no public pages and is out of scope.
- **Status:** Findings as of Phase 0. Most items were fixed and deployed on 2026-10-18; see `SEO-REPORT.md` for what changed, the decisions taken on the open questions in section 11, and the remaining owner TODOs.

---

## 1. Summary

The site has a better foundation than most: every public page is statically prerendered, all crawlers get the same full HTML, redirects for host, protocol and trailing slash are correct, and there is a structured-data and metadata system. Lighthouse SEO is 100 on every audited page.

The gaps are about **what** the HTML says and **how much** of it there is, not about crawlability:

| # | Most important findings | Priority |
|---|---|---|
| C1 | Only 1 of 9 home FAQ answers (and 1 of 7 on `/faq`) is in the HTML. The rest are injected on click. The FAQPage JSON-LD claims all of them, so markup and visible content disagree. | Critical |
| C2 | The Organization `sameAs`, the footer and the mobile menu link to `crazy.studio2026` Instagram, YouTube, Facebook and Threads accounts. You've said no official social accounts exist yet. | Critical |
| C3 | Placeholder testimonials ("Client Name, Company Name") and placeholder stats ("50+ Projects Delivered", "99% Smooth launches") are live on the home page. | Critical |
| H1 | The sitemap lists 5 URLs: home, the 3 legal pages and `/feedback`. Services, About, FAQ, How We Work, Contact and both division pages are missing. | High |
| H2 | Every inner page inherits the homepage's `og:url` and `og:title`, so shared links all look like the homepage. | High |
| H5 | AI development, integration, automation, agents, chatbots, ERP/CRM/HRMS and SaaS have no pages at all, so the main target keywords have nowhere to rank. | High |
| M1 | Mobile performance is 71–85, with LCP at 4.0–5.0 s (lab) on every page. | Medium |

---

## 2. Stack

| Item | Finding |
|---|---|
| Framework | Next.js **16.3.8** (Turbopack), React **19.2.8**. App Router only, no `pages/`. |
| Language | TypeScript (strict), ESLint 9 (`eslint-config-next` core-web-vitals + typescript) |
| Styling | Tailwind CSS v4, shadcn/ui on Radix (`radix-ui`), `motion` for a few animations |
| Fonts | `next/font/google`: Geist (preloaded) plus Plus Jakarta Sans, Inter, Sora and DM Sans (`preload: false`, left over from the design lab) |
| Content source | Hard-coded TypeScript in `frontend/data/*.ts`, `frontend/config/site.ts` and inline in each `page.tsx`. No CMS, MDX or database for marketing content. |
| Dynamic data | Contact and registration forms go through Server Actions to the FastAPI backend (PostgreSQL). `/api/chat` is an AI assistant on the Anthropic API, currently hidden in the UI. |
| Hosting | **Vercel**: `Server: Vercel`, edge region `bom1`, with Docker/standalone as an alternative (`output: "standalone"`) |
| i18n | None. `<html lang="en">`, `og:locale` `en_IN`. |
| Proxy (middleware) | `frontend/proxy.ts`, matching `/admin` and `/admin/:path*` only. If there's no admin cookie it redirects to `/admin/login`. Public pages are untouched. |
| Analytics | None. The CSP in `next.config.ts` allows only `'self'` scripts. |

---

## 3. Route inventory

All public pages are `○ Static` (prerendered at build). "Main words" counts words inside `<main>` only, without nav, footer or scripts.

| Route | Render | Indexable | In sitemap | Canonical | H1 | Main words |
|---|---|---|---|---|---|---|
| `/` | Static | yes | yes | self | Build smarter. Grow digitally. Operate better. | 1,200 |
| `/about` | Static | yes | **no** | self | Practical technology. Connected growth. | 241 |
| `/services` | Static | yes | **no** | self | Choose what your business needs. | 414 |
| `/web-technology` | Static | yes | **no** | self | Web & technology solutions. | 252 |
| `/digital-growth` | Static | yes | **no** | self | Digital marketing & growth. | 353 |
| `/why-us` | Static | yes | **no** | self | One partner. Clear ownership. Practical growth. | 336 |
| `/how-we-work` | Static | yes | **no** | self | Clear milestones. No hidden confusion. | 251 |
| `/faq` | Static | yes | **no** | self | Answers before you begin. | 142 |
| `/contact` | Static | yes | **no** | self | Let's discuss your next move. | 163 |
| `/inquiry` | Static | yes | **no** | self | Tell us what you want to build. | 193 |
| `/register` | Static | yes | **no** | self | Get registered & start your project. | 185 |
| `/feedback` | Static | yes | yes | self | Help us improve. | 136 |
| `/privacy`, `/terms`, `/cookies` | Static | yes | yes | self | (document title) | 150–273 |
| `/cart` | Static | n/a | no | n/a | **307** temporary redirect to `/services` | n/a |
| `/design` | Static | noindex | no | **inherits `/`** | Design lab (internal tool), live in production | n/a |
| `/admin`, `/admin/*` | Dynamic | noindex | no | **inherits `/`** | Behind proxy + session; `/admin` 307s to `/admin/login` | n/a |
| `/api/chat` | Dynamic | n/a | no | n/a | POST only (GET returns 405) | n/a |
| `/robots.txt`, `/sitemap.xml`, `/manifest.webmanifest` | Static | n/a | n/a | n/a | Generated by `app/robots.ts`, `app/sitemap.ts`, `app/manifest.ts` | n/a |
| `/opengraph-image`, `/apple-icon`, `/icon.svg` | Static | n/a | n/a | n/a | Generated PNGs / SVG | n/a |
| any unknown URL | n/a | n/a | n/a | n/a | Real **404** (`app/not-found.tsx`) | n/a |

There are no dynamic `[slug]` routes, no blog, and no per-service pages.

**Client-only content:** no page depends on JavaScript for its main content. The exceptions are collapsed or tabbed widgets, which render only their active item into HTML:

- FAQ accordions: `components/ui/accordion.tsx`, used by `components/faq/faq-section.tsx` and `app/faq/page.tsx`
- Product showcase tabs: `components/products/product-showcase.tsx`, where 1 of 7 tab descriptions is in the HTML
- Testimonials carousel: `components/testimonials/animated-testimonials.tsx`

---

## 4. Existing SEO inventory

| Area | Status | Where |
|---|---|---|
| `metadataBase` | Set from `NEXT_PUBLIC_SITE_URL`. Production resolves to `https://sunrisetechorigin.com` (verified live); locally it's `http://localhost:3000`. | `app/layout.tsx`, `config/site.ts` |
| Title template | `%s · Sunrise Tech Origin`; default `Sunrise Tech Origin \| Technology Solutions & Digital Growth` | `app/layout.tsx` |
| Per-page metadata | Static `metadata` export on every public page (title, description, canonical). No `openGraph` or `twitter` overrides. | `app/*/page.tsx` |
| Canonical | Self-referencing on all public pages. The root layout also sets `canonical: "/"`, which any page without its own inherits. | `app/layout.tsx` |
| Open Graph / Twitter | Root only, plus one generated OG image (`app/opengraph-image.tsx`). Inner pages inherit the homepage's `og:url` and `og:title`. | |
| robots meta | `index, follow` + `max-image-preview:large`; admin and design are `noindex, nofollow` | |
| `robots.txt` | `User-Agent: * / Allow: / / Disallow: /api/` + non-standard `Host:` + sitemap | `app/robots.ts` |
| `sitemap.xml` | 5 URLs, `lastmod` = build time | `app/sitemap.ts` |
| JSON-LD | Organization + WebSite on every page (stable `@id`s); BreadcrumbList on every inner page (via `PageHero`); FAQPage on `/` and `/faq`; an ItemList of Service on `/`. Escaped via `components/seo/json-ld.tsx`. | `lib/seo.ts` |
| Icons / manifest | `app/icon.svg`, generated `apple-icon` (180), `manifest.ts` (SVG + 180 PNG only) | |
| `X-Robots-Tag` | None sent. Security headers (CSP, HSTS and others) don't affect crawling. | `next.config.ts` |
| `llms.txt`, IndexNow | Absent (`/llms.txt` returns 404) | |

---

## 5. Crawl blockers

| Check | Result |
|---|---|
| Host / protocol | `http://` and `https://www.` both **308** to `https://sunrisetechorigin.com/`, a single hop. |
| Trailing slash | `/about/` **308**s to `/about`. The convention is no trailing slash. |
| Query parameters | `?service=…` and `?utm_*` variants return 200 and canonicalize to the clean URL. |
| Proxy / auth | `proxy.ts` only matches `/admin*`. No geo or bot redirects. |
| Edge / WAF | Live test: GPTBot, ClaudeBot, CCBot, OAI-SearchBot, ChatGPT-User, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User, Googlebot and Bingbot user agents all got **200** and identical HTML from `https://sunrisetechorigin.com/services`. No user-agent blocking. **Not verifiable from here:** Vercel Firewall "Bot protection" or "AI bots" managed rules that check verified IP ranges. Please check the Vercel dashboard (question 15). |
| Staging / preview | No app-level environment guard. Vercel normally adds `X-Robots-Tag: noindex` to preview-deployment URLs, but that isn't verified for this project, and Docker or self-hosted deployments have no guard at all. |
| Streaming metadata | Next 16 streams metadata after `<head>` for user agents outside its `htmlLimitedBots` list. That list includes Googlebot and Bingbot but **not** OAI-SearchBot, ChatGPT-User, Claude-* or PerplexityBot. No impact today, because every public page is static and has full `<head>` metadata. It will matter for any future dynamic page. |

---

## 6. Rendering test (production build, `next start`, curl per user agent)

Tested 15 public pages × 8 user agents (desktop browser, Googlebot, Bingbot, OAI-SearchBot, ChatGPT-User, Claude-SearchBot, Claude-User, PerplexityBot).

- **All 120 requests returned 200 with real content in the raw HTML.** The visible-text hash was identical across all 8 user agents on every page, so there is no cloaking or bot-specific rendering.
- No page has an empty root `<div>`. Headings, body copy, prices and links are all server-rendered.
- Not in the HTML (only rendered after a click):
  - 8 of 9 FAQ answers on `/` and 6 of 7 on `/faq`, all present in the FAQPage JSON-LD
  - 6 of 7 product-tab descriptions on `/`
  - inactive testimonials

---

## 7. Content quality

| Check | Result |
|---|---|
| H1 | Exactly one per page. **None names the service or topic.** All are slogans ("Answers before you begin.", "Help us improve."). |
| Heading order | One skip: `/faq` goes h1 → h3 (accordion triggers). Lighthouse a11y `heading-order` fails there. |
| Duplicate titles / descriptions / canonicals | None |
| Title length | 29–59 chars. Most are 29–40 and generic ("Contact · Sunrise Tech Origin"). |
| Description length | 59–150 chars. Five pages are under 100 (`/feedback` 88, `/privacy` 73, `/cookies` 69, `/terms` 59). |
| Thin content | `/faq` 142 words, `/about` 241, `/how-we-work` 251, `/web-technology` 252, `/contact` 163 (main content only) |
| Images / alt | The pages have no `<img>` tags (logos and mockups are inline SVG), so there are no missing-alt issues. The process film (`<video>`) has a poster but no captions or transcript. |
| Internal links | Every public page is linked from every other page via nav or footer. No orphans. No broken internal links (all targets 200). |
| Anchor text | "Inquire" × 17 on `/services` and the division pages (an `aria-label` is present, but crawlers weight the visible text) |
| Entity consistency | The brand is described differently in `config/site.ts` ("websites, technology solutions, digital marketing and business automation for small businesses"), the footer ("help small businesses build, manage and grow their complete digital presence"), the chatbot prompt ("a software engineering company…") and the README ("an AI automation and custom software company"). |
| Placeholders live | `data/testimonials.ts` (3 placeholder quotes), `data/stats.ts` (`statsArePlaceholders = true`), legal pages ("Template content… not legal advice", "Last updated: Pending review") |
| Currency | Site prices are in ₹, but `data/contact.ts` budget ranges (fed to the chatbot) are in US$. |

---

## 8. Performance baseline (Lighthouse 13.5, mobile emulation, simulated throttling, local `next start`)

| Page | Perf | SEO | A11y | BP | LCP | TBT | CLS | FCP | SI | JS (gz) | Total |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `/` | 71 | 100 | 100 | 100 | 5.0 s | 310 ms | 0 | 1.6 s | 5.1 s | 302 KiB | 566 KiB |
| `/services` | 75 | 100 | 100 | 100 | 4.4 s | 320 ms | 0 | 1.2 s | 4.4 s | 302 KiB | 469 KiB |
| `/web-technology` | 77 | 100 | 100 | 100 | 4.3 s | 320 ms | 0 | 1.2 s | 3.2 s | 302 KiB | 474 KiB |
| `/contact` | 81 | 100 | 100 | 100 | 4.1 s | 180 ms | 0 | 1.2 s | 4.8 s | 298 KiB | 441 KiB |
| `/about` | 85 | 100 | 100 | 100 | 4.1 s | 120 ms | 0 | 1.2 s | 2.7 s | 292 KiB | 443 KiB |
| `/faq` | 85 | 100 | 98 | 100 | 4.0 s | 140 ms | 0.058 | 1.2 s | 2.9 s | 298 KiB | 442 KiB |

INP can't be measured in the lab; TBT is the proxy. Real-user field data (CrUX) isn't available yet for a new domain.

- **LCP element is always the H1 text.** It isn't waiting on a download: render delay accounts for 1.4–2.4 s observed, and two render-blocking CSS files cost an estimated 200–310 ms.
- **The JS shared by every page is about 300 KiB gzipped.** The largest pieces:

  | Chunk | Raw size | Gzipped |
  |---|---|---|
  | `react-dom` | 224 KiB | 71 KiB |
  | A second framework chunk (contents not yet identified) | 132 KiB | 36 KiB |
  | zod | 58 KiB | 17.5 KiB |
  | A chunk containing Radix Dialog code | 54 KiB | — |
  | Radix | 47 KiB | — |

  These are identified by grepping the built chunks. Phase 6 will confirm them with a bundle analyzer.

  zod is loaded even on pages with no form, and about 25 KiB of the main chunk is unused.
- **The home HTML is 459 KiB raw (83 KiB gzipped)**, mostly inline SVG product mockups and the RSC payload. Main-thread work is 7.4 s under 4× CPU throttling.
- Baseline JSON reports are kept outside the repo (scratchpad) and will be re-run in Phase 6 and Phase 10 for the before/after table.

**Baseline checks:** `next build` passes. `tsc --noEmit` is clean. ESLint shows 0 errors and 9 warnings, all pre-existing unused imports.

---

## 9. Prioritized issues

### Critical

**C1. FAQ answers aren't in the HTML, and the FAQPage schema doesn't match the visible content**
- **Where:** `components/ui/accordion.tsx` (Radix unmounts closed panels), `components/faq/faq-section.tsx`, `app/faq/page.tsx`
- **Problem:** Only the open item's answer is server-rendered (1/9 on `/`, 1/7 on `/faq`), but the JSON-LD lists every answer.
- **Impact:** AI fetchers that don't run JavaScript (ChatGPT, Claude and Perplexity fetchers) can't read or quote most answers. The structured data claims content the page doesn't show, which is against Google's structured-data guidelines.
- **Fix:** Render every answer into the HTML. Either use native `<details>`/`<summary>` (zero JavaScript, keeps find-in-page) or Radix `forceMount` with CSS hiding. Fix the h1→h3 skip by adding an h2.

**C2. Unverified social profiles in schema and UI**
- **Where:** `config/site.ts` (`socials`), which feeds `organizationJsonLd().sameAs`, `components/ui/social-links.tsx`, the footer and the mobile menu
- **Problem:** Four links point to `@crazy.studio2026` and a Facebook share link. Your brief says no official accounts exist yet.
- **Impact:** `sameAs` tells Google and AI systems "this other entity is us". If those accounts belong to a different brand, the two identities merge.
- **Fix:** Remove them from `sameAs` and the UI until verified accounts exist. Keep WhatsApp as a contact channel, not as `sameAs`. Needs your confirmation (question 2).

**C3. Placeholder testimonials and stats are live**
- **Where:** `data/testimonials.ts`, `data/stats.ts` (shown by `components/testimonials/*` and `components/about/metrics-band.tsx` on `/`)
- **Problem:** Visitors and crawlers see "Placeholder testimonial… Client Name, Company Name", plus "50+ Projects Delivered", "10+ Industries", "99% Smooth launches" and "24/7 Monitoring" with a small disclaimer.
- **Impact:** AI assistants can quote the numbers as facts, and visible placeholder content undermines trust.
- **Fix:** Hide both sections until verified data exists. The data files already have `isPlaceholder` / `statsArePlaceholders` flags, so this is a render guard. Needs your confirmation (question 7).

### High

**H1. Incomplete sitemap with fake `lastmod`**
- **Where:** `app/sitemap.ts`
- **Problem:** It's built from `legalNav`, so it lists only 5 URLs. `lastModified = new Date()` on every build.
- **Impact:** The 9 main pages aren't submitted, and freshness signals are meaningless.
- **Fix:** Generate it from a single route registry of indexable pages, with a real `lastModified` per page.

**H2. Open Graph and Twitter tags inherited from the root on every inner page**
- **Where:** every `app/*/page.tsx` (no `openGraph` key) and `app/layout.tsx`
- **Problem:** `og:url` is `https://sunrisetechorigin.com`, and `og:title`/`og:description` are the homepage's, on all 14 inner pages.
- **Impact:** WhatsApp, LinkedIn, X and AI link previews show the homepage for every shared link, and the `og:url` mismatch weakens the canonical signal.
- **Fix:** A typed `buildMetadata()` helper in `lib/seo.ts` that sets title, description, canonical, `openGraph` (url, title, description, images) and `twitter` per page.

**H3. Root canonical leaks to pages without their own**
- **Where:** `app/layout.tsx` (`alternates: { canonical: "/" }`)
- **Problem:** `/design`, `/admin/login` and the 404 page all get `canonical = homepage`.
- **Impact:** Any future page that forgets a canonical silently points at the homepage.
- **Fix:** Remove the root canonical and make the helper require a path.

**H4. Titles, descriptions and H1s don't say what the page is about**
- **Where:** every page's `metadata` and its `PageHero` title
- **Problem:** Examples are "About Us", "Contact" and "Help & FAQs". The home title has no service or location terms, and H1s are slogans.
- **Impact:** Weak relevance for "website development company Nagpur", "AI automation services India" and similar queries, and lower click-through.
- **Fix:** Use primary-topic-first titles of 50–60 chars and descriptions of 140–160 chars, built only from facts already on the page. Keep the slogan as a styled line but make the H1 descriptive, or add the topic to it. Drafts are in Phase 2 for your review.

**H5. No pages for the core services**
- **Where:** `data/services.ts` (8 AI and software services, each linking to `/#contact`), `data/services-catalog.ts` (no AI rows)
- **Problem:** AI development, AI integration, AI workflow automation, AI agents, AI chatbots, ERP/CRM/HRMS, SaaS, mobile apps, SEO and web development exist only as one-line descriptions.
- **Impact:** Nothing can rank for, or be cited on, the target keywords. This is the biggest content gap.
- **Fix:** A service-page template (`/services/[slug]`, SSG) with an answer-first summary, use cases, deliverables, integrations, timeline, price or "custom quote", limitations, data-handling notes, an FAQ, and Service + BreadcrumbList + FAQPage schema. **Content needs your facts** (questions 5, 6 and 9).

**H6. Inconsistent brand description**
- **Where:** `config/site.ts`, `components/footer/footer.tsx`, `components/hero/hero.tsx`, `app/about/page.tsx`, `lib/server/chat/knowledge.ts`, `README.md`
- **Problem:** Four different one-line descriptions, and the chatbot calls the company "a software engineering company".
- **Impact:** Entity confusion for AI systems, because they reconcile descriptions across sources.
- **Fix:** A single source of truth in `config/site.ts` (`description`, `shortDescription`, `entityFacts`), used by metadata, schema, `llms.txt`, the footer and the chatbot. Use your brief's one-sentence description (question 10).

**H7. About page has no entity facts**
- **Where:** `app/about/page.tsx`
- **Problem:** No founder, founding year, legal entity, team or address, and no Person schema or author pages.
- **Impact:** Weak E-E-A-T and nothing concrete for "who runs Sunrise Tech Origin" answers.
- **Fix:** An entity block (who, what, for whom, where, since when, who runs it), Person schema for the founder, and `founder` on Organization. **Needs facts** (question 3).

**H8. Contact details published but not confirmed; schema logo is a favicon SVG**
- **Where:** `config/site.ts` (`contact`, `whatsapp`), `app/contact/page.tsx` (contact details in the meta description), `lib/seo.ts` (`logo: /icon.svg`)
- **Problem:**
  - The site publishes `kkumarai753@gmail.com`, `+91 87668 03990` and "Chitnis Nagar, Nagpur" on every page. Your brief lists email, phone and address as "not provided".
  - The Organization `logo` is the SVG favicon.
- **Impact:** A NAP that may not match your future Google Business Profile, a Gmail address that weakens trust, and a logo that may not be picked up.
- **Fix:** Confirm the official public NAP (question 1). Point the logo at a raster PNG (`/brand/sunrise-tech-origin-logo.png` exists; question 4). Add `address`, `areaServed`, `contactPoint` and, if eligible, `LocalBusiness`.

### Medium

**M1. Mobile performance**
- **Where:** `app/layout.tsx` (5 font families, global client providers), `components/products/*` (inline SVG mockups), shared client chunks
- **Problem:** Perf 71–85, LCP 4.0–5.0 s (render delay), TBT up to 320 ms, about 300 KiB JS gzipped per page, and 459 KiB home HTML.
- **Impact:** Core Web Vitals risk on real Indian mobile networks.
- **Fix (Phase 6):** Run a bundle analyzer. Keep zod and `motion` out of the shared chunk. Lazy-load below-the-fold showcase and testimonials. Drop the unused design-lab font families. Review render-blocking CSS. Re-measure.

**M2. Tabbed and carousel content isn't in the HTML**
- **Where:** `components/products/product-showcase.tsx`, `components/testimonials/animated-testimonials.tsx`
- **Problem:** Only the active tab or slide is rendered.
- **Impact:** Crawlers see 1 of 7 product descriptions.
- **Fix:** Render all tab labels and descriptions as text (for example a list beside the visual), and keep only the visual swap interactive.

**M3. Claims that need substantiation**
- **Where:**
  - `app/web-technology/page.tsx`: "round-the-clock technical monitoring", "guaranteed client asset ownership"
  - `app/digital-growth/page.tsx`: "optimized to deliver positive return on ad spend"
  - `data/stats.ts`: "24/7 Monitoring"
  - `app/inquiry/page.tsx` and others: "reply within 24 hours"
- **Problem:** These read as guarantees.
- **Impact:** Your own brief rules out unsubstantiated or guaranteed-result claims, and AI assistants will repeat them.
- **Fix:** Keep the ones you can stand behind and soften the rest. This is a business call (question 7).

**M4. robots.txt is minimal**
- **Where:** `app/robots.ts`
- **Problem:** No AI-agent groups, `/admin` isn't disallowed, there's a non-standard `Host:` line, and there's no environment guard.
- **Impact:** No explicit policy for AI search agents, and preview or self-hosted builds could be indexed.
- **Fix (Phase 1):** Explicit allow groups for search and user-fetch agents, a decision on training crawlers (question 11), disallow `/api/` and `/admin/`, and noindex everything outside production.

**M5. No analytics or conversion tracking**
- **Where:** `next.config.ts` (CSP is `'self'` only)
- **Problem:** No way to measure organic or AI referrals (chatgpt.com, claude.ai, perplexity.ai, gemini, copilot) or form conversions.
- **Impact:** The plan's success can't be measured.
- **Fix:** Add a privacy-friendly analytics tool, a referrer-classification event, and server-side AI-crawler logging. The tool choice is a business call (question 12).

**M6. Two separate FAQ sets that don't cover buyer questions**
- **Where:** `data/faq.ts` (9 Q, home) and `app/faq/page.tsx` (7 Q, inline)
- **Problem:** Two hard-coded lists. Neither covers the 25 buyer questions in your brief, and `/faq` has 142 words.
- **Impact:** A thin FAQ hub that gets few citations.
- **Fix:** One FAQ data source, grouped by topic and server-rendered, with answers filled only from your facts.

**M7. Design lab live in production**
- **Where:** `app/design/page.tsx`
- **Problem:** `/design` returns 200 in production. It's noindex, but it's a public internal tool.
- **Fix:** Set `NEXT_PUBLIC_DESIGN_LAB=off` in Vercel production, or 404 it outside development (question 14).

**M8. `/cart` uses a temporary redirect**
- **Where:** `app/cart/page.tsx`
- **Problem:** `redirect()` sends a 307, signalling that `/cart` will come back.
- **Fix:** A permanent 308 via `next.config.ts` `redirects()`, and delete the page (question 14).

**M9. Legal pages are visibly unfinished**
- **Where:** `app/privacy`, `app/terms`, `app/cookies`, `components/legal/legal-page.tsx`
- **Problem:** A "Template content… not legal advice" banner and "Last updated: Pending review".
- **Impact:** A trust signal (E-E-A-T) that undercuts the AI data-privacy messaging.
- **Fix:** TODO(owner): legal review, then remove the banner and set real dates.

**M10. Budget currency mismatch**
- **Where:** `data/contact.ts`
- **Problem:** Budget options are in US$ while all prices are in ₹, and the chatbot quotes them.
- **Fix:** Use ₹ ranges, or remove them. Needs your ranges (question 6).

**M11. Service and Offer schema doesn't reflect real pages**
- **Where:** `lib/seo.ts` (`servicesJsonLd`), `app/services/page.tsx`
- **Problem:** The home ItemList points every Service at `/#services`. `/services` shows real ₹ prices but has no Service or Offer markup, and there's no LocalBusiness.
- **Fix:** Service + Offer (INR, only the prices already shown) on the catalog and the new service pages, linked to `#organization`. LocalBusiness only once the NAP is confirmed.

### Low

**L1. Title separator**
- **Where:** `app/layout.tsx`
- **Problem:** The template uses `·`; your spec asks for `%s | Sunrise Tech Origin`.
- **Fix:** Switch to `|`.

**L2. Weak anchor text**
- **Where:** `components/services/services-catalog-client.tsx`
- **Problem:** "Inquire" appears 17 times per catalog page.
- **Fix:** Use visible text such as "Ask about {service}", or a visually hidden suffix.

**L3. Manifest icons**
- **Where:** `app/manifest.ts`
- **Problem:** No 192 or 512 PNG icons and no maskable icon.
- **Fix:** Add generated `icon` sizes.

**L4. Process film**
- **Where:** `components/process/process-film.tsx`
- **Problem:** No captions or transcript, and no VideoObject.
- **Fix:** Add a short visible transcript and `<track>`, plus VideoObject schema.

**L5. Thin form pages are indexable**
- **Where:** `app/register`, `app/feedback`
- **Problem:** Both are indexable, and `/feedback` is the only non-legal page in the sitemap.
- **Fix:** `noindex, follow` and remove them from the sitemap (question 14). `/inquiry` stays indexable.

**L6. Streaming-metadata bot list**
- **Where:** `next.config.ts`
- **Problem:** AI fetchers aren't in `htmlLimitedBots`.
- **Fix:** Add them now, as future-proofing for dynamic pages.

**L7. No `llms.txt` and no IndexNow**
- **Fix:** Phases 3 and 7.

**L8. `keywords` meta**
- **Where:** `app/layout.tsx`
- **Problem:** Google ignores it. It's harmless.
- **Fix:** Keep it short and accurate, or drop it.

**L9. Lint warnings**
- **Where:** `components/*-form-client.tsx`, `config/site.ts`
- **Problem:** 9 pre-existing unused-import warnings.
- **Fix:** Clean up the files that get touched anyway.

**L10. No Hindi version**
- **Problem:** Hindi is an intended language, but no i18n exists.
- **Fix:** Defer until the English pages are final and verified Hindi copy exists (question 13).

### What's already right (keep it)

- Static prerendering everywhere, and identical HTML for every bot
- A single host and protocol, with 308 redirects, a trailing-slash 308, and real 404s
- A self canonical on every public page, and query strings that canonicalize
- Organization and WebSite schema with stable `@id`s, and BreadcrumbList on inner pages
- Escaped JSON-LD
- `next/font` with `display: swap`
- Admin noindex plus the auth proxy
- Semantic landmarks (`header`, `nav`, `main`, `footer`) and a skip link
- CLS ≈ 0, and Lighthouse SEO 100 / A11y 98–100

---

## 10. Implementation plan (after your approval)

All work happens on branch `seo/technical-seo-and-ai-visibility` in small commits. Build, lint and typecheck run after every phase. ✅ means it can start now; ⏳ means it needs answers from section 11.

| Phase | Work | Blocked on |
|---|---|---|
| 1. Crawl and index | ✅ `robots.ts` with explicit AI search and user agents, `/admin` and `/api` disallowed, env guard (noindex outside production via `VERCEL_ENV` / `SITE_ENV`). Remove the root canonical. 308 for `/cart`. `htmlLimitedBots`. FAQ, tabs and testimonials fully in HTML (C1, M2). | Q11 (training bots), Q14 |
| 2. Metadata | ✅ `lib/seo.ts` `buildMetadata()` used by every page (title, description, canonical, OG, Twitter). `\|` template. Per-page OG images. Manifest icons. ⏳ Final title and description copy reviewed by you. | Q10 |
| 3. Sitemap and indexing | ✅ Route registry → `sitemap.ts` with real `lastModified`. IndexNow key, route and ping script. GSC and Bing steps documented. | none |
| 4. Structured data | ✅ Typed `<JsonLd>` (schema-dts), connected `@id` graph, Service/Offer for shown prices, FAQPage only where visible. ⏳ `sameAs`, logo, founder Person, LocalBusiness. | Q1–Q4 |
| 5. On-page | ✅ Descriptive H1s and heading order, anchor text, related links, hub and cluster linking. ⏳ New service pages. | Q5, Q6, Q8, Q9 |
| 6. Performance | ✅ Bundle analysis, chunk splitting, lazy below-the-fold islands, fonts, CSS. Before/after Lighthouse. | none |
| 7. AI visibility | ✅ Answer-first components, `/llms.txt` and `/llms-full.txt` from config, AI-crawler logging in `proxy.ts` (never alters responses), "Last updated" component. ⏳ Content for About, FAQ hub, pricing and glossary. Analytics. | Q3, Q5, Q6, Q12 |
| 8. Content plan | ✅ `SEO-CONTENT-PLAN.md`: clusters, rewrites, 20 prioritized pages, refresh schedule. Documentation only, no invented facts. | none |
| 9–10. Off-site, verify, report | ✅ Checklist, re-run curl, Lighthouse and the duplicate check, `SEO-REPORT.md` | none |

Anything that needs a fact I don't have gets a visible `TODO(owner): …` in code. Nothing user-facing is invented: no placeholder copy, prices, stats or names.

---

## 11. Open questions (owner input needed)

The same list is in the chat reply. Answers will be recorded here.

**Business facts**

1. **Contact (NAP):**
   - Are `kkumarai753@gmail.com`, `+91 87668 03990` (call and WhatsApp), "Chitnis Nagar, Nagpur" and "Mon–Sat 9:00–19:00 IST" the official public details?
   - What is the full street address and PIN?
   - Do clients visit the office? This decides LocalBusiness vs service-area only.
   - Is a domain email such as `hello@sunrisetechorigin.com` planned?
2. **Social links:** Who owns the `crazy.studio2026` Instagram, YouTube, Threads and Facebook accounts? Recommended: remove them from the site and schema until official Sunrise Tech Origin accounts exist.
3. **Founder and company:**
   - Founder's public name and title (the brief says "Rajendra MK", unconfirmed)
   - A 2–4 sentence bio, LinkedIn URL and photo (optional)
   - Founding year
   - Registered entity name and type (proprietorship, LLP or Pvt Ltd)
   - Whether a GSTIN or registration number should be shown
4. **Logo:** Confirm `https://sunrisetechorigin.com/brand/sunrise-tech-origin-logo.png` as the official logo for schema.
5. **Which services are live today?** For each one to get a page (AI development, AI integration, AI workflow automation, AI agents, AI chatbots, WhatsApp automation, ERP, CRM, HRMS, SaaS, mobile apps, website development, SEO, ads, social, branding, video, lead funnels, domain and hosting reselling), give a yes/no, plus where available:
   - Deliverables
   - Typical timeline
   - Tools and platforms you actually use (for example which AI providers)
   - Real projects or case studies you can publish
6. **Prices:**
   - Are the current catalog prices current?
   - Starting prices for AI services, or "custom quote"?
   - Indian ₹ budget ranges for the form and chatbot
7. **Placeholders and claims:**
   - OK to hide the placeholder testimonials and stats until real ones exist?
   - Which claims can you stand behind: "reply within 24 hours", "24/7 / round-the-clock monitoring", "guaranteed client asset ownership", "positive ROAS"?
8. **Service area:** "Clients across India, remote" now? International: say "available on request", or leave it out?
9. **Data and AI practice:** For the AI pages, what's your real practice on:
   - Data storage and processing location
   - Third-party AI providers used
   - NDAs
   - Code and IP ownership at handover
   - Human review of AI outputs
   - Maintenance terms
10. **Canonical description:** Adopt your brief's one sentence as the official brand description everywhere (meta, schema, `llms.txt`, footer, chatbot)?

**Policy and technical decisions**

11. **AI training crawlers** (GPTBot, ClaudeBot, Google-Extended, CCBot, Applebot-Extended): allow or block? Blocking doesn't remove you from AI search answers. Recommended: **allow**, because for a new brand being in models' training data helps name recognition.
12. **Analytics:** Vercel Web Analytics (cookieless, no banner, simplest), GA4 (needs a consent banner and CSP changes), or Plausible or Umami? Recommended: **Vercel Web Analytics** plus server-side AI-crawler logs.
13. **Hindi:** Build Hindi pages now (you'd supply or approve the translations), or defer until the English content is final? Recommended: **defer**.
14. **Small URL decisions:**
    - Make `/register` and `/feedback` `noindex, follow`?
    - Hide `/design` in production?
    - Make `/cart` a permanent 308 to `/services`?
    - Use `/services/<slug>` for new service pages (for example `/services/ai-automation`), keeping `/web-technology` and `/digital-growth` as hub pages?

    Recommended: yes to all four.
15. **Vercel Firewall:** In Vercel → Project → Firewall, is "Bot Protection" or the "AI Bots" managed ruleset enabled? If it is, it would block verified AI crawlers that a user-agent test can't detect.
16. **Comparison and blog content:** Name any real competitors you're comfortable comparing against (honest, factual pages), or skip "vs" pages for now. Do you want a blog (MDX in the repo), and who is the named author?

---

## Appendix: method

- Read every file in `frontend/app`, `config`, `data`, `lib` and the shared and section components, plus the Next.js 16.3 docs in `node_modules/next/dist/docs`.
- `next build` with `NEXT_PUBLIC_SITE_URL=https://sunrisetechorigin.com`, then `next start`, then a Node crawler. The crawler fetched each page per user agent and compared visible-text hashes. It also extracted title, description, canonical, OG, headings, JSON-LD types, images and links, and checked every internal link target's status.
- Live checks with `curl` against `https://sunrisetechorigin.com`: redirects, `robots.txt`, `sitemap.xml`, headers, and per-bot responses.
- Lighthouse 13.5.0 (mobile, simulated throttling, headless Chrome) on 6 pages.
